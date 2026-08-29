import React from 'react';
import { ShieldCheck, PhoneCall } from 'lucide-react';

export default function AppShell({ children, shopName, email, maxWidth = 'max-w-md' }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 selection:bg-blue-500 selection:text-white">
      {/* Header Banner */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <img
              src="/logo.png"
              alt="PrintBolt"
              className="w-8 h-8 rounded-lg object-contain"
            />
            <div>
              <span className="font-extrabold text-lg tracking-tight text-gray-900 block leading-none">PrintBolt</span>
              {shopName && <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{shopName}</span>}
            </div>
          </div>
          {shopName ? (
            <div className="flex items-center space-x-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>Shop Active</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full text-xs font-semibold">
              <span>Ready</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className={`flex-1 w-full ${maxWidth} mx-auto px-4 py-6 pb-24`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-100 py-4 mt-auto">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-4 mb-2">
            <span className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-500" /> Secure SSL Connection
            </span>
          </div>
          <p className="text-[11px] text-gray-400 font-medium">© {new Date().getFullYear()} PrintBolt Automatic Printing System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
