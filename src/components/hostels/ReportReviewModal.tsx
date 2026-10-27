import React, { useState } from 'react';
import { Review, ReviewReport } from '../../types';
import { X, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { HabituxAPI } from '../../lib/supabase';
import { useAuth } from '../../app/AuthContext';

interface ReportReviewModalProps {
  review: Review | null;
  onClose: () => void;
  onReportSubmitted: () => void;
}

export const ReportReviewModal: React.FC<ReportReviewModalProps> = ({
  review,
  onClose,
  onReportSubmitted,
}) => {
  const { user } = useAuth();
  const [reason, setReason] = useState<ReviewReport['reason']>('inappropriate');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!review) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await HabituxAPI.reportReview({
        review_id: review.id,
        hostel_id: review.hostel_id,
        reporter_id: user?.id || 'anon',
        reporter_name: user?.full_name || 'Anonymous User',
        reason,
        notes: notes.trim(),
      });
      setSubmitted(true);
      setTimeout(() => {
        onReportSubmitted();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to report review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white w-full max-w-md rounded-3xl border border-[#EDE8DF] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#EDE8DF] flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm font-heading">
                Report Inappropriate Review
              </h3>
              <p className="text-[11px] text-slate-500">
                Helps Habitux maintain 100% verified authentic feedback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Report Submitted</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Our trust & safety team has received your report. Inappropriate or fraudulent reviews are investigated and removed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 italic">
              &ldquo;{review.review_text.slice(0, 140)}...&rdquo;
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Reason for Reporting
              </label>
              <div className="space-y-2">
                {[
                  { id: 'inappropriate', label: 'Inappropriate or offensive language' },
                  { id: 'spam', label: 'Spam, promotional, or commercial content' },
                  { id: 'false_info', label: 'False or misleading property information' },
                  { id: 'harassment', label: 'Targeted harassment or personal attack' },
                  { id: 'other', label: 'Other violation' },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="reportReason"
                      value={item.id}
                      checked={reason === item.id}
                      onChange={() => setReason(item.id as any)}
                      className="w-4 h-4 text-[#FF4B26] accent-[#FF4B26]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Additional Details (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Help our moderation team understand why this review is misleading or fraudulent..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF4B26]/30 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
