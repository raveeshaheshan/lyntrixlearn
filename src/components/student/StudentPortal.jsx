import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Video, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  Play, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  Calendar,
  ChevronRight,
  ExternalLink,
  Search,
  Award,
  Package,
  Truck,
  MapPin,
  Download,
  Camera,
  Lock
} from 'lucide-react';
import { DigitalStudentCard } from './DigitalStudentCard';
import { VideoClassroom } from './VideoClassroom';
import { FeePaymentModal } from './FeePaymentModal';
import { QuizExamPlayer } from './QuizExamPlayer';
import { CourseCompletionModal } from './CourseCompletionModal';
import { ProfileAvatarModal } from '../common/ProfileAvatarModal';

export const StudentPortal = () => {
  const { 
    currentStudent, 
    instructors, 
    lessons, 
    activeTab, 
    setActiveTab, 
    setActiveLesson,
    quizzes,
    quizSubmissions,
    setActiveQuiz,
    bankSlips,
    setPaymentModalData,
    setShowIdCardModal,
    updateStudentAvatar,
    showToast
  } = useApp();

  const [lessonFilter, setLessonFilter] = useState('All');
  const [showCertModal, setShowCertModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const studentSlips = bankSlips.filter(s => s.studentId === currentStudent.id);

  const handleOpenPayment = (batch, instructor) => {
    setPaymentModalData({ batch, instructor });
  };

  return (
    <div className="space-y-8 pb-24">
      {/* 1. STUDENT WELCOME BANNER */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div 
              onClick={() => setShowAvatarModal(true)}
              className="relative group cursor-pointer"
              title="Click to change profile picture"
            >
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover border-2 border-[#0A2540] shadow-sm group-hover:opacity-85 transition"
              />
              <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <Camera className="w-5 h-5 text-white drop-shadow" />
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white hover:bg-blue-700 transition"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#FAF9F6] text-[#0A2540] border border-slate-200">
                  {currentStudent.batch}
                </span>
                <span className="text-xs font-mono text-slate-500">Index: {currentStudent.indexNumber}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0A2540] mt-1">
                Ayubowan, {currentStudent.name}! 👋
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 font-sans">
                District: <strong className="text-[#0A2540]">{currentStudent.district}</strong> • Active Term: <span className="text-[#2B7F5E] font-bold">{currentStudent.activeMonth}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowCertModal(true)}
              className="px-4 py-2 bg-[#F05D3D] hover:bg-[#D9492A] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <Award className="w-4 h-4 text-white" />
              <span>Completion Certificate</span>
            </button>

            <button
              onClick={() => setShowIdCardModal(true)}
              className="px-4 py-2 bg-[#0A2540] hover:bg-[#071C32] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>Digital Student ID</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TAB VIEWS */}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Enrolled Courses & Live Classes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Class Timetable Banner - STRICTLY FILTERED BY STUDENT'S REGISTERED SIRS & BATCHES */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                  <h3 className="font-bold text-slate-900 text-sm">My Upcoming Live Class Timetable</h3>
                </div>
                <span className="text-xs text-blue-600 font-bold">Only Registered Classes ({currentStudent.enrollments.length})</span>
              </div>

              {currentStudent.enrollments.length === 0 ? (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  You are not currently enrolled in any class batches. Browse the Course Catalog to register.
                </div>
              ) : (
                <div className="space-y-3">
                  {currentStudent.enrollments.map((enr, idx) => {
                    const teacher = instructors.find(i => i.id === enr.instructorId) || instructors[0];
                    const batch = teacher.batches.find(b => b.id === enr.batchId) || teacher.batches[0];
                    const isPaid = enr.paymentStatus === 'Paid';

                    return (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
                          isPaid ? 'bg-rose-50/60 border-rose-200' : 'bg-amber-50/60 border-amber-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isPaid ? 'text-rose-700' : 'text-amber-700'}`}>
                              {batch.schedule || 'Weekly Live Broadcast'}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {isPaid ? '✓ Fee Paid' : '⚠️ Fee Pending'}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">{batch.title}</h4>
                          <div className="text-xs text-slate-600">
                            Instructor: <strong>{teacher.name}</strong> • Medium: <span>{batch.medium}</span>
                          </div>
                        </div>

                        <div>
                          {isPaid ? (
                            <a
                              href={batch.zoomLink || "https://zoom.us"}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-rose-600/20 shrink-0"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Live Zoom</span>
                            </a>
                          ) : (
                            <button
                              onClick={() => handleOpenPayment(batch, teacher)}
                              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-600/20 shrink-0"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay Fee to Join</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* My Enrolled Batches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">My Enrolled Subjects & Fee Status</h3>
                <span className="text-xs text-slate-500">{currentStudent.enrollments.length} Enrolled Batches</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentStudent.enrollments.map((enr, idx) => {
                  const teacher = instructors.find(i => i.id === enr.instructorId) || instructors[0];
                  const batch = teacher.batches.find(b => b.id === enr.batchId) || teacher.batches[0];
                  const isPaid = enr.paymentStatus === 'Paid';
                  const isPending = enr.paymentStatus === 'Pending';

                  return (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-blue-600 font-bold">{teacher.subject}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            isPending ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {enr.paymentStatus}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm mt-2">{batch.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{teacher.name}</p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        {/* Course Progress */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span>Syllabus Completed</span>
                            <span className="font-bold text-slate-900">{enr.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${enr.progress}%` }}></div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        {isPaid ? (
                          <button
                            onClick={() => {
                              const lesson = lessons.find(l => l.instructorId === teacher.id) || lessons[0];
                              if (lesson) {
                                setActiveLesson(lesson);
                              } else {
                                showToast("No recorded video lectures uploaded for this batch yet.", "info");
                              }
                            }}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Watch Classroom Lectures</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenPayment(batch, teacher)}
                            className="w-full py-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{isPending ? 'Review / Upload New Slip' : 'Pay August Fee (LKR 3,500)'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Quick Stats & Digital Pass Mini Preview */}
          <div className="space-y-6">
            {/* Holographic ID Pass Mini Banner */}
            <div 
              onClick={() => setShowIdCardModal(true)}
              className="bg-white p-6 rounded-3xl border border-blue-200 text-center space-y-4 cursor-pointer group hover:border-blue-400 transition shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Dynamic Student ID Pass</h4>
                <p className="text-xs text-slate-500 mt-1">Tap to open full card with QR code for hall attendance scanner.</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600">
                <span>View Full Pass</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>

            {/* Recent Uploaded Slips Status */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">My Bank Slips Status</h4>

              {studentSlips.length === 0 ? (
                <div className="text-xs text-slate-500">No bank slips submitted yet.</div>
              ) : (
                <div className="space-y-3">
                  {studentSlips.map(slip => (
                    <div key={slip.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{slip.bank}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          slip.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          slip.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {slip.status}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] font-mono">Ref: {slip.referenceNo} • LKR {slip.amount}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EXPLORE MASTERS & ENROLL TAB */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Multi-Master Academy Catalog</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">Explore Tuition Masters & Enroll in Classes</h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your A/L teacher, enroll in your batch, and upload your monthly bank deposit slip for instant admission.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {instructors.map((ins) => (
              <div
                key={ins.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between hover:border-blue-300 transition duration-300"
              >
                {/* Master Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={ins.avatar}
                      alt={ins.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                          {ins.subject}
                        </span>
                        <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                          ★ {ins.rating}
                        </span>
                      </div>
                      <h3 className="font-black text-slate-900 text-base mt-1">{ins.name}</h3>
                      <p className="text-xs text-slate-500">{ins.title}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Monthly Fee</div>
                    <div className="text-base font-black text-emerald-600">LKR {ins.monthlyFee.toLocaleString()}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {ins.bio}
                </p>

                {/* Batches Offered by this Master */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Available Class Batches ({ins.batches.length}):</span>
                    <span className="text-[11px] text-blue-600 font-normal">Syllabus & Recordings Included</span>
                  </div>

                  <div className="space-y-2.5">
                    {ins.batches.map((b) => {
                      const enrolled = currentStudent.enrollments.find(e => e.batchId === b.id);
                      const isPaid = enrolled?.paymentStatus === 'Paid';
                      const isPending = enrolled?.paymentStatus === 'Pending';

                      return (
                        <div
                          key={b.id}
                          className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">{b.title}</span>
                              <span className="text-[10px] font-mono font-bold bg-white text-slate-700 px-1.5 py-0.5 rounded border">
                                {b.grade}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              Schedule: <strong>{b.schedule}</strong>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {isPaid ? (
                              <button
                                onClick={() => setActiveTab('videos')}
                                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Access Active (Watch)</span>
                              </button>
                            ) : isPending ? (
                              <button
                                onClick={() => handleOpenPayment(b, ins)}
                                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                              >
                                <Clock className="w-3.5 h-3.5 animate-spin" />
                                <span>Pending Sir Approval</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenPayment(b, ins)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-blue-500/20 active:scale-95"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Enroll & Upload Slip</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DELIVERIES TAB */}
      {activeTab === 'deliveries' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Monthly Printed Tute & Material Deliveries</h2>
            <p className="text-xs text-slate-500">Track physical theory books and model paper couriers delivered to your doorstep.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentStudent.enrollments.map((enr, i) => {
              const teacher = instructors.find(ins => ins.id === enr.instructorId);
              const delivery = enr.tuteDelivery;

              return (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600">{teacher?.subject}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      delivery?.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      delivery?.status === 'Dispatched' ? 'bg-cyan-100 text-cyan-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {delivery?.status || 'Pending Dispatch'}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{delivery?.packTitle || "August Theory Tute Pack"}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{teacher?.name}</p>
                      {delivery && (
                        <div className="text-[11px] text-slate-500 font-mono mt-1">
                          Courier: <strong className="text-slate-800">{delivery.courier}</strong> • Tracking: <span className="text-blue-600 font-bold">{delivery.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2 text-xs text-slate-700">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="truncate">{currentStudent.address}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIDEOS TAB */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Video Classroom & Lesson Vault</h2>
            <p className="text-xs text-slate-500">All lectures are streamed with dynamic watermark security to protect master content.</p>
          </div>

          {lessons.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl font-bold">
                🎬
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">No Video Lessons Uploaded Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your tuition master will upload HD lecture recordings and study sessions here soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map(lesson => (
                <div key={lesson.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition">
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => setActiveLesson(lesson)}
                        className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg"
                      >
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </button>
                    </div>
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
                        className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch Lesson</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PAYMENTS TAB */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Class Fee Management & Bank Slip Gateway</h2>
            <p className="text-xs text-slate-500">Pay fees online or upload deposit slips for teacher approval.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map(teacher => {
              const batch = teacher.batches[0];
              const enrollment = currentStudent.enrollments.find(e => e.instructorId === teacher.id);
              const isPaid = enrollment?.paymentStatus === 'Paid';

              return (
                <div key={teacher.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-600">{teacher.subject}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isPaid ? 'Paid (Active)' : 'August Unpaid'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img src={teacher.avatar} alt={teacher.name} className="w-12 h-12 rounded-2xl object-cover" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{teacher.name}</h4>
                        <div className="text-xs text-slate-500">{batch?.code}</div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Monthly Fee:</span>
                      <span className="font-bold text-emerald-600">LKR {teacher.monthlyFee}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenPayment(batch, teacher)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{isPaid ? 'Renew for Next Month' : 'Pay / Upload Slip'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QUIZZES TAB - STRICTLY ENROLLED SIRS & MARKS */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>My Registered MCQ Exam Papers</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">Online MCQ Tests & Exam Results</h2>
              <p className="text-xs text-slate-500 mt-1">
                Only displaying exam papers and marks for your registered Sirs and batches.
              </p>
            </div>
          </div>

          {/* Filtered Quizzes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes
              .filter(quiz => {
                return currentStudent.enrollments.some(e => 
                  e.batchId === quiz.batchId || 
                  e.instructorId === quiz.instructorId ||
                  quiz.title.toLowerCase().includes(e.batchId.split('-')[1] || '')
                );
              })
              .map(quiz => {
                const enrollment = currentStudent.enrollments.find(e => e.batchId === quiz.batchId || e.instructorId === quiz.instructorId);
                const isPaid = enrollment?.paymentStatus === 'Paid';
                const submission = quizSubmissions.find(s => s.quizId === quiz.id && s.studentId === currentStudent.id);

                return (
                  <div key={quiz.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          {quiz.subject}
                        </span>
                        <div className="flex items-center gap-2">
                          {quiz.submitRequiredTime > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                              <Lock className="w-3 h-3 text-amber-600" />
                              <span>Min {Math.max(0, quiz.durationMinutes - quiz.submitRequiredTime)}m required</span>
                            </span>
                          )}
                          <div className="flex items-center gap-1 text-xs text-slate-500 font-mono font-bold">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            <span>{quiz.durationMinutes} Minutes</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base">{quiz.title}</h3>
                      <p className="text-xs text-slate-500">
                        {quiz.questions.length} MCQ Questions • Total Marks: {quiz.totalMarks}
                      </p>

                      {submission && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                          <div>
                            <span className="text-emerald-800 font-bold">Your Score: {submission.score} / {submission.totalMarks}</span>
                            <div className="text-[10px] text-emerald-600 font-mono mt-0.5">Submitted: {submission.submittedAt}</div>
                          </div>
                          <span className="text-sm font-black text-emerald-700 bg-white px-2.5 py-1 rounded-xl shadow-sm border border-emerald-200">
                            {submission.percentage}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      {!isPaid ? (
                        <button
                          onClick={() => showToast("Please pay your monthly class fee to attempt this exam paper.", "error")}
                          className="w-full py-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                        >
                          <span>🔒 Class Fee Required to Attempt</span>
                        </button>
                      ) : submission ? (
                        <button
                          onClick={() => setActiveQuiz(quiz)}
                          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                        >
                          <span>🔄 Retake MCQ Challenge</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveQuiz(quiz)}
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-95"
                        >
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Start MCQ Challenge</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Interactive Sub-components / Modals */}
      <DigitalStudentCard />
      <VideoClassroom />
      <FeePaymentModal />
      <QuizExamPlayer />
      <CourseCompletionModal isOpen={showCertModal} onClose={() => setShowCertModal(false)} />
      <ProfileAvatarModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatar={currentStudent.avatar}
        onSaveAvatar={updateStudentAvatar}
        title="Update Student Profile Photo"
      />
    </div>
  );
};
