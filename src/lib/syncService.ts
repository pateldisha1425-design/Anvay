import { 
  doc, 
  setDoc, 
  getDocs, 
  collection, 
  onSnapshot,
  query,
  orderBy 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { LearningStatus, TopicNode } from '../types/knowledge';
import { FeedbackReport, TopicReviewMeta, TopicRating, ReportStatus } from '../types/feedback';

export interface UserTopicRecord {
  userId: string;
  topicId: string;
  status: LearningStatus;
  visitCount: number;
  updatedAt: string;
}

export interface UserNoteRecord {
  userId: string;
  topicId: string;
  title: string;
  content: string;
  folderId: string;
  updatedAt: string;
}

// Save topic status and visits to Firestore
export async function syncTopicStateToCloud(
  userId: string,
  topicId: string,
  status: LearningStatus,
  visitCount: number
): Promise<void> {
  const path = `users/${userId}/topic_states/${topicId}`;
  try {
    const topicRef = doc(db, 'users', userId, 'topic_states', topicId);
    await setDoc(topicRef, {
      userId,
      topicId,
      status,
      visitCount,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Save custom note to Firestore
export async function syncCustomNoteToCloud(
  userId: string,
  note: TopicNode
): Promise<void> {
  const path = `users/${userId}/custom_notes/${note.id}`;
  try {
    const noteRef = doc(db, 'users', userId, 'custom_notes', note.id);
    await setDoc(noteRef, {
      userId,
      topicId: note.id,
      title: note.title,
      content: note.content,
      folderId: note.folderId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Subscribe to user cloud data changes
export function subscribeToUserCloudData(
  userId: string,
  onTopicStates: (records: Record<string, { status: LearningStatus; visitCount: number }>) => void,
  onCustomNotes: (notes: TopicNode[]) => void
): () => void {
  const topicPath = `users/${userId}/topic_states`;
  const unsubTopics = onSnapshot(
    collection(db, 'users', userId, 'topic_states'),
    (snapshot) => {
      const result: Record<string, { status: LearningStatus; visitCount: number }> = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as UserTopicRecord;
        if (data.topicId) {
          result[data.topicId] = {
            status: data.status,
            visitCount: data.visitCount || 0
          };
        }
      });
      onTopicStates(result);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, topicPath);
    }
  );

  const notesPath = `users/${userId}/custom_notes`;
  const unsubNotes = onSnapshot(
    collection(db, 'users', userId, 'custom_notes'),
    (snapshot) => {
      const notesList: TopicNode[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as UserNoteRecord;
        notesList.push({
          id: data.topicId,
          title: data.title,
          folderId: data.folderId || 'personal',
          category: 'Personal Notes',
          topicType: 'definition',
          description: `User cloud note: ${data.title}`,
          content: data.content,
          prerequisiteIds: [],
          relatedIds: [],
          source: 'Student Cloud Notes',
          isCustom: true,
          updatedAt: data.updatedAt
        });
      });
      onCustomNotes(notesList);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, notesPath);
    }
  );

  return () => {
    unsubTopics();
    unsubNotes();
  };
}

// ====================================================
// Shared Topic Ratings Cloud Sync
// ====================================================
export async function syncRatingToCloud(rating: TopicRating): Promise<void> {
  const ratingId = `${rating.userId}_${rating.topicId}`;
  const path = `topic_ratings/${ratingId}`;
  try {
    const ref = doc(db, 'topic_ratings', ratingId);
    await setDoc(ref, {
      id: ratingId,
      topicId: rating.topicId,
      userId: rating.userId,
      userName: rating.userName || 'Student',
      rating: rating.rating,
      createdAt: rating.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ====================================================
// Shared Feedback Reports Cloud Sync
// ====================================================
export async function syncFeedbackReportToCloud(report: FeedbackReport): Promise<void> {
  const path = `feedback_reports/${report.id}`;
  try {
    const ref = doc(db, 'feedback_reports', report.id);
    await setDoc(ref, {
      id: report.id,
      topicId: report.topicId,
      topicTitle: report.topicTitle,
      category: report.category,
      severity: report.severity || 'medium',
      reporterRole: report.reporterRole,
      reporterId: report.reporterId,
      reporterName: report.reporterName || 'Anonymous',
      comment: report.comment,
      status: report.status || 'pending',
      graphSuggestion: report.graphSuggestion || null,
      reviewerNotes: report.reviewerNotes || '',
      reviewedBy: report.reviewedBy || '',
      reviewedAt: report.reviewedAt || '',
      createdAt: report.createdAt || new Date().toISOString(),
      updatedAt: report.updatedAt || new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateReportStatusInCloud(
  reportId: string,
  status: ReportStatus,
  reviewerNotes?: string,
  reviewedBy?: string
): Promise<void> {
  const path = `feedback_reports/${reportId}`;
  try {
    const ref = doc(db, 'feedback_reports', reportId);
    const updatePayload: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (reviewerNotes !== undefined) updatePayload.reviewerNotes = reviewerNotes;
    if (reviewedBy) {
      updatePayload.reviewedBy = reviewedBy;
      updatePayload.reviewedAt = new Date().toISOString();
    }
    await setDoc(ref, updatePayload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ====================================================
// Shared Topic Reviews & Last Reviewed Dates Cloud Sync
// ====================================================
export async function syncTopicReviewMetaToCloud(meta: TopicReviewMeta): Promise<void> {
  const path = `topic_reviews/${meta.topicId}`;
  try {
    const ref = doc(db, 'topic_reviews', meta.topicId);
    await setDoc(ref, {
      topicId: meta.topicId,
      lastReviewedAt: meta.lastReviewedAt,
      reviewedBy: meta.reviewedBy || 'Curriculum Committee',
      reviewNotes: meta.reviewNotes || '',
      averageRating: meta.averageRating,
      totalRatings: meta.totalRatings,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ====================================================
// Real-Time Shared Feedback & Reviews Listener
// ====================================================
export function subscribeToSharedFeedback(
  onReports: (reports: FeedbackReport[]) => void,
  onReviews: (reviews: Record<string, TopicReviewMeta>) => void
): () => void {
  // Feedback reports
  const unsubReports = onSnapshot(
    collection(db, 'feedback_reports'),
    (snapshot) => {
      const reports: FeedbackReport[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as FeedbackReport;
        if (data.id && data.topicId) {
          reports.push(data);
        }
      });
      if (reports.length > 0) {
        onReports(reports);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'feedback_reports');
    }
  );

  // Topic review meta
  const unsubReviews = onSnapshot(
    collection(db, 'topic_reviews'),
    (snapshot) => {
      const reviews: Record<string, TopicReviewMeta> = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as TopicReviewMeta;
        if (data.topicId) {
          reviews[data.topicId] = data;
        }
      });
      if (Object.keys(reviews).length > 0) {
        onReviews(reviews);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'topic_reviews');
    }
  );

  return () => {
    unsubReports();
    unsubReviews();
  };
}
