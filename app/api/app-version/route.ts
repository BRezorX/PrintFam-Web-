import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.28',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.28 - Native Windows Shopkeeper-Side Document Conversion: Reverted cloud converters and implemented Microsoft Office (Word & PowerPoint) COM native conversion and printing in Desktop Agent for 100% authentic typography and layout fidelity.',
    mandatory: false,
  });
}