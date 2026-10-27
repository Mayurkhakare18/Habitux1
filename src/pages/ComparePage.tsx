import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { HabituxAPI } from '../lib/supabase';
import { Hostel } from '../types';

import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { 
  Scale, 
  X, 
  Plus, 
  Check, 
  Minus, 
  Star, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';

export const ComparePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [allHostels, setAllHostels] = useState<Hostel[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    HabituxAPI.getHostels().then((list) => {
      setAllHostels(list);
      if (list.length >= 2) {
        setSelectedIds([list[0].id, list[1].id]);
      }
    });
  }, []);

  const comparedHostels = allHostels.filter((h) => selectedIds.includes(h.id));

  const addHostelToCompare = (id: string) => {
    if (selectedIds.length >= 3) return;
    if (!selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeHostelFromCompare = (id: string) => {
    setSelectedIds(selectedIds.filter((x) => x !== id));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] flex flex-col selection:bg-[#FFE4DC] selection:text-[#FF4B26]">
      <Navbar
        currentUser={user}
        activeTab="compare"
        onNavigate={(tab) => {
          if (tab === 'student_dashboard') navigate('/student/dashboard');
          else if (tab === 'owner_dashboard') navigate('/owner/dashboard');
          else if (tab === 'admin_dashboard') navigate('/admin/dashboard');
          else navigate('/');
        }}
        onOpenAuth={() => navigate('/login')}
        onSignOut={signOut}
        savedCount={0}
      />

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-[#EDE8DF] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Link to="/" className="hover:text-[#FF4B26]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Compare Accommodations</span>
          </div>
          <span className="text-slate-500 font-medium hidden sm:inline">
            Compare up to 3 verified student hostels side-by-side
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1ED] text-[#FF4B26] text-xs font-bold mb-1.5">
              <Scale className="w-3.5 h-3.5" />
              TRANSPARENT COMPARISON
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-heading">
              Compare Student Hostels & PGs
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Analyze rents, meal policies, security deposits, and curfew rules to find your perfect fit
            </p>
          </div>

          {/* Add Dropdown if under 3 */}
          {selectedIds.length < 3 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Add Hostel:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addHostelToCompare(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="p-2 bg-white border border-[#EDE8DF] rounded-xl text-xs font-semibold text-slate-800 shadow-xs"
              >
                <option value="">Select a hostel to compare...</option>
                {allHostels
                  .filter((h) => !selectedIds.includes(h.id))
                  .map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.city})
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {/* Matrix Table */}
        {comparedHostels.length > 0 ? (
          <div className="bg-white rounded-3xl border border-[#EDE8DF] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="p-4 w-1/4 font-extrabold text-slate-900 uppercase text-[11px] tracking-wider bg-slate-50/50">
                      Parameter
                    </th>
                    {comparedHostels.map((h) => (
                      <th key={h.id} className="p-4 w-1/4 align-top">
                        <div className="space-y-3 relative">
                          <button
                            onClick={() => removeHostelFromCompare(h.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <img
                            src={h.images[0]?.storage_path}
                            alt=""
                            className="w-full h-36 object-cover rounded-2xl"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-[#FF4B26] uppercase">
                              {h.locality}, {h.city}
                            </span>
                            <h4 className="font-extrabold text-slate-900 text-base font-heading line-clamp-1">
                              {h.name}
                            </h4>
                          </div>
                          <button
                            onClick={() => navigate(`/hostels/${h.slug}`)}
                            className="w-full py-2 bg-[#FFF1ED] hover:bg-[#FFE4DC] text-[#FF4B26] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                          >
                            View Details <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4 font-bold text-slate-800 bg-slate-50/50">Starting Monthly Rent</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-4 font-black text-[#FF4B26] text-base font-heading">
                        ₹{h.monthly_rent_min.toLocaleString('en-IN')} - ₹{h.monthly_rent_max.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-slate-500"> /mo</span>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-slate-800 bg-slate-50/50">Security Deposit</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-4 font-bold text-slate-900">
                        ₹{h.security_deposit.toLocaleString('en-IN')} (Refundable)
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-slate-800 bg-slate-50/50">Electricity Terms</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-4 text-slate-700">
                        <span className="font-semibold block">{h.electricity_policy}</span>
                        <span className="text-slate-500 text-[11px]">{h.electricity_charge || 'Standard charges'}</span>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-slate-800 bg-slate-50/50">Sharing Options</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-4 text-slate-800 font-medium">
                        {h.room_types.map((r) => r.sharing_capacity === 1 ? 'Single Room' : `${r.sharing_capacity}-Sharing`).join(', ')}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-slate-800 bg-slate-50/50">3x Meal Plan</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-4">
                        {h.food_available ? (
                          <div>
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> 3x Daily Food
                            </span>
                            <span className="text-slate-500 text-[11px] block mt-0.5">{h.meal_plan_description}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Self Cook Only</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-slate-800 bg-slate-50/50">Wi-Fi Internet Speed</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-4 font-semibold text-slate-800">
                        {h.wifi_available ? `${h.wifi_speed_mbps || 100} Mbps Fiber` : 'No Wi-Fi'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-slate-800 bg-slate-50/50">Power Backup (Generator)</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-4">
                        {h.power_backup ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> 24/7 Heavy Generator
                          </span>
                        ) : (
                          <span className="text-slate-400 flex items-center gap-1">
                            <Minus className="w-3.5 h-3.5" /> Standard Grid Only
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-slate-800 bg-slate-50/50">Gate Curfew Policy</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-4 font-semibold text-slate-800">
                        {h.curfew_policy || '10:00 PM'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-slate-800 bg-slate-50/50">Campus Proximity</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-4 text-slate-700">
                        {h.nearest_college_or_hub}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-slate-800 bg-slate-50/50">Resident Rating</td>
                    {comparedHostels.map((h) => (
                      <td key={h.id} className="p-4 font-bold text-amber-600">
                        ★ {h.average_rating || 4.7} / 5 ({h.total_reviews || 10} reviews)
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#EDE8DF]">
            <p className="text-sm text-slate-600 mb-4">No hostels selected for comparison.</p>
            <Link to="/hostels" className="px-5 py-2.5 bg-[#FF4B26] text-white text-xs font-bold rounded-xl">
              Browse Hostels to Compare
            </Link>
          </div>
        )}
      </main>

      <Footer
        onSelectCity={(c) => navigate(`/hostels?city=${encodeURIComponent(c)}`)}
        onNavigate={(tab) => {
          if (tab === 'student_dashboard') navigate('/student/dashboard');
          else if (tab === 'owner_dashboard') navigate('/owner/dashboard');
          else if (tab === 'admin_dashboard') navigate('/admin/dashboard');
          else navigate('/');
        }}
      />
    </div>
  );
};
