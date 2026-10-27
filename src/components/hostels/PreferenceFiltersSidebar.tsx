import React, { useState } from 'react';
import { SearchFilterState, PropertyType, GenderPolicy } from '../../types';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  MapPin, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Sparkles,
  ShieldCheck,
  Zap,
  Utensils,
  Wifi,
  Bed,
  IndianRupee,
  Clock,
  Home
} from 'lucide-react';

interface PreferenceFiltersSidebarProps {
  filters: SearchFilterState;
  onFilterChange: (newFilters: Partial<SearchFilterState>) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
  isMobileModalOpen?: boolean;
  onCloseMobileModal?: () => void;
}

const CITIES = [
  'All Cities',
  'Kota',
  'Delhi',
  'Bengaluru',
  'Pune',
  'Mumbai',
  'Hyderabad',
  'Greater Noida'
];

export const PreferenceFiltersSidebar: React.FC<PreferenceFiltersSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResultsCount,
  isMobileModalOpen,
  onCloseMobileModal,
}) => {
  // Collapsible accordion sections
  const [openSections, setOpenSections] = useState({
    budget: true,
    category: true,
    sharing: true,
    amenities: true,
    food: true,
    rating: true,
    rules: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Quick budget helper
  const setBudgetBand = (min: number, max: number) => {
    onFilterChange({ minBudget: min, maxBudget: max });
  };

  const content = (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EDE8DF]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm font-heading">
              Filter Accommodations
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Showing {totalResultsCount} verified stays
            </p>
          </div>
        </div>

        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-[#FF4B26] hover:text-[#E03713] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* City & Locality */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#FF4B26]" /> City & Location
        </label>
        <select
          value={filters.city}
          onChange={(e) => onFilterChange({ city: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#FF4B26]/30 cursor-pointer"
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Locality, landmark, or college..."
          value={filters.locality || ''}
          onChange={(e) => onFilterChange({ locality: e.target.value })}
          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF4B26]/30"
        />
      </div>

      {/* Budget Range Section */}
      <div className="border-t border-[#EDE8DF] pt-4">
        <button
          onClick={() => toggleSection('budget')}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-[#FF4B26]" /> Monthly Budget
          </span>
          {openSections.budget ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openSections.budget && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>₹{filters.minBudget ? filters.minBudget.toLocaleString('en-IN') : '3,000'}</span>
              <span className="text-[#FF4B26] font-bold">
                Max: ₹{filters.maxBudget ? filters.maxBudget.toLocaleString('en-IN') : 'Any (₹35,000)'}
              </span>
            </div>

            <input
              type="range"
              min="4000"
              max="30000"
              step="1000"
              value={filters.maxBudget || 30000}
              onChange={(e) => onFilterChange({ maxBudget: Number(e.target.value) })}
              className="w-full accent-[#FF4B26] cursor-pointer"
            />

            {/* Quick Budget Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '< ₹8k', min: 0, max: 8000 },
                { label: '₹8k - ₹12k', min: 8000, max: 12000 },
                { label: '₹12k - ₹18k', min: 12000, max: 18000 },
                { label: '₹18k+', min: 18000, max: 35000 },
              ].map((b) => (
                <button
                  key={b.label}
                  onClick={() => setBudgetBand(b.min, b.max)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    filters.minBudget === b.min && filters.maxBudget === b.max
                      ? 'bg-[#FF4B26] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accommodation Type / Gender Policy */}
      <div className="border-t border-[#EDE8DF] pt-4">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-[#FF4B26]" /> Accommodation Type
          </span>
          {openSections.category ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openSections.category && (
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'boys', label: 'Boys Hostel' },
              { id: 'girls', label: 'Girls Hostel' },
              { id: 'co_living', label: 'Co-Living Hub' },
              { id: 'pg', label: 'Paying Guest (PG)' },
              { id: 'flat', label: 'Student Flat' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ category: cat.id as any })}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer border ${
                  filters.category === cat.id
                    ? 'bg-[#FFF1ED] border-[#FF4B26] text-[#FF4B26] shadow-2xs'
                    : 'bg-white border-[#EDE8DF] text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Room Sharing Type */}
      <div className="border-t border-[#EDE8DF] pt-4">
        <button
          onClick={() => toggleSection('sharing')}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-[#FF4B26]" /> Room Sharing
          </span>
          {openSections.sharing ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openSections.sharing && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { id: 'all', label: 'Any Sharing' },
              { id: 1, label: 'Single (Private)' },
              { id: 2, label: '2 Sharing (Twin)' },
              { id: 3, label: '3 Sharing (Triple)' },
              { id: 4, label: '4+ (Dormitory)' },
            ].map((sh) => (
              <button
                key={String(sh.id)}
                onClick={() => onFilterChange({ sharingType: sh.id as any })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  filters.sharingType === sh.id
                    ? 'bg-[#FF4B26] border-[#FF4B26] text-white shadow-2xs'
                    : 'bg-slate-50 border-[#EDE8DF] text-slate-700 hover:bg-slate-100'
                }`}
              >
                {sh.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Amenities Checklist */}
      <div className="border-t border-[#EDE8DF] pt-4">
        <button
          onClick={() => toggleSection('amenities')}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4B26]" /> Amenities & Perks
          </span>
          {openSections.amenities ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openSections.amenities && (
          <div className="space-y-2 pt-1 text-xs">
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium hover:text-slate-900">
              <input
                type="checkbox"
                checked={filters.acOnly}
                onChange={(e) => onFilterChange({ acOnly: e.target.checked })}
                className="w-4 h-4 rounded text-[#FF4B26] accent-[#FF4B26] cursor-pointer"
              />
              <span>Air Conditioning (AC)</span>
            </label>

            <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium hover:text-slate-900">
              <input
                type="checkbox"
                checked={filters.foodIncluded}
                onChange={(e) => onFilterChange({ foodIncluded: e.target.checked })}
                className="w-4 h-4 rounded text-[#FF4B26] accent-[#FF4B26] cursor-pointer"
              />
              <span>Daily Meal Plan Included</span>
            </label>

            <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium hover:text-slate-900">
              <input
                type="checkbox"
                checked={filters.wifiIncluded}
                onChange={(e) => onFilterChange({ wifiIncluded: e.target.checked })}
                className="w-4 h-4 rounded text-[#FF4B26] accent-[#FF4B26] cursor-pointer"
              />
              <span>High-Speed Wi-Fi (100+ Mbps)</span>
            </label>

            <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium hover:text-slate-900">
              <input
                type="checkbox"
                checked={filters.powerBackup}
                onChange={(e) => onFilterChange({ powerBackup: e.target.checked })}
                className="w-4 h-4 rounded text-[#FF4B26] accent-[#FF4B26] cursor-pointer"
              />
              <span>24/7 Power Backup (DG)</span>
            </label>

            <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium hover:text-slate-900">
              <input
                type="checkbox"
                checked={Boolean(filters.laundryAvailable)}
                onChange={(e) => onFilterChange({ laundryAvailable: e.target.checked })}
                className="w-4 h-4 rounded text-[#FF4B26] accent-[#FF4B26] cursor-pointer"
              />
              <span>Laundry & Washing Machine</span>
            </label>

            <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium hover:text-slate-900">
              <input
                type="checkbox"
                checked={Boolean(filters.attachedWashroom)}
                onChange={(e) => onFilterChange({ attachedWashroom: e.target.checked })}
                className="w-4 h-4 rounded text-[#FF4B26] accent-[#FF4B26] cursor-pointer"
              />
              <span>Attached Private Washroom</span>
            </label>

            <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium hover:text-slate-900">
              <input
                type="checkbox"
                checked={Boolean(filters.gymAvailable)}
                onChange={(e) => onFilterChange({ gymAvailable: e.target.checked })}
                className="w-4 h-4 rounded text-[#FF4B26] accent-[#FF4B26] cursor-pointer"
              />
              <span>Gym & Fitness Zone</span>
            </label>

            <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium hover:text-slate-900">
              <input
                type="checkbox"
                checked={Boolean(filters.parkingAvailable)}
                onChange={(e) => onFilterChange({ parkingAvailable: e.target.checked })}
                className="w-4 h-4 rounded text-[#FF4B26] accent-[#FF4B26] cursor-pointer"
              />
              <span>Two-Wheeler / Car Parking</span>
            </label>
          </div>
        )}
      </div>

      {/* Food & Dietary Preference */}
      <div className="border-t border-[#EDE8DF] pt-4">
        <button
          onClick={() => toggleSection('food')}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-[#FF4B26]" /> Dietary Plan
          </span>
          {openSections.food ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openSections.food && (
          <div className="space-y-1.5 pt-1">
            {[
              { id: 'all', label: 'Any / Not Specific' },
              { id: 'veg', label: '100% Pure Vegetarian Mess' },
              { id: 'non_veg', label: 'Veg + Non-Veg Allowed' },
              { id: 'none', label: 'Self Cooking / No Meals' },
            ].map((f) => (
              <label
                key={f.id}
                className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer hover:text-slate-900"
              >
                <input
                  type="radio"
                  name="foodPreference"
                  checked={(filters.foodPreference || 'all') === f.id}
                  onChange={() => onFilterChange({ foodPreference: f.id as any })}
                  className="w-3.5 h-3.5 text-[#FF4B26] accent-[#FF4B26]"
                />
                <span>{f.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating & Verified Availability */}
      <div className="border-t border-[#EDE8DF] pt-4">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-[#FF4B26]" /> Rating & Availability
          </span>
          {openSections.rating ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openSections.rating && (
          <div className="space-y-3 pt-1">
            {/* Available Beds Only Toggle */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs font-semibold text-emerald-900 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Available Beds Only
              </span>
              <input
                type="checkbox"
                checked={Boolean(filters.availableOnly)}
                onChange={(e) => onFilterChange({ availableOnly: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
              />
            </label>

            {/* Minimum Star Rating */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Minimum Guest Rating
              </span>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { val: 0, label: 'All' },
                  { val: 3.5, label: '3.5+ ★' },
                  { val: 4.0, label: '4.0+ ★' },
                  { val: 4.5, label: '4.5+ ★' },
                ].map((r) => (
                  <button
                    key={r.val}
                    onClick={() => onFilterChange({ minRating: r.val })}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      (filters.minRating || 0) === r.val
                        ? 'bg-[#FF4B26] border-[#FF4B26] text-white'
                        : 'bg-slate-50 border-[#EDE8DF] text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* House Rules & Curfew */}
      <div className="border-t border-[#EDE8DF] pt-4">
        <button
          onClick={() => toggleSection('rules')}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#FF4B26]" /> House Rules & Curfew
          </span>
          {openSections.rules ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openSections.rules && (
          <div className="space-y-2 pt-1 text-xs">
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium hover:text-slate-900">
              <input
                type="checkbox"
                checked={filters.noCurfew}
                onChange={(e) => onFilterChange({ noCurfew: e.target.checked })}
                className="w-4 h-4 rounded text-[#FF4B26] accent-[#FF4B26] cursor-pointer"
              />
              <span>No Curfew / Flexible Entry</span>
            </label>

            <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium hover:text-slate-900">
              <input
                type="checkbox"
                checked={Boolean(filters.visitorsAllowed)}
                onChange={(e) => onFilterChange({ visitorsAllowed: e.target.checked })}
                className="w-4 h-4 rounded text-[#FF4B26] accent-[#FF4B26] cursor-pointer"
              />
              <span>Parents & Visitors Allowed</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block w-80 bg-white rounded-3xl border border-[#EDE8DF] p-6 shadow-xs sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
        {content}
      </div>

      {/* Mobile Drawer */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DF] mb-4">
                <span className="font-extrabold text-base text-slate-900">Filters</span>
                <button
                  onClick={onCloseMobileModal}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 border-t border-[#EDE8DF] mt-6">
              <button
                onClick={onCloseMobileModal}
                className="w-full py-3 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Apply Filters ({totalResultsCount} Stays)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
