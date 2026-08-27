import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.1.0',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.1.0 - Added permanent transaction & print audit ledger, KPI revenue analytics, and CSV report export.',
    mandatory: false,
  });
}
