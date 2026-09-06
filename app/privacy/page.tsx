import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Trash2, 
  CreditCard, 
  Database, 
  FileText, 
  Server, 
  UserCheck, 
  Phone, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { Navbar } from '../../components/home/Navbar';
import { Footer } from '../../components/home/Footer';
import { AmbientLightning } from '../../components/home/AmbientLightning';

export const metadata: Metadata = {
  title: 'Privacy Policy — PrintBolt',
  description: 'Learn how PrintBolt protects your personal data, ensures 5-minute ephemeral file deletion, and secures counter print workflows.',
};

export default function PrivacyPage() {
  const lastUpdated = 'September 2026';

  const highlights = [
    {
      icon: Clock,
      title: '5-Minute Ephemeral Storage',
      desc: 'Customer uploaded documents are held strictly in transit and permanently deleted within 5 minutes of print completion.',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      icon: ShieldCheck,
      title: '100% Virus-Free Sandboxing',
      desc: 'Uploads are spooled in a secure isolated environment on the shop PC, preventing pendrive malware or malicious scripts.',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      icon: CreditCard,
      title: 'Zero Payment Data Stored',
      desc: 'All payments are handled by Razorpay (PCI-DSS Level 1). We never access, store, or log card numbers or UPI PINs.',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      icon: Database,
      title: 'Isolated Shop Ledger',
      desc: 'Shopkeeper sales records and audit history are secured with Supabase Row-Level Security — completely inaccessible to others.',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F3F6FC] text-[#0A1128] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-600 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Subtle Ambient Lightning Layer */}
      <AmbientLightning />

      {/* Top Floating Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-28 sm:pt-36 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-slate-700">Legal</span>
            <span>/</span>
            <span className="text-blue-600">Privacy Policy</span>
          </div>

          {/* Hero Banner Header */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0A1128] via-[#0F172A] to-[#1E293B] text-white border border-slate-800 shadow-2xl relative overflow-hidden mb-12">
            <div className="absolute -top-16 -right-16 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Data Privacy & Security</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Privacy Policy
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                PrintBolt is committed to protecting your privacy. We believe your customer documents belong solely to you — which is why customer files are processed ephemerally and automatically purged within 5 minutes.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Last Updated: {lastUpdated}</span>
                <span>•</span>
                <span>Version 1.4</span>
              </div>
            </div>
          </div>

          {/* 4 Trust Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3.5"
                >
                  <div className={`p-2.5 rounded-xl border shrink-0 ${item.badgeColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#0A1128]">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legal Document Content Body */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-10 space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
            
            {/* Section 1 */}
            <section className="space-y-3 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">1</span>
                <span>Overview & Scope</span>
              </h2>
              <p>
                This Privacy Policy explains how <strong>PrintBolt Technologies</strong> (&quot;PrintBolt&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;the platform&quot;), operating via <strong>printbolt.store</strong>, handles information collected through our website, cloud synchronization APIs, and Windows desktop agent software.
              </p>
              <p>
                PrintBolt is a business-to-business (B2B) digital printing enablement platform designed for commercial photocopy, print, and cyber-café shop owners (&quot;Shopkeepers&quot;). Print shop patrons (&quot;Customers&quot;) interact with the platform by scanning shop-counter QR codes to submit print files without needing pen drives or third-party messaging apps.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">2</span>
                <span>Information We Collect</span>
              </h2>
              
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <h3 className="font-bold text-[#0A1128] text-sm flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>A. Information Collected from Shopkeepers</span>
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600 pl-1">
                    <li><strong>Account Credentials:</strong> Email address and authentication tokens via Supabase Auth.</li>
                    <li><strong>Shop Configuration:</strong> Shop name, counter location, printer models, rate configurations (Black & White vs. Colour per-page pricing, duplex discounts).</li>
                    <li><strong>Printing Audit Ledger:</strong> Metadata of print jobs processed (order timestamp, page counts, selected print mode, total price, and fulfillment status).</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <h3 className="font-bold text-[#0A1128] text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>B. Information Collected from Customers (End-Users)</span>
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600 pl-1">
                    <li><strong>Uploaded Documents:</strong> Files submitted for physical printing (PDF, DOCX, JPG, PNG). These are treated as strictly confidential and ephemeral.</li>
                    <li><strong>Print Specifications:</strong> Copies requested, color format, duplex preferences, and paper orientation.</li>
                    <li><strong>Payment Metadata:</strong> Razorpay order ID, payment status, and timestamp. We never view or store bank accounts or card numbers.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <h3 className="font-bold text-[#0A1128] text-sm flex items-center gap-2">
                    <Server className="w-4 h-4 text-purple-600" />
                    <span>C. Technical & Telemetry Information</span>
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600 pl-1">
                    <li>IP address, browser user-agent, operating system version, and anonymous performance telemetry collected via Cloudflare and Supabase to maintain server security, mitigate DDoS attacks, and diagnose network issues.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 - The 5-Minute Rule */}
            <section className="space-y-4 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">3</span>
                <span>The 5-Minute Ephemeral Storage Guarantee</span>
              </h2>
              
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Trash2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Permanent Storage Policy</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                  We believe that customers have a fundamental right to document privacy. PrintBolt operates on a strict <strong>5-minute ephemeral processing policy</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-emerald-800 font-medium pl-1">
                  <li>Customer files are transmitted encrypted to the shop counter PC spooler solely to execute physical printing.</li>
                  <li>Once printing is completed, the file is queued for automated disposal and permanently purged from memory and storage within <strong>5 minutes</strong>.</li>
                  <li>PrintBolt does not read, scrape, index, or harvest user content for AI training, advertising, or data brokerage.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-3 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">4</span>
                <span>How We Use Your Data</span>
              </h2>
              <p>We use the data collected strictly for the following operational purposes:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm pt-1">
                <li className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Executing real-time counter print jobs</span>
                </li>
                <li className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Processing instant UPI and card payments</span>
                </li>
                <li className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Maintaining shopkeeper business audit records</span>
                </li>
                <li className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Delivering desktop agent auto-updates</span>
                </li>
              </ul>
            </section>

            {/* Section 5 - Razorpay & Payment Security */}
            <section className="space-y-4 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">5</span>
                <span>Payment Information & Razorpay Compliance</span>
              </h2>
              <p>
                PrintBolt integrates with <strong>Razorpay</strong>, India&apos;s leading PCI-DSS Level 1 certified payment gateway, to facilitate direct UPI, debit/credit card, and netbanking payments.
              </p>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-900 space-y-1.5">
                <p className="font-semibold">Important Payment Protection Disclosures:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>PrintBolt <strong>never accesses, stores, or handles</strong> customer payment instruments, card numbers, expiry dates, CVVs, or UPI MPINs.</li>
                  <li>Payment transactions occur through Razorpay&apos;s encrypted checkout modal. All data transfers comply with RBI guidelines and tokenization mandates.</li>
                  <li>Our systems only store cryptographic order verification tokens to confirm that a print order has been paid before printing is spooled.</li>
                </ul>
              </div>
            </section>

            {/* Section 6 - Third Parties */}
            <section className="space-y-3 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">6</span>
                <span>Third-Party Infrastructure Partners</span>
              </h2>
              <p>PrintBolt works with trusted industry partners to deliver reliable, high-availability services:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="font-bold text-xs text-[#0A1128]">Supabase Inc.</div>
                  <div className="text-[11px] text-slate-500">PostgreSQL database hosting, secure user authentication, and Row-Level Security isolation.</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="font-bold text-xs text-[#0A1128]">Razorpay Software Ltd.</div>
                  <div className="text-[11px] text-slate-500">RBI-compliant payment processing, webhook verification, and UPI settlement.</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="font-bold text-xs text-[#0A1128]">Cloudflare Inc.</div>
                  <div className="text-[11px] text-slate-500">Global edge CDN, TLS 1.3 encryption, DDoS mitigation, and DNS security.</div>
                </div>
              </div>
            </section>

            {/* Section 7 - Security Standards */}
            <section className="space-y-3 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">7</span>
                <span>Security Standards & Virus-Free Sandboxing</span>
              </h2>
              <p>
                Traditional print shops face severe cyber risks from infected USB pendrives. PrintBolt eliminates this risk by isolating print data:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm pl-1">
                <li><strong>Air-Gapped Transmission:</strong> Customer documents never execute code or scripts on the host PC. They are rendered directly into visual print streams via PdfiumViewer.</li>
                <li><strong>Encryption in Flight:</strong> All web submissions and desktop sync actions are strictly enforced over HTTPS (TLS 1.3).</li>
                <li><strong>Database Isolation:</strong> Multi-tenant isolation guarantees that one shopkeeper cannot view, modify, or intercept another shop&apos;s customer queue or financial records.</li>
              </ul>
            </section>

            {/* Section 8 - User Rights */}
            <section className="space-y-3 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">8</span>
                <span>Your Rights & Data Deletion</span>
              </h2>
              <p>
                In accordance with the <strong>Digital Personal Data Protection (DPDP) Act</strong> and Indian IT Act, 2000:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm pl-1">
                <li><strong>Right to Erase:</strong> Shopkeepers may request account termination and permanent deletion of their business records at any time.</li>
                <li><strong>Right to Correction:</strong> Shopkeepers can update rate structures, printer mappings, and shop details via the desktop agent or web console.</li>
                <li><strong>Customer Data Notice:</strong> Customers do not need an account to use PrintBolt; their files are automatically deleted upon job fulfillment without residual retention.</li>
              </ul>
            </section>

            {/* Section 9 - Contact Information */}
            <section className="space-y-4 pt-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">9</span>
                <span>Contact & Grievance Redressal</span>
              </h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy, please contact our data grievance officer:
              </p>
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs sm:text-sm">
                <div className="font-bold text-[#0A1128]">PrintBolt Technologies — Legal & Grievance Cell</div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <a href="tel:+916000061991" className="hover:text-blue-600 font-mono font-semibold">+91 60000 61991</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <a href="mailto:support@printbolt.in" className="hover:text-blue-600">support@printbolt.in</a>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">
                  Response SLA: We acknowledge grievances within 24 business hours and aim to resolve all data inquiries within 7 business days.
                </div>
              </div>
            </section>

          </div>

          {/* Quick Switch to Terms of Service */}
          <div className="mt-8 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold text-[#0A1128]">Looking for our Terms of Service?</h4>
              <p className="text-xs text-slate-500">Read our terms governing shopkeeper licensing, pricing rules, and counter fulfillment.</p>
            </div>
            <Link
              href="/terms"
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0"
            >
              <span>View Terms of Service</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
