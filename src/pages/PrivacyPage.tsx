import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] flex flex-col selection:bg-[#FFE4DC] selection:text-[#FF4B26]">
      <Navbar currentUser={null} activeTab="privacy" onNavigate={() => navigate('/')} onOpenAuth={() => navigate('/login')} onSignOut={() => {}} savedCount={0} />

      <div className="bg-white border-b border-[#EDE8DF] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#FF4B26]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900">Privacy Policy</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF4B26]">Habitux Data Protection</span>
          <h1 className="text-3xl font-extrabold text-[#0F172A] font-heading">Privacy Policy</h1>
          <p className="text-xs text-slate-500">Last updated: October 2026</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE8DF] shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-bold text-base text-slate-900 font-heading">1. Zero Brokerage Data Model</h3>
            <p>
              HABITUX collects personal data solely to facilitate direct, zero-brokerage contact between students looking for accommodation and registered hostel owners. We never sell your personal information or contact details to third-party telemarketers or commercial broker networks.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-base text-slate-900 font-heading">2. Information We Collect</h3>
            <p>
              When registering as a student or property owner, we collect contact information including your full name, phone number, email address, and academic institution/business details. When submitting visit requests or enquiries, your contact details are shared exclusively with the owner of the designated property.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-base text-slate-900 font-heading">3. Security and Storage</h3>
            <p>
              All user records, passwords, and listing metadata are encrypted and protected via PostgreSQL Row Level Security (RLS) policies. Only authenticated owners can view enquiries directed to their own properties.
            </p>
          </section>
        </div>
      </main>

      <Footer onSelectCity={() => {}} onNavigate={() => {}} />
    </div>
  );
};
