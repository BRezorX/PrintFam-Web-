'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
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
  X, 
  Lock, 
  Copy, 
  Check,
  ChevronRight,
  Eye,
  Mail,
  LogOut,
  AlertCircle,
  ArrowLeft,
  UserCheck,
  PauseCircle,
  PlayCircle,
  Trash2,
  Calendar,
  Radio,
  Wifi,
  WifiOff,
  AlertTriangle,
  History,
  Filter,
  ArrowUpRight,
  FileSpreadsheet
} from 'lucide-react';
import { 
  checkAdminStatus, 
  registerInitialAdmin, 
  loginAdmin, 
  sendAdminPasswordReset, 
  updateAdminPassword, 
  getVerifiedAdminUser, 
  logoutAdmin, 
  getAllShopsWithMetrics, 
  getShopAuditLogs, 
  getAllPlatformPrintAudits, 
  toggleShopPause, 
  deleteShop, 
  exportShopAuditsToCSV, 
  exportAllAuditsToCSV, 
  ShopSummary, 
  PlatformMetrics, 
  PrintAuditEntry, 
  GlobalPrintAuditEntry 
} from '../../services/adminApi';

type AuthViewMode = 'login' | 'register_initial' | 'forgot_password' | 'set_new_password';
type TimeframeMode = 'today' | 'weekly' | 'monthly' | 'all';
type AdminTabMode = 'shops' | 'history';

export default function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resetModeParam = searchParams.get('mode') === 'reset';
  const urlShopId = searchParams.get('shopId');

  // Authentication State
  const [authChecking, setAuthChecking] = useState(true);
  const [hasRegisteredAdmin, setHasRegisteredAdmin] = useState(true);
  const [registeredAdminEmail, setRegisteredAdminEmail] = useState<string | null>(null);
  const [currentAdminUser, setCurrentAdminUser] = useState<any | null>(null);
  const [authView, setAuthView] = useState<AuthViewMode>('login');

  // Auth Form Fields
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<AdminTabMode>('shops');

  // Dashboard Data State
  const [shops, setShops] = useState<ShopSummary[]>([]);
  const [globalAudits, setGlobalAudits] = useState<GlobalPrintAuditEntry[]>([]);
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'paused'>('all');
  const [timeframe, setTimeframe] = useState<TimeframeMode>('monthly');

  // Global History Filters
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyShopFilter, setHistoryShopFilter] = useState<string>('all');
  const [historyColorFilter, setHistoryColorFilter] = useState<'all' | 'color' | 'bw'>('all');

  // Single Shop Dedicated Full-Page View State
  const [selectedShop, setSelectedShop] = useState<ShopSummary | null>(null);
  const [shopAudits, setShopAudits] = useState<PrintAuditEntry[]>([]);
  const [loadingAudits, setLoadingAudits] = useState(false);
  const [shopAuditSearch, setShopAuditSearch] = useState('');
  const [shopAuditColorFilter, setShopAuditColorFilter] = useState<'all' | 'color' | 'bw'>('all');

  // Actions
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Check current session & admin existence on mount
  useEffect(() => {
    const initAuth = async () => {
      setAuthChecking(true);
      try {
        const status = await checkAdminStatus();
        setHasRegisteredAdmin(status.hasAdmin);
        if (status.adminEmail) {
          setRegisteredAdminEmail(status.adminEmail);
          setEmailInput(status.adminEmail);
        }

        if (!status.hasAdmin) {
          setAuthView('register_initial');
        } else if (resetModeParam) {
          setAuthView('set_new_password');
        } else {
          setAuthView('login');
        }

        const user = await getVerifiedAdminUser();
        if (user) {
          setCurrentAdminUser(user);
        }
      } catch (err) {
        console.error("Auth init error", err);
      } finally {
        setAuthChecking(false);
      }
    };

    initAuth();
  }, [resetModeParam]);

  // Load metrics & global audits when admin is authenticated
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAllShopsWithMetrics();
      setShops(res.shops);
      setMetrics(res.metrics);

      // Check if URL specifies a shop to open
      if (urlShopId) {
        const target = res.shops.find(s => s.user_id === urlShopId);
        if (target) {
          handleSelectShop(target);
        }
      } else if (selectedShop) {
        const refreshedTarget = res.shops.find(s => s.user_id === selectedShop.user_id);
        if (refreshedTarget) {
          setSelectedShop(refreshedTarget);
        }
      }

      // Also load platform-wide print history
      const audits = await getAllPlatformPrintAudits(res.shops);
      setGlobalAudits(audits);
    } catch (err) {
      console.error("Failed to load admin metrics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentAdminUser) {
      loadData();
    }
  }, [currentAdminUser, urlShopId]);

  // 1. Handle Initial Admin Registration
  const handleRegisterInitial = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (passwordInput.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    if (passwordInput !== confirmPasswordInput) {
      setAuthError('Passwords do not match.');
      return;
    }

    setSubmittingAuth(true);
    try {
      const res = await registerInitialAdmin(emailInput, passwordInput);
      if (res.success) {
        setHasRegisteredAdmin(true);
        setRegisteredAdminEmail(emailInput);
        setAuthSuccess('Admin account created successfully! Please log in.');
        setAuthView('login');
      } else {
        setAuthError(res.error || 'Failed to create initial admin account.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
    } finally {
      setSubmittingAuth(false);
    }
  };

  // 2. Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setSubmittingAuth(true);

    try {
      const res = await loginAdmin(emailInput, passwordInput);
      if (res.success && res.user) {
        setCurrentAdminUser(res.user);
      } else {
        setAuthError(res.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login failed.');
    } finally {
      setSubmittingAuth(false);
    }
  };

  // 3. Handle Forgot Password Request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setSubmittingAuth(true);

    try {
      const res = await sendAdminPasswordReset(emailInput);
      if (res.success) {
        setAuthSuccess('Password reset link sent! Check your inbox to set a new password.');
      } else {
        setAuthError(res.error || 'Could not send reset email.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send reset email.');
    } finally {
      setSubmittingAuth(false);
    }
  };

  // 4. Handle Set New Password
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (passwordInput.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    if (passwordInput !== confirmPasswordInput) {
      setAuthError('Passwords do not match.');
      return;
    }

    setSubmittingAuth(true);
    try {
      const res = await updateAdminPassword(passwordInput);
      if (res.success) {
        setAuthSuccess('Password updated successfully! Please log in.');
        setPasswordInput('');
        setConfirmPasswordInput('');
        setAuthView('login');
      } else {
        setAuthError(res.error || 'Failed to update password.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to update password.');
    } finally {
      setSubmittingAuth(false);
    }
  };

  // 5. Handle Logout
  const handleLogout = async () => {
    await logoutAdmin();
    setCurrentAdminUser(null);
    setPasswordInput('');
    setAuthView('login');
  };

  // 6. Handle Service Pause / Resume
  const handleTogglePause = async (shop: ShopSummary, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newPauseState = !shop.is_paused;
    setActionLoading(true);
    try {
      await toggleShopPause(shop.user_id, newPauseState);
      await loadData();
      if (selectedShop && selectedShop.user_id === shop.user_id) {
        setSelectedShop({ ...selectedShop, is_paused: newPauseState });
      }
    } catch (err) {
      alert("Failed to toggle shop service state.");
    } finally {
      setActionLoading(false);
    }
  };

  // 7. Handle Delete / Remove Shop
  const handleDeleteShop = async (shop: ShopSummary) => {
    setActionLoading(true);
    try {
      await deleteShop(shop.user_id);
      setShowDeleteConfirm(false);
      setSelectedShop(null);
      await loadData();
    } catch (err) {
      alert("Failed to remove shop.");
    } finally {
      setActionLoading(false);
    }
  };

  // 8. Open Dedicated Full-Page View for a Shop
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
        (statusFilter === 'online' && shop.is_online) ||
        (statusFilter === 'offline' && !shop.is_online) ||
        (statusFilter === 'paused' && shop.is_paused);

      return matchesSearch && matchesStatus;
    });
  }, [shops, searchQuery, statusFilter]);

  // Filtered Global Print History
  const filteredGlobalAudits = useMemo(() => {
    return globalAudits.filter(item => {
      const q = historySearchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        item.file_name.toLowerCase().includes(q) ||
        item.shop_name.toLowerCase().includes(q) ||
        (item.printer_name && item.printer_name.toLowerCase().includes(q)) ||
        item.user_id.toLowerCase().includes(q);

      const matchesShop = 
        historyShopFilter === 'all' || 
        item.user_id === historyShopFilter;

      const matchesColor = 
        historyColorFilter === 'all' ||
        (historyColorFilter === 'color' && item.color) ||
        (historyColorFilter === 'bw' && !item.color);

      return matchesSearch && matchesShop && matchesColor;
    });
  }, [globalAudits, historySearchQuery, historyShopFilter, historyColorFilter]);

  // Filtered Individual Shop Print Audits
  const filteredShopAudits = useMemo(() => {
    return shopAudits.filter(item => {
      const q = shopAuditSearch.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        item.file_name.toLowerCase().includes(q) ||
        (item.printer_name && item.printer_name.toLowerCase().includes(q)) ||
        item.status.toLowerCase().includes(q);

      const matchesColor = 
        shopAuditColorFilter === 'all' ||
        (shopAuditColorFilter === 'color' && item.color) ||
        (shopAuditColorFilter === 'bw' && !item.color);

      return matchesSearch && matchesColor;
    });
  }, [shopAudits, shopAuditSearch, shopAuditColorFilter]);

  // Copy helper
  const handleCopy = (text: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export Overall Platform CSV Report
  const handleExportCSV = () => {
    if (shops.length === 0) return;

    const headers = [
      "Shop Name", 
      "Shop ID", 
      "Owner Email", 
      "Service Status", 
      "PC App Status", 
      "B&W Rate (₹)", 
      "Color Rate (₹)", 
      "Duplex Rate (₹)", 
      "Today Pages", 
      "Today Revenue (₹)", 
      "Weekly Pages", 
      "Weekly Revenue (₹)", 
      "Monthly Pages", 
      "Monthly Revenue (₹)", 
      "Total Pages", 
      "Total Revenue (₹)"
    ];
    
    const rows = shops.map(s => [
      `"${s.shop_name.replace(/"/g, '""')}"`,
      s.user_id,
      s.email || '',
      s.is_paused ? 'Paused' : (s.is_active ? 'Active' : 'Inactive'),
      s.is_online ? 'Online' : 'Offline',
      s.bw_price,
      s.color_price,
      s.duplex_price,
      s.today_pages,
      s.today_revenue,
      s.weekly_pages,
      s.weekly_revenue,
      s.monthly_pages,
      s.monthly_revenue,
      s.total_pages,
      s.total_revenue
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PrintBolt_Platform_Report_${timeframe}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to format Timeframe stats
  const getTimeframeStats = () => {
    if (!metrics) return { pages: 0, revenue: 0, jobs: 0, label: '' };
    switch (timeframe) {
      case 'today':
        return { pages: metrics.todayPages, revenue: metrics.todayRevenue, jobs: metrics.todayJobs, label: "Today's Volume" };
      case 'weekly':
        return { pages: metrics.weeklyPages, revenue: metrics.weeklyRevenue, jobs: metrics.weeklyJobs, label: "Weekly Volume (7 Days)" };
      case 'monthly':
        return { pages: metrics.monthlyPages, revenue: metrics.monthlyRevenue, jobs: metrics.monthlyJobs, label: "Monthly Volume (30 Days)" };
      case 'all':
      default:
        return { pages: metrics.totalPages, revenue: metrics.totalRevenue, jobs: metrics.totalJobs, label: "All-Time Volume" };
    }
  };

  const activeStats = getTimeframeStats();

  // Initial Loading Spinner
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-xs font-bold">Verifying Super-Admin Access...</span>
      </div>
    );
  }

  // ==========================================
  // 1. AUTHENTICATION & SINGLE-ADMIN SCREENS
  // ==========================================
  if (!currentAdminUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {authView === 'register_initial' && 'Create Super-Admin Account'}
              {authView === 'login' && 'Super-Admin Login'}
              {authView === 'forgot_password' && 'Reset Admin Password'}
              {authView === 'set_new_password' && 'Set New Password'}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {authView === 'register_initial' && 'Initial setup: Register the one and only master administrator account.'}
              {authView === 'login' && 'Log in with your verified email and password. Session persists securely.'}
              {authView === 'forgot_password' && 'Enter your registered admin email to receive a password reset link.'}
              {authView === 'set_new_password' && 'Enter your new secure password below.'}
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-400 font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {authView === 'register_initial' && (
            <form onSubmit={handleRegisterInitial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@printbolt.store"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Create Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Confirm Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-[11px] text-blue-300">
                🔒 <strong>Singleton Protection</strong>: Once created, no other admin account can be registered.
              </div>

              <button
                type="submit"
                disabled={submittingAuth}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-2xl transition shadow-lg shadow-blue-600/30 flex justify-center items-center"
              >
                {submittingAuth ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Claim & Initialize Admin'
                )}
              </button>
            </form>
          )}

          {authView === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Verified Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@printbolt.store"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthError('');
                      setAuthSuccess('');
                      setAuthView('forgot_password');
                    }}
                    className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingAuth}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-2xl transition shadow-lg shadow-blue-600/30 flex justify-center items-center"
              >
                {submittingAuth ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Log In to Admin Dashboard'
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-500 font-semibold flex items-center justify-center space-x-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Single Admin Registered: {registeredAdminEmail || 'Configured'}</span>
                </span>
              </div>
            </form>
          )}

          {authView === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Enter Verified Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@printbolt.store"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingAuth}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-2xl transition shadow-lg shadow-blue-600/30 flex justify-center items-center"
              >
                {submittingAuth ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Send Password Reset Link'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthError('');
                  setAuthSuccess('');
                  setAuthView('login');
                }}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-white transition flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
            </form>
          )}

          {authView === 'set_new_password' && (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingAuth}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-2xl transition shadow-lg shadow-blue-600/30 flex justify-center items-center"
              >
                {submittingAuth ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. DEDICATED FULL-PAGE SHOP AUDIT PREVIEW
  // ==========================================
  if (selectedShop) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white pb-24">
        {/* Top Detail Bar */}
        <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedShop(null)}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Partner Shops</span>
              </button>

              <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>

              <div className="hidden sm:flex items-center space-x-2">
                <span className="font-extrabold text-sm text-white">{selectedShop.shop_name}</span>
                {selectedShop.is_online ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>PC App Online</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                    <span>PC App Closed</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => handleTogglePause(selectedShop, e)}
                disabled={actionLoading}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  selectedShop.is_paused
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20'
                }`}
              >
                {selectedShop.is_paused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                <span>{selectedShop.is_paused ? 'Resume Counter Service' : 'Pause Counter Service'}</span>
              </button>

              <button
                onClick={() => exportShopAuditsToCSV(selectedShop, shopAudits)}
                disabled={shopAudits.length === 0}
                className="hidden sm:flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit CSV</span>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800 transition"
                title="Remove Shop from Platform"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          {/* Shop Header Banner Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-3xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-2xl border border-blue-500/30">
                  {selectedShop.shop_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{selectedShop.shop_name}</h1>
                    {selectedShop.is_paused ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <PauseCircle className="w-3.5 h-3.5" />
                        <span>Service Paused</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Service Active</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                    <span className="text-slate-300 font-bold">{selectedShop.email || selectedShop.owner_name || 'No email configured'}</span>
                    <span className="text-slate-600">•</span>
                    <span className="font-mono text-[11px] text-slate-500">Shop ID: {selectedShop.user_id}</span>
                  </div>
                </div>
              </div>

              {/* Customer Counter URL Action Box */}
              <div className="w-full lg:w-auto bg-slate-950 border border-slate-800 p-3 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:w-80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Customer Counter Portal URL</span>
                  <input
                    type="text"
                    readOnly
                    value={`https://printbolt.store/p?shopId=${selectedShop.user_id}`}
                    className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-300 px-3 py-1.5 rounded-xl font-mono focus:outline-none select-all"
                  />
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto pt-3 sm:pt-0">
                  <button
                    onClick={(e) => handleCopy(`https://printbolt.store/p?shopId=${selectedShop.user_id}`, 'full_page_copy', e)}
                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20"
                  >
                    {copiedId === 'full_page_copy' ? 'Copied!' : 'Copy Link'}
                  </button>
                  <Link
                    href={`/p?shopId=${selectedShop.user_id}`}
                    target="_blank"
                    className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition"
                    title="Launch Counter Kiosk"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Analytics KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">All-Time Volume</span>
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-2xl">
                  <Printer className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {selectedShop.total_pages} <span className="text-sm font-semibold text-slate-500">pgs</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                <span className="text-slate-300 font-bold">{selectedShop.total_bw_pages}</span> B&W • <span className="text-purple-400 font-bold">{selectedShop.total_color_pages}</span> Color
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">All-Time Revenue</span>
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                  <IndianRupee className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                ₹{selectedShop.total_revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                From <span className="text-white font-bold">{selectedShop.total_jobs}</span> completed orders
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Activity</span>
                <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-2xl">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {selectedShop.monthly_pages} <span className="text-sm font-semibold text-slate-500">pgs</span>
              </div>
              <div className="text-xs text-purple-400 font-bold mt-1">
                ₹{selectedShop.monthly_revenue} in last 30 days
              </div>
            </div>

            {/* Shopkeeper Rates (View Only) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shopkeeper Rates</span>
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <div className="text-xs text-slate-300 font-semibold mt-1">
                B&W: <span className="text-white font-black text-base">₹{selectedShop.bw_price}</span> / pg
              </div>
              <div className="text-xs text-purple-300 font-semibold mt-0.5">
                Color: <span className="text-purple-400 font-black text-base">₹{selectedShop.color_price}</span> / pg • Duplex: ₹{selectedShop.duplex_price}
              </div>
            </div>
          </div>

          {/* Individual Print Activity Audit Section */}
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-3xl border border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={shopAuditSearch}
                  onChange={(e) => setShopAuditSearch(e.target.value)}
                  placeholder="Search file name, printer, status..."
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-10 pr-4 py-2.5 rounded-2xl focus:outline-none focus:border-blue-500 transition placeholder:text-slate-600"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setShopAuditColorFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      shopAuditColorFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All Modes
                  </button>
                  <button
                    onClick={() => setShopAuditColorFilter('bw')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      shopAuditColorFilter === 'bw' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    B&W
                  </button>
                  <button
                    onClick={() => setShopAuditColorFilter('color')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      shopAuditColorFilter === 'color' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Color
                  </button>
                </div>

                <button
                  onClick={() => exportShopAuditsToCSV(selectedShop, filteredShopAudits)}
                  disabled={filteredShopAudits.length === 0}
                  className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold transition shadow-lg shadow-emerald-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Audit CSV</span>
                </button>
              </div>
            </div>

            {/* Print History Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4 text-blue-400" />
                  <h3 className="font-extrabold text-sm text-white tracking-wide uppercase">Shop Printing Activity Log</h3>
                </div>
                <span className="text-xs text-slate-400 font-bold">{filteredShopAudits.length} recorded print jobs</span>
              </div>

              {loadingAudits ? (
                <div className="p-16 text-center">
                  <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <span className="text-xs text-slate-400 font-bold">Loading print audit log...</span>
                </div>
              ) : filteredShopAudits.length === 0 ? (
                <div className="p-16 text-center text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-bold text-slate-400">No print jobs match your search.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-6">Date & Time</th>
                        <th className="py-3.5 px-4">File Name</th>
                        <th className="py-3.5 px-3 text-right">Pages Output</th>
                        <th className="py-3.5 px-4">Print Configuration</th>
                        <th className="py-3.5 px-4 text-right">Amount Billed</th>
                        <th className="py-3.5 px-4">Hardware Printer</th>
                        <th className="py-3.5 px-6 text-right">Job Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {filteredShopAudits.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-4 px-6 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                            {new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
                            <span className="text-slate-500">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </td>

                          <td className="py-4 px-4 font-bold text-white">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                              <span className="truncate max-w-[240px]">{item.file_name}</span>
                            </div>
                          </td>

                          <td className="py-4 px-3 text-right">
                            <div className="font-black text-white text-sm">
                              {Math.max(1, item.pages || 1) * Math.max(1, item.copies || 1)} <span className="text-[10px] text-slate-500 font-normal">pgs</span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {item.pages}p × {item.copies}c
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-1.5">
                              {item.color ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                  Color
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                                  B&W Grayscale
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500 font-semibold">
                                {item.duplex ? 'Double-Sided' : 'Single-Sided'}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <span className="font-black text-emerald-400 text-sm">₹{item.amount}</span>
                          </td>

                          <td className="py-4 px-4 text-slate-400 text-[11px] truncate max-w-[160px]">
                            {item.printer_name || 'Standard Printer'}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                              {item.status || 'completed'}
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
        </main>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-black text-white">Remove Partner Shop?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to remove <strong className="text-white">{selectedShop.shop_name}</strong> from the platform?
                </p>
                <p className="text-[11px] text-red-400 mt-2">
                  This will deactivate the counter QR link and remove the shop registration.
                </p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteShop(selectedShop)}
                  disabled={actionLoading}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs transition flex justify-center items-center shadow-lg shadow-red-600/30"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Confirm Remove'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // 3. MAIN SUPER-ADMIN OVERVIEW DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="PrintBolt" className="w-8 h-8 rounded-lg object-contain" />
              <div>
                <span className="font-black text-lg tracking-tight text-white block leading-none">PrintBolt</span>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Platform Operations</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="hidden sm:flex items-center space-x-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 ml-4">
              <button
                onClick={() => setActiveTab('shops')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'shops' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Partner Shops ({shops.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'history' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>All Print History ({globalAudits.length})</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="truncate max-w-[180px]">{currentAdminUser.email}</span>
            </div>

            {activeTab === 'shops' ? (
              <button
                onClick={handleExportCSV}
                className="hidden sm:flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Summary CSV</span>
              </button>
            ) : (
              <button
                onClick={() => exportAllAuditsToCSV(filteredGlobalAudits)}
                className="hidden sm:flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Print History CSV</span>
              </button>
            )}

            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800 transition"
              title="Sign Out Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex sm:hidden border-t border-slate-800 bg-slate-950 p-1">
          <button
            onClick={() => setActiveTab('shops')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 ${
              activeTab === 'shops' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Partner Shops</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 ${
              activeTab === 'history' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>All Print History</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Dynamic Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Partner Shops & Live PC Heartbeats */}
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
            <div className="text-xs font-semibold text-emerald-400 mt-1 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{metrics?.onlineShopsCount || 0} PC App Online</span>
              {metrics?.pausedShopsCount ? (
                <span className="text-amber-400 font-bold ml-1">({metrics.pausedShopsCount} paused)</span>
              ) : null}
            </div>
          </div>

          {/* Card 2: Volume in Timeframe */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{activeStats.label}</span>
              <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-2xl">
                <Printer className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {activeStats.pages.toLocaleString()} <span className="text-sm text-slate-500 font-semibold">pgs</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Across <span className="text-white font-bold">{activeStats.jobs}</span> print orders
            </div>
          </div>

          {/* Card 3: Revenue in Timeframe */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Revenue ({timeframe})</span>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              ₹{activeStats.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              All-Time: <span className="text-white font-bold">₹{metrics?.totalRevenue || 0}</span>
            </div>
          </div>

          {/* Card 4: All-Time Total Output */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Recorded Prints</span>
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {(metrics?.totalPages || 0).toLocaleString()} <span className="text-sm text-slate-500 font-semibold">pgs</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              <span className="text-slate-300 font-bold">{metrics?.totalBwPages || 0}</span> B&W • <span className="text-purple-400 font-bold">{metrics?.totalColorPages || 0}</span> Color
            </div>
          </div>
        </div>

        {/* TAB 1: PARTNER SHOPS DIRECTORY & CONTROLS */}
        {activeTab === 'shops' && (
          <div className="space-y-6">
            {/* Timeframe Selector Pill Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-300 px-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Filter Metrics By Timeframe:</span>
              </div>

              <div className="flex items-center space-x-1.5 w-full sm:w-auto bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setTimeframe('today')}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    timeframe === 'today' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setTimeframe('weekly')}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    timeframe === 'weekly' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Weekly (7d)
                </button>
                <button
                  onClick={() => setTimeframe('monthly')}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    timeframe === 'monthly' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly (30d)
                </button>
                <button
                  onClick={() => setTimeframe('all')}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    timeframe === 'all' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All-Time
                </button>
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
                  placeholder="Search by shop name, ID, owner email, phone..."
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-10 pr-4 py-2.5 rounded-2xl focus:outline-none focus:border-blue-500 transition placeholder:text-slate-600"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    statusFilter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  All ({shops.length})
                </button>
                <button
                  onClick={() => setStatusFilter('online')}
                  className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                    statusFilter === 'online' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Online</span>
                </button>
                <button
                  onClick={() => setStatusFilter('offline')}
                  className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    statusFilter === 'offline' 
                      ? 'bg-slate-700 text-white' 
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Offline
                </button>
                <button
                  onClick={() => setStatusFilter('paused')}
                  className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    statusFilter === 'paused' 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Paused
                </button>
              </div>
            </div>

            {/* Partner Shops Directory Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-white tracking-wide uppercase">Partner Shops Directory</h3>
                <span className="text-xs text-slate-400 font-bold">{filteredShops.length} shops found</span>
              </div>

              {loading ? (
                <div className="p-16 text-center">
                  <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <span className="text-xs text-slate-400 font-bold">Loading partner shops activity...</span>
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
                        <th className="py-3.5 px-4">Live Status</th>
                        <th className="py-3.5 px-4 text-right">
                          {timeframe === 'today' ? "Today's Volume" : timeframe === 'weekly' ? "Weekly Volume" : timeframe === 'monthly' ? "Monthly Volume" : "Total Volume"}
                        </th>
                        <th className="py-3.5 px-4 text-right">Revenue ({timeframe})</th>
                        <th className="py-3.5 px-4">Shop Rates (View Only)</th>
                        <th className="py-3.5 px-6 text-right">Audit & Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {filteredShops.map((shop) => {
                        const shopPages = timeframe === 'today' ? shop.today_pages : timeframe === 'weekly' ? shop.weekly_pages : timeframe === 'monthly' ? shop.monthly_pages : shop.total_pages;
                        const shopRev = timeframe === 'today' ? shop.today_revenue : timeframe === 'weekly' ? shop.weekly_revenue : timeframe === 'monthly' ? shop.monthly_revenue : shop.total_revenue;
                        const shopOrders = timeframe === 'today' ? shop.today_jobs : timeframe === 'weekly' ? shop.weekly_jobs : timeframe === 'monthly' ? shop.monthly_jobs : shop.total_jobs;

                        return (
                          <tr 
                            key={shop.user_id} 
                            onClick={() => handleSelectShop(shop)}
                            className="hover:bg-slate-800/40 transition cursor-pointer group"
                          >
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
                                    <span>{shop.email || shop.owner_name || 'No email registered'}</span>
                                    <span className="text-slate-600">•</span>
                                    <span className="font-mono text-[10px] text-slate-500">ID: {shop.user_id.substring(0, 8)}...</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              <div className="flex flex-col space-y-1">
                                {shop.is_paused ? (
                                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 w-max">
                                    <PauseCircle className="w-3 h-3" />
                                    <span>Service Paused</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-max">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Service Active</span>
                                  </span>
                                )}

                                <span className="text-[10px] font-bold flex items-center space-x-1 text-slate-400">
                                  {shop.is_online ? (
                                    <>
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                      <span className="text-emerald-400 font-bold">PC App Online</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                      <span>PC App Closed</span>
                                    </>
                                  )}
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-4 text-right">
                              <div className="font-black text-white text-sm">
                                {shopPages} <span className="text-[10px] font-semibold text-slate-400">pgs</span>
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {shopOrders} orders
                              </div>
                            </td>

                            <td className="py-4 px-4 text-right">
                              <div className="font-black text-emerald-400 text-sm">
                                ₹{shopRev.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                All-Time: ₹{shop.total_revenue}
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              <div className="text-[11px] text-slate-300 font-semibold">
                                B&W: <span className="text-white font-bold">₹{shop.bw_price}</span> • Color: <span className="text-purple-300 font-bold">₹{shop.color_price}</span>
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Duplex: ₹{shop.duplex_price}
                              </div>
                            </td>

                            <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => handleSelectShop(shop)}
                                  className="px-2.5 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                                  title="Open Full-Page Printing Audit"
                                >
                                  <FileSpreadsheet className="w-3.5 h-3.5" />
                                  <span>View Audit</span>
                                </button>

                                <button
                                  onClick={(e) => handleTogglePause(shop, e)}
                                  disabled={actionLoading}
                                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                                    shop.is_paused 
                                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30' 
                                      : 'bg-amber-600/20 text-amber-400 border border-amber-500/30 hover:bg-amber-600/30'
                                  }`}
                                  title={shop.is_paused ? "Resume Customer Order Intake" : "Pause Customer Order Intake"}
                                >
                                  {shop.is_paused ? (
                                    <>
                                      <PlayCircle className="w-3.5 h-3.5" />
                                      <span>Resume</span>
                                    </>
                                  ) : (
                                    <>
                                      <PauseCircle className="w-3.5 h-3.5" />
                                      <span>Pause</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  onClick={(e) => handleCopy(`https://printbolt.store/p?shopId=${shop.user_id}`, shop.user_id, e)}
                                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                                  title="Copy Customer Counter Link"
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GLOBAL PRINT HISTORY (ALL SHOPKEEPERS) */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-3xl border border-slate-800">
              <div className="relative w-full lg:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  placeholder="Search file name, printer, shop..."
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-10 pr-4 py-2.5 rounded-2xl focus:outline-none focus:border-blue-500 transition placeholder:text-slate-600"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800 text-xs">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={historyShopFilter}
                    onChange={(e) => setHistoryShopFilter(e.target.value)}
                    className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-slate-900 text-white">All Shops ({shops.length})</option>
                    {shops.map(s => (
                      <option key={s.user_id} value={s.user_id} className="bg-slate-900 text-white">
                        {s.shop_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setHistoryColorFilter('all')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      historyColorFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All Modes
                  </button>
                  <button
                    onClick={() => setHistoryColorFilter('bw')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      historyColorFilter === 'bw' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    B&W
                  </button>
                  <button
                    onClick={() => setHistoryColorFilter('color')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      historyColorFilter === 'color' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Color
                  </button>
                </div>

                <button
                  onClick={() => exportAllAuditsToCSV(filteredGlobalAudits)}
                  className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-2xl text-xs font-bold transition shadow-lg shadow-emerald-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4 text-blue-400" />
                  <h3 className="font-extrabold text-sm text-white tracking-wide uppercase">Platform Master Print History</h3>
                </div>
                <span className="text-xs text-slate-400 font-bold">{filteredGlobalAudits.length} recorded print jobs</span>
              </div>

              {filteredGlobalAudits.length === 0 ? (
                <div className="p-16 text-center text-slate-500">
                  <Printer className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-bold text-slate-400">No print records match your criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px] sticky top-0 z-10">
                      <tr>
                        <th className="py-3.5 px-6">Date & Time</th>
                        <th className="py-3.5 px-4">Partner Shop</th>
                        <th className="py-3.5 px-4">File Name</th>
                        <th className="py-3.5 px-3 text-right">Pages</th>
                        <th className="py-3.5 px-4">Mode & Duplex</th>
                        <th className="py-3.5 px-4 text-right">Amount</th>
                        <th className="py-3.5 px-4">Printer</th>
                        <th className="py-3.5 px-6 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {filteredGlobalAudits.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3.5 px-6 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                            {new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
                            <span className="text-slate-500">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-extrabold text-white block truncate max-w-[160px]">{item.shop_name}</span>
                            <span className="font-mono text-[9px] text-slate-500 block">ID: {item.user_id.substring(0, 8)}...</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-200 block truncate max-w-[180px]">{item.file_name}</span>
                          </td>

                          <td className="py-3.5 px-3 text-right">
                            <div className="font-black text-white">
                              {Math.max(1, item.pages || 1) * Math.max(1, item.copies || 1)} <span className="text-[10px] text-slate-500 font-normal">pgs</span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {item.pages}p × {item.copies}c
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-1.5">
                              {item.color ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                  Color
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                                  B&W
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500">
                                {item.duplex ? '2-Sided' : '1-Sided'}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <span className="font-black text-emerald-400 text-sm">₹{item.amount}</span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-400 text-[11px] truncate max-w-[140px]">
                            {item.printer_name || 'Standard Printer'}
                          </td>

                          <td className="py-3.5 px-6 text-right">
                            <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              {item.status || 'completed'}
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
        )}
      </main>
    </div>
  );
}
