import React, { useState, useMemo } from 'react';
import { TopicNode, RelationshipEdge, LearningStatus } from '../../types/knowledge';
import { QuizResult, PrerequisiteGap } from '../../types/learning';
import { diagnoseTopicPrerequisites, diagnoseAllSyllabusTopics } from '../../utils/gapFinder';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Network, 
  GitBranch, 
  BookOpen, 
  Search, 
  Filter,
  CheckCircle,
  HelpCircle,
  XCircle,
  Sparkles
} from 'lucide-react';

interface PrerequisiteGapPanelProps {
  selectedTopic: TopicNode | null;
  allTopics: TopicNode[];
  edges: RelationshipEdge[];
  statuses: Record<string, LearningStatus>;
  quizResults: Record<string, QuizResult>;
  onSelectTopic: (topicId: string) => void;
  onOpenNote: (topicId: string) => void;
  onHighlightGapsInGraph: () => void;
}

export const PrerequisiteGapPanel: React.FC<PrerequisiteGapPanelProps> = ({
  selectedTopic,
  allTopics,
  edges,
  statuses,
  quizResults,
  onSelectTopic,
  onOpenNote,
  onHighlightGapsInGraph,
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'audit'>('current');
  const [auditFilter, setAuditFilter] = useState<'blocked' | 'ready' | 'all'>('blocked');
  const [searchQuery, setSearchQuery] = useState('');

  // Diagnostic for selected topic
  const selectedDiagnostic = useMemo(() => {
    if (!selectedTopic) return null;
    return diagnoseTopicPrerequisites(
      selectedTopic.id,
      allTopics,
      edges,
      statuses,
      quizResults
    );
  }, [selectedTopic, allTopics, edges, statuses, quizResults]);

  // Full syllabus audit
  const fullAudit = useMemo(() => {
    return diagnoseAllSyllabusTopics(allTopics, edges, statuses, quizResults);
  }, [allTopics, edges, statuses, quizResults]);

  const auditList = useMemo(() => {
    return allTopics.filter(topic => {
      const diag = fullAudit.diagnosticMap[topic.id];
      if (!diag) return false;

      if (auditFilter === 'blocked' && diag.isReady) return false;
      if (auditFilter === 'ready' && (!diag.isReady || statuses[topic.id] === 'learned')) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return topic.title.toLowerCase().includes(q) || topic.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [allTopics, fullAudit, auditFilter, statuses, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-[#18181a] select-none text-zinc-300">
      {/* Top Header */}
      <div className="p-3 border-b border-[#232326] shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-100">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Prerequisite Gap Finder</span>
          </div>

          <button
            onClick={onHighlightGapsInGraph}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#202026] hover:bg-[#282830] text-zinc-300 hover:text-white border border-[#2c2c34] text-[10px] transition-colors"
            title="Highlight all missing prerequisite nodes in interactive graph"
          >
            <Network className="w-3 h-3" />
            <span>Graph View</span>
          </button>
        </div>

        {/* Tab switcher: Current Topic vs Syllabus Audit */}
        <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#141416] rounded border border-[#232326] text-[11px]">
          <button
            onClick={() => setActiveTab('current')}
            className={`py-1 rounded text-center transition-colors ${
              activeTab === 'current'
                ? 'bg-[#222228] text-zinc-100 font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Current Topic
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-1 rounded text-center transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-[#222228] text-zinc-100 font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Syllabus Audit</span>
            {fullAudit.blockedTopicIds.size > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] flex items-center justify-center font-mono">
                {fullAudit.blockedTopicIds.size}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeTab === 'current' ? (
          /* ======================================================== */
          /* CURRENT TOPIC DIAGNOSTIC VIEW */
          /* ======================================================== */
          selectedTopic && selectedDiagnostic ? (
            <div className="space-y-4">
              {/* Readiness Status Card */}
              <div className={`p-3 rounded-lg border transition-all ${
                selectedDiagnostic.isReady
                  ? 'bg-[#15231c] border-emerald-800/50 text-emerald-200'
                  : 'bg-[#251b17] border-amber-800/50 text-amber-200'
              }`}>
                <div className="flex items-start gap-2.5">
                  {selectedDiagnostic.isReady ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-100">
                      {selectedDiagnostic.isReady
                        ? 'All Prerequisites Cleared!'
                        : `${selectedDiagnostic.gaps.length} Missing Prerequisite ${selectedDiagnostic.gaps.length === 1 ? 'Gap' : 'Gaps'}`}
                    </h4>
                    <p className="text-[11px] mt-0.5 text-zinc-300 leading-relaxed">
                      {selectedDiagnostic.isReady
                        ? `You have satisfied all foundational dependencies for "${selectedTopic.title}". Ready for full comprehension.`
                        : `Studying "${selectedTopic.title}" now may cause confusion without mastering foundational concepts first.`}
                    </p>

                    <div className="mt-2 text-[10px] text-zinc-400 font-mono">
                      Satisfied: {selectedDiagnostic.satisfiedPrerequisites} of {selectedDiagnostic.totalPrerequisites} prerequisite dependencies
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing Gaps List */}
              {selectedDiagnostic.gaps.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Unresolved Prerequisite Nodes
                  </span>

                  {selectedDiagnostic.gaps.map((gap) => (
                    <div
                      key={gap.missingPrerequisiteId}
                      className="p-2.5 rounded bg-[#1e1e22] border border-[#28282e] hover:border-amber-500/40 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-zinc-200 truncate">
                          {gap.missingPrerequisiteTitle}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                          gap.severity === 'critical'
                            ? 'text-red-400 bg-red-950/40 border border-red-800/40'
                            : 'text-amber-400 bg-amber-950/40 border border-amber-800/40'
                        }`}>
                          Depth {gap.depth}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-tight">
                        {gap.recommendedAction}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-zinc-500 capitalize">
                          Reason: {gap.reason.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => {
                            onSelectTopic(gap.missingPrerequisiteId);
                            onOpenNote(gap.missingPrerequisiteId);
                          }}
                          className="text-[11px] text-zinc-300 hover:text-white hover:underline flex items-center gap-1"
                        >
                          <span>Open Note</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommended Study Sequence */}
              {selectedDiagnostic.recommendedLearningPath.length > 1 && (
                <div className="p-3 rounded bg-[#19191d] border border-[#25252b] space-y-2">
                  <span className="text-[10px] font-semibold text-zinc-300 uppercase tracking-wider block">
                    Recommended Learning Pathway
                  </span>
                  <div className="space-y-1.5">
                    {selectedDiagnostic.recommendedLearningPath.map((pathId, idx) => {
                      const pathTopic = allTopics.find(t => t.id === pathId);
                      const isTarget = pathId === selectedTopic.id;
                      const status = statuses[pathId] || 'not_studied';

                      return (
                        <div
                          key={pathId}
                          onClick={() => {
                            onSelectTopic(pathId);
                            onOpenNote(pathId);
                          }}
                          className={`p-1.5 rounded text-xs flex items-center justify-between cursor-pointer transition-colors ${
                            isTarget
                              ? 'bg-[#222228] text-white font-medium border border-zinc-700/60'
                              : 'hover:bg-[#202024] text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-4 h-4 rounded-full bg-[#27272e] text-zinc-400 text-[10px] font-mono flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="truncate">{pathTopic?.title || pathId}</span>
                          </div>

                          <span className={`text-[9px] px-1 rounded uppercase font-mono ${
                            status === 'learned'
                              ? 'text-emerald-400'
                              : 'text-zinc-500'
                          }`}>
                            {isTarget ? 'Target' : status.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-zinc-500 text-xs">
              Select a topic from the explorer or graph to inspect prerequisite health.
            </div>
          )
        ) : (
          /* ======================================================== */
          /* SYLLABUS AUDIT VIEW */
          /* ======================================================== */
          <div className="space-y-3">
            {/* Search */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#141416] border border-[#232326] rounded text-xs">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit..."
                className="bg-transparent text-zinc-200 text-xs placeholder-zinc-500 focus:outline-none w-full"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-[11px]">
              {(['blocked', 'ready', 'all'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setAuditFilter(mode)}
                  className={`px-2 py-0.5 rounded transition-colors capitalize ${
                    auditFilter === mode
                      ? 'bg-[#25252b] text-white font-medium border border-zinc-700/60'
                      : 'bg-[#202024] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {mode === 'blocked' ? `Blocked (${fullAudit.blockedTopicIds.size})` : mode === 'ready' ? `Ready (${fullAudit.readyToStudyTopicIds.size})` : `All (${allTopics.length})`}
                </button>
              ))}
            </div>

            {/* Audit List */}
            <div className="space-y-1.5">
              {auditList.map(topic => {
                const diag = fullAudit.diagnosticMap[topic.id];
                const isBlocked = !diag?.isReady;
                const status = statuses[topic.id] || 'not_studied';

                return (
                  <div
                    key={topic.id}
                    onClick={() => {
                      onSelectTopic(topic.id);
                      onOpenNote(topic.id);
                    }}
                    className="p-2 rounded bg-[#1a1a1d] hover:bg-[#202025] border border-[#242428] cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-200 truncate">
                        {topic.title}
                      </span>
                      {isBlocked ? (
                        <span className="text-[10px] text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{diag?.gaps.length} gaps</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Ready</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span>{topic.category}</span>
                      <span className="capitalize">{status.replace('_', ' ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
