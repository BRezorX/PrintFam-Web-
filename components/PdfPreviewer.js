import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Layers, CheckSquare, Square, RefreshCcw, AlertTriangle } from 'lucide-react';

export default function PdfPreviewer({ file, selectedPages, onSelectionChange }) {
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [rangeInput, setRangeInput] = useState('');
  const [rangeError, setRangeError] = useState('');
  const [loading, setLoading] = useState(true);

  // Initialize PDF.js once the script is loaded
  useEffect(() => {
    if (!pdfjsLoaded || !file) return;

    let isCancelled = false;
    const loadPdf = async () => {
      try {
        setLoading(true);
        const pdfjsLib = window.pdfjsLib;
        // Point to cdn worker
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

            // Default: Select all pages
            const allPages = Array.from({ length: doc.numPages }, (_, i) => i + 1);
            onSelectionChange(allPages);
            setRangeInput(formatPageRange(allPages));
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
  }, [pdfjsLoaded, file]);

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
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      {/* Dynamic script loading for PDF.js CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        onLoad={() => setPdfjsLoaded(true)}
        strategy="afterInteractive"
      />

      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-1.5 text-gray-700">
          <Layers className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-sm uppercase tracking-wide">Document Pages</h3>
        </div>
        {numPages > 0 && (
          <span className="text-xs font-bold text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
            {selectedPages.length} of {numPages} selected
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs text-gray-400 font-semibold">Reading document structure...</span>
        </div>
      ) : (
        <div>
          {/* Manual Range Input Box */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Page Range Select</label>
            <input
              type="text"
              value={rangeInput}
              onChange={handleRangeInputChange}
              placeholder="e.g. 1-5, 8, 10-12"
              className={`w-full text-sm font-semibold border rounded-xl px-3 py-2 outline-none transition focus:ring-2 ${
                rangeError 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {rangeError ? (
              <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" /> {rangeError}
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
          <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto custom-scrollbar p-1 bg-gray-50 rounded-xl border border-gray-100">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => {
              const isSelected = selectedPages.includes(pageNum);
              return (
                <div
                  key={pageNum}
                  onClick={() => togglePageSelection(pageNum)}
                  className={`border-2 rounded-xl p-2 cursor-pointer transition relative flex flex-col items-center bg-white ${
                    isSelected 
                      ? 'border-blue-600 ring-2 ring-blue-50/50 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Select Icon Checkbox */}
                  <div className="absolute top-1.5 right-1.5 z-10">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600 fill-white" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-300 fill-white" />
                    )}
                  </div>
                  
                  {/* Visual Canvas Page rendering */}
                  <div className="w-full aspect-[3/4] flex items-center justify-center overflow-hidden mb-1">
                    <PdfPageThumbnail pdfDoc={pdfDoc} pageNum={pageNum} />
                  </div>
                  
                  <span className="text-[10px] font-bold text-gray-500">Page {pageNum}</span>
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
