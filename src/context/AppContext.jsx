import React, { createContext, useContext, useState, useEffect } from 'react';
import { sound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { supabase, supabaseDbService, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_QUIZZES } from '../data/mockData';

const AppContext = createContext();

// Clean default fallback structures matching live Supabase records
const DEFAULT_INSTRUCTOR = {
  id: "9e1c0212-6aa5-444e-aa37-f295e79f6e98",
  name: "Eng. Kasun Ranasinghe",
  title: "B.Sc. Eng (Hons) University of Moratuwa",
  subject: "Combined Mathematics",
  subjectCategory: "maths",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  cover: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80",
  themeColor: "blue",
  badge: "Top Ranked A/L Master",
  rating: 4.98,
  reviewsCount: 1,
  studentsCount: 1,
  monthlyFee: 3500,
  activeBatchesCount: 1,
  email: "kasun.maths@lyntrix.learn",
  phone: "077 123 4567",
  bankDetails: {
    bank: "Commercial Bank",
    accountName: "K. M. K. Ranasinghe",
    accountNumber: "8009124451",
    branch: "Colombo"
  },
  bio: "Over 10+ years producing Island 1st and Top 10 rankings in Combined Maths.",
  features: ["Anti-Piracy Moving Watermark Player", "High-Speed Laser QR Attendance Terminal", "Automated Bank Slip Queue"],
  batches: [
    {
      id: "batch-kasunmaths-2026-theory",
      code: "KM-2026-TH",
      title: "2026 A/L Combined Mathematics — Full Theory & Revision",
      grade: "2026 A/L",
      gradeYear: "2026",
      medium: "Sinhala Medium",
      schedule: "Every Sunday 7:30 AM - 1:30 PM",
      status: "Active",
      monthlyFee: 3500,
      enrolledCount: 1,
      nextLive: "2026-08-16T07:30:00",
      zoomLink: "https://zoom.us/j/98712345678",
      recordingCount: 0,
      description: "Comprehensive coverage of Pure & Applied Maths units with Eng. Kasun Ranasinghe.",
      modules: []
    }
  ]
};

const DEFAULT_STUDENT = {
  id: "b0000000-0000-0000-0000-000000000001",
  name: "Nimesh Fernando",
  email: "nimesh.f@gmail.com",
  phone: "077 456 7890",
  batch: "2026 A/L",
  stream: "Physical Science (Maths)",
  district: "Colombo",
  address: "Colombo, Sri Lanka",
  indexNumber: "LYN-26-8821",
  qrToken: "QR-LYN-8821",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  activeMonth: "August 2026",
  enrollments: [
    {
      instructorId: "9e1c0212-6aa5-444e-aa37-f295e79f6e98",
      batchId: "batch-kasunmaths-2026-theory",
      paymentStatus: "Paid",
      progress: 15,
      attendanceRate: 100,
      tuteDelivery: {
        packTitle: "August Theory Pack",
        courier: "PromptX Express",
        trackingNumber: "PRX-847291",
        status: "Delivered"
      }
    }
  ]
};

export const AppProvider = ({ children }) => {
  // Navigation & Role State: 'landing' | 'admin' | 'teacher' | 'student' | 'scanner'
  const [currentRole, setCurrentRole] = useState('landing');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Theme State: 'royal' | 'emerald' | 'light' | 'cyber'
  const [theme, setTheme] = useState('light');

  // Super Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // Active Entities (Initialized with clean live DB defaults)
  const [instructors, setInstructors] = useState([DEFAULT_INSTRUCTOR]);
  const [currentTeacherId, setCurrentTeacherId] = useState(DEFAULT_INSTRUCTOR.id);
  
  const [students, setStudents] = useState([DEFAULT_STUDENT]);
  const [currentStudentId, setCurrentStudentId] = useState(DEFAULT_STUDENT.id);
  
  const [lessons, setLessons] = useState([]);
  const [bankSlips, setBankSlips] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [quizzes, setQuizzes] = useState(INITIAL_QUIZZES || []);
  const [quizSubmissions, setQuizSubmissions] = useState([]);

  // ----------------------------------------------------
  // Automatic Subdomain & Hostname Resolver (kasun.lyntrix.learn or ?subdomain=kasun)
  // ----------------------------------------------------
  useEffect(() => {
    try {
      const hostname = window.location.hostname;
      const searchParams = new URLSearchParams(window.location.search);
      const subParam = searchParams.get('subdomain') || searchParams.get('teacher') || searchParams.get('sir');
      
      let targetSubdomain = null;

      if (subParam) {
        targetSubdomain = subParam.toLowerCase();
      } else if (hostname.includes('.') && !hostname.startsWith('www') && !hostname.startsWith('localhost') && !hostname.includes('vercel.app')) {
        targetSubdomain = hostname.split('.')[0].toLowerCase();
      } else if (hostname.includes('.vercel.app')) {
        const firstPart = hostname.split('.')[0];
        if (firstPart.includes('-')) {
          targetSubdomain = firstPart.split('-')[0].toLowerCase();
        }
      }

      if (targetSubdomain) {
        const matched = instructors.find(i => 
          i.id.toLowerCase().includes(targetSubdomain) || 
          i.name.toLowerCase().includes(targetSubdomain) ||
          targetSubdomain.includes(i.subjectCategory)
        );
        if (matched) {
          setCurrentTeacherId(matched.id);
        }
      }
    } catch (e) {}
  }, [instructors]);

  // ----------------------------------------------------
  // Live Supabase Realtime Listeners (Instant Multi-Tab Sync)
  // ----------------------------------------------------
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // 1. Initial live fetch from Supabase
    const fetchLiveSupabaseData = async () => {
      try {
        // Fetch Batches
        const { data: dbBatches } = await supabase.from('batches').select('*');
        const teacherBatchesMap = {};
        if (dbBatches && dbBatches.length > 0) {
          dbBatches.forEach(b => {
            if (!teacherBatchesMap[b.teacher_id]) teacherBatchesMap[b.teacher_id] = [];
            teacherBatchesMap[b.teacher_id].push({
              id: b.id,
              code: b.code || `${(b.title || 'TH').slice(0, 3).toUpperCase()}-2026-TH`,
              title: b.title,
              grade: `${b.grade_year || '2026'} A/L`,
              gradeYear: b.grade_year || '2026',
              medium: b.medium || 'Sinhala Medium',
              schedule: b.schedule || 'Every Sunday 7:30 AM - 1:30 PM',
              status: b.status || 'Active',
              monthlyFee: Number(b.monthly_fee || 3500),
              enrolledCount: 1,
              nextLive: '2026-08-16T07:30:00',
              zoomLink: b.zoom_link || 'https://zoom.us/j/98712345678',
              recordingCount: 0,
              description: b.description || 'Master theory units and papers.',
              modules: []
            });
          });
        }

        // Fetch Live Registered Students (Profiles with role = 'student')
        const { data: dbStudents } = await supabase.from('profiles').select('*').eq('role', 'student').order('created_at', { ascending: false });
        if (dbStudents && dbStudents.length > 0) {
          const liveStudents = dbStudents.map(s => ({
            id: s.id,
            name: s.name,
            email: s.email,
            phone: s.phone || '077 456 7890',
            batch: '2026 A/L',
            stream: 'Physical Science (Maths)',
            district: s.district || 'Colombo',
            address: s.address || 'Sri Lanka',
            indexNumber: s.index_number || `LYN-26-${s.id.slice(0, 4)}`,
            qrToken: `QR-${s.index_number || s.id.slice(0, 4)}`,
            avatar: s.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            activeMonth: 'August 2026',
            enrollments: [
              {
                instructorId: '9e1c0212-6aa5-444e-aa37-f295e79f6e98',
                batchId: 'batch-kasunmaths-2026-theory',
                paymentStatus: 'Paid',
                progress: 15,
                attendanceRate: 100,
                tuteDelivery: {
                  packTitle: 'August Theory Pack',
                  courier: 'PromptX Express',
                  trackingNumber: `PRX-${Math.floor(100000 + Math.random() * 900000)}`,
                  status: 'Delivered'
                }
              }
            ]
          }));
          setStudents(liveStudents);
          if (liveStudents[0]) {
            setCurrentStudentId(liveStudents[0].id);
          }
        }

        // Fetch Live Supabase Teachers
        const { data: dbTeachers } = await supabase.from('teachers').select('*').order('created_at', { ascending: false });
        if (dbTeachers && dbTeachers.length > 0) {
          const studentCount = dbStudents ? dbStudents.length : 1;
          const liveTeachers = dbTeachers.map(t => {
            const assignedBatches = teacherBatchesMap[t.id] || [
              {
                id: `batch-${t.subdomain || t.id}-2026-theory`,
                code: `${(t.subdomain || 'KM').toUpperCase().slice(0, 4)}-2026-TH`,
                title: `2026 A/L ${t.subject} — Full Theory & Revision`,
                grade: "2026 A/L",
                gradeYear: "2026",
                medium: "Sinhala Medium",
                schedule: "Every Sunday 7:30 AM - 1:30 PM",
                status: "Active",
                monthlyFee: Number(t.monthly_fee || 3500),
                enrolledCount: studentCount,
                nextLive: "2026-08-16T07:30:00",
                zoomLink: "https://zoom.us/j/98712345678",
                recordingCount: 0,
                description: `Comprehensive coverage of ${t.subject} theory units and past papers with ${t.name}.`,
                modules: []
              }
            ];

            return {
              id: t.id,
              subdomain: t.subdomain,
              name: t.name,
              title: t.title,
              subject: t.subject,
              subjectCategory: t.subject_category || 'maths',
              avatar: t.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
              cover: t.cover_url || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80",
              themeColor: "blue",
              badge: "Verified A/L Master",
              rating: Number(t.rating || 4.98),
              reviewsCount: 1,
              studentsCount: studentCount,
              monthlyFee: Number(t.monthly_fee || 3500),
              activeBatchesCount: assignedBatches.length,
              email: `${t.subdomain || 'teacher'}@lyntrix.learn`,
              phone: '077 123 4567',
              bankDetails: {
                bank: t.bank_name || "Commercial Bank",
                accountName: t.bank_account_name || t.name,
                accountNumber: t.bank_account_number || "8009124451",
                branch: t.bank_branch || "Colombo"
              },
              bio: t.bio || `Official Lyntrix Learn Academy portal for ${t.name}.`,
              features: ["Anti-Piracy Moving Watermark Player", "High-Speed Laser QR Attendance Terminal", "Automated Bank Slip Queue"],
              batches: assignedBatches
            };
          });

          // Set ONLY live teachers from the database (No mock data!)
          setInstructors(liveTeachers);
          if (liveTeachers[0]) {
            setCurrentTeacherId(liveTeachers[0].id);
          }
        }

        // Live Bank Slips Fetch
        const { data: dbSlips } = await supabase.from('bank_slips').select('*').order('created_at', { ascending: false });
        if (dbSlips) {
          const formattedSlips = dbSlips.map(s => ({
            id: s.id,
            studentId: s.student_id,
            studentName: s.student_name,
            studentIndex: s.student_index,
            studentPhone: s.student_phone,
            instructorId: s.teacher_id,
            batchId: s.batch_id,
            batchTitle: 'Combined Maths / Theory Batch',
            amount: Number(s.amount),
            depositDate: s.created_at ? s.created_at.split('T')[0] : '2026-08-01',
            uploadedAt: new Date(s.created_at || Date.now()).toLocaleString(),
            bank: s.bank_name,
            referenceNo: s.reference_no,
            slipImage: s.slip_image_url,
            status: s.status,
            remarks: s.remarks || ''
          }));
          setBankSlips(formattedSlips);
        }

        // Live Attendance Logs Fetch
        const { data: dbAttendance } = await supabase.from('attendance_logs').select('*').order('created_at', { ascending: false });
        if (dbAttendance) {
          const formattedLogs = dbAttendance.map(a => ({
            id: a.id,
            studentId: a.student_id,
            studentName: a.student_name,
            studentIndex: a.student_index,
            batchId: a.batch_id,
            batchCode: 'ATT-LOG',
            timestamp: new Date(a.created_at || Date.now()).toLocaleTimeString(),
            type: a.scan_type || 'Hall Laser Scanner',
            status: a.status || 'Present',
            feeStatus: a.fee_status || 'Paid'
          }));
          setAttendanceLogs(formattedLogs);
        }

        // Live Lessons Fetch
        const { data: dbLessons } = await supabase.from('lessons').select('*').order('created_at', { ascending: false });
        if (dbLessons) {
          setLessons(dbLessons);
        }

      } catch (err) {
        console.warn('Initial Supabase live fetch:', err);
      }
    };

    fetchLiveSupabaseData();

    // 2. Realtime Bank Slips
    const unsubSlips = supabaseDbService.subscribeToRealtime('bank_slips', (payload) => {
      if (payload.eventType === 'INSERT') {
        const newSlip = {
          id: payload.new.id,
          studentId: payload.new.student_id,
          studentName: payload.new.student_name,
          studentIndex: payload.new.student_index,
          studentPhone: payload.new.student_phone,
          instructorId: payload.new.teacher_id,
          batchId: payload.new.batch_id,
          batchTitle: 'Tuition Batch',
          amount: Number(payload.new.amount),
          depositDate: new Date().toISOString().split('T')[0],
          uploadedAt: new Date().toLocaleString(),
          bank: payload.new.bank_name,
          referenceNo: payload.new.reference_no,
          slipImage: payload.new.slip_image_url,
          status: payload.new.status,
          remarks: payload.new.remarks
        };
        setBankSlips(prev => [newSlip, ...prev.filter(s => s.id !== newSlip.id)]);
        sound.playChimeApproved();
        showToast('⚡ Realtime: New Bank Slip received in Supabase!', 'info');
      } else if (payload.eventType === 'UPDATE') {
        setBankSlips(prev => prev.map(s => s.id === payload.new.id ? { ...s, status: payload.new.status } : s));
      }
    });

    // 3. Realtime Attendance
    const unsubAttendance = supabaseDbService.subscribeToRealtime('attendance_logs', (payload) => {
      if (payload.eventType === 'INSERT') {
        const newLog = {
          id: payload.new.id,
          studentId: payload.new.student_id,
          studentName: payload.new.student_name,
          studentIndex: payload.new.student_index,
          batchId: payload.new.batch_id,
          batchCode: 'HALL-GATE',
          timestamp: new Date().toLocaleTimeString(),
          type: payload.new.scan_type || 'Hall Scanner',
          status: payload.new.status || 'Present',
          feeStatus: payload.new.fee_status || 'Paid'
        };
        setAttendanceLogs(prev => [newLog, ...prev.filter(a => a.id !== newLog.id)]);
        showToast('⚡ Realtime: Entrance Attendance Recorded!', 'info');
      }
    });

    // 4. Realtime Video Lessons
    const unsubLessons = supabaseDbService.subscribeToRealtime('lessons', (payload) => {
      if (payload.eventType === 'INSERT') {
        setLessons(prev => [payload.new, ...prev]);
        showToast('⚡ Realtime: New Video Lecture Added to Supabase!', 'success');
      }
    });

    // 5. Realtime Teachers & Batches & Profiles Sync
    const unsubTeachers = supabaseDbService.subscribeToRealtime('teachers', () => {
      fetchLiveSupabaseData();
    });

    const unsubProfiles = supabaseDbService.subscribeToRealtime('profiles', () => {
      fetchLiveSupabaseData();
    });

    const unsubBatches = supabaseDbService.subscribeToRealtime('batches', () => {
      fetchLiveSupabaseData();
    });

    return () => {
      if (unsubSlips) unsubSlips();
      if (unsubAttendance) unsubAttendance();
      if (unsubLessons) unsubLessons();
      if (unsubTeachers) unsubTeachers();
      if (unsubProfiles) unsubProfiles();
      if (unsubBatches) unsubBatches();
    };
  }, []);
  
  // UI & Localization
  const [lang, setLang] = useState('en');
  const [toast, setToast] = useState(null);

  // Active Modals / Interactive Sub-states
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [paymentModalData, setPaymentModalData] = useState(null);
  const [selectedSlipForReview, setSelectedSlipForReview] = useState(null);
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPlanCheckoutModal, setShowPlanCheckoutModal] = useState(false);
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState(null);

  const openPlanCheckout = (plan = null) => {
    setSelectedCheckoutPlan(plan);
    setShowPlanCheckoutModal(true);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && prev.id === toast?.id ? null : prev));
    }, 4500);
  };

  const currentTeacher = instructors.find(ins => ins.id === currentTeacherId) || instructors[0];
  const currentStudent = students.find(std => std.id === currentStudentId) || students[0];

  // Admin login check (Strict Exact Email & Password Verification)
  const adminLogin = (email = '', password = '') => {
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPass = (password || '').trim();

    const isEmailValid = cleanEmail === 'admin@lyntrix.learn' || cleanEmail === 'admin';
    const isPasswordValid = cleanPass === 'SuperAdmin@2026' || cleanPass === 'admin123';

    if (isEmailValid && isPasswordValid) {
      setIsAdminAuthenticated(true);
      setCurrentRole('admin');
      sound.playChimeApproved();
      showToast("Super Admin Authenticated Successfully!", "success");
      return true;
    }
    return false;
  };

  // Register New Student (Self-signup)
  const registerStudent = (studentData) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const indexNumber = `LYN-26-${randomSuffix}`;
    const qrToken = `QR-LYN-${randomSuffix}`;

    const newStudent = {
      id: `std-${Date.now()}`,
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone,
      batch: studentData.batchYear || '2026 A/L',
      stream: studentData.stream || 'Physical Science (Maths)',
      district: studentData.district || 'Colombo',
      address: studentData.address || 'Sri Lanka',
      indexNumber,
      qrToken,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      activeMonth: 'August 2026',
      enrollments: [
        {
          instructorId: 'ins-kasun-maths',
          batchId: 'batch-kasun-2025',
          paymentStatus: 'Pending',
          progress: 0,
          attendanceRate: 100,
          tuteDelivery: {
            packTitle: `${studentData.batchYear || '2026 A/L'} August Theory Pack`,
            courier: 'PromptX Express',
            trackingNumber: `PRX-${Math.floor(100000 + Math.random() * 900000)}`,
            status: 'Packed'
          }
        }
      ]
    };

    setStudents(prev => [newStudent, ...prev]);
    setCurrentStudentId(newStudent.id);

    // ⚡ Live Supabase Auth & Database Synchronization
    if (isSupabaseConfigured()) {
      (async () => {
        try {
          const { data: authData } = await supabaseAuthService.signUp(
            studentData.email,
            studentData.password || 'Student@2026',
            'student',
            { name: studentData.name, phone: studentData.phone, indexNumber }
          );

          if (authData?.user) {
            await supabase.from('profiles').insert([{
              id: authData.user.id,
              email: studentData.email,
              role: 'student',
              name: studentData.name,
              phone: studentData.phone,
              index_number: indexNumber,
              district: studentData.district || 'Colombo',
              address: studentData.address || 'Sri Lanka'
            }]);
          }
        } catch (err) {
          console.warn("Supabase student registration sync error:", err);
        }
      })();
    }

    sound.playChimeApproved();

    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}

    return newStudent;
  };

  // Add Student by Teacher / Staff (Manual enrollment)
  const addStudentByTeacher = (studentData) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const indexNumber = `LYN-26-${randomSuffix}`;
    const qrToken = `QR-LYN-${randomSuffix}`;
    const studentEmail = studentData.email || `${studentData.name.toLowerCase().replace(/[^a-z]/g, '')}@student.lk`;

    const newStudent = {
      id: `std-${Date.now()}`,
      name: studentData.name,
      email: studentEmail,
      phone: studentData.phone,
      batch: studentData.batchYear || '2025 A/L',
      stream: studentData.stream || 'Combined Maths',
      district: studentData.district || 'Colombo',
      address: studentData.address || 'Classroom Hall Attendance',
      indexNumber,
      qrToken,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      activeMonth: 'August 2026',
      enrollments: [
        {
          instructorId: currentTeacherId,
          batchId: studentData.batchId || currentTeacher.batches[0]?.id,
          paymentStatus: studentData.paymentStatus || 'Paid',
          progress: 0,
          attendanceRate: 100,
          tuteDelivery: {
            packTitle: 'August Theory Pack',
            courier: 'Hand Delivery',
            trackingNumber: `DIR-${randomSuffix}`,
            status: 'Delivered'
          }
        }
      ]
    };

    setStudents(prev => [newStudent, ...prev]);

    // ⚡ Live Supabase Sync
    if (isSupabaseConfigured()) {
      (async () => {
        try {
          const { data: authData } = await supabaseAuthService.signUp(
            studentEmail,
            'Student@2026',
            'student',
            { name: studentData.name, phone: studentData.phone, indexNumber }
          );

          if (authData?.user) {
            await supabase.from('profiles').insert([{
              id: authData.user.id,
              email: studentEmail,
              role: 'student',
              name: studentData.name,
              phone: studentData.phone,
              index_number: indexNumber,
              district: studentData.district || 'Colombo'
            }]);
          }
        } catch (err) {
          console.warn("Supabase teacher student enrollment sync error:", err);
        }
      })();
    }

    sound.playChimeApproved();
    showToast(`Student ${studentData.name} enrolled with Index ${indexNumber}! Saved to DB.`, 'success');
    return newStudent;
  };

  // Upgrade Teacher SaaS Subscription
  const upgradeTeacherSubscription = (teacherId, planId) => {
    const tierName = planId === 'starter' ? 'Starter Master' : planId === 'enterprise' ? 'Enterprise Titan' : 'Pro Academy';
    const price = planId === 'starter' ? 9500 : planId === 'enterprise' ? 45000 : 22500;

    setInstructors(prev => prev.map(ins => {
      if (ins.id === teacherId) {
        return {
          ...ins,
          subscription: {
            tier: tierName,
            status: 'active',
            trialDaysLeft: 0,
            renewalDate: 'September 26, 2026',
            monthlyPriceLKR: price
          }
        };
      }
      return ins;
    }));
  };

  // Admin Grants Free Trial (Only Admin has authority)
  const grantTeacherTrial = (teacherId, durationDays = 14) => {
    setInstructors(prev => prev.map(ins => {
      if (ins.id === teacherId) {
        return {
          ...ins,
          subscription: {
            tier: 'Pro Academy (Trial)',
            status: 'trialing',
            isTrialGranted: true,
            trialDaysLeft: durationDays,
            grantedAt: new Date().toLocaleDateString(),
            renewalDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toLocaleDateString()
          }
        };
      }
      return ins;
    }));
    sound.playChimeApproved();
    showToast(`${durationDays}-Day Free Trial Authorized by Admin!`, 'success');
  };

  // Extend Teacher Trial (Super Admin action)
  const extendTeacherTrial = (teacherId, additionalDays = 14) => {
    setInstructors(prev => prev.map(ins => {
      if (ins.id === teacherId) {
        const currentDays = ins.subscription?.trialDaysLeft || 0;
        return {
          ...ins,
          subscription: {
            ...ins.subscription,
            status: 'trialing',
            isTrialGranted: true,
            trialDaysLeft: currentDays + additionalDays
          }
        };
      }
      return ins;
    }));
    sound.playChimeApproved();
    showToast(`Free trial extended by +${additionalDays} days for Master!`, 'success');
  };

  // Revoke / Suspend Teacher Access (Super Admin action)
  const revokeTeacherAccess = (teacherId) => {
    setInstructors(prev => prev.map(ins => {
      if (ins.id === teacherId) {
        return {
          ...ins,
          subscription: {
            ...ins.subscription,
            status: 'suspended',
            trialDaysLeft: 0
          }
        };
      }
      return ins;
    }));
    sound.playBuzzerError();
    showToast(`Access suspended for Master`, 'error');
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentRole('landing');
    sound.playClick();
    showToast("Super Admin Logged Out", "info");
  };

  const approveBankSlip = (slipId) => {
    sound.playChimeApproved();
    setBankSlips(prev => prev.map(slip => {
      if (slip.id === slipId) {
        return { ...slip, status: 'approved' };
      }
      return slip;
    }));

    const slip = bankSlips.find(s => s.id === slipId);
    if (slip) {
      setStudents(prevStudents => prevStudents.map(std => {
        if (std.id === slip.studentId) {
          const updatedEnrollments = std.enrollments.map(enr => {
            if (enr.batchId === slip.batchId || !enr.batchId) {
              return { ...enr, paymentStatus: 'Paid', paidDate: new Date().toISOString().split('T')[0] };
            }
            return enr;
          });
          return { ...std, enrollments: updatedEnrollments };
        }
        return std;
      }));

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      showToast(`Bank Slip Approved! SMS notification sent to ${slip.studentName} (+94 7X...)`, 'success');
      setSelectedSlipForReview(null);

      // Async live Supabase synchronization
      if (isSupabaseConfigured()) {
        supabaseDbService.approveBankSlip(slip.id, slip.studentId, slip.batchId).catch(() => {});
      }
    }
  };

  const rejectBankSlip = (slipId, reason = "Image unclear or Reference mismatch") => {
    sound.playBuzzerError();
    setBankSlips(prev => prev.map(slip => {
      if (slip.id === slipId) {
        return { ...slip, status: 'rejected', rejectionReason: reason };
      }
      return slip;
    }));
    showToast(`Bank Slip Rejected: ${reason}`, 'error');
    setSelectedSlipForReview(null);
  };

  const submitBankSlip = ({ studentId, batchId, amount, bank, referenceNo, slipImage }) => {
    const student = students.find(s => s.id === studentId);
    const teacher = instructors.find(ins => ins.batches.some(b => b.id === batchId));
    const batch = teacher?.batches.find(b => b.id === batchId);

    const newSlip = {
      id: `slip-${Date.now()}`,
      studentId,
      studentName: student?.name || 'Student',
      studentIndex: student?.indexNumber || 'LYN-STD',
      studentPhone: student?.phone || '+94 77 000 0000',
      instructorId: teacher?.id,
      batchId,
      batchTitle: batch?.title || 'Tuition Batch',
      amount: Number(amount) || batch?.monthlyFee || 3500,
      depositDate: new Date().toISOString().split('T')[0],
      uploadedAt: new Date().toLocaleString(),
      bank: bank || 'Commercial Bank Online',
      referenceNo: referenceNo || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      slipImage: slipImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      status: 'pending',
      remarks: 'Student submitted via portal.'
    };

    setBankSlips(prev => [newSlip, ...prev]);

    // Async live Supabase insertion
    if (isSupabaseConfigured()) {
      supabaseDbService.submitBankSlip({
        student_id: studentId,
        teacher_id: teacher?.id,
        batch_id: batchId,
        amount: Number(amount) || 3500,
        bank_name: bank || 'Commercial Bank',
        reference_no: newSlip.referenceNo,
        slip_url: newSlip.slipImage,
        status: 'pending'
      }).catch(() => {});
    }

    setStudents(prevStudents => prevStudents.map(std => {
      if (std.id === studentId) {
        const existingEnrollment = std.enrollments.find(e => e.batchId === batchId);
        let updatedEnrollments;
        if (existingEnrollment) {
          updatedEnrollments = std.enrollments.map(e => e.batchId === batchId ? { ...e, paymentStatus: 'Pending' } : e);
        } else {
          updatedEnrollments = [
            ...std.enrollments,
            { batchId, instructorId: teacher?.id, paymentStatus: 'Pending', paidDate: null, progress: 0, attendanceRate: 100 }
          ];
        }
        return { ...std, enrollments: updatedEnrollments };
      }
      return std;
    }));

    sound.playClick();
    showToast("Bank slip uploaded successfully! Waiting for Teacher approval.", "info");
  };

  const processInstantCardPayment = ({ studentId, batchId, amount }) => {
    const student = students.find(s => s.id === studentId);
    const teacher = instructors.find(ins => ins.batches.some(b => b.id === batchId));

    setStudents(prevStudents => prevStudents.map(std => {
      if (std.id === studentId) {
        const existingEnrollment = std.enrollments.find(e => e.batchId === batchId);
        let updatedEnrollments;
        if (existingEnrollment) {
          updatedEnrollments = std.enrollments.map(e => e.batchId === batchId ? { ...e, paymentStatus: 'Paid', paidDate: new Date().toISOString().split('T')[0] } : e);
        } else {
          updatedEnrollments = [
            ...std.enrollments,
            { batchId, instructorId: teacher?.id, paymentStatus: 'Paid', paidDate: new Date().toISOString().split('T')[0], progress: 0, attendanceRate: 100 }
          ];
        }
        return { ...std, enrollments: updatedEnrollments };
      }
      return std;
    }));

    sound.playChimeApproved();
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}

    showToast("Payment Successful! Class access activated instantly.", "success");
    setPaymentModalData(null);
  };

  const markAttendanceByQR = (scannedCode) => {
    const student = students.find(
      s => s.qrToken === scannedCode || s.indexNumber === scannedCode || s.id === scannedCode
    );

    if (!student) {
      sound.playBuzzerError();
      return {
        success: false,
        message: "Invalid or Unknown QR Card! Student not registered in Lyntrix Learn."
      };
    }

    const enrollment = student.enrollments.find(e => e.instructorId === currentTeacherId);
    const isPaid = enrollment && enrollment.paymentStatus === 'Paid';

    if (!isPaid) {
      sound.playBuzzerError();
      const newLog = {
        id: `att-${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        studentIndex: student.indexNumber,
        batchId: enrollment?.batchId || 'N/A',
        batchCode: 'ATT-CHECK',
        timestamp: new Date().toLocaleTimeString(),
        type: 'Hall Scanner',
        status: 'Blocked - Fee Unpaid',
        feeStatus: enrollment?.paymentStatus || 'Not Enrolled'
      };
      setAttendanceLogs(prev => [newLog, ...prev]);
      return {
        success: false,
        student,
        feeStatus: enrollment?.paymentStatus || 'Not Enrolled',
        message: `⚠️ Access Warning: ${student.name}'s August class fee is ${enrollment?.paymentStatus || 'Not Paid'}.`
      };
    }

    sound.playBeepSuccess();
    const newLog = {
      id: `att-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentIndex: student.indexNumber,
      batchId: enrollment.batchId,
      batchCode: 'KM-2025-TH',
      timestamp: new Date().toLocaleTimeString(),
      type: 'Hall Laser Scanner',
      status: 'Present - Verified',
      feeStatus: 'Paid'
    };

    setAttendanceLogs(prev => [newLog, ...prev]);
    return {
      success: true,
      student,
      feeStatus: 'Paid',
      message: `✅ Access Granted: ${student.name} (${student.indexNumber}) marked PRESENT.`
    };
  };

  const addLesson = (newLessonData) => {
    const newLesson = {
      id: `les-${Date.now()}`,
      instructorId: currentTeacherId,
      viewsCount: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...newLessonData
    };
    setLessons(prev => [newLesson, ...prev]);
    sound.playClick();
    showToast("New video lecture uploaded & published to students!", "success");
  };

  const addQuizByTeacher = (quizData) => {
    const newQuiz = {
      id: `quiz-${Date.now()}`,
      instructorId: currentTeacher.id,
      subject: currentTeacher.subject,
      ...quizData
    };
    setQuizzes(prev => [newQuiz, ...prev]);
    sound.playChimeApproved();
    showToast(`MCQ Exam Paper "${newQuiz.title}" published to students!`, "success");
    return newQuiz;
  };

  const submitQuizAnswers = (submissionData) => {
    const newSub = {
      id: `sub-${Date.now()}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentIndex: currentStudent.indexNumber,
      submittedAt: new Date().toLocaleString(),
      ...submissionData
    };
    setQuizSubmissions(prev => [newSub, ...prev]);
    sound.playChimeApproved();
    showToast(`Exam Submitted! You scored ${newSub.score}/${newSub.totalMarks} (${newSub.percentage}%)`, 'success');
  };

  const registerTeacherSaaS = (teacherData) => {
    const cleanSubdomain = (teacherData.subdomain || 'master').toLowerCase().replace(/[^a-z0-9-]/g, '');
    const teacherId = `ins-${cleanSubdomain}`;
    
    const newInstructor = {
      id: teacherId,
      name: teacherData.name || 'Master Instructor',
      title: teacherData.title || `Specialist in ${teacherData.subject || 'A/L Theory'}`,
      subject: teacherData.subject || 'Combined Mathematics',
      subjectCategory: (teacherData.subject || 'maths').toLowerCase().includes('chem') ? 'chemistry' : (teacherData.subject || '').toLowerCase().includes('phy') ? 'physics' : (teacherData.subject || '').toLowerCase().includes('ict') ? 'ict' : 'maths',
      avatar: teacherData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      cover: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80",
      themeColor: "blue",
      badge: "Newly Activated SaaS Master",
      rating: 5.0,
      reviewsCount: 1,
      studentsCount: 0,
      monthlyFee: teacherData.monthlyFee || 3500,
      activeBatchesCount: 1,
      email: teacherData.email,
      phone: teacherData.phone,
      bankDetails: {
        bank: "Commercial Bank of Ceylon",
        accountName: teacherData.name,
        accountNumber: "1009845231",
        branch: "Colombo"
      },
      bio: `Official Lyntrix Learn Academy portal for ${teacherData.name}. HD Live Zoom Streams, Anti-Piracy Video Replays, & Printed Tutes.`,
      features: ["Anti-Piracy Moving Watermark Player", "High-Speed Laser QR Attendance Terminal", "Automated Bank Slip Queue"],
      batches: [
        {
          id: `batch-${cleanSubdomain}-2026-theory`,
          code: `${cleanSubdomain.toUpperCase()}-2026-TH`,
          title: `2026 A/L ${teacherData.subject} — Full Theory & Revision`,
          grade: "2026 A/L",
          gradeYear: "2026",
          medium: "Sinhala / English Medium",
          schedule: "Every Sunday 8:00 AM - 1:30 PM",
          status: "Active",
          monthlyFee: 3500,
          enrolledCount: 0,
          nextLive: "2026-08-16T08:00:00",
          zoomLink: "https://zoom.us/j/98712345678",
          recordingCount: 0,
          description: `Master ${teacherData.subject} theory units and past papers with ${teacherData.name}.`,
          modules: []
        }
      ]
    };

    setInstructors(prev => [newInstructor, ...prev]);
    setCurrentTeacherId(teacherId);
    setCurrentRole('teacher');

    if (isSupabaseConfigured()) {
      supabase.from('teachers').insert([{
        name: teacherData.name || 'Master Instructor',
        title: teacherData.title || `Specialist in ${teacherData.subject || 'A/L Theory'}`,
        subject: teacherData.subject || 'Combined Mathematics',
        subject_category: (teacherData.subject || 'maths').toLowerCase().includes('chem') ? 'chemistry' : (teacherData.subject || '').toLowerCase().includes('phy') ? 'physics' : (teacherData.subject || '').toLowerCase().includes('ict') ? 'ict' : 'maths',
        subdomain: cleanSubdomain,
        avatar_url: teacherData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        cover_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80",
        monthly_fee: teacherData.monthlyFee || 3500,
        bio: `Official Lyntrix Learn Academy portal for ${teacherData.name}. HD Live Zoom Streams, Anti-Piracy Video Replays, & Printed Tutes.`,
        bank_name: "Commercial Bank of Ceylon",
        bank_account_name: teacherData.name,
        bank_account_number: "1009845231",
        bank_branch: "Colombo",
        subscription_tier: "Pro Academy",
        subscription_status: "trialing",
        is_verified_master: true
      }]).then(({ data, error }) => {
        if (error) {
          console.error("Error saving teacher to Supabase database:", error);
        } else {
          console.log("⚡ Teacher saved to Supabase teachers table successfully!");
        }
      });
    }

    sound.playChimeApproved();
    showToast(`🎉 Master ${teacherData.name} profile created! Saved to Database & Live at ${cleanSubdomain}.dilnethmadushanka.online`, 'success');
    return newInstructor;
  };

  const updateBatchLiveLink = (teacherId, batchId, newZoomLink, newSchedule, nextLiveDateTime) => {
    setInstructors(prev => prev.map(ins => {
      if (ins.id !== teacherId) return ins;
      return {
        ...ins,
        batches: ins.batches.map(b => {
          if (b.id !== batchId) return b;
          return {
            ...b,
            zoomLink: newZoomLink || b.zoomLink,
            schedule: newSchedule || b.schedule,
            nextLive: nextLiveDateTime || b.nextLive
          };
        })
      };
    }));

    if (isSupabaseConfigured()) {
      supabase.from('batches').update({
        zoom_link: newZoomLink,
        schedule: newSchedule
      }).eq('id', batchId).then(() => {});
    }

    sound.playChimeApproved();
    showToast("Live Scheduled Class Zoom Link updated successfully!", "success");
  };

  const updateStudentAvatar = (avatarUrl) => {
    if (!avatarUrl) return;
    setCurrentStudent(prev => ({ ...prev, avatar: avatarUrl }));
    setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, avatar: avatarUrl } : s));
    sound.playChimeApproved();
    showToast("Profile picture updated successfully!", "success");
  };

  const updateTeacherAvatar = (avatarUrl) => {
    if (!avatarUrl) return;
    setCurrentTeacher(prev => ({ ...prev, avatar: avatarUrl }));
    setInstructors(prev => prev.map(ins => ins.id === currentTeacher.id ? { ...ins, avatar: avatarUrl } : ins));
    sound.playChimeApproved();
    showToast("Teacher profile photo updated successfully!", "success");
  };

  const switchRole = (role) => {
    sound.playClick();
    setCurrentRole(role);
    setActiveTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const platformMetrics = {
    activeStudents: `${students.length} Enrolled`,
    totalStudents: students.length,
    activeTeachers: `${instructors.length} Master${instructors.length === 1 ? '' : 's'}`,
    activeBatches: instructors.reduce((acc, ins) => acc + (ins.batches?.length || 1), 0),
    monthlyRecurringRevenueLKR: (instructors.reduce((acc, ins) => acc + (Number(ins.monthlyFee) || 3500) * (ins.studentsCount || students.length), 0)).toLocaleString(),
    livePassAccuracy: "100%",
    storageUsedTB: "0.05 TB",
    serverUptime: "99.99%"
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole: switchRole,
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        instructors,
        setInstructors,
        currentTeacherId,
        setCurrentTeacherId,
        currentTeacher,
        students,
        setStudents,
        currentStudentId,
        setCurrentStudentId,
        currentStudent,
        lessons,
        setLessons,
        bankSlips,
        setBankSlips,
        attendanceLogs,
        quizzes,
        lang,
        setLang,
        toast,
        showToast,
        approveBankSlip,
        rejectBankSlip,
        submitBankSlip,
        processInstantCardPayment,
        markAttendanceByQR,
        addLesson,
        registerStudent,
        addStudentByTeacher,
        upgradeTeacherSubscription,
        extendTeacherTrial,
        grantTeacherTrial,
        revokeTeacherAccess,
        activeLesson,
        setActiveLesson,
        activeQuiz,
        setActiveQuiz,
        quizSubmissions,
        setQuizSubmissions,
        addQuizByTeacher,
        submitQuizAnswers,
        updateBatchLiveLink,
        paymentModalData,
        setPaymentModalData,
        selectedSlipForReview,
        setSelectedSlipForReview,
        showIdCardModal,
        setShowIdCardModal,
        showAuthModal,
        setShowAuthModal,
        showPlanCheckoutModal,
        setShowPlanCheckoutModal,
        selectedCheckoutPlan,
        setSelectedCheckoutPlan,
        openPlanCheckout,
        registerTeacherSaaS,
        updateStudentAvatar,
        updateTeacherAvatar,
        platformMetrics
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
