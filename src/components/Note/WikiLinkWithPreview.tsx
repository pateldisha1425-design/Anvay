import React, { useState, useRef } from 'react';
import { TopicNode, LearningStatus } from '../../types/knowledge';
import { resolveWikiLink } from '../../utils/wikiLinks';
import { TopicPreviewPopover } from '../common/TopicPreviewPopover';

interface WikiLinkWithPreviewProps {
  rawLink: string;
  allTopics: TopicNode[];
  statuses?: Record<string, LearningStatus>;
  topicVisits?: Record<string, number>;
  onNavigateTopic: (topicId: string) => void;
  onFocusInGraph?: (topicId: string) => void;
}

export const WikiLinkWithPreview: React.FC<WikiLinkWithPreviewProps> = ({
  rawLink,
  allTopics,
  statuses = {},
  topicVisits = {},
  onNavigateTopic,
  onFocusInGraph,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const linkRef = useRef<HTMLButtonElement | null>(null);

  const { targetTopic, displayText } = resolveWikiLink(rawLink, allTopics);

  if (!targetTopic) {
    return (
      <span className="text-zinc-500 italic" title="Unresolved topic link">
        [[{displayText}]]
      </span>
    );
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const rect = linkRef.current?.getBoundingClientRect();
    if (rect) {
      setPopoverPos({
        x: rect.left,
        y: rect.bottom + 4,
      });
    }
    timerRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 120);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 180);
  };

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={linkRef}
        onClick={() => onNavigateTopic(targetTopic.id)}
        className="inline text-zinc-100 hover:text-white underline decoration-zinc-600 hover:decoration-zinc-300 font-normal cursor-pointer transition-colors"
        title={`Open note: ${targetTopic.title}`}
      >
        [[{displayText}]]
      </button>

      {isHovered && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <TopicPreviewPopover
            topic={targetTopic}
            status={statuses[targetTopic.id]}
            visitCount={topicVisits[targetTopic.id] || 0}
            backlinksCount={targetTopic.relatedIds.length}
            position={popoverPos}
            onOpenNote={(id) => {
              setIsHovered(false);
              onNavigateTopic(id);
            }}
            onFocusInGraph={(id) => {
              setIsHovered(false);
              if (onFocusInGraph) onFocusInGraph(id);
            }}
          />
        </div>
      )}
    </span>
  );
};
