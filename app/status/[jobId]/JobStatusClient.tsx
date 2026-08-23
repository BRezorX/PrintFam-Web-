'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '../../../components/AppShell';
import { subscribeToJobStatus } from '../../../services/api';
import { Loader2, CheckCircle2, AlertOctagon, Printer, FileCheck2, ArrowRight } from 'lucide-react';

export default function JobStatusClient({ params }: { params: { jobId: string } }) {
  const router = useRouter();
  const jobId = params.jobId;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shopName, setShopName] = useState('');

  useEffect(() => {
    const cachedName = sessionStorage.getItem('current_shop_name');
    if (cachedName) {
      setShopName(cachedName);
    }
  }, []);

  useEffect(() => {
    if (!jobId || jobId === 'default') return;

    setLoading(true);
    setError('');

    // Subscribe to realtime database changes (Rule 25)
    const unsubscribe = subscribeToJobStatus(jobId, (updatedJob: any) => {
      setLoading(false);
      if (updatedJob) {
        setJob(updatedJob);
      } else {
        setError("Job details could not be found.");
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [jobId]);

  const handleDone = () => {
    // Clear temporary print session storage (Rule 28)
    sessionStorage.removeItem('last_job_id');
    sessionStorage.removeItem('last_job_name');

    const shopId = job?.user_id || sessionStorage.getItem('current_shop_id');
    if (shopId) {
      router.push(`/p/${shopId}`);
    } else {
      router.push('/');
    }
  };

  // Helper to determine active index/percentage for progress bar
  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'printing': return 65;
      case 'completed': return 100;
      default: return 0;
    }
  };

  return (
    <AppShell shopName={shopName} email={undefined}>
      <div className="flex flex-col min-h-[75vh]">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <span className="text-sm font-semibold text-gray-500">Connecting to print queue tracker...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-red-50/20 border border-red-100 rounded-3xl">
            <AlertOctagon className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="font-extrabold text-red-800 text-lg mb-2">Queue Lost</h3>
            <p className="text-sm text-red-600/80 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={handleDone}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-6 rounded-xl transition text-sm"
            >
              Back to Shop
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between py-2">
            <div className="space-y-6">
              {/* Job ID Details Box */}
              <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Queue Identifier</span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-mono">
                    #{job.id}
                  </span>
                </div>
                <h2 className="text-base font-extrabold text-gray-800 truncate mb-1">
                  {job.file_name}
                </h2>
                <p className="text-[11px] text-gray-400 font-semibold uppercase">
                  Copies: {job.copies} • {job.color ? 'Color' : 'B&W'} • {job.duplex ? 'Double-sided' : 'Single-sided'}
                </p>
              </div>

              {/* Printing Status Tracking Card */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm text-center space-y-6">
                
                {/* Visual Status Icons */}
                <div className="flex justify-center">
                  {job.status === 'pending' && (
                    <div className="bg-blue-50 text-blue-600 p-5 rounded-full ring-8 ring-blue-50/50 animate-pulse">
                      <Printer className="w-10 h-10" />
                    </div>
                  )}
                  {job.status === 'printing' && (
                    <div className="bg-yellow-50 text-yellow-600 p-5 rounded-full ring-8 ring-yellow-50/50 animate-spin">
                      <Loader2 className="w-10 h-10" />
                    </div>
                  )}
                  {job.status === 'completed' && (
                    <div className="bg-green-50 text-green-600 p-5 rounded-full ring-8 ring-green-50/50">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                  )}
                  {job.status === 'failed' && (
                    <div className="bg-red-50 text-red-600 p-5 rounded-full ring-8 ring-red-50/50">
                      <AlertOctagon className="w-10 h-10" />
                    </div>
                  )}
                </div>

                {/* Status Messaging */}
                <div>
                  {job.status === 'pending' && (
                    <>
                      <h3 className="text-lg font-extrabold text-gray-800">Waiting in Queue</h3>
                      <p className="text-xs text-gray-450 mt-1 max-w-[220px] mx-auto leading-relaxed">
                        Your file has been sent to the kiosk. It will begin printing automatically on a FCFS basis.
                      </p>
                    </>
                  )}
                  {job.status === 'printing' && (
                    <>
                      <h3 className="text-lg font-extrabold text-yellow-800">Printing Document...</h3>
                      <p className="text-xs text-gray-450 mt-1 max-w-[220px] mx-auto leading-relaxed">
                        The printer is currently printing your pages. Please wait near the terminal.
                      </p>
                    </>
                  )}
                  {job.status === 'completed' && (
                    <>
                      <h3 className="text-lg font-extrabold text-green-800">Printing Complete!</h3>
                      <p className="text-xs text-green-700/80 font-semibold mt-1 max-w-[240px] mx-auto leading-relaxed">
                        Please collect your printed document from the shop counter.
                      </p>
                    </>
                  )}
                  {job.status === 'failed' && (
                    <>
                      <h3 className="text-lg font-extrabold text-red-800">Printing Failed</h3>
                      <p className="text-xs text-red-600/80 font-semibold mt-1 max-w-[220px] mx-auto leading-relaxed">
                        {job.error_message || "An unexpected error occurred at the printer hardware spooler."}
                      </p>
                    </>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        job.status === 'failed' ? 'bg-red-500 w-full' : 'bg-green-500'
                      }`}
                      style={{ width: job.status === 'failed' ? '100%' : `${getProgressPercentage(job.status)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">
                    <span className={job.status === 'pending' || job.status === 'printing' || job.status === 'completed' ? 'text-blue-600' : ''}>Queued</span>
                    <span className={job.status === 'printing' || job.status === 'completed' ? 'text-blue-600' : ''}>Printing</span>
                    <span className={job.status === 'completed' ? 'text-green-600' : ''}>Ready</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Done Action Button */}
            <div className="pt-8">
              <button
                onClick={handleDone}
                className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-extrabold text-sm py-4 rounded-2xl shadow-md transition flex items-center justify-center space-x-1"
              >
                <span>Done</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
