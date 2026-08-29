import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.8',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.8 - Zero-touch persistent auto-login via refresh token renewal, Remember Me support, email prefill, and password visibility toggle.',
    mandatory: false,
  });
}