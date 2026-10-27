import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { Enquiry } from '../../types';
import { 
  CalendarCheck, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Send,
  MessageSquare,
  Calendar,
  Filter
} from 'lucide-react';

export const OwnerEnquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Active response modal/state
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);
  const [responseText, setResponseText] = useState('');
  const [visitScheduleTime, setVisitScheduleTime] = useState('');
  const [actionStatus, setActionStatus] = useState<Enquiry['status']>('responded');
  const [saving, setSaving] = useState(false);

  const loadEnquiries = async (isBackground = false) => {
    if (!user) return;
    if (!isBackground) setLoading(true);
    try {
      const list = await HabituxAPI.getOwnerEnquiries(user.id);
      setEnquiries(list);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();

    // Real-time listener for student enquiries or updates
    const handleUpdate = () => {
      loadEnquiries(true);
    };

    window.addEventListener('habitux_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Heartbeat poll every 3 seconds for instant multi-tab sync
    const interval = setInterval(() => {
      loadEnquiries(true);
    }, 3000);

    return () => {
      window.removeEventListener('habitux_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, [user]);

  const handleOpenAction = (enq: Enquiry, defaultStatus: Enquiry['status']) => {
    setActiveEnquiry(enq);
    setActionStatus(defaultStatus);
    setResponseText(enq.owner_response || '');
    setVisitScheduleTime(enq.visit_date_time || '');
  };

  const handleSaveResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnquiry) return;
    setSaving(true);

    try {
      const updated = await HabituxAPI.updateEnquiryStatus(
        activeEnquiry.id,
        actionStatus,
        responseText,
        visitScheduleTime
      );

      setEnquiries((prev) =>
        prev.map((item) => (item.id === activeEnquiry.id ? updated : item))
      );

      setActiveEnquiry(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update enquiry response');
    } finally {
      setSaving(false);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    if (filterStatus === 'all') return true;
    return e.status === filterStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
            Student Inquiries & Free Visit Requests ({enquiries.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect directly with verified students and parents seeking hostel accommodation
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#EDE8DF] rounded-xl self-start sm:self-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Inquiries' },
            { id: 'submitted', label: 'New / Pending' },
            { id: 'visit_scheduled', label: 'Visits Fixed' },
            { id: 'accepted', label: 'Accepted' },
            { id: 'declined', label: 'Declined' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading incoming enquiries...</div>
      ) : filteredEnquiries.length > 0 ? (
        <div className="space-y-4">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-white rounded-3xl border border-[#EDE8DF] p-6 shadow-xs hover:border-[#FF4B26]/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Student Info */}
              <div className="space-y-3 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    enq.status === 'submitted'
                      ? 'bg-amber-100 text-amber-800'
                      : enq.status === 'visit_scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : enq.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : enq.status === 'declined'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {enq.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400">
                    Received on {new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-[#0F172A] text-base font-heading flex items-center gap-2">
                    <User className="w-4 h-4 text-[#FF4B26]" /> {enq.student_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {enq.student_phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {enq.student_email}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-slate-100 text-xs space-y-1">
                  <p className="text-slate-700">
                    <strong>Property:</strong> {enq.hostel_name} ({enq.room_type_name || 'Standard Sharing'})
                  </p>
                  <p className="text-slate-600">
                    <strong>Move-in Target:</strong> {enq.move_in_date} {enq.expected_duration_months && `(${enq.expected_duration_months} Months)`}
                  </p>
                  {enq.message && (
                    <p className="text-slate-600 italic mt-1">
                      &quot;{enq.message}&quot;
                    </p>
                  )}
                </div>

                {/* Show Owner Response if exists */}
                {enq.owner_response && (
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900">
                    <strong>Your Response:</strong> {enq.owner_response}
                    {enq.visit_date_time && (
                      <div className="mt-1 font-semibold text-blue-700 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Scheduled Visit: {enq.visit_date_time}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (enq.conversation_id) {
                      navigate(`/owner/messages/${enq.conversation_id}`);
                    } else {
                      navigate('/owner/messages');
                    }
                  }}
                  className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#FF4B26]" /> Chat with Student
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAction(enq, 'visit_scheduled')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" /> Schedule Visit Time
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAction(enq, 'accepted')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Accept & Hold Bed
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAction(enq, 'declined')}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-500" /> Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#EDE8DF] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center mx-auto">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base font-heading">
            No inquiries under this category
          </h3>
          <p className="text-xs text-slate-500">
            Student enquiries submitted for your properties will be listed here immediately.
          </p>
        </div>
      )}

      {/* Response Modal */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-[#0F172A] text-base font-heading">
                Respond to {activeEnquiry.student_name}
              </h3>
              <button
                type="button"
                onClick={() => setActiveEnquiry(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveResponse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Update Status To
                </label>
                <select
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-semibold"
                >
                  <option value="visit_scheduled">Visit Scheduled</option>
                  <option value="accepted">Accepted / Bed Reserved</option>
                  <option value="responded">Reply Sent</option>
                  <option value="declined">Declined (No vacancy / Not matching)</option>
                </select>
              </div>

              {actionStatus === 'visit_scheduled' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Proposed Visit Date & Slot *
                  </label>
                  <input
                    type="text"
                    required
                    value={visitScheduleTime}
                    onChange={(e) => setVisitScheduleTime(e.target.value)}
                    placeholder="e.g. Tomorrow (Tuesday) at 4:30 PM"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Message / Guidance for Student *
                </label>
                <textarea
                  rows={3}
                  required
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="e.g. Please meet warden Mr. Sharma at the main gate. Bed in Double Sharing room is kept on hold."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveEnquiry(null)}
                  className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#FF4B26] hover:bg-[#E03713] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> {saving ? 'Sending...' : 'Confirm Response'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
