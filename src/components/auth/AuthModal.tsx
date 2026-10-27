import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, role: UserRole) => Promise<UserProfile>;
  onSignUp: (profile: Partial<UserProfile> & { password?: string }) => Promise<UserProfile>;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onSignUp,
  initialRole = 'student',
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email) throw new Error('Please enter your email address');
        await onLogin(email, role);
      } else {
        if (!fullName || !email || !password) throw new Error('Please fill in all required fields');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        await onSignUp({
          full_name: fullName,
          email,
          phone,
          role,
          college_or_company: college,
          password,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoRole: UserRole) => {
    setLoading(true);
    try {
      const demoEmails: Record<UserRole, string> = {
        student: 'priyanshu.student@habitux.in',
        owner: 'rajesh.owner@habitux.in',
        admin: 'admin.verify@habitux.in',
      };
      await onLogin(demoEmails[demoRole], demoRole);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl border border-[#EDE8DF] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EDE8DF] bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FF4B26] text-white flex items-center justify-center font-bold">
              H
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm font-heading">
                {mode === 'login' ? 'Welcome to HABITUX' : 'Create Your Account'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {mode === 'login' ? 'Sign in to access your saved hostels and enquiries' : 'Join India\'s zero-brokerage housing community'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-4 bg-[#FAF8F5] border-b border-[#EDE8DF] flex gap-2">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'student'
                ? 'bg-white text-[#FF4B26] shadow-sm border border-[#FF4B26]/30'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Student / Resident
          </button>

          <button
            type="button"
            onClick={() => setRole('owner')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'owner'
                ? 'bg-white text-[#FF4B26] shadow-sm border border-[#FF4B26]/30'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Hostel Owner
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === 'owner' ? 'e.g. Ramesh Chandra' : 'e.g. Priyanshu Roy'}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl focus:outline-none focus:border-[#FF4B26]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl focus:outline-none focus:border-[#FF4B26]"
                required
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl focus:outline-none focus:border-[#FF4B26]"
                  required
                />
              </div>
            </div>
          )}

          {mode === 'signup' && role === 'student' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                College or Coaching Institute
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Hansraj College, Allen Kota, IIT Delhi"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl focus:outline-none focus:border-[#FF4B26]"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Password {mode === 'signup' && '(min 6 chars)'} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl focus:outline-none focus:border-[#FF4B26]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FF4B26] hover:bg-[#E03713] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-[#FF4B26]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In to Habitux' : 'Create Account'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Login / Signup */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className="text-xs text-slate-600 hover:text-[#FF4B26] font-medium"
            >
              {mode === 'login' ? (
                <>New to Habitux? <span className="font-bold text-[#FF4B26]">Create free account</span></>
              ) : (
                <>Already have an account? <span className="font-bold text-[#FF4B26]">Sign In</span></>
              )}
            </button>
          </div>

          {/* Quick Demo Access Bar for rapid evaluation */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
              Instant Demo Access:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-[#FFF1ED] hover:text-[#FF4B26] text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center"
              >
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('owner')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-[#FFF1ED] hover:text-[#FF4B26] text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center"
              >
                Owner Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-[#FFF1ED] hover:text-[#FF4B26] text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
