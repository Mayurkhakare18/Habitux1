import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { Booking, PaymentTransaction, Hostel } from '../../types';
import { 
  CheckCircle2, 
  Printer, 
  Download, 
  ArrowRight, 
  MessageSquare, 
  Bed, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Copy, 
  Clock, 
  ExternalLink,
  Building2,
  Home
} from 'lucide-react';

export const StudentBookingPaymentSuccessPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [payment, setPayment] = useState<PaymentTransaction | null>(null);
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    HabituxAPI.getBookingById(bookingId)
      .then(async (b) => {
        if (!b) return;
        setBooking(b);
        const h = await HabituxAPI.getHostelById(b.hostel_id);
        setHostel(h);

        // Fetch corresponding payment transaction
        const payments = await HabituxAPI.getStudentPayments(b.student_id);
        const p = payments.find((x) => x.booking_id === b.id);
        if (p) setPayment(p);
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleCopyCode = () => {
    if (!booking?.check_in_code) return;
    navigator.clipboard.writeText(booking.check_in_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-[#FF4B26]/20 border-t-[#FF4B26] rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500 mt-4">Generating Official Confirmation & Invoice...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-[#EDE8DF] text-center space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Booking Record Not Found</h2>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="w-full py-2.5 bg-[#FF4B26] text-white font-bold text-xs rounded-xl"
          >
            Go to Student Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isPayAtProperty = booking.payment_method_selected === 'pay_at_property';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Celebration Header */}
        <div className="text-center space-y-3 print:hidden">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-600/15 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isPayAtProperty ? 'BED RESERVED (PAY AT PROPERTY)' : 'PAYMENT VERIFIED & BED ALLOCATED'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-heading">
            {isPayAtProperty ? 'Your Bed is Successfully Reserved!' : 'Booking Confirmed! You’re Moving In!'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Your reservation at <strong>{booking.hostel_name}</strong> is registered on the Habitux zero-brokerage ledger.
          </p>
        </div>

        {/* Action Bar (Top) */}
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={() => navigate('/student/bookings')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            ← View My Bookings
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Download / Print Receipt
            </button>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-4 py-2 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Student Dashboard →
            </button>
          </div>
        </div>

        {/* Official Printable Voucher / Receipt Card */}
        <div className="bg-white rounded-3xl border border-[#EDE8DF] shadow-lg overflow-hidden print:border-none print:shadow-none">
          
          {/* Card Top Banner */}
          <div className="bg-[#0F172A] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#FF4B26] text-white flex items-center justify-center font-black text-sm">
                  H
                </span>
                <span className="font-extrabold text-lg tracking-tight font-heading">
                  HABITUX
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  OFFICIAL RECEIPT
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading">
                {booking.hostel_name}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF4B26]" />
                {booking.hostel_locality}, {booking.hostel_city}
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Booking Reference
              </span>
              <span className="text-base font-extrabold font-mono text-[#FF4B26]">
                {booking.booking_reference}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Issued on: {new Date(booking.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">

            {/* Check-In Passcode & Bed Allocation Highlight Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF]">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Allocated Room & Bed
                </span>
                <div className="text-base font-extrabold text-slate-900 flex items-center gap-1.5 font-heading">
                  <Bed className="w-4 h-4 text-[#FF4B26]" />
                  {booking.bed_number || 'Room 204 • Bed A'}
                </div>
                <span className="text-[10px] text-slate-500 block">
                  {booking.room_name} ({booking.sharing_capacity} Sharing)
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Arrival Check-In Code
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black font-mono text-[#FF4B26] tracking-wider bg-white px-2.5 py-1 rounded-lg border border-[#EDE8DF]">
                    {booking.check_in_code || 'HBX-7742'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg bg-white border border-[#EDE8DF] text-slate-500 hover:text-slate-800 transition-colors cursor-pointer print:hidden"
                    title="Copy Code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold block">
                  {copiedCode ? 'Copied to clipboard!' : 'Show at reception for entry'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Confirmed Move-In Date
                </span>
                <div className="text-base font-extrabold text-slate-900 flex items-center gap-1.5 font-heading">
                  <Calendar className="w-4 h-4 text-[#FF4B26]" />
                  {new Date(booking.move_in_date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Stay: {booking.stay_duration_months} Months Commitment
                </span>
              </div>
            </div>

            {/* Resident & Owner Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] block">
                  Student Resident
                </span>
                <div className="font-bold text-slate-900 text-sm">{booking.student_name}</div>
                <div className="text-slate-500">Phone: {booking.student_phone}</div>
                <div className="text-slate-500">Email: {booking.student_email}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] block">
                  Hostel Management / Host
                </span>
                <div className="font-bold text-slate-900 text-sm">{booking.owner_name || 'Rajesh Verma'}</div>
                <div className="text-slate-500">Contact: {booking.owner_phone || '+91 98290 12345'}</div>
                <div className="text-slate-500">Address: {hostel?.address_line}, {hostel?.city}</div>
              </div>
            </div>

            {/* Transaction & Itemized Payment Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                <span>Fee Itemization</span>
                <span>Amount (INR)</span>
              </div>

              <div className="p-4 space-y-2.5">
                <div className="flex justify-between text-slate-600">
                  <span>First Month Room Rent ({booking.room_name}):</span>
                  <span className="font-semibold text-slate-900">₹{booking.advance_rent.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Refundable Security Deposit:</span>
                  <span className="font-semibold text-slate-900">₹{booking.security_deposit.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Brokerage / Agent Charges:
                  </span>
                  <span>₹0 (100% FREE)</span>
                </div>

                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Payment Gateway / Platform Fee:</span>
                  <span>₹0</span>
                </div>

                {/* Total Itemized */}
                <div className="pt-2.5 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                  <span>Total Booking Cost:</span>
                  <span>₹{booking.total_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment Summary Footer */}
              <div className="bg-[#FAF8F5] px-4 py-3 border-t border-slate-200 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700">Amount Paid Online:</span>
                  <span className="font-extrabold text-emerald-700">
                    ₹{payment ? payment.amount_paid_now.toLocaleString('en-IN') : (isPayAtProperty ? '0' : booking.booking_advance_amount.toLocaleString('en-IN'))}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700">Balance Due Upon Arrival / Check-in:</span>
                  <span className="font-extrabold text-slate-900">
                    ₹{payment ? payment.amount_due_at_property.toLocaleString('en-IN') : (isPayAtProperty ? booking.total_amount.toLocaleString('en-IN') : booking.remaining_balance_amount.toLocaleString('en-IN'))}
                  </span>
                </div>

                {payment && (
                  <div className="text-[10px] text-slate-400 font-mono pt-1">
                    Transaction ID: {payment.razorpay_payment_id || payment.id} • Method: {payment.method.toUpperCase()} • Invoice: {payment.invoice_number}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions inside voucher */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 print:hidden">
              <button
                onClick={() => navigate('/student/messages')}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat with Owner ({booking.owner_name || 'Host'})
              </button>

              <button
                onClick={() => navigate(`/hostels/${booking.hostel_slug}`)}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Hostel Listing
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
