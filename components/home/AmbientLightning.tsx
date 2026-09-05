'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Sparkles } from 'lucide-react';

// Comprehensive RGB color palette covering the entire visual spectrum
export interface RgbColorDef {
  name: string;
  hex: string;
  fill: string;
  glow: string;
  ring: string;
  spark: string;
}

export const RGB_PALETTE: RgbColorDef[] = [
  {
    name: 'Electric Red',
    hex: '#EF4444',
    fill: '#F87171',
    glow: 'rgba(239, 68, 68, 0.8)',
    ring: 'rgba(239, 68, 68, 0.9)',
    spark: '#FCA5A5',
  },
  {
    name: 'Neon Coral',
    hex: '#F43F5E',
    fill: '#FB7185',
    glow: 'rgba(244, 63, 94, 0.8)',
    ring: 'rgba(244, 63, 94, 0.9)',
    spark: '#FDA4AF',
  },
  {
    name: 'Bright Orange',
    hex: '#F97316',
    fill: '#FB923C',
    glow: 'rgba(249, 115, 22, 0.8)',
    ring: 'rgba(249, 115, 22, 0.9)',
    spark: '#FDBA74',
  },
  {
    name: 'Amber Gold',
    hex: '#F59E0B',
    fill: '#FBBF24',
    glow: 'rgba(245, 158, 11, 0.8)',
    ring: 'rgba(245, 158, 11, 0.9)',
    spark: '#FCD34D',
  },
  {
    name: 'Vibrant Yellow',
    hex: '#EAB308',
    fill: '#FDE047',
    glow: 'rgba(234, 179, 8, 0.8)',
    ring: 'rgba(234, 179, 8, 0.9)',
    spark: '#FEF08A',
  },
  {
    name: 'Electric Lime',
    hex: '#84CC16',
    fill: '#A3E635',
    glow: 'rgba(132, 204, 22, 0.8)',
    ring: 'rgba(132, 204, 22, 0.9)',
    spark: '#BEF264',
  },
  {
    name: 'Neon Green',
    hex: '#22C55E',
    fill: '#4ADE80',
    glow: 'rgba(34, 197, 94, 0.8)',
    ring: 'rgba(34, 197, 94, 0.9)',
    spark: '#86EFAC',
  },
  {
    name: 'Emerald Mint',
    hex: '#10B981',
    fill: '#34D399',
    glow: 'rgba(16, 185, 129, 0.8)',
    ring: 'rgba(16, 185, 129, 0.9)',
    spark: '#6EE7B7',
  },
  {
    name: 'Electric Teal',
    hex: '#14B8A6',
    fill: '#2DD4BF',
    glow: 'rgba(20, 184, 166, 0.8)',
    ring: 'rgba(20, 184, 166, 0.9)',
    spark: '#5EEAD4',
  },
  {
    name: 'Cyan Aqua',
    hex: '#06B6D4',
    fill: '#22D3EE',
    glow: 'rgba(6, 182, 212, 0.85)',
    ring: 'rgba(6, 182, 212, 0.9)',
    spark: '#67E8F9',
  },
  {
    name: 'Sky Blue',
    hex: '#0EA5E9',
    fill: '#38BDF8',
    glow: 'rgba(14, 165, 233, 0.8)',
    ring: 'rgba(14, 165, 233, 0.9)',
    spark: '#7DD3FC',
  },
  {
    name: 'Electric Blue',
    hex: '#3B82F6',
    fill: '#60A5FA',
    glow: 'rgba(59, 130, 246, 0.85)',
    ring: 'rgba(59, 130, 246, 0.9)',
    spark: '#93C5FD',
  },
  {
    name: 'Royal Indigo',
    hex: '#6366F1',
    fill: '#818CF8',
    glow: 'rgba(99, 102, 241, 0.8)',
    ring: 'rgba(99, 102, 241, 0.9)',
    spark: '#A5B4FC',
  },
  {
    name: 'Vivid Violet',
    hex: '#8B5CF6',
    fill: '#A78BFA',
    glow: 'rgba(139, 92, 246, 0.85)',
    ring: 'rgba(139, 92, 246, 0.9)',
    spark: '#C4B5FD',
  },
  {
    name: 'Neon Purple',
    hex: '#A855F7',
    fill: '#C084FC',
    glow: 'rgba(168, 85, 247, 0.85)',
    ring: 'rgba(168, 85, 247, 0.9)',
    spark: '#D8B4FE',
  },
  {
    name: 'Hot Magenta',
    hex: '#D946EF',
    fill: '#E879F9',
    glow: 'rgba(217, 70, 239, 0.85)',
    ring: 'rgba(217, 70, 239, 0.9)',
    spark: '#F0ABFC',
  },
  {
    name: 'Vibrant Pink',
    hex: '#EC4899',
    fill: '#F472B6',
    glow: 'rgba(236, 72, 153, 0.85)',
    ring: 'rgba(236, 72, 153, 0.9)',
    spark: '#F9A8D4',
  },
];

export interface AmbientBoltConfig {
  id: number;
  top: string;
  left: string;
  size: number;
  color: RgbColorDef;
  rotate: number;
  duration: number;
  yOffset: number;
  delay: number;
  minOpacity: number;
  maxOpacity: number;
}

// Simple seeded PRNG for deterministic, stable distribution across page reloads
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate ~100 ambient lightning bolts with random positions & full RGB colors
function generateAmbientBolts(count: number = 100): AmbientBoltConfig[] {
  const bolts: AmbientBoltConfig[] = [];

  for (let i = 0; i < count; i++) {
    const seed = (i + 1) * 37.17;
    
    // Vertical distribution: Spread evenly across the document from 1% to 99% with jitter
    const step = 98 / count;
    const baseTop = 1 + i * step;
    const jitterTop = (seededRandom(seed + 1) - 0.5) * (step * 0.8);
    const topVal = Math.min(99.2, Math.max(0.8, baseTop + jitterTop));
    
    // Horizontal distribution: Random position across 2% to 98%
    const leftVal = Math.min(98, Math.max(2, seededRandom(seed + 2) * 96 + 2));

    // Full RGB spectrum selection
    const colorIndex = Math.floor(seededRandom(seed + 3) * RGB_PALETTE.length);
    const color = RGB_PALETTE[colorIndex];

    // Varied subtle sizes (11px to 18px)
    const size = Math.floor(seededRandom(seed + 4) * 8) + 11;

    // Organic rotation
    const rotate = Math.floor(seededRandom(seed + 5) * 60) - 30;

    // Animation timing and displacement
    const duration = 4.2 + seededRandom(seed + 6) * 3.6; // 4.2s to 7.8s
    const yOffset = -8 - seededRandom(seed + 7) * 12; // -8px to -20px
    const delay = seededRandom(seed + 8) * 3.5;

    // Delicate opacities (never crowded, soft ambient glow)
    const minOpacity = 0.2 + seededRandom(seed + 9) * 0.15; // 0.2 - 0.35
    const maxOpacity = 0.45 + seededRandom(seed + 10) * 0.25; // 0.45 - 0.7

    bolts.push({
      id: i + 1,
      top: `${topVal.toFixed(2)}%`,
      left: `${leftVal.toFixed(2)}%`,
      size,
      color,
      rotate,
      duration,
      yOffset,
      delay,
      minOpacity,
      maxOpacity,
    });
  }

  return bolts;
}

interface ClickBolt {
  id: number;
  x: number;
  y: number;
  color: RgbColorDef;
  rotate: number;
  size: number;
}

export const AmbientLightning: React.FC = () => {
  const [clickBolts, setClickBolts] = useState<ClickBolt[]>([]);
  const lastColorIndexRef = useRef<number>(0);

  // Generate 100 ambient lightning bolts with random positions & vibrant RGB colors
  const ambientBolts = useMemo(() => generateAmbientBolts(100), []);

  // Listen for clicks on blank space across the window
  const handleWindowClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Check if the click target or any of its ancestors is an interactive element
    const isInteractive = target.closest(
      'button, a, input, select, textarea, [role="button"], [role="dialog"], [role="menuitem"], label, .cursor-pointer, .interactive-zone'
    );

    // If clicked on an interactive control, do not spawn lightning to avoid distraction
    if (isInteractive) return;

    // Cycle through and randomize across the full RGB palette for the click burst
    const nextIndex = (lastColorIndexRef.current + Math.floor(Math.random() * (RGB_PALETTE.length - 2)) + 1) % RGB_PALETTE.length;
    lastColorIndexRef.current = nextIndex;
    const selectedColor = RGB_PALETTE[nextIndex];

    const randomRotate = Math.floor(Math.random() * 60) - 30; // -30 to +30 deg
    const newBolt: ClickBolt = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      color: selectedColor,
      rotate: randomRotate,
      size: Math.floor(Math.random() * 10) + 26, // 26px - 36px
    };

    setClickBolts((prev) => [...prev.slice(-15), newBolt]);

    // Auto remove bolt after animation ends (~850ms)
    setTimeout(() => {
      setClickBolts((prev) => prev.filter((b) => b.id !== newBolt.id));
    }, 850);
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleWindowClick, { passive: true });
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [handleWindowClick]);

  return (
    <>
      {/* 1. ~100 AMBIENT BACKGROUND LIGHTNING BOLTS ACROSS FULL RGB SPECTRUM */}
      <div 
        id="ambient-lightning-background"
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      >
        {ambientBolts.map((bolt) => (
          <motion.div
            key={`ambient-bolt-${bolt.id}`}
            id={`ambient-bolt-${bolt.id}`}
            className="absolute"
            style={{
              top: bolt.top,
              left: bolt.left,
            }}
            initial={{ opacity: bolt.minOpacity, y: 0, rotate: bolt.rotate }}
            animate={{
              y: [0, bolt.yOffset, 0, -bolt.yOffset * 0.6, 0],
              x: [0, 4, 0, -4, 0],
              rotate: [bolt.rotate, bolt.rotate + 12, bolt.rotate, bolt.rotate - 10, bolt.rotate],
              opacity: [bolt.minOpacity, bolt.maxOpacity, bolt.minOpacity * 1.3, bolt.maxOpacity * 0.9, bolt.minOpacity],
              scale: [0.95, 1.1, 0.97, 1.06, 0.95],
            }}
            transition={{
              duration: bolt.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: bolt.delay,
            }}
          >
            <div
              className="relative flex items-center justify-center transition-all"
              style={{
                color: bolt.color.hex,
                filter: `drop-shadow(0 0 7px ${bolt.color.glow})`,
              }}
            >
              <Zap
                size={bolt.size}
                fill={bolt.color.fill}
                stroke={bolt.color.hex}
                strokeWidth={1.5}
                className="transition-all"
              />
              
              {/* Subtle micro energy shimmer on select bolts */}
              {bolt.id % 7 === 0 && (
                <motion.div
                  animate={{
                    scale: [0.5, 1.3, 0.5],
                    opacity: [0.2, 0.9, 0.2],
                  }}
                  transition={{
                    duration: 2.0,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: bolt.delay + 0.4,
                  }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles size={7} style={{ color: bolt.color.spark }} />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. INTERACTIVE BLANK SPACE CLICK BURST CYCLING RANDOM RGB COLORS */}
      <div 
        id="interactive-click-lightning-layer"
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      >
        <AnimatePresence>
          {clickBolts.map((bolt) => {
            const config = bolt.color;
            return (
              <div
                key={`click-bolt-${bolt.id}`}
                id={`click-bolt-${bolt.id}`}
                className="absolute"
                style={{
                  left: bolt.x,
                  top: bolt.y,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Shockwave expanding ring matching click color */}
                <motion.div
                  initial={{ scale: 0.2, opacity: 0.95 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="absolute -inset-4 rounded-full border-2"
                  style={{
                    borderColor: config.ring,
                    boxShadow: `0 0 20px ${config.glow}`,
                  }}
                />

                {/* Micro sparks darting out in 6 directions in matching RGB color */}
                {[
                  { x: -24, y: -22, delay: 0.03 },
                  { x: 26, y: -20, delay: 0.05 },
                  { x: -20, y: 22, delay: 0.04 },
                  { x: 24, y: 24, delay: 0.06 },
                  { x: 0, y: -28, delay: 0.02 },
                  { x: 0, y: 28, delay: 0.07 },
                ].map((spark, idx) => (
                  <motion.div
                    key={`spark-${bolt.id}-${idx}`}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: spark.x, y: spark.y, opacity: 0, scale: 0.2 }}
                    transition={{ duration: 0.55, delay: spark.delay, ease: 'easeOut' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: config.spark,
                      boxShadow: `0 0 8px ${config.glow}`,
                    }}
                  />
                ))}

                {/* The Radiant Lightning Bolt in the Selected RGB Color */}
                <motion.div
                  initial={{ 
                    scale: 0.25, 
                    opacity: 0, 
                    y: 0, 
                    rotate: bolt.rotate 
                  }}
                  animate={{ 
                    scale: [0.25, 1.4, 1.1, 0.85], 
                    opacity: [0, 1, 0.95, 0], 
                    y: [0, -14, -30, -44], 
                    rotate: [bolt.rotate, bolt.rotate + 16, bolt.rotate - 8, bolt.rotate + 6] 
                  }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="flex items-center justify-center"
                  style={{
                    color: config.hex,
                    filter: `drop-shadow(0 0 16px ${config.glow})`,
                  }}
                >
                  <Zap
                    size={bolt.size}
                    fill={config.fill}
                    stroke={config.hex}
                    strokeWidth={2}
                    className="drop-shadow-lg"
                  />
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
};

