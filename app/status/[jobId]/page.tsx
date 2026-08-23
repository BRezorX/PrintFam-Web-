'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '../../../components/AppShell';
import { subscribeToJobStatus } from '../../../services/api';
import { Loader2, CheckCircle2, AlertOctagon, Printer, FileCheck2, ArrowRight } from 'lucide-react';

export default function JobStatus({ params }: { params: { jobId: string } }) {
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
    if (!jobId) return;

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

              {/* Status Graphic Alert Panel */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center py-8">
                
                {/* 1. Pending Queue State */}
                {job.status === 'pending' && (
                  <>
                    <div className="text-yellow-500 bg-yellow-50 p-4 rounded-full mb-4 animate-pulse">
                      <ClockIcon className="w-10 h-10" />
                    </div>
                    <h3 className="font-black text-xl text-gray-900 mb-1">Waiting in Queue</h3>
                    <p className="text-sm text-gray-400 max-w-[240px] leading-relaxed">
                      Your payment was verified. Your document is currently in line (First-Come, First-Served).
                    </p>
                  </>
                )}

                {/* 2. Printing Spooling State */}
                {job.status === 'printing' && (
                  <>
                    <div className="text-blue-600 bg-blue-50 p-4 rounded-full mb-4 animate-spin">
                      <Loader2 className="w-10 h-10" />
                    </div>
                    <h3 className="font-black text-xl text-gray-900 mb-1">Printing Document...</h3>
                    <p className="text-sm text-gray-400 max-w-[240px] leading-relaxed">
                      The printer is spooling your file. Please watch the counter trays.
                    </p>
                  </>
                )}

                {/* 3. Printing Complete Success State */}
                {job.status === 'completed' && (
                  <>
                    <div className="text-green-600 bg-green-50 p-4 rounded-full mb-4 animate-bounce">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="font-black text-xl text-green-900 mb-1">Printing Complete!</h3>
                    <p className="text-sm text-green-700/80 max-w-[250px] font-semibold leading-relaxed">
                      Please collect your printed document from the shop counter.
                    </p>
                  </>
                )}

                {/* 4. Printing Failed State */}
                {job.status === 'failed' && (
                  <>
                    <div className="text-red-600 bg-red-50 p-4 rounded-full mb-4 animate-pulse">
                      <AlertOctagon className="w-10 h-10" />
                    </div>
                    <h3 className="font-black text-xl text-red-900 mb-1">Printing Failed</h3>
                    <p className="text-sm text-red-600/80 max-w-[240px] leading-relaxed">
                      We encountered an error during printing. Please contact the counter operator immediately.
                    </p>
                    {job.error_message && (
                      <span className="text-[10px] font-mono font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100 mt-4 block">
                        Reason: {job.error_message}
                      </span>
                    )}
                  </>
                )}

                {/* Progress Bar Indicator */}
                {job.status !== 'failed' && (
                  <div className="w-full max-w-[260px] mt-8 space-y-2">
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          job.status === 'completed' ? 'bg-green-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${getProgressPercentage(job.status)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-wider">
                      <span className={job.status === 'pending' || job.status === 'printing' || job.status === 'completed' ? 'text-blue-600' : ''}>Queued</span>
                      <span className={job.status === 'printing' || job.status === 'completed' ? 'text-blue-600' : ''}>Printing</span>
                      <span className={job.status === 'completed' ? 'text-green-600' : ''}>Ready</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Done Action */}
            <div className="pt-6 mt-auto">
              <button
                onClick={handleDone}
                disabled={job.status !== 'completed' && job.status !== 'failed'}
                className={`w-full font-extrabold text-lg py-4 px-4 rounded-2xl shadow-lg transition duration-150 flex items-center justify-center space-x-1.5 ${
                  job.status === 'completed'
                    ? 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-green-100 hover:shadow-xl'
                    : job.status === 'failed'
                    ? 'bg-gray-700 hover:bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                <span>Done</span>
                {(job.status === 'completed' || job.status === 'failed') && <ArrowRight className="w-5 h-5" />}
              </button>
              {job.status !== 'completed' && job.status !== 'failed' && (
                <p className="text-[10px] text-gray-400 text-center font-semibold mt-3">
                  This page will automatically update in real time. Do not close.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

// Clock Icon Helper
function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
