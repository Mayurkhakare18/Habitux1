import React, { useState } from 'react';
import { useAuth } from '../../app/AuthContext';
import { 
  User, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Save, 
  CheckCircle2 
} from 'lucide-react';

export const OwnerProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [collegeOrCompany, setCollegeOrCompany] = useState(user?.college_or_company || 'Verma Accommodations Pvt Ltd');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        full_name: fullName,
        phone,
        college_or_company: collegeOrCompany,
        avatar_url: avatarUrl,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update owner profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
          Property Owner Profile & Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your owner contact credentials displayed to students on visit confirmations
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Owner profile details saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <img
            src={avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80'}
            alt="Owner Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#FF4B26]/30 shadow-xs"
          />
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 mb-1">
              <ShieldCheck className="w-3 h-3" /> VERIFIED PROPERTY PARTNER
            </div>
            <h2 className="text-base font-extrabold text-[#0F172A] font-heading">{fullName || 'Hostel Owner'}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Full Name (Owner / Manager) *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Business / Hostel Management Entity
          </label>
          <input
            type="text"
            value={collegeOrCompany}
            onChange={(e) => setCollegeOrCompany(e.target.value)}
            placeholder="e.g. Verma Accommodations LLP"
            className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Contact Phone (WhatsApp for Visit Alerts) *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Email Address (Login)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Avatar Image URL
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#FF4B26]/20"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
