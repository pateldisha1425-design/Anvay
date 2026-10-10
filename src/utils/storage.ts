import { LearningStatus, TopicNode, RelationshipEdge } from '../types/knowledge';
import { QuizResult } from '../types/learning';
import { FeedbackReport, TopicReviewMeta, ReportStatus } from '../types/feedback';
import { INITIAL_FEEDBACK_REPORTS, INITIAL_TOPIC_REVIEWS, getInitialReviewMetaForTopic } from '../data/feedbackData';

const STORAGE_KEYS = {
  STATUSES: 'blue_learning_statuses_v1',
  EDITED_CONTENT: 'blue_edited_notes_v1',
  CUSTOM_TOPICS: 'blue_custom_topics_v1',
  CUSTOM_EDGES: 'blue_custom_edges_v1',
  OPEN_TABS: 'blue_open_tabs_v1',
  ACTIVE_TAB: 'blue_active_tab_v1',
  VISITS: 'anvay_topic_visits_v1',
  QUIZ_RESULTS: 'anvay_quiz_results_v1',
  USER_RATINGS: 'anvay_user_ratings_v1',
  FEEDBACK_REPORTS: 'anvay_feedback_reports_v1',
  TOPIC_REVIEWS: 'anvay_topic_reviews_v1',
};

export function getStoredTopicVisits(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VISITS);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to load topic visits from localStorage', err);
    return {};
  }
}

export function recordTopicVisit(topicId: string): Record<string, number> {
  try {
    const current = getStoredTopicVisits();
    current[topicId] = (current[topicId] || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(current));
    return current;
  } catch (err) {
    console.warn('Failed to record topic visit in localStorage', err);
    return {};
  }
}

export function getStoredStatuses(): Record<string, LearningStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATUSES);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to load statuses from localStorage', err);
    return {};
  }
}

export function saveStoredStatus(topicId: string, status: LearningStatus): void {
  try {
    const current = getStoredStatuses();
    current[topicId] = status;
    localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to save status to localStorage', err);
  }
}

export function getStoredEditedContent(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EDITED_CONTENT);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to load edited content', err);
    return {};
  }
}

export function saveStoredEditedContent(topicId: string, content: string): void {
  try {
    const current = getStoredEditedContent();
    current[topicId] = content;
    localStorage.setItem(STORAGE_KEYS.EDITED_CONTENT, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to save edited content', err);
  }
}

export function getStoredCustomTopics(): TopicNode[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_TOPICS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to load custom topics', err);
    return [];
  }
}

export function saveStoredCustomTopic(topic: TopicNode): void {
  try {
    const current = getStoredCustomTopics();
    const idx = current.findIndex(t => t.id === topic.id);
    if (idx >= 0) {
      current[idx] = topic;
    } else {
      current.push(topic);
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_TOPICS, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to save custom topic', err);
  }
}

export function deleteStoredTopic(topicId: string): void {
  try {
    const current = getStoredCustomTopics().filter(t => t.id !== topicId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_TOPICS, JSON.stringify(current));
    
    // Also remove any edit content or status
    const edits = getStoredEditedContent();
    delete edits[topicId];
    localStorage.setItem(STORAGE_KEYS.EDITED_CONTENT, JSON.stringify(edits));

    const statuses = getStoredStatuses();
    delete statuses[topicId];
    localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(statuses));
  } catch (err) {
    console.warn('Failed to delete custom topic', err);
  }
}

export function getStoredQuizResults(): Record<string, QuizResult> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to load quiz results from localStorage', err);
    return {};
  }
}

export function saveStoredQuizResult(topicId: string, result: QuizResult): Record<string, QuizResult> {
  try {
    const current = getStoredQuizResults();
    current[topicId] = result;
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(current));
    return current;
  } catch (err) {
    console.warn('Failed to save quiz result in localStorage', err);
    return {};
  }
}

// ----------------------------------------------------
// Topic Ratings (1-5 Stars)
// ----------------------------------------------------
export function getStoredUserRatings(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_RATINGS);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to load ratings from localStorage', err);
    return {};
  }
}

export function saveStoredUserRating(topicId: string, rating: number): Record<string, number> {
  try {
    const current = getStoredUserRatings();
    current[topicId] = rating;
    localStorage.setItem(STORAGE_KEYS.USER_RATINGS, JSON.stringify(current));

    // Also update review metadata stats locally
    const reviews = getStoredTopicReviews();
    const meta = reviews[topicId] || getInitialReviewMetaForTopic(topicId);
    
    // Recalculate average: blend initial baseline with new rating
    const total = (meta.totalRatings || 0) + 1;
    const currentTotalSum = (meta.averageRating || 4.5) * (meta.totalRatings || 5);
    const newAverage = Number(((currentTotalSum + rating) / (total)).toFixed(1));
    
    reviews[topicId] = {
      ...meta,
      averageRating: Math.min(5, Math.max(1, newAverage)),
      totalRatings: total,
      updatedAt: new Date().toISOString()
    };
    saveStoredTopicReviews(reviews);

    return current;
  } catch (err) {
    console.warn('Failed to save user rating in localStorage', err);
    return {};
  }
}

// ----------------------------------------------------
// Feedback Reports (Issues, Gaps, Graph Suggestions)
// ----------------------------------------------------
export function getStoredFeedbackReports(): FeedbackReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACK_REPORTS);
    if (!raw) {
      // Seed with initial realistic reports
      localStorage.setItem(STORAGE_KEYS.FEEDBACK_REPORTS, JSON.stringify(INITIAL_FEEDBACK_REPORTS));
      return INITIAL_FEEDBACK_REPORTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load feedback reports from localStorage', err);
    return INITIAL_FEEDBACK_REPORTS;
  }
}

export function saveStoredFeedbackReport(report: FeedbackReport): FeedbackReport[] {
  try {
    const current = getStoredFeedbackReports();
    const existingIndex = current.findIndex(r => r.id === report.id);
    let updated: FeedbackReport[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = report;
    } else {
      updated = [report, ...current];
    }
    localStorage.setItem(STORAGE_KEYS.FEEDBACK_REPORTS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save feedback report to localStorage', err);
    return [];
  }
}

export function updateStoredReportStatus(
  reportId: string, 
  status: ReportStatus, 
  reviewerNotes?: string, 
  reviewedBy?: string
): FeedbackReport[] {
  try {
    const current = getStoredFeedbackReports();
    const now = new Date().toISOString();
    const updated = current.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status,
          reviewerNotes: reviewerNotes !== undefined ? reviewerNotes : r.reviewerNotes,
          reviewedBy: reviewedBy || r.reviewedBy || 'Faculty Reviewer',
          reviewedAt: now,
          updatedAt: now,
        };
      }
      return r;
    });
    localStorage.setItem(STORAGE_KEYS.FEEDBACK_REPORTS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to update report status in localStorage', err);
    return [];
  }
}

// ----------------------------------------------------
// Topic Review Metadata & Last Reviewed Dates
// ----------------------------------------------------
export function getStoredTopicReviews(): Record<string, TopicReviewMeta> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOPIC_REVIEWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TOPIC_REVIEWS, JSON.stringify(INITIAL_TOPIC_REVIEWS));
      return INITIAL_TOPIC_REVIEWS;
    }
    const parsed = JSON.parse(raw);
    return { ...INITIAL_TOPIC_REVIEWS, ...parsed };
  } catch (err) {
    console.warn('Failed to load topic reviews from localStorage', err);
    return INITIAL_TOPIC_REVIEWS;
  }
}

export function saveStoredTopicReviews(reviews: Record<string, TopicReviewMeta>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TOPIC_REVIEWS, JSON.stringify(reviews));
  } catch (err) {
    console.warn('Failed to save topic reviews to localStorage', err);
  }
}

export function updateStoredTopicReview(
  topicId: string, 
  updates: Partial<TopicReviewMeta>
): Record<string, TopicReviewMeta> {
  try {
    const current = getStoredTopicReviews();
    const existing = current[topicId] || getInitialReviewMetaForTopic(topicId);
    current[topicId] = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveStoredTopicReviews(current);
    return current;
  } catch (err) {
    console.warn('Failed to update topic review in localStorage', err);
    return {};
  }
}

export function resetAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.STATUSES);
    localStorage.removeItem(STORAGE_KEYS.EDITED_CONTENT);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_TOPICS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_EDGES);
    localStorage.removeItem(STORAGE_KEYS.OPEN_TABS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB);
    localStorage.removeItem(STORAGE_KEYS.VISITS);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.USER_RATINGS);
    localStorage.removeItem(STORAGE_KEYS.FEEDBACK_REPORTS);
    localStorage.removeItem(STORAGE_KEYS.TOPIC_REVIEWS);
  } catch (err) {
    console.warn('Failed to reset localStorage', err);
  }
}
