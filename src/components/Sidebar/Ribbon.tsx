import React from 'react';
import { 
  FolderTree, 
  Search, 
  Network, 
  Link2, 
  Terminal, 
  Settings, 
  PlusSquare,
  FileText,
  ShieldAlert,
  GraduationCap,
  ClipboardCheck as MessageSquareCheck,
  Languages,
  Calculator
} from 'lucide-react';

export type RibbonPanelType = 'files' | 'search' | 'backlinks' | 'gaps' | 'progress' | 'immersion';

interface RibbonProps {
  activePanel: RibbonPanelType;
  isLeftSidebarOpen: boolean;
  onSelectPanel: (panel: RibbonPanelType) => void;
  onOpenGraph: () => void;
  onOpenReviewDashboard?: () => void;
  onOpenGateDashboard?: () => void;
  onOpenCommandPalette: () => void;
  onOpenQuickSwitcher?: () => void;
  onCreateNewNote: () => void;
  onOpenSettings: () => void;
}

export const Ribbon: React.FC<RibbonProps> = ({
  activePanel,
  isLeftSidebarOpen,
  onSelectPanel,
  onOpenGraph,
  onOpenReviewDashboard,
  onOpenGateDashboard,
  onOpenCommandPalette,
  onOpenQuickSwitcher,
  onCreateNewNote,
  onOpenSettings,
}) => {
  return (
    <div className="w-10 sm:w-11 h-full bg-[#141416] border-r border-[#232326] flex flex-col justify-between py-2 items-center select-none shrink-0 z-20">
      {/* Top action icons */}
      <div className="flex flex-col items-center space-y-1 w-full">
        {/* Files Explorer */}
        <button
          onClick={() => onSelectPanel('files')}
          className={`relative p-2 rounded-md transition-colors ${
            isLeftSidebarOpen && activePanel === 'files'
              ? 'text-blue-400 bg-[#1e1e22]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1d]'
          }`}
          title="Files (Explorer)"
        >
          <FolderTree className="w-4 h-4" />
          {isLeftSidebarOpen && activePanel === 'files' && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-500 rounded-r" />
          )}
        </button>

        {/* Search */}
        <button
          onClick={() => onSelectPanel('search')}
          className={`relative p-2 rounded-md transition-colors ${
            isLeftSidebarOpen && activePanel === 'search'
              ? 'text-blue-400 bg-[#1e1e22]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1d]'
          }`}
          title="Search in all notes"
        >
          <Search className="w-4 h-4" />
          {isLeftSidebarOpen && activePanel === 'search' && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-500 rounded-r" />
          )}
        </button>

        {/* Graph View */}
        <button
          onClick={onOpenGraph}
          className="p-2 rounded-md text-zinc-400 hover:text-blue-400 hover:bg-[#1a1a1d] transition-colors"
          title="Open Graph View"
        >
          <Network className="w-4 h-4" />
        </button>

        {/* Backlinks */}
        <button
          onClick={() => onSelectPanel('backlinks')}
          className={`relative p-2 rounded-md transition-colors ${
            isLeftSidebarOpen && activePanel === 'backlinks'
              ? 'text-blue-400 bg-[#1e1e22]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1d]'
          }`}
          title="Backlinks"
        >
          <Link2 className="w-4 h-4" />
          {isLeftSidebarOpen && activePanel === 'backlinks' && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-500 rounded-r" />
          )}
        </button>

        <div className="w-5 h-px bg-[#232326] my-1" />

        {/* Prerequisite Gap Finder */}
        <button
          onClick={() => onSelectPanel('gaps')}
          className={`relative p-2 rounded-md transition-colors ${
            isLeftSidebarOpen && activePanel === 'gaps'
              ? 'text-amber-400 bg-[#1e1e22]'
              : 'text-zinc-400 hover:text-amber-300 hover:bg-[#1a1a1d]'
          }`}
          title="Prerequisite Gap Finder & Rule-Based Diagnostics"
        >
          <ShieldAlert className="w-4 h-4" />
          {isLeftSidebarOpen && activePanel === 'gaps' && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-amber-500 rounded-r" />
          )}
        </button>

        {/* Mastery Progress Tracker */}
        <button
          onClick={() => onSelectPanel('progress')}
          className={`relative p-2 rounded-md transition-colors ${
            isLeftSidebarOpen && activePanel === 'progress'
              ? 'text-emerald-400 bg-[#1e1e22]'
              : 'text-zinc-400 hover:text-emerald-300 hover:bg-[#1a1a1d]'
          }`}
          title="Syllabus Progress & Mastery Quizzes"
        >
          <GraduationCap className="w-4 h-4" />
          {isLeftSidebarOpen && activePanel === 'progress' && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-emerald-500 rounded-r" />
          )}
        </button>

        {/* Marathi Language Immersion */}
        <button
          onClick={() => onSelectPanel('immersion')}
          className={`relative p-2 rounded-md transition-colors ${
            isLeftSidebarOpen && activePanel === 'immersion'
              ? 'text-orange-400 bg-[#1e1e22]'
              : 'text-zinc-400 hover:text-orange-300 hover:bg-[#1a1a1d]'
          }`}
          title="Marathi Language Immersion & Technical Vocabulary"
        >
          <Languages className="w-4 h-4" />
          {isLeftSidebarOpen && activePanel === 'immersion' && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-orange-500 rounded-r" />
          )}
        </button>

        {/* Academic & Formula Reference Hub */}
        {onOpenGateDashboard && (
          <button
            onClick={onOpenGateDashboard}
            className="p-2 rounded-md text-zinc-400 hover:text-purple-400 hover:bg-[#1a1a1d] transition-colors"
            title="Formula Reference & Numerical Solver Hub"
          >
            <Calculator className="w-4 h-4" />
          </button>
        )}

        {/* Academic Review & Feedback Dashboard */}
        {onOpenReviewDashboard && (
          <button
            onClick={onOpenReviewDashboard}
            className="p-2 rounded-md text-zinc-400 hover:text-blue-400 hover:bg-[#1a1a1d] transition-colors"
            title="Academic Review & Feedback Dashboard"
          >
            <MessageSquareCheck className="w-4 h-4" />
          </button>
        )}

        <div className="w-5 h-px bg-[#232326] my-1" />

        {/* Create Note */}
        <button
          onClick={onCreateNewNote}
          className="p-2 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1d] transition-colors"
          title="Create new note"
        >
          <PlusSquare className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom utility icons */}
      <div className="flex flex-col items-center space-y-1 w-full">
        {/* Command Palette */}
        <button
          onClick={onOpenCommandPalette}
          className="p-2 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1d] transition-colors"
          title="Command Palette (Ctrl+P / ⌘P)"
        >
          <Terminal className="w-4 h-4" />
        </button>

        {/* Settings / Reset Demo */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1d] transition-colors"
          title="Preferences & Reset Demonstration"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
