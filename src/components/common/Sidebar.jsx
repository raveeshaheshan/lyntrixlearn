import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Video, 
  Package, 
  CreditCard, 
  QrCode, 
  Users, 
  Award, 
  LayoutDashboard,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const { 
    currentRole, 
    activeTab, 
    setActiveTab, 
    currentTeacher, 
    currentStudent, 
    bankSlips,
    setShowIdCardModal 
  } = useApp();

  if (currentRole === 'landing' || currentRole === 'scanner') return null;

  const pendingSlipsCount = bankSlips.filter(
    s => s.instructorId === currentTeacher?.id && s.status === 'pending'
  ).length;

  const studentTabs = [
    { id: 'overview', label: 'My Classes', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore & Enroll', icon: BookOpen },
    { id: 'videos', label: 'Classroom', icon: Video },
    { id: 'deliveries', label: 'Tute Delivery', icon: Package },
    { id: 'quizzes', label: 'Quizzes & Marks', icon: Award },
    { id: 'payments', label: 'Fees & Slips', icon: CreditCard },
  ];

  const teacherTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'batches', label: 'Batches', icon: BookOpen },
    { id: 'slips', label: 'Bank Slips', icon: CreditCard, badge: pendingSlipsCount },
    { id: 'students', label: 'Student CRM', icon: Users },
    { id: 'live', label: 'Live Studio', icon: Video },
    { id: 'exams', label: 'MCQ Papers', icon: Award },
  ];

  const currentTabs = currentRole === 'student' ? studentTabs : teacherTabs;

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ===================================================================== */}
      {/* 1. MOBILE RESPONSIVE HORIZONTAL SCROLLABLE TAB BAR (SMARTPHONES)       */}
      {/* ===================================================================== */}
      <div className="md:hidden sticky top-14 z-30 bg-white/95 backdrop-blur-xl border-b border-[#E1EDF7] shadow-sm w-full">
        {/* User Mini Bar on Mobile */}
        <div className="px-3 py-1.5 bg-[#F4F8FA] border-b border-[#E1EDF7] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <img
              src={currentRole === 'teacher' ? currentTeacher?.avatar : currentStudent?.avatar}
              alt="Profile"
              className="w-6 h-6 rounded-lg object-cover border border-[#E1EDF7]"
            />
            <span className="font-bold text-[#2C3E50] truncate text-[11px]">
              {currentRole === 'teacher' ? currentTeacher?.name : currentStudent?.name}
            </span>
          </div>

          {currentRole === 'student' && (
            <button
              onClick={() => setShowIdCardModal(true)}
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white border border-[#E1EDF7] text-[#2C3E50] shadow-sm active:scale-95"
            >
              <QrCode className="w-3 h-3 text-[#6BA8E5]" />
              <span>Student Pass</span>
            </button>
          )}

          {currentRole === 'teacher' && pendingSlipsCount > 0 && (
            <button
              onClick={() => setActiveTab('slips')}
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 active:scale-95"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>{pendingSlipsCount} Slips</span>
            </button>
          )}
        </div>

        {/* Horizontal Scrollable Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto px-2.5 py-2 no-scrollbar">
          {currentTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-[#8EC5FC] text-[#2C3E50] shadow-sm border border-[#8EC5FC]'
                    : 'bg-[#F4F8FA] text-[#4A6572] hover:text-[#2C3E50] border border-[#E1EDF7]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2C3E50]' : 'text-[#6BA8E5]'}`} />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. DESKTOP PERSISTENT SIDEBAR (TABLETS & SCREENS >= 768px)             */}
      {/* ===================================================================== */}
      <aside className="w-64 bg-white border-r border-[#E1EDF7] flex flex-col justify-between shrink-0 min-h-[calc(100vh-80px)] sticky top-14 hidden md:flex shadow-sm">
        <div className="p-4 space-y-5">
          {/* User Card */}
          <div className="p-3.5 rounded-2xl bg-[#F4F8FA] border border-[#E1EDF7] flex items-center gap-3">
            <img
              src={currentRole === 'teacher' ? currentTeacher?.avatar : currentStudent?.avatar}
              alt="Profile"
              className="w-11 h-11 rounded-xl object-cover border border-[#E1EDF7] shadow-sm"
            />
            <div className="overflow-hidden">
              <div className="font-bold text-[#2C3E50] text-xs truncate">
                {currentRole === 'teacher' ? currentTeacher?.name : currentStudent?.name}
              </div>
              <div className="text-[10px] text-[#4A6572] font-mono mt-0.5 truncate">
                {currentRole === 'teacher' ? currentTeacher?.subject : currentStudent?.indexNumber}
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-[#4A6572] uppercase tracking-wider px-3 mb-2">
              {currentRole === 'teacher' ? 'Instructor LMS Studio' : 'Student Learning Hub'}
            </div>

            {currentTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-[#8EC5FC] text-[#2C3E50] shadow-sm border border-[#8EC5FC]'
                      : 'text-[#4A6572] hover:text-[#2C3E50] hover:bg-[#F4F8FA]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#2C3E50]' : 'text-[#6BA8E5]'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && tab.badge > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Pass Card Widget */}
        <div className="p-4">
          {currentRole === 'student' && (
            <div 
              onClick={() => setShowIdCardModal(true)}
              className="p-3.5 rounded-2xl bg-[#F4F8FA] border border-[#E1EDF7] text-left cursor-pointer hover:border-[#8EC5FC] hover:shadow-sm transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#6BA8E5] uppercase tracking-wider">Entrance Pass</span>
                <QrCode className="w-4 h-4 text-[#6BA8E5] group-hover:scale-110 transition" />
              </div>
              <div className="text-xs font-bold text-[#2C3E50]">Digital Student Card</div>
              <p className="text-[10px] text-[#4A6572] mt-0.5">Tap to show QR barcode at hall gate.</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
