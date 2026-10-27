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
  CheckCircle2
} from 'lucide-react';

export const OwnerListingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    HabituxAPI.getHostels().then((all) => {
      setHostels(all);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this listing?')) {
      await HabituxAPI.deleteHostel(id);
      setHostels((prev) => prev.filter((h) => h.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
            My Hostel & PG Listings ({hostels.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your accommodation profiles, room photos, and verification requests
          </p>
        </div>

        <button
          onClick={() => navigate('/owner/listings/new')}
          className="px-4 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Add New Hostel
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading listings...</div>
      ) : hostels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map((h) => (
            <div
              key={h.id}
              className="bg-white rounded-3xl border border-[#EDE8DF] overflow-hidden shadow-xs hover:border-[#FF4B26]/30 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-16/10">
                <img src={h.images[0]?.storage_path} alt={h.name} className="w-full h-full object-cover" />
                
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white ${
                    h.verification_status === 'verified' ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}>
                    {h.verification_status.toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-semibold uppercase">
                    {h.listing_status}
                  </span>
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
          ))}
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
