'use client';
import React from 'react';
import { Phone, Zap, Shield, Mail, MapPin, Heart, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative pt-12 pb-16 bg-[#0A1128] text-white overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Main Conversion Footer Banner matching mockup */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1536] to-slate-900 border border-slate-700/80 p-6 sm:p-10 mb-14 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute right-0 top-0 w-80 h-full bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="text-center md:text-left max-w-xl">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400 block mb-1">
                Zero Hardware Required
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Ready to modernise your print shop?
              </h3>
              <p className="text-sm sm:text-base text-slate-300">
                Talk to the PrintBolt team today. We'll help you configure your shop PC and print standee in under 45 minutes.
              </p>
            </div>

            {/* High-contrast WhatsApp CTA button matching mockup */}
            <a
              id="footer-whatsapp-btn"
              href="https://wa.me/916000061991?text=Hi%20PrintBolt%20team,%20I%20am%20ready%20to%20modernise%20my%20print%20shop!"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-0.5 whitespace-nowrap cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" />
                <span>Talk to Us on WhatsApp</span>
              </div>
              <span className="text-xs font-mono text-emerald-100 font-semibold">
                +91 60000 61991
              </span>
            </a>
          </div>
        </div>

        {/* 2. Secondary Footer Links & Brand Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo.png" 
                alt="PrintBolt" 
                className="w-8 h-8 rounded-lg object-contain shadow-md shadow-blue-500/20" 
              />
              <span className="text-xl font-extrabold tracking-tight text-white">
                Print<span className="text-blue-400">Bolt</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Transforming everyday photocopy and printing shops into automated digital print hubs. Eliminating manual queue chaos, virus risks, and file handling headaches across 1,400+ print shops.
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Virus-Free Sandbox</span>
              </span>
              <span>•</span>
              <span>Made for Indian Print Shops</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Navigation
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#benefits" className="hover:text-white transition-colors">Benefits</a></li>
              <li><a href="#comparison" className="hover:text-white transition-colors">Before vs After</a></li>
              <li><a href="#dashboard-demo" className="hover:text-white transition-colors">Desktop App Showcase</a></li>
              <li><a href="#for-shops" className="hover:text-white transition-colors">For Print Shops</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">ROI Calculator</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Direct Contact & Support */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Direct Contact & Support
            </div>
            
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+916000061991" className="hover:text-white font-mono">
                  +91 60000 61991 (Call or WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:support@printbolt.in" className="hover:text-white">
                  support@printbolt.in
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Pan-India Deployment & Remote Assistance</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-slate-500 block">
                Support Hours: Monday to Saturday, 9:00 AM – 9:00 PM IST
              </span>
            </div>
          </div>

        </div>

        {/* 3. Bottom Copyright & Scroll-to-top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} PrintBolt Technologies. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Floating Bottom-Right WhatsApp Quick Contact Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <a
          href="https://wa.me/916000061991?text=Hi%20PrintBolt%20team,%20I%20have%20a%20question%20about%20upgrading%20my%20print%20shop."
          target="_blank"
          rel="noopener noreferrer"
          title="Chat with PrintBolt on WhatsApp"
          className="flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-[#10B981] hover:bg-[#059669] text-white shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all border border-emerald-400/40"
        >
          <Phone className="w-4 h-4 fill-current" />
          <span className="hidden sm:inline font-bold text-xs tracking-wide">
            WhatsApp Us
          </span>
        </a>
      </div>

    </footer>
  );
};

