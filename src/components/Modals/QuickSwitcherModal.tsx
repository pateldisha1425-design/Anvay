import React, { useState, useEffect, useRef } from 'react';
import { TopicNode, LearningStatus } from '../../types/knowledge';
import { Search, CornerDownLeft } from 'lucide-react';

interface QuickSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: TopicNode[];
  statuses: Record<string, LearningStatus>;
  topicVisits?: Record<string, number>;
  onSelectTopic: (topicId: string) => void;
  onOpenNote: (topicId: string) => void;
}

export const QuickSwitcherModal: React.FC<QuickSwitcherModalProps> = ({
  isOpen,
  onClose,
  topics,
  statuses,
  topicVisits = {},
  onSelectTopic,
  onOpenNote,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredTopics = topics.filter(t => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  }).slice(0, 10);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredTopics.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredTopics.length) % Math.max(1, filteredTopics.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = filteredTopics[selectedIndex];
      if (chosen) {
        onSelectTopic(chosen.id);
        onOpenNote(chosen.id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/75 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#1c1c1f] border border-[#2e2e34] rounded-lg shadow-2xl overflow-hidden text-zinc-300 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center px-3.5 py-2.5 border-b border-[#28282e] bg-[#18181b]">
          <Search className="w-4 h-4 text-zinc-400 shrink-0 mr-2.5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a concept name or folder to jump..."
            className="w-full bg-transparent text-[13px] text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-[#25252a] text-[10px] text-zinc-400 font-mono border border-[#303038]">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
          {filteredTopics.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 italic text-xs">
              No matching concepts found
            </div>
          ) : (
            filteredTopics.map((topic, idx) => {
              const isSelected = idx === selectedIndex;
              const status = statuses[topic.id];

              return (
                <div
                  key={topic.id}
                  onClick={() => {
                    onSelectTopic(topic.id);
                    onOpenNote(topic.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-1.5 rounded cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#252c3d] text-blue-300'
                      : 'hover:bg-[#202024] text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate max-w-[380px]">
                    {status === 'needs_revision' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    )}
                    <div className="truncate">
                      <div className="font-normal text-zinc-100 text-[12px] truncate">
                        {topic.title}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate">
                        {topic.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-zinc-500">
                    {topicVisits[topic.id] > 0 && (
                      <span 
                        className="text-[10px] text-zinc-500 font-mono" 
                        title={`Visited ${topicVisits[topic.id]} times`}
                      >
                        {topicVisits[topic.id]}×
                      </span>
                    )}
                    {isSelected && (
                      <CornerDownLeft className="w-3 h-3 text-blue-400" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-3.5 py-1.5 border-t border-[#26262a] bg-[#161618] text-[10px] text-zinc-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><strong className="text-zinc-400">↑↓</strong> navigate</span>
            <span><strong className="text-zinc-400">↵</strong> open</span>
          </div>
          <span>Anvay Quick Switcher</span>
        </div>
      </div>
    </div>
  );
};
