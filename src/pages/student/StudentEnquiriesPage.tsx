import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { Enquiry } from '../../types';
import { 
  CalendarCheck, 
  Clock, 
  XCircle, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

export const StudentEnquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEnquiries = async (isBackground = false) => {
    if (!user) return;
    if (!isBackground) setLoading(true);
    try {
      const list = await HabituxAPI.getStudentEnquiries(user.id);
      setEnquiries(list);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();

    const handleUpdate = () => {
      loadEnquiries(true);
    };

    window.addEventListener('habitux_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    const interval = setInterval(() => {
      loadEnquiries(true);
    }, 3000);

    return () => {
      window.removeEventListener('habitux_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, [user]);

  const handleCancel = async (id: string) => {
    await HabituxAPI.updateEnquiryStatus(id, 'cancelled');
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'cancelled' } : e))
    );
  };

  const handleOpenChat = async (enq: Enquiry) => {
    if (enq.conversation_id) {
      navigate(`/student/messages/${enq.conversation_id}`);
    } else {
      const conv = await HabituxAPI.getOrCreateConversation({
        hostelId: enq.hostel_id,
        studentId: enq.student_id,
        studentName: enq.student_name,
        studentPhone: enq.student_phone,
        studentEmail: enq.student_email,
        ownerId: 'owner-001',
        initialMessage: `Following up on enquiry for ${enq.room_type_name || 'room'} (Target Move-in: ${enq.move_in_date})`,
        enquiryId: enq.id,
      });
      navigate(`/student/messages/${conv.id}`);
    }
  };

  const getStatusBadge = (status: Enquiry['status']) => {
    switch (status) {
      case 'submitted':
        return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">Request Submitted</span>;
      case 'viewed':
        return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">Viewed by Owner</span>;
      case 'visit_scheduled':
        return <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">Visit Scheduled</span>;
      case 'accepted':
        return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">Accepted / Confirmed</span>;
      case 'declined':
        return <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">Declined</span>;
      case 'cancelled':
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">Cancelled</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
            My Enquiries & Visit Requests ({enquiries.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time status of your on-site hostel visit appointments and direct owner chats
          </p>
        </div>

        <button
          onClick={() => navigate('/student/messages')}
          className="px-4 py-2 bg-[#FFF1ED] hover:bg-[#FFE4DC] text-[#FF4B26] font-bold text-xs rounded-xl border border-[#FFE4DC] transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <MessageSquare className="w-4 h-4" /> Open Messaging Inbox
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading enquiries...</div>
      ) : enquiries.length > 0 ? (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-white p-6 rounded-3xl border border-[#EDE8DF] shadow-xs space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-[#FF4B26] uppercase">
                    {enq.hostel_locality}, {enq.hostel_city}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 font-heading">
                    {enq.hostel_name}
                  </h3>
                </div>
                <div>{getStatusBadge(enq.status)}</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAF8F5] p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Room Type</span>
                  <span className="font-bold text-slate-800">{enq.room_type_name || 'Standard'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Move-in</span>
                  <span className="font-bold text-slate-800">{enq.move_in_date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Duration</span>
                  <span className="font-bold text-slate-800">{enq.expected_duration_months} Months</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Submitted</span>
                  <span className="font-bold text-slate-800">{new Date(enq.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {enq.visit_date_time && (
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Scheduled On-Site Inspection: <b className="font-bold">{enq.visit_date_time}</b></span>
                </div>
              )}

              {enq.owner_response && (
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Response from Property Landlord:
                  </div>
                  <p className="leading-relaxed pl-5.5">{enq.owner_response}</p>
                </div>
              )}

              {enq.message && (
                <div className="text-xs text-slate-600">
                  <strong className="text-slate-800">Your message: </strong> {enq.message}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenChat(enq)}
                    className="px-3.5 py-1.5 bg-[#FF4B26] hover:bg-[#E03713] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat with Owner
                  </button>

                  <Link
                    to={`/hostels/${enq.hostel_id}`}
                    className="text-xs text-slate-700 font-bold hover:text-[#FF4B26] flex items-center gap-1"
                  >
                    View Property <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {enq.status === 'submitted' && (
                  <button
                    onClick={() => handleCancel(enq.id)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" /> Cancel Visit Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#EDE8DF] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center mx-auto">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-base font-heading">
              No enquiries submitted yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Schedule free on-site visits to check rooms, meet wardens, and confirm your accommodation with zero brokerage.
            </p>
          </div>
          <Link
            to="/student/explore"
            className="inline-block px-5 py-2.5 bg-[#FF4B26] text-white text-xs font-bold rounded-xl shadow-md"
          >
            Find Hostels to Visit
          </Link>
        </div>
      )}
    </div>
  );
};
