import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HabituxAPI } from '../../lib/supabase';
import { Booking } from '../../types';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  FileText, 
  Bed, 
  Building2 
} from 'lucide-react';

export const OwnerBookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [bedInput, setBedInput] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    HabituxAPI.getBookingById(bookingId)
      .then((b) => {
        if (b) {
          setBooking(b);
          setBedInput(b.bed_number || 'Room 204 • Bed A');
        }
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleUpdateBed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking || !bedInput.trim()) return;

    setUpdating(true);
    try {
      const updated = await HabituxAPI.updateBookingCheckIn(booking.id, bedInput.trim());
      setBooking(updated);
      alert('Bed assignment and check-in confirmed successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update bed number');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading reservation...</div>;
  }

  if (!booking) {
    return (
      <div className="p-12 bg-white rounded-3xl border border-[#EDE8DF] text-center space-y-3">
        <h3 className="font-extrabold text-slate-900 text-sm">Booking Not Found</h3>
        <button
          onClick={() => navigate('/owner/bookings')}
          className="px-4 py-2 bg-[#0F172A] text-white font-bold text-xs rounded-xl"
        >
          Return to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => navigate('/owner/bookings')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Reservations
      </button>

      <div className="bg-white rounded-3xl border border-[#EDE8DF] shadow-md overflow-hidden">
        <div className="bg-[#0F172A] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                ADVANCE VERIFIED RESERVATION
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Ref: {booking.booking_reference}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading mt-1">
              {booking.student_name}
            </h1>
            <p className="text-xs text-slate-400">
              Reserved for {booking.hostel_name} ({booking.room_name})
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Payment Status
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              PAID ₹{booking.total_amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Student Info */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Student Contact
              </span>
              <p className="font-bold text-slate-900 mt-1">{booking.student_name}</p>
              <p className="text-slate-600 flex items-center gap-1 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {booking.student_phone}
              </p>
              <p className="text-slate-600 flex items-center gap-1 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {booking.student_email}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Stay Schedule
              </span>
              <p className="font-bold text-slate-900 mt-1">
                Move-in: {new Date(booking.move_in_date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="text-slate-600">Committed Duration: {booking.stay_duration_months} Months</p>
              <p className="text-[#FF4B26] font-bold font-mono mt-0.5">
                Arrival Passcode: {booking.check_in_code || 'HBX-7742'}
              </p>
            </div>
          </div>

          {/* Bed Allocation Form */}
          <form onSubmit={handleUpdateBed} className="p-5 rounded-2xl border border-slate-200 space-y-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Room & Bed Handover Management
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Assigned Bed Number</label>
                <input
                  type="text"
                  required
                  value={bedInput}
                  onChange={(e) => setBedInput(e.target.value)}
                  placeholder="e.g. Room 204 • Bed A"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Check-in State</label>
                <div className="px-3.5 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-800 capitalize">
                  {booking.status === 'completed' ? 'Checked In (Keys Handed Over)' : 'Pending Student Arrival'}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Save Bed Allocation & Confirm Arrival'}
            </button>
          </form>

          {/* Payment Breakdown */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF] space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Payment Record
            </span>
            <div className="flex justify-between text-slate-700">
              <span>Advance Rent for Month 1:</span>
              <span className="font-bold text-slate-900">₹{booking.advance_rent.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Security Deposit:</span>
              <span className="font-bold text-slate-900">₹{booking.security_deposit.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
              <span>Total Booking Amount:</span>
              <span className="text-[#FF4B26]">₹{booking.total_amount.toLocaleString('en-IN')}</span>
            </div>

            {booking.remaining_balance_amount > 0 && (
              <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-amber-800 font-bold block text-xs">
                    Balance Due on Arrival: ₹{booking.remaining_balance_amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-amber-700">
                    Student selected Pay at Property or partial token advance.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const conf = window.confirm(`Mark ₹${booking.remaining_balance_amount.toLocaleString('en-IN')} collected from ${booking.student_name}?`);
                    if (!conf) return;
                    const updated = await HabituxAPI.ownerCollectPropertyPayment(booking.id);
                    setBooking(updated);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Mark Payment Received at Property
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
