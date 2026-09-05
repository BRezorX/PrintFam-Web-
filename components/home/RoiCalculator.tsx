'use client';
import React, { useState } from 'react';
import { Calculator, TrendingUp, Clock, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';

export const RoiCalculator: React.FC = () => {
  const [customersPerDay, setCustomersPerDay] = useState<number>(120);
  const [avgPagesPerCustomer, setAvgPagesPerCustomer] = useState<number>(8);
  const [pricePerPage, setPricePerPage] = useState<number>(3); // ₹3 average (blend of B&W and Color)

  // Math:
  // Manual time per customer: ~2.5 mins (asking for file, WhatsApp send, download, open, print, calculate price)
  // PrintBolt time per customer: ~0.5 mins (already in queue, click print)
  // Time saved per customer: 2.0 mins
  const minutesSavedPerDay = customersPerDay * 2.0;
  const hoursSavedPerDay = (minutesSavedPerDay / 60).toFixed(1);

  // Extra customers that can be accommodated due to freed up time
  const extraCustomers = Math.floor(customersPerDay * 0.28);
  const extraDailyRevenue = extraCustomers * avgPagesPerCustomer * pricePerPage;
  const extraMonthlyRevenue = extraDailyRevenue * 26; // 26 working days

  return (
    <section id="calculator" className="py-14 sm:py-24 relative bg-gradient-to-b from-blue-50/40 via-white to-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>ROI & Efficiency Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1128] tracking-tight mb-3">
            Calculate Your Shop's Growth
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            See how much counter time you reclaim and how much extra revenue your existing shop PC can generate.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-blue-900/5 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Left Inputs */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Slider 1: Customers per day */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="customers-slider" className="text-xs sm:text-sm font-bold text-slate-700">
                    Customers Served Per Day
                  </label>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-sm">
                    {customersPerDay} customers
                  </span>
                </div>
                <input
                  id="customers-slider"
                  type="range"
                  min="20"
                  max="400"
                  step="10"
                  value={customersPerDay}
                  onChange={(e) => setCustomersPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>20 (Quiet)</span>
                  <span>150 (Average)</span>
                  <span>400+ (High Rush)</span>
                </div>
              </div>

              {/* Slider 2: Average pages per customer */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="pages-slider" className="text-xs sm:text-sm font-bold text-slate-700">
                    Average Pages Per Customer
                  </label>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-sm">
                    {avgPagesPerCustomer} pages
                  </span>
                </div>
                <input
                  id="pages-slider"
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={avgPagesPerCustomer}
                  onChange={(e) => setAvgPagesPerCustomer(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>1 page</span>
                  <span>10 pages</span>
                  <span>30 pages</span>
                </div>
              </div>

              {/* Slider 3: Average Price per page */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="price-slider" className="text-xs sm:text-sm font-bold text-slate-700">
                    Blended Price Per Page (B&W / Color)
                  </label>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-sm">
                    ₹{pricePerPage}.00
                  </span>
                </div>
                <input
                  id="price-slider"
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={pricePerPage}
                  onChange={(e) => setPricePerPage(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>₹2.00 (Standard B&W)</span>
                  <span>₹6.00 (Mixed)</span>
                  <span>₹15.00 (Color/Glossy)</span>
                </div>
              </div>

              {/* Trust checklist */}
              <div className="pt-2 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Eliminates 2 hours of counter waiting lines every single day</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zero lost customers walking away because of a packed counter</span>
                </div>
              </div>

            </div>

            {/* Right Result Panel */}
            <div className="lg:col-span-6 rounded-2xl bg-gradient-to-br from-[#0A1128] to-slate-900 text-white p-6 sm:p-8 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-blue-400 block mb-1">
                  Estimated Monthly Impact
                </span>
                <h3 className="text-2xl font-bold mb-6">Your PrintBolt ROI</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Metric 1 */}
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>Time Saved Daily</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {hoursSavedPerDay} <span className="text-xs font-normal text-slate-300">hrs/day</span>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Extra Walk-ins</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                      +{extraCustomers} <span className="text-xs font-normal text-slate-300">daily</span>
                    </div>
                  </div>
                </div>

                {/* Main Estimated Revenue Callout */}
                <div className="p-4 rounded-xl bg-blue-600/20 border border-blue-500/40 mb-6">
                  <div className="text-xs text-blue-300 font-semibold mb-1">
                    Potential Extra Monthly Profit
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white flex items-center">
                    ₹{extraMonthlyRevenue.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-blue-200 ml-2">/ month</span>
                  </div>
                  <p className="text-[11px] text-blue-200/80 mt-1">
                    By converting queue bottlenecks into extra completed print orders.
                  </p>
                </div>
              </div>

              <a
                href="https://wa.me/916000061991?text=Hi%20PrintBolt%20team,%20I%20used%20the%20ROI%20calculator%20and%20want%20to%20automate%20my%20shop!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm shadow-lg shadow-emerald-500/25 text-center flex items-center justify-center gap-2 transition-all"
              >
                <span>Claim Your Free 14-Day Trial</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

