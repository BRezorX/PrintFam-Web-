import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Layers, CheckSquare, Square, RefreshCcw, AlertTriangle, FileText, Presentation } from 'lucide-react';
import { extractPptxPreviews, extractDocxPreviews } from '../utils/officePreview';

export default function PdfPreviewer({ file, totalPages = 1, selectedPages, onSelectionChange }) {
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(totalPages || 1);
  const [rangeInput, setRangeInput] = useState('');
  const [rangeError, setRangeError] = useState('');
  const [loading, setLoading] = useState(true);
  const [officePreviews, setOfficePreviews] = useState([]);

  const isPdf = file?.name?.toLowerCase().endsWith('.pdf') || file?.type === 'application/pdf';
  const isPpt = file?.name?.toLowerCase().endsWith('.pptx') || file?.name?.toLowerCase().endsWith('.ppt');
  const isWord = file?.name?.toLowerCase().endsWith('.docx') || file?.name?.toLowerCase().endsWith('.doc');

  // Check if PDF.js is already loaded in the window on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.pdfjsLib) {
      setPdfjsLoaded(true);
    }
  }, []);

  // Initialize PDF.js once the script is loaded (for PDF files) or setup Office docs
  useEffect(() => {
    if (!file) return;

    if (!isPdf) {
      let isCancelled = false;
      const count = totalPages || file.totalPages || 1;
      setNumPages(count);

      const loadOffice = async () => {
        try {
          setLoading(true);
          let previews = [];
          if (isPpt) {
            previews = await extractPptxPreviews(file);
          } else if (isWord) {
            previews = await extractDocxPreviews(file, count);
          }
          if (isCancelled) return;
          if (previews.length > 0) {
            setOfficePreviews(previews);
            setNumPages(previews.length);
          }
        } catch (e) {
          console.warn("Could not extract Office preview details", e);
        } finally {
          if (!isCancelled) setLoading(false);
        }
      };

      loadOffice();

      if (selectedPages && selectedPages.length > 0) {
        setRangeInput(formatPageRange(selectedPages));
      } else {
        const allPages = Array.from({ length: count }, (_, i) => i + 1);
        onSelectionChange(allPages);
        setRangeInput(formatPageRange(allPages));
      }
      return () => {
        isCancelled = true;
      };
    }

    if (!pdfjsLoaded) return;

    let isCancelled = false;
    const loadPdf = async () => {
      try {
        setLoading(true);
        const pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const reader = new FileReader();
        reader.onload = async function () {
          try {
            const arrayBuffer = this.result;
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const doc = await loadingTask.promise;
            
            if (isCancelled) return;
            setPdfDoc(doc);
            setNumPages(doc.numPages);
            setLoading(false);

            if (selectedPages && selectedPages.length > 0) {
              setRangeInput(formatPageRange(selectedPages));
            } else {
              const allPages = Array.from({ length: doc.numPages }, (_, i) => i + 1);
              onSelectionChange(allPages);
              setRangeInput(formatPageRange(allPages));
            }
          } catch (err) {
            console.error("Error parsing PDF document data", err);
            setRangeError("Could not render document previews.");
            setLoading(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (err) {
        console.error("Error initializing PDF.js reader", err);
        setRangeError("Failed to initialize document reader.");
        setLoading(false);
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfjsLoaded, file, isPdf, isPpt, isWord, totalPages]);

  // Synchronize rangeInput text box whenever visual selectedPages array changes
  useEffect(() => {
    if (numPages > 0 && selectedPages) {
      const formatted = formatPageRange(selectedPages);
      if (formatted !== rangeInput) {
        setRangeInput(formatted);
        setRangeError('');
      }
    }
  }, [selectedPages, numPages]);

  // Visual helper utilities
  const handleSelectAll = () => {
    const allPages = Array.from({ length: numPages }, (_, i) => i + 1);
    onSelectionChange(allPages);
    setRangeError('');
  };

  const handleClearAll = () => {
    onSelectionChange([]);
    setRangeError('');
  };

  const togglePageSelection = (pageNum) => {
    let newSelection;
    if (selectedPages.includes(pageNum)) {
      newSelection = selectedPages.filter(p => p !== pageNum);
    } else {
      newSelection = [...selectedPages, pageNum].sort((a, b) => a - b);
    }
    onSelectionChange(newSelection);
  };

  // Parsing page ranges
  const handleRangeInputChange = (e) => {
    const value = e.target.value;
    setRangeInput(value);
    
    if (!value.trim()) {
      onSelectionChange([]);
      setRangeError('');
      return;
    }

    const parsed = parsePageRange(value, numPages);
    if (parsed !== null) {
      onSelectionChange(parsed);
      setRangeError('');
    } else {
      setRangeError(`Invalid range. Input pages between 1 and ${numPages} (e.g. 1-3, 5).`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dynamic script loading for PDF.js CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        onLoad={() => setPdfjsLoaded(true)}
        strategy="afterInteractive"
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="text-xs text-gray-500 font-bold">Generating page previews...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header Controls */}
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-gray-700 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Document Pages</span>
            </span>
            <span className="font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-[11px]">
              {selectedPages?.length || 0} of {numPages} selected
            </span>
          </div>

          {/* Quick Page Range Manual Text Input */}
          <div className="space-y-1">
            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Page Range Select
            </label>
            <input
              type="text"
              value={rangeInput}
              onChange={handleRangeInputChange}
              placeholder="e.g. 1-5, 8, 11-13"
              className={`w-full text-xs font-extrabold p-2.5 rounded-xl border transition focus:outline-none ${
                rangeError 
                  ? 'border-red-400 bg-red-50/20 text-red-700' 
                  : 'border-gray-200 focus:border-blue-500 bg-white text-gray-800'
              }`}
            />
            {rangeError ? (
              <p className="text-[10px] text-red-500 font-bold flex items-center space-x-1 mt-1">
                <AlertTriangle className="w-3 h-3" />
                <span>{rangeError}</span>
              </p>
            ) : (
              <p className="text-[10px] text-gray-400 font-medium mt-1">Specify page numbers separated by commas or ranges with dashes.</p>
            )}
          </div>

          {/* Quick Action Toggle Buttons */}
          <div className="flex space-x-2 mb-4 border-b border-gray-100 pb-3">
            <button
              onClick={handleSelectAll}
              className="flex-1 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 rounded-lg text-xs font-bold py-1.5 text-gray-600 transition flex justify-center items-center"
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="flex-1 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 rounded-lg text-xs font-bold py-1.5 text-gray-600 transition flex justify-center items-center"
            >
              Clear All
            </button>
          </div>

          {/* Thumbnail Canvas Grid */}
          <div className="grid grid-cols-2 gap-3 max-h-[260px] overflow-y-auto custom-scrollbar p-1 bg-gray-50 rounded-2xl border border-gray-100">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => {
              const isSelected = selectedPages.includes(pageNum);
              return (
                <div
                  key={pageNum}
                  onClick={() => togglePageSelection(pageNum)}
                  className={`border-2 rounded-2xl p-2 cursor-pointer transition relative flex flex-col items-center bg-white ${
                    isSelected 
                      ? 'border-blue-600 ring-2 ring-blue-50 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Select Icon Checkbox */}
                  <div className="absolute top-2 right-2 z-10">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600 fill-white" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-300 fill-white" />
                    )}
                  </div>
                  
                  {/* Visual Canvas Page rendering or Office Document Badge */}
                  <div className={`w-full ${isPpt ? 'aspect-[16/10]' : 'aspect-[3/4]'} flex items-center justify-center overflow-hidden mb-1.5 rounded-xl border border-gray-100 bg-white shadow-xs relative`}>
                    {pdfDoc ? (
                      <PdfPageThumbnail pdfDoc={pdfDoc} pageNum={pageNum} />
                    ) : (() => {
                      const prev = officePreviews.find(p => (p.slideNumber || p.pageNumber) === pageNum);
                      if (prev?.imageUrl) {
                        return (
                          <img
                            src={prev.imageUrl}
                            alt={`Preview ${pageNum}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        );
                      }
                      if (isPpt) {
                        return (
                          <div
                            className="w-full h-full p-2.5 flex flex-col justify-between text-left select-none overflow-hidden transition"
                            style={{ backgroundColor: prev?.bgColor || '#f8fafc' }}
                          >
                            <div className="space-y-1">
                              <span className="inline-block px-1.5 py-0.5 bg-blue-100/80 text-blue-700 text-[8px] font-black rounded tracking-wider uppercase">
                                Slide {pageNum}
                              </span>
                              <h5 className="font-extrabold text-[11px] leading-tight text-gray-800 line-clamp-2">
                                {prev?.title || `Slide ${pageNum}`}
                              </h5>
                            </div>
                            <div className="space-y-0.5">
                              {prev?.texts?.slice(0, 2).map((t, idx) => (
                                <p key={idx} className="text-[8.5px] text-gray-500 leading-snug truncate">
                                  • {t}
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div className="w-full h-full p-2.5 flex flex-col justify-between bg-white text-left select-none overflow-hidden border border-gray-50">
                          <div className="space-y-1">
                            <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-bold rounded">
                              Page {pageNum}
                            </span>
                            <h5 className="font-extrabold text-[10px] text-gray-800 line-clamp-2">
                              {prev?.heading || `Document Page ${pageNum}`}
                            </h5>
                          </div>
                          <div className="space-y-1">
                            <div className="h-1.5 bg-gray-200 rounded w-full opacity-60"></div>
                            <div className="h-1.5 bg-gray-200 rounded w-4/5 opacity-60"></div>
                            <div className="h-1.5 bg-gray-200 rounded w-2/3 opacity-60"></div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <span className="text-[10px] font-bold text-gray-500">
                    {isPpt ? `Slide ${pageNum}` : `Page ${pageNum}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Inner Component for rendering canvas thumbnails
function PdfPageThumbnail({ pdfDoc, pageNum }) {
  const canvasRef = useRef(null);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isCancelled = false;
    
    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale: 0.25 }); // low scale thumbnail
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        if (!isCancelled) {
          console.error("PdfPageThumbnail rendering error:", err);
          setRenderError(true);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, pageNum]);

  if (renderError) {
    return <div className="text-[9px] text-gray-400 font-bold">Preview N/A</div>;
  }

  return (
    <canvas ref={canvasRef} className="max-w-full max-h-full shadow-sm rounded border border-gray-100" />
  );
}

// Range parsing logic
function parsePageRange(rangeStr, maxPages) {
  const pages = new Set();
  const cleanStr = rangeStr.replace(/\s+/g, '');
  if (!cleanStr) return [];
  
  const parts = cleanStr.split(',');
  
  for (const part of parts) {
    if (!part) continue;
    if (part.includes('-')) {
      const bounds = part.split('-');
      if (bounds.length !== 2) return null;
      const start = parseInt(bounds[0]);
      const end = parseInt(bounds[1]);
      if (isNaN(start) || isNaN(end) || start < 1 || end < start || end > maxPages) {
        return null;
      }
      for (let i = start; i <= end; i++) {
        pages.add(i);
      }
    } else {
      const val = parseInt(part);
      if (isNaN(val) || val < 1 || val > maxPages) {
        return null;
      }
      pages.add(val);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

// Range formatting helper (e.g. converts [1,2,3,5] to "1-3, 5")
function formatPageRange(pages) {
  if (!pages || pages.length === 0) return '';
  const sorted = [...pages].sort((a, b) => a - b);
  const ranges = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = sorted[i];
      end = sorted[i];
    }
  }
  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(', ');
}
