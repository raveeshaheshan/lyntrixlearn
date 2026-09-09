-- =========================================================================
-- LYNTRIX LEARN — CREATE 3 ROLES LOGINS IN SUPABASE
-- =========================================================================
-- Copy and paste this script directly into your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cqvnpuigmthjvdjejfdn/sql
-- and click "Run".
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. DELETE EXISTING MATCHING USERS IF ANY (IDEMPOTENT SAFE RUN)
DELETE FROM auth.users WHERE email IN ('admin@lyntrix.learn', 'kasun.maths@lyntrix.learn', 'nimesh.f@gmail.com');
DELETE FROM public.profiles WHERE email IN ('admin@lyntrix.learn', 'kasun.maths@lyntrix.learn', 'nimesh.f@gmail.com');

-- 2. INSERT 3 AUTH USERS INTO auth.users WITH BCRYPT PASSWORDS & CONFIRMED EMAILS
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token
)
VALUES
  -- A. SUPER ADMIN ACCOUNT
  (
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'admin@lyntrix.learn',
    crypt('SuperAdmin@2026', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Lyntrix Super Admin","role":"super_admin"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    ''
  ),
  -- B. TEACHER / MASTER ACCOUNT
  (
    'a0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'kasun.maths@lyntrix.learn',
    crypt('MasterKasun@2026', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Eng. Kasun Ranasinghe","role":"teacher","subject":"Combined Mathematics"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    ''
  ),
  -- C. STUDENT ACCOUNT
  (
    'b0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'nimesh.f@gmail.com',
    crypt('StudentNimesh@123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Nimesh Fernando","role":"student","index_number":"LYN-26-8821"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    ''
  );

-- 3. INSERT MATCHING PROFILES INTO public.profiles
INSERT INTO public.profiles (
  id,
  name,
  email,
  phone,
  role,
  avatar_url,
  index_number,
  district,
  address
)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'Lyntrix Super Admin',
    'admin@lyntrix.learn',
    '+94 11 234 5678',
    'super_admin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    'ADMIN-001',
    'Colombo',
    'Lyntrix HQ, Colombo 03'
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'Eng. Kasun Ranasinghe',
    'kasun.maths@lyntrix.learn',
    '+94 77 987 6543',
    'teacher',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    'TEA-KM-01',
    'Colombo',
    'Nawala, Rajagiriya'
  ),
  (
    'b0000000-0000-0000-0000-000000000001',
    'Nimesh Fernando',
    'nimesh.f@gmail.com',
    '+94 77 123 4567',
    'student',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    'LYN-26-8821',
    'Colombo',
    'No. 45, Galle Road, Colombo 04'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  index_number = EXCLUDED.index_number;

-- 4. INSERT / LINK TEACHER RECORD IN public.teachers
INSERT INTO public.teachers (
  id,
  user_id,
  name,
  title,
  subject,
  subject_category,
  subdomain,
  avatar_url,
  cover_url,
  rating,
  monthly_fee,
  bio,
  bank_name,
  bank_account_name,
  bank_account_number,
  bank_branch,
  subscription_tier,
  subscription_status,
  is_verified_master
)
VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000002',
  'Eng. Kasun Ranasinghe',
  'B.Sc. Eng (Hons) University of Moratuwa',
  'Combined Mathematics',
  'maths',
  'kasunmaths',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200',
  4.98,
  3500.00,
  'Empowering Sri Lankan A/L students with deep conceptual mathematical thinking.',
  'Commercial Bank',
  'K. M. K. Ranasinghe',
  '8009124451',
  'Nawala',
  'Pro Academy',
  'active',
  TRUE
)
ON CONFLICT (subdomain) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  name = EXCLUDED.name,
  subscription_status = 'active';

-- VERIFICATION CONFIRMATION OUTPUT
SELECT 
  p.role AS "Role",
  p.name AS "Name",
  p.email AS "Login Email",
  p.index_number AS "Index / ID"
FROM public.profiles p
ORDER BY p.role;
