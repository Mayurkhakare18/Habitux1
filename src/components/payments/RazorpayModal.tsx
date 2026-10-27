import React, { useState } from 'react';
import { Booking } from '../../types';
import { HabituxAPI } from '../../lib/supabase';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface RazorpayModalProps {
  booking: Booking;
  razorpayOrder: any;
  onSuccess: (booking: Booking, paymentTx: any) => void;
  onClose: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  booking,
  razorpayOrder,
  onSuccess,
  onClose,
  onShowToast,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState(`${booking.student_phone.replace(/\D/g, '').slice(-10)}@okhdfcbank`);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('321');
  const [processing, setProcessing] = useState(false);
  const [simulationState, setSimulationState] = useState<'selecting' | 'authorizing' | 'success'>('selecting');

  const handleSimulatedPayment = async () => {
    setProcessing(true);
    setSimulationState('authorizing');

    setTimeout(async () => {
      try {
        const paymentId = `pay_rzp_${Math.random().toString(36).substring(2, 11)}`;
        const signature = `sig_hmac_${Math.random().toString(36).substring(2, 16)}`;

        const result = await HabituxAPI.verifyAndCompletePayment({
          bookingId: booking.id,
          razorpayOrderId: razorpayOrder.id,
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
          paymentMethod: selectedMethod,
        });

        setSimulationState('success');
        setTimeout(() => {
          onSuccess(result.booking, result.payment);
        }, 1200);
      } catch (err: any) {
        console.error('Payment verification failed:', err);
        setSimulationState('selecting');
        setProcessing(false);
        onShowToast('error', err?.message || 'Payment verification failed');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Razorpay + Habitux Co-Branded Header */}
        <div className="bg-[#0F172A] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF4B26] to-[#FF7043] flex items-center justify-center font-bold text-lg shadow-md">
              H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight font-heading">
                  HABITUX SECURE PAY
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                  Powered by Razorpay
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                256-bit SSL Encrypted • Zero Brokerage Guarantee
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={processing}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Ribbon */}
        <div className="bg-[#FFF1ED] px-6 py-3 border-b border-[#FFE4DC] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Total Advance Payable
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#0F172A] font-heading">
              ₹{booking.total_amount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
              100% Zero Brokerage
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Ref: {booking.booking_reference}
            </p>
          </div>
        </div>

        {/* Content Body */}
        {simulationState === 'authorizing' ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-14 h-14 border-4 border-[#FF4B26]/20 border-t-[#FF4B26] rounded-full animate-spin mx-auto" />
            <h4 className="font-extrabold text-slate-900 text-base font-heading">
              Contacting Razorpay Gateway...
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Please do not refresh or press back while we securely authorize your advance rent & deposit payment.
            </p>
          </div>
        ) : simulationState === 'success' ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg font-heading">
              Payment Verified Successfully!
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your bed at {booking.hostel_name} is reserved. Redirecting to your official booking receipt & invoice...
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                { id: 'card', label: 'Cards', icon: CreditCard },
                { id: 'netbanking', label: 'NetBanking', icon: Building2 },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id as any)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedMethod === m.id
                        ? 'bg-[#FFF1ED] border-[#FF4B26] text-[#FF4B26] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Method Details */}
            {selectedMethod === 'upi' && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Enter VPA / UPI ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="mobileNumber@upi or username@okaxis"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#FF4B26]/30"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Auto-Verified
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>Popular:</span>
                  <button type="button" onClick={() => setUpiId('student@okhdfcbank')} className="underline hover:text-[#FF4B26]">Google Pay</button>
                  <span>•</span>
                  <button type="button" onClick={() => setUpiId('student@ybl')} className="underline hover:text-[#FF4B26]">PhonePe</button>
                  <span>•</span>
                  <button type="button" onClick={() => setUpiId('student@paytm')} className="underline hover:text-[#FF4B26]">Paytm</button>
                </div>
              </div>
            )}

            {selectedMethod === 'card' && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <label className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'netbanking' && (
              <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <label className="font-bold text-slate-800 uppercase tracking-wider block">
                  Select Popular Bank
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((b) => (
                    <button
                      type="button"
                      key={b}
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-left font-semibold text-slate-800 hover:border-[#FF4B26] hover:bg-[#FFF1ED]/40 transition-colors cursor-pointer text-xs"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Itemization */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>First Month Advance Rent ({booking.room_name}):</span>
                <span className="font-semibold text-slate-900">₹{booking.advance_rent.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Refundable Security Deposit:</span>
                <span className="font-semibold text-slate-900">₹{booking.security_deposit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Brokerage / Agent Commission:
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="line-through text-slate-400 font-normal">₹7,500</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px]">₹0 FREE</span>
                </span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="button"
              onClick={handleSimulatedPayment}
              disabled={processing}
              className="w-full py-3.5 bg-[#FF4B26] hover:bg-[#E03713] active:scale-98 text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#FF4B26]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              Pay ₹{booking.total_amount.toLocaleString('en-IN')} via Razorpay
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Instant Refund Guarantee if inspection does not match verified listing
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
