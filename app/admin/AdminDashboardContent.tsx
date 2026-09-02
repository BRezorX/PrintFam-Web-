'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Printer, 
  IndianRupee, 
  TrendingUp, 
  Search, 
  Download, 
  ExternalLink, 
  QrCode, 
  FileText, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Clock, 
  Edit3, 
  X, 
  Save, 
  Lock, 
  KeyRound, 
  Copy, 
  Check,
  ChevronRight,
  Eye
} from 'lucide-react';
import { getAllShopsWithMetrics, getShopAuditLogs, updateShopSettings, ShopSummary, PlatformMetrics, PrintAuditEntry } from '../../services/adminApi';

const DEFAULT_ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';

export default function AdminDashboardContent() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Data State
  const [shops, setShops] = useState<ShopSummary[]>([]);
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal / Drawer State
  const [selectedShop, setSelectedShop] = useState<ShopSummary | null>(null);
  const [shopAudits, setShopAudits] = useState<PrintAuditEntry[]>([]);
  const [loadingAudits, setLoadingAudits] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    shop_name: '',
    bw_price: 2.0,
    color_price: 10.0,
    duplex_price: 1.0,
    is_active: true
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Check cached PIN session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('printbolt_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch all shops and platform metrics
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAllShopsWithMetrics();
      setShops(res.shops);
      setMetrics(res.metrics);
    } catch (err) {
      console.error("Failed to load admin metrics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Handle PIN verification
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('printbolt_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Incorrect Admin PIN. Please try again.');
    }
  };

  // Filtered shops list
  const filteredShops = useMemo(() => {
    return shops.filter(shop => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        shop.shop_name.toLowerCase().includes(q) ||
        shop.user_id.toLowerCase().includes(q) ||
        (shop.owner_name && shop.owner_name.toLowerCase().includes(q)) ||
        (shop.email && shop.email.toLowerCase().includes(q)) ||
        (shop.phone && shop.phone.includes(q));

      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'active' && shop.is_active) ||
        (statusFilter === 'inactive' && !shop.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [shops, searchQuery, statusFilter]);

  // Load audit logs when a shop is selected
  const handleSelectShop = async (shop: ShopSummary) => {
    setSelectedShop(shop);
    setLoadingAudits(true);
    try {
      const logs = await getShopAuditLogs(shop.user_id);
      setShopAudits(logs);
    } catch (err) {
      console.error("Failed to load shop audits", err);
    } finally {
      setLoadingAudits(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (shop: ShopSummary, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedShop(shop);
    setEditForm({
      shop_name: shop.shop_name,
      bw_price: shop.bw_price,
      color_price: shop.color_price,
      duplex_price: shop.duplex_price,
      is_active: shop.is_active !== false
    });
    setShowEditModal(true);
  };

  // Save Shop Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShop) return;

    setSavingEdit(true);
    try {
      await updateShopSettings(selectedShop.user_id, editForm);
      setShowEditModal(false);
      await loadData();
    } catch (err) {
      alert("Failed to update shop settings.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export CSV Report
  const handleExportCSV = () => {
    if (shops.length === 0) return;

    const headers = ["Shop Name", "Shop ID", "Owner", "Email", "Phone", "Status", "B&W Rate (₹)", "Color Rate (₹)", "Total Jobs", "Total Pages", "B&W Pages", "Color Pages", "Total Revenue (₹)", "Today Pages", "Today Revenue (₹)"];
    
    const rows = shops.map(s => [
      `"${s.shop_name.replace(/"/g, '""')}"`,
      s.user_id,
      `"${(s.owner_name || '').replace(/"/g, '""')}"`,
      s.email || '',
      s.phone || '',
      s.is_active ? 'Active' : 'Inactive',
      s.bw_price,
      s.color_price,
      s.total_jobs,
      s.total_pages,
      s.total_bw_pages,
      s.total_color_pages,
      s.total_revenue,
      s.today_pages,
      s.today_revenue
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PrintBolt_Shops_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================
  // 1. PIN Access Protection Screen
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-blue-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-1">PrintBolt Admin</h2>
          <p className="text-xs text-slate-400 font-medium mb-6">Enter master passcode to access the central management dashboard.</p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter Admin PIN"
                autoFocus
                className="w-full text-center text-xl tracking-widest font-black py-3.5 px-4 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition"
              />
              {pinError && (
                <p className="text-xs text-red-400 font-bold mt-2">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-2xl transition shadow-lg shadow-blue-600/30"
            >
              Unlock Dashboard
            </button>
          </form>
          <div className="mt-6 text-[11px] text-slate-500 font-semibold">Default PIN: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-400">1234</code></div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. Main Super-Admin Dashboard
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="PrintBolt" className="w-8 h-8 rounded-lg object-contain" />
            <div>
              <span className="font-black text-lg tracking-tight text-white block leading-none">PrintBolt</span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Platform Admin</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              className="hidden sm:flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem('printbolt_admin_auth');
                setIsAuthenticated(false);
              }}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              title="Lock Dashboard"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Partner Shops */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Partner Shops</span>
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-2xl">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {metrics?.totalShops || 0}
            </div>
            <div className="text-xs font-semibold text-emerald-400 mt-1 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{metrics?.activeShopsCount || 0} active now</span>
            </div>
          </div>

          {/* Card 2: Total Prints */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Volume</span>
              <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-2xl">
                <Printer className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {(metrics?.totalPages || 0).toLocaleString()} <span className="text-sm text-slate-500 font-semibold">pgs</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              <span className="text-slate-300 font-bold">{metrics?.totalBwPages || 0}</span> B&W • <span className="text-purple-400 font-bold">{metrics?.totalColorPages || 0}</span> Color
            </div>
          </div>

          {/* Card 3: Total Gross Revenue */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ₹{(metrics?.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              From <span className="text-white font-bold">{metrics?.totalJobs || 0}</span> completed jobs
            </div>
          </div>

          {/* Card 4: Today's Activity */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Activity</span>
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {metrics?.todayPages || 0} <span className="text-sm text-slate-500 font-semibold">pgs</span>
            </div>
            <div className="text-xs text-amber-400 font-bold mt-1">
              ₹{(metrics?.todayRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} earned today
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-3xl border border-slate-800">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by shop name, ID, owner, email, phone..."
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-10 pr-4 py-2.5 rounded-2xl focus:outline-none focus:border-blue-500 transition placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition ${
                statusFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All ({shops.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition ${
                statusFilter === 'active' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition ${
                statusFilter === 'inactive' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* Shops Directory Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-white tracking-wide uppercase">Partner Shops Directory</h3>
            <span className="text-xs text-slate-400 font-bold">{filteredShops.length} shops found</span>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <span className="text-xs text-slate-400 font-bold">Loading partner shops metrics...</span>
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-bold text-slate-400">No partner shops match your query.</p>
              <p className="text-xs mt-1">Try refining your search filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
                  <tr>
                    <th className="py-3.5 px-6">Shop Details</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Total Prints</th>
                    <th className="py-3.5 px-4 text-right">Total Revenue</th>
                    <th className="py-3.5 px-4 text-right">Today</th>
                    <th className="py-3.5 px-4">Pricing Rules</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredShops.map((shop) => (
                    <tr 
                      key={shop.user_id} 
                      onClick={() => handleSelectShop(shop)}
                      className="hover:bg-slate-800/40 transition cursor-pointer group"
                    >
                      {/* Shop Name & ID */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-sm border border-blue-500/20 group-hover:scale-105 transition">
                            {shop.shop_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-extrabold text-white text-sm group-hover:text-blue-400 transition flex items-center space-x-1.5">
                              <span>{shop.shop_name}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition" />
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                              <span>{shop.owner_name || shop.email || 'No contact'}</span>
                              <span className="text-slate-600">•</span>
                              <span className="font-mono text-[10px] text-slate-500">ID: {shop.user_id.substring(0, 8)}...</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {shop.is_active ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-500/10 text-red-400 border border-red-500/20">
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Total Volume */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-black text-white text-sm">
                          {shop.total_pages} <span className="text-[10px] font-semibold text-slate-400">pgs</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {shop.total_bw_pages} B&W • {shop.total_color_pages} Color
                        </div>
                      </td>

                      {/* Total Revenue */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-black text-emerald-400 text-sm">
                          ₹{shop.total_revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {shop.total_jobs} orders
                        </div>
                      </td>

                      {/* Today */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-extrabold text-amber-400">
                          {shop.today_pages} pgs
                        </div>
                        <div className="text-[10px] text-slate-500">
                          ₹{shop.today_revenue}
                        </div>
                      </td>

                      {/* Pricing Rules */}
                      <td className="py-4 px-4">
                        <div className="text-[11px] text-slate-300 font-semibold">
                          B&W: <span className="text-white font-bold">₹{shop.bw_price}</span> • Color: <span className="text-purple-300 font-bold">₹{shop.color_price}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Duplex: ₹{shop.duplex_price}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenEdit(shop)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                            title="Edit Pricing & Settings"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => handleCopy(`https://printbolt.store/p?shopId=${shop.user_id}`, shop.user_id, e)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                            title="Copy Customer Portal URL"
                          >
                            {copiedId === shop.user_id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <Link
                            href={`/p?shopId=${shop.user_id}`}
                            target="_blank"
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition"
                            title="Open Customer Counter Portal"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ========================================== */}
      {/* 3. Shop Deep-Dive Audit Drawer / Modal */}
      {/* ========================================== */}
      {selectedShop && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Shop Audit & Performance</span>
                <h3 className="text-xl font-black text-white tracking-tight">{selectedShop.shop_name}</h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">ID: {selectedShop.user_id}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(selectedShop)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-white transition flex items-center space-x-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setSelectedShop(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Total Volume</span>
                  <div className="text-xl font-black text-white mt-1">{selectedShop.total_pages} <span className="text-xs font-semibold text-slate-500">pgs</span></div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{selectedShop.total_jobs} jobs</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Total Revenue</span>
                  <div className="text-xl font-black text-emerald-400 mt-1">₹{selectedShop.total_revenue}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">₹{selectedShop.today_revenue} today</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Status</span>
                  <div className="text-sm font-black mt-2">
                    {selectedShop.is_active ? (
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center space-x-1">
                        <XCircle className="w-3.5 h-3.5" /> <span>Suspended</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Counter Portal Links */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Customer Counter Link</span>
                  <Link
                    href={`/p?shopId=${selectedShop.user_id}`}
                    target="_blank"
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                  >
                    <span>Open Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://printbolt.store/p?shopId=${selectedShop.user_id}`}
                    className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-300 px-3 py-2 rounded-xl font-mono focus:outline-none"
                  />
                  <button
                    onClick={(e) => handleCopy(`https://printbolt.store/p?shopId=${selectedShop.user_id}`, 'drawer_copy', e)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition"
                  >
                    {copiedId === 'drawer_copy' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Recent Audit Logs Table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Recent Print Audit Logs</h4>
                  <span className="text-[10px] text-slate-500">{shopAudits.length} recorded prints</span>
                </div>

                {loadingAudits ? (
                  <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <span className="text-xs text-slate-500 font-bold">Loading audit logs...</span>
                  </div>
                ) : shopAudits.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                    No print jobs recorded for this shop yet.
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden max-h-80 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[9px] sticky top-0">
                        <tr>
                          <th className="py-2.5 px-3">Time</th>
                          <th className="py-2.5 px-3">File Name</th>
                          <th className="py-2.5 px-2">Specs</th>
                          <th className="py-2.5 px-3 text-right">Amount</th>
                          <th className="py-2.5 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                        {shopAudits.map((a) => (
                          <tr key={a.id} className="hover:bg-slate-900/50">
                            <td className="py-2.5 px-3 text-slate-400 font-mono text-[10px]">
                              {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-white truncate max-w-[140px]">
                              {a.file_name}
                            </td>
                            <td className="py-2.5 px-2 text-[10px]">
                              {a.color ? <span className="text-purple-400 font-bold">Color</span> : 'B&W'} • {a.pages}p × {a.copies}c
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                              ₹{a.amount}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 4. Edit Pricing & Settings Modal */}
      {/* ========================================== */}
      {showEditModal && selectedShop && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-white">Edit Shop Pricing</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedShop.shop_name}</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={editForm.shop_name}
                  onChange={(e) => setEditForm({ ...editForm, shop_name: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                    B&W Rate (₹/pg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={editForm.bw_price}
                    onChange={(e) => setEditForm({ ...editForm, bw_price: parseFloat(e.target.value) || 0 })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                    Color Rate (₹/pg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={editForm.color_price}
                    onChange={(e) => setEditForm({ ...editForm, color_price: parseFloat(e.target.value) || 0 })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Duplex Additional Rate (₹/pg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={editForm.duplex_price}
                  onChange={(e) => setEditForm({ ...editForm, duplex_price: parseFloat(e.target.value) || 0 })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="shop_active_toggle"
                  checked={editForm.is_active}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-950 border-slate-800"
                />
                <label htmlFor="shop_active_toggle" className="text-xs font-bold text-slate-300">
                  Shop is Active & Receiving Orders
                </label>
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition flex justify-center items-center space-x-1.5 shadow-lg shadow-blue-600/30"
                >
                  {savingEdit ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
