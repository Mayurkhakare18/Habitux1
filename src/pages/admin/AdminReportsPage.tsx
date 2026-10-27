import React, { useState, useEffect } from 'react';
import { HabituxAPI } from '../../lib/supabase';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  User, 
  Building2,
  Check
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    HabituxAPI.getAllReports().then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  const handleResolve = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
          Reports, Inaccuracy Claims & Administrative Audit Log
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review discrepancies submitted by students, parents, and verified hostel operators
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading audit reports...</div>
      ) : reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-white rounded-3xl border border-[#EDE8DF] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    rep.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {rep.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                    {rep.type}
                  </span>
                  <span className="text-xs text-slate-400">{rep.date}</span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base font-heading">
                  {rep.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {rep.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <span>Target Entity: <strong className="text-slate-800">{rep.target}</strong></span>
                  <span>Reported By: <strong className="text-slate-800">{rep.reporter}</strong></span>
                </div>
              </div>

              {rep.status === 'pending' ? (
                <button
                  onClick={() => handleResolve(rep.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 self-start sm:self-center transition-colors cursor-pointer shrink-0"
                >
                  <Check className="w-3.5 h-3.5" /> Mark Resolved
                </button>
              ) : (
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolved & Logged
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#EDE8DF]">
          <p className="text-xs text-slate-500">No reported disputes at this time.</p>
        </div>
      )}

      {/* Audit Log Trail Summary */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Permanent Audit Trail
        </div>
        <h3 className="text-lg font-bold font-heading">
          Administrative Decisions Log
        </h3>
        <p className="text-xs text-slate-400">
          All changes to verification badges, listing status (published/rejected), and review moderations are recorded with timestamp and administrator identity to ensure complete compliance.
        </p>
      </div>
    </div>
  );
};
