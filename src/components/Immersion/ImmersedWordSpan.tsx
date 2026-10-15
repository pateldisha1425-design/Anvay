import React, { useState, useRef } from 'react';
import { MarathiVocabularyItem, ImmersionScript } from '../../types/immersion';
import { Volume2, BookOpen, Sparkles, Check, X } from 'lucide-react';

interface ImmersedWordSpanProps {
  item: MarathiVocabularyItem;
  scriptMode?: ImmersionScript;
  showTooltip?: boolean;
  onPracticeWord?: (wordId: string) => void;
}

export const ImmersedWordSpan: React.FC<ImmersedWordSpanProps> = ({
  item,
  scriptMode = 'both',
  showTooltip = true,
  onPracticeWord,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(item.marathiWord);
      utterance.lang = 'mr-IN';
      utterance.rate = 0.85;

      const voices = window.speechSynthesis.getVoices();
      const marathiVoice = voices.find(v => v.lang === 'mr-IN' || v.lang.startsWith('mr') || v.lang === 'hi-IN');
      if (marathiVoice) {
        utterance.voice = marathiVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(`${item.marathiWord} (${item.transliteration}) - ${item.englishEquivalent}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const handleSpanClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileSheetOpen(prev => !prev);
  };

  return (
    <>
      <span 
        className="relative inline-block cursor-pointer sm:cursor-help group touch-manipulation"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleSpanClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsMobileSheetOpen(prev => !prev);
          }
        }}
        aria-label={`Marathi term: ${item.marathiWord}, English: ${item.englishEquivalent}`}
      >
        <span className="inline-flex items-baseline gap-1 px-1 py-0.5 mx-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border-b border-dotted border-amber-400/60 transition-colors font-medium text-[13px] leading-relaxed">
          {/* Devanagari */}
          {(scriptMode === 'devanagari' || scriptMode === 'both') && (
            <span className="font-normal font-sans text-amber-300">
              {item.marathiWord}
            </span>
          )}

          {/* Latin Transliteration */}
          {(scriptMode === 'latin' || scriptMode === 'both') && (
            <span className="text-[11px] text-zinc-400 font-mono tracking-tight">
              {scriptMode === 'both' ? `[${item.transliteration}]` : item.transliteration}
            </span>
          )}
        </span>

        {/* Desktop Obsidian-Style Hover Tooltip (Hidden on small touchscreens) */}
        {showTooltip && isHovered && (
          <span 
            className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-[#19191d] border border-[#2e2e36] rounded-lg shadow-2xl z-50 text-left text-xs select-none animate-in fade-in-50 duration-100"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-[#25252a] pb-1.5 mb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-amber-300 font-sans">
                    {item.marathiWord}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    ({item.transliteration})
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase tracking-wider">
                  {item.scientificDomain} • {item.partOfSpeech}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleSpeak}
                  className="p-1 text-zinc-400 hover:text-amber-300 hover:bg-[#25252c] rounded transition-colors"
                  title="Pronounce Marathi word (Audio)"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Meaning & Definition */}
            <div className="space-y-1 mb-2">
              <div className="text-[11px] text-zinc-200">
                <span className="text-zinc-500">English Equivalent: </span>
                <strong className="text-zinc-100 font-medium">{item.englishEquivalent}</strong>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {item.definition}
              </p>
            </div>

            {/* Context Note */}
            <div className="p-1.5 rounded bg-[#131316] border border-[#232328] text-[10px] text-zinc-400 leading-normal mb-2">
              <strong className="text-zinc-300 block mb-0.5">Scientific Usage:</strong>
              {item.scientificContext}
            </div>

            {/* Example Sentence */}
            <div className="border-t border-[#25252a] pt-1.5 text-[10px] text-zinc-400 space-y-0.5">
              <div className="text-zinc-300 font-sans">{item.exampleSentenceDevanagari}</div>
              <div className="text-zinc-500 italic">{item.exampleSentenceEnglish}</div>
            </div>

            {/* Actions */}
            {onPracticeWord && (
              <div className="mt-2.5 pt-2 border-t border-[#25252a] flex items-center justify-between">
                <button
                  onClick={() => onPracticeWord(item.id)}
                  className="text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-medium hover:underline"
                >
                  <Sparkles className="w-3 h-3" />
                  Practice word
                </button>
                <button
                  onClick={handleCopy}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300"
                >
                  {isCopied ? 'Copied' : 'Copy gloss'}
                </button>
              </div>
            )}

            {/* Tooltip pointer arrow */}
            <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#2e2e36]" />
          </span>
        )}
      </span>

      {/* Mobile Tap-To-Open Bottom Card with Audio Playback & Full Details */}
      {isMobileSheetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-xs select-none p-0 sm:p-4"
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileSheetOpen(false);
          }}
        >
          <div
            className="w-full max-w-lg bg-[#18181b] border-t sm:border border-[#2e2e36] rounded-t-2xl sm:rounded-xl shadow-2xl p-4 sm:p-5 text-left text-xs animate-in slide-in-from-bottom-4 duration-150 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Pull Bar */}
            <div className="w-8 h-1 rounded-full bg-zinc-600 mx-auto mb-3 sm:hidden" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#25252a] pb-2.5 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-amber-300 font-sans">
                    {item.marathiWord}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    ({item.transliteration})
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono mt-0.5 uppercase tracking-wider">
                  {item.scientificDomain} • {item.partOfSpeech}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSpeak}
                  className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-lg transition-colors touch-manipulation"
                  title="Pronounce Marathi word (Audio)"
                  aria-label="Listen pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMobileSheetOpen(false)}
                  className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#25252b] rounded-lg transition-colors touch-manipulation"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Meaning & Definition */}
            <div className="space-y-1.5 mb-3">
              <div className="text-xs text-zinc-200">
                <span className="text-zinc-500">English Equivalent: </span>
                <strong className="text-zinc-100 font-semibold">{item.englishEquivalent}</strong>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {item.definition}
              </p>
            </div>

            {/* Context Note */}
            <div className="p-2.5 rounded-lg bg-[#131316] border border-[#232328] text-[11px] text-zinc-300 leading-relaxed mb-3">
              <strong className="text-zinc-200 block mb-0.5 font-medium">Scientific Usage:</strong>
              {item.scientificContext}
            </div>

            {/* Example Sentence with Devanagari typography support */}
            <div className="border-t border-[#25252a] pt-2 text-xs text-zinc-300 space-y-1">
              <div className="font-sans leading-relaxed text-zinc-200">{item.exampleSentenceDevanagari}</div>
              <div className="text-zinc-400 italic text-[11px]">{item.exampleSentenceEnglish}</div>
            </div>

            {/* Actions */}
            <div className="mt-3.5 pt-2.5 border-t border-[#25252a] flex items-center justify-between gap-2">
              {onPracticeWord && (
                <button
                  onClick={() => {
                    setIsMobileSheetOpen(false);
                    onPracticeWord(item.id);
                  }}
                  className="min-h-[44px] flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-medium transition-colors touch-manipulation"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Practice word</span>
                </button>
              )}
              <button
                onClick={handleCopy}
                className="min-h-[44px] px-3.5 py-1.5 rounded-lg bg-[#24242a] hover:bg-[#2c2c32] text-zinc-300 text-xs transition-colors touch-manipulation"
              >
                {isCopied ? 'Copied!' : 'Copy gloss'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
