import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  BookOpen, 
  Video, 
  QrCode, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Users, 
  Award, 
  TrendingUp, 
  Lock, 
  Clock,
  Star,
  Package,
  FileText,
  ShieldCheck,
  Building,
  GraduationCap,
  ChevronRight,
  Zap
} from 'lucide-react';
import { SUBJECT_CATEGORIES, GRADE_STREAMS, SAAS_PRICING_PLANS } from '../../data/mockData';
import { sound } from '../../utils/soundEffects';
import { AnimatedSection } from '../common/AnimatedSection';

const HERO_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600&auto=format&fit=crop&q=80",
    stream: "📐 Combined Mathematics",
    tagline: "Integral Calculus & Pure Theory Masterclass"
  },
  {
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1600&auto=format&fit=crop&q=80",
    stream: "⚡ Advanced Physics",
    tagline: "Mechanics, Electricity & Quantum Theory Lab"
  },
  {
    url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1600&auto=format&fit=crop&q=80",
    stream: "🧪 Chemistry Faculty",
    tagline: "Organic Syntheses & Physical Energetics"
  },
  {
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=80",
    stream: "💻 A/L ICT & Computing",
    tagline: "Python Programming, Logic Gates & Databases"
  },
  {
    url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&auto=format&fit=crop&q=80",
    stream: "🏢 Hall Gate QR Terminal",
    tagline: "Automated Student Entrance & Fee Pass Verification"
  }
];

export const LandingPage = () => {
  const { 
    instructors, 
    setCurrentRole, 
    setCurrentTeacherId,
    currentRole,
    currentStudent,
    setPaymentModalData,
    setShowAuthModal,
    openPlanCheckout,
    showToast
  } = useApp();

  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-rotating Hero Slideshow
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeBgIndex, setActiveBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Scroll-Driven Dynamic Background Image Switching per Page Section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const scrollRatio = scrollY / totalHeight;

      if (scrollRatio < 0.22) {
        setActiveBgIndex(0); // Hero: Combined Maths / Physics Smartboard
      } else if (scrollRatio < 0.48) {
        setActiveBgIndex(1); // Course Directory: Chemistry & Lab Optics
      } else if (scrollRatio < 0.72) {
        setActiveBgIndex(2); // Faculty Spotlight: University Grand Auditorium
      } else if (scrollRatio < 0.88) {
        setActiveBgIndex(3); // SaaS Infrastructure: High-Tech Computing
      } else {
        setActiveBgIndex(4); // Footer & Bottom: Grand Ancient Library Stacks
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Protected Zoom Admission Check
  const handleProtectedZoomAccess = ({ batchId, title, instructor }) => {
    if (currentRole !== 'student') {
      sound.playBuzzerError();
      showToast("🔒 Student Login Required: Please login to your Student Account to join Sir's Live Zoom class.", "error");
      setShowAuthModal(true);
      return;
    }

    const enrollment = currentStudent?.enrollments?.find(e => e.batchId === batchId || e.instructorId === instructor.id);
    if (!enrollment || enrollment.paymentStatus !== 'Paid') {
      sound.playBuzzerError();
      showToast("🔒 Class Fee Required: Monthly tuition fee payment needed to enter Live Zoom room.", "error");
      setPaymentModalData({
        batch: { id: batchId, title: title || '2025 A/L Combined Maths', monthlyFee: instructor.monthlyFee || 3500 },
        instructor: instructor
      });
      return;
    }

    sound.playChimeApproved();
    window.open(instructor.batches[0]?.zoomLink || "https://zoom.us/j/9988221100", "_blank");
    showToast("✅ Verified Student Pass: Connecting to Live Zoom Room...", "success");
  };

  // Protected Course Enrollment Check
  const handleProtectedEnroll = (instructor) => {
    setCurrentTeacherId(instructor.id);
    if (currentRole !== 'student') {
      sound.playClick();
      showToast(`To enroll in ${instructor.name}'s batch, please login or register your student account.`, 'info');
      setShowAuthModal(true);
    } else {
      const primaryBatch = instructor.batches[0];
      const isPaid = currentStudent.enrollments.some(e => e.batchId === primaryBatch.id && e.paymentStatus === 'Paid');
      if (!isPaid) {
        setPaymentModalData({
          batch: primaryBatch,
          instructor: instructor
        });
      } else {
        setCurrentRole('student');
      }
    }
  };

  const filteredInstructors = instructors.filter(ins => {
    const matchesSubject = selectedSubject === 'all' || ins.subjectCategory === selectedSubject;
    const matchesSearch = ins.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ins.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ins.batches.some(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGrade = selectedGrade === 'all' || ins.batches.some(b => b.gradeYear === selectedGrade);
    return matchesSubject && matchesSearch && matchesGrade;
  });

  return (
    <div className="relative min-h-screen bg-[#F4F8FA] text-[#2C3E50] selection:bg-[#8EC5FC] selection:text-[#2C3E50] overflow-x-hidden w-full max-w-full space-y-16 pb-24 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. SCROLL-DRIVEN BACKGROUND SLIDESHOW WITH SUBTLE ICE-BLUE CANVASES */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === activeBgIndex || (idx === slideIndex && activeBgIndex === 0);
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-30 scale-105 transition-transform duration-[7500ms] ease-out' : 'opacity-0 scale-100'
              }`}
            >
              <img
                src={slide.url}
                alt={slide.stream}
                className="w-full h-full object-cover object-center filter brightness-105 contrast-100 saturate-110"
              />
            </div>
          );
        })}

        {/* Subtle Canvas Overlay: Ice Blue & Pure White Transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4F8FA]/75 via-[#F4F8FA]/85 to-[#F4F8FA]"></div>
        
        {/* Soft Radiant Sky-Blue Lighting Spheres */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-[#8EC5FC]/30 via-[#E1EDF7]/40 to-transparent rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute top-10 left-[8%] w-[500px] h-[450px] bg-[#8EC5FC]/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-20 right-[8%] w-[500px] h-[450px] bg-[#E1EDF7]/50 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="relative z-10 space-y-16">
        
        {/* ========================================================================= */}
        {/* 2. FIRST PAGE HERO VIEW: CLEAN, CONCISE & VIEWPORT-OPTIMIZED */}
        {/* ========================================================================= */}
        <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 my-auto">
            
            {/* Top Pill Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E1EDF7] text-[#2C3E50] text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#6BA8E5]" />
                <span>Smart Online Learning Platform</span>
              </div>
            </div>

            {/* Concise, Clean LMS Headline with Normal Smooth Animation */}
            <div className="max-w-4xl mx-auto space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#2C3E50] leading-tight animate-in fade-in slide-in-from-bottom-3 duration-700">
                Learn Smarter with{' '}
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#357ABD] via-[#6BA8E5] to-[#8EC5FC] bg-[length:200%_auto] animate-brand-shimmer">
                  Lyntrix LMS
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#4A6572] max-w-xl mx-auto font-medium leading-relaxed">
                Live masterclasses, video lessons, and study materials — all in one simple place.
              </p>

              {/* Quick Action CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('courses-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-[#8EC5FC] hover:bg-[#6BA8E5] text-[#2C3E50] hover:text-white font-bold rounded-2xl text-xs shadow-md shadow-[#8EC5FC]/30 transition-all duration-200 active:scale-95 flex items-center gap-2"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCurrentRole('student')}
                  className="px-5 py-2.5 bg-white hover:bg-[#F4F8FA] border border-[#E1EDF7] hover:border-[#8EC5FC] text-[#2C3E50] font-bold rounded-2xl text-xs shadow-sm transition-all duration-200 active:scale-95"
                >
                  Student Portal
                </button>
              </div>
            </div>

            {/* Feature HUD Cards (Pure White with Pale Sky Borders) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E1EDF7] hover:border-[#8EC5FC] hover:shadow-md transition-all duration-300 text-left flex items-center gap-3.5 group shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#F4F8FA] border border-[#E1EDF7] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition">
                  🎓
                </div>
                <div>
                  <div className="font-bold text-xs text-[#2C3E50] group-hover:text-[#357ABD] transition">Top 01% Master Faculty</div>
                  <div className="text-[10px] text-[#4A6572] font-medium">Island Rank 01 Produced</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E1EDF7] hover:border-[#8EC5FC] hover:shadow-md transition-all duration-300 text-left flex items-center gap-3.5 group shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#F4F8FA] border border-[#E1EDF7] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition">
                  🛡️
                </div>
                <div>
                  <div className="font-bold text-xs text-[#2C3E50] group-hover:text-[#357ABD] transition">4K Anti-Piracy DRM</div>
                  <div className="text-[10px] text-[#4A6572] font-medium">Dynamic Watermarked HLS</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E1EDF7] hover:border-[#8EC5FC] hover:shadow-md transition-all duration-300 text-left flex items-center gap-3.5 group shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#F4F8FA] border border-[#E1EDF7] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition">
                  🎟️
                </div>
                <div>
                  <div className="font-bold text-xs text-[#2C3E50] group-hover:text-[#357ABD] transition">Hall Gate QR Pass</div>
                  <div className="text-[10px] text-[#4A6572] font-medium">Laser Entrance Barcode</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. LIVE BROADCAST RADAR & NEXT CLASS COUNTDOWN */}
        {/* ========================================================================= */}
        <AnimatedSection delay={50} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E1EDF7] hover:border-[#8EC5FC] shadow-sm transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
            <div className="flex items-center gap-3.5 text-left">
              <div className="relative shrink-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#F4F8FA] border border-[#E1EDF7] text-[#357ABD] flex items-center justify-center shadow-sm">
                  <Video className="w-5 h-5 sm:w-6 sm:h-6 text-[#6BA8E5] animate-pulse" />
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white absolute -top-0.5 -right-0.5 animate-ping"></span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                    🔴 Live Radar Active
                  </span>
                  <span className="hidden sm:inline-block text-[10px] text-[#4A6572] font-semibold">Next Zoom Session</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#2C3E50]">
                  Combined Maths — Theory Masterclass (අනුකලනය)
                </h3>
                <p className="text-[11px] text-[#4A6572] font-medium">
                  Eng. Kasun Ranasinghe • Sunday 7:30 AM • <span className="text-emerald-600 font-bold">1,840 Active Students</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E1EDF7]">
              <div className="flex items-center gap-1.5 bg-[#F4F8FA] px-3 py-2 rounded-xl border border-[#E1EDF7] text-xs font-mono font-bold text-[#2C3E50]">
                <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>Starts: 02h 45m</span>
              </div>

              <button
                onClick={() => handleProtectedZoomAccess({
                  batchId: 'd0000000-0000-0000-0000-000000000001',
                  title: 'Combined Maths — Theory Masterclass',
                  instructor: instructors[0]
                })}
                className="px-4 py-2 bg-[#8EC5FC] hover:bg-[#6BA8E5] text-[#2C3E50] hover:text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#8EC5FC]/25 active:scale-95 flex items-center gap-1.5 border border-[#8EC5FC] whitespace-nowrap"
              >
                <span>Enter Zoom Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* ========================================================================= */}
        {/* 4. ESSENTIAL LMS COURSES DIRECTORY */}
        {/* ========================================================================= */}
        <AnimatedSection delay={100} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="courses-section" className="space-y-6 pt-2 scroll-mt-20">
            <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E1EDF7] shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E1EDF7]">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E1EDF7]/70 text-[10px] font-bold text-[#2C3E50] uppercase tracking-wider mb-1.5">
                    <BookOpen className="w-3 h-3 text-[#6BA8E5]" />
                    <span>Academic Curriculum</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#2C3E50]">
                    Available Master Batches & Courses
                  </h2>
                  <p className="text-xs text-[#4A6572] mt-0.5">
                    Filter by Subject, Batch Year (2025/2026/2027 A/L), or Tuition Master.
                  </p>
                </div>

                {/* Subject Stream Tabs with smooth mobile horizontal swipe */}
                <div className="flex items-center gap-1.5 bg-[#F4F8FA] p-1 rounded-2xl border border-[#E1EDF7] text-xs overflow-x-auto max-w-full no-scrollbar w-full sm:w-auto">
                  {['all', 'maths', 'physics', 'chemistry', 'ict'].map((subj) => (
                    <button
                      key={subj}
                      onClick={() => setSelectedSubject(subj)}
                      className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] whitespace-nowrap shrink-0 transition ${
                        selectedSubject === subj 
                          ? 'bg-[#8EC5FC] text-[#2C3E50] shadow-sm' 
                          : 'text-[#4A6572] hover:text-[#2C3E50]'
                      }`}
                    >
                      {subj === 'all' ? 'All Streams' : subj}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search & Year Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 relative">
                  <input
                    id="catalog-search-input"
                    name="catalogSearchQuery"
                    aria-label="Search by Master Name, Unit Title, or Subject"
                    type="text"
                    placeholder="Search by Master Name (Kasun, Nuwan...), Unit Title, or Subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F4F8FA] border border-[#E1EDF7] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#2C3E50] placeholder-[#4A6572] focus:outline-none focus:border-[#8EC5FC] transition"
                  />
                  <Search className="w-4 h-4 text-[#6BA8E5] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>

                <div className="sm:col-span-4">
                  <select
                    id="catalog-grade-select"
                    name="catalogGradeFilter"
                    aria-label="Filter by Batch Year"
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full bg-[#F4F8FA] border border-[#E1EDF7] rounded-2xl px-4 py-3 text-xs text-[#2C3E50] font-bold focus:outline-none focus:border-[#8EC5FC] transition"
                  >
                    <option value="all">All Batch Years (2025/2026/2027)</option>
                    <option value="2025">2025 A/L (Theory / Revision)</option>
                    <option value="2026">2026 A/L (Theory)</option>
                    <option value="2027">2027 A/L (New Batch)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstructors.map((ins) => {
                const primaryBatch = ins.batches[0];
                return (
                  <div
                    key={ins.id}
                    className="bg-white rounded-3xl border border-[#E1EDF7] hover:border-[#8EC5FC] hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1 shadow-sm"
                  >
                    {/* Cover Thumbnail with Instructor Info */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={ins.cover}
                        alt={ins.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="px-3 py-1 rounded-xl bg-white/90 text-[#2C3E50] text-[10px] font-bold border border-[#E1EDF7] shadow-sm">
                            {ins.subject}
                          </span>
                          <span className="px-3 py-1 rounded-xl bg-white/90 text-[#2C3E50] text-[10px] font-bold border border-[#E1EDF7] shadow-sm">
                            Year: {primaryBatch?.gradeYear || '2026'}
                          </span>
                        </div>

                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/90 border border-[#E1EDF7] text-[#2C3E50] text-[10px] font-bold shadow-sm">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span>4.9</span>
                        </span>
                      </div>

                      {/* Instructor Avatar */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white drop-shadow">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={ins.avatar}
                              alt={ins.name}
                              className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-md"
                            />
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-white absolute -bottom-1 -right-1" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-white group-hover:text-[#8EC5FC] transition flex items-center gap-1">
                              <span>{ins.name}</span>
                            </div>
                            <div className="text-[10px] text-white/90 font-medium">{ins.title}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-[#2C3E50] text-base line-clamp-1 group-hover:text-[#357ABD] transition">
                          {primaryBatch?.title}
                        </h3>
                        <p className="text-xs text-[#4A6572] line-clamp-2 leading-relaxed font-medium">
                          {primaryBatch?.description}
                        </p>

                        {/* Feature Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] text-[#4A6572]">
                          <span className="flex items-center gap-1 bg-[#F4F8FA] px-2.5 py-1 rounded-lg border border-[#E1EDF7]">
                            <Video className="w-3 h-3 text-[#6BA8E5]" /> 4K DRM Replays
                          </span>
                          <span className="flex items-center gap-1 bg-[#F4F8FA] px-2.5 py-1 rounded-lg border border-[#E1EDF7]">
                            <FileText className="w-3 h-3 text-emerald-600" /> Theory Tutes
                          </span>
                        </div>
                      </div>

                      <div className="pt-3.5 border-t border-[#E1EDF7] flex items-center justify-between gap-3">
                        <div className="shrink-0">
                          <span className="text-[10px] text-[#4A6572] font-bold uppercase tracking-wider block">Tuition Fee</span>
                          <div className="text-sm sm:text-base font-black text-[#2C3E50] font-mono">
                            LKR {ins.monthlyFee.toLocaleString()}
                            <span className="text-[10px] font-normal text-[#4A6572] font-sans">/mo</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleProtectedEnroll(ins)}
                          className="px-5 py-2.5 bg-[#8EC5FC] hover:bg-[#6BA8E5] text-[#2C3E50] hover:text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-md shadow-[#8EC5FC]/25 active:scale-95 flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-[#8EC5FC]"
                        >
                          <span>Enroll Batch</span>
                          <ChevronRight className="w-4 h-4 shrink-0" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* ========================================================================= */}
        {/* 4. HOW LYNTRIX WORKS: 4 ESSENTIAL PLATFORM PILLARS */}
        {/* ========================================================================= */}
        <AnimatedSection delay={150} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E1EDF7] shadow-sm space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider bg-[#E1EDF7] border border-[#8EC5FC]/40 px-3 py-1 rounded-full">
                Built for Sri Lankan Students & Teachers
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2C3E50]">
                Everything You Need for A/L Success
              </h2>
              <p className="text-xs text-[#4A6572] leading-relaxed">
                From live broadcasts to home-delivered theory notes, our system simplifies tuition management.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-[#F4F8FA] border border-[#E1EDF7] hover:border-[#8EC5FC] transition space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E1EDF7] flex items-center justify-center text-2xl shadow-sm text-[#357ABD]">
                  🎥
                </div>
                <h3 className="font-bold text-sm text-[#2C3E50]">Live Zoom & Protected Replays</h3>
                <p className="text-xs text-[#4A6572] leading-relaxed">
                  Join live interactive video sessions or watch watermark-protected HD recordings anytime.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F4F8FA] border border-[#E1EDF7] hover:border-[#8EC5FC] transition space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E1EDF7] flex items-center justify-center text-2xl shadow-sm text-[#357ABD]">
                  📦
                </div>
                <h3 className="font-bold text-sm text-[#2C3E50]">Printed Tute Home Delivery</h3>
                <p className="text-xs text-[#4A6572] leading-relaxed">
                  Monthly printed past paper packs and revision notes dispatched directly to your doorstep.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F4F8FA] border border-[#E1EDF7] hover:border-[#8EC5FC] transition space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E1EDF7] flex items-center justify-center text-2xl shadow-sm text-[#357ABD]">
                  🎟️
                </div>
                <h3 className="font-bold text-sm text-[#2C3E50]">Hall Gate QR Attendance</h3>
                <p className="text-xs text-[#4A6572] leading-relaxed">
                  Instant laser entrance pass verification with digital student ID at physical institute halls.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F4F8FA] border border-[#E1EDF7] hover:border-[#8EC5FC] transition space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E1EDF7] flex items-center justify-center text-2xl shadow-sm text-[#357ABD]">
                  💳
                </div>
                <h3 className="font-bold text-sm text-[#2C3E50]">Bank Slip & Card Payments</h3>
                <p className="text-xs text-[#4A6572] leading-relaxed">
                  Upload bank transfer slips or pay via card with quick verification and automated pass issuing.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ========================================================================= */}
        {/* 5. TOP FACULTY SPOTLIGHT */}
        {/* ========================================================================= */}
        <AnimatedSection delay={200} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E1EDF7] shadow-sm space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider bg-[#E1EDF7] border border-[#8EC5FC]/40 px-3 py-1 rounded-full">
                Sri Lanka's Leading Master Faculty
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2C3E50]">
                Learn from Island Rank 01 Producing Tuition Masters
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 pt-4">
              {instructors.map((ins) => (
                <div key={ins.id} className="p-3.5 sm:p-5 rounded-2xl bg-[#F4F8FA] border border-[#E1EDF7] text-center space-y-2 sm:space-y-3 hover:border-[#8EC5FC] hover:shadow-md transition group">
                  <img src={ins.avatar} alt={ins.name} className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover mx-auto border-2 border-white shadow-sm group-hover:scale-105 transition" />
                  <div>
                    <h4 className="font-bold text-[#2C3E50] text-xs sm:text-sm truncate">{ins.name}</h4>
                    <div className="text-[11px] sm:text-xs text-[#357ABD] font-bold mt-0.5">{ins.subject}</div>
                    <div className="text-[10px] sm:text-[11px] text-[#4A6572] font-mono mt-1">{ins.studentsCount.toLocaleString()} Students</div>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-amber-500 text-[10px] sm:text-xs font-bold pt-2 border-t border-[#E1EDF7]">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                    <span className="text-[#2C3E50]">{ins.rating} ({ins.reviewsCount})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ========================================================================= */}
        {/* 6. STUDENT FAQ ACCORDION */}
        {/* ========================================================================= */}
        <AnimatedSection delay={250} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E1EDF7] shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider bg-[#E1EDF7] border border-[#8EC5FC]/40 px-3 py-1 rounded-full">
                Help & Answers
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2C3E50]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  q: "How do I attend Live Zoom masterclasses?",
                  a: "Once enrolled in a batch, you can login to your Student Hub and click the 'Join Live Zoom' button. Links are automatically generated with your student pass."
                },
                {
                  q: "Can I watch recordings if I miss a live class?",
                  a: "Yes! High-definition, watermark-protected recordings are uploaded to your student portal within 24 hours of each live lecture."
                },
                {
                  q: "How does Bank Slip payment approval work?",
                  a: "You can deposit the monthly fee at any local bank branch and upload a photo of the deposit slip. Our administration verifies slips with SMS confirmation."
                },
                {
                  q: "How do I receive monthly printed tutes?",
                  a: "During registration, provide your delivery address. Theory modules and model paper sets are dispatched via registered courier at the start of each month."
                }
              ].map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F4F8FA] border border-[#E1EDF7] space-y-1.5">
                  <h4 className="font-bold text-sm text-[#2C3E50] flex items-center gap-2">
                    <span className="text-[#6BA8E5]">Q:</span>
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs text-[#4A6572] leading-relaxed pl-5">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ========================================================================= */}
        {/* 7. CLEAN LIGHT THEME FOOTER */}
        {/* ========================================================================= */}
        <footer className="bg-white text-[#4A6572] pt-12 pb-8 border-t border-[#E1EDF7] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs text-[#4A6572]">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#8EC5FC] text-[#2C3E50] flex items-center justify-center font-black text-xs shadow-sm">
                    LL
                  </div>
                  <span className="font-black text-base text-[#2C3E50]">Lyntrix Learn</span>
                </div>
                <p className="text-[#4A6572] text-[11px] leading-relaxed">
                  Sri Lanka's premier tuition LMS platform empowering Sri Lankan A/L students with structured academic mastery.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-[#2C3E50] uppercase text-[11px] tracking-wider mb-2">Academic Policies</div>
                <div><a href="#terms" className="hover:text-[#2C3E50] transition">Student Honor Code</a></div>
                <div><a href="#privacy" className="hover:text-[#2C3E50] transition">Anti-Piracy & DRM Policy</a></div>
                <div><a href="#slips" className="hover:text-[#2C3E50] transition">Bank Slip Approval Guidelines</a></div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-[#2C3E50] uppercase text-[11px] tracking-wider mb-2">Subject Streams</div>
                <div><a href="#courses-section" className="hover:text-[#2C3E50] transition">Combined Mathematics</a></div>
                <div><a href="#courses-section" className="hover:text-[#2C3E50] transition">Advanced Physics</a></div>
                <div><a href="#courses-section" className="hover:text-[#2C3E50] transition">Chemistry Faculty</a></div>
                <div><a href="#courses-section" className="hover:text-[#2C3E50] transition">A/L ICT & Computing</a></div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-[#2C3E50] uppercase text-[11px] tracking-wider mb-2">Help & Support</div>
                <div><span>Hotline: +94 11 234 5678</span></div>
                <div><span>Email: support@lyntrix.learn</span></div>
                <div><span>Station: Colombo, Sri Lanka</span></div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E1EDF7] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#4A6572] font-sans">
              <div>© 2026 Lyntrix Learn Technologies (Pvt) Ltd. All rights reserved.</div>
              <div className="flex gap-4">
                <span>🇱🇰 Sri Lanka National A/L Standard</span>
                <span>ISO/IEC 27001 Security Compliant</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
