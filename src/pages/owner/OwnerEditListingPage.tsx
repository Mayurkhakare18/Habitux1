import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HabituxAPI } from '../../lib/supabase';
import { Hostel } from '../../types';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Utensils, 
  ArrowLeft, 
  Save, 
  Trash2,
  Plus
} from 'lucide-react';

export const OwnerEditListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hostel, setHostel] = useState<Hostel | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
  const [nearestHub, setNearestHub] = useState('');
  const [rentMin, setRentMin] = useState(0);
  const [rentMax, setRentMax] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [electricityPolicy, setElectricityPolicy] = useState<'Inclusive' | 'Separate Meter' | 'Fixed Surcharge'>('Inclusive');
  const [foodAvailable, setFoodAvailable] = useState(true);
  const [mealPlanDescription, setMealPlanDescription] = useState('');
  const [wifiAvailable, setWifiAvailable] = useState(true);
  const [acAvailable, setAcAvailable] = useState(true);
  const [curfewPolicy, setCurfewPolicy] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    HabituxAPI.getHostelById(id).then((found) => {
      if (found) {
        setHostel(found);
        setName(found.name);
        setDescription(found.description);
        setLocality(found.locality);
        setCity(found.city);
        setNearestHub(found.nearest_college_or_hub);
        setRentMin(found.monthly_rent_min);
        setRentMax(found.monthly_rent_max);
        setSecurityDeposit(found.security_deposit);
        setElectricityPolicy(found.electricity_policy || 'Inclusive');
        setFoodAvailable(found.food_available);
        setMealPlanDescription(found.meal_plan_description || '');
        setWifiAvailable(found.wifi_available);
        setAcAvailable(found.ac_available);
        setCurfewPolicy(found.curfew_policy || '');
      }
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !hostel) return;
    setSaving(true);

    try {
      await HabituxAPI.updateHostel(id, {
        name,
        description,
        locality,
        city,
        nearest_college_or_hub: nearestHub,
        monthly_rent_min: Number(rentMin),
        monthly_rent_max: Number(rentMax),
        security_deposit: Number(securityDeposit),
        electricity_policy: electricityPolicy,
        food_available: foodAvailable,
        meal_plan_description: mealPlanDescription,
        wifi_available: wifiAvailable,
        ac_available: acAvailable,
        curfew_policy: curfewPolicy,
      });
      navigate('/owner/listings');
    } catch (err) {
      console.error(err);
      alert('Error updating listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Loading property information...
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-sm text-slate-600">Property not found.</p>
        <button
          onClick={() => navigate('/owner/listings')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
        >
          Return to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/owner/listings')}
            className="text-xs font-semibold text-slate-500 hover:text-[#0F172A] flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Listings
          </button>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
            Edit: {hostel.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Status: <span className="uppercase font-bold text-[#FF4B26]">{hostel.verification_status}</span> • ID: {hostel.id}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Hostel Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Locality
            </label>
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Nearest College or Hub
          </label>
          <input
            type="text"
            value={nearestHub}
            onChange={(e) => setNearestHub(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Min Rent (₹)
            </label>
            <input
              type="number"
              value={rentMin}
              onChange={(e) => setRentMin(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Max Rent (₹)
            </label>
            <input
              type="number"
              value={rentMax}
              onChange={(e) => setRentMax(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Deposit (₹)
            </label>
            <input
              type="number"
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Electricity Policy
          </label>
          <select
            value={electricityPolicy}
            onChange={(e) => setElectricityPolicy(e.target.value as any)}
            className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
          >
            <option value="Inclusive">Inclusive in Rent</option>
            <option value="Separate Meter">Separate Meter (Per Unit Reading)</option>
            <option value="Fixed Surcharge">Fixed Monthly Surcharge</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Curfew Policy
            </label>
            <input
              type="text"
              value={curfewPolicy}
              onChange={(e) => setCurfewPolicy(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Meal Plan Info
            </label>
            <input
              type="text"
              value={mealPlanDescription}
              onChange={(e) => setMealPlanDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
            />
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t border-[#EDE8DF]">
          <button
            type="button"
            onClick={() => navigate('/owner/listings')}
            className="px-5 py-2.5 border border-[#EDE8DF] text-slate-600 font-bold text-xs rounded-xl"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#FF4B26]/20"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
