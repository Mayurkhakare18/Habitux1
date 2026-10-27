import React from 'react';
import { Scale, X, ArrowRight, Check, Minus, ShieldCheck, MapPin } from 'lucide-react';
import { Hostel } from '../../types';

interface CompareDrawerProps {
  comparedHostels: Hostel[];
  onRemoveFromCompare: (hostelId: string) => void;
  onClearCompare: () => void;
  isOpenModal: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onSelectHostel: (hostel: Hostel) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  comparedHostels,
  onRemoveFromCompare,
  onClearCompare,
  isOpenModal,
  onOpenModal,
  onCloseModal,
  onSelectHostel,
}) => {
  if (comparedHostels.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Bar */}
      {!isOpenModal && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-[#0F172A] text-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-8 h-8 rounded-lg bg-[#FF4B26] text-white flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold font-heading hidden sm:inline">
                Compare ({comparedHostels.length}/3)
              </span>
            </div>

            {/* Thumbnails */}
            <div className="flex items-center gap-2">
              {comparedHostels.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 rounded-lg text-xs font-medium border border-slate-700"
                >
                  <img
                    src={h.images[0]?.storage_path}
                    alt={h.name}
                    className="w-5 h-5 rounded-sm object-cover"
                  />
                  <span className="max-w-[80px] sm:max-w-[110px] truncate">{h.name}</span>
                  <button
                    onClick={() => onRemoveFromCompare(h.id)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClearCompare}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer hidden sm:inline"
            >
              Clear
            </button>

            <button
              onClick={onOpenModal}
              className="px-4 py-2 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Compare
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Full Screen Comparison Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-5xl rounded-3xl border border-[#EDE8DF] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#EDE8DF] flex items-center justify-between bg-slate-50 sticky top-0 z-20">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base font-heading">
                    Side-by-Side Accommodation Comparison
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transparent comparison matrix of pricing, food, deposits, and rules
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClearCompare}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={onCloseModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto p-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="p-3 w-1/4 font-extrabold text-slate-900 uppercase text-[11px] tracking-wider">
                      Parameter
                    </th>
                    {comparedHostels.map((h) => (
                      <th key={h.id} className="p-3 w-1/4">
                        <div className="space-y-2">
                          <img
                            src={h.images[0]?.storage_path}
                            alt={h.name}
                            className="w-full h-28 object-cover rounded-xl"
                          />
                          <h4 className="font-bold text-slate-900 text-sm font-heading line-clamp-1">
                            {h.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {h.locality}, {h.city}
                          </p>
                          <button
                            onClick={() => {
                              onCloseModal();
                              onSelectHostel(h);
                            }}
                            className="w-full py-1.5 bg-[#FFF1ED] hover:bg-[#FFE4DC] text-[#FF4B26] font-bold text-[11px] rounded-lg transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {/* Rent */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Monthly Rent</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-3 font-black text-[#FF4B26] text-sm">
                        ₹{h.monthly_rent_min.toLocaleString('en-IN')} - ₹{h.monthly_rent_max.toLocaleString('en-IN')}/mo
                      </td>
                    ))}
                  </tr>

                  {/* Security Deposit */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Security Deposit</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-3 font-semibold text-slate-800">
                        ₹{h.security_deposit.toLocaleString('en-IN')} (Refundable)
                      </td>
                    ))}
                  </tr>

                  {/* Electricity */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Electricity Policy</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-3 text-slate-700">
                        <span className="font-semibold block">{h.electricity_policy}</span>
                        <span className="text-slate-500 text-[11px]">{h.electricity_charge || 'Standard'}</span>
                      </td>
                    ))}
                  </tr>

                  {/* Food & Meals */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Food / Meal Plan</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-3 text-slate-700">
                        {h.food_available ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> 3x Daily Meals
                          </span>
                        ) : (
                          <span className="text-slate-400">Self Cook Only</span>
                        )}
                        <span className="text-slate-500 text-[11px] block mt-0.5">{h.meal_plan_description}</span>
                      </td>
                    ))}
                  </tr>

                  {/* Wi-Fi */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Wi-Fi Internet</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-3 font-semibold text-slate-800">
                        {h.wifi_available ? `${h.wifi_speed_mbps || 100} Mbps Fiber` : 'Not Provided'}
                      </td>
                    ))}
                  </tr>

                  {/* Power Backup */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Power Backup</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-3">
                        {h.power_backup ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> 24/7 Generator
                          </span>
                        ) : (
                          <span className="text-slate-400 flex items-center gap-1">
                            <Minus className="w-3.5 h-3.5" /> Standard Grid
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Curfew */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Curfew Timing</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-3 font-medium text-slate-800">
                        {h.curfew_policy || '10:00 PM'}
                      </td>
                    ))}
                  </tr>

                  {/* Distance */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Campus Proximity</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-3 text-slate-700">
                        {h.nearest_college_or_hub}
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Resident Rating</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-3 font-bold text-amber-600">
                        ★ {h.average_rating || 4.7} / 5 ({h.total_reviews || 10} reviews)
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
