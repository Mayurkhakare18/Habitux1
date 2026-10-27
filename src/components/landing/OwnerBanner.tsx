import React from 'react';
import { Building2, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface OwnerBannerProps {
  onListClick: () => void;
  onDashboardClick: () => void;
}

export const OwnerBanner: React.FC<OwnerBannerProps> = ({ onListClick, onDashboardClick }) => {
  return (
    <section id="for-owners" className="py-16 sm:py-20 bg-[#0F172A] text-white overflow-hidden relative">
      {/* Decorative background circle */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF4B26]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl border border-slate-700/80 p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4B26]/20 text-[#FF4B26] text-xs font-bold border border-[#FF4B26]/30">
                <Building2 className="w-3.5 h-3.5" />
                FOR HOSTEL & PG OWNERS
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
                Fill Your Vacant Beds Faster. <br />
                <span className="text-[#FF4B26]">Zero Commission. 100% Direct Leads.</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                List your student property on Habitux in under 5 minutes. Connect directly with students from top universities like DU, IIT, Christ, and coaching hubs in Kota and Pune.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free listing & verified badge</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bed inventory manager</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct phone & WhatsApp leads</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={onListClick}
                className="w-full py-3.5 px-6 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#FF4B26]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                List Your Property
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onDashboardClick}
                className="w-full py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Open Owner Dashboard
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
