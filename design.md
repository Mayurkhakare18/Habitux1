# HABITUX — System Design & Architecture Specification
**Zero-Brokerage Student Hostel & PG Discovery Platform**

---

## 1. Executive Summary & Product Vision

**Habitux** is a purpose-built student living marketplace designed to eliminate middleman brokerages, misleading photos, and hidden fee structures in Indian collegiate housing. Built for tertiary education hubs (Pune, Kota, Bengaluru, Delhi NCR, Hyderabad, Mumbai, Dehradun, Chennai), Habitux connects prospective student residents directly with verified hostel wardens and PG owners.

### Core Value Propositions
* **Zero Brokerage (0% Commision)**: Students save ₹5,000–₹15,000 in upfront broker commissions on every booking.
* **100% Verified Properties**: Every listing undergoes administrative verification of safety standards, CCTV coverage, biometric access, and gate curfews.
* **Transparent Pricing**: Detailed breakdowns of security deposits, electricity metering policies (inclusive vs separate sub-meter), and 3x daily meal inclusion.
* **Direct Owner Communication**: In-app chat, direct telephone access, and 1-click on-site visit scheduling without intermediary interference.
* **Multi-Hostel Comparison Engine**: Side-by-side evaluation of amenities, curfew rules, distance to university hubs, and monthly rents.

---

## 2. Target Audiences & User Personas

| Persona | Primary Goals | Pain Points Solved |
| :--- | :--- | :--- |
| **Student Resident** <br>*(Undergrad / Postgrad / Aspirant)* | Find safe, affordable accommodation within 2 km of university; compare rents & curfew; schedule free property visits; book verified beds with clear refund policies. | High broker charges, deceptive photos, surprise electricity charges, unfair deposit forfeiture. |
| **Hostel & PG Owner** <br>*(Warden / Property Manager)* | Fill bed vacancies fast; receive qualified student inquiries; coordinate visit slots; manage room inventory and occupancy in real time. | Delayed broker leads, high commission overhead, uncoordinated walk-ins, manual ledger record-keeping. |
| **Platform Administrator** <br>*(Habitux Operations)* | Audit newly submitted listings, review safety certifications, handle dispute reports, ensure platform trust. | Unverified or scam property submissions, inaccurate location markers. |

---

## 3. Information Architecture & Navigation

Habitux utilizes a role-authoritative, persistent layout system. When users log in, they remain within their dedicated operational dashboard context while retaining seamless access to exploratory features.

```
├── Public / Visitor Journey
│   ├── / (Hero, Academic Hubs, Search Console, Toolkit, Value Proposition, FAQs)
│   ├── /hostels (Granular Faceted Search, Instant Filtering & Map)
│   ├── /hostels/:slug (Property Showcase, Room Types, Amenities, Reviews, Direct Action Modals)
│   ├── /compare (Full Side-by-Side Accommodation Evaluation Matrix)
│   ├── /login & /register (Role-based authentication: Student vs Owner)
│   └── /owner/register (Property Manager Onboarding & Zero-Brokerage Agreement)
│
├── Student Portal (/student/*)
│   ├── /student/dashboard (Overview, Active Visits, Saved Bookmarks, Quick Search Hub)
│   ├── /student/explore (In-Dashboard Interactive Stay Search with Embedded Compare)
│   ├── /student/saved (Bookmarked Accommodations with 1-Click Multi-Property Comparison)
│   ├── /student/bookings (Active Reservations, Check-In Passcodes, Payment Receipts)
│   ├── /student/payments (Invoice Ledger & Zero-Brokerage Receipts)
│   ├── /student/messages (Real-Time Direct Messaging with Property Managers)
│   ├── /student/enquiries (On-Site Visit Appointments & Inspection Status)
│   ├── /student/notifications (Real-Time Alerts on Visits & Confirmations)
│   └── /student/profile (Academic ID Verification & Resident Preferences)
│
├── Owner Console (/owner/*)
│   ├── /owner/dashboard (Occupancy Metrics, Inquiries, Pending Visits, Revenue)
│   ├── /owner/listings (Active Properties, 1-Click "Publish Now" / "Pause" Toggles)
│   ├── /owner/listings/new (Instant Listing Creator with Visibility Selector)
│   ├── /owner/listings/:id/edit (Facility Details, Pricing, Rules, Metering Terms)
│   ├── /owner/rooms (Room & Bed Inventory Management)
│   ├── /owner/enquiries (Visit Slot Coordination & Student Follow-Ups)
│   ├── /owner/messages (Real-Time Communication Inbox)
│   ├── /owner/bookings (Reservation Approvals & Student Check-Ins)
│   └── /owner/profile (Hostel Warden Credentials & Contact Numbers)
│
└── Admin Console (/admin/*)
    ├── /admin/dashboard (Ecosystem Metrics, Verification Queue)
    ├── /admin/listings (Hostel Approvals, Rejections, & Document Audits)
    ├── /admin/reviews (Student Rating Moderation)
    └── /admin/reports (Safety & Compliance Flags)
```

---

## 4. Visual Identity & Design System

### 4.1 Color Architecture
The visual system leverages an authentic, warm collegiate tone that avoids generic enterprise styling while signaling trust, safety, and energy.

* **Primary Accent**: `#FF4B26` (Habitux Flame Orange) — used for primary calls to action, badges, and key affordances.
* **Primary Hover / Active**: `#E03713` (Deep Ember)
* **Canvas Background**: `#FAF8F5` (Warm Alabaster / Sandstone White)
* **Surface Containers**: `#FFFFFF` (Pure White) with `#EDE8DF` (Muted Warm Clay Border)
* **Deep Contrast Text**: `#0F172A` (Slate Ink 900)
* **Body & Description Text**: `#475569` (Slate 600)
* **Trust & Verification**: `#059669` (Emerald 600) with `#ECFDF5` (Mint Background)
* **Rating & Highlights**: `#D97706` (Amber 600) with `#FFFBEB`

### 4.2 Typography System
* **Display & Brand Headings**: `Plus Jakarta Sans`, sans-serif (Bold / ExtraBold / Black, tracking-tight).
* **Body & Form Copy**: `Inter`, sans-serif (Regular / Medium / SemiBold, optimized for tabular clarity and mobile legibility).
* **Monospace & Passcodes**: System Monospace for reservation confirmation codes and electricity sub-meter numbers.

### 4.3 UI Constitution & Anti-AI Slop Rules
1. **Zero-Pill Discipline**: Navigation buttons, filter cards, and primary action CTAs use modern rounded rectangles (`rounded-xl` or `rounded-2xl`) rather than cartoonish pill capsules.
2. **Context Preservation**: Students exploring properties or comparing listings never get unintentionally ejected from their dashboard layout to public visitor pages.
3. **No Decorative Placeholders**: All properties display genuine operational specifications: starting monthly rents, deposit amounts, curfew hours, Wi-Fi speeds in Mbps, and electricity terms.
4. **Instant Action Modals**: Visit bookings, inquiries, and side-by-side comparisons operate via responsive sliding drawers and backdrop modals to minimize page disorientations.

---

## 5. Core Feature Specifications

### 5.1 Zero-Brokerage Discovery & Granular Filter Console
* **Hub-Based Quick Strip**: 1-click filtering by major educational hubs (Pune, Kota, Bengaluru, Delhi NCR, Hyderabad, Mumbai, Dehradun, Chennai).
* **Multi-Parameter Search Filters**:
  * Accommodation Category (`Hostel`, `PG`, `Co-Living`, `Student Flat`)
  * Gender Policies (`Boys`, `Girls`, `Co-Living`, `Unisex`)
  * Sharing Capacities (Single, Double, Triple, 4+ Sharing)
  * Budget Sliders (Min ₹2,000 to Max ₹35,000/mo)
  * Food Services (3x daily meal inclusion, Pure Veg certification)
  * Amenities (Air Conditioning, 100+ Mbps Fiber Wi-Fi, 24/7 Heavy Generator Backup, Biometric Access)
  * House Rules (Gate Curfew Time, Visitor Lounge Access)

### 5.2 Multi-Hostel Comparison Engine
* **Card-Level Trigger**: Every hostel card features an instant compare button (`Scale` icon).
* **Floating Persistence Bar**: Selecting 1 to 3 hostels displays an interactive bottom drawer displaying thumbnails and selected count.
* **Side-by-Side Audit Modal**:
  * Monthly Rent Min/Max
  * Refundable Security Deposit
  * Electricity Metering Policy
  * Daily Meal Plan Inclusions
  * Wi-Fi Bandwidth & Generator Power Backup
  * Gate Curfew Time
  * University Proximity
  * Resident Satisfaction Rating

### 5.3 On-Site Visit Scheduling & Real-Time Inquiries
* Students can schedule free on-site inspections choosing their preferred date and time slot (Morning, Afternoon, Evening).
* Direct WhatsApp and call connections to hostel wardens.
* Inquiries are immediately dispatched to the Owner Portal with real-time status tracking (`submitted` → `visit_scheduled` → `completed`).

### 5.4 1-Click Publishing & Owner Listing Lifecycle
* **Instant Listing Mode**: Property owners can choose to publish immediately upon creation (`listing_status = 'published'`).
* **Listing Controls**: Owners can pause or publish their properties anytime from their dashboard with a single click.
* **Room Inventory**: Multi-room configuration specifying air-conditioning, attached bathrooms, total beds, and available vacancy.

---

## 6. Technical Stack & Architecture

### 6.1 Frontend Stack
* **Framework**: React 19 SPA (Single Page Application)
* **Routing**: React Router v7 (`BrowserRouter`, `Routes`, `Route`, `Navigate`)
* **Language**: TypeScript 5.8+ (Strict Type Checking, zero compile warnings)
* **Styling**: Tailwind CSS v4 with `@tailwindcss/vite`
* **Icons**: `lucide-react`
* **Build Tool**: Vite 6 (Fast HMR, optimized production rollup bundles)

### 6.2 Data Persistence & Real-Time Sync
* **Database Engine**: Supabase (PostgreSQL with Row Level Security & Real-Time subscriptions)
* **Fallback Storage**: In-memory and browser localStorage persistence fallback ensuring offline resilience and demo readiness.
* **Auth Layer**: Multi-role authentication context (`AuthContext.tsx`) with student, owner, and administrator role gates.

### 6.3 Relational Entity Model

```sql
-- User Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT CHECK (role IN ('student', 'owner', 'admin')),
  avatar_url TEXT,
  college_or_company TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hostels & PGs
CREATE TABLE hostels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  property_type TEXT CHECK (property_type IN ('hostel', 'pg', 'co_living', 'flat')),
  gender_policy TEXT CHECK (gender_policy IN ('boys', 'girls', 'co_living', 'unisex')),
  city TEXT NOT NULL,
  locality TEXT NOT NULL,
  address_line TEXT,
  nearest_college_or_hub TEXT,
  monthly_rent_min INTEGER NOT NULL,
  monthly_rent_max INTEGER NOT NULL,
  security_deposit INTEGER NOT NULL,
  electricity_policy TEXT,
  food_available BOOLEAN DEFAULT TRUE,
  meal_plan_description TEXT,
  wifi_available BOOLEAN DEFAULT TRUE,
  wifi_speed_mbps INTEGER DEFAULT 100,
  power_backup BOOLEAN DEFAULT TRUE,
  curfew_policy TEXT DEFAULT '10:00 PM',
  listing_status TEXT CHECK (listing_status IN ('draft', 'pending_review', 'published', 'paused', 'rejected', 'archived')),
  verification_status TEXT CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room Inventory
CREATE TABLE room_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
  room_name TEXT NOT NULL,
  sharing_capacity INTEGER NOT NULL,
  monthly_rent INTEGER NOT NULL,
  available_beds INTEGER NOT NULL,
  total_beds INTEGER NOT NULL,
  air_conditioned BOOLEAN DEFAULT FALSE,
  attached_washroom BOOLEAN DEFAULT TRUE
);

-- Inquiries & Scheduled Visits
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES hostels(id),
  student_id UUID NOT NULL REFERENCES profiles(id),
  sharing_type TEXT,
  move_in_date TEXT,
  visit_date_time TEXT,
  message TEXT,
  status TEXT CHECK (status IN ('submitted', 'owner_replied', 'visit_scheduled', 'completed', 'declined', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings & Bed Reservations
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES hostels(id),
  room_type_id UUID NOT NULL REFERENCES room_types(id),
  student_id UUID NOT NULL REFERENCES profiles(id),
  check_in_date TEXT NOT NULL,
  monthly_rent INTEGER NOT NULL,
  deposit_amount INTEGER NOT NULL,
  token_advance_paid INTEGER DEFAULT 0,
  booking_status TEXT CHECK (booking_status IN ('pending_confirmation', 'confirmed', 'cancelled', 'completed')),
  check_in_passcode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. Security, Trust & Compliance

1. **Role-Based Access Control (RBAC)**: Protected routes (`ProtectedRoute.tsx`) strictly guard student, owner, and admin views based on authenticated user tokens.
2. **Zero Brokerage Audit**: Contact forms and payment summaries clearly disclose the zero-brokerage saving to ensure absolute transparency.
3. **Data Sanitization & Validation**: Form schemas for new listings enforce numerical constraints on rent ranges, deposit percentages, and mandatory emergency contact credentials.
4. **Safe Navigation Guarantee**: Internal routes preserve user state; students and owners never land unexpectedly on public pages without explicit intent.

---

## 8. Deployment & Operational Checklist

* **Production Port**: Runs on HTTP port 3000.
* **Full-Stack Execution**: Express static server (`server.js`) with client-side fallback routes for React Router SPA (`/*` → `index.html`).
* **Environment Configuration**: Supabase client variables configured via `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
* **Clean Code & Lint Standards**: 100% TypeScript compile compliance (`tsc --noEmit`), zero unused imports, and zero lint warnings.
