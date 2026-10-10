import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  TopicNode, 
  RelationshipEdge, 
  FolderItem, 
  LearningStatus, 
  TabItem, 
  GraphFilterOptions 
} from './types/knowledge';
import { INITIAL_FOLDERS, INITIAL_TOPICS, INITIAL_EDGES } from './data/syllabusData';
import { 
  getStoredStatuses, 
  saveStoredStatus, 
  getStoredEditedContent, 
  saveStoredEditedContent, 
  getStoredCustomTopics, 
  saveStoredCustomTopic,
  getStoredTopicVisits,
  recordTopicVisit,
  getStoredQuizResults,
  saveStoredQuizResult,
  getStoredUserRatings,
  saveStoredUserRating,
  getStoredFeedbackReports,
  saveStoredFeedbackReport,
  updateStoredReportStatus,
  getStoredTopicReviews,
  updateStoredTopicReview,
  resetAllData 
} from './utils/storage';
import { QuizResult } from './types/learning';
import { FeedbackReport, TopicReviewMeta, ReportStatus, TopicRating } from './types/feedback';
import { FeedbackModal } from './components/Feedback/FeedbackModal';
import { diagnoseAllSyllabusTopics } from './utils/gapFinder';
import { Ribbon, RibbonPanelType } from './components/Sidebar/Ribbon';
import { FileExplorer } from './components/Sidebar/FileExplorer';
import { SearchPanel } from './components/Sidebar/SearchPanel';
import { BacklinksPanel } from './components/Sidebar/BacklinksPanel';
import { PrerequisiteGapPanel } from './components/Prerequisite/PrerequisiteGapPanel';
import { ProgressTrackingPanel } from './components/Progress/ProgressTrackingPanel';
import { NoteWorkspace } from './components/Note/NoteWorkspace';
import { TopicDetailsPanel } from './components/RightPanel/TopicDetailsPanel';
import { StatusBar } from './components/StatusBar/StatusBar';
import { NewNoteModal } from './components/Modals/NewNoteModal';
import { QuickSwitcherModal } from './components/Modals/QuickSwitcherModal';
import { CommandPaletteModal } from './components/Modals/CommandPaletteModal';
import { 
  PanelLeft, 
  PanelRight, 
  Search,
  Terminal,
  RotateCcw,
  Cloud,
  CloudCheck,
  User as UserIcon,
  LogIn,
  LogOut
} from 'lucide-react';
import { auth, loginWithGoogle, logoutUser, User, onAuthStateChanged } from './lib/firebase';
import { 
  syncTopicStateToCloud, 
  syncCustomNoteToCloud, 
  subscribeToUserCloudData,
  syncRatingToCloud,
  syncFeedbackReportToCloud,
  updateReportStatusInCloud,
  syncTopicReviewMetaToCloud,
  subscribeToSharedFeedback
} from './lib/syncService';

export default function App() {
  // Authentication & Cloud Sync
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Topics & Custom Topics
  const [customTopics, setCustomTopics] = useState<TopicNode[]>(() => getStoredCustomTopics());
  const [editedContents, setEditedContents] = useState<Record<string, string>>(() => getStoredEditedContent());
  const [statuses, setStatuses] = useState<Record<string, LearningStatus>>(() => getStoredStatuses());
  const [topicVisits, setTopicVisits] = useState<Record<string, number>>(() => getStoredTopicVisits());
  const [quizResults, setQuizResults] = useState<Record<string, QuizResult>>(() => getStoredQuizResults());

  // Topic Ratings, Feedback Reports & Review Metadata
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => getStoredUserRatings());
  const [feedbackReports, setFeedbackReports] = useState<FeedbackReport[]>(() => getStoredFeedbackReports());
  const [topicReviews, setTopicReviews] = useState<Record<string, TopicReviewMeta>>(() => getStoredTopicReviews());
  const [feedbackModalTopicId, setFeedbackModalTopicId] = useState<string | null>(null);

  // Listen to Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // Real-time subscription to shared Feedback Reports and Topic Reviews (Firestore)
  useEffect(() => {
    const unsubShared = subscribeToSharedFeedback(
      (cloudReports) => {
        setFeedbackReports(prev => {
          const map = new Map<string, FeedbackReport>();
          prev.forEach(r => map.set(r.id, r));
          cloudReports.forEach(r => map.set(r.id, r));
          return Array.from(map.values());
        });
      },
      (cloudReviews) => {
        setTopicReviews(prev => ({
          ...prev,
          ...cloudReviews
        }));
      }
    );
    return () => unsubShared();
  }, []);

  // Multi-tab storage synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'anvay_user_ratings_v1') {
        setUserRatings(getStoredUserRatings());
      } else if (e.key === 'anvay_feedback_reports_v1') {
        setFeedbackReports(getStoredFeedbackReports());
      } else if (e.key === 'anvay_topic_reviews_v1') {
        setTopicReviews(getStoredTopicReviews());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync with Firestore when user is logged in
  useEffect(() => {
    if (!user) return;

    const unsubCloud = subscribeToUserCloudData(
      user.uid,
      (cloudTopicStates) => {
        // Merge cloud states into local statuses and visits
        setStatuses(prev => {
          const next = { ...prev };
          Object.entries(cloudTopicStates).forEach(([topicId, data]) => {
            if (data.status) next[topicId] = data.status;
          });
          return next;
        });

        setTopicVisits(prev => {
          const next = { ...prev };
          Object.entries(cloudTopicStates).forEach(([topicId, data]) => {
            if (data.visitCount !== undefined) {
              next[topicId] = Math.max(next[topicId] || 0, data.visitCount);
            }
          });
          return next;
        });
      },
      (cloudNotes) => {
        if (cloudNotes.length > 0) {
          setCustomTopics(prev => {
            const map = new Map<string, TopicNode>();
            prev.forEach(n => map.set(n.id, n));
            cloudNotes.forEach(n => map.set(n.id, n));
            return Array.from(map.values());
          });
        }
      }
    );

    return () => unsubCloud();
  }, [user]);

  const trackVisit = useCallback((topicId: string) => {
    setTopicVisits(prev => {
      const updated = recordTopicVisit(topicId);
      const newCount = updated[topicId] || (prev[topicId] || 0) + 1;
      
      // If user is logged in, sync to Firestore
      if (user) {
        const curStatus = statuses[topicId] || 'not_studied';
        syncTopicStateToCloud(user.uid, topicId, curStatus, newCount).catch(() => {});
      }
      return { ...prev, ...updated };
    });
  }, [user, statuses]);

  // Merge base topics with custom notes and edits
  const allTopics = useMemo(() => {
    const baseList = INITIAL_TOPICS.map(topic => {
      if (editedContents[topic.id]) {
        return { ...topic, content: editedContents[topic.id] };
      }
      return topic;
    });

    const customList = customTopics.map(topic => {
      if (editedContents[topic.id]) {
        return { ...topic, content: editedContents[topic.id] };
      }
      return topic;
    });

    return [...baseList, ...customList];
  }, [customTopics, editedContents]);

  const [allEdges] = useState<RelationshipEdge[]>(INITIAL_EDGES);

  // Layout Panels
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [activeRibbonPanel, setActiveRibbonPanel] = useState<RibbonPanelType>('files');

  // Full Syllabus Prerequisite Audit
  const fullSyllabusAudit = useMemo(() => {
    return diagnoseAllSyllabusTopics(allTopics, allEdges, statuses, quizResults);
  }, [allTopics, allEdges, statuses, quizResults]);

  // Quiz completion callback
  const handleQuizCompleted = useCallback((topicId: string, result: QuizResult) => {
    setQuizResults(prev => ({
      ...prev,
      [topicId]: result
    }));
  }, []);

  // Navigation History
  const [history, setHistory] = useState<string[]>(['graph-view']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Workspace Tabs
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>('oxides-definition');
  const [openTabs, setOpenTabs] = useState<TabItem[]>([
    { id: 'oxides-definition', title: 'Definition of Oxides', type: 'note' }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('graph-view');
  const [tabModes, setTabModes] = useState<Record<string, 'read' | 'edit'>>({});

  // Modals
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [isQuickSwitcherOpen, setIsQuickSwitcherOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Graph Filters
  const [graphFilters, setGraphFilters] = useState<GraphFilterOptions>({
    selectedFolder: 'all',
    selectedStatus: 'all',
    selectedRelationType: 'all',
    searchQuery: '',
    highlightMode: 'all',
  });

  // Push tab to history
  const pushToHistory = useCallback((tabId: string) => {
    setHistory(prev => {
      const sliced = prev.slice(0, historyIndex + 1);
      if (sliced[sliced.length - 1] === tabId) return prev;
      return [...sliced, tabId];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Navigate Back
  const handleNavigateBack = useCallback(() => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const targetTabId = history[nextIndex];
      setHistoryIndex(nextIndex);
      setActiveTabId(targetTabId);
      if (targetTabId !== 'graph-view') {
        setSelectedTopicId(targetTabId);
        trackVisit(targetTabId);
      }
    }
  }, [history, historyIndex, trackVisit]);

  // Navigate Forward
  const handleNavigateForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const targetTabId = history[nextIndex];
      setHistoryIndex(nextIndex);
      setActiveTabId(targetTabId);
      if (targetTabId !== 'graph-view') {
        setSelectedTopicId(targetTabId);
        trackVisit(targetTabId);
      }
    }
  }, [history, historyIndex, trackVisit]);

  // Open note tab (activates existing if already open, never duplicates)
  const handleOpenNoteTab = useCallback((topicId: string) => {
    const topic = allTopics.find(t => t.id === topicId);
    if (!topic) return;

    setOpenTabs(prev => {
      const existing = prev.find(t => t.id === topicId);
      if (existing) return prev;
      return [...prev, { id: topicId, title: topic.title, type: 'note' }];
    });

    setActiveTabId(topicId);
    setSelectedTopicId(topicId);
    trackVisit(topicId);
    pushToHistory(topicId);
  }, [allTopics, pushToHistory, trackVisit]);

  // Select tab
  const handleSelectTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
    if (tabId !== 'graph-view') {
      setSelectedTopicId(tabId);
      trackVisit(tabId);
    }
    pushToHistory(tabId);
  }, [pushToHistory, trackVisit]);

  // Close tab
  const handleCloseTab = useCallback((tabId: string) => {
    setOpenTabs(prev => {
      const remaining = prev.filter(t => t.id !== tabId);
      if (activeTabId === tabId) {
        if (remaining.length > 0) {
          const nextActive = remaining[remaining.length - 1];
          setActiveTabId(nextActive.id);
          setSelectedTopicId(nextActive.id);
        } else {
          setActiveTabId('graph-view');
        }
      }
      return remaining;
    });
  }, [activeTabId]);

  // Open graph tab
  const handleOpenGraphTab = useCallback(() => {
    setActiveTabId('graph-view');
    pushToHistory('graph-view');
  }, [pushToHistory]);

  // Focus topic in graph
  const handleFocusTopicInGraph = useCallback((topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveTabId('graph-view');
    pushToHistory('graph-view');
  }, [pushToHistory]);

  // Highlight gaps in graph
  const handleHighlightGapsInGraph = useCallback(() => {
    setActiveTabId('graph-view');
    pushToHistory('graph-view');
    setGraphFilters(prev => ({
      ...prev,
      highlightMode: 'gaps'
    }));
  }, [pushToHistory]);

  // Ribbon Panel selection
  const handleRibbonPanelSelect = (panel: RibbonPanelType) => {
    if (activeRibbonPanel === panel && leftSidebarOpen) {
      setLeftSidebarOpen(false);
    } else {
      setActiveRibbonPanel(panel);
      setLeftSidebarOpen(true);
    }
  };

  // Toggle Read/Edit mode
  const handleToggleTabMode = (tabId: string) => {
    setTabModes(prev => ({
      ...prev,
      [tabId]: prev[tabId] === 'edit' ? 'read' : 'edit'
    }));
  };

  // Keyboard shortcuts (Cmd+K / Ctrl+O for switcher, Cmd+P / Ctrl+P for command palette)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
        e.preventDefault();
        setIsQuickSwitcherOpen(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update status
  const handleUpdateStatus = useCallback((topicId: string, status: LearningStatus) => {
    setStatuses(prev => {
      const next = { ...prev, [topicId]: status };
      saveStoredStatus(topicId, status);
      return next;
    });

    if (user) {
      const curVisits = topicVisits[topicId] || 0;
      syncTopicStateToCloud(user.uid, topicId, status, curVisits).catch(() => {});
    }
  }, [user, topicVisits]);

  // Save note content
  const handleSaveNoteContent = useCallback((topicId: string, newContent: string) => {
    setEditedContents(prev => {
      const next = { ...prev, [topicId]: newContent };
      saveStoredEditedContent(topicId, newContent);
      return next;
    });

    if (user) {
      const topic = allTopics.find(t => t.id === topicId);
      if (topic) {
        syncCustomNoteToCloud(user.uid, { ...topic, content: newContent }).catch(() => {});
      }
    }
  }, [user, allTopics]);

  // Reset single note content
  const handleResetNoteToDefault = useCallback((topicId: string) => {
    const initial = INITIAL_TOPICS.find(t => t.id === topicId);
    if (initial) {
      handleSaveNoteContent(topicId, initial.content);
    }
  }, [handleSaveNoteContent]);

  // Create custom note
  const handleCreateCustomNote = useCallback((newTopic: TopicNode) => {
    setCustomTopics(prev => {
      const next = [...prev, newTopic];
      saveStoredCustomTopic(newTopic);
      return next;
    });
    if (user) {
      syncCustomNoteToCloud(user.uid, newTopic).catch(() => {});
    }
    setSelectedTopicId(newTopic.id);
    setOpenTabs(prev => {
      if (prev.some(t => t.id === newTopic.id)) return prev;
      return [...prev, { id: newTopic.id, title: newTopic.title, type: 'note' }];
    });
    setActiveTabId(newTopic.id);
    pushToHistory(newTopic.id);
  }, [user, pushToHistory]);

  // Reset all progress
  const handleResetAllProgress = useCallback(() => {
    if (window.confirm('Reset all demonstration progress and user notes to the initial syllabus state?')) {
      resetAllData();
      setStatuses({});
      setEditedContents({});
      setCustomTopics([]);
      setTopicVisits({});
      setQuizResults({});
      setOpenTabs([{ id: 'oxides-definition', title: 'Definition of Oxides', type: 'note' }]);
      setActiveTabId('graph-view');
      setSelectedTopicId('oxides-definition');
    }
  }, []);

  const selectedTopic = allTopics.find(t => t.id === selectedTopicId) || null;
  const currentTabMode = tabModes[activeTabId] || 'read';

  return (
    <div className="flex flex-col h-screen w-screen bg-[#161618] text-[#dcddde] overflow-hidden select-none">
      {/* Top Window Title Bar (Obsidian Desktop Window Frame) */}
      <header className="h-8 bg-[#121214] border-b border-[#232326] flex items-center justify-between px-2.5 shrink-0 z-30 text-[11px] text-zinc-400">
        {/* Left window branding */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className="p-1 hover:text-zinc-200 hover:bg-[#202024] rounded transition-colors"
            title={leftSidebarOpen ? 'Collapse left sidebar' : 'Expand left sidebar'}
          >
            <PanelLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-medium text-zinc-200 tracking-tight">
            Anvay
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-500 hidden sm:inline">
            Functional Materials — Second Brain
          </span>
        </div>

        {/* Center Quick Switcher trigger */}
        <div className="flex items-center">
          <button
            onClick={() => setIsQuickSwitcherOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#18181b] hover:bg-[#202024] border border-[#27272b] text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <Search className="w-3 h-3 text-zinc-500" />
            <span className="hidden md:inline">Quick Switcher</span>
            <kbd className="text-[10px] text-zinc-500 font-mono">Ctrl+O</kbd>
          </button>
        </div>

        {/* Right utility buttons & Cloud Auth */}
        <div className="flex items-center space-x-1.5">
          {/* Firebase Auth Google Sign-in */}
          <div className="relative">
            {user ? (
              <div className="flex items-center">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#18181b] hover:bg-[#202024] border border-[#27272b] text-xs text-zinc-300 transition-colors"
                  title="Firebase Auth & Cloud Sync"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-3.5 h-3.5 rounded-full" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white font-medium">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <span className="max-w-[70px] sm:max-w-[110px] truncate text-[11px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Firestore synced" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-7 mt-1 w-56 bg-[#1a1a1d] border border-[#2b2b30] rounded-md shadow-2xl p-2.5 z-50 text-xs">
                    <div className="pb-2 mb-2 border-b border-[#252528]">
                      <div className="font-medium text-zinc-200 text-xs truncate">
                        {user.displayName || 'Student'}
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-400">
                        <CloudCheck className="w-3 h-3" />
                        <span>Cloud Synced with Firestore</span>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        await logoutUser();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-1.5 text-zinc-400 hover:text-red-400 py-1 px-1.5 rounded hover:bg-[#232328] transition-colors text-[11px]"
                    >
                      <LogOut className="w-3 h-3" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={async () => {
                  await loginWithGoogle();
                }}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#18181b] hover:bg-[#202024] border border-[#27272b] text-xs text-zinc-300 hover:text-white transition-colors"
                title="Sign in with Google to sync notes and visit counts across devices"
              >
                <LogIn className="w-3 h-3 text-blue-400" />
                <span className="text-[11px]">Sign In</span>
              </button>
            )}
          </div>

          <div className="w-px h-3.5 bg-[#27272b]" />

          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-1 hover:text-zinc-200 hover:bg-[#202024] rounded transition-colors"
            title="Command Palette (Ctrl+P)"
          >
            <Terminal className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="p-1 hover:text-zinc-200 hover:bg-[#202024] rounded transition-colors"
            title={rightSidebarOpen ? 'Collapse inspector' : 'Expand inspector'}
          >
            <PanelRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* A. Far-Left Ribbon */}
        <Ribbon
          activePanel={activeRibbonPanel}
          isLeftSidebarOpen={leftSidebarOpen}
          onSelectPanel={handleRibbonPanelSelect}
          onOpenGraph={handleOpenGraphTab}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenQuickSwitcher={() => setIsQuickSwitcherOpen(true)}
          onCreateNewNote={() => setIsNewNoteModalOpen(true)}
          onOpenSettings={handleResetAllProgress}
        />

        {/* B. Left Navigation Panel (File Explorer / Search / Backlinks / Gaps / Progress) */}
        {leftSidebarOpen && (
          <aside className="w-60 sm:w-64 shrink-0 h-full overflow-hidden border-r border-[#232326] z-20 bg-[#18181a]">
            {activeRibbonPanel === 'files' && (
              <FileExplorer
                folders={INITIAL_FOLDERS}
                topics={allTopics}
                statuses={statuses}
                topicVisits={topicVisits}
                selectedTopicId={selectedTopicId}
                onSelectTopic={(id) => setSelectedTopicId(id)}
                onOpenNote={handleOpenNoteTab}
                onCreateNewNote={() => setIsNewNoteModalOpen(true)}
              />
            )}
            {activeRibbonPanel === 'search' && (
              <SearchPanel
                topics={allTopics}
                statuses={statuses}
                topicVisits={topicVisits}
                onSelectTopic={(id) => setSelectedTopicId(id)}
                onOpenNote={handleOpenNoteTab}
                onFocusInGraph={handleFocusTopicInGraph}
              />
            )}
            {activeRibbonPanel === 'backlinks' && (
              <BacklinksPanel
                selectedTopic={selectedTopic}
                allTopics={allTopics}
                edges={allEdges}
                statuses={statuses}
                onSelectTopic={(id) => setSelectedTopicId(id)}
                onOpenNote={handleOpenNoteTab}
              />
            )}
            {activeRibbonPanel === 'gaps' && (
              <PrerequisiteGapPanel
                selectedTopic={selectedTopic}
                allTopics={allTopics}
                edges={allEdges}
                statuses={statuses}
                quizResults={quizResults}
                onSelectTopic={(id) => {
                  setSelectedTopicId(id);
                  trackVisit(id);
                }}
                onOpenNote={handleOpenNoteTab}
                onHighlightGapsInGraph={handleHighlightGapsInGraph}
              />
            )}
            {activeRibbonPanel === 'progress' && (
              <ProgressTrackingPanel
                topics={allTopics}
                folders={INITIAL_FOLDERS}
                statuses={statuses}
                topicVisits={topicVisits}
                quizResults={quizResults}
                totalGapsDetected={fullSyllabusAudit.allGaps.length}
                onSelectTopic={(id) => {
                  setSelectedTopicId(id);
                  trackVisit(id);
                }}
                onOpenNote={handleOpenNoteTab}
              />
            )}
          </aside>
        )}

        {/* C & D. Central Workspace (Tab Bar & Canvas) */}
        <main className="flex-1 h-full min-w-0 overflow-hidden">
          <NoteWorkspace
            openTabs={openTabs}
            activeTabId={activeTabId}
            onSelectTab={handleSelectTab}
            onCloseTab={handleCloseTab}
            onOpenGraphTab={handleOpenGraphTab}
            onOpenNoteTab={handleOpenNoteTab}
            onCreateNewNoteClick={() => setIsNewNoteModalOpen(true)}
            topics={allTopics}
            edges={allEdges}
            statuses={statuses}
            onUpdateStatus={handleUpdateStatus}
            onSaveNoteContent={handleSaveNoteContent}
            onResetNoteToDefault={handleResetNoteToDefault}
            selectedTopicId={selectedTopicId}
            onSelectTopic={(id) => {
              setSelectedTopicId(id);
              trackVisit(id);
            }}
            filterOptions={graphFilters}
            onUpdateFilters={(newFilters) => setGraphFilters(prev => ({ ...prev, ...newFilters }))}
            topicVisits={topicVisits}
            quizResults={quizResults}
            missingPrerequisiteNodeIds={fullSyllabusAudit.missingPrerequisiteNodeIds}
            onQuizCompleted={handleQuizCompleted}
            onHighlightGapsInGraph={handleHighlightGapsInGraph}
            canGoBack={historyIndex > 0}
            canGoForward={historyIndex < history.length - 1}
            onNavigateBack={handleNavigateBack}
            onNavigateForward={handleNavigateForward}
            tabModes={tabModes}
            onToggleTabMode={handleToggleTabMode}
          />
        </main>

        {/* E. Optional Right Sidebar (Topic Inspector & Links) */}
        {rightSidebarOpen && (
          <aside className="w-64 sm:w-72 shrink-0 h-full overflow-hidden border-l border-[#232326] z-20 bg-[#18181a]">
            <TopicDetailsPanel
              topic={selectedTopic}
              allTopics={allTopics}
              edges={allEdges}
              statuses={statuses}
              visitCount={selectedTopic ? (topicVisits[selectedTopic.id] || 0) : 0}
              quizResults={quizResults}
              onClose={() => setRightSidebarOpen(false)}
              onSelectTopic={(id) => {
                setSelectedTopicId(id);
                trackVisit(id);
              }}
              onOpenNote={handleOpenNoteTab}
              onFocusInGraph={handleFocusTopicInGraph}
              onUpdateStatus={handleUpdateStatus}
            />
          </aside>
        )}
      </div>

      {/* F. Bottom Status Bar */}
      <StatusBar
        activeTabId={activeTabId}
        activeTopic={allTopics.find(t => t.id === activeTabId) || null}
        totalTopicsCount={allTopics.length}
        edges={allEdges}
        statuses={statuses}
        mode={currentTabMode}
        visitCount={activeTabId !== 'graph-view' ? (topicVisits[activeTabId] || 0) : undefined}
        onToggleMode={() => handleToggleTabMode(activeTabId)}
        onOpenGraph={handleOpenGraphTab}
      />

      {/* Modals */}
      <NewNoteModal
        isOpen={isNewNoteModalOpen}
        onClose={() => setIsNewNoteModalOpen(false)}
        folders={INITIAL_FOLDERS}
        allTopics={allTopics}
        onCreateNote={handleCreateCustomNote}
      />

      <QuickSwitcherModal
        isOpen={isQuickSwitcherOpen}
        onClose={() => setIsQuickSwitcherOpen(false)}
        topics={allTopics}
        statuses={statuses}
        topicVisits={topicVisits}
        onSelectTopic={(id) => setSelectedTopicId(id)}
        onOpenNote={handleOpenNoteTab}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenGraph={handleOpenGraphTab}
        onOpenQuickSwitcher={() => setIsQuickSwitcherOpen(true)}
        onCreateNewNote={() => setIsNewNoteModalOpen(true)}
        onToggleReadEditMode={() => handleToggleTabMode(activeTabId)}
        onToggleLeftSidebar={() => setLeftSidebarOpen(prev => !prev)}
        onToggleRightSidebar={() => setRightSidebarOpen(prev => !prev)}
        onOpenGapsPanel={() => {
          setActiveRibbonPanel('gaps');
          setLeftSidebarOpen(true);
        }}
        onOpenProgressPanel={() => {
          setActiveRibbonPanel('progress');
          setLeftSidebarOpen(true);
        }}
        onHighlightGapsInGraph={handleHighlightGapsInGraph}
        onResetDemo={handleResetAllProgress}
      />
    </div>
  );
}
