import { TopicNode, LearningStatus } from '../types/knowledge';
import { QuizResult } from '../types/learning';

export interface TopicReviewSchedule {
  topicId: string;
  topicTitle: string;
  category: string;
  folderId: string;
  lastStudyDate: string; // ISO date string
  lastStudyDateFormatted: string;
  daysSinceStudy: number;
  intervalDays: number;
  dueDate: string; // ISO date string
  dueDateFormatted: string;
  isOverdue: boolean;
  daysOverdue: number;
  urgencyScore: number;
  urgencyLevel: 'critical' | 'high' | 'moderate' | 'safe' | 'new';
  repetitionCount: number;
  learningStatus: LearningStatus;
  quizMastery?: boolean;
  quizScore?: number;
  retentionEstimatePercent: number; // Ebbinghaus retention estimate
  reason: string;
  suggestedAction: string;
}

export interface SpacedRepetitionOverview {
  topSuggestedTopic: TopicReviewSchedule | null;
  overdueCount: number;
  dueTodayCount: number;
  upcomingCount: number;
  totalTracked: number;
  allSchedules: TopicReviewSchedule[];
  dueQueue: TopicReviewSchedule[];
}

/**
 * Seed realistic baseline last study dates for initial topics so new sessions immediately have rich,
 * scientifically plausible spaced repetition schedules.
 */
export const INITIAL_STUDY_DATES_SEED: Record<string, string> = {
  // Studied 6 days ago (interval was 2-3 days, now overdue!)
  'oxides-definition': new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  // Studied 4 days ago (status: needs revision, interval 1 day -> critical overdue!)
  'ab-oxides': new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  // Studied 7 days ago (interval was 4 days -> overdue)
  'perovskite-oxides': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  // Studied 3 days ago (interval 3 days -> due today)
  'conducting-polymers-intro': new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  // Studied 10 days ago (interval 7 days -> overdue)
  'sol-gel-synthesis': new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  // Studied 1 day ago (interval 3 days -> safe/upcoming)
  'polyacetylene': new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  // Studied 2 days ago (interval 3 days -> due tomorrow)
  'oled-working-principle': new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  // Studied 5 days ago (interval 3 days -> overdue)
  'quantum-dots': new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  // Studied 12 days ago (interval 7 days -> overdue)
  'carbon-nanotubes': new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
};

/**
 * Calculates days between two date strings or Date objects
 */
export function getDaysBetweenDates(earlierDate: Date | string, laterDate: Date | string): number {
  const d1 = typeof earlierDate === 'string' ? new Date(earlierDate) : earlierDate;
  const d2 = typeof laterDate === 'string' ? new Date(laterDate) : laterDate;
  const diffMs = d2.getTime() - d1.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Computes estimated memory retention using Ebbinghaus forgetting curve approximation:
 * R = e^(-t / S), where t is elapsed days and S is memory stability (interval * 1.4)
 */
export function estimateMemoryRetention(daysElapsed: number, intervalDays: number): number {
  if (daysElapsed <= 0) return 100;
  const stability = Math.max(1, intervalDays * 1.4);
  const retention = Math.exp(-daysElapsed / stability) * 100;
  return Math.round(Math.max(15, Math.min(99, retention)));
}

/**
 * Determines target spaced repetition interval (in days) based on topic learning status,
 * repetition count, and quiz performance.
 */
export function computeTargetIntervalDays(
  status: LearningStatus,
  visitCount: number,
  quizResult?: QuizResult
): number {
  // 1. If marked as 'needs_revision', urgent repetition required (1 day interval)
  if (status === 'needs_revision') {
    return 1;
  }

  // 2. If 'learning', progressive consolidation interval (2 to 3 days)
  if (status === 'learning') {
    return visitCount > 2 ? 3 : 2;
  }

  // 3. If 'learned', classical exponential spaced repetition intervals (Leitner/SM-2 inspired):
  // Repetition 1: 3 days, Repetition 2: 7 days, Repetition 3: 14 days, Repetition 4+: 30 days
  if (status === 'learned') {
    let baseInterval = 3;
    if (visitCount >= 5) {
      baseInterval = 30;
    } else if (visitCount >= 3) {
      baseInterval = 14;
    } else if (visitCount >= 2) {
      baseInterval = 7;
    }

    // Adapt based on mastery quiz result
    if (quizResult) {
      if (quizResult.isMastered || quizResult.bestScore >= 80) {
        baseInterval = Math.round(baseInterval * 1.3); // High confidence bonus
      } else if (quizResult.lastScore < 60) {
        baseInterval = Math.max(1, Math.round(baseInterval * 0.5)); // Penalty on quiz struggle
      }
    }

    return baseInterval;
  }

  // 4. If 'not_studied', base interval is 0 (first encounter)
  return 1;
}

/**
 * Formats a date relative to today (e.g., "Today", "Yesterday", "3 days ago")
 */
export function formatRelativeDate(isoDate: string, now: Date = new Date()): string {
  if (!isoDate) return 'Never studied';
  const target = new Date(isoDate);
  const days = getDaysBetweenDates(target, now);

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} ${months === 1 ? 'month' : 'months'} ago`;
}

/**
 * Generates the full spaced repetition review schedule and identifies the top recommended topic to revisit.
 */
export function calculateSpacedRepetitionSchedule(
  allTopics: TopicNode[],
  statuses: Record<string, LearningStatus>,
  studyDates: Record<string, string>,
  topicVisits: Record<string, number>,
  quizResults: Record<string, QuizResult> = {},
  currentDate: Date = new Date()
): SpacedRepetitionOverview {
  const scheduleList: TopicReviewSchedule[] = [];

  for (const topic of allTopics) {
    const status = statuses[topic.id] || 'not_studied';
    const visits = topicVisits[topic.id] || 0;
    const quiz = quizResults[topic.id];

    // Get last study date from recorded study dates, fallback to seed or quiz date
    let rawStudyDate = studyDates[topic.id];
    if (!rawStudyDate) {
      if (quiz?.lastAttemptDate) {
        rawStudyDate = quiz.lastAttemptDate;
      } else if (INITIAL_STUDY_DATES_SEED[topic.id]) {
        rawStudyDate = INITIAL_STUDY_DATES_SEED[topic.id];
      }
    }

    // If still no study date:
    // If user has visits or status !== not_studied, estimate a reasonable baseline date
    if (!rawStudyDate && (visits > 0 || status !== 'not_studied')) {
      const simulatedAgoDays = status === 'needs_revision' ? 3 : (status === 'learned' ? 6 : 4);
      rawStudyDate = new Date(currentDate.getTime() - simulatedAgoDays * 24 * 60 * 60 * 1000).toISOString();
    }

    const hasStudied = !!rawStudyDate;
    const lastDate = hasStudied ? new Date(rawStudyDate) : currentDate;
    const daysSinceStudy = hasStudied ? getDaysBetweenDates(lastDate, currentDate) : 999;
    
    const intervalDays = computeTargetIntervalDays(status, visits, quiz);
    const dueDateObj = new Date(lastDate.getTime() + intervalDays * 24 * 60 * 60 * 1000);
    const dueDateIso = dueDateObj.toISOString();

    const daysOverdue = hasStudied ? daysSinceStudy - intervalDays : 0;
    const isOverdue = hasStudied && daysOverdue > 0;
    const isDueToday = hasStudied && daysOverdue === 0;

    // Urgency Score calculation:
    // Ratio of elapsed time to target interval, with multipliers for 'needs_revision' and failed quizzes
    let urgencyScore = 0;
    if (hasStudied) {
      urgencyScore = (daysSinceStudy + 0.5) / Math.max(1, intervalDays);
      if (status === 'needs_revision') {
        urgencyScore += 4.0; // Needs revision is urgent
      }
      if (quiz && quiz.lastScore < 60) {
        urgencyScore += 2.0; // Struggled in quiz
      }
    } else {
      // Unstudied topics: moderate baseline if foundational (0 prerequisites)
      urgencyScore = topic.prerequisiteIds.length === 0 ? 0.9 : 0.4;
    }

    // Urgency level tag
    let urgencyLevel: 'critical' | 'high' | 'moderate' | 'safe' | 'new' = 'safe';
    if (!hasStudied) {
      urgencyLevel = 'new';
    } else if (status === 'needs_revision' && isOverdue) {
      urgencyLevel = 'critical';
    } else if (daysOverdue >= 3) {
      urgencyLevel = 'critical';
    } else if (isOverdue || isDueToday) {
      urgencyLevel = 'high';
    } else if (daysSinceStudy >= intervalDays - 1) {
      urgencyLevel = 'moderate';
    } else {
      urgencyLevel = 'safe';
    }

    const retention = hasStudied 
      ? estimateMemoryRetention(daysSinceStudy, intervalDays)
      : 0;

    // Generate human-friendly reasoning
    let reason = '';
    let suggestedAction = 'Review concept to maintain recall';

    if (!hasStudied) {
      reason = 'Not yet studied. Ready for introductory reading.';
      suggestedAction = 'Begin initial study';
    } else if (status === 'needs_revision') {
      reason = `Marked as "Needs Revision" ${formatRelativeDate(rawStudyDate, currentDate).toLowerCase()} (interval: 1 day). Overdue by ${Math.max(1, daysOverdue)} ${daysOverdue === 1 ? 'day' : 'days'}. Revisit now to resolve uncertainties.`;
      suggestedAction = 'Revisit notes & test understanding';
    } else if (isOverdue) {
      reason = `Last studied ${formatRelativeDate(rawStudyDate, currentDate).toLowerCase()}. Recommended review interval is ${intervalDays} ${intervalDays === 1 ? 'day' : 'days'}. Overdue by ${daysOverdue} ${daysOverdue === 1 ? 'day' : 'days'} (${retention}% estimated retention).`;
      suggestedAction = 'Active recall review';
    } else if (isDueToday) {
      reason = `Scheduled for review today! Target interval reached (${intervalDays} ${intervalDays === 1 ? 'day' : 'days'} since last study). Reinforcing today will consolidate long-term memory.`;
      suggestedAction = 'Perform scheduled spaced review';
    } else {
      const daysUntilDue = intervalDays - daysSinceStudy;
      reason = `Recently consolidated (${formatRelativeDate(rawStudyDate, currentDate).toLowerCase()}). Next review due in ${daysUntilDue} ${daysUntilDue === 1 ? 'day' : 'days'}. Estimated retention is high (${retention}%).`;
      suggestedAction = 'On schedule';
    }

    scheduleList.push({
      topicId: topic.id,
      topicTitle: topic.title,
      category: topic.category,
      folderId: topic.folderId,
      lastStudyDate: rawStudyDate || '',
      lastStudyDateFormatted: hasStudied 
        ? lastDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Never',
      daysSinceStudy,
      intervalDays,
      dueDate: dueDateIso,
      dueDateFormatted: dueDateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      isOverdue,
      daysOverdue,
      urgencyScore,
      urgencyLevel,
      repetitionCount: visits,
      learningStatus: status,
      quizMastery: quiz?.isMastered,
      quizScore: quiz?.bestScore,
      retentionEstimatePercent: retention,
      reason,
      suggestedAction
    });
  }

  // Sort schedule:
  // Highest urgency score first, then most days overdue, then lowest retention
  scheduleList.sort((a, b) => {
    // Put studied topics with overdue reviews first
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;

    // Both overdue: sort by urgency score
    if (b.urgencyScore !== a.urgencyScore) {
      return b.urgencyScore - a.urgencyScore;
    }

    return b.daysOverdue - a.daysOverdue;
  });

  // Filter due queue (overdue or due today)
  const dueQueue = scheduleList.filter(item => item.isOverdue || item.urgencyLevel === 'high' || item.urgencyLevel === 'critical');
  const overdueCount = scheduleList.filter(item => item.isOverdue).length;
  const dueTodayCount = scheduleList.filter(item => item.lastStudyDate && item.daysOverdue === 0).length;
  const upcomingCount = scheduleList.filter(item => item.lastStudyDate && item.daysOverdue < 0).length;
  const totalTracked = scheduleList.filter(item => item.lastStudyDate).length;

  // Top suggested topic is the first item in the sorted list that has been studied before
  // If all studied topics are 100% fresh, fallback to first item
  const topSuggestedTopic = scheduleList.find(s => s.lastStudyDate) || scheduleList[0] || null;

  return {
    topSuggestedTopic,
    overdueCount,
    dueTodayCount,
    upcomingCount,
    totalTracked,
    allSchedules: scheduleList,
    dueQueue
  };
}
