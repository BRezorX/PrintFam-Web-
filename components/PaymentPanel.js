import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, AlertTriangle, Loader2, ArrowLeft, Smartphone, ShieldCheck } from 'lucide-react';

// Dynamically inject Razorpay Checkout JS SDK into the document body on demand
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentPanel({ amount, onPaymentSuccess, onPaymentCancel, jobId }) {
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Load saved customer phone from localStorage on mount
  useEffect(() => {
    try {
      const savedPhone = localStorage.getItem('pb_customer_phone');
      if (savedPhone && savedPhone.length === 10) {
        setPhone(savedPhone);
      }
    } catch { }
  }, []);

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    if (phoneError) setPhoneError('');
  };

  const handleRazorpayPayment = async () => {
    // Validate phone number natively
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number to proceed.');
      return;
    }

    try {
      localStorage.setItem('pb_customer_phone', cleanPhone);
    } catch { }

    setLoadingCheckout(true);
    setErrorMsg('');
    setPhoneError('');
    
    try {
      // 1. Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Failed to load Razorpay Checkout SDK. Please check your internet connection.");
      }

      // 2. Call create-order API (amount must be in paise)
      const amountInPaise = Math.round(amount * 100);
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          receipt: jobId || `receipt_${Date.now()}`
        }),
      });
      
      const orderData = await response.json();
      if (!response.ok) {
        throw new Error(orderData.error || "Failed to generate payment transaction ID.");
      }

      // 3. Build Razorpay Standard checkout configurations
      const options = {
        key: orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PrintBolt Kiosk",
        description: "Self-Service Document Printing",
        order_id: orderData.order_id,
        handler: async function (rzpResponse) {
          // Payment captured on client - forward authorization parameters for signature verification
          setPaymentStatus('processing');
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: rzpResponse.razorpay_order_id,
                razorpay_payment_id: rzpResponse.razorpay_payment_id,
                razorpay_signature: rzpResponse.razorpay_signature,
              }),
            });
            
            const verifyResult = await verifyResponse.json();
            if (verifyResponse.ok && verifyResult.success) {
              setPaymentStatus('success');
              setTimeout(() => {
                if (onPaymentSuccess) onPaymentSuccess();
              }, 1500);
            } else {
              throw new Error(verifyResult.error || "Transaction signature verification failed.");
            }
          } catch (verifyErr) {
            console.error("Signature verification failed:", verifyErr);
            setErrorMsg(verifyErr.message || "We could not verify your payment transaction status.");
            setPaymentStatus('failed');
          } finally {
            setLoadingCheckout(false);
          }
        },
        prefill: {
          name: "Print Customer",
          email: "customer@printbolt.store",
          contact: `+91${cleanPhone}`,
          method: "upi",
        },
        theme: {
          color: "#2563EB", // Brand color Blue
        },
        modal: {
          backdropclose: false,
          escape: true,
          handleback: true,
          confirm_close: false,
          ondismiss: function () {
            setLoadingCheckout(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        console.error("Razorpay payment failure:", resp.error);
        setErrorMsg(`Payment Failure: ${resp.error.description}`);
        setPaymentStatus('failed');
        setLoadingCheckout(false);
      });
      
      rzp.open();
    } catch (err) {
      console.error("Payment checkout failed:", err);
      setErrorMsg(err.message || "An unexpected error occurred while initializing checkout.");
      setPaymentStatus('failed');
      setLoadingCheckout(false);
    }
  };

  const handleRetry = () => {
    setErrorMsg('');
    setPaymentStatus('pending');
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
      {/* 1. Payment Pending State */}
      {paymentStatus === 'pending' && (
        <div className="space-y-5">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-4">
            <button onClick={onPaymentCancel} className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-lg text-gray-800">Secure UPI Payment</h3>
          </div>

          <div className="text-center bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total to Pay</span>
            <span className="text-3xl font-black text-gray-900">₹{amount.toFixed(2)}</span>
          </div>

          {/* Native Mobile Number Input (Never freezes, remembers customer) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-gray-700">
              Mobile Number (for UPI &amp; Receipt):
            </label>
            <div className={`flex items-center bg-white border ${phoneError ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100'} rounded-2xl overflow-hidden transition px-3.5 py-1`}>
              <div className="flex items-center space-x-1.5 pr-2.5 border-r border-gray-200 text-gray-600 font-bold text-sm select-none">
                <span>🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter 10-digit mobile"
                className="w-full pl-3 py-2 text-sm font-bold text-gray-900 outline-none bg-transparent placeholder-gray-400"
              />
            </div>
            {phoneError ? (
              <p className="text-[11px] font-bold text-red-500 pl-1">{phoneError}</p>
            ) : (
              <p className="text-[10px] text-gray-400 font-semibold pl-1 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Direct 1-tap checkout via GPay, PhonePe, Paytm or UPI</span>
              </p>
            )}
          </div>

          <button
            onClick={handleRazorpayPayment}
            disabled={loadingCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition duration-150 flex items-center justify-center space-x-2"
          >
            {loadingCheckout ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Launching UPI Gateway...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Pay ₹{amount.toFixed(2)} via UPI / Cards</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 2. Payment Processing State */}
      {paymentStatus === 'processing' && (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="text-blue-600 bg-blue-50 p-4 rounded-full animate-spin">
            <Loader2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-gray-800">Verifying Payment...</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-[260px] leading-relaxed">Please wait while the server verifies your Razorpay signature hash. Do not close this page.</p>
          </div>
        </div>
      )}

      {/* 3. Payment Success State */}
      {paymentStatus === 'success' && (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="text-green-600 bg-green-50 p-4 rounded-full animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-green-800">Payment Successful</h3>
            <p className="text-sm text-green-700/80 mt-1 max-w-[250px] font-medium leading-snug">✓ Transaction verified.<br />Initializing print queue allocation...</p>
          </div>
        </div>
      )}

      {/* 4. Payment Failed State */}
      {paymentStatus === 'failed' && (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
          <div className="text-red-600 bg-red-50 p-4 rounded-full animate-pulse">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-red-800">Payment Failed</h3>
            <p className="text-sm text-red-700/80 mt-1 leading-snug max-w-[260px]">
              {errorMsg || "We couldn't confirm your transaction. Your file has not been submitted for printing."}
            </p>
          </div>
          <div className="w-full pt-4 space-y-2">
            <button
              onClick={handleRetry}
              className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition"
            >
              Try Again
            </button>
            <button
              onClick={onPaymentCancel}
              className="w-full bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-500 font-bold py-3 px-4 rounded-xl border border-gray-200 transition text-sm"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
