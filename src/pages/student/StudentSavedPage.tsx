import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { Hostel } from '../../types';
import { Heart, Trash2, ArrowRight, MapPin, Scale } from 'lucide-react';

export const StudentSavedPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedHostels, setSavedHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    HabituxAPI.getHostels().then(async (all) => {
      const favIds = await HabituxAPI.getFavorites(user.id);
      setSavedHostels(all.filter((h) => favIds.includes(h.id)));
      setLoading(false);
    });
  }, [user]);

  const handleRemoveFavorite = async (hostelId: string) => {
    if (!user) return;
    await HabituxAPI.toggleFavorite(user.id, hostelId);
    setSavedHostels((prev) => prev.filter((h) => h.id !== hostelId));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
            My Saved Hostels ({savedHostels.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hostels and PGs you bookmarked to review or visit later
          </p>
        </div>

        {savedHostels.length > 1 && (
          <button
            onClick={() => navigate('/compare')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Scale className="w-4 h-4" /> Compare Saved Properties
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading saved hostels...</div>
      ) : savedHostels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedHostels.map((h) => (
            <div
              key={h.id}
              className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-xs hover:border-[#FF4B26]/30 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-16/10">
                <img
                  src={h.images[0]?.storage_path}
                  alt={h.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemoveFavorite(h.id)}
                  title="Remove from favorites"
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-rose-500 hover:bg-white shadow-xs cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#FF4B26] text-white font-black text-[10px]">
                  0% BROKERAGE
                </span>
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

                <div className="text-xs font-black text-[#0F172A]">
                  ₹{h.monthly_rent_min.toLocaleString('en-IN')}
                  <span className="text-slate-500 font-normal"> /month</span>
                </div>

                <button
                  onClick={() => navigate(`/hostels/${h.slug}`)}
                  className="w-full py-2.5 bg-[#FFF1ED] hover:bg-[#FFE4DC] text-[#FF4B26] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  View Details & Rooms <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#EDE8DF] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-base font-heading">
              No saved hostels yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the heart icon on any hostel card while exploring to bookmark it here for easy comparison.
            </p>
          </div>
          <Link
            to="/student/explore"
            className="inline-block px-5 py-2.5 bg-[#FF4B26] text-white text-xs font-bold rounded-xl"
          >
            Explore Accommodations
          </Link>
        </div>
      )}
    </div>
  );
};
