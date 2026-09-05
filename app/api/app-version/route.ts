import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.43',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.43 - Revamped Home Page: Integrated modern full-suite PrintBoltHome landing experience with 3D device illustrations, interactive before/after comparison slider, live PC desktop app dashboard showcase, customer print simulator modal, ambient RGB lightning, and ROI calculator.',
    mandatory: false,
  });
}