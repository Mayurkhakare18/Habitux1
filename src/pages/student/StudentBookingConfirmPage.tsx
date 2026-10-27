import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { Booking, Hostel, RoomType } from '../../types';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Bed, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  Lock, 
  Building2, 
  PhoneCall, 
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';

export const StudentBookingConfirmPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mandatory Policy Acknowledgements
  const [agreeRules, setAgreeRules] = useState(false);
  const [agreeCancellation, setAgreeCancellation] = useState(false);
  const [agreePayment, setAgreePayment] = useState(false);

  // 15-Minute Countdown Timer
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(15 * 60);

  // Edit Booking Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editRoomId, setEditRoomId] = useState('');
  const [editMoveInDate, setEditMoveInDate] = useState('');
  const [editDuration, setEditDuration] = useState(11);
  const [editOccupants, setEditOccupants] = useState(1);
  const [updatingBooking, setUpdatingBooking] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Active Photo Carousel index
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const loadData = async () => {
    if (!bookingId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const b = await HabituxAPI.getBookingById(bookingId);
      if (!b) {
        setErrorMsg('Booking request not found. It may have expired or been removed.');
        return;
      }
      setBooking(b);
      setEditRoomId(b.room_type_id);
      setEditMoveInDate(b.move_in_date);
      setEditDuration(b.stay_duration_months);
      setEditOccupants(b.occupants_count || 1);

      // Load hostel
      const h = await HabituxAPI.getHostelById(b.hostel_id);
      setHostel(h);

      // Calculate remaining hold time
      if (b.hold_expires_at) {
        const remaining = Math.max(0, Math.floor((new Date(b.hold_expires_at).getTime() - Date.now()) / 1000));
        setTimeLeftSeconds(remaining);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error loading booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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

  const handleConfirmAndProceed = async () => {
    if (!booking) return;

    if (!agreeRules || !agreeCancellation || !agreePayment) {
      alert('Please acknowledge all 3 terms and policies before confirming.');
      return;
    }

    if (timeLeftSeconds <= 0) {
      alert('Your 15-minute reservation hold has expired. Please create a new booking reservation.');
      navigate(`/hostels/${booking.hostel_slug}`);
      return;
    }

    setConfirming(true);
    try {
      const updated = await HabituxAPI.confirmBookingAndProceedToPayment({
        bookingId: booking.id,
        termsAcknowledged: agreeRules,
        cancellationAcknowledged: agreeCancellation,
        paymentTermsAcknowledged: agreePayment,
      });
      // Navigate to dedicated payment selection page
      navigate(`/student/bookings/${updated.id}/payment`);
    } catch (err: any) {
      alert(err?.message || 'Failed to confirm booking. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    setUpdatingBooking(true);
    try {
      const updated = await HabituxAPI.updateBookingDetails({
        bookingId: booking.id,
        roomTypeId: editRoomId,
        moveInDate: editMoveInDate,
        stayDurationMonths: editDuration,
        occupantsCount: editOccupants,
      });
      setBooking(updated);
      setIsEditing(false);
      // Reset timer to 15 min on successful edit
      setTimeLeftSeconds(15 * 60);
    } catch (err: any) {
      alert(err?.message || 'Failed to update booking');
    } finally {
      setUpdatingBooking(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    const confirmed = window.confirm(
      'Are you sure you want to cancel this pending booking? The temporary room hold will be released immediately.'
    );
    if (!confirmed) return;

    try {
      await HabituxAPI.cancelBooking(booking.id, 'Cancelled by student before confirmation');
      navigate('/student/explore');
    } catch (err) {
      console.error(err);
      alert('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-[#FF4B26]/20 border-t-[#FF4B26] rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500 mt-4 font-heading">
          Validating Room Availability & Lock...
        </p>
      </div>
    );
  }

  if (errorMsg || !booking || !hostel) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-[#EDE8DF] shadow-md text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-extrabold text-[#0F172A] font-heading">
            Booking Reservation Unavailable
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {errorMsg || 'The requested booking could not be loaded.'}
          </p>
          <button
            onClick={() => navigate('/student/explore')}
            className="w-full py-3 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Explore Available Hostels
          </button>
        </div>
      </div>
    );
  }

  const allAcknowledged = agreeRules && agreeCancellation && agreePayment && timeLeftSeconds > 0;
  const isHoldExpired = timeLeftSeconds <= 0;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        
        {/* Navigation & Step Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE8DF]">
          <button
            onClick={() => navigate(`/hostels/${booking.hostel_slug}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Hostel Details
          </button>

          {/* Stepper */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4B26] text-white">
              <span className="w-4 h-4 rounded-full bg-white text-[#FF4B26] text-[10px] font-black flex items-center justify-center">1</span>
              Review & Confirm
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-600">
              <span className="w-4 h-4 rounded-full bg-slate-400 text-white text-[10px] font-black flex items-center justify-center">2</span>
              Payment Method
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-600">
              <span className="w-4 h-4 rounded-full bg-slate-400 text-white text-[10px] font-black flex items-center justify-center">3</span>
              Receipt
            </span>
          </div>
        </div>

        {/* 15-Minute Bed Hold Countdown Banner */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
          isHoldExpired 
            ? 'bg-rose-50 border-rose-200 text-rose-800' 
            : timeLeftSeconds < 180 
            ? 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse' 
            : 'bg-[#FFF1ED] border-[#FFE4DC] text-[#0F172A]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isHoldExpired ? 'bg-rose-200 text-rose-800' : 'bg-[#FF4B26] text-white'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider font-heading flex items-center gap-1.5">
                <span>Temporary Bed Hold Active</span>
                <span className="px-2 py-0.5 rounded-full bg-white/80 text-[10px] font-bold">15-Min Lock</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {isHoldExpired 
                  ? 'Your reservation lock has expired. Other students may now reserve this remaining bed.' 
                  : 'This bed is locked exclusively for you. Complete confirmation before the timer expires.'}
              </p>
            </div>
          </div>

          <div className="text-right sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Time Remaining</span>
            <span className={`text-xl font-black font-mono tracking-wider ${isHoldExpired ? 'text-rose-600' : 'text-[#FF4B26]'}`}>
              {formatTimer(timeLeftSeconds)}
            </span>
          </div>
        </div>

        {/* Main Grid: Left = Summary & Terms, Right = Pricing Breakdown & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Property & Room Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Property Card */}
            <div className="bg-white rounded-3xl border border-[#EDE8DF] shadow-xs overflow-hidden">
              <div className="relative h-56 sm:h-64 bg-slate-900">
                <img
                  src={hostel.images[activeImgIndex]?.storage_path || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80'}
                  alt={hostel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Thumbnails */}
                {hostel.images && hostel.images.length > 1 && (
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {hostel.images.map((img, i) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setActiveImgIndex(i)}
                        className={`w-12 h-9 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          activeImgIndex === i ? 'border-[#FF4B26] scale-105' : 'border-white/50 opacity-70'
                        }`}
                      >
                        <img src={img.storage_path} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Listing
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#FF4B26] text-white text-[11px] font-extrabold uppercase">
                    {hostel.gender_policy}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] font-heading">
                    {hostel.name}
                  </h1>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FF4B26] shrink-0" />
                    {hostel.address_line}, {hostel.locality}, {hostel.city} - {hostel.postal_code || '324008'}
                  </p>
                </div>

                {/* Owner Information Box */}
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                      {hostel.owner_name ? hostel.owner_name.charAt(0) : 'O'}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Verified Property Host
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {hostel.owner_name || 'Rajesh Verma (Hostel Owner)'}
                      </span>
                    </div>
                  </div>

                  {hostel.owner_phone && (
                    <a
                      href={`tel:${hostel.owner_phone}`}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#EDE8DF] text-[11px] font-bold text-slate-700 hover:text-[#FF4B26] flex items-center gap-1 transition-colors"
                    >
                      <PhoneCall className="w-3 h-3 text-emerald-600" />
                      Contact Host
                    </a>
                  )}
                </div>

                {/* Selected Room Specs */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center">
                        <Bed className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 font-heading">
                          {booking.room_name}
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          {booking.sharing_capacity === 1 ? 'Single Private Room' : `${booking.sharing_capacity} Person Sharing`}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-[#FF4B26]" />
                      Edit Details
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Move-in Date</span>
                      <span className="font-extrabold text-slate-900">
                        {new Date(booking.move_in_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Stay Duration</span>
                      <span className="font-extrabold text-slate-900">{booking.stay_duration_months} Months</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Occupants</span>
                      <span className="font-extrabold text-slate-900">{booking.occupants_count || 1} Student</span>
                    </div>
                  </div>
                </div>

                {/* House Rules & Policies Snapshot */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block">
                    Property Terms & House Rules
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-900 block">Gate Curfew</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">{hostel.curfew_policy || '10:00 PM Biometric lock'}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-900 block">Electricity</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">{hostel.electricity_policy}: {hostel.electricity_charge || 'Digital submeter'}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-900 block">Food Plan</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">{hostel.meal_plan_description || 'Breakfast & dinner included'}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-900 block">Cancellation Policy</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">{hostel.cancellation_policy || '15 days advance notice for refund'}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Mandatory Terms & Policy Acknowledgement Section */}
            <div className="bg-white p-6 rounded-3xl border border-[#EDE8DF] shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FF4B26]" />
                <h3 className="font-extrabold text-slate-900 text-sm font-heading">
                  Student Acknowledgements & Agreements
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                To guarantee your bed reservation and maintain housing integrity, please review and accept the following terms:
              </p>

              <div className="space-y-3 pt-1">
                {/* Checkbox 1: House rules */}
                <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={agreeRules}
                    onChange={(e) => setAgreeRules(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#FF4B26] focus:ring-[#FF4B26] cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">
                      1. I agree to the Hostel House Rules, Curfew & Visitor Policy
                    </span>
                    <span className="text-slate-500 text-[11px] mt-0.5 block">
                      I understand that curfew ({hostel.curfew_policy || '10:00 PM'}) and resident visitor protocols will be enforced for safety.
                    </span>
                  </div>
                </label>

                {/* Checkbox 2: Cancellation */}
                <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={agreeCancellation}
                    onChange={(e) => setAgreeCancellation(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#FF4B26] focus:ring-[#FF4B26] cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">
                      2. I acknowledge the Cancellation & Security Deposit Refund Policy
                    </span>
                    <span className="text-slate-500 text-[11px] mt-0.5 block">
                      Security deposits are refundable upon completion of stay term subject to property damage clearance and notice rules.
                    </span>
                  </div>
                </label>

                {/* Checkbox 3: Payment terms */}
                <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={agreePayment}
                    onChange={(e) => setAgreePayment(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#FF4B26] focus:ring-[#FF4B26] cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">
                      3. I agree to the Payment Schedule & Advance Amount Terms
                    </span>
                    <span className="text-slate-500 text-[11px] mt-0.5 block">
                      I confirm the move-in date and understand that any remaining balance is due at property check-in or next monthly billing cycle.
                    </span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Transparent Pricing & Confirmation Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white p-6 rounded-3xl border border-[#EDE8DF] shadow-md space-y-5 sticky top-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 font-heading">
                  Price Breakdown
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Ref: {booking.booking_reference}
                </span>
              </div>

              {/* Itemized Pricing Table */}
              <div className="space-y-2.5 text-xs">
                
                <div className="flex items-center justify-between text-slate-600">
                  <span>Monthly Room Rent ({booking.room_name}):</span>
                  <span className="font-bold text-slate-900">₹{booking.monthly_rent.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-1">
                    <span>Refundable Security Deposit:</span>
                    <span className="text-[10px] text-slate-400" title="Returned at end of stay">(Refundable)</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{booking.security_deposit.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>First Month Advance Booking:</span>
                  <span className="font-bold text-slate-900">₹{booking.advance_rent.toLocaleString('en-IN')}</span>
                </div>

                {/* Taxes & Zero Brokerage */}
                <div className="flex items-center justify-between text-emerald-700 font-semibold pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Habitux Zero Brokerage:
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="line-through text-slate-400 font-normal">₹7,500</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">₹0 FREE</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>GST & Platform Charges:</span>
                  <span className="font-semibold text-slate-700">₹0 (Included)</span>
                </div>

                {/* Pay at Property indicator if configured */}
                {hostel.pay_at_property_enabled && booking.remaining_balance_amount > 0 && (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold text-blue-900">
                      <span>Token Advance Online ({hostel.advance_percentage_required || 20}%):</span>
                      <span>₹{booking.booking_advance_amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-blue-700">
                      <span>Due Upon Arrival at Property:</span>
                      <span className="font-semibold">₹{booking.remaining_balance_amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                {/* Total Amounts */}
                <div className="pt-3 border-t border-slate-200 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-extrabold text-slate-900 text-sm">
                      Total Payable Now:
                    </span>
                    <span className="text-2xl font-black text-[#FF4B26] font-heading">
                      ₹{booking.booking_advance_amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {booking.remaining_balance_amount > 0 && (
                    <div className="flex justify-between text-xs text-slate-500 pt-0.5">
                      <span>Remaining Balance (Due Later):</span>
                      <span className="font-bold text-slate-700">₹{booking.remaining_balance_amount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmAndProceed}
                  disabled={!allAcknowledged || confirming}
                  className="w-full py-4 bg-[#FF4B26] hover:bg-[#E03713] active:scale-98 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-[#FF4B26]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {confirming ? (
                    'Securing Room Hold...'
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Confirm Hostel & Proceed to Payment
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    Edit Booking
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelBooking}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500" />
                    Cancel Booking
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Instant Bed Lock & Guaranteed Allocation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Official GST Tax Invoice Generated</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct Communication with Property Owner</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Edit Booking Dialog Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl border border-[#EDE8DF] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm font-heading">
                  Edit Reservation Parameters
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Room Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Select Room Sharing Type
                </label>
                <div className="space-y-2">
                  {hostel.room_types.map((rt) => (
                    <label
                      key={rt.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        editRoomId === rt.id
                          ? 'border-[#FF4B26] bg-[#FFF1ED]/40 ring-1 ring-[#FF4B26]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="roomType"
                          value={rt.id}
                          checked={editRoomId === rt.id}
                          onChange={() => setEditRoomId(rt.id)}
                          className="text-[#FF4B26] focus:ring-[#FF4B26]"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{rt.room_name}</span>
                          <span className="text-[11px] text-slate-500">
                            {rt.sharing_capacity === 1 ? 'Single' : `${rt.sharing_capacity} Sharing`} • {rt.available_beds} beds left
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#FF4B26]">
                        ₹{rt.monthly_rent.toLocaleString('en-IN')}/mo
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Move-in Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Move-in Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={editMoveInDate}
                  onChange={(e) => setEditMoveInDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                />
              </div>

              {/* Duration & Occupants */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Duration
                  </label>
                  <select
                    value={editDuration}
                    onChange={(e) => setEditDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                  >
                    <option value={1}>1 Month (Trial)</option>
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={11}>11 Months (Full Academic Session)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Occupants
                  </label>
                  <select
                    value={editOccupants}
                    onChange={(e) => setEditOccupants(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                  >
                    <option value={1}>1 Student</option>
                    <option value={2}>2 Students</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingBooking}
                  className="px-5 py-2 bg-[#FF4B26] hover:bg-[#E03713] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {updatingBooking ? 'Updating...' : 'Save & Recalculate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
