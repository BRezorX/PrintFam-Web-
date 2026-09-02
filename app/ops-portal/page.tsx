import React, { Suspense } from 'react';
import OpsPortalContent from './OpsPortalContent';

export const metadata = {
  title: "Operations Portal — PrintBolt Management",
  robots: {
    index: false,
    follow: false,
  }
};

export default function OpsPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs font-bold">Loading Operations Portal...</span>
        </div>
      }
    >
      <OpsPortalContent />
    </Suspense>
  );
}
