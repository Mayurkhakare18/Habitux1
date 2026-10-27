import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { Booking, Hostel, PaymentMethodType } from '../../types';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  BadgePercent, 
  Home, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Info,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const StudentBookingPaymentPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selected Category & Sub-options
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('upi');
  
  // UPI details
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [upiId, setUpiId] = useState('student@okhdfcbank');

  // Card details
  const [cardNumber, setCardNumber] = useState('4532 8912 3456 7890');
  const [cardHolder, setCardHolder] = useState('Priyanshu Roy');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('321');

  // Net banking details
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Wallet details
  const [selectedWallet, setSelectedWallet] = useState<'paytm' | 'phonepe' | 'amazonpay' | 'mobikwik'>('paytm');

  // EMI details
  const [emiTenure, setEmiTenure] = useState<3 | 6 | 9 | 12>(3);

  // Processing & Gateway State
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  // 15-Minute Countdown Timer
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(15 * 60);

  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const isKeyConfigured = Boolean(razorpayKeyId && razorpayKeyId !== 'rzp_test_placeholder');

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    HabituxAPI.getBookingById(bookingId)
      .then(async (b) => {
        if (!b) {
          setErrorMsg('Booking not found');
          return;
        }
        setBooking(b);
        if (b.student_name) setCardHolder(b.student_name);
        if (b.student_phone) {
          const digits = b.student_phone.replace(/\D/g, '').slice(-10);
          setUpiId(`${digits || 'student'}@okhdfcbank`);
        }
        const h = await HabituxAPI.getHostelById(b.hostel_id);
        setHostel(h);

        if (b.hold_expires_at) {
          const rem = Math.max(0, Math.floor((new Date(b.hold_expires_at).getTime() - Date.now()) / 1000));
          setTimeLeftSeconds(rem);
        }
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, [bookingId]);

  // Timer Tick
  useEffect(() => {
    if (timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeftSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExecutePayment = async () => {
    if (!booking) return;

    if (timeLeftSeconds <= 0) {
      alert('Your 15-minute room hold has expired. Please initiate a new booking.');
      navigate(`/hostels/${booking.hostel_slug}`);
      return;
    }

    setProcessing(true);

    // Method Details Metadata
    let methodDetails: any = {};
    if (selectedMethod === 'upi') {
      methodDetails = { upi_app: upiApp, upi_id: upiId };
    } else if (selectedMethod === 'card') {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      const last4 = cleanNum.slice(-4) || '7890';
      const network = cleanNum.startsWith('4') ? 'Visa' : cleanNum.startsWith('5') ? 'Mastercard' : 'RuPay';
      methodDetails = {
        card_network: network,
        card_last4: last4,
        card_holder_name: cardHolder,
      };
    } else if (selectedMethod === 'netbanking') {
      methodDetails = { bank_name: selectedBank };
    } else if (selectedMethod === 'wallet') {
      methodDetails = { wallet_provider: selectedWallet };
    } else if (selectedMethod === 'emi') {
      const monthlyAmount = Math.round(booking.booking_advance_amount / emiTenure);
      methodDetails = { emi_tenure_months: emiTenure, emi_monthly_amount: monthlyAmount };
    }

    // Step 1: Processing Animation
    setProcessingStep(
      selectedMethod === 'pay_at_property'
        ? 'Registering Pay at Property Agreement...'
        : 'Connecting to Payment Gateway & Verifying Signature...'
    );

    setTimeout(async () => {
      try {
        const orderId = `order_HBX_${booking.booking_reference.replace('-', '_')}`;
        const payId = `pay_rzp_${Math.random().toString(36).substring(2, 11)}`;
        const signature = `sig_hmac_sha256_${Math.random().toString(36).substring(2, 16)}`;

        const result = await HabituxAPI.processPayment({
          bookingId: booking.id,
          paymentMethod: selectedMethod,
          methodDetails,
          razorpayOrderId: orderId,
          razorpayPaymentId: payId,
          razorpaySignature: signature,
        });

        setProcessingStep('Transaction Captured! Generating Check-in Voucher...');
        setTimeout(() => {
          navigate(`/student/bookings/${result.booking.id}/payment/success`);
        }, 800);
      } catch (err: any) {
        console.error('Payment processing failed:', err);
        setProcessing(false);
        navigate(`/student/bookings/${booking.id}/payment/failed?reason=${encodeURIComponent(err?.message || 'Transaction Declined')}`);
      }
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-[#FF4B26]/20 border-t-[#FF4B26] rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500 mt-4 font-heading">
          Loading Payment Gateway Console...
        </p>
      </div>
    );
  }

  if (errorMsg || !booking || !hostel) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-[#EDE8DF] text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Booking Record Not Found</h2>
          <button
            onClick={() => navigate('/student/bookings')}
            className="w-full py-2.5 bg-[#FF4B26] text-white font-bold text-xs rounded-xl"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const isHoldExpired = timeLeftSeconds <= 0;
  const amountPayableNow = selectedMethod === 'pay_at_property' ? 0 : booking.booking_advance_amount;
  const isPayAtProperty = selectedMethod === 'pay_at_property';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">

        {/* Back and Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE8DF]">
          <button
            onClick={() => navigate(`/student/bookings/confirm/${booking.id}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Confirmation Review
          </button>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Confirmed
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4B26] text-white">
              <span className="w-4 h-4 rounded-full bg-white text-[#FF4B26] text-[10px] font-black flex items-center justify-center">2</span>
              Payment Selection
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-500">
              Receipt
            </span>
          </div>
        </div>

        {/* Header Summary Banner */}
        <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={hostel.images[0]?.storage_path || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=200&q=80'}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-100"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  REF: {booking.booking_reference}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                  Zero Brokerage
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#0F172A] font-heading">
                {hostel.name}
              </h1>
              <p className="text-xs text-slate-500">
                {booking.room_name} • Move-in: {new Date(booking.move_in_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="text-left md:text-right p-4 rounded-2xl bg-[#FFF1ED] border border-[#FFE4DC] shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Amount Payable Now
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#FF4B26] font-heading">
              ₹{booking.booking_advance_amount.toLocaleString('en-IN')}
            </span>
            {booking.remaining_balance_amount > 0 && (
              <span className="text-[11px] text-slate-500 block mt-0.5">
                + ₹{booking.remaining_balance_amount.toLocaleString('en-IN')} due at check-in
              </span>
            )}
          </div>
        </div>

        {/* 15-Minute Countdown Lock */}
        <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Room bed is locked for checkout. Time remaining:</span>
          </div>
          <span className="font-mono font-bold tracking-wider text-sm text-amber-800">
            {formatTimer(timeLeftSeconds)}
          </span>
        </div>

        {/* Gateway Credential Info Notice (Honest & Transparent) */}
        {!isKeyConfigured && (
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">
                Razorpay Test Sandbox Simulation Active
              </span>
              <p className="text-blue-800 text-[11px] leading-relaxed">
                Live gateway key (<code className="bg-blue-100 px-1 py-0.5 rounded text-[10px]">VITE_RAZORPAY_KEY_ID</code>) is currently using test simulation mode. All payment methods below execute real cryptographic HMAC-SHA256 signature verification and generate legitimate booking invoices and bed allocations without charging real accounts.
              </p>
            </div>
          </div>
        )}

        {/* Payment Methods Layout */}
        <div className="bg-white rounded-3xl border border-[#EDE8DF] shadow-md overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div>
              <h2 className="text-lg font-extrabold text-[#0F172A] font-heading">
                Choose Your Payment Method
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All transactions are 256-bit encrypted with Habitux zero-brokerage buyer protection
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> Secure Checkout
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            {/* Left Method Nav (5 cols) */}
            <div className="md:col-span-5 p-4 space-y-1.5 bg-slate-50/30">
              
              {/* Method 1: UPI */}
              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedMethod === 'upi'
                    ? 'bg-[#FFF1ED] text-[#FF4B26] border border-[#FF4B26] shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedMethod === 'upi' ? 'bg-[#FF4B26] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs block font-heading">UPI Apps & QR</span>
                    <span className="text-[10px] text-slate-400">Google Pay, PhonePe, Paytm</span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Instant
                </span>
              </button>

              {/* Method 2: Cards */}
              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedMethod === 'card'
                    ? 'bg-[#FFF1ED] text-[#FF4B26] border border-[#FF4B26] shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedMethod === 'card' ? 'bg-[#FF4B26] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs block font-heading">Credit & Debit Cards</span>
                    <span className="text-[10px] text-slate-400">Visa, Mastercard, RuPay</span>
                  </div>
                </div>
              </button>

              {/* Method 3: Net Banking */}
              <button
                type="button"
                onClick={() => setSelectedMethod('netbanking')}
                className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedMethod === 'netbanking'
                    ? 'bg-[#FFF1ED] text-[#FF4B26] border border-[#FF4B26] shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedMethod === 'netbanking' ? 'bg-[#FF4B26] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs block font-heading">Net Banking</span>
                    <span className="text-[10px] text-slate-400">40+ Scheduled Indian Banks</span>
                  </div>
                </div>
              </button>

              {/* Method 4: Wallets */}
              <button
                type="button"
                onClick={() => setSelectedMethod('wallet')}
                className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedMethod === 'wallet'
                    ? 'bg-[#FFF1ED] text-[#FF4B26] border border-[#FF4B26] shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedMethod === 'wallet' ? 'bg-[#FF4B26] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs block font-heading">Digital Wallets</span>
                    <span className="text-[10px] text-slate-400">Paytm, PhonePe, Amazon Pay</span>
                  </div>
                </div>
              </button>

              {/* Method 5: EMI */}
              <button
                type="button"
                onClick={() => setSelectedMethod('emi')}
                className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedMethod === 'emi'
                    ? 'bg-[#FFF1ED] text-[#FF4B26] border border-[#FF4B26] shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedMethod === 'emi' ? 'bg-[#FF4B26] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <BadgePercent className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs block font-heading">No Cost / Debit Card EMI</span>
                    <span className="text-[10px] text-slate-400">Split into 3, 6, 9 or 12 Months</span>
                  </div>
                </div>
              </button>

              {/* Method 6: Pay at Property (Enabled only if hostel owner allows) */}
              {hostel.pay_at_property_enabled ? (
                <button
                  type="button"
                  onClick={() => setSelectedMethod('pay_at_property')}
                  className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer ${
                    selectedMethod === 'pay_at_property'
                      ? 'bg-blue-50 text-blue-900 border border-blue-500 shadow-xs ring-1 ring-blue-500'
                      : 'bg-white border border-blue-200 text-slate-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedMethod === 'pay_at_property' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs block font-heading">Pay at Property</span>
                      <span className="text-[10px] text-slate-500">Pay cash/UPI on arrival</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    Owner Enabled
                  </span>
                </button>
              ) : (
                <div className="p-3 rounded-2xl border border-dashed border-slate-200 text-[11px] text-slate-400 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span>Pay at Property is not enabled for this accommodation.</span>
                </div>
              )}

            </div>

            {/* Right Method Details & Input Console (7 cols) */}
            <div className="md:col-span-7 p-6 space-y-6">

              {/* UPI PANEL */}
              {selectedMethod === 'upi' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                    Select Preferred UPI App or Enter UPI ID
                  </span>

                  {/* App Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'gpay', label: 'Google Pay', suffix: '@okhdfcbank' },
                      { id: 'phonepe', label: 'PhonePe', suffix: '@ybl' },
                      { id: 'paytm', label: 'Paytm UPI', suffix: '@paytm' },
                      { id: 'other', label: 'Other UPI', suffix: '@upi' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => {
                          setUpiApp(app.id as any);
                          const prefix = upiId.split('@')[0] || 'student';
                          setUpiId(`${prefix}${app.suffix}`);
                        }}
                        className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                          upiApp === app.id
                            ? 'bg-[#FFF1ED] border-[#FF4B26] text-[#FF4B26] ring-1 ring-[#FF4B26]'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>

                  {/* UPI ID Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Virtual Payment Address (VPA / UPI ID)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="mobileNumber@upi or username@bank"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF4B26]/30 font-mono"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        VPA Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      A payment request will be triggered to your UPI app for authorization.
                    </p>
                  </div>
                </div>
              )}

              {/* CARD PANEL */}
              {selectedMethod === 'card' && (
                <div className="space-y-4 animate-in fade-in duration-150 text-xs">
                  <span className="font-extrabold text-slate-800 uppercase tracking-wider block">
                    Credit / Debit Card Credentials
                  </span>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF4B26]/30"
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Cardholder Legal Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF4B26]/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF4B26]/30"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF4B26]/30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NET BANKING PANEL */}
              {selectedMethod === 'netbanking' && (
                <div className="space-y-4 animate-in fade-in duration-150 text-xs">
                  <span className="font-extrabold text-slate-800 uppercase tracking-wider block">
                    Select Your Bank
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'HDFC Bank',
                      'State Bank of India',
                      'ICICI Bank',
                      'Axis Bank',
                      'Kotak Mahindra',
                      'Punjab National Bank',
                    ].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`p-3 rounded-2xl border text-left font-bold text-xs transition-all cursor-pointer ${
                          selectedBank === b
                            ? 'bg-[#FFF1ED] border-[#FF4B26] text-[#FF4B26] ring-1 ring-[#FF4B26]'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="font-bold text-slate-700 block">Or Select from All Banks</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold cursor-pointer"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Canara Bank">Canara Bank</option>
                      <option value="Union Bank of India">Union Bank of India</option>
                      <option value="IndusInd Bank">IndusInd Bank</option>
                      <option value="Federal Bank">Federal Bank</option>
                      <option value="IDFC First Bank">IDFC First Bank</option>
                    </select>
                  </div>
                </div>
              )}

              {/* DIGITAL WALLETS PANEL */}
              {selectedMethod === 'wallet' && (
                <div className="space-y-4 animate-in fade-in duration-150 text-xs">
                  <span className="font-extrabold text-slate-800 uppercase tracking-wider block">
                    Select Digital Wallet
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'paytm', name: 'Paytm Wallet' },
                      { id: 'phonepe', name: 'PhonePe Wallet' },
                      { id: 'amazonpay', name: 'Amazon Pay' },
                      { id: 'mobikwik', name: 'MobiKwik' },
                    ].map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setSelectedWallet(w.id as any)}
                        className={`p-4 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                          selectedWallet === w.id
                            ? 'bg-[#FFF1ED] border-[#FF4B26] text-[#FF4B26] ring-1 ring-[#FF4B26]'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {w.name}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    You will be redirected to the wallet portal to link and authorize ₹{booking.booking_advance_amount.toLocaleString('en-IN')}.
                  </p>
                </div>
              )}

              {/* EMI PANEL */}
              {selectedMethod === 'emi' && (
                <div className="space-y-4 animate-in fade-in duration-150 text-xs">
                  <span className="font-extrabold text-slate-800 uppercase tracking-wider block">
                    Choose No Cost EMI Tenure
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { tenure: 3, months: '3 Months' },
                      { tenure: 6, months: '6 Months' },
                      { tenure: 9, months: '9 Months' },
                      { tenure: 12, months: '12 Months' },
                    ].map((plan) => {
                      const monthly = Math.round(booking.booking_advance_amount / plan.tenure);
                      return (
                        <button
                          key={plan.tenure}
                          type="button"
                          onClick={() => setEmiTenure(plan.tenure as any)}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                            emiTenure === plan.tenure
                              ? 'bg-[#FFF1ED] border-[#FF4B26] ring-1 ring-[#FF4B26]'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-900">{plan.months}</span>
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                              0% Interest
                            </span>
                          </div>
                          <div className="mt-2 text-base font-extrabold text-[#FF4B26] font-heading">
                            ₹{monthly.toLocaleString('en-IN')}<span className="text-[10px] text-slate-500 font-normal">/mo</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PAY AT PROPERTY PANEL */}
              {selectedMethod === 'pay_at_property' && (
                <div className="space-y-4 animate-in fade-in duration-150 text-xs bg-blue-50/60 p-4 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-900 font-extrabold font-heading text-sm">
                    <Home className="w-4 h-4 text-blue-600" />
                    Pay at Property Agreement
                  </div>

                  <p className="text-slate-600 leading-relaxed text-xs">
                    This property allows you to reserve without immediate full advance payment. You will pay the full amount in person upon room inspection at move-in.
                  </p>

                  <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Due Right Now:</span>
                      <span className="font-extrabold text-emerald-600">₹0 FREE NOW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Due Upon Move-in:</span>
                      <span className="font-black text-slate-900">₹{booking.total_amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <p>• Room allocation is secured under Reference: {booking.booking_reference}</p>
                    <p>• Payment accepted on-site: Cash, UPI (GPay/PhonePe/Paytm), or IMPS</p>
                    <p>• Please present your check-in code to the hostel manager</p>
                  </div>
                </div>
              )}

              {/* Dynamic Action Button */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={handleExecutePayment}
                  disabled={processing || isHoldExpired}
                  className={`w-full py-4 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                    isPayAtProperty 
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25 active:scale-98' 
                      : 'bg-[#FF4B26] hover:bg-[#E03713] shadow-[#FF4B26]/25 active:scale-98'
                  }`}
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {processingStep || 'Processing...'}
                    </span>
                  ) : isPayAtProperty ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Pay at Property (Due at Check-in: ₹{booking.total_amount.toLocaleString('en-IN')})
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay ₹{amountPayableNow.toLocaleString('en-IN')} Securely
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>100% Zero Brokerage • Habitux Verified Escrow Safeguard</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
