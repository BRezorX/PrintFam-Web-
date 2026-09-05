import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.44',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.44 - Brand Asset Update: Updated Navbar, Footer, and Dashboard Showcase brand logos to use the official PrintBolt favicon / logo asset.',
    mandatory: false,
  });
}