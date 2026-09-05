'use client';
import React, { useState } from 'react';
import { 
  Download, 
  Settings2, 
  QrCode, 
  LayoutDashboard, 
  CheckCircle2, 
  ArrowRight, 
  Laptop, 
  Tag, 
  Smartphone, 
  Printer,
  Sparkles
} from 'lucide-react';
import { PrintBoltMiniExperience } from './PrintBoltMiniExperience';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showMiniExperience, setShowMiniExperience] = useState<boolean>(false);

  const steps = [
    {
      number: 1,
      tag: '1. INSTALL',
      title: 'Download & Install',
      subtitle: 'On existing shop PC in under an hour',
      desc: 'No technician visit needed. Download our lightweight desktop app for Windows 10/11. It connects directly to your existing USB or WiFi printers.',
      icon: Laptop,
      badge: 'Takes < 10 mins',
      preview: {
        heading: 'PrintBolt Agent for Windows',
        highlight: 'Compatible with HP, Canon, Brother, Epson, Ricoh & Konica',
        status: 'Connected: 2 Printers Ready',
      }
    },
    {
      number: 2,
      tag: '2. SET UP',
      title: 'Configure & Standee',
      subtitle: 'Set custom pricing & generate QR',
      desc: 'Set per-page pricing in INR (B&W ₹2, Color ₹10, Duplex discount). PrintBolt auto-generates your customized QR standee to place on your counter.',
      icon: Tag,
      badge: 'Full control',
      preview: {
        heading: 'Smart Pricing Rules',
        highlight: 'A4 B&W: ₹2.00/page | A4 Color: ₹10.00/page',
        status: 'Custom QR Standee Generated',
      }
    },
    {
      number: 3,
      tag: '3. GO LIVE',
      title: 'Customers Submit',
      subtitle: 'From phone — zero file transfer needed',
      desc: 'Customers simply point their phone camera at your counter QR code. No app install needed! They upload documents (PDF/DOCX), select options, and pay online instantly via UPI in INR.',
      icon: Smartphone,
      badge: 'Zero app needed',
      preview: {
        heading: 'Mobile Browser Upload Portal',
        highlight: 'Instant PDF & Word document upload with auto page-count (Images coming soon)',
        status: 'Submissions queue up live',
      }
    },
    {
      number: 4,
      tag: '4. MANAGE',
      title: 'Approve & Print',
      subtitle: 'Jobs queue automatically in dashboard',
      desc: 'Orders appear instantly on your PC screen with preview, page count, and pre-paid online UPI verification. Hit "Approve" or "Print" with zero payment disputes.',
      icon: LayoutDashboard,
      badge: 'Auto queue',
      preview: {
        heading: 'Live Shop Operations Center',
        highlight: '1-click direct printing with 100% online UPI payment verification',
        status: 'Daily summary & analytics',
      }
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1128] tracking-tight mb-3">
            HOW IT WORKS
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            See how a customer points their phone at your counter QR code, uploads a document, pays online via UPI, and triggers automated laser printing on your shop PC.
          </p>
        </div>

        {/* 1. Live Interactive Workflow Simulator Component OR Launch Option */}
        <div className="mb-14 sm:mb-20">
          {!showMiniExperience ? (
            <div className="relative rounded-3xl bg-gradient-to-r from-[#0A1128] via-[#0F172A] to-[#1E293B] p-6 sm:p-10 text-white shadow-xl border border-slate-800 overflow-hidden">
              {/* Background ambient lightning glow */}
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-xl text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-400/30">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Hands-On Simulation</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                    Want to see it in action?
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Walk through every step: Phone scanning counter QR standee → PDF document upload → 100% online UPI payment → Instant desktop queue sync → Automated laser print output.
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    id="btn-test-mini-experience"
                    onClick={() => setShowMiniExperience(true)}
                    className="px-7 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-extrabold text-base shadow-xl shadow-blue-500/30 flex items-center gap-3 transition-all cursor-pointer group"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Test the Mini Experience</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200/80 rounded-2xl px-4 py-2.5 text-xs text-blue-900 font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Mini Experience Simulator is Active</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowMiniExperience(false)}
                  className="text-blue-700 hover:text-blue-950 font-bold hover:underline cursor-pointer"
                >
                  Hide Simulator
                </button>
              </div>
              <PrintBoltMiniExperience onClose={() => setShowMiniExperience(false)} />
            </div>
          )}
        </div>

        {/* 2. Step Breakdown Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight">
            Key Steps in Detail
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore the 4 components that make PrintBolt zero-friction for both shopkeepers and customers.
          </p>
        </div>

        {/* 4 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.number;

            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(step.number)}
                className={`relative rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-white border-2 border-blue-500 shadow-xl shadow-blue-500/10 -translate-y-1'
                    : 'bg-white/90 hover:bg-white border border-slate-200/80 hover:border-blue-200 shadow-md hover:shadow-lg'
                }`}
              >
                {/* Step Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Illustrated Icon Badge */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      isActive 
                        ? 'bg-blue-100 text-blue-800 font-extrabold' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {step.badge}
                    </span>
                  </div>

                  {/* Step Tag */}
                  <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase block mb-1">
                    {step.tag}
                  </span>

                  {/* Step Title */}
                  <h3 className="text-lg font-bold text-[#0A1128] mb-1">
                    {step.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs font-semibold text-slate-500 mb-3">
                    {step.subtitle}
                  </p>

                  {/* Step Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom Step Indicator bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    Step {step.number} of 4
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-600 animate-pulse' : 'bg-slate-200'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Step Preview Detail Card */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-blue-900/5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Selected Step {activeStep} Breakdown: {steps[activeStep - 1].title}</span>
              </div>
              <h4 className="text-xl font-bold text-[#0A1128] mb-2">
                {steps[activeStep - 1].preview.heading}
              </h4>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                {steps[activeStep - 1].preview.highlight}. Everything operates locally with bank-grade safety, guaranteeing zero interruption to your existing counter workflow.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
                🟢 {steps[activeStep - 1].preview.status}
              </div>

              <a
                href="https://wa.me/916000061991?text=Hi%20PrintBolt%20team,%20can%20you%20help%20me%20set%20up%20PrintBolt%20in%20my%20shop?"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Request Setup Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

