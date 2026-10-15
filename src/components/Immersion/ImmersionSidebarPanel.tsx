import React, { useState } from 'react';
import { 
  ImmersionSettings, 
  ImmersionLevel, 
  ImmersionScript, 
  MarathiVocabularyItem 
} from '../../types/immersion';
import { MARATHI_VOCABULARY, searchMarathiVocabulary, getVocabularyByDomain } from '../../data/marathiVocabulary';
import { getImmersionProgressSummary } from '../../utils/immersionEngine';
import { 
  Languages, 
  Sparkles, 
  Volume2, 
  Search, 
  CheckCircle2, 
  BookOpen, 
  GraduationCap, 
  Flame,
  Layers,
  Settings2,
  ChevronRight
} from 'lucide-react';

interface ImmersionSidebarPanelProps {
  settings: ImmersionSettings;
  onUpdateSettings: (updates: Partial<ImmersionSettings>) => void;
  onOpenPracticeModal: () => void;
  onSelectWord?: (word: MarathiVocabularyItem) => void;
}

export const ImmersionSidebarPanel: React.FC<ImmersionSidebarPanelProps> = ({
  settings,
  onUpdateSettings,
  onOpenPracticeModal,
  onSelectWord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'settings'>('vocabulary');

  const summary = getImmersionProgressSummary();
  const filteredVocabulary = searchMarathiVocabulary(searchQuery).filter(item => 
    selectedDomain === 'all' || item.scientificDomain === selectedDomain
  );

  const handleSpeak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'mr-IN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#18181a] select-none text-zinc-300 text-xs">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#232326] bg-[#151517]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Languages className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-200 text-xs tracking-tight">
              Marathi Immersion
            </h3>
            <span className="text-[10px] text-zinc-500 font-sans block">
              तांत्रिक परिभाषा कोश
            </span>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 p-0.5 bg-[#1f1f24] rounded border border-[#2b2b32]">
          <button
            onClick={() => setActiveTab('vocabulary')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
              activeTab === 'vocabulary'
                ? 'bg-[#292931] text-amber-300'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Glossary
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#292931] text-amber-300'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {activeTab === 'settings' ? (
          /* SETTINGS TAB */
          <div className="space-y-4">
            {/* Enable/Disable Toggle */}
            <div className="p-3 rounded-lg bg-[#141416] border border-[#24242a] flex items-center justify-between">
              <div>
                <strong className="text-zinc-200 text-xs block">Enable Immersion</strong>
                <span className="text-[10px] text-zinc-500">Inject dual Marathi vocabulary into note text</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => onUpdateSettings({ enabled: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Immersion Level */}
            <div className="p-3 rounded-lg bg-[#141416] border border-[#24242a] space-y-2">
              <label className="text-zinc-400 text-[11px] font-medium block">
                Immersion Depth:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['none', 'introductory', 'intermediate', 'advanced'] as ImmersionLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => onUpdateSettings({ level: lvl })}
                    className={`py-1.5 px-2 rounded text-[11px] capitalize border text-left transition-colors ${
                      settings.level === lvl
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-medium'
                        : 'bg-[#1b1b20] text-zinc-400 border-[#26262d] hover:text-zinc-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Script Format */}
            <div className="p-3 rounded-lg bg-[#141416] border border-[#24242a] space-y-2">
              <label className="text-zinc-400 text-[11px] font-medium block">
                Script Display:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['both', 'devanagari', 'latin'] as ImmersionScript[]).map((sc) => (
                  <button
                    key={sc}
                    onClick={() => onUpdateSettings({ script: sc })}
                    className={`py-1 px-1.5 rounded text-[10px] capitalize border text-center transition-colors ${
                      settings.script === sc
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-medium'
                        : 'bg-[#1b1b20] text-zinc-400 border-[#26262d] hover:text-zinc-200'
                    }`}
                  >
                    {sc === 'both' ? 'Dual (Both)' : sc === 'devanagari' ? 'मराठी Script' : 'Phonetic'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tooltip & Audio */}
            <div className="p-3 rounded-lg bg-[#141416] border border-[#24242a] space-y-2.5">
              <label className="text-zinc-400 text-[11px] font-medium block">
                Interactive Aids:
              </label>

              <label className="flex items-center justify-between cursor-pointer text-[11px] text-zinc-300">
                <span>Show Hover Definitions</span>
                <input
                  type="checkbox"
                  checked={settings.showTooltips}
                  onChange={(e) => onUpdateSettings({ showTooltips: e.target.checked })}
                  className="w-3.5 h-3.5 accent-amber-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-[11px] text-zinc-300">
                <span>Native Speech Audio</span>
                <input
                  type="checkbox"
                  checked={settings.pronunciationAudio}
                  onChange={(e) => onUpdateSettings({ pronunciationAudio: e.target.checked })}
                  className="w-3.5 h-3.5 accent-amber-500"
                />
              </label>
            </div>
          </div>
        ) : (
          /* VOCABULARY TAB */
          <div className="space-y-3">
            {/* Progress Card */}
            <div className="p-3 rounded-lg bg-radial-[at_top_left] from-amber-950/30 to-[#141416] border border-amber-500/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">
                  Vocabulary Mastery
                </span>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  {summary.masteryPercentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${summary.masteryPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-2.5">
                <span>Mastered: <strong className="text-zinc-200">{summary.wordsMastered}</strong></span>
                <span>Practiced: <strong className="text-zinc-200">{summary.wordsPracticed}</strong></span>
                <span>Total: <strong className="text-zinc-200">{summary.totalWords}</strong></span>
              </div>

              {/* Practice Flashcards CTA */}
              <button
                onClick={onOpenPracticeModal}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded font-medium text-xs transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Practice Flashcards</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Marathi or English terms..."
                className="w-full bg-[#131316] border border-[#25252b] rounded-md pl-7 pr-2.5 py-1 text-[11px] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Domain Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 text-[10px]">
              {['all', 'Materials Science', 'Crystallography', 'Polymers', 'Optoelectronics'].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDomain(d)}
                  className={`px-2 py-0.5 rounded whitespace-nowrap transition-colors ${
                    selectedDomain === d
                      ? 'bg-[#282830] text-amber-300 font-medium'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {d === 'all' ? 'All' : d}
                </button>
              ))}
            </div>

            {/* Glossary Word List */}
            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-0.5">
              {filteredVocabulary.length === 0 ? (
                <div className="p-4 text-center text-zinc-500 text-[11px]">
                  No matching vocabulary found.
                </div>
              ) : (
                filteredVocabulary.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectWord && onSelectWord(item)}
                    className="p-2.5 sm:p-2 rounded bg-[#151518] border border-[#222227] hover:border-amber-500/40 transition-colors cursor-pointer group touch-manipulation"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-amber-300 font-sans text-xs">
                          {item.marathiWord}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          [{item.transliteration}]
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleSpeak(item.marathiWord, e)}
                        className="p-1.5 min-h-[32px] min-w-[32px] flex items-center justify-center text-zinc-400 hover:text-amber-300 opacity-80 group-hover:opacity-100 transition-opacity touch-manipulation"
                        title="Pronounce word"
                        aria-label={`Pronounce ${item.marathiWord}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-zinc-200 mt-0.5">
                      {item.englishEquivalent}
                    </div>

                    <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                      {item.definition}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
