import { createClient } from '@supabase/supabase-js';

// Live Supabase project credentials for Lyntrix Learn
const SUPABASE_PROJECT_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqvnpuigmthjvdjejfdn.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_LxcvgQYqR4tNnpSW89s6tw_R-L5JPSZ';

// Create Supabase client instance with realtime enabled
export const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Helper check to verify if live Supabase is active
export const isSupabaseConfigured = () => {
  return (
    SUPABASE_PROJECT_URL && 
    SUPABASE_PROJECT_URL.includes('supabase.co') &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_ANON_KEY.includes('placeholder')
  );
};

// ----------------------------------------------------
// 1. Authentication & Role-Based Access Services
// ----------------------------------------------------
export const supabaseAuthService = {
  // Sign up new user (Teacher or Student)
  async signUp(email, password, role = 'student', metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role, // 'super_admin' | 'teacher' | 'student'
            name: metadata.name || '',
            phone: metadata.phone || '',
            index_number: metadata.indexNumber || '',
            subject: metadata.subject || ''
          }
        }
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // Log in user with fast 1.2s network timeout protection
  async signIn(email, password) {
    try {
      const authPromise = supabase.auth.signInWithPassword({
        email,
        password
      });

      const timeoutPromise = new Promise((resolve) => 
        setTimeout(() => resolve({ data: null, error: { message: 'Supabase Auth Timeout' } }), 1200)
      );

      const result = await Promise.race([authPromise, timeoutPromise]);
      return result;
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      return { error: err };
    }
  },

  // Get current user session
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (err) {
      return null;
    }
  }
};

// ----------------------------------------------------
// 2. Live Database & Realtime Services
// ----------------------------------------------------
export const supabaseDbService = {
  // 1. Fetch all teachers/academies
  async getTeachers() {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*, batches(*)');
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // 2. Fetch video lessons for a batch
  async getLessons(batchId) {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('batch_id', batchId)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // 3. Add video lesson
  async createLesson(lessonData) {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert([lessonData])
        .select();
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // 4. Upload bank slip
  async submitBankSlip(slipData) {
    try {
      const { data, error } = await supabase
        .from('bank_slips')
        .insert([slipData])
        .select();
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // 5. Approve bank slip
  async approveBankSlip(slipId, studentId, batchId) {
    try {
      const { data: slipData, error: slipError } = await supabase
        .from('bank_slips')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('id', slipId)
        .select();

      if (slipError) return { error: slipError };

      // Update or insert active enrollment
      const { data: enrData, error: enrError } = await supabase
        .from('enrollments')
        .upsert({
          student_id: studentId,
          batch_id: batchId,
          payment_status: 'Paid',
          paid_date: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });

      return { data: { slipData, enrData }, error: enrError };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // 6. Mark Attendance
  async recordAttendance(attendanceRecord) {
    try {
      const { data, error } = await supabase
        .from('attendance_logs')
        .insert([attendanceRecord])
        .select();
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // 7. Realtime Subscription Listeners
  subscribeToRealtime(table, onEvent) {
    try {
      const channel = supabase
        .channel(`public:${table}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table },
          (payload) => {
            if (onEvent) onEvent(payload);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn('Realtime subscription fallback:', err);
      return () => {};
    }
  }
};
