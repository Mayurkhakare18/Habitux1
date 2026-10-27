import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { HabituxAPI } from '../lib/supabase';
import { Hostel, SearchFilterState, Booking } from '../types';

import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HostelCard } from '../components/hostels/HostelCard';
import { PreferenceFiltersSidebar } from '../components/hostels/PreferenceFiltersSidebar';
import { ContactOwnerModal } from '../components/hostels/ContactOwnerModal';
import { BookingModal } from '../components/hostels/BookingModal';
import { CompareDrawer } from '../components/hostels/CompareDrawer';
import { Toast, ToastMessage } from '../components/ui/Toast';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X, 
  MapPin, 
  ChevronRight, 
  Check, 
  Frown,
  Sparkles,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

export const HostelsPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allHostels, setAllHostels] = useState<Hostel[]>([]);
  const [filteredHostels, setFilteredHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteHostelIds, setFavoriteHostelIds] = useState<string[]>([]);
  const [comparedHostels, setComparedHostels] = useState<Hostel[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Active Modals
  const [contactHostel, setContactHostel] = useState<Hostel | null>(null);
  const [bookingHostel, setBookingHostel] = useState<Hostel | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // State from URL parameters
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

  // Execute query & sync to URL
  useEffect(() => {
    setLoading(true);
    HabituxAPI.getHostels(filters)
      .then(setFilteredHostels)
      .finally(() => setLoading(false));

    // Update URL query params
    const params: Record<string, string> = {};
    if (filters.city && filters.city !== 'All Cities') params.city = filters.city;
    if (filters.locality) params.locality = filters.locality;
    if (filters.category && filters.category !== 'all') params.category = filters.category;
    if (filters.query) params.q = filters.query;
    if (filters.maxBudget > 0) params.maxBudget = String(filters.maxBudget);
    if (filters.minBudget > 0) params.minBudget = String(filters.minBudget);
    if (filters.sharingType !== 'all') params.sharing = String(filters.sharingType);
    if (filters.gender !== 'all') params.gender = filters.gender;
    if (filters.acOnly) params.ac = 'true';
    if (filters.foodIncluded) params.food = 'true';
    if (filters.foodPreference && filters.foodPreference !== 'all') params.foodPref = filters.foodPreference;
    if (filters.wifiIncluded) params.wifi = 'true';
    if (filters.powerBackup) params.power = 'true';
    if (filters.laundryAvailable) params.laundry = 'true';
    if (filters.attachedWashroom) params.attached = 'true';
    if (filters.gymAvailable) params.gym = 'true';
    if (filters.parkingAvailable) params.parking = 'true';
    if (filters.noCurfew) params.noCurfew = 'true';
    if (filters.visitorsAllowed) params.visitors = 'true';
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
    if (!user) {
      navigate('/login');
      return;
    }
    const isAdded = await HabituxAPI.toggleFavorite(user.id, hostelId);
    setFavoriteHostelIds((prev) =>
      isAdded ? [...prev, hostelId] : prev.filter((id) => id !== hostelId)
    );
    addToast('success', isAdded ? 'Saved to favorites!' : 'Removed from favorites');
  };

  const handleToggleCompare = (hostel: Hostel) => {
    setComparedHostels((prev) => {
      const exists = prev.some((h) => h.id === hostel.id);
      if (exists) return prev.filter((h) => h.id !== hostel.id);
      if (prev.length >= 3) {
        addToast('info', 'You can compare up to 3 hostels at a time.');
        return prev;
      }
      addToast('success', `Added ${hostel.name} to compare!`);
      return [...prev, hostel];
    });
  };

  // Count active filter criteria for pill chips
  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (filters.city && filters.city !== 'All Cities') {
    activeChips.push({ label: `City: ${filters.city}`, onRemove: () => handleFilterChange({ city: 'All Cities' }) });
  }
  if (filters.locality) {
    activeChips.push({ label: `Area: ${filters.locality}`, onRemove: () => handleFilterChange({ locality: '' }) });
  }
  if (filters.query) {
    activeChips.push({ label: `"${filters.query}"`, onRemove: () => handleFilterChange({ query: '' }) });
  }
  if (filters.category && filters.category !== 'all') {
    activeChips.push({ label: `Type: ${filters.category}`, onRemove: () => handleFilterChange({ category: 'all' }) });
  }
  if (filters.maxBudget > 0) {
    activeChips.push({ label: `Max ₹${filters.maxBudget.toLocaleString('en-IN')}`, onRemove: () => handleFilterChange({ maxBudget: 0 }) });
  }
  if (filters.sharingType !== 'all') {
    activeChips.push({
      label: filters.sharingType === 1 ? 'Single Room' : `${filters.sharingType}-Share`,
      onRemove: () => handleFilterChange({ sharingType: 'all' }),
    });
  }
  if (filters.acOnly) {
    activeChips.push({ label: 'AC Only', onRemove: () => handleFilterChange({ acOnly: false }) });
  }
  if (filters.foodIncluded) {
    activeChips.push({ label: 'Meals Included', onRemove: () => handleFilterChange({ foodIncluded: false }) });
  }
  if (filters.foodPreference && filters.foodPreference !== 'all') {
    activeChips.push({
      label: filters.foodPreference === 'veg' ? '100% Pure Veg' : filters.foodPreference,
      onRemove: () => handleFilterChange({ foodPreference: 'all' }),
    });
  }
  if (filters.wifiIncluded) {
    activeChips.push({ label: '100+ Mbps Wi-Fi', onRemove: () => handleFilterChange({ wifiIncluded: false }) });
  }
  if (filters.powerBackup) {
    activeChips.push({ label: '24/7 Power Backup', onRemove: () => handleFilterChange({ powerBackup: false }) });
  }
  if (filters.availableOnly) {
    activeChips.push({ label: 'Available Beds Only', onRemove: () => handleFilterChange({ availableOnly: false }) });
  }
  if (filters.minRating && filters.minRating > 0) {
    activeChips.push({ label: `${filters.minRating}+ ★ Rating`, onRemove: () => handleFilterChange({ minRating: 0 }) });
  }
  if (filters.noCurfew) {
    activeChips.push({ label: 'No Curfew', onRemove: () => handleFilterChange({ noCurfew: false }) });
  }

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
        savedCount={favoriteHostelIds.length}
      />

      {/* Breadcrumb Strip */}
      <div className="bg-white border-b border-[#EDE8DF] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Link to="/" className="hover:text-[#FF4B26]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Verified Hostels & PGs</span>
          </div>
          <span className="text-slate-500 font-medium hidden sm:inline flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% Zero Brokerage Guaranteed across India
          </span>
        </div>
      </div>

      {/* Search Header Banner */}
      <div className="bg-gradient-to-b from-white to-[#FAF8F5] border-b border-[#EDE8DF] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1ED] text-[#FF4B26] text-xs font-bold border border-[#FFE4DC] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                VERIFIED STUDENT ACCOMMODATIONS
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-heading">
                Find Your Ideal Student Living
              </h1>
              <p className="text-xs text-slate-500 max-w-xl mt-1">
                Zero brokerage, transparent room prices, verified meal quality, and direct owner booking across India&apos;s prime educational hubs.
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search college, landmark, or area..."
                value={filters.query}
                onChange={(e) => handleFilterChange({ query: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#EDE8DF] text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#FF4B26]/30"
              />
              {filters.query && (
                <button
                  onClick={() => handleFilterChange({ query: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex items-start gap-8">
          {/* Preference Filters Sidebar (Desktop sticky & Mobile drawer) */}
          <PreferenceFiltersSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={resetAllFilters}
            totalResultsCount={filteredHostels.length}
            isMobileModalOpen={isMobileFiltersOpen}
            onCloseMobileModal={() => setIsMobileFiltersOpen(false)}
          />

          {/* Results Grid Column */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Top Toolbar: Mobile Filter Button, Active Chips & Sort */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EDE8DF] shadow-2xs">
                {/* Mobile Filter Trigger */}
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                  {activeChips.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#FF4B26] text-white text-[10px] flex items-center justify-center">
                      {activeChips.length}
                    </span>
                  )}
                </button>

                <div className="text-xs text-slate-600 font-semibold">
                  Showing <b className="text-slate-900">{filteredHostels.length}</b> verified student properties
                </div>

                {/* Sort Dropdown */}
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
                    <option value="rating">Top Rated by Students</option>
                    <option value="availability">Most Available Beds</option>
                    <option value="newest">Newly Listed</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Chips */}
              {activeChips.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Active Filters:
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
            </div>

            {/* Listings Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[#EDE8DF] p-4 h-96 animate-pulse" />
                ))}
              </div>
            ) : filteredHostels.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#EDE8DF] p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center mx-auto">
                  <Frown className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 text-base font-heading">
                    No hostels match your active criteria
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try broadening your budget band, clearing specific amenities, or selecting &ldquo;All Cities&rdquo;.
                  </p>
                </div>
                <button
                  onClick={resetAllFilters}
                  className="px-5 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> Reset All Filters
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
      </main>

      {/* Floating Compare Drawer */}
      <CompareDrawer
        comparedHostels={comparedHostels}
        isOpenModal={isCompareModalOpen}
        onOpenModal={() => setIsCompareModalOpen(true)}
        onCloseModal={() => setIsCompareModalOpen(false)}
        onRemoveFromCompare={(id: string) => setComparedHostels((p) => p.filter((h) => h.id !== id))}
        onClearCompare={() => setComparedHostels([])}
        onSelectHostel={(h) => navigate(`/hostels/${h.slug}`)}
      />

      {/* Direct Contact Owner Modal */}
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
            navigate(`/student/bookings/confirm/${confirmedBooking.id}`);
          }}
          onShowToast={addToast}
        />
      )}

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />

      <Footer
        onSelectCity={(city: string) => {
          handleFilterChange({ city });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigate={(tab: string) => {
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
