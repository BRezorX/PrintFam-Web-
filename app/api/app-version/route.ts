import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.36',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.36 - Fix Cloudflare Pages build: Move icons to static public assets and remove dynamic app/icon.png route.',
    mandatory: false,
  });
}