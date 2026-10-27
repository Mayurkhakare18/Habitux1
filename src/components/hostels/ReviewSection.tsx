import React, { useState, useEffect } from 'react';
import { Review, Hostel } from '../../types';
import { HabituxAPI } from '../../lib/supabase';
import { useAuth } from '../../app/AuthContext';
import { 
  Star, 
  ShieldCheck, 
  MessageSquarePlus, 
  Edit3, 
  Trash2, 
  Flag, 
  ArrowUpDown, 
  Check, 
  Sparkles,
  Calendar,
  X,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { ReportReviewModal } from './ReportReviewModal';

interface ReviewSectionProps {
  hostel: Hostel;
  onReviewChanged?: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  hostel,
  onReviewChanged,
  onShowToast,
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [breakdown, setBreakdown] = useState<any>(null);

  // Modals state
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reportingReview, setReportingReview] = useState<Review | null>(null);

  // Form state
  const [formRating, setFormRating] = useState(5);
  const [formCleanliness, setFormCleanliness] = useState(5);
  const [formLocation, setFormLocation] = useState(5);
  const [formFacilities, setFormFacilities] = useState(5);
  const [formSafety, setFormSafety] = useState(5);
  const [formValue, setFormValue] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formText, setFormText] = useState('');
  const [formStayDuration, setFormStayDuration] = useState('11 Months');
  const [submitting, setSubmitting] = useState(false);

  // Verified stay status for current user
  const [hasVerifiedStay, setHasVerifiedStay] = useState(false);

  const loadReviewsAndStats = async () => {
    setLoading(true);
    try {
      const revs = await HabituxAPI.getReviews(hostel.id, sortBy);
      setReviews(revs);
      const stats = await HabituxAPI.getRatingBreakdown(hostel.id);
      setBreakdown(stats);

      if (user) {
        const verified = await HabituxAPI.hasVerifiedStay(user.id, hostel.id);
        setHasVerifiedStay(verified);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviewsAndStats();
  }, [hostel.id, sortBy, user]);

  const handleOpenWriteModal = (existing?: Review) => {
    if (!user) {
      onShowToast('info', 'Please sign in to share your verified hostel review');
      return;
    }

    if (existing) {
      setEditingReview(existing);
      setFormRating(existing.rating);
      setFormCleanliness(existing.cleanliness_rating || 5);
      setFormLocation(existing.location_rating || 5);
      setFormFacilities(existing.facilities_rating || 5);
      setFormSafety(existing.safety_rating || 5);
      setFormValue(existing.value_for_money_rating || 5);
      setFormTitle(existing.review_title || '');
      setFormText(existing.review_text);
      setFormStayDuration(existing.stay_duration || '11 Months');
    } else {
      setEditingReview(null);
      setFormRating(5);
      setFormCleanliness(5);
      setFormLocation(5);
      setFormFacilities(5);
      setFormSafety(5);
      setFormValue(5);
      setFormTitle('');
      setFormText('');
      setFormStayDuration('11 Months');
    }
    setIsWriteModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;
    setSubmitting(true);

    try {
      if (editingReview) {
        await HabituxAPI.updateReview(editingReview.id, {
          rating: formRating,
          cleanliness_rating: formCleanliness,
          location_rating: formLocation,
          facilities_rating: formFacilities,
          safety_rating: formSafety,
          value_for_money_rating: formValue,
          review_title: formTitle.trim(),
          review_text: formText.trim(),
          stay_duration: formStayDuration,
        });
        onShowToast('success', 'Your review has been updated!');
      } else {
        await HabituxAPI.submitReview({
          user_id: user?.id || 'usr-student-demo',
          user_name: user?.full_name || 'Verified Resident',
          user_avatar: user?.avatar_url,
          hostel_id: hostel.id,
          rating: formRating,
          cleanliness_rating: formCleanliness,
          location_rating: formLocation,
          facilities_rating: formFacilities,
          safety_rating: formSafety,
          value_for_money_rating: formValue,
          review_title: formTitle.trim(),
          review_text: formText.trim(),
          stay_duration: formStayDuration,
        });
        onShowToast('success', 'Thank you! Your verified review is published.');
      }

      setIsWriteModalOpen(false);
      loadReviewsAndStats();
      if (onReviewChanged) onReviewChanged();
    } catch (err) {
      console.error('Error submitting review:', err);
      onShowToast('error', 'Failed to save review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await HabituxAPI.deleteReview(reviewId);
      onShowToast('info', 'Your review has been removed.');
      loadReviewsAndStats();
      if (onReviewChanged) onReviewChanged();
    } catch (err) {
      console.error(err);
      onShowToast('error', 'Failed to delete review');
    }
  };

  return (
    <div id="reviews-section" className="space-y-8 pt-8 border-t border-[#EDE8DF]">
      {/* Header with Title and Write Review Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
              Ratings & Resident Reviews
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real feedback from verified student residents and verified coaching interns
          </p>
        </div>

        <button
          onClick={() => handleOpenWriteModal()}
          className="px-4 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-md shadow-[#FF4B26]/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <MessageSquarePlus className="w-4 h-4" />
          Write a Review
        </button>
      </div>

      {/* Ratings Analytics Dashboard Card */}
      {breakdown && (
        <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Big Score Block */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50/80 rounded-2xl border border-slate-100 text-center">
            <span className="text-5xl font-extrabold text-slate-900 font-heading">
              {breakdown.averageRating}
            </span>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    s <= Math.round(breakdown.averageRating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs font-semibold text-slate-600">
              Based on {breakdown.totalReviews} verified resident {breakdown.totalReviews === 1 ? 'review' : 'reviews'}
            </p>
            {hasVerifiedStay && (
              <span className="mt-3 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" /> You have a verified stay record
              </span>
            )}
          </div>

          {/* 1-5 Star Distribution Bars */}
          <div className="md:col-span-4 flex flex-col justify-center space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const data = breakdown.distribution[star] || { count: 0, percentage: 0 };
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-8 font-bold text-slate-700 flex items-center gap-1">
                    {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-medium text-slate-500 text-[11px]">
                    {data.count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 5 Sub-category Metric Meters */}
          <div className="md:col-span-4 flex flex-col justify-center space-y-2.5 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
              Sub-Category Breakdown
            </span>

            {[
              { label: 'Cleanliness', score: breakdown.categoryAverages.cleanliness },
              { label: 'Proximity & Location', score: breakdown.categoryAverages.location },
              { label: 'Facilities & Wi-Fi', score: breakdown.categoryAverages.facilities },
              { label: 'Security & Wardens', score: breakdown.categoryAverages.safety },
              { label: 'Value for Money', score: breakdown.categoryAverages.valueForMoney },
            ].map((cat) => (
              <div key={cat.label} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">{cat.label}</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <span className="text-amber-500 text-[11px]">★</span>
                  <span>{cat.score} / 5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sorting Bar */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Resident Stories ({reviews.length})
        </span>

        <div className="flex items-center gap-2 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#EDE8DF] font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="newest">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="p-8 bg-white rounded-3xl border border-[#EDE8DF] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">No reviews submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Be the first verified resident or student visitor to review {hostel.name}!
          </p>
          <button
            onClick={() => handleOpenWriteModal()}
            className="px-4 py-2 bg-[#FF4B26] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" /> Submit First Review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const isAuthor = user && (user.id === rev.user_id || user.email === rev.user_name);
            return (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-[#EDE8DF] p-5 sm:p-6 shadow-xs space-y-3 hover:border-slate-300 transition-colors"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.user_name}</span>
                        {/* Only display Verified Stay when supported by actual record! */}
                        {rev.is_verified_stay && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Resident
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{new Date(rev.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        {rev.stay_duration && <span>• Stay: {rev.stay_duration}</span>}
                        {rev.room_type_name && <span>• {rev.room_type_name}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>

                {/* Review Title & Body */}
                <div className="space-y-1">
                  {rev.review_title && (
                    <h4 className="font-bold text-xs text-slate-900">{rev.review_title}</h4>
                  )}
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {rev.review_text}
                  </p>
                </div>

                {/* Category tags pill row */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  {rev.cleanliness_rating && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100">
                      Cleanliness: <b className="text-slate-800">{rev.cleanliness_rating}/5</b>
                    </span>
                  )}
                  {rev.location_rating && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100">
                      Location: <b className="text-slate-800">{rev.location_rating}/5</b>
                    </span>
                  )}
                  {rev.facilities_rating && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100">
                      Facilities: <b className="text-slate-800">{rev.facilities_rating}/5</b>
                    </span>
                  )}
                  {rev.safety_rating && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100">
                      Safety: <b className="text-slate-800">{rev.safety_rating}/5</b>
                    </span>
                  )}
                  {rev.value_for_money_rating && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100">
                      Value: <b className="text-slate-800">{rev.value_for_money_rating}/5</b>
                    </span>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Authenticity checked by Habitux
                  </span>

                  <div className="flex items-center gap-3">
                    {isAuthor ? (
                      <>
                        <button
                          onClick={() => handleOpenWriteModal(rev)}
                          className="text-slate-500 hover:text-[#FF4B26] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setReportingReview(rev)}
                        className="text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer"
                        title="Report inappropriate review"
                      >
                        <Flag className="w-3.5 h-3.5" /> Report
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Submission / Editing Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div 
            className="bg-white w-full max-w-lg rounded-3xl border border-[#EDE8DF] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#EDE8DF] flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center">
                  <Star className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm font-heading">
                    {editingReview ? 'Edit Your Review' : `Review ${hostel.name}`}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Your honest feedback guides future students & parents
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Overall Star Rating */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Overall Experience Rating
                </span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= formRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-extrabold text-slate-800">
                  {formRating === 5 && 'Outstanding • Highly Recommended'}
                  {formRating === 4 && 'Very Good • Satisfied Resident'}
                  {formRating === 3 && 'Average • Meets basic expectations'}
                  {formRating === 2 && 'Below Average • Needs improvement'}
                  {formRating === 1 && 'Poor experience'}
                </span>
              </div>

              {/* Category Sub-ratings Sliders */}
              <div className="space-y-3 p-4 bg-white rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Rate By Category (1 to 5 Stars)
                </span>

                {[
                  { label: 'Room Cleanliness & Hygiene', value: formCleanliness, setter: setFormCleanliness },
                  { label: 'Location & Campus Proximity', value: formLocation, setter: setFormLocation },
                  { label: 'Facilities, Wi-Fi & Power', value: formFacilities, setter: setFormFacilities },
                  { label: 'Safety, Wardens & CCTV', value: formSafety, setter: setFormSafety },
                  { label: 'Value for Money', value: formValue, setter: setFormValue },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>{item.label}</span>
                      <span className="text-[#FF4B26] font-bold">{item.value} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={item.value}
                      onChange={(e) => item.setter(Number(e.target.value))}
                      className="w-full accent-[#FF4B26] cursor-pointer h-1.5"
                    />
                  </div>
                ))}
              </div>

              {/* Stay Duration */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  How long did you stay?
                </label>
                <select
                  value={formStayDuration}
                  onChange={(e) => setFormStayDuration(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#FF4B26]/30 cursor-pointer"
                >
                  <option value="1-3 Months">1-3 Months (Short stay)</option>
                  <option value="6 Months">6 Months (Semester stay)</option>
                  <option value="11 Months">11 Months (Academic session)</option>
                  <option value="1+ Year">1+ Year (Long-term resident)</option>
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Headline for your review
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Excellent study atmosphere, clean mess food"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF4B26]/30"
                />
              </div>

              {/* Review Text */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Written Feedback
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about meal quality, study environment, Wi-Fi speed, washroom cleanliness, warden behavior, or gate timings..."
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-[#EDE8DF] text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF4B26]/30 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#EDE8DF]">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : editingReview ? 'Save Changes' : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportingReview && (
        <ReportReviewModal
          review={reportingReview}
          onClose={() => setReportingReview(null)}
          onReportSubmitted={() => {
            onShowToast('success', 'Thank you. The review report has been logged for admin moderation.');
          }}
        />
      )}
    </div>
  );
};
