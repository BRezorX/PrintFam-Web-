import { createClient } from '@supabase/supabase-js';

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = (!isDemoMode && supabaseUrl && supabaseAnonKey)
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
  is_active?: boolean;
  total_jobs: number;
  total_pages: number;
  total_bw_pages: number;
  total_color_pages: number;
  total_revenue: number;
  today_jobs: number;
  today_pages: number;
  today_revenue: number;
  last_activity?: string;
}

export interface PlatformMetrics {
  totalShops: number;
  activeShopsCount: number;
  totalJobs: number;
  totalPages: number;
  totalBwPages: number;
  totalColorPages: number;
  totalRevenue: number;
  todayJobs: number;
  todayPages: number;
  todayRevenue: number;
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

/**
 * Fetches all shops with their aggregated metrics and print volume.
 */
export async function getAllShopsWithMetrics(): Promise<{ shops: ShopSummary[]; metrics: PlatformMetrics }> {
  if (isDemoMode || !supabase) {
    // Mock data for demo/local sandbox
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
        created_at: "2026-08-01T10:00:00Z",
        total_jobs: 142,
        total_pages: 580,
        total_bw_pages: 460,
        total_color_pages: 120,
        total_revenue: 2120,
        today_jobs: 14,
        today_pages: 62,
        today_revenue: 245,
        last_activity: new Date().toISOString()
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
        created_at: "2026-08-15T12:00:00Z",
        total_jobs: 89,
        total_pages: 410,
        total_bw_pages: 350,
        total_color_pages: 60,
        total_revenue: 1105,
        today_jobs: 8,
        today_pages: 35,
        today_revenue: 95,
        last_activity: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    const metrics: PlatformMetrics = {
      totalShops: mockShops.length,
      activeShopsCount: mockShops.filter(s => s.is_active).length,
      totalJobs: mockShops.reduce((a, b) => a + b.total_jobs, 0),
      totalPages: mockShops.reduce((a, b) => a + b.total_pages, 0),
      totalBwPages: mockShops.reduce((a, b) => a + b.total_bw_pages, 0),
      totalColorPages: mockShops.reduce((a, b) => a + b.total_color_pages, 0),
      totalRevenue: mockShops.reduce((a, b) => a + b.total_revenue, 0),
      todayJobs: mockShops.reduce((a, b) => a + b.today_jobs, 0),
      todayPages: mockShops.reduce((a, b) => a + b.today_pages, 0),
      todayRevenue: mockShops.reduce((a, b) => a + b.today_revenue, 0),
    };

    return { shops: mockShops, metrics };
  }

  try {
    // 1. Fetch all shops from shop_settings
    const { data: shopsData, error: shopsErr } = await supabase
      .from('shop_settings')
      .select('*')
      .order('created_at', { ascending: false });

    if (shopsErr) throw shopsErr;

    // 2. Fetch all print audits to calculate true volume & revenue
    const { data: auditsData, error: auditsErr } = await supabase
      .from('print_audits')
      .select('*')
      .order('created_at', { ascending: false });

    const audits: PrintAuditEntry[] = auditsData || [];

    const todayDateStr = new Date().toISOString().split('T')[0];

    const shops: ShopSummary[] = (shopsData || []).map((shop: any) => {
      const shopAudits = audits.filter(a => a.user_id === shop.user_id);
      const todayAudits = shopAudits.filter(a => (a.created_at || '').startsWith(todayDateStr));

      let total_bw_pages = 0;
      let total_color_pages = 0;
      let total_pages = 0;
      let total_revenue = 0;

      shopAudits.forEach(a => {
        const count = Math.max(1, a.pages || 1) * Math.max(1, a.copies || 1);
        total_pages += count;
        if (a.color) {
          total_color_pages += count;
        } else {
          total_bw_pages += count;
        }
        total_revenue += Number(a.amount || 0);
      });

      let today_pages = 0;
      let today_revenue = 0;
      todayAudits.forEach(a => {
        const count = Math.max(1, a.pages || 1) * Math.max(1, a.copies || 1);
        today_pages += count;
        today_revenue += Number(a.amount || 0);
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
        total_jobs: shopAudits.length,
        total_pages,
        total_bw_pages,
        total_color_pages,
        total_revenue,
        today_jobs: todayAudits.length,
        today_pages,
        today_revenue,
        last_activity: shopAudits[0]?.created_at || shop.created_at
      };
    });

    const metrics: PlatformMetrics = {
      totalShops: shops.length,
      activeShopsCount: shops.filter(s => s.is_active).length,
      totalJobs: audits.length,
      totalPages: shops.reduce((a, b) => a + b.total_pages, 0),
      totalBwPages: shops.reduce((a, b) => a + b.total_bw_pages, 0),
      totalColorPages: shops.reduce((a, b) => a + b.total_color_pages, 0),
      totalRevenue: shops.reduce((a, b) => a + b.total_revenue, 0),
      todayJobs: shops.reduce((a, b) => a + b.today_jobs, 0),
      todayPages: shops.reduce((a, b) => a + b.today_pages, 0),
      todayRevenue: shops.reduce((a, b) => a + b.today_revenue, 0),
    };

    return { shops, metrics };
  } catch (error) {
    console.error("adminApi: getAllShopsWithMetrics failed", error);
    throw error;
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
      .limit(100);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("adminApi: getShopAuditLogs failed", error);
    throw error;
  }
}

/**
 * Updates shop pricing and configuration.
 */
export async function updateShopSettings(shopId: string, updates: Partial<ShopSummary>): Promise<boolean> {
  if (isDemoMode || !supabase) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('shop_settings')
      .update({
        shop_name: updates.shop_name,
        bw_price: updates.bw_price,
        color_price: updates.color_price,
        duplex_price: updates.duplex_price,
        is_active: updates.is_active,
        discount_rules: updates.discount_rules
      })
      .eq('user_id', shopId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("adminApi: updateShopSettings failed", error);
    throw error;
  }
}
