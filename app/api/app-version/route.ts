import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.34',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.34 - Update favicon, apple-touch-icon, and tab metadata to use the authentic PrintBolt logo icon.',
    mandatory: false,
  });
}