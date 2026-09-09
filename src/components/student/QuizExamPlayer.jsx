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
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';

export const QuizExamPlayer = () => {
  const { activeQuiz, setActiveQuiz, submitQuizAnswers, showToast } = useApp();

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(activeQuiz ? activeQuiz.durationMinutes * 60 : 900);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!activeQuiz || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, isSubmitted, selectedAnswers]);

  if (!activeQuiz) return null;

  const toggleFlagQuestion = (questionId) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
    sound.playClick();
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (isSubmitted) return;
    sound.playClick();
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    activeQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        calculatedScore += (activeQuiz.totalMarks / activeQuiz.questions.length);
      }
    });

    const finalScore = Math.round(calculatedScore);
    const percentage = Math.round((finalScore / activeQuiz.totalMarks) * 100);
    setScore(finalScore);
    setIsSubmitted(true);
    sound.playChimeApproved();

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
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setIsSubmitted(false);
    setTimeLeft(activeQuiz.durationMinutes * 60);
    setScore(0);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 my-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{activeQuiz.subject} • TIMED ASSESSMENT</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">{activeQuiz.title}</h2>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-xl text-blue-700 font-mono text-sm font-bold shadow-inner">
                <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
              </div>
            )}
            <button
              onClick={() => setActiveQuiz(null)}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Question Navigator Grid */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <span>Question Navigator:</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span> Answered</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block"></span> Flagged</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-300 inline-block"></span> Unattempted</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {activeQuiz.questions.map((q, qIndex) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isFlagged = flaggedQuestions[q.id];

              let navStyle = 'bg-white border-slate-300 text-slate-700';
              if (isFlagged) {
                navStyle = 'bg-amber-100 border-amber-400 text-amber-900 font-bold';
              } else if (isAnswered) {
                navStyle = 'bg-emerald-500 border-emerald-600 text-white font-bold shadow-sm';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => toggleFlagQuestion(q.id)}
                  className={`w-8 h-8 rounded-lg text-xs border font-mono transition flex items-center justify-center ${navStyle}`}
                  title={isFlagged ? `Question ${qIndex + 1} Flagged` : `Question ${qIndex + 1}`}
                >
                  {qIndex + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Score Banner if Submitted */}
        {isSubmitted && (
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Quiz Score: {score} / {activeQuiz.totalMarks}</h3>
            <p className="text-xs text-slate-600">
              {score >= (activeQuiz.totalMarks * 0.7) 
                ? "🎉 Outstanding mastery! Keep up the brilliant performance." 
                : "💡 Review the detailed Sinhala explanations below to strengthen your fundamentals."}
            </p>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {activeQuiz.questions.map((q, qIndex) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCorrect = selectedAnswers[q.id] === q.correctIndex;

            return (
              <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-bold text-slate-900 flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      Q{qIndex + 1}
                    </span>
                    <span>{q.question}</span>
                  </div>

                  {isSubmitted && (
                    <div>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-100 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-700 text-xs font-bold bg-rose-100 px-2.5 py-1 rounded-lg">
                          <XCircle className="w-3.5 h-3.5" />
                          Incorrect
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Audio Question / Listening Comprehension Track */}
                {q.audioUrl && (
                  <div className="p-3 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-xl border border-purple-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-950">
                      <div className="w-6 h-6 rounded-lg bg-purple-200 text-purple-800 flex items-center justify-center shrink-0">
                        <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                      </div>
                      <span>Listen to Audio Track / Listening Clue:</span>
                    </div>
                    <audio controls src={q.audioUrl} className="h-8 max-w-sm w-full outline-none">
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                )}

                {/* MCQ Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100';

                    if (isSubmitted) {
                      if (optIdx === q.correctIndex) {
                        optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-sm';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3 rounded-xl border text-xs text-left transition flex items-center gap-3 ${optionStyle}`}
                      >
                        <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                          {['A', 'B', 'C', 'D'][optIdx]}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {isSubmitted && (
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-1">
                    <div className="font-bold text-blue-800 flex items-center gap-1.5">
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

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {isSubmitted ? (
            <button
              onClick={handleResetQuiz}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Test</span>
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 transition ml-auto"
            >
              <span>Submit & View Marks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {isSubmitted && (
            <button
              onClick={() => setActiveQuiz(null)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
