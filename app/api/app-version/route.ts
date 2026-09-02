import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.35',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.35 - Super-Admin Management Portal (/admin): Live platform analytics, partner shop directory, print volume breakdowns, per-shop audit logs, pricing management, and CSV export.',
    mandatory: false,
  });
}