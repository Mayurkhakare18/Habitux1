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
import { CompareDrawer } from '../../components/hostels/CompareDrawer';
import { Toast, ToastMessage } from '../../components/ui/Toast';

import { 
  Building2, 
  PlusCircle, 
  Bed, 
  CalendarCheck, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  ShieldCheck,
  Send,
  Search,
  Scale,
  HelpCircle,
  Eye,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';

export const OwnerOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Navigation Filter Tab
  const [activeTab, setActiveTab] = useState<'console' | 'market_discovery' | 'standards_faqs'>('console');

  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [allHostels, setAllHostels] = useState<Hostel[]>([]);
  const [filteredHostels, setFilteredHostels] = useState<Hostel[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Comparison State
  const [comparedHostels, setComparedHostels] = useState<Hostel[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [favoriteHostelIds, setFavoriteHostelIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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
    if (!user) return;
    if (!isBackground) setLoading(true);
    try {
      const all = await HabituxAPI.getHostels();
      setHostels(all);
      setAllHostels(all);

      const [enqs, bks, cvs, favs] = await Promise.all([
        HabituxAPI.getOwnerEnquiries(user.id),
        HabituxAPI.getOwnerBookings(user.id),
        HabituxAPI.getConversations(user.id, 'owner'),
        HabituxAPI.getFavorites(user.id),
      ]);
      setEnquiries(enqs);
      setBookingsCount(bks.length);
      setMessagesCount(cvs.length);
      setFavoriteHostelIds(favs);
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

    // Heartbeat poll every 3 seconds for real-time overview counts
    const interval = setInterval(() => {
      loadData(true);
    }, 3000);

    return () => {
      window.removeEventListener('habitux_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, [user]);

  // Apply filters
  useEffect(() => {
    HabituxAPI.getHostels(filters).then(setFilteredHostels);
  }, [filters]);

  const handleToggleFavorite = async (hostelId: string) => {
    if (!user) return;
    const isAdded = await HabituxAPI.toggleFavorite(user.id, hostelId);
    setFavoriteHostelIds((prev) =>
      isAdded ? [...prev, hostelId] : prev.filter((id) => id !== hostelId)
    );
    addToast('success', isAdded ? 'Saved to bookmarks' : 'Removed bookmark');
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

  const totalBeds = hostels.reduce(
    (sum, h) => sum + h.room_types.reduce((rSum, r) => rSum + r.total_beds, 0),
    0
  );
  const availableBeds = hostels.reduce(
    (sum, h) => sum + h.room_types.reduce((rSum, r) => rSum + r.available_beds, 0),
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Segmented Tabs: Owner Console vs Visiting Features */}
      <div className="bg-white rounded-2xl border border-[#EDE8DF] p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'console', label: 'Owner Operations Console', icon: Building2 },
          { id: 'market_discovery', label: 'Market Search & Competitor Explorer', icon: Search },
          { id: 'standards_faqs', label: 'Habitux Standards & FAQs', icon: ShieldCheck },
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

      {/* TAB 1: OWNER OPERATIONS CONSOLE */}
      {activeTab === 'console' && (
        <div className="space-y-8">
          {/* Banner */}
          <div className="bg-[#0F172A] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4B26]/20 text-[#FF4B26] text-xs font-bold border border-[#FF4B26]/30">
                <Building2 className="w-3.5 h-3.5" />
                HOSTEL MANAGER CONSOLE
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
                Welcome, {user?.full_name || 'Property Owner'}
              </h1>
              <p className="text-xs text-slate-400 max-w-xl">
                Manage your accommodations, adjust real-time bed inventory, confirm advance student bookings, and coordinate on-site visits directly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigate('/owner/messages')}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4 text-[#FF4B26]" /> Direct Messages
              </button>
              <button
                onClick={() => navigate('/owner/listings/new')}
                className="px-5 py-3 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#FF4B26]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                <PlusCircle className="w-4 h-4" /> Add New Hostel
              </button>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => navigate('/owner/bookings')}
              className="bg-white p-5 rounded-2xl border border-[#EDE8DF] hover:border-[#FF4B26]/30 shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reservations</span>
                <CalendarCheck className="w-4 h-4 text-[#FF4B26] group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 font-heading">
                {bookingsCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Paid student bookings</p>
            </div>

            <div 
              onClick={() => navigate('/owner/rooms')}
              className="bg-white p-5 rounded-2xl border border-[#EDE8DF] hover:border-[#FF4B26]/30 shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vacant Beds</span>
                <Bed className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-2 text-2xl font-black text-emerald-600 font-heading">
                {availableBeds} <span className="text-xs font-normal text-slate-400">/ {totalBeds} total</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Ready for student check-in</p>
            </div>

            <div 
              onClick={() => navigate('/owner/enquiries')}
              className="bg-white p-5 rounded-2xl border border-[#EDE8DF] hover:border-[#FF4B26]/30 shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inquiries & Visits</span>
                <CalendarCheck className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-2 text-2xl font-black text-purple-700 font-heading">
                {enquiries.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Visit scheduling requests</p>
            </div>

            <div 
              onClick={() => navigate('/owner/messages')}
              className="bg-white p-5 rounded-2xl border border-[#EDE8DF] hover:border-[#FF4B26]/30 shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Chats</span>
                <Send className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-2 text-2xl font-black text-blue-700 font-heading">
                {messagesCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Direct student messaging</p>
            </div>
          </div>

          {/* Recent Incoming Enquiries */}
          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-[#0F172A] font-heading">
                  Recent Student Inquiries & Visit Appointments
                </h3>
                <p className="text-xs text-slate-500">
                  Students interested in visiting your hostels
                </p>
              </div>
              <Link
                to="/owner/enquiries"
                className="text-xs font-bold text-[#FF4B26] hover:underline flex items-center gap-1"
              >
                Manage All ({enquiries.length}) <ArrowRight className="w-3.5 h-3.5" />
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
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm font-heading">{enq.student_name}</h4>
                        <span className="text-xs text-slate-500 font-mono">({enq.student_phone})</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Property: <strong className="text-slate-800">{enq.hostel_name}</strong> • Room: {enq.room_type_name || 'Standard'} • Target: {enq.move_in_date}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white font-bold text-[10px] uppercase">
                        {enq.status.replace('_', ' ')}
                      </span>
                      <Link
                        to="/owner/enquiries"
                        className="px-3 py-1.5 bg-[#FF4B26] text-white text-xs font-bold rounded-lg hover:bg-[#E03713]"
                      >
                        Reply
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-600 font-medium">No incoming student enquiries yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">Make sure your listings are verified and published to receive student leads.</p>
              </div>
            )}
          </div>

          {/* Quick Access to Bed Inventory */}
          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base font-heading">
                Live Bed & Room Inventory
              </h3>
              <p className="text-xs text-slate-500">
                Keep available beds updated so students don&apos;t enquiry about full rooms
              </p>
            </div>
            <button
              onClick={() => navigate('/owner/rooms')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Bed className="w-4 h-4" /> Manage Beds
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MARKET SEARCH & COMPETITOR EXPLORER */}
      {activeTab === 'market_discovery' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#EDE8DF] overflow-hidden shadow-sm">
            <HubStrip
              selectedCity={filters.city}
              onSelectCity={(city) => setFilters({ ...filters, city })}
            />
            <div className="p-4 sm:p-6 bg-[#FAF8F5]/50 border-t border-[#EDE8DF]">
              <SearchConsole
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={() => setFilters(initialFilters)}
                totalResultsCount={filteredHostels.length}
              />
            </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#0F172A] font-heading">
                  Market Accommodations ({filteredHostels.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Inspect competitive rental rates, meal inclusions, and vacancy levels in your zone
                </p>
              </div>

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
            </div>

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
                  onEnquire={(h) => navigate(`/hostels/${h.slug}`)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STANDARDS & FAQS */}
      {activeTab === 'standards_faqs' && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm">
            <FeaturesToolkit />
          </div>

          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm">
            <OldVsNewSection />
          </div>

          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm">
            <HowItWorks onSearchClick={() => setActiveTab('market_discovery')} />
          </div>

          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm">
            <FaqSection />
          </div>
        </div>
      )}

      {/* Compare Drawer */}
      <CompareDrawer
        comparedHostels={comparedHostels}
        onRemoveFromCompare={(id) => setComparedHostels((p) => p.filter((h) => h.id !== id))}
        onClearCompare={() => setComparedHostels([])}
        isOpenModal={isCompareModalOpen}
        onOpenModal={() => setIsCompareModalOpen(true)}
        onCloseModal={() => setIsCompareModalOpen(false)}
        onSelectHostel={(h) => navigate(`/hostels/${h.slug}`)}
      />

      {/* Toast Feedback */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
};
