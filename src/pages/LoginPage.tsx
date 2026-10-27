import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { UserRole } from '../types';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  Building2, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to respective dashboard
  React.useEffect(() => {
    if (user) {
      const destination = user.role === 'owner' 
        ? '/owner/dashboard' 
        : user.role === 'admin' 
        ? '/admin/dashboard' 
        : '/student/dashboard';
      navigate(destination, { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const loggedUser = await signIn(email, role);
      const destination = loggedUser.role === 'owner'
        ? '/owner/dashboard'
        : loggedUser.role === 'admin'
        ? '/admin/dashboard'
        : '/student/dashboard';
      navigate(destination, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole: UserRole) => {
    setLoading(true);
    try {
      const demoEmail = demoRole === 'owner' 
        ? 'owner.demo@habitux.in' 
        : demoRole === 'admin' 
        ? 'admin.demo@habitux.in' 
        : 'student.demo@habitux.in';
      const logged = await signIn(demoEmail, demoRole);
      const dest = demoRole === 'owner' ? '/owner/dashboard' : demoRole === 'admin' ? '/admin/dashboard' : '/student/dashboard';
      navigate(dest, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] flex flex-col selection:bg-[#FFE4DC] selection:text-[#FF4B26]">
      <Navbar
        currentUser={user}
        activeTab="login"
        onNavigate={(tab) => navigate(tab === 'compare' ? '/compare' : '/')}
        onOpenAuth={() => {}}
        onSignOut={() => {}}
        savedCount={0}
      />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#EDE8DF] shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center mx-auto shadow-sm">
              <span className="font-extrabold text-xl font-heading">H</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
              Sign In to HABITUX
            </h1>
            <p className="text-xs text-slate-500">
              Zero-brokerage student housing discovery & owner management
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#EDE8DF]">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'student'
                  ? 'bg-white text-[#FF4B26] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Student Portal
            </button>
            <button
              type="button"
              onClick={() => setRole('owner')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'owner'
                  ? 'bg-white text-[#FF4B26] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" /> Owner Portal
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[11px] text-[#FF4B26] hover:underline font-semibold">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FF4B26] hover:bg-[#E03713] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-[#FF4B26]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Registration Navigation */}
          <div className="text-center text-xs text-slate-600 pt-1 space-y-1">
            <p>
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-bold text-[#FF4B26] hover:underline">
                Create Student Account
              </Link>
            </p>
            <p>
              Are you an accommodation owner?{' '}
              <Link to="/owner/register" className="font-bold text-slate-900 hover:underline">
                List Property for Free
              </Link>
            </p>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
              Instant Demo Portals:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-[#FFF1ED] hover:text-[#FF4B26] text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('owner')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-[#FFF1ED] hover:text-[#FF4B26] text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center"
              >
                Owner
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-[#FFF1ED] hover:text-[#FF4B26] text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center"
              >
                Admin
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer
        onSelectCity={(c) => navigate(`/hostels?city=${encodeURIComponent(c)}`)}
        onNavigate={() => {}}
      />
    </div>
  );
};
