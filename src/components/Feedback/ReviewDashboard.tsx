import React, { useState, useMemo } from 'react';
import { 
  Star, 
  MessageSquareCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShieldAlert, 
  HelpCircle, 
  BookOpen, 
  Network, 
  Sparkles, 
  Search, 
  Filter, 
  RefreshCw, 
  Calendar, 
  ExternalLink, 
  UserCheck, 
  Cloud, 
  CloudCheck, 
  Info,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { TopicNode } from '../../types/knowledge';
import { 
  FeedbackReport, 
  TopicReviewMeta, 
  ReportStatus, 
  FeedbackCategory, 
  FeedbackSeverity 
} from '../../types/feedback';

interface ReviewDashboardProps {
  allTopics: TopicNode[];
  reports: FeedbackReport[];
  topicReviews: Record<string, TopicReviewMeta>;
  userRatings: Record<string, number>;
  isCloudConnected: boolean;
  currentUserRole?: 'student' | 'teacher';
  onUpdateReportStatus: (reportId: string, status: ReportStatus, reviewerNotes?: string, reviewedBy?: string) => void;
  onUpdateTopicReview: (topicId: string, updates: Partial<TopicReviewMeta>) => void;
  onOpenTopicNote: (topicId: string) => void;
  onFocusInGraph: (topicId: string) => void;
}

export const ReviewDashboard: React.FC<ReviewDashboardProps> = ({
  allTopics,
  reports,
  topicReviews,
  userRatings,
  isCloudConnected,
  currentUserRole = 'teacher',
  onUpdateReportStatus,
  onUpdateTopicReview,
  onOpenTopicNote,
  onFocusInGraph,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'queue' | 'attention' | 'matrix'>('queue');

  // Queue Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Editing reviewer note state
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [reviewerNoteDraft, setReviewerNoteDraft] = useState('');
  const [reviewerNameDraft, setReviewerNameDraft] = useState('Faculty Reviewer');

  // Quick review modal/inline for matrix
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [topicReviewNoteDraft, setTopicReviewNoteDraft] = useState('');

  // Statistics calculation
  const stats = useMemo(() => {
    const totalReports = reports.length;
    const pendingCount = reports.filter(r => r.status === 'pending').length;
    const underReviewCount = reports.filter(r => r.status === 'under_review').length;
    const resolvedCount = reports.filter(r => r.status === 'resolved').length;
    const rejectedCount = reports.filter(r => r.status === 'rejected').length;

    // Calculate overall average rating
    const reviewEntries = Object.values(topicReviews);
    let totalScoreSum = 0;
    let totalRatingsSum = 0;
    reviewEntries.forEach(r => {
      totalScoreSum += (r.averageRating || 4.5) * (r.totalRatings || 1);
      totalRatingsSum += (r.totalRatings || 1);
    });
    const syllabusAverage = totalRatingsSum > 0 ? (totalScoreSum / totalRatingsSum).toFixed(2) : '4.6';

    // Issues requiring attention: pending or under review
    const attentionCount = pendingCount + underReviewCount;

    return {
      totalReports,
      pendingCount,
      underReviewCount,
      resolvedCount,
      rejectedCount,
      attentionCount,
      syllabusAverage,
      totalRatingsSum,
    };
  }, [reports, topicReviews]);

  // Topics requiring attention
  const topicsRequiringAttention = useMemo(() => {
    return allTopics.map(topic => {
      const meta = topicReviews[topic.id] || { averageRating: 4.5, totalRatings: 5, lastReviewedAt: '2026-09-01' };
      const topicIssues = reports.filter(r => r.topicId === topic.id && (r.status === 'pending' || r.status === 'under_review'));
      const hasCriticalError = topicIssues.some(r => r.category === 'error' || r.severity === 'high' || r.severity === 'critical');
      const hasGraphFlaw = topicIssues.some(r => r.category === 'graph_connection');
      const rating = meta.averageRating || 4.5;

      let priorityScore = 0;
      if (topicIssues.length > 0) priorityScore += topicIssues.length * 10;
      if (hasCriticalError) priorityScore += 20;
      if (hasGraphFlaw) priorityScore += 15;
      if (rating < 4.3) priorityScore += (4.5 - rating) * 20;

      return {
        topic,
        meta,
        issues: topicIssues,
        priorityScore,
        hasCriticalError,
        hasGraphFlaw,
        rating,
      };
    })
    .filter(item => item.priorityScore > 0 || item.rating < 4.4)
    .sort((a, b) => b.priorityScore - a.priorityScore);
  }, [allTopics, topicReviews, reports]);

  // Filtered reports list for queue
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      if (statusFilter !== 'all' && report.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && report.category !== categoryFilter) return false;
      if (roleFilter !== 'all' && report.reporterRole !== roleFilter) return false;
      if (severityFilter !== 'all' && report.severity !== severityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesComment = report.comment.toLowerCase().includes(q);
        const matchesTopic = report.topicTitle.toLowerCase().includes(q);
        const matchesReporter = report.reporterName.toLowerCase().includes(q);
        const matchesNotes = (report.reviewerNotes || '').toLowerCase().includes(q);
        if (!matchesComment && !matchesTopic && !matchesReporter && !matchesNotes) return false;
      }
      return true;
    });
  }, [reports, statusFilter, categoryFilter, roleFilter, severityFilter, searchQuery]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Not yet reviewed';
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-sky-950/80 text-sky-400 border border-sky-800/40">
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
      case 'poor_resource': return <BookOpen className="w-3.5 h-3.5 text-blue-400" />;
      case 'graph_connection': return <Network className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-8 text-zinc-200 select-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#232326]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <MessageSquareCheck className="w-5 h-5 text-blue-400" />
              Academic Review & Feedback Dashboard
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Topic 1–5 star ratings, error reports, missing prerequisites, and knowledge-graph corrections.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-[11px] font-mono px-2 py-1 rounded bg-[#1e1e24] text-zinc-400 border border-[#2c2c34]">
            Anvay v2.0 • Free For Students
          </span>
        </div>
      </div>

      {/* Shared Persistent Storage / Demo Mode Banner */}
      <div className={`p-3.5 rounded-xl border mb-6 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isCloudConnected 
          ? 'bg-emerald-950/25 border-emerald-800/40 text-emerald-200' 
          : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
      }`}>
        <div className="flex items-start gap-2.5">
          {isCloudConnected ? (
            <CloudCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Cloud className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <strong className="font-semibold text-zinc-100">
                {isCloudConnected ? 'Multi-User Cloud Sync Active' : 'Demonstration / Local Mode'}
              </strong>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                isCloudConnected ? 'bg-emerald-900/60 text-emerald-300' : 'bg-amber-900/60 text-amber-300'
              }`}>
                {isCloudConnected ? 'SHARED FIRESTORE' : 'LOCAL BROWSER STORAGE'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
              {isCloudConnected ? (
                'All ratings, submitted feedback, and reviewer status changes are persisted in real-time to the shared Google Cloud Firestore database across students and teachers.'
              ) : (
                'Submissions are currently stored locally in browser storage with pre-seeded academic reviews. To enable shared multi-user submissions across devices, sign in with Google using the top-bar button to connect to the shared Firebase Firestore database.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Top Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-lg bg-[#18181b] border border-[#242428]">
          <div className="text-[11px] text-zinc-400 font-medium">Syllabus Average Rating</div>
          <div className="text-xl font-bold text-amber-400 flex items-center gap-1.5 mt-1">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{stats.syllabusAverage} / 5.0</span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">{stats.totalRatingsSum} total ratings recorded</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#18181b] border border-[#242428]">
          <div className="text-[11px] text-zinc-400 font-medium">Issues Needing Attention</div>
          <div className="text-xl font-bold text-amber-400 flex items-center gap-1.5 mt-1">
            <Clock className="w-4 h-4" />
            <span>{stats.attentionCount}</span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">{stats.pendingCount} pending, {stats.underReviewCount} in review</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#18181b] border border-[#242428]">
          <div className="text-[11px] text-zinc-400 font-medium">Resolved Academic Reports</div>
          <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>{stats.resolvedCount}</span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Verified by faculty reviewers</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#18181b] border border-[#242428]">
          <div className="text-[11px] text-zinc-400 font-medium">Total Feedback Reports</div>
          <div className="text-xl font-bold text-zinc-200 flex items-center gap-1.5 mt-1">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>{stats.totalReports}</span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Connected to syllabus nodes</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-[#242428] mb-5 select-none text-xs">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'queue'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <MessageSquareCheck className="w-3.5 h-3.5" />
          <span>Feedback & Issue Queue ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('attention')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'attention'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Topics Requiring Attention ({topicsRequiringAttention.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'matrix'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Topic Review Dates Matrix ({allTopics.length})</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: FEEDBACK & ISSUE QUEUE */}
      {/* ==================================================== */}
      {activeTab === 'queue' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Filters Bar */}
          <div className="p-3 rounded-lg bg-[#18181b] border border-[#242428] flex flex-wrap items-center gap-2.5 text-xs">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search feedback comments, topic titles, or reporters..."
                className="w-full bg-[#131316] border border-[#25252a] rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#131316] border border-[#25252a] rounded-md px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#131316] border border-[#25252a] rounded-md px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="error">Factual / Formula Errors</option>
              <option value="unclear">Unclear Explanations</option>
              <option value="missing_prereq">Missing Prerequisites</option>
              <option value="missing_example">Missing Examples</option>
              <option value="poor_resource">Poor Resources</option>
              <option value="graph_connection">Graph Connection Flaws</option>
            </select>

            {/* Reporter Role */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#131316] border border-[#25252a] rounded-md px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers / Faculty</option>
            </select>
          </div>

          {/* List of Reports */}
          {filteredReports.length === 0 ? (
            <div className="p-8 text-center rounded-lg bg-[#161619] border border-[#242428] text-zinc-500 text-xs">
              <CheckCircle2 className="w-7 h-7 text-zinc-600 mx-auto mb-2" />
              <p className="text-zinc-400 font-medium">No feedback reports match the active filters</p>
              <p className="text-[11px] text-zinc-600 mt-1">Try clearing filters or search terms</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => {
                const isEditing = editingReportId === report.id;
                const associatedTopic = allTopics.find(t => t.id === report.topicId);

                return (
                  <div
                    key={report.id}
                    className="p-4 rounded-xl bg-[#17171a] border border-[#252529] hover:border-[#32323a] transition-all space-y-3 text-xs"
                  >
                    {/* Header line */}
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-zinc-100 text-[13px]">
                            {report.topicTitle}
                          </span>
                          <button
                            onClick={() => onOpenTopicNote(report.topicId)}
                            className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 hover:underline"
                            title="Open note in workspace"
                          >
                            <span>Open Note</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onFocusInGraph(report.topicId)}
                            className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200"
                            title="Locate in Knowledge Graph"
                          >
                            <Network className="w-3 h-3 text-cyan-400" />
                            <span>Graph</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400 flex-wrap">
                          <span className="flex items-center gap-1 font-medium capitalize text-zinc-300">
                            {getCategoryIcon(report.category)}
                            {report.category.replace('_', ' ')}
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span>
                            Reported by <strong className="text-zinc-200">{report.reporterName}</strong> ({report.reporterRole})
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-zinc-500">{formatDate(report.createdAt)}</span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {getStatusBadge(report.status)}
                      </div>
                    </div>

                    {/* Report Comment */}
                    <div className="p-3 rounded-lg bg-[#131316] border border-[#202024] text-[12px] leading-relaxed text-zinc-200">
                      {report.comment}
                    </div>

                    {/* Knowledge Graph Suggestion */}
                    {report.graphSuggestion && (
                      <div className="p-3 rounded-lg bg-[#12151e] border border-blue-900/50 text-blue-200 text-[11px] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-medium text-blue-300">
                            <Network className="w-4 h-4 text-blue-400" />
                            <span>Proposed Knowledge Graph Connection:</span>
                          </div>
                          <button
                            onClick={() => onFocusInGraph(report.topicId)}
                            className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <span>Examine in Graph</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <div className="font-mono text-xs text-zinc-100 pl-5">
                          <span>{report.topicTitle}</span>
                          <span className="text-blue-400 mx-2 font-semibold">
                            --[{report.graphSuggestion.suggestedRelationType}]--&gt;
                          </span>
                          <span className="text-emerald-300 font-semibold">
                            {allTopics.find(t => t.id === report.graphSuggestion?.targetTopicId)?.title || report.graphSuggestion.targetTopicId}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px] pl-5 italic">
                          "{report.graphSuggestion.description}"
                        </p>
                      </div>
                    )}

                    {/* Reviewer Resolution Notes */}
                    {report.reviewerNotes && (
                      <div className="p-2.5 rounded-lg bg-[#141a16] border border-emerald-900/40 text-[11px] text-emerald-300 flex items-start gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-400 font-semibold">
                            Faculty Resolution Note ({report.reviewedBy || 'Academic Committee'}):
                          </strong>{' '}
                          {report.reviewerNotes}
                          {report.reviewedAt && (
                            <span className="text-[10px] text-zinc-500 ml-2">
                              ({formatDate(report.reviewedAt)})
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Reviewer Action Controls */}
                    <div className="pt-2 border-t border-[#232326] flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-zinc-500 font-medium">Review Status:</span>
                        <button
                          onClick={() => onUpdateReportStatus(report.id, 'pending')}
                          className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                            report.status === 'pending'
                              ? 'bg-amber-950 text-amber-300 font-semibold border border-amber-800/60'
                              : 'text-zinc-400 hover:text-amber-400 hover:bg-[#202026]'
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => onUpdateReportStatus(report.id, 'under_review')}
                          className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                            report.status === 'under_review'
                              ? 'bg-sky-950 text-sky-300 font-semibold border border-sky-800/60'
                              : 'text-zinc-400 hover:text-sky-400 hover:bg-[#202026]'
                          }`}
                        >
                          Under Review
                        </button>
                        <button
                          onClick={() => {
                            setEditingReportId(report.id);
                            setReviewerNoteDraft(report.reviewerNotes || 'Verified and updated syllabus note.');
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                            report.status === 'resolved'
                              ? 'bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800/60'
                              : 'text-zinc-400 hover:text-emerald-400 hover:bg-[#202026]'
                          }`}
                        >
                          Resolved...
                        </button>
                        <button
                          onClick={() => onUpdateReportStatus(report.id, 'rejected')}
                          className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                            report.status === 'rejected'
                              ? 'bg-zinc-800 text-zinc-300 font-semibold border border-zinc-700'
                              : 'text-zinc-400 hover:text-red-400 hover:bg-[#202026]'
                          }`}
                        >
                          Rejected
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setEditingReportId(isEditing ? null : report.id);
                          setReviewerNoteDraft(report.reviewerNotes || '');
                        }}
                        className="text-[11px] text-zinc-400 hover:text-blue-400 transition-colors"
                      >
                        {report.reviewerNotes ? 'Edit Reviewer Note' : '+ Add Faculty Note'}
                      </button>
                    </div>

                    {/* Inline Editor for Reviewer Note */}
                    {isEditing && (
                      <div className="p-3 rounded-lg bg-[#141417] border border-[#2d2d34] space-y-2 mt-2">
                        <label className="block text-[11px] text-zinc-300 font-medium">
                          Reviewer Resolution Notes:
                        </label>
                        <textarea
                          rows={2}
                          value={reviewerNoteDraft}
                          onChange={(e) => setReviewerNoteDraft(e.target.value)}
                          placeholder="Explain how this issue was resolved, corrected, or why it was declined..."
                          className="w-full bg-[#18181c] border border-[#2b2b30] rounded-lg p-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={reviewerNameDraft}
                            onChange={(e) => setReviewerNameDraft(e.target.value)}
                            placeholder="Reviewer Name / Title"
                            className="bg-[#18181c] border border-[#2b2b30] rounded px-2 py-1 text-[11px] text-zinc-300 w-48"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingReportId(null)}
                              className="px-2.5 py-1 text-[11px] text-zinc-400 hover:text-zinc-200"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                onUpdateReportStatus(report.id, 'resolved', reviewerNoteDraft, reviewerNameDraft);
                                setEditingReportId(null);
                              }}
                              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition-colors"
                            >
                              Save & Mark Resolved
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: TOPICS REQUIRING ATTENTION */}
      {/* ==================================================== */}
      {activeTab === 'attention' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-3 rounded-lg bg-[#18181b] border border-[#242428] text-xs text-zinc-400">
            Topics highlighted below have pending student reports, reported formula errors, missing prerequisites, or lower-than-average ratings.
          </div>

          <div className="space-y-3">
            {topicsRequiringAttention.map(({ topic, meta, issues, hasCriticalError, hasGraphFlaw, rating }) => (
              <div
                key={topic.id}
                className="p-4 rounded-xl bg-[#17171a] border border-[#252529] hover:border-[#32323a] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-zinc-100 text-[13px]">{topic.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#202026] text-zinc-400">
                      {topic.category}
                    </span>
                    {hasCriticalError && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/50">
                        Error Reported
                      </span>
                    )}
                    {hasGraphFlaw && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/50">
                        Graph Flaw
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 flex-wrap">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{rating.toFixed(1)} / 5</span>
                      <span className="text-zinc-500">({meta.totalRatings} ratings)</span>
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-amber-400 font-medium">
                      {issues.length} {issues.length === 1 ? 'issue' : 'issues'} requiring attention
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-500">
                      Last reviewed: {formatDate(meta.lastReviewedAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <button
                    onClick={() => onFocusInGraph(topic.id)}
                    className="px-2.5 py-1.5 rounded-md bg-[#202026] hover:bg-[#282832] text-zinc-300 text-xs transition-colors"
                  >
                    Graph
                  </button>
                  <button
                    onClick={() => onOpenTopicNote(topic.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
                  >
                    <span>Open Note</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: CURRICULUM REVIEW MATRIX & LAST-REVIEWED DATES */}
      {/* ==================================================== */}
      {activeTab === 'matrix' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-3 rounded-lg bg-[#18181b] border border-[#242428] text-xs text-zinc-400 flex items-center justify-between">
            <span>
              Academic audit verification matrix for all 25 syllabus concepts. Reviewers can update the Last-Reviewed date and approval notes.
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#242428] bg-[#161619]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#25252a] bg-[#1a1a1e] text-zinc-400 font-medium">
                  <th className="py-2.5 px-3">Topic Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-center">Rating</th>
                  <th className="py-2.5 px-3">Last Reviewed Date</th>
                  <th className="py-2.5 px-3">Reviewer / Notes</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202024]">
                {allTopics.map((topic) => {
                  const meta = topicReviews[topic.id] || {
                    topicId: topic.id,
                    lastReviewedAt: '2026-09-25T10:00:00Z',
                    reviewedBy: 'Curriculum Committee',
                    averageRating: 4.5,
                    totalRatings: 6,
                  };
                  const isEditingThis = editingTopicId === topic.id;

                  return (
                    <tr key={topic.id} className="hover:bg-[#1c1c20] transition-colors">
                      <td className="py-2.5 px-3 font-medium text-zinc-200">
                        <button
                          onClick={() => onOpenTopicNote(topic.id)}
                          className="hover:text-blue-400 text-left hover:underline"
                        >
                          {topic.title}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-zinc-400">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e1e24] text-zinc-400">
                          {topic.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{(meta.averageRating || 4.5).toFixed(1)}</span>
                          <span className="text-[10px] text-zinc-500 font-normal">({meta.totalRatings || 0})</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-zinc-300">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          <span>{formatDate(meta.lastReviewedAt)}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-zinc-400 max-w-xs truncate">
                        <span className="text-zinc-200 font-medium">{meta.reviewedBy}</span>
                        {meta.reviewNotes && (
                          <span className="text-zinc-500 ml-1.5 italic">— "{meta.reviewNotes}"</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            const now = new Date().toISOString();
                            onUpdateTopicReview(topic.id, {
                              lastReviewedAt: now,
                              reviewedBy: 'Dr. Faculty Reviewer',
                              reviewNotes: 'Verified formulas, prerequisite links, and notes against course syllabus.',
                            });
                          }}
                          className="px-2 py-1 rounded bg-[#202026] hover:bg-[#292934] text-zinc-300 hover:text-white text-[10px] font-medium transition-colors border border-[#2b2b32]"
                          title="Mark this concept as freshly reviewed today"
                        >
                          Mark Reviewed Today
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
