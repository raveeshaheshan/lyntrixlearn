-- =========================================================================
-- LYNTRIX LEARN — SUPABASE POSTGRESQL SCHEMA & MULTI-TENANT RLS POLICIES
-- =========================================================================
-- Copy and paste this script directly into your Supabase Dashboard SQL Editor
-- (https://app.supabase.com/project/_/sql) and click "Run".
-- Safe to re-run multiple times (Idempotent script).
-- =========================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('super_admin', 'teacher', 'student')),
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  index_number TEXT UNIQUE,
  district TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TEACHERS / ACADEMIES (Multi-Tenant Master Registry)
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  subject_category TEXT NOT NULL DEFAULT 'maths',
  subdomain TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  cover_url TEXT,
  rating NUMERIC(3,2) DEFAULT 5.00,
  monthly_fee NUMERIC(10,2) NOT NULL DEFAULT 3500.00,
  bio TEXT,
  bank_name TEXT,
  bank_account_name TEXT,
  bank_account_number TEXT,
  bank_branch TEXT,
  -- SaaS Subscription & Free Trial Management
  subscription_tier TEXT NOT NULL DEFAULT 'Pro Academy' CHECK (subscription_tier IN ('Starter Master', 'Pro Academy', 'Enterprise Titan')),
  subscription_status TEXT NOT NULL DEFAULT 'trialing' CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled', 'suspended', 'pending_approval')),
  trial_started_at TIMESTAMPTZ DEFAULT NOW(),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  subscription_renews_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  saas_monthly_price NUMERIC(10,2) DEFAULT 22500.00,
  is_verified_master BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration safety for existing tables
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'Pro Academy';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'trialing';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days');
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS subscription_renews_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days');
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS saas_monthly_price NUMERIC(10,2) DEFAULT 22500.00;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS is_verified_master BOOLEAN DEFAULT TRUE;

-- 3. BATCHES / CLASSES (e.g. 2025 Theory, 2026 Revision)
CREATE TABLE IF NOT EXISTS public.batches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  grade_year TEXT NOT NULL DEFAULT '2025',
  medium TEXT NOT NULL DEFAULT 'Sinhala Medium',
  schedule TEXT NOT NULL,
  monthly_fee NUMERIC(10,2) NOT NULL DEFAULT 3500.00,
  zoom_link TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LESSONS & VIDEO CLASSROOM (Anti-Piracy Protected Recordings)
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  unit TEXT NOT NULL,
  duration TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  notes_pdf_url TEXT,
  description TEXT,
  views_count INTEGER DEFAULT 0,
  has_quiz BOOLEAN DEFAULT FALSE,
  chapters JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STUDENT ENROLLMENTS & FEE STATUS
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE,
  payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Pending', 'Overdue')),
  paid_date DATE,
  expires_at TIMESTAMPTZ,
  syllabus_progress INTEGER DEFAULT 0,
  attendance_rate INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, batch_id)
);

-- 6. BANK DEPOSIT SLIPS (Approval Queue)
CREATE TABLE IF NOT EXISTS public.bank_slips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_index TEXT NOT NULL,
  student_phone TEXT,
  amount NUMERIC(10,2) NOT NULL,
  bank_name TEXT NOT NULL,
  reference_no TEXT NOT NULL,
  slip_image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  remarks TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

-- Comprehensive Column Migration Safety (Handles all schema versions)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS index_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;

ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS subject_category TEXT NOT NULL DEFAULT 'maths';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 5.00;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS monthly_fee NUMERIC(10,2) NOT NULL DEFAULT 3500.00;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'Pro Academy';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'trialing';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days');
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS subscription_renews_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days');
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS saas_monthly_price NUMERIC(10,2) DEFAULT 22500.00;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS is_verified_master BOOLEAN DEFAULT TRUE;

ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS has_quiz BOOLEAN DEFAULT FALSE;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS chapters JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.bank_slips ADD COLUMN IF NOT EXISTS remarks TEXT;
ALTER TABLE public.bank_slips ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE public.bank_slips ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- 7. QR CODE ATTENDANCE LOGS
CREATE TABLE IF NOT EXISTS public.attendance_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_index TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  scan_type TEXT DEFAULT 'Hall Scanner',
  status TEXT NOT NULL DEFAULT 'Present',
  fee_status TEXT NOT NULL DEFAULT 'Paid'
);

-- 8. TUTE COURIER DELIVERIES
CREATE TABLE IF NOT EXISTS public.tute_deliveries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE,
  pack_title TEXT NOT NULL,
  courier_name TEXT NOT NULL DEFAULT 'PromptX Express',
  tracking_number TEXT NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'Dispatched' CHECK (delivery_status IN ('Packed', 'Dispatched', 'Delivered')),
  destination_address TEXT NOT NULL,
  dispatched_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Idempotent: Drops Existing First)
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tute_deliveries ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can view profiles, users can edit their own profile
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Teachers viewable by all" ON public.teachers;
CREATE POLICY "Teachers viewable by all" ON public.teachers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert teachers" ON public.teachers;
CREATE POLICY "Public insert teachers" ON public.teachers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update teachers" ON public.teachers;
CREATE POLICY "Public update teachers" ON public.teachers FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Teachers can update own profile" ON public.teachers;
CREATE POLICY "Teachers can update own profile" ON public.teachers FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- Batches: Viewable and manageable by all
DROP POLICY IF EXISTS "Batches viewable by all" ON public.batches;
CREATE POLICY "Batches viewable by all" ON public.batches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Batches manageable by all" ON public.batches;
CREATE POLICY "Batches manageable by all" ON public.batches FOR ALL USING (true);

-- Enrollments: Viewable and manageable by all
DROP POLICY IF EXISTS "Enrollments viewable by all" ON public.enrollments;
CREATE POLICY "Enrollments viewable by all" ON public.enrollments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enrollments manageable by all" ON public.enrollments;
CREATE POLICY "Enrollments manageable by all" ON public.enrollments FOR ALL USING (true);

-- Attendance Logs: Viewable and insertable
DROP POLICY IF EXISTS "Attendance logs viewable by all" ON public.attendance_logs;
CREATE POLICY "Attendance logs viewable by all" ON public.attendance_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Attendance logs manageable by all" ON public.attendance_logs;
CREATE POLICY "Attendance logs manageable by all" ON public.attendance_logs FOR ALL USING (true);

-- Lessons: Viewable and manageable
DROP POLICY IF EXISTS "Lessons viewable by all" ON public.lessons;
CREATE POLICY "Lessons viewable by all" ON public.lessons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lessons manageable by all" ON public.lessons;
CREATE POLICY "Lessons manageable by all" ON public.lessons FOR ALL USING (true);

-- Bank Slips: Viewable and manageable
DROP POLICY IF EXISTS "Bank slips viewable by all" ON public.bank_slips;
CREATE POLICY "Bank slips viewable by all" ON public.bank_slips FOR SELECT USING (true);

DROP POLICY IF EXISTS "Bank slips manageable by all" ON public.bank_slips;
CREATE POLICY "Bank slips manageable by all" ON public.bank_slips FOR ALL USING (true);

-- =========================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER (When a new user signs up in Supabase)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, phone, index_number)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Student User'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'index_number', 'LYN-26-' || floor(random() * 9000 + 1000)::text)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
