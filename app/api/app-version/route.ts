import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.5',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.5 - Enforce paid page count hard ceiling and exact custom page selection to eliminate accidental overprinting.',
    mandatory: false,
  });
}