import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.2.0',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.2.0 - Added custom B&W & Color tiered volume/bulk discounts in shop settings and dynamic web calculation.',
    mandatory: false,
  });
}
