import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { Hostel } from '../../types';
import { 
  Building2, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  Bed, 
  MapPin, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  PauseCircle,
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';

export const OwnerListingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadListings = () => {
    setLoading(true);
    HabituxAPI.getHostels().then((all) => {
      setHostels(all);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this listing?')) {
      await HabituxAPI.deleteHostel(id);
      setHostels((prev) => prev.filter((h) => h.id !== id));
      showToast('Listing removed successfully');
    }
  };

  const handleTogglePublish = async (hostel: Hostel) => {
    const isCurrentlyPublished = hostel.listing_status === 'published';
    const nextListingStatus = isCurrentlyPublished ? 'paused' : 'published';
    const nextVerificationStatus = isCurrentlyPublished ? hostel.verification_status : 'verified';

    try {
      await HabituxAPI.updateHostel(hostel.id, {
        listing_status: nextListingStatus,
        verification_status: nextVerificationStatus
      });

      setHostels((prev) =>
        prev.map((h) =>
          h.id === hostel.id
            ? { ...h, listing_status: nextListingStatus, verification_status: nextVerificationStatus }
            : h
        )
      );

      showToast(
        isCurrentlyPublished
          ? `Listing paused. It is now hidden from student search.`
          : `Listing published! "${hostel.name}" is now LIVE and verified for all students.`
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update listing status');
    }
  };

  const pendingCount = hostels.filter(
    (h) => h.listing_status !== 'published' || h.verification_status !== 'verified'
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
            My Hostel & PG Listings ({hostels.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your accommodation profiles, room photos, and instant publishing
          </p>
        </div>

        <button
          onClick={() => navigate('/owner/listings/new')}
          className="px-4 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Add New Hostel
        </button>
      </div>

      {/* Verification & Publishing Explainer Banner */}
      <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
              Why was my listing marked "Pending"?
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold normal-case">
                  {pendingCount} Pending Review
                </span>
              )}
            </h3>
            <p className="text-xs text-amber-900/80 mt-0.5 leading-relaxed">
              Habitux verifies every new property to guarantee <strong>Zero-Brokerage</strong>, accurate room photos, and transparent electricity policies for students. You can click <strong>"Publish Live"</strong> below on any property card to instantly publish it, or approve it via the{' '}
              <Link to="/admin/listings" className="underline font-bold text-[#FF4B26] hover:text-[#E03713] inline-flex items-center gap-0.5">
                Admin Review Portal <ExternalLink className="w-3 h-3" />
              </Link>.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading listings...</div>
      ) : hostels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map((h) => {
            const isLive = h.listing_status === 'published' && h.verification_status === 'verified';
            const isPending = h.listing_status === 'pending_review' || h.verification_status === 'pending';

            return (
              <div
                key={h.id}
                className="bg-white rounded-3xl border border-[#EDE8DF] overflow-hidden shadow-xs hover:border-[#FF4B26]/30 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-16/10">
                  <img src={h.images[0]?.storage_path} alt={h.name} className="w-full h-full object-cover" />
                  
                  {/* Status Badges */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {isLive ? (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-emerald-600 shadow-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        PUBLISHED (LIVE)
                      </span>
                    ) : isPending ? (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-amber-500 shadow-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        PENDING APPROVAL
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-slate-600 shadow-xs flex items-center gap-1">
                        <PauseCircle className="w-3 h-3" />
                        PAUSED
                      </span>
                    )}

                    {h.verification_status === 'verified' && (
                      <span className="px-2 py-0.5 rounded-lg bg-blue-600 text-white text-[10px] font-semibold flex items-center gap-1 shadow-xs">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#FF4B26] uppercase">
                      {h.locality}, {h.city}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base font-heading">
                      {h.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {h.nearest_college_or_hub}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Rent Range</span>
                      <strong className="text-slate-900">₹{h.monthly_rent_min.toLocaleString('en-IN')}+</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Bed Inventory</span>
                      <strong className="text-emerald-600">
                        {h.room_types.reduce((s, r) => s + r.available_beds, 0)} vacant
                      </strong>
                    </div>
                  </div>

                  {/* Quick Publish / Pause Action Bar */}
                  <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE8DF] flex items-center justify-between gap-2">
                    <div className="text-[11px]">
                      <span className="text-slate-500 block text-[10px]">Publish Status</span>
                      <span className={`font-bold ${isLive ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {isLive ? 'Active on Student Search' : 'Not live to students'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleTogglePublish(h)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isLive
                          ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isLive ? (
                        <>
                          <PauseCircle className="w-3.5 h-3.5" /> Pause
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Publish Now
                        </>
                      )}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/owner/listings/${h.id}/edit`}
                      className="p-2 bg-slate-100 hover:bg-[#FFF1ED] text-slate-700 hover:text-[#FF4B26] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </Link>

                    <Link
                      to="/owner/rooms"
                      className="p-2 bg-slate-100 hover:bg-[#FFF1ED] text-slate-700 hover:text-[#FF4B26] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Bed className="w-3.5 h-3.5" /> Beds
                    </Link>

                    <Link
                      to={`/hostels/${h.slug}`}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>

                    <button
                      onClick={() => handleDelete(h.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#EDE8DF] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF1ED] text-[#FF4B26] flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base font-heading">
              No hostel properties added yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Create your first student accommodation listing with photos, room types, and pricing.
            </p>
          </div>
          <button
            onClick={() => navigate('/owner/listings/new')}
            className="px-5 py-2.5 bg-[#FF4B26] text-white text-xs font-bold rounded-xl"
          >
            Create New Listing
          </button>
        </div>
      )}
    </div>
  );
};
