import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  Bed, 
  CalendarCheck, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Save, 
  Trash2, 
  Edit3, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight,
  Send,
  X
} from 'lucide-react';
import { UserProfile, Hostel, Enquiry, RoomType, PropertyType, GenderPolicy } from '../../types';

interface OwnerDashboardProps {
  user: UserProfile;
  hostels: Hostel[];
  enquiries: Enquiry[];
  onAddHostel: (hostelData: Partial<Hostel>) => Promise<Hostel>;
  onUpdateHostel: (hostelId: string, updates: Partial<Hostel>) => Promise<Hostel>;
  onUpdateRoomBeds: (hostelId: string, roomTypeId: string, availableBeds: number, totalBeds?: number) => Promise<void>;
  onRespondEnquiry: (enquiryId: string, status: Enquiry['status'], responseText: string) => Promise<void>;
  onNavigateHome: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  user,
  hostels,
  enquiries,
  onAddHostel,
  onUpdateHostel,
  onUpdateRoomBeds,
  onRespondEnquiry,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'inventory' | 'enquiries' | 'add_property'>('listings');
  const [selectedHostelForInventory, setSelectedHostelForInventory] = useState<Hostel>(hostels[0] || null);

  // Enquiry response state
  const [activeEnquiryId, setActiveEnquiryId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [responseStatus, setResponseStatus] = useState<Enquiry['status']>('visit_scheduled');

  // Add Property Form state
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<PropertyType>('hostel');
  const [newGender, setNewGender] = useState<GenderPolicy>('boys');
  const [newAddress, setNewAddress] = useState('');
  const [newLocality, setNewLocality] = useState('');
  const [newCity, setNewCity] = useState('Kota');
  const [newNearCollege, setNewNearCollege] = useState('');
  const [newMinRent, setNewMinRent] = useState(8000);
  const [newMaxRent, setNewMaxRent] = useState(14000);
  const [newDeposit, setNewDeposit] = useState(5000);
  const [newFood, setNewFood] = useState(true);
  const [newFoodDesc, setNewFoodDesc] = useState('3x fresh vegetarian meals daily + evening tea');
  const [newWifi, setNewWifi] = useState(150);
  const [newCurfew, setNewCurfew] = useState('10:00 PM');
  const [newDesc, setNewDesc] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80');
  const [addingListing, setAddingListing] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  // Compute live metrics
  const totalBeds = hostels.reduce((sum, h) => 
    sum + h.room_types.reduce((rSum, r) => rSum + r.total_beds, 0), 0
  );
  const availableBeds = hostels.reduce((sum, h) => 
    sum + h.room_types.reduce((rSum, r) => rSum + r.available_beds, 0), 0
  );

  const handleBedChange = async (hostelId: string, roomTypeId: string, newAvail: number) => {
    await onUpdateRoomBeds(hostelId, roomTypeId, newAvail);
    // Refresh local selected
    const updated = hostels.find(h => h.id === hostelId);
    if (updated) setSelectedHostelForInventory({ ...updated });
  };

  const handleSendResponse = async (enquiryId: string) => {
    if (!responseText.trim()) return;
    await onRespondEnquiry(enquiryId, responseStatus, responseText);
    setActiveEnquiryId(null);
    setResponseText('');
  };

  const handleAddPropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAddress || !newLocality) return;

    setAddingListing(true);
    try {
      await onAddHostel({
        name: newName,
        property_type: newType,
        gender_policy: newGender,
        address_line: newAddress,
        locality: newLocality,
        city: newCity,
        nearest_college_or_hub: newNearCollege || 'College Campus Hub',
        monthly_rent_min: Number(newMinRent),
        monthly_rent_max: Number(newMaxRent),
        security_deposit: Number(newDeposit),
        food_available: newFood,
        meal_plan_description: newFoodDesc,
        wifi_speed_mbps: Number(newWifi),
        curfew_policy: newCurfew,
        description: newDesc || 'Verified modern student living with zero brokerage.',
        owner_name: user.full_name,
        owner_phone: user.phone || '+91 98765 00000',
        images: [
          {
            id: `img-${Date.now()}`,
            hostel_id: '',
            storage_path: newImageUrl,
            caption: 'Main entrance and spacious room',
            display_order: 1
          }
        ],
        room_types: [
          {
            id: `rt-${Date.now()}-1`,
            hostel_id: '',
            room_name: 'Single AC Room',
            sharing_capacity: 1,
            monthly_rent: Number(newMaxRent),
            available_beds: 2,
            total_beds: 8,
            air_conditioned: true,
          },
          {
            id: `rt-${Date.now()}-2`,
            hostel_id: '',
            room_name: 'Double Sharing AC',
            sharing_capacity: 2,
            monthly_rent: Number(newMinRent),
            available_beds: 4,
            total_beds: 16,
            air_conditioned: true,
          }
        ]
      });

      setAddSuccess(true);
      setTimeout(() => {
        setAddSuccess(false);
        setActiveTab('listings');
      }, 2000);
    } finally {
      setAddingListing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Metrics */}
        <div className="bg-[#0F172A] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4B26]/20 text-[#FF4B26] text-xs font-bold border border-[#FF4B26]/30">
              <Building2 className="w-3.5 h-3.5" />
              OWNER PORTAL
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              {user.full_name || 'Property Owner'}
            </h1>
            <p className="text-xs text-slate-400">
              Manage your hostel listings, live room bed inventory, and student visit requests without brokerage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('add_property')}
              className="px-4 py-2.5 bg-[#FF4B26] hover:bg-[#E03713] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Add New Hostel
            </button>
            <button
              onClick={onNavigateHome}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              View Public Website
            </button>
          </div>
        </div>

        {/* Real Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setActiveTab('listings')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'listings' ? 'bg-white border-[#FF4B26] shadow-sm' : 'bg-white border-[#EDE8DF]'
            }`}
          >
            <span className="text-xs font-bold text-slate-500 uppercase">My Properties</span>
            <div className="mt-2 text-2xl font-black text-slate-900 font-heading">
              {hostels.length}
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('inventory')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'inventory' ? 'bg-white border-[#FF4B26] shadow-sm' : 'bg-white border-[#EDE8DF]'
            }`}
          >
            <span className="text-xs font-bold text-slate-500 uppercase">Available Beds</span>
            <div className="mt-2 text-2xl font-black text-emerald-600 font-heading">
              {availableBeds} <span className="text-xs font-normal text-slate-400">/ {totalBeds} total</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('enquiries')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'enquiries' ? 'bg-white border-[#FF4B26] shadow-sm' : 'bg-white border-[#EDE8DF]'
            }`}
          >
            <span className="text-xs font-bold text-slate-500 uppercase">Student Enquiries</span>
            <div className="mt-2 text-2xl font-black text-[#FF4B26] font-heading">
              {enquiries.length}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#EDE8DF] bg-white">
            <span className="text-xs font-bold text-slate-500 uppercase">Commission Saved</span>
            <div className="mt-2 text-2xl font-black text-slate-900 font-heading">
              ₹0 <span className="text-xs text-emerald-600 font-semibold">(100% Free)</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EDE8DF] gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 cursor-pointer ${
              activeTab === 'listings' ? 'text-[#FF4B26] border-b-2 border-[#FF4B26]' : 'text-slate-600'
            }`}
          >
            Property Listings ({hostels.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 cursor-pointer ${
              activeTab === 'inventory' ? 'text-[#FF4B26] border-b-2 border-[#FF4B26]' : 'text-slate-600'
            }`}
          >
            Bed & Room Inventory
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`pb-3 cursor-pointer ${
              activeTab === 'enquiries' ? 'text-[#FF4B26] border-b-2 border-[#FF4B26]' : 'text-slate-600'
            }`}
          >
            Student Enquiries ({enquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('add_property')}
            className={`pb-3 cursor-pointer ${
              activeTab === 'add_property' ? 'text-[#FF4B26] border-b-2 border-[#FF4B26]' : 'text-slate-600'
            }`}
          >
            + Add New Listing
          </button>
        </div>

        {/* Tab 1: Listings */}
        {activeTab === 'listings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.map((h) => (
              <div
                key={h.id}
                className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm hover:border-[#FF4B26]/30 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-16/10">
                  <img src={h.images[0]?.storage_path} alt={h.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold uppercase">
                      {h.listing_status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-white text-[10px] font-bold ${
                      h.verification_status === 'verified' ? 'bg-emerald-600' : 'bg-amber-600'
                    }`}>
                      {h.verification_status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-[#FF4B26] uppercase">
                      {h.locality}, {h.city}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base font-heading">
                      {h.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {h.nearest_college_or_hub}
                    </p>
                  </div>

                  <div className="text-xs font-black text-slate-900">
                    ₹{h.monthly_rent_min.toLocaleString('en-IN')} - ₹{h.monthly_rent_max.toLocaleString('en-IN')}/mo
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedHostelForInventory(h);
                        setActiveTab('inventory');
                      }}
                      className="text-xs text-[#FF4B26] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Bed className="w-3.5 h-3.5" /> Manage Beds
                    </button>

                    <span className="text-xs text-slate-500">
                      {h.room_types.reduce((s, r) => s + r.available_beds, 0)} beds left
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Bed Inventory Manager */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Live Bed & Room Inventory Manager
                </h3>
                <p className="text-xs text-slate-500">
                  Update vacant beds instantly so students see 100% accurate room availability
                </p>
              </div>

              {/* Property Select dropdown if owner has multiple */}
              {hostels.length > 1 && (
                <select
                  value={selectedHostelForInventory?.id}
                  onChange={(e) => {
                    const found = hostels.find(h => h.id === e.target.value);
                    if (found) setSelectedHostelForInventory(found);
                  }}
                  className="p-2 bg-slate-50 border border-[#EDE8DF] rounded-xl text-xs font-bold text-slate-900"
                >
                  {hostels.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              )}
            </div>

            {selectedHostelForInventory ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4 font-bold">Room Name</th>
                      <th className="py-3 px-4 font-bold">Sharing</th>
                      <th className="py-3 px-4 font-bold">Monthly Rent</th>
                      <th className="py-3 px-4 font-bold">AC Status</th>
                      <th className="py-3 px-4 font-bold">Available Beds</th>
                      <th className="py-3 px-4 font-bold">Total Beds</th>
                      <th className="py-3 px-4 font-bold">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedHostelForInventory.room_types.map((room) => (
                      <tr key={room.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{room.room_name}</td>
                        <td className="py-3.5 px-4 text-slate-600">{room.sharing_capacity} Person</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">₹{room.monthly_rent.toLocaleString('en-IN')}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            room.air_conditioned ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {room.air_conditioned ? 'Air Conditioned' : 'Non-AC'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold">
                          <span className={room.available_beds > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                            {room.available_beds} Vacant
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{room.total_beds}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleBedChange(selectedHostelForInventory.id, room.id, Math.max(0, room.available_beds - 1))}
                              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                              title="Decrease vacant beds"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold text-slate-800">{room.available_beds}</span>
                            <button
                              onClick={() => handleBedChange(selectedHostelForInventory.id, room.id, Math.min(room.total_beds, room.available_beds + 1))}
                              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                              title="Increase vacant beds"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No properties available yet.</p>
            )}
          </div>
        )}

        {/* Tab 3: Student Enquiries */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Incoming Student Enquiries ({enquiries.length})
              </h3>
              <p className="text-xs text-slate-500">
                Contact students directly, confirm visit appointments, and update status
              </p>
            </div>

            {enquiries.length > 0 ? (
              <div className="space-y-4">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-5 rounded-2xl border border-[#EDE8DF] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-[#FF4B26]">
                          {enq.hostel_name} • {enq.room_type_name || 'Room'}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 font-heading">
                          Student: {enq.student_name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Phone: <a href={`tel:${enq.student_phone}`} className="text-[#FF4B26] font-semibold">{enq.student_phone || 'Provided upon enquiry'}</a> • Email: {enq.student_email || 'N/A'}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-bold text-[10px] uppercase">
                          {enq.status}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">Move-in: {enq.move_in_date}</p>
                      </div>
                    </div>

                    {enq.message && (
                      <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs text-slate-600">
                        <span className="font-bold text-slate-800">Student message: </span>
                        {enq.message}
                      </div>
                    )}

                    {enq.owner_response && (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                        <span className="font-bold">Your response: </span>
                        {enq.owner_response}
                      </div>
                    )}

                    {/* Response Controls */}
                    {activeEnquiryId === enq.id ? (
                      <div className="p-4 bg-white rounded-xl border border-[#EDE8DF] space-y-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setResponseStatus('visit_scheduled')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                              responseStatus === 'visit_scheduled' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            Confirm Visit Time
                          </button>
                          <button
                            type="button"
                            onClick={() => setResponseStatus('accepted')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                              responseStatus === 'accepted' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            Accept & Hold Bed
                          </button>
                          <button
                            type="button"
                            onClick={() => setResponseStatus('declined')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                              responseStatus === 'declined' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            Decline
                          </button>
                        </div>

                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="e.g. Yes! Room is available. You are welcome to visit tomorrow at 4:00 PM. Please call me on arrival."
                          rows={2}
                          className="w-full p-2.5 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl focus:outline-none"
                        />

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setActiveEnquiryId(null)}
                            className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSendResponse(enq.id)}
                            className="px-4 py-1.5 bg-[#FF4B26] hover:bg-[#E03713] text-white text-xs font-bold rounded-lg flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" /> Send to Student
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setActiveEnquiryId(enq.id);
                            setResponseText(enq.owner_response || '');
                          }}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          {enq.owner_response ? 'Update Response' : 'Reply & Schedule Visit'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500">
                No active student enquiries for your listings yet.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Add New Property Wizard */}
        {activeTab === 'add_property' && (
          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                List a New Student Hostel or PG
              </h3>
              <p className="text-xs text-slate-500">
                Fill in the details below. Our team verifies the listing before it goes live.
              </p>
            </div>

            {addSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Property submitted successfully for administrative verification!
              </div>
            )}

            <form onSubmit={handleAddPropertySubmit} className="space-y-6">
              {/* Section 1: Basic Property Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                  1. Basic Property Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Property Name *</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Royal Oxford Student Residence"
                      className="w-full p-2.5 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl focus:outline-none focus:border-[#FF4B26]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Property Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl font-medium"
                    >
                      <option value="hostel">Student Hostel</option>
                      <option value="pg">Paying Guest (PG)</option>
                      <option value="co_living">Co-Living Space</option>
                      <option value="flat">Student Flat</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender Policy</label>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value as any)}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl font-medium"
                    >
                      <option value="boys">Boys Only</option>
                      <option value="girls">Girls Only</option>
                      <option value="co_living">Co-living / Mixed</option>
                      <option value="unisex">Unisex Wings</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target City</label>
                    <select
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl font-medium"
                    >
                      <option value="Kota">Kota (Rajasthan)</option>
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Pune">Pune</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Jaipur">Jaipur</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Address & Proximity */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                  2. Address & Campus Proximity
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
                    <input
                      type="text"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="e.g. Plot 15, Sector B, Kunhari"
                      className="w-full p-2.5 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Locality / Sector *</label>
                    <input
                      type="text"
                      value={newLocality}
                      onChange={(e) => setNewLocality(e.target.value)}
                      placeholder="e.g. Landmark City"
                      className="w-full p-2.5 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nearest College or Coaching Hub</label>
                  <input
                    type="text"
                    value={newNearCollege}
                    onChange={(e) => setNewNearCollege(e.target.value)}
                    placeholder="e.g. Allen Samyak (250m) & Motion IIT"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Section 3: Pricing & Deposit */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                  3. Pricing & Security Deposit
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Min Monthly Rent (₹)</label>
                    <input
                      type="number"
                      value={newMinRent}
                      onChange={(e) => setNewMinRent(Number(e.target.value))}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Max Monthly Rent (₹)</label>
                    <input
                      type="number"
                      value={newMaxRent}
                      onChange={(e) => setNewMaxRent(Number(e.target.value))}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Security Deposit (₹)</label>
                    <input
                      type="number"
                      value={newDeposit}
                      onChange={(e) => setNewDeposit(Number(e.target.value))}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Photo URL */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                  4. Property Image
                </h4>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Photo URL (or Unsplash sample)</label>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-[#EDE8DF] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={addingListing}
                  className="px-6 py-3 bg-[#FF4B26] hover:bg-[#E03713] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  {addingListing ? 'Submitting Property...' : 'Submit Property for Verification'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
