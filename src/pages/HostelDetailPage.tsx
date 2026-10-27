import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { HabituxAPI } from '../lib/supabase';
import { Hostel, RoomType, Booking } from '../types';

import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ReviewSection } from '../components/hostels/ReviewSection';
import { BookingModal } from '../components/hostels/BookingModal';
import { ContactOwnerModal } from '../components/hostels/ContactOwnerModal';
import { Toast, ToastMessage } from '../components/ui/Toast';
import { 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Scale, 
  CalendarCheck, 
  Utensils, 
  Wifi, 
  Zap, 
  Clock, 
  Users, 
  Check, 
  Star, 
  Lock, 
  ChevronRight, 
  ChevronLeft,
  MessageCircle,
  ArrowLeft,
  Sparkles,
  Bed,
  CheckCircle2
} from 'lucide-react';

export const HostelDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = `t-${Date.now()}`;
    setToasts((p) => [...p, { id, type, text }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  };

  const loadHostel = () => {
    if (!slug) return;
    setLoading(true);
    HabituxAPI.getHostelBySlug(slug)
      .then((h) => {
        if (h) {
          setHostel(h);
          setSelectedRoom(h.room_types[0] || null);
        }
      })
      .finally(() => setLoading(false));

    if (user && slug) {
      HabituxAPI.getHostelBySlug(slug).then((h) => {
        if (h) {
          HabituxAPI.getFavorites(user.id).then((favs) => {
            setIsFavorite(favs.includes(h.id));
          });
        }
      });
    }
  };

  useEffect(() => {
    loadHostel();
  }, [slug, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!hostel) return;
    const added = await HabituxAPI.toggleFavorite(user.id, hostel.id);
    setIsFavorite(added);
    addToast('success', added ? 'Saved to your favorites!' : 'Removed from favorites');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF4B26]/30 border-t-[#FF4B26] rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500 mt-4">Loading accommodation details...</p>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-[#EDE8DF] text-center space-y-3 max-w-md">
          <h2 className="text-xl font-extrabold text-[#0F172A] font-heading">
            Accommodation Not Found
          </h2>
          <p className="text-xs text-slate-500">
            The property listing you requested may have been archived or unpublished.
          </p>
          <button
            onClick={() => navigate('/hostels')}
            className="px-5 py-2.5 bg-[#FF4B26] text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Return to Hostel Search
          </button>
        </div>
      </div>
    );
  }

  const images = hostel.images?.length
    ? hostel.images
    : [
        {
          id: 'def',
          hostel_id: hostel.id,
          storage_path: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
          display_order: 1,
        },
      ];

  const totalBedsLeft = hostel.room_types.reduce((sum, r) => sum + r.available_beds, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] flex flex-col selection:bg-[#FFE4DC] selection:text-[#FF4B26]">
      <Navbar
        currentUser={user}
        activeTab="hostels"
        onNavigate={(tab) => {
          if (tab === 'student_dashboard') navigate('/student/dashboard');
          else if (tab === 'owner_dashboard') navigate('/owner/dashboard');
          else if (tab === 'admin_dashboard') navigate('/admin/dashboard');
          else if (tab === 'compare') navigate('/compare');
          else navigate('/');
        }}
        onOpenAuth={() => navigate('/login')}
        onSignOut={async () => {
          await signOut();
          addToast('info', 'Signed out successfully');
        }}
        savedCount={0}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-[#EDE8DF] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Link to="/" className="hover:text-[#FF4B26]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/hostels" className="hover:text-[#FF4B26]">Hostels</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900 truncate max-w-xs">{hostel.name}</span>
          </div>

          <button
            onClick={() => navigate('/hostels')}
            className="flex items-center gap-1 text-slate-500 hover:text-[#FF4B26] font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Search
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Title & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                VERIFIED ACCOMMODATION
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-semibold uppercase">
                {hostel.gender_policy}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFF1ED] text-[#FF4B26] text-xs font-bold border border-[#FFE4DC]">
                0% BROKERAGE GUARANTEE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-heading">
              {hostel.name}
            </h1>

            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {hostel.address_line}, {hostel.locality}, {hostel.city}, {hostel.state}
              <span className="font-semibold text-[#FF4B26] ml-2">
                • {hostel.nearest_college_or_hub}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-[#EDE8DF] text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isFavorite ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative aspect-16/10 rounded-3xl overflow-hidden bg-slate-100 border border-[#EDE8DF] shadow-xs group">
            <img
              src={images[activeImgIndex]?.storage_path}
              alt={images[activeImgIndex]?.caption || hostel.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImgIndex((p) => (p - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveImgIndex((p) => (p + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
            <div className="absolute bottom-3 left-4 px-3 py-1 bg-black/60 backdrop-blur-xs rounded-xl text-white text-xs font-medium">
              {images[activeImgIndex]?.caption || 'Spacious verified room'}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="md:col-span-4 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[460px]">
            {images.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => setActiveImgIndex(idx)}
                className={`relative aspect-16/10 md:h-32 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all shrink-0 ${
                  activeImgIndex === idx ? 'border-[#FF4B26] shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.storage_path} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Details & Sticky Checkout Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details, Rooms, Amenities & Reviews */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Highlights Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Available Beds</span>
                <span className="text-base font-extrabold text-emerald-700 flex items-center gap-1 font-heading">
                  <Bed className="w-4 h-4" /> {totalBedsLeft} Beds Left
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Food Plan</span>
                <span className="text-base font-extrabold text-slate-900 flex items-center gap-1 font-heading">
                  <Utensils className="w-4 h-4 text-emerald-600" /> {hostel.food_available ? '3x Meals' : 'No Mess'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wi-Fi Speed</span>
                <span className="text-base font-extrabold text-slate-900 flex items-center gap-1 font-heading">
                  <Wifi className="w-4 h-4 text-blue-600" /> {hostel.wifi_speed_mbps || 100} Mbps
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Curfew Gate</span>
                <span className="text-base font-extrabold text-slate-900 flex items-center gap-1 font-heading">
                  <Clock className="w-4 h-4 text-purple-600" /> {hostel.curfew_policy || 'No Curfew'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-xl font-extrabold text-[#0F172A] font-heading">
                About {hostel.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {hostel.description}
              </p>
            </div>

            {/* Room Options & Live Bed Inventory */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0F172A] font-heading">
                    Room Types & Pricing
                  </h2>
                  <p className="text-xs text-slate-500">
                    Transparent rates with zero agent commissions or hidden surprise fees
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                  Select a room to book directly
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hostel.room_types.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  const isAvail = room.available_beds > 0;
                  return (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[#FF4B26] bg-[#FFF1ED]/40 shadow-xs ring-1 ring-[#FF4B26]'
                          : isAvail
                          ? 'border-[#EDE8DF] bg-white hover:border-slate-300'
                          : 'border-slate-200 bg-slate-50 opacity-60'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900 font-heading">
                            {room.room_name}
                          </h3>
                          <span className="text-xs text-slate-500">
                            {room.sharing_capacity === 1 ? 'Single Room' : `${room.sharing_capacity} Sharing`} • {room.air_conditioned ? 'Air Conditioned' : 'Non-AC'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-[#FF4B26] font-heading">
                            ₹{room.monthly_rent.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-500 block">/month</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                        {room.description || 'Equipped with individual study tables, ergonomic chairs, and geyser washrooms.'}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className={`text-xs font-bold ${isAvail ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {isAvail ? `${room.available_beds} beds remaining` : 'Waitlist only'}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoom(room);
                            setBookingModalOpen(true);
                          }}
                          disabled={!isAvail}
                          className="px-3 py-1.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer disabled:opacity-40"
                        >
                          Book Online
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenities & House Rules Grid */}
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#0F172A] font-heading">
                Policies, Amenities & House Rules
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] space-y-1">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Electricity Charges
                  </span>
                  <p className="text-slate-600">
                    {hostel.electricity_policy}: {hostel.electricity_charge || 'Digital submeter billing'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] space-y-1">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-emerald-600" /> Meal Plan & Dining
                  </span>
                  <p className="text-slate-600">{hostel.meal_plan_description || 'Breakfast, lunch and dinner included'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] space-y-1">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" /> Visitor & Parents Policy
                  </span>
                  <p className="text-slate-600">{hostel.visitor_policy || 'Parents welcome in reception parlor'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] space-y-1">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Security & CCTV
                  </span>
                  <p className="text-slate-600">{hostel.security_features?.join(', ') || 'CCTV & Biometric lock'}</p>
                </div>
              </div>
            </div>

            {/* Module 1: Comprehensive Reviews & Ratings Section */}
            <ReviewSection
              hostel={hostel}
              onReviewChanged={loadHostel}
              onShowToast={addToast}
            />
          </div>

          {/* Sticky Checkout & Contact Rail (Right Column) */}
          <div className="lg:col-span-4 sticky top-22 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-[#EDE8DF] shadow-md space-y-4">
              <div>
                <span className="text-xs text-slate-500 font-medium">Monthly Rent starts from</span>
                <div className="text-3xl font-black text-[#0F172A] font-heading">
                  ₹{hostel.monthly_rent_min.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-slate-500"> /month</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Security Deposit: <strong className="text-slate-800">₹{hostel.security_deposit.toLocaleString('en-IN')}</strong> (Refundable)
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Zero Brokerage Guarantee</span>
              </div>

              {/* Action Buttons: Book Online & Schedule Visit / Chat */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full py-3.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-sm rounded-xl shadow-md shadow-[#FF4B26]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Bed className="w-4 h-4" />
                  Reserve Room & Pay Advance
                </button>

                <button
                  onClick={() => setContactModalOpen(true)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Owner & Schedule Visit
                </button>

                {hostel.owner_phone && (
                  <button
                    onClick={() => {
                      const cleanNumber = hostel.owner_phone!.replace(/\D/g, '');
                      const text = encodeURIComponent(`Hello! I saw ${hostel.name} on Habitux and want to ask about room availability.`);
                      window.open(`https://wa.me/91${cleanNumber}?text=${text}`, '_blank');
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp Landlord Directly
                  </button>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p>• Zero middleman broker commissions</p>
                <p>• Verified meals & hygienic study environment</p>
                <p>• Official Habitux booking confirmation & tax invoice</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Online Bed Booking Modal */}
      {bookingModalOpen && (
        <BookingModal
          hostel={hostel}
          selectedRoom={selectedRoom}
          currentUser={user}
          onClose={() => setBookingModalOpen(false)}
          onBookingSuccess={(confirmedBooking) => {
            setBookingModalOpen(false);
            navigate(`/student/bookings/confirm/${confirmedBooking.id}`);
          }}
          onShowToast={addToast}
        />
      )}

      {/* Direct Contact Owner Modal */}
      {contactModalOpen && (
        <ContactOwnerModal
          hostel={hostel}
          selectedRoom={selectedRoom}
          currentUser={user}
          onClose={() => setContactModalOpen(false)}
          onShowToast={addToast}
        />
      )}

      <Toast toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />

      <Footer
        onSelectCity={(c) => navigate(`/hostels?city=${encodeURIComponent(c)}`)}
        onNavigate={(tab) => {
          if (tab === 'compare') navigate('/compare');
          else if (tab === 'student_dashboard') navigate('/student/dashboard');
          else if (tab === 'owner_dashboard') navigate('/owner/dashboard');
          else if (tab === 'admin_dashboard') navigate('/admin/dashboard');
          else navigate('/');
        }}
      />
    </div>
  );
};
