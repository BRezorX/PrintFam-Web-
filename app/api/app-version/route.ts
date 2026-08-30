import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.17',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.17 - Dynamic Printer Preferences: Add/Delete printers, configure custom job routing (All, B&W, Color), set 2-Sided mode (Manual Flip vs Auto Hardware), with permanent local profile persistence so preferences never revert.',
    mandatory: false,
  });
}