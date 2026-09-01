import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.32',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.32 - Fix B&W / Color printing: Render true grayscale monochrome at the PDFium engine level with PdfRenderFlags.Grayscale so printer drivers never output color when B&W is selected.',
    mandatory: false,
  });
}