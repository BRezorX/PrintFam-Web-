import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.23',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.23 - Redesign Home Landing Page to reflect PrintBolt Printing Ideology (Touchless Loop, 4 Core Pillars, Before vs After Matrix, and Standalone Desktop Agent Download).',
    mandatory: false,
  });
}