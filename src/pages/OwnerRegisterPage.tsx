import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Bed, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const OwnerRegisterPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [managerName, setManagerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Kota');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setError('Please agree to the Habitux Owner Guidelines and Zero Brokerage terms');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp({
        full_name: managerName,
        email,
        phone,
        college_or_company: businessName || `${city} Accommodation`,
        role: 'owner',
        password,
      });
      navigate('/owner/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to complete owner onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] flex flex-col selection:bg-[#FFE4DC] selection:text-[#FF4B26]">
      <Navbar
        currentUser={null}
        activeTab="owner-register"
        onNavigate={() => navigate('/')}
        onOpenAuth={() => navigate('/login')}
        onSignOut={() => {}}
        savedCount={0}
      />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-[#EDE8DF] shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F172A] text-white text-xs font-bold mb-1">
              <Building2 className="w-3.5 h-3.5 text-[#FF4B26]" />
              HOSTEL & PG OWNER ONBOARDING
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-heading">
              List Your Property on HABITUX
            </h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Fill vacant beds 3x faster with genuine collegiate student leads. Zero commissions, full inventory control.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
            <div>
              <p className="font-extrabold text-[#FF4B26]">₹0 Brokerage</p>
              <p className="text-[10px] text-slate-500">Free to list & manage</p>
            </div>
            <div>
              <p className="font-extrabold text-emerald-600">100% Direct</p>
              <p className="text-[10px] text-slate-500">Call & WhatsApp leads</p>
            </div>
            <div>
              <p className="font-extrabold text-slate-800">Bed Manager</p>
              <p className="text-[10px] text-slate-500">Live bed availability</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Manager / Owner Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="e.g. Rajesh Verma"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Hostel / Business Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Verma Deluxe Residency"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Contact Phone (Students will call) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98290 12345"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Property City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900"
                >
                  <option value="Kota">Kota (Rajasthan)</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Jaipur">Jaipur</option>
                </select>
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
                    placeholder="owner@hostel.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4B26]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Account Password *
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
            </div>

            <div className="flex items-start gap-2 pt-1 text-xs text-slate-600">
              <input
                type="checkbox"
                id="owner-terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded text-[#FF4B26] focus:ring-[#FF4B26]"
              />
              <label htmlFor="owner-terms">
                I agree to provide genuine room photos, transparent electricity/deposit rules, and zero brokerage to students on Habitux.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FF4B26] hover:bg-[#E03713] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-[#FF4B26]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              {loading ? 'Creating Owner Account...' : 'Continue to Owner Dashboard'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
            Already have an owner account?{' '}
            <Link to="/login" className="font-bold text-[#FF4B26] hover:underline">
              Owner Sign In
            </Link>
          </div>

        </div>
      </main>

      <Footer onSelectCity={() => {}} onNavigate={() => {}} />
    </div>
  );
};
