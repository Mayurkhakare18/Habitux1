import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { user, signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setError('Please accept the Terms of Service and Privacy Policy');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp({
        full_name: fullName,
        email,
        phone,
        college_or_company: college,
        role: 'student',
        password,
      });
      navigate('/student/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to create student account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] flex flex-col selection:bg-[#FFE4DC] selection:text-[#FF4B26]">
      <Navbar
        currentUser={user}
        activeTab="register"
        onNavigate={() => navigate('/')}
        onOpenAuth={() => navigate('/login')}
        onSignOut={() => {}}
        savedCount={0}
      />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-[#EDE8DF] shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1ED] text-[#FF4B26] text-xs font-bold mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              STUDENT REGISTRATION
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
              Create Your Student Account
            </h1>
            <p className="text-xs text-slate-500">
              Save favorite rooms, track visit requests, and connect with verified owners
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priyanshu Roy"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Email Address *
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
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Mobile Phone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                University or Coaching Center
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Hansraj College, Allen Kota, IIT Delhi"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Password (min 6 chars) *
                </label>
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

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-2 pt-1 text-xs text-slate-600">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded text-[#FF4B26] focus:ring-[#FF4B26]"
              />
              <label htmlFor="terms">
                I agree to the <Link to="/terms" className="text-[#FF4B26] font-semibold underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#FF4B26] font-semibold underline">Privacy Policy</Link>. I understand Habitux is 100% zero brokerage.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FF4B26] hover:bg-[#E03713] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-[#FF4B26]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              {loading ? 'Creating Student Account...' : 'Complete Student Registration'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100 space-y-1">
            <p>
              Already registered?{' '}
              <Link to="/login" className="font-bold text-[#FF4B26] hover:underline">
                Sign In
              </Link>
            </p>
            <p>
              Are you an accommodation owner?{' '}
              <Link to="/owner/register" className="font-bold text-slate-900 hover:underline">
                Register as Hostel Owner
              </Link>
            </p>
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
