'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FrustratedShopkeeperIllustration, 
  LooseUsbIllustration, 
  CrowdedQueueIllustration, 
  AngryCustomersIllustration,
  CalmCounterIllustration, 
  ScanQrPhoneIllustration, 
  AutomatedHandoffIllustration, 
  HappyCustomerIllustration 
} from './Illustrations';
import { 
  Sparkles, 
  Zap, 
  ArrowLeftRight, 
  Check, 
  X, 
  Flame, 
  RotateCcw, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

// Floating Lightning Particle interface
interface FloatingLightning {
  id: number;
  left: string;
  top: string;
  size: number;
  color: 'amber' | 'cyan' | 'gold' | 'blue';
  rotate: number;
  delay: number;
  duration: number;
  xOffset: number;
  yOffset: number;
}

const FLOATING_LIGHTNING_DATA: FloatingLightning[] = [
  { id: 1, left: '20%', top: '65%', size: 36, color: 'amber', rotate: -18, delay: 0.02, duration: 1.1, xOffset: -40, yOffset: -120 },
  { id: 2, left: '32%', top: '55%', size: 44, color: 'cyan', rotate: 25, delay: 0.08, duration: 1.2, xOffset: -20, yOffset: -150 },
  { id: 3, left: '48%', top: '50%', size: 56, color: 'gold', rotate: -10, delay: 0.05, duration: 1.3, xOffset: 0, yOffset: -180 },
  { id: 4, left: '64%', top: '58%', size: 42, color: 'amber', rotate: 22, delay: 0.12, duration: 1.15, xOffset: 35, yOffset: -140 },
  { id: 5, left: '78%', top: '68%', size: 38, color: 'cyan', rotate: -25, delay: 0.16, duration: 1.25, xOffset: 50, yOffset: -130 },
  { id: 6, left: '15%', top: '40%', size: 32, color: 'gold', rotate: 30, delay: 0.2, duration: 1.05, xOffset: -60, yOffset: -100 },
  { id: 7, left: '85%', top: '42%', size: 34, color: 'amber', rotate: -35, delay: 0.18, duration: 1.1, xOffset: 55, yOffset: -110 },
  { id: 8, left: '40%', top: '70%', size: 28, color: 'cyan', rotate: 12, delay: 0.25, duration: 1.0, xOffset: -15, yOffset: -90 },
  { id: 9, left: '56%', top: '72%', size: 30, color: 'gold', rotate: -15, delay: 0.22, duration: 1.05, xOffset: 20, yOffset: -95 },
  { id: 10, left: '26%', top: '30%', size: 26, color: 'amber', rotate: -8, delay: 0.3, duration: 0.95, xOffset: -30, yOffset: -80 },
  { id: 11, left: '72%', top: '32%', size: 26, color: 'cyan', rotate: 18, delay: 0.28, duration: 0.95, xOffset: 30, yOffset: -85 },
  { id: 12, left: '50%', top: '25%', size: 48, color: 'gold', rotate: 5, delay: 0.1, duration: 1.2, xOffset: 0, yOffset: -160 }
];

export const ComparisonSlider: React.FC = () => {
  // Initial state: Only "The Chaos" is shown when the site opens
  const [viewMode, setViewMode] = useState<'chaos' | 'harmony'>('chaos');
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [transformKey, setTransformKey] = useState<number>(0);

  // Transformation trigger when clicking the PrintBolt logo or name
  const triggerTransformation = () => {
    setIsTransforming(true);
    // Switch to harmony after floating lightning animation burst
    setTimeout(() => {
      setViewMode('harmony');
      setIsTransforming(false);
      setTransformKey((prev) => prev + 1);
    }, 1100);
  };

  return (
    <section id="comparison" className="py-14 sm:py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
        viewMode === 'chaos' 
          ? 'bg-rose-500/10' 
          : 'bg-emerald-500/15'
      }`} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-3">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Workflow Transformation</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1128] tracking-tight mb-3">
            Before vs. After PrintBolt
          </h2>
          
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {viewMode === 'chaos' ? (
              <span className="text-rose-700 font-medium">
                Showing everyday counter bottlenecks, infected USBs, and queue chaos. Click the <strong>PrintBolt</strong> button below to unleash automated harmony!
              </span>
            ) : (
              <span className="text-emerald-700 font-medium">
                ⚡ Automated Harmony active! Zero WhatsApp clutter, zero virus threats, and instant 1-click printing.
              </span>
            )}
          </p>

          {/* Navigation & PrintBolt Transformation Trigger Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            
            {/* View Mode Pills */}
            <div className="inline-flex items-center p-1 rounded-full bg-slate-100 border border-slate-200/90 shadow-xs">
              <button
                type="button"
                id="btn-view-chaos"
                onClick={() => setViewMode('chaos')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'chaos'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Before: The Chaos</span>
              </button>

              <button
                type="button"
                id="btn-view-harmony"
                onClick={() => {
                  if (viewMode !== 'harmony') triggerTransformation();
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'harmony'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>After: Automated Harmony</span>
              </button>
            </div>

            {/* Prominent PrintBolt Brand Logo & Transformation Trigger Button */}
            <motion.button
              type="button"
              id="printbolt-transform-trigger-btn"
              onClick={triggerTransformation}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="relative px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs sm:text-sm font-black shadow-lg shadow-blue-500/30 flex items-center gap-2 cursor-pointer border border-blue-400/40 group overflow-hidden"
            >
              {/* Electric shimmer wave */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

              {/* Glowing Bolt Icon */}
              <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-black shadow-xs">
                <Zap className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
              </div>

              <span>
                {viewMode === 'chaos' ? (
                  <span>Click <strong className="text-amber-300 underline decoration-amber-300/80">PrintBolt</strong> to Transform</span>
                ) : (
                  <span>Replay <strong className="text-amber-300">PrintBolt</strong> Transformation</span>
                )}
              </span>

              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </motion.button>

          </div>
        </div>

        {/* TRANSFORMATION FLOATING LIGHTNING OVERLAY ANIMATION */}
        <AnimatePresence>
          {isTransforming && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-blue-950/60 backdrop-blur-sm overflow-hidden"
            >
              {/* Expanding Shockwave Lightning Rings */}
              <motion.div 
                initial={{ scale: 0.2, opacity: 0.9 }}
                animate={{ scale: [0.2, 2.5, 4.5], opacity: [0.9, 0.6, 0] }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="absolute w-64 h-64 rounded-full border-4 border-cyan-400/80 shadow-[0_0_80px_rgba(34,211,238,0.8)] pointer-events-none"
              />
              <motion.div 
                initial={{ scale: 0.1, opacity: 0.8 }}
                animate={{ scale: [0.1, 2.0, 3.8], opacity: [0.8, 0.5, 0] }}
                transition={{ duration: 1.1, delay: 0.15, ease: "easeOut" }}
                className="absolute w-64 h-64 rounded-full border-4 border-amber-400/80 shadow-[0_0_80px_rgba(251,191,36,0.8)] pointer-events-none"
              />

              {/* 12 DYNAMIC FLOATING LIGHTNING BOLTS DARTING AND RISING */}
              {FLOATING_LIGHTNING_DATA.map((bolt) => (
                <motion.div
                  key={`floating-lightning-${bolt.id}`}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0, 
                    scale: 0.3,
                    rotate: bolt.rotate 
                  }}
                  animate={{ 
                    x: [0, bolt.xOffset * 0.5, bolt.xOffset, bolt.xOffset * 1.3],
                    y: [0, bolt.yOffset * 0.4, bolt.yOffset, bolt.yOffset * 1.5],
                    opacity: [0, 1, 0.95, 0],
                    scale: [0.3, 1.3, 1.1, 0.6],
                    rotate: [bolt.rotate, bolt.rotate + 15, bolt.rotate - 10, bolt.rotate + 25]
                  }}
                  transition={{
                    duration: bolt.duration,
                    delay: bolt.delay,
                    ease: "easeOut"
                  }}
                  style={{
                    left: bolt.left,
                    top: bolt.top,
                    position: 'absolute'
                  }}
                  className="pointer-events-none z-50 flex items-center justify-center"
                >
                  <div className={`relative flex items-center justify-center ${
                    bolt.color === 'amber'
                      ? 'text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,1)]'
                      : bolt.color === 'cyan'
                      ? 'text-cyan-300 drop-shadow-[0_0_22px_rgba(34,211,238,1)]'
                      : bolt.color === 'gold'
                      ? 'text-yellow-300 drop-shadow-[0_0_25px_rgba(253,224,71,1)]'
                      : 'text-blue-300 drop-shadow-[0_0_18px_rgba(96,165,250,1)]'
                  }`}>
                    <Zap 
                      style={{ width: bolt.size, height: bolt.size }} 
                      className="fill-current animate-pulse" 
                    />
                    {/* Glowing Aura Core */}
                    <div 
                      className="absolute inset-0 blur-xs rounded-full opacity-60 bg-current -z-10" 
                    />
                  </div>
                </motion.div>
              ))}

              {/* Central Power Core */}
              <motion.div 
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: [0.7, 1.15, 1], opacity: 1 }}
                exit={{ scale: 1.25, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative px-8 py-6 rounded-3xl bg-[#0A1128]/95 border-2 border-cyan-400/90 text-white shadow-[0_0_60px_rgba(56,189,248,0.4)] flex flex-col items-center gap-3.5 z-40 max-w-sm text-center mx-4"
              >
                {/* Electric Flash Backdrop Glow */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-amber-400 to-blue-600 opacity-40 blur-lg animate-pulse" />

                <div className="relative w-18 h-18 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <Zap className="w-11 h-11 fill-amber-300 text-amber-300 drop-shadow-[0_0_16px_rgba(251,191,36,0.9)] animate-bounce" />
                </div>

                <div className="relative text-center">
                  <div className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-2">
                    <span>PrintBolt Electric Wave</span>
                    <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                  </div>
                  <div className="text-xs font-semibold text-cyan-200 mt-1 flex items-center justify-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-cyan-300 text-cyan-300" />
                    <span>Eliminating counter queues • Activating Harmony</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Presentation Card */}
        <div className="relative w-full rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-blue-900/5 overflow-hidden">
          
          {/* Card Top Banner Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-8 py-4 border-b border-slate-100 bg-slate-50/70">
            
            {/* Status indicator */}
            <div className="flex items-center gap-2.5">
              {viewMode === 'chaos' ? (
                <>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-rose-700 tracking-wide uppercase flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span>Before: The Chaos (Manual Bottlenecks)</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-700 tracking-wide uppercase flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    <span>After: Automated Harmony (Powered by PrintBolt)</span>
                  </span>
                </>
              )}
            </div>

            {/* Quick action button inside card banner */}
            <div className="flex items-center gap-2">
              {viewMode === 'chaos' ? (
                <button
                  type="button"
                  onClick={triggerTransformation}
                  className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer transition-all animate-pulse"
                >
                  <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                  <span>Click <strong>PrintBolt</strong> to Fix This</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setViewMode('chaos')}
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>See "The Chaos" Again</span>
                </button>
              )}
            </div>

          </div>

          {/* CARD BODY CONTENT */}
          <div className="p-4 sm:p-8">
            
            {/* ----------------------------------------------------- */}
            {/* VIEW 1: THE CHAOS ONLY (Default on initial site open) */}
            {/* ----------------------------------------------------- */}
            {viewMode === 'chaos' && (
              <motion.div 
                key="chaos-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* 4 Chaos Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  
                  {/* Card 1: Frustrated Shopkeeper */}
                  <div className="p-5 rounded-3xl bg-rose-50/40 border-2 border-rose-200/90 shadow-xs flex flex-col items-center text-center justify-between hover:border-rose-300 transition-colors">
                    <div className="w-full flex justify-end">
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-extrabold uppercase tracking-wide">
                        Problem 01
                      </span>
                    </div>
                    <div className="my-3">
                      <FrustratedShopkeeperIllustration className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0A1128] mb-1">
                        Frustrated Shopkeeper
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        Endless file formatting, duplex setting mistakes, and mental stress during morning rushes.
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-100/70 px-2.5 py-1 rounded-full">
                        <X className="w-3.5 h-3.5" /> Manual bottleneck
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Loose USB Drive */}
                  <div className="p-5 rounded-3xl bg-rose-50/40 border-2 border-rose-200/90 shadow-xs flex flex-col items-center text-center justify-between hover:border-rose-300 transition-colors">
                    <div className="w-full flex justify-end">
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-extrabold uppercase tracking-wide">
                        Problem 02
                      </span>
                    </div>
                    <div className="my-3">
                      <LooseUsbIllustration className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0A1128] mb-1">
                        Infected USB Drives
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        Plugging in 50+ student and customer pen drives infects your counter PC with freeze crashes and malware.
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-100/70 px-2.5 py-1 rounded-full">
                        <X className="w-3.5 h-3.5" /> Constant malware risk
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Crowded Queue */}
                  <div className="p-5 rounded-3xl bg-rose-50/40 border-2 border-rose-200/90 shadow-xs flex flex-col items-center text-center justify-between hover:border-rose-300 transition-colors">
                    <div className="w-full flex justify-end">
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-extrabold uppercase tracking-wide">
                        Problem 03
                      </span>
                    </div>
                    <div className="my-3">
                      <CrowdedQueueIllustration className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0A1128] mb-1">
                        Long Crowded Queue
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        Customers waiting 15+ minutes outside your shop, blocking the counter while you manually download files.
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-100/70 px-2.5 py-1 rounded-full">
                        <X className="w-3.5 h-3.5" /> Lost walk-in business
                      </span>
                    </div>
                  </div>

                  {/* Card 4: Stressed Customers */}
                  <div className="p-5 rounded-3xl bg-rose-50/40 border-2 border-rose-200/90 shadow-xs flex flex-col items-center text-center justify-between hover:border-rose-300 transition-colors">
                    <div className="w-full flex justify-end">
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-extrabold uppercase tracking-wide">
                        Problem 04
                      </span>
                    </div>
                    <div className="my-3">
                      <AngryCustomersIllustration className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0A1128] mb-1">
                        Stressed Customers
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        "Did you receive my WhatsApp?" "Where is my print?" Phone storage filled with thousands of customer numbers.
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-100/70 px-2.5 py-1 rounded-full">
                        <X className="w-3.5 h-3.5" /> Phone storage mess
                      </span>
                    </div>
                  </div>

                </div>

                {/* Central Interactive Banner Inviting User to Click PrintBolt */}
                <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0A1128] to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
                  <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                      <Flame className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">
                        Tired of counter bottlenecks and infected USB drives?
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Click PrintBolt to see how automated order handoff fixes your queue in seconds.
                      </p>
                    </div>
                  </div>

                  {/* Primary Interactive Click Trigger */}
                  <button
                    type="button"
                    onClick={triggerTransformation}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 whitespace-nowrap border border-blue-400/30"
                  >
                    <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                    <span>Click <strong>PrintBolt</strong> to Unleash Harmony</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* VIEW 2: AUTOMATED HARMONY (Appears with fresh, smooth animation!) */}
            {/* ----------------------------------------------------------------- */}
            {viewMode === 'harmony' && (
              <motion.div 
                key={`harmony-view-${transformKey}`}
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-6 relative"
              >
                {/* 4 Harmony Cards Grid with fresh staggered animation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  
                  {/* Card 1: Calm, Organized Counter */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="p-5 rounded-3xl bg-emerald-50/40 border-2 border-emerald-200/90 shadow-lg shadow-emerald-500/5 flex flex-col items-center text-center justify-between hover:border-emerald-400 transition-colors"
                  >
                    <div className="w-full flex justify-end">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                        Solution 01
                      </span>
                    </div>
                    <div className="my-3">
                      <CalmCounterIllustration className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0A1128] mb-1">
                        Calm, Organized Counter
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        Shopkeeper reviews job on the PC dashboard and taps "Print" without searching through WhatsApp chats.
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <Check className="w-3.5 h-3.5" /> 1-Click execution
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 2: Customer Scans QR */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="p-5 rounded-3xl bg-emerald-50/40 border-2 border-emerald-200/90 shadow-lg shadow-emerald-500/5 flex flex-col items-center text-center justify-between hover:border-emerald-400 transition-colors"
                  >
                    <div className="w-full flex justify-end">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                        Solution 02
                      </span>
                    </div>
                    <div className="my-3">
                      <ScanQrPhoneIllustration className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0A1128] mb-1">
                        Customer Scans QR
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        Customer uploads PDF/Docs directly in mobile browser in 5 seconds. Zero app downloads required.
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <Check className="w-3.5 h-3.5" /> Zero app required
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 3: Automated Handoff */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="p-5 rounded-3xl bg-emerald-50/40 border-2 border-emerald-200/90 shadow-lg shadow-emerald-500/5 flex flex-col items-center text-center justify-between hover:border-emerald-400 transition-colors"
                  >
                    <div className="w-full flex justify-end">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                        Solution 03
                      </span>
                    </div>
                    <div className="my-3">
                      <AutomatedHandoffIllustration className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0A1128] mb-1">
                        Automated Handoff
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        Exact page count, duplex sides, and color pricing calculated instantly. No manual calculator math errors.
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <Check className="w-3.5 h-3.5" /> Zero calculation errors
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 4: Happy, Returning Users */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="p-5 rounded-3xl bg-emerald-50/40 border-2 border-emerald-200/90 shadow-lg shadow-emerald-500/5 flex flex-col items-center text-center justify-between hover:border-emerald-400 transition-colors"
                  >
                    <div className="w-full flex justify-end">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                        Solution 04
                      </span>
                    </div>
                    <div className="my-3">
                      <HappyCustomerIllustration className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0A1128] mb-1">
                        Happy, Returning Users
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        Zero wait lines, quick UPI scanning, clean printed papers, and high word-of-mouth recommendations.
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <Check className="w-3.5 h-3.5" /> 3x repeat visits
                      </span>
                    </div>
                  </motion.div>

                </div>

                {/* Celebration Harmony Banner */}
                <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0A1128] to-blue-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-emerald-500/30">
                  <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
                        <span>Automated Harmony Activated with PrintBolt</span>
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Cut queue times by 75% • Protect your counter PC from USB viruses • Instant automated pricing
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={triggerTransformation}
                      className="px-4 py-2.5 rounded-full bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 text-xs font-bold transition-all border border-blue-400/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>Replay Transformation</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewMode('chaos')}
                      className="px-4 py-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-all border border-rose-500/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Back to Chaos</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

          </div>

          {/* Bottom Card Footer */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Over 1,400+ print shops cut customer wait times by 75% with PrintBolt</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Experience PrintBolt:</span>
              <button
                type="button"
                onClick={triggerTransformation}
                className="font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer inline-flex items-center gap-1"
              >
                <Zap className="w-3 h-3 fill-amber-400 text-amber-500" />
                <span>Trigger Electric Transformation</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

