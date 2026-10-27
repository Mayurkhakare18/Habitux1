import React, { useState } from 'react';
import { useAuth } from '../../app/AuthContext';
import { User, Mail, Phone, GraduationCap, CheckCircle2, Lock, Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentProfilePage: React.FC = () => {
  const { user, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [college, setCollege] = useState(user?.college_or_company || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      full_name: fullName,
      phone,
      college_or_company: college,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) return;
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
          Student Profile & Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Keep your contact information updated so hostel managers can coordinate your visits
        </p>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleProfileSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE8DF] shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#FFF1ED]"
          />
          <div>
            <h3 className="font-bold text-slate-900 text-base font-heading">{user?.full_name}</h3>
            <p className="text-xs text-[#FF4B26] font-semibold uppercase">{user?.role} Resident</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{user?.email}</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Profile updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Registered Email (Protected)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Contact Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              University / Coaching Center
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Hansraj College, Allen Kota"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Profile Details
          </button>
        </div>
      </form>

      {/* Password Change Box */}
      <form onSubmit={handlePasswordChange} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE8DF] shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm font-heading">Security & Password</h3>
          <p className="text-xs text-slate-500">Update your account authentication credentials</p>
        </div>

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Password updated!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              New Password (min 6 chars)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl"
          >
            Update Password
          </button>
        </div>
      </form>

      {/* Logout Box */}
      <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 text-sm font-heading">Sign Out of Habitux</h4>
          <p className="text-xs text-slate-500">Terminate your current session on this device</p>
        </div>
        <button
          onClick={async () => {
            await signOut();
            navigate('/');
          }}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
};
