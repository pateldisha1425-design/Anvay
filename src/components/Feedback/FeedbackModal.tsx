import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Send, 
  Network, 
  HelpCircle, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  Star,
  FileQuestion,
  Sparkles,
  Link2
} from 'lucide-react';
import { TopicNode } from '../../types/knowledge';
import { FeedbackCategory, FeedbackSeverity, ReporterRole, FeedbackReport } from '../../types/feedback';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: TopicNode;
  allTopics: TopicNode[];
  userRating?: number;
  currentUserId?: string;
  currentUserName?: string;
  onSubmit: (report: FeedbackReport, optionalRating?: number) => void;
}

const CATEGORY_OPTIONS: { id: FeedbackCategory; label: string; description: string; icon: any }[] = [
  {
    id: 'error',
    label: 'Factual / Formula Error',
    description: 'Mistake in scientific formula, derivation, stoichiometry, or terminology',
    icon: AlertTriangle,
  },
  {
    id: 'unclear',
    label: 'Unclear Explanation',
    description: 'Concept is confusing, lacks intuitive intuition or needs better breakdown',
    icon: HelpCircle,
  },
  {
    id: 'missing_prereq',
    label: 'Missing Prerequisite',
    description: 'Foundational topic is needed before understanding this concept',
    icon: GraduationCap,
  },
  {
    id: 'missing_example',
    label: 'Missing Example',
    description: 'Needs worked numerical problem, material application, or sample case',
    icon: Sparkles,
  },
  {
    id: 'poor_resource',
    label: 'Poor Resource / Broken Link',
    description: 'External textbook, lecture or paper link is low-quality or inaccessible',
    icon: BookOpen,
  },
  {
    id: 'graph_connection',
    label: 'Graph Relationship Flaw',
    description: 'Missing or inaccurate edge/connection in the knowledge graph',
    icon: Network,
  },
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  topic,
  allTopics,
  userRating,
  currentUserId = 'anonymous-student',
  currentUserName = 'Student',
  onSubmit,
}) => {
  const [category, setCategory] = useState<FeedbackCategory>('unclear');
  const [severity, setSeverity] = useState<FeedbackSeverity>('medium');
  const [reporterRole, setReporterRole] = useState<ReporterRole>('student');
  const [reporterName, setReporterName] = useState(currentUserName);
  const [comment, setComment] = useState('');
  const [includeRating, setIncludeRating] = useState<number>(userRating || 0);

  // Graph suggestion fields
  const [includeGraphSuggestion, setIncludeGraphSuggestion] = useState(false);
  const [targetTopicId, setTargetTopicId] = useState<string>(
    allTopics.find(t => t.id !== topic.id)?.id || ''
  );
  const [suggestedRelationType, setSuggestedRelationType] = useState<
    'prerequisite' | 'related' | 'part_of' | 'application_of' | 'preparation_of'
  >('prerequisite');
  const [graphSuggestionNotes, setGraphSuggestionNotes] = useState('');

  // UI state
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setValidationError('Please provide a brief comment describing the issue or feedback.');
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();
      const reportId = `rep-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      const newReport: FeedbackReport = {
        id: reportId,
        topicId: topic.id,
        topicTitle: topic.title,
        category,
        severity,
        reporterRole,
        reporterId: currentUserId || 'anonymous-user',
        reporterName: reporterName.trim() || (reporterRole === 'teacher' ? 'Faculty Instructor' : 'Student'),
        comment: comment.trim(),
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };

      if (includeGraphSuggestion || category === 'graph_connection') {
        const targetTopic = allTopics.find(t => t.id === targetTopicId);
        newReport.graphSuggestion = {
          sourceTopicId: topic.id,
          targetTopicId,
          suggestedRelationType,
          description: graphSuggestionNotes.trim() || `Suggested ${suggestedRelationType} connection between ${topic.title} and ${targetTopic?.title || targetTopicId}`,
        };
      }

      onSubmit(newReport, includeRating > 0 ? includeRating : undefined);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setValidationError('Failed to save report. Please check your inputs and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-xl max-h-[90vh] bg-[#161619] border border-[#2b2b30] rounded-xl shadow-2xl flex flex-col overflow-hidden text-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-[#26262a] bg-[#1a1a1e] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-[#222228] border border-zinc-700/60 text-zinc-200">
              <FileQuestion className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">
                Submit Topic Feedback & Report Issue
              </h2>
              <p className="text-[11px] text-zinc-400 truncate max-w-[200px] sm:max-w-sm">
                Topic: <strong className="text-white font-medium">{topic.title}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#25252b] transition-colors touch-manipulation"
            aria-label="Close feedback modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {validationError && (
            <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-800/50 text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Reporter Role Selector */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1.5">
              Your Role in Anvay
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReporterRole('student')}
                className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs transition-colors ${
                  reporterRole === 'student'
                    ? 'bg-[#222228] border-zinc-500 text-white font-medium'
                    : 'bg-[#1a1a1e] border-[#29292e] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student Learner</span>
              </button>
              <button
                type="button"
                onClick={() => setReporterRole('teacher')}
                className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs transition-colors ${
                  reporterRole === 'teacher'
                    ? 'bg-[#222228] border-zinc-500 text-white font-medium'
                    : 'bg-[#1a1a1e] border-[#29292e] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Teacher / Faculty</span>
              </button>
            </div>
          </div>

          {/* Feedback Category */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1.5">
              Issue Category <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id);
                      if (cat.id === 'graph_connection') {
                        setIncludeGraphSuggestion(true);
                      }
                    }}
                    className={`flex items-start gap-2 p-2.5 rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'bg-[#22222a] border-zinc-500 text-white shadow-xs'
                        : 'bg-[#19191c] border-[#252529] text-zinc-400 hover:text-zinc-200 hover:bg-[#1d1d22]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-zinc-500'}`} />
                    <div>
                      <div className="font-medium text-[12px]">{cat.label}</div>
                      <div className="text-[10px] text-zinc-500 line-clamp-1">{cat.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity & Optional Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Priority / Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as FeedbackSeverity)}
                className="w-full bg-[#19191d] border border-[#2b2b30] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-400"
              >
                <option value="low">Low (Cosmetic / Minor enhancement)</option>
                <option value="medium">Medium (Improves comprehension)</option>
                <option value="high">High (Factual error or missing step)</option>
                <option value="critical">Critical (Blocking misconception)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Optional Topic Rating (1–5 Stars)
              </label>
              <div className="flex items-center gap-1.5 bg-[#19191d] border border-[#2b2b30] rounded-lg px-2.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setIncludeRating(star)}
                    className="p-0.5 text-zinc-600 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= includeRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-[11px] text-zinc-400 ml-1">
                  {includeRating > 0 ? `${includeRating}/5` : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Comment description */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1">
              Detailed Explanation / Feedback <span className="text-red-400">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe what is unclear, missing, or incorrect. If reporting a formula error, mention the equation or line..."
              rows={4}
              className="w-full bg-[#19191d] border border-[#2b2b30] rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-400 leading-relaxed font-sans"
            />
          </div>

          {/* Knowledge Graph Correction Toggle */}
          <div className="border border-[#26262a] rounded-lg bg-[#19191c] p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-zinc-300" />
                <span className="font-medium text-zinc-300">
                  Suggest Knowledge Graph Connection
                </span>
              </div>
              <input
                type="checkbox"
                id="toggleGraphSuggestion"
                checked={includeGraphSuggestion || category === 'graph_connection'}
                onChange={(e) => setIncludeGraphSuggestion(e.target.checked)}
                className="rounded accent-zinc-400 cursor-pointer"
              />
            </div>

            {(includeGraphSuggestion || category === 'graph_connection') && (
              <div className="pt-2 border-t border-[#232326] space-y-2.5">
                <p className="text-[11px] text-zinc-400">
                  Specify how this concept ({topic.title}) should connect with another syllabus node:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-0.5">Target Concept Node</label>
                    <select
                      value={targetTopicId}
                      onChange={(e) => setTargetTopicId(e.target.value)}
                      className="w-full bg-[#141416] border border-[#27272b] rounded px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-400"
                    >
                      {allTopics
                        .filter(t => t.id !== topic.id)
                        .map(t => (
                          <option key={t.id} value={t.id}>
                            {t.title} ({t.category})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-0.5">Suggested Relationship</label>
                    <select
                      value={suggestedRelationType}
                      onChange={(e) => setSuggestedRelationType(e.target.value as any)}
                      className="w-full bg-[#141416] border border-[#27272b] rounded px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-400"
                    >
                      <option value="prerequisite">Is Prerequisite Of</option>
                      <option value="related">Is Related To</option>
                      <option value="part_of">Is Part Of</option>
                      <option value="application_of">Is Application Of</option>
                      <option value="preparation_of">Prepares For</option>
                    </select>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={graphSuggestionNotes}
                    onChange={(e) => setGraphSuggestionNotes(e.target.value)}
                    placeholder="Why should this edge be added or changed? (e.g., needed before deriving hysteresis loop)"
                    className="w-full bg-[#141416] border border-[#27272b] rounded px-2.5 py-1.5 text-[11px] text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reporter Display Name */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1">
              Your Name / Attribution (Optional)
            </label>
            <input
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="e.g. Arjun K. (MSE) or Anonymous"
              className="w-full bg-[#19191d] border border-[#2b2b30] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-400"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#26262a] bg-[#1a1a1e]">
          <span className="text-[11px] text-zinc-500">
            Free academic feedback • No paywalls
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-[#25252b] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-zinc-200 hover:bg-white text-zinc-950 transition-colors shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
