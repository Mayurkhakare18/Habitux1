import React from 'react';
import { ShieldCheck, Sparkles, MapPin, Heart, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onSelectCity: (city: string) => void;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCity, onNavigate }) => {
  return (
    <footer className="bg-[#0A1120] text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF4B26] to-[#FF7043] flex items-center justify-center">
                <span className="text-white font-extrabold text-lg">H</span>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white font-heading">
                HABITUX
              </span>
            </div>
            
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India&apos;s zero-brokerage hostel and PG discovery platform. We connect collegiate students, interns, and young professionals directly with verified accommodation owners.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Genuine Listings
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4B26]/10 text-[#FF4B26] text-xs font-semibold border border-[#FF4B26]/20">
                <Sparkles className="w-3.5 h-3.5" />
                ₹0 Brokerage Always
              </span>
            </div>
          </div>

          {/* Popular Student Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              Student Hubs
            </h4>
            <ul className="space-y-2 text-sm">
              {['Kota', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Jaipur'].map((city) => (
                <li key={city}>
                  <button
                    onClick={() => onSelectCity(city)}
                    className="hover:text-white transition-colors flex items-center gap-1 text-slate-400 cursor-pointer"
                  >
                    <MapPin className="w-3 h-3 text-[#FF4B26]" />
                    Hostels in {city}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              For Students
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Search Accommodations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('compare')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  Compare Hostels
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('student_dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  My Saved Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('student_dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Enquiries
                </button>
              </li>
            </ul>
          </div>

          {/* For Property Owners */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              For Property Owners
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('owner_dashboard')}
                  className="hover:text-white transition-colors cursor-pointer text-[#FF4B26] font-medium"
                >
                  List Your Hostel for Free
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('owner_dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Owner Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('owner_dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bed Inventory Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin_dashboard')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-500"
                >
                  Admin Verification Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} HABITUX. Zero Brokerage Hostel Discovery. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onNavigate('hostels')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Zero Brokerage Pledge
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
