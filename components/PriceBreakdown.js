import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function PriceBreakdown({ pagesCount, copies, settings, shopSettings = {} }) {
  const [expanded, setExpanded] = useState(false);

  // Destructure config rates with default fallbacks
  const bwRate = shopSettings.bw_price !== undefined ? parseFloat(shopSettings.bw_price) : 0.10;
  const colorRate = shopSettings.color_price !== undefined ? parseFloat(shopSettings.color_price) : 0.50;
  const duplexRate = shopSettings.duplex_price !== undefined ? parseFloat(shopSettings.duplex_price) : 0.08;

  // Determine rate per page based on settings
  const baseRate = settings.colorMode === 'color' ? colorRate : bwRate;
  const effectiveRate = settings.duplex ? duplexRate : baseRate;

  // Total pages printed = selected pages * copies
  const totalPagesPrinted = pagesCount * copies;
  const totalCost = effectiveRate * totalPagesPrinted;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Price Summary Bar */}
      <div className="p-4 flex justify-between items-center bg-gray-50 border-b border-gray-100">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Estimated Price</span>
          <span className="text-2xl font-extrabold text-gray-900">
            ₹{totalCost.toFixed(2)}
          </span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
        >
          <span>{expanded ? 'Hide Details' : 'Show Details'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable pricing breakdown detail list */}
      {expanded && (
        <div className="p-4 bg-white space-y-2.5 text-sm border-b border-gray-100">
          <div className="flex justify-between items-center text-gray-600">
            <span>Pages to Print</span>
            <span className="font-semibold text-gray-800">{pagesCount} pages</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Copies</span>
            <span className="font-semibold text-gray-800">× {copies}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Page Rate ({settings.colorMode === 'color' ? 'Color' : 'B&W'}{settings.duplex ? ', Duplex' : ''})</span>
            <span className="font-semibold text-gray-800">₹{effectiveRate.toFixed(2)} / pg</span>
          </div>
          <div className="flex justify-between items-center text-gray-600 border-t border-gray-100 pt-2.5">
            <span className="flex items-center">
              Paper Size
            </span>
            <span className="font-semibold text-gray-800">{settings.paperSize}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Layout</span>
            <span className="font-semibold text-gray-800 capitalize">{settings.orientation}</span>
          </div>
        </div>
      )}
      
      <div className="px-4 py-2.5 bg-gray-50/50 flex items-center space-x-1.5 border-t border-gray-100">
        <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[10px] text-gray-400 font-semibold leading-none">
          Prices include local taxes. Final price is confirmed before checkout.
        </span>
      </div>
    </div>
  );
}
