import React from 'react';
import { 
  TopicNode, 
  RelationshipEdge, 
  LearningStatus, 
  TabItem, 
  GraphFilterOptions 
} from '../../types/knowledge';
import { QuizResult } from '../../types/learning';
import { FeedbackReport, TopicReviewMeta, ReportStatus } from '../../types/feedback';
import { GraphView } from '../Graph/GraphView';
import { NoteViewer } from './NoteViewer';
import { NoteEditor } from './NoteEditor';
import { ReviewDashboard } from '../Feedback/ReviewDashboard';
import { 
  X, 
  Network, 
  FileText, 
  BookOpen, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  ClipboardCheck as MessageSquareCheck
} from 'lucide-react';

interface NoteWorkspaceProps {
  openTabs: TabItem[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onOpenGraphTab: () => void;
  onOpenNoteTab: (topicId: string) => void;
  onCreateNewNoteClick: () => void;
  topics: TopicNode[];
  edges: RelationshipEdge[];
  statuses: Record<string, LearningStatus>;
  onUpdateStatus: (topicId: string, status: LearningStatus) => void;
  onSaveNoteContent: (topicId: string, newContent: string) => void;
  onResetNoteToDefault?: (topicId: string) => void;
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
  filterOptions: GraphFilterOptions;
  onUpdateFilters: (filters: Partial<GraphFilterOptions>) => void;
  topicVisits: Record<string, number>;
  quizResults?: Record<string, QuizResult>;
  missingPrerequisiteNodeIds?: Set<string>;
  onQuizCompleted?: (topicId: string, result: QuizResult) => void;
  onHighlightGapsInGraph?: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  tabModes: Record<string, 'read' | 'edit'>;
  onToggleTabMode: (tabId: string) => void;
  // Topic ratings, review metadata & feedback reports
  topicReviews?: Record<string, TopicReviewMeta>;
  userRatings?: Record<string, number>;
  reports?: FeedbackReport[];
  isCloudConnected?: boolean;
  onRateTopic?: (topicId: string, rating: number) => void;
  onSubmitFeedbackReport?: (report: FeedbackReport, optionalRating?: number) => void;
  onUpdateReportStatus?: (reportId: string, status: ReportStatus, reviewerNotes?: string, reviewedBy?: string) => void;
  onUpdateTopicReview?: (topicId: string, updates: Partial<TopicReviewMeta>) => void;
}

export const NoteWorkspace: React.FC<NoteWorkspaceProps> = ({
  openTabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onOpenGraphTab,
  onOpenNoteTab,
  onCreateNewNoteClick,
  topics,
  edges,
  statuses,
  onUpdateStatus,
  onSaveNoteContent,
  onResetNoteToDefault,
  selectedTopicId,
  onSelectTopic,
  filterOptions,
  onUpdateFilters,
  topicVisits,
  quizResults = {},
  missingPrerequisiteNodeIds,
  onQuizCompleted,
  onHighlightGapsInGraph,
  canGoBack,
  canGoForward,
  onNavigateBack,
  onNavigateForward,
  tabModes,
  onToggleTabMode,
  topicReviews = {},
  userRatings = {},
  reports = [],
  isCloudConnected = false,
  onRateTopic,
  onSubmitFeedbackReport,
  onUpdateReportStatus,
  onUpdateTopicReview,
}) => {
  const activeTopic = topics.find(t => t.id === activeTabId);
  const isGraphTab = activeTabId === 'graph-view';
  const isReviewDashboardTab = activeTabId === 'review-dashboard';
  const currentMode = tabModes[activeTabId] || 'read';

  return (
    <div className="flex flex-col h-full bg-[#161618] overflow-hidden">
      {/* Compact Obsidian Tab Bar */}
      <div className="flex items-center justify-between bg-[#131315] border-b border-[#232326] px-1.5 h-8 select-none shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-0.5 h-full">
          {/* History Navigation Arrows (< >) */}
          <div className="flex items-center space-x-0.5 pr-1 mr-1 border-r border-[#232326]">
            <button
              onClick={onNavigateBack}
              disabled={!canGoBack}
              className={`p-1 rounded transition-colors ${
                canGoBack ? 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]' : 'text-zinc-600 cursor-not-allowed'
              }`}
              title="Navigate back"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onNavigateForward}
              disabled={!canGoForward}
              className={`p-1 rounded transition-colors ${
                canGoForward ? 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]' : 'text-zinc-600 cursor-not-allowed'
              }`}
              title="Navigate forward"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Graph View Tab */}
          <button
            onClick={onOpenGraphTab}
            className={`flex items-center gap-1.5 px-3 h-full text-[12px] border-r border-[#232326] transition-colors ${
              isGraphTab
                ? 'bg-[#161618] text-zinc-100 font-medium border-t-2 border-t-blue-500'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#18181b]'
            }`}
          >
            <Network className={`w-3.5 h-3.5 ${isGraphTab ? 'text-blue-400' : 'text-zinc-500'}`} />
            <span>Graph view</span>
          </button>

          {/* Open Note Tabs */}
          {openTabs.map(tab => {
            const isActive = tab.id === activeTabId;
            const topic = topics.find(t => t.id === tab.id);
            const status = topic ? statuses[topic.id] : undefined;

            return (
              <div
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`group flex items-center gap-1.5 px-2.5 h-full text-[12px] cursor-pointer border-r border-[#232326] transition-colors ${
                  isActive
                    ? 'bg-[#161618] text-zinc-100 font-medium border-t-2 border-t-blue-500'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#18181b]'
                }`}
              >
                {tab.type === 'review' || tab.id === 'review-dashboard' ? (
                  <MessageSquareCheck className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                ) : (
                  <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-zinc-300' : 'text-zinc-600'}`} />
                )}
                <span className="truncate max-w-[120px] sm:max-w-[160px]">
                  {tab.title}
                </span>

                {status === 'needs_revision' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" title="Needs revision" />
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="p-0.5 rounded text-zinc-500 hover:text-zinc-200 hover:bg-[#25252b] ml-1 opacity-60 group-hover:opacity-100 transition-opacity"
                  title="Close tab"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          {/* New Tab Button */}
          <button
            onClick={onCreateNewNoteClick}
            className="p-1 text-zinc-500 hover:text-zinc-300 hover:bg-[#1d1d20] rounded ml-0.5"
            title="Create new note"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Bar Right Actions (Reading/Editing Toggle) */}
        {!isGraphTab && activeTopic && (
          <div className="flex items-center space-x-1 pr-1.5">
            <button
              onClick={() => onToggleTabMode(activeTopic.id)}
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-zinc-400 hover:text-zinc-200 hover:bg-[#202024] rounded transition-colors"
              title={currentMode === 'read' ? 'Switch to Editing view' : 'Switch to Reading view'}
            >
              {currentMode === 'read' ? (
                <>
                  <Edit3 className="w-3 h-3" />
                  <span className="hidden sm:inline">Edit</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-400 hidden sm:inline">Reading</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 overflow-hidden relative">
        {isGraphTab ? (
          <GraphView
            topics={topics}
            edges={edges}
            statuses={statuses}
            topicVisits={topicVisits}
            missingPrerequisiteNodeIds={missingPrerequisiteNodeIds}
            selectedTopicId={selectedTopicId}
            onSelectTopic={onSelectTopic}
            onOpenNote={onOpenNoteTab}
            filterOptions={filterOptions}
            onUpdateFilters={onUpdateFilters}
          />
        ) : isReviewDashboardTab ? (
          <div className="w-full h-full overflow-y-auto bg-[#161618]">
            <ReviewDashboard
              allTopics={topics}
              reports={reports}
              topicReviews={topicReviews}
              userRatings={userRatings}
              isCloudConnected={isCloudConnected}
              onUpdateReportStatus={onUpdateReportStatus || (() => {})}
              onUpdateTopicReview={onUpdateTopicReview || (() => {})}
              onOpenTopicNote={(topicId) => {
                onSelectTopic(topicId);
                onOpenNoteTab(topicId);
              }}
              onFocusInGraph={(topicId) => {
                onSelectTopic(topicId);
                onOpenGraphTab();
              }}
            />
          </div>
        ) : activeTopic ? (
          <div className="w-full h-full overflow-y-auto bg-[#161618]">
            {currentMode === 'read' ? (
              <NoteViewer
                topic={activeTopic}
                allTopics={topics}
                edges={edges}
                statuses={statuses}
                visitCount={topicVisits[activeTopic.id] || 1}
                savedQuizResult={quizResults[activeTopic.id]}
                reviewMeta={topicReviews[activeTopic.id]}
                userRating={userRatings[activeTopic.id]}
                reports={reports}
                onNavigateTopic={(targetId) => {
                  onSelectTopic(targetId);
                  onOpenNoteTab(targetId);
                }}
                onFocusInGraph={(topicId) => {
                  onSelectTopic(topicId);
                  onOpenGraphTab();
                }}
                onUpdateStatus={onUpdateStatus}
                onQuizCompleted={onQuizCompleted}
                onHighlightGapsInGraph={onHighlightGapsInGraph}
                onRateTopic={onRateTopic}
                onSubmitFeedbackReport={onSubmitFeedbackReport}
                onUpdateReportStatus={onUpdateReportStatus}
              />
            ) : (
              <NoteEditor
                topic={activeTopic}
                allTopics={topics}
                onSaveContent={onSaveNoteContent}
                onResetToDefault={onResetNoteToDefault}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-xs space-y-2">
            <Network className="w-7 h-7 text-zinc-600 mb-1" />
            <p>No note open</p>
            <button
              onClick={onOpenGraphTab}
              className="px-2.5 py-1 bg-[#242428] hover:bg-[#2b2b30] text-zinc-300 rounded text-xs transition-colors"
            >
              Open Graph View
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
