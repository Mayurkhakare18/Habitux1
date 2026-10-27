import React, { useState, useEffect } from 'react';
import { HabituxAPI } from '../../lib/supabase';
import { Review } from '../../types';
import { 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck,
  User,
  Trash2
} from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'pending' | 'rejected'>('all');

  const loadReviews = async () => {
    setLoading(true);
    const list = await HabituxAPI.getAllReviews();
    setReviews(list);
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleUpdateStatus = async (reviewId: string, status: 'published' | 'pending' | 'rejected') => {
    try {
      await HabituxAPI.updateReviewModeration(reviewId, status);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, moderation_status: status } : r))
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update review moderation status');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'all') return true;
    return r.moderation_status === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
            Student Review & Rating Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ensure resident feedback is authentic and free from competitor abuse or abusive language
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#EDE8DF] rounded-xl self-start sm:self-auto">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'published', label: 'Published' },
            { id: 'pending', label: 'Pending' },
            { id: 'rejected', label: 'Rejected / Flagged' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading reviews...</div>
      ) : filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl border border-[#EDE8DF] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    rev.moderation_status === 'published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : rev.moderation_status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {rev.moderation_status}
                  </span>

                  <span className="text-xs text-slate-400">
                    {new Date(rev.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  &quot;{rev.review_text}&quot;
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Posted by: <strong className="text-slate-700">{rev.user_name}</strong></span>
                  <span>• Hostel Ref: <span className="font-mono text-slate-600">{rev.hostel_id}</span></span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {rev.moderation_status !== 'published' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'published')}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Publish
                  </button>
                )}

                {rev.moderation_status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                    className="px-3.5 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject / Flag
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#EDE8DF]">
          <p className="text-xs text-slate-500">No reviews found matching this filter.</p>
        </div>
      )}
    </div>
  );
};
