import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  IndianRupee, 
  Users, 
  SlidersHorizontal, 
  X, 
  Sparkles,
  Check
} from 'lucide-react';
import { SearchFilterState } from '../../types';

interface SearchConsoleProps {
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

export const SearchConsole: React.FC<SearchConsoleProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResultsCount,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    { id: 'all', label: 'All Stays' },
    { id: 'boys', label: 'Boys Hostels' },
    { id: 'girls', label: 'Girls Hostels' },
    { id: 'co_living', label: 'Co-Living' },
    { id: 'pg', label: 'Private PGs' },
  ];

  const budgetOptions = [
    { label: 'Any Budget', min: 0, max: 0 },
    { label: 'Under ₹8,000', min: 0, max: 8000 },
    { label: '₹8,000 - ₹12,000', min: 8000, max: 12000 },
    { label: '₹12,000 - ₹18,000', min: 12000, max: 18000 },
    { label: '₹18,000+', min: 18000, max: 99999 },
  ];

  return (
    <div id="search-console" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-30">
      <div className="bg-white rounded-2xl border border-[#EDE8DF] shadow-[0_10px_35px_rgba(15,23,42,0.08)] p-4 sm:p-6 transition-all">
        
        {/* Category Segmented Control */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 border-b border-slate-100">
          {categories.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ ...filters, category: cat.id as any })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#0F172A] text-white shadow-sm'
                    : 'bg-[#F4F0E8] text-slate-700 hover:bg-[#FFE4DC] hover:text-[#FF4B26]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Primary Search Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-4 items-center">
          
          {/* Location & College Input */}
          <div className="lg:col-span-5 relative">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Search by City, College or Area
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
                placeholder="e.g. DU North Campus, Koramangala, Landmark City..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF4B26] focus:bg-white transition-all"
              />
              {filters.query && (
                <button
                  onClick={() => onFilterChange({ ...filters, query: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Budget Band */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Monthly Budget
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={
                  filters.maxBudget === 0
                    ? 'Any Budget'
                    : filters.minBudget === 0 && filters.maxBudget === 8000
                    ? 'Under ₹8,000'
                    : filters.minBudget === 8000 && filters.maxBudget === 12000
                    ? '₹8,000 - ₹12,000'
                    : filters.minBudget === 12000 && filters.maxBudget === 18000
                    ? '₹12,000 - ₹18,000'
                    : filters.minBudget === 18000
                    ? '₹18,000+'
                    : 'Any Budget'
                }
                onChange={(e) => {
                  const opt = budgetOptions.find((b) => b.label === e.target.value);
                  if (opt) {
                    onFilterChange({
                      ...filters,
                      minBudget: opt.min,
                      maxBudget: opt.max,
                    });
                  }
                }}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26] focus:bg-white appearance-none cursor-pointer"
              >
                {budgetOptions.map((opt) => (
                  <option key={opt.label} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sharing Type */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Room Sharing
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={filters.sharingType}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    sharingType: e.target.value === 'all' ? 'all' : Number(e.target.value),
                  })
                }
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26] focus:bg-white appearance-none cursor-pointer"
              >
                <option value="all">Any Sharing</option>
                <option value={1}>Single Room</option>
                <option value={2}>Double Sharing</option>
                <option value={3}>Triple Sharing</option>
              </select>
            </div>
          </div>

          {/* Advanced toggle & Results trigger */}
          <div className="lg:col-span-2 flex items-center gap-2 pt-5">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer flex-1 transition-all ${
                showAdvanced || filters.acOnly || filters.foodIncluded || filters.wifiIncluded
                  ? 'bg-[#FFF1ED] text-[#FF4B26] border-[#FF4B26]/30'
                  : 'bg-slate-50 text-slate-700 border-[#EDE8DF] hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {(filters.query || filters.category !== 'all' || filters.maxBudget > 0 || filters.sharingType !== 'all' || filters.acOnly || filters.foodIncluded || filters.wifiIncluded || filters.powerBackup || filters.noCurfew) && (
              <button
                onClick={onResetFilters}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Advanced Amenities & Preferences Strip */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-2">Preferences:</span>

            <button
              onClick={() => onFilterChange({ ...filters, acOnly: !filters.acOnly })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filters.acOnly
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filters.acOnly && <Check className="w-3.5 h-3.5" />}
              AC Available
            </button>

            <button
              onClick={() => onFilterChange({ ...filters, foodIncluded: !filters.foodIncluded })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filters.foodIncluded
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filters.foodIncluded && <Check className="w-3.5 h-3.5" />}
              3x Food Included
            </button>

            <button
              onClick={() => onFilterChange({ ...filters, wifiIncluded: !filters.wifiIncluded })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filters.wifiIncluded
                  ? 'bg-[#FF4B26] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filters.wifiIncluded && <Check className="w-3.5 h-3.5" />}
              High-Speed Wi-Fi
            </button>

            <button
              onClick={() => onFilterChange({ ...filters, powerBackup: !filters.powerBackup })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filters.powerBackup
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filters.powerBackup && <Check className="w-3.5 h-3.5" />}
              24/7 Power Backup
            </button>

            <button
              onClick={() => onFilterChange({ ...filters, noCurfew: !filters.noCurfew })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filters.noCurfew
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filters.noCurfew && <Check className="w-3.5 h-3.5" />}
              No Curfew / Flexible Entry
            </button>

            <div className="ml-auto text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-[#FF4B26]">{totalResultsCount}</span> verified hostels
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
