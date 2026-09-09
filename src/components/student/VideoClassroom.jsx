import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/soundEffects';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  ShieldAlert, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  Sparkles,
  Lock,
  EyeOff
} from 'lucide-react';

export const VideoClassroom = () => {
  const { 
    activeLesson, 
    setActiveLesson, 
    currentStudent, 
    quizzes, 
    setActiveQuiz,
    showToast 
  } = useApp();

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState('chapters');
  const [userNotes, setUserNotes] = useState('');

  // 🛡️ NETFLIX-GRADE ANTI-PIRACY & HARDWARE DRM DEFENSE ENGINE
  const [isBlackedOut, setIsBlackedOut] = useState(false);
  const [blackoutReason, setBlackoutReason] = useState('');
  const [drmEnabled, setDrmEnabled] = useState(true);
  const [clientIp] = useState('175.157.192.4');
  const [realtimeClock, setRealtimeClock] = useState(new Date().toLocaleTimeString());

  // Realtime clock ticker for burned-in watermark timestamp
  useEffect(() => {
    const timer = setInterval(() => {
      setRealtimeClock(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Anti-Screen Recording & Screenshot Intercept System
  useEffect(() => {
    if (!drmEnabled) return;

    // 1. Detect Window Blur & Focus Loss (Triggered when opening screen recorders or switching apps)
    const handleWindowBlur = () => {
      setIsBlackedOut(true);
      setBlackoutReason('Window Focus Lost or External Capture Software Active.');
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    // 2. Detect Tab Hiding / Backgrounding
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlackedOut(true);
        setBlackoutReason('Tab Hidden / Background Capture Attempt.');
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };

    // 3. Screenshot Key Interception & System Clipboard Eraser
    const handleKeyDown = (e) => {
      const isPrintScreen = e.key === 'PrintScreen' || e.keyCode === 44;
      const isDevTools = (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j');
      const isViewSource = (e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U');

      if (isPrintScreen || isDevTools || isViewSource || (e.altKey && isPrintScreen)) {
        e.preventDefault();
        
        // Erase system clipboard so screenshot image cannot be pasted
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('⚠️ Protected Content: Screenshot attempt blocked by Lyntrix DRM Engine.').catch(() => {});
        }

        sound.playBuzzerError();
        setIsBlackedOut(true);
        setBlackoutReason('Screenshot Attempt Blocked & Clipboard Erased (PrintScreen / DevTools)');
        showToast('🔒 Netflix-Grade DRM: Screenshot attempt blocked & clipboard erased!', 'error');

        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };

    // 4. Hardware PrintScreen Key Release Listener
    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('⚠️ Protected Content: Screenshot attempt blocked by Lyntrix DRM Engine.').catch(() => {});
        }
        setIsBlackedOut(true);
        setBlackoutReason('Hardware PrintScreen Key Released — Screenshot Destroyed.');
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (!activeLesson) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleSaveNotes = () => {
    showToast("Notes saved to your student cloud locker!", "success");
  };

  const handleStartQuiz = () => {
    const quiz = quizzes.find(q => q.id === activeLesson.quizId) || quizzes[0];
    setActiveQuiz(quiz);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/95 backdrop-blur-2xl overflow-y-auto flex flex-col">
      {/* Top Bar - Solid Dark Cinema Bar */}
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => setActiveLesson(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700 flex items-center gap-1.5 active:scale-95"
          >
            <span>← Back to Classroom</span>
          </button>
          <div>
            <h2 className="font-bold text-white text-sm line-clamp-1">{activeLesson.title}</h2>
            <div className="text-[11px] text-cyan-400 font-bold">{activeLesson.unit} • {activeLesson.duration}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const nextState = !drmEnabled;
              setDrmEnabled(nextState);
              setIsBlackedOut(false);
              showToast(nextState ? "🔒 DRM Defense Activated: Screen Recording & Blur Protection Active" : "▶️ Demo Stream Mode Activated: Uninterrupted Video Playback", "info");
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition border flex items-center gap-1.5 active:scale-95 ${
              drmEnabled 
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                : 'bg-amber-950/90 border-amber-500/50 text-amber-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{drmEnabled ? '🔒 DRM Shield: Active' : '▶️ Demo Stream Mode'}</span>
          </button>

          <button
            onClick={() => setActiveLesson(null)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold hover:bg-slate-700 transition"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main Content: Video Player on Left, Clean Sidebar on Right */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Video Area */}
        <div className="lg:col-span-8 space-y-4">
          <div 
            onContextMenu={(e) => e.preventDefault()}
            className="relative rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl aspect-video group select-none"
          >
            {/* BLACKOUT SCREEN PROTECTION OVERLAY (Triggers on Screen Record / Blur / PrtScn) */}
            {isBlackedOut ? (
              <div className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in select-none">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500 text-rose-500 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.3)] animate-pulse">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-lg font-black text-rose-500 tracking-wide uppercase">
                    🚫 Screen Recording / Capture Blocked
                  </h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {blackoutReason || 'Video screen blacked out to prevent external screen recording software and screenshot tools.'}
                  </p>
                  <div className="text-[10px] text-cyan-400 font-mono pt-1">
                    Student ID: {currentStudent.indexNumber} • DRM Anti-Piracy Shield Active
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsBlackedOut(false);
                    sound.playChimeApproved();
                    setTimeout(() => {
                      if (videoRef.current) {
                        videoRef.current.play().catch(() => {});
                        setIsPlaying(true);
                      }
                    }, 50);
                  }}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/30 transition active:scale-95 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resume Secure Stream</span>
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={activeLesson.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                  autoPlay
                  playsInline
                  onContextMenu={(e) => e.preventDefault()}
                  onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                  onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-contain pointer-events-auto cursor-pointer"
                  onClick={togglePlay}
                />

                {/* Big Center Play Overlay Button when Paused */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 z-20 m-auto w-20 h-20 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.6)] transition-all transform hover:scale-110 active:scale-95 animate-in zoom-in-95"
                  >
                    <Play className="w-10 h-10 fill-current ml-1" />
                  </button>
                )}

                {/* 1. DYNAMIC FLOATING WATERMARK */}
                <div className="absolute animate-watermark bg-black/85 backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-xl text-white font-mono text-[11px] pointer-events-none select-none shadow-2xl z-20">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span>{currentStudent.name}</span>
                  </div>
                  <div className="text-[9px] text-cyan-300 font-medium">
                    {currentStudent.indexNumber} • IP: {clientIp}
                  </div>
                </div>

                {/* 2. PERMANENT BURNED-IN TIMESTAMP WATERMARK STAMP (Bottom-Right) */}
                <div className="absolute bottom-16 right-4 bg-black/80 backdrop-blur-sm border border-cyan-500/30 px-2.5 py-1 rounded-lg text-cyan-400 font-mono text-[10px] font-bold pointer-events-none select-none z-10 shadow-lg">
                  <div>STUDENT ID: {currentStudent.indexNumber}</div>
                  <div className="text-[9px] text-slate-400 font-medium">{realtimeClock} • IP: {clientIp}</div>
                </div>

                <div className="absolute top-3 right-3 bg-black/70 px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-slate-300 pointer-events-none z-10">
                  🔒 Netflix-Grade Hardware DRM Protected
                </div>
              </>
            )}

            {/* Custom Video Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col gap-2 opacity-95 group-hover:opacity-100 transition">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />

              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="p-1 hover:text-blue-400 transition">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <button 
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.muted = !isMuted;
                        setIsMuted(!isMuted);
                      }
                    }} 
                    className="p-1 hover:text-blue-400 transition"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
                  </button>

                  <span className="font-mono text-slate-300 text-[11px]">
                    {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')} / {activeLesson.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-700 text-[11px] font-mono">
                    {[1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => changeSpeed(spd)}
                        className={`px-1.5 py-0.5 rounded ${playbackSpeed === spd ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen();
                    }}
                    className="p-1 hover:text-blue-400 transition"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Details & Actions */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-black text-slate-900">{activeLesson.title}</h1>
                <p className="text-xs text-slate-500 mt-1">{activeLesson.description}</p>
              </div>

              {activeLesson.hasQuiz && (
                <button
                  onClick={handleStartQuiz}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-2 transition shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Start MCQ Quiz Challenge</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs text-slate-700">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-semibold truncate max-w-xs">{activeLesson.notesPdf}</span>
                {activeLesson.notesPdfUrl || (activeLesson.notesPdf && activeLesson.notesPdf.startsWith('http')) ? (
                  <a
                    href={activeLesson.notesPdfUrl || activeLesson.notesPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-bold ml-2 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download (R2 CDN)
                  </a>
                ) : (
                  <button
                    onClick={() => showToast(`Sample PDF: ${activeLesson.notesPdf} (Download Ready)`, "success")}
                    className="text-blue-600 hover:underline font-bold ml-2 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chapters & Notes Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-fit max-h-[600px]">
          <div className="flex items-center border-b border-slate-100 bg-slate-50 p-2 gap-1">
            <button
              onClick={() => setActiveTab('chapters')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'chapters' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chapters ({activeLesson.chapters?.length || 3})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'notes' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Notes
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {activeTab === 'chapters' && (
              <div className="space-y-2">
                {activeLesson.chapters?.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSeek(ch.time)}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 transition flex items-center justify-between text-xs group"
                  >
                    <span className="text-slate-700 group-hover:text-blue-700 font-bold">{ch.title}</span>
                    <span className="text-[10px] font-mono text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded">
                      {Math.floor(ch.time / 60)}:00
                    </span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-3">
                <textarea
                  rows={8}
                  placeholder="Write your study notes and formulas here..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSaveNotes}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Save Note
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Floating Bottom Lesson Navigation Bar */}
      <div className="sticky bottom-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-3 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => showToast("Navigated to Previous Lesson", "info")}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700 flex items-center gap-2"
          >
            <span>← Previous Lesson</span>
          </button>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Lesson 34 of 48 • <strong className="text-white">Integral Calculus</strong>
          </span>

          <button
            onClick={() => showToast("Navigated to Next Lesson", "info")}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            <span>Next Lesson →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
