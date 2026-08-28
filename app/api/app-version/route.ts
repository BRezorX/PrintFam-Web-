import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.1',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.1 - Public storage download fix, 1-tap direct UPI payment, live queue tracker & multi-printer auto-routing.',
    mandatory: false,
  });
}