import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.38',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.38 - Fix Admin Portal partner shops query: Add created_at/is_active columns to shop_settings, add super-admin RLS policies across all tables, and join auth.users emails via RPC.',
    mandatory: false,
  });
}