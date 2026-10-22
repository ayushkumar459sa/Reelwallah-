export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  avatar: string;
  bio: string;
  role: UserRole;
  dreamIit: string;
  targetYear: string;
  targetExam: 'JEE Main' | 'JEE Advanced' | 'Both';
  studyStreak: number;
  lastActiveDate: string;
  coins?: number;
  freeAttemptsLeft: number;
  isSubscribed: boolean;
  subscriptionExpiresAt?: string;
  isSuspended?: boolean;
  createdAt: string;
}

export type SubjectType = 'Physics' | 'Chemistry' | 'Mathematics' | 'Strategy';

export interface Reel {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorExamTag: string;
  title: string;
  subject: SubjectType;
  chapter: string;
  description: string;
  tags: string[];
  videoUrl: string;
  likes: number;
  likedBy: string[];
  commentsCount: number;
  savesCount: number;
  savedBy: string[];
  viewsCount: number;
  createdAt: string;
  isReported?: boolean;
}

export interface ReelComment {
  id: string;
  reelId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface DoubtSolution {
  id: string;
  doubtId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  solutionType: 'basic' | 'detailed';
  solutionText: string;
  solutionSteps?: string[];
  formulaUsed?: string;
  solutionImage?: string;
  isAccepted: boolean;
  coinsAwarded: number;
  createdAt: string;
}

export interface Doubt {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  topic: string;
  questionText: string;
  questionImage?: string;
  bountyCoins: number;
  status: 'open' | 'resolved';
  acceptedSolutionId?: string;
  solutions: DoubtSolution[];
  createdAt: string;
  isReported?: boolean;
}

export interface RoomChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  isQuestion?: boolean;
  createdAt: string;
}

export interface StudyRoom {
  id: string;
  title: string;
  category: 'silent' | 'physics' | 'chemistry' | 'maths' | 'advanced';
  topic: string;
  targetTimeMin: number;
  activeCount: number;
  hostName: string;
  isSilent: boolean;
  ambientSound?: 'lofi' | 'rain' | 'library' | 'clock';
  challenge: string;
  messages: RoomChatMessage[];
}

export type QuestionType = 'single_choice' | 'numerical';

export interface TestQuestion {
  id: string;
  questionNumber: number;
  sectionId: string;
  type: QuestionType;
  questionText: string;
  options?: string[];
  correctOption?: number; // 0-indexed: 0=A, 1=B, 2=C, 3=D
  correctNumerical?: number;
  marksCorrect: number;
  marksIncorrect: number;
  explanation: string;
  keyFormula?: string;
  difficulty: 'Easy' | 'Moderate' | 'JEE Advanced Hard';
}

export interface TestSection {
  id: string;
  name: 'Physics' | 'Chemistry' | 'Mathematics';
  questions: TestQuestion[];
}

export interface MockTest {
  id: string;
  title: string;
  examType: 'JEE Main' | 'JEE Advanced';
  subject: 'Full Syllabus' | 'Physics' | 'Chemistry' | 'Mathematics';
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  passingMarks: number;
  rewardCoins: number;
  isPublished: boolean;
  source: string;
  sections: TestSection[];
}

export type QuestionAnswerStatus =
  | 'not_visited'
  | 'not_answered'
  | 'answered'
  | 'marked_for_review'
  | 'answered_and_marked';

export interface TestQuestionResponse {
  questionId: string;
  selectedOption?: number;
  numericalAnswer?: number;
  status: QuestionAnswerStatus;
  timeSpentSeconds: number;
}

export interface TestSubmission {
  id: string;
  testId: string;
  testTitle: string;
  userId: string;
  userEmail: string;
  score: number;
  maxScore: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  accuracy: number;
  timeSpentSeconds: number;
  sectionScores: Record<
    string,
    { correct: number; incorrect: number; unattempted: number; score: number }
  >;
  responses: Record<string, TestQuestionResponse>;
  coinsEarned: number;
  percentile?: number;
  submittedAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number; // RW Coins
  inrAmount: number; // in INR
  description: string;
  referenceId?: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  coinsAmount: number;
  inrAmount: number;
  upiId: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  transactionRef?: string;
  createdAt: string;
  processedAt?: string;
}

export interface SubscriptionRecord {
  id: string;
  userId: string;
  userEmail: string;
  planName: string;
  amountInr: number;
  paymentId: string;
  orderId: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  expiresAt: string;
}

export interface UpiPaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  amountInr: number;
  upiId: string;
  utrNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  processedAt?: string;
}

export interface PlatformStats {
  totalAspirants: number;
  activeUsersToday: number;
  totalPosts: number;
  totalComments: number;
  doubtsResolved: number;
  testsCompleted: number;
  totalTestsAvailable: number;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: string;
  text: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: string;
  authorDreamIit?: string;
  content: string;
  image?: string;
  subjectTag?: string;
  likes: string[];
  comments: CommunityComment[];
  createdAt: string;
}

export interface LiveChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  dreamIit?: string;
  text: string;
  image?: string;
  createdAt: string;
}

