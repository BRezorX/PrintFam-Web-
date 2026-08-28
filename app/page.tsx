'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ChevronRight, MessageCircle, Phone, Printer, Zap, Users, Clock, BarChart3, Monitor, Settings, CheckCircle, TrendingUp } from 'lucide-react';

const WA_LINK = 'https://wa.me/916000061991?text=Hi%20PrintBolt%2C%20interested%20in%20modernising%20my%20print%20shop.';
const CALL_NUM = 'tel:+916000061991';
const CALL_DISPLAY = '+91 60000 61991';

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'For Shops', href: '#for-shops' },
  { label: 'Why PrintBolt', href: '#why-printbolt' },
  { label: 'Contact', href: '#contact' },
];

/* SectionLabel */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <div style={{ width: 20, height: 1, background: 'var(--pb-accent)' }} />
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'var(--pb-accent)' }}>{children}</span>
    </div>
  );
}

/* Nav */
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const navStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: scrolled ? 'rgba(250,249,247,0.96)' : 'transparent',
    borderBottom: scrolled ? '1px solid var(--pb-border)' : '1px solid transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    transition: 'all 0.3s ease',
  };
  const innerStyle: React.CSSProperties = {
    maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  };
  return (
    <header style={navStyle}>
      <nav style={innerStyle}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Image src="/logo.jpg" alt="PrintBolt" width={36} height={36} style={{ borderRadius: 8, objectFit: 'contain' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--pb-ink)', letterSpacing: '-0.02em' }}>PrintBolt</span>
        </a>
        <div className="pb-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--pb-ink-mid)', textDecoration: 'none' }}>{l.label}</a>
          ))}
        </div>
        <div className="pb-nav-ctas" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href={CALL_NUM} style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--pb-ink-mid)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--pb-border)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Phone className="w-3.5 h-3.5" /> Call
          </a>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none', padding: '8px 20px', background: 'var(--pb-accent)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Us
          </a>
        </div>
        <button onClick={() => setOpen(!open)} className="pb-hamburger" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }} aria-label="Toggle menu">
          {open ? <X className="w-5 h-5" style={{ color: 'var(--pb-ink)' }} /> : <Menu className="w-5 h-5" style={{ color: 'var(--pb-ink)' }} />}
        </button>
      </nav>
      {open && (
        <div style={{ background: 'var(--pb-paper)', borderTop: '1px solid var(--pb-border)', padding: '20px 24px 28px' }}>
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500, color: 'var(--pb-ink)', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid var(--pb-border)' }}>{l.label}</a>
          ))}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a href={CALL_NUM} style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: 'var(--pb-accent)', textDecoration: 'none', padding: '12px 20px', border: '1px solid var(--pb-accent)', borderRadius: 10, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Phone className="w-4 h-4" /> {CALL_DISPLAY}
            </a>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: '#fff', textDecoration: 'none', padding: '12px 20px', background: 'var(--pb-accent)', borderRadius: 10, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 768px) { .pb-nav-links, .pb-nav-ctas { display: none !important; } .pb-hamburger { display: block !important; } }
      `}</style>
    </header>
  );
}

/* WorkflowVisual */
function WorkflowVisual() {
  const before = [
    { label: 'Customer walks in with a USB', sub: 'File transfer takes time every time', icon: Users },
    { label: 'Staff handles the file manually', sub: 'Prone to errors and delays', icon: Clock },
    { label: 'Queue builds during peak hours', sub: 'Customers wait or walk out', icon: TrendingUp },
  ];
  const after = [
    { label: 'Customer scans shop QR code', sub: 'From their own phone', icon: Printer },
    { label: 'Job routes directly to printer', sub: 'No manual file transfer needed', icon: Zap },
    { label: 'Faster service, happy customers', sub: 'You stay in full control', icon: CheckCircle },
  ];
  const colStyle = (accent: boolean): React.CSSProperties => ({
    background: accent ? 'var(--pb-accent-light)' : 'var(--pb-paper-warm)',
    border: accent ? '1px solid var(--pb-accent-warm)' : '1px solid var(--pb-border)',
    borderRadius: 16, padding: '20px 18px',
  });
  const labelStyle = (accent: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: accent ? 'var(--pb-accent)' : 'var(--pb-ink-faint)', marginBottom: 16,
  });
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {[{ items: before, accent: false, title: 'Before' }, { items: after, accent: true, title: 'With PrintBolt' }].map(col => (
        <div key={col.title} style={colStyle(col.accent)}>
          <div style={labelStyle(col.accent)}>{col.title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {col.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, background: col.accent ? 'rgba(29,78,216,0.1)' : 'var(--pb-paper-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: col.accent ? 'var(--pb-accent)' : 'var(--pb-ink-soft)' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: col.accent ? 'var(--pb-ink)' : 'var(--pb-ink-mid)', lineHeight: 1.3 }}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: col.accent ? 'var(--pb-ink-soft)' : 'var(--pb-ink-faint)', marginTop: 2 }}>{item.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* Hero */
function Hero() {
  return (
    <section style={{ paddingTop: 140, paddingBottom: 100, background: 'var(--pb-paper)', overflow: 'hidden', position: 'relative' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--pb-border) 1px, transparent 1px), linear-gradient(90deg, var(--pb-border) 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: 0.3, pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        <div className="pb-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          <div>
            <SectionLabel>For Print Shop Owners</SectionLabel>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em', color: 'var(--pb-ink)', marginBottom: 24 }}>
              Your print shop,<br /><span style={{ color: 'var(--pb-accent)' }}>upgraded.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.7, color: 'var(--pb-ink-mid)', maxWidth: 480, marginBottom: 40 }}>
              Turn your existing print shop into a faster, smarter, and more automated business — without replacing your current setup or hiring additional staff.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: '#fff', background: 'var(--pb-accent)', textDecoration: 'none', padding: '14px 28px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 12px rgba(29,78,216,0.22)' }}>
                <MessageCircle className="w-4 h-4" /> WhatsApp Us
              </a>
              <a href={CALL_NUM} style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, color: 'var(--pb-ink)', background: 'var(--pb-paper-warm)', textDecoration: 'none', padding: '14px 28px', borderRadius: 10, border: '1px solid var(--pb-border-mid)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Phone className="w-4 h-4" /> {CALL_DISPLAY}
              </a>
            </div>
            <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--pb-green)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600 }}>
                <CheckCircle className="w-4 h-4" /> Works with your existing PC
              </span>
              <div style={{ width: 1, height: 14, background: 'var(--pb-border-mid)' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--pb-green)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600 }}>
                <CheckCircle className="w-4 h-4" /> No new hardware needed
              </span>
            </div>
          </div>
          <div><WorkflowVisual /></div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .pb-hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; } }`}</style>
    </section>
  );
}

/* WhyNow */
function WhyNow() {
  const pains = [
    { n: '01', title: 'Constant file transfers', body: 'Customers arrive with USBs, phones, and email attachments. Your staff spends the first few minutes of every job just receiving the file.' },
    { n: '02', title: 'Manual coordination slows you down', body: 'Every print job requires a conversation, a file transfer, a check. During peak hours, this bottleneck is the biggest drag on your throughput.' },
    { n: '03', title: 'Queues build during busy periods', body: 'When multiple customers arrive at once, only one is being served. The others wait — and some will walk out.' },
    { n: '04', title: 'Your PC is working below its potential', body: 'The shop computer already sits connected to your printer. With PrintBolt, it becomes the intelligent hub of your entire print workflow.' },
    { n: '05', title: 'The print industry is changing', body: 'Customers increasingly expect faster, self-service experiences. Shops that adapt will serve more people with less friction.' },
  ];
  return (
    <section id="why-printbolt" style={{ padding: '100px 24px', background: 'var(--pb-paper-warm)', borderTop: '1px solid var(--pb-border)', borderBottom: '1px solid var(--pb-border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="pb-why-grid" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 80, alignItems: 'start' }}>
          <div>
            <SectionLabel>The Problem</SectionLabel>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.025em', color: 'var(--pb-ink)', marginBottom: 20 }}>
              Traditional print shops are still operating manually.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.7, color: 'var(--pb-ink-mid)', marginBottom: 32 }}>
              Most neighbourhood print shops are highly skilled at printing — but the process of receiving jobs and handling files remains entirely manual.
            </p>
            <div style={{ padding: '20px 24px', background: 'var(--pb-accent-light)', border: '1px solid var(--pb-accent-warm)', borderRadius: 12 }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontStyle: 'italic', fontWeight: 600, color: 'var(--pb-ink)', lineHeight: 1.55 }}>
                &ldquo;PrintBolt is the modernisation layer your shop needs — installed on the computer you already have.&rdquo;
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {pains.map((pain, i) => (
              <div key={pain.n} style={{ display: 'flex', gap: 24, padding: '28px 0', borderBottom: i < pains.length - 1 ? '1px solid var(--pb-border)' : 'none', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: 'var(--pb-ink-faint)', letterSpacing: '0.06em', flexShrink: 0, marginTop: 4 }}>{pain.n}</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 700, color: 'var(--pb-ink)', marginBottom: 8, lineHeight: 1.3 }}>{pain.title}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.65, color: 'var(--pb-ink-mid)' }}>{pain.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .pb-why-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
    </section>
  );
}

/* HowItWorks */
function HowItWorks() {
  const steps = [
    { n: '01', label: 'Install', desc: 'Download and install PrintBolt on your existing shop PC. The setup takes minutes and does not require any technical expertise.' },
    { n: '02', label: 'Set Up', desc: 'Configure your pricing, print preferences, and shop profile. PrintBolt generates your unique shop link for customers.' },
    { n: '03', label: 'Go Live', desc: 'Display your PrintBolt QR code at your counter. Customers submit jobs from their phones — no USB or file transfer required.' },
    { n: '04', label: 'Manage', desc: 'Jobs queue automatically on your PC. Review, approve, and print. Your dashboard shows active jobs, revenue, and history.' },
  ];
  return (
    <section id="how-it-works" style={{ padding: '100px 24px', background: 'var(--pb-paper)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionLabel>How It Works</SectionLabel>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--pb-ink)', marginTop: 4 }}>
            From installation to first print job<br />in under an hour.
          </h2>
        </div>
        <div className="pb-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--pb-border)', border: '1px solid var(--pb-border)', borderRadius: 16, overflow: 'hidden' }}>
          {steps.map((step) => (
            <div key={step.n} style={{ background: 'var(--pb-paper)', padding: '36px 28px' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--pb-accent)', textTransform: 'uppercase' as const, marginBottom: 20 }}>{step.n}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--pb-ink)', marginBottom: 14, letterSpacing: '-0.01em' }}>{step.label}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7, color: 'var(--pb-ink-mid)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .pb-steps-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .pb-steps-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* Benefits */
function Benefits() {
  const items = [
    { icon: Monitor, title: 'Works with your existing PC', desc: 'No new hardware purchase required. PrintBolt runs on the Windows computer already connected to your printer.' },
    { icon: Clock, title: 'Reduce repetitive manual work', desc: 'Stop manually transferring files from every customer. Print jobs arrive digitally, directly to your queue.' },
    { icon: Users, title: 'Handle more customers efficiently', desc: 'Multiple customers can submit jobs simultaneously. You stay focused on printing, not file management.' },
    { icon: Zap, title: 'Faster customer experience', desc: 'From file submission to print in minutes. Customers appreciate the speed and will return.' },
    { icon: BarChart3, title: 'Full visibility into your business', desc: 'Track completed jobs, revenue, and print history in a built-in dashboard. Always know where your shop stands.' },
    { icon: Settings, title: 'You stay in complete control', desc: 'Set your own pricing. Approve jobs before printing. PrintBolt works around your existing workflow.' },
  ];
  return (
    <section id="benefits" style={{ padding: '100px 24px', background: 'var(--pb-paper-warm)', borderTop: '1px solid var(--pb-border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Benefits</SectionLabel>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--pb-ink)', marginTop: 4, maxWidth: 560 }}>
            Built for the practical needs of a real print shop.
          </h2>
        </div>
        <div className="pb-benefits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--pb-border)' }}>
          {items.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} style={{ background: 'var(--pb-paper)', padding: '32px 28px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--pb-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--pb-accent)' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: 'var(--pb-ink)', marginBottom: 10, lineHeight: 1.3 }}>{b.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.65, color: 'var(--pb-ink-mid)' }}>{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .pb-benefits-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .pb-benefits-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ForShops */
function ForShops() {
  const types = [
    'Xerox and photocopy shops',
    'Digital printing centres',
    'Document printing shops',
    'Small commercial print businesses',
    'College area print shops',
    'Local stationery and print shops',
  ];
  return (
    <section id="for-shops" style={{ padding: '100px 24px', background: 'var(--pb-ink)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="pb-shops-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 20, height: 1, background: '#93c5fd' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#93c5fd' }}>For Print Shops</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#F8F8F5', lineHeight: 1.15, marginBottom: 24 }}>
              PrintBolt is designed for shops like yours.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.7, color: '#9CA3AF', marginBottom: 36 }}>
              Whether you run a small neighbourhood print shop or a busy document centre near a college or office hub, PrintBolt was built for the Indian print shop context.
            </p>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: 'var(--pb-ink)', background: '#F8F8F5', textDecoration: 'none', padding: '14px 28px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <MessageCircle className="w-4 h-4" /> Talk to Us on WhatsApp
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {types.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 0', borderBottom: i < types.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <CheckCircle className="w-4 h-4" style={{ color: '#60a5fa', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500, color: '#D1D5DB' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .pb-shops-grid { grid-template-columns: 1fr !important; gap: 48px !important; } }`}</style>
    </section>
  );
}

/* FinalCTA */
function FinalCTA() {
  return (
    <section id="contact" style={{ padding: '100px 24px', background: 'var(--pb-paper)', borderTop: '1px solid var(--pb-border)' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {[0,1,2,3,4].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: i === 2 ? 'var(--pb-accent)' : 'var(--pb-border-mid)' }} />)}
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--pb-ink)', lineHeight: 1.1, marginBottom: 20 }}>
          Ready to modernise your print shop?
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.7, color: 'var(--pb-ink-mid)', marginBottom: 44 }}>
          Talk to the PrintBolt team today. We will walk you through the setup, answer your questions, and help you get started without any disruption to your current operations.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#fff', background: 'var(--pb-accent)', textDecoration: 'none', padding: '16px 32px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 16px rgba(29,78,216,0.25)' }}>
            <MessageCircle className="w-5 h-5" /> WhatsApp Us
          </a>
          <a href={CALL_NUM} style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 16, color: 'var(--pb-ink)', background: 'var(--pb-paper-warm)', textDecoration: 'none', padding: '16px 32px', borderRadius: 12, border: '1px solid var(--pb-border-mid)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Phone className="w-5 h-5" /> {CALL_DISPLAY}
          </a>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--pb-ink-faint)', marginTop: 28 }}>
          Available Monday – Saturday, 10 AM – 7 PM IST
        </p>
      </div>
    </section>
  );
}

/* Footer */
function Footer() {
  return (
    <footer style={{ background: 'var(--pb-paper-warm)', borderTop: '1px solid var(--pb-border)', padding: '64px 24px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="pb-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Image src="/logo.jpg" alt="PrintBolt" width={32} height={32} style={{ borderRadius: 7, objectFit: 'contain' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--pb-ink)', letterSpacing: '-0.02em' }}>PrintBolt</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.65, color: 'var(--pb-ink-mid)', maxWidth: 280 }}>
              The modern operating system for neighbourhood print shops across India.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--pb-ink-faint)', marginBottom: 16 }}>Navigation</div>
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--pb-ink-mid)', textDecoration: 'none', marginBottom: 10 }}>{l.label}</a>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--pb-ink-faint)', marginBottom: 16 }}>Legal</div>
            <Link href="/privacy" style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--pb-ink-mid)', textDecoration: 'none', marginBottom: 10 }}>Privacy Policy</Link>
            <Link href="/terms" style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--pb-ink-mid)', textDecoration: 'none', marginBottom: 10 }}>Terms of Service</Link>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--pb-ink-faint)', marginBottom: 16 }}>Contact</div>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--pb-ink-mid)', textDecoration: 'none', marginBottom: 10 }}>
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
            <a href={CALL_NUM} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--pb-ink-mid)', textDecoration: 'none' }}>
              <Phone className="w-4 h-4" /> {CALL_DISPLAY}
            </a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--pb-border)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--pb-ink-faint)' }}>
            &copy; 2026 PrintBolt. All rights reserved.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--pb-ink-faint)' }}>
            Made for Indian print shops.
          </p>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .pb-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; } }
        @media (max-width: 480px) { .pb-footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}

/* HomePage */
export default function HomePage() {
  return (
    <main style={{ background: 'var(--pb-paper)' }}>
      <Nav />
      <Hero />
      <WhyNow />
      <HowItWorks />
      <Benefits />
      <ForShops />
      <FinalCTA />
      <Footer />
    </main>
  );
}
