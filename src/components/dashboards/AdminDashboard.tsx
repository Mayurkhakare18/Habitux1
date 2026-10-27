import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Building2, 
  Eye, 
  Clock, 
  FileText,
  BadgeCheck
} from 'lucide-react';
import { UserProfile, Hostel, Review } from '../../types';

interface AdminDashboardProps {
  user: UserProfile;
  hostels: Hostel[];
  reviews: Review[];
  onUpdateVerification: (hostelId: string, status: 'verified' | 'unverified' | 'rejected', reason?: string) => Promise<void>;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  hostels,
  reviews,
  onUpdateVerification,
  onNavigateHome,
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [selectedHostelId, setSelectedHostelId] = useState<string | null>(null);
  const [auditLog, setAuditLog] = useState<Array<{ id: string; hostelName: string; action: string; time: string; reason?: string }>>([
    {
      id: 'log-1',
      hostelName: 'Habitux Elite Residency',
      action: 'Verified & Approved',
      time: '2026-10-20 14:30',
      reason: 'Physical inspection and electricity meter audit verified.'
    },
    {
      id: 'log-2',
      hostelName: 'The Campus Haven for Girls',
      action: 'Verified & Approved',
      time: '2026-10-22 11:15',
      reason: 'Biometric security and female warden attendance checked.'
    }
  ]);

  const handleAction = async (hostel: Hostel, status: 'verified' | 'unverified' | 'rejected') => {
    const reason = status === 'rejected' ? rejectReason : 'Administrative verification checklist passed.';
    await onUpdateVerification(hostel.id, status, reason);
    setAuditLog(prev => [
      {
        id: `log-${Date.now()}`,
        hostelName: hostel.name,
        action: status === 'verified' ? 'Verified & Approved' : status === 'rejected' ? 'Rejected' : 'Marked Unverified',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reason
      },
      ...prev
    ]);
    setSelectedHostelId(null);
    setRejectReason('');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-[#0A1120] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <BadgeCheck className="w-3.5 h-3.5" />
              ADMIN VERIFICATION CONSOLE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              Platform Moderation & Verification
            </h1>
            <p className="text-xs text-slate-400">
              Audit submitted hostels, verify transparent pricing, and safeguard zero-brokerage compliance.
            </p>
          </div>

          <button
            onClick={onNavigateHome}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
          >
            Back to Public Site
          </button>
        </div>

        {/* Verification Queue */}
        <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Hostel Review & Verification Queue ({hostels.length})
              </h3>
              <p className="text-xs text-slate-500">
                Inspect accommodation claims before approving verification badges
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {hostels.map((h) => (
              <div key={h.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img
                    src={h.images[0]?.storage_path}
                    alt={h.name}
                    className="w-16 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm font-heading">{h.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        h.verification_status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : h.verification_status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {h.verification_status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {h.locality}, {h.city} • Owner: <span className="font-semibold text-slate-800">{h.owner_name || 'Owner'}</span> ({h.owner_phone || 'N/A'})
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Rent: ₹{h.monthly_rent_min.toLocaleString('en-IN')} - ₹{h.monthly_rent_max.toLocaleString('en-IN')} | Deposit: ₹{h.security_deposit.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {h.verification_status !== 'verified' ? (
                    <button
                      onClick={() => handleAction(h, 'verified')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Verify
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(h, 'unverified')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Revoke Verification
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (selectedHostelId === h.id) {
                        setSelectedHostelId(null);
                      } else {
                        setSelectedHostelId(h.id);
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Reject...
                  </button>
                </div>

                {/* Reject reason dropdown */}
                {selectedHostelId === h.id && (
                  <div className="w-full mt-2 p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-2">
                    <label className="block text-xs font-bold text-rose-900">
                      Mandatory Reason for Rejection / Requesting Corrections:
                    </label>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Unclear electricity bill policy, blurry bathroom photos, missing fire safety..."
                      className="w-full p-2 bg-white border border-rose-300 rounded-lg text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedHostelId(null)}
                        className="px-3 py-1 text-xs text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAction(h, 'rejected')}
                        disabled={!rejectReason.trim()}
                        className="px-3 py-1 bg-rose-600 disabled:opacity-50 text-white text-xs font-bold rounded-lg"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-heading">
            Administrative Audit Trail
          </h3>
          <div className="space-y-2 text-xs">
            {auditLog.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">{log.hostelName}</span>: <span className="text-slate-600">{log.action}</span>
                  {log.reason && <p className="text-[11px] text-slate-400 mt-0.5">Note: {log.reason}</p>}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
