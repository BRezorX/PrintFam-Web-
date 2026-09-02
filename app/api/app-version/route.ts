import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.37',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.37 - Super-Admin singleton authentication: Single admin claiming, email & password verification, persistent session login, forgot password flow, and permanent registration lock.',
    mandatory: false,
  });
}