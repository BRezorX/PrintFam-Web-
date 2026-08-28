import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.3',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.3 - Custom page range printing: spool only customer-selected pages (e.g. Page 2 of 3) to prevent waste.',
    mandatory: false,
  });
}