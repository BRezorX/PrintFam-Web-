'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Menu, X, ChevronRight, MessageCircle, Phone, Printer, Zap, 
  Shield, FileText, CheckCircle2, QrCode, ArrowRight, Download, 
  Laptop, RefreshCw, Layers, Sparkles, Clock, TrendingUp, Cpu, 
  Lock, Check, Smartphone, ArrowDown, HelpCircle
} from 'lucide-react';

const WA_LINK = 'https://wa.me/916000061991?text=Hi%20PrintBolt%2C%20I%20am%20interested%20in%20upgrading%20my%20print%20shop%20with%20PrintBolt.';
const CALL_NUM = 'tel:+916000061991';
const CALL_DISPLAY = '+91 60000 61991';
const DOWNLOAD_EXE = '/downloads/PrintShopAgent.exe';

const NAV_LINKS = [
  { label: 'Our Ideology', href: '#ideology' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'The Flow', href: '#the-flow' },
  { label: 'For Print Shops', href: '#for-shops' },
  { label: 'Shop Agent', href: '#download' },
  { label: 'Contact', href: '#contact' },
];

/* ── Section Label Pill ── */
function SectionBadge({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-4 ${
      light 
        ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50' 
        : 'bg-blue-50 text-blue-700 border border-blue-200'
    }`}>
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
      <span>{children}</span>
    </div>
  );
}

/* ── Navigation Bar ── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm py-3' 
        : 'bg-transparent py-5'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group text-decoration-none">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 font-display">PrintBolt</span>
            <span className="block text-[9px] font-black uppercase tracking-widest text-blue-600 -mt-1">Operating System</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(l => (
            <a 
              key={l.href} 
              href={l.href} 
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <a 
            href={DOWNLOAD_EXE} 
            download
            className="text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300/80 px-4 py-2.5 rounded-xl transition flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download Agent (.exe)</span>
          </a>
          <a 
            href={WA_LINK} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 px-4 py-2.5 rounded-xl transition flex items-center gap-2"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Partner With Us</span>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-6 shadow-xl space-y-4">
          {NAV_LINKS.map(l => (
            <a 
              key={l.href} 
              href={l.href} 
              onClick={() => setOpen(false)}
              className="block text-base font-bold text-gray-800 py-2 border-b border-gray-100"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-3">
            <a 
              href={DOWNLOAD_EXE} 
              download
              className="w-full text-center text-sm font-bold text-gray-800 bg-gray-100 py-3 rounded-xl border border-gray-200 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-blue-600" /> Download Desktop Agent (.exe)
            </a>
            <a 
              href={WA_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full text-center text-sm font-bold text-white bg-blue-600 py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Our Team
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Hero Section ── */
function Hero() {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-b from-[#FBFBFA] via-[#F4F3EF] to-[#FAF9F7]">
      {/* Subtle Background Grid Pattern */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-[linear-gradient(to_right,#E5E2DC_1px,transparent_1px),linear-gradient(to_bottom,#E5E2DC_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Manifesto Headline & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <SectionBadge>Our Printing Ideology</SectionBadge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.1] font-display">
              The End of USBs, Queues, and <span className="text-blue-600 underline decoration-blue-300 decoration-wavy underline-offset-4">Manual Transfers.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 font-body leading-relaxed">
              We believe printing should be as effortless and instant as UPI payments. 
              PrintBolt turns any neighbourhood print shop into an autonomous print station — 
              <strong> zero hardware upgrades required.</strong>
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a 
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Modernise Your Shop</span>
              </a>

              <a 
                href={DOWNLOAD_EXE}
                download
                className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-gray-50 border border-gray-300/90 text-gray-800 font-bold text-base rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5 text-blue-600" />
                <span>Download Desktop Agent</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1.5 text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Plug &amp; Play on Existing PC
              </span>
              <span className="flex items-center gap-1.5 text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Works with Any Printer
              </span>
              <span className="flex items-center gap-1.5 text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Privacy for Customers
              </span>
            </div>
          </div>

          {/* Right Column: Live Visual Pipeline Simulation */}
          <div className="lg:col-span-5">
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200/90 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-gray-900/10 relative">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-gray-400 ml-2">PrintBolt Touchless Loop</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Autopilot
                </span>
              </div>

              {/* Step Flow in Diagram */}
              <div className="space-y-3.5">
                {/* Step 1 */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200/80 rounded-2xl p-3.5 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-black shadow-md shadow-blue-500/20">
                    1
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">Customer Scans Counter QR</span>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">No App Needed</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Uploads PDF, Word (.docx), or PPTX directly from phone.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50/50 border border-purple-200/80 rounded-2xl p-3.5 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-black shadow-md shadow-purple-500/20">
                    2
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">Cloud Auto-Conversion &amp; Verified Pricing</span>
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">Instant</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Calculates exact pages, applies discounts, locks vector layout.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-black shadow-md shadow-emerald-500/20">
                    3
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">Customer Pays via UPI / Scanner</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Instant Settlement</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">No money disputes or waiting for change.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/80 rounded-2xl p-3.5 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-black shadow-md shadow-amber-500/20">
                    4
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">Shop PC Prints Job Automatically</span>
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">Autonomous</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">FCFS queue manager routes to HP/Canon/Epson printer with zero human touch.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-bold">
                <span>Average order turnaround: &lt; 45 seconds</span>
                <span className="text-blue-600 font-black">Zero Staff Bottlenecks</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ── Ideology Pillars Section ── */
function IdeologySection() {
  const pillars = [
    {
      icon: Lock,
      title: "Absolute Customer Privacy",
      subtitle: "No More Shared WhatsApp or USBs",
      desc: "Customers shouldn't have to share their private WhatsApp number or plug virus-prone pen drives into public shop computers. With PrintBolt, files are sent encrypted and purged automatically after printing.",
      color: "from-blue-500 to-indigo-600",
      accentBg: "bg-blue-50",
      borderCol: "border-blue-200"
    },
    {
      icon: Zap,
      title: "Autonomous Touchless Queue",
      subtitle: "Shopkeepers Should Print, Not Transfer Files",
      desc: "During busy college and office hours, shopkeepers waste 70% of their time receiving files, opening emails, and calculating change. PrintBolt automates the entire intake so your printers never sit idle.",
      color: "from-amber-500 to-orange-600",
      accentBg: "bg-amber-50",
      borderCol: "border-amber-200"
    },
    {
      icon: Sparkles,
      title: "Fixed-Layout Precision",
      subtitle: "Zero Margin Shifts & Font Issues",
      desc: "Direct Word (.docx) and PowerPoint (.pptx) printing often breaks layouts on different PCs. Our cloud edge pipeline standardizes all documents into pristine vector PDFs before hitting the paper tray.",
      color: "from-purple-500 to-fuchsia-600",
      accentBg: "bg-purple-50",
      borderCol: "border-purple-200"
    },
    {
      icon: Cpu,
      title: "Zero Hardware Upgrade Cost",
      subtitle: "Empowering Existing Local Shops",
      desc: "You don't need expensive multi-lakh rupee self-service kiosks. PrintBolt runs as a lightweight app on the Windows computer and printers you already own today.",
      color: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-50",
      borderCol: "border-emerald-200"
    }
  ];

  return (
    <section id="ideology" className="py-24 bg-white border-y border-gray-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionBadge>The 4 Pillars</SectionBadge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight font-display">
            The Philosophy Behind Every Print We Make
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-body">
            PrintBolt was designed from the ground up to solve the real, messy daily realities of Indian print shops and their customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={idx}
                className={`bg-white rounded-3xl p-8 border ${p.borderCol} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} text-white flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 block">{p.subtitle}</span>
                    <h3 className="text-xl font-bold text-gray-900 font-display">{p.title}</h3>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-body">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Before vs PrintBolt Comparison ── */
function ComparisonSection() {
  const comparisons = [
    {
      aspect: "File Transfer",
      before: "Customers wait in line with USBs, send files to personal WhatsApp, or search for emails.",
      after: "Instant QR scan from mobile. Upload PDF, Word, or PPTX in 5 seconds."
    },
    {
      aspect: "Customer Privacy",
      before: "Personal phone numbers, photos, and confidential documents exposed on public desktop folders.",
      after: "End-to-end encrypted transit with automated cloud purge upon print completion."
    },
    {
      aspect: "Payment & Pricing",
      before: "Manual page counting, arguing over B&W vs Color rates, looking for cash change.",
      after: "Exact page verification, automatic discount tiers, and instant UPI pre-payment."
    },
    {
      aspect: "Peak Hour Throughput",
      before: "Shopkeeper is stuck managing files. One customer served at a time. Long lines form.",
      after: "10+ customers submit simultaneously. Desktop Agent queues and prints jobs autonomously."
    },
    {
      aspect: "Hardware Requirement",
      before: "Expensive proprietary kiosk machines costing ₹2,00,000+.",
      after: "Runs on the Windows PC and Ink Tank / Laser printers you already own."
    }
  ];

  return (
    <section id="the-flow" className="py-24 bg-[#F5F3EF] border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionBadge>The Contrast</SectionBadge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight font-display">
            Traditional Printing vs. PrintBolt OS
          </h2>
          <p className="mt-3 text-base text-gray-600 font-body">
            See how your shop changes the moment you install PrintBolt.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-300/80 shadow-lg overflow-hidden divide-y divide-gray-100">
          <div className="grid grid-cols-12 bg-gray-50/80 px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500 border-b border-gray-200">
            <div className="col-span-3 sm:col-span-2">Feature</div>
            <div className="col-span-4 sm:col-span-5 text-red-600">Traditional Print Shop</div>
            <div className="col-span-5 sm:col-span-5 text-blue-600">With PrintBolt OS</div>
          </div>

          {comparisons.map((row, i) => (
            <div key={i} className="grid grid-cols-12 px-6 py-5 items-center text-xs sm:text-sm font-body hover:bg-blue-50/20 transition">
              <div className="col-span-3 sm:col-span-2 font-bold text-gray-900">{row.aspect}</div>
              <div className="col-span-4 sm:col-span-5 text-gray-500 pr-4 flex items-start gap-2">
                <span className="text-red-500 font-bold flex-shrink-0">✕</span>
                <span>{row.before}</span>
              </div>
              <div className="col-span-5 sm:col-span-5 text-gray-900 font-semibold flex items-start gap-2">
                <span className="text-emerald-600 font-bold flex-shrink-0">✓</span>
                <span>{row.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How It Works (4 Simple Steps) ── */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Download & Connect",
      desc: "Download PrintShopAgent.exe on your shop PC. Log in and select your installed printers. It connects immediately in under 2 minutes.",
      icon: Laptop
    },
    {
      num: "02",
      title: "Place Your Shop QR Code",
      desc: "Print your unique counter QR code from the app. Place it on your shop desk or storefront window for customers to scan.",
      icon: QrCode
    },
    {
      num: "03",
      title: "Customer Scans & Submits",
      desc: "Customers scan the QR code on their phone, upload PDF, Word or PPT files, pick color/duplex, and pay instantly via UPI.",
      icon: Smartphone
    },
    {
      num: "04",
      title: "Autopilot Printing",
      desc: "The desktop agent receives the job in FCFS queue order, alerts you for paper flips on manual duplex, and prints smoothly.",
      icon: Printer
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionBadge>Step-by-Step</SectionBadge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight font-display">
            Up and Running in 5 Minutes
          </h2>
          <p className="mt-3 text-base text-gray-600 font-body">
            No technicians required. No complicated hardware calibration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx}
                className="bg-[#FAF9F7] border border-gray-200/90 rounded-3xl p-7 relative hover:bg-white hover:shadow-lg transition-all"
              >
                <div className="text-xs font-black text-blue-600 mb-4 tracking-widest uppercase flex items-center justify-between">
                  <span>STEP {s.num}</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-display">{s.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-body">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── For Shops (Target Audience) ── */
function ForShopsSection() {
  const shopTypes = [
    { title: "College & University Xerox Shops", desc: "Handle 100s of student assignments, practical files, and lab manuals simultaneously without queues building up." },
    { title: "Court & Legal Document Centres", desc: "Ensure strict client confidentiality with instant memory printing and zero documents saved on public PCs." },
    { title: "Stationery & Local Cyber Cafes", desc: "Free up your staff from receiving WhatsApp files so they can focus on retail sales and customer support." },
    { title: "High-Volume Commercial Print Hubs", desc: "Automate smart job routing between dedicated high-speed B&W laser printers and color inkjet machines." }
  ];

  return (
    <section id="for-shops" className="py-24 bg-gray-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <SectionBadge light>Built For India</SectionBadge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display leading-tight">
              Designed for Real Indian Print Shop Workflows.
            </h2>
            <p className="text-base text-gray-400 font-body leading-relaxed">
              We know print shop profit margins are tight and every wasted second during peak hours is lost revenue. 
              PrintBolt helps you print more pages per hour with zero extra staff.
            </p>
            <div className="pt-2">
              <a 
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Talk to our Founder on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shopTypes.map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm mb-3">
                  ✓
                </div>
                <h3 className="font-bold text-base text-white mb-1.5 font-display">{item.title}</h3>
                <p className="text-xs text-gray-400 font-body leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Download Desktop Agent Section ── */
function DownloadAgentSection() {
  return (
    <section id="download" className="py-24 bg-[#FAF9F7] border-b border-gray-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <span>Standalone Executable • Version 1.4.22</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
                Download PrintBolt Desktop Agent for Windows
              </h2>
              <p className="text-sm sm:text-base text-blue-100/80 font-body leading-relaxed max-w-xl">
                100% Standalone Single-File Executable. Zero external installers or dependencies required. 
                Compatible with Windows 10 &amp; 11 (64-bit and 32-bit).
              </p>
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <a 
                  href={DOWNLOAD_EXE}
                  download
                  className="px-8 py-4 bg-white hover:bg-blue-50 text-blue-950 font-extrabold text-sm rounded-xl shadow-xl transition flex items-center gap-3"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  <span>Download PrintShopAgent.exe (14.4 MB)</span>
                </a>
                <span className="text-xs text-blue-200/60 font-semibold">
                  Free for print shops during beta
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 border border-white/15 rounded-2xl p-5 text-xs text-blue-100 space-y-3 font-body">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] pb-1 border-b border-white/10">
                Agent Highlights
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Multi-printer smart routing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>2-Pass Manual Duplex assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Real-time hardware health check</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Power-cut / crash auto recovery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ Section ── */
function FAQSection() {
  const faqs = [
    {
      q: "Do I need to buy a new printer to use PrintBolt?",
      a: "No. PrintBolt works with any existing printer connected to your Windows computer, including HP, Canon, Epson, Brother, and Ricoh ink tank or laser printers."
    },
    {
      q: "Do customers need to download an app or register?",
      a: "No! Customers just scan your counter QR code on their camera app (iPhone, Android, or tablet). The web portal opens instantly in their browser."
    },
    {
      q: "How does payment work?",
      a: "Customers pay directly before the job is queued using UPI (Google Pay, PhonePe, Paytm) or cash. There are no payment disputes or manual change calculation."
    },
    {
      q: "What file types can customers upload?",
      a: "PrintBolt supports PDF, Word documents (.docx, .doc), PowerPoint presentations (.pptx, .ppt), RTF, and text files with automatic cloud conversion into locked vector PDFs."
    },
    {
      q: "How do I get started?",
      a: "Download the desktop agent, create your shop account, and print your QR code. You will be ready to accept automated prints in under 5 minutes."
    }
  ];

  return (
    <section className="py-24 bg-white border-b border-gray-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <SectionBadge>Questions &amp; Answers</SectionBadge>
          <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight font-display">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#FAF9F7] border border-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-base text-gray-900 font-display mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-sm text-gray-600 font-body leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Final Call to Action ── */
function FinalCTA() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-[#FBFBFA] to-[#F2EFE9] text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Printer className="w-6 h-6" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-950 tracking-tight font-display">
          Ready to Modernise Your Print Shop?
        </h2>
        <p className="text-base sm:text-lg text-gray-600 font-body max-w-xl mx-auto">
          Join the next generation of neighbourhood print businesses. Talk to our team today or start your 5-minute setup right now.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-blue-600/25 transition flex items-center justify-center gap-3"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat with Us on WhatsApp</span>
          </a>

          <a 
            href={CALL_NUM}
            className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold text-base rounded-2xl shadow-sm transition flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-gray-600" />
            <span>{CALL_DISPLAY}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 text-sm text-gray-500 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-gray-100">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-gray-900 font-bold font-display text-lg">
              <Printer className="w-5 h-5 text-blue-600" />
              <span>PrintBolt</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              The autonomous operating system for neighbourhood print shops across India.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3 font-display">Navigation</h4>
            <div className="space-y-2 text-xs">
              <a href="#ideology" className="block hover:text-blue-600">Our Ideology</a>
              <a href="#the-flow" className="block hover:text-blue-600">The Touchless Flow</a>
              <a href="#how-it-works" className="block hover:text-blue-600">How It Works</a>
              <a href="#download" className="block hover:text-blue-600">Download Agent</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3 font-display">Legal</h4>
            <div className="space-y-2 text-xs">
              <Link href="/privacy" className="block hover:text-blue-600">Privacy Policy</Link>
              <Link href="/terms" className="block hover:text-blue-600">Terms of Service</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3 font-display">Contact</h4>
            <div className="space-y-2 text-xs">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="block hover:text-blue-600">WhatsApp Support</a>
              <a href={CALL_NUM} className="block hover:text-blue-600">{CALL_DISPLAY}</a>
              <p className="text-gray-400">hello@printbolt.store</p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 PrintBolt. All rights reserved.</p>
          <p>Made with pride for Indian print shop owners.</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Main Home Page Component ── */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Navbar />
      <Hero />
      <IdeologySection />
      <ComparisonSection />
      <HowItWorks />
      <ForShopsSection />
      <DownloadAgentSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}

