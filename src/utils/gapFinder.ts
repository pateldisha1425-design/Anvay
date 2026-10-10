import { TopicNode, RelationshipEdge, LearningStatus, FolderItem } from '../types/knowledge';
import { 
  PrerequisiteGap, 
  TopicDiagnosticResult, 
  QuizResult, 
  GapSeverity, 
  SyllabusOverallProgress,
  SyllabusModuleProgress 
} from '../types/learning';

/**
 * Returns all direct and indirect prerequisites for a topic, with depth tracking
 */
export function getPrerequisiteTree(
  topicId: string,
  topicsMap: Map<string, TopicNode>,
  prereqEdgesMap: Map<string, string[]> // target -> source[] (sources are prerequisites)
): { id: string; depth: number }[] {
  const result: { id: string; depth: number }[] = [];
  const visited = new Set<string>();

  function dfs(currId: string, depth: number) {
    const topic = topicsMap.get(currId);
    const directPrereqIds = new Set<string>();

    if (topic && topic.prerequisiteIds) {
      topic.prerequisiteIds.forEach(id => directPrereqIds.add(id));
    }

    const edgePrereqs = prereqEdgesMap.get(currId) || [];
    edgePrereqs.forEach(id => directPrereqIds.add(id));

    directPrereqIds.forEach(prereqId => {
      if (prereqId === topicId) return; // avoid self-loop
      if (!visited.has(prereqId)) {
        visited.add(prereqId);
        result.push({ id: prereqId, depth });
        dfs(prereqId, depth + 1);
      }
    });
  }

  dfs(topicId, 1);
  return result;
}

/**
 * Pure rule-based diagnostic for a single topic
 */
export function diagnoseTopicPrerequisites(
  topicId: string,
  allTopics: TopicNode[],
  edges: RelationshipEdge[],
  statuses: Record<string, LearningStatus>,
  quizResults: Record<string, QuizResult>
): TopicDiagnosticResult {
  const topicsMap = new Map<string, TopicNode>(allTopics.map(t => [t.id, t]));
  const targetTopic = topicsMap.get(topicId);

  // Map edges where type === 'prerequisite': source is prereq, target is dependent
  const prereqEdgesMap = new Map<string, string[]>();
  edges.forEach(e => {
    if (e.type === 'prerequisite') {
      const list = prereqEdgesMap.get(e.target) || [];
      list.push(e.source);
      prereqEdgesMap.set(e.target, list);
    }
  });

  const prereqNodes = getPrerequisiteTree(topicId, topicsMap, prereqEdgesMap);
  const gaps: PrerequisiteGap[] = [];
  let satisfiedCount = 0;

  prereqNodes.forEach(({ id: pId, depth }) => {
    const pTopic = topicsMap.get(pId);
    if (!pTopic) return;

    const status = statuses[pId] || 'not_studied';
    const quiz = quizResults[pId];
    const isQuizPassed = quiz && quiz.bestScore >= 70;
    const isStatusLearned = status === 'learned';

    // A prerequisite is fully satisfied if learned or quiz passed with >= 70%
    if (isStatusLearned || isQuizPassed) {
      satisfiedCount++;
      return;
    }

    // Determine reason and severity
    let reason: 'not_studied' | 'learning' | 'quiz_failed' | 'needs_revision' = 'not_studied';
    let severity: GapSeverity = depth === 1 ? 'critical' : 'warning';
    let recommendedAction = `Study foundational note [[${pTopic.title}]] before proceeding.`;

    if (quiz && quiz.bestScore < 70) {
      reason = 'quiz_failed';
      severity = 'critical';
      recommendedAction = `Mastery quiz failed (${quiz.bestScore}%). Retake quiz for [[${pTopic.title}]].`;
    } else if (status === 'needs_revision') {
      reason = 'needs_revision';
      severity = 'warning';
      recommendedAction = `Topic marked for revision. Review [[${pTopic.title}]].`;
    } else if (status === 'learning') {
      reason = 'learning';
      severity = depth === 1 ? 'critical' : 'warning';
      recommendedAction = `Currently in progress. Complete study of [[${pTopic.title}]].`;
    }

    gaps.push({
      targetTopicId: topicId,
      targetTopicTitle: targetTopic?.title || topicId,
      missingPrerequisiteId: pId,
      missingPrerequisiteTitle: pTopic.title,
      missingPrerequisiteCategory: pTopic.category,
      depth,
      reason,
      severity,
      recommendedAction,
    });
  });

  // Sort gaps by depth (deepest foundational prerequisites first) then severity
  gaps.sort((a, b) => {
    if (b.depth !== a.depth) return b.depth - a.depth;
    if (a.severity === 'critical' && b.severity !== 'critical') return -1;
    if (b.severity === 'critical' && a.severity !== 'critical') return 1;
    return 0;
  });

  // Construct recommended learning path: deepest unresolved prerequisites -> direct prerequisites -> target
  const unresolvedIds = gaps.map(g => g.missingPrerequisiteId);
  const recommendedLearningPath = [...unresolvedIds, topicId];

  return {
    topicId,
    topicTitle: targetTopic?.title || topicId,
    isReady: gaps.length === 0,
    totalPrerequisites: prereqNodes.length,
    satisfiedPrerequisites: satisfiedCount,
    gaps,
    recommendedLearningPath,
  };
}

/**
 * Diagnostic analysis across all topics in the syllabus
 */
export function diagnoseAllSyllabusTopics(
  allTopics: TopicNode[],
  edges: RelationshipEdge[],
  statuses: Record<string, LearningStatus>,
  quizResults: Record<string, QuizResult>
): {
  diagnosticMap: Record<string, TopicDiagnosticResult>;
  missingPrerequisiteNodeIds: Set<string>;
  blockedTopicIds: Set<string>;
  readyToStudyTopicIds: Set<string>;
  allGaps: PrerequisiteGap[];
} {
  const diagnosticMap: Record<string, TopicDiagnosticResult> = {};
  const missingPrerequisiteNodeIds = new Set<string>();
  const blockedTopicIds = new Set<string>();
  const readyToStudyTopicIds = new Set<string>();
  const allGaps: PrerequisiteGap[] = [];

  allTopics.forEach(topic => {
    const diag = diagnoseTopicPrerequisites(topic.id, allTopics, edges, statuses, quizResults);
    diagnosticMap[topic.id] = diag;

    if (!diag.isReady) {
      blockedTopicIds.add(topic.id);
      diag.gaps.forEach(g => {
        missingPrerequisiteNodeIds.add(g.missingPrerequisiteId);
        allGaps.push(g);
      });
    } else {
      const status = statuses[topic.id] || 'not_studied';
      if (status !== 'learned') {
        readyToStudyTopicIds.add(topic.id);
      }
    }
  });

  return {
    diagnosticMap,
    missingPrerequisiteNodeIds,
    blockedTopicIds,
    readyToStudyTopicIds,
    allGaps,
  };
}

/**
 * Calculate comprehensive syllabus progress and module stats
 */
export function calculateSyllabusProgress(
  topics: TopicNode[],
  folders: FolderItem[],
  statuses: Record<string, LearningStatus>,
  topicVisits: Record<string, number>,
  quizResults: Record<string, QuizResult>,
  totalGapsDetected: number
): SyllabusOverallProgress {
  const totalTopics = topics.length;
  let learnedCount = 0;
  let learningCount = 0;
  let needsRevisionCount = 0;
  let notStudiedCount = 0;
  let totalVisits = 0;
  let quizzesAttempted = 0;
  let quizzesMastered = 0;

  topics.forEach(t => {
    const st = statuses[t.id] || 'not_studied';
    if (st === 'learned') learnedCount++;
    else if (st === 'learning') learningCount++;
    else if (st === 'needs_revision') needsRevisionCount++;
    else notStudiedCount++;

    totalVisits += topicVisits[t.id] || 0;

    const quiz = quizResults[t.id];
    if (quiz) {
      quizzesAttempted++;
      if (quiz.isMastered || quiz.bestScore >= 70) {
        quizzesMastered++;
      }
    }
  });

  // Module breakdown
  const moduleBreakdown: SyllabusModuleProgress[] = folders.map(folder => {
    const folderTopics = topics.filter(t => t.folderId === folder.id);
    const count = folderTopics.length;
    if (count === 0) {
      return {
        folderId: folder.id,
        folderName: folder.name,
        totalTopics: 0,
        learnedTopics: 0,
        masteredQuizzes: 0,
        percentage: 0,
      };
    }

    const folderLearned = folderTopics.filter(t => statuses[t.id] === 'learned').length;
    const folderMasteredQuizzes = folderTopics.filter(t => {
      const q = quizResults[t.id];
      return q && (q.isMastered || q.bestScore >= 70);
    }).length;

    // Weight: 60% topic completion + 40% quiz mastery
    const weightedProgress = Math.round(
      ((folderLearned / count) * 0.6 + (folderMasteredQuizzes / count) * 0.4) * 100
    );

    return {
      folderId: folder.id,
      folderName: folder.name,
      totalTopics: count,
      learnedTopics: folderLearned,
      masteredQuizzes: folderMasteredQuizzes,
      percentage: Math.min(100, Math.max(0, weightedProgress)),
    };
  });

  // Overall mastery percentage
  const overallMasteryPercentage = totalTopics > 0 
    ? Math.round(((learnedCount / totalTopics) * 0.6 + (quizzesMastered / totalTopics) * 0.4) * 100)
    : 0;

  return {
    totalTopics,
    learnedCount,
    learningCount,
    needsRevisionCount,
    notStudiedCount,
    totalVisits,
    quizzesAttempted,
    quizzesMastered,
    overallMasteryPercentage: Math.min(100, Math.max(0, overallMasteryPercentage)),
    totalGapsDetected,
    moduleBreakdown,
  };
}
