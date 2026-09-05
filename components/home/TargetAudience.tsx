'use client';
import React from 'react';
import { 
  XeroxShopIllustration, 
  DigitalPrintingIllustration, 
  CollegeAreaShopIllustration, 
  CommercialPrintIllustration 
} from './Illustrations';
import { Check, ArrowRight, Store, Building2, GraduationCap, Briefcase } from 'lucide-react';

export const TargetAudience: React.FC = () => {
  const shopTypes = [
    {
      title: 'Xerox and photocopy shop',
      tag: 'High Footfall',
      desc: 'Perfect for busy street corner shops handling high volume 1-2 page documents, government IDs, certificates, and affidavit copies.',
      features: [
        'Instant ID card front/back single-page print',
        'Queue clears 4x faster during morning rush',
        'Direct UPI scan-and-pay support'
      ],
      illustration: XeroxShopIllustration,
      quote: '“No more customers fighting over whose turn it is. They scan, it queues, I print.”',
    },
    {
      title: 'Digital printing center',
      tag: 'Multi-Format',
      desc: 'Built for high-res color studios handling glossy posters, marketing brochures, CAD architectural plans, and custom paper sizes.',
      features: [
        'Automatic CMYK / Color DPI preservation',
        'Custom paper weight & A3/A4 pricing tiers',
        'Customer approval preview before print'
      ],
      illustration: DigitalPrintingIllustration,
      quote: '“Color jobs are accurately priced automatically — no more undercharging by mistake.”',
    },
    {
      title: 'College area print shops',
      tag: 'Peak Rush Champion',
      desc: 'Tailored for university & coaching hubs facing massive 100+ student rushes before assignment deadlines and exam thesis submissions.',
      features: [
        'Bulk 50+ page thesis & project uploads',
        'Automatic duplex (double-sided) calculation',
        'Students submit from hostel before walking in'
      ],
      illustration: CollegeAreaShopIllustration,
      quote: '“Students send thesis PDFs from their hostel room. When they arrive, their bundle is printed!”',
    },
    {
      title: 'Small commercial print businesses',
      tag: 'B2B & Retail',
      desc: 'Ideal for commercial stationery suppliers, bill book printers, corporate document handlers, and legal documentation hubs.',
      features: [
        'Corporate billing & monthly customer invoicing',
        'High security auto-wipe for confidential files',
        'Multi-printer automated load distribution'
      ],
      illustration: CommercialPrintIllustration,
      quote: '“Our legal and corporate clients love that their sensitive contracts never linger on WhatsApp.”',
    },
  ];

  return (
    <section id="for-shops" className="py-14 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            Tailored For Every Shop
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1128] tracking-tight mb-3">
            FOR PRINT SHOPS
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Whether you run a single-counter street Xerox shop or a multi-machine commercial print hub, PrintBolt adapts to your workflow.
          </p>
        </div>

        {/* 4 Storefront Cards Grid matching mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shopTypes.map((shop, idx) => {
            const Illustration = shop.illustration;

            return (
              <div
                key={shop.title}
                className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Storefront Illustration Banner */}
                  <div className="w-full h-32 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 group-hover:scale-[1.03] transition-transform">
                    <Illustration className="w-24 h-24" />
                  </div>

                  {/* Tag badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50">
                      {shop.tag}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">0{idx + 1}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#0A1128] mb-2 leading-snug">
                    {shop.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {shop.desc}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-1.5 mb-5">
                    {shop.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom quote */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] italic text-slate-500 leading-normal">
                    {shop.quote}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

