'use client';
import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Smartphone, 
  Printer, 
  QrCode, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Send
} from 'lucide-react';

interface CustomerSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobSubmitted?: (fileName: string, pageCount: number, price: number) => void;
}

export const CustomerSimulatorModal: React.FC<CustomerSimulatorModalProps> = ({
  isOpen,
  onClose,
  onJobSubmitted,
}) => {
  const [selectedFile, setSelectedFile] = useState<string>('Assignment_Module4_Final.pdf');
  const [pageCount, setPageCount] = useState<number>(8);
  const [colorMode, setColorMode] = useState<'B&W' | 'Color'>('B&W');
  const [duplex, setDuplex] = useState<boolean>(true);
  const [copies, setCopies] = useState<number>(1);
  const [paperType, setPaperType] = useState<'Normal A4' | 'Glossy Photo'>('Normal A4');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Price calculations
  const perPageRate = colorMode === 'Color' ? 10 : 2;
  const paperExtra = paperType === 'Glossy Photo' ? 5 : 0;
  const duplexDiscount = duplex ? 0.85 : 1.0;
  const calculatedTotal = Math.round(
    pageCount * (perPageRate + paperExtra) * duplexDiscount * copies
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onJobSubmitted) {
        onJobSubmitted(selectedFile, pageCount, calculatedTotal);
      }
    }, 1200);
  };

  const handleReset = () => {
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0A1128] text-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-blue-300 uppercase tracking-wider">
                Customer Mobile Preview
              </div>
              <div className="text-sm font-bold">Rajesh Xerox & Print Hub</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Browser Simulation Notice */}
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between text-[11px] text-blue-700">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Zero App Download: Opens directly in Chrome/Safari
          </span>
          <span className="font-bold">SSL 256-bit</span>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* File Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Choose Document to Print
                </label>
                <div className="p-3 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors flex flex-col items-center justify-center text-center cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">{selectedFile}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">8 pages • PDF format • 2.4 MB</span>
                </div>

                {/* Preset sample quick-switch */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400">Sample files:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile('College_Assignment_Final.pdf');
                      setPageCount(12);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    Assignment (12p)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile('Govt_Aadhaar_Card.pdf');
                      setPageCount(1);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    ID Card (1p)
                  </button>
                </div>
              </div>

              {/* Color Mode Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Color Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setColorMode('B&W')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                      colorMode === 'B&W'
                        ? 'border-blue-600 bg-blue-50/60 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>Black & White</span>
                    <span className="text-[10px] font-mono text-slate-400">₹2/page</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setColorMode('Color')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                      colorMode === 'Color'
                        ? 'border-pink-600 bg-pink-50/60 text-pink-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>Full Color</span>
                    <span className="text-[10px] font-mono text-slate-400">₹10/page</span>
                  </button>
                </div>
              </div>

              {/* Sided & Copies */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sides
                  </label>
                  <select
                    value={duplex ? 'duplex' : 'single'}
                    onChange={(e) => setDuplex(e.target.value === 'duplex')}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="duplex">Both Sides (Duplex)</option>
                    <option value="single">Single Sided</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Copies
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setCopies(Math.max(1, copies - 1))}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-xs text-slate-800">
                      {copies}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCopies(copies + 1)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                    Total Estimated Amount
                  </div>
                  <div className="text-[10px] text-emerald-600">
                    {pageCount} pages × {copies} copy • {colorMode}
                  </div>
                </div>
                <div className="text-xl font-black text-emerald-700">
                  ₹{calculatedTotal}.00
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading into Shop Queue...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send to Shop Queue (₹{calculatedTotal}.00)</span>
                  </>
                )}
              </button>

            </form>
          ) : (
            /* Success Confirmation State */
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-[#0A1128] mb-1">
                  Job Sent into Shop Queue!
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Token #{Math.floor(100 + Math.random() * 900)}. Your print job is now awaiting shopkeeper 1-click approval on their PC.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">File Name:</span>
                  <span className="font-bold text-slate-800">{selectedFile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Specs:</span>
                  <span className="font-medium text-slate-700">{pageCount} pgs • {colorMode} • {copies} copy</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1">
                  <span className="text-slate-500 font-bold">Total Bill:</span>
                  <span className="font-extrabold text-emerald-600">₹{calculatedTotal}.00</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Submit Another Job
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-[#0A1128] text-white text-xs font-bold hover:bg-slate-800"
                >
                  Close Preview
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footnote */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>This is the zero-friction experience your customers get</span>
          <span className="text-blue-600 font-bold">⚡ PrintBolt</span>
        </div>
      </div>
    </div>
  );
};

