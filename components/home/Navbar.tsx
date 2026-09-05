'use client';
import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Zap, ArrowRight, ExternalLink } from 'lucide-react';

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
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'For Shops', href: '#for-shops' },
    { label: 'Live Dashboard', href: '#dashboard-demo' },
    { label: 'ROI Calculator', href: '#calculator' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-6xl mx-auto">
        <nav
          id="main-nav"
          aria-label="Main Navigation"
          className={`flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#0A1128]/95 backdrop-blur-md text-white shadow-xl shadow-blue-950/20 border border-slate-700/50 transition-all duration-300 ${
            scrolled ? 'scale-[0.99] shadow-2xl bg-[#0A1128]/98' : ''
          }`}
        >
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center gap-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full pr-2"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center">
              Print<span className="text-blue-400">Bolt</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-xs lg:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                {link.label}
              </a>
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

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 rounded-2xl bg-[#0A1128]/98 backdrop-blur-lg border border-slate-700/60 shadow-2xl text-white animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/10 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                {onOpenDemo && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDemo();
                    }}
                    className="w-full text-center py-2.5 rounded-xl bg-blue-500/20 text-blue-300 font-semibold text-sm border border-blue-400/30"
                  >
                    ⚡ Test Customer QR Simulator
                  </button>
                )}
                <a
                  href="https://wa.me/916000061991?text=Hi%20PrintBolt%20team,%20I%20am%20interested%20in%20upgrading%20my%20print%20shop."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold shadow-md"
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

