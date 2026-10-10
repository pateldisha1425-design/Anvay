import React, { useMemo } from 'react';
import { TopicNode, RelationshipEdge, LearningStatus } from '../../types/knowledge';
import { Link2, FileText } from 'lucide-react';

interface BacklinksPanelProps {
  selectedTopic: TopicNode | null;
  allTopics: TopicNode[];
  edges: RelationshipEdge[];
  statuses: Record<string, LearningStatus>;
  onSelectTopic: (topicId: string) => void;
  onOpenNote: (topicId: string) => void;
}

export const BacklinksPanel: React.FC<BacklinksPanelProps> = ({
  selectedTopic,
  allTopics,
  edges,
  statuses,
  onSelectTopic,
  onOpenNote,
}) => {
  const backlinks = useMemo(() => {
    if (!selectedTopic) return [];

    const list: { sourceTopic: TopicNode; label: string }[] = [];
    const topicId = selectedTopic.id;
    const titleLower = selectedTopic.title.toLowerCase();

    allTopics.forEach(t => {
      if (t.id === topicId) return;

      const edge = edges.find(e => e.source === t.id && e.target === topicId);
      if (edge) {
        list.push({
          sourceTopic: t,
          label: edge.label || edge.type.replace('_', ' '),
        });
        return;
      }

      if (t.content.toLowerCase().includes(`[[${titleLower}`)) {
        list.push({
          sourceTopic: t,
          label: 'Mentioned in note',
        });
      }
    });

    return list;
  }, [selectedTopic, allTopics, edges]);

  return (
    <div className="flex flex-col h-full bg-[#18181a] select-none text-zinc-300 text-xs">
      <div className="px-3 py-1.5 border-b border-[#232326] bg-[#161618] flex items-center justify-between">
        <span className="font-semibold text-[11px] uppercase tracking-wider text-zinc-400">
          Backlinks
        </span>
        {selectedTopic && (
          <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[120px]">
            {selectedTopic.title}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-1 py-1 space-y-0.5">
        {!selectedTopic ? (
          <div className="p-4 text-center text-zinc-500 text-[11px]">
            Select a note to view incoming links.
          </div>
        ) : backlinks.length === 0 ? (
          <div className="p-4 text-center text-zinc-500 text-[11px]">
            No notes link to this concept.
          </div>
        ) : (
          backlinks.map((b, idx) => (
            <div
              key={`${b.sourceTopic.id}-${idx}`}
              onClick={() => {
                onSelectTopic(b.sourceTopic.id);
                onOpenNote(b.sourceTopic.id);
              }}
              className="px-2 py-1.5 rounded hover:bg-[#202024] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-1.5 truncate">
                <FileText className="w-3 h-3 text-zinc-500 shrink-0" />
                <span className="truncate text-zinc-200 text-[12px]">
                  {b.sourceTopic.title}
                </span>
              </div>
              <div className="text-[10px] text-zinc-500 pl-4 mt-0.5">
                {b.label}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
