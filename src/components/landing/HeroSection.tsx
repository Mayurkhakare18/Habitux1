import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Users, 
  Utensils, 
  Wifi, 
  Zap, 
  PhoneCall,
  CalendarCheck
} from 'lucide-react';
import { Hostel } from '../../types';

interface HeroSectionProps {
  onExploreClick: () => void;
  onCompareClick: () => void;
  onListClick: () => void;
  featuredPreviewHostel?: Hostel | null;
  onSelectHostel: (hostel: Hostel) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onCompareClick,
  onListClick,
  featuredPreviewHostel,
  onSelectHostel,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF1ED]/60 via-[#FAF8F5] to-[#FAF8F5] pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#EDE8DF]">
      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-[#FFE4DC]/40 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#FF4B26]/20 shadow-sm text-xs font-semibold text-[#FF4B26]">
              <Sparkles className="w-4 h-4 text-[#FF4B26]" />
              <span>India&apos;s 100% Zero-Brokerage Hostel Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15] font-heading">
              Stop chasing rooms. <br />
              <span className="text-[#FF4B26]">Start living.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#475569] max-w-2xl leading-relaxed font-normal">
              Find verified student hostels, paying guest accommodations, and co-living hubs near your university. Transparent fees, genuine photos, and direct owner connections.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-semibold text-sm rounded-xl shadow-lg shadow-[#FF4B26]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                Explore Hostels
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onCompareClick}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-[#0F172A] font-semibold text-sm rounded-xl border border-[#EDE8DF] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Compare Accommodations
              </button>

              <button
                onClick={onListClick}
                className="w-full sm:w-auto px-5 py-3.5 text-slate-600 hover:text-[#FF4B26] font-semibold text-sm transition-colors cursor-pointer"
              >
                I&apos;m a Hostel Owner →
              </button>
            </div>

            {/* Verified Feature Trust Strip */}
            <div className="pt-6 border-t border-[#EDE8DF]/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900 leading-tight">Zero Brokerage</p>
                  <p className="text-slate-500 text-[11px]">Save up to ₹15,000</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900 leading-tight">100% Verified</p>
                  <p className="text-slate-500 text-[11px]">Real photos & audit</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900 leading-tight">Meal Plans</p>
                  <p className="text-slate-500 text-[11px]">Hygienic 3x food</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900 leading-tight">Direct Owner</p>
                  <p className="text-slate-500 text-[11px]">No middleman</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Property Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative background border glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#FF4B26] to-amber-500 rounded-3xl blur-lg opacity-20 transition duration-1000 group-hover:opacity-100"></div>

              {featuredPreviewHostel ? (
                <div 
                  onClick={() => onSelectHostel(featuredPreviewHostel)}
                  className="relative bg-white rounded-2xl border border-[#EDE8DF] shadow-[0_8px_30px_rgb(15,23,42,0.08)] overflow-hidden cursor-pointer group hover:border-[#FF4B26]/40 transition-all"
                >
                  {/* Image container */}
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img
                      src={featuredPreviewHostel.images[0]?.storage_path}
                      alt={featuredPreviewHostel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-md">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        VERIFIED BY HABITUX
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-semibold text-xs">
                        {featuredPreviewHostel.gender_policy.toUpperCase()}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#FF4B26] text-white font-extrabold text-xs shadow-md">
                      0% BROKERAGE
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#FF4B26] uppercase tracking-wide">
                          {featuredPreviewHostel.locality}, {featuredPreviewHostel.city}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                          ★ {featuredPreviewHostel.average_rating || 4.8}
                          <span className="text-slate-400 font-normal">({featuredPreviewHostel.total_reviews || 42})</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-[#0F172A] mt-1 font-heading group-hover:text-[#FF4B26] transition-colors">
                        {featuredPreviewHostel.name}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {featuredPreviewHostel.nearest_college_or_hub}
                      </p>
                    </div>

                    {/* Quick amenities pill bar */}
                    <div className="flex items-center gap-3 text-xs text-slate-600 border-y border-slate-100 py-2.5">
                      <span className="flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5 text-emerald-600" /> 3x Food
                      </span>
                      <span className="flex items-center gap-1">
                        <Wifi className="w-3.5 h-3.5 text-blue-600" /> {featuredPreviewHostel.wifi_speed_mbps || 100} Mbps
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" /> Backup
                      </span>
                      <span className="ml-auto font-medium text-emerald-600">
                        {featuredPreviewHostel.room_types[0]?.available_beds || 2} beds left
                      </span>
                    </div>

                    {/* Bottom Pricing & Action */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-xs text-slate-400">Starts at</span>
                        <div className="text-xl font-extrabold text-[#0F172A] font-heading">
                          ₹{featuredPreviewHostel.monthly_rent_min.toLocaleString('en-IN')}
                          <span className="text-xs font-medium text-slate-500"> /month</span>
                        </div>
                      </div>

                      <button className="px-4 py-2 bg-[#FFF1ED] hover:bg-[#FFE4DC] text-[#FF4B26] font-bold text-xs rounded-lg transition-colors flex items-center gap-1">
                        <CalendarCheck className="w-3.5 h-3.5" />
                        Schedule Visit
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
