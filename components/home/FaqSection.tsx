'use client';
import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, ArrowRight } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does PrintBolt require new hardware, printers, or cabling?',
      a: 'No! PrintBolt runs directly on your existing Windows desktop or laptop PC and connects to your existing printers (whether connected via USB cable, LAN network, or WiFi). You do not need to buy any new equipment.'
    },
    {
      q: 'Do my customers need to download an app from Play Store / App Store?',
      a: 'Never. Customers simply open their smartphone camera, point it at your shop’s printed QR code standee, and the upload page opens immediately in their default mobile browser (Chrome, Safari, etc.). No app install, no account registration, and no permissions needed.'
    },
    {
      q: 'What happens if my shop internet goes down or is slow?',
      a: 'PrintBolt supports local offline routing! Your PC and customers connected to your shop WiFi can transmit documents locally over local network sockets even if external internet bandwidth is slow or intermittent.'
    },
    {
      q: 'How do customers pay me for their prints?',
      a: 'PrintBolt is 100% online payment powered! Customers pay instantly via dynamic UPI QR scan (Google Pay, PhonePe, Paytm, BHIM, or any banking UPI app). The exact calculated bill (e.g. ₹24 for 12 duplex pages) is displayed clearly on both the customer phone and your PC dashboard with instant payment verification, ensuring zero disputes, no loose change hassles, and automated digital bookkeeping.'
    },
    {
      q: 'Are customer documents confidential and protected from viruses?',
      a: '100%. PrintBolt converts files in isolated browser sandboxes before passing them to the print spooler. Executable files (.exe, .bat, macros) and malware shortcuts common on dirty USB drives cannot execute. Furthermore, customer documents are automatically purged from temporary memory once marked completed.'
    },
    {
      q: 'How long does setup take and what printer brands work?',
      a: 'Setup takes under 45 minutes. Our team can guide you via WhatsApp or remote support. PrintBolt works with HP, Canon, Brother, Epson, Ricoh, Konica Minolta, Xerox, Kyocera, and any printer that has a Windows print driver.'
    },
  ];

  return (
    <section id="faq" className="py-14 sm:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1128] tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Everything you need to know about modernising your counter with PrintBolt.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-200 transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-[#0A1128]">
                    {faq.q}
                  </span>
                  <div className={`p-1.5 rounded-full bg-slate-100 text-slate-500 transition-transform ${
                    isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-10 p-6 rounded-2xl bg-blue-50/60 border border-blue-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-sm sm:text-base text-[#0A1128]">
              Have a specific printer model or multi-counter shop setup?
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Talk directly with our technical deployment team on WhatsApp.
            </p>
          </div>

          <a
            href="https://wa.me/916000061991?text=Hi%20PrintBolt%20team,%20I%20have%20a%20question%20about%20my%20printers."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs sm:text-sm font-semibold shadow-md flex items-center gap-1.5 whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};

