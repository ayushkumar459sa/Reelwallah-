import React, { useState, useEffect, useRef } from 'react';
import type { MockTest, TestQuestion, TestSubmission } from '../types.js';
import { useAuth } from '../context/AuthContext.js';
import {
  FileCheck,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Crown,
  ChevronRight,
  Check,
  AlertTriangle,
  History,
  X,
  BookOpen,
  Flame,
  Zap,
  Trophy,
  Play,
  Lightbulb,
  CheckCircle,
  BarChart2,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MockTestsViewProps {
  onOpenAuth: () => void;
  onOpenSubscription: () => void;
}

export const MockTestsView: React.FC<MockTestsViewProps> = ({
  onOpenAuth,
  onOpenSubscription
}) => {
  const { user, token, isLoggedIn, refreshUser } = useAuth();
  const [tests, setTests] = useState<MockTest[]>([]);
  const [filterType, setFilterType] = useState<string>('All');
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(18);
  const [isLoading, setIsLoading] = useState(false);

  // Active Test & Mode State
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [examMode, setExamMode] = useState<'quiz' | 'cbt'>('quiz'); // Quiz mode by default (instant start!)
  const [instantFeedback, setInstantFeedback] = useState<boolean>(true); // Show explanation & check immediately
  
  // Flattened questions for Quiz mode
  const [quizQuestions, setQuizQuestions] = useState<TestQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [quizStreak, setQuizStreak] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);

  // CBT multi-section tracking
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Student responses: questionId -> { selectedOption?: number, numericalAnswer?: number, status, isAnswerChecked?: boolean }
  const [responses, setResponses] = useState<
    Record<
      string,
      {
        selectedOption?: number;
        numericalAnswer?: number;
        status: 'not_visited' | 'not_answered' | 'answered' | 'marked_for_review' | 'answered_and_marked';
        isAnswerChecked?: boolean;
        isCorrect?: boolean;
      }
    >
  >({});

  // Countdown timer
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Completed submission & solution review
  const [submissionResult, setSubmissionResult] = useState<TestSubmission | null>(null);
  const [showSolutions, setShowSolutions] = useState<boolean>(false);
  const [detailedTestSolutions, setDetailedTestSolutions] = useState<MockTest | null>(null);

  // Past test history
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [testHistory, setTestHistory] = useState<TestSubmission[]>([]);

  // Numerical answer input in quiz
  const [numericalInput, setNumericalInput] = useState<string>('');

  const fetchTests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tests');
      const data = await res.json();
      if (data.tests) {
        setTests(data.tests);
      }
    } catch (err) {
      console.error('Failed to load tests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/my-test-history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.history) {
        setTestHistory(data.history);
      }
    } catch (err) {
      console.error('Failed to fetch test history:', err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Timer tick during active quiz/exam
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTestActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleFinalSubmit(); // Auto-submit when time expires!
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestActive, timeRemaining]);

  // Instant Start Quiz handler
  const handleStartQuiz = async (testId: string, mode: 'quiz' | 'cbt' = 'quiz') => {
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }

    try {
      const res = await fetch(`/api/tests/${testId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.requiresSubscription) {
          alert('You have used all 10 free mock test attempts! Upgrade to RW JEE Pro (₹49/month) for unlimited attempts.');
          onOpenSubscription();
          return;
        }
        alert(data.error || 'Failed to start quiz.');
        return;
      }

      const fullTest: MockTest = data.test;
      setActiveTest(fullTest);
      setExamMode(mode);

      // Collect all questions sequentially for rapid quiz flow
      const flattened: TestQuestion[] = [];
      fullTest.sections.forEach(sec => {
        flattened.push(...sec.questions);
      });
      setQuizQuestions(flattened);
      setCurrentQuizIndex(0);
      setQuizStreak(0);
      setQuizScore(0);
      setNumericalInput('');

      setActiveSectionIndex(0);
      setActiveQuestionIndex(0);
      setTimeRemaining(fullTest.durationMinutes * 60);
      setIsTestActive(true);
      setSubmissionResult(null);
      setShowSolutions(false);

      // Initialize responses
      const initialResponses: Record<string, any> = {};
      flattened.forEach((q, idx) => {
        initialResponses[q.id] = {
          status: idx === 0 ? 'not_answered' : 'not_visited',
          isAnswerChecked: false
        };
      });
      setResponses(initialResponses);
    } catch (err) {
      console.error('Error starting quiz:', err);
      alert('Unable to load quiz. Please check network connection.');
    }
  };

  // Select Option in Quiz Mode with Instant Feedback
  const handleSelectQuizOption = (optionIndex: number) => {
    const q = quizQuestions[currentQuizIndex];
    if (!q) return;

    const isCorrect = optionIndex === q.correctOption;

    // Update response
    setResponses(prev => ({
      ...prev,
      [q.id]: {
        selectedOption: optionIndex,
        status: 'answered',
        isAnswerChecked: instantFeedback,
        isCorrect
      }
    }));

    if (instantFeedback) {
      if (isCorrect) {
        const newStreak = quizStreak + 1;
        setQuizStreak(newStreak);
        setQuizScore(prev => prev + q.marksCorrect);

        // Streak Confetti celebration
        if (newStreak >= 3) {
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.6 }
          });
        }
      } else {
        setQuizStreak(0);
        setQuizScore(prev => Math.max(0, prev + q.marksIncorrect));
      }
    }
  };

  // Submit numerical answer in Quiz Mode
  const handleCheckNumericalAnswer = () => {
    const q = quizQuestions[currentQuizIndex];
    if (!q || numericalInput.trim() === '') return;

    const val = parseFloat(numericalInput.trim());
    const isCorrect = Math.abs(val - (q.correctNumerical ?? 0)) < 0.01;

    setResponses(prev => ({
      ...prev,
      [q.id]: {
        numericalAnswer: val,
        status: 'answered',
        isAnswerChecked: instantFeedback,
        isCorrect
      }
    }));

    if (instantFeedback) {
      if (isCorrect) {
        setQuizStreak(prev => prev + 1);
        setQuizScore(prev => prev + q.marksCorrect);
      } else {
        setQuizStreak(0);
        setQuizScore(prev => Math.max(0, prev + q.marksIncorrect));
      }
    }
  };

  // Move Next in Quiz
  const handleQuizNext = () => {
    setNumericalInput('');
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  // Move Prev in Quiz
  const handleQuizPrev = () => {
    setNumericalInput('');
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(prev => prev - 1);
    }
  };

  // CBT Mode navigation & selection
  const currentSection = activeTest?.sections[activeSectionIndex];
  const currentQuestion = currentSection?.questions[activeQuestionIndex];

  const handleSelectCBTOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        selectedOption: optionIndex,
        status: 'answered'
      }
    }));
  };

  const handleClearResponse = () => {
    if (!currentQuestion) return;
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        status: 'not_answered'
      }
    }));
  };

  const handleMarkForReview = () => {
    if (!currentQuestion) return;
    const current = responses[currentQuestion.id];
    const isAnswered = current?.selectedOption !== undefined || current?.numericalAnswer !== undefined;

    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...current,
        status: isAnswered ? 'answered_and_marked' : 'marked_for_review'
      }
    }));
    handleCBTNextQuestion();
  };

  const handleCBTNextQuestion = () => {
    if (!currentSection) return;
    if (activeQuestionIndex < currentSection.questions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
    } else if (activeTest && activeSectionIndex < activeTest.sections.length - 1) {
      setActiveSectionIndex(prev => prev + 1);
      setActiveQuestionIndex(0);
    }
  };

  const handleCBTPrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(prev => prev - 1);
    } else if (activeSectionIndex > 0 && activeTest) {
      const prevSec = activeTest.sections[activeSectionIndex - 1];
      setActiveSectionIndex(prev => prev - 1);
      setActiveQuestionIndex(prevSec.questions.length - 1);
    }
  };

  // Final Submit Test
  const handleFinalSubmit = async () => {
    if (!activeTest || !token) return;
    setIsSubmitting(true);

    try {
      const answersPayload: Record<string, any> = {};
      Object.entries(responses).forEach(([qId, val]) => {
        if (val.selectedOption !== undefined) {
          answersPayload[qId] = val.selectedOption;
        } else if (val.numericalAnswer !== undefined) {
          answersPayload[qId] = val.numericalAnswer;
        }
      });

      const timeSpentSeconds = (activeTest.durationMinutes * 60) - timeRemaining;

      const res = await fetch(`/api/tests/${activeTest.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          answers: answersPayload,
          responses: responses,
          timeSpentSeconds: Math.max(30, timeSpentSeconds)
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsTestActive(false);
        setShowSubmitModal(false);
        setSubmissionResult(data.submission);
        await refreshUser();

        // Celebration Confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        alert(data.error || 'Failed to submit test.');
      }
    } catch (err) {
      console.error('Error submitting test:', err);
      alert('Network issue during test submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format time (seconds to HH:MM:SS)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // VIEW 1: ACTIVE INSTANT QUIZ MODE
  // ==========================================
  if (isTestActive && examMode === 'quiz' && activeTest) {
    const q = quizQuestions[currentQuizIndex];
    const currentResp = responses[q?.id];
    const isChecked = Boolean(currentResp?.isAnswerChecked);
    const progressPercent = ((currentQuizIndex + 1) / quizQuestions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto space-y-4 pb-20 animate-in fade-in duration-150">
        {/* Top Quiz Header */}
        <div className="bg-[#171C34] border border-[#252D54] rounded-3xl p-4 sm:p-5 shadow-xl flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Exit quiz? Your progress on this session will be submitted.')) {
                  handleFinalSubmit();
                }
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Exit Quiz"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#37D9F5]" />
                <span>{activeTest.examType} Instant Quiz</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
                {activeTest.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Streak Counter */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold font-mono">
              <Flame className="w-4 h-4 fill-orange-400" />
              <span>{quizStreak} Streak</span>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#101426] border border-[#252D54] text-xs font-bold font-mono text-[#37D9F5]">
              <Timer className="w-3.5 h-3.5" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Question Counter */}
        <div className="bg-[#171C34] border border-[#252D54] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">
              Question {currentQuizIndex + 1} of {quizQuestions.length}
            </span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={instantFeedback}
                  onChange={e => setInstantFeedback(e.target.checked)}
                  className="rounded bg-[#101426] border-[#252D54] text-[#7857FF] focus:ring-0"
                />
                <span>Instant Answer Reveal</span>
              </label>
              <span className="text-[#37D9F5] font-bold font-mono">
                {Math.round(progressPercent)}% Done
              </span>
            </div>
          </div>

          <div className="w-full h-2 rounded-full bg-[#101426] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7857FF] to-[#37D9F5] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        {q && (
          <div className="bg-[#171C34] border border-[#252D54] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white relative">
            {/* Subject and Marks Badge */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#7857FF]/20 border border-[#7857FF]/40 text-[#37D9F5] text-xs font-bold">
                {q.difficulty} • Question #{q.questionNumber}
              </span>

              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <span className="text-emerald-400">+{q.marksCorrect} Marks</span>
                <span className="text-rose-400">{q.marksIncorrect} Negative</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed font-sans">
              {q.questionText}
            </div>

            {/* Options List */}
            {q.type === 'single_choice' && q.options && (
              <div className="space-y-3 pt-2">
                {q.options.map((optText, oIdx) => {
                  const isSelected = currentResp?.selectedOption === oIdx;
                  const isKey = oIdx === q.correctOption;

                  let styleClass = 'bg-[#101426] border-[#252D54] text-slate-200 hover:border-[#7857FF]/60 hover:bg-[#1a1f3d]';

                  if (isChecked) {
                    if (isKey) {
                      styleClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold ring-2 ring-emerald-500/30';
                    } else if (isSelected && !isKey) {
                      styleClass = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                    }
                  } else if (isSelected) {
                    styleClass = 'bg-[#7857FF]/25 border-[#37D9F5] text-white font-bold ring-2 ring-[#37D9F5]/40';
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isChecked}
                      onClick={() => handleSelectQuizOption(oIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between group ${styleClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#7857FF]/40">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{optText}</span>
                      </div>

                      {isChecked && isKey && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isChecked && isSelected && !isKey && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Numerical Input Type */}
            {q.type === 'numerical' && (
              <div className="p-4 rounded-2xl bg-[#101426] border border-[#252D54] space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Enter Numerical Answer (Integer or Decimal):
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={currentResp?.numericalAnswer !== undefined ? currentResp.numericalAnswer : numericalInput}
                    onChange={e => setNumericalInput(e.target.value)}
                    disabled={isChecked}
                    placeholder="e.g. 5"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-sm text-white focus:outline-none focus:border-[#37D9F5]"
                  />
                  {!isChecked && (
                    <button
                      onClick={handleCheckNumericalAnswer}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold shadow-md hover:brightness-110"
                    >
                      Check Answer
                    </button>
                  )}
                </div>

                {isChecked && (
                  <div className={`p-3 rounded-xl text-xs font-bold ${currentResp?.isCorrect ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
                    {currentResp?.isCorrect
                      ? `✓ Correct! Correct numerical answer: ${q.correctNumerical}`
                      : `✗ Incorrect. Correct numerical value: ${q.correctNumerical}`}
                  </div>
                )}
              </div>
            )}

            {/* Instant Solution & Formula Drawer (Revealed immediately upon answer) */}
            {isChecked && (
              <div className="p-4 rounded-2xl bg-[#101426] border border-[#7857FF]/40 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Key Formula & Step Explanation</span>
                </div>

                {q.keyFormula && (
                  <div className="p-2.5 rounded-xl bg-[#171C34] text-xs font-mono text-[#37D9F5]">
                    <strong>Formula:</strong> {q.keyFormula}
                  </div>
                )}

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {q.explanation}
                </p>
              </div>
            )}

            {/* Bottom Question Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-[#252D54]">
              <button
                disabled={currentQuizIndex === 0}
                onClick={handleQuizPrev}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold disabled:opacity-30 transition-all flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold"
              >
                Finish & Submit Quiz
              </button>

              <button
                onClick={handleQuizNext}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>{currentQuizIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Submit Confirmation Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-[#171C34] border border-[#252D54] rounded-3xl p-6 text-white shadow-2xl space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Submit & Calculate Rank?</span>
              </h3>
              <p className="text-xs text-slate-400">
                You will receive your detailed scorecard, accuracy, and estimated All India Rank percentile.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Continue Solving
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Evaluating...' : 'Yes, Complete Quiz'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: OFFICIAL CBT SIMULATOR MODE
  // ==========================================
  if (isTestActive && examMode === 'cbt' && activeTest && currentSection && currentQuestion) {
    return (
      <div className="max-w-7xl mx-auto space-y-4 pb-12">
        {/* NTA Top Bar */}
        <div className="bg-[#171C34] border border-[#252D54] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
          <div>
            <span className="text-[10px] text-[#37D9F5] font-bold tracking-widest uppercase">
              Official CBT Exam Simulator
            </span>
            <h2 className="text-base sm:text-lg font-bold truncate max-w-xl">
              {activeTest.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-[#101426] border border-[#252D54] flex items-center gap-2 text-sm font-mono font-bold text-[#37D9F5]">
              <Timer className="w-4 h-4" />
              <span>{formatTime(timeRemaining)}</span>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {activeTest.sections.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSectionIndex(idx);
                setActiveQuestionIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeSectionIndex === idx
                  ? 'bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white shadow-md'
                  : 'bg-[#171C34] text-slate-300 hover:bg-[#202747] border border-[#252D54]'
              }`}
            >
              {sec.name} ({sec.questions.length} Qs)
            </button>
          ))}
        </div>

        {/* Main CBT Workspace */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          {/* Question View */}
          <div className="flex-1 bg-[#171C34] border border-[#252D54] rounded-3xl p-6 shadow-xl text-white flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252D54]">
                <span className="text-xs font-bold text-slate-400">
                  Question #{currentQuestion.questionNumber} ({currentSection.name})
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  +{currentQuestion.marksCorrect} / {currentQuestion.marksIncorrect}
                </span>
              </div>

              <div className="text-sm sm:text-base leading-relaxed text-slate-100">
                {currentQuestion.questionText}
              </div>

              {currentQuestion.type === 'single_choice' && currentQuestion.options && (
                <div className="space-y-2.5 pt-2">
                  {currentQuestion.options.map((opt, oIdx) => {
                    const isSelected = responses[currentQuestion.id]?.selectedOption === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectCBTOption(oIdx)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-[#7857FF]/30 border-[#37D9F5] text-white font-bold'
                            : 'bg-[#101426] border-[#252D54] text-slate-300 hover:border-[#7857FF]/50'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[#252D54] mt-6">
              <div className="flex gap-2">
                <button
                  onClick={handleMarkForReview}
                  className="px-3.5 py-2 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-bold hover:bg-purple-500/30 border border-purple-500/40"
                >
                  Mark for Review & Next
                </button>
                <button
                  onClick={handleClearResponse}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-semibold"
                >
                  Clear Response
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCBTPrevQuestion}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCBTNextQuestion}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold"
                >
                  Save & Next
                </button>
              </div>
            </div>
          </div>

          {/* Question Palette Sidebar */}
          <div className="w-full md:w-72 bg-[#171C34] border border-[#252D54] rounded-3xl p-5 shadow-xl text-white space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Palette ({currentSection.name})
            </h4>

            <div className="grid grid-cols-5 gap-2">
              {currentSection.questions.map((q, idx) => {
                const resp = responses[q.id];
                const status = resp?.status || 'not_visited';
                let colorClass = 'bg-slate-700 text-slate-300';
                if (status === 'answered') colorClass = 'bg-emerald-500 text-black font-bold';
                else if (status === 'not_answered') colorClass = 'bg-orange-500 text-black font-bold';
                else if (status === 'marked_for_review') colorClass = 'bg-purple-500 text-white font-bold';

                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`w-9 h-9 rounded-xl text-xs flex items-center justify-center font-mono ${colorClass} ${
                      idx === activeQuestionIndex ? 'ring-2 ring-cyan-400' : ''
                    }`}
                  >
                    {q.questionNumber}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: SCORECARD & DETAILED SOLUTIONS
  // ==========================================
  if (submissionResult) {
    const accuracy = submissionResult.accuracy;

    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        {/* Scorecard Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-[#171C34] via-[#101426] to-[#1e1740] border border-[#252D54] p-6 sm:p-8 shadow-2xl text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Test Evaluated Successfully</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">{submissionResult.testTitle}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Completed in {Math.round(submissionResult.timeSpentSeconds / 60)} minutes • NTA Normalised Scoring
              </p>
            </div>

            <div className="flex items-center gap-4 bg-[#101426] p-4 rounded-2xl border border-[#252D54]">
              <div className="text-center">
                <div className="text-3xl font-black text-[#37D9F5] font-mono">
                  {submissionResult.score} <span className="text-sm text-slate-400 font-sans">/ {submissionResult.maxScore}</span>
                </div>
                <div className="text-[11px] text-slate-400">Final Score</div>
              </div>

              <div className="text-center pl-4 border-l border-[#252D54]">
                <div className="text-2xl font-black text-[#37D9F5] font-mono flex items-center justify-center gap-1">
                  <Award className="w-5 h-5 text-[#37D9F5]" />
                  <span>Verified</span>
                </div>
                <div className="text-[11px] text-[#A388FF] font-bold">NTA Standard</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-6 pt-6 border-t border-[#252D54] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-2xl bg-[#171C34]/60 border border-[#252D54]">
              <div className="text-xs text-slate-400">Accuracy</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{accuracy}%</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#171C34]/60 border border-[#252D54]">
              <div className="text-xs text-slate-400">Correct Answers</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">{submissionResult.correctCount} Qs</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#171C34]/60 border border-[#252D54]">
              <div className="text-xs text-slate-400">Incorrect</div>
              <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">{submissionResult.incorrectCount} Qs</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#171C34]/60 border border-[#252D54]">
              <div className="text-xs text-slate-400">Est. Percentile</div>
              <div className="text-lg font-bold text-[#A388FF] font-mono mt-0.5">
                {submissionResult.percentile ?? Math.min(99.9, Math.max(50, Math.round(accuracy * 0.98)))}%ile
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 justify-center sm:justify-start">
            <button
              onClick={() => setShowSolutions(!showSolutions)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{showSolutions ? 'Hide Detailed Solutions' : 'Review Step-by-Step Solutions'}</span>
            </button>

            <button
              onClick={() => {
                setSubmissionResult(null);
                setActiveTest(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
            >
              Back to Tests Catalog
            </button>
          </div>
        </div>

        {/* Detailed Solutions Review */}
        {showSolutions && activeTest && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#37D9F5]" />
              <span>Complete Answer Key & Step Derivations</span>
            </h3>

            {activeTest.sections.map(sec => (
              <div key={sec.id} className="space-y-3">
                <h4 className="text-sm font-bold text-[#A388FF] uppercase tracking-wider">{sec.name}</h4>
                {sec.questions.map(q => {
                  const studentResp = responses[q.id];
                  return (
                    <div key={q.id} className="p-5 rounded-2xl bg-[#171C34] border border-[#252D54] space-y-3 text-white">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold">Q#{q.questionNumber}: {q.questionText}</span>
                      </div>

                      {q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, oIdx) => {
                            const isAnswerKey = oIdx === q.correctOption;
                            const isStudentChoice = studentResp?.selectedOption === oIdx;
                            return (
                              <div
                                key={oIdx}
                                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                                  isAnswerKey
                                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                                    : isStudentChoice
                                    ? 'bg-rose-500/15 border-rose-500 text-rose-300 font-bold'
                                    : 'bg-[#101426] border-[#252D54] text-slate-400'
                                }`}
                              >
                                <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                                {isAnswerKey && <span>(Key)</span>}
                                {isStudentChoice && !isAnswerKey && <span>(Your choice)</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="p-3.5 rounded-2xl bg-[#101426] border border-[#252D54] text-xs space-y-1 font-mono">
                        {q.keyFormula && (
                          <div className="text-cyan-300"><strong>Formula:</strong> {q.keyFormula}</div>
                        )}
                        <div className="text-slate-300"><strong>Explanation:</strong> {q.explanation}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 4: QUIZ CATALOG & INSTANT LAUNCH
  // ==========================================
  const countAll = tests.length;
  const countMain = tests.filter(t => t.examType === 'JEE Main').length;
  const countAdv = tests.filter(t => t.examType === 'JEE Advanced').length;

  const filteredTests = tests.filter(t => {
    // 1. Exam Type Filter
    if (filterType !== 'All' && t.examType !== filterType) return false;

    // 2. Subject Filter
    if (subjectFilter !== 'All' && t.subject !== subjectFilter) return false;

    // 3. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchSub = t.subject.toLowerCase().includes(q);
      const matchSrc = t.source.toLowerCase().includes(q);
      if (!matchTitle && !matchSub && !matchSrc) return false;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#171C34] via-[#101426] to-[#1c163a] border border-[#252D54] p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7857FF]/20 border border-[#7857FF]/40 text-[#37D9F5] text-xs font-bold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>50+ RAPID QUIZZES & CBT SIMULATOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            IIT-JEE Rapid Quizzes & Mock Papers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Over 50+ genuine NTA & Advanced question papers in rapid quiz format. Instant formula derivation, streak combo scoring, and official CBT simulator.
          </p>
        </div>

        {/* Free Attempts Status Pill */}
        <div className="bg-[#101426] p-4 rounded-2xl border border-[#252D54] shrink-0 text-right space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Your Free Attempts</div>
          <div className="text-xl font-black text-[#37D9F5] font-mono">
            {user?.isSubscribed ? 'Unlimited Pro' : `${user?.freeAttemptsLeft ?? 10} of 10 Free`}
          </div>
          {!user?.isSubscribed && (
            <button
              onClick={onOpenSubscription}
              className="text-[10px] text-[#A388FF] hover:underline font-bold block"
            >
              Unlock Unlimited for ₹49/mo ➔
            </button>
          )}
        </div>
      </div>

      {/* Quick Launch Rapid Fire Banner */}
      <div className="bg-gradient-to-r from-[#7857FF]/20 via-[#37D9F5]/20 to-purple-500/20 border border-[#7857FF]/40 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#7857FF] text-white shadow-lg shadow-[#7857FF]/40">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              PW-Style Rapid Quiz Engine (Single Click Start)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Question-by-question view with instant green/red check, key formula steps, and live combo points.
            </p>
          </div>
        </div>

        {filteredTests.length > 0 && (
          <button
            onClick={() => handleStartQuiz(filteredTests[0].id, 'quiz')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Featured Quiz Now ➔</span>
          </button>
        )}
      </div>

      {/* Search & Subject Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setVisibleCount(18);
              }}
              placeholder="Search 50+ question papers by year, shift, or chapter (e.g. Rotational, Organic, 2024 Shift, Irodov)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#171C34] border border-[#252D54] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#7857FF] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* History Button */}
          <button
            onClick={() => {
              if (!isLoggedIn) onOpenAuth();
              else {
                fetchHistory();
                setShowHistoryModal(true);
              }
            }}
            className="px-4 py-2.5 rounded-2xl bg-[#171C34] hover:bg-[#202747] border border-[#252D54] text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 shrink-0"
          >
            <History className="w-4 h-4 text-[#37D9F5]" />
            <span>My Quiz History</span>
          </button>
        </div>

        {/* Primary Exam Type Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'All', label: 'All Question Papers', count: countAll },
              { id: 'JEE Main', label: 'JEE Main', count: countMain },
              { id: 'JEE Advanced', label: 'JEE Advanced', count: countAdv }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilterType(tab.id);
                  setVisibleCount(18);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  filterType === tab.id
                    ? 'bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white shadow-md'
                    : 'bg-[#171C34] hover:bg-[#202747] text-slate-300 border border-[#252D54]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  filterType === tab.id ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Subject Sub-filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {['All', 'Full Syllabus', 'Physics', 'Chemistry', 'Mathematics'].map(subj => (
              <button
                key={subj}
                onClick={() => {
                  setSubjectFilter(subj);
                  setVisibleCount(18);
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  subjectFilter === subj
                    ? 'bg-[#37D9F5]/20 text-[#37D9F5] border border-[#37D9F5]/50'
                    : 'text-slate-400 hover:text-slate-200 bg-white/5 border border-transparent'
                }`}
              >
                {subj === 'All' ? 'All Subjects' : subj}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Stats Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Showing <span className="font-bold text-white">{filteredTests.length}</span> question papers & quizzes available
          {filterType !== 'All' && <span> for <span className="text-[#37D9F5] font-semibold">{filterType}</span></span>}
          {subjectFilter !== 'All' && <span> ({subjectFilter})</span>}
        </div>
        <div className="text-[11px] text-slate-500">
          Click any quiz to start instantly
        </div>
      </div>

      {/* Empty State when filters yield no result */}
      {filteredTests.length === 0 ? (
        <div className="rounded-3xl bg-[#171C34] border border-[#252D54] p-12 text-center space-y-4">
          <FileCheck className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No question papers match your filter</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try clearing your search query or switching subject filters to view more of our 50+ question papers.
          </p>
          <button
            onClick={() => {
              setFilterType('All');
              setSubjectFilter('All');
              setSearchQuery('');
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        /* Tests Catalog Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTests.slice(0, visibleCount).map(test => (
            <div
              key={test.id}
              className="rounded-3xl bg-[#171C34] border border-[#252D54] p-6 shadow-xl hover:border-[#7857FF]/60 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      test.examType === 'JEE Advanced'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-[#7857FF]/20 text-[#A388FF] border border-[#7857FF]/40'
                    }`}>
                      {test.examType}
                    </span>

                    <span className="text-[10px] font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                      {test.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-cyan-300 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-[#37D9F5]" />
                    <span>NTA Pattern</span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#37D9F5] transition-colors leading-snug">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{test.source}</p>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-[#101426] border border-[#252D54]">
                    <div className="text-slate-400 text-[10px]">Duration</div>
                    <div className="font-bold text-white font-mono">{test.durationMinutes}m</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#101426] border border-[#252D54]">
                    <div className="text-slate-400 text-[10px]">Questions</div>
                    <div className="font-bold text-white font-mono">{test.totalQuestions} Qs</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#101426] border border-[#252D54]">
                    <div className="text-slate-400 text-[10px]">Max Marks</div>
                    <div className="font-bold text-[#37D9F5] font-mono">{test.totalMarks}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#252D54] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleStartQuiz(test.id, 'cbt')}
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all shrink-0"
                  title="Full Screen Official NTA 3-Hour CBT Simulator"
                >
                  CBT Simulator
                </button>

                <button
                  onClick={() => handleStartQuiz(test.id, 'quiz')}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Rapid Quiz ➔</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination / Load More */}
      {visibleCount < filteredTests.length && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setVisibleCount(prev => prev + 18)}
            className="px-6 py-3 rounded-2xl bg-[#171C34] hover:bg-[#202747] border border-[#252D54] text-xs font-bold text-white transition-all shadow-lg flex items-center gap-2"
          >
            <span>Load More Question Papers ({filteredTests.length - visibleCount} remaining)</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setVisibleCount(filteredTests.length)}
            className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-[#252D54] text-xs font-semibold text-slate-300 transition-all"
          >
            Show All ({filteredTests.length})
          </button>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#101426] border border-[#252D54] rounded-3xl p-6 text-white shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-[#37D9F5]" />
              <span>My Test Attempts History</span>
            </h3>

            {testHistory.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-[#171C34] rounded-2xl">
                No past test attempts yet. Complete your first quiz to record your rank percentile!
              </div>
            ) : (
              <div className="space-y-3">
                {testHistory.map(h => (
                  <div
                    key={h.id}
                    className="p-4 rounded-2xl bg-[#171C34] border border-[#252D54] flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-white">{h.testTitle}</h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {new Date(h.submittedAt).toLocaleDateString()} • {Math.round(h.timeSpentSeconds / 60)} mins
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold font-mono text-white">
                        {h.score} / {h.maxScore}
                      </div>
                      <span className="text-[10px] text-[#37D9F5] font-semibold">
                        {h.accuracy}% Accuracy
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
