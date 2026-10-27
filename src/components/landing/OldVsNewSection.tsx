import React from 'react';
import { XCircle, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

export const OldVsNewSection: React.FC = () => {
  const comparisons = [
    {
      title: 'Brokerage & Commission',
      oldWay: 'Local brokers charge 15-30 days rent as non-refundable brokerage fees.',
      habituxWay: '100% Zero Brokerage always. Pay only your actual room rent and transparent deposit.',
    },
    {
      title: 'Photos & Room Reality',
      oldWay: 'Old, distorted photos taken years ago. Real rooms are cramped and dusty.',
      habituxWay: 'Recent, physically verified photography with authentic student reviews and room tours.',
    },
    {
      title: 'Curfew & House Rules',
      oldWay: 'Surprise restrictive rules, locked gates, and hidden fines revealed after deposit.',
      habituxWay: 'Transparent gate timings, visitor policies, and parent stay terms published upfront.',
    },
    {
      title: 'Food & Meal Quality',
      oldWay: 'Generic claims of "home food" that turns out unhygienic with repetitive menus.',
      habituxWay: 'Verified meal menus, 3x daily food schedule, hygiene ratings, and trial meal options.',
    },
    {
      title: 'Security Deposit Refund',
      oldWay: 'Arbitrary deductions, delayed refunds, and endless excuses when vacating.',
      habituxWay: 'Written deposit terms with clear notice period guidelines directly agreed with owners.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#EDE8DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4B26]" />
            THE HABITUX ADVANTAGE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight font-heading">
            The Old Broken Hunt vs <span className="text-[#FF4B26]">The Habitux Standard</span>
          </h2>
          <p className="text-base text-slate-600">
            Why thousands of students and parents avoid traditional local brokers and rely on Habitux.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          
          {/* Old Broken Way Card */}
          <div className="bg-white rounded-2xl border border-rose-200/80 p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500" />
            <div className="flex items-center gap-2.5 pb-6 border-b border-rose-100">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-heading">
                  The Old Broker Hunt
                </h3>
                <p className="text-xs text-rose-600 font-medium">Uncertain, expensive & stressful</p>
              </div>
            </div>

            <ul className="mt-6 space-y-5 text-sm text-slate-600">
              {comparisons.map((item, idx) => (
                <li key={idx} className="space-y-1">
                  <span className="font-bold text-slate-800 text-xs block">{item.title}</span>
                  <div className="flex items-start gap-2 text-slate-600">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{item.oldWay}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* The Habitux Standard Card */}
          <div className="bg-white rounded-2xl border-2 border-[#FF4B26]/30 p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF4B26] to-amber-500" />
            
            <div className="flex items-center gap-2.5 pb-6 border-b border-[#FFE4DC]">
              <div className="w-9 h-9 rounded-xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-heading flex items-center gap-1.5">
                  The Habitux Standard
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">VERIFIED</span>
                </h3>
                <p className="text-xs text-[#FF4B26] font-medium">Transparent, zero brokerage & student-first</p>
              </div>
            </div>

            <ul className="mt-6 space-y-5 text-sm text-slate-700">
              {comparisons.map((item, idx) => (
                <li key={idx} className="space-y-1">
                  <span className="font-bold text-[#0F172A] text-xs block">{item.title}</span>
                  <div className="flex items-start gap-2 text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item.habituxWay}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
