import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  Bell, 
  Search, 
  CreditCard, 
  QrCode, 
  Video, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserCheck,
  UserPlus,
  LogOut,
  ShieldCheck,
  Layers,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const Navbar = () => {
  const { 
    currentRole, 
    setCurrentRole,
    activeTab,
    setActiveTab,
    currentTeacher, 
    currentStudent,
    bankSlips,
    setShowIdCardModal,
    setShowAuthModal,
    adminLogout,
    showToast,
    theme,
    setTheme,
    lang,
    setLang
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const pendingSlipsCount = bankSlips.filter(
    s => s.instructorId === currentTeacher.id && s.status === 'pending'
  ).length;

  const handleStudentLogout = () => {
    sound.playClick();
    setCurrentRole('landing');
    showToast('Logged out of Student Hub', 'info');
  };

  const handleTeacherLogout = () => {
    sound.playClick();
    setCurrentRole('landing');
    showToast('Exited Sir Studio', 'info');
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'royal' : 'light';
    setTheme(nextTheme);
    sound.playClick();
    showToast(`Switched to ${nextTheme === 'royal' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'si' : 'en';
    setLang(nextLang);
    sound.playClick();
    showToast(`Language switched to ${nextLang === 'si' ? 'සිංහල' : 'English'}`, 'info');
  };

  return (
    <nav className="border-b border-[#E1EDF7] bg-white/95 backdrop-blur-2xl sticky top-0 z-40 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* 1. Left: Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                sound.playChimeApproved();
                setCurrentRole('teacher-login');
                showToast("🔒 Master Gateway: Opening Teacher Sign In Portal...", "info");
              }}
              className="flex items-center gap-2.5 group text-left cursor-pointer select-none"
              title="Master Studio Login Gateway"
            >
              {/* Sky Blue Logo Emblem */}
              <div className="w-8 h-8 rounded-lg bg-[#8EC5FC] hover:bg-[#6BA8E5] text-[#2C3E50] flex items-center justify-center font-black text-xs shadow-md shadow-[#8EC5FC]/30 border border-[#8EC5FC] transition">
                LL
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <span className="font-black text-base tracking-tight text-[#2C3E50]">
                    Lyntrix
                  </span>
                  <span className="font-black text-base text-[#6BA8E5]">
                    {currentRole === 'teacher' ? 'Studio' :
                     currentRole === 'student' ? 'Learn' :
                     currentRole === 'admin' ? 'Admin' :
                     currentRole === 'scanner' ? 'Scanner' : 'Learn'}
                  </span>
                </div>
              </div>
            </button>

            {/* Sri Lanka Certified Pill */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E1EDF7]/70 border border-[#8EC5FC]/40 text-[10px] font-bold text-[#2C3E50] tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6BA8E5] animate-pulse"></span>
              <span>🇱🇰 Sri Lanka A/L Master Portal</span>
            </span>
          </div>

          {/* 2. Middle & Right: Search & Controls */}
          <div className="flex items-center gap-2.5">
            {/* Quick Search */}
            <div className="hidden lg:flex items-center relative">
              <input
                type="text"
                placeholder="Search masters, subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F4F8FA] border border-[#E1EDF7] rounded-xl pl-8 pr-3 py-1 text-xs text-[#2C3E50] placeholder-[#4A6572] focus:outline-none focus:border-[#8EC5FC] w-48 font-medium transition"
              />
              <Search className="w-3.5 h-3.5 text-[#6BA8E5] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Language Selector */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-xl bg-[#F4F8FA] hover:bg-[#E1EDF7] border border-[#E1EDF7] text-[11px] font-bold text-[#2C3E50] transition flex items-center gap-1"
              title="Toggle Language"
            >
              <span>🌐</span>
              <span className="text-[#6BA8E5] font-mono">{lang === 'en' ? 'EN' : 'SI'}</span>
            </button>

            {/* Light / Subtle Accent Switcher */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-xl bg-[#F4F8FA] hover:bg-[#E1EDF7] border border-[#E1EDF7] text-[#2C3E50] text-xs font-bold transition flex items-center justify-center"
              title="Toggle Theme"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </button>

            {/* Role Navigation CTAs */}
            {(currentRole === 'landing' || currentRole === 'auth') && (
              <>
                <button
                  onClick={() => setCurrentRole('student')}
                  className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F4F8FA] border border-[#E1EDF7] text-[#2C3E50] text-xs font-bold transition shadow-sm"
                >
                  Student Portal
                </button>

                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#8EC5FC] hover:bg-[#6BA8E5] text-[#2C3E50] hover:text-white text-xs font-bold transition shadow-md shadow-[#8EC5FC]/30 active:scale-95"
                >
                  Log In
                </button>
              </>
            )}

            {/* =================================================== */}
            {/* B. STUDENT ROLE (Enrolled Student Hub)              */}
            {/* =================================================== */}
            {currentRole === 'student' && (
              <>
                <button
                  onClick={() => setShowIdCardModal(true)}
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
                >
                  <QrCode className="w-4 h-4" />
                  <span>My Digital Student ID</span>
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition"
                  >
                    <Bell className="w-4 h-4" />
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-800">Student Notifications</span>
                        <span className="text-[10px] text-blue-600 font-bold cursor-pointer">Mark all read</span>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-xs">
                          <div className="flex items-center gap-2 text-blue-800 font-bold mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>August Theory Active</span>
                          </div>
                          <p className="text-slate-600 text-[11px]">All video recordings and theory notes unlocked for August 2026.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Student Avatar + Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <img
                    src={currentStudent.avatar}
                    alt={currentStudent.name}
                    className="w-8 h-8 rounded-xl object-cover border border-blue-200 shadow-sm"
                  />
                  <button
                    onClick={handleStudentLogout}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 transition"
                    title="Log out of Student Hub"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            )}

            {/* =================================================== */}
            {/* C. TEACHER / SIR ROLE (Master Studio)               */}
            {/* =================================================== */}
            {currentRole === 'teacher' && (
              <>
                <button
                  onClick={() => setCurrentRole('scanner')}
                  className="hidden md:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 transition"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                  <span>QR Gate Scanner</span>
                </button>

                {/* Slip Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition"
                  >
                    <Bell className="w-4 h-4" />
                    {pendingSlipsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                        {pendingSlipsCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-800">Master Studio Alerts</span>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {pendingSlipsCount > 0 ? (
                          <div 
                            onClick={() => { setActiveTab('slips'); setShowNotifications(false); }}
                            className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-xs hover:bg-blue-100/60 cursor-pointer transition"
                          >
                            <div className="flex items-center gap-2 text-blue-800 font-bold mb-1">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                              <span>{pendingSlipsCount} Pending Bank Slips</span>
                            </div>
                            <p className="text-slate-600 text-[11px]">Click here to review and activate student admissions.</p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 p-2 text-center">No pending bank slips.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Teacher Avatar + Exit Studio */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <img
                    src={currentTeacher.avatar}
                    alt={currentTeacher.name}
                    className="w-8 h-8 rounded-xl object-cover border border-emerald-200 shadow-sm"
                  />
                  <button
                    onClick={handleTeacherLogout}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1 transition"
                    title="Exit Sir Studio"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Exit</span>
                  </button>
                </div>
              </>
            )}

            {/* =================================================== */}
            {/* D. SUPER ADMIN ROLE                                 */}
            {/* =================================================== */}
            {currentRole === 'admin' && (
              <>
                <div className="hidden sm:flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full text-xs text-purple-800 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Super Admin Mode Active</span>
                </div>

                <button
                  onClick={adminLogout}
                  className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                  title="Logout from Super Admin Console"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Admin Logout</span>
                </button>
              </>
            )}

            {/* =================================================== */}
            {/* E. SCANNER TERMINAL ROLE                            */}
            {/* =================================================== */}
            {currentRole === 'scanner' && (
              <>
                <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full text-xs text-rose-800 font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>Scanner Terminal Live</span>
                </div>

                <button
                  onClick={() => setCurrentRole('teacher')}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Studio</span>
                </button>
              </>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <div className="flex md:hidden items-center ml-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition"
                title="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 px-3 space-y-2.5 bg-white/95 backdrop-blur-xl animate-in slide-in-from-top-3 shadow-xl">
            {/* Student Actions on Mobile */}
            {currentRole === 'student' && (
              <div className="space-y-2">
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-900">Enrolled Student</span>
                  <span className="font-mono text-blue-600 font-bold text-[11px]">Index: {currentStudent.indexNumber}</span>
                </div>
                <button
                  onClick={() => { setShowIdCardModal(true); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
                >
                  <QrCode className="w-4 h-4" />
                  <span>My Digital Student ID</span>
                </button>
                <button
                  onClick={() => { handleStudentLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold py-2 px-3 rounded-xl transition active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout from Student Hub</span>
                </button>
              </div>
            )}

            {/* Teacher Actions on Mobile */}
            {currentRole === 'teacher' && (
              <div className="space-y-2">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="font-bold text-emerald-900">{currentTeacher.name}</div>
                  <div className="text-emerald-700 text-[11px]">Subdomain: {currentTeacher.id.replace('ins-', '')}.dilnethmadushanka.online</div>
                </div>
                <button
                  onClick={() => { setCurrentRole('scanner'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl shadow-md shadow-emerald-500/20 transition active:scale-95"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Gate Scanner Terminal</span>
                </button>
                <button
                  onClick={() => { handleTeacherLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold py-2 px-3 rounded-xl transition active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit Sir Studio</span>
                </button>
              </div>
            )}

            {/* Public Visitors on Mobile */}
            {(currentRole === 'landing' || currentRole === 'auth') && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setCurrentRole('auth'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold py-2 px-3 rounded-xl transition shadow-sm active:scale-95"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
                <button
                  onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Student Login</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
