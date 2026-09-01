'use strict';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import AppShell from '../../components/AppShell';
import PdfPreviewer from '../../components/PdfPreviewer';
import PaymentPanel from '../../components/PaymentPanel';
import { getShopDetails, createPrintJob, uploadPrintFile, getOfficeDocumentMetadata } from '../../services/api';
import { ArrowLeft, ArrowRight, FileText, AlertTriangle, Trash2, Sliders, UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';

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

interface UploadTask {
  id: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  errorMsg?: string;
}

export default function ShopPrintPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawShopId = searchParams ? (
    searchParams.get('shopId') || 
    searchParams.get('shop_id') || 
    searchParams.get('shopid') || 
    searchParams.get('shop') || 
    searchParams.get('s') || 
    ''
  ) : '';
  const uuidMatch = rawShopId.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
  const shopParam = uuidMatch ? uuidMatch[0] : rawShopId;

  // Shop settings state
  const [shopSettings, setShopSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // PDF.js script loading status
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);

  // Wizard state: 1: Upload, 2: Configure, 3: Checkout/Pay
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileEntry[]>([]);
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const [activePreviewIdx, setActivePreviewIdx] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch shop settings on mount
  useEffect(() => {
    async function loadShop() {
      try {
        setLoading(true);
        const data = await getShopDetails(shopParam);
        if (!data) {
          setError('Print shop not found. Please scan the QR code at the counter again.');
        } else {
          setShopSettings(data);
          sessionStorage.setItem('current_shop_id', data.user_id);
          sessionStorage.setItem('current_shop_name', data.shop_name);
          sessionStorage.setItem('current_shop_settings', JSON.stringify(data));
        }
      } catch (err: any) {
        console.error('Failed to load shop details', err);
        setError('Could not connect to this print shop. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    }
    loadShop();
  }, [shopParam]);

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

  // Extract Page Count from standard PDF
  const getPdfPageCount = async (file: File): Promise<number> => {
    return new Promise((resolve) => {
      try {
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const typedArray = new Uint8Array(this.result as ArrayBuffer);
            if (typeof window !== 'undefined' && (window as any).pdfjsLib) {
              (window as any).pdfjsLib.getDocument({ data: typedArray }).promise.then((pdf: any) => {
                resolve(pdf.numPages);
              }).catch(() => resolve(1));
            } else {
              // Fallback page count extraction via regex
              const text = new TextDecoder('utf-8', { fatal: false }).decode(typedArray);
              const matches = text.match(/\/Type\s*\/Page[^s]/g);
              resolve(matches ? matches.length : 1);
            }
          } catch {
            resolve(1);
          }
        };
        reader.readAsArrayBuffer(file);
      } catch {
        resolve(1);
      }
    });
  };

  // Process selected files (PDF, Word, PPTX)
  const processFiles = async (files: FileList | File[]) => {
    const activeShopId = shopSettings?.user_id || 'demo_shop';
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const lowerName = file.name.toLowerCase();
      const isPdf = lowerName.endsWith('.pdf') || file.type === 'application/pdf';
      const isWord = lowerName.endsWith('.docx') || lowerName.endsWith('.doc');
      const isPpt = lowerName.endsWith('.pptx') || lowerName.endsWith('.ppt');
      const isText = lowerName.endsWith('.txt') || lowerName.endsWith('.rtf');

      // Validate format
      if (!isPdf && !isWord && !isPpt && !isText) {
        alert(`"${file.name}" is not a supported format. Please upload PDF, Word (.docx, .doc), or PowerPoint (.pptx, .ppt) files.`);
        continue;
      }
      
      // Validate size: 50MB limit
      if (file.size > 50 * 1024 * 1024) {
        alert(`"${file.name}" exceeds the 50MB file size limit.`);
        continue;
      }

      const tempId = 'upload_' + Math.random().toString(36).substr(2, 9);
      
      // Append upload task to state queue
      setUploadTasks(prev => [...prev, {
        id: tempId,
        fileName: file.name,
        progress: 15,
        status: 'uploading'
      }]);

      try {
        let totalPages = 0;

        if (isPdf) {
          totalPages = await getPdfPageCount(file);
        } else {
          setUploadTasks(prev => prev.map(t => t.id === tempId ? { ...t, progress: 35 } : t));
          const meta = await getOfficeDocumentMetadata(file);
          totalPages = meta.totalPages;
        }

        // Upload original file directly to Supabase storage bucket
        const metadata = await uploadPrintFile(activeShopId, file, (progress: number) => {
          setUploadTasks(prev => prev.map(t => t.id === tempId ? { ...t, progress: Math.max(50, progress) } : t));
        });
        
        if (!totalPages) totalPages = 1;
        const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);

        setUploadTasks(prev => prev.map(t => t.id === tempId ? { ...t, progress: 100, status: 'success' } : t));
        
        // Append to ready files list
        const newEntry: UploadedFileEntry = {
          id: metadata.jobId,
          fileObject: file,
          fileName: metadata.fileName,
          fileUrl: metadata.fileUrl,
          fileSize: metadata.fileSize,
          totalPages,
          selectedPages: allPages,
          printOptions: {
            paperSize: 'A4',
            colorMode: 'bw',
            orientation: 'portrait',
            duplex: false,
            copies: 1
          }
        };
        setUploadedFiles(prev => [...prev, newEntry]);

        // Clean up task from list after animation completes
        setTimeout(() => {
          setUploadTasks(prev => prev.filter(t => t.id !== tempId));
        }, 1500);

      } catch (err: any) {
        console.error("Processing failed for file: " + file.name, err);
        setUploadTasks(prev => prev.map(t => t.id === tempId ? {
          ...t,
          status: 'error',
          errorMsg: err.message || 'Processing failed. Check connection.'
        } : t));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
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

  // Aggregate Page Counts Across All Files
  const getAggregateVolumeStats = () => {
    let totalBwPages = 0;
    let totalColorPages = 0;

    uploadedFiles.forEach(f => {
      const pgs = f.selectedPages.length * f.printOptions.copies;
      if (f.printOptions.colorMode === 'color') {
        totalColorPages += pgs;
      } else {
        totalBwPages += pgs;
      }
    });

    let bwDiscountPercent = 0;
    let bwTier: any = null;
    const bwTiers = shopSettings?.discount_rules?.bw_discounts;
    if (Array.isArray(bwTiers) && bwTiers.length > 0) {
      const sorted = [...bwTiers]
        .filter(t => t && t.min_pages > 0 && t.discount_percent > 0 && totalBwPages >= t.min_pages)
        .sort((a, b) => b.min_pages - a.min_pages);
      if (sorted.length > 0) {
        bwTier = sorted[0];
        bwDiscountPercent = sorted[0].discount_percent;
      }
    }

    let colorDiscountPercent = 0;
    let colorTier: any = null;
    const colorTiers = shopSettings?.discount_rules?.color_discounts;
    if (Array.isArray(colorTiers) && colorTiers.length > 0) {
      const sorted = [...colorTiers]
        .filter(t => t && t.min_pages > 0 && t.discount_percent > 0 && totalColorPages >= t.min_pages)
        .sort((a, b) => b.min_pages - a.min_pages);
      if (sorted.length > 0) {
        colorTier = sorted[0];
        colorDiscountPercent = sorted[0].discount_percent;
      }
    }

    return {
      totalBwPages,
      totalColorPages,
      bwDiscountPercent,
      bwTier,
      colorDiscountPercent,
      colorTier
    };
  };

  // Pricing Calculation with Aggregate Volume / Bulk Discounts
  const calculatePricingDetails = (fileEntry: UploadedFileEntry) => {
    if (!shopSettings || !fileEntry || fileEntry.selectedPages.length === 0) {
      return { baseRate: 0, effectiveRate: 0, totalPages: 0, basePrice: 0, discountPercent: 0, discountAmount: 0, finalPrice: 0, tier: null };
    }

    const bwRate = parseFloat(shopSettings.bw_price || 2.0);
    const colorRate = parseFloat(shopSettings.color_price || 10.0);
    const isColor = fileEntry.printOptions.colorMode === 'color';
    const baseRate = isColor ? colorRate : bwRate;
    const duplexRate = (shopSettings.duplex_price && parseFloat(shopSettings.duplex_price) > 0)
      ? parseFloat(shopSettings.duplex_price)
      : baseRate;
    const effectiveRate = fileEntry.printOptions.duplex ? duplexRate : baseRate;

    const totalPages = fileEntry.selectedPages.length * fileEntry.printOptions.copies;
    const basePrice = effectiveRate * totalPages;

    // Use aggregate discount percent across all files of same color mode
    const aggStats = getAggregateVolumeStats();
    const discountPercent = isColor ? aggStats.colorDiscountPercent : aggStats.bwDiscountPercent;
    const qualifyingTier = isColor ? aggStats.colorTier : aggStats.bwTier;

    const discountAmount = (basePrice * discountPercent) / 100;
    const finalPrice = Math.max(0, basePrice - discountAmount);

    return {
      baseRate,
      effectiveRate,
      totalPages,
      basePrice,
      discountPercent,
      discountAmount,
      finalPrice,
      tier: qualifyingTier
    };
  };

  const getFileEstimatedPrice = (fileEntry: UploadedFileEntry) => {
    return calculatePricingDetails(fileEntry).finalPrice;
  };

  const getEstimatedPrice = () => {
    return uploadedFiles.reduce((sum, file) => sum + getFileEstimatedPrice(file), 0);
  };

  // Batch Submit Job Handler
  const handlePaymentSuccess = async () => {
    if (!shopSettings || uploadedFiles.length === 0) return;

    try {
      const submitPromises = uploadedFiles.map(file => {
        const sortedSelected = [...file.selectedPages].sort((a, b) => a - b);
        const selectedPagesStr = sortedSelected.join(',');
        const isAllSelected = file.selectedPages.length === file.totalPages;

        const jobPayload = {
          id: file.id,
          user_id: shopSettings.user_id,
          file_name: file.fileName,
          file_url: file.fileUrl,
          copies: file.printOptions.copies,
          color: file.printOptions.colorMode === 'color',
          duplex: file.printOptions.duplex,
          status: 'pending',
          pages: file.selectedPages.length,
          selected_pages: selectedPagesStr,
          page_range: isAllSelected ? 'all' : selectedPagesStr,
          amount: getFileEstimatedPrice(file)
        };
        return createPrintJob(jobPayload);
      });

      await Promise.all(submitPromises);

      const lastJobIds = uploadedFiles.map(f => f.id).join(',');
      sessionStorage.setItem('last_job_id', lastJobIds);
      sessionStorage.setItem('last_job_name', uploadedFiles[0].fileName + (uploadedFiles.length > 1 ? ` and ${uploadedFiles.length - 1} other files` : ''));

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
                { id: 1, label: '1. Upload Files' },
                { id: 2, label: '2. Customize' },
                { id: 3, label: '3. Pay & Print' }
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

            {/* STEP 1: BATCH UPLOAD VIEWER */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Shop Rates Panel */}
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

                  {/* Active Volume Discounts Indicator */}
                  {shopSettings.discount_rules && (
                    ((shopSettings.discount_rules.bw_discounts && shopSettings.discount_rules.bw_discounts.length > 0) ||
                     (shopSettings.discount_rules.color_discounts && shopSettings.discount_rules.color_discounts.length > 0)) && (
                      <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                          🏷️ Bulk Discounts:
                        </span>
                        {shopSettings.discount_rules.bw_discounts?.map((t: any, i: number) => (
                          <span key={'bw_' + i} className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                            B&W {t.min_pages}+ pgs ({t.discount_percent}% OFF)
                          </span>
                        ))}
                        {shopSettings.discount_rules.color_discounts?.map((t: any, i: number) => (
                          <span key={'c_' + i} className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                            Color {t.min_pages}+ pgs ({t.discount_percent}% OFF)
                          </span>
                        ))}
                      </div>
                    )
                  )}
                </div>

                {/* File Dropzone */}
                <div className="space-y-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.docx,.doc,.pptx,.ppt,.rtf,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.ms-powerpoint"
                    multiple
                    className="hidden"
                  />
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/10 transition rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer text-center min-h-[200px] bg-white shadow-sm"
                  >
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-full mb-3">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <h3 className="font-extrabold text-gray-800 text-base mb-0.5">Upload Documents</h3>
                    <p className="text-xs text-gray-400 mb-4 max-w-[280px]">Drag & drop PDF, Word (.docx) or PowerPoint (.pptx) files here, or tap to choose</p>
                    <span className="inline-block bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-md transition">
                      Choose Files
                    </span>
                  </div>
                </div>

                {/* Upload Tasks Queue (Progress Bars) */}
                {uploadTasks.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-gray-450 uppercase tracking-widest px-1">Uploading Documents...</h4>
                    {uploadTasks.map(task => (
                      <div key={task.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-2.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-700 truncate max-w-[75%]">{task.fileName}</span>
                          {task.status === 'uploading' && (
                            <span className="text-blue-600 font-black animate-pulse">{task.progress}%</span>
                          )}
                          {task.status === 'success' && (
                            <span className="text-green-600 font-black flex items-center space-x-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5 fill-green-50 text-green-600" />
                              <span>Done</span>
                            </span>
                          )}
                          {task.status === 'error' && (
                            <span className="text-red-650 font-bold">Error</span>
                          )}
                        </div>
                        {task.status === 'uploading' && (
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full transition-all duration-150"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        )}
                        {task.errorMsg && (
                          <p className="text-[10px] font-semibold text-red-500">{task.errorMsg}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Uploaded Ready Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-gray-450 uppercase tracking-widest px-1">Uploaded Files ({uploadedFiles.length})</h4>
                    <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm divide-y divide-gray-100">
                      {uploadedFiles.map((fileEntry, idx) => (
                        <div key={fileEntry.id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                          <div className="flex items-center space-x-2.5 overflow-hidden max-w-[80%]">
                            <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-gray-700 truncate">{fileEntry.fileName}</p>
                              <span className="text-[10px] text-gray-400 font-bold">
                                {fileEntry.totalPages} pages • {(fileEntry.fileSize / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(idx)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition text-sm flex items-center justify-center space-x-1"
                    >
                      <span>Continue to Print Options ({uploadedFiles.length} files)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: PER-FILE PRINT SETTINGS CONFIGURATOR */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Configure Print Options</h3>
                  <span className="text-xs text-gray-400 font-bold">{uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}</span>
                </div>

                {/* Per-File Options Accordion/Cards */}
                <div className="space-y-4">
                  {uploadedFiles.map((fileEntry, idx) => (
                    <div key={fileEntry.id} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
                      {/* File Card Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2.5 overflow-hidden max-w-[85%]">
                          <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="font-extrabold text-gray-800 text-sm truncate">{fileEntry.fileName}</h4>
                            <span className="text-[10px] text-gray-400 font-bold">
                              {fileEntry.selectedPages.length} of {fileEntry.totalPages} pages selected • {fileEntry.printOptions.copies} {fileEntry.printOptions.copies > 1 ? 'copies' : 'copy'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(idx)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Options Controls Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {/* Color Mode */}
                        <div>
                          <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Color Mode</span>
                          <div className="grid grid-cols-2 gap-1 bg-gray-100 p-0.5 rounded-lg">
                            <button
                              onClick={() => handleUpdateOption(idx, 'colorMode', 'bw')}
                              className={`py-1 rounded-md text-[10px] font-bold transition ${
                                fileEntry.printOptions.colorMode === 'bw'
                                  ? 'bg-white text-gray-800 shadow-sm'
                                  : 'text-gray-500 hover:text-gray-800'
                              }`}
                            >
                              B&W
                            </button>
                            <button
                              onClick={() => handleUpdateOption(idx, 'colorMode', 'color')}
                              className={`py-1 rounded-md text-[10px] font-bold transition ${
                                fileEntry.printOptions.colorMode === 'color'
                                  ? 'bg-white text-blue-600 shadow-sm'
                                  : 'text-gray-500 hover:text-gray-800'
                              }`}
                            >
                              Color
                            </button>
                          </div>
                        </div>

                        {/* Duplex Toggle */}
                        <div>
                          <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Sides</span>
                          <div className="grid grid-cols-2 gap-1 bg-gray-100 p-0.5 rounded-lg">
                            <button
                              onClick={() => handleUpdateOption(idx, 'duplex', false)}
                              className={`py-1 rounded-md text-[10px] font-bold transition ${
                                !fileEntry.printOptions.duplex
                                  ? 'bg-white text-gray-800 shadow-sm'
                                  : 'text-gray-500 hover:text-gray-800'
                              }`}
                            >
                              Single
                            </button>
                            <button
                              onClick={() => handleUpdateOption(idx, 'duplex', true)}
                              disabled={fileEntry.selectedPages.length <= 1}
                              title={fileEntry.selectedPages.length <= 1 ? "Double-sided requires at least 2 pages" : ""}
                              className={`py-1 rounded-md text-[10px] font-bold transition ${
                                fileEntry.selectedPages.length <= 1
                                  ? 'opacity-40 cursor-not-allowed text-gray-400'
                                  : fileEntry.printOptions.duplex
                                  ? 'bg-white text-blue-600 shadow-sm'
                                  : 'text-gray-500 hover:text-gray-800'
                              }`}
                            >
                              Double
                            </button>
                          </div>
                        </div>

                        {/* Copies counter */}
                        <div>
                          <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Copies</span>
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => handleUpdateOption(idx, 'copies', Math.max(1, fileEntry.printOptions.copies - 1))}
                              className="px-2.5 py-1 text-gray-500 hover:bg-gray-100 active:bg-gray-200 font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="flex-1 text-center font-extrabold text-gray-800 text-xs">
                              {fileEntry.printOptions.copies}
                            </span>
                            <button
                              onClick={() => handleUpdateOption(idx, 'copies', fileEntry.printOptions.copies + 1)}
                              className="px-2.5 py-1 text-gray-500 hover:bg-gray-100 active:bg-gray-200 font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Custom pages select */}
                        <div>
                          <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Select Pages</span>
                          <button
                            onClick={() => setActivePreviewIdx(idx)}
                            className="w-full py-1.5 px-2 border border-blue-200 bg-blue-50/50 rounded-lg text-center font-bold text-blue-700 hover:bg-blue-100/70 active:bg-blue-100 transition flex items-center justify-center space-x-1"
                          >
                            <Sliders className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">
                              {fileEntry.selectedPages.length === fileEntry.totalPages
                                ? `All ${fileEntry.totalPages} Pages`
                                : `${fileEntry.selectedPages.length}/${fileEntry.totalPages} Pages`}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* File Total Price with Discount Breakdown */}
                      {(() => {
                        const pricing = calculatePricingDetails(fileEntry);
                        return (
                          <div className="border-t border-gray-100 pt-3 flex flex-col space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">File Subtotal</span>
                              <div className="flex items-baseline space-x-1.5">
                                {pricing.discountPercent > 0 && (
                                  <span className="line-through text-gray-400 text-xs font-semibold">
                                    ₹{pricing.basePrice.toFixed(2)}
                                  </span>
                                )}
                                <span className={`font-black ${pricing.discountPercent > 0 ? 'text-green-600 text-sm' : 'text-gray-800'}`}>
                                  ₹{pricing.finalPrice.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            {pricing.discountPercent > 0 && (
                              <div className="flex justify-end">
                                <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                  🎉 {pricing.discountPercent}% bulk discount applied (-₹{pricing.discountAmount.toFixed(2)})
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                    </div>
                  ))}
                </div>

                {/* Step 2 Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-bold py-3.5 px-4 rounded-2xl transition text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition text-sm"
                  >
                    Proceed to Pay
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CHECKOUT & PAYMENT */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center py-1">
                  <h2 className="text-lg font-extrabold text-gray-900 leading-snug">Review & Pay</h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Check specifications before completing payment.</p>
                </div>

                {/* Checkout Summary card */}
                <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2">Checkout Details</h3>
                  
                  {uploadedFiles.map((fileEntry, idx) => {
                    const pricing = calculatePricingDetails(fileEntry);
                    return (
                      <div key={fileEntry.id} className="flex justify-between items-start text-xs border-b border-dashed border-gray-100 pb-3 last:border-b-0 last:pb-0 font-semibold">
                        <div className="overflow-hidden pr-4 max-w-[70%]">
                          <p className="font-bold text-gray-700 truncate">{fileEntry.fileName}</p>
                          <span className="text-[10px] text-gray-400 font-medium block">
                            {fileEntry.selectedPages.length} pgs × {fileEntry.printOptions.copies} copies • {fileEntry.printOptions.colorMode === 'color' ? 'Color' : 'B&W'} {fileEntry.printOptions.duplex && '• Duplex'}
                          </span>
                          {pricing.discountPercent > 0 && (
                            <span className="inline-block text-[9px] text-green-700 font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-100 mt-1">
                              🎉 {pricing.discountPercent}% Volume Discount (-₹{pricing.discountAmount.toFixed(2)})
                            </span>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0 mt-0.5">
                          {pricing.discountPercent > 0 && (
                            <span className="line-through text-gray-400 text-[10px] block">
                              ₹{pricing.basePrice.toFixed(2)}
                            </span>
                          )}
                          <span className={`font-black ${pricing.discountPercent > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                            ₹{pricing.finalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {(() => {
                    const rawTotal = uploadedFiles.reduce((sum, f) => sum + calculatePricingDetails(f).basePrice, 0);
                    const finalTotal = getEstimatedPrice();
                    const totalSavings = rawTotal - finalTotal;

                    return (
                      <div className="border-t border-gray-100 pt-4 space-y-1.5">
                        {totalSavings > 0.01 && (
                          <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                            <span>Subtotal (Standard Rate)</span>
                            <span className="line-through">₹{rawTotal.toFixed(2)}</span>
                          </div>
                        )}
                        {totalSavings > 0.01 && (
                          <div className="flex justify-between items-center text-xs font-bold text-green-600 bg-green-50/80 px-2 py-1 rounded-lg">
                            <span>Total Volume Savings</span>
                            <span>-₹{totalSavings.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm font-bold pt-1">
                          <span className="text-gray-700">Order Total</span>
                          <span className="text-xl font-black text-blue-600">₹{finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* UPI Payment Panel */}
                <PaymentPanel
                  amount={getEstimatedPrice()}
                  jobId={uploadedFiles[0]?.id}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentCancel={() => setStep(2)}
                />
              </div>
            )}

            {/* PAGE RANGE SELECTION PREVIEW MODAL */}
            {activePreviewIdx !== null && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="overflow-hidden pr-3">
                      <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider">Customize Pages</h3>
                      <p className="text-xs text-gray-500 font-bold truncate mt-0.5">
                        {uploadedFiles[activePreviewIdx].fileName}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
                        <span className="text-[10px] font-bold text-gray-400 px-2 py-1 bg-gray-50 border-r border-gray-200">Total:</span>
                        <input
                          type="number"
                          min="1"
                          max="999"
                          value={uploadedFiles[activePreviewIdx].totalPages}
                          onChange={(e) => {
                            const newTotal = Math.max(1, parseInt(e.target.value, 10) || 1);
                            const updated = [...uploadedFiles];
                            updated[activePreviewIdx].totalPages = newTotal;
                            updated[activePreviewIdx].selectedPages = Array.from({ length: newTotal }, (_, i) => i + 1);
                            setUploadedFiles(updated);
                          }}
                          className="w-11 text-center text-xs font-black py-1 focus:outline-none text-gray-800"
                        />
                      </div>
                      <button
                        onClick={() => setActivePreviewIdx(null)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2 rounded-xl transition text-xs shadow-md"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                  <div className="p-5 overflow-y-auto flex-1 bg-gray-50/20">
                    <PdfPreviewer
                      file={uploadedFiles[activePreviewIdx].fileObject}
                      totalPages={uploadedFiles[activePreviewIdx].totalPages}
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
