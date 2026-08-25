'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppShell from '../../components/AppShell';
import { subscribeToJobStatus } from '../../services/api';
import { Loader2, CheckCircle2, AlertOctagon, Printer, FileCheck2, ArrowRight } from 'lucide-react';

export default function JobStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId') || searchParams.get('jobid');

  const [jobs, setJobs] = useState<any[]>([]);
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
    if (!jobId) {
      setError("No Job ID provided in the URL.");
      setLoading(false);
      return;
    }

    const ids = jobId.split(',').map(id => id.trim()).filter(Boolean);
    if (ids.length === 0) {
      setError("No valid Job IDs found in the URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    // Pre-populate state with loading templates for each ID
    const initialJobs = ids.map(id => ({
      id,
      file_name: 'Retrieving file details...',
      status: 'pending',
      copies: 1,
      color: false,
      duplex: false,
      loading: true
    }));
    setJobs(initialJobs);

    const unsubscribers: (() => void)[] = [];
    let activeSubscriptions = 0;

    ids.forEach(id => {
      activeSubscriptions++;
      const unsubscribe = subscribeToJobStatus(id, (updatedJob: any) => {
        setLoading(false);
        if (updatedJob) {
          setJobs(prev => {
            const idx = prev.findIndex(j => j.id === id);
            if (idx !== -1) {
              const updated = [...prev];
              updated[idx] = { ...updatedJob, loading: false };
              return updated;
            }
            return [...prev, { ...updatedJob, loading: false }];
          });
        } else {
          // Mark job as failed to locate
          setJobs(prev => {
            const idx = prev.findIndex(j => j.id === id);
            if (idx !== -1) {
              const updated = [...prev];
              updated[idx] = { ...updated[idx], file_name: 'File not found', status: 'failed', error_message: 'Job could not be found in queue.', loading: false };
              return updated;
            }
            return prev;
          });
        }
      });

      if (unsubscribe) {
        unsubscribers.push(unsubscribe);
      }
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [jobId]);

  const handleDone = () => {
    sessionStorage.removeItem('last_job_id');
    sessionStorage.removeItem('last_job_name');

    // Find the shop ID from the first loaded job
    const loadedJob = jobs.find(j => j && j.user_id);
    const shopId = loadedJob?.user_id || sessionStorage.getItem('current_shop_id');
    
    if (shopId) {
      router.push(`/p?shopId=${shopId}`);
    } else {
      router.push('/');
    }
  };

  // Helper to determine active percentage for progress bar
  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'printing': return 65;
      case 'completed': return 100;
      default: return 0;
    }
  };

  // Check if all jobs are finished
  const areAllJobsFinished = () => {
    if (jobs.length === 0) return false;
    return jobs.every(j => j.status === 'completed' || j.status === 'failed');
  };

  const getOrderStatusMessage = () => {
    const total = jobs.length;
    const completed = jobs.filter(j => j.status === 'completed').length;
    const printing = jobs.filter(j => j.status === 'printing').length;
    const failed = jobs.filter(j => j.status === 'failed').length;

    if (completed === total) {
      return {
        title: "All Printing Complete!",
        desc: "All of your documents have been successfully printed. Please collect them from the counter.",
        color: "text-green-800"
      };
    }
    if (failed === total) {
      return {
        title: "Print Queue Error",
        desc: "Printing failed for your files. Please contact counter support for help.",
        color: "text-red-800"
      };
    }
    if (printing > 0) {
      return {
        title: "Printing in Progress...",
        desc: "The printer is currently outputting your pages. Please stay near the terminal.",
        color: "text-yellow-800"
      };
    }
    return {
      title: `Jobs in Print Queue (${completed}/${total} Ready)`,
      desc: "Your files are queued. They will print automatically in sequence.",
      color: "text-gray-800"
    };
  };

  const statusMsg = getOrderStatusMessage();

  return (
    <AppShell shopName={shopName} email={undefined}>
      <div className="flex flex-col min-h-[75vh]">
        {loading && jobs.length === 0 ? (
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
          <div className="flex-1 flex flex-col justify-between py-2 space-y-6">
            
            {/* Global Order Status Header */}
            <div className="text-center py-2 border-b border-gray-100 pb-4">
              <h2 className={`text-lg font-black ${statusMsg.color} leading-snug`}>
                {statusMsg.title}
              </h2>
              <p className="text-xs text-gray-400 font-semibold mt-1 max-w-[280px] mx-auto leading-relaxed">
                {statusMsg.desc}
              </p>
            </div>

            {/* List of Job Tracking Cards */}
            <div className="space-y-4 flex-1">
              {jobs.map((jobItem) => (
                <div key={jobItem.id} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
                  
                  {/* File Metadata */}
                  <div className="flex justify-between items-start">
                    <div className="overflow-hidden pr-4 max-w-[70%]">
                      <h4 className="text-sm font-extrabold text-gray-800 truncate">{jobItem.file_name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                        Copies: {jobItem.copies} • {jobItem.color ? 'Color' : 'B&W'} {jobItem.duplex && '• Duplex'}
                      </p>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {jobItem.status === 'pending' && (
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1 uppercase tracking-wide">
                          Queued
                        </span>
                      )}
                      {jobItem.status === 'printing' && (
                        <span className="text-[10px] font-black text-yellow-600 bg-yellow-50 border border-yellow-100 rounded-full px-2.5 py-1 uppercase tracking-wide animate-pulse">
                          Printing
                        </span>
                      )}
                      {jobItem.status === 'completed' && (
                        <span className="text-[10px] font-black text-green-600 bg-green-50 border border-green-100 rounded-full px-2.5 py-1 uppercase tracking-wide">
                          Ready
                        </span>
                      )}
                      {jobItem.status === 'failed' && (
                        <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-100 rounded-full px-2.5 py-1 uppercase tracking-wide">
                          Failed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Individual Progress indicator */}
                  {jobItem.status !== 'failed' && (
                    <div className="space-y-1.5">
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-green-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${getProgressPercentage(jobItem.status)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Error detail */}
                  {jobItem.status === 'failed' && (
                    <p className="text-[11px] font-bold text-red-500 bg-red-50/50 rounded-xl p-2 border border-red-100">
                      Error: {jobItem.error_message || "Failed at printer queue."}
                    </p>
                  )}

                </div>
              ))}
            </div>

            {/* Bottom Done Action Button */}
            <div className="pt-6">
              <button
                onClick={handleDone}
                className={`w-full text-white font-extrabold text-sm py-4 rounded-2xl shadow-md transition flex items-center justify-center space-x-1 ${
                  areAllJobsFinished() 
                    ? 'bg-green-650 hover:bg-green-700 active:bg-green-800' 
                    : 'bg-gray-500 hover:bg-gray-650 active:bg-gray-700'
                }`}
              >
                <span>{areAllJobsFinished() ? 'Done' : 'Go Back to Shop'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}
      </div>
    </AppShell>
  );
}
