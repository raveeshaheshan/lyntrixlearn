import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { CheckCircle2, AlertCircle, Info, GraduationCap, ShieldCheck } from 'lucide-react';
import { sound } from './utils/soundEffects';

// Lazy-loaded portals & secondary views for ultra-fast initial landing load
const TeacherDashboard = lazy(() => import('./components/teacher/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
const StudentPortal = lazy(() => import('./components/student/StudentPortal').then(m => ({ default: m.StudentPortal })));
const AttendanceScannerTerminal = lazy(() => import('./components/scanner/AttendanceScannerTerminal').then(m => ({ default: m.AttendanceScannerTerminal })));
const SuperAdminDashboard = lazy(() => import('./components/admin/SuperAdminDashboard').then(m => ({ default: m.SuperAdminDashboard })));
const AdminLoginPage = lazy(() => import('./components/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AuthPage = lazy(() => import('./components/auth/AuthPage').then(m => ({ default: m.AuthPage })));
const TeacherLoginPage = lazy(() => import('./components/auth/TeacherLoginPage').then(m => ({ default: m.TeacherLoginPage })));
const TeacherPlanCheckoutModal = lazy(() => import('./components/auth/TeacherPlanCheckoutModal').then(m => ({ default: m.TeacherPlanCheckoutModal })));
const FeePaymentModal = lazy(() => import('./components/student/FeePaymentModal').then(m => ({ default: m.FeePaymentModal })));
const DigitalStudentCard = lazy(() => import('./components/student/DigitalStudentCard').then(m => ({ default: m.DigitalStudentCard })));
const QuizExamPlayer = lazy(() => import('./components/student/QuizExamPlayer').then(m => ({ default: m.QuizExamPlayer })));

const PortalLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[420px] w-full py-16 animate-in fade-in duration-200">
    <div className="flex flex-col items-center gap-3 p-8 bg-white/80 backdrop-blur rounded-3xl border border-slate-200 shadow-sm">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <span className="text-xs font-bold text-slate-600">Loading Portal...</span>
    </div>
  </div>
);

const AppContent = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    isAdminAuthenticated, 
    toast,
    showAuthModal,
    setShowAuthModal,
    showPlanCheckoutModal,
    setShowPlanCheckoutModal,
    selectedCheckoutPlan,
    showToast
  } = useApp();

  // Secret Hotkey Listener for Sir Studio Access (Ctrl + Shift + S)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'S' || e.key === 's' || e.key === 'T' || e.key === 't')) {
        e.preventDefault();
        sound.playChimeApproved();
        showToast("🔒 Secret Master Gateway Unlocked!", "success");
        setCurrentRole('teacher-login');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isDashboardRole = currentRole === 'teacher' || currentRole === 'student';

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F8FA] text-[#2C3E50] selection:bg-[#8EC5FC] selection:text-[#2C3E50] overflow-x-hidden w-full max-w-full relative font-sans">
      {/* 1. Context Branded Navbar */}
      <Navbar />

      {/* 3. Main Workspace Layout */}
      <Suspense fallback={<PortalLoadingFallback />}>
        {isDashboardRole ? (
          <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
            {/* Persistent LMS Left Sidebar (desktop) & Mobile Tab Bar (mobile) */}
            <Sidebar />

            {/* Main Portal View */}
            <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-full">
              {currentRole === 'teacher' && <TeacherDashboard />}
              {currentRole === 'student' && <StudentPortal />}
            </main>
          </div>
        ) : (
          <main className="flex-1">
            {currentRole === 'landing' && <LandingPage />}
            {currentRole === 'auth' && <AuthPage />}
            {currentRole === 'teacher-login' && <TeacherLoginPage />}
            {currentRole === 'scanner' && <AttendanceScannerTerminal />}
            {currentRole === 'admin' && (
              isAdminAuthenticated ? <SuperAdminDashboard /> : <AdminLoginPage />
            )}
          </main>
        )}
      </Suspense>

      {/* 4. Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-xl ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-emerald-500/10' :
            toast.type === 'error' ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-rose-500/10' :
            'bg-white border-[#E1EDF7] text-[#2C3E50] shadow-[0_8px_30px_rgba(142,197,252,0.2)]'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#6BA8E5] shrink-0" />}
            <span className="text-xs font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* 5. Root Level Portal Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <TeacherPlanCheckoutModal
        isOpen={showPlanCheckoutModal}
        onClose={() => setShowPlanCheckoutModal(false)}
        initialPlan={selectedCheckoutPlan}
      />

      <FeePaymentModal />
      <DigitalStudentCard />
      <QuizExamPlayer />

      {/* 6. Modern LMS Footer with Protected Admin Access link */}
      <footer className="border-t border-[#E1EDF7] bg-white py-6 text-xs text-[#4A6572] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#8EC5FC] flex items-center justify-center text-[#2C3E50] font-bold shadow-sm">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-[#2C3E50]">Lyntrix Learn</span>
            <span>— Multi-Tenant Tuition & LMS SaaS</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[#4A6572]">
              Crafted for Sri Lankan Tuition Masters & Academies
            </span>
            {/* Protected Admin Access trigger */}
            <button
              onClick={() => setCurrentRole('admin')}
              className="inline-flex items-center gap-1 text-[#4A6572] hover:text-[#2C3E50] font-bold transition px-2 py-1 rounded hover:bg-[#E1EDF7]/50"
              title="Platform Administrator Login"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
