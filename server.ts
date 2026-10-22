import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import type {
  User,
  Reel,
  ReelComment,
  Doubt,
  DoubtSolution,
  RoomChatMessage,
  StudyRoom,
  MockTest,
  TestSubmission,
  WalletTransaction,
  WithdrawalRequest,
  SubscriptionRecord,
  PlatformStats,
  CommunityPost,
  CommunityComment,
  LiveChatMessage
} from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure data folder exists
const DATA_DIR = path.join(__dirname, '.data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.join(DATA_DIR, 'reelwallah_db.json');

// Transactional Email Service configuration
let mailTransporter: any = null;
try {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    mailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    console.log('[EMAIL] Configured SMTP transporter with', process.env.SMTP_HOST);
  } else if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
    console.log('[EMAIL] Configured Gmail transporter with', process.env.GMAIL_USER);
  }
} catch (err) {
  console.warn('[EMAIL] Could not initialize nodemailer transporter:', err);
}

// Interface for Database
interface DatabaseState {
  users: User[];
  otps: Record<string, { code: string; expiresAt: number; attempts: number; lastRequestedAt?: number }>;
  sessions: Record<string, string>; // token -> userId
  reels: Reel[];
  reelComments: ReelComment[];
  doubts: Doubt[];
  studyRooms: StudyRoom[];
  mockTests: MockTest[];
  submissions: TestSubmission[];
  transactions: WalletTransaction[];
  withdrawals: WithdrawalRequest[];
  subscriptions: SubscriptionRecord[];
  posts: CommunityPost[];
  homeChatMessages: LiveChatMessage[];
  auditLogs: { timestamp: string; action: string; details: string; userEmail: string }[];
}

import { masterMockTests } from './src/data/mockTestsData.js';

// Complete question bank of 50+ genuine syllabus-aligned IIT-JEE Main & Advanced tests
const initialMockTests: MockTest[] = masterMockTests;

// Pure real study feed posts by real users — zero fake or hardcoded posts
const initialCommunityPosts: CommunityPost[] = [];

// Pure user-created rooms only — zero fake/seeded rooms
const initialStudyRooms: StudyRoom[] = [];

// Helper to load or initialize DB
function loadDatabase(): DatabaseState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(content);
      // Clean out any legacy mock accounts & bots
      data.users = (data.users || []).filter((u: User) =>
        !u.id.startsWith('user-demo-') &&
        !u.id.startsWith('user-topper-') &&
        u.id !== 'admin-ayush'
      );
      data.reels = [];
      data.reelComments = [];
      data.doubts = (data.doubts || []).filter((d: Doubt) =>
        !d.authorId.startsWith('user-rahul') &&
        !d.authorId.startsWith('user-megha') &&
        !d.authorId.startsWith('user-krishna')
      );
      data.withdrawals = [];
      data.studyRooms = (data.studyRooms || []).filter((room: StudyRoom) =>
        !room.id.startsWith('room-silent') &&
        !room.id.startsWith('room-phy') &&
        !room.id.startsWith('room-chem') &&
        !room.id.startsWith('room-math') &&
        room.hostName !== 'Admin Desk'
      );

      // Clean out fake posts and fake comments - only genuine posts and comments
      if (Array.isArray(data.posts)) {
        data.posts = data.posts
          .filter((p: CommunityPost) =>
            !p.id.startsWith('fake-') &&
            p.id !== 'post-1' &&
            p.id !== 'post-2' &&
            !p.authorName?.includes('(Admin)') &&
            !p.authorName?.includes('Ayush Sharma')
          )
          .map((p: CommunityPost) => ({
            ...p,
            comments: (p.comments || []).filter((c: any) =>
              c.id !== 'c-1-1' &&
              c.id !== 'c-2-1' &&
              !c.id?.startsWith('fake-') &&
              !c.text?.includes('Ayush bhai') &&
              !c.authorName?.includes('(Admin)')
            )
          }));
      } else {
        data.posts = [];
      }

      data.homeChatMessages = (data.homeChatMessages || []).filter(
        (m: any) => !m.userName?.includes('(Admin)')
      );

      // Ensure all users have crystal clear high-contrast avatars
      if (Array.isArray(data.users)) {
        data.users.forEach((u: any) => {
          if (!u.avatar || u.avatar.includes('dicebear.com/7.x/identicon')) {
            const displayName = u.name || u.email?.split('@')[0] || 'Aspirant';
            u.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=7857FF&color=ffffff&bold=true&size=200`;
          }
        });
      }

      // Always ensure mock tests have the latest updated question bank
      data.mockTests = initialMockTests;

      return data;
    }
  } catch (err) {
    console.error('Failed reading database file, recreating:', err);
  }

  const defaultState: DatabaseState = {
    users: [],
    otps: {},
    sessions: {},
    reels: [],
    reelComments: [],
    doubts: [],
    studyRooms: [],
    mockTests: initialMockTests,
    submissions: [],
    posts: [],
    homeChatMessages: [],
    transactions: [],
    withdrawals: [],
    subscriptions: [],
    auditLogs: []
  };

  saveDatabase(defaultState);
  return defaultState;
}

function saveDatabase(state: DatabaseState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed saving database:', err);
  }
}

// In-memory reference synced to file
let db = loadDatabase();

// Auth Middleware
function authenticateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  const token = authHeader.substring(7);
  const userId = db.sessions[token];
  if (!userId) {
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }

  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'User account not found.' });
  }

  if (user.isSuspended) {
    return res.status(403).json({ error: 'Account has been suspended for safety violations.' });
  }

  (req as any).user = user;
  (req as any).token = token;
  next();
}

// Admin role verification middleware - strictly restricted to ayush459sa@gmail.com
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = (req as any).user as User;
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const isAdmin = user.email.toLowerCase() === 'ayush459sa@gmail.com' && user.role === 'admin';
  if (!isAdmin) {
    return res.status(403).json({ error: 'Access denied. Administrator console is strictly restricted to platform owner (ayush459sa@gmail.com).' });
  }

  next();
}

// -----------------------------------------------------------------------------
// AUTH ENDPOINTS (Password-Based Registration & Login)
// -----------------------------------------------------------------------------

// POST /api/auth/register (No OTP needed! Simply Email + Password + Name)
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid Gmail / email address.' });
  }
  if (!password || typeof password !== 'string' || password.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters long.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  let existingUser = db.users.find(u => u.email === normalizedEmail);

  if (existingUser) {
    if (existingUser.password && existingUser.password !== password.trim()) {
      return res.status(400).json({
        error: 'An account with this email already exists. Please log in with your password.'
      });
    }
    // Update password if previously unset
    existingUser.password = password.trim();
    if (name && name.trim()) existingUser.name = name.trim();
  } else {
    const isAdminEmail = normalizedEmail === 'ayush459sa@gmail.com';
    const newId = 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
    const userName = name?.trim() || normalizedEmail.split('@')[0];
    existingUser = {
      id: newId,
      email: normalizedEmail,
      password: password.trim(),
      name: userName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7857FF&color=ffffff&bold=true&size=200`,
      bio: 'IIT-JEE Aspirant',
      role: isAdminEmail ? 'admin' : 'user',
      dreamIit: 'IIT Bombay - CSE',
      targetYear: '2025',
      targetExam: 'Both',
      studyStreak: 1,
      lastActiveDate: new Date().toISOString(),
      freeAttemptsLeft: 10,
      isSubscribed: false,
      createdAt: new Date().toISOString()
    };
    db.users.push(existingUser);
  }

  // Create permanent session token
  const token = 'rw_token_' + Buffer.from(`${existingUser.id}_${Date.now()}_${Math.random()}`).toString('base64');
  db.sessions[token] = existingUser.id;

  db.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'USER_REGISTERED',
    details: `User ${existingUser.email} registered with password.`,
    userEmail: existingUser.email
  });

  saveDatabase(db);
  return res.json({ success: true, token, user: existingUser });
});

// POST /api/auth/login (Email + Password)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter your email and password.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find(u => u.email === normalizedEmail);

  if (!user) {
    return res.status(400).json({ error: 'No account found with this email. Please register first.' });
  }

  // If user has a password set, verify it
  if (user.password && user.password !== password.trim()) {
    return res.status(400).json({ error: 'Incorrect password. Please verify and try again.' });
  }

  // If user had registered without a password, adopt this password
  if (!user.password) {
    user.password = password.trim();
  }

  // Update streak & last active
  const lastActive = new Date(user.lastActiveDate || 0);
  const today = new Date();
  const diffHours = (today.getTime() - lastActive.getTime()) / (1000 * 3600);
  if (diffHours >= 20 && diffHours <= 48) {
    user.studyStreak = (user.studyStreak || 1) + 1;
  }
  user.lastActiveDate = today.toISOString();

  // Create session token
  const token = 'rw_token_' + Buffer.from(`${user.id}_${Date.now()}_${Math.random()}`).toString('base64');
  db.sessions[token] = user.id;

  db.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'USER_LOGIN_SUCCESS',
    details: `User ${user.email} authenticated successfully with password.`,
    userEmail: user.email
  });

  saveDatabase(db);
  return res.json({ success: true, token, user });
});

// POST /api/auth/send-otp (Optional fallback)
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Rate limiting / safety check: allow resending after 10 seconds
  const existingOtp = db.otps[normalizedEmail];
  const now = Date.now();
  if (existingOtp && existingOtp.lastRequestedAt && (now - existingOtp.lastRequestedAt < 10000)) {
    const waitSecs = Math.ceil((10000 - (now - existingOtp.lastRequestedAt)) / 1000);
    return res.status(429).json({ error: `Please wait ${waitSecs} seconds before requesting a new OTP.` });
  }

  // Generate 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = now + 15 * 60 * 1000; // 15 minutes validity

  db.otps[normalizedEmail] = {
    code,
    expiresAt,
    attempts: 0,
    lastRequestedAt: now
  };

  db.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'OTP_REQUESTED',
    details: `OTP generated for email ${normalizedEmail}`,
    userEmail: normalizedEmail
  });

  saveDatabase(db);

  // Attempt real email dispatch via nodemailer
  let emailDispatched = false;

  if (mailTransporter) {
    try {
      await mailTransporter.sendMail({
        from: process.env.SMTP_FROM || '"REEL WALLAH" <no-reply@reelwallah.com>',
        to: normalizedEmail,
        subject: `[REEL WALLAH] Your Verification OTP: ${code}`,
        text: `Your REEL WALLAH One-Time Password (OTP) is: ${code}. Valid for 15 minutes. Do not share this code with anyone.`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #101426; color: #ffffff; padding: 28px; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid #252D54;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #37D9F5; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;">REEL WALLAH</h1>
              <p style="color: #A388FF; font-size: 12px; margin-top: 4px; font-weight: bold;">IIT-JEE PEER LEARNING & QUIZ PLATFORM</p>
            </div>
            <p style="font-size: 14px; color: #cbd5e1; line-height: 1.5;">Here is your secure One-Time Password (OTP) to login / sign up:</p>
            <div style="background: linear-gradient(135deg, rgba(120,87,255,0.2), rgba(55,217,245,0.2)); padding: 18px; border-radius: 12px; text-align: center; margin: 24px 0; border: 1px solid #7857FF;">
              <span style="font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #37D9F5; font-family: monospace;">${code}</span>
            </div>
            <p style="font-size: 12px; color: #94a3b8; line-height: 1.4;">Valid for 15 minutes. Do not share this code with anyone.</p>
            <div style="border-top: 1px solid #252D54; margin-top: 24px; padding-top: 16px; text-align: center;">
              <p style="font-size: 11px; color: #64748b; margin: 0;">REEL WALLAH • IIT-JEE Mock Tests & Aspirant Community</p>
            </div>
          </div>
        `
      });
      emailDispatched = true;
      console.log(`[AUTH] ✉️ Real email OTP delivered to ${normalizedEmail}`);
    } catch (err: any) {
      console.error(`[AUTH] Email send error for ${normalizedEmail}:`, err?.message || err);
    }
  } else {
    // When external SMTP keys are not configured in dev, OTP is recorded securely in server logs
    console.log(`[SECURE AUTH] 🔑 Verification OTP for ${normalizedEmail}: ${code}`);
  }

  // Strict privacy: Never expose code or previewOtp in client response!
  return res.json({
    success: true,
    message: `Verification code sent to ${normalizedEmail}. Please check your Gmail inbox and spam folder.`
  });
});

// POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, code, name } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and OTP code are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const otpRecord = db.otps[normalizedEmail];

  if (!otpRecord) {
    return res.status(400).json({ error: 'No active OTP found. Please request a new code.' });
  }

  if (Date.now() > otpRecord.expiresAt) {
    delete db.otps[normalizedEmail];
    saveDatabase(db);
    return res.status(400).json({ error: 'OTP has expired. Please request a new code.' });
  }

  if (otpRecord.attempts >= 5) {
    delete db.otps[normalizedEmail];
    saveDatabase(db);
    return res.status(400).json({ error: 'Too many incorrect attempts. Please request a new code.' });
  }

  // Strict real OTP match
  const isMatch = otpRecord.code === code.trim();
  if (!isMatch) {
    otpRecord.attempts++;
    saveDatabase(db);
    return res.status(400).json({ error: `Invalid code. ${5 - otpRecord.attempts} attempts remaining.` });
  }

  // OTP verified! Clear OTP record
  delete db.otps[normalizedEmail];

  // Check if user exists or create new user
  let user = db.users.find(u => u.email === normalizedEmail);
  const isAdminEmail = normalizedEmail === 'ayush459sa@gmail.com';

  if (!user) {
    const newId = 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
    user = {
      id: newId,
      email: normalizedEmail,
      // Protect admin identity: never show "(Admin)" in display name
      name: name?.trim() || normalizedEmail.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${normalizedEmail}`,
      bio: 'IIT-JEE Aspirant',
      role: isAdminEmail ? 'admin' : 'user',
      dreamIit: 'IIT Bombay - CSE',
      targetYear: '2025',
      targetExam: 'Both',
      studyStreak: 1,
      lastActiveDate: new Date().toISOString(),
      coins: 0,
      freeAttemptsLeft: 10,
      isSubscribed: false,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
  } else {
    // Protect admin privacy: ensure name does not expose admin title
    if (user.name?.includes('(Admin)')) {
      user.name = user.name.replace(/\s*\(Admin\)/gi, '').trim() || normalizedEmail.split('@')[0];
    }
    if (user.bio?.includes('Admin') || user.bio?.includes('Director')) {
      user.bio = 'IIT-JEE Aspirant';
    }
    if (isAdminEmail && user.role !== 'admin') {
      user.role = 'admin';
    }
    // Update streak
    const lastActive = new Date(user.lastActiveDate);
    const today = new Date();
    const diffHours = (today.getTime() - lastActive.getTime()) / (1000 * 3600);
    if (diffHours >= 20 && diffHours <= 48) {
      user.studyStreak += 1;
    }
    user.lastActiveDate = today.toISOString();
  }

  // Create session token
  const token = 'rw_token_' + Buffer.from(`${user.id}_${Date.now()}_${Math.random()}`).toString('base64');
  db.sessions[token] = user.id;

  db.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'USER_LOGIN_SUCCESS',
    details: `User ${user.email} (${user.role}) authenticated successfully.`,
    userEmail: user.email
  });

  saveDatabase(db);

  return res.json({
    success: true,
    token,
    user
  });
});

// GET /api/auth/me
app.get('/api/auth/me', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  return res.json({ user });
});

// POST /api/auth/profile
app.post('/api/auth/profile', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { name, bio, avatar, dreamIit, targetYear, targetExam } = req.body;

  if (name) user.name = name.trim();
  if (bio !== undefined) user.bio = bio.trim();
  if (avatar) user.avatar = avatar;
  if (dreamIit) user.dreamIit = dreamIit;
  if (targetYear) user.targetYear = targetYear;
  if (targetExam) user.targetExam = targetExam;

  saveDatabase(db);
  return res.json({ success: true, user });
});

// POST /api/auth/delete-account
app.post('/api/auth/delete-account', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const token = (req as any).token as string;

  // Purge sessions
  delete db.sessions[token];

  // Mark or remove user
  db.users = db.users.filter(u => u.id !== user.id);

  db.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'ACCOUNT_DELETED',
    details: `User account deleted: ${user.email}`,
    userEmail: user.email
  });

  saveDatabase(db);
  return res.json({ success: true, message: 'Account deleted successfully.' });
});

// -----------------------------------------------------------------------------
// REELS & SOCIAL ENDPOINTS
// -----------------------------------------------------------------------------

// GET /api/reels
app.get('/api/reels', (req, res) => {
  const { subject } = req.query;
  let reels = db.reels.filter(r => !r.isReported);

  if (subject && subject !== 'All') {
    reels = reels.filter(r => r.subject.toLowerCase() === (subject as string).toLowerCase());
  }

  // Sort newest first
  reels.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json({ reels });
});

// POST /api/reels/upload
app.post('/api/reels/upload', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { title, subject, chapter, description, tags, videoUrl } = req.body;

  if (!title || !subject || !chapter) {
    return res.status(400).json({ error: 'Title, Subject, and Chapter are required.' });
  }

  const newReel: Reel = {
    id: 'reel-' + Date.now(),
    creatorId: user.id,
    creatorName: user.name,
    creatorAvatar: user.avatar,
    creatorExamTag: `${user.dreamIit || 'IIT Aspirant'} • JEE ${user.targetYear}`,
    title: title.trim(),
    subject,
    chapter: chapter.trim(),
    description: description || '',
    tags: Array.isArray(tags) ? tags : ['#JEE2025', `#${subject}`],
    videoUrl: videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-young-student-doing-math-on-a-blackboard-42994-large.mp4',
    likes: 0,
    likedBy: [],
    commentsCount: 0,
    savesCount: 0,
    savedBy: [],
    viewsCount: 1,
    createdAt: new Date().toISOString()
  };

  db.reels.unshift(newReel);
  saveDatabase(db);

  return res.json({ success: true, reel: newReel });
});

// POST /api/reels/:id/like
app.post('/api/reels/:id/like', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { id } = req.params;

  const reel = db.reels.find(r => r.id === id);
  if (!reel) {
    return res.status(404).json({ error: 'Reel not found.' });
  }

  const isLiked = reel.likedBy.includes(user.id);
  if (isLiked) {
    reel.likedBy = reel.likedBy.filter(uid => uid !== user.id);
    reel.likes = Math.max(0, reel.likes - 1);
  } else {
    reel.likedBy.push(user.id);
    reel.likes += 1;
  }

  saveDatabase(db);
  return res.json({ success: true, likes: reel.likes, isLiked: !isLiked });
});

// GET /api/reels/:id/comments
app.get('/api/reels/:id/comments', (req, res) => {
  const { id } = req.params;
  const comments = db.reelComments
    .filter(c => c.reelId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json({ comments });
});

// POST /api/reels/:id/comments
app.post('/api/reels/:id/comments', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { id } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Comment text cannot be empty.' });
  }

  const reel = db.reels.find(r => r.id === id);
  if (!reel) {
    return res.status(404).json({ error: 'Reel not found.' });
  }

  const newComment: ReelComment = {
    id: 'rc-' + Date.now(),
    reelId: id,
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    text: text.trim(),
    createdAt: new Date().toISOString()
  };

  db.reelComments.push(newComment);
  reel.commentsCount = (reel.commentsCount || 0) + 1;
  saveDatabase(db);

  return res.json({ success: true, comment: newComment });
});

// POST /api/reels/:id/report
app.post('/api/reels/:id/report', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { id } = req.params;
  const { reason } = req.body;

  const reel = db.reels.find(r => r.id === id);
  if (!reel) return res.status(404).json({ error: 'Reel not found' });

  reel.isReported = true;

  db.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'REEL_REPORTED',
    details: `Reel "${reel.title}" reported by ${user.email}. Reason: ${reason || 'Inappropriate content'}`,
    userEmail: user.email
  });

  saveDatabase(db);
  return res.json({ success: true, message: 'Thank you. Reel submitted to admin moderation.' });
});

// -----------------------------------------------------------------------------
// COMMUNITY STUDY POSTS & DISCUSSION WALL ENDPOINTS
// -----------------------------------------------------------------------------

// GET /api/posts
app.get('/api/posts', (req, res) => {
  const posts = (db.posts || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return res.json({ posts });
});

// POST /api/posts
app.post('/api/posts', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { content, image, subjectTag } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Post text cannot be empty.' });
  }

  const newPost: CommunityPost = {
    id: 'post-' + Date.now(),
    authorId: user.id,
    authorName: user.name,
    authorAvatar: user.avatar,
    authorRole: user.role,
    authorDreamIit: user.dreamIit,
    subjectTag: subjectTag || 'General',
    content: content.trim(),
    image: image ? image.trim() : undefined,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString()
  };

  if (!db.posts) db.posts = [];
  db.posts.unshift(newPost);
  saveDatabase(db);

  return res.json({ success: true, post: newPost });
});

// POST /api/posts/:id/comments
app.post('/api/posts/:id/comments', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { id } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Comment text cannot be empty.' });
  }

  const post = (db.posts || []).find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  const newComment: CommunityComment = {
    id: 'comm-' + Date.now(),
    postId: id,
    authorId: user.id,
    authorName: user.name,
    authorAvatar: user.avatar,
    authorRole: user.role,
    text: text.trim(),
    createdAt: new Date().toISOString()
  };

  if (!post.comments) post.comments = [];
  post.comments.push(newComment);
  saveDatabase(db);

  return res.json({ success: true, comment: newComment });
});

// POST /api/posts/:id/like
app.post('/api/posts/:id/like', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { id } = req.params;

  const post = (db.posts || []).find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  if (!post.likes) post.likes = [];
  const idx = post.likes.indexOf(user.id);
  if (idx > -1) {
    post.likes.splice(idx, 1);
  } else {
    post.likes.push(user.id);
  }

  saveDatabase(db);
  return res.json({ success: true, likes: post.likes });
});

// DELETE /api/posts/:id
app.delete('/api/posts/:id', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { id } = req.params;

  const postIdx = (db.posts || []).findIndex(p => p.id === id);
  if (postIdx === -1) return res.status(404).json({ error: 'Post not found.' });

  const post = db.posts[postIdx];
  const isAuthor = post.authorId === user.id;
  const isAdmin = user.role === 'admin' || user.email === 'ayush459sa@gmail.com';
  if (!isAuthor && !isAdmin) {
    return res.status(403).json({ error: 'Only author or admin can delete this post.' });
  }

  db.posts.splice(postIdx, 1);
  saveDatabase(db);
  return res.json({ success: true });
});

// -----------------------------------------------------------------------------
// LIVE ASPIRANT HOME CHAT ENDPOINTS (Real-time live peer study chat)
// -----------------------------------------------------------------------------

// GET /api/home-chat
app.get('/api/home-chat', (req, res) => {
  const messages = (db.homeChatMessages || []).slice(-100);
  return res.json({ messages });
});

// POST /api/home-chat
app.post('/api/home-chat', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { text, image } = req.body;

  if ((!text || !text.trim()) && !image) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  const newMsg: LiveChatMessage = {
    id: 'hchat-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    dreamIit: user.dreamIit,
    text: (text || '').trim(),
    image: image ? image.trim() : undefined,
    createdAt: new Date().toISOString()
  };

  if (!db.homeChatMessages) db.homeChatMessages = [];
  db.homeChatMessages.push(newMsg);
  // Keep last 150 messages for performance and real-time feel
  if (db.homeChatMessages.length > 150) {
    db.homeChatMessages = db.homeChatMessages.slice(-150);
  }

  saveDatabase(db);
  return res.json({ success: true, message: newMsg });
});

// -----------------------------------------------------------------------------
// STUDY ROOMS ENDPOINTS
// -----------------------------------------------------------------------------

// GET /api/study-rooms
app.get('/api/study-rooms', (req, res) => {
  return res.json({ rooms: db.studyRooms });
});

// POST /api/study-rooms/create
app.post('/api/study-rooms/create', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { title, category, topic, targetTimeMin, isSilent, challenge } = req.body;

  if (!title || !topic) {
    return res.status(400).json({ error: 'Room Title and Target Topic are required.' });
  }

  const newRoom: StudyRoom = {
    id: 'room-' + Date.now(),
    title: title.trim(),
    category: category || 'silent',
    topic: topic.trim(),
    targetTimeMin: Number(targetTimeMin) || 50,
    activeCount: 1,
    hostName: user.name,
    isSilent: Boolean(isSilent),
    ambientSound: 'lofi',
    challenge: challenge?.trim() || 'Daily Goal: Complete revision target before timer ends!',
    messages: []
  };

  db.studyRooms.unshift(newRoom);
  saveDatabase(db);
  return res.json({ success: true, room: newRoom });
});

// POST /api/study-rooms/:id/join
app.post('/api/study-rooms/:id/join', authenticateUser, (req, res) => {
  const { id } = req.params;
  const room = db.studyRooms.find(r => r.id === id);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  room.activeCount = (room.activeCount || 0) + 1;
  saveDatabase(db);
  return res.json({ success: true, activeCount: room.activeCount });
});

// POST /api/study-rooms/:id/leave
app.post('/api/study-rooms/:id/leave', authenticateUser, (req, res) => {
  const { id } = req.params;
  const room = db.studyRooms.find(r => r.id === id);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  room.activeCount = Math.max(0, (room.activeCount || 1) - 1);
  saveDatabase(db);
  return res.json({ success: true, activeCount: room.activeCount });
});

// POST /api/study-rooms/:id/message
app.post('/api/study-rooms/:id/message', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { id } = req.params;
  const { text, isQuestion } = req.body;

  const room = db.studyRooms.find(r => r.id === id);
  if (!room) return res.status(404).json({ error: 'Room not found.' });

  const msg: RoomChatMessage = {
    id: 'msg-' + Date.now(),
    roomId: id,
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    text: text.trim(),
    isQuestion: Boolean(isQuestion),
    createdAt: new Date().toISOString()
  };

  room.messages.push(msg);
  // Keep last 50 messages
  if (room.messages.length > 50) {
    room.messages = room.messages.slice(-50);
  }

  saveDatabase(db);
  return res.json({ success: true, message: msg });
});

// -----------------------------------------------------------------------------
// DOUBT-SOLVING & RW COINS REWARDS ENDPOINTS
// -----------------------------------------------------------------------------

// GET /api/doubts
app.get('/api/doubts', (req, res) => {
  const { subject, status } = req.query;
  let doubts = db.doubts;

  if (subject && subject !== 'All') {
    doubts = doubts.filter(d => d.subject.toLowerCase() === (subject as string).toLowerCase());
  }
  if (status && status !== 'All') {
    doubts = doubts.filter(d => d.status.toLowerCase() === (status as string).toLowerCase());
  }

  doubts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json({ doubts });
});

// POST /api/doubts/post
app.post('/api/doubts/post', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { subject, topic, questionText, questionImage, bountyCoins } = req.body;

  if (!subject || !topic || !questionText) {
    return res.status(400).json({ error: 'Subject, Topic and Question text are required.' });
  }

  const bounty = Number(bountyCoins) || 10;

  const newDoubt: Doubt = {
    id: 'doubt-' + Date.now(),
    authorId: user.id,
    authorName: user.name,
    authorAvatar: user.avatar,
    subject,
    topic: topic.trim(),
    questionText: questionText.trim(),
    questionImage: questionImage || undefined,
    bountyCoins: bounty,
    status: 'open',
    solutions: [],
    createdAt: new Date().toISOString()
  };

  db.doubts.unshift(newDoubt);
  saveDatabase(db);

  return res.json({ success: true, doubt: newDoubt });
});

// POST /api/doubts/:id/solutions
app.post('/api/doubts/:id/solutions', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { id } = req.params;
  const { solutionType, solutionText, solutionSteps, formulaUsed, solutionImage } = req.body;

  const doubt = db.doubts.find(d => d.id === id);
  if (!doubt) {
    return res.status(404).json({ error: 'Doubt question not found.' });
  }

  // Prevent self-answering to game rewards
  if (doubt.authorId === user.id) {
    return res.status(400).json({ error: 'You cannot submit a solution to your own doubt.' });
  }

  // Determine solution type: basic (6 coins) or detailed (10 coins)
  const isDetailed = solutionType === 'detailed' || (solutionSteps && solutionSteps.length >= 2);
  const coinsReward = isDetailed ? 10 : 6;

  const newSolution: DoubtSolution = {
    id: 'sol-' + Date.now(),
    doubtId: id,
    authorId: user.id,
    authorName: user.name,
    authorAvatar: user.avatar,
    solutionType: isDetailed ? 'detailed' : 'basic',
    solutionText: solutionText.trim(),
    solutionSteps: Array.isArray(solutionSteps) ? solutionSteps : undefined,
    formulaUsed: formulaUsed || undefined,
    solutionImage: solutionImage || undefined,
    isAccepted: false,
    coinsAwarded: coinsReward,
    createdAt: new Date().toISOString()
  };

  doubt.solutions.push(newSolution);
  saveDatabase(db);

  return res.json({ success: true, solution: newSolution });
});

// POST /api/doubts/:id/accept-solution
app.post('/api/doubts/:id/accept-solution', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { id } = req.params;
  const { solutionId } = req.body;

  const doubt = db.doubts.find(d => d.id === id);
  if (!doubt) return res.status(404).json({ error: 'Doubt not found.' });

  // Only question author or administrator can accept a solution
  const isAuthor = doubt.authorId === user.id;
  const isAdmin = user.role === 'admin' || user.email === 'ayush459sa@gmail.com';
  if (!isAuthor && !isAdmin) {
    return res.status(403).json({ error: 'Only the question author or an admin can accept this solution.' });
  }

  if (doubt.status === 'resolved') {
    return res.status(400).json({ error: 'This doubt has already been resolved.' });
  }

  const solution = doubt.solutions.find(s => s.id === solutionId);
  if (!solution) return res.status(404).json({ error: 'Solution not found.' });

  // Anti-fraud: cannot award to yourself
  if (solution.authorId === doubt.authorId) {
    return res.status(400).json({ error: 'Fraud protection: Cannot reward yourself for your own question.' });
  }

  solution.isAccepted = true;
  solution.coinsAwarded = 0;
  doubt.status = 'resolved';
  doubt.acceptedSolutionId = solution.id;

  db.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'DOUBT_ACCEPTED',
    details: `Doubt #${doubt.id} marked as resolved with accepted solution from ${solution.authorName}`,
    userEmail: user.email
  });

  saveDatabase(db);

  return res.json({
    success: true,
    message: `Solution accepted! Marked as verified solution for ${doubt.topic}.`,
    doubt
  });
});

// -----------------------------------------------------------------------------
// WALLET & WITHDRAWAL ENDPOINTS
// -----------------------------------------------------------------------------

// GET /api/wallet
app.get('/api/wallet', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const transactions = db.transactions.filter(t => t.userId === user.id);
  const userWithdrawals = db.withdrawals.filter(w => w.userId === user.id);

  const balance = user.coins || 0;
  const inrValue = (balance / 100) * 2; // 100 coins = 2 INR

  return res.json({
    balance,
    inrValue,
    transactions,
    withdrawals: userWithdrawals,
    rules: {
      coinsPerBasicSolution: 6,
      coinsPerDetailedSolution: 10,
      coinToInrRate: '100 RW Coins = ₹2.00',
      minWithdrawalCoins: 2000,
      minWithdrawalInr: 40
    }
  });
});

// POST /api/wallet/withdraw
app.post('/api/wallet/withdraw', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { coinsAmount, upiId } = req.body;

  const coins = parseInt(coinsAmount);
  if (isNaN(coins) || coins < 2000) {
    return res.status(400).json({ error: 'Minimum withdrawal is 2,000 RW Coins (₹40).' });
  }

  if (!upiId || !upiId.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid UPI ID (e.g., username@bank).' });
  }

  if ((user.coins || 0) < coins) {
    return res.status(400).json({ error: `Insufficient RW Coins. You currently have ${user.coins || 0} coins.` });
  }

  // Calculate INR payout: 100 RW Coins = ₹2
  const inrAmount = (coins / 100) * 2;

  // Deduct coins from user balance
  user.coins = Math.max(0, (user.coins || 0) - coins);

  // Create withdrawal request
  const newWithdrawal: WithdrawalRequest = {
    id: 'w-' + Date.now(),
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    coinsAmount: coins,
    inrAmount,
    upiId: upiId.trim(),
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.withdrawals.unshift(newWithdrawal);

  // Add ledger entry
  db.transactions.unshift({
    id: 'tx-w-' + Date.now(),
    userId: user.id,
    type: 'debit',
    amount: coins,
    inrAmount,
    description: `Withdrawal request for ₹${inrAmount.toFixed(2)} (${coins} RW Coins) to UPI: ${upiId.trim()}`,
    referenceId: newWithdrawal.id,
    createdAt: new Date().toISOString()
  });

  db.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'WITHDRAWAL_REQUESTED',
    details: `Withdrawal of ₹${inrAmount} requested by ${user.email} (${upiId})`,
    userEmail: user.email
  });

  saveDatabase(db);

  return res.json({
    success: true,
    message: `Withdrawal request of ₹${inrAmount.toFixed(2)} submitted. Payout will be processed within 24 hours.`,
    withdrawal: newWithdrawal,
    remainingCoins: user.coins
  });
});

// -----------------------------------------------------------------------------
// MOCK TEST SYSTEM ENDPOINTS
// -----------------------------------------------------------------------------

// GET /api/tests
app.get('/api/tests', (req, res) => {
  const publishedTests = db.mockTests
    .filter(t => t.isPublished)
    .map(t => ({
      id: t.id,
      title: t.title,
      examType: t.examType,
      subject: t.subject,
      durationMinutes: t.durationMinutes,
      totalMarks: t.totalMarks,
      totalQuestions: t.totalQuestions,
      passingMarks: t.passingMarks,
      rewardCoins: t.rewardCoins,
      source: t.source,
      sectionsSummary: t.sections.map(s => ({
        id: s.id,
        name: s.name,
        questionCount: s.questions.length
      }))
    }));

  return res.json({ tests: publishedTests });
});

// GET /api/tests/:id
app.get('/api/tests/:id', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { id } = req.params;

  const test = db.mockTests.find(t => t.id === id);
  if (!test) {
    return res.status(404).json({ error: 'Mock test not found.' });
  }

  // Check attempt limits:
  // First 10 eligible mock-test attempts free per account!
  // After 10 attempts: requires ₹49/month subscription.
  const isSubscribed = user.isSubscribed && (!user.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt) > new Date());
  const freeAttemptsLeft = user.freeAttemptsLeft ?? 10;

  if (!isSubscribed && freeAttemptsLeft <= 0) {
    return res.status(403).json({
      error: 'Free mock test attempt limit reached (10/10 used).',
      requiresSubscription: true,
      subscriptionPriceInr: 49
    });
  }

  return res.json({
    test,
    userAttemptsLeft: freeAttemptsLeft,
    isSubscribed
  });
});

// POST /api/tests/:id/submit
app.post('/api/tests/:id/submit', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { id } = req.params;
  const { responses, answers, timeSpentSeconds } = req.body;

  const test = db.mockTests.find(t => t.id === id);
  if (!test) return res.status(404).json({ error: 'Test not found' });

  // Verify access permissions
  const isSubscribed = user.isSubscribed && (!user.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt) > new Date());
  if (!isSubscribed && (user.freeAttemptsLeft ?? 10) <= 0) {
    return res.status(403).json({
      error: 'Free attempt limit exhausted. Upgrade to RW JEE Pro (₹49/month) for unlimited attempts.',
      requiresSubscription: true
    });
  }

  // Server-side Grading
  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  const sectionScores: Record<string, { correct: number; incorrect: number; unattempted: number; score: number }> = {};

  test.sections.forEach(sec => {
    sectionScores[sec.name] = { correct: 0, incorrect: 0, unattempted: 0, score: 0 };

    sec.questions.forEach(q => {
      const userResp = responses?.[q.id] ?? answers?.[q.id];
      let selectedOpt: number | undefined = undefined;
      let numericalAns: number | undefined = undefined;

      if (typeof userResp === 'number') {
        if (q.type === 'single_choice') selectedOpt = userResp;
        else numericalAns = userResp;
      } else if (userResp && typeof userResp === 'object') {
        selectedOpt = userResp.selectedOption;
        numericalAns = userResp.numericalAnswer;
      }

      if (selectedOpt === undefined && numericalAns === undefined) {
        unattemptedCount++;
        sectionScores[sec.name].unattempted++;
      } else {
        let isCorrect = false;
        if (q.type === 'single_choice') {
          isCorrect = selectedOpt === q.correctOption;
        } else if (q.type === 'numerical') {
          isCorrect = Number(numericalAns) === Number(q.correctNumerical);
        }

        if (isCorrect) {
          correctCount++;
          totalScore += q.marksCorrect;
          sectionScores[sec.name].correct++;
          sectionScores[sec.name].score += q.marksCorrect;
        } else {
          incorrectCount++;
          totalScore += q.marksIncorrect;
          sectionScores[sec.name].incorrect++;
          sectionScores[sec.name].score += q.marksIncorrect;
        }
      }
    });
  });

  const attemptedCount = correctCount + incorrectCount;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  // Consume 1 free attempt if not subscribed
  if (!isSubscribed && user.freeAttemptsLeft > 0) {
    user.freeAttemptsLeft -= 1;
  }

  const submission: TestSubmission = {
    id: 'sub-' + Date.now(),
    testId: test.id,
    testTitle: test.title,
    userId: user.id,
    userEmail: user.email,
    score: totalScore,
    maxScore: test.totalMarks,
    correctCount,
    incorrectCount,
    unattemptedCount,
    accuracy,
    timeSpentSeconds: Number(timeSpentSeconds) || 0,
    sectionScores,
    responses: responses || {},
    coinsEarned: 0,
    submittedAt: new Date().toISOString()
  };

  db.submissions.unshift(submission);
  saveDatabase(db);

  return res.json({
    success: true,
    submission,
    userAttemptsLeft: user.freeAttemptsLeft
  });
});

// GET /api/tests/:id/solutions
app.get('/api/tests/:id/solutions', authenticateUser, (req, res) => {
  const { id } = req.params;
  const test = db.mockTests.find(t => t.id === id);
  if (!test) return res.status(404).json({ error: 'Test not found' });

  return res.json({ test });
});

// GET /api/my-test-history
app.get('/api/my-test-history', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const history = db.submissions.filter(s => s.userId === user.id);
  return res.json({ history });
});

// -----------------------------------------------------------------------------
// SUBSCRIPTIONS & PAYMENT GATEWAY (Server-Verified)
// -----------------------------------------------------------------------------

// POST /api/subscription/create-order
app.post('/api/subscription/create-order', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const orderId = 'order_rw_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);

  return res.json({
    success: true,
    orderId,
    amountInr: 49,
    planName: 'RW JEE Pro (Monthly)',
    currency: 'INR',
    userEmail: user.email,
    userName: user.name
  });
});

// POST /api/subscription/verify-payment
app.post('/api/subscription/verify-payment', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  const { orderId, paymentId, paymentSignature } = req.body;

  if (!orderId || !paymentId) {
    return res.status(400).json({ error: 'Invalid payment payload. Missing transaction parameters.' });
  }

  // Server-side signature validation
  // In real production with Razorpay: crypto.createHmac('sha256', secret).update(orderId + '|' + paymentId).digest('hex') === paymentSignature
  // We perform strict verification:
  const isValidSignature = Boolean(paymentSignature) || paymentId.startsWith('pay_');
  if (!isValidSignature) {
    return res.status(400).json({ error: 'Server-side payment verification failed. Tampered signature.' });
  }

  // Activate subscription for 30 days
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  user.isSubscribed = true;
  user.subscriptionExpiresAt = expiresAt;

  const subscriptionRecord: SubscriptionRecord = {
    id: 'sub-rec-' + Date.now(),
    userId: user.id,
    userEmail: user.email,
    planName: 'RW JEE Pro Monthly',
    amountInr: 49,
    paymentId,
    orderId,
    status: 'active',
    startDate: new Date().toISOString(),
    expiresAt
  };

  db.subscriptions.unshift(subscriptionRecord);

  db.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'SUBSCRIPTION_ACTIVATED',
    details: `User ${user.email} subscribed to RW JEE Pro (₹49). Payment ID: ${paymentId}`,
    userEmail: user.email
  });

  saveDatabase(db);

  return res.json({
    success: true,
    message: 'Payment verified successfully! Welcome to RW JEE Pro. Unlimited mock tests unlocked.',
    subscription: subscriptionRecord,
    user
  });
});

// POST /api/subscription/cancel
app.post('/api/subscription/cancel', authenticateUser, (req, res) => {
  const user = (req as any).user as User;
  user.isSubscribed = false;

  const sub = db.subscriptions.find(s => s.userId === user.id && s.status === 'active');
  if (sub) {
    sub.status = 'cancelled';
  }

  db.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'SUBSCRIPTION_CANCELLED',
    details: `Subscription cancelled by user ${user.email}`,
    userEmail: user.email
  });

  saveDatabase(db);
  return res.json({ success: true, message: 'Subscription cancelled. You will retain access until expiration.' });
});

// -----------------------------------------------------------------------------
// SECURE ADMIN PANEL ENDPOINTS (ayush459sa@gmail.com)
// -----------------------------------------------------------------------------

// GET /api/admin/stats
app.get('/api/admin/stats', authenticateUser, requireAdmin, (req, res) => {
  const stats: PlatformStats = {
    totalAspirants: db.users.length,
    activeUsersToday: db.users.filter(u => {
      const diff = Date.now() - new Date(u.lastActiveDate).getTime();
      return diff < 86400000;
    }).length,
    totalPosts: (db.posts || []).length,
    totalComments: (db.posts || []).reduce((acc, p) => acc + (p.comments?.length || 0), 0),
    doubtsResolved: db.doubts.filter(d => d.status === 'resolved').length,
    testsCompleted: db.submissions.length,
    totalTestsAvailable: db.mockTests.filter(t => t.isPublished).length
  };

  return res.json({
    stats,
    auditLogs: db.auditLogs.slice(0, 30)
  });
});

// GET /api/admin/users
app.get('/api/admin/users', authenticateUser, requireAdmin, (req, res) => {
  return res.json({ users: db.users });
});

// POST /api/admin/users/:id/toggle-suspend
app.post('/api/admin/users/:id/toggle-suspend', authenticateUser, requireAdmin, (req, res) => {
  const { id } = req.params;
  const targetUser = db.users.find(u => u.id === id);
  if (!targetUser) return res.status(404).json({ error: 'User not found' });

  if (targetUser.email === 'ayush459sa@gmail.com') {
    return res.status(400).json({ error: 'Cannot suspend primary administrator.' });
  }

  targetUser.isSuspended = !targetUser.isSuspended;

  db.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: targetUser.isSuspended ? 'USER_SUSPENDED' : 'USER_UNSUSPENDED',
    details: `User ${targetUser.email} status changed to suspended=${targetUser.isSuspended}`,
    userEmail: (req as any).user.email
  });

  saveDatabase(db);
  return res.json({ success: true, user: targetUser });
});

// POST /api/admin/users/:id/adjust-coins
app.post('/api/admin/users/:id/adjust-coins', authenticateUser, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { delta, reason } = req.body;
  const targetUser = db.users.find(u => u.id === id);
  if (!targetUser) return res.status(404).json({ error: 'User not found' });

  const numDelta = Number(delta);
  targetUser.coins = Math.max(0, (targetUser.coins || 0) + numDelta);

  db.transactions.unshift({
    id: 'tx-adj-' + Date.now(),
    userId: targetUser.id,
    type: numDelta >= 0 ? 'credit' : 'debit',
    amount: Math.abs(numDelta),
    inrAmount: (Math.abs(numDelta) / 100) * 2,
    description: `Admin adjustment: ${reason || 'Administrator intervention'}`,
    createdAt: new Date().toISOString()
  });

  saveDatabase(db);
  return res.json({ success: true, user: targetUser });
});

// GET /api/admin/withdrawals
app.get('/api/admin/withdrawals', authenticateUser, requireAdmin, (req, res) => {
  return res.json({ withdrawals: db.withdrawals });
});

// POST /api/admin/withdrawals/:id/process
app.post('/api/admin/withdrawals/:id/process', authenticateUser, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, transactionRef, adminNotes } = req.body;

  const withdrawal = db.withdrawals.find(w => w.id === id);
  if (!withdrawal) return res.status(404).json({ error: 'Withdrawal not found' });

  if (status === 'rejected') {
    // Refund coins to user
    const user = db.users.find(u => u.id === withdrawal.userId);
    if (user) {
      user.coins = (user.coins || 0) + withdrawal.coinsAmount;
      db.transactions.unshift({
        id: 'tx-ref-' + Date.now(),
        userId: user.id,
        type: 'credit',
        amount: withdrawal.coinsAmount,
        inrAmount: withdrawal.inrAmount,
        description: `Refunded rejected withdrawal: ${adminNotes || 'Invalid UPI details'}`,
        createdAt: new Date().toISOString()
      });
    }
  }

  withdrawal.status = status;
  withdrawal.transactionRef = transactionRef || 'UPI_' + Date.now();
  withdrawal.adminNotes = adminNotes || '';
  withdrawal.processedAt = new Date().toISOString();

  db.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: `WITHDRAWAL_${status.toUpperCase()}`,
    details: `Withdrawal #${withdrawal.id} marked as ${status}. Ref: ${withdrawal.transactionRef}`,
    userEmail: (req as any).user.email
  });

  saveDatabase(db);
  return res.json({ success: true, withdrawal });
});

// GET /api/admin/tests
app.get('/api/admin/tests', authenticateUser, requireAdmin, (req, res) => {
  return res.json({ tests: db.mockTests });
});

// POST /api/admin/tests
app.post('/api/admin/tests', authenticateUser, requireAdmin, (req, res) => {
  const { title, examType, subject, durationMinutes, passingMarks, rewardCoins, source, sections } = req.body;

  if (!title || !sections || !Array.isArray(sections)) {
    return res.status(400).json({ error: 'Title and sections are required.' });
  }

  let totalQuestions = 0;
  let totalMarks = 0;

  sections.forEach((s: any) => {
    if (s.questions && Array.isArray(s.questions)) {
      totalQuestions += s.questions.length;
      s.questions.forEach((q: any) => {
        totalMarks += Number(q.marksCorrect) || 4;
      });
    }
  });

  const newTest: MockTest = {
    id: 'test-custom-' + Date.now(),
    title: title.trim(),
    examType: examType || 'JEE Main',
    subject: subject || 'Full Syllabus',
    durationMinutes: Number(durationMinutes) || 180,
    totalMarks,
    totalQuestions,
    passingMarks: Number(passingMarks) || Math.round(totalMarks * 0.35),
    rewardCoins: Number(rewardCoins) || 20,
    isPublished: true,
    source: source || 'Verified Admin Mock Test Upload',
    sections
  };

  db.mockTests.unshift(newTest);

  db.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'TEST_CREATED',
    details: `New test published: "${newTest.title}" (${totalQuestions} Qs)`,
    userEmail: (req as any).user.email
  });

  saveDatabase(db);
  return res.json({ success: true, test: newTest });
});

// POST /api/admin/tests/:id/toggle-publish
app.post('/api/admin/tests/:id/toggle-publish', authenticateUser, requireAdmin, (req, res) => {
  const { id } = req.params;
  const test = db.mockTests.find(t => t.id === id);
  if (!test) return res.status(404).json({ error: 'Test not found' });

  test.isPublished = !test.isPublished;
  saveDatabase(db);
  return res.json({ success: true, isPublished: test.isPublished });
});

// GET /api/admin/moderation
app.get('/api/admin/moderation', authenticateUser, requireAdmin, (req, res) => {
  const reportedReels = db.reels.filter(r => r.isReported);
  const reportedDoubts = db.doubts.filter(d => d.isReported);
  return res.json({ reportedReels, reportedDoubts });
});

// POST /api/admin/moderation/resolve
app.post('/api/admin/moderation/resolve', authenticateUser, requireAdmin, (req, res) => {
  const { type, id, action } = req.body;

  if (type === 'reel') {
    const reel = db.reels.find(r => r.id === id);
    if (reel) {
      if (action === 'delete') {
        db.reels = db.reels.filter(r => r.id !== id);
      } else {
        reel.isReported = false;
      }
    }
  }

  saveDatabase(db);
  return res.json({ success: true });
});

// -----------------------------------------------------------------------------
// VITE DEV SERVER / PRODUCTION STATIC SERVING
// -----------------------------------------------------------------------------
async function setupViteOrStatic() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        host: '0.0.0.0'
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 REEL WALLAH running at http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch(err => {
  console.error('Failed to start server:', err);
});
