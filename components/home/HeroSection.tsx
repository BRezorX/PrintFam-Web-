'use client';
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  QrCode, 
  Printer, 
  Smartphone, 
  FileText, 
  Sparkles,
  Phone,
  ShieldCheck,
  Cpu,
  RefreshCw
} from 'lucide-react';

interface HeroSectionProps {
  onOpenCustomerSimulator: () => void;
  onScrollToDashboard: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenCustomerSimulator,
  onScrollToDashboard,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);
  const [activeFileName, setActiveFileName] = useState('College_Project_Final.pdf');

  // Periodic automatic simulation so the hero scene stays delightfully lively
  useEffect(() => {
    const timer = setInterval(() => {
      triggerPrintSimulation();
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const triggerPrintSimulation = () => {
    if (isSending) return;
    setIsSending(true);
    setPrintSuccess(false);

    const files = [
      'College_Project_Final.pdf',
      'Govt_ID_Card_Front.pdf',
      'Architecture_Plan_V2.pdf',
      'Invoice_March_2026.pdf',
    ];
    setActiveFileName(files[Math.floor(Math.random() * files.length)]);

    setTimeout(() => {
      setIsSending(false);
      setPrintSuccess(true);
      setTimeout(() => {
        setPrintSuccess(false);
      }, 3500);
    }, 2200);
  };

  return (
    <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
      {/* Background Ambient Pastel Glow Spots */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-48 right-10 w-[28rem] h-[28rem] bg-indigo-400/12 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Subtle Floating Micro Lightning Bolts */}
      <div className="absolute top-24 right-16 text-blue-300/40 pointer-events-none hidden lg:block animate-float">
        <Zap className="w-8 h-8 fill-blue-400/20 text-blue-400" />
      </div>
      <div className="absolute top-96 left-8 text-indigo-300/30 pointer-events-none hidden lg:block animate-float-delayed">
        <Zap className="w-6 h-6 fill-indigo-400/20 text-indigo-400" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Reassurance */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Dual Pill-Tag Badges */}
            <div className="inline-flex items-center gap-2 p-1.5 px-3.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm text-xs sm:text-sm font-semibold text-slate-700 mb-6">
              <span className="flex items-center gap-1.5 text-blue-600">
                <Cpu className="w-3.5 h-3.5" />
                Works with your existing PC
              </span>
              <span className="text-slate-300 font-normal">|</span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                No new hardware needed
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0A1128] leading-[1.08] mb-6">
              YOUR PRINT SHOP, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                UPGRADED.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed mb-8">
              Turn your existing PC into a smart, automated print hub without buying new hardware or hiring extra staff. Customers scan your counter QR code, upload files directly, and jobs queue up ready to print.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-8">
              <a
                href="https://wa.me/916000061991?text=Hi%20PrintBolt%20team,%20I%20want%20to%20upgrade%20my%20print%20shop."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-sm sm:text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>WhatsApp Us (+91 60000 61991)</span>
              </a>

              <button
                type="button"
                onClick={onOpenCustomerSimulator}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#0A1128] font-semibold text-sm sm:text-base border border-slate-200/80 shadow-md shadow-slate-200/50 hover:shadow-lg hover:border-blue-300 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <QrCode className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                <span>Try Customer Upload Demo</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Reassurance Micro-Badges */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-600 pt-3 border-t border-slate-200/70">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Under 45-min PC setup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Zero pendrive virus risks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>No customer app download</span>
              </div>
            </div>

          </div>

          {/* Right Column: Stylized Isometric 3D Scene */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Outer card container with soft neumorphic styling */}
            <div className="relative w-full max-w-lg aspect-[4/3.3] sm:aspect-[4/3] rounded-3xl bg-gradient-to-b from-white/95 to-slate-50/80 backdrop-blur-xl border border-white/80 p-6 shadow-2xl shadow-blue-900/10 flex items-center justify-center overflow-hidden">
              
              {/* Soft radial backdrop illumination */}
              <div className="absolute inset-0 bg-radial from-blue-100/60 via-transparent to-transparent opacity-80" />

              {/* Floating Tooltip Badge above the phone */}
              <div className="absolute top-4 left-6 sm:left-8 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-md border border-slate-200 text-xs font-bold text-slate-800 animate-float">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                <span>Scan shop QR to upload</span>
                <span className="text-blue-500 text-sm">👉</span>
              </div>

              {/* Interactive scene trigger button */}
              <button
                type="button"
                onClick={triggerPrintSimulation}
                title="Click to simulate mobile to printer transmission"
                className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Send Test Print</span>
              </button>

              {/* 3D Isometric Composition */}
              <div className="relative w-full h-full flex items-center justify-between px-2 sm:px-6 pt-4">
                
                {/* 1. Dark Smartphone (Floating & Angled) */}
                <div 
                  onClick={triggerPrintSimulation}
                  className="relative z-20 cursor-pointer group transition-transform duration-300 hover:scale-105"
                  title="Click to send test print"
                >
                  {/* Phone body */}
                  <div className="w-28 sm:w-32 h-52 sm:h-60 rounded-[28px] bg-[#0A1128] p-2 shadow-2xl shadow-slate-900/40 border-2 border-slate-700/80 transform -rotate-6 transition-all duration-500">
                    
                    {/* Screen bevel & Dynamic Island */}
                    <div className="w-full h-full rounded-[22px] bg-slate-900 overflow-hidden flex flex-col justify-between p-2 relative">
                      
                      {/* Dynamic Island */}
                      <div className="w-10 h-3 bg-black rounded-full mx-auto mb-1 flex items-center justify-end px-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      </div>

                      {/* Screen Content: PrintBolt QR & File Upload Preview */}
                      <div className="flex-1 flex flex-col items-center justify-center gap-1.5 text-center px-1">
                        <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-sm flex items-center justify-center">
                          {/* Mini QR code pattern */}
                          <div className="grid grid-cols-3 gap-0.5 w-full h-full bg-slate-900 p-0.5 rounded">
                            <div className="bg-white rounded-xs" />
                            <div className="bg-slate-900" />
                            <div className="bg-white rounded-xs" />
                            <div className="bg-blue-400" />
                            <div className="bg-white rounded-xs" />
                            <div className="bg-slate-900" />
                            <div className="bg-white rounded-xs" />
                            <div className="bg-slate-900" />
                            <div className="bg-emerald-400" />
                          </div>
                        </div>

                        <div className="text-[9px] font-bold text-white tracking-wide">
                          ⚡ PrintBolt Upload
                        </div>
                        <div className="text-[8px] text-blue-300 truncate max-w-[80px]">
                          {activeFileName}
                        </div>

                        <div className="w-full py-1 px-1.5 rounded-md bg-blue-600 text-white text-[8px] font-bold mt-1 shadow-sm group-hover:bg-blue-500">
                          {isSending ? 'Sending...' : '⚡ Tap to Print'}
                        </div>
                      </div>

                      {/* Home indicator bar */}
                      <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mt-1" />
                    </div>
                  </div>

                  {/* Little pointing hand indicator */}
                  <div className="absolute -bottom-3 -right-2 bg-white text-slate-800 p-1.5 rounded-full shadow-lg border border-slate-200 text-xs">
                    👆
                  </div>
                </div>

                {/* 2. Electric Blue Glowing Beam Path & Floating Document Cube */}
                <div className="relative flex-1 h-32 flex items-center justify-center px-2">
                  
                  {/* SVG Curved Glowing Beam */}
                  <svg className="w-full h-24 overflow-visible" viewBox="0 0 200 80" fill="none">
                    <defs>
                      <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.4" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Beam Glow Layer */}
                    <path
                      d="M 10 40 C 70 0, 130 80, 190 40"
                      stroke="url(#beamGradient)"
                      strokeWidth="6"
                      filter="url(#glow)"
                      strokeLinecap="round"
                    />

                    {/* Dotted fast pulse line */}
                    <path
                      d="M 10 40 C 70 0, 130 80, 190 40"
                      stroke="#93C5FD"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                      className="animate-[beamDash_2s_linear_infinite]"
                    />
                  </svg>

                  {/* Floating 3D Glowing Document / File Cube */}
                  <div 
                    className={`absolute z-30 transition-all duration-1000 ease-in-out ${
                      isSending 
                        ? 'translate-x-16 sm:translate-x-20 translate-y-3 scale-110 opacity-100' 
                        : '-translate-x-6 -translate-y-2 opacity-90'
                    }`}
                  >
                    <div className="relative p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-xl shadow-blue-500/40 border border-white/60 animate-float">
                      <FileText className="w-5 h-5 fill-white/20" />
                      <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white" />
                    </div>
                  </div>
                </div>

                {/* 3. Modern Desktop Printer */}
                <div className="relative z-20">
                  <div className="relative w-36 sm:w-44 h-36 sm:h-40 flex flex-col items-center justify-end">
                    
                    {/* Paper Feeding at Top Tray */}
                    <div className="w-24 sm:w-28 h-12 bg-white rounded-t-sm border border-slate-300 shadow-xs flex flex-col items-center p-1 transform -translate-y-1">
                      <div className="w-full h-1 bg-slate-200 rounded mb-1" />
                      <div className="w-3/4 h-1 bg-slate-200 rounded" />
                    </div>

                    {/* Printer Main Body */}
                    <div className="w-36 sm:w-44 h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-slate-800 to-[#0A1128] border-2 border-slate-700 shadow-2xl p-3 flex flex-col justify-between relative overflow-hidden">
                      
                      {/* Top Lid Accent & Logo */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[9px] font-bold tracking-wider text-slate-300">HP LASER</span>
                        </div>

                        {/* LCD Status Screen */}
                        <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[8px] font-mono text-cyan-400">
                          {isSending ? 'RECEIVING...' : printSuccess ? 'PRINTING 1/1' : 'READY'}
                        </div>
                      </div>

                      {/* Paper Output Slot */}
                      <div className="relative w-full h-8 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
                        
                        {/* Spitting out fresh paper on print */}
                        <div 
                          className={`w-24 sm:w-28 h-10 bg-white rounded-b shadow-md border border-slate-200 p-1 flex flex-col justify-between transition-all duration-700 transform ${
                            printSuccess ? 'translate-y-3 opacity-100' : 'translate-y-6 opacity-40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="w-8 h-1 bg-blue-600 rounded" />
                            <span className="text-[6px] font-bold text-slate-500">A4 • 100%</span>
                          </div>
                          <div className="space-y-0.5">
                            <div className="w-full h-0.5 bg-slate-300 rounded" />
                            <div className="w-4/5 h-0.5 bg-slate-300 rounded" />
                            <div className="w-2/3 h-0.5 bg-slate-300 rounded" />
                          </div>
                        </div>

                      </div>

                      {/* Power / Status Indicator Bar */}
                      <div className="flex items-center justify-between text-[7px] text-slate-400 pt-0.5">
                        <span>WiFi • Direct</span>
                        <span className="text-emerald-400 font-bold">Online</span>
                      </div>
                    </div>

                    {/* Printed Success Badge Alert */}
                    {printSuccess && (
                      <div className="absolute -top-4 -right-2 z-30 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-lg flex items-center gap-1 animate-bounce">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Job Received & Printed!</span>
                      </div>
                    )}

                  </div>
                </div>

              </div>

              {/* Bottom bar indicator inside the visual card */}
              <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between text-[11px] text-slate-500 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200/60">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Instant Wireless Web Upload
                </span>
                <span className="text-slate-400 font-mono">0 Pendrive Transfer</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

