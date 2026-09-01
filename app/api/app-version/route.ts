import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.33',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.33 - Multi-tier office document converter: Supports all versions of Microsoft Office (2007, 2010, 2013, 2016, 2019, 2021, 365) and automatic fallback to LibreOffice / OpenOffice headless.',
    mandatory: false,
  });
}