import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.27',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.27 - Fix automatic session JWT token refresh in Desktop Agent polling loop so print jobs are processed continuously without 1-hour expiration stalls.',
    mandatory: false,
  });
}