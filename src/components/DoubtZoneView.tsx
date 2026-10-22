import React, { useState, useEffect } from 'react';
import type { Doubt, DoubtSolution, SubjectType } from '../types.js';
import { useAuth } from '../context/AuthContext.js';
import {
  HelpCircle,
  Plus,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  Check,
  X,
  FileText,
  AlertTriangle,
  Lightbulb,
  Search,
  Image as ImageIcon,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DoubtZoneViewProps {
  onOpenAuth: () => void;
}

export const DoubtZoneView: React.FC<DoubtZoneViewProps> = ({ onOpenAuth }) => {
  const { user, token, isLoggedIn, isAdmin, refreshUser } = useAuth();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>('All');
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected doubt for viewing/answering
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);

  // Post doubt modal
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [postSubject, setPostSubject] = useState<SubjectType>('Physics');
  const [postTopic, setPostTopic] = useState<string>('');
  const [postText, setPostText] = useState<string>('');
  const [postImage, setPostImage] = useState<string>('');
  const [postBounty, setPostBounty] = useState<number>(10);
  const [isPostingDoubt, setIsPostingDoubt] = useState<boolean>(false);

  // Solution submission
  const [showSolveModal, setShowSolveModal] = useState<boolean>(false);
  const [solutionType, setSolutionType] = useState<'basic' | 'detailed'>('detailed');
  const [solutionText, setSolutionText] = useState<string>('');
  const [solutionImage, setSolutionImage] = useState<string>('');
  const [step1, setStep1] = useState<string>('');
  const [step2, setStep2] = useState<string>('');
  const [step3, setStep3] = useState<string>('');
  const [formulaUsed, setFormulaUsed] = useState<string>('');
  const [isSubmittingSolution, setIsSubmittingSolution] = useState<boolean>(false);

  const fetchDoubts = async () => {
    try {
      const params = new URLSearchParams();
      if (activeSubject !== 'All') params.append('subject', activeSubject);
      if (activeStatus !== 'All') params.append('status', activeStatus.toLowerCase());

      const res = await fetch(`/api/doubts?${params.toString()}`);
      const data = await res.json();
      if (data.doubts) {
        setDoubts(data.doubts);
        // keep selectedDoubt updated if open
        if (selectedDoubt) {
          const updated = data.doubts.find((d: Doubt) => d.id === selectedDoubt.id);
          if (updated) setSelectedDoubt(updated);
        }
      }
    } catch (err) {
      console.error('Failed to fetch doubts:', err);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, [activeSubject, activeStatus]);

  const handlePostDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }
    if (!postTopic.trim() || !postText.trim()) {
      alert('Please fill out topic and question text.');
      return;
    }

    setIsPostingDoubt(true);
    try {
      const res = await fetch('/api/doubts/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: postSubject,
          topic: postTopic,
          questionText: postText,
          questionImage: postImage || undefined,
          bountyCoins: postBounty
        })
      });
      const data = await res.json();
      if (data.success) {
        setDoubts(prev => [data.doubt, ...prev]);
        setShowPostModal(false);
        setPostTopic('');
        setPostText('');
        setPostImage('');
        alert('🎉 Real Doubt published! Aspirants and rankers have been notified.');
      } else {
        alert(data.error || 'Failed to post doubt.');
      }
    } catch (err) {
      console.error('Error posting doubt:', err);
    } finally {
      setIsPostingDoubt(false);
    }
  };

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }
    if (!selectedDoubt) return;

    if (!solutionText.trim()) {
      alert('Please write an explanation for your solution.');
      return;
    }

    const steps = [step1, step2, step3].filter(s => s.trim().length > 0);

    setIsSubmittingSolution(true);
    try {
      const res = await fetch(`/api/doubts/${selectedDoubt.id}/solutions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          solutionType,
          solutionText,
          solutionSteps: steps.length > 0 ? steps : undefined,
          formulaUsed: formulaUsed || undefined,
          solutionImage: solutionImage || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowSolveModal(false);
        setSolutionText('');
        setSolutionImage('');
        setStep1('');
        setStep2('');
        setStep3('');
        setFormulaUsed('');
        await fetchDoubts();
        alert('Solution submitted! If accepted, it will be marked as the verified solution.');
      } else {
        alert(data.error || 'Failed to submit solution.');
      }
    } catch (err) {
      console.error('Error submitting solution:', err);
    } finally {
      setIsSubmittingSolution(false);
    }
  };

  const handleAcceptSolution = async (solution: DoubtSolution) => {
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }
    if (!selectedDoubt) return;

    if (solution.authorId === user?.id) {
      alert('Fraud safeguard: You cannot accept your own solution.');
      return;
    }

    if (!confirm(`Accept this solution as the verified answer from ${solution.authorName}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/doubts/${selectedDoubt.id}/accept-solution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ solutionId: solution.id })
      });
      const data = await res.json();
      if (data.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        await fetchDoubts();
        await refreshUser();
        alert(`🎉 Accepted! Solution from ${solution.authorName} marked as verified.`);
      } else {
        alert(data.error || 'Failed to accept solution.');
      }
    } catch (err) {
      console.error('Error accepting solution:', err);
    }
  };

  const filteredDoubts = doubts.filter(d => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.topic.toLowerCase().includes(q) ||
      d.questionText.toLowerCase().includes(q) ||
      d.subject.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Banner: Peer Doubt Solving */}
      <div className="rounded-3xl bg-gradient-to-br from-[#171C34] via-[#101426] to-[#1e1740] border border-[#252D54] p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7857FF]/20 border border-[#7857FF]/40 text-[#37D9F5] text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>IIT-JEE PEER DOUBT ZONE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Peer Doubt Solving Zone
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Ask conceptual questions in Physics, Chemistry, and Mathematics. Get step-by-step verified explanations from fellow aspirants and top rankers.
          </p>
        </div>

        {/* Feature Box */}
        <div className="bg-[#101426] p-4 rounded-2xl border border-[#252D54] shrink-0 space-y-2 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Step-by-Step Solutions:</span>
            <span className="font-bold text-[#37D9F5]">Verified</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Peer Collaboration:</span>
            <span className="font-bold text-emerald-400">100% Free</span>
          </div>
          <div className="pt-2 border-t border-[#252D54] flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Response Time:</span>
            <span className="font-bold text-amber-300">Within minutes</span>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by topic, chapter, formula..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7857FF]"
          />
        </div>

        {/* Buttons & Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <select
            value={activeSubject}
            onChange={e => setActiveSubject(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#171C34] border border-[#252D54] text-xs font-semibold text-white focus:outline-none"
          >
            <option value="All">All Subjects</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Mathematics">Mathematics</option>
          </select>

          <select
            value={activeStatus}
            onChange={e => setActiveStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#171C34] border border-[#252D54] text-xs font-semibold text-white focus:outline-none"
          >
            <option value="All">All Status</option>
            <option value="Open">Unresolved</option>
            <option value="Resolved">Resolved</option>
          </select>

          <button
            onClick={() => {
              if (!isLoggedIn) onOpenAuth();
              else setShowPostModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Ask a Doubt</span>
          </button>
        </div>
      </div>

      {/* Doubts List */}
      <div className="space-y-4">
        {filteredDoubts.length === 0 ? (
          <div className="rounded-3xl bg-[#171C34] border border-[#252D54] p-12 text-center text-white">
            <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold">No doubts found matching filters</h3>
            <p className="text-xs text-slate-400 mt-1">
              Be the first to ask a question or help a fellow aspirant with step-by-step solutions!
            </p>
          </div>
        ) : (
          filteredDoubts.map(doubt => {
            const isResolved = doubt.status === 'resolved';
            const isAuthor = user?.id === doubt.authorId;
            return (
              <div
                key={doubt.id}
                onClick={() => setSelectedDoubt(doubt)}
                className="cursor-pointer rounded-3xl bg-[#171C34] border border-[#252D54] hover:border-[#7857FF]/60 p-5 shadow-lg transition-all hover:-translate-y-0.5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#7857FF]/20 text-[#A388FF] border border-[#7857FF]/30">
                      {doubt.subject}
                    </span>
                    <span className="text-xs font-bold text-white">{doubt.topic}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isResolved ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolved</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold">
                        Open Doubt
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans line-clamp-3">
                  {doubt.questionText}
                </p>

                <div className="pt-3 border-t border-[#252D54]/70 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <img
                      src={doubt.authorAvatar}
                      alt={doubt.authorName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span>{doubt.authorName}</span>
                    <span>•</span>
                    <span>{new Date(doubt.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[#37D9F5] font-semibold">
                      {doubt.solutions?.length || 0} Solutions
                    </span>
                    <span className="text-xs font-bold text-[#7857FF] hover:underline">
                      View / Answer ➔
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected Doubt Full Detail & Solution Drawer Modal */}
      {selectedDoubt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#101426] border border-[#252D54] rounded-3xl p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setSelectedDoubt(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#7857FF]/20 text-[#A388FF] border border-[#7857FF]/30">
                  {selectedDoubt.subject}
                </span>
                <span className="text-xs text-slate-400">
                  Posted by {selectedDoubt.authorName} • {new Date(selectedDoubt.createdAt).toLocaleString()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{selectedDoubt.topic}</h3>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-[#171C34] border border-[#252D54] text-xs sm:text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
              {selectedDoubt.questionText}
            </div>

            {/* Attached Photo of Question/Diagram if present */}
            {selectedDoubt.questionImage && (
              <div className="p-2 rounded-2xl bg-[#171C34] border border-[#252D54]">
                <span className="text-[10px] text-slate-400 font-bold block mb-1.5 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-[#37D9F5]" />
                  <span>Attached Question / Notebook Diagram Photo:</span>
                </span>
                <img
                  src={selectedDoubt.questionImage}
                  alt="Question Diagram"
                  className="max-h-80 w-auto rounded-xl object-contain mx-auto bg-black/40"
                />
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {selectedDoubt.status === 'resolved'
                    ? 'Doubt Resolved & Answer Verified'
                    : 'Open Community Question'}
                </span>
              </div>

              {selectedDoubt.status === 'open' && (
                <button
                  onClick={() => {
                    if (!isLoggedIn) onOpenAuth();
                    else if (selectedDoubt.authorId === user?.id) {
                      alert('You cannot answer your own question.');
                    } else {
                      setShowSolveModal(true);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Submit Solution</span>
                </button>
              )}
            </div>

            {/* Solutions Section */}
            <div className="space-y-3 pt-4 border-t border-[#252D54]">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#37D9F5]" />
                <span>Submitted Solutions ({selectedDoubt.solutions?.length || 0})</span>
              </h4>

              {selectedDoubt.solutions?.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#171C34] text-center text-xs text-slate-400">
                  No solutions yet. Be the first to answer with step-by-step working!
                </div>
              ) : (
                selectedDoubt.solutions?.map(sol => {
                  const canAccept =
                    (selectedDoubt.authorId === user?.id || isAdmin) &&
                    selectedDoubt.status === 'open' &&
                    sol.authorId !== user?.id;

                  return (
                    <div
                      key={sol.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        sol.isAccepted
                          ? 'bg-emerald-500/10 border-emerald-500/40 shadow-md'
                          : 'bg-[#171C34] border-[#252D54]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={sol.authorAvatar}
                            alt={sol.authorName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-xs font-bold text-white">{sol.authorName}</span>
                            <span className="text-[10px] text-slate-400 block">
                              {new Date(sol.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            sol.solutionType === 'detailed'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {sol.solutionType === 'detailed' ? 'Detailed Steps' : 'Direct Answer'}
                          </span>

                          {sol.isAccepted && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Accepted Solution</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {sol.solutionText}
                      </p>

                      {/* Step by step break down */}
                      {sol.solutionSteps && sol.solutionSteps.length > 0 && (
                        <div className="p-3 rounded-xl bg-[#101426] border border-[#252D54] space-y-1.5 font-mono text-xs text-cyan-300">
                          {sol.solutionSteps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-[#7857FF] font-bold">↳</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {sol.formulaUsed && (
                        <div className="text-[11px] text-slate-400">
                          <strong className="text-slate-300">Formula Used:</strong> {sol.formulaUsed}
                        </div>
                      )}

                      {/* Attached Handwritten Photo of Solution */}
                      {sol.solutionImage && (
                        <div className="p-2 rounded-xl bg-[#101426] border border-[#252D54]">
                          <span className="text-[10px] text-emerald-400 font-bold block mb-1 flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5" />
                            <span>Handwritten Derivation Photo:</span>
                          </span>
                          <img
                            src={sol.solutionImage}
                            alt="Handwritten solution"
                            className="max-h-72 w-auto rounded-lg object-contain mx-auto bg-black/40"
                          />
                        </div>
                      )}

                      {/* Accept Solution Button for Question Author */}
                      {canAccept && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleAcceptSolution(sol)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>
                              Accept as Verified Solution
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Post Doubt Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#101426] border border-[#252D54] rounded-3xl p-6 shadow-2xl text-white">
            <button
              onClick={() => setShowPostModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#37D9F5]" />
              <span>Ask an IIT-JEE Doubt</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Top rankers will provide step-by-step solutions with formulas and explanations.
            </p>

            <form onSubmit={handlePostDoubt} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject *</label>
                  <select
                    value={postSubject}
                    onChange={e => setPostSubject(e.target.value as SubjectType)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Topic / Chapter *</label>
                  <input
                    type="text"
                    required
                    value={postTopic}
                    onChange={e => setPostTopic(e.target.value)}
                    placeholder="e.g. Rotational Mechanics"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Question Problem Statement *</label>
                <textarea
                  required
                  rows={4}
                  value={postText}
                  onChange={e => setPostText(e.target.value)}
                  placeholder="Type full question with values, conditions, options if any..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Attach Question Photo / Textbook Diagram (Optional)
                </label>
                <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#171C34] hover:bg-[#1e2545] border border-dashed border-[#7857FF]/60 hover:border-[#37D9F5] text-xs font-semibold text-[#37D9F5] transition-all">
                  <Camera className="w-4 h-4" />
                  <span>{postImage ? '✓ Photo of Problem Attached (Change)' : 'Take Photo or Choose from Device'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => {
                          if (ev.target?.result) {
                            setPostImage(ev.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {postImage && (
                  <div className="mt-2 p-1.5 rounded-xl bg-[#101426] border border-[#252D54]">
                    <img src={postImage} alt="Problem Preview" className="max-h-36 rounded-lg object-contain mx-auto" />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPostingDoubt}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isPostingDoubt ? 'Publishing Doubt...' : 'Publish Question to Doubt Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Solution Modal */}
      {showSolveModal && selectedDoubt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#101426] border border-[#252D54] rounded-3xl p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSolveModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span>Submit Verified Solution</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Provide an accurate, clear explanation to help your fellow aspirants understand.
            </p>

            <form onSubmit={handleSubmitSolution} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Solution Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSolutionType('detailed')}
                    className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                      solutionType === 'detailed'
                        ? 'bg-[#7857FF]/20 border-[#7857FF] text-white'
                        : 'bg-[#171C34] border-[#252D54] text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Detailed Steps</span>
                      <span className="text-[#37D9F5] font-mono text-[10px]">Recommended</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal mt-0.5 block">
                      Multi-step mathematical derivation
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSolutionType('basic')}
                    className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                      solutionType === 'basic'
                        ? 'bg-[#37D9F5]/20 border-[#37D9F5] text-white'
                        : 'bg-[#171C34] border-[#252D54] text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Basic Answer</span>
                      <span className="text-[#37D9F5] font-mono text-[10px]">Short</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal mt-0.5 block">
                      Brief conceptual answer
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Overall Explanation *
                </label>
                <textarea
                  required
                  rows={3}
                  value={solutionText}
                  onChange={e => setSolutionText(e.target.value)}
                  placeholder="Provide a concise summary of the physics/chemistry principles used..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none"
                />
              </div>

              {solutionType === 'detailed' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Step-by-Step Mathematical Derivation
                  </label>
                  <input
                    type="text"
                    value={step1}
                    onChange={e => setStep1(e.target.value)}
                    placeholder="Step 1: Identify given parameters and apply conservation law..."
                    className="w-full px-3 py-2 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none font-mono"
                  />
                  <input
                    type="text"
                    value={step2}
                    onChange={e => setStep2(e.target.value)}
                    placeholder="Step 2: Formulate differential / algebraic equation..."
                    className="w-full px-3 py-2 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none font-mono"
                  />
                  <input
                    type="text"
                    value={step3}
                    onChange={e => setStep3(e.target.value)}
                    placeholder="Step 3: Substitute values and determine final unit / answer..."
                    className="w-full px-3 py-2 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Key Formula / Theorem (Optional)
                </label>
                <input
                  type="text"
                  value={formulaUsed}
                  onChange={e => setFormulaUsed(e.target.value)}
                  placeholder="e.g. King's Property or τ = I * α"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Attach Handwritten Working / Solution Photo (Optional)
                </label>
                <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#171C34] hover:bg-[#1e2545] border border-dashed border-[#7857FF]/60 hover:border-[#37D9F5] text-xs font-semibold text-[#37D9F5] transition-all">
                  <Camera className="w-4 h-4" />
                  <span>{solutionImage ? '✓ Derivation Photo Attached (Change)' : 'Attach Photo of Handwritten Solution'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => {
                          if (ev.target?.result) {
                            setSolutionImage(ev.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {solutionImage && (
                  <div className="mt-2 p-1.5 rounded-xl bg-[#101426] border border-[#252D54]">
                    <img src={solutionImage} alt="Derivation Preview" className="max-h-36 rounded-lg object-contain mx-auto" />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingSolution}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmittingSolution ? 'Submitting...' : 'Submit Verified Solution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
