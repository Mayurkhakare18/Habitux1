import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  CalendarCheck, 
  Bell, 
  User, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Trash2,
  XCircle
} from 'lucide-react';
import { UserProfile, Hostel, Enquiry, NotificationItem } from '../../types';

interface StudentDashboardProps {
  user: UserProfile;
  savedHostels: Hostel[];
  enquiries: Enquiry[];
  notifications: NotificationItem[];
  onRemoveFavorite: (hostelId: string) => void;
  onSelectHostel: (hostel: Hostel) => void;
  onCancelEnquiry: (enquiryId: string) => void;
  onMarkNotificationRead: (notifId: string) => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  onNavigateHome: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  savedHostels,
  enquiries,
  notifications,
  onRemoveFavorite,
  onSelectHostel,
  onCancelEnquiry,
  onMarkNotificationRead,
  onUpdateProfile,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<'enquiries' | 'saved' | 'notifications' | 'profile'>('enquiries');
  const [fullName, setFullName] = useState(user.full_name);
  const [phone, setPhone] = useState(user.phone || '');
  const [college, setCollege] = useState(user.college_or_company || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile({ full_name: fullName, phone, college_or_company: college });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getStatusBadge = (status: Enquiry['status']) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">Request Submitted</span>;
      case 'viewed':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">Viewed by Owner</span>;
      case 'visit_scheduled':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">Visit Scheduled</span>;
      case 'accepted':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">Confirmed / Accepted</span>;
      case 'declined':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">Declined</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Hero Banner */}
        <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
              alt={user.full_name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#FFF1ED]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] font-heading">
                  {user.full_name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF1ED] text-[#FF4B26] font-bold text-xs uppercase">
                  Student Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {user.email} {user.college_or_company && `• ${user.college_or_company}`}
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateHome}
            className="px-4 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Explore More Hostels
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setActiveTab('enquiries')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'enquiries' ? 'bg-white border-[#FF4B26] shadow-sm' : 'bg-white border-[#EDE8DF] hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enquiries & Visits</span>
              <CalendarCheck className="w-4 h-4 text-[#FF4B26]" />
            </div>
            <div className="mt-2 text-2xl font-black text-[#0F172A] font-heading">
              {enquiries.length}
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('saved')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'saved' ? 'bg-white border-[#FF4B26] shadow-sm' : 'bg-white border-[#EDE8DF] hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Hostels</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-[#0F172A] font-heading">
              {savedHostels.length}
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('notifications')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'notifications' ? 'bg-white border-[#FF4B26] shadow-sm' : 'bg-white border-[#EDE8DF] hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notifications</span>
              <Bell className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-[#0F172A] font-heading">
              {notifications.filter(n => !n.read_at).length}
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('profile')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-white border-[#FF4B26] shadow-sm' : 'bg-white border-[#EDE8DF] hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile</span>
              <User className="w-4 h-4 text-slate-600" />
            </div>
            <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active Student
            </div>
          </div>
        </div>

        {/* Main Tab Content */}
        <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm">
          
          {/* Tab 1: Enquiries & Visit Requests */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] font-heading">
                  My Enquiries & Visit Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Track the real-time response and visit schedule directly from property owners
                </p>
              </div>

              {enquiries.length > 0 ? (
                <div className="space-y-4">
                  {enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-5 rounded-2xl border border-[#EDE8DF] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-semibold text-[#FF4B26] uppercase">
                            {enq.hostel_locality}, {enq.hostel_city}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 font-heading">
                            {enq.hostel_name}
                          </h4>
                        </div>
                        <div>{getStatusBadge(enq.status)}</div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Room Requested</span>
                          <span className="font-semibold text-slate-800">{enq.room_type_name || 'Standard Room'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Move-in</span>
                          <span className="font-semibold text-slate-800">{enq.move_in_date}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                          <span className="font-semibold text-slate-800">{enq.expected_duration_months} Months</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Submitted On</span>
                          <span className="font-semibold text-slate-800">{new Date(enq.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {enq.owner_response && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                          <span className="font-bold block mb-0.5">Response from Owner:</span>
                          <p>{enq.owner_response}</p>
                        </div>
                      )}

                      {enq.message && (
                        <div className="text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">Your note: </span>
                          {enq.message}
                        </div>
                      )}

                      {enq.status === 'submitted' && (
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => onCancelEnquiry(enq.id)}
                            className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel Request
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <CalendarCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">No enquiries submitted yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Browse verified hostels, choose your room type, and schedule a free visit without paying brokerage.
                    </p>
                  </div>
                  <button
                    onClick={onNavigateHome}
                    className="px-5 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white text-xs font-bold rounded-xl"
                  >
                    Find Hostels Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Saved Hostels */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] font-heading">
                  My Saved Hostels ({savedHostels.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Accommodations you bookmarked to compare and review later
                </p>
              </div>

              {savedHostels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedHostels.map((h) => (
                    <div
                      key={h.id}
                      className="border border-[#EDE8DF] rounded-2xl overflow-hidden hover:border-[#FF4B26]/30 transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-16/10">
                        <img src={h.images[0]?.storage_path} alt={h.name} className="w-full h-full object-cover" />
                        <button
                          onClick={() => onRemoveFavorite(h.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-rose-500 hover:bg-white"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="text-xs text-[#FF4B26] font-semibold uppercase">{h.locality}, {h.city}</div>
                        <h4 className="font-bold text-slate-900 text-sm font-heading">{h.name}</h4>
                        <div className="text-xs font-black text-slate-900">
                          ₹{h.monthly_rent_min.toLocaleString('en-IN')}/mo
                        </div>
                        <button
                          onClick={() => onSelectHostel(h)}
                          className="w-full mt-2 py-2 bg-[#FFF1ED] hover:bg-[#FFE4DC] text-[#FF4B26] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          View Details & Rooms
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-slate-500">
                  No saved hostels yet. Click the heart icon on any hostel card to save it here!
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] font-heading">
                  Notifications & Updates
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time alerts regarding your visit schedules and owner messages
                </p>
              </div>

              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                      notif.read_at ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-blue-50/50 border-blue-200 text-slate-800'
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">{notif.title}</p>
                      <p>{notif.message}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {!notif.read_at && (
                      <button
                        onClick={() => onMarkNotificationRead(notif.id)}
                        className="text-xs text-blue-600 font-semibold hover:underline shrink-0"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Profile Settings */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="max-w-xl space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] font-heading">
                  Profile & Contact Information
                </h3>
                <p className="text-xs text-slate-500">
                  Keep your phone and campus info updated so hostel owners can reach you for visits
                </p>
              </div>

              {savedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Profile updated successfully!
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full p-2.5 bg-slate-100 border border-[#EDE8DF] rounded-xl text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">University or Coaching Institute</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900"
                  placeholder="e.g. Hansraj College, DU / Allen Kota"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white text-xs font-bold rounded-xl transition-all"
              >
                Save Changes
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
