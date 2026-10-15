import React, { useState, useMemo } from 'react';
import { TopicNode } from '../../types/knowledge';
import { getTopicDepthData } from '../../data/curriculumDepthData';
import { TopicExamNumerical, TopicKeyFormula } from '../../types/learning';
import { 
  Calculator, 
  Target, 
  AlertTriangle, 
  HelpCircle, 
  Search, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Filter
} from 'lucide-react';

interface FormulaReferenceDashboardProps {
  allTopics: TopicNode[];
  onOpenTopicNote: (topicId: string) => void;
}

export const FormulaReferenceDashboard: React.FC<FormulaReferenceDashboardProps> = ({
  allTopics,
  onOpenTopicNote,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'formulas' | 'numericals' | 'traps' | 'viva'>('formulas');
  const [expandedNumericals, setExpandedNumericals] = useState<Record<string, boolean>>({});

  const units = [
    { id: 'all', label: 'All Units' },
    { id: '01-oxides', label: '01 Oxides' },
    { id: '02-polymers', label: '02 Polymers' },
    { id: '03-conducting-polymers', label: '03 Conducting Polymers' },
    { id: '04-nanomaterials', label: '04 Nanomaterials' },
    { id: '05-synthesis-nanomaterials', label: '05 Synthesis of Nanomaterials' },
    { id: '06-oleds', label: '06 OLEDs' },
  ];

  // Aggregate all depth data across topics
  const aggregatedData = useMemo(() => {
    const list: {
      topic: TopicNode;
      formulas: TopicKeyFormula[];
      numericals: TopicExamNumerical[];
      traps: string[];
      viva: { question: string; modelAnswer: string }[];
      derivationTitle: string;
    }[] = [];

    allTopics.forEach(topic => {
      const data = getTopicDepthData(topic);
      if (data && data.gateHonors) {
        list.push({
          topic,
          formulas: data.gateHonors.keyFormulas || [],
          numericals: data.gateHonors.solvedNumericals || [],
          traps: data.gateHonors.examTraps || [],
          viva: data.gateHonors.vivaQuestions || [],
          derivationTitle: data.gateHonors.derivationTitle || '',
        });
      }
    });

    return list;
  }, [allTopics]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return aggregatedData.filter(item => {
      if (selectedUnit !== 'all' && item.topic.folderId !== selectedUnit) {
        return false;
      }

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const inTitle = item.topic.title.toLowerCase().includes(q);
      const inCategory = item.topic.category.toLowerCase().includes(q);
      const inDerivation = item.derivationTitle.toLowerCase().includes(q);
      const inFormula = item.formulas.some(f => f.name.toLowerCase().includes(q) || f.formula.toLowerCase().includes(q));
      const inNumerical = item.numericals.some(n => n.problemStatement.toLowerCase().includes(q) || n.formulaUsed.toLowerCase().includes(q));
      const inTraps = item.traps.some(t => t.toLowerCase().includes(q));

      return inTitle || inCategory || inDerivation || inFormula || inNumerical || inTraps;
    });
  }, [aggregatedData, selectedUnit, searchQuery]);

  const toggleNumerical = (numId: string) => {
    setExpandedNumericals(prev => ({
      ...prev,
      [numId]: !prev[numId]
    }));
  };

  // Counts
  const totalFormulas = useMemo(() => aggregatedData.reduce((acc, i) => acc + i.formulas.length, 0), [aggregatedData]);
  const totalNumericals = useMemo(() => aggregatedData.reduce((acc, i) => acc + i.numericals.length, 0), [aggregatedData]);
  const totalTraps = useMemo(() => aggregatedData.reduce((acc, i) => acc + i.traps.length, 0), [aggregatedData]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 sm:px-10 text-zinc-200 select-text">
      {/* Header */}
      <div className="pb-6 mb-6 border-b border-[#232328]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-800/50">
                Advanced Academic & Formula Reference Hub
              </span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-xs text-zinc-400">Comprehensive Curriculum Refinement</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
              Formula Cheat Sheet & Academic Reference Hub
            </h1>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Curriculum-wide formulas, step-by-step solved numericals, analytical pitfalls, and oral defense answers across all 6 material science units.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-[#19191d] border border-[#26262e] text-center">
              <span className="font-bold text-zinc-100 block text-sm">{totalFormulas}</span>
              <span className="text-[10px] text-zinc-500 uppercase">Formulas</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#19191d] border border-[#26262e] text-center">
              <span className="font-bold text-emerald-400 block text-sm">{totalNumericals}</span>
              <span className="text-[10px] text-zinc-500 uppercase">Numericals</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#19191d] border border-[#26262e] text-center">
              <span className="font-bold text-amber-400 block text-sm">{totalTraps}</span>
              <span className="text-[10px] text-zinc-500 uppercase">Traps & Pitfalls</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search formulas, symbols, topics (e.g. Brus, Carothers, Tolerance, OLED, Mott)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161619] border border-[#27272e] rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-zinc-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Unit Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            {units.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelectedUnit(u.id)}
                className={`text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                  selectedUnit === u.id
                    ? 'bg-[#272730] text-zinc-100 font-medium border border-[#3b3b48]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1e]'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        {/* Perspective View Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#161619] border border-[#26262e] rounded-lg text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('formulas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'formulas'
                ? 'bg-[#222228] text-white font-medium border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-zinc-300" />
            <span>Formulas & SI Units</span>
          </button>

          <button
            onClick={() => setActiveTab('numericals')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'numericals'
                ? 'bg-[#222228] text-white font-medium border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-zinc-300" />
            <span>Solved Numericals</span>
          </button>

          <button
            onClick={() => setActiveTab('traps')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'traps'
                ? 'bg-[#222228] text-white font-medium border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Traps & Analysis Pitfalls</span>
          </button>

          <button
            onClick={() => setActiveTab('viva')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'viva'
                ? 'bg-[#222228] text-white font-medium border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-300" />
            <span>Viva Defense Q&A</span>
          </button>
        </div>
      </div>

      {/* DISPATCH CONTENT */}
      {filteredData.length === 0 ? (
        <div className="py-16 text-center text-zinc-500 text-xs">
          No formulas or materials matching current filters.
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: FORMULAS */}
          {activeTab === 'formulas' && (
            <div className="space-y-6">
              {filteredData.map(({ topic, formulas }) => (
                <div key={topic.id} className="p-4 rounded-xl bg-[#151518] border border-[#26262d] space-y-3">
                  <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#212128]">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                        {topic.category}
                      </span>
                      <h3 className="text-sm font-semibold text-zinc-100">{topic.title}</h3>
                    </div>
                    <button
                      onClick={() => onOpenTopicNote(topic.id)}
                      className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white hover:underline shrink-0"
                    >
                      <span>Study Note</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formulas.map((f, fIdx) => (
                      <div key={fIdx} className="p-3 rounded-lg bg-[#18181c] border border-[#27272e] space-y-1.5">
                        <span className="text-xs font-semibold text-zinc-200 block">{f.name}</span>
                        <div className="font-mono text-xs bg-[#101114] p-2 rounded text-zinc-200 border border-[#24242b] overflow-x-auto text-center">
                          {f.formula}
                        </div>
                        <div className="text-[11px] text-zinc-400 leading-tight space-y-0.5">
                          <p><strong className="text-zinc-500">Parameters:</strong> {f.parameterDefinitions}</p>
                          <p><strong className="text-zinc-500">SI Units:</strong> <span className="font-mono text-zinc-200">{f.units}</span></p>
                          {f.validityConditions && (
                            <p><strong className="text-zinc-500">Validity:</strong> {f.validityConditions}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SOLVED NUMERICALS */}
          {activeTab === 'numericals' && (
            <div className="space-y-4">
              {filteredData.flatMap(item => item.numericals.map(num => ({ ...num, topic: item.topic }))).map(num => {
                const isExpanded = !!expandedNumericals[num.id];
                return (
                  <div key={num.id} className="p-4 rounded-xl bg-[#16151b] border border-[#292534] space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/50">
                            {num.gateYearOrExam || 'Advanced Academic Model'}
                          </span>
                          <span className="text-xs text-zinc-500">•</span>
                          <span className="text-xs text-zinc-400">{num.topic.title}</span>
                        </div>
                        <h4 className="text-xs font-medium text-zinc-100 leading-relaxed">
                          {num.problemStatement}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleNumerical(num.id)}
                          className="px-2.5 py-1 text-xs rounded bg-[#24212c] text-rose-300 hover:bg-[#2d2938] border border-[#373142] flex items-center gap-1 transition-colors"
                        >
                          <span>{isExpanded ? 'Hide Steps' : 'Step-by-Step Solution'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => onOpenTopicNote(num.topic.id)}
                          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-[#202028]"
                          title="Open note"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Given Values */}
                    <div className="flex flex-wrap gap-2 text-[11px] text-zinc-400">
                      <span className="font-semibold text-zinc-500">Given Values:</span>
                      {Object.entries(num.givenValues).map(([k, v]) => (
                        <span key={k} className="px-1.5 py-0.5 rounded bg-[#1e1c24] text-zinc-300 font-mono text-[10px]">
                          {k} = {v}
                        </span>
                      ))}
                    </div>

                    {/* Solution walkthrough */}
                    {isExpanded && (
                      <div className="p-3.5 rounded-lg bg-[#111015] border border-[#262230] space-y-2.5 animate-in fade-in duration-150">
                        <div className="text-xs text-zinc-400">
                          <span className="text-zinc-500 font-semibold">Formula:</span>{' '}
                          <span className="font-mono text-rose-300">{num.formulaUsed}</span>
                        </div>

                        <div className="space-y-1 pt-1">
                          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                            Calculation Steps:
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

          {/* TAB 3: TRAPS & HAZARDS */}
          {activeTab === 'traps' && (
            <div className="space-y-4">
              {filteredData.map(({ topic, traps }) => (
                <div key={topic.id} className="p-4 rounded-xl bg-[#1e1713] border border-amber-900/50 space-y-3">
                  <div className="flex items-center justify-between gap-3 pb-2 border-b border-amber-900/30">
                    <div>
                      <span className="text-[10px] text-amber-500/80 uppercase tracking-wider block">
                        {topic.category}
                      </span>
                      <h3 className="text-sm font-semibold text-amber-200">{topic.title}</h3>
                    </div>
                    <button
                      onClick={() => onOpenTopicNote(topic.id)}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>Open Note</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {traps.map((trap, tIdx) => (
                      <div key={tIdx} className="p-2.5 rounded bg-[#17110c] border border-amber-900/40 text-xs text-amber-200/90 leading-relaxed">
                        {trap}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: VIVA VOCE */}
          {activeTab === 'viva' && (
            <div className="space-y-4">
              {filteredData.map(({ topic, viva }) => (
                <div key={topic.id} className="p-4 rounded-xl bg-[#18181c] border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between gap-3 pb-2 border-b border-zinc-800">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                        {topic.category}
                      </span>
                      <h3 className="text-sm font-semibold text-zinc-100">{topic.title}</h3>
                    </div>
                    <button
                      onClick={() => onOpenTopicNote(topic.id)}
                      className="text-xs text-zinc-300 hover:text-white hover:underline flex items-center gap-1"
                    >
                      <span>Open Note</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {viva.map((v, vIdx) => (
                      <div key={vIdx} className="p-3 rounded-lg bg-[#141416] border border-zinc-800 text-xs space-y-1">
                        <p className="font-medium text-zinc-200">
                          <span className="text-zinc-200 font-bold">Q:</span> {v.question}
                        </p>
                        <p className="text-zinc-400 pl-3 border-l border-zinc-700 leading-relaxed text-[12px]">
                          <span className="text-zinc-300 font-semibold">Model Defense:</span> {v.modelAnswer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
