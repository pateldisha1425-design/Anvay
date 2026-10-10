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
            <Network className="w-3 h-3 text-blue-400" />
            <span>Interactive Graph View • {totalTopicsCount} nodes</span>
          </button>
        ) : activeTopic ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-zinc-300">
              <FileText className="w-3 h-3 text-zinc-400" />
              <span className="truncate max-w-[200px]">{activeTopic.title}</span>
            </span>
            <span className="text-zinc-600">|</span>
            <span className="flex items-center gap-1 text-zinc-400" title="Incoming backlinks">
              <Link2 className="w-3 h-3 text-zinc-500" />
              <span>{incomingLinks} backlinks</span>
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400" title="Outgoing links">
              {outgoingLinks} outgoing
            </span>
            {visitCount !== undefined && (
              <>
                <span className="text-zinc-600">|</span>
                <span className="flex items-center gap-1 text-zinc-300" title="Number of times visited">
                  <Eye className="w-3 h-3 text-blue-400" />
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
      <div className="flex items-center space-x-3">
        {!isGraph && (
          <button
            onClick={onToggleMode}
            className="flex items-center gap-1 hover:text-zinc-200 transition-colors text-zinc-400 cursor-pointer"
            title="Toggle Reading / Editing view"
          >
            {mode === 'read' ? (
              <>
                <BookOpen className="w-3 h-3 text-zinc-400" />
                <span>Reading view</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3 h-3 text-blue-400" />
                <span className="text-blue-400">Editing</span>
              </>
            )}
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
