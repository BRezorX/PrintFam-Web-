import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.25',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.25 - Add PrintBolt Font Engine (Google Cloud Run / Firebase Gen 2 Free Tier) with full Microsoft TrueType and Windows fonts package for pixel-perfect Word and PPTX to PDF conversion.',
    mandatory: false,
  });
}