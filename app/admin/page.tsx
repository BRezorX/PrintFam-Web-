import React, { Suspense } from 'react';
import AdminDashboardContent from './AdminDashboardContent';

export const metadata = {
  title: "Platform Admin — PrintBolt Management Portal",
  description: "Monitor partner shops, print volume, platform revenue, and live shop performance across India.",
};

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs font-bold">Loading PrintBolt Admin...</span>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
