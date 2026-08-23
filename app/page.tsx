'use strict';
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '../components/AppShell';
import { 
  QrCode, 
  ArrowRight, 
  Printer, 
  UploadCloud, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  Layers,
  CheckCircle
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [shopIdInput, setShopIdInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const cleanId = shopIdInput.trim();
    if (!cleanId) {
      setError("Please enter a valid Shop ID.");
      return;
    }
    setError('');
    router.push(`/p/${encodeURIComponent(cleanId)}`);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AppShell shopName={undefined} email={undefined} maxWidth="max-w-6xl">
      {/* 1. HERO SECTION (Split layout: copy on left, form card on right for desktop) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10 md:py-16">
        
        {/* Left Column: Headline and Copy */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 animate-pulse">
            <Zap className="w-3.5 h-3.5" />
            <span>Next-Generation Self-Service Printing</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight">
            Print Instantly. <br />
            <span className="text-blue-600">No Apps, No Delay.</span>
          </h1>
          <p className="text-sm md:text-base text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            The ultimate QR-based printing kiosk. Upload documents, customize paper options, pay via UPI, and print directly from your phone.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-3 pt-2">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2"
            >
              <span>How It Works</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="w-full sm:w-auto bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 text-gray-600 font-bold py-3.5 px-8 rounded-2xl transition"
            >
              Explore Features
            </button>
          </div>
        </div>

        {/* Right Column: Connect Kiosk Form Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="text-center lg:text-left">
              <h2 className="text-xl font-black text-gray-900">Connect to Kiosk</h2>
              <p className="text-xs text-gray-400 font-semibold mt-1">Ready to print? Enter a Shop ID below</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={shopIdInput}
                  onChange={(e) => setShopIdInput(e.target.value)}
                  placeholder="e.g. mock_user_id_123"
                  className="w-full border border-gray-250 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-2xl px-4 py-3.5 outline-none text-base font-semibold transition"
                />
              </div>
              {error && (
                <p className="text-xs font-bold text-red-500">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-base py-3.5 px-4 rounded-2xl shadow-lg transition duration-150 flex items-center justify-center space-x-1.5"
              >
                <span>Connect & Start Uploading</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            
            <div className="bg-gray-50 border border-gray-150 rounded-xl p-3 text-[10px] font-semibold text-gray-400 leading-relaxed">
              💡 Scan the QR sticker on the shop printer counter to bypass this and connect instantly!
            </div>
          </div>
        </div>

      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-10 border-t border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900">How PrintZap Works</h2>
          <p className="text-xs text-gray-400 font-semibold mt-1">Get your prints in four simple steps</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              icon: <QrCode className="w-5 h-5 text-blue-600" />,
              title: "Scan QR",
              desc: "Scan the PrintZap QR code sticker on the shopkeeper's desk to connect."
            },
            {
              step: "02",
              icon: <UploadCloud className="w-5 h-5 text-blue-600" />,
              title: "Upload PDF",
              desc: "Choose your document. Set page ranges visually from the thumbnail grid."
            },
            {
              step: "03",
              icon: <CreditCard className="w-5 h-5 text-blue-600" />,
              title: "UPI Checkout",
              desc: "Pay securely in seconds via any standard UPI app (GPay/PhonePe)."
            },
            {
              step: "04",
              icon: <Printer className="w-5 h-5 text-blue-600" />,
              title: "Instant Print",
              desc: "Your document spools directly to the printer in First-Come-First-Served order."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-155 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[160px]">
              <span className="absolute top-2 right-4 text-3xl font-black text-gray-100/70 select-none">{item.step}</span>
              <div className="bg-blue-50/50 p-2.5 rounded-xl w-fit mb-4">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-semibold">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SHIELD & SECURITY SECTION (Split into grid for desktop layout) */}
      <section className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 md:p-10 my-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 opacity-10">
          <ShieldCheck className="w-64 h-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-4">
            <div className="bg-blue-500/20 text-blue-300 p-2.5 rounded-xl w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black tracking-tight leading-snug">Your Document Security is Our Priority</h2>
            <div className="flex items-center space-x-1.5 text-[10px] font-bold tracking-wider text-blue-400 uppercase">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Secure Spooler deletion on complete</span>
            </div>
          </div>
          <div className="text-sm text-blue-100/80 leading-relaxed font-medium">
            Files are stored in private storage instances and accessed only through encrypted, short-lived signed URLs. Once spooled successfully to the local printer, spools are completely deleted.
          </div>
        </div>
      </section>

      {/* 4. APP FEATURES GRID */}
      <section id="features" className="py-10 border-t border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900">Why Customers Love Us</h2>
          <p className="text-xs text-gray-400 font-semibold mt-1">Modern features built for self-service convenience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Smartphone className="w-5 h-5 text-blue-600" />,
              title: "Zero Installations",
              desc: "No mobile app download required. Works flawlessly on any Safari, Chrome, or Firefox mobile browser."
            },
            {
              icon: <Layers className="w-5 h-5 text-blue-600" />,
              title: "Visual Page Range Select",
              desc: "Toggle checkboxes on page previews or write syntax like '1-3, 5' to avoid printing unwanted pages."
            },
            {
              icon: <Zap className="w-5 h-5 text-blue-600" />,
              title: "Instant Hardware Polling",
              desc: "Auto-queue technology spools spooled sheets as soon as the printer is online, bypassing offline failures."
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="bg-blue-50 p-2.5 rounded-xl w-fit">
                {feature.icon}
              </div>
              <h3 className="font-bold text-gray-800 text-sm">{feature.title}</h3>
              <p className="text-xs text-gray-450 font-semibold leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
