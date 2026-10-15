import React from 'react';
import { TopicNode, RelationshipEdge, LearningStatus } from '../../types/knowledge';
import { 
  FileText, 
  Network, 
  Link2, 
  BookOpen, 
  Edit3, 
  Check, 
  Layers,
  Eye
} from 'lucide-react';

interface StatusBarProps {
  activeTabId: string;
  activeTopic: TopicNode | null;
  totalTopicsCount: number;
  edges: RelationshipEdge[];
  statuses: Record<string, LearningStatus>;
  mode: 'read' | 'edit';
  visitCount?: number;
  onToggleMode: () => void;
  onOpenGraph: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  activeTabId,
  activeTopic,
  totalTopicsCount,
  edges,
  statuses,
  mode,
  visitCount,
  onToggleMode,
  onOpenGraph,
}) => {
  const isGraph = activeTabId === 'graph-view';

  // Calculate links for current topic
  const incomingLinks = activeTopic 
    ? edges.filter(e => e.target === activeTopic.id).length 
    : 0;
  const outgoingLinks = activeTopic 
    ? edges.filter(e => e.source === activeTopic.id).length 
    : 0;

  // Study count
  const learnedCount = Object.values(statuses).filter(s => s === 'learned').length;

  return (
    <footer className="h-6 bg-[#141416] border-t border-[#232326] px-3 flex items-center justify-between text-[11px] text-zinc-400 select-none shrink-0 z-20">
      {/* Left status item */}
      <div className="flex items-center space-x-3">
        {isGraph ? (
          <button 
            onClick={onOpenGraph}
            className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors"
          >
            <Network className="w-3 h-3 text-zinc-300" />
            <span>Interactive Graph View • {totalTopicsCount} nodes</span>
          </button>
        ) : activeTopic ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-zinc-300">
              <FileText className="w-3 h-3 text-zinc-400 shrink-0" />
              <span className="truncate max-w-[110px] min-[380px]:max-w-[150px] sm:max-w-[200px]">{activeTopic.title}</span>
            </span>
            <span className="text-zinc-600 hidden min-[480px]:inline">|</span>
            <span className="hidden min-[480px]:flex items-center gap-1 text-zinc-400" title="Incoming backlinks">
              <Link2 className="w-3 h-3 text-zinc-500" />
              <span>{incomingLinks} backlinks</span>
            </span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-zinc-400 hidden sm:inline" title="Outgoing links">
              {outgoingLinks} outgoing
            </span>
            {visitCount !== undefined && (
              <>
                <span className="text-zinc-600 hidden md:inline">|</span>
                <span className="hidden md:flex items-center gap-1 text-zinc-300" title="Number of times visited">
                  <Eye className="w-3 h-3 text-zinc-400" />
                  <span>{visitCount} {visitCount === 1 ? 'visit' : 'visits'}</span>
                </span>
              </>
            )}
          </div>
        ) : (
          <span>Anvay Workspace</span>
        )}
      </div>

      {/* Right status item */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {!isGraph && (
          <button
            onClick={onToggleMode}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all duration-200 cursor-pointer text-[11px] touch-manipulation ${
              mode === 'read'
                ? 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1e1e22]'
                : 'text-amber-300 hover:text-amber-200 bg-[#221d17] border border-amber-800/40 shadow-xs'
            }`}
            title="Toggle Reading / Editing view"
            aria-label={mode === 'read' ? 'Switch to Editing view' : 'Switch to Reading view'}
          >
            <div
              className={`transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 ${
                mode === 'edit' ? 'rotate-180 text-amber-300' : 'rotate-0 text-zinc-400'
              }`}
            >
              {mode === 'read' ? (
                <BookOpen className="w-3 h-3" />
              ) : (
                <Edit3 className="w-3 h-3" />
              )}
            </div>
            <span className="hidden min-[380px]:inline">{mode === 'read' ? 'Reading view' : 'Editing view'}</span>
            <span className="min-[380px]:hidden">{mode === 'read' ? 'Read' : 'Edit'}</span>
          </button>
        )}

        <span className="text-zinc-600 hidden sm:inline">|</span>

        <span className="hidden sm:flex items-center gap-1 text-zinc-400">
          <Layers className="w-3 h-3 text-zinc-500" />
          <span>{learnedCount}/{totalTopicsCount} learned</span>
        </span>

        <span className="text-zinc-600 hidden md:inline">|</span>

        <span className="text-zinc-400 hidden md:inline">
          Local Storage
        </span>
      </div>
    </footer>
  );
};
