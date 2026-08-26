import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    // Verify all required signature elements are present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required signature verification parameters.' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: 'Razorpay Secret Key is not configured on the server.' },
        { status: 500 }
      );
    }

    // Generate expected signature based on Razorpay standard verification:
    // HMAC-SHA256("order_id|payment_id", secret)
    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

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
