import React, { useState } from 'react';
import { TopicNode } from '../../types/knowledge';
import { TopicDepthData, ContentDepthLevel, TopicExamNumerical, TopicKeyFormula } from '../../types/learning';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Layers, 
  HelpCircle, 
  Calculator, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Target,
  FileCheck,
  Eye,
  EyeOff,
  Cpu,
  Bookmark
} from 'lucide-react';

interface DepthContentViewProps {
  topic: TopicNode;
  depthData: TopicDepthData;
  depthLevel: ContentDepthLevel;
  onDepthChange: (level: ContentDepthLevel) => void;
  renderFormattedContent: (rawText: string) => React.ReactNode;
  onNavigateTopic: (topicId: string) => void;
}

export const DepthContentView: React.FC<DepthContentViewProps> = ({
  topic,
  depthData,
  depthLevel,
  onDepthChange,
  renderFormattedContent,
  onNavigateTopic,
}) => {
  const [isQuickCheckRevealed, setIsQuickCheckRevealed] = useState(false);
  const [expandedNumericals, setExpandedNumericals] = useState<Record<string, boolean>>({});

  const toggleNumerical = (numId: string) => {
    setExpandedNumericals(prev => ({
      ...prev,
      [numId]: !prev[numId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* INTERACTIVE DEPTH SELECTOR CONTROL BAR                        */}
      {/* ============================================================== */}
      <div className="p-3 bg-[#131316] border border-[#232328] rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-1">
            Technical Depth:
          </span>

          <div className="flex items-center gap-1 p-0.5 bg-[#1b1b1f] border border-[#2b2b32] rounded-lg">
            <button
              onClick={() => onDepthChange('foundational')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all ${
                depthLevel === 'foundational'
                  ? 'bg-[#242428] text-white font-medium border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Foundational</span>
            </button>

            <button
              onClick={() => onDepthChange('undergraduate')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all ${
                depthLevel === 'undergraduate'
                  ? 'bg-[#242428] text-white font-medium border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-300" />
              <span>Undergraduate</span>
            </button>

            <button
              onClick={() => onDepthChange('gate_honors')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all ${
                depthLevel === 'gate_honors'
                  ? 'bg-[#242428] text-white font-medium border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-zinc-300" />
              <span>Advanced & Honors</span>
            </button>

            <button
              onClick={() => onDepthChange('unified')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all ${
                depthLevel === 'unified'
                  ? 'bg-[#242428] text-white font-medium border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]'
              }`}
              title="View all 3 tiers sequentially"
            >
              <Layers className="w-3.5 h-3.5 text-zinc-300" />
              <span>Unified All</span>
            </button>
          </div>
        </div>

        {/* Dynamic Depth Level Descriptor Tag */}
        <div className="text-xs text-zinc-400 flex items-center gap-2">
          {depthLevel === 'foundational' && (
            <span className="flex items-center gap-1.5 text-zinc-300 bg-zinc-800/80 border border-zinc-700/60 px-2.5 py-0.5 rounded-md text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
              Intuitive mental models & conceptual intuition
            </span>
          )}
          {depthLevel === 'undergraduate' && (
            <span className="flex items-center gap-1.5 text-zinc-300 bg-zinc-800/80 border border-zinc-700/60 px-2.5 py-0.5 rounded-md text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
              Full university syllabus curriculum notes
            </span>
          )}
          {depthLevel === 'gate_honors' && (
            <span className="flex items-center gap-1.5 text-zinc-300 bg-zinc-800/80 border border-zinc-700/60 px-2.5 py-0.5 rounded-md text-[11px]">
              <Flame className="w-3.5 h-3.5 text-zinc-400" />
              Advanced derivations, quantitative formulas & numericals
            </span>
          )}
          {depthLevel === 'unified' && (
            <span className="flex items-center gap-1.5 text-zinc-300 bg-zinc-800/80 border border-zinc-700/60 px-2.5 py-0.5 rounded-md text-[11px]">
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              Progressive mastery: Foundation → Undergrad → Advanced
            </span>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. FOUNDATIONAL TIER VIEW                                      */}
      {/* ============================================================== */}
      {(depthLevel === 'foundational' || depthLevel === 'unified') && (
        <section className={`space-y-4 ${depthLevel === 'unified' ? 'pb-8 border-b border-[#282830]' : ''}`}>
          {depthLevel === 'unified' && (
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 border-l-2 border-emerald-500 pl-2.5 py-0.5">
              <span>Stage 1: Foundational Conceptual Core</span>
            </div>
          )}

          {/* Analogy & Intuitive Breakdown Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-[#121c17] to-[#14181a] border border-emerald-900/50 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-emerald-300">
                {depthData.foundational.coreAnalogy}
              </h3>
            </div>
            <div className="text-[13px] text-zinc-300 leading-relaxed whitespace-pre-line space-y-2">
              {renderFormattedContent(depthData.foundational.intuitiveExplanation)}
            </div>
          </div>

          {/* Key Conceptual Takeaways */}
          <div className="p-4 rounded-xl bg-[#161619] border border-[#25252c] space-y-2.5">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
              Core Principles to Remember
            </span>
            <ul className="space-y-1.5">
              {depthData.foundational.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Quick Check Concept Challenge */}
          {depthData.foundational.quickCheckQuestion && (
            <div className="p-4 rounded-xl bg-[#171b1d] border border-teal-900/50 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-semibold text-teal-300">
                    Quick Concept Check
                  </span>
                </div>
                <button
                  onClick={() => setIsQuickCheckRevealed(!isQuickCheckRevealed)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-[#20292b] text-teal-300 hover:bg-[#283538] border border-teal-700/40 transition-colors"
                >
                  {isQuickCheckRevealed ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Hide Answer</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Reveal Answer</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-zinc-200 font-medium">
                {depthData.foundational.quickCheckQuestion}
              </p>

              {isQuickCheckRevealed && (
                <div className="p-3 rounded-lg bg-[#111718] border border-teal-800/40 text-xs text-teal-200/90 leading-relaxed animate-in fade-in duration-150">
                  <strong className="text-teal-300 block mb-0.5">Model Answer:</strong>
                  {depthData.foundational.quickCheckAnswer}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ============================================================== */}
      {/* 2. UNDERGRADUATE TIER VIEW                                    */}
      {/* ============================================================== */}
      {(depthLevel === 'undergraduate' || depthLevel === 'unified') && (
        <section className={`space-y-5 ${depthLevel === 'unified' ? 'pb-8 border-b border-[#282830]' : ''}`}>
          {depthLevel === 'unified' && (
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 border-l-2 border-amber-500 pl-2.5 py-0.5">
              <span>Stage 2: Undergraduate Curriculum & Reaction Mechanics</span>
            </div>
          )}

          {/* Formal University Notes */}
          <article className="prose prose-invert max-w-none text-zinc-300">
            {renderFormattedContent(depthData.undergraduate.formalNotes)}
          </article>

          {/* ASCII Structural / Chemical Scheme if provided */}
          {depthData.undergraduate.reactionMechanismsOrStructures && (
            <div className="p-4 rounded-xl bg-[#141416] border border-[#25252a] space-y-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Structural & Reaction Pathway Schema
              </span>
              <pre className="p-3 bg-[#0f0f12] border border-[#202026] rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                <code>{depthData.undergraduate.reactionMechanismsOrStructures.replace(/```/g, '')}</code>
              </pre>
            </div>
          )}

          {/* Applications & Insights */}
          {depthData.undergraduate.applications.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#161619] border border-[#232328] space-y-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  Industrial & Engineering Applications
                </span>
                <ul className="space-y-1">
                  {depthData.undergraduate.applications.map((app, idx) => (
                    <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {depthData.undergraduate.keyInsights.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[#161619] border border-[#232328] space-y-2">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                    Curriculum Insights
                  </span>
                  <ul className="space-y-1">
                    {depthData.undergraduate.keyInsights.map((ins, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                        <span className="text-zinc-400 font-bold">•</span>
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ============================================================== */}
      {/* 3. ADVANCED ACADEMIC & HONORS TIER VIEW                       */}
      {/* ============================================================== */}
      {(depthLevel === 'gate_honors' || depthLevel === 'unified') && (
        <section className="space-y-6">
          {depthLevel === 'unified' && (
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 border-l-2 border-rose-500 pl-2.5 py-0.5">
              <span>Stage 3: Advanced Academic & University Honors Depth</span>
            </div>
          )}

          {/* Derivation Title & Mathematical Framework */}
          <div className="p-5 rounded-xl bg-[#181418] border border-rose-900/50 space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-semibold text-rose-300">
                {depthData.gateHonors.derivationTitle}
              </h3>
            </div>
            <div className="text-[13px] text-zinc-300 leading-relaxed space-y-3">
              {renderFormattedContent(depthData.gateHonors.rigorousDerivation)}
            </div>
          </div>

          {/* High-Yield Formula Cheat Sheet */}
          {depthData.gateHonors.keyFormulas.length > 0 && (
            <div className="p-4 rounded-xl bg-[#18181c] border border-zinc-700/60 space-y-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-zinc-300" />
                <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                  Key Quantitative Formulas & SI Parameter Units
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {depthData.gateHonors.keyFormulas.map((f, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#141417] border border-[#26262b] space-y-1.5">
                    <span className="text-xs font-medium text-zinc-100 block">
                      {f.name}
                    </span>
                    <div className="font-mono text-xs bg-[#101012] p-2 rounded text-zinc-200 border border-[#202024] overflow-x-auto text-center">
                      {f.formula}
                    </div>
                    <div className="text-[11px] text-zinc-400 leading-tight">
                      <p><span className="text-zinc-500">Parameters:</span> {f.parameterDefinitions}</p>
                      <p><span className="text-zinc-500">Units:</span> <span className="text-zinc-300 font-mono">{f.units}</span></p>
                      {f.validityConditions && (
                        <p><span className="text-zinc-500">Conditions:</span> {f.validityConditions}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conceptual Pitfalls & Traps */}
          {depthData.gateHonors.examTraps.length > 0 && (
            <div className="p-4 rounded-xl bg-[#231b14] border border-amber-800/60 space-y-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  Conceptual Traps & Analysis Hazards
                </span>
              </div>
              <div className="space-y-2">
                {depthData.gateHonors.examTraps.map((trap, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-[#1c1510] border border-amber-900/40 text-xs text-amber-200/90 leading-relaxed">
                    {trap}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solved Exam Numericals */}
          {depthData.gateHonors.solvedNumericals.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Step-by-Step Solved Exam Numericals ({depthData.gateHonors.solvedNumericals.length})
                </span>
              </div>

              {depthData.gateHonors.solvedNumericals.map((num) => {
                const isExpanded = !!expandedNumericals[num.id];
                return (
                  <div 
                    key={num.id}
                    className="p-4 rounded-xl bg-[#17161b] border border-[#2b2734] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {num.gateYearOrExam && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/50 inline-block mb-1.5">
                            {num.gateYearOrExam}
                          </span>
                        )}
                        <h4 className="text-xs font-medium text-zinc-100 leading-relaxed">
                          {num.problemStatement}
                        </h4>
                      </div>

                      <button
                        onClick={() => toggleNumerical(num.id)}
                        className="px-2.5 py-1 text-xs rounded bg-[#24212c] text-rose-300 hover:bg-[#2d2938] border border-[#373142] flex items-center gap-1 shrink-0 transition-colors"
                      >
                        <span>{isExpanded ? 'Hide Steps' : 'View Solution'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Given Values */}
                    <div className="flex flex-wrap gap-2 text-[11px] text-zinc-400">
                      <span className="font-semibold text-zinc-500">Given:</span>
                      {Object.entries(num.givenValues).map(([k, v]) => (
                        <span key={k} className="px-1.5 py-0.5 rounded bg-[#1e1c24] text-zinc-300 font-mono text-[10px]">
                          {k} = {v}
                        </span>
                      ))}
                    </div>

                    {/* Expandable Step-by-Step Solution */}
                    {isExpanded && (
                      <div className="p-3.5 rounded-lg bg-[#121115] border border-[#282432] space-y-2.5 animate-in fade-in duration-150">
                        <div className="text-xs text-zinc-400">
                          <span className="text-zinc-500 font-semibold">Formula Used:</span>{' '}
                          <span className="font-mono text-rose-300">{num.formulaUsed}</span>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-zinc-400 block uppercase tracking-wider">
                            Step-by-Step Evaluation:
                          </span>
                          {num.stepByStepSolution.map((step, sIdx) => (
                            <div key={sIdx} className="text-xs text-zinc-300 leading-relaxed pl-2 border-l border-zinc-700">
                              {step}
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-[#23202b] flex items-center gap-2 text-xs">
                          <span className="font-bold text-emerald-400">Final Answer:</span>
                          <span className="font-medium text-zinc-100 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                            {num.answerWithUnits}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Viva Voce Defense Panel */}
          {depthData.gateHonors.vivaQuestions && depthData.gateHonors.vivaQuestions.length > 0 && (
            <div className="p-4 rounded-xl bg-[#18181c] border border-zinc-700/60 space-y-3">
              <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider block">
                Laboratory Viva Voce & Oral Defense
              </span>
              <div className="space-y-2.5">
                {depthData.gateHonors.vivaQuestions.map((viva, vIdx) => (
                  <div key={vIdx} className="p-3 rounded-lg bg-[#141416] border border-[#27272b] space-y-1 text-xs">
                    <p className="font-medium text-zinc-200">
                      <span className="text-zinc-300 font-bold">Q:</span> {viva.question}
                    </p>
                    <p className="text-zinc-400 pl-4 border-l border-zinc-700/60 leading-relaxed text-[12px]">
                      <span className="text-emerald-400 font-semibold">Defense:</span> {viva.modelAnswer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
