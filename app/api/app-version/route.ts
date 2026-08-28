import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.2',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.2 - Permanent database retention for interrupted prints, persistent interrupted queue, and 1-click audit reprint recovery.',
    mandatory: false,
  });
}