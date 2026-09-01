import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.29',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.29 - Fix query parameter extraction for all URL variants (shopId, shop_id, shopid, s) on shop portal.',
    mandatory: false,
  });
}