'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Wrench, 
  Calculator, 
  Download, 
  Laptop, 
  Smartphone, 
  Tag, 
  LayoutDashboard, 
  Printer, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Phone,
  RefreshCw,
  Clock,
  Layers,
  FileCheck
} from 'lucide-react';
import { Navbar } from '../../components/home/Navbar';
import { PrintBoltMiniExperience } from '../../components/home/PrintBoltMiniExperience';
import { RoiCalculator } from '../../components/home/RoiCalculator';
import { Footer } from '../../components/home/Footer';
import { CustomerSimulatorModal } from '../../components/home/CustomerSimulatorModal';
import { AmbientLightning } from '../../components/home/AmbientLightning';

export default function SoftwarePage() {
  const [simulatorOpen, setSimulatorOpen] = useState(false);

  const handleJobSubmitted = (fileName: string, pageCount: number, price: number) => {
    console.log(`Software page test job: ${fileName}, ${pageCount} pages, ₹${price}`);
  };

  const setupSteps = [
    {
      number: 1,
      tag: 'STEP 1',
      title: 'Download & Install Desktop Agent',
      time: '5 Minutes',
      desc: 'Download the lightweight PrintBolt Windows executable. No complicated database configuration or technical setup needed. Installs silently in seconds on your counter PC.',
      details: [
        'Single-file lightweight executable (~14 MB)',
        'Supports Windows 10 & Windows 11 (64-bit / 32-bit)',
        'Auto-starts with Windows via Registry on boot'
      ],
      icon: Laptop,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      number: 2,
      tag: 'STEP 2',
      title: 'Auto-Detect Your Existing Printers',
      time: '3 Minutes',
      desc: 'PrintBolt automatically discovers all USB, Network, and WiFi printers installed on Windows. No new hardware or replacement printers required.',
      details: [
        'Works with HP, Canon, Epson, Brother, Ricoh, Konica',
        'Smart Routing: Separate B&W Laser vs. Color Inkjet',
        'Built-in 2-Pass Manual Duplexing for single-sided printers'
      ],
      icon: Printer,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      number: 3,
      tag: 'STEP 3',
      title: 'Configure Rates & Print Counter QR Standee',
      time: '5 Minutes',
      desc: 'Set your per-page rates in INR (B&W, Color, Duplex) and add optional volume discount tiers. One click generates your personalized counter QR standee.',
      details: [
        'Set custom base rates (e.g. ₹2.00 B&W, ₹10.00 Color)',
        'Volume discounts (e.g. 10% off for 50+ pages)',
        'Printable high-resolution QR standee for shop counter'
      ],
      icon: Tag,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      number: 4,
      tag: 'STEP 4',
      title: 'Start Receiving Zero-Touch Orders',
      time: 'Under 45 Mins Total',
      desc: 'Place the QR standee on your counter. Customers scan with their phone, select pages, pay online via UPI, and jobs automatically queue on your screen ready to print.',
      details: [
        'Customers need zero app installs (works in Safari/Chrome)',
        'Instant online UPI verification eliminates payment disputes',
        'Permanent immutable Printing Audit ledger for your accounting'
      ],
      icon: LayoutDashboard,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F6FC] text-[#0A1128] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-600 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Subtle Ambient Lightning Layer */}
      <AmbientLightning />

      {/* Top Floating Navigation Bar */}
      <Navbar onOpenDemo={() => setSimulatorOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-grow pt-28 sm:pt-36">

        {/* Page Hero Header */}
        <section className="relative pb-12 sm:pb-16 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Deep Dive & Interactive Preview</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0A1128] tracking-tight leading-[1.1] mb-5">
              Inside the PrintBolt <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                Software Experience
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-3xl mx-auto text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
              Explore the hands-on live simulation, walk through the 45-minute setup process on your existing PC, calculate your shop’s revenue boost, and inspect how zero-touch printing works.
            </p>

            {/* Quick Navigation Anchor Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl mx-auto">
              <a
                href="#simulation"
                className="px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-blue-500" />
                <span>Live Simulation</span>
              </a>
              <a
                href="#setup"
                className="px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5 text-indigo-500" />
                <span>45-Min Setup Process</span>
              </a>
              <a
                href="#roi"
                className="px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-500" />
                <span>ROI Estimator</span>
              </a>
              <a
                href="#specs"
                className="px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5 text-purple-500" />
                <span>Hardware Compatibility</span>
              </a>
            </div>

          </div>
        </section>

        {/* SECTION 1: INTERACTIVE LIVE SIMULATION (MINI EXPERIENCE) */}
        <section id="simulation" className="py-12 sm:py-16 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span>Hands-On Interactive Demo</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1128] tracking-tight">
                Test the Full Customer-to-Printer Flow
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Click through the interactive simulator below to experience each phase: customer mobile QR scan, document preview, online UPI payment, desktop queue sync, and automated printing.
              </p>
            </div>

            {/* Embedded Full Mini Experience Component */}
            <div className="relative">
              <PrintBoltMiniExperience />
            </div>

          </div>
        </section>

        {/* SECTION 2: THE 45-MINUTE SETUP PROCESS */}
        <section id="setup" className="py-14 sm:py-20 bg-white border-y border-slate-200/80 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                <span>Zero Technician Needed</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1128] tracking-tight">
                The 45-Minute Shop Setup Process
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                You do not need to buy new printers, hire an IT technician, or replace your PC. Everything works on your existing setup.
              </p>
            </div>

            {/* 4-Step Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-14">
              {setupSteps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div 
                    key={step.number}
                    className="p-6 sm:p-8 rounded-3xl bg-[#F8FAFC] border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Step Header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border ${step.badgeColor}`}>
                          {step.tag}
                        </span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {step.time}
                        </span>
                      </div>

                      {/* Title & Icon */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0A1128] leading-tight">
                          {step.title}
                        </h3>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed mb-5">
                        {step.desc}
                      </p>
                    </div>

                    {/* Bullet Points */}
                    <div className="pt-4 border-t border-slate-200/80 space-y-2">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Hardware & System Compatibility Checklist Card */}
            <div id="specs" className="p-8 rounded-3xl bg-gradient-to-r from-[#0A1128] via-[#0F172A] to-[#1E293B] text-white shadow-xl border border-slate-800">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-400/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hardware Compatibility Guarantee</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
                    Compatible with Any Printer You Already Own
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                    PrintBolt interacts with standard Windows Print Spooler APIs. If your computer can currently print a test page to your printer, PrintBolt can automate it.
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-300">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>HP LaserJet & InkTank</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Canon imageRUNNER</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Epson EcoTank</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Brother Multi-Function</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Ricoh & Konica</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Windows 10 & 11 Ready</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span>PC Requirements</span>
                  </h4>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-300 mb-6">
                    <li className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span>Operating System:</span>
                      <span className="font-bold text-white">Windows 10 / 11</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span>RAM:</span>
                      <span className="font-bold text-white">2 GB Minimum</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span>Storage:</span>
                      <span className="font-bold text-white">50 MB Free Space</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Connection:</span>
                      <span className="font-bold text-white">USB / LAN / WiFi</span>
                    </li>
                  </ul>
                  
                  <a
                    href="/downloads/PrintShopAgent.exe"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Desktop Agent (v1.4.49)</span>
                  </a>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: ROI & EFFICIENCY ESTIMATOR */}
        <section id="roi" className="relative">
          <RoiCalculator />
        </section>

        {/* SECTION 4: DESKTOP AGENT ARCHITECTURE & DEEP DIVE */}
        <section id="architecture" className="py-14 sm:py-20 bg-white border-t border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Cpu className="w-3.5 h-3.5 text-purple-600" />
                <span>Under the Hood</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1128] tracking-tight">
                Enterprise Reliability on Retail Counter PCs
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Built specifically for Indian cyber cafés and high-volume photocopy shops, PrintBolt handles power cuts, paper jams, and heavy document traffic with zero data loss.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Feature 1 */}
              <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0A1128] mb-2">
                  PDFium Vector Engine
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Google’s open-source vector engine renders PDFs directly to native Windows GDI+ print contexts. Zero font substitution or raster blurring.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0A1128] mb-2">
                  Auto-Spooler Self-Heal
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Monitors Windows Spooler health via WMI. Automatically detects stalled jobs, clears corrupt cache files, and restarts the service without PC reboot.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-md shadow-indigo-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0A1128] mb-2">
                  Power-Cut Recovery
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Maintains an atomic recovery manifest. If the shop loses power or PC restarts mid-print, incomplete orders are restored with a 1-click retry option.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-md shadow-purple-500/20">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0A1128] mb-2">
                  5-Min Privacy Purge
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Customer documents are purged automatically 5 minutes after print completion. Zero customer files remain on your PC or the cloud, ensuring full privacy.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 5: CALL TO ACTION & ONBOARDING */}
        <section id="download" className="py-14 sm:py-20 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-[#0A1128] text-white text-center shadow-2xl border border-slate-800 relative overflow-hidden">
              
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ready to Transform Your Counter?</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
                  Upgrade Your Shop PC in 45 Minutes
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                  Join forward-thinking print shops that have eliminated WhatsApp queues, stopped pen-drive viruses, and automated their customer billing with PrintBolt.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <a
                    href="/downloads/PrintShopAgent.exe"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-extrabold text-base shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Desktop Agent (v1.4.49)</span>
                  </a>

                  <a
                    href="https://wa.me/916000061991?text=Hi%20PrintBolt%20team,%20I%20would%20like%20to%20schedule%20a%20free%20setup%20for%20my%20print%20shop."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] active:scale-98 text-white font-extrabold text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all"
                  >
                    <Phone className="w-5 h-5 fill-current" />
                    <span>Schedule Free WhatsApp Setup</span>
                  </a>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    100% Free to Try
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    No Card Required
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Setup Assistance Included
                  </span>
                </div>

              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Customer Upload Simulator Modal */}
      <CustomerSimulatorModal 
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        onJobSubmitted={handleJobSubmitted}
      />

    </div>
  );
}
