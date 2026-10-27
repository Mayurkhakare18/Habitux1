import React, { useState } from 'react';
import { Hostel, RoomType, UserProfile } from '../../types';
import { HabituxAPI } from '../../lib/supabase';
import { 
  X, 
  MessageSquare, 
  PhoneCall, 
  CalendarCheck, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContactOwnerModalProps {
  hostel: Hostel;
  selectedRoom?: RoomType | null;
  currentUser: UserProfile | null;
  onClose: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const ContactOwnerModal: React.FC<ContactOwnerModalProps> = ({
  hostel,
  selectedRoom,
  currentUser,
  onClose,
  onShowToast,
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser?.full_name || 'Priyanshu Roy');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(currentUser?.email || 'priyanshu.student@habitux.in');
  const [preferredVisit, setPreferredVisit] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [message, setMessage] = useState(
    `Hi ${hostel.owner_name || 'Owner'}, I am interested in visiting ${hostel.name} for ${selectedRoom?.room_name || 'a room'}. Please let me know if an inspection visit on ${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} is convenient.`
  );
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message.trim()) return;

    setSending(true);
    try {
      const conv = await HabituxAPI.getOrCreateConversation({
        hostelId: hostel.id,
        studentId: currentUser?.id || 'usr-student-demo',
        studentName: name,
        studentPhone: phone,
        studentEmail: email,
        ownerId: hostel.owner_id,
        initialMessage: message.trim(),
      });

      // Also submit enquiry record
      await HabituxAPI.submitEnquiry({
        student_id: currentUser?.id || 'usr-student-demo',
        student_name: name,
        student_phone: phone,
        student_email: email,
        hostel_id: hostel.id,
        hostel_name: hostel.name,
        hostel_locality: hostel.locality,
        hostel_city: hostel.city,
        room_type_id: selectedRoom?.id || hostel.room_types[0]?.id,
        room_type_name: selectedRoom?.room_name || hostel.room_types[0]?.room_name,
        move_in_date: preferredVisit,
        expected_duration_months: 11,
        message: message.trim(),
      });

      setConversationId(conv.id);
      onShowToast('success', 'Your enquiry & message have been sent to the owner!');
    } catch (err: any) {
      console.error(err);
      onShowToast('error', 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const rawNumber = (hostel.owner_phone || '+919829012345').replace(/\D/g, '');
    const cleanNumber = rawNumber.startsWith('91') ? rawNumber : `91${rawNumber}`;
    const text = encodeURIComponent(
      `Hello! I found your property "${hostel.name}" on Habitux. I would like to schedule a visit for ${selectedRoom?.room_name || 'room'}.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl border border-[#EDE8DF] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#EDE8DF] flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm font-heading">
                Contact Property Owner Directly
              </h3>
              <p className="text-[11px] text-slate-500">
                100% Zero Brokerage • Direct Communication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {conversationId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base font-heading">
              Message Sent to {hostel.owner_name || 'Owner'}!
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              A private messaging channel has been opened in your Student Dashboard. The owner receives instant SMS & dashboard notifications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  navigate(`/student/messages/${conversationId}`);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> Open Chat in Dashboard
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Stay on Listing
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Owner Info Strip */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Property Manager / Landlord
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {hostel.owner_name || 'Rajesh Verma'}
                </span>
                <span className="block text-[11px] text-slate-500">
                  {hostel.name} • {hostel.locality}
                </span>
              </div>

              {/* Direct WhatsApp Callout */}
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" /> WhatsApp
              </button>
            </div>

            {/* Student Info inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Preferred Visit / Move-in Date
              </label>
              <input
                type="date"
                value={preferredVisit}
                onChange={(e) => setPreferredVisit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Message to Landlord
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs text-slate-800 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EDE8DF]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="px-6 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {sending ? 'Sending...' : 'Send Direct Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
