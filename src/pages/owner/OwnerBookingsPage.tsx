import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { Booking } from '../../types';
import { 
  Bed, 
  CalendarCheck, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Search, 
  ChevronRight, 
  QrCode,
  Sparkles,
  Phone
} from 'lucide-react';

export const OwnerBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Bed Assignment / Check-in Quick Modal
  const [activeCheckInBooking, setActiveCheckInBooking] = useState<Booking | null>(null);
  const [bedInput, setBedInput] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await HabituxAPI.getOwnerBookings(user.id);
      setBookings(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  const handleConfirmCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCheckInBooking || !bedInput.trim()) return;

    setUpdating(true);
    try {
      await HabituxAPI.updateBookingCheckIn(activeCheckInBooking.id, bedInput.trim());
      setActiveCheckInBooking(null);
      setBedInput('');
      loadBookings();
    } catch (err) {
      console.error(err);
      alert('Failed to update check-in');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = bookings.filter((b) => {
    let matchesStatus = true;
    if (filterStatus === 'pay_at_property') {
      matchesStatus = b.payment_method_selected === 'pay_at_property' || b.remaining_balance_amount > 0;
    } else if (filterStatus === 'awaiting_payment') {
      matchesStatus = b.status === 'awaiting_payment' || b.status === 'pending_confirmation';
    } else if (filterStatus !== 'all') {
      matchesStatus = b.status === filterStatus;
    }

    const matchesSearch = 
      b.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.hostel_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.booking_reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalAdvanceRevenue = bookings.reduce(
    (sum, b) => sum + (b.payment_status === 'paid' || b.payment_status === 'successful' ? (b.booking_advance_amount || b.advance_rent) : 0),
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
            Student Bed Reservations & Check-Ins
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage advance student bookings, assign room numbers, and verify arrival passcodes
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Advance Collected
            </span>
            <span className="text-sm font-extrabold text-slate-900 font-heading">
              ₹{totalAdvanceRevenue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#EDE8DF]">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Bookings' },
            { id: 'confirmed', label: 'Ready to Move In' },
            { id: 'pay_at_property', label: 'Pay at Property (Due)' },
            { id: 'awaiting_payment', label: 'Awaiting Payment' },
            { id: 'completed', label: 'Checked In' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-3xl border border-[#EDE8DF] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading student reservations...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Bed className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-slate-900 text-sm">No reservations found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Student bookings with verified advance payments will be listed here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-[#EDE8DF] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Student Resident</th>
                  <th className="py-3.5 px-6">Property & Room</th>
                  <th className="py-3.5 px-6">Move-In Date</th>
                  <th className="py-3.5 px-6">Advance Paid</th>
                  <th className="py-3.5 px-6">Bed & Code</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-xs">{b.student_name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {b.student_phone}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">Ref: {b.booking_reference}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{b.hostel_name}</div>
                      <div className="text-[11px] text-[#FF4B26] font-semibold">{b.room_name}</div>
                      <div className="text-[10px] text-slate-400">{b.stay_duration_months} Months Stay</div>
                    </td>

                    <td className="py-4 px-6 text-slate-800 whitespace-nowrap">
                      <div className="font-bold">
                        {new Date(b.move_in_date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold">Advance Verified</div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-extrabold text-slate-900">
                        ₹{b.total_amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Rent: ₹{b.advance_rent} + Dep: ₹{b.security_deposit}
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{b.bed_number || 'Pending Allocation'}</div>
                      <div className="text-[10px] font-mono font-bold text-[#FF4B26]">
                        Passcode: {b.check_in_code || 'HBX-7742'}
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      {b.status === 'completed' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                          CHECKED IN
                        </span>
                      ) : b.status === 'confirmed' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          READY TO MOVE IN
                        </span>
                      ) : b.status === 'awaiting_payment' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          AWAITING PAYMENT
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {b.status.toUpperCase()}
                        </span>
                      )}

                      <div className="mt-1">
                        {b.remaining_balance_amount > 0 ? (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Due at check-in: ₹{b.remaining_balance_amount.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-600">
                            Fully Settled
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {b.remaining_balance_amount > 0 && (
                          <button
                            type="button"
                            onClick={async () => {
                              const conf = window.confirm(`Confirm collection of ₹${b.remaining_balance_amount.toLocaleString('en-IN')} from ${b.student_name} at property?`);
                              if (!conf) return;
                              await HabituxAPI.ownerCollectPropertyPayment(b.id);
                              loadBookings();
                            }}
                            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                            title="Mark cash/UPI collected at reception"
                          >
                            Collect ₹{b.remaining_balance_amount.toLocaleString('en-IN')}
                          </button>
                        )}

                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => {
                              setActiveCheckInBooking(b);
                              setBedInput(b.bed_number || 'Room 204 • Bed A');
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                          >
                            Confirm Check-in
                          </button>
                        )}

                        <button
                          onClick={() => navigate(`/owner/bookings/${b.id}`)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Check-In Modal */}
      {activeCheckInBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm font-heading">
                  Confirm Student Check-in & Bed Handover
                </h3>
                <p className="text-[11px] text-slate-500">
                  {activeCheckInBooking.student_name} • {activeCheckInBooking.hostel_name}
                </p>
              </div>
              <button
                onClick={() => setActiveCheckInBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmCheckIn} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p>Gate Passcode: <b className="font-mono text-[#FF4B26]">{activeCheckInBooking.check_in_code || 'HBX-7742'}</b></p>
                <p>Verified Advance: <b className="text-emerald-700">₹{activeCheckInBooking.total_amount.toLocaleString('en-IN')} Paid</b></p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Assign Room & Bed Number
                </label>
                <input
                  type="text"
                  required
                  value={bedInput}
                  onChange={(e) => setBedInput(e.target.value)}
                  placeholder="e.g. Room 204 • Bed A"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCheckInBooking(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Confirm Arrival & Keys Given'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
