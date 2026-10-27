import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Scale, 
  PhoneCall, 
  MessageCircle, 
  CalendarCheck, 
  Utensils, 
  Wifi, 
  Zap, 
  Shirt, 
  Clock, 
  Users, 
  Check, 
  Star,
  Send,
  Building2,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Hostel, RoomType, Review, UserProfile } from '../../types';

interface HostelDetailModalProps {
  hostel: Hostel | null;
  currentUser: UserProfile | null;
  isFavorite: boolean;
  isCompared: boolean;
  onClose: () => void;
  onToggleFavorite: (hostelId: string) => void;
  onToggleCompare: (hostel: Hostel) => void;
  onEnquire: (hostel: Hostel, selectedRoom?: RoomType) => void;
  onSubmitReview: (hostelId: string, rating: number, text: string) => Promise<void>;
  reviews: Review[];
}

export const HostelDetailModal: React.FC<HostelDetailModalProps> = ({
  hostel,
  currentUser,
  isFavorite,
  isCompared,
  onClose,
  onToggleFavorite,
  onToggleCompare,
  onEnquire,
  onSubmitReview,
  reviews,
}) => {
  if (!hostel) return null;

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<RoomType>(hostel.room_types[0] || null);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const images = hostel.images && hostel.images.length > 0 
    ? hostel.images 
    : [{ id: 'd1', hostel_id: hostel.id, storage_path: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', display_order: 1 }];

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    setReviewSubmitting(true);
    try {
      await onSubmitReview(hostel.id, newRating, newReviewText.trim());
      setNewReviewText('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } finally {
      setReviewSubmitting(false);
    }
  };



  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl border border-[#EDE8DF] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="px-6 py-4 border-b border-[#EDE8DF] flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wide">
              {hostel.property_type}
            </span>
            {hostel.verification_status === 'verified' && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFIED BY HABITUX
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full bg-[#FFF1ED] text-[#FF4B26] font-extrabold text-xs">
              0% BROKERAGE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleCompare(hostel)}
              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                isCompared
                  ? 'bg-[#FF4B26] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">{isCompared ? 'Compared' : 'Compare'}</span>
            </button>

            <button
              onClick={() => onToggleFavorite(hostel.id)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          
          {/* Gallery View */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 md:aspect-21/9 rounded-2xl overflow-hidden bg-slate-900 shadow-md">
              <img
                src={images[activeImgIndex]?.storage_path}
                alt={hostel.name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg">
                {images[activeImgIndex]?.caption || hostel.name}
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      idx === activeImgIndex ? 'border-[#FF4B26] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.storage_path} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Core Location Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-heading">
                {hostel.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <MapPin className="w-4 h-4 text-[#FF4B26]" />
                  {hostel.address_line}, {hostel.locality}, {hostel.city}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-md">
                  {hostel.nearest_college_or_hub}
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed pt-2">
                {hostel.description}
              </p>
            </div>

            {/* Price Box & Quick Action */}
            <div className="lg:col-span-4 bg-[#FAF8F5] p-5 rounded-2xl border border-[#EDE8DF] space-y-3">
              <div>
                <span className="text-xs text-slate-500 font-medium">Monthly Rent starts from</span>
                <div className="text-2xl sm:text-3xl font-black text-[#0F172A] font-heading">
                  ₹{hostel.monthly_rent_min.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-slate-500"> /month</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Deposit: <span className="font-semibold text-slate-800">₹{hostel.security_deposit.toLocaleString('en-IN')}</span> (Refundable)
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onEnquire(hostel, selectedRoom)}
                  className="w-full py-3 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-sm rounded-xl shadow-md shadow-[#FF4B26]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Schedule Free Visit
                </button>

                <a
                  href={`https://wa.me/${hostel.owner_phone ? hostel.owner_phone.replace(/[^0-9]/g, '') : '919876543210'}?text=${encodeURIComponent(`Hello! I saw ${hostel.name} in ${hostel.locality}, ${hostel.city} on HABITUX. I would like to enquire about room availability.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat with Owner on WhatsApp
                </a>
              </div>

              <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Zero brokerage guarantee. Direct owner booking.
              </div>
            </div>
          </div>

          {/* Room Types & Live Availability Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] font-heading">
                  Room Types & Live Bed Availability
                </h3>
                <p className="text-xs text-slate-500">
                  Select a room type to calculate exact rent and schedule a visit
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hostel.room_types.map((room) => {
                const isSelected = selectedRoom?.id === room.id;
                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#FF4B26] bg-[#FFF1ED]/30 shadow-sm'
                        : 'border-[#EDE8DF] bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#0F172A] font-heading">
                        {room.room_name}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#FF4B26] text-white flex items-center justify-center text-xs">
                          <Check className="w-3 h-3 stroke-3" />
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-xl font-extrabold text-[#0F172A]">
                      ₹{room.monthly_rent.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-slate-500"> /bed/mo</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                      <span className="text-slate-600">
                        {room.air_conditioned ? 'Air Conditioned' : 'Non-AC / Cooler'}
                      </span>
                      <span className={`font-bold ${room.available_beds > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {room.available_beds > 0 ? `${room.available_beds} beds left` : 'Fully booked'}
                      </span>
                    </div>

                    {room.description && (
                      <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                        {room.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Policies & House Rules Matrix */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#0F172A] font-heading">
              Transparent Policies & House Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-[#EDE8DF] space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FF4B26]" /> Gate Timings & Curfew
                </span>
                <p className="text-slate-600">{hostel.curfew_policy || '10:00 PM (Late pass accessible)'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-[#EDE8DF] space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Electricity Charges
                </span>
                <p className="text-slate-600">
                  {hostel.electricity_policy}: {hostel.electricity_charge || 'Standard submeter billing'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-[#EDE8DF] space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-emerald-600" /> Meal Plan & Dining
                </span>
                <p className="text-slate-600">{hostel.meal_plan_description || 'Breakfast, lunch and dinner included'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-[#EDE8DF] space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" /> Visitor & Parents Policy
                </span>
                <p className="text-slate-600">{hostel.visitor_policy || 'Parents welcome in reception parlor'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-[#EDE8DF] space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Security & Surveillance
                </span>
                <p className="text-slate-600">{hostel.security_features?.join(', ') || 'CCTV & Biometric lock'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-[#EDE8DF] space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-600" /> Deposit Notice & Cancellation
                </span>
                <p className="text-slate-600">{hostel.cancellation_policy || '15-day advance notice'}</p>
              </div>
            </div>
          </div>

          {/* Resident Reviews & Rating Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] font-heading">
                  Verified Resident Reviews
                </h3>
                <p className="text-xs text-slate-500">
                  Reviews from genuine students who have stayed at {hostel.name}
                </p>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {hostel.average_rating || 4.8} / 5
              </div>
            </div>

            {/* Existing Reviews */}
            <div className="space-y-3">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EDE8DF] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                          alt={rev.user_name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-900">{rev.user_name}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                          Verified Stay
                        </span>
                      </div>
                      <div className="flex items-center text-amber-500 text-xs">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rev.review_text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                  No written reviews yet for this newly listed property. Be the first student to review!
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-white border border-[#EDE8DF] space-y-3">
              <span className="text-xs font-bold text-slate-900 block font-heading">
                Leave a Verified Review
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                rows={3}
                placeholder="Share your experience regarding food hygiene, Wi-Fi speed, study quietness, and warden friendliness..."
                className="w-full p-3 text-xs border border-[#EDE8DF] rounded-xl focus:outline-none focus:border-[#FF4B26]"
              />

              {reviewSuccess && (
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Thank you! Your review has been saved and published.
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={reviewSubmitting || !newReviewText.trim()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {reviewSubmitting ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
