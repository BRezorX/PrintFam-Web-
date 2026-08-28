import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.0',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.0 - Live Daily Revenue & Paper Counter Widget, Smart Multi-Printer Auto-Routing (B&W Laser + Color InkTank), and Enhanced Audit Engine.',
    mandatory: false,
  });
}
