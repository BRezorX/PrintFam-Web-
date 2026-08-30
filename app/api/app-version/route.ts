import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.16',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.16 - Smart Double-Sided (Duplex) printing: Segmented Single/Double UI toggle, automatic hardware duplex support, manual duplex paper-flip pause & resume workflow with audible alerts.',
    mandatory: false,
  });
}