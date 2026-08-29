import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.10',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.10 - Performance & reliability: zero unawaited tasks, global crash guards, capped manifest memory, and throttled background hardware diagnostics.',
    mandatory: false,
  });
}