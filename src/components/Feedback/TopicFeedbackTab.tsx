import React, { useState } from 'react';
import { 
  Star, 
  MessageSquarePlus, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  HelpCircle, 
  BookOpen, 
  Network, 
  Sparkles,
  ChevronRight,
  Filter,
  Check,
  XCircle,
  FileText,
  UserCheck,
  Calendar
} from 'lucide-react';
import { TopicNode } from '../../types/knowledge';
import { FeedbackReport, TopicReviewMeta, ReportStatus, FeedbackCategory } from '../../types/feedback';
import { TopicRatingWidget } from './TopicRatingWidget';

interface TopicFeedbackTabProps {
  topic: TopicNode;
  allTopics: TopicNode[];
  reports: FeedbackReport[];
  reviewMeta?: TopicReviewMeta;
  userRating?: number;
  onRate: (rating: number) => void;
  onOpenReportModal: () => void;
  onUpdateReportStatus: (reportId: string, status: ReportStatus, reviewerNotes?: string) => void;
  onNavigateTopic: (topicId: string) => void;
  onFocusInGraph?: (topicId: string) => void;
}

export const TopicFeedbackTab: React.FC<TopicFeedbackTabProps> = ({
  topic,
  allTopics,
  reports,
  reviewMeta,
  userRating,
  onRate,
  onOpenReportModal,
  onUpdateReportStatus,
  onNavigateTopic,
  onFocusInGraph,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [reviewerNoteDraft, setReviewerNoteDraft] = useState<string>('');

  // Topic specific reports
  const topicReports = reports.filter(r => r.topicId === topic.id);
  const filteredReports = topicReports.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Pending Review';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-200 border border-zinc-700/60">
            <Clock className="w-3 h-3" /> Under Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/50">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-950/80 text-amber-400 border border-amber-800/40">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  const getCategoryIcon = (category: FeedbackCategory) => {
    switch (category) {
      case 'error': return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
      case 'unclear': return <HelpCircle className="w-3.5 h-3.5 text-amber-400" />;
      case 'missing_prereq': return <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />;
      case 'missing_example': return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      case 'poor_resource': return <BookOpen className="w-3.5 h-3.5 text-zinc-300" />;
      case 'graph_connection': return <Network className="w-3.5 h-3.5 text-zinc-300" />;
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Topic Rating & Feedback Prompt */}
      <TopicRatingWidget
        topicId={topic.id}
        topicTitle={topic.title}
        userRating={userRating}
        reviewMeta={reviewMeta}
        onRate={onRate}
        onOpenFeedback={onOpenReportModal}
      />

      {/* Last-Reviewed Academic Status Banner */}
      <div className="p-3.5 rounded-lg bg-[#18181b] border border-[#242428] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-md bg-[#222228] border border-zinc-700/60 text-zinc-200 shrink-0 mt-0.5">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-zinc-400">Curriculum Review Status:</span>
              <span className="font-semibold text-zinc-100">
                Verified on {formatDate(reviewMeta?.lastReviewedAt)}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Reviewer: <span className="text-zinc-200">{reviewMeta?.reviewedBy || 'Curriculum Committee'}</span>
            </p>
            {reviewMeta?.reviewNotes && (
              <p className="text-[11px] text-zinc-500 mt-0.5 italic">
                "{reviewMeta.reviewNotes}"
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-200 hover:bg-white text-zinc-950 transition-colors"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Submit Report</span>
          </button>
        </div>
      </div>

      {/* Reports & Feedback List */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#232326]">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Feedback & Issues for this Topic ({topicReports.length})
            </h3>
          </div>

          {/* Filter status */}
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-zinc-500">Filter:</span>
            {['all', 'pending', 'under_review', 'resolved'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2 py-0.5 rounded capitalize transition-colors ${
                  filterStatus === s
                    ? 'bg-[#26262d] text-zinc-200 font-medium border border-[#31313a]'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-6 text-center rounded-lg bg-[#151518] border border-[#232326] text-zinc-500 text-xs">
            <CheckCircle2 className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
            <p className="text-zinc-400 font-medium">No open issues found for this topic</p>
            <p className="text-[11px] text-zinc-600 mt-1">
              Have you noticed a mistake, confusing derivation, or missing prerequisite? Let us know!
            </p>
            <button
              onClick={onOpenReportModal}
              className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded bg-[#202026] hover:bg-[#282830] text-zinc-300 text-xs transition-colors"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-zinc-300" />
              <span>Report First Issue</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReports.map((report) => {
              const isEditing = editingReportId === report.id;
              return (
                <div
                  key={report.id}
                  className="p-3.5 rounded-lg bg-[#17171a] border border-[#26262a] hover:border-[#32323a] transition-all space-y-2.5 text-xs"
                >
                  {/* Report Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                        {getCategoryIcon(report.category)}
                        <span className="capitalize">{report.category.replace('_', ' ')}</span>
                      </div>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] text-zinc-400">
                        By <strong className="text-zinc-300 font-medium">{report.reporterName}</strong> ({report.reporterRole})
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[10px] text-zinc-500">
                        {formatDate(report.createdAt)}
                      </span>
                    </div>

                    <div className="shrink-0">
                      {getStatusBadge(report.status)}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-zinc-300 text-[12px] leading-relaxed bg-[#131315] p-2.5 rounded border border-[#202023]">
                    {report.comment}
                  </p>

                  {/* Graph connection proposal if attached */}
                  {report.graphSuggestion && (
                    <div className="p-2.5 rounded bg-[#17171d] border border-zinc-700/60 text-[11px] text-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-zinc-300 shrink-0" />
                        <div>
                          <span>Suggested Graph Link: </span>
                          <strong className="text-white">
                            {topic.title}
                          </strong>
                          <span className="text-zinc-400 font-mono mx-1">
                            --[{report.graphSuggestion.suggestedRelationType}]--&gt;
                          </span>
                          <strong className="text-white">
                            {allTopics.find(t => t.id === report.graphSuggestion?.targetTopicId)?.title || report.graphSuggestion.targetTopicId}
                          </strong>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (report.graphSuggestion?.targetTopicId) {
                              onNavigateTopic(report.graphSuggestion.targetTopicId);
                            }
                          }}
                          className="px-2 py-0.5 rounded bg-[#222228] hover:bg-[#2b2b32] text-zinc-200 hover:text-white border border-zinc-700/60 text-[10px] transition-colors"
                        >
                          View Target Topic
                        </button>
                        {onFocusInGraph && (
                          <button
                            onClick={() => onFocusInGraph(topic.id)}
                            className="px-2 py-0.5 rounded bg-[#202026] hover:bg-[#282830] text-zinc-300 text-[10px] transition-colors"
                          >
                            Focus in Graph
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reviewer Resolution Notes */}
                  {report.reviewerNotes && (
                    <div className="p-2 rounded bg-[#141a16] border border-emerald-900/40 text-[11px] text-emerald-300">
                      <span className="font-semibold text-emerald-400">
                        Reviewer Note ({report.reviewedBy || 'Academic Committee'}):
                      </span>{' '}
                      {report.reviewerNotes}
                    </div>
                  )}

                  {/* Reviewer Actions / Status Change Controls */}
                  <div className="pt-2 border-t border-[#232326] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-500 font-medium">Update Status:</span>
                      <button
                        onClick={() => onUpdateReportStatus(report.id, 'pending')}
                        className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                          report.status === 'pending'
                            ? 'bg-amber-950 text-amber-300 font-semibold'
                            : 'text-zinc-500 hover:text-amber-400 hover:bg-[#202026]'
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => onUpdateReportStatus(report.id, 'under_review')}
                        className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                          report.status === 'under_review'
                            ? 'bg-zinc-800 text-white font-semibold'
                            : 'text-zinc-500 hover:text-white hover:bg-[#202026]'
                        }`}
                      >
                        Under Review
                      </button>
                      <button
                        onClick={() => {
                          setEditingReportId(report.id);
                          setReviewerNoteDraft(report.reviewerNotes || 'Verified and resolved in topic notes.');
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                          report.status === 'resolved'
                            ? 'bg-emerald-950 text-emerald-300 font-semibold'
                            : 'text-zinc-500 hover:text-emerald-400 hover:bg-[#202026]'
                        }`}
                      >
                        Resolve...
                      </button>
                      <button
                        onClick={() => onUpdateReportStatus(report.id, 'rejected')}
                        className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                          report.status === 'rejected'
                            ? 'bg-zinc-800 text-zinc-300 font-semibold'
                            : 'text-zinc-500 hover:text-red-400 hover:bg-[#202026]'
                        }`}
                      >
                        Reject
                      </button>
                    </div>

                    {!isEditing && (
                      <button
                        onClick={() => {
                          setEditingReportId(report.id);
                          setReviewerNoteDraft(report.reviewerNotes || '');
                        }}
                        className="text-zinc-500 hover:text-white transition-colors"
                      >
                        {report.reviewerNotes ? 'Edit Reviewer Note' : '+ Add Note'}
                      </button>
                    )}
                  </div>

                  {/* Inline Reviewer Note Input */}
                  {isEditing && (
                    <div className="p-2.5 rounded bg-[#141417] border border-[#2c2c33] space-y-2 mt-2">
                      <label className="block text-[10px] text-zinc-400">
                        Reviewer Resolution Note & Feedback:
                      </label>
                      <input
                        type="text"
                        value={reviewerNoteDraft}
                        onChange={(e) => setReviewerNoteDraft(e.target.value)}
                        placeholder="e.g. Corrected tolerance factor equation on line 14..."
                        className="w-full bg-[#19191d] border border-[#2b2b30] rounded px-2.5 py-1 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-400"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingReportId(null)}
                          className="px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 text-[11px]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            onUpdateReportStatus(report.id, 'resolved', reviewerNoteDraft);
                            setEditingReportId(null);
                          }}
                          className="px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition-colors"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
