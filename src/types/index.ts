export type UserRole = 'student' | 'owner' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  college_or_company?: string;
  created_at: string;
  updated_at: string;
}

export interface OwnerProfile {
  id: string;
  user_id: string;
  business_name?: string;
  contact_phone: string;
  business_address?: string;
  identity_review_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

export type PropertyType = 'hostel' | 'pg' | 'co_living' | 'flat';
export type GenderPolicy = 'boys' | 'girls' | 'co_living' | 'unisex';
export type ListingStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'archived';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface RoomType {
  id: string;
  hostel_id: string;
  room_name: string;
  sharing_capacity: number; // 1 = Single, 2 = Double, 3 = Triple, 4+
  monthly_rent: number;
  available_beds: number;
  total_beds: number;
  air_conditioned: boolean;
  attached_washroom?: boolean;
  description?: string;
}

export interface HostelImage {
  id: string;
  hostel_id: string;
  storage_path: string;
  caption?: string;
  display_order: number;
}

export interface Hostel {
  id: string;
  owner_id: string;
  owner_name?: string;
  owner_phone?: string;
  name: string;
  slug: string;
  description: string;
  property_type: PropertyType;
  gender_policy: GenderPolicy;
  address_line: string;
  locality: string;
  city: string;
  state: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  distance_to_college_km?: number;
  nearest_college_or_hub: string;
  monthly_rent_min: number;
  monthly_rent_max: number;
  security_deposit: number;
  electricity_policy: 'Inclusive' | 'Separate Meter' | 'Fixed Surcharge';
  electricity_charge?: string;
  food_available: boolean;
  meal_plan_description?: string;
  food_type?: 'vegetarian' | 'non_vegetarian' | 'both' | 'none';
  wifi_available: boolean;
  wifi_speed_mbps?: number;
  ac_available: boolean;
  laundry_available: boolean;
  power_backup: boolean;
  housekeeping_available?: boolean;
  gym_available?: boolean;
  parking_available?: boolean;
  attached_washroom_available?: boolean;
  security_features: string[]; // e.g. ['24/7 Guard', 'Biometric Lock', 'CCTV Cameras']
  curfew_policy?: string; // e.g. "10:30 PM" or "No Curfew"
  visitor_policy?: string;
  cancellation_policy?: string;
  pay_at_property_enabled?: boolean;
  advance_percentage_required?: number; // e.g. 10 (token), 20, 50, 100
  pay_at_property_rules?: string;
  listing_status: ListingStatus;
  verification_status: VerificationStatus;
  published_at?: string;
  created_at: string;
  updated_at: string;
  images: HostelImage[];
  room_types: RoomType[];
  // Aggregates (calculated from stored reviews):
  average_rating?: number;
  total_reviews?: number;
}

export type EnquiryStatus = 
  | 'submitted' 
  | 'viewed' 
  | 'responded' 
  | 'visit_scheduled' 
  | 'accepted' 
  | 'declined' 
  | 'cancelled';

export interface Enquiry {
  id: string;
  student_id: string;
  student_name: string;
  student_phone?: string;
  student_email?: string;
  hostel_id: string;
  hostel_name: string;
  hostel_locality: string;
  hostel_city: string;
  room_type_id?: string;
  room_type_name?: string;
  move_in_date: string;
  expected_duration_months: number;
  message?: string;
  status: EnquiryStatus;
  owner_response?: string;
  visit_date_time?: string;
  conversation_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  hostel_id: string;
  rating: number; // 1-5 overall
  review_title?: string;
  review_text: string;
  // Category sub-ratings (1-5)
  cleanliness_rating?: number;
  location_rating?: number;
  facilities_rating?: number;
  safety_rating?: number;
  value_for_money_rating?: number;
  // Verified stay indicator
  is_verified_stay?: boolean;
  booking_id?: string;
  stay_duration?: string;
  room_type_name?: string;
  moderation_status: 'pending' | 'published' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface ReviewReport {
  id: string;
  review_id: string;
  hostel_id: string;
  reporter_id: string;
  reporter_name: string;
  reason: 'inappropriate' | 'spam' | 'false_info' | 'harassment' | 'other';
  notes?: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'enquiry_update' | 'visit_scheduled' | 'verification' | 'welcome' | 'booking_confirmed' | 'payment_received' | 'message_received';
  title: string;
  message: string;
  related_entity_type?: string;
  related_entity_id?: string;
  read_at?: string | null;
  created_at: string;
}

export interface SearchFilterState {
  category: 'all' | PropertyType | 'boys' | 'girls';
  query: string;
  city: string;
  locality?: string;
  maxBudget: number;
  minBudget: number;
  sharingType: number | 'all'; // 1, 2, 3, 4+
  gender: 'all' | GenderPolicy;
  amenities?: string[];
  acOnly: boolean;
  foodIncluded: boolean;
  foodPreference?: 'all' | 'veg' | 'non_veg' | 'none';
  wifiIncluded: boolean;
  powerBackup: boolean;
  laundryAvailable?: boolean;
  attachedWashroom?: boolean;
  gymAvailable?: boolean;
  parkingAvailable?: boolean;
  noCurfew: boolean;
  visitorsAllowed?: boolean;
  availableOnly?: boolean;
  stayDuration?: 'all' | 'short_term' | 'medium_term' | 'long_term';
  minRating?: number; // 0, 3.5, 4.0, 4.5
  moveInDate?: string;
  sortBy: 'recommended' | 'price_low' | 'price_high' | 'rating' | 'availability' | 'newest';
}

// Module 2: Communication Models
export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: 'student' | 'owner' | 'admin';
  sender_name: string;
  sender_avatar?: string;
  text: string;
  created_at: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  hostel_id: string;
  hostel_name: string;
  hostel_locality: string;
  hostel_city?: string;
  hostel_image?: string;
  student_id: string;
  student_name: string;
  student_avatar?: string;
  student_phone?: string;
  student_email?: string;
  owner_id: string;
  owner_name: string;
  owner_phone?: string;
  last_message: string;
  last_message_at: string;
  student_unread: number;
  owner_unread: number;
  enquiry_id?: string;
  booking_id?: string;
  created_at: string;
}

// Module 3: Booking & Payment Models
export type BookingStatus = 
  | 'pending_confirmation' 
  | 'awaiting_payment'
  | 'confirmed' 
  | 'cancelled' 
  | 'completed' 
  | 'rejected';

export type PaymentStatus = 
  | 'not_initiated'
  | 'pending'
  | 'successful'
  | 'failed'
  | 'refund_pending'
  | 'refunded'
  | 'unpaid'
  | 'paid';

export type PaymentMethodType = 
  | 'upi' 
  | 'card' 
  | 'netbanking' 
  | 'wallet' 
  | 'emi' 
  | 'pay_at_property';

export interface Booking {
  id: string;
  booking_reference: string; // e.g. HBX-BK-89302
  student_id: string;
  student_name: string;
  student_phone: string;
  student_email: string;
  owner_id: string;
  owner_name?: string;
  owner_phone?: string;
  hostel_id: string;
  hostel_name: string;
  hostel_slug: string;
  hostel_locality: string;
  hostel_city: string;
  hostel_image?: string;
  room_type_id: string;
  room_name: string;
  sharing_capacity: number;
  move_in_date: string;
  stay_duration_months: number;
  occupants_count: number;
  monthly_rent: number;
  security_deposit: number;
  advance_rent: number;
  platform_fee: number; // 0 (Zero Brokerage Guarantee)
  total_amount: number;
  booking_advance_amount: number; // Amount payable now
  remaining_balance_amount: number; // Amount due at property / later
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method_selected?: PaymentMethodType;
  payment_id?: string;
  order_id?: string;
  check_in_code?: string;
  bed_number?: string;
  cancellation_reason?: string;
  special_requests?: string;
  hold_expires_at?: string; // 15-minute room hold lock
  terms_acknowledged?: boolean;
  cancellation_acknowledged?: boolean;
  payment_terms_acknowledged?: boolean;
  confirmed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  booking_id: string;
  booking_reference: string;
  student_id: string;
  student_name: string;
  student_email: string;
  hostel_id: string;
  hostel_name: string;
  amount: number;
  currency: string;
  gateway: 'razorpay' | 'pay_at_property';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  status: 'captured' | 'successful' | 'failed' | 'pending' | 'refund_pending' | 'refunded';
  method: PaymentMethodType;
  method_details?: {
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
  amount_paid_now: number;
  amount_due_at_property: number;
  is_simulation?: boolean;
  gateway_fee?: number;
  invoice_number: string; // e.g. INV-2026-0849
  receipt_url?: string;
  created_at: string;
}
