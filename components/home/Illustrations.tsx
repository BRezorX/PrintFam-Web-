'use client';
import React from 'react';

// Flat Line-Art Illustrations matching the reference mockup aesthetic

export const FrustratedShopkeeperIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Desk surface */}
    <path d="M10 100H110" stroke="#0A1128" strokeWidth="4" strokeLinecap="round" />
    <path d="M18 100V115M102 115V100" stroke="#0A1128" strokeWidth="4" strokeLinecap="round" />
    
    {/* Messy paper stacks on desk */}
    <rect x="18" y="86" width="30" height="14" rx="2" fill="#E2E8F0" stroke="#0A1128" strokeWidth="3" />
    <rect x="22" y="76" width="28" height="12" rx="2" fill="#FFFFFF" stroke="#0A1128" strokeWidth="3" transform="rotate(-6 22 76)" />
    <rect x="25" y="66" width="26" height="11" rx="2" fill="#FED7AA" stroke="#0A1128" strokeWidth="3" transform="rotate(4 25 66)" />
    
    {/* Cluttered monitor/printer */}
    <rect x="74" y="64" width="32" height="26" rx="4" fill="#F87171" fillOpacity="0.2" stroke="#EF4444" strokeWidth="3" />
    <path d="M84 90V98H96V90" stroke="#0A1128" strokeWidth="3" />
    <circle cx="90" cy="77" r="5" fill="#EF4444" />
    
    {/* Shopkeeper body */}
    <path d="M42 98C42 82 52 74 62 74C72 74 82 82 82 98" fill="#3B82F6" stroke="#0A1128" strokeWidth="3.5" />
    
    {/* Head & face */}
    <circle cx="62" cy="50" r="18" fill="#FCD34D" stroke="#0A1128" strokeWidth="3.5" />
    
    {/* Messy hair */}
    <path d="M46 44C46 32 54 26 62 26C70 26 78 32 78 44" fill="#334155" stroke="#0A1128" strokeWidth="3.5" />
    
    {/* Stressed eyebrows and closed eyes */}
    <path d="M52 46L58 48M72 48L66 46" stroke="#0A1128" strokeWidth="3" strokeLinecap="round" />
    <path d="M52 52C54 50 56 50 58 52M66 52C68 50 70 50 72 52" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Stressed mouth */}
    <path d="M58 60C60 58 64 58 66 60" stroke="#0A1128" strokeWidth="3" strokeLinecap="round" />
    
    {/* Hands on head */}
    <path d="M40 56C36 50 42 42 48 42" stroke="#0A1128" strokeWidth="3.5" strokeLinecap="round" fill="#FCD34D" />
    <path d="M84 56C88 50 82 42 76 42" stroke="#0A1128" strokeWidth="3.5" strokeLinecap="round" fill="#FCD34D" />
    
    {/* Sweat drops */}
    <path d="M78 36C80 34 82 37 80 40C78 42 76 40 78 36Z" fill="#38BDF8" stroke="#0A1128" strokeWidth="2" />
    <path d="M44 38C42 36 40 39 42 42C44 44 46 42 44 38Z" fill="#38BDF8" stroke="#0A1128" strokeWidth="2" />
  </svg>
);

export const LooseUsbIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Warning / Bug / Virus aura */}
    <circle cx="60" cy="60" r="48" fill="#FEE2E2" fillOpacity="0.6" />
    
    {/* Angled USB Drive body */}
    <g transform="rotate(-30 60 60)">
      <rect x="42" y="52" width="36" height="52" rx="8" fill="#475569" stroke="#0A1128" strokeWidth="4" />
      <rect x="48" y="24" width="24" height="28" rx="3" fill="#E2E8F0" stroke="#0A1128" strokeWidth="4" />
      
      {/* USB connector pins */}
      <rect x="52" y="30" width="5" height="8" rx="1" fill="#0A1128" />
      <rect x="63" y="30" width="5" height="8" rx="1" fill="#0A1128" />
      
      {/* Activity LED & grip ribs */}
      <circle cx="60" cy="90" r="3" fill="#EF4444" />
      <line x1="48" y1="68" x2="72" y2="68" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <line x1="48" y1="76" x2="72" y2="76" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
    </g>

    {/* Danger / virus sparks */}
    <path d="M22 34L26 40L20 44" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M98 32L94 38L100 42" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M92 88L98 94M24 86L28 92" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
    
    {/* Skull / Warning Icon badge */}
    <circle cx="86" cy="36" r="12" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2.5" />
    <path d="M86 31V37M86 41V42" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const CrowdedQueueIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* QUEUE Sign */}
    <rect x="42" y="10" width="56" height="24" rx="6" fill="#F59E0B" stroke="#0A1128" strokeWidth="3" />
    <text x="70" y="27" fill="#0A1128" fontSize="13" fontWeight="800" textAnchor="middle" letterSpacing="1">QUEUE</text>
    <path d="M70 34V46" stroke="#0A1128" strokeWidth="3" />

    {/* Person 1 (front, red shirt, waiting impatiently) */}
    <circle cx="34" cy="62" r="11" fill="#FCD34D" stroke="#0A1128" strokeWidth="3" />
    <path d="M22 96C22 82 28 78 34 78C40 78 46 82 46 96" fill="#EF4444" stroke="#0A1128" strokeWidth="3" />
    
    {/* Person 2 (center, blue shirt) */}
    <circle cx="70" cy="58" r="12" fill="#FCD34D" stroke="#0A1128" strokeWidth="3" />
    <path d="M56 98C56 82 62 76 70 76C78 76 84 82 84 98" fill="#3B82F6" stroke="#0A1128" strokeWidth="3" />

    {/* Person 3 (back, green shirt, looking at watch) */}
    <circle cx="106" cy="62" r="11" fill="#FCD34D" stroke="#0A1128" strokeWidth="3" />
    <path d="M94 96C94 82 100 78 106 78C112 78 118 82 118 96" fill="#10B981" stroke="#0A1128" strokeWidth="3" />

    {/* Impatience icons (clock / exclamation) */}
    <circle cx="118" cy="46" r="8" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2" />
    <path d="M118 42V46H121" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const AngryCustomersIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Angry customer 1 */}
    <circle cx="44" cy="52" r="14" fill="#FCD34D" stroke="#0A1128" strokeWidth="3" />
    <path d="M36 46L42 49M52 49L46 46" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M40 60C42 58 46 58 48 60" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M26 88C26 76 34 70 44 70C54 70 62 76 62 88" fill="#F97316" stroke="#0A1128" strokeWidth="3" />
    
    {/* Angry customer 2 */}
    <circle cx="78" cy="48" r="14" fill="#FCD34D" stroke="#0A1128" strokeWidth="3" />
    <path d="M70 42L76 45M86 45L80 42" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M74 56H82" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M62 88C62 74 70 68 78 68C86 68 94 74 94 88" fill="#6366F1" stroke="#0A1128" strokeWidth="3" />

    {/* Anger lightning bolts */}
    <path d="M24 36L20 44H26L22 52" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#FEE2E2" />
    <path d="M96 32L92 40H98L94 48" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#FEE2E2" />
  </svg>
);

// AFTER Illustrations (Calm, Automated, Happy)

export const CalmCounterIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Sleek modern counter */}
    <rect x="14" y="68" width="92" height="38" rx="6" fill="#F8FAFC" stroke="#0A1128" strokeWidth="3.5" />
    <rect x="20" y="74" width="80" height="8" rx="2" fill="#E2E8F0" />
    
    {/* Shopkeeper smiling, standing calmly behind counter */}
    <circle cx="60" cy="40" r="14" fill="#FCD34D" stroke="#0A1128" strokeWidth="3.5" />
    <path d="M50 32C50 24 55 20 60 20C65 20 70 24 70 32" fill="#0A1128" />
    {/* Happy smiling eyes & smile */}
    <path d="M54 40C55 39 57 39 58 40M62 40C63 39 65 39 66 40" stroke="#0A1128" strokeWidth="2" strokeLinecap="round" />
    <path d="M56 46C58 49 62 49 64 46" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Smart uniform */}
    <path d="M42 68C42 56 50 52 60 52C70 52 78 56 78 68" fill="#10B981" stroke="#0A1128" strokeWidth="3.5" />
    
    {/* Neat tablet on counter displaying PrintBolt check */}
    <rect x="48" y="62" width="24" height="18" rx="3" fill="#0A1128" stroke="#0A1128" strokeWidth="2" />
    <rect x="51" y="64" width="18" height="12" rx="2" fill="#10B981" />
    <path d="M56 70L59 73L65 67" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ScanQrPhoneIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Hand holding modern phone */}
    <rect x="36" y="16" width="48" height="88" rx="10" fill="#0A1128" stroke="#0A1128" strokeWidth="3.5" />
    <rect x="40" y="24" width="40" height="72" rx="6" fill="#EFF6FF" />
    
    {/* Phone camera notch */}
    <rect x="52" y="19" width="16" height="3" rx="1.5" fill="#334155" />
    
    {/* QR code on screen */}
    <rect x="46" y="32" width="28" height="28" rx="3" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
    <rect x="49" y="35" width="7" height="7" fill="#2563EB" />
    <rect x="64" y="35" width="7" height="7" fill="#2563EB" />
    <rect x="49" y="50" width="7" height="7" fill="#2563EB" />
    <rect x="58" y="44" width="4" height="4" fill="#2563EB" />
    <rect x="65" y="49" width="5" height="5" fill="#2563EB" />

    {/* Green upload success tick */}
    <circle cx="60" cy="74" r="10" fill="#10B981" />
    <path d="M56 74L59 77L65 71" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Wireless signals radiating */}
    <path d="M88 28C94 34 98 42 98 52" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
    <path d="M22 28C16 34 12 42 12 52" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
  </svg>
);

export const AutomatedHandoffIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Clean digital file flow */}
    <rect x="18" y="40" width="34" height="44" rx="4" fill="#FFFFFF" stroke="#0A1128" strokeWidth="3" />
    <path d="M26 52H44M26 60H38M26 68H42" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Arrow beam with lightning bolt */}
    <path d="M56 62H76" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="4 3" />
    <path d="M72 56L78 62L72 68" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Fast printer receiving file */}
    <rect x="76" y="48" width="36" height="28" rx="4" fill="#3B82F6" stroke="#0A1128" strokeWidth="3" />
    <rect x="82" y="34" width="24" height="14" rx="2" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2.5" />
    <rect x="82" y="76" width="24" height="12" rx="2" fill="#10B981" stroke="#0A1128" strokeWidth="2.5" />
    
    {/* Glowing checkmark badge */}
    <circle cx="102" cy="42" r="8" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
    <path d="M99 42L101 44L105 40" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const HappyCustomerIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Happy customer holding fresh prints */}
    <circle cx="60" cy="40" r="16" fill="#FCD34D" stroke="#0A1128" strokeWidth="3.5" />
    {/* Cool modern hair */}
    <path d="M46 34C46 22 54 18 64 18C72 18 76 24 76 34" fill="#334155" stroke="#0A1128" strokeWidth="2.5" />
    {/* Happy eyes & smile */}
    <path d="M53 38C55 36 57 36 58 38M63 38C65 36 67 36 68 38" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M55 46C57 50 63 50 65 46" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Stylish jacket */}
    <path d="M40 76C40 60 48 56 60 56C72 56 80 60 80 76" fill="#3B82F6" stroke="#0A1128" strokeWidth="3.5" />
    
    {/* Holding clean printed portfolio folder with ribbon / stamp */}
    <rect x="68" y="60" width="30" height="38" rx="4" fill="#FFFFFF" stroke="#0A1128" strokeWidth="3" transform="rotate(12 68 60)" />
    <path d="M78 68L88 70" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
    <circle cx="88" cy="80" r="4" fill="#10B981" />
    
    {/* Thumbs up hand */}
    <path d="M34 66C32 64 28 66 28 70C28 74 34 76 38 74" stroke="#0A1128" strokeWidth="3" fill="#FCD34D" />

    {/* Sparkles of satisfaction */}
    <path d="M22 36L24 40L28 42L24 44L22 48L20 44L16 42L20 40Z" fill="#F59E0B" />
    <path d="M96 28L97 31L100 32L97 33L96 36L95 33L92 32L95 31Z" fill="#10B981" />
  </svg>
);

// Storefront Illustrations for "FOR PRINT SHOPS" Target Audience

export const XeroxShopIllustration: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Striped Store Awning */}
    <path d="M16 38H104L98 22H22L16 38Z" fill="#EF4444" stroke="#0A1128" strokeWidth="3" />
    <path d="M30 22L26 38M46 22L44 38M62 22L62 38M78 22L80 38M94 22L98 38" stroke="#FFFFFF" strokeWidth="4" />
    
    {/* Store Walls & Glass Window */}
    <rect x="20" y="38" width="80" height="66" rx="3" fill="#FFFFFF" stroke="#0A1128" strokeWidth="3.5" />
    <rect x="26" y="46" width="34" height="42" rx="3" fill="#E0F2FE" stroke="#0A1128" strokeWidth="2.5" />
    
    {/* High volume Xerox Copier inside */}
    <rect x="30" y="58" width="26" height="24" rx="2" fill="#475569" stroke="#0A1128" strokeWidth="2" />
    <rect x="34" y="52" width="18" height="6" fill="#94A3B8" />
    
    {/* Door */}
    <rect x="68" y="46" width="26" height="58" rx="2" fill="#F1F5F9" stroke="#0A1128" strokeWidth="2.5" />
    <circle cx="73" cy="74" r="2.5" fill="#0A1128" />
    
    {/* Counter Sign: "XEROX" */}
    <rect x="34" y="90" width="22" height="8" rx="1.5" fill="#EF4444" />
    <text x="45" y="96" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle">XEROX</text>
  </svg>
);

export const DigitalPrintingIllustration: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Modern High-End Multi-function Laser Printer */}
    <rect x="18" y="46" width="84" height="54" rx="8" fill="#1E293B" stroke="#0A1128" strokeWidth="3.5" />
    
    {/* Large Touchscreen LCD Panel */}
    <rect x="72" y="30" width="26" height="18" rx="3" fill="#3B82F6" stroke="#0A1128" strokeWidth="2.5" />
    <circle cx="78" cy="39" r="3" fill="#FFFFFF" />
    <path d="M84 37H93M84 41H90" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

    {/* Paper Feed Trays */}
    <rect x="28" y="24" width="38" height="22" rx="3" fill="#F8FAFC" stroke="#0A1128" strokeWidth="2.5" />
    
    {/* Output Tray with vibrant Color Prints */}
    <rect x="26" y="80" width="68" height="10" rx="2" fill="#334155" />
    <rect x="32" y="74" width="56" height="8" rx="1" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
    {/* CMYK Color stripes on printed sheet */}
    <line x1="36" y1="78" x2="44" y2="78" stroke="#06B6D4" strokeWidth="3" />
    <line x1="48" y1="78" x2="56" y2="78" stroke="#EC4899" strokeWidth="3" />
    <line x1="60" y1="78" x2="68" y2="78" stroke="#FACC15" strokeWidth="3" />
    <line x1="72" y1="78" x2="80" y2="78" stroke="#0F172A" strokeWidth="3" />
    
    {/* Status Glow Light */}
    <circle cx="28" cy="56" r="4" fill="#10B981" />
  </svg>
);

export const CollegeAreaShopIllustration: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* College / Campus Building in background */}
    <path d="M60 16L94 32H26L60 16Z" fill="#F59E0B" stroke="#0A1128" strokeWidth="3" />
    <rect x="32" y="32" width="56" height="20" fill="#FEF3C7" stroke="#0A1128" strokeWidth="3" />
    {/* Pillars */}
    <line x1="42" y1="32" x2="42" y2="52" stroke="#0A1128" strokeWidth="3" />
    <line x1="54" y1="32" x2="54" y2="52" stroke="#0A1128" strokeWidth="3" />
    <line x1="66" y1="32" x2="66" y2="52" stroke="#0A1128" strokeWidth="3" />
    <line x1="78" y1="32" x2="78" y2="52" stroke="#0A1128" strokeWidth="3" />

    {/* College Print Shop kiosk below */}
    <rect x="22" y="52" width="76" height="52" rx="4" fill="#FFFFFF" stroke="#0A1128" strokeWidth="3.5" />
    
    {/* Student books & spiral bound projects */}
    <rect x="30" y="66" width="22" height="28" rx="2" fill="#3B82F6" stroke="#0A1128" strokeWidth="2" />
    <line x1="33" y1="68" x2="33" y2="92" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="2 2" />
    
    {/* Graduation cap icon on sign */}
    <rect x="60" y="66" width="30" height="16" rx="3" fill="#10B981" stroke="#0A1128" strokeWidth="2" />
    <text x="75" y="77" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">PROJECTS</text>
  </svg>
);

export const CommercialPrintIllustration: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Modern Business / Agency storefront */}
    <rect x="18" y="36" width="84" height="68" rx="6" fill="#0A1128" stroke="#0A1128" strokeWidth="3.5" />
    
    {/* Architectural Glass Display */}
    <rect x="26" y="44" width="68" height="42" rx="3" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
    
    {/* Blueprint rolls / Marketing brochures / Banner stand */}
    <rect x="34" y="54" width="16" height="24" rx="2" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" />
    <line x1="38" y1="60" x2="46" y2="60" stroke="#FFFFFF" strokeWidth="1.5" />
    <line x1="38" y1="66" x2="46" y2="66" stroke="#FFFFFF" strokeWidth="1.5" />
    
    {/* Large format banner roll */}
    <rect x="56" y="50" width="30" height="28" rx="2" fill="#F8FAFC" stroke="#FFFFFF" strokeWidth="1.5" />
    <circle cx="71" cy="60" r="5" fill="#EF4444" />
    <rect x="62" y="69" width="18" height="3" fill="#94A3B8" />
    
    {/* Commercial Tag */}
    <rect x="36" y="90" width="48" height="10" rx="3" fill="#F59E0B" />
    <text x="60" y="98" fill="#0A1128" fontSize="7" fontWeight="800" textAnchor="middle">B2B PRINT HUB</text>
  </svg>
);

