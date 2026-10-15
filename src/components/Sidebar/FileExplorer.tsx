import React, { useState, useMemo, useEffect } from 'react';
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

import { NewFolderModal } from '../Modals/NewFolderModal';

interface FileExplorerProps {
  folders: FolderItem[];
  topics: TopicNode[];
  statuses: Record<string, LearningStatus>;
  topicVisits?: Record<string, number>;
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
  onOpenNote: (topicId: string) => void;
  onCreateNewNote: () => void;
  onCreateFolder?: (name: string, parentId?: string) => void;
  targetFolderId?: string | null;
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
  onCreateFolder,
  targetFolderId,
}) => {
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'functional-materials': true,
    '01-oxides': true,
    '02-polymers': false,
    '03-conducting-polymers': false,
    '04-nanomaterials': false,
    '05-synthesis-nanomaterials': false,
    '06-oleds': false,
    'personal': true,
    'unsorted': true,
  });

  // Automatically expand targetFolderId and all its parent folders when requested
  useEffect(() => {
    if (!targetFolderId) return;

    setExpandedFolders(prev => {
      const next = { ...prev, [targetFolderId]: true };
      let cur = folders.find(f => f.id === targetFolderId);
      const visited = new Set<string>();
      while (cur?.parentId && !visited.has(cur.parentId)) {
        visited.add(cur.parentId);
        next[cur.parentId] = true;
        cur = folders.find(f => f.id === cur?.parentId);
      }
      return next;
    });
  }, [targetFolderId, folders]);

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

  // Group topics directly by their immediate folderId
  const directTopicsByFolder = useMemo(() => {
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

  // Group child folders by parentId
  const childFoldersMap = useMemo(() => {
    const map: Record<string, FolderItem[]> = {};
    folders.forEach(f => {
      if (f.parentId) {
        if (!map[f.parentId]) {
          map[f.parentId] = [];
        }
        map[f.parentId].push(f);
      }
    });

    // Sort children by order
    Object.keys(map).forEach(key => {
      map[key].sort((a, b) => a.order - b.order);
    });

    return map;
  }, [folders]);

  // Root folders (no parentId)
  const rootFolders = useMemo(() => {
    return folders
      .filter(f => !f.parentId)
      .sort((a, b) => a.order - b.order);
  }, [folders]);

  // Calculate total topic count per folder (direct topics + recursive child folder topics)
  const folderTotalCountMap = useMemo(() => {
    const counts: Record<string, number> = {};

    const getCount = (folderId: string): number => {
      if (counts[folderId] !== undefined) return counts[folderId];
      const directCount = (directTopicsByFolder[folderId] || []).length;
      const children = childFoldersMap[folderId] || [];
      const childrenCount = children.reduce((sum, child) => sum + getCount(child.id), 0);
      counts[folderId] = directCount + childrenCount;
      return counts[folderId];
    };

    folders.forEach(f => {
      getCount(f.id);
    });

    return counts;
  }, [folders, directTopicsByFolder, childFoldersMap]);

  const getStatusDot = (topicId: string) => {
    const status = statuses[topicId];
    if (status === 'needs_revision') {
      return <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 border border-zinc-500 shrink-0" title="Needs revision" />;
    }
    if (status === 'learned') {
      return <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 shrink-0" title="Learned" />;
    }
    if (status === 'learning') {
      return <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-500 shrink-0" title="Learning" />;
    }
    return null;
  };

  // Recursive renderer for hierarchical folders
  const renderFolder = (folder: FolderItem, level: number = 0): React.ReactNode => {
    const isExpanded = !!expandedFolders[folder.id];
    const directTopics = directTopicsByFolder[folder.id] || [];
    const children = childFoldersMap[folder.id] || [];
    const totalCount = folderTotalCountMap[folder.id] || 0;

    // When filtering, hide if subtree contains no matching topics
    if (filterText.trim() && totalCount === 0) {
      return null;
    }

    return (
      <div key={folder.id} className="space-y-0.5">
        {/* Folder Header Row */}
        <div
          onClick={() => toggleFolder(folder.id)}
          className={`flex items-center gap-1.5 px-1.5 py-1 rounded cursor-pointer transition-colors ${
            folder.id === targetFolderId
              ? 'bg-[#25252b] text-zinc-100 ring-1 ring-zinc-500/40'
              : 'hover:bg-[#202024] text-zinc-300'
          }`}
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3 text-zinc-500 shrink-0" />
          ) : (
            <ChevronRight className="w-3 h-3 text-zinc-500 shrink-0" />
          )}

          {isExpanded ? (
            <FolderOpen className={`w-3.5 h-3.5 shrink-0 ${level === 0 ? 'text-zinc-200' : 'text-zinc-400'}`} />
          ) : (
            <Folder className={`w-3.5 h-3.5 shrink-0 ${level === 0 ? 'text-zinc-300' : 'text-zinc-400'}`} />
          )}

          <span className={`truncate text-[12px] ${level === 0 ? 'font-medium text-zinc-200' : 'font-normal text-zinc-300'}`}>
            {folder.name}
          </span>

          <span className="ml-auto text-[10px] text-zinc-600 font-mono">
            {totalCount}
          </span>
        </div>

        {/* Folder Children (Nested subfolders first, then direct topics) */}
        {isExpanded && (
          <div className="ml-2.5 pl-1.5 border-l border-[#232326] space-y-0.5">
            {/* 1. Subfolders */}
            {children.map(child => renderFolder(child, level + 1))}

            {/* 2. Direct Topics */}
            {directTopics.map(topic => {
              const isSelected = topic.id === selectedTopicId;
              const visits = topicVisits[topic.id] || 0;
              return (
                <div
                  key={topic.id}
                  onClick={() => {
                    onSelectTopic(topic.id);
                    onOpenNote(topic.id);
                  }}
                  className={`group flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#222226] text-white font-medium border border-zinc-700/60 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#1e1e22]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`} />
                    <span className="truncate text-[12px]">
                      {topic.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {visits > 0 && (
                      <span 
                        className={`text-[10px] font-mono ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`} 
                        title={`You have visited this topic ${visits} ${visits === 1 ? 'time' : 'times'}`}
                      >
                        {visits}×
                      </span>
                    )}
                    {getStatusDot(topic.id)}
                  </div>
                </div>
              );
            })}

            {children.length === 0 && directTopics.length === 0 && (
              <div className="px-2 py-0.5 text-[11px] text-zinc-600 italic">
                Empty folder
              </div>
            )}
          </div>
        )}
      </div>
    );
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
            onClick={() => setIsNewFolderModalOpen(true)}
            className="p-1 hover:text-zinc-100 hover:bg-[#232328] rounded transition-colors"
            title="New folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
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

      {/* Hierarchical File Tree */}
      <div className="flex-1 overflow-y-auto px-1 py-1 space-y-0.5">
        {rootFolders.map(root => renderFolder(root, 0))}
      </div>

      {/* New Folder Modal */}
      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
        folders={folders}
        onCreateFolder={onCreateFolder || (() => {})}
      />
    </div>
  );
};
