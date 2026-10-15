import { LearningStatus, TopicNode, RelationshipEdge, FolderItem } from '../types/knowledge';
import { QuizResult, ContentDepthLevel } from '../types/learning';
import { FeedbackReport, TopicReviewMeta, ReportStatus } from '../types/feedback';
import { INITIAL_FEEDBACK_REPORTS, INITIAL_TOPIC_REVIEWS, getInitialReviewMetaForTopic } from '../data/feedbackData';
import { ImmersionSettings, SavedVocabularyItem, ImmersionQuizAttempt } from '../types/immersion';
import { INITIAL_FOLDERS } from '../data/syllabusData';

const STORAGE_KEYS = {
  STATUSES: 'blue_learning_statuses_v1',
  EDITED_CONTENT: 'blue_edited_notes_v1',
  CUSTOM_TOPICS: 'blue_custom_topics_v1',
  CUSTOM_EDGES: 'blue_custom_edges_v1',
  CUSTOM_FOLDERS: 'anvay_custom_folders_v1',
  OPEN_TABS: 'blue_open_tabs_v1',
  ACTIVE_TAB: 'blue_active_tab_v1',
  VISITS: 'anvay_topic_visits_v1',
  QUIZ_RESULTS: 'anvay_quiz_results_v1',
  USER_RATINGS: 'anvay_user_ratings_v1',
  FEEDBACK_REPORTS: 'anvay_feedback_reports_v1',
  TOPIC_REVIEWS: 'anvay_topic_reviews_v1',
  DEPTH_LEVEL: 'anvay_depth_level_v1',
  STUDY_DATES: 'anvay_last_study_dates_v1',
  REVIEW_INTERVALS: 'anvay_review_intervals_v1',
  IMMERSION_SETTINGS: 'anvay_immersion_settings_v1',
  SAVED_VOCABULARY: 'anvay_saved_vocabulary_v1',
  IMMERSION_QUIZZES: 'anvay_immersion_quizzes_v1',
};

export function getStoredDepthLevel(): ContentDepthLevel {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEPTH_LEVEL);
    if (raw === 'foundational' || raw === 'undergraduate' || raw === 'gate_honors' || raw === 'unified') {
      return raw;
    }
    return 'undergraduate';
  } catch (err) {
    return 'undergraduate';
  }
}

export function saveStoredDepthLevel(level: ContentDepthLevel): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DEPTH_LEVEL, level);
  } catch (err) {
    console.warn('Failed to save depth level in localStorage', err);
  }
}

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

export function getStoredFolders(): FolderItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_FOLDERS);
    if (!raw) {
      return INITIAL_FOLDERS;
    }
    const customList: FolderItem[] = JSON.parse(raw);
    const map = new Map<string, FolderItem>();
    INITIAL_FOLDERS.forEach(f => map.set(f.id, f));
    customList.forEach(f => map.set(f.id, f));
    return Array.from(map.values());
  } catch (err) {
    console.warn('Failed to load folders from localStorage', err);
    return INITIAL_FOLDERS;
  }
}

export function saveStoredFolder(folder: FolderItem): FolderItem[] {
  try {
    const current = getStoredFolders();
    const idx = current.findIndex(f => f.id === folder.id);
    let updated: FolderItem[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = folder;
    } else {
      updated = [...current, folder];
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FOLDERS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save folder to localStorage', err);
    return INITIAL_FOLDERS;
  }
}

export function deleteStoredFolder(folderId: string): FolderItem[] {
  try {
    // Only custom folders can be deleted, not default ones
    const current = getStoredFolders();
    const updated = current.filter(f => f.id !== folderId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FOLDERS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to delete folder from localStorage', err);
    return INITIAL_FOLDERS;
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

// ----------------------------------------------------
// Spaced Repetition Study Dates & Intervals
// ----------------------------------------------------
export function getStoredStudyDates(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDY_DATES);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to load study dates from localStorage', err);
    return {};
  }
}

export function saveStoredStudyDate(topicId: string, dateIso: string = new Date().toISOString()): Record<string, string> {
  try {
    const current = getStoredStudyDates();
    current[topicId] = dateIso;
    localStorage.setItem(STORAGE_KEYS.STUDY_DATES, JSON.stringify(current));
    return current;
  } catch (err) {
    console.warn('Failed to save study date to localStorage', err);
    return {};
  }
}

export function saveAllStoredStudyDates(dates: Record<string, string>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDY_DATES, JSON.stringify(dates));
  } catch (err) {
    console.warn('Failed to save all study dates to localStorage', err);
  }
}

export function getStoredReviewIntervals(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEW_INTERVALS);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to load review intervals from localStorage', err);
    return {};
  }
}

export function saveStoredReviewInterval(topicId: string, intervalDays: number): Record<string, number> {
  try {
    const current = getStoredReviewIntervals();
    current[topicId] = intervalDays;
    localStorage.setItem(STORAGE_KEYS.REVIEW_INTERVALS, JSON.stringify(current));
    return current;
  } catch (err) {
    console.warn('Failed to save review interval to localStorage', err);
    return {};
  }
}

export const DEFAULT_IMMERSION_SETTINGS: ImmersionSettings = {
  isEnabled: false, // OFF by default
  level: 'beginner',
  highlightStyle: 'subtle_saffron',
  showDevanagari: true,
};

export function getStoredImmersionSettings(): ImmersionSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.IMMERSION_SETTINGS);
    if (!raw) return DEFAULT_IMMERSION_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      isEnabled: typeof parsed.isEnabled === 'boolean' ? parsed.isEnabled : false,
      level: ['beginner', 'intermediate', 'advanced'].includes(parsed.level) ? parsed.level : 'beginner',
      highlightStyle: 'subtle_saffron',
      showDevanagari: parsed.showDevanagari ?? true,
    };
  } catch (err) {
    return DEFAULT_IMMERSION_SETTINGS;
  }
}

export function saveStoredImmersionSettings(settings: ImmersionSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.IMMERSION_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save immersion settings to localStorage', err);
  }
}

export function getStoredSavedVocabulary(): Record<string, SavedVocabularyItem> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_VOCABULARY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to load saved vocabulary from localStorage', err);
    return {};
  }
}

export function saveStoredVocabularyWord(
  wordId: string, 
  item?: Partial<SavedVocabularyItem>
): Record<string, SavedVocabularyItem> {
  try {
    const current = getStoredSavedVocabulary();
    const existing = current[wordId];
    current[wordId] = {
      wordId,
      savedAt: existing?.savedAt || new Date().toISOString(),
      mastered: existing?.mastered || false,
      timesReviewed: (existing?.timesReviewed || 0) + (item?.timesReviewed || 0),
      lastReviewedAt: item?.lastReviewedAt || existing?.lastReviewedAt,
      notes: item?.notes ?? existing?.notes,
      ...item,
    };
    localStorage.setItem(STORAGE_KEYS.SAVED_VOCABULARY, JSON.stringify(current));
    return current;
  } catch (err) {
    console.warn('Failed to save vocabulary word to localStorage', err);
    return {};
  }
}

export function removeStoredVocabularyWord(wordId: string): Record<string, SavedVocabularyItem> {
  try {
    const current = getStoredSavedVocabulary();
    delete current[wordId];
    localStorage.setItem(STORAGE_KEYS.SAVED_VOCABULARY, JSON.stringify(current));
    return current;
  } catch (err) {
    console.warn('Failed to remove vocabulary word from localStorage', err);
    return {};
  }
}

export function toggleStoredVocabularyMastered(wordId: string): Record<string, SavedVocabularyItem> {
  try {
    const current = getStoredSavedVocabulary();
    if (current[wordId]) {
      current[wordId].mastered = !current[wordId].mastered;
      current[wordId].lastReviewedAt = new Date().toISOString();
      current[wordId].timesReviewed = (current[wordId].timesReviewed || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.SAVED_VOCABULARY, JSON.stringify(current));
    }
    return current;
  } catch (err) {
    console.warn('Failed to toggle vocabulary mastered state', err);
    return {};
  }
}

export function getStoredImmersionQuizAttempts(): ImmersionQuizAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.IMMERSION_QUIZZES);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to load immersion quiz history', err);
    return [];
  }
}

export function saveStoredImmersionQuizAttempt(attempt: ImmersionQuizAttempt): ImmersionQuizAttempt[] {
  try {
    const current = getStoredImmersionQuizAttempts();
    const updated = [attempt, ...current].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEYS.IMMERSION_QUIZZES, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save immersion quiz attempt', err);
    return [];
  }
}

export function resetAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.STATUSES);
    localStorage.removeItem(STORAGE_KEYS.EDITED_CONTENT);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_TOPICS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_EDGES);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_FOLDERS);
    localStorage.removeItem(STORAGE_KEYS.OPEN_TABS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB);
    localStorage.removeItem(STORAGE_KEYS.VISITS);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.USER_RATINGS);
    localStorage.removeItem(STORAGE_KEYS.FEEDBACK_REPORTS);
    localStorage.removeItem(STORAGE_KEYS.TOPIC_REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.STUDY_DATES);
    localStorage.removeItem(STORAGE_KEYS.REVIEW_INTERVALS);
    localStorage.removeItem(STORAGE_KEYS.IMMERSION_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.SAVED_VOCABULARY);
    localStorage.removeItem(STORAGE_KEYS.IMMERSION_QUIZZES);
  } catch (err) {
    console.warn('Failed to reset localStorage', err);
  }
}
