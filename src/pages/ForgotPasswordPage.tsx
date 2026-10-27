import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] flex flex-col selection:bg-[#FFE4DC] selection:text-[#FF4B26]">
      <Navbar
        currentUser={null}
        activeTab="forgot-password"
        onNavigate={() => navigate('/')}
        onOpenAuth={() => navigate('/login')}
        onSignOut={() => {}}
        savedCount={0}
      />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#EDE8DF] shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
              Password Recovery
            </h1>
            <p className="text-xs text-slate-500">
              Enter your registered email address to receive password reset instructions
            </p>
          </div>

          {submitted ? (
            <div className="p-6 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-emerald-950 text-sm">Recovery Link Sent</h4>
                <p className="text-xs text-emerald-800">
                  If an account exists for <strong className="text-slate-900">{email}</strong>, you will receive password reset instructions shortly.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-block px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Registered Email Address
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

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 bg-[#FF4B26] hover:bg-[#E03713] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {loading ? 'Sending link...' : 'Send Recovery Instructions'}
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-slate-600 hover:text-[#FF4B26] font-medium flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}

        </div>
      </main>

      <Footer onSelectCity={() => {}} onNavigate={() => {}} />
    </div>
  );
};
