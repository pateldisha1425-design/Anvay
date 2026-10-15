export type FeedbackCategory = 
  | 'error' 
  | 'unclear' 
  | 'missing_prereq' 
  | 'missing_example' 
  | 'poor_resource' 
  | 'graph_connection';

export type FeedbackSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ReporterRole = 'student' | 'teacher';
export type ReportStatus = 'pending' | 'under_review' | 'resolved' | 'rejected';

export interface GraphSuggestion {
  sourceTopicId: string;
  targetTopicId: string;
  suggestedRelationType: 'prerequisite' | 'related' | 'part_of' | 'application_of' | 'preparation_of';
  description: string;
}

export interface FeedbackReport {
  id: string;
  topicId: string;
  topicTitle: string;
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  reporterRole: ReporterRole;
  reporterId: string;
  reporterName: string;
  comment: string;
  graphSuggestion?: GraphSuggestion;
  status: ReportStatus;
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TopicRating {
  id: string;
  topicId: string;
  userId: string;
  userName?: string;
  rating: number; // 1 to 5
  createdAt: string;
  updatedAt: string;
}

export interface TopicReviewMeta {
  topicId: string;
  lastReviewedAt: string; // ISO string
  reviewedBy: string;
  reviewNotes?: string;
  averageRating: number;
  totalRatings: number;
  unresolvedIssues?: number;
  updatedAt: string;
}

export interface TopicRatingStats {
  averageRating: number;
  totalRatings: number;
  userRating?: number;
}
