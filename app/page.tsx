'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  QrCode,
  UploadCloud,
  CreditCard,
  Printer,
  Zap,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Clock,
  Smartphone,
  Layers,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   ANIMATED QR-TO-PRINT PIPELINE DIAGRAM
───────────────────────────────────────────── */
function PrintPipeline() {
  const steps = [
    { label: 'SCAN QR', sub: 'Customer scans shop code', icon: QrCode,      color: '#3b82f6' },
    { label: 'UPLOAD',  sub: 'PDF in seconds',           icon: UploadCloud,  color: '#6366f1' },
    { label: 'PAY',     sub: 'UPI / Razorpay',           icon: CreditCard,   color: '#8b5cf6' },
    { label: 'PRINT',   sub: 'Auto-spools to printer',   icon: Printer,      color: '#06b6d4' },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % steps.length), 1400);
    return () => clearInterval(t);
  }, [steps.length]);

  return (
    <div className="relative w-full max-w-[260px] mx-auto select-none" aria-hidden="true">
      <div className="absolute left-[19px] top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/40 via-indigo-500/40 to-cyan-500/40" />
      <div
        className="absolute left-[15px] w-[9px] h-[9px] rounded-full bg-blue-400 z-10"
        style={{
          top: `calc(${(active / (steps.length - 1)) * 85}% + 1.75rem)`,
          transition: 'top 0.7s cubic-bezier(.22,1,.36,1)',
          boxShadow: '0 0 10px 2px rgba(59,130,246,0.7)',
        }}
      />
      <div className="space-y-6">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === active;
          return (
            <div key={i} className="flex items-start gap-4">
              <div
                className="relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  border: `1px solid ${isActive ? step.color : 'rgba(255,255,255,0.08)'}`,
                  background: isActive ? `${step.color}22` : 'rgba(255,255,255,0.04)',
                  boxShadow: isActive ? `0 0 18px 4px ${step.color}44` : 'none',
                  transition: 'all 0.5s',
                }}
              >
                <Icon className="w-4 h-4" style={{ color: isActive ? step.color : '#6b7280', transition: 'color 0.3s' }} />
              </div>
              <div className="pt-2">
                <div className="font-mono text-xs font-bold tracking-[0.18em]"
                  style={{ color: isActive ? '#e2e8f0' : '#4b5563', transition: 'color 0.3s' }}>
                  {step.label}
                </div>
                <div className="text-[11px] mt-0.5"
                  style={{ color: isActive ? '#94a3b8' : '#374151', transition: 'color 0.3s' }}>
                  {step.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED STAT COUNTER
───────────────────────────────────────────── */
function StatCounter({ value, prefix = '', suffix = '', label }: {
  value: number; prefix?: string; suffix?: string; label: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          if (value === 0) { setDisplay(0); return; }
          let current = 0;
          const step = value / 40;
          const t = setInterval(() => {
            current += step;
            if (current >= value) { setDisplay(value); clearInterval(t); }
            else setDisplay(Math.floor(current));
          }, 30);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black tracking-tight text-white tabular-nums">
        {prefix}{display}{suffix}
      </div>
      <div className="mt-1 text-xs font-semibold tracking-widest uppercase" style={{ color: '#64748b' }}>{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   WORKFLOW STEP TILE
───────────────────────────────────────────── */
function WorkflowStep({
  num, icon: Icon, title, desc, color, delay,
}: {
  num: string; icon: React.ComponentType<any>; title: string;
  desc: string; color: string; delay: string;
}) {
  return (
    <div className={`pb-animate-fade-up ${delay} flex flex-col items-start`}>
      <div className="flex items-center gap-3 w-full mb-5">
        <span className="font-mono text-[11px] font-bold tracking-[0.2em]" style={{ color: '#64748b' }}>{num}</span>
        <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}44` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{desc}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setNavOpen(false);
  };

  return (
    <div style={{ background: '#08090a', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ─── NAVIGATION ─── */}
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          transition: 'background 0.3s, border-color 0.3s',
          background: scrolled ? 'rgba(8,9,10,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.07)' : 'transparent'}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between" style={{ height: '64px' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: '#2563EB' }}>
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight text-white">PrintBolt</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { id: 'how-it-works', label: 'How It Works' },
              { id: 'features',     label: 'Features' },
              { id: 'for-shops',    label: 'For Shops' },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="text-sm font-medium transition-colors hover:text-white"
                style={{ color: '#94a3b8' }}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/p" className="text-sm font-semibold hover:text-white transition-colors" style={{ color: '#94a3b8' }}>
              Customer Portal
            </Link>
            <a href="mailto:hello@printbolt.store"
              className="flex items-center gap-1.5 font-bold text-sm px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
              style={{ background: '#2563EB' }}
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <button onClick={() => setNavOpen(!navOpen)} className="md:hidden hover:text-white transition-colors"
            style={{ color: '#94a3b8' }} aria-label="Toggle menu">
            {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {navOpen && (
          <div className="md:hidden px-5 pb-5 space-y-1"
            style={{ background: '#0d0e10', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {[
              { id: 'how-it-works', label: 'How It Works' },
              { id: 'features',     label: 'Features' },
              { id: 'for-shops',    label: 'For Shops' },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="block w-full text-left text-sm font-medium py-3 hover:text-white transition-colors"
                style={{ color: '#94a3b8' }}>
                {label}
              </button>
            ))}
            <Link href="/p" className="block text-sm font-semibold py-2" style={{ color: '#60a5fa' }}
              onClick={() => setNavOpen(false)}>
              Customer Portal &rarr;
            </Link>
          </div>
        )}
      </header>

      {/* ─── HERO ─── */}
      <section className="relative flex items-center pt-16 overflow-hidden" style={{ minHeight: '100vh' }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          animation: 'pb-grid-pulse 6s ease-in-out infinite',
        }} />
        <div className="absolute pointer-events-none" aria-hidden="true" style={{
          top: '10%', right: '15%', width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.12) 0%, transparent 70%)',
        }} />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 w-full py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            <div>
              <div className="pb-animate-badge-pop inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-8"
                style={{ background: 'rgba(30,58,138,0.4)', border: '1px solid rgba(37,99,235,0.4)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#60a5fa' }} />
                <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: '#93c5fd' }}>
                  Smart Print Automation
                </span>
              </div>

              <h1 className="pb-animate-fade-up pb-delay-1 font-black tracking-tight leading-tight mb-6"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', lineHeight: 1.03 }}>
                <span className="text-white">Scan.</span><br />
                <span className="text-white">Upload.</span><br />
                <span className="text-white">Pay.</span><br />
                <span className="pb-animate-fade-up pb-delay-2" style={{ color: '#3b82f6' }}>Print.</span>
              </h1>

              <p className="pb-animate-fade-up pb-delay-3 text-lg leading-relaxed max-w-lg mb-10"
                style={{ color: '#94a3b8' }}>
                PrintBolt turns any print shop into a self-service kiosk.
                Customers scan, upload, and pay from their phone.
                Print jobs spool automatically &mdash; no staff needed.
              </p>

              <div className="pb-animate-fade-up pb-delay-4 flex flex-col sm:flex-row gap-3">
                <button onClick={() => scrollTo('how-it-works')}
                  className="inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3.5 rounded-lg text-white hover:opacity-90 transition-opacity"
                  style={{ background: '#2563EB' }}>
                  See How It Works <ChevronRight className="w-4 h-4" />
                </button>
                <Link href="/p"
                  className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3.5 rounded-lg hover:border-white/25 transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1' }}>
                  Customer Portal
                </Link>
              </div>

              <div className="pb-animate-fade-up pb-delay-5 flex flex-wrap items-center gap-5 mt-10 pt-8"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {[
                  { icon: ShieldCheck, text: 'Files auto-deleted after print' },
                  { icon: Zap,         text: 'Sub-second queue delivery' },
                  { icon: Smartphone,  text: 'No app required' },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: '#3b82f6' }} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pb-animate-fade-in pb-delay-3 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm rounded-2xl p-8" style={{
                background: 'linear-gradient(135deg, #0f1117 0%, #13161e 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 0 80px 0 rgba(37,99,235,0.12)',
              }}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-[10px] font-mono tracking-widest uppercase mb-1" style={{ color: '#374151' }}>
                      Live Queue
                    </div>
                    <div className="text-sm font-bold text-white">Print Pipeline</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#34d399' }} />
                    <span className="text-[10px] font-bold" style={{ color: '#34d399' }}>ONLINE</span>
                  </div>
                </div>

                <PrintPipeline />

                <div className="mt-8 pt-5 flex items-center justify-between"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <div className="text-xl font-black text-white tabular-nums">&lt; 3s</div>
                    <div className="text-[10px] mt-0.5 uppercase tracking-wider" style={{ color: '#374151' }}>
                      Queue to spool
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-white">100%</div>
                    <div className="text-[10px] mt-0.5 uppercase tracking-wider" style={{ color: '#374151' }}>
                      Auto-managed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-16" style={{
        background: '#0b0c0e',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="max-w-5xl mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-10">
          <StatCounter value={0}   prefix="&#8377;" suffix=""     label="Setup Cost" />
          <StatCounter value={3}   suffix="s"                     label="Avg Queue Time" />
          <StatCounter value={100} suffix="%"                     label="Serverless" />
          <StatCounter value={0}   suffix=" Apps"                 label="Required to Install" />
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 md:py-32" style={{ background: '#08090a' }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: '#2563EB' }} />
              <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase" style={{ color: '#3b82f6' }}>
                Process
              </span>
            </div>
            <h2 className="font-black tracking-tight text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Four steps.<br />
              <span style={{ color: '#64748b' }}>Zero friction.</span>
            </h2>
            <p className="max-w-md text-base leading-relaxed" style={{ color: '#64748b' }}>
              From QR scan to printed page in under 60 seconds.
              Customers never need an account, app, or queue number.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            <WorkflowStep num="01" icon={QrCode} title="Scan QR" color="#3b82f6" delay="pb-delay-1"
              desc="The shop displays a unique PrintBolt QR code. Customers scan it — no link sharing, no typing URLs." />
            <WorkflowStep num="02" icon={UploadCloud} title="Upload Document" color="#6366f1" delay="pb-delay-2"
              desc="Upload any PDF directly from their phone. Select pages visually from thumbnail previews." />
            <WorkflowStep num="03" icon={CreditCard} title="Pay Online" color="#8b5cf6" delay="pb-delay-3"
              desc="Checkout via Razorpay. GPay, PhonePe, UPI — any method the customer prefers. No cash handling." />
            <WorkflowStep num="04" icon={Printer} title="Auto Print" color="#06b6d4" delay="pb-delay-4"
              desc="The job enters the queue instantly. The shop printer agent spools it automatically — no staff action required." />
          </div>

          <div className="hidden lg:flex items-center justify-between mt-6 px-4" aria-hidden="true">
            {[0, 1, 2, 3].map(i => (
              <React.Fragment key={i}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.35)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: '#3b82f6' }} />
                </div>
                {i < 3 && (
                  <div className="flex-1 flex items-center mx-2">
                    <div className="h-px flex-1"
                      style={{ background: 'linear-gradient(90deg, rgba(37,99,235,0.5), rgba(99,102,241,0.3))' }} />
                    <ChevronRight className="w-3.5 h-3.5 -ml-1 flex-shrink-0" style={{ color: '#1e3a5f' }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 md:py-32"
        style={{ background: '#0b0c0e', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ background: '#2563EB' }} />
                <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase" style={{ color: '#3b82f6' }}>
                  Features
                </span>
              </div>
              <h2 className="font-black tracking-tight text-white leading-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Built for speed.<br />
                <span style={{ color: '#64748b' }}>Designed for trust.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed" style={{ color: '#64748b' }}>
              Every feature solves a real problem in the print shop workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Smartphone,  title: 'Zero App Friction', span: 'lg:col-span-2', accent: '#3b82f6',
                desc: 'Works on any mobile browser. No downloads, no accounts, no passwords. Scan the QR and print in 60 seconds.' },
              { icon: ShieldCheck, title: 'Auto File Deletion', span: '', accent: '#10b981',
                desc: 'Documents are stored in encrypted private storage and signed URLs. Spooled files are permanently deleted after the print job completes.' },
              { icon: Layers,      title: 'Visual Page Selection', span: '', accent: '#6366f1',
                desc: 'Customers select pages from thumbnail grids or enter range syntax like "1-3, 5, 8-12". Never print the wrong pages again.' },
              { icon: Zap,         title: 'Instant Hardware Polling', span: '', accent: '#f59e0b',
                desc: 'The desktop print agent polls for new jobs in real time. Jobs spool the moment a printer comes online — no staff needed.' },
              { icon: BarChart3,   title: 'Print History & Revenue Tracking', span: 'lg:col-span-2', accent: '#8b5cf6',
                desc: 'Shop owners get a full queue history with per-job revenue. Monitor output, track print volumes, and audit every job.' },
            ].map(({ icon: Icon, title, desc, span, accent }) => (
              <div key={title} className={`${span} rounded-2xl p-6 md:p-7 flex flex-col gap-4 group cursor-default`}
                style={{
                  background: 'linear-gradient(135deg, #0f1015 0%, #111318 100%)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'border-color 0.3s',
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${accent}16`, border: `1px solid ${accent}30` }}>
                  <Icon className="w-5 h-5" style={{ color: accent }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECURITY CALLOUT ─── */}
      <section className="py-16 md:py-20"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: '#08090a' }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="rounded-2xl overflow-hidden relative p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center"
            style={{
              background: 'linear-gradient(135deg, #0c1528 0%, #0d1a3a 100%)',
              border: '1px solid rgba(37,99,235,0.2)',
            }}>
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{
              backgroundImage: 'linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px)',
              backgroundSize: '40px 40px', opacity: 0.05,
            }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)' }}>
                  <ShieldCheck className="w-5 h-5" style={{ color: '#60a5fa' }} />
                </div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase" style={{ color: '#60a5fa' }}>
                  Security First
                </span>
              </div>
              <h2 className="font-black text-white tracking-tight leading-snug mb-4"
                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}>
                Documents are private.<br />
                <span style={{ color: '#60a5fa' }}>Always.</span>
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                Files are stored in private Supabase buckets, accessible only via short-lived signed URLs.
                Once spooled to the printer, they are automatically and permanently deleted.
                No one &mdash; not even PrintBolt &mdash; can access your documents after printing.
              </p>
            </div>
            <div className="relative space-y-3">
              {[
                'Private cloud storage with encrypted signed URLs',
                'Auto-deletion after successful print spool',
                'No third-party data sharing',
                'Zero document retention policy',
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#3b82f6' }} />
                  <span className="text-sm" style={{ color: '#cbd5e1' }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOR SHOPS ─── */}
      <section id="for-shops" className="py-24 md:py-32"
        style={{ background: '#0b0c0e', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ background: '#2563EB' }} />
                <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase" style={{ color: '#3b82f6' }}>
                  For Print Shops
                </span>
              </div>
              <h2 className="font-black tracking-tight text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Your shop.<br />
                <span style={{ color: '#64748b' }}>On autopilot.</span>
              </h2>
              <p className="text-base leading-relaxed mb-10" style={{ color: '#94a3b8' }}>
                PrintBolt gives your shop a permanent QR code that customers scan to order directly.
                You set your pricing. Payments go to you. The desktop agent handles everything else.
              </p>
              <div className="space-y-5">
                {[
                  { icon: QrCode,     title: 'Permanent Shop QR Code',    desc: 'One QR code links to your shop forever. Display it anywhere.' },
                  { icon: CreditCard, title: 'Online Payments, Your Way', desc: 'Set B&W, colour, and duplex prices. Razorpay handles checkout.' },
                  { icon: BarChart3,  title: 'Queue & History Dashboard', desc: 'See every job: who ordered, how many pages, how much revenue.' },
                  { icon: Clock,      title: 'Reprint Any Job',           desc: 'Fetch any past job and reprint it instantly from the dashboard.' },
                ].map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)' }}>
                      <Icon className="w-4 h-4" style={{ color: '#3b82f6' }} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white mb-0.5">{title}</div>
                      <div className="text-sm" style={{ color: '#64748b' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="rounded-2xl overflow-hidden" style={{
                background: '#0f1015',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
              }}>
                <div className="px-4 py-3 flex items-center gap-2"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0c0d10' }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(239,68,68,0.6)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(234,179,8,0.6)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(34,197,94,0.6)' }} />
                  <div className="ml-4 flex-1 rounded-md px-3 py-1 text-[11px]"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#4b5563' }}>
                    PrintBolt Shop Dashboard
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[{ label: 'Jobs Today', value: '24' }, { label: 'Revenue', value: '\u20B9312' }, { label: 'Queue', value: '2' }]
                      .map(({ label, value }, i) => (
                        <div key={i} className="rounded-xl p-3"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div className="text-lg font-black text-white">{value}</div>
                          <div className="text-[10px] mt-0.5 uppercase tracking-wider" style={{ color: '#374151' }}>{label}</div>
                        </div>
                      ))}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: '#374151' }}>Active Queue</div>
                    <div className="space-y-2">
                      {[
                        { name: 'Report_Final.pdf', pages: '12 pages', status: 'Printing', c: '#3b82f6' },
                        { name: 'Invoice_Aug.pdf',  pages: '3 pages',  status: 'Queued',   c: '#f59e0b' },
                      ].map(({ name, pages, status, c }, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div>
                            <div className="text-xs font-semibold text-white">{name}</div>
                            <div className="text-[10px] mt-0.5" style={{ color: '#374151' }}>{pages}</div>
                          </div>
                          <div className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                            style={{ color: c, background: `${c}18` }}>{status}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}>
                    <QrCode className="w-7 h-7 flex-shrink-0" style={{ color: '#3b82f6' }} />
                    <div>
                      <div className="text-xs font-bold text-white">Your Shop QR Code</div>
                      <div className="text-[10px]" style={{ color: '#4b5563' }}>printbolt.store/p?shopId=your-id</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: '#08090a' }}>
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)' }}>
            <Zap className="w-6 h-6" style={{ color: '#60a5fa' }} />
          </div>
          <h2 className="font-black tracking-tight text-white mb-5" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}>
            Ready to bolt?
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: '#64748b' }}>
            Set up your print shop in minutes. No hardware changes. No monthly fees to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:hello@printbolt.store"
              className="inline-flex items-center justify-center gap-2 font-bold text-sm px-8 py-4 rounded-xl text-white hover:opacity-90 transition-opacity"
              style={{ background: '#2563EB' }}>
              Contact Us to Get Started <ArrowRight className="w-4 h-4" />
            </a>
            <Link href="/p"
              className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-8 py-4 rounded-xl hover:text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1' }}>
              Customer Print Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#06070a' }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: '#2563EB' }}>
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <span className="font-black text-base text-white">PrintBolt</span>
              </div>
              <p className="text-xs max-w-xs" style={{ color: '#374151' }}>
                Smart self-service printing for modern print shops.
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              {[
                { label: 'How It Works', fn: () => scrollTo('how-it-works') },
                { label: 'Features',     fn: () => scrollTo('features') },
                { label: 'For Shops',    fn: () => scrollTo('for-shops') },
              ].map(({ label, fn }) => (
                <button key={label} onClick={fn}
                  className="text-xs hover:text-slate-300 transition-colors" style={{ color: '#374151' }}>
                  {label}
                </button>
              ))}
              <Link href="/p" className="text-xs hover:text-slate-300 transition-colors" style={{ color: '#374151' }}>
                Customer Portal
              </Link>
              <a href="mailto:hello@printbolt.store"
                className="text-xs hover:text-slate-300 transition-colors" style={{ color: '#374151' }}>
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs" style={{ color: '#1f2937' }}>
              &copy; {new Date().getFullYear()} PrintBolt Automatic Printing System. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#1e3a5f' }} />
              <span className="text-xs" style={{ color: '#1f2937' }}>SSL Secured &middot; Files auto-deleted after print</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
