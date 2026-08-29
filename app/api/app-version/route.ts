import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.12',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.12 - Fix static initialization in SecureStorage for Forgot Password panel and ensure reliable OTP dispatch.',
    mandatory: false,
  });
}