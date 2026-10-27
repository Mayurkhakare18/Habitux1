import React, { useState } from 'react';
import { 
  X, 
  CalendarCheck, 
  ShieldCheck, 
  CheckCircle2, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { Hostel, RoomType, UserProfile, Enquiry } from '../../types';

interface EnquiryModalProps {
  hostel: Hostel | null;
  selectedRoom?: RoomType | null;
  currentUser: UserProfile | null;
  onClose: () => void;
  onSubmitEnquiry: (enquiryData: Omit<Enquiry, 'id' | 'status' | 'created_at' | 'updated_at'>) => Promise<Enquiry>;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  hostel,
  selectedRoom,
  currentUser,
  onClose,
  onSubmitEnquiry,
}) => {
  if (!hostel) return null;

  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [moveInDate, setMoveInDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [visitDate, setVisitDate] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [durationMonths, setDurationMonths] = useState(12);
  const [roomTypeId, setRoomTypeId] = useState(selectedRoom?.id || hostel.room_types[0]?.id || '');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<Enquiry | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setSubmitting(true);
    try {
      const activeRoom = hostel.room_types.find((r) => r.id === roomTypeId);
      const enq = await onSubmitEnquiry({
        student_id: currentUser?.id || `anon-${Date.now()}`,
        student_name: fullName,
        student_phone: phone,
        student_email: email,
        hostel_id: hostel.id,
        hostel_name: hostel.name,
        hostel_locality: hostel.locality,
        hostel_city: hostel.city,
        room_type_id: activeRoom?.id,
        room_type_name: activeRoom?.room_name,
        move_in_date: moveInDate,
        expected_duration_months: durationMonths,
        message: message ? `${message} | Preferred Visit: ${visitDate}` : `Preferred Visit: ${visitDate}`,
      });
      setSubmittedEnquiry(enq);
    } catch (err) {
      console.error('Failed to submit enquiry:', err);
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl border border-[#EDE8DF] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EDE8DF] flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm font-heading">
                Schedule a Visit & Enquire
              </h3>
              <p className="text-[11px] text-[#FF4B26] font-semibold">
                100% Zero Brokerage • Direct Owner Contact
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation Screen */}
        {submittedEnquiry ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-[#0F172A] font-heading">
                Visit Request Sent to Owner!
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Your request has been forwarded directly to <strong className="text-slate-800">{hostel.owner_name || 'the hostel manager'}</strong>.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EDE8DF] text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Property:</span>
                <span className="font-bold text-slate-900">{hostel.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Requested Visit Date:</span>
                <span className="font-bold text-[#FF4B26]">{visitDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Move-in:</span>
                <span className="font-bold text-slate-900">{moveInDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Brokerage Fee:</span>
                <span className="font-extrabold text-emerald-600">₹0 (Free)</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={`https://wa.me/${hostel.owner_phone ? hostel.owner_phone.replace(/[^0-9]/g, '') : '919876543210'}?text=${encodeURIComponent(
                  `Hello! I just submitted a visit request for ${hostel.name} on HABITUX. My name is ${fullName}. Looking forward to visiting on ${visitDate}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <MessageCircle className="w-4 h-4" />
                Notify Owner Immediately on WhatsApp
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close & Track in Student Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Enquiry Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Property Summary Pill */}
            <div className="p-3 rounded-xl bg-slate-50 border border-[#EDE8DF] flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-slate-900">{hostel.name}</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#FF4B26]" /> {hostel.locality}, {hostel.city}
                </p>
              </div>
              <span className="text-xs font-black text-[#FF4B26]">
                ₹{hostel.monthly_rent_min.toLocaleString('en-IN')}+
              </span>
            </div>

            {/* Room Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Room Type
              </label>
              <select
                value={roomTypeId}
                onChange={(e) => setRoomTypeId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
              >
                {hostel.room_types.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.room_name} — ₹{room.monthly_rent.toLocaleString('en-IN')}/mo ({room.available_beds} beds left)
                  </option>
                ))}
              </select>
            </div>

            {/* Dates: Preferred Visit & Move-in */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Preferred Visit Date
                </label>
                <input
                  type="date"
                  value={visitDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Expected Move-in
                </label>
                <input
                  type="date"
                  value={moveInDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
                  required
                />
              </div>
            </div>

            {/* Student Contact Info */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priyanshu Roy"
                  className="w-full p-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
                  />
                </div>
              </div>
            </div>

            {/* Optional message */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Questions or Special Dietary Notes (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                placeholder="e.g. Need quiet corner room, pure vegetarian meal preference..."
                className="w-full p-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
              />
            </div>

            {/* Brokerage Zero Guarantee Tag */}
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5 border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero brokerage guaranteed. You will only pay the landlord directly.</span>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || !fullName || !phone}
                className="w-full py-3 bg-[#FF4B26] hover:bg-[#E03713] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-[#FF4B26]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <CalendarCheck className="w-4 h-4" />
                {submitting ? 'Submitting Request...' : 'Confirm Free Visit Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
