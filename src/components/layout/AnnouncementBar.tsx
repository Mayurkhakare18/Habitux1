import React from 'react';
import { ShieldCheck, Sparkles, PhoneCall, CheckCircle2 } from 'lucide-react';

interface AnnouncementBarProps {
  onListPropertyClick: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onListPropertyClick }) => {
  return (
    <div className="bg-[#0F172A] text-white text-xs sm:text-sm py-2 px-4 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FF4B26]/20 text-[#FF4B26] font-semibold text-xs whitespace-nowrap border border-[#FF4B26]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4B26]" />
            ZERO BROKERAGE
          </span>
          <span className="text-slate-300 font-medium whitespace-nowrap">
            100% physically verified student rooms & PGs. Directly connect with owners.
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Zero Hidden Fees
          </span>
          <span className="text-slate-600">|</span>
          <button
            onClick={onListPropertyClick}
            className="text-slate-300 hover:text-white underline underline-offset-4 cursor-pointer font-medium"
          >
            Are you an owner? List for free →
          </button>
        </div>
      </div>
    </div>
  );
};
