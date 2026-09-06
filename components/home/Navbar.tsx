'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Menu, 
  X, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Calculator, 
  Wrench, 
  CheckCircle2, 
  HelpCircle,
  Laptop
} from 'lucide-react';

interface NavbarProps {
  onOpenDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Software & Demo', href: '/software', isHighlighted: true },
    { label: 'Setup Guide', href: '/software#setup' },
    { label: 'ROI Estimator', href: '/software#roi' },
    { label: 'Benefits', href: '/#benefits' },
    { label: 'For Shops', href: '/#for-shops' },
    { label: 'FAQ', href: '/#faq' },
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <nav
          id="main-nav"
          aria-label="Main Navigation"
          style={{ backgroundColor: '#0A1128' }}
          className={`flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#0A1128] text-white shadow-xl shadow-blue-950/20 border border-slate-700/70 transition-all duration-300 ${
            scrolled ? 'scale-[0.99] shadow-2xl ring-1 ring-blue-500/20' : ''
          }`}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full pr-2"
          >
            <img 
              src="/logo.png" 
              alt="PrintBolt" 
              className="w-8 h-8 rounded-lg object-contain shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform" 
            />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center">
              Print<span className="text-blue-400">Bolt</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-full transition-all flex items-center gap-1.5 ${
                  link.isHighlighted
                    ? 'text-blue-300 hover:text-white bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.isHighlighted && <Sparkles className="w-3 h-3 text-blue-400" />}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Action CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {onOpenDemo && (
              <button
                type="button"
                onClick={onOpenDemo}
                className="px-3.5 py-1.5 text-xs font-semibold text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/30 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Try Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <a
              id="nav-whatsapp-btn"
              href="https://wa.me/916000061991?text=Hi%20PrintBolt%20team,%20I%20am%20interested%20in%20upgrading%20my%20print%20shop."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Us (+91 60000 61991)</span>
            </a>
          </div>

          {/* High-Contrast Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white bg-white/10 hover:bg-white/20 active:scale-95 border border-slate-600/80 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </nav>

        {/* Solid Dark Opaque Mobile Dropdown Menu (Guaranteed High Contrast) */}
        {mobileMenuOpen && (
          <div 
            style={{ backgroundColor: '#0A1128' }}
            className="md:hidden mt-2 p-5 rounded-2xl bg-[#0A1128] border border-slate-700/80 shadow-2xl text-white animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex flex-col gap-1.5">
              
              {/* Home */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-semibold text-white hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>Home</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* Software & Live Simulation - Highlighted */}
              <Link
                href="/software"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-bold text-white bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600/30 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Software & Live Demo</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-500 text-white">
                  Interactive
                </span>
              </Link>

              {/* Setup Guide */}
              <Link
                href="/software#setup"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-semibold text-slate-100 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-slate-300" />
                  <span>45-Min Setup Guide</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* ROI Estimator */}
              <Link
                href="/software#roi"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-semibold text-slate-100 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-slate-300" />
                  <span>ROI & Profit Estimator</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* Benefits */}
              <Link
                href="/#benefits"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-semibold text-slate-100 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>Benefits</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* For Print Shops */}
              <Link
                href="/#for-shops"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-semibold text-slate-100 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>For Print Shops</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* FAQ */}
              <Link
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-semibold text-slate-100 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>FAQ</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* Action Buttons in Mobile Menu */}
              <div className="pt-4 mt-2 border-t border-slate-800 flex flex-col gap-2.5">
                {onOpenDemo && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDemo();
                    }}
                    className="w-full text-center py-3 rounded-xl bg-blue-500/25 hover:bg-blue-500/35 text-blue-200 font-bold text-sm border border-blue-400/40 flex items-center justify-center gap-2"
                  >
                    <span>⚡ Test Customer QR Simulator</span>
                  </button>
                )}
                <a
                  href="https://wa.me/916000061991?text=Hi%20PrintBolt%20team,%20I%20am%20interested%20in%20upgrading%20my%20print%20shop."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold shadow-lg shadow-emerald-600/30"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>WhatsApp Us (+91 60000 61991)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

