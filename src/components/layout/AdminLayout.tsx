import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { 
  BadgeCheck, 
  LayoutDashboard, 
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/listings', icon: ShieldCheck, label: 'Listing Review Queue' },
    { to: '/admin/reviews', icon: MessageSquare, label: 'Review Moderation' },
    { to: '/admin/reports', icon: FileText, label: 'Reports & Audit Log' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col lg:flex-row text-[#0F172A]">
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0A1120] text-white shrink-0 sticky top-0 h-screen z-30 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white font-heading">
                HABITUX
              </span>
              <span className="block text-[9px] uppercase font-bold tracking-widest text-emerald-400 -mt-1 font-heading">
                ADMIN CONSOLE
              </span>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <div className="p-3 flex-1 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Verification & Audit
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
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Public Website & Profile */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={() => navigate('/hostels')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> View Public Site
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* User capsule */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                AD
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
                <p className="text-[10px] text-emerald-400">Platform Admin</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EDE8DF] px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Admin Console</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#0F172A] capitalize">
                {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
          </div>
        </header>

        {mobileOpen && (
          <div className="lg:hidden bg-[#0A1120] text-white p-4 space-y-2 animate-in slide-in-from-top duration-200">
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
                    isActive ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-slate-800 rounded-xl"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
