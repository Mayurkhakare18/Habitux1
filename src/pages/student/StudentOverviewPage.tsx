import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { Hostel, Enquiry, SearchFilterState } from '../../types';

// Visiting Page Components Integrated into Dashboard
import { HubStrip } from '../../components/landing/HubStrip';
import { SearchConsole } from '../../components/landing/SearchConsole';
import { FeaturesToolkit } from '../../components/landing/FeaturesToolkit';
import { OldVsNewSection } from '../../components/landing/OldVsNewSection';
import { HowItWorks } from '../../components/landing/HowItWorks';
import { FaqSection } from '../../components/landing/FaqSection';

// Hostel Components
import { HostelCard } from '../../components/hostels/HostelCard';
import { EnquiryModal } from '../../components/hostels/EnquiryModal';
import { CompareDrawer } from '../../components/hostels/CompareDrawer';
import { Toast, ToastMessage } from '../../components/ui/Toast';

import { 
  Search, 
  Heart, 
  CalendarCheck, 
  Bell, 
  MapPin, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Users,
  Bed,
  MessageSquare,
  ArrowUpDown,
  SlidersHorizontal,
  CheckCircle2,
  HelpCircle,
  Scale,
  CreditCard,
  Building2,
  Compass
} from 'lucide-react';

export const StudentOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Navigation Filter Tab inside Dashboard
  const [activeTab, setActiveTab] = useState<'all' | 'my_hub' | 'explore' | 'compare' | 'guarantees' | 'faqs'>('all');

  // Core Data
  const [allHostels, setAllHostels] = useState<Hostel[]>([]);
  const [filteredHostels, setFilteredHostels] = useState<Hostel[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [favoriteHostelIds, setFavoriteHostelIds] = useState<string[]>([]);
  const [comparedHostels, setComparedHostels] = useState<Hostel[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Metrics
  const [bookingsCount, setBookingsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);

  // Modals & Feedback
  const [enquiryModalHostel, setEnquiryModalHostel] = useState<Hostel | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Filter State (matches visiting page)
  const initialFilters: SearchFilterState = {
    category: 'all',
    query: '',
    city: 'All Cities',
    maxBudget: 0,
    minBudget: 0,
    sharingType: 'all',
    gender: 'all',
    acOnly: false,
    foodIncluded: false,
    wifiIncluded: false,
    powerBackup: false,
    noCurfew: false,
    sortBy: 'recommended',
  };
  const [filters, setFilters] = useState<SearchFilterState>(initialFilters);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = `t-${Date.now()}`;
    setToasts((p) => [...p, { id, type, text }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  };

  const loadData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const list = await HabituxAPI.getHostels();
      setAllHostels(list);
      if (!isBackground) setFilteredHostels(list);

      if (user) {
        const [enqs, favs, bks, cvs] = await Promise.all([
          HabituxAPI.getStudentEnquiries(user.id),
          HabituxAPI.getFavorites(user.id),
          HabituxAPI.getStudentBookings(user.id),
          HabituxAPI.getConversations(user.id, 'student')
        ]);
        setEnquiries(enqs);
        setFavoriteHostelIds(favs);
        setBookingsCount(bks.length);
        setMessagesCount(cvs.length);
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData(true);
    };

    window.addEventListener('habitux_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    const interval = setInterval(() => {
      loadData(true);
    }, 3000);

    return () => {
      window.removeEventListener('habitux_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, [user]);

  // Apply filters whenever filter state changes
  useEffect(() => {
    HabituxAPI.getHostels(filters).then(setFilteredHostels);
  }, [filters]);

  const handleToggleFavorite = async (hostelId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
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

  const handleScheduleVisit = (hostel: Hostel) => {
    setEnquiryModalHostel(hostel);
  };

  const activeEnquiries = enquiries.filter(
    (e) => e.status !== 'cancelled' && e.status !== 'declined'
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Section Tabs: Toggle between personal Hub and Visiting features */}
      <div className="bg-white rounded-2xl border border-[#EDE8DF] p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All-In-One Dashboard', icon: Sparkles },
          { id: 'my_hub', label: 'My Resident Hub', icon: Bed },
          { id: 'explore', label: 'Hostel Search & Explore', icon: Search },
          { id: 'compare', label: `Compare Tool (${comparedHostels.length})`, icon: Scale },
          { id: 'guarantees', label: 'Habitux Guarantees & Toolkit', icon: ShieldCheck },
          { id: 'faqs', label: 'How It Works & FAQs', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF4B26]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. WELCOME BANNER & AUTHENTICATED STATS (Shown in 'all' and 'my_hub') */}
      {(activeTab === 'all' || activeTab === 'my_hub') && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-white via-white to-[#FFF1ED] rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1ED] text-[#FF4B26] text-xs font-bold border border-[#FF4B26]/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                ZERO BROKERAGE STUDENT LIVING • 100% VERIFIED
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-heading">
                Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                All features from the Habitux homepage are active here: search verified hostels, filter by meal plan & curfew, compare properties side-by-side, schedule free on-site visits, and chat directly with owners.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('explore')}
                className="px-4 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" /> Find Hostels Now
              </button>
              <button
                onClick={() => navigate('/student/bookings')}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Bed className="w-4 h-4" /> My Bookings
              </button>
            </div>
          </div>

          {/* Student KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => navigate('/student/bookings')}
              className="bg-white p-5 rounded-2xl border border-[#EDE8DF] hover:border-[#FF4B26]/30 shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Bookings</span>
                <div className="w-8 h-8 rounded-lg bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bed className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 font-heading">
                {bookingsCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Confirmed bed reservations</p>
            </div>

            <div 
              onClick={() => navigate('/student/messages')}
              className="bg-white p-5 rounded-2xl border border-[#EDE8DF] hover:border-[#FF4B26]/30 shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direct Chats</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-blue-700 font-heading">
                {messagesCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Owner conversations</p>
            </div>

            <div 
              onClick={() => navigate('/student/enquiries')}
              className="bg-white p-5 rounded-2xl border border-[#EDE8DF] hover:border-[#FF4B26]/30 shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visit Requests</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CalendarCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-purple-700 font-heading">
                {activeEnquiries.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Active property visits</p>
            </div>

            <div 
              onClick={() => navigate('/student/saved')}
              className="bg-white p-5 rounded-2xl border border-[#EDE8DF] hover:border-[#FF4B26]/30 shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Hostels</span>
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-rose-600 font-heading">
                {favoriteHostelIds.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Bookmarked accommodations</p>
            </div>
          </div>

          {/* Recent Enquiries & Active Visits Card */}
          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-[#0F172A] font-heading">
                  Recent Enquiries & Visit Appointments
                </h3>
                <p className="text-xs text-slate-500">
                  Live appointment status updates directly from hostel wardens & landlords
                </p>
              </div>
              <Link
                to="/student/enquiries"
                className="text-xs font-bold text-[#FF4B26] hover:underline flex items-center gap-1"
              >
                View All ({enquiries.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {enquiries.length > 0 ? (
              <div className="space-y-3">
                {enquiries.slice(0, 3).map((enq) => (
                  <div
                    key={enq.id}
                    className="p-4 rounded-2xl border border-[#EDE8DF] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-[#FF4B26] uppercase">
                        {enq.hostel_locality}, {enq.hostel_city}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm font-heading">
                        {enq.hostel_name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Room: <strong className="text-slate-800">{enq.room_type_name || 'Standard'}</strong> • Target Move-in: {enq.move_in_date}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        enq.status === 'visit_scheduled'
                          ? 'bg-purple-100 text-purple-800'
                          : enq.status === 'responded'
                          ? 'bg-emerald-100 text-emerald-800'
                          : enq.status === 'submitted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {enq.status.replace('_', ' ')}
                      </span>
                      <button
                        onClick={() => navigate('/student/enquiries')}
                        className="px-3 py-1.5 bg-white border border-[#EDE8DF] text-xs font-semibold rounded-lg hover:border-[#FF4B26] text-slate-700 cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-dashed border-slate-200 space-y-2">
                <p className="text-xs text-slate-600 font-medium">No accommodation enquiries submitted yet.</p>
                <p className="text-[11px] text-slate-400">Discover verified hostels below and schedule a free visit.</p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="inline-block mt-2 px-4 py-2 bg-[#FF4B26] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Explore Hostels
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. VISITING PAGE HUB STRIP & COMPLETE SEARCH CONSOLE (Shown in 'all' and 'explore') */}
      {(activeTab === 'all' || activeTab === 'explore') && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#EDE8DF] overflow-hidden shadow-sm">
            {/* Academic Hub Selector Strip */}
            <HubStrip
              selectedCity={filters.city}
              onSelectCity={(city) => {
                setFilters({ ...filters, city });
              }}
            />

            {/* Comprehensive Interactive Search Console */}
            <div className="p-4 sm:p-6 bg-[#FAF8F5]/50 border-t border-[#EDE8DF]">
              <SearchConsole
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={() => setFilters(initialFilters)}
                totalResultsCount={filteredHostels.length}
              />
            </div>
          </div>

          {/* Accommodation Results Header & Sorting */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1ED] text-[#FF4B26] text-xs font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  VERIFIED HOSTELS & PGS
                </div>
                <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight font-heading">
                  {filters.city !== 'All Cities' ? `Accommodations in ${filters.city}` : 'Featured Accommodations'}
                </h2>
                <p className="text-xs text-slate-500">
                  Showing <span className="font-bold text-[#0F172A]">{filteredHostels.length}</span> verified properties matching your filters
                </p>
              </div>

              {/* Sorting Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#EDE8DF] shadow-xs">
                  <ArrowUpDown className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">Sort:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                    className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="recommended">Recommended & Verified</option>
                    <option value="price_low">Rent: Low to High</option>
                    <option value="price_high">Rent: High to Low</option>
                    <option value="rating">Top Resident Rating</option>
                    <option value="availability">Highest Bed Availability</option>
                  </select>
                </div>

                <button
                  onClick={() => navigate('/student/explore')}
                  className="px-3.5 py-2 bg-[#FFF1ED] hover:bg-[#FFE4DC] text-[#FF4B26] font-bold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Full Explorer <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Hostel Cards Grid */}
            {filteredHostels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHostels.slice(0, 9).map((hostel) => (
                  <HostelCard
                    key={hostel.id}
                    hostel={hostel}
                    isFavorite={favoriteHostelIds.includes(hostel.id)}
                    isCompared={comparedHostels.some((h) => h.id === hostel.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleCompare={handleToggleCompare}
                    onSelectHostel={(h) => navigate(`/hostels/${h.slug}`)}
                    onEnquire={handleScheduleVisit}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#EDE8DF] space-y-3">
                <Search className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-extrabold text-slate-900 text-sm">No hostels match current filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing some filters, expanding your budget range, or selecting "All Cities" to see more accommodations.
                </p>
                <button
                  onClick={() => setFilters(initialFilters)}
                  className="px-4 py-2 bg-[#FF4B26] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. COMPARE SHORTLIST TAB & SECTION (Shown in 'all' and 'compare') */}
      {(activeTab === 'all' || activeTab === 'compare') && (
        <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                <Scale className="w-3.5 h-3.5" />
                MULTI-HOSTEL COMPARISON ENGINE
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                Compare Selected Accommodations ({comparedHostels.length}/3)
              </h3>
              <p className="text-xs text-slate-500">
                Inspect rent, deposit, meal plans, electricity meter policies, and curfew rules side by side
              </p>
            </div>

            <div className="flex items-center gap-2">
              {comparedHostels.length > 0 && (
                <>
                  <button
                    onClick={() => setIsCompareModalOpen(true)}
                    className="px-4 py-2 bg-[#FF4B26] hover:bg-[#E03713] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Scale className="w-4 h-4" /> Open Side-by-Side Modal
                  </button>
                  <button
                    onClick={() => setComparedHostels([])}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </>
              )}
            </div>
          </div>

          {comparedHostels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparedHostels.map((h) => (
                <div
                  key={h.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-[#FAF8F5] space-y-3 relative group"
                >
                  <img
                    src={h.images[0]?.storage_path}
                    alt={h.name}
                    className="w-full h-32 object-cover rounded-xl border border-slate-200"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#FF4B26] uppercase">
                      {h.locality}, {h.city}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm font-heading">{h.name}</h4>
                    <p className="text-xs font-black text-slate-900 mt-1">
                      ₹{h.monthly_rent_min.toLocaleString('en-IN')}+ /mo
                    </p>
                    <p className="text-[11px] text-slate-500">Deposit: ₹{h.security_deposit.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/hostels/${h.slug}`)}
                      className="text-xs font-bold text-[#FF4B26] hover:underline"
                    >
                      View Details →
                    </button>
                    <button
                      onClick={() => setComparedHostels((p) => p.filter((x) => x.id !== h.id))}
                      className="text-xs text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Scale className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-600 font-medium">No hostels selected for comparison yet.</p>
              <p className="text-[11px] text-slate-400">
                Click the <strong className="text-slate-700">"Compare"</strong> button on any hostel card above to view differences.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. VISITING PAGE GUARANTEES & 12-FEATURE TOOLKIT (Shown in 'all' and 'guarantees') */}
      {(activeTab === 'all' || activeTab === 'guarantees') && (
        <div className="space-y-8">
          {/* 12-Feature Toolkit */}
          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm">
            <FeaturesToolkit />
          </div>

          {/* Old Broker Way vs Habitux Standard */}
          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm">
            <OldVsNewSection />
          </div>
        </div>
      )}

      {/* 5. HOW IT WORKS & FAQS (Shown in 'all' and 'faqs') */}
      {(activeTab === 'all' || activeTab === 'faqs') && (
        <div className="space-y-8">
          {/* How It Works 4-Step Student Roadmap */}
          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm">
            <HowItWorks onSearchClick={() => setActiveTab('explore')} />
          </div>

          {/* Interactive FAQs Accordion */}
          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm">
            <FaqSection />
          </div>
        </div>
      )}

      {/* Floating Compare Drawer (Visible whenever properties are selected) */}
      <CompareDrawer
        comparedHostels={comparedHostels}
        onRemoveFromCompare={(id) => setComparedHostels((p) => p.filter((h) => h.id !== id))}
        onClearCompare={() => setComparedHostels([])}
        isOpenModal={isCompareModalOpen}
        onOpenModal={() => setIsCompareModalOpen(true)}
        onCloseModal={() => setIsCompareModalOpen(false)}
        onSelectHostel={(h) => navigate(`/hostels/${h.slug}`)}
      />

      {/* Enquiry / Schedule Visit Modal */}
      <EnquiryModal
        hostel={enquiryModalHostel}
        currentUser={user}
        onClose={() => setEnquiryModalHostel(null)}
        onSubmitEnquiry={async (data) => {
          const res = await HabituxAPI.submitEnquiry(data);
          addToast('success', 'Visit request submitted to property owner!');
          // Refresh enquiries list
          if (user) {
            HabituxAPI.getStudentEnquiries(user.id).then(setEnquiries);
          }
          return res;
        }}
      />

      {/* Toast Feedback System */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
};
