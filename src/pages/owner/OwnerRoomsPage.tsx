import React, { useState, useEffect } from 'react';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { Hostel } from '../../types';
import { 
  Bed, 
  Plus, 
  Minus, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  RefreshCw
} from 'lucide-react';

export const OwnerRoomsPage: React.FC = () => {
  const { user } = useAuth();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const list = await HabituxAPI.getHostels();
    setHostels(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateBeds = async (hostelId: string, roomTypeId: string, newAvail: number, newTotal: number) => {
    if (newAvail < 0) return;
    if (newAvail > newTotal) {
      alert('Available beds cannot exceed total beds in this room.');
      return;
    }

    const key = `${hostelId}-${roomTypeId}`;
    setSavingKey(key);

    try {
      await HabituxAPI.updateRoomAvailability(hostelId, roomTypeId, newAvail, newTotal);
      
      // Update local state directly
      setHostels((prev) =>
        prev.map((h) => {
          if (h.id !== hostelId) return h;
          return {
            ...h,
            room_types: h.room_types.map((rt) => {
              if (rt.id !== roomTypeId) return rt;
              return { ...rt, available_beds: newAvail, total_beds: newTotal };
            })
          };
        })
      );

      setFeedback('Bed inventory updated and live on student search!');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update bed count');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
            Live Room & Bed Inventory Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time occupancy control. When a student checks in or leaves, update vacant beds here to reflect instantly on student search.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 border border-[#EDE8DF] hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {feedback}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading properties and room types...</div>
      ) : hostels.length > 0 ? (
        <div className="space-y-6">
          {hostels.map((h) => {
            const totalAvailInHostel = h.room_types.reduce((sum, r) => sum + r.available_beds, 0);
            const totalBedsInHostel = h.room_types.reduce((sum, r) => sum + r.total_beds, 0);

            return (
              <div
                key={h.id}
                className="bg-white rounded-3xl border border-[#EDE8DF] p-6 shadow-xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-[#0F172A] font-heading">
                        {h.name}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {h.locality}, {h.city} • Starting ₹{h.monthly_rent_min.toLocaleString('en-IN')}/mo
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Total Vacancy:</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      {totalAvailInHostel} / {totalBedsInHostel} Beds Free
                    </span>
                  </div>
                </div>

                {/* Rooms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {h.room_types.map((rt) => {
                    const isSaving = savingKey === `${h.id}-${rt.id}`;
                    const occupancyPct = Math.round(((rt.total_beds - rt.available_beds) / rt.total_beds) * 100);

                    return (
                      <div
                        key={rt.id}
                        className="p-4 rounded-2xl border border-[#EDE8DF] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-900 font-heading">
                            {rt.room_name}
                          </span>
                          <span className="text-[11px] font-bold text-[#FF4B26]">
                            ₹{rt.monthly_rent.toLocaleString('en-IN')}/mo
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{rt.sharing_capacity} Sharing ({rt.air_conditioned ? 'AC' : 'Non-AC'})</span>
                          <span className="font-bold text-slate-700">{occupancyPct}% Occupied</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              occupancyPct > 90 ? 'bg-rose-500' : occupancyPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${occupancyPct}%` }}
                          />
                        </div>

                        {/* Counter Controls */}
                        <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Available Beds</span>
                            <span className="text-sm font-black text-slate-900">{rt.available_beds} of {rt.total_beds}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={rt.available_beds <= 0 || isSaving}
                              onClick={() => handleUpdateBeds(h.id, rt.id, rt.available_beds - 1, rt.total_beds)}
                              className="w-8 h-8 rounded-lg bg-white border border-[#EDE8DF] hover:bg-slate-100 disabled:opacity-30 text-slate-800 flex items-center justify-center font-bold text-sm cursor-pointer"
                              title="Decrease available bed (student checked in)"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              disabled={rt.available_beds >= rt.total_beds || isSaving}
                              onClick={() => handleUpdateBeds(h.id, rt.id, rt.available_beds + 1, rt.total_beds)}
                              className="w-8 h-8 rounded-lg bg-white border border-[#EDE8DF] hover:bg-slate-100 disabled:opacity-30 text-slate-800 flex items-center justify-center font-bold text-sm cursor-pointer"
                              title="Increase available bed (student checked out)"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Payment Terms & Pay at Property Configuration */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                        Payment Terms & Pay at Property Settings
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Allow students to reserve rooms with a flexible advance token or full online payment.
                      </p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-300">
                      <input
                        type="checkbox"
                        checked={h.pay_at_property_enabled || false}
                        onChange={async (e) => {
                          const val = e.target.checked;
                          await HabituxAPI.updateHostelPaymentSettings(h.id, {
                            payAtPropertyEnabled: val,
                            advancePercentageRequired: h.advance_percentage_required || 20,
                            payAtPropertyRules: h.pay_at_property_rules || 'Pay remaining balance upon move-in inspection.',
                          });
                          loadData();
                        }}
                        className="rounded text-[#FF4B26] focus:ring-[#FF4B26]"
                      />
                      <span className="text-xs font-bold text-slate-800">Enable Pay at Property</span>
                    </label>
                  </div>

                  {h.pay_at_property_enabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 block">
                          Online Token Advance Required:
                        </label>
                        <select
                          value={h.advance_percentage_required || 20}
                          onChange={async (e) => {
                            const pct = Number(e.target.value);
                            await HabituxAPI.updateHostelPaymentSettings(h.id, {
                              payAtPropertyEnabled: true,
                              advancePercentageRequired: pct,
                            });
                            loadData();
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          <option value={0}>0% (Zero Advance - Full Amount at Check-in)</option>
                          <option value={10}>10% Token Advance Online</option>
                          <option value={20}>20% Token Advance Online</option>
                          <option value={50}>50% Advance Online</option>
                          <option value={100}>100% Full Advance Online</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 block">
                          Arrival Check-in Payment Instructions:
                        </label>
                        <input
                          type="text"
                          defaultValue={h.pay_at_property_rules || 'Balance payable at reception via Cash, UPI, or IMPS upon inspection.'}
                          onBlur={async (e) => {
                            await HabituxAPI.updateHostelPaymentSettings(h.id, {
                              payAtPropertyEnabled: true,
                              advancePercentageRequired: h.advance_percentage_required || 20,
                              payAtPropertyRules: e.target.value,
                            });
                          }}
                          placeholder="e.g. Balance payable at reception upon inspection"
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#EDE8DF]">
          <p className="text-xs text-slate-500">No properties registered under your owner profile.</p>
        </div>
      )}
    </div>
  );
};
