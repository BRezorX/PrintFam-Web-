'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, 
  FileText, 
  CheckCircle2, 
  Zap, 
  Printer, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Laptop, 
  Smartphone, 
  FileCheck, 
  CreditCard, 
  ShieldCheck, 
  Copy,
  Upload,
  Check,
  AlertCircle,
  HardDrive,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface SampleDoc {
  id: string;
  name: string;
  type: string;
  fileExt: 'pdf' | 'docx';
  pages: number;
  sizeKb: string;
  defaultColorMode: 'B&W' | 'Color';
  defaultDuplex: boolean;
  tag: string;
}

const SAMPLE_DOCUMENTS: SampleDoc[] = [
  {
    id: 'doc-1',
    name: 'College_Project_Final.pdf',
    type: 'PDF Document',
    fileExt: 'pdf',
    pages: 14,
    sizeKb: '2.4 MB',
    defaultColorMode: 'B&W',
    defaultDuplex: true,
    tag: 'Academic Assignment',
  },
  {
    id: 'doc-2',
    name: 'Rental_Agreement_Legal.pdf',
    type: 'Legal PDF Contract',
    fileExt: 'pdf',
    pages: 6,
    sizeKb: '840 KB',
    defaultColorMode: 'B&W',
    defaultDuplex: true,
    tag: 'Legal Contract',
  },
  {
    id: 'doc-3',
    name: 'Product_Catalog_Brochure.pdf',
    type: 'High-Res Presentation',
    fileExt: 'pdf',
    pages: 4,
    sizeKb: '4.1 MB',
    defaultColorMode: 'Color',
    defaultDuplex: false,
    tag: 'Business Brochure',
  },
];

interface PrintBoltMiniExperienceProps {
  onClose?: () => void;
}

export const PrintBoltMiniExperience: React.FC<PrintBoltMiniExperienceProps> = ({ onClose }) => {
  // Current active workflow stage (1 to 6)
  // 1: Scan Shop Counter QR
  // 2: Upload Document Only
  // 3: Online UPI Payment
  // 4: Payment Completed
  // 5: Lightning Sync
  // 6: Automated Laser Print
  const [stage, setStage] = useState<number>(1);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);

  // Selected document state
  const [selectedDoc, setSelectedDoc] = useState<SampleDoc>(SAMPLE_DOCUMENTS[0]);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  // Stage 1: QR Scanning animation state
  const [qrScanStatus, setQrScanStatus] = useState<'aligning' | 'scanning' | 'scanned'>('scanning');

  // Stage 2: Print options & pricing in INR (₹)
  const [colorMode, setColorMode] = useState<'B&W' | 'Color'>(SAMPLE_DOCUMENTS[0].defaultColorMode);
  const [isDuplex, setIsDuplex] = useState<boolean>(SAMPLE_DOCUMENTS[0].defaultDuplex);
  const [copies, setCopies] = useState<number>(1);

  // Stage 3 & 4: Online Payment state
  const [paymentMethod, setPaymentMethod] = useState<'upi_qr' | 'gpay' | 'phonepe' | 'paytm'>('upi_qr');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('UPI/2026/8391048291');

  // Stage 5: Sync state
  const [jobToken, setJobToken] = useState<string>('#PB-629');

  // Stage 6: Physical laser printing animation
  const [printProgress, setPrintProgress] = useState<number>(0);
  const [printedPagesCount, setPrintedPagesCount] = useState<number>(0);
  const [isPrintFinished, setIsPrintFinished] = useState<boolean>(false);

  // Pricing calculation in INR (₹)
  const perPageRate = colorMode === 'Color' ? 10 : 2;
  const duplexDiscount = isDuplex ? 0.85 : 1.0;
  const totalPrice = Math.round(selectedDoc.pages * perPageRate * duplexDiscount * copies);

  // Document selection
  const handleSelectDoc = (doc: SampleDoc) => {
    setSelectedDoc(doc);
    setColorMode(doc.defaultColorMode);
    setIsDuplex(doc.defaultDuplex);
    setCopies(1);
    setIsUploaded(true);
    setPrintProgress(0);
    setPrintedPagesCount(0);
    setIsPrintFinished(false);
  };

  // Reset entire simulator
  const handleReset = () => {
    setIsPlayingAuto(false);
    setStage(1);
    setQrScanStatus('scanning');
    setIsUploaded(false);
    setIsProcessingPayment(false);
    setPrintProgress(0);
    setPrintedPagesCount(0);
    setIsPrintFinished(false);
  };

  // Trigger QR scan lock & auto proceed to Upload
  const handleTriggerQrSuccess = () => {
    setQrScanStatus('scanned');
    setTimeout(() => {
      setStage(2);
      setIsUploaded(true);
    }, 900);
  };

  // Process Online UPI Payment
  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    const mockTxn = `UPI/2026/${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    setTransactionId(mockTxn);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setStage(4); // Move to Payment Completed
    }, 1200);
  };

  // Proceed from Payment Completed to Lightning Sync
  const handleProceedToSync = () => {
    setJobToken(`#PB-${Math.floor(100 + Math.random() * 899)}`);
    setStage(5);

    // Auto-advance to printer after sync
    setTimeout(() => {
      setStage(6);
    }, 1400);
  };

  // Stage 6: Animate physical laser printing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (stage === 6) {
      setPrintProgress(0);
      setPrintedPagesCount(0);
      setIsPrintFinished(false);

      const totalTargetPages = selectedDoc.pages * copies;
      const durationMs = 3200;
      const tickRate = 80;
      const step = 100 / (durationMs / tickRate);

      interval = setInterval(() => {
        setPrintProgress((prev) => {
          const next = prev + step;
          if (next >= 100) {
            if (interval) clearInterval(interval);
            setPrintedPagesCount(totalTargetPages);
            setIsPrintFinished(true);
            return 100;
          }
          const currentPages = Math.min(
            totalTargetPages,
            Math.floor((next / 100) * totalTargetPages) + 1
          );
          setPrintedPagesCount(currentPages);
          return next;
        });
      }, tickRate);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage, selectedDoc.pages, copies]);

  // Autoplay progression watcher
  useEffect(() => {
    if (!isPlayingAuto) return;

    if (stage === 1) {
      const t = setTimeout(() => {
        handleTriggerQrSuccess();
      }, 1200);
      return () => clearTimeout(t);
    }

    if (stage === 2) {
      const t = setTimeout(() => {
        setStage(3);
      }, 2000);
      return () => clearTimeout(t);
    }

    if (stage === 3 && !isProcessingPayment) {
      const t = setTimeout(() => {
        handleProcessPayment();
      }, 1500);
      return () => clearTimeout(t);
    }

    if (stage === 4) {
      const t = setTimeout(() => {
        handleProceedToSync();
      }, 1600);
      return () => clearTimeout(t);
    }

    if (stage === 6 && isPrintFinished) {
      const t = setTimeout(() => {
        setIsPlayingAuto(false);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [isPlayingAuto, stage, isProcessingPayment, isPrintFinished]);

  const toggleAutoPlay = () => {
    if (isPlayingAuto) {
      setIsPlayingAuto(false);
    } else {
      if (stage === 6 && isPrintFinished) {
        handleReset();
      }
      setIsPlayingAuto(true);
      if (stage === 1) {
        handleTriggerQrSuccess();
      }
    }
  };

  const STAGES_LIST = [
    { num: 1, label: '1. Scan Shop QR', sub: 'Counter Standee', icon: QrCode },
    { num: 2, label: '2. Upload Document', sub: 'PDF / Docs only', icon: FileText },
    { num: 3, label: '3. Online Payment', sub: 'UPI / GPay / PhonePe', icon: CreditCard },
    { num: 4, label: '4. Payment Verified', sub: 'Instant settlement', icon: CheckCircle2 },
    { num: 5, label: '5. Lightning Sync', sub: 'Zero-touch queue transfer', icon: Zap },
    { num: 6, label: '6. Automated Print', sub: 'Laser output & receipt', icon: Printer },
  ];

  return (
    <div id="printbolt-interactive-experience" className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-blue-900/10 overflow-hidden">
      
      {/* Top Experience Control Bar */}
      <div className="bg-gradient-to-r from-[#0A1128] via-[#0F172A] to-[#1E293B] p-4 sm:p-6 text-white border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Interactive Workflow Experience</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Live Walkthrough: QR Scan to Automated Laser Print
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Follow a customer's journey: Scan shop standee QR → Upload Document → 100% Online UPI Payment → Shopkeeper PC Queue → Instant Hardware Print.
            </p>
          </div>

          {/* Autoplay, Reset & Close Controls */}
          <div className="flex items-center gap-2.5 self-start md:self-center flex-wrap">
            <button
              type="button"
              id="btn-toggle-mini-experience-autoplay"
              onClick={toggleAutoPlay}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isPlayingAuto
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isPlayingAuto ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Auto-Play</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Auto-Play Full Demo</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="btn-reset-mini-experience"
              onClick={handleReset}
              title="Reset Experience"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {onClose && (
              <button
                type="button"
                id="btn-close-mini-experience"
                onClick={onClose}
                className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700"
              >
                Exit Simulator
              </button>
            )}
          </div>
        </div>

        {/* 6-Stage Interactive Step Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-6">
          {STAGES_LIST.map((s) => {
            const Icon = s.icon;
            const isCurrent = stage === s.num;
            const isPassed = stage > s.num;

            return (
              <button
                key={`stage-btn-${s.num}`}
                type="button"
                id={`stage-nav-btn-${s.num}`}
                onClick={() => {
                  setStage(s.num);
                  if (s.num === 1) setQrScanStatus('scanning');
                }}
                className={`text-left p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                  isCurrent
                    ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/50'
                    : isPassed
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isCurrent
                    ? 'bg-blue-500 text-white'
                    : isPassed
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold leading-tight truncate">
                    {s.label}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">
                    {s.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage Arena */}
      <div className="p-4 sm:p-8 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto">

          {/* STAGE VIEWS */}
          <div className="min-h-[440px] relative">
            <AnimatePresence mode="wait">

              {/* STAGE 1: MOBILE SCANNING SHOP'S COUNTER STAND-EE QR */}
              {stage === 1 && (
                <motion.div
                  key="stage-1-qr-view"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    
                    {/* Left: Mobile Viewfinder Scanning Shop QR */}
                    <div className="relative mx-auto w-full max-w-[280px] aspect-[9/16] bg-slate-950 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col justify-between overflow-hidden">
                      {/* Phone Notch */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-full z-30" />

                      {/* Header */}
                      <div className="relative z-20 pt-4 flex items-center justify-between text-white text-[11px] font-semibold px-2">
                        <span className="flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                          <span>Phone Camera</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/80 text-[10px] font-bold animate-pulse">
                          SCANNING
                        </span>
                      </div>

                      {/* Center Viewfinder focusing on Shop Standee QR */}
                      <div className="relative z-10 my-auto flex flex-col items-center justify-center p-2">
                        
                        {/* The Shop Counter Standee Mockup inside camera view */}
                        <div className="relative w-48 h-56 bg-slate-900 rounded-2xl p-3 border-2 border-slate-700 shadow-xl overflow-hidden flex flex-col items-center justify-between">
                          
                          {/* Animated Laser Scanning Beam */}
                          {qrScanStatus === 'scanning' && (
                            <motion.div
                              animate={{ y: [0, 180, 0] }}
                              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_rgba(34,211,238,1)] z-20"
                            />
                          )}

                          {/* Scanner Reticles */}
                          <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400" />
                          <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400" />
                          <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400" />
                          <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400" />

                          {/* Shop Standee Graphic */}
                          <div className="text-center pt-1">
                            <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1">
                              <Zap className="w-3 h-3 fill-current" />
                              <span>PrintBolt Counter QR</span>
                            </div>
                            <div className="text-[9px] text-slate-400">Scan to Print Instantly</div>
                          </div>

                          {/* QR Code Container */}
                          <div className="w-24 h-24 bg-white rounded-xl p-2 shadow-md border-2 border-white/80 flex items-center justify-center my-1 relative">
                            <QrCode className="w-full h-full text-slate-950" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-xs">
                                <Zap className="w-3.5 h-3.5 fill-current" />
                              </div>
                            </div>
                          </div>

                          <div className="text-[9px] text-slate-400 text-center pb-1">
                            Shop ID: <span className="text-white font-mono font-bold">#DELHI-XEROX-01</span>
                          </div>

                          {/* Scan locked popup overlay */}
                          {qrScanStatus === 'scanned' && (
                            <motion.div
                              initial={{ scale: 0.6, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="absolute inset-0 bg-emerald-600/95 backdrop-blur-xs flex flex-col items-center justify-center text-white z-30 p-2 text-center"
                            >
                              <CheckCircle2 className="w-10 h-10 mb-1.5 animate-bounce" />
                              <span className="text-xs font-black">SHOP QR RECOGNIZED!</span>
                              <span className="text-[10px] text-emerald-100 mt-0.5">Opening instant web upload portal...</span>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Viewfinder Bottom Banner */}
                      <div className="relative z-20 pb-2 text-center">
                        <div className="text-[10px] text-slate-400">
                          Align camera with shop standee
                        </div>
                      </div>
                    </div>

                    {/* Right: Step Details */}
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
                        <QrCode className="w-3.5 h-3.5" />
                        <span>STAGE 1: NO APP DOWNLOAD REQUIRED</span>
                      </div>
                      <h4 className="text-2xl font-black text-[#0A1128] tracking-tight mb-3">
                        Customer Scans Shop Counter QR
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        Customers simply point their default phone camera at your counter standee. No software to install, no WhatsApp sharing, and no USB drives needed.
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-700">
                            <strong>Instant Web Portal:</strong> Launches directly in Chrome, Safari, or mobile browser within 1.2 seconds.
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-700">
                            <strong>No Contact Sharing:</strong> Customers never need your phone number and you never receive personal message spam.
                          </div>
                        </div>
                      </div>

                      {/* Interactive Button */}
                      <button
                        type="button"
                        id="btn-trigger-qr-scan"
                        onClick={handleTriggerQrSuccess}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Simulate Shop QR Scan & Enter Portal</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* STAGE 2: UPLOAD DOCUMENT ONLY (NO PICTURES) */}
              {stage === 2 && (
                <motion.div
                  key="stage-2-doc-upload-view"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Mobile Web Portal Upload UI */}
                    <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-5 border border-slate-200">
                      
                      {/* Shop Connection Header */}
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                            PB
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">Connected: Apex Digital Xerox</div>
                            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Live Counter Hub</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                          Web App
                        </span>
                      </div>

                      {/* Supported Format Alert */}
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-800 text-[11px] mb-4">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span><strong>Document Upload Only:</strong> Supports PDF, DOCX, & ODT. (Photo/image uploads coming soon).</span>
                      </div>

                      {/* Interactive Document Dropzone Mock */}
                      <div className="border-2 border-dashed border-blue-300 rounded-2xl p-4 bg-white text-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-2">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div className="text-xs font-bold text-slate-800 mb-0.5">
                          {selectedDoc.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mb-3">
                          {selectedDoc.type} • {selectedDoc.sizeKb} • {selectedDoc.pages} Pages detected
                        </div>

                        {/* Presets to switch sample file */}
                        <div className="pt-2 border-t border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                            Choose Sample Document:
                          </div>
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {SAMPLE_DOCUMENTS.map((doc) => (
                              <button
                                key={doc.id}
                                type="button"
                                onClick={() => handleSelectDoc(doc)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                                  selectedDoc.id === doc.id
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                {doc.name} ({doc.pages}p)
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Print Settings: Color & Duplex */}
                      <div className="space-y-3 mb-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">
                            Color Option
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setColorMode('B&W')}
                              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                                colorMode === 'B&W'
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>Black & White</span>
                              <span className={colorMode === 'B&W' ? 'text-blue-100' : 'text-slate-500'}>
                                ₹2/pg
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setColorMode('Color')}
                              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                                colorMode === 'Color'
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>Full Color</span>
                              <span className={colorMode === 'Color' ? 'text-blue-100' : 'text-slate-500'}>
                                ₹10/pg
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Duplex Sides & Copies */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">
                              Print Sides
                            </label>
                            <button
                              type="button"
                              onClick={() => setIsDuplex(!isDuplex)}
                              className={`w-full p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                isDuplex 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>{isDuplex ? 'Double Sided (-15%)' : 'Single Sided'}</span>
                            </button>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">
                              Copies
                            </label>
                            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-1">
                              <button
                                type="button"
                                onClick={() => setCopies(Math.max(1, copies - 1))}
                                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold text-slate-800">
                                {copies}
                              </span>
                              <button
                                type="button"
                                onClick={() => setCopies(copies + 1)}
                                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-xs cursor-pointer flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Calculated Total in INR */}
                      <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] uppercase font-extrabold text-blue-700">
                            Total Order Price
                          </div>
                          <div className="text-[11px] text-slate-600">
                            {selectedDoc.pages * copies} pages total • {colorMode}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-black text-[#0A1128]">
                            ₹{totalPrice}
                          </div>
                          <div className="text-[9px] font-bold text-emerald-700">
                            100% Online Payment
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right: Step Guidance */}
                    <div className="lg:col-span-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
                        <span>STAGE 2: PRECISION DOCUMENT PARSER</span>
                      </div>
                      <h4 className="text-2xl font-black text-[#0A1128] tracking-tight mb-3">
                        Document Uploaded & Auto-Calculated
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        PrintBolt extracts the exact page count, dimensions, and color profiles directly in the browser sandbox. No pictures or image formats are allowed yet, ensuring crisp, professional document prints every time.
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-700">
                            <strong>Transparent Pricing in INR:</strong> Calculated automatically using the shop's defined rates (e.g. ₹2/B&W, ₹10/Color).
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-700">
                            <strong>Zero WhatsApp Compression:</strong> Documents retain 100% vector clarity and crisp margins without formatting shifts.
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setStage(1)}
                          className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to QR</span>
                        </button>

                        <button
                          type="button"
                          id="btn-proceed-to-payment"
                          onClick={() => setStage(3)}
                          className="flex-1 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Proceed to Online Payment (₹{totalPrice})</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* STAGE 3: ONLINE PAYMENT PAGE (UPI QR & APPS ONLY) */}
              {stage === 3 && (
                <motion.div
                  key="stage-3-payment-view"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Left: Interactive UPI Payment Interface */}
                    <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl">
                      
                      {/* Merchant Header */}
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                        <div>
                          <div className="text-xs font-black text-white">Apex Digital Xerox & Prints</div>
                          <div className="text-[10px] text-emerald-400 font-mono">Merchant UPI ID: apexprints@upi</div>
                        </div>
                        <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          VERIFIED
                        </div>
                      </div>

                      {/* Total Amount in INR (₹) */}
                      <div className="text-center py-2 mb-4 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Payable Amount</span>
                        <div className="text-3xl font-black text-emerald-400 tracking-tight mt-0.5">
                          ₹{totalPrice}.00
                        </div>
                        <span className="text-[10px] text-slate-400">Order: {selectedDoc.name} ({selectedDoc.pages * copies} pgs)</span>
                      </div>

                      {/* Dynamic UPI QR Code Scan Area */}
                      <div className="bg-white rounded-2xl p-4 text-slate-900 mb-4 flex flex-col items-center">
                        <div className="text-[11px] font-black text-slate-800 mb-2 flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-blue-600" />
                          <span>Scan with Any UPI App to Pay</span>
                        </div>
                        
                        <div className="w-36 h-36 bg-slate-50 border-2 border-slate-200 rounded-xl p-2 relative flex items-center justify-center">
                          <QrCode className="w-full h-full text-slate-900" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                              ₹
                            </div>
                          </div>
                        </div>

                        {/* Supported Apps */}
                        <div className="flex items-center justify-center gap-2 mt-3 text-[10px] font-bold text-slate-500">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md">Google Pay</span>
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md">PhonePe</span>
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md">Paytm</span>
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md">BHIM</span>
                        </div>
                      </div>

                      {/* Pay Button */}
                      <button
                        type="button"
                        id="btn-simulate-online-pay"
                        onClick={handleProcessPayment}
                        disabled={isProcessingPayment}
                        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>Verifying Bank UPI Gateway...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Simulate Instant UPI Payment (₹{totalPrice})</span>
                          </>
                        )}
                      </button>

                    </div>

                    {/* Right: Explanatory Details */}
                    <div className="lg:col-span-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                        <span>STAGE 3: 100% ONLINE PAYMENT</span>
                      </div>
                      <h4 className="text-2xl font-black text-[#0A1128] tracking-tight mb-3">
                        Instant Online UPI Payment
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        PrintBolt operates exclusively on secure online payments in Indian Rupees (INR). Customers pay directly via Google Pay, PhonePe, Paytm, or BHIM.
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-700">
                            <strong>Zero Payment Disputes:</strong> Exact digital billing verified in real time, avoiding all manual calculation errors and payment mismatches.
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-700">
                            <strong>Automated Settlement:</strong> Money credits straight into your shop bank account with verified UPI reference codes.
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setStage(2)}
                          className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Change Settings</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleProcessPayment}
                          className="flex-1 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <span>Confirm & Pay ₹{totalPrice}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                  </div>
                </motion.div>
              )}

              {/* STAGE 4: PAYMENT COMPLETED SECTION */}
              {stage === 4 && (
                <motion.div
                  key="stage-4-payment-completed-view"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm"
                >
                  <div className="max-w-md mx-auto bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 sm:p-8 border border-emerald-200 text-center shadow-lg relative overflow-hidden">
                    
                    {/* Top Confetti / Sparkle glow */}
                    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
                    
                    {/* Success Icon */}
                    <motion.div
                      initial={{ scale: 0.2, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/40 mb-4"
                    >
                      <Check className="w-9 h-9 stroke-[3]" />
                    </motion.div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>100% ONLINE PAYMENT VERIFIED</span>
                    </div>

                    <h4 className="text-2xl font-black text-[#0A1128] tracking-tight">
                      Payment Received!
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 mb-6">
                      Bank settlement confirmed via UPI Gateway
                    </p>

                    {/* Receipt Details Card */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-200 text-left space-y-2 mb-6 shadow-xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Amount Paid (INR):</span>
                        <span className="text-sm font-black text-emerald-600">₹{totalPrice}.00</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Payment Mode:</span>
                        <span className="font-bold text-slate-800">Online UPI (Instant)</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Transaction Ref:</span>
                        <span className="font-mono text-[10px] text-slate-600 truncate max-w-[160px]">{transactionId}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                        <span className="text-slate-500">Document:</span>
                        <span className="font-bold text-slate-800 truncate max-w-[170px]">{selectedDoc.name}</span>
                      </div>
                    </div>

                    {/* Next Action Button */}
                    <button
                      type="button"
                      id="btn-proceed-to-sync-step"
                      onClick={handleProceedToSync}
                      className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-black text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Proceed to Lightning Sync & Print Queue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STAGE 5: LIGHTNING QUEUE TRANSMISSION */}
              {stage === 5 && (
                <motion.div
                  key="stage-5-sync-view"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm"
                >
                  <div className="text-center max-w-xl mx-auto mb-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                      <Zap className="w-3.5 h-3.5 fill-current text-blue-600" />
                      <span>STAGE 5: HIGH-SPEED ENCRYPTED DISPATCH</span>
                    </div>
                    <h4 className="text-2xl font-black text-[#0A1128] tracking-tight">
                      Paid Document Synced to Shop PC in 0.4s
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Payment verified! Encrypted print spooler token dispatched to the shopkeeper's desktop.
                    </p>
                  </div>

                  {/* Beam Animation */}
                  <div className="relative p-6 sm:p-8 bg-slate-950 rounded-3xl text-white overflow-hidden mb-6">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      
                      {/* Left: Customer Phone */}
                      <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-900 border border-slate-800">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
                          <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-bold text-white">Customer Phone</span>
                        <span className="text-[10px] text-emerald-400 mt-0.5">Paid ₹{totalPrice} via UPI</span>
                        <div className="mt-3 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                          Token {jobToken}
                        </div>
                      </div>

                      {/* Middle: Lightning Beam */}
                      <div className="relative flex flex-col items-center justify-center py-4">
                        <div className="w-full h-1 bg-slate-800 rounded-full relative overflow-hidden">
                          <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.0, repeat: Infinity, ease: 'linear' }}
                            className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,1)]"
                          />
                        </div>

                        <motion.div
                          animate={{ 
                            scale: [1, 1.25, 1],
                            rotate: [0, 8, -8, 0]
                          }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                          className="my-3 w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.8)]"
                        >
                          <Zap className="w-6 h-6 fill-current" />
                        </motion.div>

                        <div className="text-[11px] font-extrabold text-cyan-300 font-mono tracking-wider">
                          ZERO USB INFECTION
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Local Hub WebSocket Transfer
                        </div>
                      </div>

                      {/* Right: Shop PC Dashboard */}
                      <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-900 border border-slate-800">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/30">
                          <Laptop className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-bold text-white">Shopkeeper PC</span>
                        <span className="text-[10px] text-emerald-400 mt-0.5">Paid Job Enqueued!</span>
                        <div className="mt-3 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                          Ready for Laser Output
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <HardDrive className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          Shop Spooler: Job Approved & Pre-Paid
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {selectedDoc.name} • {selectedDoc.pages * copies} pgs • Paid ₹{totalPrice} via UPI
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      id="btn-proceed-to-laser-print"
                      onClick={() => setStage(6)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Start Physical Laser Printing</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STAGE 6: AUTOMATED PHYSICAL PRINTING & COLLECTION */}
              {stage === 6 && (
                <motion.div
                  key="stage-6-laser-print-view"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Left: Printer Animation */}
                    <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden flex flex-col items-center">
                      
                      {/* Printer LED Banner */}
                      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] font-mono">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            isPrintFinished ? 'bg-emerald-400 animate-none' : 'bg-amber-400 animate-ping'
                          }`} />
                          <span className="text-slate-300 font-bold">
                            {isPrintFinished ? 'PRINTER READY' : 'AUTOMATED PRINT IN PROGRESS'}
                          </span>
                        </div>
                        <span className="text-cyan-400 font-bold">
                          {printedPagesCount} / {selectedDoc.pages * copies} pgs
                        </span>
                      </div>

                      {/* Printer Body Mockup */}
                      <div className="relative w-full max-w-[320px] my-6">
                        
                        {/* Paper Input Tray */}
                        <div className="mx-auto w-48 h-8 bg-slate-800 rounded-t-xl border-t border-x border-slate-700 relative overflow-hidden flex items-end justify-center">
                          <div className="w-40 h-6 bg-white rounded-t-sm shadow-xs -mb-1 opacity-90" />
                        </div>

                        {/* Main Printer Chassis */}
                        <div className="w-full bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-2xl relative">
                          
                          {/* Printer LCD Status */}
                          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-700 mb-3">
                            <div className="flex items-center gap-2">
                              <Printer className="w-4 h-4 text-blue-400" />
                              <span className="text-xs font-bold text-white">HP LaserJet Enterprise</span>
                            </div>
                            <div className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                              {colorMode} • A4
                            </div>
                          </div>

                          {/* Paper Output Slot & Moving Printed Page */}
                          <div className="relative w-full h-32 bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden flex flex-col items-center justify-start">
                            
                            {/* Animated Print Laser head */}
                            {!isPrintFinished && (
                              <motion.div
                                animate={{ x: [-80, 80, -80] }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute top-1 w-16 h-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-20"
                              />
                            )}

                            {/* Emerging Printed Document */}
                            <motion.div
                              animate={{ y: [0, 8, 16] }}
                              transition={{ duration: 0.5, repeat: isPrintFinished ? 0 : Infinity }}
                              className="w-44 bg-white text-slate-900 rounded-md p-2.5 shadow-md relative z-10 text-[8px]"
                            >
                              <div className="flex items-center justify-between pb-1 border-b border-slate-200 mb-1">
                                <span className="font-extrabold text-blue-700 truncate">{selectedDoc.name}</span>
                                <span className="text-slate-400">pg {printedPagesCount}</span>
                              </div>
                              <div className="space-y-1">
                                <div className="h-1.5 w-full bg-slate-200 rounded-xs" />
                                <div className="h-1.5 w-4/5 bg-slate-200 rounded-xs" />
                                <div className="h-1.5 w-2/3 bg-slate-200 rounded-xs" />
                                <div className="h-1.5 w-3/4 bg-slate-200 rounded-xs" />
                              </div>
                            </motion.div>

                            {/* Stacked finished output tray */}
                            <div className="absolute bottom-1 w-48 h-3 bg-slate-200 rounded-xs border-t border-slate-300 shadow-sm" />
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                              <span>Laser Engine Processing</span>
                              <span className="font-bold text-white">{Math.round(printProgress)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-150"
                                style={{ width: `${printProgress}%` }}
                              />
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Success banner when finished */}
                      {isPrintFinished && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-full p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>All {selectedDoc.pages * copies} Pages Printed & Ready for Collection!</span>
                        </motion.div>
                      )}

                    </div>

                    {/* Right: Final Overview & Replay */}
                    <div className="lg:col-span-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
                        <Printer className="w-3.5 h-3.5 text-emerald-600" />
                        <span>STAGE 6: TOUCHLESS EXECUTION</span>
                      </div>
                      <h4 className="text-2xl font-black text-[#0A1128] tracking-tight mb-3">
                        Automated Laser Printing & Completed Job
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        The entire workflow finished without the shopkeeper touching WhatsApp, opening third-party software, or worrying about loose change and manual calculations.
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                          <div className="font-black text-slate-900">Summary of this Job:</div>
                          <div className="text-slate-600"><strong>Document:</strong> {selectedDoc.name} ({selectedDoc.pages * copies} pgs)</div>
                          <div className="text-slate-600"><strong>Mode:</strong> {colorMode} • {isDuplex ? 'Double Sided' : 'Single Sided'}</div>
                          <div className="text-slate-600"><strong>Online Payment:</strong> ₹{totalPrice}.00 (UPI Settled)</div>
                          <div className="text-slate-600"><strong>Turnaround Time:</strong> 18 seconds total</div>
                        </div>
                      </div>

                      {/* Control Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          id="btn-replay-mini-experience"
                          onClick={handleReset}
                          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer transition-all"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Replay Experience from QR Scan</span>
                        </button>

                        {onClose && (
                          <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                          >
                            Close Experience
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>

    </div>
  );
};

