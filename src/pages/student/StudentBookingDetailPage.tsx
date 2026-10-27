import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { Booking } from '../../types';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Bed, 
  PhoneCall, 
  FileText, 
  MessageSquare, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle,
  XCircle,
  Copy,
  ExternalLink,
  Download
} from 'lucide-react';

export const StudentBookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [copiedPasscode, setCopiedPasscode] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    HabituxAPI.getBookingById(bookingId)
      .then(setBooking)
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleCopyPasscode = () => {
    if (!booking?.check_in_code) return;
    navigator.clipboard.writeText(booking.check_in_code);
    setCopiedPasscode(true);
    setTimeout(() => setCopiedPasscode(false), 2000);
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking? Per platform policy, the security deposit and advance rent will be refunded per owner cancellation terms.'
    );
    if (!confirmed) return;

    setCancelling(true);
    try {
      const updated = await HabituxAPI.cancelBooking(booking.id, 'Cancelled by student prior to move-in');
      setBooking(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Loading check-in voucher details...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-12 bg-white rounded-3xl border border-[#EDE8DF] text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
        <h3 className="font-extrabold text-slate-900 text-sm">Booking Not Found</h3>
        <button
          onClick={() => navigate('/student/bookings')}
          className="px-4 py-2 bg-[#FF4B26] text-white font-bold text-xs rounded-xl"
        >
          Return to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={() => navigate('/student/bookings')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Bookings
      </button>

      {/* Main Voucher Card */}
      <div className="bg-white rounded-3xl border border-[#EDE8DF] shadow-md overflow-hidden">
        {/* Card Header */}
        <div className="bg-[#0F172A] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF4B26] text-white text-[10px] font-bold">
                OFFICIAL BOOKING CONFIRMATION
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Ref: {booking.booking_reference}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading">
              {booking.hostel_name}
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF4B26]" /> {booking.hostel_locality}, {booking.hostel_city}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Status
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {booking.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Check-in Passcode & Bed Allocation Highlight Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-[#FAF8F5] rounded-2xl border border-[#EDE8DF]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Allocated Room & Bed
              </span>
              <span className="text-sm font-extrabold text-slate-900 font-heading block">
                {booking.bed_number || 'Room 204 • Bed A'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {booking.room_name} ({booking.sharing_capacity === 1 ? 'Single' : `${booking.sharing_capacity} Sharing`})
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Move-in Target Date
              </span>
              <span className="text-sm font-extrabold text-slate-900 font-heading block">
                {new Date(booking.move_in_date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Check-in from 9:00 AM onwards
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Check-in Gate Passcode
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-extrabold text-[#FF4B26] bg-[#FFF1ED] px-3 py-1 rounded-xl border border-[#FFE4DC]">
                  {booking.check_in_code || 'HBX-7742'}
                </span>
                <button
                  onClick={handleCopyPasscode}
                  className="p-2 text-slate-500 hover:text-slate-900 bg-white rounded-xl border border-slate-200 cursor-pointer"
                  title="Copy Passcode"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copiedPasscode && (
                <span className="text-[10px] font-bold text-emerald-600 block">Copied to clipboard!</span>
              )}
            </div>
          </div>

          {/* Student & Host Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Resident Student Information
              </span>
              <div className="text-xs space-y-1 text-slate-600">
                <p>Name: <b className="text-slate-900">{booking.student_name}</b></p>
                <p>Phone: <b className="text-slate-900">{booking.student_phone}</b></p>
                <p>Email: <b className="text-slate-900">{booking.student_email}</b></p>
                <p>Duration: <b className="text-slate-900">{booking.stay_duration_months} Months</b></p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-[#FF4B26]" /> Property Manager Contact
              </span>
              <div className="text-xs space-y-1 text-slate-600">
                <p>Manager: <b className="text-slate-900">{booking.owner_name || 'Rajesh Verma'}</b></p>
                <p>Contact Phone: <b className="text-slate-900">{booking.owner_phone || '+91 98290 12345'}</b></p>
                <p>Support: <b className="text-slate-900">support@habitux.in</b></p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => navigate('/student/messages')}
                  className="px-3.5 py-1.5 bg-[#FFF1ED] text-[#FF4B26] text-xs font-bold rounded-xl border border-[#FFE4DC] hover:bg-[#FFE4DC] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Chat with Owner
                </button>
              </div>
            </div>
          </div>

          {/* Payment & Financial Breakdown Table */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Financial Summary & Payment Status
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                PAYMENT STATUS: {booking.payment_status.toUpperCase()}
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between text-slate-600">
                <span>1st Month Advance Rent ({booking.room_name}):</span>
                <span className="font-semibold text-slate-900">₹{booking.advance_rent.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2.5 flex justify-between text-slate-600">
                <span>Refundable Security Deposit:</span>
                <span className="font-semibold text-slate-900">₹{booking.security_deposit.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2.5 flex justify-between text-emerald-700 font-semibold">
                <span>Zero Brokerage Fee (Zero deductions):</span>
                <span className="flex items-center gap-2">
                  <span className="line-through text-slate-400 font-normal">₹7,500</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px]">₹0 FREE</span>
                </span>
              </div>
              <div className="py-3 flex justify-between text-slate-900 font-extrabold text-sm">
                <span>Total Booking Cost:</span>
                <span className="text-[#FF4B26]">₹{booking.total_amount.toLocaleString('en-IN')}</span>
              </div>

              {booking.remaining_balance_amount > 0 && (
                <div className="py-2.5 flex justify-between text-amber-800 font-bold bg-amber-50 px-3 rounded-xl">
                  <span>Balance Due at Property / Check-in:</span>
                  <span>₹{booking.remaining_balance_amount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {booking.payment_id && (
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-100">
                <span>Payment Reference: <b className="font-mono text-slate-600">{booking.payment_id}</b></span>
                <span>Gateway Order: <b className="font-mono text-slate-600">{booking.order_id || 'N/A'}</b></span>
              </div>
            )}
          </div>

          {/* Action CTAs: Invoice & Cancellation & Payment Proceed */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#EDE8DF]">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {booking.status === 'awaiting_payment' && (
                <button
                  onClick={() => navigate(`/student/bookings/${booking.id}/payment`)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Proceed to Payment Selection →
                </button>
              )}

              {booking.status === 'pending_confirmation' && (
                <button
                  onClick={() => navigate(`/student/bookings/confirm/${booking.id}`)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Review & Confirm Booking →
                </button>
              )}

              {(booking.status === 'confirmed' || booking.status === 'completed') && (
                <button
                  onClick={() => navigate(`/student/bookings/${booking.id}/payment/success`)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  Official Receipt & Invoice
                </button>
              )}
            </div>

            {booking.status !== 'cancelled' && (
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-rose-200"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Reservation'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
