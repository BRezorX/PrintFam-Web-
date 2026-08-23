import React from 'react';
import { File, Palette, RefreshCw, Layers, Plus, Minus } from 'lucide-react';

const MAX_COPIES = 50;

export default function PrintSettings({ settings, onChange, capabilities = {} }) {
  // Destructure settings with defaults
  const {
    paperSize = 'A4',
    colorMode = 'bw', // bw, color
    orientation = 'portrait', // portrait, landscape
    duplex = false,
    copies = 1
  } = settings;

  // Destructure capabilities with fallback defaults
  const supportedSizes = capabilities.paper_sizes || ['A4'];
  const supportsColor = capabilities.color !== false; // defaults to true
  const supportsDuplex = capabilities.duplex !== false; // defaults to true

  const updateSetting = (key, value) => {
    if (onChange) {
      onChange({
        ...settings,
        [key]: value
      });
    }
  };

  const adjustCopies = (delta) => {
    const newCopies = copies + delta;
    if (newCopies >= 1 && newCopies <= MAX_COPIES) {
      updateSetting('copies', newCopies);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Paper Size Select */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase flex items-center">
          <File className="w-3.5 h-3.5 mr-1 text-blue-600" /> Paper Size
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['A4', 'A3', 'A5'].map((size) => {
            const isSupported = supportedSizes.includes(size);
            const isSelected = paperSize === size;
            return (
              <button
                key={size}
                type="button"
                disabled={!isSupported}
                onClick={() => updateSetting('paperSize', size)}
                className={`border-2 rounded-xl py-2 px-3 text-sm font-bold transition flex flex-col items-center justify-center ${
                  !isSupported
                    ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                    : isSelected
                    ? 'border-blue-600 bg-blue-50/10 text-blue-600 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span>{size}</span>
                {!isSupported && <span className="text-[9px] font-normal uppercase tracking-wider text-gray-400 mt-0.5">Not Supported</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Mode Select */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase flex items-center">
          <Palette className="w-3.5 h-3.5 mr-1 text-blue-600" /> Color Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          {/* Black & White */}
          <button
            type="button"
            onClick={() => updateSetting('colorMode', 'bw')}
            className={`border-2 rounded-xl py-2 px-3 text-sm font-bold transition flex flex-col items-center justify-center ${
              colorMode === 'bw'
                ? 'border-blue-600 bg-blue-50/10 text-blue-600 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <span>Black & White</span>
          </button>
          
          {/* Color */}
          <button
            type="button"
            disabled={!supportsColor}
            onClick={() => updateSetting('colorMode', 'color')}
            className={`border-2 rounded-xl py-2 px-3 text-sm font-bold transition flex flex-col items-center justify-center ${
              !supportsColor
                ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                : colorMode === 'color'
                ? 'border-blue-600 bg-blue-50/10 text-blue-600 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <span>Color</span>
            {!supportsColor && <span className="text-[9px] font-normal uppercase tracking-wider text-gray-400 mt-0.5">B&W Printer Only</span>}
          </button>
        </div>
      </div>

      {/* 3. Orientation Select */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase flex items-center">
          <RefreshCw className="w-3.5 h-3.5 mr-1 text-blue-600" /> Layout Orientation
        </label>
        <div className="grid grid-cols-2 gap-2">
          {/* Portrait */}
          <button
            type="button"
            onClick={() => updateSetting('orientation', 'portrait')}
            className={`border-2 rounded-xl py-2 px-3 text-sm font-bold transition flex items-center justify-center space-x-2 ${
              orientation === 'portrait'
                ? 'border-blue-600 bg-blue-50/10 text-blue-600 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <div className="w-3 h-4 border border-current rounded-sm"></div>
            <span>Portrait</span>
          </button>

          {/* Landscape */}
          <button
            type="button"
            onClick={() => updateSetting('orientation', 'landscape')}
            className={`border-2 rounded-xl py-2 px-3 text-sm font-bold transition flex items-center justify-center space-x-2 ${
              orientation === 'landscape'
                ? 'border-blue-600 bg-blue-50/10 text-blue-600 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <div className="w-4 h-3 border border-current rounded-sm"></div>
            <span>Landscape</span>
          </button>
        </div>
      </div>

      {/* 4. Duplex Select */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase flex items-center">
          <Layers className="w-3.5 h-3.5 mr-1 text-blue-600" /> Double-Sided (Duplex)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {/* Single sided */}
          <button
            type="button"
            onClick={() => updateSetting('duplex', false)}
            className={`border-2 rounded-xl py-2.5 px-3 text-sm font-bold transition flex flex-col items-center justify-center ${
              !duplex
                ? 'border-blue-600 bg-blue-50/10 text-blue-600 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <span>Single-sided</span>
          </button>

          {/* Double sided */}
          <button
            type="button"
            disabled={!supportsDuplex}
            onClick={() => updateSetting('duplex', true)}
            className={`border-2 rounded-xl py-2.5 px-3 text-sm font-bold transition flex flex-col items-center justify-center ${
              !supportsDuplex
                ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                : duplex
                ? 'border-blue-600 bg-blue-50/10 text-blue-600 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <span>Double-sided</span>
            {!supportsDuplex && <span className="text-[9px] font-normal uppercase tracking-wider text-gray-400 mt-0.5">Not Supported</span>}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 font-medium mt-2 leading-snug">Duplex printing prints on both sides of the paper, saving paper and cost.</p>
      </div>

      {/* 5. Copies Select */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex justify-between items-center">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase">Number of Copies</label>
          <p className="text-[10px] text-gray-400 font-medium">Select up to {MAX_COPIES} copies.</p>
        </div>
        <div className="flex items-center space-x-4 border border-gray-200 rounded-xl p-1 bg-gray-50">
          <button
            type="button"
            onClick={() => adjustCopies(-1)}
            disabled={copies <= 1}
            className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-base font-extrabold text-gray-800 w-6 text-center">{copies}</span>
          <button
            type="button"
            onClick={() => adjustCopies(1)}
            disabled={copies >= MAX_COPIES}
            className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
