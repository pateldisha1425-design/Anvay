import React, { useRef, useEffect } from 'react';
import { TopicNode, LearningStatus } from '../../types/knowledge';
import { BookOpen, Network, CheckCircle2, ShieldAlert, AlertTriangle } from 'lucide-react';

interface TopicPreviewPopoverProps {
  topic: TopicNode;
  status?: LearningStatus;
  backlinksCount?: number;
  visitCount?: number;
  onOpenNote?: (topicId: string) => void;
  onFocusInGraph?: (topicId: string) => void;
  position?: { x: number; y: number };
  className?: string;
}

export const TopicPreviewPopover: React.FC<TopicPreviewPopoverProps> = ({
  topic,
  status = 'not_studied',
  backlinksCount = 0,
  visitCount = 0,
  onOpenNote,
  onFocusInGraph,
  position,
  className = '',
}) => {
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const getStatusColor = (st: LearningStatus) => {
    switch (st) {
      case 'learned':
        return 'text-zinc-200 bg-zinc-800/80 border-zinc-700/60';
      case 'needs_revision':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/40';
      case 'learning':
        return 'text-zinc-300 bg-zinc-800/80 border-zinc-700/60';
      default:
        return 'text-zinc-400 bg-zinc-800/60 border-zinc-700/40';
    }
  };

  const popoverStyle: React.CSSProperties = position
    ? {
        position: 'fixed',
        left: Math.min(position.x, window.innerWidth - 300),
        top: Math.min(position.y + 12, window.innerHeight - 200),
        zIndex: 50,
      }
    : {};

  return (
    <div
      ref={popoverRef}
      style={popoverStyle}
      className={`w-72 p-3 bg-[#18181b]/98 border border-[#2c2c34] rounded-lg shadow-2xl text-xs text-zinc-300 select-none animate-in fade-in-50 duration-100 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Category & Status */}
      <div className="flex items-center justify-between gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">
        <span className="truncate">{topic.category}</span>
        <span className={`px-1.5 py-0.2 rounded border ${getStatusColor(status)} font-sans text-[10px] capitalize`}>
          {status.replace('_', ' ')}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-zinc-100 font-semibold text-xs leading-snug mb-1">
        {topic.title}
      </h4>

      {/* Description */}
      {topic.description && (
        <p className="text-zinc-400 text-[11px] line-clamp-2 leading-relaxed mb-2.5">
          {topic.description}
        </p>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-2.5 py-1.5 border-t border-[#25252a] text-[10px] text-zinc-400">
        <span>
          <strong className="text-zinc-200">{topic.prerequisiteIds.length}</strong> prerequisites
        </span>
        <span>•</span>
        <span>
          <strong className="text-zinc-200">{backlinksCount}</strong> backlinks
        </span>
        {visitCount > 0 && (
          <>
            <span>•</span>
            <span>{visitCount} visits</span>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-[#25252a] mt-1 text-[11px]">
        {onOpenNote && (
          <button
            onClick={() => onOpenNote(topic.id)}
            className="flex items-center gap-1 text-zinc-200 hover:text-white transition-colors font-medium hover:underline"
          >
            <BookOpen className="w-3 h-3" />
            <span>Open note</span>
          </button>
        )}

        {onFocusInGraph && (
          <button
            onClick={() => onFocusInGraph(topic.id)}
            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <Network className="w-3 h-3" />
            <span>View in Graph</span>
          </button>
        )}
      </div>
    </div>
  );
};
