'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppShell from '../../components/AppShell';
import { subscribeToJobStatus } from '../../services/api';
import { Loader2, CheckCircle2, AlertOctagon, Printer, FileCheck2, ArrowRight, Receipt, Download, X, FileText } from 'lucide-react';

export default function JobStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawJobId = searchParams.get('jobId') || searchParams.get('jobid');
  const jobId = rawJobId;

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shopName, setShopName] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    const cachedName = sessionStorage.getItem('current_shop_name');
    if (cachedName) {
      setShopName(cachedName);
    }
  }, []);

  useEffect(() => {
    if (!jobId) {
      setError("No Job ID provided in the URL.");
      setLoading(false);
      return;
    }

    const ids = jobId.split(',').map(id => id.trim()).filter(Boolean);
    if (ids.length === 0) {
      setError("No valid Job IDs found in the URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    // Pre-populate state with loading templates for each ID
    const initialJobs = ids.map(id => ({
      id,
      file_name: 'Retrieving file details...',
      status: 'pending',
      copies: 1,
      color: false,
      duplex: false,
      loading: true
    }));
    setJobs(initialJobs);

    const unsubscribers: (() => void)[] = [];
    let activeSubscriptions = 0;

    ids.forEach(id => {
      activeSubscriptions++;
      const unsubscribe = subscribeToJobStatus(id, (updatedJob: any) => {
        setLoading(false);
        if (updatedJob) {
          setJobs(prev => {
            const idx = prev.findIndex(j => j.id === id);
            if (idx !== -1) {
              const updated = [...prev];
              updated[idx] = { ...updatedJob, loading: false };
              return updated;
            }
            return [...prev, { ...updatedJob, loading: false }];
          });
        } else {
          // Mark job as failed to locate
          setJobs(prev => {
            const idx = prev.findIndex(j => j.id === id);
            if (idx !== -1) {
              const updated = [...prev];
              updated[idx] = { ...updated[idx], file_name: 'File not found', status: 'failed', error_message: 'Job could not be found in queue.', loading: false };
              return updated;
            }
            return prev;
          });
        }
      });

      if (unsubscribe) {
        unsubscribers.push(unsubscribe);
      }
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [jobId]);

  const handleDone = () => {
    sessionStorage.removeItem('last_job_id');
    sessionStorage.removeItem('last_job_name');

    // Find the shop ID from the first loaded job
    const loadedJob = jobs.find(j => j && j.user_id);
    const shopId = loadedJob?.user_id || sessionStorage.getItem('current_shop_id');
    
    if (shopId) {
      router.push(`/p?shopId=${shopId}`);
    } else {
      router.push('/');
    }
  };

  // Helper to determine active percentage for progress bar
  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'needs_attention':
      case 'interrupted': return 45;
      case 'reprinting': return 65;
      case 'printing': return 85;
      case 'completed': return 100;
      default: return 15;
    }
  };

  // Check if all jobs are finished
  const areAllJobsFinished = () => {
    if (jobs.length === 0) return false;
    return jobs.every(j => j.status === 'completed');
  };

  const getOrderStatusMessage = () => {
    const total = jobs.length;
    const completed = jobs.filter(j => j.status === 'completed').length;
    const printing = jobs.filter(j => j.status === 'printing').length;
    const reprinting = jobs.filter(j => j.status === 'reprinting').length;
    const needsAttention = jobs.filter(j => j.status === 'needs_attention' || j.status === 'interrupted').length;
    const failed = jobs.filter(j => j.status === 'failed').length;

    if (completed === total) {
      return {
        title: "All Printing Complete! ✅",
        desc: "All of your documents have been successfully printed. Please collect them from the counter.",
        color: "text-green-800"
      };
    }
    if (reprinting > 0) {
      return {
        title: "Reprinting in Progress... 🖨️",
        desc: "The shopkeeper has initiated a reprint of your file. Your pages will output shortly.",
        color: "text-blue-800"
      };
    }
    if (needsAttention > 0) {
      return {
        title: "Shop Counter Checking Printer 🛡️",
        desc: "Your file is safely preserved. The shopkeeper has been notified to check paper/ink state.",
        color: "text-amber-800"
      };
    }
    if (printing > 0) {
      return {
        title: "Printing in Progress...",
        desc: "The printer is currently outputting your pages. Please stay near the terminal.",
        color: "text-yellow-800"
      };
    }
    if (failed === total) {
      return {
        title: "Counter Support Alerted",
        desc: "Printer reported an issue. Your file is saved and the shopkeeper can reprint it for you.",
        color: "text-red-800"
      };
    }
    return {
      title: `Jobs in Print Queue (${completed}/${total} Ready)`,
      desc: "Your files are queued. They will print automatically in sequence.",
      color: "text-gray-800"
    };
  };

  const statusMsg = getOrderStatusMessage();

  // Dynamic Print Duration Estimator
  const getEstimatedWaitTimeSeconds = () => {
    const uncompletedJobs = jobs.filter(j => j.status !== 'completed' && j.status !== 'failed');
    if (uncompletedJobs.length === 0) return 0;

    let totalSeconds = 0;
    uncompletedJobs.forEach(j => {
      const pgs = Math.max(1, parseInt(j.pages) || 1);
      const cp = Math.max(1, parseInt(j.copies) || 1);
      const isColor = !!j.color;
      const rate = isColor ? 7 : 3; // ~7s per color page, ~3s per B&W page
      totalSeconds += (pgs * cp * rate);
    });

    return Math.max(8, totalSeconds + 4); // Add 4s spooling buffer
  };

  const getQueuePositionText = () => {
    const completed = jobs.filter(j => j.status === 'completed').length;
    const printing = jobs.filter(j => j.status === 'printing').length;
    const reprinting = jobs.filter(j => j.status === 'reprinting').length;
    const pending = jobs.filter(j => j.status === 'pending').length;

    if (completed === jobs.length && jobs.length > 0) {
      return "All Pages Ready · Collect at Counter";
    }
    if (reprinting > 0) {
      return "Reprinting Priority Queue · In Progress";
    }
    if (printing > 0) {
      return `Currently Printing Document ${completed + 1} of ${jobs.length}`;
    }
    if (pending > 0) {
      return `Position #1 in Queue · Starting shortly`;
    }
    return "Processing Print Request...";
  };

  const estSeconds = getEstimatedWaitTimeSeconds();
  const queuePosText = getQueuePositionText();

  const totalAmountPaid = jobs.reduce((sum, j) => sum + (parseFloat(j.amount) || 0), 0);
  const formattedDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  // 1-Tap WhatsApp Receipt Share
  const shareReceiptWhatsApp = () => {
    let msg = `🧾 *PrintBolt Print Receipt*\n`;
    msg += `📍 *Shop*: ${shopName || 'PrintBolt Partner Shop'}\n`;
    msg += `📅 *Date*: ${formattedDate}\n`;
    msg += `💳 *Amount Paid*: ₹${totalAmountPaid.toFixed(2)}\n`;
    msg += `-----------------------------\n`;
    jobs.forEach((j, i) => {
      msg += `📄 *${i + 1}. ${j.file_name || 'Document'}*\n`;
      msg += `   ${j.pages || 1} pgs × ${j.copies || 1} copies • ${j.color ? 'Color' : 'B&W'}\n`;
    });
    msg += `-----------------------------\n`;
    msg += `✅ *Status*: Completed / Verified\n`;
    msg += `🔗 *Self-Service Printing*: https://printbolt.store`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  // Plaintext Receipt Downloader
  const downloadReceiptText = () => {
    let receiptContent = `========================================\n`;
    receiptContent += `         PRINTBOLT PRINT RECEIPT        \n`;
    receiptContent += `========================================\n`;
    receiptContent += `Shop Name   : ${shopName || 'PrintBolt Partner Shop'}\n`;
    receiptContent += `Date & Time : ${formattedDate}\n`;
    receiptContent += `Order Ref   : ${jobId || 'N/A'}\n`;
    receiptContent += `Payment     : ONLINE (UPI / Verified)\n`;
    receiptContent += `----------------------------------------\n`;
    receiptContent += `ITEMS PRINTED:\n`;
    jobs.forEach((j, idx) => {
      receiptContent += `${idx + 1}. ${j.file_name || 'Document'}\n`;
      receiptContent += `   Pages: ${j.pages || 1} | Copies: ${j.copies || 1}\n`;
      receiptContent += `   Mode: ${j.color ? 'Full Color' : 'Black & White'}${j.duplex ? ' | Duplex' : ''}\n`;
      if (j.amount) {
        receiptContent += `   Amount: Rs. ${parseFloat(j.amount).toFixed(2)}\n`;
      }
    });
    receiptContent += `----------------------------------------\n`;
    receiptContent += `TOTAL PAID  : Rs. ${totalAmountPaid.toFixed(2)}\n`;
    receiptContent += `STATUS      : PAYMENT CONFIRMED (PAID)\n`;
    receiptContent += `========================================\n`;
    receiptContent += `Thank you for printing with PrintBolt!\n`;
    receiptContent += `Self-Service Printing: https://printbolt.store\n`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PrintBolt_Receipt_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintReceipt = () => {
    setShowReceiptModal(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <AppShell shopName={shopName} email={undefined}>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt-modal, #printable-receipt-modal * {
            visibility: visible;
          }
          #printable-receipt-modal {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 30px;
            background: white !important;
            color: black !important;
            display: block !important;
            z-index: 999999;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="flex flex-col min-h-[75vh]">
        {loading && jobs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <span className="text-sm font-semibold text-gray-500">Connecting to print queue tracker...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-red-50/20 border border-red-100 rounded-3xl">
            <AlertOctagon className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="font-extrabold text-red-800 text-lg mb-2">Queue Lost</h3>
            <p className="text-sm text-red-600/80 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={handleDone}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-6 rounded-xl transition text-sm"
            >
              Back to Shop
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between py-2 space-y-4 max-w-md mx-auto w-full">
            
            {/* 1. Global Order Status Header */}
            <div className="text-center pt-1 pb-1">
              <h2 className={`text-xl font-black ${statusMsg.color} leading-tight`}>
                {statusMsg.title}
              </h2>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                {statusMsg.desc}
              </p>
            </div>

            {/* 2. TRANSACTION RECEIPT CARD */}
            <div className="bg-white border border-gray-200/90 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="bg-blue-50 text-blue-600 p-2.5 rounded-2xl">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block">Transaction Receipt</span>
                    <span className="text-xs font-black text-gray-900 font-mono">
                      Order ID: #{jobs[0]?.id ? jobs[0].id.slice(0, 8).toUpperCase() : (jobId?.slice(0, 8).toUpperCase() || 'PB-ORDER')}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center space-x-1 bg-green-50 border border-green-200/80 text-green-700 text-[11px] font-black px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                  <span>PAID</span>
                </span>
              </div>

              {/* Receipt Summary Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-semibold text-gray-500">Shop</span>
                  <span className="font-extrabold text-gray-900">{shopName || 'PrintBolt Partner Shop'}</span>
                </div>
                
                <div className="flex justify-between items-start text-gray-600">
                  <span className="font-semibold text-gray-500">Print Type</span>
                  <div className="text-right">
                    {jobs.map((j, idx) => (
                      <div key={j.id || idx} className="font-extrabold text-gray-900 truncate max-w-[210px]">
                        {j.file_name && j.file_name !== 'Retrieving file details...' ? j.file_name : `Document ${idx + 1}`}
                        <span className="text-[10px] text-gray-500 font-bold block">
                          {j.pages || 1} pg{(j.pages || 1) > 1 ? 's' : ''} × {j.copies || 1} cpy • {j.color ? 'Color' : 'B&W'}{j.duplex ? ' • Duplex' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-gray-600 pt-2 border-t border-gray-100">
                  <span className="font-bold text-gray-700">Total Amount</span>
                  <span className="text-base font-black text-blue-600">₹{totalAmountPaid.toFixed(2)}</span>
                </div>
              </div>

              {/* Receipt Quick Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
                <button
                  onClick={shareReceiptWhatsApp}
                  className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-xs font-extrabold py-2.5 px-3 rounded-xl transition shadow-sm flex items-center justify-center space-x-1.5"
                >
                  <span>📲 WhatsApp</span>
                </button>
                <button
                  onClick={() => setShowReceiptModal(true)}
                  className="bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 text-xs font-extrabold py-2.5 px-3 rounded-xl transition border border-blue-200 flex items-center justify-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View / Print</span>
                </button>
              </div>
            </div>

            {/* 3. LIVE QUEUE TRACKER CARD */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-5 shadow-lg border border-blue-800/50 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-blue-300 uppercase">Live Queue Tracker</span>
                  <h3 className="text-base font-black mt-0.5 flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                      {estSeconds > 0 && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${estSeconds > 0 ? 'bg-blue-400' : 'bg-green-400'}`}></span>
                    </span>
                    <span>{queuePosText}</span>
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-extrabold text-blue-300 uppercase block">Est. Print Time</span>
                  <span className="text-lg font-black text-white">
                    {estSeconds > 0 ? `~${estSeconds}s` : 'Ready ✅'}
                  </span>
                </div>
              </div>

              {/* Live animated progress bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-blue-950/80 rounded-full h-2.5 overflow-hidden border border-blue-700/40">
                  <div
                    className={`h-full transition-all duration-700 rounded-full ${
                      areAllJobsFinished() ? 'bg-green-400' : 'bg-gradient-to-r from-blue-400 to-cyan-300 animate-pulse'
                    }`}
                    style={{
                      width: areAllJobsFinished()
                        ? '100%'
                        : `${Math.min(95, Math.max(20, (jobs.filter(j => j.status === 'completed').length / Math.max(1, jobs.length)) * 100))}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[11px] text-blue-200 font-semibold px-0.5">
                  <span>{jobs.filter(j => j.status === 'completed').length} of {jobs.length} file{jobs.length > 1 ? 's' : ''} printed</span>
                  <span className="font-extrabold text-white">{areAllJobsFinished() ? '100% Complete' : 'Printing at Counter'}</span>
                </div>
              </div>
            </div>

            {/* 4. DONE BUTTON */}
            <div className="pt-2">
              <button
                onClick={handleDone}
                className={`w-full text-white font-extrabold text-base py-4 rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 ${
                  areAllJobsFinished() 
                    ? 'bg-green-600 hover:bg-green-700 active:bg-green-800' 
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                }`}
              >
                <span>Done</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        )}
      </div>

      {/* INTERACTIVE PRINTABLE RECEIPT MODAL */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            
            {/* Modal Controls Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 no-print">
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-blue-600" />
                <h3 className="font-extrabold text-gray-900 text-sm">Official Print Receipt</h3>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Receipt Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-white space-y-4 text-gray-800" id="printable-receipt-modal">
              
              {/* Receipt Header */}
              <div className="text-center pb-4 border-b-2 border-dashed border-gray-200">
                <div className="inline-block bg-blue-600 text-white font-black text-xs px-2.5 py-0.5 rounded-md mb-2">
                  PRINTBOLT
                </div>
                <h2 className="text-lg font-black text-gray-900 leading-none">{shopName || 'PrintBolt Partner Shop'}</h2>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-1">Self-Service Print Kiosk Receipt</span>
              </div>

              {/* Receipt Metadata */}
              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-b border-gray-100">
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase block">Date & Time</span>
                  <span className="font-bold text-gray-700 text-[11px]">{formattedDate}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block">Payment Status</span>
                  <span className="font-black text-green-600 text-[11px] flex items-center justify-end space-x-0.5">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span>PAID (UPI Online)</span>
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3 py-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Print Specifications</span>
                <div className="divide-y divide-gray-100">
                  {jobs.map((j, idx) => (
                    <div key={j.id || idx} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-start text-xs">
                      <div className="overflow-hidden pr-3 max-w-[75%]">
                        <p className="font-extrabold text-gray-800 truncate">{j.file_name || 'Document'}</p>
                        <span className="text-[10px] text-gray-400 font-medium block">
                          {j.pages || 1} pgs × {j.copies || 1} copies • {j.color ? 'Full Color' : 'B&W'}{j.duplex ? ' • Duplex' : ''}
                        </span>
                      </div>
                      <span className="font-black text-gray-900 flex-shrink-0">
                        {j.amount ? `₹${parseFloat(j.amount).toFixed(2)}` : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals */}
              <div className="border-t-2 border-dashed border-gray-200 pt-3 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                  <span>Total Items</span>
                  <span>{jobs.length} file{jobs.length > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-black text-gray-900 pt-1 border-t border-gray-100">
                  <span>Total Paid (INR)</span>
                  <span className="text-base text-blue-600">₹{totalAmountPaid.toFixed(2)}</span>
                </div>
              </div>

              {/* Privacy & Auth Footer */}
              <div className="text-center pt-4 border-t border-gray-100 space-y-1">
                <p className="text-[9px] text-gray-400 font-medium">
                  🔒 Document files are automatically deleted after 5 minutes for privacy.
                </p>
                <p className="text-[9px] text-gray-400 font-semibold">
                  Thank you for printing with PrintBolt!
                </p>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex space-x-2 no-print">
              <button
                onClick={downloadReceiptText}
                className="flex-1 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold py-2.5 px-3 rounded-xl transition text-xs flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-gray-500" />
                <span>Download .txt</span>
              </button>
              <button
                onClick={handlePrintReceipt}
                className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2.5 px-3 rounded-xl transition text-xs flex items-center justify-center space-x-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </AppShell>
  );
}
