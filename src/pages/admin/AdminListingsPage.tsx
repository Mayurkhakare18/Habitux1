import React, { useState, useEffect } from 'react';
import { HabituxAPI } from '../../lib/supabase';
import { Hostel } from '../../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Building2, 
  MapPin, 
  Phone, 
  IndianRupee,
  Utensils,
  Wifi,
  Sparkles
} from 'lucide-react';

export const AdminListingsPage: React.FC = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  
  // Reject reason modal
  const [rejectingHostelId, setRejectingHostelId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedInspectHostel, setSelectedInspectHostel] = useState<Hostel | null>(null);

  const loadHostels = async () => {
    setLoading(true);
    const list = await HabituxAPI.getHostels();
    setHostels(list);
    setLoading(false);
  };

  useEffect(() => {
    loadHostels();
  }, []);

  const handleApproveVerify = async (hostelId: string) => {
    try {
      await HabituxAPI.updateHostel(hostelId, {
        verification_status: 'verified',
        listing_status: 'published',
      });
      setHostels((prev) =>
        prev.map((h) =>
          h.id === hostelId ? { ...h, verification_status: 'verified', listing_status: 'published' } : h
        )
      );
      if (selectedInspectHostel?.id === hostelId) {
        setSelectedInspectHostel((prev) => prev ? { ...prev, verification_status: 'verified', listing_status: 'published' } : null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update verification status');
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingHostelId || !rejectReason.trim()) return;

    try {
      await HabituxAPI.updateHostel(rejectingHostelId, {
        verification_status: 'rejected',
        listing_status: 'rejected',
      });
      setHostels((prev) =>
        prev.map((h) =>
          h.id === rejectingHostelId ? { ...h, verification_status: 'rejected', listing_status: 'rejected' } : h
        )
      );
      setRejectingHostelId(null);
      setRejectReason('');
      if (selectedInspectHostel?.id === rejectingHostelId) {
        setSelectedInspectHostel(null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to reject submission');
    }
  };

  const filteredHostels = hostels.filter((h) => {
    if (filter === 'all') return true;
    return h.verification_status === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
            Hostel Listing Review & Verification Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit owner property submissions, check license/meter policies, and toggle official verified badge
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#EDE8DF] rounded-xl self-start sm:self-auto">
          {[
            { id: 'all', label: 'All Listings' },
            { id: 'pending', label: 'Pending Review' },
            { id: 'verified', label: 'Verified' },
            { id: 'rejected', label: 'Rejected' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading listings...</div>
      ) : filteredHostels.length > 0 ? (
        <div className="space-y-4">
          {filteredHostels.map((h) => (
            <div
              key={h.id}
              className="bg-white rounded-3xl border border-[#EDE8DF] p-6 shadow-xs hover:border-emerald-500/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={h.images[0]?.storage_path}
                  alt={h.name}
                  className="w-24 h-20 object-cover rounded-2xl border border-slate-200 shrink-0"
                />

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      h.verification_status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : h.verification_status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {h.verification_status}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                      {h.property_type} • {h.gender_policy}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base font-heading">
                    {h.name}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {h.locality}, {h.city} • Near: {h.nearest_college_or_hub}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                    <span>Rent: <strong>₹{h.monthly_rent_min.toLocaleString('en-IN')}+</strong></span>
                    <span>Deposit: <strong>₹{h.security_deposit.toLocaleString('en-IN')}</strong></span>
                    <span>Curfew: <strong>{h.curfew_policy}</strong></span>
                    <span>Owner: <strong>{h.owner_name}</strong> ({h.owner_phone})</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                <button
                  type="button"
                  onClick={() => setSelectedInspectHostel(h)}
                  className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Inspect Full Info
                </button>

                {h.verification_status !== 'verified' && (
                  <button
                    type="button"
                    onClick={() => handleApproveVerify(h.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve & Verify
                  </button>
                )}

                {h.verification_status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => setRejectingHostelId(h.id)}
                    className="px-3.5 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#EDE8DF]">
          <p className="text-xs text-slate-500">No properties in this verification state.</p>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingHostelId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-[#0F172A] text-base font-heading flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Mandatory Rejection Reason
              </h3>
              <button
                type="button"
                onClick={() => setRejectingHostelId(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReject} className="space-y-4">
              <p className="text-xs text-slate-500">
                Provide a clear audit reason (e.g. invalid photo proof, undisclosed high security deposit, illegal meter tariff):
              </p>

              <textarea
                rows={4}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Inconsistent photo resolution. Electricity charges do not comply with municipal tariffs. Please re-submit with meter photo."
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingHostelId(null)}
                  className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Inspection Modal */}
      {selectedInspectHostel && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-[#0F172A] text-lg font-heading">
                  Administrative Audit: {selectedInspectHostel.name}
                </h3>
                <p className="text-xs text-slate-500">
                  ID: {selectedInspectHostel.id} • Slug: {selectedInspectHostel.slug}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInspectHostel(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">Owner</span>
                  <strong>{selectedInspectHostel.owner_name} ({selectedInspectHostel.owner_phone})</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Verification Status</span>
                  <strong className="uppercase text-emerald-600">{selectedInspectHostel.verification_status}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Security Deposit</span>
                  <strong>₹{selectedInspectHostel.security_deposit.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Electricity Policy</span>
                  <strong>{selectedInspectHostel.electricity_policy}</strong>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Room Types & Beds:</h4>
                <div className="space-y-1">
                  {selectedInspectHostel.room_types.map((rt) => (
                    <div key={rt.id} className="p-2 border border-slate-200 rounded-lg flex justify-between">
                      <span>{rt.room_name} ({rt.sharing_capacity} sharing)</span>
                      <strong>₹{rt.monthly_rent}/mo • {rt.available_beds}/{rt.total_beds} beds free</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">House Rules & Curfew:</h4>
                <p className="text-slate-600">{selectedInspectHostel.curfew_policy}</p>
                <p className="text-slate-600 mt-1">Visitors: {selectedInspectHostel.visitor_policy}</p>
              </div>

              {/* Photos Gallery */}
              <div>
                <h4 className="font-bold text-slate-800 mb-1.5">Submitted Photos:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {selectedInspectHostel.images.map((img, i) => (
                    <img
                      key={i}
                      src={img.storage_path}
                      alt={img.caption}
                      className="aspect-16/10 object-cover rounded-lg border border-slate-200"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedInspectHostel(null)}
                className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl"
              >
                Close Audit
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleApproveVerify(selectedInspectHostel.id);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  Confirm & Mark Verified
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
