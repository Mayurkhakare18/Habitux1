import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { HabituxAPI } from '../lib/supabase';
import { Hostel, SearchFilterState } from '../types';

// Layout Components
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

// Landing Components
import { HeroSection } from '../components/landing/HeroSection';
import { HubStrip } from '../components/landing/HubStrip';
import { SearchConsole } from '../components/landing/SearchConsole';
import { OldVsNewSection } from '../components/landing/OldVsNewSection';
import { FeaturesToolkit } from '../components/landing/FeaturesToolkit';
import { HowItWorks } from '../components/landing/HowItWorks';
import { OwnerBanner } from '../components/landing/OwnerBanner';
import { FaqSection } from '../components/landing/FaqSection';

// Hostel Components
import { HostelCard } from '../components/hostels/HostelCard';
import { EnquiryModal } from '../components/hostels/EnquiryModal';
import { CompareDrawer } from '../components/hostels/CompareDrawer';
import { Toast, ToastMessage } from '../components/ui/Toast';
import { Sparkles, ArrowUpDown, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [allHostels, setAllHostels] = useState<Hostel[]>([]);
  const [filteredHostels, setFilteredHostels] = useState<Hostel[]>([]);
  const [favoriteHostelIds, setFavoriteHostelIds] = useState<string[]>([]);
  const [comparedHostels, setComparedHostels] = useState<Hostel[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const [enquiryModalHostel, setEnquiryModalHostel] = useState<Hostel | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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

  useEffect(() => {
    HabituxAPI.getHostels().then((list) => {
      setAllHostels(list);
      setFilteredHostels(list);
    });

    if (user) {
      HabituxAPI.getFavorites(user.id).then(setFavoriteHostelIds);
    }
  }, [user]);

  useEffect(() => {
    HabituxAPI.getHostels(filters).then(setFilteredHostels);
  }, [filters]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = `t-${Date.now()}`;
    setToasts((p) => [...p, { id, type, text }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
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

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] flex flex-col selection:bg-[#FFE4DC] selection:text-[#FF4B26]">
      <AnnouncementBar onListPropertyClick={() => navigate('/owner/register')} />

      <Navbar
        currentUser={user}
        activeTab="home"
        onNavigate={(tab) => {
          if (tab === 'student_dashboard') navigate('/student/dashboard');
          else if (tab === 'owner_dashboard') navigate('/owner/dashboard');
          else if (tab === 'admin_dashboard') navigate('/admin/dashboard');
          else if (tab === 'compare') navigate('/compare');
          else if (tab === 'privacy') navigate('/privacy');
          else if (tab === 'terms') navigate('/terms');
          else navigate('/hostels');
        }}
        onOpenAuth={() => navigate('/login')}
        onSignOut={async () => {
          await signOut();
          addToast('info', 'Signed out successfully');
        }}
        savedCount={favoriteHostelIds.length}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onExploreClick={() => navigate('/hostels')}
          onCompareClick={() => navigate('/compare')}
          onListClick={() => navigate('/owner/register')}
          featuredPreviewHostel={allHostels[0] || null}
          onSelectHostel={(h) => navigate(`/hostels/${h.slug}`)}
        />

        {/* Academic Hub Strip */}
        <HubStrip
          selectedCity={filters.city}
          onSelectCity={(city) => {
            navigate(`/hostels?city=${encodeURIComponent(city)}`);
          }}
        />

        {/* Search Console */}
        <SearchConsole
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={() => setFilters(initialFilters)}
          totalResultsCount={filteredHostels.length}
        />

        {/* Featured Hostels Section */}
        <section id="featured-hostels" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1ED] text-[#FF4B26] text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                VERIFIED ACCOMMODATIONS
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight font-heading">
                {filters.city !== 'All Cities' ? `Hostels in ${filters.city}` : 'Featured Student Accommodations'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing <span className="font-bold text-[#0F172A]">{filteredHostels.length}</span> zero-brokerage verified properties
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-600">Sort:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  className="p-2 bg-white border border-[#EDE8DF] rounded-xl text-xs font-semibold text-slate-800 shadow-xs"
                >
                  <option value="recommended">Recommended & Verified</option>
                  <option value="price_low">Rent: Low to High</option>
                  <option value="price_high">Rent: High to Low</option>
                  <option value="rating">Top Resident Rating</option>
                  <option value="availability">Highest Bed Availability</option>
                </select>
              </div>

              <button
                onClick={() => navigate('/hostels')}
                className="px-3.5 py-2 bg-[#FFF1ED] hover:bg-[#FFE4DC] text-[#FF4B26] font-bold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredHostels.slice(0, 6).map((hostel) => (
              <HostelCard
                key={hostel.id}
                hostel={hostel}
                isFavorite={favoriteHostelIds.includes(hostel.id)}
                isCompared={comparedHostels.some((h) => h.id === hostel.id)}
                onToggleFavorite={handleToggleFavorite}
                onToggleCompare={handleToggleCompare}
                onSelectHostel={(h) => navigate(`/hostels/${h.slug}`)}
                onEnquire={(h) => setEnquiryModalHostel(h)}
              />
            ))}
          </div>
        </section>

        {/* The Old Broker Hunt vs The Habitux Standard */}
        <OldVsNewSection />

        {/* 12-Feature Toolkit */}
        <FeaturesToolkit />

        {/* How It Works */}
        <HowItWorks onSearchClick={() => navigate('/hostels')} />

        {/* For Owners */}
        <OwnerBanner
          onListClick={() => navigate('/owner/register')}
          onDashboardClick={() => navigate('/owner/dashboard')}
        />

        {/* FAQ Accordion */}
        <FaqSection />
      </main>

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

      {/* Enquiry Modal */}
      <EnquiryModal
        hostel={enquiryModalHostel}
        currentUser={user}
        onClose={() => setEnquiryModalHostel(null)}
        onSubmitEnquiry={async (data) => {
          const res = await HabituxAPI.submitEnquiry(data);
          addToast('success', 'Visit request submitted to owner!');
          return res;
        }}
      />

      {/* Toast Feedback */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />

      {/* Footer */}
      <Footer
        onSelectCity={(city) => navigate(`/hostels?city=${encodeURIComponent(city)}`)}
        onNavigate={(tab) => {
          if (tab === 'compare') navigate('/compare');
          else if (tab === 'student_dashboard') navigate('/student/dashboard');
          else if (tab === 'owner_dashboard') navigate('/owner/dashboard');
          else if (tab === 'admin_dashboard') navigate('/admin/dashboard');
          else if (tab === 'privacy') navigate('/privacy');
          else if (tab === 'terms') navigate('/terms');
          else navigate('/hostels');
        }}
      />
    </div>
  );
};
