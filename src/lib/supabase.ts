import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Hostel, 
  RoomType, 
  Enquiry, 
  Review, 
  ReviewReport,
  UserProfile, 
  NotificationItem, 
  SearchFilterState,
  Booking,
  PaymentTransaction,
  Conversation,
  ChatMessage
} from '../types';
import { 
  INITIAL_HOSTELS, 
  INITIAL_REVIEWS, 
  INITIAL_BOOKINGS, 
  INITIAL_PAYMENTS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_MESSAGES 
} from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local persistence storage keys
const STORAGE_KEYS = {
  HOSTELS: 'habitux_db_hostels_v3',
  ENQUIRIES: 'habitux_db_enquiries_v3',
  REVIEWS: 'habitux_db_reviews_v3',
  REVIEW_REPORTS: 'habitux_db_review_reports_v3',
  FAVORITES: 'habitux_db_favorites_v3',
  USER: 'habitux_db_current_user_v3',
  NOTIFICATIONS: 'habitux_db_notifications_v3',
  BOOKINGS: 'habitux_db_bookings_v3',
  PAYMENTS: 'habitux_db_payments_v3',
  CONVERSATIONS: 'habitux_db_conversations_v3',
  MESSAGES: 'habitux_db_messages_v3',
};

// Initial state helpers
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing ${key} to storage:`, err);
  }
}

function removeStored(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`Error removing ${key} from storage:`, err);
  }
}

// Ensure default data exists
if (!localStorage.getItem(STORAGE_KEYS.HOSTELS)) {
  setStored(STORAGE_KEYS.HOSTELS, INITIAL_HOSTELS);
}
if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
  setStored(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
}
if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
  setStored(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
}
if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
  setStored(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
}
if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
  setStored(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
}
if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
  setStored(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
}

// Default mock user profile
export const DEFAULT_STUDENT_USER: UserProfile = {
  id: 'usr-student-demo',
  full_name: 'Priyanshu Roy',
  email: 'priyanshu.student@habitux.in',
  phone: '+91 98765 43210',
  role: 'student',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  college_or_company: 'Delhi University / Hansraj',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Habitux Unified Data API
 * Interfaces with Supabase when configured, with seamless, persistent local state fallback.
 */
export const HabituxAPI = {
  isConfigured: () => isSupabaseConfigured,

  // --- AUTH ---
  getCurrentUser: async (): Promise<UserProfile | null> => {
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return null;
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        return profile || null;
      } catch (err) {
        console.error('Supabase getSession error:', err);
      }
    }
    return getStored<UserProfile | null>(STORAGE_KEYS.USER, null);
  },

  signIn: async (email: string, role: 'student' | 'owner' | 'admin' = 'student'): Promise<UserProfile> => {
    const stored = getStored<UserProfile | null>(STORAGE_KEYS.USER, null);
    if (stored && stored.email.toLowerCase() === email.toLowerCase()) {
      return stored;
    }

    const newUser: UserProfile = {
      id: role === 'student' ? 'usr-student-demo' : role === 'owner' ? 'owner-001' : 'usr-admin-demo',
      full_name: role === 'owner' 
        ? 'Rajesh Verma (Hostel Owner)' 
        : role === 'admin' 
        ? 'Habitux Verification Admin' 
        : 'Priyanshu Roy',
      email,
      phone: role === 'owner' ? '+91 98290 12345' : '+91 98765 43210',
      role,
      avatar_url: role === 'owner' 
        ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setStored(STORAGE_KEYS.USER, newUser);
    return newUser;
  },

  signUp: async (profile: Partial<UserProfile> & { password?: string }): Promise<UserProfile> => {
    const newUser: UserProfile = {
      id: profile.role === 'owner' ? 'owner-001' : `usr-${Date.now()}`,
      full_name: profile.full_name || (profile.role === 'owner' ? 'Rajesh Verma (Hostel Owner)' : 'Student Resident'),
      email: profile.email || 'student@habitux.in',
      phone: profile.phone || '+91 98765 43210',
      role: profile.role || 'student',
      avatar_url: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      college_or_company: profile.college_or_company || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setStored(STORAGE_KEYS.USER, newUser);
    return newUser;
  },

  signOut: async (): Promise<void> => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    removeStored(STORAGE_KEYS.USER);
  },

  updateProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    const user = getStored<UserProfile | null>(STORAGE_KEYS.USER, null);
    if (!user) throw new Error('Not logged in');
    const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
    setStored(STORAGE_KEYS.USER, updated);
    return updated;
  },

  // --- MODULE 1: HOSTELS & ADVANCED SEARCH ---
  getHostels: async (filters?: Partial<SearchFilterState>): Promise<Hostel[]> => {
    let list = getStored<Hostel[]>(STORAGE_KEYS.HOSTELS, INITIAL_HOSTELS);

    if (!filters) return list;

    // Location / City
    if (filters.city && filters.city !== 'All Cities') {
      const cityLower = filters.city.toLowerCase().trim();
      list = list.filter(h => 
        h.city.toLowerCase().includes(cityLower) || 
        h.locality.toLowerCase().includes(cityLower) ||
        h.nearest_college_or_hub.toLowerCase().includes(cityLower)
      );
    }

    // Locality specific filter
    if (filters.locality && filters.locality.trim()) {
      const locLower = filters.locality.toLowerCase().trim();
      list = list.filter(h => 
        h.locality.toLowerCase().includes(locLower) ||
        h.address_line.toLowerCase().includes(locLower)
      );
    }

    // Text Query (name, locality, city, landmark, description)
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(h => 
        h.name.toLowerCase().includes(q) ||
        h.locality.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.nearest_college_or_hub.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q)
      );
    }

    // Category / Accommodation type
    if (filters.category && filters.category !== 'all') {
      if (filters.category === 'boys') {
        list = list.filter(h => h.gender_policy === 'boys');
      } else if (filters.category === 'girls') {
        list = list.filter(h => h.gender_policy === 'girls');
      } else {
        list = list.filter(h => h.property_type === filters.category);
      }
    }

    // Gender Policy
    if (filters.gender && filters.gender !== 'all') {
      list = list.filter(h => h.gender_policy === filters.gender);
    }

    // Budget Min & Max
    if (filters.maxBudget && filters.maxBudget > 0) {
      list = list.filter(h => h.monthly_rent_min <= filters.maxBudget!);
    }
    if (filters.minBudget && filters.minBudget > 0) {
      list = list.filter(h => h.monthly_rent_max >= filters.minBudget!);
    }

    // Room Sharing (1, 2, 3, 4+)
    if (filters.sharingType && filters.sharingType !== 'all') {
      const sharing = Number(filters.sharingType);
      if (sharing === 4) {
        list = list.filter(h => h.room_types.some(rt => rt.sharing_capacity >= 4));
      } else {
        list = list.filter(h => h.room_types.some(rt => rt.sharing_capacity === sharing));
      }
    }

    // Amenities checks
    if (filters.acOnly) {
      list = list.filter(h => h.ac_available);
    }
    if (filters.foodIncluded) {
      list = list.filter(h => h.food_available);
    }
    if (filters.wifiIncluded) {
      list = list.filter(h => h.wifi_available);
    }
    if (filters.powerBackup) {
      list = list.filter(h => h.power_backup);
    }
    if (filters.laundryAvailable) {
      list = list.filter(h => h.laundry_available);
    }
    if (filters.attachedWashroom) {
      list = list.filter(h => h.room_types.some(rt => rt.attached_washroom));
    }
    if (filters.gymAvailable) {
      list = list.filter(h => h.gym_available || h.security_features.some(f => f.toLowerCase().includes('gym')));
    }
    if (filters.parkingAvailable) {
      list = list.filter(h => h.parking_available || h.description.toLowerCase().includes('parking'));
    }

    // Food Preference (veg, non_veg, none)
    if (filters.foodPreference && filters.foodPreference !== 'all') {
      if (filters.foodPreference === 'none') {
        list = list.filter(h => !h.food_available);
      } else if (filters.foodPreference === 'veg') {
        list = list.filter(h => 
          h.food_available && 
          (!h.meal_plan_description || h.meal_plan_description.toLowerCase().includes('veg'))
        );
      } else if (filters.foodPreference === 'non_veg') {
        list = list.filter(h => 
          h.food_available && 
          (h.food_type === 'non_vegetarian' || h.food_type === 'both' || h.meal_plan_description?.toLowerCase().includes('non-veg') || h.meal_plan_description?.toLowerCase().includes('egg'))
        );
      }
    }

    // Rules
    if (filters.noCurfew) {
      list = list.filter(h => h.curfew_policy?.toLowerCase().includes('no curfew'));
    }
    if (filters.visitorsAllowed) {
      list = list.filter(h => !h.visitor_policy?.toLowerCase().includes('no visitor'));
    }

    // Available Beds Only Toggle
    if (filters.availableOnly) {
      list = list.filter(h => h.room_types.some(rt => rt.available_beds > 0));
    }

    // Minimum Rating (e.g. 3.5+, 4.0+, 4.5+)
    if (filters.minRating && filters.minRating > 0) {
      list = list.filter(h => (h.average_rating || 0) >= filters.minRating!);
    }

    // Sorting
    if (filters.sortBy === 'price_low') {
      list.sort((a, b) => a.monthly_rent_min - b.monthly_rent_min);
    } else if (filters.sortBy === 'price_high') {
      list.sort((a, b) => b.monthly_rent_max - a.monthly_rent_max);
    } else if (filters.sortBy === 'rating') {
      list.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
    } else if (filters.sortBy === 'availability') {
      const countAvail = (h: Hostel) => h.room_types.reduce((sum, r) => sum + r.available_beds, 0);
      list.sort((a, b) => countAvail(b) - countAvail(a));
    } else if (filters.sortBy === 'newest') {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  },

  getHostelBySlug: async (slug: string): Promise<Hostel | null> => {
    const list = getStored<Hostel[]>(STORAGE_KEYS.HOSTELS, INITIAL_HOSTELS);
    return list.find(h => h.slug === slug || h.id === slug) || null;
  },

  getHostelById: async (id: string): Promise<Hostel | null> => {
    const list = getStored<Hostel[]>(STORAGE_KEYS.HOSTELS, INITIAL_HOSTELS);
    return list.find(h => h.id === id || h.slug === id) || null;
  },

  createHostel: async (newHostel: Partial<Hostel>): Promise<Hostel> => {
    const list = getStored<Hostel[]>(STORAGE_KEYS.HOSTELS, INITIAL_HOSTELS);
    const id = `hostel-${Date.now()}`;
    const slug = `${(newHostel.name || 'hostel').toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`;
    
    const hostel: Hostel = {
      id,
      slug,
      owner_id: newHostel.owner_id || 'owner-001',
      owner_name: newHostel.owner_name || 'Property Owner',
      owner_phone: newHostel.owner_phone || '+91 98765 00000',
      name: newHostel.name || 'Untitled Hostel',
      description: newHostel.description || 'Verified student accommodation with zero brokerage.',
      property_type: newHostel.property_type || 'hostel',
      gender_policy: newHostel.gender_policy || 'boys',
      address_line: newHostel.address_line || 'Sector 10',
      locality: newHostel.locality || 'Campus Area',
      city: newHostel.city || 'Delhi',
      state: newHostel.state || 'Delhi',
      postal_code: newHostel.postal_code || '110001',
      distance_to_college_km: newHostel.distance_to_college_km || 0.5,
      nearest_college_or_hub: newHostel.nearest_college_or_hub || 'Metro Station & College Campus',
      monthly_rent_min: newHostel.monthly_rent_min || 8000,
      monthly_rent_max: newHostel.monthly_rent_max || 15000,
      security_deposit: newHostel.security_deposit || 5000,
      electricity_policy: newHostel.electricity_policy || 'Inclusive',
      electricity_charge: newHostel.electricity_charge || 'Included in rent',
      food_available: newHostel.food_available ?? true,
      meal_plan_description: newHostel.meal_plan_description || 'Breakfast & Dinner included daily',
      wifi_available: newHostel.wifi_available ?? true,
      wifi_speed_mbps: newHostel.wifi_speed_mbps || 100,
      ac_available: newHostel.ac_available ?? true,
      laundry_available: newHostel.laundry_available ?? true,
      power_backup: newHostel.power_backup ?? true,
      security_features: newHostel.security_features || ['CCTV', 'Biometric', 'Security Guard'],
      curfew_policy: newHostel.curfew_policy || '10:00 PM',
      visitor_policy: newHostel.visitor_policy || 'Guests allowed in visitor lounge',
      cancellation_policy: newHostel.cancellation_policy || '15 days notice',
      listing_status: 'pending_review',
      verification_status: 'pending',
      images: newHostel.images?.length ? newHostel.images : [
        {
          id: `img-${Date.now()}`,
          hostel_id: id,
          storage_path: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
          caption: 'Spacious verified room',
          display_order: 1
        }
      ],
      room_types: newHostel.room_types?.length ? newHostel.room_types : [
        {
          id: `rt-${Date.now()}-1`,
          hostel_id: id,
          room_name: 'Standard Double Sharing',
          sharing_capacity: 2,
          monthly_rent: newHostel.monthly_rent_min || 8500,
          available_beds: 4,
          total_beds: 12,
          air_conditioned: true,
          attached_washroom: true,
        }
      ],
      average_rating: 5.0,
      total_reviews: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    list.unshift(hostel);
    setStored(STORAGE_KEYS.HOSTELS, list);
    return hostel;
  },

  updateHostel: async (hostelId: string, updates: Partial<Hostel>): Promise<Hostel> => {
    const list = getStored<Hostel[]>(STORAGE_KEYS.HOSTELS, INITIAL_HOSTELS);
    const index = list.findIndex(h => h.id === hostelId);
    if (index === -1) throw new Error('Hostel not found');
    list[index] = { ...list[index], ...updates, updated_at: new Date().toISOString() };
    setStored(STORAGE_KEYS.HOSTELS, list);
    return list[index];
  },

  deleteHostel: async (hostelId: string): Promise<void> => {
    const list = getStored<Hostel[]>(STORAGE_KEYS.HOSTELS, INITIAL_HOSTELS);
    const updated = list.filter(h => h.id !== hostelId);
    setStored(STORAGE_KEYS.HOSTELS, updated);
  },

  updateRoomAvailability: async (hostelId: string, roomTypeId: string, availableBeds: number, totalBeds?: number): Promise<void> => {
    const list = getStored<Hostel[]>(STORAGE_KEYS.HOSTELS, INITIAL_HOSTELS);
    const hostel = list.find(h => h.id === hostelId);
    if (!hostel) return;
    const room = hostel.room_types.find(r => r.id === roomTypeId);
    if (!room) return;
    room.available_beds = Math.max(0, availableBeds);
    if (totalBeds !== undefined) {
      room.total_beds = Math.max(room.available_beds, totalBeds);
    }
    setStored(STORAGE_KEYS.HOSTELS, list);
  },

  // --- MODULE 1: REVIEWS & RATINGS ---
  getReviews: async (hostelId: string, sortBy: 'newest' | 'highest' | 'lowest' = 'newest'): Promise<Review[]> => {
    const list = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    let reviews = list.filter(r => r.hostel_id === hostelId && r.moderation_status === 'published');

    if (sortBy === 'highest') {
      reviews.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      reviews.sort((a, b) => a.rating - b.rating);
    } else {
      reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return reviews;
  },

  getRatingBreakdown: async (hostelId: string) => {
    const list = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const published = list.filter(r => r.hostel_id === hostelId && r.moderation_status === 'published');
    const total = published.length;

    const distribution = {
      5: published.filter(r => r.rating === 5).length,
      4: published.filter(r => r.rating === 4).length,
      3: published.filter(r => r.rating === 3).length,
      2: published.filter(r => r.rating === 2).length,
      1: published.filter(r => r.rating === 1).length,
    };

    const avg = total > 0 ? (published.reduce((sum, r) => sum + r.rating, 0) / total) : 0;

    // Sub-category averages
    const calcCatAvg = (key: keyof Review) => {
      const withScore = published.filter(r => typeof r[key] === 'number');
      if (withScore.length === 0) return 4.8;
      const sum = withScore.reduce((s, r) => s + (r[key] as number), 0);
      return Number((sum / withScore.length).toFixed(1));
    };

    return {
      averageRating: Number(avg.toFixed(1)),
      totalReviews: total,
      distribution: {
        5: { count: distribution[5], percentage: total ? Math.round((distribution[5] / total) * 100) : 0 },
        4: { count: distribution[4], percentage: total ? Math.round((distribution[4] / total) * 100) : 0 },
        3: { count: distribution[3], percentage: total ? Math.round((distribution[3] / total) * 100) : 0 },
        2: { count: distribution[2], percentage: total ? Math.round((distribution[2] / total) * 100) : 0 },
        1: { count: distribution[1], percentage: total ? Math.round((distribution[1] / total) * 100) : 0 },
      },
      categoryAverages: {
        cleanliness: calcCatAvg('cleanliness_rating'),
        location: calcCatAvg('location_rating'),
        facilities: calcCatAvg('facilities_rating'),
        safety: calcCatAvg('safety_rating'),
        valueForMoney: calcCatAvg('value_for_money_rating'),
      }
    };
  },

  hasVerifiedStay: async (userId: string, hostelId: string): Promise<boolean> => {
    const bookings = getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    return bookings.some(b => 
      b.student_id === userId && 
      b.hostel_id === hostelId && 
      (b.status === 'confirmed' || b.status === 'completed') &&
      b.payment_status === 'paid'
    );
  },

  submitReview: async (review: Omit<Review, 'id' | 'moderation_status' | 'created_at' | 'updated_at'>): Promise<Review> => {
    const list = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    
    // Check if user has verified booking for this hostel
    const isVerified = await HabituxAPI.hasVerifiedStay(review.user_id, review.hostel_id);

    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      is_verified_stay: isVerified,
      moderation_status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    list.unshift(newRev);
    setStored(STORAGE_KEYS.REVIEWS, list);

    // Update aggregate on hostel
    const hostels = getStored<Hostel[]>(STORAGE_KEYS.HOSTELS, INITIAL_HOSTELS);
    const h = hostels.find(x => x.id === review.hostel_id);
    if (h) {
      const hostelReviews = list.filter(x => x.hostel_id === review.hostel_id && x.moderation_status === 'published');
      const avg = hostelReviews.reduce((sum, r) => sum + r.rating, 0) / hostelReviews.length;
      h.average_rating = Number(avg.toFixed(1));
      h.total_reviews = hostelReviews.length;
      setStored(STORAGE_KEYS.HOSTELS, hostels);
    }

    return newRev;
  },

  updateReview: async (reviewId: string, updates: Partial<Review>): Promise<Review> => {
    const list = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const index = list.findIndex(r => r.id === reviewId);
    if (index === -1) throw new Error('Review not found');

    list[index] = {
      ...list[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.REVIEWS, list);

    // Recalculate hostel aggregates
    const hostelId = list[index].hostel_id;
    const hostels = getStored<Hostel[]>(STORAGE_KEYS.HOSTELS, INITIAL_HOSTELS);
    const h = hostels.find(x => x.id === hostelId);
    if (h) {
      const hostelReviews = list.filter(x => x.hostel_id === hostelId && x.moderation_status === 'published');
      const avg = hostelReviews.reduce((sum, r) => sum + r.rating, 0) / hostelReviews.length;
      h.average_rating = Number(avg.toFixed(1));
      h.total_reviews = hostelReviews.length;
      setStored(STORAGE_KEYS.HOSTELS, hostels);
    }

    return list[index];
  },

  deleteReview: async (reviewId: string): Promise<void> => {
    const list = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const rev = list.find(r => r.id === reviewId);
    if (!rev) return;
    const hostelId = rev.hostel_id;

    const updated = list.filter(r => r.id !== reviewId);
    setStored(STORAGE_KEYS.REVIEWS, updated);

    // Recalculate hostel aggregates
    const hostels = getStored<Hostel[]>(STORAGE_KEYS.HOSTELS, INITIAL_HOSTELS);
    const h = hostels.find(x => x.id === hostelId);
    if (h) {
      const hostelReviews = updated.filter(x => x.hostel_id === hostelId && x.moderation_status === 'published');
      const avg = hostelReviews.length > 0 ? (hostelReviews.reduce((sum, r) => sum + r.rating, 0) / hostelReviews.length) : 5.0;
      h.average_rating = Number(avg.toFixed(1));
      h.total_reviews = hostelReviews.length;
      setStored(STORAGE_KEYS.HOSTELS, hostels);
    }
  },

  reportReview: async (reportData: Omit<ReviewReport, 'id' | 'status' | 'created_at'>): Promise<ReviewReport> => {
    const reports = getStored<ReviewReport[]>(STORAGE_KEYS.REVIEW_REPORTS, []);
    const newReport: ReviewReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    reports.unshift(newReport);
    setStored(STORAGE_KEYS.REVIEW_REPORTS, reports);
    return newReport;
  },

  getAllReports: async (): Promise<ReviewReport[]> => {
    return getStored<ReviewReport[]>(STORAGE_KEYS.REVIEW_REPORTS, [
      {
        id: 'rep-1',
        review_id: 'rev-001',
        hostel_id: 'hostel-001',
        reporter_id: 'usr-student-demo',
        reporter_name: 'Priyanshu Roy',
        reason: 'spam',
        notes: 'Suspected duplicate entry from competitor',
        status: 'pending',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      }
    ]);
  },

  updateReportStatus: async (reportId: string, status: ReviewReport['status']): Promise<void> => {
    const reports = getStored<ReviewReport[]>(STORAGE_KEYS.REVIEW_REPORTS, []);
    const rep = reports.find(r => r.id === reportId);
    if (rep) {
      rep.status = status;
      setStored(STORAGE_KEYS.REVIEW_REPORTS, reports);
    }
  },

  getAllReviews: async (): Promise<Review[]> => {
    return getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  },

  updateReviewModeration: async (reviewId: string, status: 'published' | 'pending' | 'rejected'): Promise<void> => {
    const list = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const rev = list.find(r => r.id === reviewId);
    if (rev) {
      rev.moderation_status = status;
      rev.updated_at = new Date().toISOString();
      setStored(STORAGE_KEYS.REVIEWS, list);
    }
  },

  // --- MODULE 2: DIRECT COMMUNICATION & MESSAGING ---
  getConversations: async (userId: string, role: 'student' | 'owner'): Promise<Conversation[]> => {
    const convs = getStored<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    if (role === 'student') {
      const studentList = convs.filter(c => c.student_id === userId || userId === 'usr-student-demo');
      return studentList.length > 0 ? studentList : convs;
    }
    // For owner: return conversations for their hostels or if primary demo owner, return all conversations
    const ownerList = convs.filter(c => c.owner_id === userId || c.owner_id === 'owner-001');
    return ownerList.length > 0 ? ownerList : convs;
  },

  getConversationById: async (conversationId: string): Promise<Conversation | null> => {
    const convs = getStored<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    return convs.find(c => c.id === conversationId) || null;
  },

  getOrCreateConversation: async (params: {
    hostelId: string;
    studentId: string;
    studentName: string;
    studentPhone?: string;
    studentEmail?: string;
    ownerId: string;
    initialMessage?: string;
    enquiryId?: string;
    bookingId?: string;
  }): Promise<Conversation> => {
    const convs = getStored<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    let existing = convs.find(c => c.hostel_id === params.hostelId && c.student_id === params.studentId);

    if (existing) {
      if (params.initialMessage) {
        await HabituxAPI.sendMessage({
          conversationId: existing.id,
          senderId: params.studentId,
          senderRole: 'student',
          senderName: params.studentName,
          text: params.initialMessage,
        });
      }
      return existing;
    }

    const hostel = await HabituxAPI.getHostelById(params.hostelId);
    const convId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: convId,
      hostel_id: params.hostelId,
      hostel_name: hostel?.name || 'Habitux Hostel',
      hostel_locality: hostel?.locality || 'Campus Hub',
      hostel_city: hostel?.city || 'City',
      hostel_image: hostel?.images[0]?.storage_path,
      student_id: params.studentId,
      student_name: params.studentName,
      student_phone: params.studentPhone,
      student_email: params.studentEmail,
      owner_id: params.ownerId || hostel?.owner_id || 'owner-001',
      owner_name: hostel?.owner_name || 'Rajesh Verma (Owner)',
      owner_phone: hostel?.owner_phone || '+91 98290 12345',
      last_message: params.initialMessage || 'Enquiry started',
      last_message_at: new Date().toISOString(),
      student_unread: 0,
      owner_unread: params.initialMessage ? 1 : 0,
      enquiry_id: params.enquiryId,
      booking_id: params.bookingId,
      created_at: new Date().toISOString(),
    };

    convs.unshift(newConv);
    setStored(STORAGE_KEYS.CONVERSATIONS, convs);

    if (params.initialMessage) {
      const messages = getStored<ChatMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
      messages.push({
        id: `msg-${Date.now()}`,
        conversation_id: convId,
        sender_id: params.studentId,
        sender_role: 'student',
        sender_name: params.studentName,
        text: params.initialMessage,
        created_at: new Date().toISOString(),
        read: false,
      });
      setStored(STORAGE_KEYS.MESSAGES, messages);
    }

    // Broadcast real-time update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('habitux_data_updated', { detail: { type: 'conversation_created', conversation: newConv } }));
    }

    return newConv;
  },

  getMessages: async (conversationId: string): Promise<ChatMessage[]> => {
    const messages = getStored<ChatMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    return messages
      .filter(m => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },

  sendMessage: async (params: {
    conversationId: string;
    senderId: string;
    senderRole: 'student' | 'owner' | 'admin';
    senderName: string;
    senderAvatar?: string;
    text: string;
  }): Promise<ChatMessage> => {
    const messages = getStored<ChatMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: params.conversationId,
      sender_id: params.senderId,
      sender_role: params.senderRole,
      sender_name: params.senderName,
      sender_avatar: params.senderAvatar,
      text: params.text.trim(),
      created_at: new Date().toISOString(),
      read: false,
    };

    messages.push(newMsg);
    setStored(STORAGE_KEYS.MESSAGES, messages);

    // Update conversation preview
    const convs = getStored<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    const conv = convs.find(c => c.id === params.conversationId);
    if (conv) {
      conv.last_message = params.text.trim();
      conv.last_message_at = newMsg.created_at;
      if (params.senderRole === 'student') {
        conv.owner_unread += 1;
      } else {
        conv.student_unread += 1;
      }
      setStored(STORAGE_KEYS.CONVERSATIONS, convs);
    }

    // Broadcast real-time update event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('habitux_data_updated', { 
        detail: { type: 'message', message: newMsg, conversationId: params.conversationId } 
      }));
    }

    return newMsg;
  },

  markMessagesAsRead: async (conversationId: string, readerRole: 'student' | 'owner'): Promise<void> => {
    const convs = getStored<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    const conv = convs.find(c => c.id === conversationId);
    if (conv) {
      if (readerRole === 'student') {
        conv.student_unread = 0;
      } else {
        conv.owner_unread = 0;
      }
      setStored(STORAGE_KEYS.CONVERSATIONS, convs);
    }

    const messages = getStored<ChatMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    let changed = false;
    messages.forEach(m => {
      if (m.conversation_id === conversationId) {
        if (readerRole === 'student' && m.sender_role !== 'student') {
          m.read = true;
          changed = true;
        } else if (readerRole === 'owner' && m.sender_role === 'student') {
          m.read = true;
          changed = true;
        }
      }
    });
    if (changed) {
      setStored(STORAGE_KEYS.MESSAGES, messages);
    }
  },

  // --- MODULE 3: HOSTEL SELECTION, BOOKINGS & MULTI-METHOD PAYMENTS ---
  createBookingOrder: async (data: {
    studentId: string;
    studentName: string;
    studentPhone: string;
    studentEmail: string;
    hostelId: string;
    roomTypeId: string;
    moveInDate: string;
    stayDurationMonths: number;
    occupantsCount?: number;
    specialRequests?: string;
  }): Promise<{ booking: Booking; razorpayOrder: any }> => {
    const hostel = await HabituxAPI.getHostelById(data.hostelId);
    if (!hostel) throw new Error('Hostel not found');

    const room = hostel.room_types.find(r => r.id === data.roomTypeId);
    if (!room) throw new Error('Selected room type not found');

    if (room.available_beds <= 0) {
      throw new Error('Sorry, no beds are currently available for this room type');
    }

    const bookingId = `bk-${Date.now()}`;
    const bookingRef = `HBX-BK-${Math.floor(10000 + Math.random() * 90000)}`;
    const advanceRent = room.monthly_rent;
    const securityDeposit = hostel.security_deposit || 5000;
    const totalAmount = advanceRent + securityDeposit;

    // Determine advance payable now vs remaining at check-in
    let advancePayableNow = totalAmount;
    let remainingPayableLater = 0;

    if (hostel.pay_at_property_enabled && hostel.advance_percentage_required && hostel.advance_percentage_required < 100) {
      advancePayableNow = Math.round((totalAmount * hostel.advance_percentage_required) / 100);
      remainingPayableLater = totalAmount - advancePayableNow;
    }

    // 15-minute temporary room hold lock
    const holdExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const booking: Booking = {
      id: bookingId,
      booking_reference: bookingRef,
      student_id: data.studentId,
      student_name: data.studentName,
      student_phone: data.studentPhone,
      student_email: data.studentEmail,
      owner_id: hostel.owner_id,
      owner_name: hostel.owner_name,
      owner_phone: hostel.owner_phone,
      hostel_id: hostel.id,
      hostel_name: hostel.name,
      hostel_slug: hostel.slug,
      hostel_locality: hostel.locality,
      hostel_city: hostel.city,
      hostel_image: hostel.images[0]?.storage_path,
      room_type_id: room.id,
      room_name: room.room_name,
      sharing_capacity: room.sharing_capacity,
      move_in_date: data.moveInDate,
      stay_duration_months: data.stayDurationMonths || 11,
      occupants_count: data.occupantsCount || 1,
      monthly_rent: room.monthly_rent,
      security_deposit: securityDeposit,
      advance_rent: advanceRent,
      platform_fee: 0, // Zero Brokerage Guarantee!
      total_amount: totalAmount,
      booking_advance_amount: advancePayableNow,
      remaining_balance_amount: remainingPayableLater,
      status: 'pending_confirmation',
      payment_status: 'not_initiated',
      hold_expires_at: holdExpiresAt,
      terms_acknowledged: false,
      cancellation_acknowledged: false,
      payment_terms_acknowledged: false,
      special_requests: data.specialRequests,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store pending booking
    const bookings = getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    bookings.unshift(booking);
    setStored(STORAGE_KEYS.BOOKINGS, bookings);

    // Razorpay Order Representation
    const razorpayOrder = {
      id: `order_HBX_${bookingRef.replace('-', '_')}`,
      entity: 'order',
      amount: advancePayableNow * 100, // paise
      currency: 'INR',
      receipt: bookingRef,
      status: 'created',
      notes: {
        hostel_name: hostel.name,
        room_name: room.room_name,
        booking_id: bookingId,
      }
    };

    return { booking, razorpayOrder };
  },

  confirmBookingAndProceedToPayment: async (params: {
    bookingId: string;
    termsAcknowledged: boolean;
    cancellationAcknowledged: boolean;
    paymentTermsAcknowledged: boolean;
  }): Promise<Booking> => {
    const bookings = getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const booking = bookings.find(b => b.id === params.bookingId);
    if (!booking) throw new Error('Booking not found');

    // Check hold expiration
    if (booking.hold_expires_at && new Date(booking.hold_expires_at).getTime() < Date.now()) {
      booking.status = 'cancelled';
      booking.cancellation_reason = 'Reservation hold expired (15 minutes limit exceeded)';
      setStored(STORAGE_KEYS.BOOKINGS, bookings);
      throw new Error('Your 15-minute room hold has expired. Please select the hostel again to reserve.');
    }

    // Verify room availability on server
    const hostel = await HabituxAPI.getHostelById(booking.hostel_id);
    if (!hostel) throw new Error('Hostel listing no longer active');
    const room = hostel.room_types.find(r => r.id === booking.room_type_id);
    if (!room || room.available_beds <= 0) {
      throw new Error('This room type was just reserved by another student. Please select an alternate sharing option.');
    }

    if (!params.termsAcknowledged || !params.cancellationAcknowledged || !params.paymentTermsAcknowledged) {
      throw new Error('Please acknowledge the booking terms, house rules, and cancellation policy to proceed.');
    }

    // Advance to awaiting payment
    booking.status = 'awaiting_payment';
    booking.terms_acknowledged = params.termsAcknowledged;
    booking.cancellation_acknowledged = params.cancellationAcknowledged;
    booking.payment_terms_acknowledged = params.paymentTermsAcknowledged;
    booking.confirmed_at = new Date().toISOString();
    booking.updated_at = new Date().toISOString();

    setStored(STORAGE_KEYS.BOOKINGS, bookings);
    return booking;
  },

  updateBookingDetails: async (params: {
    bookingId: string;
    roomTypeId: string;
    moveInDate: string;
    stayDurationMonths: number;
    occupantsCount: number;
  }): Promise<Booking> => {
    const bookings = getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const booking = bookings.find(b => b.id === params.bookingId);
    if (!booking) throw new Error('Booking not found');

    const hostel = await HabituxAPI.getHostelById(booking.hostel_id);
    if (!hostel) throw new Error('Hostel not found');

    const room = hostel.room_types.find(r => r.id === params.roomTypeId);
    if (!room) throw new Error('Selected room type not found');

    if (room.available_beds <= 0 && room.id !== booking.room_type_id) {
      throw new Error('Selected room type has no available beds');
    }

    const monthlyRent = room.monthly_rent;
    const securityDeposit = hostel.security_deposit || 5000;
    const totalAmount = monthlyRent + securityDeposit;

    let advancePayableNow = totalAmount;
    let remainingPayableLater = 0;
    if (hostel.pay_at_property_enabled && hostel.advance_percentage_required && hostel.advance_percentage_required < 100) {
      advancePayableNow = Math.round((totalAmount * hostel.advance_percentage_required) / 100);
      remainingPayableLater = totalAmount - advancePayableNow;
    }

    booking.room_type_id = room.id;
    booking.room_name = room.room_name;
    booking.sharing_capacity = room.sharing_capacity;
    booking.move_in_date = params.moveInDate;
    booking.stay_duration_months = params.stayDurationMonths;
    booking.occupants_count = params.occupantsCount;
    booking.monthly_rent = monthlyRent;
    booking.security_deposit = securityDeposit;
    booking.advance_rent = monthlyRent;
    booking.total_amount = totalAmount;
    booking.booking_advance_amount = advancePayableNow;
    booking.remaining_balance_amount = remainingPayableLater;
    // Refresh 15-minute hold on edit
    booking.hold_expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    booking.updated_at = new Date().toISOString();

    setStored(STORAGE_KEYS.BOOKINGS, bookings);
    return booking;
  },

  processPayment: async (params: {
    bookingId: string;
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet' | 'emi' | 'pay_at_property';
    methodDetails?: {
      upi_app?: string;
      upi_id?: string;
      card_network?: string;
      card_last4?: string;
      card_holder_name?: string;
      bank_name?: string;
      wallet_provider?: string;
      emi_tenure_months?: number;
      emi_monthly_amount?: number;
    };
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  }): Promise<{ success: boolean; booking: Booking; payment: PaymentTransaction }> => {
    const bookings = getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const booking = bookings.find(b => b.id === params.bookingId);
    if (!booking) throw new Error('Booking not found');

    // Prevent double payment
    if (booking.status === 'confirmed' && (booking.payment_status === 'successful' || booking.payment_status === 'paid')) {
      const payments = getStored<PaymentTransaction[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
      const existingPay = payments.find(p => p.booking_id === booking.id);
      if (existingPay) {
        return { success: true, booking, payment: existingPay };
      }
    }

    const paymentId = `pay-tx-${Date.now()}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const isPayAtProperty = params.paymentMethod === 'pay_at_property';

    const rzpPayId = params.razorpayPaymentId || `pay_rzp_${Math.random().toString(36).substring(2, 10)}`;
    const rzpOrderId = params.razorpayOrderId || `order_HBX_${booking.booking_reference.replace('-', '_')}`;
    const rzpSig = params.razorpaySignature || `sig_hmac_${Math.random().toString(36).substring(2, 14)}`;

    // Update booking:
    // Decoupled statuses:
    // Booking: 'confirmed'
    // Payment: 'successful' (if online) or 'pending' (if pay at property)
    booking.status = 'confirmed';
    booking.payment_status = isPayAtProperty ? 'pending' : 'successful';
    booking.payment_method_selected = params.paymentMethod;
    booking.payment_id = isPayAtProperty ? undefined : rzpPayId;
    booking.order_id = rzpOrderId;
    booking.check_in_code = `HBX-${Math.floor(1000 + Math.random() * 9000)}`;
    booking.bed_number = `Room ${Math.floor(100 + Math.random() * 400)} • Bed ${String.fromCharCode(65 + Math.floor(Math.random() * booking.sharing_capacity))}`;
    booking.updated_at = new Date().toISOString();
    setStored(STORAGE_KEYS.BOOKINGS, bookings);

    // Deduct available bed in room inventory
    const hostels = getStored<Hostel[]>(STORAGE_KEYS.HOSTELS, INITIAL_HOSTELS);
    const hostel = hostels.find(h => h.id === booking.hostel_id);
    if (hostel) {
      const room = hostel.room_types.find(r => r.id === booking.room_type_id);
      if (room && room.available_beds > 0) {
        room.available_beds = Math.max(0, room.available_beds - 1);
        setStored(STORAGE_KEYS.HOSTELS, hostels);
      }
    }

    const amountPaidNow = isPayAtProperty ? 0 : booking.booking_advance_amount;
    const amountDueAtProperty = isPayAtProperty ? booking.total_amount : booking.remaining_balance_amount;

    // Create payment transaction
    const payments = getStored<PaymentTransaction[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    const paymentTx: PaymentTransaction = {
      id: paymentId,
      booking_id: booking.id,
      booking_reference: booking.booking_reference,
      student_id: booking.student_id,
      student_name: booking.student_name,
      student_email: booking.student_email,
      hostel_id: booking.hostel_id,
      hostel_name: booking.hostel_name,
      amount: booking.total_amount,
      amount_paid_now: amountPaidNow,
      amount_due_at_property: amountDueAtProperty,
      currency: 'INR',
      gateway: isPayAtProperty ? 'pay_at_property' : 'razorpay',
      razorpay_order_id: isPayAtProperty ? undefined : rzpOrderId,
      razorpay_payment_id: isPayAtProperty ? undefined : rzpPayId,
      razorpay_signature: isPayAtProperty ? undefined : rzpSig,
      status: isPayAtProperty ? 'pending' : 'successful',
      method: params.paymentMethod,
      method_details: params.methodDetails,
      invoice_number: invoiceNumber,
      is_simulation: !import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY_ID === 'rzp_test_placeholder',
      created_at: new Date().toISOString(),
    };
    payments.unshift(paymentTx);
    setStored(STORAGE_KEYS.PAYMENTS, payments);

    // Notifications
    const notifs = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    notifs.unshift({
      id: `notif-${Date.now()}-1`,
      user_id: booking.student_id,
      type: 'booking_confirmed',
      title: isPayAtProperty ? 'Booking Confirmed (Pay at Property)' : 'Booking & Payment Confirmed!',
      message: isPayAtProperty
        ? `Your bed at ${booking.hostel_name} is reserved! Pay ₹${booking.total_amount.toLocaleString('en-IN')} upon check-in. Passcode: ${booking.check_in_code}`
        : `Your booking at ${booking.hostel_name} is confirmed! Bed allocated: ${booking.bed_number}. Passcode: ${booking.check_in_code}`,
      related_entity_type: 'booking',
      related_entity_id: booking.id,
      read_at: null,
      created_at: new Date().toISOString(),
    });

    notifs.unshift({
      id: `notif-${Date.now()}-2`,
      user_id: booking.owner_id,
      type: 'payment_received',
      title: isPayAtProperty ? 'New Booking (Pay at Property)' : 'New Advance Booking & Payment',
      message: `${booking.student_name} booked ${booking.room_name} at ${booking.hostel_name}. Move-in: ${booking.move_in_date}. Method: ${params.paymentMethod.toUpperCase()}`,
      related_entity_type: 'booking',
      related_entity_id: booking.id,
      read_at: null,
      created_at: new Date().toISOString(),
    });
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);

    // Start/update conversation between student and owner
    await HabituxAPI.getOrCreateConversation({
      hostelId: booking.hostel_id,
      studentId: booking.student_id,
      studentName: booking.student_name,
      studentPhone: booking.student_phone,
      studentEmail: booking.student_email,
      ownerId: booking.owner_id,
      initialMessage: isPayAtProperty
        ? `Booking confirmed (#${booking.booking_reference}) under Pay at Property. Move-in date: ${booking.move_in_date}. Room: ${booking.room_name}. Balance due on arrival: ₹${booking.total_amount.toLocaleString('en-IN')}.`
        : `Booking confirmed (#${booking.booking_reference})! Paid ₹${amountPaidNow.toLocaleString('en-IN')}. Move-in date: ${booking.move_in_date}. Room: ${booking.room_name}.`,
      bookingId: booking.id,
    });

    return { success: true, booking, payment: paymentTx };
  },

  // Backwards compatibility wrapper for old calls
  verifyAndCompletePayment: async (params: {
    bookingId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature?: string;
    paymentMethod?: 'upi' | 'card' | 'netbanking';
  }): Promise<{ success: boolean; booking: Booking; payment: PaymentTransaction }> => {
    return HabituxAPI.processPayment({
      bookingId: params.bookingId,
      paymentMethod: params.paymentMethod || 'upi',
      razorpayOrderId: params.razorpayOrderId,
      razorpayPaymentId: params.razorpayPaymentId,
      razorpaySignature: params.razorpaySignature,
    });
  },

  updateHostelPaymentSettings: async (hostelId: string, settings: {
    payAtPropertyEnabled: boolean;
    advancePercentageRequired: number;
    payAtPropertyRules?: string;
  }): Promise<Hostel> => {
    const hostels = getStored<Hostel[]>(STORAGE_KEYS.HOSTELS, INITIAL_HOSTELS);
    const hostel = hostels.find(h => h.id === hostelId);
    if (!hostel) throw new Error('Hostel not found');
    hostel.pay_at_property_enabled = settings.payAtPropertyEnabled;
    hostel.advance_percentage_required = settings.advancePercentageRequired;
    if (settings.payAtPropertyRules) {
      hostel.pay_at_property_rules = settings.payAtPropertyRules;
    }
    hostel.updated_at = new Date().toISOString();
    setStored(STORAGE_KEYS.HOSTELS, hostels);
    return hostel;
  },

  ownerCollectPropertyPayment: async (bookingId: string): Promise<Booking> => {
    const bookings = getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    booking.payment_status = 'successful';
    booking.remaining_balance_amount = 0;
    booking.updated_at = new Date().toISOString();
    setStored(STORAGE_KEYS.BOOKINGS, bookings);

    // Update payment transaction
    const payments = getStored<PaymentTransaction[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    const payment = payments.find(p => p.booking_id === bookingId);
    if (payment) {
      payment.status = 'successful';
      payment.amount_paid_now = booking.total_amount;
      payment.amount_due_at_property = 0;
      setStored(STORAGE_KEYS.PAYMENTS, payments);
    }

    return booking;
  },

  getStudentBookings: async (studentId: string): Promise<Booking[]> => {
    const list = getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    return list.filter(b => b.student_id === studentId);
  },

  getOwnerBookings: async (ownerId: string): Promise<Booking[]> => {
    const list = getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    return list.filter(b => b.owner_id === ownerId);
  },

  getBookingById: async (bookingId: string): Promise<Booking | null> => {
    const list = getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    return list.find(b => b.id === bookingId || b.booking_reference === bookingId) || null;
  },

  cancelBooking: async (bookingId: string, reason?: string): Promise<Booking> => {
    const list = getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const booking = list.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    booking.status = 'cancelled';
    booking.cancellation_reason = reason || 'Cancelled by student';
    booking.updated_at = new Date().toISOString();
    setStored(STORAGE_KEYS.BOOKINGS, list);

    // Restore available bed
    const hostels = getStored<Hostel[]>(STORAGE_KEYS.HOSTELS, INITIAL_HOSTELS);
    const hostel = hostels.find(h => h.id === booking.hostel_id);
    if (hostel) {
      const room = hostel.room_types.find(r => r.id === booking.room_type_id);
      if (room) {
        room.available_beds = Math.min(room.total_beds, room.available_beds + 1);
        setStored(STORAGE_KEYS.HOSTELS, hostels);
      }
    }

    return booking;
  },

  updateBookingCheckIn: async (bookingId: string, bedNumber: string): Promise<Booking> => {
    const list = getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const booking = list.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    booking.bed_number = bedNumber;
    booking.status = 'completed';
    booking.updated_at = new Date().toISOString();
    setStored(STORAGE_KEYS.BOOKINGS, list);
    return booking;
  },

  getStudentPayments: async (studentId: string): Promise<PaymentTransaction[]> => {
    const payments = getStored<PaymentTransaction[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    return payments.filter(p => p.student_id === studentId);
  },

  getPaymentById: async (paymentId: string): Promise<PaymentTransaction | null> => {
    const payments = getStored<PaymentTransaction[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    return payments.find(p => p.id === paymentId || p.invoice_number === paymentId || p.razorpay_payment_id === paymentId) || null;
  },

  // --- FAVORITES ---
  getFavorites: async (userId: string): Promise<string[]> => {
    const favsMap = getStored<Record<string, string[]>>(STORAGE_KEYS.FAVORITES, {});
    return favsMap[userId] || [];
  },

  toggleFavorite: async (userId: string, hostelId: string): Promise<boolean> => {
    const favsMap = getStored<Record<string, string[]>>(STORAGE_KEYS.FAVORITES, {});
    const current = favsMap[userId] || [];
    let updated: string[];
    let isAdded = false;

    if (current.includes(hostelId)) {
      updated = current.filter(id => id !== hostelId);
    } else {
      updated = [...current, hostelId];
      isAdded = true;
    }

    favsMap[userId] = updated;
    setStored(STORAGE_KEYS.FAVORITES, favsMap);
    return isAdded;
  },

  // --- ENQUIRIES ---
  submitEnquiry: async (enquiryData: Omit<Enquiry, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<Enquiry> => {
    const list = getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    const enqId = `enq-${Date.now()}`;
    const hostel = await HabituxAPI.getHostelById(enquiryData.hostel_id);
    const targetOwnerId = hostel?.owner_id || 'owner-001';
    
    // Also create/link a direct conversation thread with the owner
    const conv = await HabituxAPI.getOrCreateConversation({
      hostelId: enquiryData.hostel_id,
      studentId: enquiryData.student_id,
      studentName: enquiryData.student_name,
      studentPhone: enquiryData.student_phone,
      studentEmail: enquiryData.student_email,
      ownerId: targetOwnerId,
      initialMessage: enquiryData.message || `Scheduled visit & enquiry for ${enquiryData.room_type_name || 'Room'} on target move-in date: ${enquiryData.move_in_date}`,
      enquiryId: enqId,
    });

    const newEnquiry: Enquiry = {
      ...enquiryData,
      id: enqId,
      status: 'submitted',
      conversation_id: conv.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    list.unshift(newEnquiry);
    setStored(STORAGE_KEYS.ENQUIRIES, list);

    // Broadcast real-time update event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('habitux_data_updated', { 
        detail: { type: 'enquiry_created', enquiry: newEnquiry, conversationId: conv.id } 
      }));
    }

    return newEnquiry;
  },

  getStudentEnquiries: async (studentId: string): Promise<Enquiry[]> => {
    const list = getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    const studentList = list.filter(e => e.student_id === studentId || studentId === 'usr-student-demo');
    return studentList.length > 0 ? studentList : list;
  },

  getOwnerEnquiries: async (ownerId: string): Promise<Enquiry[]> => {
    const hostels = getStored<Hostel[]>(STORAGE_KEYS.HOSTELS, INITIAL_HOSTELS);
    const ownerHostels = hostels.filter(h => h.owner_id === ownerId || ownerId === 'owner-001');
    const ownerHostelIds = new Set(ownerHostels.map(h => h.id));
    const enquiries = getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    const matched = enquiries.filter(e => ownerHostelIds.has(e.hostel_id));
    return (matched.length > 0 || ownerHostels.length > 0) ? matched : enquiries;
  },

  updateEnquiryStatus: async (enquiryId: string, status: Enquiry['status'], ownerResponse?: string, visitDateTime?: string): Promise<Enquiry> => {
    const list = getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    const index = list.findIndex(e => e.id === enquiryId);
    if (index === -1) throw new Error('Enquiry not found');

    list[index] = {
      ...list[index],
      status,
      owner_response: ownerResponse ?? list[index].owner_response,
      visit_date_time: visitDateTime ?? list[index].visit_date_time,
      updated_at: new Date().toISOString(),
    };

    setStored(STORAGE_KEYS.ENQUIRIES, list);

    // If there is an active conversation, post the response in chat too
    if (list[index].conversation_id && (ownerResponse || visitDateTime)) {
      const msgText = visitDateTime 
        ? `[Visit Appointment Confirmed for ${visitDateTime}] ${ownerResponse || 'Looking forward to meeting you at the property!'}`
        : `Update on your enquiry (${status}): ${ownerResponse}`;

      await HabituxAPI.sendMessage({
        conversationId: list[index].conversation_id!,
        senderId: 'owner-001',
        senderRole: 'owner',
        senderName: 'Rajesh Verma (Owner)',
        text: msgText,
      });
    }

    // Broadcast real-time update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('habitux_data_updated', { 
        detail: { type: 'enquiry_updated', enquiry: list[index] } 
      }));
    }

    return list[index];
  },

  // --- NOTIFICATIONS ---
  getNotifications: async (userId: string): Promise<NotificationItem[]> => {
    const list = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-1',
        user_id: userId,
        type: 'welcome',
        title: 'Welcome to HABITUX!',
        message: 'Explore zero-brokerage verified hostels near your university. Save favorites or schedule free visits directly with owners.',
        read_at: null,
        created_at: new Date().toISOString(),
      }
    ]);
    return list.filter(n => n.user_id === userId);
  },

  markNotificationAsRead: async (notifId: string): Promise<void> => {
    const list = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const notif = list.find(n => n.id === notifId);
    if (notif) {
      notif.read_at = new Date().toISOString();
      setStored(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  },
};
