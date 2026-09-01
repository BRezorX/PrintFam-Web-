import JSZip from 'jszip';

export interface SlidePreviewData {
  slideNumber: number;
  title: string;
  texts: string[];
  imageUrl?: string;
  bgColor?: string;
}

export interface DocumentPreviewData {
  pageNumber: number;
  heading?: string;
  lines: string[];
  imageUrl?: string;
}

/**
 * Extracts visual slide previews from a PowerPoint (.pptx) file client-side.
 */
export async function extractPptxPreviews(file: File): Promise<SlidePreviewData[]> {
  const previews: SlidePreviewData[] = [];

  try {
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(file);

    // Find all slide XML files sorted by slide number
    const slideKeys = Object.keys(loadedZip.files)
      .filter(path => /^ppt\/slides\/slide\d+\.xml$/i.test(path))
      .sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
        const numB = parseInt(b.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
        return numA - numB;
      });

    // Check for global presentation thumbnail (docProps/thumbnail.jpeg)
    let globalThumbUrl: string | undefined;
    const thumbFiles = Object.keys(loadedZip.files).filter(k => /^docProps\/thumbnail\.(jpe?g|png)$/i.test(k));
    if (thumbFiles.length > 0) {
      const thumbFile = loadedZip.file(thumbFiles[0]);
      if (thumbFile) {
        const blob = await thumbFile.async('blob');
        globalThumbUrl = URL.createObjectURL(blob);
      }
    }

    for (let i = 0; i < slideKeys.length; i++) {
      const slideKey = slideKeys[i];
      const slideNum = i + 1;
      const slideXmlFile = loadedZip.file(slideKey);
      if (!slideXmlFile) continue;

      const xmlText = await slideXmlFile.async('text');

      // Extract all text chunks from <a:t> tags
      const textMatches = Array.from(xmlText.matchAll(/<a:t[^>]*>(.*?)<\/a:t>/gi)).map(m => m[1].trim()).filter(Boolean);

      const title = textMatches[0] || `Slide ${slideNum}`;
      const texts = textMatches.slice(1, 5); // Up to 4 body lines

      // Try finding background color
      let bgColor = '#f8fafc';
      const colorMatch = xmlText.match(/<a:srgbClr val="([0-9a-fA-F]{6})"/i);
      if (colorMatch && colorMatch[1]) {
        bgColor = `#${colorMatch[1]}`;
      }

      // Check for slide-specific image via relationship XML
      let slideImgUrl: string | undefined;
      if (slideNum === 1 && globalThumbUrl) {
        slideImgUrl = globalThumbUrl;
      } else {
        const relsKey = `ppt/slides/_rels/slide${slideNum}.xml.rels`;
        const relsFile = loadedZip.file(relsKey);
        if (relsFile) {
          const relsText = await relsFile.async('text');
          const mediaMatch = relsText.match(/Target="\.\.\/media\/([^"]+)"/i);
          if (mediaMatch && mediaMatch[1]) {
            const mediaFile = loadedZip.file(`ppt/media/${mediaMatch[1]}`);
            if (mediaFile) {
              const imgBlob = await mediaFile.async('blob');
              slideImgUrl = URL.createObjectURL(imgBlob);
            }
          }
        }
      }

      previews.push({
        slideNumber: slideNum,
        title,
        texts,
        imageUrl: slideImgUrl,
        bgColor
      });
    }
  } catch (err) {
    console.warn("officePreview: Could not extract PPTX thumbnails", err);
  }

  return previews;
}

/**
 * Extracts visual page previews from a Word (.docx) file client-side.
 */
export async function extractDocxPreviews(file: File, totalPages: number = 1): Promise<DocumentPreviewData[]> {
  const previews: DocumentPreviewData[] = [];

  try {
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(file);

    let globalThumbUrl: string | undefined;
    const thumbFiles = Object.keys(loadedZip.files).filter(k => /^docProps\/thumbnail\.(jpe?g|png)$/i.test(k));
    if (thumbFiles.length > 0) {
      const thumbFile = loadedZip.file(thumbFiles[0]);
      if (thumbFile) {
        const blob = await thumbFile.async('blob');
        globalThumbUrl = URL.createObjectURL(blob);
      }
    }

    const docFile = loadedZip.file('word/document.xml');
    let paragraphs: string[] = [];

    if (docFile) {
      const xmlText = await docFile.async('text');
      const pMatches = Array.from(xmlText.matchAll(/<w:p[^>]*>(.*?)<\/w:p>/gi));
      for (const p of pMatches) {
        const tMatches = Array.from(p[1].matchAll(/<w:t[^>]*>(.*?)<\/w:t>/gi)).map(m => m[1].trim()).filter(Boolean);
        const pText = tMatches.join(' ');
        if (pText) paragraphs.push(pText);
      }
    }

    const count = Math.max(1, totalPages);
    const parasPerPage = Math.max(1, Math.ceil(paragraphs.length / count));

    for (let i = 0; i < count; i++) {
      const pageNum = i + 1;
      const pageParas = paragraphs.slice(i * parasPerPage, (i + 1) * parasPerPage);
      const heading = pageParas[0] || `Page ${pageNum}`;
      const lines = pageParas.slice(1, 5);

      previews.push({
        pageNumber: pageNum,
        heading,
        lines,
        imageUrl: pageNum === 1 ? globalThumbUrl : undefined
      });
    }
  } catch (err) {
    console.warn("officePreview: Could not extract DOCX previews", err);
  }

  return previews;
}
