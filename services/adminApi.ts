import { createClient } from '@supabase/supabase-js';

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (!isDemoMode && supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface ShopSummary {
  user_id: string;
  shop_name: string;
  owner_name?: string;
  email?: string;
  phone?: string;
  bw_price: number;
  color_price: number;
  duplex_price: number;
  discount_rules?: any;
  qr_data?: string;
  created_at?: string;
  is_active: boolean;
  is_paused: boolean;
  last_seen_at?: string;
  is_online: boolean;
  
  // All-Time
  total_jobs: number;
  total_pages: number;
  total_bw_pages: number;
  total_color_pages: number;
  total_revenue: number;
  
  // Today
  today_jobs: number;
  today_pages: number;
  today_revenue: number;

  // Weekly (Last 7 Days)
  weekly_jobs: number;
  weekly_pages: number;
  weekly_revenue: number;

  // Monthly (Last 30 Days)
  monthly_jobs: number;
  monthly_pages: number;
  monthly_revenue: number;

  last_activity?: string;
}

export interface PlatformMetrics {
  totalShops: number;
  onlineShopsCount: number;
  activeShopsCount: number;
  pausedShopsCount: number;
  
  // All-Time
  totalJobs: number;
  totalPages: number;
  totalBwPages: number;
  totalColorPages: number;
  totalRevenue: number;

  // Today
  todayJobs: number;
  todayPages: number;
  todayRevenue: number;

  // Weekly
  weeklyJobs: number;
  weeklyPages: number;
  weeklyRevenue: number;

  // Monthly
  monthlyJobs: number;
  monthlyPages: number;
  monthlyRevenue: number;
}

export interface PrintAuditEntry {
  id: string;
  user_id: string;
  file_name: string;
  pages: number;
  copies: number;
  color: boolean;
  duplex: boolean;
  amount: number;
  status: string;
  printer_name?: string;
  created_at: string;
  selected_pages?: string;
}

// ==========================================
// SUPER-ADMIN AUTHENTICATION & SINGLETON LOGIC
// ==========================================

export interface AdminStatus {
  hasAdmin: boolean;
  adminEmail?: string;
}

/**
 * Checks whether an admin account has already been claimed / initialized.
 */
export async function checkAdminStatus(): Promise<AdminStatus> {
  if (isDemoMode || !supabase) {
    const localClaimed = typeof window !== 'undefined' ? localStorage.getItem('printbolt_mock_admin_claimed') : null;
    return {
      hasAdmin: localClaimed === 'true',
      adminEmail: localClaimed === 'true' ? 'admin@printbolt.store' : undefined
    };
  }

  try {
    const { data, error } = await supabase
      .from('platform_admin')
      .select('email')
      .limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
      return {
        hasAdmin: true,
        adminEmail: data[0].email
      };
    }

    return { hasAdmin: false };
  } catch (err) {
    console.error("adminApi: checkAdminStatus error", err);
    return { hasAdmin: false };
  }
}

/**
 * Registers the one and only Super-Admin account (only possible when hasAdmin == false).
 */
export async function registerInitialAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode || !supabase) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('printbolt_mock_admin_claimed', 'true');
      localStorage.setItem('printbolt_mock_admin_email', email);
    }
    return { success: true };
  }

  try {
    // 1. Double-check that no admin exists
    const status = await checkAdminStatus();
    if (status.hasAdmin) {
      return { success: false, error: "An admin account already exists. Only one admin is permitted." };
    }

    // 2. Sign up via Supabase Auth
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/admin` : 'https://printbolt.store/admin'
      }
    });

    if (authErr) {
      return { success: false, error: authErr.message };
    }

    if (!authData.user) {
      return { success: false, error: "Failed to create user." };
    }

    // 3. Record in platform_admin singleton table
    const { error: insertErr } = await supabase
      .from('platform_admin')
      .insert({
        email: email.trim().toLowerCase(),
        user_id: authData.user.id
      });

    if (insertErr) {
      return { success: false, error: "Failed to initialize platform admin record: " + insertErr.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Registration failed." };
  }
}

/**
 * Logs in the verified Super-Admin.
 */
export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; error?: string; user?: any }> {
  if (isDemoMode || !supabase) {
    return { success: true, user: { email } };
  }

  try {
    const status = await checkAdminStatus();
    if (!status.hasAdmin) {
      return { success: false, error: "No admin account is registered yet. Please create the initial admin account." };
    }

    if (status.adminEmail && status.adminEmail.toLowerCase() !== email.trim().toLowerCase()) {
      return { success: false, error: "Access denied. Only the registered platform admin can log in." };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err?.message || "Login failed." };
  }
}

/**
 * Requests a password reset email for the verified admin.
 */
export async function sendAdminPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode || !supabase) {
    return { success: true };
  }

  try {
    const status = await checkAdminStatus();
    if (!status.hasAdmin || (status.adminEmail && status.adminEmail.toLowerCase() !== email.trim().toLowerCase())) {
      return { success: false, error: "This email is not registered as the platform admin." };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/admin?mode=reset` : 'https://printbolt.store/admin?mode=reset'
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Password reset failed." };
  }
}

/**
 * Updates the admin's password (used when following a reset link).
 */
export async function updateAdminPassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode || !supabase) {
    return { success: true };
  }

  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update password." };
  }
}

/**
 * Checks if the current session belongs to the verified Super-Admin.
 */
export async function getVerifiedAdminUser(): Promise<any | null> {
  if (isDemoMode || !supabase) {
    if (typeof window !== 'undefined' && sessionStorage.getItem('printbolt_mock_admin_logged') === 'true') {
      return { email: 'admin@printbolt.store' };
    }
    return null;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) return null;

    const status = await checkAdminStatus();
    if (!status.hasAdmin || !status.adminEmail) return null;

    if (session.user.email?.toLowerCase() === status.adminEmail.toLowerCase()) {
      return session.user;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Signs out the admin session.
 */
export async function logoutAdmin(): Promise<void> {
  if (isDemoMode || !supabase) {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('printbolt_mock_admin_logged');
    }
    return;
  }

  try {
    await supabase.auth.signOut();
  } catch {}
}

// ==========================================
// DATA & ACTIVITY METRICS
// ==========================================

/**
 * Fetches all shops with real-time status and weekly/monthly activity.
 */
export async function getAllShopsWithMetrics(): Promise<{ shops: ShopSummary[]; metrics: PlatformMetrics }> {
  if (isDemoMode || !supabase) {
    const now = Date.now();
    const mockShops: ShopSummary[] = [
      {
        user_id: "aae78ccf-4e27-4b11-b6fb-d4c84c919ad7",
        shop_name: "PrintBolt Flagship Express",
        owner_name: "Rahul Sharma",
        email: "rahul@printbolt.store",
        phone: "+91 98765 43210",
        bw_price: 2.0,
        color_price: 10.0,
        duplex_price: 1.5,
        is_active: true,
        is_paused: false,
        last_seen_at: new Date(now - 2 * 60000).toISOString(),
        is_online: true,
        created_at: "2026-08-01T10:00:00Z",
        total_jobs: 142,
        total_pages: 580,
        total_bw_pages: 460,
        total_color_pages: 120,
        total_revenue: 2120,
        today_jobs: 14,
        today_pages: 62,
        today_revenue: 245,
        weekly_jobs: 84,
        weekly_pages: 360,
        weekly_revenue: 1350,
        monthly_jobs: 142,
        monthly_pages: 580,
        monthly_revenue: 2120,
        last_activity: new Date(now - 2 * 60000).toISOString()
      },
      {
        user_id: "b7e21a44-8833-4f91-99cc-11aa22bb33cc",
        shop_name: "Campus Xerox & Digital Hub",
        owner_name: "Priya Patel",
        email: "priya@campusprint.in",
        phone: "+91 91234 56789",
        bw_price: 1.5,
        color_price: 8.0,
        duplex_price: 1.0,
        is_active: true,
        is_paused: false,
        last_seen_at: new Date(now - 45 * 60000).toISOString(),
        is_online: false,
        created_at: "2026-08-15T12:00:00Z",
        total_jobs: 89,
        total_pages: 410,
        total_bw_pages: 350,
        total_color_pages: 60,
        total_revenue: 1105,
        today_jobs: 8,
        today_pages: 35,
        today_revenue: 95,
        weekly_jobs: 48,
        weekly_pages: 210,
        weekly_revenue: 590,
        monthly_jobs: 89,
        monthly_pages: 410,
        monthly_revenue: 1105,
        last_activity: new Date(now - 45 * 60000).toISOString()
      }
    ];

    const metrics: PlatformMetrics = {
      totalShops: mockShops.length,
      onlineShopsCount: mockShops.filter(s => s.is_online).length,
      activeShopsCount: mockShops.filter(s => s.is_active && !s.is_paused).length,
      pausedShopsCount: mockShops.filter(s => s.is_paused).length,
      totalJobs: mockShops.reduce((a, b) => a + b.total_jobs, 0),
      totalPages: mockShops.reduce((a, b) => a + b.total_pages, 0),
      totalBwPages: mockShops.reduce((a, b) => a + b.total_bw_pages, 0),
      totalColorPages: mockShops.reduce((a, b) => a + b.total_color_pages, 0),
      totalRevenue: mockShops.reduce((a, b) => a + b.total_revenue, 0),
      todayJobs: mockShops.reduce((a, b) => a + b.today_jobs, 0),
      todayPages: mockShops.reduce((a, b) => a + b.today_pages, 0),
      todayRevenue: mockShops.reduce((a, b) => a + b.today_revenue, 0),
      weeklyJobs: mockShops.reduce((a, b) => a + b.weekly_jobs, 0),
      weeklyPages: mockShops.reduce((a, b) => a + b.weekly_pages, 0),
      weeklyRevenue: mockShops.reduce((a, b) => a + b.weekly_revenue, 0),
      monthlyJobs: mockShops.reduce((a, b) => a + b.monthly_jobs, 0),
      monthlyPages: mockShops.reduce((a, b) => a + b.monthly_pages, 0),
      monthlyRevenue: mockShops.reduce((a, b) => a + b.monthly_revenue, 0),
    };

    return { shops: mockShops, metrics };
  }

  try {
    // 1. Fetch shops via RPC or fallback
    let rawShops: any[] = [];
    const { data: rpcShops, error: rpcErr } = await supabase.rpc('get_all_shops_for_admin');

    if (!rpcErr && rpcShops && Array.isArray(rpcShops)) {
      rawShops = rpcShops;
    } else {
      const { data: directShops } = await supabase.from('shop_settings').select('*');
      rawShops = directShops || [];
    }

    // 2. Fetch all print audits
    const { data: auditsData } = await supabase.from('print_audits').select('*');
    const audits: PrintAuditEntry[] = auditsData || [];

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const tenMinutesAgo = now - 10 * 60 * 1000; // Online heartbeat threshold

    const shops: ShopSummary[] = rawShops.map((shop: any) => {
      const shopAudits = audits.filter(a => a.user_id === shop.user_id);
      
      // Determine real-time Online/Offline status
      let lastActivityTime = shop.last_seen_at ? new Date(shop.last_seen_at).getTime() : 0;
      if (shopAudits[0]?.created_at) {
        const auditTime = new Date(shopAudits[0].created_at).getTime();
        if (auditTime > lastActivityTime) lastActivityTime = auditTime;
      }
      const isOnline = lastActivityTime >= tenMinutesAgo;

      let total_bw_pages = 0;
      let total_color_pages = 0;
      let total_pages = 0;
      let total_revenue = 0;

      let today_jobs = 0;
      let today_pages = 0;
      let today_revenue = 0;

      let weekly_jobs = 0;
      let weekly_pages = 0;
      let weekly_revenue = 0;

      let monthly_jobs = 0;
      let monthly_pages = 0;
      let monthly_revenue = 0;

      shopAudits.forEach(a => {
        const count = Math.max(1, a.pages || 1) * Math.max(1, a.copies || 1);
        const amount = Number(a.amount || 0);
        const auditTimestamp = new Date(a.created_at).getTime();

        total_pages += count;
        if (a.color) {
          total_color_pages += count;
        } else {
          total_bw_pages += count;
        }
        total_revenue += amount;

        // Today
        if (auditTimestamp >= oneDayAgo) {
          today_jobs++;
          today_pages += count;
          today_revenue += amount;
        }

        // Weekly
        if (auditTimestamp >= sevenDaysAgo) {
          weekly_jobs++;
          weekly_pages += count;
          weekly_revenue += amount;
        }

        // Monthly
        if (auditTimestamp >= thirtyDaysAgo) {
          monthly_jobs++;
          monthly_pages += count;
          monthly_revenue += amount;
        }
      });

      return {
        user_id: shop.user_id,
        shop_name: shop.shop_name || "Unnamed Shop",
        owner_name: shop.owner_name || shop.name || "",
        email: shop.email || "",
        phone: shop.phone || "",
        bw_price: Number(shop.bw_price || 2.0),
        color_price: Number(shop.color_price || 10.0),
        duplex_price: Number(shop.duplex_price || 1.0),
        discount_rules: shop.discount_rules,
        qr_data: shop.qr_data || `https://printbolt.store/p?shopId=${shop.user_id}`,
        created_at: shop.created_at,
        is_active: shop.is_active !== false,
        is_paused: shop.is_paused === true,
        last_seen_at: lastActivityTime > 0 ? new Date(lastActivityTime).toISOString() : shop.created_at,
        is_online: isOnline,
        total_jobs: shopAudits.length,
        total_pages,
        total_bw_pages,
        total_color_pages,
        total_revenue,
        today_jobs,
        today_pages,
        today_revenue,
        weekly_jobs,
        weekly_pages,
        weekly_revenue,
        monthly_jobs,
        monthly_pages,
        monthly_revenue,
        last_activity: lastActivityTime > 0 ? new Date(lastActivityTime).toISOString() : shop.created_at
      };
    });

    const metrics: PlatformMetrics = {
      totalShops: shops.length,
      onlineShopsCount: shops.filter(s => s.is_online).length,
      activeShopsCount: shops.filter(s => s.is_active && !s.is_paused).length,
      pausedShopsCount: shops.filter(s => s.is_paused).length,
      totalJobs: audits.length,
      totalPages: shops.reduce((a, b) => a + b.total_pages, 0),
      totalBwPages: shops.reduce((a, b) => a + b.total_bw_pages, 0),
      totalColorPages: shops.reduce((a, b) => a + b.total_color_pages, 0),
      totalRevenue: shops.reduce((a, b) => a + b.total_revenue, 0),
      todayJobs: shops.reduce((a, b) => a + b.today_jobs, 0),
      todayPages: shops.reduce((a, b) => a + b.today_pages, 0),
      todayRevenue: shops.reduce((a, b) => a + b.today_revenue, 0),
      weeklyJobs: shops.reduce((a, b) => a + b.weekly_jobs, 0),
      weeklyPages: shops.reduce((a, b) => a + b.weekly_pages, 0),
      weeklyRevenue: shops.reduce((a, b) => a + b.weekly_revenue, 0),
      monthlyJobs: shops.reduce((a, b) => a + b.monthly_jobs, 0),
      monthlyPages: shops.reduce((a, b) => a + b.monthly_pages, 0),
      monthlyRevenue: shops.reduce((a, b) => a + b.monthly_revenue, 0),
    };

    return { shops, metrics };
  } catch (error) {
    console.error("adminApi: getAllShopsWithMetrics failed", error);
    return {
      shops: [],
      metrics: {
        totalShops: 0,
        onlineShopsCount: 0,
        activeShopsCount: 0,
        pausedShopsCount: 0,
        totalJobs: 0,
        totalPages: 0,
        totalBwPages: 0,
        totalColorPages: 0,
        totalRevenue: 0,
        todayJobs: 0,
        todayPages: 0,
        todayRevenue: 0,
        weeklyJobs: 0,
        weeklyPages: 0,
        weeklyRevenue: 0,
        monthlyJobs: 0,
        monthlyPages: 0,
        monthlyRevenue: 0,
      }
    };
  }
}

/**
 * Fetches recent audit print logs for a specific shop.
 */
export async function getShopAuditLogs(shopId: string): Promise<PrintAuditEntry[]> {
  if (isDemoMode || !supabase) {
    return [
      {
        id: "audit_101",
        user_id: shopId,
        file_name: "Project_Report_Final.pdf",
        pages: 14,
        copies: 1,
        color: false,
        duplex: true,
        amount: 28.0,
        status: "completed",
        printer_name: "HP LaserJet Pro MFP",
        created_at: new Date(Date.now() - 15 * 60000).toISOString()
      },
      {
        id: "audit_102",
        user_id: shopId,
        file_name: "Presentation_Slides.pptx",
        pages: 8,
        copies: 2,
        color: true,
        duplex: false,
        amount: 160.0,
        status: "completed",
        printer_name: "Epson L8050 Color",
        created_at: new Date(Date.now() - 45 * 60000).toISOString()
      }
    ];
  }

  try {
    const { data, error } = await supabase
      .from('print_audits')
      .select('*')
      .eq('user_id', shopId)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("adminApi: getShopAuditLogs failed", error);
    throw error;
  }
}

/**
 * Toggles a shop's service pause state (Pause / Resume Service).
 */
export async function toggleShopPause(shopId: string, isPaused: boolean): Promise<boolean> {
  if (isDemoMode || !supabase) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('shop_settings')
      .update({ is_paused: isPaused })
      .eq('user_id', shopId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("adminApi: toggleShopPause failed", error);
    throw error;
  }
}

/**
 * Permanently removes / deletes a shop from the platform.
 */
export async function deleteShop(shopId: string): Promise<boolean> {
  if (isDemoMode || !supabase) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('shop_settings')
      .delete()
      .eq('user_id', shopId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("adminApi: deleteShop failed", error);
    throw error;
  }
}

/**
 * Exports single shop's complete print audit log to a CSV file.
 */
export function exportShopAuditsToCSV(shop: ShopSummary, audits: PrintAuditEntry[]): void {
  if (!shop || audits.length === 0) return;

  const headers = ["Date & Time", "File Name", "Pages", "Copies", "Total Pages", "Print Mode", "Duplex", "Amount (₹)", "Status", "Printer"];

  const rows = audits.map(a => [
    `"${new Date(a.created_at).toLocaleString()}"`,
    `"${(a.file_name || '').replace(/"/g, '""')}"`,
    a.pages,
    a.copies,
    Math.max(1, a.pages || 1) * Math.max(1, a.copies || 1),
    a.color ? "Color" : "B&W",
    a.duplex ? "Double-Sided" : "Single-Sided",
    a.amount,
    a.status,
    `"${(a.printer_name || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `PrintBolt_${shop.shop_name.replace(/\s+/g, '_')}_Activity_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
