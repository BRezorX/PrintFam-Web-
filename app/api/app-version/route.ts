import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.15',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.15 - Simplified order completion status page: Transaction Receipt card, Live Queue Tracker, and Done button.',
    mandatory: false,
  });
}