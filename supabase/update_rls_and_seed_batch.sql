-- =========================================================================
-- LYNTRIX LEARN: UPDATE RLS POLICIES & SEED PRIMARY BATCH
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/cqvnpuigmthjvdjejfdn/sql
-- =========================================================================

-- 1. Enable RLS and Add Permissive Policies
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_slips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Batches viewable by all" ON public.batches;
CREATE POLICY "Batches viewable by all" ON public.batches FOR SELECT USING (true);
DROP POLICY IF EXISTS "Batches manageable by all" ON public.batches;
CREATE POLICY "Batches manageable by all" ON public.batches FOR ALL USING (true);

DROP POLICY IF EXISTS "Enrollments viewable by all" ON public.enrollments;
CREATE POLICY "Enrollments viewable by all" ON public.enrollments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enrollments manageable by all" ON public.enrollments;
CREATE POLICY "Enrollments manageable by all" ON public.enrollments FOR ALL USING (true);

DROP POLICY IF EXISTS "Attendance logs viewable by all" ON public.attendance_logs;
CREATE POLICY "Attendance logs viewable by all" ON public.attendance_logs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Attendance logs manageable by all" ON public.attendance_logs;
CREATE POLICY "Attendance logs manageable by all" ON public.attendance_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Lessons viewable by all" ON public.lessons;
CREATE POLICY "Lessons viewable by all" ON public.lessons FOR SELECT USING (true);
DROP POLICY IF EXISTS "Lessons manageable by all" ON public.lessons;
CREATE POLICY "Lessons manageable by all" ON public.lessons FOR ALL USING (true);

DROP POLICY IF EXISTS "Bank slips viewable by all" ON public.bank_slips;
CREATE POLICY "Bank slips viewable by all" ON public.bank_slips FOR SELECT USING (true);
DROP POLICY IF EXISTS "Bank slips manageable by all" ON public.bank_slips;
CREATE POLICY "Bank slips manageable by all" ON public.bank_slips FOR ALL USING (true);

-- 2. Seed Primary Batch for Eng. Kasun Ranasinghe (if not exists)
DO $$
DECLARE
  v_teacher_id UUID;
  v_student_id UUID;
  v_batch_id UUID;
BEGIN
  -- Get teacher Eng. Kasun Ranasinghe
  SELECT id INTO v_teacher_id FROM public.teachers WHERE subdomain = 'kasunmaths' OR name ILIKE '%Kasun%' LIMIT 1;
  
  -- Get student Nimesh Fernando
  SELECT id INTO v_student_id FROM public.profiles WHERE role = 'student' LIMIT 1;

  IF v_teacher_id IS NOT NULL THEN
    -- Check if batch exists or insert
    SELECT id INTO v_batch_id FROM public.batches WHERE teacher_id = v_teacher_id LIMIT 1;
    
    IF v_batch_id IS NULL THEN
      INSERT INTO public.batches (
        teacher_id,
        code,
        title,
        grade_year,
        medium,
        schedule,
        monthly_fee,
        zoom_link,
        description
      ) VALUES (
        v_teacher_id,
        'KM-2026-TH',
        '2026 A/L Combined Mathematics — Full Theory & Revision',
        '2026',
        'Sinhala Medium',
        'Every Sunday 7:30 AM - 1:30 PM',
        3500.00,
        'https://zoom.us/j/98712345678',
        'Master Pure & Applied Maths units with Eng. Kasun Ranasinghe.'
      ) RETURNING id INTO v_batch_id;
    END IF;

    -- Link student enrollment if student exists
    IF v_student_id IS NOT NULL AND v_batch_id IS NOT NULL THEN
      INSERT INTO public.enrollments (
        student_id,
        batch_id,
        payment_status,
        progress
      ) VALUES (
        v_student_id,
        v_batch_id,
        'Paid',
        15
      ) ON CONFLICT (student_id, batch_id) DO NOTHING;
    END IF;
  END IF;
END $$;
