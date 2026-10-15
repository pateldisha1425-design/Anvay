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
  getStoredStudyDates,
  saveStoredStudyDate,
  resetAllData 
} from './utils/storage';
import { QuizResult } from './types/learning';
import { FeedbackReport, TopicReviewMeta, ReportStatus, TopicRating } from './types/feedback';
import { getInitialReviewMetaForTopic } from './data/feedbackData';
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
import { MobileDrawerContainer } from './components/Sidebar/MobileDrawerContainer';
import { ImmersionSidebarPanel } from './components/Immersion/ImmersionSidebarPanel';
import { VocabularyPracticeModal } from './components/Immersion/VocabularyPracticeModal';
import { getStoredImmersionSettings, saveStoredImmersionSettings } from './utils/immersionEngine';
import { ImmersionSettings } from './types/immersion';
import { useIsMobile } from './hooks/useIsMobile';
import { StatusBar } from './components/StatusBar/StatusBar';
import { NewNoteModal } from './components/Modals/NewNoteModal';
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
  LogOut,
  GraduationCap
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
  const isMobile = useIsMobile(768);

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
  const [studyDates, setStudyDates] = useState<Record<string, string>>(() => getStoredStudyDates());
  const [feedbackModalTopicId, setFeedbackModalTopicId] = useState<string | null>(null);

  // Marathi Immersion settings & practice modal state
  const [immersionSettings, setImmersionSettings] = useState<ImmersionSettings>(() => getStoredImmersionSettings());
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [practiceWordId, setPracticeWordId] = useState<string | undefined>(undefined);

  const handleUpdateImmersionSettings = useCallback((updates: Partial<ImmersionSettings>) => {
    setImmersionSettings(prev => {
      const updated = { ...prev, ...updates };
      saveStoredImmersionSettings(updated);
      return updated;
    });
  }, []);

  // Spaced Repetition study date recording callback
  const handleRecordStudyDate = useCallback((topicId: string, dateIso: string = new Date().toISOString()) => {
    setStudyDates(prev => {
      const updated = saveStoredStudyDate(topicId, dateIso);
      return { ...prev, ...updated };
    });
  }, []);

  // Topic Rating handler (1-5 stars, recalculates review average, persists locally and syncs to shared Firestore)
  const handleRateTopic = useCallback((topicId: string, rating: number) => {
    setUserRatings(prev => {
      const updated = saveStoredUserRating(topicId, rating);
      return { ...prev, ...updated };
    });

    setTopicReviews(prev => {
      const currentMeta = prev[topicId] || getInitialReviewMetaForTopic(topicId);
      const prevUserRating = userRatings[topicId];
      const newTotal = prevUserRating ? currentMeta.totalRatings : currentMeta.totalRatings + 1;
      const currentSum = currentMeta.averageRating * currentMeta.totalRatings;
      const newSum = prevUserRating
        ? currentSum - prevUserRating + rating
        : currentSum + rating;
      const newAvg = Number((newSum / (newTotal || 1)).toFixed(1));

      const updatedMeta: TopicReviewMeta = {
        ...currentMeta,
        averageRating: newAvg,
        totalRatings: newTotal,
        lastReviewedAt: currentMeta.lastReviewedAt || new Date().toISOString()
      };
      updateStoredTopicReview(topicId, updatedMeta);

      if (user) {
        syncRatingToCloud({
          id: `${topicId}_${user.uid}`,
          topicId,
          userId: user.uid,
          userName: user.displayName || 'Learner',
          rating,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }).catch(err => console.error('Cloud rating sync failed', err));

        syncTopicReviewMetaToCloud(updatedMeta).catch(err =>
          console.error('Cloud topic review meta sync failed', err)
        );
      }

      return { ...prev, [topicId]: updatedMeta };
    });
  }, [user, userRatings]);

  // Submit Feedback Report handler
  const handleSubmitFeedbackReport = useCallback(async (report: FeedbackReport) => {
    setFeedbackReports(prev => {
      const updated = saveStoredFeedbackReport(report);
      return updated;
    });

    setTopicReviews(prev => {
      const currentMeta = prev[report.topicId] || getInitialReviewMetaForTopic(report.topicId);
      const updatedMeta: TopicReviewMeta = {
        ...currentMeta,
        unresolvedIssues: (currentMeta.unresolvedIssues || 0) + 1,
        updatedAt: new Date().toISOString()
      };
      updateStoredTopicReview(report.topicId, updatedMeta);
      return { ...prev, [report.topicId]: updatedMeta };
    });

    if (user) {
      try {
        await syncFeedbackReportToCloud(report);
      } catch (err) {
        console.error('Failed to sync feedback report to cloud', err);
      }
    }
  }, [user]);

  // Update Feedback Report status handler
  const handleUpdateReportStatus = useCallback(async (
    reportId: string, 
    newStatus: ReportStatus, 
    reviewerNotes?: string, 
    reviewerName?: string
  ) => {
    const updatedReports = updateStoredReportStatus(reportId, newStatus, reviewerNotes, reviewerName);
    setFeedbackReports(updatedReports);

    const report = updatedReports.find(r => r.id === reportId);
    if (report) {
      const topicUnresolved = updatedReports.filter(
        r => r.topicId === report.topicId && (r.status === 'pending' || r.status === 'under_review')
      ).length;

      setTopicReviews(prev => {
        const currentMeta = prev[report.topicId] || getInitialReviewMetaForTopic(report.topicId);
        const updatedMeta: TopicReviewMeta = {
          ...currentMeta,
          unresolvedIssues: topicUnresolved,
          lastReviewedAt: new Date().toISOString(),
          reviewedBy: reviewerName || currentMeta.reviewedBy || 'Academic Committee',
          updatedAt: new Date().toISOString()
        };
        updateStoredTopicReview(report.topicId, updatedMeta);

        if (user) {
          syncTopicReviewMetaToCloud(updatedMeta).catch(err =>
            console.error('Failed to sync review meta on status update', err)
          );
        }

        return { ...prev, [report.topicId]: updatedMeta };
      });
    }

    if (user) {
      try {
        await updateReportStatusInCloud(reportId, newStatus, reviewerNotes, reviewerName);
      } catch (err) {
        console.error('Failed to update report status in cloud', err);
      }
    }
  }, [user]);

  // Update Topic Review metadata handler
  const handleUpdateTopicReview = useCallback(async (
    topicId: string, 
    updates: Partial<TopicReviewMeta>
  ) => {
    const updatedMap = updateStoredTopicReview(topicId, updates);
    setTopicReviews(updatedMap);

    if (user && updatedMap[topicId]) {
      try {
        await syncTopicReviewMetaToCloud(updatedMap[topicId]);
      } catch (err) {
        console.error('Failed to sync topic review meta to cloud', err);
      }
    }
  }, [user]);

  // Listen to Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // Real-time subscription to shared Feedback Reports and Topic Reviews (Firestore)
  useEffect(() => {
    if (!user) return;

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
  }, [user]);

  // Multi-tab storage synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'anvay_user_ratings_v1') {
        setUserRatings(getStoredUserRatings());
      } else if (e.key === 'anvay_feedback_reports_v1') {
        setFeedbackReports(getStoredFeedbackReports());
      } else if (e.key === 'anvay_topic_reviews_v1') {
        setTopicReviews(getStoredTopicReviews());
      } else if (e.key === 'anvay_last_study_dates_v1') {
        setStudyDates(getStoredStudyDates());
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
    handleRecordStudyDate(topicId);
  }, [user, statuses, handleRecordStudyDate]);

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

  // Folders State
  const [folders, setFolders] = useState<FolderItem[]>(INITIAL_FOLDERS);

  const handleCreateFolder = useCallback((name: string, parentId?: string) => {
    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name,
      parentId,
      order: folders.length + 1,
    };
    setFolders(prev => [...prev, newFolder]);
  }, [folders.length]);

  // Layout Panels
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);

  // Navigate to folder in FileExplorer (from breadcrumbs)
  const handleNavigateToFolder = useCallback((folderId: string) => {
    setActiveRibbonPanel('files');
    setLeftSidebarOpen(true);
    setTargetFolderId(folderId);
  }, []);

  // Graph Filters
  const [graphFilters, setGraphFilters] = useState<GraphFilterOptions>({
    selectedFolder: 'all',
    selectedStatus: 'all',
    selectedRelationType: 'all',
    searchQuery: '',
    highlightMode: 'all',
    hideOrphans: false,
    graphMode: 'global',
    localDepth: 1,
    colorGroupBy: 'none',
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
    if (isMobile) {
      setLeftSidebarOpen(false);
    }
  }, [allTopics, pushToHistory, trackVisit, isMobile]);

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

  // Open Academic & Formula Reference Hub tab
  const handleOpenGateTab = useCallback(() => {
    setOpenTabs(prev => {
      const existing = prev.find(t => t.id === 'gate-reference');
      if (existing) return prev;
      return [...prev, { id: 'gate-reference', title: 'Academic & Formula Reference', type: 'gate' }];
    });
    setActiveTabId('gate-reference');
    pushToHistory('gate-reference');
  }, [pushToHistory]);

  // Open Academic Review Dashboard tab
  const handleOpenReviewDashboard = useCallback(() => {
    setOpenTabs(prev => {
      const existing = prev.find(t => t.id === 'review-dashboard');
      if (existing) return prev;
      return [...prev, { id: 'review-dashboard', title: 'Curriculum Review', type: 'review' }];
    });
    setActiveTabId('review-dashboard');
    pushToHistory('review-dashboard');
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

  // Keyboard shortcuts (Cmd+P / Ctrl+P for command palette)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
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
      setStudyDates({});
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
      <header className="h-8 bg-[#121214] border-b border-[#232326] flex items-center justify-between px-2 sm:px-2.5 shrink-0 z-30 text-[11px] text-zinc-400">
        {/* Left window branding */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className={`p-1.5 min-h-[28px] min-w-[28px] flex items-center justify-center rounded transition-colors touch-manipulation ${
              leftSidebarOpen ? 'text-zinc-100 bg-[#232328]' : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]'
            }`}
            title={leftSidebarOpen ? 'Collapse left sidebar (Swipe left to close on mobile)' : 'Expand left sidebar'}
            aria-label="Toggle navigation sidebar"
          >
            <PanelLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-medium text-zinc-200 tracking-tight">
            Anvay
          </span>
          <span className="text-zinc-600 hidden min-[480px]:inline">•</span>
          <span className="text-zinc-500 hidden sm:inline">
            Functional Materials — Second Brain
          </span>
        </div>

        {/* Right utility buttons & Cloud Auth */}
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          {/* Firebase Auth Google Sign-in */}
          <div className="relative">
            {user ? (
              <div className="flex items-center">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 min-h-[28px] rounded bg-[#18181b] hover:bg-[#202024] border border-[#27272b] text-xs text-zinc-300 transition-colors touch-manipulation"
                  title="Firebase Auth & Cloud Sync"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-3.5 h-3.5 rounded-full" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-zinc-700 flex items-center justify-center text-[9px] text-white font-medium">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <span className="max-w-[45px] min-[360px]:max-w-[75px] sm:max-w-[110px] truncate text-[11px]">
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
                className="flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 min-h-[28px] rounded bg-[#18181b] hover:bg-[#202024] border border-[#27272b] text-xs text-zinc-300 hover:text-white transition-colors touch-manipulation"
                title="Sign in with Google to sync notes and visit counts across devices"
              >
                <LogIn className="w-3 h-3 text-zinc-300 shrink-0" />
                <span className="text-[11px] hidden min-[360px]:inline">Sign In</span>
              </button>
            )}
          </div>

          <div className="w-px h-3.5 bg-[#27272b]" />

          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-1 min-h-[28px] min-w-[28px] flex items-center justify-center hover:text-zinc-200 hover:bg-[#202024] rounded transition-colors touch-manipulation"
            title="Command Palette (Ctrl+P)"
            aria-label="Command Palette"
          >
            <Terminal className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className={`p-1.5 min-h-[28px] min-w-[28px] flex items-center justify-center rounded transition-colors touch-manipulation ${
              rightSidebarOpen ? 'text-zinc-100 bg-[#232328]' : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]'
            }`}
            title={rightSidebarOpen ? 'Collapse inspector (Swipe right to close on mobile)' : 'Expand inspector'}
            aria-label="Toggle topic details inspector"
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
          onOpenReviewDashboard={handleOpenReviewDashboard}
          onOpenGateDashboard={handleOpenGateTab}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onCreateNewNote={() => setIsNewNoteModalOpen(true)}
          onOpenSettings={handleResetAllProgress}
        />

        {/* B. Left Navigation Panel (File Explorer / Search / Backlinks / Gaps / Progress) */}
        <MobileDrawerContainer
          isOpen={leftSidebarOpen}
          onClose={() => setLeftSidebarOpen(false)}
          side="left"
          isMobile={isMobile}
          title={
            activeRibbonPanel === 'files' ? 'Files' :
            activeRibbonPanel === 'search' ? 'Search' :
            activeRibbonPanel === 'backlinks' ? 'Backlinks' :
            activeRibbonPanel === 'gaps' ? 'Prerequisite Gaps' :
            activeRibbonPanel === 'progress' ? 'Progress' :
            activeRibbonPanel === 'immersion' ? 'Marathi Immersion' : 'Navigation'
          }
          desktopWidthClass="w-60 sm:w-64"
        >
          {activeRibbonPanel === 'files' && (
            <FileExplorer
              folders={folders}
              topics={allTopics}
              statuses={statuses}
              topicVisits={topicVisits}
              selectedTopicId={selectedTopicId}
              onSelectTopic={(id) => setSelectedTopicId(id)}
              onOpenNote={handleOpenNoteTab}
              onCreateNewNote={() => setIsNewNoteModalOpen(true)}
              onCreateFolder={handleCreateFolder}
              targetFolderId={targetFolderId}
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
              folders={folders}
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
          {activeRibbonPanel === 'immersion' && (
            <ImmersionSidebarPanel
              settings={immersionSettings}
              onUpdateSettings={handleUpdateImmersionSettings}
              onOpenPracticeModal={() => {
                setPracticeWordId(undefined);
                setIsPracticeModalOpen(true);
              }}
              onSelectWord={(word) => {
                setPracticeWordId(word.id);
                setIsPracticeModalOpen(true);
              }}
            />
          )}
        </MobileDrawerContainer>

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
            folders={folders}
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
            studyDates={studyDates}
            onRecordStudyDate={handleRecordStudyDate}
            topicReviews={topicReviews}
            userRatings={userRatings}
            reports={feedbackReports}
            isCloudConnected={!!user}
            onRateTopic={handleRateTopic}
            onSubmitFeedbackReport={handleSubmitFeedbackReport}
            onUpdateReportStatus={handleUpdateReportStatus}
            onUpdateTopicReview={handleUpdateTopicReview}
            onSelectFolder={handleNavigateToFolder}
          />
        </main>

        {/* E. Optional Right Sidebar (Topic Inspector & Links) */}
        <MobileDrawerContainer
          isOpen={rightSidebarOpen}
          onClose={() => setRightSidebarOpen(false)}
          side="right"
          isMobile={isMobile}
          title={selectedTopic ? selectedTopic.title : 'Concept Details'}
          desktopWidthClass="w-64 sm:w-72"
        >
          <TopicDetailsPanel
            topic={selectedTopic}
            allTopics={allTopics}
            edges={allEdges}
            statuses={statuses}
            visitCount={selectedTopic ? (topicVisits[selectedTopic.id] || 0) : 0}
            quizResults={quizResults}
            reviewMeta={selectedTopic ? topicReviews[selectedTopic.id] : undefined}
            userRating={selectedTopic ? userRatings[selectedTopic.id] : undefined}
            reports={feedbackReports}
            onClose={() => setRightSidebarOpen(false)}
            onSelectTopic={(id) => {
              setSelectedTopicId(id);
              trackVisit(id);
            }}
            onOpenNote={handleOpenNoteTab}
            onFocusInGraph={handleFocusTopicInGraph}
            onUpdateStatus={handleUpdateStatus}
            onRateTopic={handleRateTopic}
            onOpenFeedbackModal={(topicId) => setFeedbackModalTopicId(topicId)}
            onOpenReviewDashboard={handleOpenReviewDashboard}
          />
        </MobileDrawerContainer>
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
        folders={folders}
        allTopics={allTopics}
        onCreateNote={handleCreateCustomNote}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenGraph={handleOpenGraphTab}
        onOpenReviewDashboard={handleOpenReviewDashboard}
        onOpenGateDashboard={handleOpenGateTab}
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

      {feedbackModalTopicId && (
        <FeedbackModal
          isOpen={!!feedbackModalTopicId}
          topic={allTopics.find(t => t.id === feedbackModalTopicId) || allTopics[0]}
          allTopics={allTopics}
          userRating={feedbackModalTopicId ? userRatings[feedbackModalTopicId] : undefined}
          currentUserId={user?.uid || undefined}
          currentUserName={user?.displayName || user?.email || undefined}
          onClose={() => setFeedbackModalTopicId(null)}
          onSubmit={(report, optionalRating) => {
            handleSubmitFeedbackReport(report);
            if (optionalRating) {
              handleRateTopic(report.topicId, optionalRating);
            }
            setFeedbackModalTopicId(null);
          }}
        />
      )}

      {/* Marathi Vocabulary Flashcard Practice Modal */}
      <VocabularyPracticeModal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        initialWordId={practiceWordId}
      />
    </div>
  );
}
