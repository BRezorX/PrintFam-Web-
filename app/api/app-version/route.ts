import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.4',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.4 - Restore native PDFium high-definition print rendering engine with selective page support and rate-limited diagnostic alerts.',
    mandatory: false,
  });
}