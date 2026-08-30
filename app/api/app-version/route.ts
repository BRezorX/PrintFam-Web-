import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.19',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.19 - Fix Hardware Health status sync: Dynamically bind queue manager diagnostics to configured primary printer so real-time status (Ready/Online) displays immediately.',
    mandatory: false,
  });
}