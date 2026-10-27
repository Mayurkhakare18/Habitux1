import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { Hostel, SearchFilterState } from '../../types';
import { HostelCard } from '../../components/hostels/HostelCard';
import { PreferenceFiltersSidebar } from '../../components/hostels/PreferenceFiltersSidebar';
import { ContactOwnerModal } from '../../components/hostels/ContactOwnerModal';
import { BookingModal } from '../../components/hostels/BookingModal';
import { CompareDrawer } from '../../components/hostels/CompareDrawer';
import { HubStrip } from '../../components/landing/HubStrip';
import { FeaturesToolkit } from '../../components/landing/FeaturesToolkit';
import { FaqSection } from '../../components/landing/FaqSection';
import { Toast, ToastMessage } from '../../components/ui/Toast';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  MapPin, 
  X, 
  Frown, 
  Check, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Scale
} from 'lucide-react';

export const StudentExplorePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allHostels, setAllHostels] = useState<Hostel[]>([]);
  const [filteredHostels, setFilteredHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteHostelIds, setFavoriteHostelIds] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Compare state
  const [comparedHostels, setComparedHostels] = useState<Hostel[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Modals
  const [contactHostel, setContactHostel] = useState<Hostel | null>(null);
  const [bookingHostel, setBookingHostel] = useState<Hostel | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Filter state
  const [filters, setFilters] = useState<SearchFilterState>({
    category: (searchParams.get('category') as any) || 'all',
    query: searchParams.get('q') || '',
    city: searchParams.get('city') || 'All Cities',
    locality: searchParams.get('locality') || '',
    maxBudget: Number(searchParams.get('maxBudget')) || 0,
    minBudget: Number(searchParams.get('minBudget')) || 0,
    sharingType: searchParams.get('sharing') ? (searchParams.get('sharing') === 'all' ? 'all' : Number(searchParams.get('sharing'))) : 'all',
    gender: (searchParams.get('gender') as any) || 'all',
    acOnly: searchParams.get('ac') === 'true',
    foodIncluded: searchParams.get('food') === 'true',
    foodPreference: (searchParams.get('foodPref') as any) || 'all',
    wifiIncluded: searchParams.get('wifi') === 'true',
    powerBackup: searchParams.get('power') === 'true',
    laundryAvailable: searchParams.get('laundry') === 'true',
    attachedWashroom: searchParams.get('attached') === 'true',
    gymAvailable: searchParams.get('gym') === 'true',
    parkingAvailable: searchParams.get('parking') === 'true',
    noCurfew: searchParams.get('noCurfew') === 'true',
    visitorsAllowed: searchParams.get('visitors') === 'true',
    availableOnly: searchParams.get('avail') === 'true',
    minRating: Number(searchParams.get('minRating')) || 0,
    sortBy: (searchParams.get('sortBy') as any) || 'recommended',
  });

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = `t-${Date.now()}`;
    setToasts((p) => [...p, { id, type, text }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  };

  useEffect(() => {
    HabituxAPI.getHostels().then(setAllHostels);
    if (user) {
      HabituxAPI.getFavorites(user.id).then(setFavoriteHostelIds);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    HabituxAPI.getHostels(filters)
      .then(setFilteredHostels)
      .finally(() => setLoading(false));

    // Sync to URL
    const params: Record<string, string> = {};
    if (filters.city && filters.city !== 'All Cities') params.city = filters.city;
    if (filters.locality) params.locality = filters.locality;
    if (filters.category && filters.category !== 'all') params.category = filters.category;
    if (filters.query) params.q = filters.query;
    if (filters.maxBudget > 0) params.maxBudget = String(filters.maxBudget);
    if (filters.sharingType !== 'all') params.sharing = String(filters.sharingType);
    if (filters.acOnly) params.ac = 'true';
    if (filters.foodIncluded) params.food = 'true';
    if (filters.availableOnly) params.avail = 'true';
    if (filters.minRating && filters.minRating > 0) params.minRating = String(filters.minRating);
    if (filters.sortBy !== 'recommended') params.sortBy = filters.sortBy;

    setSearchParams(params, { replace: true });
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<SearchFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetAllFilters = () => {
    setFilters({
      category: 'all',
      query: '',
      city: 'All Cities',
      locality: '',
      maxBudget: 0,
      minBudget: 0,
      sharingType: 'all',
      gender: 'all',
      acOnly: false,
      foodIncluded: false,
      foodPreference: 'all',
      wifiIncluded: false,
      powerBackup: false,
      laundryAvailable: false,
      attachedWashroom: false,
      gymAvailable: false,
      parkingAvailable: false,
      noCurfew: false,
      visitorsAllowed: false,
      availableOnly: false,
      minRating: 0,
      sortBy: 'recommended',
    });
    setSearchParams({});
  };

  const handleToggleFavorite = async (hostelId: string) => {
    if (!user) return;
    const isAdded = await HabituxAPI.toggleFavorite(user.id, hostelId);
    setFavoriteHostelIds((prev) =>
      isAdded ? [...prev, hostelId] : prev.filter((id) => id !== hostelId)
    );
    addToast('success', isAdded ? 'Saved to your favorites!' : 'Removed from favorites');
  };

  const handleToggleCompare = (hostel: Hostel) => {
    setComparedHostels((prev) => {
      const exists = prev.some((h) => h.id === hostel.id);
      if (exists) return prev.filter((h) => h.id !== hostel.id);
      if (prev.length >= 3) {
        addToast('info', 'You can compare up to 3 hostels at a time.');
        return prev;
      }
      addToast('success', `Added ${hostel.name} to comparison!`);
      return [...prev, hostel];
    });
  };

  // Active filter chips
  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (filters.city && filters.city !== 'All Cities') {
    activeChips.push({ label: `City: ${filters.city}`, onRemove: () => handleFilterChange({ city: 'All Cities' }) });
  }
  if (filters.locality) {
    activeChips.push({ label: `Locality: ${filters.locality}`, onRemove: () => handleFilterChange({ locality: '' }) });
  }
  if (filters.query) {
    activeChips.push({ label: `"${filters.query}"`, onRemove: () => handleFilterChange({ query: '' }) });
  }
  if (filters.category && filters.category !== 'all') {
    activeChips.push({ label: `Category: ${filters.category}`, onRemove: () => handleFilterChange({ category: 'all' }) });
  }
  if (filters.maxBudget > 0) {
    activeChips.push({ label: `Budget < ₹${filters.maxBudget.toLocaleString('en-IN')}`, onRemove: () => handleFilterChange({ maxBudget: 0 }) });
  }
  if (filters.sharingType !== 'all') {
    activeChips.push({ label: `Sharing: ${filters.sharingType}`, onRemove: () => handleFilterChange({ sharingType: 'all' }) });
  }
  if (filters.acOnly) {
    activeChips.push({ label: 'AC Only', onRemove: () => handleFilterChange({ acOnly: false }) });
  }
  if (filters.foodIncluded) {
    activeChips.push({ label: 'Meals Included', onRemove: () => handleFilterChange({ foodIncluded: false }) });
  }
  if (filters.availableOnly) {
    activeChips.push({ label: 'Beds Available', onRemove: () => handleFilterChange({ availableOnly: false }) });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Visiting Page HubStrip for Quick Location Exploration */}
      <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-xs">
        <HubStrip
          selectedCity={filters.city}
          onSelectCity={(city) => handleFilterChange({ city })}
        />
      </div>

      {/* Header with Title and Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1ED] text-[#FF4B26] text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            100% ZERO BROKERAGE DIRECT HOSTEL SEARCH
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
            Discover Verified Accommodations
          </h1>
          <p className="text-xs text-slate-500">
            Filter by monthly rent, distance to university, meal inclusions, curfew, and roommate capacity
          </p>
        </div>

        {/* Search Bar & Mobile Filter Trigger */}
        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search area, college, hostel..."
              value={filters.query}
              onChange={(e) => handleFilterChange({ query: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#EDE8DF] rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF4B26]/30 shadow-xs"
            />
            {filters.query && (
              <button
                onClick={() => handleFilterChange({ query: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden px-3 py-2 bg-white border border-[#EDE8DF] text-xs font-bold text-slate-700 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#FF4B26]" />
            Filters
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Sticky Filters Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-18">
          <PreferenceFiltersSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={resetAllFilters}
            totalResultsCount={filteredHostels.length}
          />
        </div>

        {/* Mobile Filter Slideover Drawer */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end lg:hidden">
            <div className="w-full max-w-xs bg-white h-full p-4 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-extrabold text-sm text-slate-900 font-heading">Filter Accommodations</span>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <PreferenceFiltersSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={resetAllFilters}
                totalResultsCount={filteredHostels.length}
              />
            </div>
          </div>
        )}

        {/* Right Listings Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Bar: Count & Sorting */}
          <div className="bg-white rounded-2xl border border-[#EDE8DF] p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              Found <strong className="text-slate-900 font-bold">{filteredHostels.length}</strong> verified properties
            </div>

            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="recommended">Recommended & Verified</option>
                <option value="price_low">Price: Lowest First</option>
                <option value="price_high">Price: Highest First</option>
                <option value="rating">Top Rated</option>
                <option value="availability">Most Available Beds</option>
                <option value="newest">Newly Listed</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Active:
              </span>
              {activeChips.map((chip, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF1ED] text-[#FF4B26] text-xs font-semibold border border-[#FFE4DC]"
                >
                  {chip.label}
                  <button
                    onClick={chip.onRemove}
                    className="hover:text-rose-700 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-[#FF4B26] hover:underline cursor-pointer ml-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#EDE8DF] p-4 h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredHostels.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#EDE8DF] p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center mx-auto">
                <Frown className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm font-heading">
                No verified stays match your filters
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your budget range or removing specific filters to view more student accommodations.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHostels.map((hostel) => (
                <HostelCard
                  key={hostel.id}
                  hostel={hostel}
                  isFavorite={favoriteHostelIds.includes(hostel.id)}
                  isCompared={comparedHostels.some((h) => h.id === hostel.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleCompare={handleToggleCompare}
                  onSelectHostel={(h) => navigate(`/hostels/${h.slug}`)}
                  onEnquire={(h) => setContactHostel(h)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 12-Feature Toolkit Section from Visiting Page */}
      <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm">
        <FeaturesToolkit />
      </div>

      {/* Visiting Page FAQs Section */}
      <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm">
        <FaqSection />
      </div>

      {/* Contact Owner Modal */}
      {contactHostel && (
        <ContactOwnerModal
          hostel={contactHostel}
          currentUser={user}
          onClose={() => setContactHostel(null)}
          onShowToast={addToast}
        />
      )}

      {/* Online Booking Modal */}
      {bookingHostel && (
        <BookingModal
          hostel={bookingHostel}
          selectedRoom={null}
          currentUser={user}
          onClose={() => setBookingHostel(null)}
          onBookingSuccess={(confirmedBooking) => {
            setBookingHostel(null);
            navigate(`/student/bookings/${confirmedBooking.id}`);
          }}
          onShowToast={addToast}
        />
      )}

      {/* Floating Compare Drawer */}
      <CompareDrawer
        comparedHostels={comparedHostels}
        onRemoveFromCompare={(id) => setComparedHostels((p) => p.filter((h) => h.id !== id))}
        onClearCompare={() => setComparedHostels([])}
        isOpenModal={isCompareModalOpen}
        onOpenModal={() => setIsCompareModalOpen(true)}
        onCloseModal={() => setIsCompareModalOpen(false)}
        onSelectHostel={(h) => navigate(`/hostels/${h.slug}`)}
      />

      <Toast toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
};
