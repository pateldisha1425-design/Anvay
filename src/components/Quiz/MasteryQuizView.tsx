import React, { useState } from 'react';
import { TopicNode, LearningStatus } from '../../types/knowledge';
import { QuizResult } from '../../types/learning';
import { getQuizForTopic } from '../../data/quizData';
import { saveStoredQuizResult } from '../../utils/storage';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Award, 
  HelpCircle, 
  ChevronRight, 
  Lightbulb,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface MasteryQuizViewProps {
  topic: TopicNode;
  allTopics: TopicNode[];
  currentStatus: LearningStatus;
  savedQuizResult?: QuizResult;
  onUpdateStatus: (topicId: string, status: LearningStatus) => void;
  onNavigateTopic: (topicId: string) => void;
  onQuizCompleted?: (topicId: string, result: QuizResult) => void;
}

export const MasteryQuizView: React.FC<MasteryQuizViewProps> = ({
  topic,
  allTopics,
  currentStatus,
  savedQuizResult,
  onUpdateStatus,
  onNavigateTopic,
  onQuizCompleted,
}) => {
  const quiz = getQuizForTopic(topic);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<QuizResult | null>(savedQuizResult || null);

  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const toggleHint = (questionId: string) => {
    setShowHints(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    const missedPrereqIds: string[] = [];

    quiz.questions.forEach(q => {
      const selected = selectedAnswers[q.id];
      if (selected === q.correctIndex) {
        correctCount++;
      } else if (q.prerequisiteTopicId) {
        missedPrereqIds.push(q.prerequisiteTopicId);
      }
    });

    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const isMastered = scorePercent >= quiz.passingScorePercent;

    const previousBest = savedQuizResult?.bestScore || 0;
    const newBest = Math.max(previousBest, scorePercent);
    const attempts = (savedQuizResult?.attemptsCount || 0) + 1;

    const result: QuizResult = {
      topicId: topic.id,
      bestScore: newBest,
      lastScore: scorePercent,
      attemptsCount: attempts,
      isMastered: newBest >= quiz.passingScorePercent,
      lastAttemptDate: new Date().toISOString(),
      missedPrerequisiteIds: Array.from(new Set(missedPrereqIds)),
    };

    saveStoredQuizResult(topic.id, result);
    setLastResult(result);
    setIsSubmitted(true);

    // Rule-based status update:
    // If mastered, upgrade to 'learned'
    // If failed and was 'learned', suggest 'needs_revision'
    if (isMastered && currentStatus !== 'learned') {
      onUpdateStatus(topic.id, 'learned');
    } else if (!isMastered && currentStatus === 'learned') {
      onUpdateStatus(topic.id, 'needs_revision');
    }

    if (onQuizCompleted) {
      onQuizCompleted(topic.id, result);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowHints({});
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Quiz Header & Stats */}
      <div className="bg-[#1a1a1e] border border-[#27272c] rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">
                Rule-Based Diagnostic Mastery Test
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#25252b] text-zinc-400 border border-[#2f2f36]">
                Passmark: {quiz.passingScorePercent}%
              </span>
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">
              {quiz.title}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Tests fundamental concepts, mechanisms, and equations for {topic.title}. Answering incorrectly triggers prerequisite gap detection.
            </p>
          </div>

          {/* Previous result badge if available */}
          {lastResult && (
            <div className="self-start sm:self-auto flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#202026] border border-[#2e2e36] shrink-0">
              <Award className={`w-5 h-5 ${lastResult.isMastered ? 'text-amber-400' : 'text-zinc-500'}`} />
              <div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                  Best Score
                </div>
                <div className="text-sm font-bold text-zinc-100">
                  {lastResult.bestScore}% {lastResult.isMastered && <span className="text-xs text-emerald-400 font-normal">Mastered</span>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Banner if Submitted */}
      {isSubmitted && lastResult && (
        <div className={`p-4 rounded-lg border transition-all ${
          lastResult.lastScore >= quiz.passingScorePercent
            ? 'bg-[#15231c] border-emerald-700/60 text-emerald-200'
            : 'bg-[#291919] border-red-800/60 text-red-200'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {lastResult.lastScore >= quiz.passingScorePercent ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-sm font-bold text-zinc-100">
                  {lastResult.lastScore >= quiz.passingScorePercent
                    ? `Mastery Achieved! Score: ${lastResult.lastScore}%`
                    : `Quiz Incomplete: Score: ${lastResult.lastScore}%`}
                </h4>
                <p className="text-xs mt-1 leading-relaxed text-zinc-300">
                  {lastResult.lastScore >= quiz.passingScorePercent
                    ? `Outstanding work! You have satisfied the rule-based mastery requirement for ${topic.title}. Topic status updated to "Learned".`
                    : `You scored below the ${quiz.passingScorePercent}% threshold. Review the explanations below and resolve missing prerequisite concepts before retesting.`}
                </p>

                {/* Prerequisite Gaps Alert if student missed questions with prerequisite tags */}
                {lastResult.missedPrerequisiteIds.length > 0 && (
                  <div className="mt-3 p-2.5 rounded bg-[#331818] border border-red-700/50 flex items-start gap-2 text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-300 block mb-0.5">
                        Prerequisite Gap Detected:
                      </span>
                      <p className="text-zinc-300 text-[11px] mb-1.5">
                        Your incorrect responses indicate an incomplete foundation in:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {lastResult.missedPrerequisiteIds.map(prereqId => {
                          const pTopic = allTopics.find(t => t.id === prereqId);
                          return (
                            <button
                              key={prereqId}
                              onClick={() => onNavigateTopic(prereqId)}
                              className="px-2 py-0.5 rounded bg-[#421f1f] hover:bg-[#522727] text-amber-200 border border-amber-600/40 text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <span>[[{pTopic?.title || prereqId}]]</span>
                              <ChevronRight className="w-3 h-3 text-amber-400" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleResetQuiz}
              className="shrink-0 px-3 py-1.5 rounded bg-[#202026] hover:bg-[#2b2b34] text-xs text-zinc-200 border border-[#303038] flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {quiz.questions.map((q, qIndex) => {
          const selected = selectedAnswers[q.id];
          const isAnswered = selected !== undefined;
          const isCorrect = isAnswered && selected === q.correctIndex;
          const isWrong = isAnswered && selected !== q.correctIndex;
          const prereqTopic = q.prerequisiteTopicId 
            ? allTopics.find(t => t.id === q.prerequisiteTopicId) 
            : null;

          return (
            <div
              key={q.id}
              className={`p-4 rounded-lg border transition-colors ${
                isSubmitted
                  ? isCorrect
                    ? 'bg-[#151c17] border-emerald-800/40'
                    : 'bg-[#1c1616] border-red-800/40'
                  : 'bg-[#18181b] border-[#26262a]'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#24242a] text-zinc-400 font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <h4 className="text-[13px] font-medium text-zinc-100 leading-snug">
                    {q.question}
                  </h4>
                </div>

                {/* Hint toggle */}
                {q.hint && !isSubmitted && (
                  <button
                    onClick={() => toggleHint(q.id)}
                    className="shrink-0 p-1 rounded hover:bg-[#25252b] text-zinc-400 hover:text-amber-300 transition-colors"
                    title="View pedagogical hint"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Math snippet if present */}
              {q.formulaSnippet && (
                <div className="my-2 ml-7 p-2 rounded bg-[#1e1e24] border border-[#2a2a32] font-mono text-cyan-300 text-xs text-center">
                  {q.formulaSnippet}
                </div>
              )}

              {/* Hint Box */}
              {showHints[q.id] && q.hint && !isSubmitted && (
                <div className="mb-3 ml-7 p-2.5 rounded bg-[#241f17] border border-amber-800/40 text-xs text-amber-200/90 flex items-start gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Hint:</strong> {q.hint}</span>
                </div>
              )}

              {/* Options */}
              <div className="space-y-2 ml-7 mt-3">
                {q.options.map((option, optIndex) => {
                  const isThisSelected = selected === optIndex;
                  const isThisCorrect = optIndex === q.correctIndex;

                  let optionStyle = 'bg-[#1e1e22] border-[#29292e] text-zinc-300 hover:border-zinc-500 hover:bg-[#232328]';

                  if (isSubmitted) {
                    if (isThisCorrect) {
                      optionStyle = 'bg-[#16271c] border-emerald-600/70 text-emerald-200';
                    } else if (isThisSelected && !isThisCorrect) {
                      optionStyle = 'bg-[#291717] border-red-600/70 text-red-200';
                    } else {
                      optionStyle = 'bg-[#18181b] border-[#242428] text-zinc-500 opacity-60';
                    }
                  } else if (isThisSelected) {
                    optionStyle = 'bg-[#1c2230] border-blue-500 text-blue-200';
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-2.5 rounded border text-xs leading-relaxed transition-all flex items-start gap-2.5 ${optionStyle}`}
                    >
                      <span className={`w-4 h-4 rounded-full border text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5 ${
                        isThisSelected 
                          ? 'border-blue-400 bg-blue-500 text-white' 
                          : 'border-zinc-600 text-zinc-400'
                      }`}>
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Prerequisite Link (Shown after submit) */}
              {isSubmitted && (
                <div className="mt-3 ml-7 pt-2.5 border-t border-[#26262a] space-y-2 text-xs">
                  <div className="text-zinc-300 leading-relaxed">
                    <strong className="text-zinc-200">Explanation: </strong>
                    {q.explanation}
                  </div>

                  {/* If missed and has prerequisite topic link */}
                  {isWrong && prereqTopic && (
                    <div className="p-2 rounded bg-[#261717] border border-red-800/40 flex items-center justify-between text-xs text-red-200">
                      <span>Foundational concept: <strong>{prereqTopic.title}</strong></span>
                      <button
                        onClick={() => onNavigateTopic(prereqTopic.id)}
                        className="text-blue-400 hover:underline flex items-center gap-1 font-normal"
                      >
                        <span>Study Note</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Action */}
      {!isSubmitted && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-zinc-400 font-mono">
            {answeredCount} of {totalQuestions} answered
          </div>
          <button
            onClick={handleSubmitQuiz}
            disabled={answeredCount < totalQuestions}
            className={`px-4 py-2 rounded text-xs font-medium transition-all ${
              answeredCount === totalQuestions
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-800/30'
                : 'bg-[#222226] text-zinc-500 cursor-not-allowed'
            }`}
          >
            Submit & Verify Mastery
          </button>
        </div>
      )}
    </div>
  );
};
