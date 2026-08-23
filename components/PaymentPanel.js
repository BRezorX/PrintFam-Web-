import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';

export default function PaymentPanel({ amount, onPaymentSuccess, onPaymentCancel, jobId }) {
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed

  const handleSimulatePayment = async () => {
    setPaymentStatus('processing');
    
    // Simulate transaction delay
    setTimeout(() => {
      // 90% chance of success for smooth local testing
      const isSuccess = Math.random() > 0.1;
      if (isSuccess) {
        setPaymentStatus('success');
        setTimeout(() => {
          if (onPaymentSuccess) onPaymentSuccess();
        }, 1500);
      } else {
        setPaymentStatus('failed');
      }
    }, 2500);
  };

  const handleRetry = () => {
    setPaymentStatus('pending');
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
      {/* 1. Payment Pending State */}
      {paymentStatus === 'pending' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-4">
            <button onClick={onPaymentCancel} className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-lg text-gray-800">Secure Payment</h3>
          </div>

          <div className="text-center bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total to Pay</span>
            <span className="text-3xl font-black text-gray-900">₹{amount.toFixed(2)}</span>
          </div>

          {/* Simulated UPI Scan QR */}
          <div className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-200 rounded-2xl bg-white shadow-inner">
            <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center mb-3 relative overflow-hidden">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=printzap@paytm&pn=PrintZap&am=${amount}&tr=${jobId}`)}`}
                alt="UPI Payment QR Code"
                className="w-36 h-36"
              />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Scan QR with GooglePay / PhonePe / BHIM</span>
          </div>

          <button
            onClick={handleSimulatePayment}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition duration-150 flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>Pay ₹{amount.toFixed(2)} Now</span>
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
            <p className="text-sm text-gray-400 mt-1 max-w-[260px] leading-relaxed">Please wait while the server verifies your UPI transaction status. Do not close this page.</p>
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
            <p className="text-sm text-red-700/80 mt-1 leading-snug max-w-[260px]">We couldn't confirm your transaction. Your file has not been submitted for printing.</p>
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
