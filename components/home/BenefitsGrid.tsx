'use client';
import React from 'react';
import { 
  Files, 
  Users, 
  Timer, 
  BarChart3, 
  SlidersHorizontal, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle,
  Zap
} from 'lucide-react';

export const BenefitsGrid: React.FC = () => {
  return (
    <section id="benefits" className="py-14 sm:py-24 relative bg-gradient-to-b from-transparent via-blue-50/30 to-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            Core Advantages
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1128] tracking-tight mb-3">
            Benefits
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Built specifically for the real-world daily hustle of Indian photocopy and digital printing shops.
          </p>
        </div>

        {/* 3x2 Grid matching mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* 1. Reduces manual work */}
          <div className="rounded-3xl p-7 bg-white border border-slate-200/80 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group">
            <div>
              {/* Illustrated Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="12" width="24" height="30" rx="3" fill="#E2E8F0" stroke="#0A1128" strokeWidth="2.5" />
                  <rect x="16" y="6" width="24" height="30" rx="3" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2.5" />
                  <path d="M22 14H32M22 20H34M22 26H30" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="34" cy="30" r="7" fill="#10B981" />
                  <path d="M31 30L33 32L37 28" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-[#0A1128] mb-2">
                Reduces manual work
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                No more opening 50 WhatsApp chats, saving random attachments to Desktop, or manually calculating page totals with a calculator. Everything arrives pre-formatted and ready to print.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-600">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Saves 2.5 hours of manual work daily</span>
            </div>
          </div>

          {/* 2. Handle more customers simultaneously */}
          <div className="rounded-3xl p-7 bg-white border border-slate-200/80 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group">
            <div>
              {/* Illustrated Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
                  {/* Central node */}
                  <circle cx="24" cy="24" r="8" fill="#3B82F6" stroke="#0A1128" strokeWidth="2.5" />
                  <path d="M24 16V10M24 38V32M16 24H10M38 24H32" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Sub avatars */}
                  <circle cx="10" cy="10" r="5" fill="#FCD34D" stroke="#0A1128" strokeWidth="2" />
                  <circle cx="38" cy="10" r="5" fill="#10B981" stroke="#0A1128" strokeWidth="2" />
                  <circle cx="10" cy="38" r="5" fill="#EC4899" stroke="#0A1128" strokeWidth="2" />
                  <circle cx="38" cy="38" r="5" fill="#F97316" stroke="#0A1128" strokeWidth="2" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-[#0A1128] mb-2">
                Handle more customers simultaneously
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Even during peak college or court hours, 10 or 20 customers can scan the counter standee and submit documents simultaneously while you calmly process jobs one by one.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-indigo-600">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Zero crowd jamming your shop counter</span>
            </div>
          </div>

          {/* 3. Faster experience for customers */}
          <div className="rounded-3xl p-7 bg-white border border-slate-200/80 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group">
            <div>
              {/* Illustrated Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-6 text-amber-600 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="26" r="14" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2.5" />
                  <path d="M24 12V8M20 8H28" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M24 26L29 21" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Speed lines */}
                  <path d="M6 22H2M8 28H4M7 34H3" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-[#0A1128] mb-2">
                Faster experience for customers
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Customers don't need to ask for your phone number, wait for WhatsApp connection, or spell out their email address. They scan, pick pages, and collect their prints in seconds.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-amber-600">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Average turnaround drops from 8m to 90s</span>
            </div>
          </div>

          {/* 4. Full visibility into your business (Featured with Chart badge) */}
          <div className="rounded-3xl p-7 bg-gradient-to-br from-white to-blue-50/40 border border-blue-200/80 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            
            {/* Top Right Revenue Badge matching mockup */}
            <div className="absolute top-6 right-6">
              <div className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-extrabold shadow-sm flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Revenue +229%</span>
              </div>
            </div>

            <div>
              {/* Illustrated Icon Container with Mini Chart */}
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-[#0A1128] mb-2">
                Full visibility into your business
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Real-time dashboard tracks daily page volume, paper inventory, peak rush hours, and per-staff revenue breakdown. Prevent paper waste and undetected free prints.
              </p>

              {/* Mini visual mockup card inside */}
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Today's Profit Margin</div>
                  <div className="text-sm font-extrabold text-slate-800">₹3,450.00 <span className="text-emerald-500 text-xs font-semibold">(+18.4%)</span></div>
                </div>
                <div className="flex items-end gap-1 h-6">
                  <div className="w-1.5 h-3 bg-blue-200 rounded-t" />
                  <div className="w-1.5 h-4 bg-blue-300 rounded-t" />
                  <div className="w-1.5 h-5 bg-blue-400 rounded-t" />
                  <div className="w-1.5 h-6 bg-blue-600 rounded-t" />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-600">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Real-time paper & ink inventory tracking</span>
            </div>
          </div>

          {/* 5. You stay in full control */}
          <div className="rounded-3xl p-7 bg-white border border-slate-200/80 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group">
            <div>
              {/* Illustrated Icon Container with Toggle Switch */}
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
                  {/* Toggle 1 ON */}
                  <rect x="8" y="10" width="32" height="12" rx="6" fill="#10B981" />
                  <circle cx="34" cy="16" r="4.5" fill="#FFFFFF" />
                  {/* Toggle 2 OFF */}
                  <rect x="8" y="26" width="32" height="12" rx="6" fill="#CBD5E1" />
                  <circle cx="14" cy="32" r="4.5" fill="#FFFFFF" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-[#0A1128] mb-2">
                You stay in full control
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Approve or reject any job with a single click. Override customer page ranges, set emergency rush-order priority, configure custom paper prices, and pause your queue anytime with one switch.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>100% Owner discretion on pricing & approval</span>
            </div>
          </div>

          {/* 6. Zero Virus Risks & File Privacy */}
          <div className="rounded-3xl p-7 bg-white border border-slate-200/80 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group">
            <div>
              {/* Illustrated Shield Icon */}
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-6 text-teal-600 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-8 h-8 text-teal-600" />
              </div>

              <h3 className="text-xl font-bold text-[#0A1128] mb-2">
                Zero virus risks & customer privacy
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Files are strictly converted and sandboxed in the browser. No executable malware or corrupted shortcuts can enter your Windows PC. Customer documents are automatically wiped after printing.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-teal-600">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Automatic document wipe after job complete</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

