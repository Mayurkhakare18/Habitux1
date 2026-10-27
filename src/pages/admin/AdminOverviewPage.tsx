import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HabituxAPI } from '../../lib/supabase';
import { Hostel, Review } from '../../types';
import { 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  FileText, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      HabituxAPI.getHostels(),
      HabituxAPI.getAllReviews(),
      HabituxAPI.getAllReports()
    ]).then(([hList, rList, repList]) => {
      setHostels(hList);
      setReviews(rList);
      setReports(repList);
      setLoading(false);
    });
  }, []);

  const pendingHostels = hostels.filter((h) => h.verification_status === 'pending');
  const verifiedHostels = hostels.filter((h) => h.verification_status === 'verified');
  const pendingReviews = reviews.filter((r) => r.moderation_status === 'pending');
  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-[#0A1120] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            ADMINISTRATIVE MODERATION CONSOLE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
            Habitux Trust & Verification Engine
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Maintain platform integrity: review hostel owner submissions, audit amenity claims, and moderate student community reviews.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/listings')}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#0A1120] font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Clock className="w-4 h-4" /> Review Submissions ({pendingHostels.length})
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate('/admin/listings')}
          className="bg-white p-5 rounded-2xl border border-[#EDE8DF] hover:border-emerald-500/40 shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Listings</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600 font-heading">
            {pendingHostels.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting physical / doc audit</p>
        </div>

        <div 
          onClick={() => navigate('/admin/listings')}
          className="bg-white p-5 rounded-2xl border border-[#EDE8DF] hover:border-emerald-500/40 shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Live</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 font-heading">
            {verifiedHostels.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Publicly searchable hostels</p>
        </div>

        <div 
          onClick={() => navigate('/admin/reviews')}
          className="bg-white p-5 rounded-2xl border border-[#EDE8DF] hover:border-emerald-500/40 shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reviews</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 font-heading">
            {reviews.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Student resident feedback</p>
        </div>

        <div 
          onClick={() => navigate('/admin/reports')}
          className="bg-white p-5 rounded-2xl border border-[#EDE8DF] hover:border-emerald-500/40 shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Flags & Reports</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-600 font-heading">
            {pendingReports.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Dispute & audit requests</p>
        </div>
      </div>

      {/* Review Queue Preview */}
      <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#0F172A] font-heading">
              Listings Requiring Administrative Verification
            </h3>
            <p className="text-xs text-slate-500">
              Check electricity, security deposit, curfew, and photographic accuracy before approving
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/listings')}
            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Review Queue ({pendingHostels.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingHostels.length > 0 ? (
          <div className="space-y-3">
            {pendingHostels.map((h) => (
              <div
                key={h.id}
                className="p-4 rounded-2xl border border-[#EDE8DF] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={h.images[0]?.storage_path}
                    alt={h.name}
                    className="w-16 h-12 object-cover rounded-xl border border-slate-200"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm font-heading">{h.name}</h4>
                    <p className="text-xs text-slate-500">
                      {h.locality}, {h.city} • Owner: {h.owner_name} ({h.owner_phone})
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Rent: ₹{h.monthly_rent_min.toLocaleString('en-IN')}+ • Deposit: ₹{h.security_deposit.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/admin/listings')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl self-start sm:self-auto"
                >
                  Inspect & Approve
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-xs text-slate-600 font-semibold">Queue is clear!</p>
            <p className="text-[11px] text-slate-400 mt-1">All registered hostel listings have been reviewed and verified.</p>
          </div>
        )}
      </div>
    </div>
  );
};
