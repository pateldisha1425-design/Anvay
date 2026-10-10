import React, { useState, useMemo } from 'react';
import { TopicNode, LearningStatus } from '../../types/knowledge';
import { Search, FileText, X } from 'lucide-react';

interface SearchPanelProps {
  topics: TopicNode[];
  statuses: Record<string, LearningStatus>;
  topicVisits?: Record<string, number>;
  onSelectTopic: (topicId: string) => void;
  onOpenNote: (topicId: string) => void;
  onFocusInGraph: (topicId: string) => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  topics,
  statuses,
  topicVisits = {},
  onSelectTopic,
  onOpenNote,
  onFocusInGraph,
}) => {
  const [query, setQuery] = useState('');
  const [filterNeedsRevision, setFilterNeedsRevision] = useState(false);

  const results = useMemo(() => {
    if (!query.trim() && !filterNeedsRevision) {
      return topics;
    }

    const q = query.toLowerCase().trim();

    return topics.filter(t => {
      const status = statuses[t.id] || 'not_studied';
      if (filterNeedsRevision && status !== 'needs_revision') return false;
      if (!q) return true;

      const titleMatch = t.title.toLowerCase().includes(q);
      const descMatch = t.description.toLowerCase().includes(q);
      const contentMatch = t.content.toLowerCase().includes(q);
      const catMatch = t.category.toLowerCase().includes(q);

      return titleMatch || descMatch || contentMatch || catMatch;
    });
  }, [topics, query, statuses, filterNeedsRevision]);

  return (
    <div className="flex flex-col h-full bg-[#18181a] select-none text-zinc-300 text-xs">
      {/* Header */}
      <div className="px-3 py-1.5 border-b border-[#232326] bg-[#161618] flex items-center justify-between">
        <span className="font-semibold text-[11px] uppercase tracking-wider text-zinc-400">
          Search
        </span>
        <button
          onClick={() => setFilterNeedsRevision(!filterNeedsRevision)}
          className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
            filterNeedsRevision 
              ? 'bg-[#3b2a1a] text-amber-300 font-medium' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
          title="Filter concepts needing revision"
        >
          {filterNeedsRevision ? 'Needs revision (Active)' : 'Needs revision'}
        </button>
      </div>

      {/* Input */}
      <div className="p-2 border-b border-[#232326]">
        <div className="relative flex items-center">
          <Search className="w-3 h-3 absolute left-2 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes and content..."
            className="w-full bg-[#131315] border border-[#26262a] text-zinc-200 text-[11px] pl-6 pr-6 py-1 rounded focus:outline-none focus:border-zinc-500 placeholder-zinc-600"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-1.5 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-1 py-1 space-y-0.5">
        <div className="px-2 py-1 text-[10px] text-zinc-500 font-mono">
          {results.length} notes matched
        </div>

        {results.map(topic => {
          const status = statuses[topic.id];
          const visits = topicVisits[topic.id] || 0;
          return (
            <div
              key={topic.id}
              onClick={() => {
                onSelectTopic(topic.id);
                onOpenNote(topic.id);
              }}
              className="px-2 py-1.5 rounded hover:bg-[#202024] cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <FileText className="w-3 h-3 text-zinc-500 shrink-0" />
                  <span className="truncate text-zinc-200 text-[12px]">
                    {topic.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  {visits > 0 && (
                    <span 
                      className="text-[10px] text-zinc-500 font-mono"
                      title={`You have visited this topic ${visits} ${visits === 1 ? 'time' : 'times'}`}
                    >
                      {visits}×
                    </span>
                  )}
                  {status === 'needs_revision' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  )}
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5 pl-4">
                {topic.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
