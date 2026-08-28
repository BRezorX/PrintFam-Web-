import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.3.0',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.3.0 - Real-Time Hardware & Spooler Diagnostics (Out of Paper, Jam, Offline), Crash & Powercut Recovery Engine, 1-Click Reprint, Safe File Retention Guarantee & Audio/Tray Disruption Alerts.',
    mandatory: false,
  });
}
