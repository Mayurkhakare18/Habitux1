import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Utensils, 
  Wifi, 
  Zap, 
  ShieldCheck, 
  Scale, 
  CalendarCheck, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react';
import { Hostel } from '../../types';

interface HostelCardProps {
  hostel: Hostel;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (hostelId: string) => void;
  onToggleCompare: (hostel: Hostel) => void;
  onSelectHostel: (hostel: Hostel) => void;
  onEnquire: (hostel: Hostel) => void;
}

export const HostelCard: React.FC<HostelCardProps> = ({
  hostel,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onSelectHostel,
  onEnquire,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = hostel.images && hostel.images.length > 0 
    ? hostel.images 
    : [{ id: 'default', hostel_id: hostel.id, storage_path: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', display_order: 1 }];

  const totalAvailableBeds = hostel.room_types.reduce((sum, r) => sum + r.available_beds, 0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EDE8DF] shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_rgba(255,75,38,0.1)] hover:border-[#FF4B26]/30 transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Image Area */}
      <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
        <img
          src={images[activeImageIndex]?.storage_path}
          alt={hostel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {hostel.verification_status === 'verified' && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/95 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              VERIFIED
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold uppercase">
            {hostel.gender_policy}
          </span>
        </div>

        {/* Top-Right Favorite & Compare Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(hostel);
            }}
            title={isCompared ? 'Remove from comparison' : 'Compare this hostel'}
            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isCompared
                ? 'bg-[#FF4B26] text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-[#FF4B26]'
            }`}
          >
            <Scale className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(hostel.id);
            }}
            title={isFavorite ? 'Remove from saved' : 'Save to favorites'}
            className="p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-slate-700 transition-all cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'hover:text-rose-500'}`} />
          </button>
        </div>

        {/* Carousel controls if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-y-1/2 flex gap-1">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === activeImageIndex ? 'bg-white w-3' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Zero Brokerage Bottom Tag */}
        <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-[#FF4B26] text-white font-black text-[10px] tracking-wider uppercase">
          0% BROKERAGE
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Locality & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-[#FF4B26] uppercase tracking-wider">
              {hostel.locality}, {hostel.city}
            </span>
            <div className="flex items-center gap-1 font-bold text-slate-800">
              <span className="text-amber-500">★</span> {hostel.average_rating || 4.7}
              <span className="text-slate-400 font-normal">({hostel.total_reviews || 12})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectHostel(hostel)}
            className="text-base font-bold text-[#0F172A] font-heading group-hover:text-[#FF4B26] transition-colors cursor-pointer line-clamp-1"
          >
            {hostel.name}
          </h3>

          {/* Proximity / College */}
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {hostel.nearest_college_or_hub}
          </p>

          {/* Sharing choices & Available Beds */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
              <Users className="w-3 h-3 text-slate-500" />
              {hostel.room_types.map(r => r.sharing_capacity === 1 ? 'Single' : `${r.sharing_capacity}-Share`).join(' / ')}
            </span>

            {totalAvailableBeds > 0 ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                {totalAvailableBeds} {totalAvailableBeds === 1 ? 'bed' : 'beds'} left
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                Waitlist only
              </span>
            )}
          </div>

          {/* Feature Specs Grid */}
          <div className="mt-3 grid grid-cols-3 gap-1 py-2 border-y border-slate-100 text-[11px] text-slate-600">
            <div className="flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{hostel.food_available ? '3x Food' : 'Self Cook'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{hostel.wifi_speed_mbps || 100} Mbps</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{hostel.power_backup ? 'Backup' : 'Standard'}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <div>
            <div className="text-slate-400 text-[11px] font-medium">Starts from</div>
            <div className="text-lg font-black text-[#0F172A] font-heading">
              ₹{hostel.monthly_rent_min.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-500"> /mo</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectHostel(hostel)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#FF4B26] hover:bg-[#FFF1ED] rounded-lg transition-colors cursor-pointer"
            >
              Details
            </button>
            <button
              onClick={() => onEnquire(hostel)}
              className="px-3.5 py-2 text-xs font-bold bg-[#FF4B26] hover:bg-[#E03713] text-white rounded-lg shadow-sm shadow-[#FF4B26]/20 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              Visit
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
