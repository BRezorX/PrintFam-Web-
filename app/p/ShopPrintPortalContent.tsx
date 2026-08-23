'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppShell from '../../components/AppShell';
import FileUploader from '../../components/FileUploader';
import PdfPreviewer from '../../components/PdfPreviewer';
import PrintSettings from '../../components/PrintSettings';
import PriceBreakdown from '../../components/PriceBreakdown';
import PaymentPanel from '../../components/PaymentPanel';
import { getShopDetails, createPrintJob } from '../../services/api';
import { ArrowLeft, ArrowRight, FileText, AlertTriangle } from 'lucide-react';

export default function ShopPrintPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get('shopId');

  // Shop details session state
  const [shopSettings, setShopSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Wizard steps: 1: Upload, 2: Preview & Select, 3: Customization, 4: Payment
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<any>(null);
  
  // Uploaded document metadata
  const [docInfo, setDocInfo] = useState<any>(null);

  // Print Configuration States
  const [selectedPages, setSelectedPages] = useState<any[]>([]);
  const [printOptions, setPrintOptions] = useState({
    paperSize: 'A4',
    colorMode: 'bw',
    orientation: 'portrait',
    duplex: false,
    copies: 1
  });

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
          // Cache in session storage for components
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

  // Navigation Protection guard (Rule 39)
  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      if (step > 1) {
        e.preventDefault();
        e.returnValue = 'Your print configuration has not been submitted yet. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [step]);

  // Step 1: Upload Handlers
  const handleUploadComplete = (uploadedFile: any, data: any) => {
    setFile(uploadedFile);
    setDocInfo(data);
    setStep(2); // Auto transition to Page Selector (Step 2)
  };

  const handleUploadReset = () => {
    setFile(null);
    setDocInfo(null);
    setSelectedPages([]);
  };

  // Pricing Helpers
  const getEstimatedPrice = () => {
    if (!shopSettings || selectedPages.length === 0) return 0;
    const bwRate = parseFloat(shopSettings.bw_price || 0.10);
    const colorRate = parseFloat(shopSettings.color_price || 0.50);
    const duplexRate = parseFloat(shopSettings.duplex_price || 0.08);

    const baseRate = printOptions.colorMode === 'color' ? colorRate : bwRate;
    const effectiveRate = printOptions.duplex ? duplexRate : baseRate;

    return effectiveRate * selectedPages.length * printOptions.copies;
  };

  // Submit Job Handler
  const handlePaymentSuccess = async () => {
    if (!shopSettings || !docInfo) return;

    try {
      const jobPayload = {
        id: docInfo.jobId,
        user_id: shopSettings.user_id,
        file_name: docInfo.fileName,
        file_url: docInfo.fileUrl,
        copies: printOptions.copies,
        color: printOptions.colorMode === 'color',
        duplex: printOptions.duplex,
        status: 'pending'
      };

      await createPrintJob(jobPayload);
      
      // Store success context
      sessionStorage.setItem('last_job_id', docInfo.jobId);
      sessionStorage.setItem('last_job_name', docInfo.fileName);
      
      // Route to Status tracking page using query param
      router.push(`/status?jobId=${docInfo.jobId}`);
    } catch (err) {
      console.error("Job submit failed", err);
      alert("Failed to submit job to queue. Contact counter.");
    }
  };

  return (
    <AppShell shopName={shopSettings?.shop_name} email={undefined}>
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
            {/* Step Indicator Banner */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              {[
                { id: 1, label: 'Upload' },
                { id: 2, label: 'Pages' },
                { id: 3, label: 'Settings' },
                { id: 4, label: 'Pay' }
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

            {/* STEP 1: COMPACT SHOP DETAILS + UPLOAD */}
            {step === 1 && (
              <div className="space-y-4">
                {/* Compact Shop Details Panel */}
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

                <div className="text-center py-1">
                  <h3 className="text-lg font-extrabold text-gray-900 leading-snug">Upload Document</h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Select the PDF file you wish to print.</p>
                </div>
                <FileUploader
                  onUploadComplete={handleUploadComplete}
                  onUploadReset={handleUploadReset}
                />
              </div>
            )}

            {/* STEP 2: PAGE SELECTOR VIEW */}
            {step === 2 && file && (
              <div className="space-y-4">
                <div className="text-center py-1">
                  <h2 className="text-lg font-extrabold text-gray-900 leading-snug">Select Pages</h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Toggle preview checkmarks to select pages.</p>
                </div>

                <PdfPreviewer
                  file={file}
                  selectedPages={selectedPages}
                  onSelectionChange={setSelectedPages}
                />

                {/* Step 2 Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      handleUploadReset();
                      setStep(1);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-bold py-3.5 px-4 rounded-2xl transition text-sm flex items-center justify-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={selectedPages.length === 0}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition text-sm flex items-center justify-center space-x-1"
                  >
                    <span>Customize</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CUSTOMIZATION VIEW */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center py-1">
                  <h2 className="text-lg font-extrabold text-gray-900 leading-snug">Print Settings</h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Configure layout, quality, and copies.</p>
                </div>

                <PrintSettings
                  settings={printOptions}
                  onChange={setPrintOptions}
                  capabilities={shopSettings}
                />

                <PriceBreakdown
                  pagesCount={selectedPages.length}
                  copies={printOptions.copies}
                  settings={printOptions}
                  shopSettings={shopSettings}
                />

                {/* Step 3 Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-bold py-3.5 px-4 rounded-2xl transition text-sm flex items-center justify-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition text-sm flex items-center justify-center space-x-1"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & PAYMENT VIEW */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center py-1">
                  <h2 className="text-lg font-extrabold text-gray-900 leading-snug">Review Order</h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Double-check specifications before paying.</p>
                </div>

                {/* Order Review Card */}
                <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex items-start space-x-3 border-b border-gray-100 pb-4">
                    <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Document File</h4>
                      <p className="text-sm font-bold text-gray-700 truncate">{file?.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-500">
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Pages</span>
                      <span className="text-gray-800 font-bold text-sm">{selectedPages.length} pages selected</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Copies</span>
                      <span className="text-gray-800 font-bold text-sm">× {printOptions.copies} copies</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Paper Size</span>
                      <span className="text-gray-800 font-bold text-sm">{printOptions.paperSize}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Orientation</span>
                      <span className="text-gray-800 font-bold text-sm capitalize">{printOptions.orientation}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Color mode</span>
                      <span className="text-gray-800 font-bold text-sm">{printOptions.colorMode === 'color' ? 'Color' : 'Black & White'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Double-sided</span>
                      <span className="text-gray-800 font-bold text-sm">{printOptions.duplex ? 'Yes (Duplex)' : 'No (Single)'}</span>
                    </div>
                  </div>
                </div>

                {/* Integrated UPI Payment Panel */}
                <PaymentPanel
                  amount={getEstimatedPrice()}
                  jobId={docInfo?.jobId}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentCancel={() => setStep(3)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
