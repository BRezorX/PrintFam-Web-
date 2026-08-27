import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { amount, receipt } = await request.json();

    // Validate that amount is at least 100 paise (₹1.00)
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least 100 paise (₹1.00)' },
        { status: 400 }
      );
    }

    const keyId = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay API credentials are not configured on the server.' },
        { status: 500 }
      );
    }

    // Call Razorpay API using standard fetch (Edge compatible)
    const authString = btoa(`${keyId}:${keySecret}`);
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        currency: 'INR',
        receipt: receipt || `receipt_${Date.now()}`,
      }),
    });

    const orderData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: orderData.error?.description || 'Failed to create order on Razorpay.' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      order_id: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      key_id: keyId,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
