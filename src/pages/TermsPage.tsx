import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] flex flex-col selection:bg-[#FFE4DC] selection:text-[#FF4B26]">
      <Navbar currentUser={null} activeTab="terms" onNavigate={() => navigate('/')} onOpenAuth={() => navigate('/login')} onSignOut={() => {}} savedCount={0} />

      <div className="bg-white border-b border-[#EDE8DF] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#FF4B26]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900">Terms of Service</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF4B26]">Platform Agreement</span>
          <h1 className="text-3xl font-extrabold text-[#0F172A] font-heading">Terms & Conditions</h1>
          <p className="text-xs text-slate-500">Last updated: October 2026</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE8DF] shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-bold text-base text-slate-900 font-heading">1. Zero Brokerage Pledge</h3>
            <p>
              HABITUX guarantees that no student or tenant will be charged brokerage, finders fees, or middleman commission for browsing, enquiring, or visiting accommodations listed on our platform.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-base text-slate-900 font-heading">2. Owner Obligations</h3>
            <p>
              Hostel and PG owners agree to maintain accurate information regarding room inventory, air conditioning status, meal provisions, electricity charges, and refundable security deposits.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-base text-slate-900 font-heading">3. Booking & Visit Enquiries</h3>
            <p>
              Submitting a visit enquiry via HABITUX does not constitute a guaranteed reservation or financial commitment. A booking is finalized only after mutual agreement, physical walkthrough, and written rent contract directly between student and owner.
            </p>
          </section>
        </div>
      </main>

      <Footer onSelectCity={() => {}} onNavigate={() => {}} />
    </div>
  );
};
