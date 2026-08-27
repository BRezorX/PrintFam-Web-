import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Edge-native HMAC-SHA256 calculator using the Web Crypto API
async function hmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  
  // Convert ArrayBuffer to hexadecimal string representation
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required signature verification parameters.' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!keySecret) {
      return NextResponse.json(
        { error: 'Razorpay Secret Key is not configured on the server.' },
        { status: 500 }
      );
    }

    // Verify payment signature
    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const generatedSignature = await hmacSha256(text, keySecret);

    if (generatedSignature === razorpay_signature) {
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully.'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Signature verification failed. Invalid payment signature.' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error verifying payment signature:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
