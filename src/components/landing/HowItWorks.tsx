import React from 'react';
import { Search, Scale, CalendarCheck, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onSearchClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onSearchClick }) => {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Filter by Campus & Budget',
      description: 'Enter your university, coaching institute or target locality. Set your budget, sharing preferences, and dietary requirements.',
    },
    {
      num: '02',
      icon: Scale,
      title: 'Compare Verified Details',
      description: 'Inspect verified photos, transparent room pricing, meal menus, curfew timings, and read authentic resident feedback.',
    },
    {
      num: '03',
      icon: CalendarCheck,
      title: 'Direct Visit & Zero Brokerage',
      description: 'Connect directly with the hostel manager. Schedule a free on-site room tour, confirm your bed, and save full brokerage fees.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#EDE8DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF4B26]">
            SIMPLE 3-STEP PROCESS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight font-heading">
            How Habitux Works
          </h2>
          <p className="text-base text-slate-600">
            From discovering rooms to moving in — transparent, reliable, and without middleman pressure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#EDE8DF] p-8 shadow-sm relative group hover:border-[#FF4B26]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-slate-200 group-hover:text-[#FF4B26]/30 transition-colors font-heading">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-[#0F172A] mb-2 font-heading">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onSearchClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF4B26] hover:bg-[#E03713] text-white font-semibold text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            Start Finding Hostels
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
