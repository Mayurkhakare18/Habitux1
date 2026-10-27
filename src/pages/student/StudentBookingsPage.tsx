import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { Booking } from '../../types';
import { 
  CalendarCheck, 
  Bed, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  ChevronRight, 
  AlertCircle,
  ExternalLink,
  QrCode,
  Clock,
  Sparkles
} from 'lucide-react';

export const StudentBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    HabituxAPI.getStudentBookings(user.id)
      .then(setBookings)
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = bookings.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
            My Accommodation Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track confirmed bed reservations, check-in passcodes, and zero-brokerage payment receipts
          </p>
        </div>

        <button
          onClick={() => navigate('/student/explore')}
          className="px-4 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" /> Book Another Bed
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EDE8DF] pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Bookings' },
          { id: 'confirmed', label: 'Confirmed & Active' },
          { id: 'pending_confirmation', label: 'Pending Payment' },
          { id: 'completed', label: 'Completed Stays' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterStatus === tab.id
                ? 'bg-[#FF4B26] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-[#EDE8DF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading your bookings...</div>
      ) : filtered.length === 0 ? (
        <div className="p-10 bg-white rounded-3xl border border-[#EDE8DF] text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center mx-auto">
            <Bed className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm font-heading">No bookings found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              You haven&apos;t reserved any hostel rooms yet. Browse verified student accommodations with zero brokerage and reserve online!
            </p>
          </div>
          <button
            onClick={() => navigate('/student/explore')}
            className="px-5 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer inline-flex items-center gap-2"
          >
            Explore Verified Hostels
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl border border-[#EDE8DF] p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={b.hostel_image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=300&q=80'}
                  alt=""
                  className="w-full sm:w-28 h-28 rounded-2xl object-cover shrink-0 border border-slate-200"
                />

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 font-heading">
                      {b.hostel_name}
                    </span>

                    {/* Booking Status Badge */}
                    {b.status === 'confirmed' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> CONFIRMED
                      </span>
                    ) : b.status === 'awaiting_payment' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                        <Clock className="w-3 h-3 text-blue-600" /> AWAITING PAYMENT
                      </span>
                    ) : b.status === 'completed' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
                        COMPLETED
                      </span>
                    ) : b.status === 'cancelled' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                        CANCELLED
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        PENDING CONFIRMATION
                      </span>
                    )}

                    {/* Payment Status Badge */}
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      b.payment_status === 'successful' || b.payment_status === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : b.payment_status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : b.payment_status === 'failed'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      Payment: {b.payment_status?.replace('_', ' ') || 'Not Initiated'}
                    </span>

                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      Ref: {b.booking_reference}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {b.hostel_locality}, {b.hostel_city}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Bed className="w-3.5 h-3.5 text-[#FF4B26]" />
                      {b.room_name}
                    </span>
                    <span>•</span>
                    <span>Move-in: <b className="text-slate-800">{new Date(b.move_in_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</b></span>
                    <span>•</span>
                    <span>Duration: <b className="text-slate-800">{b.stay_duration_months} Months</b></span>
                  </div>

                  {b.bed_number && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF1ED] text-[#FF4B26] text-xs font-bold border border-[#FFE4DC]">
                      <Sparkles className="w-3.5 h-3.5" /> Allocated: {b.bed_number}
                    </div>
                  )}
                </div>
              </div>

              {/* Financial & CTA Column */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {b.payment_status === 'successful' || b.payment_status === 'paid' ? 'Paid Amount' : 'Amount Payable'}
                  </span>
                  <span className="text-lg font-extrabold text-[#0F172A] font-heading">
                    ₹{(b.booking_advance_amount || b.total_amount).toLocaleString('en-IN')}
                  </span>
                  {b.remaining_balance_amount > 0 ? (
                    <span className="block text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded mt-0.5">
                      Due at Property: ₹{b.remaining_balance_amount.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="block text-[10px] text-emerald-600 font-semibold">
                      Full Advance Settled (Zero Dues)
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {b.status === 'pending_confirmation' && (
                    <button
                      onClick={() => navigate(`/student/bookings/confirm/${b.id}`)}
                      className="px-4 py-2 bg-[#FF4B26] hover:bg-[#E03713] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Review & Confirm</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {b.status === 'awaiting_payment' && (
                    <button
                      onClick={() => navigate(`/student/bookings/${b.id}/payment`)}
                      className="px-4 py-2 bg-[#FF4B26] hover:bg-[#E03713] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 animate-pulse"
                    >
                      <span>Choose Payment Method</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {(b.status === 'confirmed' || b.status === 'completed') && (
                    <>
                      <button
                        onClick={() => navigate(`/student/bookings/${b.id}`)}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Check-in Voucher</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => navigate(`/student/bookings/${b.id}/payment/success`)}
                        className="p-2 text-slate-600 hover:text-[#FF4B26] hover:bg-[#FFF1ED] rounded-xl border border-[#EDE8DF] transition-colors cursor-pointer"
                        title="View Official Receipt"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
