import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  FileText, 
  ShieldAlert, 
  CreditCard, 
  RefreshCw, 
  Printer, 
  Laptop, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  Mail, 
  ArrowLeft, 
  Clock,
  ExternalLink,
  HelpCircle,
  Truck
} from 'lucide-react';
import { Navbar } from '../../components/home/Navbar';
import { Footer } from '../../components/home/Footer';
import { AmbientLightning } from '../../components/home/AmbientLightning';

export const metadata: Metadata = {
  title: 'Terms and Conditions — PrintBolt',
  description: 'Terms and Conditions governing the use of PrintBolt software, customer print portals, payment processing, and counter fulfillment.',
};

export default function TermsPage() {
  const lastUpdated = 'September 2026';

  const highlights = [
    {
      icon: Laptop,
      title: 'Commercial Agent Licensing',
      desc: 'Print shop owners receive a non-exclusive license to operate the PrintBolt desktop agent on counter PCs.',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      icon: Printer,
      title: 'On-Counter Fulfillment',
      desc: 'All print jobs are fulfilled on-premises at the shop counter where the customer submitted their documents.',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      icon: CreditCard,
      title: 'Transparent UPI & Payments',
      desc: 'Prices are calculated transparently based on shopkeeper rate settings and processed securely via Razorpay.',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      icon: RefreshCw,
      title: 'Fair Refund & Reprint Terms',
      desc: 'In case of printer paper jams, toner defects, or power cuts, shopkeepers provide an instant reprint or refund.',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
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
            <span className="text-blue-600">Terms and Conditions</span>
          </div>

          {/* Hero Banner Header */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0A1128] via-[#0F172A] to-[#1E293B] text-white border border-slate-800 shadow-2xl relative overflow-hidden mb-12">
            <div className="absolute -top-16 -right-16 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
                <Scale className="w-3.5 h-3.5 text-blue-400" />
                <span>Legal Agreement</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Terms and Conditions
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Please review these Terms and Conditions carefully before installing the PrintBolt desktop agent or submitting documents through our customer print portals.
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
                <span>Agreement to Terms & Definitions</span>
              </h2>
              <p>
                These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you—whether individually or as a commercial representative of a print establishment—and <strong>PrintBolt Technologies</strong> (&quot;PrintBolt&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
              </p>
              <p>
                By downloading, installing, or executing the <strong>PrintBolt desktop agent</strong>, creating a shopkeeper profile, scanning a PrintBolt shop QR code, or submitting print orders at <strong>printbolt.store</strong>, you acknowledge that you have read, understood, and agreed to be bound by all of these Terms. If you do not agree, you must immediately discontinue use of the platform and software.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm space-y-1 text-slate-600">
                <p><strong>Key Definitions:</strong></p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li><strong>Shopkeeper / Merchant:</strong> The commercial print shop owner or operator who installs and runs PrintBolt software on their premises.</li>
                  <li><strong>Customer / End-User:</strong> Any individual who scans a counter QR code or accesses a shop URL to upload documents for printing.</li>
                  <li><strong>Platform:</strong> The combined ecosystem consisting of the PrintBolt Windows desktop agent, the customer web portal, and cloud queue synchronization APIs.</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">2</span>
                <span>Description of Platform & Services</span>
              </h2>
              <p>
                PrintBolt is a software platform engineered to modernize everyday Indian photocopy, cyber-café, and digital print shops. Key capabilities include:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm pt-1">
                <li className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Contactless customer document upload</span>
                </li>
                <li className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Real-time price calculation per page</span>
                </li>
                <li className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Automated desktop printer spooling</span>
                </li>
                <li className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Integrated digital audit records</span>
                </li>
              </ul>
              <p className="text-xs text-slate-500 pt-1">
                PrintBolt acts solely as a technology service provider facilitating workflow automation between Customers and Shopkeepers. PrintBolt does not own or operate physical printing equipment.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">3</span>
                <span>Shopkeeper Obligations & Operational Standards</span>
              </h2>
              <p>Print shop owners utilizing PrintBolt agree to uphold the following standards:</p>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm pl-1">
                <li><strong>Hardware Maintenance:</strong> Ensure that counter computers, operating systems, and connected printers maintain sufficient paper stock, toner, and functional network drivers.</li>
                <li><strong>Transparent Pricing:</strong> Accurately configure per-page rates (B/W, Colour, Duplex) in the desktop agent so customers see truthful prices before payment.</li>
                <li><strong>Order Fulfillment:</strong> Timely print and release customer jobs once verified on the counter screen.</li>
                <li><strong>Legal Compliance:</strong> Refrain from using PrintBolt to print prohibited, forged, or unlawful documents under Indian jurisdiction.</li>
              </ul>
            </section>

            {/* Section 4 - Acceptable Use & Prohibited Documents */}
            <section className="space-y-4 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">4</span>
                <span>Customer Upload Guidelines & Prohibited Content</span>
              </h2>
              <p>
                Customers uploading files warrant that they possess lawful ownership, copyright, or authorization to print the documents submitted.
              </p>
              
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Strictly Prohibited Content</span>
                </div>
                <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
                  You agree not to upload or attempt to print any of the following:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-rose-800 pl-1">
                  <li>Counterfeit currency notes, forged government bonds, or fake negotiable instruments.</li>
                  <li>Forged identity cards, fake police / military credentials, or fraudulent court seals.</li>
                  <li>Obscene, defamatory, or unlawful materials prohibited under the Indian Penal Code.</li>
                  <li>Copyright-infringing textbooks, books, or proprietary materials in violation of the Indian Copyright Act, 1957.</li>
                </ul>
                <p className="text-[11px] text-rose-700 pt-1">
                  Shopkeepers reserve the absolute right to refuse and report any illegal or suspicious printing attempts to local authorities.
                </p>
              </div>
            </section>

            {/* Section 5 - Pricing & Payments */}
            <section className="space-y-4 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">5</span>
                <span>Pricing, Billing & Payment Processing</span>
              </h2>
              <p>
                All financial transactions on PrintBolt are executed in <strong>Indian National Rupees (INR)</strong>:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm pl-1">
                <li><strong>Dynamic Price Quotation:</strong> The web portal automatically analyzes the uploaded file (page count, selected color mode, single/double sided) and computes the exact payable total before payment is collected.</li>
                <li><strong>Payment Gateway:</strong> Payments are processed via <strong>Razorpay</strong> through secure UPI QR, Google Pay, PhonePe, Paytm, debit/credit cards, or netbanking.</li>
                <li><strong>Instant Verification:</strong> Upon successful payment capture, an automated confirmation token releases the document into the shopkeeper&apos;s active print spool.</li>
              </ul>
            </section>

            {/* Section 6 - Fulfillment & Delivery Policy */}
            <section className="space-y-4 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">6</span>
                <span>Fulfillment, Shipping & Counter Delivery Policy</span>
              </h2>
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-[#0A1128] font-bold text-sm">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>On-Premises Counter Delivery</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  PrintBolt operates as an <strong>on-counter print automation service</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600 pl-1">
                  <li><strong>Delivery Mechanism:</strong> Physical prints are fulfilled at the specific print shop counter where the order was placed. There is no shipping, courier, or postal dispatch involved.</li>
                  <li><strong>Turnaround Time:</strong> Once payment is verified, printing initiates within seconds on the shopkeeper&apos;s printer. Documents are typically ready for pickup within 1 to 5 minutes depending on job page volume.</li>
                  <li><strong>Collection:</strong> Customers present their digital order token or name at the shop counter to collect their fresh physical prints.</li>
                </ul>
              </div>
            </section>

            {/* Section 7 - Cancellation & Refund Policy */}
            <section className="space-y-4 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">7</span>
                <span>Cancellation & Refund Policy</span>
              </h2>
              <p>
                We strive for total satisfaction on every print job. Because printing consumes physical paper and ink immediately, our cancellation policy operates as follows:
              </p>

              <div className="space-y-3 pt-1 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <div className="font-bold text-[#0A1128]">A. Technical Jam or Hardware Failure (Full Refund / Instant Reprint)</div>
                  <p className="text-slate-600">
                    If payment was captured but the print shop experiences a hardware paper jam, printer breakdown, or power outage that cannot be fulfilled within 10 minutes, the shopkeeper will provide an immediate reprint or initiate an electronic refund via Razorpay to the original source account within 3 to 5 business days.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <div className="font-bold text-[#0A1128]">B. Quality & Print Defects</div>
                  <p className="text-slate-600">
                    If prints exhibit severe toner smudges, skewed alignment, or torn pages caused by printer failure, the shopkeeper will re-print the affected pages immediately at zero additional fee.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <div className="font-bold text-[#0A1128]">C. Completed Prints (Non-Cancellable)</div>
                  <p className="text-slate-600">
                    Orders that have been physically printed according to the user-selected settings (e.g., customer mistakenly requested Colour instead of B/W or uploaded the wrong file) cannot be cancelled or refunded once physical consumables have been exhausted.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8 - Ephemeral File Processing */}
            <section className="space-y-3 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">8</span>
                <span>Ephemeral File Processing & Retention</span>
              </h2>
              <p>
                As detailed in our <Link href="/privacy" className="text-blue-600 underline font-semibold">Privacy Policy</Link>, PrintBolt enforces a strict <strong>5-minute ephemeral lifecycle</strong>. Files are stored only during transmission and spooling, and permanently erased from memory and disk within 5 minutes after print completion.
              </p>
              <p className="text-xs text-slate-500">
                Customers must retain their original digital files on their personal phones or devices. PrintBolt cannot recover files after the 5-minute deletion window.
              </p>
            </section>

            {/* Section 9 - Intellectual Property */}
            <section className="space-y-3 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">9</span>
                <span>Intellectual Property</span>
              </h2>
              <p>
                The PrintBolt desktop agent, web portals, user interfaces, branding, logos, and source code are the exclusive intellectual property of PrintBolt Technologies. Users receive a limited, revocable, non-transferable license to utilize the software for counter print operations.
              </p>
              <p>
                Customers retain all existing copyright and intellectual property rights in their uploaded document files.
              </p>
            </section>

            {/* Section 10 - Disclaimers & Liability */}
            <section className="space-y-3 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">10</span>
                <span>Disclaimer of Warranties & Limitation of Liability</span>
              </h2>
              <p>
                The PrintBolt platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. PrintBolt Technologies shall not be liable for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm pl-1">
                <li>Local printer malfunctions, ink exhaustion, or hardware paper jams on shopkeeper premises.</li>
                <li>Power disruptions, Internet service provider outages, or third-party bank UPI downtimes.</li>
                <li>Misprints resulting from low-resolution or corrupted customer-submitted files.</li>
              </ul>
            </section>

            {/* Section 11 - Governing Law */}
            <section className="space-y-3 pb-8 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">11</span>
                <span>Governing Law & Dispute Resolution</span>
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any legal disputes arising under these Terms shall be subject to the exclusive jurisdiction of competent courts in India.
              </p>
            </section>

            {/* Section 12 - Contact */}
            <section className="space-y-4 pt-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200">12</span>
                <span>Contact & Support Inquiries</span>
              </h2>
              <p>
                If you have questions about these Terms and Conditions or require assistance with print orders, please contact our support desk:
              </p>
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs sm:text-sm">
                <div className="font-bold text-[#0A1128]">PrintBolt Technologies — Support Desk</div>
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
                  Support hours: Monday to Saturday, 9:00 AM to 9:00 PM IST.
                </div>
              </div>
            </section>

          </div>

          {/* Quick Switch to Privacy Policy */}
          <div className="mt-8 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold text-[#0A1128]">Want to know how we protect your documents?</h4>
              <p className="text-xs text-slate-500">Read our Privacy Policy and 5-minute ephemeral storage commitment.</p>
            </div>
            <Link
              href="/privacy"
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0"
            >
              <span>View Privacy Policy</span>
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
