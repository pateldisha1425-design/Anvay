import React, { useMemo, useState } from 'react';
import { TopicNode, RelationshipEdge, LearningStatus } from '../../types/knowledge';
import { QuizResult } from '../../types/learning';
import { resolveWikiLink } from '../../utils/wikiLinks';
import { diagnoseTopicPrerequisites } from '../../utils/gapFinder';
import { AlternativeExplanationsView } from '../AlternativeExplanations/AlternativeExplanationsView';
import { ResourcesView } from '../LearningResources/ResourcesView';
import { MasteryQuizView } from '../Quiz/MasteryQuizView';
import { TopicFeedbackTab } from '../Feedback/TopicFeedbackTab';
import { FeedbackModal } from '../Feedback/FeedbackModal';
import { TopicRatingWidget } from '../Feedback/TopicRatingWidget';
import { FeedbackReport, TopicReviewMeta, ReportStatus } from '../../types/feedback';
import { 
  AlertTriangle, 
  ArrowRight, 
  Link2, 
  CornerDownRight, 
  Sparkles,
  BookMarked,
  Eye,
  FileText,
  Lightbulb,
  BookOpen,
  GraduationCap,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  Star,
  ClipboardCheck as MessageSquareCheck,
  MessageSquarePlus,
  UserCheck,
  Calendar
} from 'lucide-react';

interface NoteViewerProps {
  topic: TopicNode;
  allTopics: TopicNode[];
  edges: RelationshipEdge[];
  statuses: Record<string, LearningStatus>;
  visitCount?: number;
  savedQuizResult?: QuizResult;
  reviewMeta?: TopicReviewMeta;
  userRating?: number;
  reports?: FeedbackReport[];
  onNavigateTopic: (topicId: string) => void;
  onFocusInGraph: (topicId: string) => void;
  onUpdateStatus?: (topicId: string, status: LearningStatus) => void;
  onQuizCompleted?: (topicId: string, result: QuizResult) => void;
  onHighlightGapsInGraph?: () => void;
  onRateTopic?: (topicId: string, rating: number) => void;
  onSubmitFeedbackReport?: (report: FeedbackReport, optionalRating?: number) => void;
  onUpdateReportStatus?: (reportId: string, status: ReportStatus, reviewerNotes?: string, reviewedBy?: string) => void;
}

export const NoteViewer: React.FC<NoteViewerProps> = ({
  topic,
  allTopics,
  edges,
  statuses,
  visitCount = 1,
  savedQuizResult,
  reviewMeta,
  userRating,
  reports = [],
  onNavigateTopic,
  onFocusInGraph,
  onUpdateStatus,
  onQuizCompleted,
  onHighlightGapsInGraph,
  onRateTopic,
  onSubmitFeedbackReport,
  onUpdateReportStatus,
}) => {
  const [activeViewTab, setActiveViewTab] = useState<'note' | 'alternatives' | 'resources' | 'quiz' | 'prereqs' | 'feedback'>('note');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Prerequisite diagnostic for this topic
  const topicDiagnostic = useMemo(() => {
    return diagnoseTopicPrerequisites(
      topic.id,
      allTopics,
      edges,
      statuses,
      savedQuizResult ? { [topic.id]: savedQuizResult } : {}
    );
  }, [topic.id, allTopics, edges, statuses, savedQuizResult]);
  // Find backlinks
  const backlinks = useMemo(() => {
    const list: { topic: TopicNode; reason: string }[] = [];
    const thisTitleLower = topic.title.toLowerCase();
    const thisIdLower = topic.id.toLowerCase();

    allTopics.forEach(t => {
      if (t.id === topic.id) return;

      const incomingEdge = edges.find(e => e.source === t.id && e.target === topic.id);
      if (incomingEdge) {
        list.push({ topic: t, reason: incomingEdge.label || incomingEdge.type.replace('_', ' ') });
        return;
      }

      const contentLower = t.content.toLowerCase();
      if (
        contentLower.includes(`[[${thisTitleLower}`) ||
        contentLower.includes(`[[${thisIdLower}`)
      ) {
        list.push({ topic: t, reason: 'Referenced in note' });
      }
    });

    return list;
  }, [topic, allTopics, edges]);

  // Prerequisites
  const prerequisites = useMemo(() => {
    return topic.prerequisiteIds
      .map(id => allTopics.find(t => t.id === id))
      .filter((t): t is TopicNode => !!t);
  }, [topic, allTopics]);

  // Related topics
  const relatedTopics = useMemo(() => {
    return topic.relatedIds
      .map(id => allTopics.find(t => t.id === id))
      .filter((t): t is TopicNode => !!t);
  }, [topic, allTopics]);

  // Applications
  const applications = useMemo(() => {
    return edges
      .filter(e => e.source === topic.id && e.type === 'application_of')
      .map(e => allTopics.find(t => t.id === e.target))
      .filter((t): t is TopicNode => !!t);
  }, [topic, allTopics, edges]);

  // Render markdown text
  const renderFormattedContent = (rawText: string) => {
    const lines = rawText.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    const formatInline = (text: string): React.ReactNode[] => {
      const parts = text.split(/(\[\[.*?\]\])/g);

      return parts.map((part, index) => {
        // WikiLink match [[...]]
        if (part.startsWith('[[') && part.endsWith(']]')) {
          const rawLink = part.slice(2, -2);
          const { targetTopic, displayText } = resolveWikiLink(rawLink, allTopics);

          if (targetTopic) {
            return (
              <button
                key={`wiki-${index}`}
                onClick={() => onNavigateTopic(targetTopic.id)}
                className="inline text-blue-400 hover:text-blue-300 hover:underline font-normal cursor-pointer transition-colors"
                title={`Open note: ${targetTopic.title}`}
              >
                [[{displayText}]]
              </button>
            );
          } else {
            return (
              <span
                key={`wiki-miss-${index}`}
                className="text-zinc-500 italic"
              >
                [[{displayText}]]
              </span>
            );
          }
        }

        // Handle $math$ inline
        const mathParts = part.split(/(\$.*?\$)/g);
        return (
          <span key={`text-${index}`}>
            {mathParts.map((sub, sIdx) => {
              if (sub.startsWith('$') && sub.endsWith('$') && sub.length > 2) {
                const math = sub.slice(1, -1);
                return (
                  <span
                    key={`m-${sIdx}`}
                    className="font-mono text-zinc-300 bg-[#1e1e22] px-1 py-0.5 rounded text-[12px]"
                  >
                    {cleanMathString(math)}
                  </span>
                );
              }

              // Bold **text**
              const boldParts = sub.split(/(\*\*.*?\*\*)/g);
              return boldParts.map((bSub, bIdx) => {
                if (bSub.startsWith('**') && bSub.endsWith('**')) {
                  return (
                    <strong key={`b-${bIdx}`} className="font-semibold text-zinc-100">
                      {bSub.slice(2, -2)}
                    </strong>
                  );
                }
                return bSub;
              });
            })}
          </span>
        );
      });
    };

    lines.forEach((line, lineIndex) => {
      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${lineIndex}`}
              className="my-3 p-3 bg-[#131315] border border-[#232326] rounded text-[12px] font-mono text-zinc-300 overflow-x-auto leading-relaxed"
            >
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Headings
      if (line.startsWith('# ')) {
        elements.push(
          <h1
            key={`h1-${lineIndex}`}
            className="text-xl sm:text-2xl font-semibold text-zinc-100 mt-4 mb-3 pb-1.5 border-b border-[#232326] tracking-tight"
          >
            {formatInline(line.slice(2))}
          </h1>
        );
        return;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h2
            key={`h2-${lineIndex}`}
            className="text-base sm:text-lg font-semibold text-zinc-200 mt-5 mb-2 pb-1 border-b border-[#202024] tracking-tight"
          >
            {formatInline(line.slice(3))}
          </h2>
        );
        return;
      }
      if (line.startsWith('### ')) {
        elements.push(
          <h3
            key={`h3-${lineIndex}`}
            className="text-sm font-semibold text-zinc-300 mt-4 mb-1.5 tracking-tight"
          >
            {formatInline(line.slice(4))}
          </h3>
        );
        return;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={`quote-${lineIndex}`}
            className="my-2.5 pl-3 border-l-2 border-zinc-600 text-zinc-400 text-[13px] italic"
          >
            {formatInline(line.slice(2))}
          </blockquote>
        );
        return;
      }

      // Bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const content = line.trim().slice(2);
        elements.push(
          <li
            key={`li-${lineIndex}`}
            className="ml-5 list-disc text-zinc-300 text-[13px] leading-relaxed my-0.5"
          >
            {formatInline(content)}
          </li>
        );
        return;
      }

      // Numbered lists
      const numMatch = line.match(/^\s*(\d+)\.\s+(.*)$/);
      if (numMatch) {
        elements.push(
          <li
            key={`oli-${lineIndex}`}
            className="ml-5 list-decimal text-zinc-300 text-[13px] leading-relaxed my-0.5"
          >
            {formatInline(numMatch[2])}
          </li>
        );
        return;
      }

      // Math block display $$...$$
      if (line.trim().startsWith('$$') && line.trim().endsWith('$$') && line.trim().length > 3) {
        const mathContent = line.trim().slice(2, -2).trim();
        elements.push(
          <div
            key={`math-block-${lineIndex}`}
            className="my-3 p-2.5 rounded bg-[#18181b] border border-[#232326] text-center font-mono text-zinc-300 text-[13px] overflow-x-auto"
          >
            {cleanMathString(mathContent)}
          </div>
        );
        return;
      }

      // Empty line
      if (!line.trim()) {
        elements.push(<div key={`sp-${lineIndex}`} className="h-2" />);
        return;
      }

      // Normal paragraph
      elements.push(
        <p
          key={`p-${lineIndex}`}
          className="text-zinc-300 text-[13px] leading-relaxed my-1.5"
        >
          {formatInline(line)}
        </p>
      );
    });

    return elements;
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-6 sm:px-10 text-zinc-200 select-text">
      {/* Note metadata breadcrumbs, ratings, review date & visit count */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#232326] text-[11px] text-zinc-500 select-none">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-zinc-400">{topic.category}</span>
          <span className="text-zinc-600">/</span>
          <span className="capitalize text-zinc-400">{topic.topicType}</span>
          
          {/* Average Rating & quick rate trigger */}
          <span className="text-zinc-600">•</span>
          <button
            onClick={() => setActiveViewTab('feedback')}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
            title="Click to view ratings and feedback"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{(reviewMeta?.averageRating || 4.5).toFixed(1)}</span>
            <span className="text-zinc-500 font-normal">({reviewMeta?.totalRatings || 6})</span>
          </button>

          {/* Last-Reviewed Date */}
          {reviewMeta?.lastReviewedAt && (
            <>
              <span className="text-zinc-600">•</span>
              <div 
                className="flex items-center gap-1 text-zinc-400 text-[10px]" 
                title={`Curriculum verified by ${reviewMeta.reviewedBy || 'Academic Committee'}`}
              >
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span>Reviewed {new Date(reviewMeta.lastReviewedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-blue-400 px-2 py-0.5 rounded bg-[#19191d] hover:bg-[#202026] border border-[#27272c] transition-colors"
            title="Report error or submit feedback"
          >
            <MessageSquarePlus className="w-3 h-3 text-blue-400" />
            <span>Feedback</span>
          </button>

          <div 
            className="flex items-center gap-1.5 text-zinc-300 bg-[#19191d] border border-[#27272c] px-2.5 py-0.5 rounded text-[11px]" 
            title={`You have visited this topic note ${visitCount} ${visitCount === 1 ? 'time' : 'times'}`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>
              Visited <strong className="font-semibold text-blue-300">{visitCount}</strong> {visitCount === 1 ? 'time' : 'times'}
            </span>
          </div>
        </div>
      </div>

      {/* Obsidian-Style Perspective Navigation Bar */}
      <div className="flex items-center gap-1 mb-5 p-1 bg-[#18181b] border border-[#26262a] rounded-lg select-none overflow-x-auto text-xs">
        <button
          onClick={() => setActiveViewTab('note')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
            activeViewTab === 'note'
              ? 'bg-[#222228] text-zinc-100 font-medium border border-[#2d2d34]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1d1d21]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span>Note</span>
        </button>

        <button
          onClick={() => setActiveViewTab('alternatives')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
            activeViewTab === 'alternatives'
              ? 'bg-[#222228] text-zinc-100 font-medium border border-[#2d2d34]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1d1d21]'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Alternative Views</span>
          <span className="text-[10px] font-mono px-1 rounded bg-[#27272f] text-zinc-400">4</span>
        </button>

        <button
          onClick={() => setActiveViewTab('resources')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
            activeViewTab === 'resources'
              ? 'bg-[#222228] text-zinc-100 font-medium border border-[#2d2d34]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1d1d21]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Learning Resources</span>
        </button>

        <button
          onClick={() => setActiveViewTab('quiz')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
            activeViewTab === 'quiz'
              ? 'bg-[#222228] text-zinc-100 font-medium border border-[#2d2d34]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1d1d21]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
          <span>Mastery Quiz</span>
          {savedQuizResult && (
            <span className={`text-[10px] font-mono px-1 rounded ${
              savedQuizResult.bestScore >= 70 ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
            }`}>
              {savedQuizResult.bestScore}%
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveViewTab('prereqs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
            activeViewTab === 'prereqs'
              ? 'bg-[#222228] text-zinc-100 font-medium border border-[#2d2d34]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1d1d21]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Prerequisites</span>
          {topicDiagnostic.gaps.length > 0 ? (
            <span className="text-[10px] font-mono px-1 rounded bg-amber-950 text-amber-400 border border-amber-800/50">
              {topicDiagnostic.gaps.length} gaps
            </span>
          ) : (
            <span className="text-[10px] font-mono px-1 rounded bg-emerald-950 text-emerald-400">
              Ready
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveViewTab('feedback')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
            activeViewTab === 'feedback'
              ? 'bg-[#222228] text-zinc-100 font-medium border border-[#2d2d34]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1d1d21]'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-400" />
          <span>Feedback & Ratings</span>
          <span className="text-[10px] font-mono px-1.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800/40">
            ★ {(reviewMeta?.averageRating || 4.5).toFixed(1)}
          </span>
        </button>
      </div>

      {/* VIEW RENDER DISPATCH */}
      {activeViewTab === 'alternatives' && (
        <AlternativeExplanationsView
          topic={topic}
          allTopics={allTopics}
          onNavigateTopic={onNavigateTopic}
        />
      )}

      {activeViewTab === 'resources' && (
        <ResourcesView
          topic={topic}
          onNavigateTopic={onNavigateTopic}
        />
      )}

      {activeViewTab === 'quiz' && (
        <MasteryQuizView
          topic={topic}
          allTopics={allTopics}
          currentStatus={statuses[topic.id] || 'not_studied'}
          savedQuizResult={savedQuizResult}
          onUpdateStatus={onUpdateStatus || (() => {})}
          onNavigateTopic={onNavigateTopic}
          onQuizCompleted={onQuizCompleted}
        />
      )}

      {activeViewTab === 'prereqs' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${
            topicDiagnostic.isReady 
              ? 'bg-[#15231c] border-emerald-800/50 text-emerald-200' 
              : 'bg-[#241b16] border-amber-800/50 text-amber-200'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                {topicDiagnostic.isReady ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-100">
                    {topicDiagnostic.isReady 
                      ? 'Prerequisites Satisfied — Concept Ready to Master' 
                      : `${topicDiagnostic.gaps.length} Prerequisite Gaps Detected`}
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    {topicDiagnostic.isReady 
                      ? `All foundational prerequisite concepts for "${topic.title}" are learned. You have the optimal mental foundation.`
                      : `The rule-based gap diagnostic detected missing dependencies. Studying without them may cause comprehension bottlenecks.`}
                  </p>
                </div>
              </div>

              {onHighlightGapsInGraph && (
                <button
                  onClick={onHighlightGapsInGraph}
                  className="px-2.5 py-1 rounded bg-[#202026] text-blue-400 hover:text-blue-300 border border-[#2b2b34] text-xs shrink-0"
                >
                  Highlight in Graph
                </button>
              )}
            </div>
          </div>

          {/* Gaps List */}
          {topicDiagnostic.gaps.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                Unresolved Prerequisite Nodes
              </span>
              {topicDiagnostic.gaps.map((gap) => (
                <div
                  key={gap.missingPrerequisiteId}
                  className="p-3 rounded bg-[#18181b] border border-[#26262a] flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-zinc-200">
                        {gap.missingPrerequisiteTitle}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#222228] text-zinc-400 border border-[#2e2e36] font-mono">
                        {gap.missingPrerequisiteCategory}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {gap.recommendedAction}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigateTopic(gap.missingPrerequisiteId)}
                    className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs shrink-0 flex items-center gap-1 transition-colors"
                  >
                    <span>Study Note</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Recommended Learning Path */}
          <div className="p-4 rounded-lg bg-[#18181b] border border-[#26262a] space-y-3">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
              Recommended Sequential Study Path
            </span>
            <div className="space-y-1.5">
              {topicDiagnostic.recommendedLearningPath.map((nodeId, idx) => {
                const nodeTopic = allTopics.find(t => t.id === nodeId);
                const isTarget = nodeId === topic.id;
                const status = statuses[nodeId] || 'not_studied';

                return (
                  <div
                    key={nodeId}
                    onClick={() => onNavigateTopic(nodeId)}
                    className={`p-2 rounded text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      isTarget 
                        ? 'bg-[#1f222d] text-blue-200 font-medium border border-blue-500/50' 
                        : 'bg-[#1a1a1d] hover:bg-[#202025] text-zinc-300 border border-[#232326]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#24242a] text-zinc-400 font-mono text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{nodeTopic?.title || nodeId}</span>
                    </div>

                    <span className={`text-[10px] font-mono uppercase ${
                      status === 'learned' ? 'text-emerald-400' : 'text-zinc-500'
                    }`}>
                      {isTarget ? 'Current Goal' : status.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeViewTab === 'feedback' && (
        <TopicFeedbackTab
          topic={topic}
          allTopics={allTopics}
          reports={reports}
          reviewMeta={reviewMeta}
          userRating={userRating}
          onRate={(r) => onRateTopic && onRateTopic(topic.id, r)}
          onOpenReportModal={() => setIsFeedbackModalOpen(true)}
          onUpdateReportStatus={(repId, status, notes) => {
            if (onUpdateReportStatus) onUpdateReportStatus(repId, status, notes);
          }}
          onNavigateTopic={onNavigateTopic}
          onFocusInGraph={onFocusInGraph}
        />
      )}

      {activeViewTab === 'note' && (
        <>
          {/* Subtle Prerequisite Callout if gaps exist */}
          {topicDiagnostic.gaps.length > 0 && (
            <div className="mb-4 p-3 bg-[#241b16] border border-amber-900/60 rounded text-xs text-amber-200 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300 block mb-0.5">
                    Prerequisite Dependencies Missing ({topicDiagnostic.gaps.length})
                  </span>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    Foundational concepts have not been marked as learned yet. To ensure deep comprehension:
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {topicDiagnostic.gaps.slice(0, 3).map(g => (
                      <button
                        key={g.missingPrerequisiteId}
                        onClick={() => onNavigateTopic(g.missingPrerequisiteId)}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#332219] hover:bg-[#442c1f] text-amber-200 border border-amber-700/50 transition-colors"
                      >
                        [[{g.missingPrerequisiteTitle}]]
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveViewTab('prereqs')}
                className="text-[11px] text-blue-400 hover:underline shrink-0 self-center font-normal"
              >
                Inspect Path →
              </button>
            </div>
          )}

      {/* Subtle academic review flag if marked */}
      {topic.reviewFlag?.flagged && (
        <div className="mb-4 p-2.5 bg-[#241c14] border border-[#4d3215] rounded text-xs text-amber-200/90 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-400 block mb-0.5">Academic Clarification</span>
            <p className="text-[12px] leading-relaxed">{topic.reviewFlag.reason}</p>
          </div>
        </div>
      )}

      {/* Main note body */}
      <article className="prose prose-invert max-w-none text-zinc-300">
        {renderFormattedContent(topic.content)}
      </article>

      {/* Simple connections and backlinks section (Obsidian style) */}
      <div className="mt-10 pt-4 border-t border-[#232326] space-y-4 select-none">
        {/* Source attribution line */}
        <div className="text-[11px] text-zinc-500 flex items-center justify-between">
          <span>Source: {topic.source}</span>
          <button
            onClick={() => onFocusInGraph(topic.id)}
            className="text-blue-400 hover:underline"
          >
            View in Graph
          </button>
        </div>

        {/* Backlinks & Prerequisites list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Prerequisites */}
          <div>
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Prerequisites
            </span>
            {prerequisites.length === 0 ? (
              <p className="text-[11px] text-zinc-600 italic">None</p>
            ) : (
              <div className="space-y-1">
                {prerequisites.map(p => (
                  <div
                    key={p.id}
                    onClick={() => onNavigateTopic(p.id)}
                    className="flex items-center justify-between py-0.5 text-xs text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                  >
                    <span>{p.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Backlinks */}
          <div>
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Backlinks ({backlinks.length})
            </span>
            {backlinks.length === 0 ? (
              <p className="text-[11px] text-zinc-600 italic">No notes link here</p>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {backlinks.map((b, idx) => (
                  <div
                    key={`${b.topic.id}-${idx}`}
                    onClick={() => onNavigateTopic(b.topic.id)}
                    className="flex items-center justify-between py-0.5 text-xs text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                  >
                    <span className="truncate">{b.topic.title}</span>
                    <span className="text-[10px] text-zinc-500 ml-2 shrink-0">{b.reason}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
        </>
      )}

      {/* Feedback & Issue Report Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        topic={topic}
        allTopics={allTopics}
        userRating={userRating}
        onSubmit={(report, optionalRating) => {
          if (onSubmitFeedbackReport) {
            onSubmitFeedbackReport(report, optionalRating);
          }
          if (optionalRating && onRateTopic) {
            onRateTopic(topic.id, optionalRating);
          }
        }}
      />
    </div>
  );
};

function cleanMathString(raw: string): string {
  return raw
    .replace(/\\rightarrow/g, ' → ')
    .replace(/\\xrightarrow\[(.*?)\]\{(.*?)\}/g, ' ──[$1, $2]──> ')
    .replace(/\\uparrow/g, ' ↑')
    .replace(/\\approx/g, ' ≈ ')
    .replace(/\\times/g, ' × ')
    .replace(/\\circ/g, '°')
    .replace(/\\text\{(.*?)\}/g, '$1')
    .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, '($1 / $2)')
    .replace(/\\sqrt\{(.*?)\}/g, '√($1)')
    .replace(/\\mu/g, 'μ')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\pi/g, 'π')
    .replace(/\\rho/g, 'ρ')
    .replace(/\\epsilon/g, 'ε')
    .replace(/\\hbar/g, 'ħ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\nu/g, 'ν')
    .replace(/\\Phi/g, 'Φ')
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\AA/g, 'Å')
    .replace(/\\rightleftharpoons/g, ' ⇌ ')
    .replace(/\\bullet/g, '•')
    .replace(/\\delta/g, 'δ')
    .replace(/\\_/g, '_')
    .replace(/\\\\/g, '\n');
}
