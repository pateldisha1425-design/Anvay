import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Network, 
  Search, 
  FilePlus, 
  BookOpen, 
  PanelLeft, 
  PanelRight, 
  RotateCcw,
  CornerDownLeft,
  ShieldAlert,
  GraduationCap,
  ClipboardCheck as MessageSquareCheck
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGraph: () => void;
  onOpenReviewDashboard?: () => void;
  onOpenQuickSwitcher: () => void;
  onCreateNewNote: () => void;
  onToggleReadEditMode: () => void;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  onOpenGapsPanel?: () => void;
  onOpenProgressPanel?: () => void;
  onHighlightGapsInGraph?: () => void;
  onResetDemo: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onOpenGraph,
  onOpenReviewDashboard,
  onOpenQuickSwitcher,
  onCreateNewNote,
  onToggleReadEditMode,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  onOpenGapsPanel,
  onOpenProgressPanel,
  onHighlightGapsInGraph,
  onResetDemo,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const commands: CommandItem[] = [
    {
      id: 'open-graph',
      title: 'Graph view: Open interactive knowledge graph',
      category: 'Workspace',
      icon: <Network className="w-3.5 h-3.5 text-blue-400" />,
      action: onOpenGraph,
    },
    ...(onOpenReviewDashboard ? [{
      id: 'open-review-dashboard',
      title: 'Review: Open Academic Review & Feedback Dashboard',
      category: 'Review',
      icon: <MessageSquareCheck className="w-3.5 h-3.5 text-blue-400" />,
      action: onOpenReviewDashboard,
    }] : []),
    ...(onHighlightGapsInGraph ? [{
      id: 'highlight-gaps',
      title: 'Graph view: Highlight missing prerequisite gaps',
      category: 'Diagnostics',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />,
      action: onHighlightGapsInGraph,
    }] : []),
    ...(onOpenGapsPanel ? [{
      id: 'open-gaps',
      title: 'Diagnostics: Open Prerequisite Gap Finder panel',
      category: 'Diagnostics',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />,
      action: onOpenGapsPanel,
    }] : []),
    ...(onOpenProgressPanel ? [{
      id: 'open-progress',
      title: 'Progress: Open Mastery & Syllabus Progress tracker',
      category: 'Mastery',
      icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />,
      action: onOpenProgressPanel,
    }] : []),
    {
      id: 'quick-switcher',
      title: 'Quick switcher: Open note...',
      category: 'Navigation',
      icon: <Search className="w-3.5 h-3.5 text-zinc-400" />,
      action: onOpenQuickSwitcher,
      shortcut: 'Ctrl+O',
    },
    {
      id: 'create-note',
      title: 'Note: Create new personal note',
      category: 'Notes',
      icon: <FilePlus className="w-3.5 h-3.5 text-zinc-400" />,
      action: onCreateNewNote,
    },
    {
      id: 'toggle-view',
      title: 'View: Toggle Reading / Editing view',
      category: 'Editor',
      icon: <BookOpen className="w-3.5 h-3.5 text-zinc-400" />,
      action: onToggleReadEditMode,
    },
    {
      id: 'toggle-left',
      title: 'Workspace: Toggle left sidebar',
      category: 'Window',
      icon: <PanelLeft className="w-3.5 h-3.5 text-zinc-400" />,
      action: onToggleLeftSidebar,
    },
    {
      id: 'toggle-right',
      title: 'Workspace: Toggle right inspector panel',
      category: 'Window',
      icon: <PanelRight className="w-3.5 h-3.5 text-zinc-400" />,
      action: onToggleRightSidebar,
    },
    {
      id: 'reset-demo',
      title: 'System: Reset demonstration syllabus progress',
      category: 'System',
      icon: <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />,
      action: onResetDemo,
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCommands = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = filteredCommands[selectedIndex];
      if (chosen) {
        chosen.action();
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
        {/* Command Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-[#28282e] bg-[#18181b]">
          <Terminal className="w-4 h-4 text-zinc-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-[#25252a] text-[10px] text-zinc-400 font-mono border border-[#303038]">
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 italic text-xs">
              No matching commands
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#252c3d] text-blue-300'
                      : 'hover:bg-[#222226] text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {cmd.icon}
                    <span className="font-normal text-xs text-zinc-200 truncate">
                      {cmd.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded bg-[#25252a] text-[10px] text-zinc-400 font-mono border border-[#303038]">
                        {cmd.shortcut}
                      </kbd>
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

        <div className="px-4 py-2 border-t border-[#26262a] bg-[#161618] text-[10px] text-zinc-500 flex items-center justify-between">
          <span>Anvay Command Palette</span>
          <span><strong className="text-zinc-400">↑↓</strong> to navigate • <strong className="text-zinc-400">↵</strong> to run</span>
        </div>
      </div>
    </div>
  );
};
