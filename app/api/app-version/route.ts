import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.40',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.40 - Live PC App online/offline heartbeat detection: 16s active heartbeat ping in background agent, immediate offline heartbeat on window close, and dedicated Global Print History tab in Admin Dashboard with multi-shop filtering & master CSV export.',
    mandatory: false,
  });
}