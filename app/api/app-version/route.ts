import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.21',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.21 - Optimize standalone single-file binary size: GZip-compressed embedded native PDF rendering engines (size reduced from 29.8MB to 14.5MB), perfectly within Cloudflare Pages 25MB limit.',
    mandatory: false,
  });
}