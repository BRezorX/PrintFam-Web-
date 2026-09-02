import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.41',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.41 - Dedicated Full-Page Printing Audit Preview for Partner Shops: Expansive full-width layout, KPI analytics cards, document audit table with search/mode filters, and 1-click shop audit CSV exports.',
    mandatory: false,
  });
}