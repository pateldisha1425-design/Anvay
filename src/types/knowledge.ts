export type RelationshipType = 
  | 'prerequisite'
  | 'related'
  | 'part_of'
  | 'application_of'
  | 'preparation_of';

export type LearningStatus = 
  | 'not_studied'
  | 'learning'
  | 'needs_revision'
  | 'learned';

export type TopicType = 
  | 'definition'
  | 'classification'
  | 'material'
  | 'property'
  | 'process'
  | 'application'
  | 'structure';

export interface AcademicReviewFlag {
  flagged: boolean;
  reason: string;
}

export interface TopicNode {
  id: string;
  title: string;
  folderId: string;
  category: string;
  topicType: TopicType;
  description: string;
  content: string;
  prerequisiteIds: string[];
  relatedIds: string[];
  applicationIds?: string[];
  reviewFlag?: AcademicReviewFlag;
  source: string;
  tags?: string[];
  isCustom?: boolean;
  updatedAt?: string;
}

export interface RelationshipEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  label?: string;
  description?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  parentId?: string;
  order: number;
}

export interface TabItem {
  id: string; // usually note ID, 'graph-view', or 'review-dashboard'
  title: string;
  type: 'graph' | 'note' | 'review';
  isDirty?: boolean;
}

export interface GraphFilterOptions {
  selectedFolder: string | 'all';
  selectedStatus: LearningStatus | 'all';
  selectedRelationType: RelationshipType | 'all';
  searchQuery: string;
  highlightMode: 'all' | 'immediate' | 'prerequisites' | 'isolated' | 'gaps';
}
