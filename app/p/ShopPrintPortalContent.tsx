'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import AppShell from '../../components/AppShell';
import FileUploader from '../../components/FileUploader';
import PdfPreviewer from '../../components/PdfPreviewer';
import PaymentPanel from '../../components/PaymentPanel';
import { getShopDetails, createPrintJob } from '../../services/api';
import { ArrowLeft, ArrowRight, FileText, AlertTriangle, Trash2, Sliders, CheckCircle, Plus } from 'lucide-react';

interface UploadedFileEntry {
  id: string;
  fileObject: File;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  totalPages: number;
  selectedPages: number[];
  printOptions: {
    paperSize: string;
    colorMode: string;
    orientation: string;
    duplex: boolean;
    copies: number;
  };
}

export default function ShopPrintPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get('shopId') || searchParams.get('shopid');

  // Shop details state
  const [shopSettings, setShopSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Script loaded state for PDF.js page parser
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);

  // Flow State
  // Step 1: Upload & Configure list, Step 2: Pay & Checkout
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileEntry[]>([]);
  const [activePreviewIdx, setActivePreviewIdx] = useState<number | null>(null);

  // Fetch shop settings on mount
  useEffect(() => {
    if (!shopId) {
      setError("No Shop ID provided in the URL. Please scan the QR code again.");
      setLoading(false);
      return;
    }

    const fetchShopInfo = async () => {
      try {
        setLoading(true);
        const data = await getShopDetails(shopId);
        if (data) {
          setShopSettings(data);
          sessionStorage.setItem('current_shop_id', data.user_id);
          sessionStorage.setItem('current_shop_name', data.shop_name);
          sessionStorage.setItem('current_shop_settings', JSON.stringify(data));
        } else {
          setError("Shop details could not be found. Please check the QR code.");
        }
      } catch (err) {
        console.error(err);
        setError("Error connecting to printing shop. Check your network.");
      } finally {
        setLoading(false);
      }
    };

    fetchShopInfo();
  }, [shopId]);

  // Prompt protection if files are uploaded
  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      if (uploadedFiles.length > 0) {
        e.preventDefault();
        e.returnValue = 'Your print files have not been submitted yet. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [uploadedFiles]);

  // Parse PDF Page Count Client-Side using PDF.js
  const getPdfPageCount = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function () {
        try {
          const pdfjsLib = (window as any).pdfjsLib;
          if (!pdfjsLib) {
            throw new Error("PDF.js library is not loaded yet. Please wait a second and retry.");
          }
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          const arrayBuffer = this.result as ArrayBuffer;
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const doc = await loadingTask.promise;
          resolve(doc.numPages);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // Upload Handlers
  const handleUploadComplete = async (fileObject: File, data: any) => {
    try {
      const totalPages = await getPdfPageCount(fileObject);
      const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);

      const newEntry: UploadedFileEntry = {
        id: data.jobId,
        fileObject,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        totalPages,
        selectedPages: allPages,
        printOptions: {
          paperSize: 'A4',
          colorMode: 'bw', // Default: B&W (cheap)
          orientation: 'portrait',
          duplex: false,
          copies: 1
        }
      };

      setUploadedFiles(prev => [...prev, newEntry]);
    } catch (err) {
      console.error("PDF Parsing failed", err);
      alert("Failed to read the structure of the uploaded PDF file. Make sure it isn't corrupted or password-protected.");
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateOption = (index: number, optionKey: string, value: any) => {
    setUploadedFiles(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        printOptions: {
          ...updated[index].printOptions,
          [optionKey]: value
        }
      };
      return updated;
    });
  };

  // Pricing Estimators
  const getFileEstimatedPrice = (fileEntry: UploadedFileEntry) => {
    if (!shopSettings || fileEntry.selectedPages.length === 0) return 0;
    const bwRate = parseFloat(shopSettings.bw_price || 0.10);
    const colorRate = parseFloat(shopSettings.color_price || 0.50);
    const duplexRate = parseFloat(shopSettings.duplex_price || 0.08);

    const baseRate = fileEntry.printOptions.colorMode === 'color' ? colorRate : bwRate;
    const effectiveRate = fileEntry.printOptions.duplex ? duplexRate : baseRate;

    return effectiveRate * fileEntry.selectedPages.length * fileEntry.printOptions.copies;
  };

  const getEstimatedPrice = () => {
    return uploadedFiles.reduce((sum, file) => sum + getFileEstimatedPrice(file), 0);
  };

  // Batch Submit Job Handler
  const handlePaymentSuccess = async () => {
    if (!shopSettings || uploadedFiles.length === 0) return;

    try {
      // Create batch insert promises (Rule 24)
      const submitPromises = uploadedFiles.map(file => {
        const jobPayload = {
          id: file.id,
          user_id: shopSettings.user_id,
          file_name: file.fileName,
          file_url: file.fileUrl,
          copies: file.printOptions.copies,
          color: file.printOptions.colorMode === 'color',
          duplex: file.printOptions.duplex,
          status: 'pending'
        };
        return createPrintJob(jobPayload);
      });

      await Promise.all(submitPromises);

      // Store context values of last upload
      const lastJobIds = uploadedFiles.map(f => f.id).join(',');
      sessionStorage.setItem('last_job_id', lastJobIds);
      sessionStorage.setItem('last_job_name', uploadedFiles[0].fileName + (uploadedFiles.length > 1 ? ` and ${uploadedFiles.length - 1} other files` : ''));

      // Redirect to unified status tracker
      router.push(`/status?jobId=${lastJobIds}`);
    } catch (err) {
      console.error("Batch Job submit failed", err);
      alert("Failed to submit jobs to the printer queue. Please contact counter support.");
    }
  };

  return (
    <AppShell shopName={shopSettings?.shop_name} email={undefined}>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="afterInteractive"
        onLoad={() => setPdfjsLoaded(true)}
      />

      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-sm font-semibold text-gray-500">Connecting to print shop...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center p-6 bg-red-50/20 border border-red-100 rounded-3xl">
            <div className="bg-red-100 text-red-600 p-3 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-red-800 text-lg mb-2">Connection Error</h3>
            <p className="text-sm text-red-600/80 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Step Indicators */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              {[
                { id: 1, label: 'Configure Documents' },
                { id: 2, label: 'Review & Pay' }
              ].map((s) => (
                <div key={s.id} className="flex flex-col items-center flex-1 relative">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                      step === s.id
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : step > s.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step > s.id ? '✓' : s.id}
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-1.5 uppercase tracking-wide transition ${
                      step === s.id ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* STEP 1: CONFIGURE DOCUMENTS */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Shop Banner card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-base font-extrabold text-gray-900 leading-none">{shopSettings.shop_name}</h2>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-1">Self-Service Printing Kiosk</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span>Shop Active</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium pt-2 border-t border-gray-100 flex justify-between">
                    <span>B&W: <strong className="text-gray-800">₹{parseFloat(shopSettings.bw_price).toFixed(2)}/pg</strong></span>
                    <span>Color: <strong className="text-gray-800">₹{parseFloat(shopSettings.color_price).toFixed(2)}/pg</strong></span>
                    {shopSettings.duplex_price && (
                      <span>Duplex: <strong className="text-gray-800">₹{parseFloat(shopSettings.duplex_price).toFixed(2)}/pg</strong></span>
                    )}
                  </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">YOUR DOCUMENTS ({uploadedFiles.length})</h3>
                    {uploadedFiles.map((fileEntry, idx) => (
                      <div key={fileEntry.id} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm relative space-y-4">
                        
                        {/* Header Details */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 overflow-hidden pr-8">
                            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="overflow-hidden">
                              <h4 className="text-sm font-bold text-gray-800 truncate">{fileEntry.fileName}</h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                                {fileEntry.selectedPages.length === fileEntry.totalPages 
                                  ? `All ${fileEntry.totalPages} pages` 
                                  : `Custom: ${fileEntry.selectedPages.length} of ${fileEntry.totalPages} pages`}
                                {` • ${(fileEntry.fileSize / 1024 / 1024).toFixed(2)} MB`}
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveFile(idx)}
                            className="text-red-400 hover:text-red-600 active:scale-95 transition p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Configurations Controls */}
                        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-xs font-semibold text-gray-600">
                          {/* 1. Color Mode Toggle */}
                          <div>
                            <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Color Mode</span>
                            <div className="flex bg-gray-100 rounded-lg p-0.5 w-full">
                              <button
                                onClick={() => handleUpdateOption(idx, 'colorMode', 'bw')}
                                className={`flex-1 text-center py-1.5 rounded-md transition font-bold ${
                                  fileEntry.printOptions.colorMode === 'bw' 
                                    ? 'bg-white text-gray-800 shadow-sm' 
                                    : 'text-gray-400'
                                }`}
                              >
                                B&W
                              </button>
                              <button
                                onClick={() => handleUpdateOption(idx, 'colorMode', 'color')}
                                className={`flex-1 text-center py-1.5 rounded-md transition font-bold ${
                                  fileEntry.printOptions.colorMode === 'color' 
                                    ? 'bg-white text-gray-850 shadow-sm' 
                                    : 'text-gray-400'
                                }`}
                              >
                                Color
                              </button>
                            </div>
                          </div>

                          {/* 2. Copies Input */}
                          <div>
                            <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Copies</span>
                            <div className="flex border border-gray-200 rounded-lg items-center justify-between px-1 h-[30px] bg-white">
                              <button
                                onClick={() => handleUpdateOption(idx, 'copies', Math.max(1, fileEntry.printOptions.copies - 1))}
                                className="w-7 h-7 flex items-center justify-center font-bold text-gray-500 hover:bg-gray-100 active:bg-gray-200 rounded-md transition text-sm"
                              >
                                -
                              </button>
                              <span className="text-gray-800 font-black">{fileEntry.printOptions.copies}</span>
                              <button
                                onClick={() => handleUpdateOption(idx, 'copies', fileEntry.printOptions.copies + 1)}
                                className="w-7 h-7 flex items-center justify-center font-bold text-gray-500 hover:bg-gray-100 active:bg-gray-200 rounded-md transition text-sm"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* 3. Duplex Mode Toggle */}
                          <div>
                            <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Double Sided</span>
                            <button
                              disabled={!shopSettings.duplex_price}
                              onClick={() => handleUpdateOption(idx, 'duplex', !fileEntry.printOptions.duplex)}
                              className={`w-full py-1.5 px-3 border rounded-lg text-center font-bold transition ${
                                !shopSettings.duplex_price
                                  ? 'border-gray-100 bg-gray-50/50 text-gray-300 cursor-not-allowed'
                                  : fileEntry.printOptions.duplex 
                                  ? 'border-blue-600 bg-blue-50/30 text-blue-700' 
                                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {!shopSettings.duplex_price ? 'Unavailable' : fileEntry.printOptions.duplex ? 'Yes (Duplex)' : 'No (Single)'}
                            </button>
                          </div>

                          {/* 4. Edit Pages Button */}
                          <div>
                            <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Page Range</span>
                            <button
                              onClick={() => setActivePreviewIdx(idx)}
                              className="w-full py-1.5 px-3 border border-gray-200 rounded-lg text-center font-bold text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition flex items-center justify-center space-x-1"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                              <span>Select Pages</span>
                            </button>
                          </div>
                        </div>

                        {/* Estimated Price for this file */}
                        <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xs">
                          <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">File Subtotal</span>
                          <span className="text-gray-800 font-black">₹{getFileEstimatedPrice(fileEntry).toFixed(2)}</span>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* Direct Dropzone for uploading files */}
                <div className="space-y-3">
                  {uploadedFiles.length > 0 && (
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">ADD MORE DOCUMENTS</h3>
                  )}
                  <FileUploader
                    onUploadComplete={handleUploadComplete}
                    onUploadReset={undefined}
                  />
                </div>

                {/* Sticky Pricing Summary Button */}
                {uploadedFiles.length > 0 && (
                  <div className="pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-base py-4 rounded-2xl shadow-lg transition flex items-center justify-between px-6"
                    >
                      <div className="text-left">
                        <span className="text-[10px] text-blue-100 uppercase tracking-wider block font-bold">Total: {uploadedFiles.length} file(s)</span>
                        <span className="text-lg">₹{getEstimatedPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span>Review Order</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: REVIEW & PAY */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center py-1">
                  <h2 className="text-lg font-extrabold text-gray-900 leading-snug">Review Order</h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Double-check specifications before paying.</p>
                </div>

                {/* Order Summary List */}
                <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2">Checkout Details</h3>
                  
                  {uploadedFiles.map((fileEntry, idx) => (
                    <div key={fileEntry.id} className="flex justify-between items-start text-xs border-b border-dashed border-gray-100 pb-3 last:border-b-0 last:pb-0">
                      <div className="overflow-hidden pr-4 max-w-[70%]">
                        <p className="font-bold text-gray-700 truncate">{fileEntry.fileName}</p>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {fileEntry.selectedPages.length} pgs × {fileEntry.printOptions.copies} copies • {fileEntry.printOptions.colorMode === 'color' ? 'Color' : 'B&W'} {fileEntry.printOptions.duplex && '• Duplex'}
                        </span>
                      </div>
                      <span className="font-black text-gray-800 flex-shrink-0 mt-0.5">
                        ₹{getFileEstimatedPrice(fileEntry).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-sm font-bold">
                    <span className="text-gray-500">Order Total</span>
                    <span className="text-xl font-black text-blue-600">₹{getEstimatedPrice().toFixed(2)}</span>
                  </div>
                </div>

                {/* UPI Payment Panel */}
                <PaymentPanel
                  amount={getEstimatedPrice()}
                  jobId={uploadedFiles[0]?.id}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentCancel={() => setStep(1)}
                />
              </div>
            )}

            {/* PAGE RANGE SELECTION PREVIEW MODAL */}
            {activePreviewIdx !== null && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
                  <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="overflow-hidden pr-4">
                      <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider">Customize Pages</h3>
                      <p className="text-xs text-gray-500 font-bold truncate mt-0.5">
                        {uploadedFiles[activePreviewIdx].fileName}
                      </p>
                    </div>
                    <button
                      onClick={() => setActivePreviewIdx(null)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl transition text-xs shadow-md"
                    >
                      Apply Selection
                    </button>
                  </div>
                  <div className="p-5 overflow-y-auto flex-1 bg-gray-50/20">
                    <PdfPreviewer
                      file={uploadedFiles[activePreviewIdx].fileObject}
                      selectedPages={uploadedFiles[activePreviewIdx].selectedPages}
                      onSelectionChange={(newSelection: number[]) => {
                        const updated = [...uploadedFiles];
                        updated[activePreviewIdx].selectedPages = newSelection;
                        setUploadedFiles(updated);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </AppShell>
  );
}
