import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.6',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.6 - Enforce document lifecycle: retain failed/interrupted prints indefinitely until resolved, and delete printed PDFs from storage & database 5 minutes post-print.',
    mandatory: false,
  });
}