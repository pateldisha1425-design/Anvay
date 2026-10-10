import { LearningStatus, TopicNode } from './knowledge';

export type ResourceType = 'textbook' | 'paper' | 'lecture' | 'formula' | 'interactive';

export interface LearningResource {
  id: string;
  title: string;
  type: ResourceType;
  authorOrSource: string;
  citationOrLink?: string;
  description: string;
  keyTakeaways?: string[];
  difficulty: 'introductory' | 'intermediate' | 'advanced';
  tags?: string[];
}

export type ExplanationMode = 'standard' | 'intuitive' | 'rigorous' | 'mechanism' | 'exam_viva';

export interface AlternativeExplanation {
  mode: ExplanationMode;
  modeLabel: string;
  title: string;
  subtitle: string;
  content: string; // Markdown formatted
  keyInsight: string;
  cognitiveAnchor: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  formulaSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
  prerequisiteTopicId?: string; // Links diagnostic gap when answered incorrectly
}

export interface TopicQuiz {
  topicId: string;
  title: string;
  passingScorePercent: number;
  questions: QuizQuestion[];
}

export interface QuizResult {
  topicId: string;
  bestScore: number;
  lastScore: number;
  attemptsCount: number;
  isMastered: boolean;
  lastAttemptDate: string;
  missedPrerequisiteIds: string[];
}

export type GapSeverity = 'critical' | 'warning' | 'advisory';

export interface PrerequisiteGap {
  targetTopicId: string;
  targetTopicTitle: string;
  missingPrerequisiteId: string;
  missingPrerequisiteTitle: string;
  missingPrerequisiteCategory: string;
  depth: number; // 1 = direct, 2+ = transitive
  reason: 'not_studied' | 'learning' | 'quiz_failed' | 'needs_revision';
  severity: GapSeverity;
  recommendedAction: string;
}

export interface TopicDiagnosticResult {
  topicId: string;
  topicTitle: string;
  isReady: boolean;
  totalPrerequisites: number;
  satisfiedPrerequisites: number;
  gaps: PrerequisiteGap[];
  recommendedLearningPath: string[]; // Ordered list of topic IDs to learn first
}

export interface SyllabusModuleProgress {
  folderId: string;
  folderName: string;
  totalTopics: number;
  learnedTopics: number;
  masteredQuizzes: number;
  percentage: number;
}

export interface SyllabusOverallProgress {
  totalTopics: number;
  learnedCount: number;
  learningCount: number;
  needsRevisionCount: number;
  notStudiedCount: number;
  totalVisits: number;
  quizzesAttempted: number;
  quizzesMastered: number;
  overallMasteryPercentage: number;
  totalGapsDetected: number;
  moduleBreakdown: SyllabusModuleProgress[];
}
