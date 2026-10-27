import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { PaymentTransaction } from '../../types';
import { 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Download,
  IndianRupee,
  Clock,
  Sparkles
} from 'lucide-react';

export const StudentPaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    HabituxAPI.getStudentPayments(user.id)
      .then(setPayments)
      .finally(() => setLoading(false));
  }, [user]);

  const totalSpent = payments.reduce((sum, p) => sum + (p.status === 'captured' ? p.amount : 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
            Payment History & Invoices
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Download GST-compliant tax invoices, inspect advance rent receipts, and verify Razorpay transaction IDs
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Verified Advances
            </span>
            <span className="text-sm font-extrabold text-slate-900 font-heading">
              ₹{totalSpent.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-[#EDE8DF] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading payment history...</div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-slate-900 text-sm">No payment transactions yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Once you reserve a room and pay the advance rent via Razorpay, your official receipts and GST invoices will be archived here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-[#EDE8DF] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Invoice #</th>
                  <th className="py-3.5 px-6">Accommodation</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Method & Gateway</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      {p.invoice_number}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{p.hostel_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Ref: {p.booking_reference}</div>
                    </td>

                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                      {new Date(p.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="capitalize font-bold text-slate-800">{p.method.replace('_', ' ')}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {p.razorpay_payment_id ? `Razorpay • ${p.razorpay_payment_id.slice(-8)}` : 'Direct Property Payment'}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-extrabold text-slate-900 whitespace-nowrap">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        CAPTURED
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/student/payments/${p.id}`)}
                        className="px-3 py-1.5 bg-[#FFF1ED] hover:bg-[#FFE4DC] text-[#FF4B26] text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
