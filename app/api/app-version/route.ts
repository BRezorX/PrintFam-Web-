import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.39',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.39 - Super-Admin operational management: Strictly view-only rates/profiles, real-time Online/Offline status, Weekly/Monthly/Daily activity filters, Pause/Resume service controls, and per-shop activity CSV downloads.',
    mandatory: false,
  });
}