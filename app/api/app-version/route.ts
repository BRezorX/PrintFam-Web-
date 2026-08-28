import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.7',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.7 - Audit ledger UI: restrict reprint action exclusively to interrupted jobs and display \'Printed\' badge for completed jobs.',
    mandatory: false,
  });
}