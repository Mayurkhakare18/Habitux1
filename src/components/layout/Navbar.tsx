import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Scale, 
  HelpCircle, 
  User, 
  PlusCircle, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Heart,
  MessageSquareText,
  BadgeCheck
} from 'lucide-react';
import { UserProfile } from '../../types';

interface NavbarProps {
  currentUser: UserProfile | null;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenAuth: (defaultRole?: 'student' | 'owner') => void;
  onSignOut: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onNavigate,
  onOpenAuth,
  onSignOut,
  savedCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (sectionId: string, tabName?: string) => {
    setMobileMenuOpen(false);
    if (tabName) {
      onNavigate(tabName);
    } else {
      onNavigate('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EDE8DF] shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('', 'home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF4B26] to-[#FF7043] flex items-center justify-center shadow-md shadow-[#FF4B26]/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-extrabold text-xl tracking-tight">H</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#0F172A] flex items-center gap-1 font-heading">
                HABITUX
                <span className="w-2 h-2 rounded-full bg-[#FF4B26] inline-block animate-pulse"></span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF4B26] -mt-1 font-heading">
                ZERO BROKERAGE
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#475569]">
            <button
              onClick={() => handleNavClick('featured-hostels', 'home')}
              className={`hover:text-[#FF4B26] transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'home' ? 'text-[#0F172A] font-semibold' : ''
              }`}
            >
              <Search className="w-4 h-4 text-[#FF4B26]" />
              Find Hostels
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="hover:text-[#FF4B26] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('', 'compare')}
              className={`hover:text-[#FF4B26] transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'compare' ? 'text-[#FF4B26] font-semibold' : ''
              }`}
            >
              <Scale className="w-4 h-4" />
              Compare Hostels
            </button>
            <button
              onClick={() => {
                if (currentUser?.role === 'owner') {
                  onNavigate('owner_dashboard');
                } else {
                  handleNavClick('for-owners');
                }
              }}
              className="hover:text-[#FF4B26] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              For Owners
            </button>
            <button
              onClick={() => handleNavClick('faq-section')}
              className="hover:text-[#FF4B26] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              FAQs
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Saved Hostels quick shortcut */}
            {savedCount > 0 && (
              <button
                onClick={() => onNavigate('student_dashboard')}
                className="relative p-2 text-slate-700 hover:text-[#FF4B26] hover:bg-[#FFF1ED] rounded-lg transition-colors cursor-pointer"
                title="Saved Hostels"
              >
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                <span className="absolute -top-1 -right-1 bg-[#FF4B26] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              </button>
            )}

            {/* List Property (Owner Button) */}
            <button
              onClick={() => {
                if (!currentUser) {
                  onOpenAuth('owner');
                } else if (currentUser.role === 'owner') {
                  onNavigate('owner_dashboard');
                } else {
                  onNavigate('owner_dashboard');
                }
              }}
              className="px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:text-[#FF4B26] bg-[#F4F0E8] hover:bg-[#FFE4DC] border border-[#EDE8DF] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#FF4B26]" />
              List Property
            </button>

            {/* User Profile or Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-lg border border-[#EDE8DF] bg-white hover:border-[#FF4B26]/40 transition-all cursor-pointer shadow-sm"
                >
                  <img
                    src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={currentUser.full_name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-[#FF4B26]/20"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-[#0F172A] leading-tight max-w-[100px] truncate">
                      {currentUser.full_name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-semibold text-[#FF4B26] uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#EDE8DF] py-2 z-50 text-xs"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900">{currentUser.full_name}</p>
                      <p className="text-slate-500 text-[11px] truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => onNavigate('student_dashboard')}
                      className="w-full px-3 py-2 text-left text-slate-700 hover:bg-[#FFF1ED] hover:text-[#FF4B26] flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Student Dashboard
                    </button>

                    <button
                      onClick={() => onNavigate('owner_dashboard')}
                      className="w-full px-3 py-2 text-left text-slate-700 hover:bg-[#FFF1ED] hover:text-[#FF4B26] flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <Building2 className="w-4 h-4" />
                      Owner Dashboard
                    </button>

                    <button
                      onClick={() => onNavigate('admin_dashboard')}
                      className="w-full px-3 py-2 text-left text-slate-700 hover:bg-[#FFF1ED] hover:text-[#FF4B26] flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <BadgeCheck className="w-4 h-4" />
                      Admin Verification
                    </button>

                    <div className="my-1 border-t border-slate-100"></div>

                    <button
                      onClick={onSignOut}
                      className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('student')}
                className="px-4 py-2 text-xs font-semibold text-[#0F172A] hover:text-[#FF4B26] bg-transparent hover:bg-slate-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <User className="w-4 h-4 text-slate-500" />
                Student Login
              </button>
            )}

            {/* Find Hostel Primary CTA */}
            <button
              onClick={() => handleNavClick('featured-hostels', 'home')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#FF4B26] hover:bg-[#E03713] rounded-lg shadow-sm shadow-[#FF4B26]/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              Find Hostel
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onOpenAuth('student')}
              className="p-2 text-slate-700 hover:text-[#FF4B26]"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EDE8DF] bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium">
            <button
              onClick={() => handleNavClick('featured-hostels', 'home')}
              className="px-3 py-2 rounded-lg text-left hover:bg-slate-50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#FF4B26]" /> Find Hostels
              </span>
              <span className="text-xs text-slate-400">Zero Brokerage</span>
            </button>

            <button
              onClick={() => handleNavClick('how-it-works')}
              className="px-3 py-2 rounded-lg text-left hover:bg-slate-50"
            >
              How It Works
            </button>

            <button
              onClick={() => handleNavClick('', 'compare')}
              className="px-3 py-2 rounded-lg text-left hover:bg-slate-50 flex items-center gap-2"
            >
              <Scale className="w-4 h-4 text-[#FF4B26]" /> Compare Accommodations
            </button>

            <button
              onClick={() => {
                handleNavClick('for-owners');
              }}
              className="px-3 py-2 rounded-lg text-left hover:bg-slate-50 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-[#FF4B26]" /> For Hostel Owners
            </button>

            <button
              onClick={() => handleNavClick('faq-section')}
              className="px-3 py-2 rounded-lg text-left hover:bg-slate-50 flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" /> FAQs
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('student_dashboard');
              }}
              className="w-full py-2.5 px-4 text-center rounded-lg bg-[#FFF1ED] text-[#FF4B26] font-semibold text-xs border border-[#FF4B26]/20"
            >
              Student Portal & Saved Hostels
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('owner_dashboard');
              }}
              className="w-full py-2.5 px-4 text-center rounded-lg bg-slate-900 text-white font-semibold text-xs"
            >
              Hostel Owner Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
