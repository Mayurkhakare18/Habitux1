import React, { useState } from 'react';
import { Hostel, RoomType, Booking, UserProfile } from '../../types';
import { HabituxAPI } from '../../lib/supabase';
import { 
  X, 
  CalendarCheck, 
  ShieldCheck, 
  Bed, 
  Clock, 
  Sparkles, 
  IndianRupee, 
  Check, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { RazorpayModal } from '../payments/RazorpayModal';

interface BookingModalProps {
  hostel: Hostel;
  selectedRoom: RoomType | null;
  currentUser: UserProfile | null;
  onClose: () => void;
  onBookingSuccess: (booking: Booking, paymentTx: any) => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  hostel,
  selectedRoom: initialRoom,
  currentUser,
  onClose,
  onBookingSuccess,
  onShowToast,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    initialRoom?.id || hostel.room_types[0]?.id || ''
  );
  const [moveInDate, setMoveInDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [stayDurationMonths, setStayDurationMonths] = useState(11);
  const [fullName, setFullName] = useState(currentUser?.full_name || 'Priyanshu Roy');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(currentUser?.email || 'priyanshu.student@habitux.in');
  const [specialRequests, setSpecialRequests] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);

  // Active Razorpay order
  const [activeOrderData, setActiveOrderData] = useState<{
    booking: Booking;
    razorpayOrder: any;
  } | null>(null);

  const activeRoom = hostel.room_types.find((r) => r.id === selectedRoomId) || hostel.room_types[0];

  if (!activeRoom) return null;

  // Financial breakdown calculation
  const monthlyRent = activeRoom.monthly_rent;
  const advanceRent = monthlyRent; // 1st month advance
  const securityDeposit = hostel.security_deposit || 5000;
  const brokerage = 0; // ZERO Brokerage Guarantee!
  const totalAdvancePayable = advanceRent + securityDeposit;

  const handleInitiateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      onShowToast('error', 'Please provide student name, phone, and email');
      return;
    }

    if (activeRoom.available_beds <= 0) {
      onShowToast('error', 'Sorry, this room type is fully booked. Please select another sharing option.');
      return;
    }

    setCreatingOrder(true);
    try {
      const orderPayload = await HabituxAPI.createBookingOrder({
        studentId: currentUser?.id || 'usr-student-demo',
        studentName: fullName,
        studentPhone: phone,
        studentEmail: email,
        hostelId: hostel.id,
        roomTypeId: activeRoom.id,
        moveInDate,
        stayDurationMonths,
        occupantsCount: 1,
        specialRequests,
      });

      onBookingSuccess(orderPayload.booking, orderPayload.razorpayOrder);
    } catch (err: any) {
      console.error(err);
      onShowToast('error', err?.message || 'Failed to initiate booking order');
    } finally {
      setCreatingOrder(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
        <div 
          className="bg-white w-full max-w-xl rounded-3xl border border-[#EDE8DF] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#EDE8DF] flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm font-heading">
                  Reserve Bed & Book Online
                </h3>
                <p className="text-[11px] text-[#FF4B26] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Zero Brokerage Guarantee
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleInitiateBooking} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Property Summary Strip */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF] flex items-center gap-3">
              <img
                src={hostel.images[0]?.storage_path || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=200&q=80'}
                alt=""
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="truncate">
                <h4 className="font-extrabold text-xs text-slate-900 truncate font-heading">{hostel.name}</h4>
                <p className="text-[11px] text-slate-500 truncate">{hostel.locality}, {hostel.city}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-md">
                    Verified Accommodation
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {hostel.gender_policy}
                  </span>
                </div>
              </div>
            </div>

            {/* Room Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                1. Select Room Sharing Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {hostel.room_types.map((room) => {
                  const isSelected = room.id === selectedRoomId;
                  const isAvailable = room.available_beds > 0;
                  return (
                    <div
                      key={room.id}
                      onClick={() => isAvailable && setSelectedRoomId(room.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[#FF4B26] bg-[#FFF1ED]/40 shadow-xs ring-1 ring-[#FF4B26]'
                          : isAvailable
                          ? 'border-[#EDE8DF] bg-white hover:border-slate-300'
                          : 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-900">{room.room_name}</span>
                        <span className="text-xs font-extrabold text-[#FF4B26]">
                          ₹{room.monthly_rent.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500">/mo</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span>{room.sharing_capacity === 1 ? 'Private Room' : `${room.sharing_capacity} Sharing`}</span>
                        <span>•</span>
                        <span>{room.air_conditioned ? 'AC' : 'Non-AC'}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className={`font-bold ${isAvailable ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {isAvailable ? `${room.available_beds} beds left` : 'Fully Booked'}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#FF4B26] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Move-in Date & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Move-in Date
                </label>
                <input
                  type="date"
                  required
                  value={moveInDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#FF4B26]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Stay Commitment
                </label>
                <select
                  value={stayDurationMonths}
                  onChange={(e) => setStayDurationMonths(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#FF4B26]/30 cursor-pointer"
                >
                  <option value={1}>1 Month (Trial Stay)</option>
                  <option value={3}>3 Months (Quarterly)</option>
                  <option value={6}>6 Months (Semester)</option>
                  <option value={11}>11 Months (Full Academic Session)</option>
                </select>
              </div>
            </div>

            {/* Student Contact Info */}
            <div className="space-y-2 border-t border-[#EDE8DF] pt-4">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                2. Student Resident Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Full Legal Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs text-slate-800 placeholder:text-slate-400"
                />
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp Mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs text-slate-800 placeholder:text-slate-400"
                />
                <input
                  type="email"
                  required
                  placeholder="Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Special Requests or Preferences (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Prefer top bunk, need study lamp, vegetarian mess table"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Transparent Financial Price Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Transparent Fee Itemization
              </span>

              <div className="flex justify-between text-slate-600">
                <span>1st Month Advance Rent:</span>
                <span className="font-semibold text-slate-900">₹{advanceRent.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Refundable Security Deposit (To Owner):</span>
                <span className="font-semibold text-slate-900">₹{securityDeposit.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Brokerage / Agent Fee:
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="line-through text-slate-400 font-normal">₹7,500</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px]">₹0 FREE</span>
                </span>
              </div>

              <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-300">
                <span>Total Advance Payable:</span>
                <span className="text-[#FF4B26]">₹{totalAdvancePayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Submit Proceed Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={creatingOrder || activeRoom.available_beds <= 0}
                className="w-full py-3.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#FF4B26]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {creatingOrder ? (
                  'Preparing Razorpay Order...'
                ) : (
                  <>
                    Proceed to Reserve & Pay ₹{totalAdvancePayable.toLocaleString('en-IN')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Razorpay Gateway Modal */}
      {activeOrderData && (
        <RazorpayModal
          booking={activeOrderData.booking}
          razorpayOrder={activeOrderData.razorpayOrder}
          onClose={() => setActiveOrderData(null)}
          onSuccess={(confirmedBooking, paymentTx) => {
            setActiveOrderData(null);
            onBookingSuccess(confirmedBooking, paymentTx);
          }}
          onShowToast={onShowToast}
        />
      )}
    </>
  );
};
