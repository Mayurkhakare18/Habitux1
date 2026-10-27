import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { 
  LayoutDashboard, 
  Search, 
  Heart, 
  CalendarCheck, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  Building2, 
  Bed, 
  CreditCard, 
  MessageSquare,
  Scale,
  Database
} from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/student/explore', icon: Search, label: 'Explore & Search' },
    { to: '/compare', icon: Scale, label: 'Compare Hostels' },
    { to: '/student/bookings', icon: Bed, label: 'My Bookings' },
    { to: '/student/payments', icon: CreditCard, label: 'Payments & Invoices' },
    { to: '/student/messages', icon: MessageSquare, label: 'Direct Messages' },
    { to: '/student/enquiries', icon: CalendarCheck, label: 'My Enquiries' },
    { to: '/student/saved', icon: Heart, label: 'Saved Hostels' },
    { to: '/student/notifications', icon: Bell, label: 'Notifications' },
    { to: '/student/profile', icon: User, label: 'Profile & Settings' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col lg:flex-row text-[#0F172A]">
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#EDE8DF] shrink-0 sticky top-0 h-screen z-30">
        {/* Brand */}
        <div className="p-5 border-b border-[#EDE8DF] flex items-center justify-between">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF4B26] to-[#FF7043] flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-lg">H</span>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#0F172A] font-heading">
                HABITUX
              </span>
              <span className="block text-[9px] uppercase font-bold tracking-widest text-[#FF4B26] -mt-1 font-heading">
                STUDENT LIVING
              </span>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <div className="p-3 flex-1 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Student Dashboard</span>
            {isSupabaseConfigured && (
              <span className="inline-flex items-center gap-1 text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                <Database className="w-2.5 h-2.5" /> Supabase
              </span>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FFF1ED] text-[#FF4B26] shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF4B26]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Public Website Link */}
        <div className="p-3 border-t border-[#EDE8DF] space-y-2">
          <button
            onClick={() => navigate('/hostels')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FF4B26]" /> Public Search
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User profile capsule */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                alt=""
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.full_name}</p>
                <p className="text-[10px] text-slate-500 capitalize">{user?.role} Resident</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EDE8DF] px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          {/* Mobile hamburger & brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Habitux Student</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#0F172A] capitalize">
                {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase Status Pill */}
            {isSupabaseConfigured ? (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Supabase Live</span>
              </div>
            ) : (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>0% Brokerage Guarantee</span>
              </div>
            )}

            <button
              onClick={() => navigate('/compare')}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-[#EDE8DF] text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-[#FF4B26]" />
              <span className="hidden sm:inline">Compare</span>
            </button>

            <button
              onClick={() => navigate('/student/explore')}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-[#EDE8DF] text-xs font-medium text-slate-600 flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search Stays</span>
            </button>

            <button
              onClick={() => navigate('/student/notifications')}
              className="p-2 text-slate-600 hover:text-[#FF4B26] hover:bg-[#FFF1ED] rounded-lg transition-colors cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF4B26]"></span>
            </button>
          </div>
        </header>

        {/* Mobile Slide-down Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-b border-[#EDE8DF] p-4 space-y-2 animate-in slide-in-from-top duration-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <button
                  key={item.to}
                  onClick={() => {
                    setMobileOpen(false);
                    navigate(item.to);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${
                    isActive ? 'bg-[#FFF1ED] text-[#FF4B26]' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
