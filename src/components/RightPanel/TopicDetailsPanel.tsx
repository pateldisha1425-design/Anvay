import React, { useMemo } from 'react';
import { 
  TopicNode, 
  RelationshipEdge, 
  LearningStatus 
} from '../../types/knowledge';
import { QuizResult } from '../../types/learning';
import { FeedbackReport, TopicReviewMeta } from '../../types/feedback';
import { diagnoseTopicPrerequisites } from '../../utils/gapFinder';
import { TopicRatingWidget } from '../Feedback/TopicRatingWidget';
import { 
  X, 
  BookOpen, 
  Network, 
  AlertTriangle, 
  ArrowRight, 
  Link2,
  FileText,
  Eye,
  GraduationCap,
  ShieldAlert,
  CheckCircle2,
  Lightbulb,
  Star,
  MessageSquarePlus,
  MessageSquareCheck,
  UserCheck,
  Calendar
} from 'lucide-react';

interface TopicDetailsPanelProps {
  topic: TopicNode | null;
  allTopics: TopicNode[];
  edges: RelationshipEdge[];
  statuses: Record<string, LearningStatus>;
  visitCount?: number;
  quizResults?: Record<string, QuizResult>;
  reviewMeta?: TopicReviewMeta;
  userRating?: number;
  reports?: FeedbackReport[];
  onClose: () => void;
  onSelectTopic: (topicId: string) => void;
  onOpenNote: (topicId: string) => void;
  onFocusInGraph: (topicId: string) => void;
  onUpdateStatus: (topicId: string, status: LearningStatus) => void;
  onRateTopic?: (topicId: string, rating: number) => void;
  onOpenFeedbackModal?: (topicId: string) => void;
  onOpenReviewDashboard?: () => void;
}

export const TopicDetailsPanel: React.FC<TopicDetailsPanelProps> = ({
  topic,
  allTopics,
  edges,
  statuses,
  visitCount = 0,
  quizResults = {},
  reviewMeta,
  userRating,
  reports = [],
  onClose,
  onSelectTopic,
  onOpenNote,
  onFocusInGraph,
  onUpdateStatus,
  onRateTopic,
  onOpenFeedbackModal,
  onOpenReviewDashboard,
}) => {
  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-zinc-500 text-xs">
        <FileText className="w-5 h-5 text-zinc-600 mb-1.5" />
        <p className="text-zinc-400">No concept selected</p>
        <p className="mt-1 text-[11px] text-zinc-600">
          Click any node or note to view its connections and links.
        </p>
      </div>
    );
  }

  const currentStatus = statuses[topic.id] || 'not_studied';
  const topicQuiz = quizResults[topic.id];

  // Backlinks: incoming edges or mentions
  const backlinks = useMemo(() => {
    return edges
      .filter(e => e.target === topic.id)
      .map(e => ({
        source: allTopics.find(t => t.id === e.source),
        label: e.label || e.type.replace('_', ' ')
      }))
      .filter((item): item is { source: TopicNode; label: string } => !!item.source);
  }, [topic, allTopics, edges]);

  // Direct Prerequisites
  const prerequisites = useMemo(() => {
    return topic.prerequisiteIds
      .map(id => allTopics.find(t => t.id === id))
      .filter((t): t is TopicNode => !!t);
  }, [topic, allTopics]);

  // Outgoing links & applications
  const outgoingLinks = useMemo(() => {
    return edges
      .filter(e => e.source === topic.id)
      .map(e => ({
        target: allTopics.find(t => t.id === e.target),
        label: e.label || e.type.replace('_', ' ')
      }))
      .filter((item): item is { target: TopicNode; label: string } => !!item.target);
  }, [topic, allTopics, edges]);

  // Related concepts
  const relatedConcepts = useMemo(() => {
    return topic.relatedIds
      .map(id => allTopics.find(t => t.id === id))
      .filter((t): t is TopicNode => !!t);
  }, [topic, allTopics]);

  return (
    <div className="flex flex-col h-full bg-[#18181a] select-none text-zinc-300 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#232326] bg-[#161618]">
        <span className="font-semibold text-[11px] uppercase tracking-wider text-zinc-400">
          Concept Details
        </span>
        <button
          onClick={onClose}
          className="p-1 text-zinc-500 hover:text-zinc-200 hover:bg-[#232328] rounded transition-colors"
          title="Close panel"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main content list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Title & Folder */}
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-0.5">
            {topic.category}
          </div>
          <h2 className="text-sm font-semibold text-zinc-100 leading-snug">
            {topic.title}
          </h2>
          <p className="mt-1.5 text-zinc-400 text-[11px] leading-relaxed">
            {topic.description}
          </p>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#232326] text-[11px]">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>Visited <strong className="font-semibold text-blue-300">{visitCount}</strong> {visitCount === 1 ? 'time' : 'times'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenNote(topic.id)}
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                Open note
              </button>
              <span className="text-zinc-600">•</span>
              <button
                onClick={() => onFocusInGraph(topic.id)}
                className="text-zinc-400 hover:text-zinc-200 hover:underline"
              >
                Graph
              </button>
            </div>
          </div>
        </div>

        {/* Study Status */}
        <div className="pt-2 border-t border-[#232326]">
          <label className="block text-[11px] text-zinc-500 mb-1">Learning status:</label>
          <select
            value={currentStatus}
            onChange={(e) => onUpdateStatus(topic.id, e.target.value as LearningStatus)}
            className="w-full bg-[#131315] border border-[#26262a] rounded px-2 py-1 text-zinc-200 text-[11px] focus:outline-none focus:border-zinc-500"
          >
            <option value="not_studied">⚪ Not studied</option>
            <option value="learning">🔵 Learning</option>
            <option value="needs_revision">🟡 Needs revision</option>
            <option value="learned">🟢 Learned</option>
          </select>
        </div>

        {/* Topic Rating & Academic Review Metadata */}
        <div className="pt-2 border-t border-[#232326] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider">
              Topic Rating & Review
            </span>
            <span className="font-mono text-amber-400 text-[11px] flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400" />
              {(reviewMeta?.averageRating || 4.5).toFixed(1)} / 5
            </span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onRateTopic && onRateTopic(topic.id, star)}
                className="p-1 hover:text-amber-400 transition-colors"
                title={`Rate ${star} stars`}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    star <= (userRating || Math.round(reviewMeta?.averageRating || 4.5))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-zinc-600'
                  }`}
                />
              </button>
            ))}
            <span className="text-[10px] text-zinc-500 ml-1">
              ({reviewMeta?.totalRatings || 6} ratings)
            </span>
          </div>

          {/* Last Reviewed Date Badge */}
          {reviewMeta?.lastReviewedAt && (
            <div className="p-2 rounded bg-[#161619] border border-[#232326] text-[10px] space-y-0.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <UserCheck className="w-3 h-3" />
                <span>Last Reviewed: {new Date(reviewMeta.lastReviewedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <p className="text-zinc-500 truncate">By {reviewMeta.reviewedBy || 'Academic Committee'}</p>
            </div>
          )}

          {/* Report Issue & Open Feedback Buttons */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => {
                if (onOpenFeedbackModal) onOpenFeedbackModal(topic.id);
                else onOpenNote(topic.id);
              }}
              className="py-1 px-2 rounded bg-[#202026] hover:bg-[#282830] text-zinc-300 hover:text-white border border-[#2a2a30] text-[10px] font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <MessageSquarePlus className="w-3 h-3 text-blue-400" />
              <span>Report Issue</span>
            </button>
            <button
              onClick={() => {
                if (onOpenReviewDashboard) onOpenReviewDashboard();
                else onOpenNote(topic.id);
              }}
              className="py-1 px-2 rounded bg-[#202026] hover:bg-[#282830] text-zinc-300 hover:text-white border border-[#2a2a30] text-[10px] font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <MessageSquareCheck className="w-3 h-3 text-emerald-400" />
              <span>All Reviews</span>
            </button>
          </div>
        </div>

        {/* Prerequisite Health Diagnostic Card */}
        {(() => {
          const diag = diagnoseTopicPrerequisites(topic.id, allTopics, edges, statuses, quizResults);
          return (
            <div className="pt-2 border-t border-[#232326] space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-zinc-400 uppercase tracking-wider">
                  Prerequisite Health
                </span>
                {diag.isReady ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Cleared</span>
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>{diag.gaps.length} missing</span>
                  </span>
                )}
              </div>

              {diag.gaps.length > 0 ? (
                <div className="p-2 rounded bg-[#241a15] border border-amber-900/50 space-y-1.5">
                  <p className="text-[10px] text-amber-200/90 leading-tight">
                    Dependencies required before mastering this note:
                  </p>
                  <div className="space-y-1">
                    {diag.gaps.slice(0, 3).map(g => (
                      <div
                        key={g.missingPrerequisiteId}
                        onClick={() => onSelectTopic(g.missingPrerequisiteId)}
                        className="text-[11px] text-amber-300 hover:underline cursor-pointer flex items-center justify-between"
                      >
                        <span className="truncate">[[{g.missingPrerequisiteTitle}]]</span>
                        <ArrowRight className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-zinc-500">
                  All foundational dependencies are satisfied.
                </p>
              )}
            </div>
          );
        })()}

        {/* Mastery Quiz Score Card */}
        <div className="pt-2 border-t border-[#232326] space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider">
              Mastery Quiz
            </span>
            {topicQuiz ? (
              <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
                topicQuiz.bestScore >= 70 
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50' 
                  : 'bg-amber-950/60 text-amber-400 border border-amber-800/50'
              }`}>
                {topicQuiz.bestScore}% {topicQuiz.isMastered && '• Mastered'}
              </span>
            ) : (
              <span className="text-[10px] text-zinc-500">Not taken</span>
            )}
          </div>

          <button
            onClick={() => onOpenNote(topic.id)}
            className="w-full py-1.5 rounded bg-[#202026] hover:bg-[#282830] text-zinc-200 border border-[#2d2d34] text-[11px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
            <span>{topicQuiz ? 'Retake Mastery Quiz' : 'Take Mastery Quiz'}</span>
          </button>
        </div>

        {/* Academic Review Warning if flagged */}
        {topic.reviewFlag?.flagged && (
          <div className="p-2 bg-[#221a14] border border-[#3d2a15] rounded text-[11px] text-amber-200/90 space-y-0.5">
            <div className="flex items-center gap-1 text-amber-400 font-medium">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>Academic review</span>
            </div>
            <p className="text-[10px] text-amber-300/80 leading-relaxed">
              {topic.reviewFlag.reason}
            </p>
          </div>
        )}

        {/* Backlinks */}
        <div className="pt-2 border-t border-[#232326]">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
            Backlinks ({backlinks.length})
          </span>
          {backlinks.length === 0 ? (
            <p className="text-[11px] text-zinc-600 italic">No incoming links</p>
          ) : (
            <div className="space-y-1">
              {backlinks.map((b, idx) => (
                <div
                  key={`${b.source.id}-${idx}`}
                  onClick={() => onSelectTopic(b.source.id)}
                  className="py-0.5 flex items-center justify-between text-[11px] text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                >
                  <span className="truncate">{b.source.title}</span>
                  <span className="text-[10px] text-zinc-600 ml-1 shrink-0">{b.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prerequisites */}
        <div className="pt-2 border-t border-[#232326]">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
            Prerequisites ({prerequisites.length})
          </span>
          {prerequisites.length === 0 ? (
            <p className="text-[11px] text-zinc-600 italic">None</p>
          ) : (
            <div className="space-y-1">
              {prerequisites.map(p => (
                <div
                  key={p.id}
                  onClick={() => onSelectTopic(p.id)}
                  className="py-0.5 flex items-center justify-between text-[11px] text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                >
                  <span className="truncate">{p.title}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-zinc-600 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Outgoing Links */}
        {outgoingLinks.length > 0 && (
          <div className="pt-2 border-t border-[#232326]">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Outgoing Connections ({outgoingLinks.length})
            </span>
            <div className="space-y-1">
              {outgoingLinks.map((out, idx) => (
                <div
                  key={`${out.target.id}-${idx}`}
                  onClick={() => onSelectTopic(out.target.id)}
                  className="py-0.5 flex items-center justify-between text-[11px] text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                >
                  <span className="truncate">{out.target.title}</span>
                  <span className="text-[10px] text-zinc-600 ml-1 shrink-0">{out.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Concepts */}
        {relatedConcepts.length > 0 && (
          <div className="pt-2 border-t border-[#232326]">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Related Concepts ({relatedConcepts.length})
            </span>
            <div className="space-y-1">
              {relatedConcepts.map(r => (
                <div
                  key={r.id}
                  onClick={() => onSelectTopic(r.id)}
                  className="py-0.5 flex items-center justify-between text-[11px] text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                >
                  <span className="truncate">{r.title}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-zinc-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
