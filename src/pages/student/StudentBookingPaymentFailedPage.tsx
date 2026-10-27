import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { HabituxAPI } from '../../lib/supabase';
import { Booking } from '../../types';
import { 
  XCircle, 
  RotateCcw, 
  ArrowLeft, 
  MessageSquare, 
  CreditCard, 
  ShieldAlert, 
  Clock, 
  Home
} from 'lucide-react';

export const StudentBookingPaymentFailedPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const reason = searchParams.get('reason') || 'Transaction was declined by issuing bank or payment gateway session expired.';
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    HabituxAPI.getBookingById(bookingId)
      .then(setBooking)
      .finally(() => setLoading(false));
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#EDE8DF] shadow-xl p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
        
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-md shadow-rose-600/10">
          <XCircle className="w-9 h-9" />
        </div>

        <div className="space-y-1.5">
          <span className="px-3 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold uppercase border border-rose-200">
            Payment Incomplete
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] font-heading">
            Payment Could Not Be Processed
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {reason}
          </p>
        </div>

        {/* Booking details card */}
        {booking && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Accommodation:</span>
              <span className="font-bold text-slate-900">{booking.hostel_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Room Type:</span>
              <span className="font-semibold text-slate-800">{booking.room_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Attempted:</span>
              <span className="font-black text-[#FF4B26]">₹{booking.booking_advance_amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200">
              <span>Booking Reference:</span>
              <span className="font-mono">{booking.booking_reference}</span>
            </div>
          </div>
        )}

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-xs text-amber-900 flex items-start gap-2">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            No money has been deducted from your account. Your room hold remains temporarily active. Please retry with UPI, Net Banking, or another card.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => navigate(`/student/bookings/${bookingId}/payment`)}
            className="w-full py-3.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-extrabold text-xs rounded-xl shadow-md shadow-[#FF4B26]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again with Another Payment Method
          </button>

          <button
            onClick={() => navigate(`/student/bookings/confirm/${bookingId}`)}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Review / Edit Booking Details
          </button>

          <button
            onClick={() => navigate('/student/explore')}
            className="w-full py-2 bg-transparent text-slate-400 hover:text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Back to Explore Hostels
          </button>
        </div>

      </div>
    </div>
  );
};
