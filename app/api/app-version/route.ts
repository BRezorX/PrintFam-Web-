import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.26',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.26 - Connect PrintBolt high-fidelity Font Engine (Render live service: https://printbolt-font-engine.onrender.com) for pixel-perfect Word & PPTX conversions with full Windows fonts.',
    mandatory: false,
  });
}