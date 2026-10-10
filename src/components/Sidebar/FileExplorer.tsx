import React, { useState, useMemo } from 'react';
import { TopicNode, FolderItem, LearningStatus } from '../../types/knowledge';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  FilePlus, 
  FolderPlus,
  ChevronsDownUp,
  Search,
  X
} from 'lucide-react';

interface FileExplorerProps {
  folders: FolderItem[];
  topics: TopicNode[];
  statuses: Record<string, LearningStatus>;
  topicVisits?: Record<string, number>;
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
  onOpenNote: (topicId: string) => void;
  onCreateNewNote: () => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  folders,
  topics,
  statuses,
  topicVisits = {},
  selectedTopicId,
  onSelectTopic,
  onOpenNote,
  onCreateNewNote,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    '01-oxides': true,
    '02-polymers': false,
    '03-conducting-polymers': false,
    '04-nanomaterials': false,
    '05-synthesis-nanomaterials': false,
    '06-oleds': false,
    'personal': true,
    'unsorted': true,
  });

  const [filterText, setFilterText] = useState('');

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const collapseAllFolders = () => {
    const next: Record<string, boolean> = {};
    folders.forEach(f => {
      next[f.id] = false;
    });
    setExpandedFolders(next);
  };

  const expandAllFolders = () => {
    const next: Record<string, boolean> = {};
    folders.forEach(f => {
      next[f.id] = true;
    });
    setExpandedFolders(next);
  };

  // Group topics by folder
  const topicsByFolder = useMemo(() => {
    const map: Record<string, TopicNode[]> = {};
    folders.forEach(f => {
      map[f.id] = [];
    });

    topics.forEach(t => {
      if (filterText.trim()) {
        const q = filterText.toLowerCase();
        if (!t.title.toLowerCase().includes(q)) return;
      }

      if (!map[t.folderId]) {
        map[t.folderId] = [];
      }
      map[t.folderId].push(t);
    });

    return map;
  }, [folders, topics, filterText]);

  const getStatusDot = (topicId: string) => {
    const status = statuses[topicId];
    if (status === 'needs_revision') {
      return <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" title="Needs revision" />;
    }
    if (status === 'learned') {
      return <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shrink-0" title="Learned" />;
    }
    if (status === 'learning') {
      return <span className="w-1.5 h-1.5 rounded-full bg-blue-400/80 shrink-0" title="Learning" />;
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-[#18181a] select-none text-zinc-300 text-xs">
      {/* Explorer Header Action Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#232326] bg-[#161618]">
        <span className="font-semibold text-[11px] uppercase tracking-wider text-zinc-400">
          Files
        </span>

        <div className="flex items-center space-x-1 text-zinc-400">
          <button
            onClick={onCreateNewNote}
            className="p-1 hover:text-zinc-100 hover:bg-[#232328] rounded transition-colors"
            title="New note"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={collapseAllFolders}
            className="p-1 hover:text-zinc-100 hover:bg-[#232328] rounded transition-colors"
            title="Collapse all folders"
          >
            <ChevronsDownUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Filter Input */}
      <div className="px-2 py-1.5 border-b border-[#232326]">
        <div className="relative flex items-center">
          <Search className="w-3 h-3 absolute left-2 text-zinc-500" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter notes..."
            className="w-full bg-[#131315] border border-[#26262a] text-zinc-200 text-[11px] pl-6 pr-6 py-1 rounded focus:outline-none focus:border-zinc-500 placeholder-zinc-600"
          />
          {filterText && (
            <button
              onClick={() => setFilterText('')}
              className="absolute right-1.5 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Compact File Tree */}
      <div className="flex-1 overflow-y-auto px-1 py-1 space-y-0.5">
        {folders.map(folder => {
          const isExpanded = !!expandedFolders[folder.id];
          const folderTopics = topicsByFolder[folder.id] || [];

          // If filtering and folder is empty, hide folder
          if (filterText.trim() && folderTopics.length === 0) {
            return null;
          }

          return (
            <div key={folder.id} className="space-y-0.5">
              {/* Folder Row */}
              <div
                onClick={() => toggleFolder(folder.id)}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-[#202024] cursor-pointer text-zinc-300 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-zinc-500 shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-zinc-500 shrink-0" />
                )}
                {isExpanded ? (
                  <FolderOpen className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                ) : (
                  <Folder className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                )}
                <span className="truncate text-[12px] font-normal text-zinc-300">
                  {folder.name}
                </span>
                <span className="ml-auto text-[10px] text-zinc-600 font-mono">
                  {folderTopics.length}
                </span>
              </div>

              {/* Sub-items (Notes) */}
              {isExpanded && (
                <div className="ml-3 pl-1.5 border-l border-[#232326] space-y-0.5">
                  {folderTopics.length === 0 ? (
                    <div className="px-2 py-0.5 text-[11px] text-zinc-600 italic">
                      Empty folder
                    </div>
                  ) : (
                    folderTopics.map(topic => {
                      const isSelected = topic.id === selectedTopicId;
                      const visits = topicVisits[topic.id] || 0;
                      return (
                        <div
                          key={topic.id}
                          onClick={() => {
                            onSelectTopic(topic.id);
                            onOpenNote(topic.id);
                          }}
                          className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#262c3b] text-blue-300 font-medium'
                              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202023]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-400' : 'text-zinc-500'}`} />
                            <span className="truncate text-[12px]">
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
                            {getStatusDot(topic.id)}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
