import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.11',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.11 - Auth security: duplicate account prevention, in-app Gmail OTP verification, and rate-limited password reset (max 3/day).',
    mandatory: false,
  });
}