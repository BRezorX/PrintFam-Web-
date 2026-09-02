import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    version: '1.4.42',
    downloadUrl: 'https://printbolt.store/downloads/PrintShopAgent.exe',
    releaseNotes: 'PrintBolt Agent v1.4.42 - Security Hardening: Moved Admin Dashboard to secret \'/ops-portal\' gateway, converted \'/admin\' into a standard 404 Not Found response, eliminated email leaks on the login screen, and protected database platform_admin RLS policies with zero-knowledge boolean RPC.',
    mandatory: false,
  });
}