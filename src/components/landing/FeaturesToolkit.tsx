import React from 'react';
import { 
  Sparkles, 
  Camera, 
  PhoneCall, 
  Utensils, 
  Wifi, 
  Zap, 
  Shirt, 
  ShieldCheck, 
  CreditCard, 
  Users, 
  Navigation, 
  FileText 
} from 'lucide-react';

export const FeaturesToolkit: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Zero Brokerage Guarantee',
      desc: 'Browse, enquire, schedule visits, and book your room without paying a single rupee of brokerage fees.',
      color: 'text-[#FF4B26] bg-[#FFF1ED]',
    },
    {
      icon: Camera,
      title: '100% Verified Photos',
      desc: 'Every hostel room, bathroom, dining area, and common room is photographed recently with zero wide-angle distortion.',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: PhoneCall,
      title: 'Direct Owner Connection',
      desc: 'Speak directly with the property manager or hostel warden via verified phone number or instant WhatsApp.',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: Utensils,
      title: 'Hygienic 3x Meal Plans',
      desc: 'Nutritious breakfast, lunch, and dinner. Pure veg, non-veg choices, and special examination study snacks.',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      icon: Wifi,
      title: 'High-Speed Student Wi-Fi',
      desc: 'Commercial optical fiber connections (100 to 300 Mbps) with low latency for online classes and research.',
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      icon: Zap,
      title: '24/7 Generator Power Backup',
      desc: 'Heavy-duty automatic diesel generator backups so power cuts never interrupt your exam preparations.',
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      icon: Shirt,
      title: 'Professional Laundry Facilities',
      desc: 'Regular in-house laundry service or automatic washing machines and iron tables on each floor.',
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      icon: ShieldCheck,
      title: 'Biometric Access & CCTV',
      desc: 'Electronic turnstiles, smart thumb scanners, 24/7 security wardens, and high-resolution camera coverage.',
      color: 'text-rose-600 bg-rose-50',
    },
    {
      icon: CreditCard,
      title: 'Transparent Security Deposit',
      desc: 'Zero arbitrary deductions. Standard 15 to 30 days written notice period with clear refund clauses.',
      color: 'text-teal-600 bg-teal-50',
    },
    {
      icon: Users,
      title: 'Single, Double & Triple Sharing',
      desc: 'Choose between complete privacy in single studio rooms or budget-friendly double & triple sharing options.',
      color: 'text-purple-600 bg-purple-50',
    },
    {
      icon: Navigation,
      title: 'Walking Distance to Campus',
      desc: 'Filter properties within 200m to 1km from university gates, coaching institutes, and metro stations.',
      color: 'text-orange-600 bg-orange-50',
    },
    {
      icon: FileText,
      title: 'Clear Written House Rules',
      desc: 'Know curfew hours, visitor guidelines, and quiet hours before scheduling a visit. No unexpected surprises.',
      color: 'text-slate-600 bg-slate-100',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#EDE8DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF4B26]">
            COMPLETE AMENITIES & STANDARDS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight font-heading">
            Built for Students. <span className="text-[#FF4B26]">Trusted by Parents.</span>
          </h2>
          <p className="text-base text-slate-600">
            Every listing on Habitux must fulfill our mandatory student safety, hygiene, and transparency checklist.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-[#EDE8DF] bg-[#FAF8F5]/50 hover:bg-white hover:border-[#FF4B26]/30 hover:shadow-md transition-all group"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#0F172A] mb-1.5 font-heading">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
