import React, { useState, useMemo } from 'react';
import { MarathiVocabularyItem } from '../../types/immersion';
import { MARATHI_VOCABULARY } from '../../data/marathiVocabulary';
import { recordWordPracticeResult } from '../../utils/immersionEngine';
import { 
  X, 
  Volume2, 
  Sparkles, 
  RotateCw, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  GraduationCap, 
  Award,
  Layers
} from 'lucide-react';

interface VocabularyPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWordId?: string;
}

export const VocabularyPracticeModal: React.FC<VocabularyPracticeModalProps> = ({
  isOpen,
  onClose,
  initialWordId,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialWordId) {
      const idx = MARATHI_VOCABULARY.findIndex(w => w.id === initialWordId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());

  const currentWord: MarathiVocabularyItem | undefined = MARATHI_VOCABULARY[currentIndex];

  if (!isOpen || !currentWord) return null;

  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'mr-IN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    recordWordPracticeResult(currentWord.id, isCorrect);

    if (isCorrect && !answeredIds.has(currentWord.id)) {
      setCorrectCount(prev => prev + 1);
    }
    setAnsweredIds(prev => new Set(prev).add(currentWord.id));

    // Advance to next card
    if (currentIndex < MARATHI_VOCABULARY.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % MARATHI_VOCABULARY.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + MARATHI_VOCABULARY.length) % MARATHI_VOCABULARY.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-100">
      <div 
        className="w-full max-w-lg max-h-[92vh] bg-[#161619] border border-[#2d2d34] rounded-xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-3 border-b border-[#25252a] bg-[#141416]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-100 text-sm">
                Vocabulary Flashcard Practice
              </h3>
              <span className="text-[10px] text-zinc-500 font-sans">
                मराठी तांत्रिक शब्द सराव • Card {currentIndex + 1} of {MARATHI_VOCABULARY.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-[11px] text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Score: {correctCount}/{answeredIds.size}
            </div>
            <button
              onClick={onClose}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-[#202025] rounded transition-colors touch-manipulation"
              aria-label="Close practice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Arena */}
        <div className="p-3.5 sm:p-6 flex-1 overflow-y-auto flex flex-col items-center">
          {/* Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[190px] sm:min-h-[220px] rounded-xl border border-[#2b2b32] bg-[#1a1a1e] hover:border-amber-500/50 p-4 sm:p-6 flex flex-col justify-between cursor-pointer transition-all shadow-lg text-center relative group"
          >
            {/* Top Card Badge */}
            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
              <span>{currentWord.scientificDomain}</span>
              <span className="text-zinc-500 flex items-center gap-1 group-hover:text-amber-300 transition-colors">
                <RotateCw className="w-3 h-3" /> Click to flip
              </span>
            </div>

            {/* Front Side: Devanagari Script & Transliteration */}
            {!isFlipped ? (
              <div className="my-auto py-4 space-y-2">
                <div className="text-3xl font-bold text-amber-300 font-sans tracking-wide">
                  {currentWord.marathiWord}
                </div>
                <div className="text-sm text-zinc-400 font-mono">
                  [{currentWord.transliteration}]
                </div>
                <button
                  onClick={(e) => handleSpeak(currentWord.marathiWord, e)}
                  className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-300 px-2.5 py-1 rounded bg-[#222228] hover:bg-[#2a2a32] mt-2 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Listen Pronunciation</span>
                </button>
              </div>
            ) : (
              /* Back Side: English Equivalent & Scientific Definition */
              <div className="my-auto py-2 text-left space-y-2">
                <div>
                  <div className="text-[11px] text-zinc-500">English Equivalent:</div>
                  <div className="text-xl font-bold text-zinc-100">
                    {currentWord.englishEquivalent}
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {currentWord.definition}
                </p>

                <div className="p-2 rounded bg-[#131316] border border-[#26262c] text-[11px] text-zinc-400">
                  <strong className="text-zinc-300 block mb-0.5">Scientific Usage:</strong>
                  {currentWord.scientificContext}
                </div>

                <div className="text-[11px] text-zinc-400 pt-1 border-t border-[#25252a]">
                  <span className="text-zinc-300 font-sans">{currentWord.exampleSentenceDevanagari}</span>
                  <div className="text-zinc-500 italic text-[10px]">{currentWord.exampleSentenceEnglish}</div>
                </div>
              </div>
            )}

            <div className="text-[10px] text-zinc-500 font-mono">
              Part of Speech: {currentWord.partOfSpeech} • {currentWord.difficulty}
            </div>
          </div>

          {/* Self-Rating Response Buttons */}
          <div className="w-full flex items-center justify-between gap-3 mt-5">
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 min-h-[44px] py-2 px-3 rounded-lg bg-[#222228] hover:bg-[#2c2c34] text-zinc-300 text-xs font-medium border border-[#303038] transition-colors touch-manipulation flex items-center justify-center"
            >
              Still Learning
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 min-h-[44px] py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-medium border border-emerald-500/40 transition-colors flex items-center justify-center gap-1.5 touch-manipulation"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Got It / Mastered</span>
            </button>
          </div>

          {/* Previous / Next Navigation */}
          <div className="w-full flex items-center justify-between mt-4 pt-3 border-t border-[#232328] text-xs text-zinc-500">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 hover:text-zinc-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <span className="font-mono text-[11px]">
              {currentIndex + 1} / {MARATHI_VOCABULARY.length}
            </span>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 hover:text-zinc-200 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
