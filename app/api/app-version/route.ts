import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.45',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt v1.4.45 - Modern Dark Dashboard UI, renamed App to PrintBolt, optimized background services, and error-free runtime.',
    mandatory: false,
  });
}