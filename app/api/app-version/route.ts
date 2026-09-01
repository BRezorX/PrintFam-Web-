import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.30',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.30 - Fix Office document page/slide extraction with JSZip and ensure Color/B&W is enforced across QueryPageSettings and GDI spooling.',
    mandatory: false,
  });
}