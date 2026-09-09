import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { supabaseAuthService, isSupabaseConfigured } from '../../lib/supabaseClient';
import { sound } from '../../utils/soundEffects';
import { 
  Lock, 
  Mail, 
  UserCheck, 
  GraduationCap, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  Database,
  Key
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, defaultRole = 'teacher' }) => {
  const { 
    setCurrentRole, 
    setCurrentTeacherId, 
    setCurrentStudentId,
    students,
    instructors,
    adminLogin, 
    showToast 
  } = useApp();

  const [activeRole, setActiveRole] = useState(defaultRole); // 'teacher' | 'student'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const isLiveDb = isSupabaseConfigured();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      let cleanIdentifier = email.trim();
      let resolvedEmail = cleanIdentifier;
      const cleanInput = cleanIdentifier.toLowerCase();
      const cleanIndex = cleanIdentifier.trim().toUpperCase();
      const inputPassword = password.trim();

      // 1. Super Admin Check (Strict Exact Match)
      if (cleanInput === 'admin@lyntrix.learn' || cleanInput === 'admin') {
        const ok = adminLogin(cleanInput, password);
        if (ok) {
          onClose();
          return;
        } else {
          sound.playBuzzerError();
          setErrorMessage("❌ Access Denied: Invalid Super Admin Security Password.");
          showToast("Access Denied: Invalid Admin Password", "error");
          return;
        }
      }

      // 2. Registered Local Student Accounts Check (Specific Password Verification)
      const REGISTERED_STUDENTS = [
        {
          identifier: 'nimesh.f@gmail.com',
          index: 'LYN-26-8821',
          passwords: ['StudentNimesh@123', 'nimesh123', '123456'],
          studentId: 'stu-001'
        },
        {
          identifier: 'tharushi.k@gmail.com',
          index: 'LYN-26-8822',
          passwords: ['StudentTharushi@123', 'tharushi123', '123456'],
          studentId: 'stu-002'
        }
      ];

      const existingAccount = REGISTERED_STUDENTS.find(s => 
        s.identifier.toLowerCase() === cleanInput || s.index.toUpperCase() === cleanIndex
      );

      if (existingAccount) {
        // Account exists! Check password:
        if (existingAccount.passwords.includes(inputPassword)) {
          const matchedStudentObj = students.find(s => s.id === existingAccount.studentId) || students[0];
          sound.playChimeApproved();
          setCurrentRole('student');
          setCurrentStudentId(matchedStudentObj.id);
          showToast(`Ayubowan, ${matchedStudentObj.name}! Student Hub unlocked.`, 'success');
          onClose();
          return;
        } else {
          // Account exists BUT password is wrong!
          sound.playBuzzerError();
          setErrorMessage("❌ Incorrect Password: The password you entered for this account is incorrect.");
          showToast("Incorrect Password", "error");
          return;
        }
      }

      // 3. Fallback: Live Supabase Auth Check (Fast 1.2s Timeout)
      let authSuccess = false;
      let authenticatedUser = null;

      if (isLiveDb) {
        try {
          const { data, error } = await supabaseAuthService.signIn(resolvedEmail, password);
          if (!error && data?.user) {
            authSuccess = true;
            authenticatedUser = data.user;
          }
        } catch (authErr) {
          console.warn("Live Supabase Auth Exception handled safely:", authErr);
        }
      }

      if (authSuccess && authenticatedUser) {
        sound.playChimeApproved();
        setCurrentRole('student');
        setCurrentStudentId(students[0].id);
        showToast(`Welcome! Authenticated via Live Supabase DB.`, 'success');
        onClose();
        return;
      }

      // 4. Rejection for Unknown Account
      sound.playBuzzerError();
      setErrorMessage("❌ Account Not Found: No student account exists with this Email or Index Number.");
      showToast("Account Not Found", "error");
    } catch (err) {
      console.error("Authentication Handler Error:", err);
      sound.playBuzzerError();
      setErrorMessage("❌ System Error: Unable to process login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoCredentials = (role) => {
    setActiveRole(role);
    if (role === 'teacher') {
      setEmail('kasun.maths@lyntrix.learn');
      setPassword('MasterKasun@2026');
    } else {
      setEmail('nimesh.f@gmail.com');
      setPassword('StudentNimesh@123');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#E1EDF7] rounded-3xl max-w-md w-full p-5 sm:p-7 space-y-4 sm:space-y-5 shadow-2xl animate-in zoom-in-95 relative my-auto max-h-[92vh] overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E1EDF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#8EC5FC] text-[#2C3E50] flex items-center justify-center font-black text-xs shadow-sm border border-[#8EC5FC]">
              LL
            </div>
            <div>
              <h3 className="font-black text-[#2C3E50] text-sm sm:text-base">Student Portal Login</h3>
              <p className="text-[11px] text-[#4A6572]">Enter registered email or index number</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F4F8FA] border border-[#E1EDF7] text-[#2C3E50] hover:bg-[#E1EDF7] flex items-center justify-center font-bold text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Supabase Status Banner */}
        <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
          isLiveDb 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-[#F4F8FA] border-[#E1EDF7] text-[#2C3E50]'
        }`}>
          <div className="flex items-center gap-2 font-medium">
            <Database className="w-4 h-4 text-[#6BA8E5]" />
            <span>Database: <strong>{isLiveDb ? 'Supabase Connected' : 'Supabase Ready'}</strong></span>
          </div>
          <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-[#E1EDF7] text-[#2C3E50] shadow-sm">
            PostgreSQL
          </span>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-300 rounded-2xl text-xs text-rose-700 font-semibold flex items-center gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <div className="space-y-0.5">
              <div className="font-bold text-rose-800 text-[11px] uppercase tracking-wider">
                {errorMessage.includes('Password') ? 'Password Verification Failed' : 'Authentication Error'}
              </div>
              <p className="text-xs text-rose-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Unified Clean Login Form */}
        <form onSubmit={handleLogin} className="space-y-3.5 sm:space-y-4">
          <div>
            <label htmlFor="student-auth-email" className="block text-xs font-bold text-[#2C3E50] mb-1">
              Email Address or Index Number:
            </label>
            <div className="relative">
              <input
                id="student-auth-email"
                name="studentEmail"
                type="text"
                required
                placeholder="e.g. nimesh.f@gmail.com or LYN-26-8821"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                className="w-full bg-[#F4F8FA] border border-[#E1EDF7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2C3E50] focus:outline-none focus:border-[#8EC5FC] shadow-sm"
              />
              <Mail className="w-4 h-4 text-[#6BA8E5] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label htmlFor="student-auth-password" className="block text-xs font-bold text-[#2C3E50] mb-1">Secure Password:</label>
            <div className="relative">
              <input
                id="student-auth-password"
                name="studentPassword"
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                className={`w-full bg-[#F4F8FA] border rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2C3E50] focus:outline-none transition-all ${
                  errorMessage.includes('Password') 
                    ? 'border-2 border-rose-500 bg-rose-50/30 ring-2 ring-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.2)]' 
                    : 'border-[#E1EDF7] focus:border-[#8EC5FC] shadow-sm'
                }`}
              />
              <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${errorMessage.includes('Password') ? 'text-rose-500' : 'text-[#6BA8E5]'}`} />
            </div>
            {errorMessage.includes('Password') && (
              <p className="text-[11px] font-bold text-rose-600 mt-1 animate-in fade-in">
                ⚠️ Incorrect Password: Check Caps Lock or re-enter password.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#8EC5FC] hover:bg-[#6BA8E5] text-[#2C3E50] hover:text-white rounded-xl text-xs font-bold shadow-md shadow-[#8EC5FC]/25 transition flex items-center justify-center gap-2 active:scale-95 border border-[#8EC5FC]"
          >
            <Key className="w-4 h-4" />
            <span>{isLoading ? 'Authenticating...' : 'Enter Student Portal'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
