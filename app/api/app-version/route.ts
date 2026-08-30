import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.20',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.20 - 100% Standalone Single-File Executable: Embedded assemblies, native PDF rendering engine, and cloud configuration directly inside PrintShopAgent.exe. Can be shared directly as a single .exe file.',
    mandatory: false,
  });
}