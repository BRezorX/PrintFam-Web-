'use client';
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Printer, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  CheckCircle2, 
  Clock, 
  FileText, 
  TrendingUp, 
  Plus, 
  X, 
  Check, 
  Play, 
  Eye, 
  ArrowUpRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { PrintJob } from './types';

interface DashboardShowcaseProps {
  onOpenCustomerSimulator: () => void;
}

export const DashboardShowcase: React.FC<DashboardShowcaseProps> = ({ onOpenCustomerSimulator }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'completed'>('all');
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);
  const [printingJobId, setPrintingJobId] = useState<string | null>(null);

  // Initial mock jobs matching the mockup
  const [jobs, setJobs] = useState<PrintJob[]>([
    {
      id: '3538',
      customerName: 'Aarav Sharma',
      customerPhone: '+91 98450 12345',
      fileName: 'Physics_Notes_Unit4.pdf',
      fileSize: '4.2 MB',
      pageCount: 16,
      copies: 1,
      colorMode: 'B&W',
      paperSize: 'A4',
      duplex: true,
      totalPrice: 24.0,
      status: 'pending',
      submittedAt: '2 mins ago',
    },
    {
      id: '3539',
      customerName: 'Pooja Verma',
      customerPhone: '+91 97112 54321',
      fileName: 'Architecture_Blueprint_A3.pdf',
      fileSize: '12.8 MB',
      pageCount: 4,
      copies: 2,
      colorMode: 'Color',
      paperSize: 'A3',
      duplex: false,
      totalPrice: 80.0,
      status: 'approved',
      submittedAt: '8 mins ago',
    },
    {
      id: '3540',
      customerName: 'David Miller',
      customerPhone: '+1 415 555 0192',
      fileName: 'Passport_Photos_Sheet.png',
      fileSize: '1.9 MB',
      pageCount: 2,
      copies: 1,
      colorMode: 'Color',
      paperSize: 'A4',
      duplex: false,
      totalPrice: 35.0,
      status: 'completed',
      submittedAt: '25 mins ago',
    },
    {
      id: '3541',
      customerName: 'Sneha Patel',
      customerPhone: '+91 99201 88776',
      fileName: 'Court_Affidavit_Stamped.pdf',
      fileSize: '820 KB',
      pageCount: 3,
      copies: 3,
      colorMode: 'B&W',
      paperSize: 'A4',
      duplex: false,
      totalPrice: 18.0,
      status: 'completed',
      submittedAt: '34 mins ago',
    },
  ]);

  // Set default selected job for the popover preview matching the mockup
  const currentPopoverJob = selectedJob || jobs[0];

  const handleApprove = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'approved' } : j))
    );
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob((prev) => (prev ? { ...prev, status: 'approved' } : null));
    }
  };

  const handlePrint = (jobId: string) => {
    setPrintingJobId(jobId);
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'printing' } : j))
    );

    setTimeout(() => {
      setPrintingJobId(null);
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: 'completed' } : j))
      );
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob((prev) => (prev ? { ...prev, status: 'completed' } : null));
      }
    }, 1800);
  };

  const addSampleJob = () => {
    const sampleNames = ['Rohan Das', 'Ananya Roy', 'Vikram Sen', 'Kavita Nair'];
    const sampleFiles = [
      'Govt_Identity_Card.pdf',
      'Thesis_Chapter_3.pdf',
      'Marketing_Brochure_Fold.pdf',
      'Resume_2026_Color.pdf',
    ];
    const randomId = Math.floor(3542 + Math.random() * 500).toString();
    const newJob: PrintJob = {
      id: randomId,
      customerName: sampleNames[Math.floor(Math.random() * sampleNames.length)],
      fileName: sampleFiles[Math.floor(Math.random() * sampleFiles.length)],
      fileSize: '3.1 MB',
      pageCount: Math.floor(Math.random() * 12) + 1,
      copies: 1,
      colorMode: Math.random() > 0.5 ? 'B&W' : 'Color',
      paperSize: 'A4',
      duplex: Math.random() > 0.5,
      totalPrice: Math.floor(Math.random() * 40) + 10,
      status: 'pending',
      submittedAt: 'Just now',
    };

    setJobs((prev) => [newJob, ...prev]);
    setSelectedJob(newJob);
  };

  // Filtered jobs
  const filteredJobs = jobs.filter((j) => {
    if (activeTab === 'all') return true;
    return j.status === activeTab;
  });

  const pendingCount = jobs.filter((j) => j.status === 'pending').length;
  const approvedCount = jobs.filter((j) => j.status === 'approved').length;
  const completedCount = jobs.filter((j) => j.status === 'completed').length;
  const totalRevenue = jobs.reduce(
    (acc, cur) => (cur.status === 'completed' ? acc + cur.totalPrice : acc),
    3450
  );

  return (
    <section id="dashboard-demo" className="py-14 sm:py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Live Simulation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1128] tracking-tight mb-3">
            Desktop Application Showcase
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Test the real shopkeeper experience. Click "Approve" or "Print" below, or send a simulated job straight into the queue.
          </p>

          {/* Currency Toggle & Quick Action */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
            <button
              type="button"
              onClick={addSampleJob}
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Send Simulated Customer Job</span>
            </button>

            <button
              type="button"
              onClick={onOpenCustomerSimulator}
              className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Open Customer Phone View</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
            </button>

            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 border border-slate-200 text-xs font-bold text-slate-700 gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>INR (₹) • 100% Online UPI</span>
            </div>
          </div>
        </div>

        {/* 3D Perspective Desktop Window Container */}
        <div className="relative w-full rounded-3xl bg-gradient-to-b from-slate-900 to-[#0A1128] p-2 sm:p-4 shadow-2xl shadow-blue-950/20 border border-slate-700/80">
          
          {/* Top Window Chrome Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-xs text-slate-400">
            {/* macOS / Windows Traffic Lights */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              </div>
              <span className="hidden sm:inline font-mono text-[11px] text-slate-400 pl-3">
                PrintBolt Hub v2.4 • Main Counter PC
              </span>
            </div>

            {/* Printer Connection Status Badge */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium">HP LaserJet Pro 400 • Ready</span>
              </div>
            </div>
          </div>

          {/* App Window Body */}
          <div className="grid grid-cols-1 md:grid-cols-12 rounded-2xl bg-[#F8FAFC] overflow-hidden text-slate-800 min-h-[520px]">
            
            {/* Left Dark Sidebar matching mockup */}
            <aside className="md:col-span-3 lg:col-span-2 bg-[#0A1128] text-white p-4 flex flex-col justify-between border-r border-slate-800">
              <div>
                {/* Brand in Sidebar */}
                <div className="flex items-center gap-2 mb-6 px-2">
                  <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white text-xs font-black">
                    ⚡
                  </div>
                  <span className="font-bold text-sm tracking-tight">PrintBolt</span>
                </div>

                {/* Nav items */}
                <div className="space-y-1">
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Active Queue</span>
                    {pendingCount > 0 && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>Customers</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Analytics</span>
                  </button>
                </div>
              </div>

              {/* Bottom sidebar settings */}
              <div className="pt-4 border-t border-slate-800/80 space-y-1">
                <button
                  type="button"
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="md:col-span-9 lg:col-span-10 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                
                {/* Top Search & Profile Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 mb-5">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search orders, phone, file..."
                      readOnly
                      className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-700 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button type="button" className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 relative">
                      <Bell className="w-4 h-4" />
                      <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-1 right-1" />
                    </button>
                    <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-bold text-xs flex items-center justify-center">
                        PB
                      </div>
                      <span className="text-xs font-bold text-slate-700 hidden sm:inline">Rajesh Xerox</span>
                    </div>
                  </div>
                </div>

                {/* Top Stats Bar matching reference mockup */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  
                  {/* Stat 1: Active Queue */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Active Queue
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center justify-between">
                      <span>{pendingCount} Pending</span>
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Est. print time: 2 mins</div>
                  </div>

                  {/* Stat 2: Approved Jobs */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Approved Jobs
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-blue-600 flex items-center justify-between">
                      <span>{approvedCount} Jobs</span>
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Ready for 1-click print</div>
                  </div>

                  {/* Stat 3: Completed Jobs */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Completed Jobs
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-600 flex items-center justify-between">
                      <span>{completedCount + 80} Total</span>
                      <Check className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">100% paper delivered</div>
                  </div>

                  {/* Stat 4: Today's Revenue */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-white to-blue-50/50 border border-blue-200/80 shadow-xs">
                    <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1">
                      Today's Revenue
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center justify-between">
                      <span>₹{Math.round(totalRevenue)}</span>
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-1">+18.4% vs yesterday</div>
                  </div>

                </div>

                {/* Queue Table & Interactive Popover Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  
                  {/* Left Table: Job Queue List */}
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    
                    {/* Filter Tabs */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                      <div className="flex items-center gap-1">
                        {(['all', 'pending', 'approved', 'completed'] as const).map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                              activeTab === tab
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      <span className="text-[11px] font-mono text-slate-400">
                        {filteredJobs.length} records
                      </span>
                    </div>

                    {/* Jobs List */}
                    <div className="divide-y divide-slate-100 max-h-[290px] overflow-y-auto">
                      {filteredJobs.map((job) => {
                        const isSelected = currentPopoverJob.id === job.id;
                        const isPrinting = printingJobId === job.id;

                        return (
                          <div
                            key={job.id}
                            onClick={() => setSelectedJob(job)}
                            className={`p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-blue-50/40 cursor-pointer transition-colors ${
                              isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                                job.colorMode === 'Color' ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-600'
                              }`}>
                                <FileText className="w-4 h-4" />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-xs text-slate-900 truncate">
                                    {job.fileName}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400">
                                    #{job.id}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                                  <span>{job.customerName}</span>
                                  <span>•</span>
                                  <span>{job.pageCount} pgs ({job.colorMode})</span>
                                  <span>•</span>
                                  <span className="font-semibold text-slate-700">
                                    ₹{job.totalPrice}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Quick Action Button */}
                            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                              {job.status === 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => handleApprove(job.id)}
                                  className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  Approve
                                </button>
                              )}

                              {job.status === 'approved' && (
                                <button
                                  type="button"
                                  onClick={() => handlePrint(job.id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Printer className="w-3 h-3" />
                                  <span>Print</span>
                                </button>
                              )}

                              {job.status === 'printing' && (
                                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-bold animate-pulse">
                                  Printing...
                                </span>
                              )}

                              {job.status === 'completed' && (
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-emerald-600 text-[11px] font-bold flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  <span>Done</span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* Right Popover Card matching the reference mockup */}
                  <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-blue-500/80 shadow-xl shadow-blue-500/10 p-4 sm:p-5 relative">
                    
                    {/* Header badge matching mockup */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                          Job Inspector #{currentPopoverJob.id}
                        </span>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        currentPopoverJob.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : currentPopoverJob.status === 'approved'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {currentPopoverJob.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Job Details Card Body */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Document Name:</span>
                        <span className="font-bold text-slate-800 truncate max-w-[170px]">
                          {currentPopoverJob.fileName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Customer:</span>
                        <span className="font-semibold text-slate-700">{currentPopoverJob.customerName}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Page Specs:</span>
                        <span className="font-mono text-slate-800">
                          {currentPopoverJob.pageCount} pgs • {currentPopoverJob.paperSize} • {currentPopoverJob.colorMode} {currentPopoverJob.duplex ? '(Duplex)' : '(Single)'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                        <span className="text-slate-500 font-semibold">Calculated Total:</span>
                        <span className="text-sm font-black text-emerald-600">
                          ₹{currentPopoverJob.totalPrice}.00
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons matching mockup */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleApprove(currentPopoverJob.id)}
                        disabled={currentPopoverJob.status !== 'pending'}
                        className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          currentPopoverJob.status === 'pending'
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePrint(currentPopoverJob.id)}
                        disabled={printingJobId === currentPopoverJob.id || currentPopoverJob.status === 'completed'}
                        className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          printingJobId === currentPopoverJob.id
                            ? 'bg-amber-500 text-white animate-pulse'
                            : currentPopoverJob.status === 'completed'
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                        }`}
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{printingJobId === currentPopoverJob.id ? 'Printing...' : 'Print Now'}</span>
                      </button>
                    </div>

                    <div className="mt-3 text-[10px] text-slate-400 text-center">
                      Auto-sent to connected printer with correct margins and duplex settings
                    </div>

                  </div>

                </div>

              </div>

              {/* Bottom footer footnote */}
              <div className="pt-3 border-t border-slate-200/80 mt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
                <span>PrintBolt Engine: Offline-first sync mode active</span>
                <span className="font-semibold text-blue-600">Zero data leaves your shop PC without encryption</span>
              </div>
            </main>

          </div>

        </div>

      </div>
    </section>
  );
};

