import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HabituxAPI } from '../../lib/supabase';
import { PaymentTransaction, Booking } from '../../types';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  CreditCard,
  QrCode
} from 'lucide-react';

export const StudentPaymentDetailPage: React.FC = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<PaymentTransaction | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentId) return;
    setLoading(true);
    HabituxAPI.getPaymentById(paymentId)
      .then((p) => {
        if (p) {
          setPayment(p);
          HabituxAPI.getBookingById(p.booking_id).then(setBooking);
        }
      })
      .finally(() => setLoading(false));
  }, [paymentId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading invoice...</div>;
  }

  if (!payment) {
    return (
      <div className="p-12 bg-white rounded-3xl border border-[#EDE8DF] text-center space-y-3">
        <h3 className="font-extrabold text-slate-900 text-sm">Invoice not found</h3>
        <button
          onClick={() => navigate('/student/payments')}
          className="px-4 py-2 bg-[#FF4B26] text-white font-bold text-xs rounded-xl"
        >
          Return to Payments
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Bar for actions (hidden during print) */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => navigate('/student/payments')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Payments
        </button>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* Official Tax Invoice Container */}
      <div className="bg-white rounded-3xl border border-[#EDE8DF] p-8 sm:p-12 shadow-sm space-y-8 print:p-0 print:border-none print:shadow-none">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[#EDE8DF]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF4B26] text-white flex items-center justify-center font-extrabold text-xl font-heading shadow-xs">
                H
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-[#0F172A] font-heading">
                  HABITUX
                </span>
                <span className="block text-[9px] uppercase font-bold tracking-widest text-[#FF4B26] -mt-1 font-heading">
                  ZERO-BROKERAGE STUDENT LIVING
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-xs">
              Habitux Technologies Pvt. Ltd.<br />
              GSTIN: 07AAACH1234F1Z8 • Verified Accommodation Platform
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="text-xl font-extrabold text-slate-900 font-heading block">
              TAX INVOICE & RECEIPT
            </span>
            <p className="text-xs font-mono font-bold text-[#FF4B26]">
              Invoice No: {payment.invoice_number}
            </p>
            <p className="text-xs text-slate-500">
              Date: {new Date(payment.created_at).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PAYMENT VERIFIED
            </span>
          </div>
        </div>

        {/* Bill To & Accommodation Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
              Billed To (Resident Student)
            </span>
            <p className="font-extrabold text-slate-900 text-sm">{payment.student_name}</p>
            <p className="text-slate-600">Email: {payment.student_email}</p>
            {booking && <p className="text-slate-600">Phone: {booking.student_phone}</p>}
            <p className="text-slate-500 text-[11px] font-mono mt-1">Booking Ref: {payment.booking_reference}</p>
          </div>

          <div className="space-y-1 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
              Accommodation Property
            </span>
            <p className="font-extrabold text-slate-900 text-sm">{payment.hostel_name}</p>
            {booking && (
              <>
                <p className="text-slate-600">{booking.hostel_locality}, {booking.hostel_city}</p>
                <p className="text-slate-600">Room: {booking.room_name} ({booking.bed_number || 'Bed Reserved'})</p>
                <p className="text-slate-600">Move-in: {booking.move_in_date}</p>
              </>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-y border-[#EDE8DF] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Item & Description</th>
                <th className="py-3 px-4 text-center">Type</th>
                <th className="py-3 px-4 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-4 px-4">
                  <div className="font-bold text-slate-900">1st Month Advance Rent</div>
                  <div className="text-[11px] text-slate-500">Advance monthly accommodation charges for {booking?.room_name || 'Reserved Room'}</div>
                </td>
                <td className="py-4 px-4 text-center">Advance Rent</td>
                <td className="py-4 px-4 text-right font-extrabold text-slate-900">
                  ₹{booking ? booking.advance_rent.toLocaleString('en-IN') : (payment.amount - 5000).toLocaleString('en-IN')}
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4">
                  <div className="font-bold text-slate-900">Security Deposit</div>
                  <div className="text-[11px] text-slate-500">100% Refundable deposit held by hostel owner as per move-out terms</div>
                </td>
                <td className="py-4 px-4 text-center">Refundable</td>
                <td className="py-4 px-4 text-right font-extrabold text-slate-900">
                  ₹{booking ? booking.security_deposit.toLocaleString('en-IN') : '5,000'}
                </td>
              </tr>
              <tr className="bg-emerald-50/50">
                <td className="py-3 px-4 text-emerald-800">
                  <div className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Habitux Platform Brokerage Guarantee
                  </div>
                  <div className="text-[10px] text-emerald-600">Direct landlord connection • Zero broker fee</div>
                </td>
                <td className="py-3 px-4 text-center font-bold text-emerald-700">Zero Brokerage</td>
                <td className="py-3 px-4 text-right font-bold text-emerald-700">
                  <span className="line-through text-slate-400 font-normal mr-2">₹7,500</span>
                  ₹0
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900">
                <th colSpan={2} className="py-4 px-4 text-sm font-extrabold text-slate-900">
                  Total Paid:
                </th>
                <th className="py-4 px-4 text-right text-base font-extrabold text-[#FF4B26]">
                  ₹{payment.amount.toLocaleString('en-IN')}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Razorpay Gateway Audit */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <span className="font-bold text-slate-800 uppercase tracking-wider block text-[10px]">
            Payment Verification Details
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <p>Razorpay Payment ID: <b className="font-mono text-slate-800">{payment.razorpay_payment_id}</b></p>
            <p>Order ID: <b className="font-mono text-slate-800">{payment.razorpay_order_id}</b></p>
            <p>Method: <b className="uppercase text-slate-800">{payment.method}</b></p>
            <p>Gateway: <b className="text-slate-800">Razorpay 256-bit Secure Gateway</b></p>
          </div>
        </div>

        {/* Terms & Seal */}
        <div className="pt-4 border-t border-[#EDE8DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-400">
          <p className="max-w-md">
            This is a computer-generated tax invoice issued by Habitux. No signature required. For support or dispute resolution, contact support@habitux.in.
          </p>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-xs flex items-center gap-1.5 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified Habitux Seal
          </div>
        </div>
      </div>
    </div>
  );
};
