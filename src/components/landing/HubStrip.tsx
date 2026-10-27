import React from 'react';
import { MapPin } from 'lucide-react';

interface HubStripProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

const POPULAR_HUBS = [
  { city: 'All Cities', label: 'All Locations', sub: 'Across India' },
  { city: 'Kota', label: 'Kota', sub: 'Allen, Resonance, Kunhari' },
  { city: 'Delhi', label: 'Delhi NCR', sub: 'DU North Campus, Kamla Nagar' },
  { city: 'Bengaluru', label: 'Bengaluru', sub: 'Koramangala, Christ Univ' },
  { city: 'Pune', label: 'Pune', sub: 'Viman Nagar, Symbiosis' },
  { city: 'Hyderabad', label: 'Hyderabad', sub: 'Madhapur, HITEC City' },
  { city: 'Jaipur', label: 'Jaipur', sub: 'Gopalpura, Coaching Hub' },
];

export const HubStrip: React.FC<HubStripProps> = ({ selectedCity, onSelectCity }) => {
  return (
    <div className="bg-white border-b border-[#EDE8DF] py-4 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 pr-2 border-r border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-[#FF4B26]" />
            Student Hubs:
          </div>

          <div className="flex items-center gap-2">
            {POPULAR_HUBS.map((hub) => {
              const isActive = selectedCity === hub.city;
              return (
                <button
                  key={hub.city}
                  onClick={() => onSelectCity(hub.city)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex flex-col items-start ${
                    isActive
                      ? 'bg-[#FF4B26] text-white shadow-sm'
                      : 'bg-[#FAF8F5] text-slate-700 hover:bg-[#FFE4DC] hover:text-[#FF4B26] border border-[#EDE8DF]'
                  }`}
                >
                  <span className="font-bold">{hub.label}</span>
                  <span className={`text-[10px] font-normal ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    {hub.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
