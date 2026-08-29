import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.9',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.9 - Official branding: embed multi-resolution PrintBolt icon in executable binary, taskbar, system tray, window header, and browser favicon.',
    mandatory: false,
  });
}