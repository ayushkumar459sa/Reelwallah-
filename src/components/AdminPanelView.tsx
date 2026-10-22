import React, { useState, useEffect } from 'react';
import type { PlatformStats, User, MockTest, WithdrawalRequest, Reel, Doubt } from '../types.js';
import { useAuth } from '../context/AuthContext.js';
import {
  Shield,
  Users,
  FileCheck,
  AlertTriangle,
  Activity,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Eye,
  Trash2,
  Ban,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

interface AdminPanelViewProps {
  onOpenAuth: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ onOpenAuth }) => {
  const { user, token, isAdmin, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'tests' | 'moderation'>('stats');

  // Stats & Audit
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Users
  const [usersList, setUsersList] = useState<User[]>([]);

  // Tests
  const [testsList, setTestsList] = useState<MockTest[]>([]);
  const [showCreateTestModal, setShowCreateTestModal] = useState<boolean>(false);
  const [jsonImportText, setJsonImportText] = useState<string>('');

  // Moderation
  const [reportedReels, setReportedReels] = useState<Reel[]>([]);
  const [reportedDoubts, setReportedDoubts] = useState<Doubt[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // New Test Form
  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestExamType, setNewTestExamType] = useState<'JEE Main' | 'JEE Advanced'>('JEE Main');
  const [newTestSubject, setNewTestSubject] = useState<'Full Syllabus' | 'Physics' | 'Chemistry' | 'Mathematics'>('Full Syllabus');
  const [newTestDuration, setNewTestDuration] = useState(180);

  const fetchAdminData = async () => {
    if (!token || !isAdmin) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // 1. Stats
      const sRes = await fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
      if (sRes.ok) {
        const sData = await sRes.json();
        setStats(sData.stats);
        setAuditLogs(sData.auditLogs || []);
      }

      // 2. Users
      const uRes = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      if (uRes.ok) {
        const uData = await uRes.json();
        setUsersList(uData.users || []);
      }

      // 3. Tests
      const tRes = await fetch('/api/admin/tests', { headers: { Authorization: `Bearer ${token}` } });
      if (tRes.ok) {
        const tData = await tRes.json();
        setTestsList(tData.tests || []);
      }

      // 4. Moderation
      const mRes = await fetch('/api/admin/moderation', { headers: { Authorization: `Bearer ${token}` } });
      if (mRes.ok) {
        const mData = await mRes.json();
        setReportedReels(mData.reportedReels || []);
        setReportedDoubts(mData.reportedDoubts || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token, isAdmin]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <Shield className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-slate-400">
          Please log in as administrator ({'ayush459sa@gmail.com'}) using verified email OTP.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3 bg-[#171C34] border border-[#252D54] rounded-3xl p-8">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p className="text-xs text-slate-400">
          Administrator privileges are strictly restricted to verified accounts ({'ayush459sa@gmail.com'}). Current account: {user?.email}
        </p>
      </div>
    );
  }

  // Toggle Suspend User
  const handleToggleSuspend = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle-suspend`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(prev => prev.map(u => (u.id === userId ? data.user : u)));
      } else {
        alert(data.error || 'Failed to toggle suspend.');
      }
    } catch (err) {
      console.error('Error toggling suspend:', err);
    }
  };

  // Toggle Publish Mock Test
  const handleTogglePublishTest = async (testId: string) => {
    try {
      const res = await fetch(`/api/admin/tests/${testId}/toggle-publish`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTestsList(prev =>
          prev.map(t => (t.id === testId ? { ...t, isPublished: data.isPublished } : t))
        );
      }
    } catch (err) {
      console.error('Error toggling test:', err);
    }
  };

  // Create Mock Test
  const handleCreateNewTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsedSections: any[] = [];
      if (jsonImportText.trim()) {
        try {
          parsedSections = JSON.parse(jsonImportText);
        } catch {
          alert('Invalid JSON in questions import box. Please check syntax.');
          return;
        }
      } else {
        // Default high-yield section template
        parsedSections = [
          {
            id: 'sec-p-custom',
            name: 'Physics',
            questions: [
              {
                id: 'q-p-c1',
                questionNumber: 1,
                sectionId: 'sec-p-custom',
                type: 'single_choice',
                questionText: 'A particle executes SHM with amplitude A and time period T. The minimum time taken to travel from x = 0 to x = A/2 is:',
                options: ['T / 12', 'T / 8', 'T / 6', 'T / 4'],
                correctOption: 0,
                marksCorrect: 4,
                marksIncorrect: -1,
                explanation: 'x = A sin(ω t). For x = A/2, sin(ω t) = 1/2 -> ω t = π/6. With ω = 2π/T, t = (π/6) / (2π/T) = T / 12.',
                keyFormula: 'x(t) = A sin(2π t / T)',
                difficulty: 'Easy'
              }
            ]
          }
        ];
      }

      const res = await fetch('/api/admin/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTestTitle,
          examType: newTestExamType,
          subject: newTestSubject,
          durationMinutes: newTestDuration,
          sections: parsedSections
        })
      });

      const data = await res.json();
      if (data.success) {
        setTestsList(prev => [data.test, ...prev]);
        setShowCreateTestModal(false);
        setNewTestTitle('');
        setJsonImportText('');
        alert('🎉 New Mock Test published successfully!');
      } else {
        alert(data.error || 'Failed to publish test.');
      }
    } catch (err) {
      console.error('Error creating test:', err);
    }
  };

  // Quick helper to fill sample JSON for testing
  const fillSampleJson = () => {
    const sample = [
      {
        id: 'sec-sample-math',
        name: 'Mathematics',
        questions: [
          {
            id: 'q-sample-1',
            questionNumber: 1,
            sectionId: 'sec-sample-math',
            type: 'single_choice',
            questionText: 'If z is a complex number such that |z - 1| = 1, then the locus of point z in Argand plane is a:',
            options: ['Circle of radius 1 centered at (1, 0)', 'Parabola with vertex at (1, 0)', 'Straight line parallel to imaginary axis', 'Ellipse with eccentricity 0.5'],
            correctOption: 0,
            marksCorrect: 4,
            marksIncorrect: -1,
            explanation: '|z - z0| = r represents a circle centered at z0 with radius r. Here z0 = 1 + 0i and r = 1.',
            keyFormula: '|z - z0| = r (Standard circle in complex plane)',
            difficulty: 'Easy'
          }
        ]
      }
    ];
    setJsonImportText(JSON.stringify(sample, null, 2));
  };

  // Resolve Reported Content
  const handleResolveReport = async (type: 'reel' | 'doubt', id: string, action: 'keep' | 'delete') => {
    try {
      const res = await fetch('/api/admin/moderation/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ type, id, action })
      });
      if (res.ok) {
        if (type === 'reel') {
          setReportedReels(prev => prev.filter(r => r.id !== id));
        } else {
          setReportedDoubts(prev => prev.filter(d => d.id !== id));
        }
      }
    } catch (err) {
      console.error('Error resolving report:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#171C34] via-[#101426] to-[#1c1836] border border-[#252D54] p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>AUTHENTICATED LEAD ADMIN CONSOLE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">REEL WALLAH Master Operations</h2>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <strong>{user?.email}</strong>. Verified role: Administrator.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center gap-2 border border-[#252D54]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#252D54]">
        {[
          { id: 'stats', label: 'Platform Stats & Audit', icon: TrendingUp },
          { id: 'users', label: `Users (${usersList.length})`, icon: Users },
          { id: 'tests', label: `Mock Tests (${testsList.length})`, icon: FileCheck },
          { id: 'moderation', label: `Moderation (${reportedReels.length + reportedDoubts.length})`, icon: AlertTriangle }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#7857FF] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: STATS & AUDIT LOGS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#171C34] border border-[#252D54]">
              <div className="text-slate-400 text-xs font-semibold">Total Aspirants</div>
              <div className="text-2xl font-black text-white font-mono mt-1">{stats.totalAspirants}</div>
              <div className="text-[10px] text-emerald-400 mt-1">● Real Registered Users</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#171C34] border border-[#252D54]">
              <div className="text-slate-400 text-xs font-semibold">Community Posts</div>
              <div className="text-2xl font-black text-[#37D9F5] font-mono mt-1">{stats.totalPosts}</div>
              <div className="text-[10px] text-slate-400 mt-1">Study Wall Posts</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#171C34] border border-[#252D54]">
              <div className="text-slate-400 text-xs font-semibold">Real Comments</div>
              <div className="text-2xl font-black text-amber-300 font-mono mt-1">{stats.totalComments}</div>
              <div className="text-[10px] text-amber-400 mt-1">Aspirant Discussions</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#171C34] border border-[#252D54]">
              <div className="text-slate-400 text-xs font-semibold">Tests Completed</div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{stats.testsCompleted}</div>
              <div className="text-[10px] text-slate-400 mt-1">{stats.totalTestsAvailable} Tests in Bank</div>
            </div>
          </div>

          {/* Audit Logs Stream */}
          <div className="rounded-3xl bg-[#171C34] border border-[#252D54] p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#37D9F5]" />
              <span>Real-Time Security & Operations Audit Trail</span>
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {auditLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#101426] border border-[#252D54] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-[#A388FF] uppercase font-mono mr-2">
                      [{log.action}]
                    </span>
                    <span className="text-slate-200">{log.details}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()} • {log.userEmail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: USERS MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'users' && (
        <div className="rounded-3xl bg-[#171C34] border border-[#252D54] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Registered Aspirants & Students</h3>
            <span className="text-xs text-slate-400">{usersList.length} Accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101426] text-slate-400 border-b border-[#252D54]">
                <tr>
                  <th className="p-3 font-semibold">User</th>
                  <th className="p-3 font-semibold">Role</th>
                  <th className="p-3 font-semibold">Dream Target</th>
                  <th className="p-3 font-semibold">Streak</th>
                  <th className="p-3 font-semibold">Pro Sub</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252D54]">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 flex items-center gap-2">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-[#37D9F5]">
                      {u.dreamIit || 'IIT Aspirant'}
                    </td>
                    <td className="p-3 font-mono text-orange-400">
                      {u.studyStreak || 1}d
                    </td>
                    <td className="p-3">
                      {u.isSubscribed ? (
                        <span className="text-emerald-400 font-bold">Active Pro</span>
                      ) : (
                        <span className="text-slate-400">{u.freeAttemptsLeft ?? 10}/10 Free</span>
                      )}
                    </td>
                    <td className="p-3">
                      {u.isSuspended ? (
                        <span className="text-rose-400 font-bold">Suspended</span>
                      ) : (
                        <span className="text-emerald-400">Active</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {u.email !== 'ayush459sa@gmail.com' && (
                        <button
                          onClick={() => handleToggleSuspend(u.id)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                            u.isSuspended
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: MOCK TESTS STUDIO */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Mock Test Catalog Management</h3>
            <button
              onClick={() => setShowCreateTestModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:brightness-110"
            >
              <Plus className="w-4 h-4" />
              <span>Create / Upload Test</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testsList.map(t => (
              <div key={t.id} className="p-5 rounded-3xl bg-[#171C34] border border-[#252D54] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#A388FF]">{t.examType}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    t.isPublished ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {t.isPublished ? 'Published' : 'Draft / Unpublished'}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm">{t.title}</h4>
                <div className="text-xs text-slate-400 font-mono">
                  {t.durationMinutes} mins • {t.totalQuestions} Questions • {t.totalMarks} Marks
                </div>

                <div className="pt-2 border-t border-[#252D54] flex items-center justify-between">
                  <span className="text-[11px] text-cyan-300 font-mono">Real Syllabus Practice</span>
                  <button
                    onClick={() => handleTogglePublishTest(t.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      t.isPublished
                        ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25'
                        : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                    }`}
                  >
                    {t.isPublished ? 'Unpublish' : 'Publish to Students'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: CONTENT MODERATION */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Reported Educational Content Queue</h3>

          {reportedReels.length === 0 && reportedDoubts.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#171C34] border border-[#252D54] text-center text-xs text-slate-400">
              ✓ Moderation queue clean! No pending student safety reports.
            </div>
          ) : (
            <div className="space-y-3">
              {reportedReels.map(r => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-[#171C34] border border-rose-500/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="text-[10px] font-bold text-rose-400 uppercase">REPORTED REEL</span>
                    <div className="font-bold text-white mt-0.5">{r.title}</div>
                    <div className="text-slate-400 text-[11px]">Creator: {r.creatorName}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolveReport('reel', r.id, 'keep')}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                    >
                      Dismiss (Keep)
                    </button>
                    <button
                      onClick={() => handleResolveReport('reel', r.id, 'delete')}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                    >
                      Remove Reel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Mock Test Modal */}
      {showCreateTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#101426] border border-[#252D54] rounded-3xl p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setShowCreateTestModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-white/5"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#37D9F5]" />
              <span>Create or Import Verified Mock Test</span>
            </h3>

            <form onSubmit={handleCreateNewTest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Test Title *</label>
                <input
                  type="text"
                  required
                  value={newTestTitle}
                  onChange={e => setNewTestTitle(e.target.value)}
                  placeholder="e.g. NTA JEE Main 2025 Crash Test 2"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Type</label>
                  <select
                    value={newTestExamType}
                    onChange={e => setNewTestExamType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white"
                  >
                    <option value="JEE Main">JEE Main</option>
                    <option value="JEE Advanced">JEE Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <select
                    value={newTestSubject}
                    onChange={e => setNewTestSubject(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white"
                  >
                    <option value="Full Syllabus">Full Syllabus</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    value={newTestDuration}
                    onChange={e => setNewTestDuration(parseInt(e.target.value) || 180)}
                    className="w-full px-3 py-2 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Questions JSON Import (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={fillSampleJson}
                    className="text-[10px] text-[#37D9F5] hover:underline font-bold"
                  >
                    Insert Verified Sample Question JSON
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={jsonImportText}
                  onChange={e => setJsonImportText(e.target.value)}
                  placeholder="Paste JSON array of sections or questions..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171C34] border border-[#252D54] text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTestModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7857FF] to-[#37D9F5] text-white font-bold text-xs shadow-md"
                >
                  Publish Mock Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
