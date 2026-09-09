import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  DollarSign, 
  Video, 
  CheckCircle2, 
  Clock, 
  Plus, 
  CreditCard, 
  FileText, 
  Play, 
  QrCode, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Search,
  Eye,
  Check,
  X,
  Send,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  UserPlus,
  Zap
} from 'lucide-react';
import { TeacherSubscriptionModal } from './TeacherSubscriptionModal';
import { CourseCreationWizardModal } from './CourseCreationWizardModal';
import { AssignmentGradingModal } from './AssignmentGradingModal';

export const TeacherDashboard = () => {
  const { 
    currentTeacher, 
    activeTab, 
    setActiveTab, 
    lessons, 
    addLesson, 
    bankSlips, 
    approveBankSlip, 
    rejectBankSlip, 
    students,
    addStudentByTeacher,
    attendanceLogs,
    quizzes,
    addQuizByTeacher,
    quizSubmissions,
    updateBatchLiveLink,
    setActiveLesson,
    showToast
  } = useApp();

  const [studentSearch, setStudentSearch] = useState('');
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [showCourseWizardModal, setShowCourseWizardModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedGradingSub, setSelectedGradingSub] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedSlipModal, setSelectedSlipModal] = useState(null);

  // Live Scheduled Class Editor State
  const [selectedLiveBatchId, setSelectedLiveBatchId] = useState(currentTeacher.batches[0]?.id || '');
  const [liveZoomInput, setLiveZoomInput] = useState(currentTeacher.batches[0]?.zoomLink || 'https://zoom.us/j/98712345678');
  const [liveScheduleInput, setLiveScheduleInput] = useState(currentTeacher.batches[0]?.schedule || 'Every Sunday 8:00 AM - 1:30 PM');

  const [newQuizForm, setNewQuizForm] = useState({
    title: '',
    batchId: currentTeacher.batches[0]?.id || '',
    durationMinutes: 15,
    totalMarks: 50,
    questions: [
      {
        id: 'q1',
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: ''
      }
    ]
  });

  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    phone: '',
    email: '',
    batchId: currentTeacher.batches[0]?.id || '',
    district: 'Colombo',
    paymentStatus: 'Paid'
  });

  const [newLessonForm, setNewLessonForm] = useState({
    title: '',
    unit: 'Pure Mathematics',
    batchId: currentTeacher.batches[0]?.id || '',
    duration: '2h 30m',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    notesPdf: 'Class_Lecture_Notes_2025.pdf',
    description: ''
  });

  const teacherLessons = lessons.filter(l => l.instructorId === currentTeacher.id);
  const teacherSlips = bankSlips.filter(s => s.instructorId === currentTeacher.id);
  const pendingSlips = teacherSlips.filter(s => s.status === 'pending');
  const teacherQuizzes = quizzes.filter(q => q.instructorId === currentTeacher.id || q.subject.toLowerCase() === currentTeacher.subject.toLowerCase());
  const teacherSubmissions = quizSubmissions.filter(s => s.instructorId === currentTeacher.id || s.quizTitle?.includes(currentTeacher.subject));
  
  const totalEnrolled = currentTeacher.batches.reduce((sum, b) => sum + b.enrolledCount, 0);
  const estimatedRevenue = (totalEnrolled * currentTeacher.monthlyFee);

  const handlePublishQuizSubmit = (e) => {
    e.preventDefault();
    if (!newQuizForm.title) {
      showToast("Please enter exam paper title", "error");
      return;
    }
    const validQuestions = newQuizForm.questions.filter(q => q.question.trim() !== '');
    if (validQuestions.length === 0) {
      showToast("Please add at least 1 MCQ question", "error");
      return;
    }

    addQuizByTeacher({
      title: newQuizForm.title,
      batchId: newQuizForm.batchId || currentTeacher.batches[0]?.id,
      durationMinutes: Number(newQuizForm.durationMinutes) || 15,
      totalMarks: Number(newQuizForm.totalMarks) || 50,
      questions: validQuestions
    });

    setShowCreateQuizModal(false);
    setNewQuizForm({
      title: '',
      batchId: currentTeacher.batches[0]?.id || '',
      durationMinutes: 15,
      totalMarks: 50,
      questions: [
        {
          id: 'q1',
          question: '',
          options: ['', '', '', ''],
          correctIndex: 0,
          explanation: ''
        }
      ]
    });
  };

  const handleAddQuestionField = () => {
    setNewQuizForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: `q${prev.questions.length + 1}`,
          question: '',
          options: ['', '', '', ''],
          correctIndex: 0,
          explanation: ''
        }
      ]
    }));
  };

  const handleUpdateQuestion = (qIndex, field, value) => {
    setNewQuizForm(prev => {
      const updated = [...prev.questions];
      updated[qIndex] = { ...updated[qIndex], [field]: value };
      return { ...prev, questions: updated };
    });
  };

  const handleUpdateOption = (qIndex, optIndex, value) => {
    setNewQuizForm(prev => {
      const updated = [...prev.questions];
      const newOptions = [...updated[qIndex].options];
      newOptions[optIndex] = value;
      updated[qIndex] = { ...updated[qIndex], options: newOptions };
      return { ...prev, questions: updated };
    });
  };

  const handleCreateLesson = (e) => {
    e.preventDefault();
    if (!newLessonForm.title) {
      showToast("Please enter a lesson title", "error");
      return;
    }
    addLesson(newLessonForm);
    setShowAddLessonModal(false);
    setNewLessonForm({
      title: '',
      unit: 'Theory',
      batchId: currentTeacher.batches[0]?.id || '',
      duration: '2h 30m',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      notesPdf: 'Lecture_Notes.pdf',
      description: ''
    });
  };

  const handleRegisterStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudentForm.name || !newStudentForm.phone) {
      showToast("Please enter student name and phone number", "error");
      return;
    }

    addStudentByTeacher(newStudentForm);
    setShowAddStudentModal(false);
    setNewStudentForm({
      name: '',
      phone: '',
      email: '',
      batchId: currentTeacher.batches[0]?.id || '',
      district: 'Colombo',
      paymentStatus: 'Paid'
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 0. SAAS SUBSCRIPTION & FREE TRIAL BANNER (ADMIN AUTHORIZED) */}
      <div className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
        currentTeacher.subscription?.status === 'active' 
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-emerald-200' :
        currentTeacher.subscription?.status === 'trialing'
          ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200' :
          'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-md shrink-0 ${
            currentTeacher.subscription?.status === 'active' ? 'bg-emerald-600 text-white shadow-emerald-500/20' :
            currentTeacher.subscription?.status === 'trialing' ? 'bg-blue-600 text-white shadow-blue-500/20' :
            'bg-amber-600 text-white shadow-amber-500/20'
          }`}>
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                {currentTeacher.subscription?.status === 'active' 
                  ? `⭐ Active ${currentTeacher.subscription.tier} Subscription` :
                 currentTeacher.subscription?.status === 'trialing'
                  ? `🟢 Admin Authorized Trial (${currentTeacher.subscription.trialDaysLeft} Days Remaining)` :
                  '🔒 Trial Access Pending Admin Authorization'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                currentTeacher.subscription?.status === 'active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                currentTeacher.subscription?.status === 'trialing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                'bg-amber-100 text-amber-800 border-amber-200'
              }`}>
                {currentTeacher.subscription?.status === 'active' ? 'Paid Active' :
                 currentTeacher.subscription?.status === 'trialing' ? 'Free Trial Granted' : 'Approval Required'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {currentTeacher.subscription?.status === 'active'
                ? 'Your academy portal is running with full bandwidth and verified security.' :
               currentTeacher.subscription?.status === 'trialing'
                ? 'Super Admin has granted you a full-featured 14-day evaluation trial with watermark anti-piracy.' :
                'Free trial for this Academy must be authorized by Lyntrix Platform Admin.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSubscriptionModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 shrink-0"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>SaaS Subscription & Plans</span>
        </button>
      </div>

      {/* 1. TEACHER HERO BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={currentTeacher.avatar}
              alt={currentTeacher.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {currentTeacher.badge}
                </span>
                <span className="text-xs text-slate-500 font-mono">Master ID: {currentTeacher.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {currentTeacher.name}
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-medium mt-0.5">
                {currentTeacher.title} • <span className="text-emerald-700 font-bold">{currentTeacher.subject}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowCourseWizardModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Create New Course (Wizard)</span>
            </button>

            <button
              onClick={() => setShowAddLessonModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Video Lecture</span>
            </button>

            <button
              onClick={() => setActiveTab('slips')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-200 transition relative"
            >
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Bank Slips</span>
              {pendingSlips.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingSlips.length} New
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">Active Students</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">{totalEnrolled.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Live DB Verified</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">Est. Monthly Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-3">LKR {(estimatedRevenue / 1000).toFixed(0)}k</div>
          <div className="text-[11px] text-slate-500 mt-1">LKR {currentTeacher.monthlyFee} / student</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">Pending Slips</span>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-3">{pendingSlips.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Requires 1-click approval</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">Average Student Rating</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-3">★ {currentTeacher.rating || 4.98}</div>
          <div className="text-[11px] text-slate-500 mt-1">{currentTeacher.reviewsCount || 1} Verified Review{currentTeacher.reviewsCount === 1 ? '' : 's'}</div>
        </div>
      </div>

      {/* 2.5 ANALYTICS CHARTS AREA: ENGAGEMENT RATE & MONTHLY REVENUE TRENDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Student Engagement Rate */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Student Engagement Rate</h3>
              <p className="text-xs text-slate-500">Weekly video lecture watch time & quiz participation (%)</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">+18.4% Growth</span>
          </div>

          <div className="h-44 w-full pt-4">
            <svg className="w-full h-full" viewBox="0 0 500 150">
              <defs>
                <linearGradient id="engagementGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 120 Q 80 40, 160 80 T 320 30 T 480 15 L 480 150 L 0 150 Z"
                fill="url(#engagementGrad)"
              />
              <path
                d="M 0 120 Q 80 40, 160 80 T 320 30 T 480 15"
                fill="none"
                stroke="#2563EB"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="160" cy="80" r="5" fill="#2563EB" className="animate-ping" />
              <circle cx="320" cy="30" r="5" fill="#2563EB" />
              <circle cx="480" cy="15" r="6" fill="#10B981" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-100">
            <span>May</span><span>Jun</span><span>Jul</span><span>Aug 2026</span>
          </div>
        </div>

        {/* Chart 2: Monthly Revenue Growth */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Tuition Revenue</h3>
              <p className="text-xs text-slate-500">Collected class fees (LKR)</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">LKR {(estimatedRevenue / 1000).toFixed(0)}k Current</span>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-4">
            {[
              { month: 'May', val: 60 },
              { month: 'Jun', val: 75 },
              { month: 'Jul', val: 88 },
              { month: 'Aug', val: 100 }
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="text-[10px] font-bold text-slate-600 font-mono">{(estimatedRevenue * (bar.val/100) / 1000).toFixed(0)}k</div>
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-xl transition-all duration-700"
                  style={{ height: `${bar.val}%` }}
                />
                <span className="text-[10px] font-mono text-slate-400">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. TAB VIEWS */}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Batches & Next Live */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Class Alert Box */}
            <div className="bg-rose-50/80 border border-rose-200 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Live Scheduled Class</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{currentTeacher.batches[0]?.title || `${currentTeacher.subject} — Theory Masterclass`}</h3>
                <p className="text-xs text-slate-600">{currentTeacher.batches[0]?.schedule || 'Sunday 7:30 AM'} • {totalEnrolled} Student{totalEnrolled === 1 ? '' : 's'} Enrolled</p>
              </div>
              <a
                href={currentTeacher.batches[0]?.zoomLink || "https://zoom.us"}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-rose-600/20 transition"
              >
                <Video className="w-4 h-4" />
                <span>Start Zoom Class</span>
              </a>
            </div>

            {/* Active Batches List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Active Batches & Classes</h3>
                <span className="text-xs text-blue-600 font-bold">{currentTeacher.batches.length} Batches</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentTeacher.batches.map(batch => (
                  <div key={batch.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                        {batch.code}
                      </span>
                      <span className="text-xs text-emerald-600 font-bold">LKR {batch.monthlyFee}/mo</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{batch.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{batch.schedule}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <span>{totalEnrolled} Student{totalEnrolled === 1 ? '' : 's'}</span>
                      <span>{batch.recordingCount} Recordings</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Video Lessons */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Published Video Lessons</h3>
                <button
                  onClick={() => setActiveTab('batches')}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {teacherLessons.slice(0, 3).map(lesson => (
                  <div key={lesson.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                        <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-current" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 line-clamp-1">{lesson.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{lesson.unit} • {lesson.duration}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveLesson(lesson)}
                      className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pending Slip Queue & Recent Attendance */}
          <div className="space-y-6">
            {/* Pending Slip Approvals Widget */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Pending Bank Slips</h3>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  {pendingSlips.length}
                </span>
              </div>

              {pendingSlips.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  All bank slips reviewed! Good job.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingSlips.map(slip => (
                    <div key={slip.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{slip.studentName}</span>
                        <span className="text-xs text-emerald-600 font-bold">LKR {slip.amount}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{slip.studentIndex} • {slip.bank}</div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setSelectedSlipModal(slip)}
                          className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition text-center"
                        >
                          View Slip
                        </button>
                        <button
                          onClick={() => approveBankSlip(slip.id)}
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Hall Attendance Feed */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Recent Hall Scans</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-semibold">Live Feed</span>
              </div>

              <div className="space-y-2.5">
                {attendanceLogs.slice(0, 4).map(log => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{log.studentName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{log.studentIndex} • {log.timestamp}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      log.status.includes('Blocked')
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {log.status.includes('Blocked') ? 'Unpaid' : 'Present'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIPS APPROVAL TAB */}
      {activeTab === 'slips' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Bank Slip Approvals Queue</h2>
            <p className="text-xs text-slate-500">Review student uploaded bank deposit slips and activate instant class access.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherSlips.map(slip => (
              <div key={slip.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    slip.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    slip.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {slip.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{slip.depositDate}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-base">{slip.studentName}</h4>
                  <div className="text-xs text-blue-600 font-mono font-bold">{slip.studentIndex} • {slip.studentPhone}</div>
                  <div className="text-xs text-slate-500">{slip.batchTitle}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Amount Deposited:</span>
                  <span className="font-bold text-emerald-600 text-sm">LKR {slip.amount.toLocaleString()}</span>
                </div>

                <div 
                  onClick={() => setSelectedSlipModal(slip)}
                  className="h-36 bg-slate-100 rounded-xl overflow-hidden relative cursor-pointer border border-slate-200 group"
                >
                  <img src={slip.slipImage} alt="Deposit Slip" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <span className="px-3 py-1.5 bg-black/80 rounded-lg text-xs font-bold text-white">Click to Zoom</span>
                  </div>
                </div>

                {slip.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => approveBankSlip(slip.id)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve (SMS)</span>
                    </button>
                    <button
                      onClick={() => rejectBankSlip(slip.id)}
                      className="px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-bold transition border border-slate-200"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BATCHES & LESSONS TAB */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Batches & Video Lesson Vault</h2>
              <p className="text-xs text-slate-500">Manage course recordings, attached PDFs, and quizzes.</p>
            </div>
            <button
              onClick={() => setShowAddLessonModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Video</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherLessons.map(lesson => (
              <div key={lesson.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="relative aspect-video bg-slate-900">
                  <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover opacity-85" />
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[11px] font-mono text-white">
                    {lesson.duration}
                  </div>
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {lesson.unit}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{lesson.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{lesson.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{lesson.date}</span>
                    <button
                      onClick={() => setActiveLesson(lesson)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play (Watermark)</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STUDENTS CRM TAB */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Student Enrollment & Fee Tracking</h2>
              <p className="text-xs text-slate-500">View payment records, attendance percentages, and dynamic QR tokens.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Name or Index..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>

              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 transition shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Register Student</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Index No</th>
                    <th className="p-4">Phone / Contact</th>
                    <th className="p-4">Enrolled Batch</th>
                    <th className="p-4">August Fee</th>
                    <th className="p-4">Attendance</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.indexNumber.toLowerCase().includes(studentSearch.toLowerCase()))
                    .map(student => {
                      const enrollment = student.enrollments.find(e => e.instructorId === currentTeacher.id) || student.enrollments[0];
                      const status = enrollment?.paymentStatus || 'Overdue';
                      return (
                        <tr key={student.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 flex items-center gap-3">
                            <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-xl object-cover" />
                            <div>
                              <div className="font-bold text-slate-900">{student.name}</div>
                              <div className="text-[10px] text-slate-500">{student.district}</div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-blue-700 font-bold">{student.indexNumber}</td>
                          <td className="p-4 text-slate-700">{student.phone}</td>
                          <td className="p-4 text-slate-700">{student.batch}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                              status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-700 font-semibold">{enrollment?.attendanceRate || 85}%</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => showToast(`SMS Reminder dispatched to ${student.phone}`, 'info')}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition border border-slate-200"
                            >
                              SMS Alert
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* LIVE STREAM TAB & LINK MANAGER */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Live Classroom Broadcasting & Scheduled Links</h2>
              <p className="text-xs text-slate-500">Update Zoom, YouTube Live, or Google Meet links and schedules for your batches.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Edit Live Link Form */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Edit Live Scheduled Class Link</h3>
                  <p className="text-xs text-slate-500">Students with paid fees will immediately get this updated link.</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateBatchLiveLink(
                    currentTeacher.id,
                    selectedLiveBatchId,
                    liveZoomInput,
                    liveScheduleInput
                  );
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Batch to Update:</label>
                  <select
                    value={selectedLiveBatchId}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setSelectedLiveBatchId(newId);
                      const targetBatch = currentTeacher.batches.find(b => b.id === newId);
                      if (targetBatch) {
                        setLiveZoomInput(targetBatch.zoomLink);
                        setLiveScheduleInput(targetBatch.schedule);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-rose-500"
                  >
                    {currentTeacher.batches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.code} — {b.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Live Zoom / Broadcast URL:
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://zoom.us/j/98712345678 or https://youtube.com/live/..."
                    value={liveZoomInput}
                    onChange={(e) => setLiveZoomInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-rose-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Lyntrix automatically protects this URL behind the student fee paywall & dynamic student watermark.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Weekly Timetable Schedule Text:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Every Sunday 8:00 AM - 1:30 PM"
                    value={liveScheduleInput}
                    onChange={(e) => setLiveScheduleInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>💾 Save & Update Live Link</span>
                  </button>

                  <a
                    href={liveZoomInput}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-2 text-center"
                  >
                    <Video className="w-4 h-4" />
                    <span>🚀 Launch Live Zoom Room</span>
                  </a>
                </div>
              </form>
            </div>

            {/* Right 1 Col: Live Schedule Summary Cards */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Current Batch Live Links ({currentTeacher.batches.length})</h3>

              {currentTeacher.batches.map(b => (
                <div key={b.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{b.code}</span>
                    <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                      Live Stream
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 font-medium">{b.title}</div>
                  
                  <div className="text-[11px] text-slate-500">
                    Schedule: <strong className="text-slate-800">{b.schedule}</strong>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono text-blue-700 truncate">
                    {b.zoomLink}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedLiveBatchId(b.id);
                      setLiveZoomInput(b.zoomLink);
                      setLiveScheduleInput(b.schedule);
                      showToast(`Loaded ${b.code} into editor above.`, 'info');
                    }}
                    className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <span>✏️ Edit This Link</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EXAMS & MCQ PAPERS TAB */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Online MCQ Exam Papers & Question Bank</h2>
              <p className="text-xs text-slate-500">Create custom MCQ tests, set countdown timers, and evaluate student marks automatically.</p>
            </div>

            <button
              onClick={() => setShowCreateQuizModal(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/20 transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create New MCQ Paper</span>
            </button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-bold">Published Papers</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{teacherQuizzes.length}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-bold">Total Questions</span>
              <div className="text-2xl font-black text-purple-600 mt-1">
                {teacherQuizzes.reduce((sum, q) => sum + q.questions.length, 0)}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-bold">Student Submissions</span>
              <div className="text-2xl font-black text-blue-600 mt-1">{teacherSubmissions.length}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-bold">Avg Student Score</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {teacherSubmissions.length > 0 
                  ? `${Math.round(teacherSubmissions.reduce((s, sub) => s + sub.percentage, 0) / teacherSubmissions.length)}%` 
                  : '95%'}
              </div>
            </div>
          </div>

          {/* List of Sir's MCQ Papers */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Active Published MCQ Papers</h3>

            {teacherQuizzes.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-500 space-y-3">
                <Award className="w-10 h-10 text-slate-300 mx-auto" />
                <p>No MCQ papers created yet. Click <strong>"+ Create New MCQ Paper"</strong> to publish your first exam.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teacherQuizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                          {quiz.subject}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-mono font-bold">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>{quiz.durationMinutes} Mins</span>
                        </div>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm mt-3">{quiz.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {quiz.questions.length} Questions • Total: {quiz.totalMarks} Marks
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-600">✓ Live for Students</span>
                      <button
                        onClick={() => showToast(`Opening Question Bank for ${quiz.title}`, 'info')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                      >
                        View {quiz.questions.length} Questions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student Exam Marks Leaderboard */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Recent Student MCQ Marks & Submissions</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Index Number</th>
                    <th className="p-3">Exam Paper</th>
                    <th className="p-3">Score / Marks</th>
                    <th className="p-3">Percentage</th>
                    <th className="p-3">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teacherSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{sub.studentName}</td>
                      <td className="p-3 font-mono text-blue-700 font-bold">{sub.studentIndex}</td>
                      <td className="p-3 text-slate-700">{sub.quizTitle}</td>
                      <td className="p-3 font-bold text-slate-900">{sub.score} / {sub.totalMarks}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          sub.percentage >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sub.percentage}%
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{sub.submittedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showAddLessonModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Upload Video Lecture</h3>
              <button onClick={() => setShowAddLessonModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lesson Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Lesson 35: Circular Motion & Past Papers"
                  value={newLessonForm.title}
                  onChange={(e) => setNewLessonForm({ ...newLessonForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch:</label>
                  <select
                    value={newLessonForm.batchId}
                    onChange={(e) => setNewLessonForm({ ...newLessonForm, batchId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    {currentTeacher.batches.map(b => (
                      <option key={b.id} value={b.id}>{b.code} - {b.title.slice(0, 20)}...</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration:</label>
                  <input
                    type="text"
                    value={newLessonForm.duration}
                    onChange={(e) => setNewLessonForm({ ...newLessonForm, duration: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Video Stream URL (MP4 / HLS):</label>
                <input
                  type="text"
                  value={newLessonForm.videoUrl}
                  onChange={(e) => setNewLessonForm({ ...newLessonForm, videoUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Publish Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLIP ZOOM & REVIEW MODAL */}
      {selectedSlipModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Bank Slip Verification</h3>
                <p className="text-xs text-slate-500">{selectedSlipModal.studentName} ({selectedSlipModal.studentIndex})</p>
              </div>
              <button onClick={() => setSelectedSlipModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="h-72 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={selectedSlipModal.slipImage}
                alt="Bank Slip Details"
                className="max-h-full object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Bank & Branch:</span>
                <div className="font-bold text-slate-900">{selectedSlipModal.bank}</div>
              </div>
              <div>
                <span className="text-slate-500">Reference No:</span>
                <div className="font-bold text-blue-700 font-mono">{selectedSlipModal.referenceNo}</div>
              </div>
              <div>
                <span className="text-slate-500">Deposit Date:</span>
                <div className="font-bold text-slate-900">{selectedSlipModal.depositDate}</div>
              </div>
              <div>
                <span className="text-slate-500">Amount:</span>
                <div className="font-bold text-emerald-600">LKR {selectedSlipModal.amount}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  approveBankSlip(selectedSlipModal.id);
                  setSelectedSlipModal(null);
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Send SMS</span>
              </button>
              <button
                onClick={() => {
                  rejectBankSlip(selectedSlipModal.id);
                  setSelectedSlipModal(null);
                }}
                className="px-6 py-3 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-bold transition border border-slate-200"
              >
                Reject Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT STUDENT ENROLLMENT MODAL BY TEACHER */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Enroll Student to Class</h3>
                  <p className="text-xs text-slate-500">Assign Index Number & Generate Dynamic QR Card</p>
                </div>
              </div>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleRegisterStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Fernando"
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone:</label>
                  <input
                    type="tel"
                    required
                    placeholder="077 123 4567"
                    value={newStudentForm.phone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District:</label>
                  <select
                    value={newStudentForm.district}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Galle">Galle</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="Matara">Matara</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assign Batch:</label>
                  <select
                    value={newStudentForm.batchId}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, batchId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    {currentTeacher.batches.map(b => (
                      <option key={b.id} value={b.id}>{b.code} - {b.title.slice(0, 18)}...</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fee Payment Status:</label>
                  <select
                    value={newStudentForm.paymentStatus}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, paymentStatus: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="Paid">Paid (Active Full Pass)</option>
                    <option value="Pending">Pending Slip Verification</option>
                    <option value="Free / Scholarship">Free / Scholarship</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Enroll & Generate QR Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM MCQ EXAM PAPER CREATOR MODAL */}
      {showCreateQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Create Custom MCQ Exam Paper</h3>
                  <p className="text-xs text-slate-500">Publish timed multiple-choice papers for enrolled students</p>
                </div>
              </div>
              <button onClick={() => setShowCreateQuizModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handlePublishQuizSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Exam Paper Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2025 A/L Combined Maths — Trigonometric Integrals Test"
                  value={newQuizForm.title}
                  onChange={(e) => setNewQuizForm({ ...newQuizForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Batch:</label>
                  <select
                    value={newQuizForm.batchId}
                    onChange={(e) => setNewQuizForm({ ...newQuizForm, batchId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    {currentTeacher.batches.map(b => (
                      <option key={b.id} value={b.id}>{b.code} - {b.title.slice(0, 18)}...</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Limit (Mins):</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={newQuizForm.durationMinutes}
                    onChange={(e) => setNewQuizForm({ ...newQuizForm, durationMinutes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Marks:</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={newQuizForm.totalMarks}
                    onChange={(e) => setNewQuizForm({ ...newQuizForm, totalMarks: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* Dynamic Questions Builder */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">MCQ Questions ({newQuizForm.questions.length}):</span>
                  <button
                    type="button"
                    onClick={handleAddQuestionField}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-purple-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Another Question</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {newQuizForm.questions.map((q, qIndex) => (
                    <div key={q.id || qIndex} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-700 font-mono">Question #{qIndex + 1}</span>
                        <span className="text-[10px] text-slate-500 font-bold">Select radio button for Correct Answer</span>
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="Enter Question Text (e.g. ∫ x · e^(2x) dx අනුකලනයේ අගය කොපමණද?)"
                        value={q.question}
                        onChange={(e) => handleUpdateQuestion(qIndex, 'question', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={q.correctIndex === optIndex}
                              onChange={() => handleUpdateQuestion(qIndex, 'correctIndex', optIndex)}
                              className="w-4 h-4 text-purple-600 focus:ring-purple-500 cursor-pointer"
                            />
                            <input
                              type="text"
                              required
                              placeholder={`Option ${optIndex + 1}`}
                              value={opt}
                              onChange={(e) => handleUpdateOption(qIndex, optIndex, e.target.value)}
                              className="flex-1 bg-transparent border-0 text-xs text-slate-900 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>

                      <input
                        type="text"
                        placeholder="Answer Explanation / Working Steps (shown after submit)"
                        value={q.explanation}
                        onChange={(e) => handleUpdateQuestion(qIndex, 'explanation', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 italic"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateQuizModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20"
                >
                  🚀 Publish MCQ Paper to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEACHER SAAS SUBSCRIPTION & UPGRADE MODAL */}
      <TeacherSubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />

      {/* STEP-BY-STEP COURSE CREATION WIZARD MODAL */}
      <CourseCreationWizardModal
        isOpen={showCourseWizardModal}
        onClose={() => setShowCourseWizardModal(false)}
      />

      {/* ASSIGNMENT GRADING MODAL */}
      <AssignmentGradingModal
        isOpen={showGradingModal}
        onClose={() => setShowGradingModal(false)}
        submission={selectedGradingSub}
      />
    </div>
  );
};
