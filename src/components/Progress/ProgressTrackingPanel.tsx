import React, { useMemo } from 'react';
import { TopicNode, FolderItem, LearningStatus } from '../../types/knowledge';
import { QuizResult } from '../../types/learning';
import { calculateSyllabusProgress } from '../../utils/gapFinder';
import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Flame, 
  ArrowRight, 
  AlertTriangle,
  FolderTree,
  BookOpen
} from 'lucide-react';

interface ProgressTrackingPanelProps {
  topics: TopicNode[];
  folders: FolderItem[];
  statuses: Record<string, LearningStatus>;
  topicVisits: Record<string, number>;
  quizResults: Record<string, QuizResult>;
  totalGapsDetected: number;
  onSelectTopic: (topicId: string) => void;
  onOpenNote: (topicId: string) => void;
}

export const ProgressTrackingPanel: React.FC<ProgressTrackingPanelProps> = ({
  topics,
  folders,
  statuses,
  topicVisits,
  quizResults,
  totalGapsDetected,
  onSelectTopic,
  onOpenNote,
}) => {
  const progress = useMemo(() => {
    return calculateSyllabusProgress(
      topics,
      folders,
      statuses,
      topicVisits,
      quizResults,
      totalGapsDetected
    );
  }, [topics, folders, statuses, topicVisits, quizResults, totalGapsDetected]);

  // Topics needing revision
  const needsRevisionTopics = useMemo(() => {
    return topics.filter(t => statuses[t.id] === 'needs_revision');
  }, [topics, statuses]);

  // Next topic to study
  const nextStudyTopic = useMemo(() => {
    return topics.find(t => (statuses[t.id] || 'not_studied') === 'not_studied') || topics[0];
  }, [topics, statuses]);

  return (
    <div className="flex flex-col h-full bg-[#18181a] select-none text-zinc-300">
      {/* Header */}
      <div className="p-3 border-b border-[#232326] shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-100 mb-1">
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          <span>Mastery & Progress Tracker</span>
        </div>
        <p className="text-[11px] text-zinc-500">
          Local syllabus completion, mastery quiz scores & visit telemetry.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Overall Mastery Card */}
        <div className="p-4 rounded-lg bg-[#1a1a1e] border border-[#27272c] text-center space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
            Functional Materials Mastery
          </span>

          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-extrabold text-blue-400">
              {progress.overallMasteryPercentage}%
            </span>
            <span className="text-xs text-zinc-500">completed</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#24242a] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress.overallMasteryPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 font-mono">
            <span>{progress.learnedCount} of {progress.totalTopics} learned</span>
            <span>{progress.quizzesMastered} quizzes mastered</span>
          </div>
        </div>

        {/* 4-Stat Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded bg-[#1a1a1d] border border-[#242428] space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
              <Eye className="w-3 h-3 text-blue-400" />
              <span>Total Visits</span>
            </div>
            <div className="text-sm font-bold text-zinc-100 font-mono">
              {progress.totalVisits}
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#1a1a1d] border border-[#242428] space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
              <Award className="w-3 h-3 text-amber-400" />
              <span>Quizzes Mastered</span>
            </div>
            <div className="text-sm font-bold text-zinc-100 font-mono">
              {progress.quizzesMastered} / {topics.length}
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#1a1a1d] border border-[#242428] space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Topics Learned</span>
            </div>
            <div className="text-sm font-bold text-zinc-100 font-mono">
              {progress.learnedCount}
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#1a1a1d] border border-[#242428] space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Needs Revision</span>
            </div>
            <div className="text-sm font-bold text-zinc-100 font-mono">
              {progress.needsRevisionCount}
            </div>
          </div>
        </div>

        {/* Needs Revision Callout if any */}
        {needsRevisionTopics.length > 0 && (
          <div className="p-3 rounded bg-[#241c16] border border-amber-900/50 space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-300 font-medium">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Needs Revision ({needsRevisionTopics.length})</span>
              </span>
            </div>

            <div className="space-y-1">
              {needsRevisionTopics.slice(0, 3).map(topic => (
                <div
                  key={topic.id}
                  onClick={() => {
                    onSelectTopic(topic.id);
                    onOpenNote(topic.id);
                  }}
                  className="text-xs text-amber-200/90 hover:underline cursor-pointer flex items-center justify-between py-0.5"
                >
                  <span className="truncate">{topic.title}</span>
                  <ArrowRight className="w-3 h-3 text-amber-400 shrink-0 ml-1" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module Breakdown */}
        <div className="space-y-2">
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Module Breakdown
          </span>

          <div className="space-y-2">
            {progress.moduleBreakdown.map(mod => (
              <div
                key={mod.folderId}
                className="p-2.5 rounded bg-[#19191c] border border-[#242428] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-200 truncate pr-2">
                    {mod.folderName}
                  </span>
                  <span className="text-[11px] font-mono text-blue-400 font-semibold shrink-0">
                    {mod.percentage}%
                  </span>
                </div>

                <div className="w-full bg-[#25252c] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${mod.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>{mod.learnedTopics}/{mod.totalTopics} learned</span>
                  <span>{mod.masteredQuizzes} quizzes</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Learning Action */}
        {nextStudyTopic && (
          <div className="p-3 rounded-lg bg-[#182029] border border-[#223548] space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 block">
              Recommended Next Step
            </span>
            <h5 className="text-xs font-semibold text-zinc-200">
              {nextStudyTopic.title}
            </h5>
            <p className="text-[11px] text-zinc-400 line-clamp-1">
              {nextStudyTopic.description}
            </p>
            <button
              onClick={() => {
                onSelectTopic(nextStudyTopic.id);
                onOpenNote(nextStudyTopic.id);
              }}
              className="mt-1 w-full py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Continue Studying</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
