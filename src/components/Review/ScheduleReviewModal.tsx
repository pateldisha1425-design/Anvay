import React, { useState, useMemo } from 'react';
import { TopicNode, LearningStatus } from '../../types/knowledge';
import { QuizResult } from '../../types/learning';
import { 
  calculateSpacedRepetitionSchedule, 
  TopicReviewSchedule,
  formatRelativeDate
} from '../../utils/spacedRepetition';
import { 
  CalendarClock, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Calendar, 
  Check, 
  Search, 
  RotateCcw, 
  HelpCircle, 
  Flame, 
  Layers,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  GraduationCap
} from 'lucide-react';

interface ScheduleReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: TopicNode[];
  statuses: Record<string, LearningStatus>;
  studyDates: Record<string, string>;
  topicVisits: Record<string, number>;
  quizResults?: Record<string, QuizResult>;
  onSelectTopicAndOpen: (topicId: string) => void;
  onRecordStudyDate: (topicId: string, dateIso?: string) => void;
}

export const ScheduleReviewModal: React.FC<ScheduleReviewModalProps> = ({
  isOpen,
  onClose,
  topics,
  statuses,
  studyDates,
  topicVisits,
  quizResults = {},
  onSelectTopicAndOpen,
  onRecordStudyDate,
}) => {
  const [activeTab, setActiveTab] = useState<'due' | 'overdue' | 'today' | 'upcoming' | 'all'>('due');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlgorithmHelp, setShowAlgorithmHelp] = useState(false);
  const [editingDateTopicId, setEditingDateTopicId] = useState<string | null>(null);
  const [customDateInput, setCustomDateInput] = useState<string>('');
  const [justReviewedTopicId, setJustReviewedTopicId] = useState<string | null>(null);

  // Compute full spaced repetition analysis
  const scheduleAnalysis = useMemo(() => {
    return calculateSpacedRepetitionSchedule(
      topics,
      statuses,
      studyDates,
      topicVisits,
      quizResults,
      new Date()
    );
  }, [topics, statuses, studyDates, topicVisits, quizResults]);

  if (!isOpen) return null;

  const {
    topSuggestedTopic,
    overdueCount,
    dueTodayCount,
    upcomingCount,
    totalTracked,
    allSchedules,
    dueQueue
  } = scheduleAnalysis;

  // Filtered queue based on active tab and search query
  const filteredList = allSchedules.filter(item => {
    // Tab filter
    if (activeTab === 'due') {
      if (!item.isOverdue && item.urgencyLevel !== 'high' && item.urgencyLevel !== 'critical') {
        return false;
      }
    } else if (activeTab === 'overdue') {
      if (!item.isOverdue) return false;
    } else if (activeTab === 'today') {
      if (!item.lastStudyDate || item.daysOverdue !== 0) return false;
    } else if (activeTab === 'upcoming') {
      if (!item.lastStudyDate || item.daysOverdue >= 0) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.topicTitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleMarkReviewed = (topicId: string) => {
    const nowIso = new Date().toISOString();
    onRecordStudyDate(topicId, nowIso);
    setJustReviewedTopicId(topicId);
    setTimeout(() => {
      setJustReviewedTopicId(null);
    }, 2500);
  };

  const handleSaveCustomDate = (topicId: string) => {
    if (!customDateInput) return;
    const parsedDate = new Date(customDateInput);
    if (!isNaN(parsedDate.getTime())) {
      onRecordStudyDate(topicId, parsedDate.toISOString());
    }
    setEditingDateTopicId(null);
    setCustomDateInput('');
  };

  const handleOpenAndReview = (topicId: string) => {
    onSelectTopicAndOpen(topicId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-[#161619] border border-[#2b2b30] rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#26262a] bg-[#141416]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-semibold text-zinc-100 tracking-tight">
                  Spaced Repetition Review Scheduler
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  SM-2 Adaptive Engine
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Intelligent review recommendations tailored to your last study date, forgetting curve, and curriculum mastery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAlgorithmHelp(!showAlgorithmHelp)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-[#202025] rounded border border-transparent hover:border-[#2d2d33] transition-colors"
              title="Learn how the algorithm computes intervals"
            >
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Algorithm</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-[#222227] rounded-lg transition-colors"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-zinc-300 text-xs">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-lg bg-[#1a1a1e] border border-red-950/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-medium">Overdue</span>
                <span className="text-lg font-bold text-red-400">{overdueCount}</span>
              </div>
              <Flame className="w-5 h-5 text-red-400/60" />
            </div>

            <div className="p-2.5 rounded-lg bg-[#1a1a1e] border border-amber-950/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-medium">Due Today</span>
                <span className="text-lg font-bold text-amber-400">{dueTodayCount}</span>
              </div>
              <Clock className="w-5 h-5 text-amber-400/60" />
            </div>

            <div className="p-2.5 rounded-lg bg-[#1a1a1e] border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-medium">Upcoming</span>
                <span className="text-lg font-bold text-zinc-100">{upcomingCount}</span>
              </div>
              <Calendar className="w-5 h-5 text-zinc-500" />
            </div>

            <div className="p-2.5 rounded-lg bg-[#1a1a1e] border border-[#26262b] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-medium">Tracked Notes</span>
                <span className="text-lg font-bold text-zinc-200">{totalTracked} / {topics.length}</span>
              </div>
              <Layers className="w-5 h-5 text-zinc-500" />
            </div>
          </div>

          {/* Algorithm Info Banner (Collapsible) */}
          {showAlgorithmHelp && (
            <div className="p-3.5 rounded-lg bg-[#1c1b22] border border-zinc-800 text-zinc-300 animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5">
                <BrainCircuit className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5 leading-relaxed text-[11px]">
                  <h4 className="font-semibold text-zinc-200 text-xs">How Spaced Repetition Works in Anvay:</h4>
                  <p>
                    Every topic has an adaptive target interval calculated from your last study date:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1.5 pt-1 text-[11px]">
                    <div className="p-2 bg-[#141418] rounded border border-[#25252c]">
                      <strong className="text-amber-300 block mb-0.5">Needs Revision: 1 Day</strong>
                      <span>Highest priority. Review within 24h before neural decay compromises comprehension.</span>
                    </div>
                    <div className="p-2 bg-[#141418] rounded border border-[#25252c]">
                      <strong className="text-zinc-200 block mb-0.5">Learning: 2 – 3 Days</strong>
                      <span>Active consolidation phase to solidify terminology and reaction pathways.</span>
                    </div>
                    <div className="p-2 bg-[#141418] rounded border border-[#25252c]">
                      <strong className="text-emerald-300 block mb-0.5">Learned: 7 → 14 → 30 Days</strong>
                      <span>Exponential intervals. Scoring ≥80% on mastery quizzes unlocks +30% stability bonus.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HERO CARD: TOP SUGGESTED TOPIC TO REVISIT */}
          {topSuggestedTopic && (
            <div className="relative overflow-hidden rounded-xl border border-zinc-700/60 bg-[#18181b] p-4 sm:p-5 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-[#242428] text-zinc-200 border border-zinc-700/60">
                    <Sparkles className="w-3 h-3 text-zinc-300" />
                    Top Recommendation to Revisit
                  </span>
                  
                  {topSuggestedTopic.urgencyLevel === 'critical' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-950/80 text-red-300 border border-red-800/60">
                      Critical Priority
                    </span>
                  ) : topSuggestedTopic.isOverdue ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/50">
                      Overdue by {topSuggestedTopic.daysOverdue} {topSuggestedTopic.daysOverdue === 1 ? 'day' : 'days'}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700">
                      Due Today
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 font-mono">
                  <span>Score:</span>
                  <span className="text-amber-300 font-semibold">{topSuggestedTopic.urgencyScore.toFixed(1)}</span>
                </div>
              </div>

              {/* Topic Title & Category */}
              <div className="mb-3">
                <div className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">
                  {topSuggestedTopic.category}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-100 hover:text-white cursor-pointer transition-colors"
                  onClick={() => handleOpenAndReview(topSuggestedTopic.topicId)}
                >
                  {topSuggestedTopic.topicTitle}
                </h3>
              </div>

              {/* Spaced Repetition Reason Callout */}
              <div className="p-3 rounded-lg bg-[#141417]/80 border border-[#2b2b32] mb-4 text-xs leading-relaxed text-zinc-300 flex items-start gap-2.5">
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${topSuggestedTopic.learningStatus === 'needs_revision' ? 'text-amber-400' : 'text-zinc-400'}`} />
                <div>
                  <strong className="text-zinc-200 block mb-0.5">Algorithm Diagnosis:</strong>
                  <p className="text-[11px] text-zinc-300">{topSuggestedTopic.reason}</p>
                </div>
              </div>

              {/* Diagnostic Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 px-3 rounded-lg bg-[#121215] border border-[#232328] mb-4 text-[11px]">
                <div>
                  <span className="text-[10px] text-zinc-500 block">Last Studied</span>
                  <strong className="text-zinc-200">
                    {topSuggestedTopic.lastStudyDate 
                      ? `${topSuggestedTopic.lastStudyDateFormatted} (${formatRelativeDate(topSuggestedTopic.lastStudyDate)})` 
                      : 'Never'}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 block">Target Interval</span>
                  <strong className="text-amber-300">
                    {topSuggestedTopic.intervalDays} {topSuggestedTopic.intervalDays === 1 ? 'day' : 'days'}
                  </strong>
                  <span className="text-[9px] text-zinc-500 block capitalize">
                    ({topSuggestedTopic.learningStatus.replace('_', ' ')})
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 block">Est. Memory Retention</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <strong className={
                      topSuggestedTopic.retentionEstimatePercent < 50 
                        ? 'text-red-400' 
                        : topSuggestedTopic.retentionEstimatePercent < 75 
                        ? 'text-amber-400' 
                        : 'text-emerald-400'
                    }>
                      {topSuggestedTopic.retentionEstimatePercent}%
                    </strong>
                    <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          topSuggestedTopic.retentionEstimatePercent < 50 
                            ? 'bg-red-500' 
                            : topSuggestedTopic.retentionEstimatePercent < 75 
                            ? 'bg-amber-500' 
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${topSuggestedTopic.retentionEstimatePercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 block">Quiz & Visits</span>
                  <strong className="text-zinc-200">
                    {topSuggestedTopic.quizScore !== undefined ? `${topSuggestedTopic.quizScore}% Quiz` : 'No quiz'} • {topSuggestedTopic.repetitionCount} visits
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAndReview(topSuggestedTopic.topicId)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-200 hover:bg-white text-zinc-900 rounded-lg font-medium text-xs shadow-md transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Note & Revisit Now</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>

                  <button
                    onClick={() => handleMarkReviewed(topSuggestedTopic.topicId)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#25252b] hover:bg-[#2d2d34] text-zinc-200 border border-[#34343d] rounded-lg text-xs transition-colors"
                    title="Logs current date/time as study date and shifts interval"
                  >
                    {justReviewedTopicId === topSuggestedTopic.topicId ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Reviewed Today!</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mark Reviewed Today</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Edit Date Trigger */}
                <button
                  onClick={() => {
                    setEditingDateTopicId(topSuggestedTopic.topicId);
                    setCustomDateInput(topSuggestedTopic.lastStudyDate ? topSuggestedTopic.lastStudyDate.slice(0, 10) : new Date().toISOString().slice(0, 10));
                  }}
                  className="text-[11px] text-zinc-400 hover:text-zinc-200 hover:underline flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3" />
                  <span>Adjust last study date</span>
                </button>
              </div>

              {/* Inline Custom Date Editor */}
              {editingDateTopicId === topSuggestedTopic.topicId && (
                <div className="mt-3 p-2.5 rounded bg-[#131316] border border-[#2b2b32] flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400">Set study date:</span>
                  <input
                    type="date"
                    value={customDateInput}
                    onChange={(e) => setCustomDateInput(e.target.value)}
                    className="bg-[#1e1e23] border border-[#34343b] rounded px-2 py-0.5 text-zinc-200 text-xs focus:outline-none focus:border-zinc-500"
                  />
                  <button
                    onClick={() => handleSaveCustomDate(topSuggestedTopic.topicId)}
                    className="px-2 py-0.5 bg-zinc-200 hover:bg-white text-zinc-900 rounded text-xs font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingDateTopicId(null)}
                    className="px-2 py-0.5 text-zinc-400 hover:text-zinc-200 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SPATIAL REVIEWS QUEUE & FILTER LIST */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider">
                Full Spaced Repetition Queue ({allSchedules.length})
              </h4>

              {/* Tabs */}
              <div className="flex items-center gap-1 p-0.5 bg-[#121215] border border-[#232328] rounded-lg overflow-x-auto no-scrollbar max-w-full">
                <button
                  onClick={() => setActiveTab('due')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors shrink-0 whitespace-nowrap touch-manipulation ${
                    activeTab === 'due'
                      ? 'bg-[#24242b] text-zinc-100 font-medium'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  All Due ({dueQueue.length})
                </button>
                <button
                  onClick={() => setActiveTab('overdue')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors shrink-0 whitespace-nowrap touch-manipulation ${
                    activeTab === 'overdue'
                      ? 'bg-[#24242b] text-red-300 font-medium'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Overdue ({overdueCount})
                </button>
                <button
                  onClick={() => setActiveTab('today')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors shrink-0 whitespace-nowrap touch-manipulation ${
                    activeTab === 'today'
                      ? 'bg-[#24242b] text-amber-300 font-medium'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Due Today ({dueTodayCount})
                </button>
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors shrink-0 whitespace-nowrap touch-manipulation ${
                    activeTab === 'upcoming'
                      ? 'bg-[#24242b] text-white font-medium border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Upcoming ({upcomingCount})
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors shrink-0 whitespace-nowrap touch-manipulation ${
                    activeTab === 'all'
                      ? 'bg-[#24242b] text-white font-medium border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  All ({allSchedules.length})
                </button>
              </div>
            </div>

            {/* Search filter input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter topics by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#131316] border border-[#26262b] rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* Topic Review Queue Table / Cards */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {filteredList.length === 0 ? (
                <div className="p-8 text-center bg-[#131315] border border-[#232328] rounded-lg text-zinc-500">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500/50 mx-auto mb-2" />
                  <p className="text-zinc-400 font-medium">All caught up for this category!</p>
                  <p className="text-[11px] text-zinc-500 mt-1">No topics currently require repetition under these criteria.</p>
                </div>
              ) : (
                filteredList.map((item) => {
                  const isHero = topSuggestedTopic?.topicId === item.topicId;
                  const isEditing = editingDateTopicId === item.topicId;
                  const wasJustReviewed = justReviewedTopicId === item.topicId;

                  return (
                    <div
                      key={item.topicId}
                      className={`p-2.5 sm:p-3 rounded-lg border transition-all ${
                        isHero
                          ? 'bg-[#1b1916] border-amber-500/40'
                          : 'bg-[#141417] border-[#222227] hover:border-[#2d2d34]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] text-zinc-500 font-mono uppercase">
                              {item.category}
                            </span>

                            {item.isOverdue ? (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-red-950/70 text-red-300 border border-red-800/40">
                                Overdue by {item.daysOverdue}d
                              </span>
                            ) : item.lastStudyDate && item.daysOverdue === 0 ? (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-950/70 text-amber-300 border border-amber-800/40">
                                Due Today
                              </span>
                            ) : item.lastStudyDate ? (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                                Due in {Math.abs(item.daysOverdue)}d
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-400">
                                Not studied
                              </span>
                            )}

                            {item.learningStatus === 'needs_revision' && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                Needs Revision
                              </span>
                            )}
                          </div>

                          <h5 
                            onClick={() => handleOpenAndReview(item.topicId)}
                            className="font-medium text-zinc-200 hover:text-white cursor-pointer truncate mt-0.5"
                          >
                            {item.topicTitle}
                          </h5>

                          <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1 flex-wrap">
                            <span title="Last time this topic was viewed or studied">
                              Last studied: <strong className="text-zinc-300">{item.lastStudyDate ? formatRelativeDate(item.lastStudyDate) : 'Never'}</strong>
                            </span>
                            <span>•</span>
                            <span title="Spaced repetition interval">
                              Interval: <strong className="text-zinc-300">{item.intervalDays}d</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Retention: <strong className={item.retentionEstimatePercent < 60 ? 'text-red-400' : 'text-zinc-300'}>{item.retentionEstimatePercent}%</strong>
                            </span>
                            {item.quizScore !== undefined && (
                              <>
                                <span>•</span>
                                <span>Quiz: <strong className="text-purple-300">{item.quizScore}%</strong></span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Right Quick Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleMarkReviewed(item.topicId)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1e1e23] hover:bg-[#27272f] border border-[#2d2d36] text-[11px] text-zinc-300 hover:text-emerald-300 transition-colors"
                            title="Mark as reviewed today"
                          >
                            {wasJustReviewed ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400/80" />
                            )}
                            <span className="hidden sm:inline">{wasJustReviewed ? 'Done!' : 'Mark Reviewed'}</span>
                          </button>

                          <button
                            onClick={() => handleOpenAndReview(item.topicId)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#222226] hover:bg-[#28282e] border border-zinc-700/60 text-[11px] text-zinc-200 hover:text-white transition-colors"
                          >
                            <span>Open</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Custom Date Setter if expanded */}
                      {isEditing && (
                        <div className="mt-2 pt-2 border-t border-[#25252c] flex items-center gap-2 text-[11px]">
                          <span className="text-zinc-400">Date:</span>
                          <input
                            type="date"
                            value={customDateInput}
                            onChange={(e) => setCustomDateInput(e.target.value)}
                            className="bg-[#1c1c20] border border-[#2c2c34] rounded px-2 py-0.5 text-zinc-200 text-xs"
                          />
                          <button
                            onClick={() => handleSaveCustomDate(item.topicId)}
                            className="px-2 py-0.5 bg-zinc-200 hover:bg-white text-zinc-900 rounded text-xs font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingDateTopicId(null)}
                            className="px-2 py-0.5 text-zinc-400"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#26262a] bg-[#141416] text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Spaced repetition algorithm active • Automatically tracks visits & study logs</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#202026] hover:bg-[#292931] text-zinc-300 rounded text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
