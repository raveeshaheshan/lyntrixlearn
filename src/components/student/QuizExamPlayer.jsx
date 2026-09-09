import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  ArrowRight,
  Sparkles,
  Volume2,
  Lock,
  Save,
  Flag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';

export const QuizExamPlayer = () => {
  const { activeQuiz, setActiveQuiz, submitQuizAnswers, showToast, currentStudent } = useApp();

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(activeQuiz ? activeQuiz.durationMinutes * 60 : 900);
  const [score, setScore] = useState(0);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState(null);

  const storageKey = activeQuiz ? `lyntrix_quiz_draft_${activeQuiz.id}_${currentStudent?.id || 'guest'}` : null;

  useEffect(() => {
    if (!activeQuiz || !storageKey) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (parsed.selectedAnswers && Object.keys(parsed.selectedAnswers).length > 0) {
            setSelectedAnswers(parsed.selectedAnswers);
          }
          if (parsed.flaggedQuestions) {
            setFlaggedQuestions(parsed.flaggedQuestions);
          }
          if (typeof parsed.timeLeft === 'number' && parsed.timeLeft > 0 && parsed.timeLeft <= activeQuiz.durationMinutes * 60) {
            setTimeLeft(parsed.timeLeft);
          }
          if (parsed.lastSaved) {
            setLastAutoSavedAt(parsed.lastSaved);
          }
          showToast("Restored your auto-saved answers & timer!", "info");
        }
      }
    } catch (err) {
      console.warn("Could not load auto-saved quiz draft:", err);
    } finally {
      setDraftLoaded(true);
    }
  }, [activeQuiz?.id, storageKey]);

  useEffect(() => {
    if (!draftLoaded || !activeQuiz || !storageKey || isSubmitted) return;

    const saveTimer = setTimeout(() => {
      try {
        const payload = {
          quizId: activeQuiz.id,
          studentId: currentStudent?.id || 'guest',
          selectedAnswers,
          flaggedQuestions,
          timeLeft,
          lastSaved: Date.now()
        };
        localStorage.setItem(storageKey, JSON.stringify(payload));
        setLastAutoSavedAt(payload.lastSaved);
      } catch (err) {
        console.warn("Auto-save failed:", err);
      }
    }, 250);

    return () => clearTimeout(saveTimer);
  }, [selectedAnswers, flaggedQuestions, timeLeft, draftLoaded, activeQuiz, storageKey, isSubmitted]);

  useEffect(() => {
    if (!activeQuiz || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeQuiz, isSubmitted, selectedAnswers]);

  if (!activeQuiz) return null;

  const requiredThresholdSec = (Number(activeQuiz.submitRequiredTime) || 0) * 60;
  const isEarlySubmitLocked = !isSubmitted && requiredThresholdSec > 0 && timeLeft > requiredThresholdSec;
  const remainingToUnlockSec = Math.max(0, timeLeft - requiredThresholdSec);
  const unlockMins = Math.floor(remainingToUnlockSec / 60);
  const unlockSecs = remainingToUnlockSec % 60;

  const toggleFlagQuestion = (questionId) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
    sound.playClick();
  };

  const scrollToQuestion = (qId) => {
    sound.playClick();
    const el = document.getElementById(`quiz-question-${qId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (isSubmitted) return;
    sound.playClick();
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = (isAutoSubmit = false) => {
    if (!isAutoSubmit && isEarlySubmitLocked) {
      sound.playClick();
      showToast(`Submission locked! Early submit unlocks in ${unlockMins}m ${unlockSecs.toString().padStart(2, '0')}s (in the final ${activeQuiz.submitRequiredTime} min window).`, 'error');
      return;
    }

    if (storageKey) {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {}
    }

    let calculatedScore = 0;
    activeQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        calculatedScore += 1;
      }
    });

    const marksPerQuestion = activeQuiz.totalMarks / activeQuiz.questions.length;
    const finalScore = Math.round(calculatedScore * marksPerQuestion);
    const percentage = Math.round((finalScore / activeQuiz.totalMarks) * 100);

    setScore(finalScore);
    setIsSubmitted(true);
    sound.playTadaSuccess();

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch (e) {}

    submitQuizAnswers({
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      batchId: activeQuiz.batchId,
      instructorId: activeQuiz.instructorId,
      score: finalScore,
      totalMarks: activeQuiz.totalMarks,
      percentage
    });
  };

  const handleResetQuiz = () => {
    if (storageKey) {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {}
    }
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setIsSubmitted(false);
    setTimeLeft(activeQuiz.durationMinutes * 60);
    setScore(0);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md overflow-y-auto overscroll-contain">
      <div className="min-h-full w-full flex justify-center items-start p-2.5 sm:p-4 md:p-6 lg:p-8">
        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl max-w-3xl w-full shadow-2xl relative flex flex-col my-2 sm:my-6 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-slate-200/80 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-600 block truncate">
                  {activeQuiz.subject} • Assessment Arena
                </span>
                <h2 className="text-sm sm:text-base font-black text-slate-900 truncate">
                  {activeQuiz.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {!isSubmitted && (
                <div 
                  title="All selected answers are auto-saved in local cache" 
                  className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-emerald-700 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Auto-Saved</span>
                </div>
              )}

              {!isSubmitted && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-black border shadow-inner transition ${
                  timeLeft < 180 
                    ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                  <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
                </div>
              )}

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveQuiz(null);
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition active:scale-95 font-bold text-sm"
                title="Close & Resume Later"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {!isSubmitted && requiredThresholdSec > 0 && (
              isEarlySubmitLocked ? (
                <div className="p-3.5 sm:p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-950">Minimum Exam Time Enforced</div>
                      <div className="text-[11px] text-amber-800 leading-tight">
                        Early submission is locked. Submissions unlock during the final <strong>{activeQuiz.submitRequiredTime} minutes</strong>.
                      </div>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto text-center bg-amber-200/70 border border-amber-300 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-amber-950 flex items-center justify-center gap-1.5 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Unlocks in {unlockMins}m {unlockSecs.toString().padStart(2, '0')}s</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Submit Window Open:</span> You are now in the final {activeQuiz.submitRequiredTime} minutes. You may review your answers and submit!
                  </div>
                </div>
              )
            )}

            <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 font-bold">
                <span className="flex items-center gap-1.5">
                  <span>Question Navigator:</span>
                  <span className="text-[11px] text-slate-400 font-normal">({Object.keys(selectedAnswers).length}/{activeQuiz.questions.length} Answered)</span>
                </span>
                <div className="flex items-center gap-3 text-[11px] font-semibold flex-wrap">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span> Answered</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block"></span> Flagged</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-300 inline-block"></span> Unattempted</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {activeQuiz.questions.map((q, qIndex) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions[q.id];

                  let navStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';
                  if (isFlagged) {
                    navStyle = 'bg-amber-100 border-amber-400 text-amber-900 font-bold';
                  } else if (isAnswered) {
                    navStyle = 'bg-emerald-500 border-emerald-600 text-white font-bold shadow-xs';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => scrollToQuestion(q.id)}
                      className={`w-8 h-8 rounded-xl text-xs border font-mono transition flex items-center justify-center active:scale-95 ${navStyle}`}
                      title={`Jump to Question ${qIndex + 1}`}
                    >
                      {qIndex + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {isSubmitted && (
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 p-6 rounded-3xl border border-emerald-200 text-center space-y-2 animate-in fade-in zoom-in-95">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Quiz Score: {score} / {activeQuiz.totalMarks}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
                  {score >= (activeQuiz.totalMarks * 0.7) 
                    ? "🎉 Outstanding mastery! Keep up the brilliant performance." 
                    : "💡 Review the detailed Sinhala explanations below to strengthen your fundamentals."}
                </p>
              </div>
            )}

            <div className="space-y-6">
              {activeQuiz.questions.map((q, qIndex) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCorrect = selectedAnswers[q.id] === q.correctIndex;
                const isFlagged = flaggedQuestions[q.id];

                return (
                  <div 
                    key={q.id} 
                    id={`quiz-question-${q.id}`}
                    className="p-4 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-4 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-2.5 leading-snug">
                        <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                          Q{qIndex + 1}
                        </span>
                        <span className="break-words">{q.question}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isSubmitted && (
                          <button
                            type="button"
                            onClick={() => toggleFlagQuestion(q.id)}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${
                              isFlagged 
                                ? 'bg-amber-100 border-amber-300 text-amber-800' 
                                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                            }`}
                            title={isFlagged ? "Remove Flag" : "Flag for Review"}
                          >
                            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current text-amber-600' : ''}`} />
                            <span className="hidden sm:inline text-[10px]">{isFlagged ? 'Flagged' : 'Flag'}</span>
                          </button>
                        )}

                        {isSubmitted && (
                          <div>
                            {isCorrect ? (
                              <span className="flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-100 px-2.5 py-1 rounded-lg">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Correct</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-rose-700 text-xs font-bold bg-rose-100 px-2.5 py-1 rounded-lg">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Incorrect</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {q.audioUrl && (
                      <div className="p-3 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-xl border border-purple-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-950">
                          <div className="w-6 h-6 rounded-lg bg-purple-200 text-purple-800 flex items-center justify-center shrink-0">
                            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                          </div>
                          <span>Listen to Audio Question Track:</span>
                        </div>
                        <audio controls src={q.audioUrl} className="h-8 w-full sm:max-w-xs outline-none">
                          Your browser does not support audio playback.
                        </audio>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[q.id] === optIdx;
                        let optionStyle = 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-blue-50/40';

                        if (isSubmitted) {
                          if (optIdx === q.correctIndex) {
                            optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500';
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-1 ring-rose-400';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-blue-50/90 border-blue-600 text-blue-950 font-bold shadow-xs ring-1 ring-blue-500';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm text-left transition flex items-center gap-3 active:scale-[0.99] min-h-[44px] break-words ${optionStyle}`}
                          >
                            <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {['A', 'B', 'C', 'D'][optIdx]}
                            </span>
                            <span className="flex-1 leading-relaxed break-words">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && q.explanation && (
                      <div className="p-3.5 rounded-xl bg-blue-50/90 border border-blue-200 text-xs space-y-1">
                        <div className="font-bold text-blue-900 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>විවරණය (Explanation):</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-sans">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
              {isSubmitted ? (
                <button
                  onClick={handleResetQuiz}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Test</span>
                </button>
              ) : isEarlySubmitLocked ? (
                <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Early Submission Locked (Unlocks in {unlockMins}m {unlockSecs.toString().padStart(2, '0')}s)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      showToast(`Submission locked until the final ${activeQuiz.submitRequiredTime} minutes (in ${unlockMins}m ${unlockSecs.toString().padStart(2, '0')}s).`, "info");
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 border border-slate-300 text-slate-500 hover:bg-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed shadow-inner transition"
                  >
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span>Submit Locked</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleSubmitQuiz(false)}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition ml-auto active:scale-95"
                >
                  <span>Submit & View Marks</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {isSubmitted && (
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm text-center"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
