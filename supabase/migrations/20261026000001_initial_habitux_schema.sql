-- HABITUX Database Schema & Row Level Security (RLS) Policies
-- Migration: 20261026000001_initial_habitux_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table A: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'owner', 'admin')) DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table B: owner_profiles
CREATE TABLE IF NOT EXISTS public.owner_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  contact_phone TEXT NOT NULL,
  business_address TEXT,
  identity_review_status TEXT NOT NULL CHECK (identity_review_status IN ('unverified', 'pending', 'verified', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id)
);

-- Table C: hostels
CREATE TABLE IF NOT EXISTS public.hostels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('hostel', 'pg', 'co_living', 'flat')),
  gender_policy TEXT NOT NULL CHECK (gender_policy IN ('boys', 'girls', 'co_living', 'unisex')),
  address_line TEXT NOT NULL,
  locality TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'India',
  postal_code TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  distance_to_college_km NUMERIC(5, 2),
  nearest_college_or_hub TEXT,
  monthly_rent_min INTEGER NOT NULL CHECK (monthly_rent_min >= 0),
  monthly_rent_max INTEGER NOT NULL CHECK (monthly_rent_max >= monthly_rent_min),
  security_deposit INTEGER NOT NULL DEFAULT 0 CHECK (security_deposit >= 0),
  electricity_policy TEXT NOT NULL DEFAULT 'Inclusive',
  electricity_charge TEXT,
  food_available BOOLEAN NOT NULL DEFAULT true,
  meal_plan_description TEXT,
  wifi_available BOOLEAN NOT NULL DEFAULT true,
  wifi_speed_mbps INTEGER DEFAULT 100,
  ac_available BOOLEAN NOT NULL DEFAULT false,
  laundry_available BOOLEAN NOT NULL DEFAULT true,
  power_backup BOOLEAN NOT NULL DEFAULT true,
  security_features TEXT[] DEFAULT ARRAY['CCTV', 'Biometric', 'Security Guard'],
  curfew_policy TEXT DEFAULT '10:00 PM',
  visitor_policy TEXT DEFAULT 'Visitors allowed in common areas until 8:00 PM',
  cancellation_policy TEXT DEFAULT '15-day notice period for deposit refund',
  listing_status TEXT NOT NULL CHECK (listing_status IN ('draft', 'pending_review', 'published', 'rejected', 'archived')) DEFAULT 'pending_review',
  verification_status TEXT NOT NULL CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')) DEFAULT 'unverified',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table D: hostel_images
CREATE TABLE IF NOT EXISTS public.hostel_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table E: room_types
CREATE TABLE IF NOT EXISTS public.room_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  room_name TEXT NOT NULL,
  sharing_capacity INTEGER NOT NULL CHECK (sharing_capacity >= 1),
  monthly_rent INTEGER NOT NULL CHECK (monthly_rent >= 0),
  available_beds INTEGER NOT NULL DEFAULT 1 CHECK (available_beds >= 0),
  total_beds INTEGER NOT NULL DEFAULT 1 CHECK (total_beds >= available_beds),
  air_conditioned BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table F: favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, hostel_id)
);

-- Table G: enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  room_type_id UUID REFERENCES public.room_types(id) ON DELETE SET NULL,
  move_in_date DATE NOT NULL,
  expected_duration_months INTEGER DEFAULT 12,
  message TEXT,
  status TEXT NOT NULL CHECK (status IN ('submitted', 'viewed', 'responded', 'visit_scheduled', 'accepted', 'declined', 'cancelled')) DEFAULT 'submitted',
  owner_response TEXT,
  visit_date_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table H: reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  food_rating INTEGER CHECK (food_rating >= 1 AND food_rating <= 5),
  cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  wifi_rating INTEGER CHECK (wifi_rating >= 1 AND wifi_rating <= 5),
  moderation_status TEXT NOT NULL CHECK (moderation_status IN ('pending', 'published', 'rejected')) DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, hostel_id)
);

-- Table I: review_reports
CREATE TABLE IF NOT EXISTS public.review_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'reviewed', 'dismissed', 'actioned')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table J: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_entity_type TEXT,
  related_entity_id UUID,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table K: listing_verification_events
CREATE TABLE IF NOT EXISTS public.listing_verification_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'unverified', 'flagged')),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for high-performance searches
CREATE INDEX IF NOT EXISTS idx_hostels_city_locality ON public.hostels(city, locality);
CREATE INDEX IF NOT EXISTS idx_hostels_listing_status ON public.hostels(listing_status);
CREATE INDEX IF NOT EXISTS idx_hostels_verification_status ON public.hostels(verification_status);
CREATE INDEX IF NOT EXISTS idx_hostels_rent ON public.hostels(monthly_rent_min, monthly_rent_max);
CREATE INDEX IF NOT EXISTS idx_hostels_owner ON public.hostels(owner_id);
CREATE INDEX IF NOT EXISTS idx_room_types_hostel ON public.room_types(hostel_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_student ON public.enquiries(student_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_hostel ON public.enquiries(hostel_id);
CREATE INDEX IF NOT EXISTS idx_reviews_hostel ON public.reviews(hostel_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_verification_events ENABLE ROW LEVEL SECURITY;

-- 1. Profiles RLS
CREATE POLICY "Public profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Hostels RLS
CREATE POLICY "Public can view published hostels"
  ON public.hostels FOR SELECT
  USING (listing_status = 'published' OR owner_id = auth.uid());

CREATE POLICY "Owners can insert their own hostels"
  ON public.hostels FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own hostels"
  ON public.hostels FOR UPDATE
  USING (auth.uid() = owner_id);

-- 3. Room Types RLS
CREATE POLICY "Anyone can view room types for visible hostels"
  ON public.room_types FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.hostels WHERE hostels.id = room_types.hostel_id AND (hostels.listing_status = 'published' OR hostels.owner_id = auth.uid())
  ));

CREATE POLICY "Owners can manage room types for their hostels"
  ON public.room_types FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.hostels WHERE hostels.id = room_types.hostel_id AND hostels.owner_id = auth.uid()
  ));

-- 4. Favorites RLS
CREATE POLICY "Users can view and manage their own favorites"
  ON public.favorites FOR ALL
  USING (auth.uid() = user_id);

-- 5. Enquiries RLS
CREATE POLICY "Students can view their own enquiries"
  ON public.enquiries FOR SELECT
  USING (auth.uid() = student_id OR EXISTS (
    SELECT 1 FROM public.hostels WHERE hostels.id = enquiries.hostel_id AND hostels.owner_id = auth.uid()
  ));

CREATE POLICY "Students can submit enquiries"
  ON public.enquiries FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Owners can update enquiries for their properties"
  ON public.enquiries FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.hostels WHERE hostels.id = enquiries.hostel_id AND hostels.owner_id = auth.uid()
  ));

-- 6. Reviews RLS
CREATE POLICY "Anyone can view published reviews"
  ON public.reviews FOR SELECT
  USING (moderation_status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Students can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);
