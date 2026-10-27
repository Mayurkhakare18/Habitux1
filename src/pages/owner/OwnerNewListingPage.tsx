import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { Hostel, RoomType, PropertyType, GenderPolicy } from '../../types';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Utensils, 
  Wifi, 
  ShieldCheck, 
  Camera, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Plus,
  Trash2
} from 'lucide-react';

export const OwnerNewListingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('hostel');
  const [genderPolicy, setGenderPolicy] = useState<GenderPolicy>('boys');
  const [description, setDescription] = useState('');

  // Location
  const [addressLine, setAddressLine] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('Delhi');
  const [state, setState] = useState('Delhi');
  const [postalCode, setPostalCode] = useState('110007');
  const [nearestHub, setNearestHub] = useState('');
  const [distanceKm, setDistanceKm] = useState(0.8);

  // Pricing & Rooms
  const [rentMin, setRentMin] = useState(8500);
  const [rentMax, setRentMax] = useState(15000);
  const [securityDeposit, setSecurityDeposit] = useState(5000);
  const [electricityPolicy, setElectricityPolicy] = useState<'Inclusive' | 'Separate Meter' | 'Fixed Surcharge'>('Inclusive');

  const [roomTypes, setRoomTypes] = useState<Omit<RoomType, 'id' | 'hostel_id'>[]>([
    {
      room_name: 'Double Sharing (AC)',
      sharing_capacity: 2,
      monthly_rent: 11000,
      available_beds: 4,
      total_beds: 12,
      air_conditioned: true,
      attached_washroom: true,
      description: 'Includes wooden wardrobe, study table, and ergonomic chair.'
    },
    {
      room_name: 'Triple Sharing (Non-AC)',
      sharing_capacity: 3,
      monthly_rent: 8500,
      available_beds: 6,
      total_beds: 18,
      air_conditioned: false,
      attached_washroom: true,
      description: 'Budget-friendly shared room with individual lockers.'
    }
  ]);

  // Food & Amenities
  const [foodAvailable, setFoodAvailable] = useState(true);
  const [mealPlanDescription, setMealPlanDescription] = useState('3 meals daily (Breakfast, Lunch, Dinner) + High Tea');
  const [wifiAvailable, setWifiAvailable] = useState(true);
  const [wifiSpeed, setWifiSpeed] = useState(150);
  const [acAvailable, setAcAvailable] = useState(true);
  const [laundryAvailable, setLaundryAvailable] = useState(true);
  const [powerBackup, setPowerBackup] = useState(true);
  const [curfewPolicy, setCurfewPolicy] = useState('10:00 PM (Biometric Attendance)');
  const [visitorPolicy, setVisitorPolicy] = useState('Allowed in ground floor visitor lounge till 8 PM');
  const [cancellationPolicy, setCancellationPolicy] = useState('30-day notice required before checkout');

  // Images
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddRoom = () => {
    setRoomTypes([
      ...roomTypes,
      {
        room_name: 'Single Private Room',
        sharing_capacity: 1,
        monthly_rent: 16000,
        available_beds: 2,
        total_beds: 4,
        air_conditioned: true,
        attached_washroom: true,
        description: 'Complete privacy with personal study desk.'
      }
    ]);
  };

  const handleRemoveRoom = (index: number) => {
    setRoomTypes(roomTypes.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const created = await HabituxAPI.createHostel({
        name,
        property_type: propertyType,
        gender_policy: genderPolicy,
        description,
        address_line: addressLine,
        locality,
        city,
        state,
        postal_code: postalCode,
        nearest_college_or_hub: nearestHub,
        distance_to_college_km: Number(distanceKm),
        monthly_rent_min: Number(rentMin),
        monthly_rent_max: Number(rentMax),
        security_deposit: Number(securityDeposit),
        electricity_policy: electricityPolicy,
        food_available: foodAvailable,
        meal_plan_description: mealPlanDescription,
        wifi_available: wifiAvailable,
        wifi_speed_mbps: Number(wifiSpeed),
        ac_available: acAvailable,
        laundry_available: laundryAvailable,
        power_backup: powerBackup,
        curfew_policy: curfewPolicy,
        visitor_policy: visitorPolicy,
        cancellation_policy: cancellationPolicy,
        owner_id: user?.id || 'owner-001',
        owner_name: user?.full_name || 'Property Owner',
        owner_phone: user?.phone || '+91 98765 43210',
        images: imageUrls.map((url, i) => ({
          id: `img-${Date.now()}-${i}`,
          hostel_id: '',
          storage_path: url,
          caption: `${name} room photo ${i + 1}`,
          display_order: i + 1
        })),
        room_types: roomTypes.map((rt, i) => ({
          ...rt,
          id: `rt-${Date.now()}-${i}`,
          hostel_id: ''
        }))
      });

      navigate(`/owner/listings`);
    } catch (err) {
      console.error(err);
      alert('Error creating listing. Please check form inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/owner/listings')}
            className="text-xs font-semibold text-slate-500 hover:text-[#0F172A] flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Listings
          </button>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
            List New Student Accommodation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Provide honest, accurate details so prospective students can schedule visits without brokers
          </p>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-4 gap-2 border-b border-[#EDE8DF] pb-4">
        {[
          { num: 1, label: 'Overview' },
          { num: 2, label: 'Location' },
          { num: 3, label: 'Rooms & Rent' },
          { num: 4, label: 'Amenities & Photos' }
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`p-2.5 rounded-xl text-left transition-all cursor-pointer ${
              step === s.num
                ? 'bg-[#FFF1ED] text-[#FF4B26] font-bold border border-[#FF4B26]/30'
                : 'bg-white text-slate-500 border border-[#EDE8DF]'
            }`}
          >
            <div className="text-[10px] uppercase font-bold tracking-wider">Step {s.num}</div>
            <div className="text-xs font-semibold">{s.label}</div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm space-y-6">
        {/* STEP 1: Property Overview */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-extrabold text-[#0F172A] font-heading flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#FF4B26]" /> 1. Property Overview
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Hostel / PG Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Habitux Royal Residency for Boys"
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Property Category
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
                >
                  <option value="hostel">Hostel (Dedicated Building)</option>
                  <option value="pg">Paying Guest (PG)</option>
                  <option value="co_living">Co-Living Space</option>
                  <option value="flat">Shared Student Flat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Gender Policy
                </label>
                <select
                  value={genderPolicy}
                  onChange={(e) => setGenderPolicy(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
                >
                  <option value="boys">Boys Only</option>
                  <option value="girls">Girls Only</option>
                  <option value="co_living">Co-living / Mixed</option>
                  <option value="unisex">Unisex Wing</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Property Description *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your student accommodation: security measures, study environment, nearby facilities, cleanliness routine..."
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!name.trim()}
                className="px-6 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                Continue to Location <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Location & Academic Hub */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-extrabold text-[#0F172A] font-heading flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF4B26]" /> 2. Address & Nearby College
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Street Address / Landmark *
              </label>
              <input
                type="text"
                required
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="e.g. Plot 42, Block C, Jawahar Nagar"
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Locality / Area *
                </label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. North Campus"
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
                >
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Kota">Kota</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Jaipur">Jaipur</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Nearest College, Coaching or Metro *
                </label>
                <input
                  type="text"
                  required
                  value={nearestHub}
                  onChange={(e) => setNearestHub(e.target.value)}
                  placeholder="e.g. Hansraj College & Vishwavidyalaya Metro"
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Distance to Hub (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="15"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0.5)}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 border border-[#EDE8DF] text-slate-600 font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!locality.trim() || !nearestHub.trim()}
                className="px-6 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                Continue to Rooms & Rent <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Rooms & Rent */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-extrabold text-[#0F172A] font-heading flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-[#FF4B26]" /> 3. Rent & Room Inventory
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Starting Rent (₹ / mo) *
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
                  Max Rent (₹ / mo) *
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
                  Security Deposit (₹)
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
                Electricity Billing Policy
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

            {/* Room Types Builder */}
            <div className="space-y-3 pt-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 uppercase">
                  Room Types & Bed Configurations ({roomTypes.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddRoom}
                  className="text-xs font-bold text-[#FF4B26] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Room Option
                </button>
              </div>

              {roomTypes.map((room, idx) => (
                <div key={idx} className="p-4 bg-[#FAF8F5] border border-[#EDE8DF] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">
                      Option #{idx + 1}: {room.room_name}
                    </span>
                    {roomTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRoom(idx)}
                        className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] mb-1">Sharing</span>
                      <select
                        value={room.sharing_capacity}
                        onChange={(e) => {
                          const updated = [...roomTypes];
                          updated[idx].sharing_capacity = Number(e.target.value);
                          setRoomTypes(updated);
                        }}
                        className="w-full p-2 bg-white border border-[#EDE8DF] rounded-lg"
                      >
                        <option value={1}>Single Sharing</option>
                        <option value={2}>Double Sharing</option>
                        <option value={3}>Triple Sharing</option>
                        <option value={4}>Four Sharing</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] mb-1">Monthly Rent (₹)</span>
                      <input
                        type="number"
                        value={room.monthly_rent}
                        onChange={(e) => {
                          const updated = [...roomTypes];
                          updated[idx].monthly_rent = Number(e.target.value);
                          setRoomTypes(updated);
                        }}
                        className="w-full p-2 bg-white border border-[#EDE8DF] rounded-lg"
                      />
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] mb-1">Available Beds</span>
                      <input
                        type="number"
                        value={room.available_beds}
                        onChange={(e) => {
                          const updated = [...roomTypes];
                          updated[idx].available_beds = Number(e.target.value);
                          setRoomTypes(updated);
                        }}
                        className="w-full p-2 bg-white border border-[#EDE8DF] rounded-lg"
                      />
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] mb-1">Total Beds</span>
                      <input
                        type="number"
                        value={room.total_beds}
                        onChange={(e) => {
                          const updated = [...roomTypes];
                          updated[idx].total_beds = Number(e.target.value);
                          setRoomTypes(updated);
                        }}
                        className="w-full p-2 bg-white border border-[#EDE8DF] rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 border border-[#EDE8DF] text-slate-600 font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                Continue to Amenities & Photos <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Amenities, Rules & Photos */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-extrabold text-[#0F172A] font-heading flex items-center gap-2">
              <Utensils className="w-5 h-5 text-[#FF4B26]" /> 4. Facilities, Rules & Property Photos
            </h2>

            {/* Toggles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Food Included', checked: foodAvailable, set: setFoodAvailable },
                { label: 'High-Speed Wi-Fi', checked: wifiAvailable, set: setWifiAvailable },
                { label: 'AC Available', checked: acAvailable, set: setAcAvailable },
                { label: 'Power Backup', checked: powerBackup, set: setPowerBackup },
                { label: 'Laundry Facility', checked: laundryAvailable, set: setLaundryAvailable }
              ].map((f, i) => (
                <label key={i} className="flex items-center gap-2 p-3 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={f.checked}
                    onChange={(e) => f.set(e.target.checked)}
                    className="w-4 h-4 text-[#FF4B26] rounded focus:ring-0"
                  />
                  <span>{f.label}</span>
                </label>
              ))}
            </div>

            {foodAvailable && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Meal Plan Description
                </label>
                <input
                  type="text"
                  value={mealPlanDescription}
                  onChange={(e) => setMealPlanDescription(e.target.value)}
                  placeholder="e.g. 4 meals daily (North & South Indian menu, vegetarian only)"
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Curfew Policy / Gate Timing
                </label>
                <input
                  type="text"
                  value={curfewPolicy}
                  onChange={(e) => setCurfewPolicy(e.target.value)}
                  placeholder="e.g. 10:00 PM or No Curfew with digital log"
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Visitor Policy
                </label>
                <input
                  type="text"
                  value={visitorPolicy}
                  onChange={(e) => setVisitorPolicy(e.target.value)}
                  placeholder="e.g. Parents allowed in room till 6 PM"
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF4B26]"
                />
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#FF4B26]" /> Property Photos ({imageUrls.length})
              </label>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste direct image URL (Unsplash or hosted JPG/PNG)..."
                  className="flex-1 px-4 py-2 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Add Image
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative aspect-16/10 rounded-xl overflow-hidden border border-[#EDE8DF] group">
                    <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    {imageUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md text-[10px] opacity-80 hover:opacity-100"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-[#EDE8DF]">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 border border-[#EDE8DF] text-slate-600 font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-[#FF4B26] hover:bg-[#E03713] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-[#FF4B26]/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                {submitting ? 'Submitting to Review...' : 'Publish Listing to Review Queue'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
