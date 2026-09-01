import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.31',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.31 - Visual slide and document previews: Client-side slide title, bullet points, background color, and embedded image extraction for PowerPoint (.pptx) and Word (.docx) files in the Customize Pages modal.',
    mandatory: false,
  });
}