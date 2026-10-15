import React from 'react';
import { 
  ImmersionSettings, 
  ImmersionLevel, 
  MarathiVocabularyItem,
  WordPracticeState,
  ImmersionProgressSummary 
} from '../types/immersion';
import { MARATHI_VOCABULARY } from '../data/marathiVocabulary';
import { ImmersedWordSpan } from '../components/Immersion/ImmersedWordSpan';

const STORAGE_KEYS = {
  SETTINGS: 'anvay_immersion_settings_v1',
  PROGRESS: 'anvay_immersion_progress_v1',
};

export const DEFAULT_IMMERSION_SETTINGS: ImmersionSettings = {
  enabled: true,
  level: 'introductory',
  script: 'both',
  showTransliteration: true,
  showTooltips: true,
  pronunciationAudio: true,
};

export function getStoredImmersionSettings(): ImmersionSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_IMMERSION_SETTINGS, ...JSON.parse(raw) } : DEFAULT_IMMERSION_SETTINGS;
  } catch {
    return DEFAULT_IMMERSION_SETTINGS;
  }
}

export function saveStoredImmersionSettings(settings: ImmersionSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save immersion settings', err);
  }
}

export function getStoredWordProgress(): Record<string, WordPracticeState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordWordEncounter(wordId: string): void {
  try {
    const current = getStoredWordProgress();
    const existing = current[wordId] || {
      wordId,
      timesSeen: 0,
      timesPracticed: 0,
      correctAnswers: 0,
      isMastered: false,
    };
    current[wordId] = {
      ...existing,
      timesSeen: existing.timesSeen + 1,
    };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to record word encounter', err);
  }
}

export function recordWordPracticeResult(wordId: string, isCorrect: boolean): void {
  try {
    const current = getStoredWordProgress();
    const existing = current[wordId] || {
      wordId,
      timesSeen: 1,
      timesPracticed: 0,
      correctAnswers: 0,
      isMastered: false,
    };
    const newPracticed = existing.timesPracticed + 1;
    const newCorrect = existing.correctAnswers + (isCorrect ? 1 : 0);
    const isMastered = newCorrect >= 3 && (newCorrect / newPracticed) >= 0.75;

    current[wordId] = {
      ...existing,
      timesPracticed: newPracticed,
      correctAnswers: newCorrect,
      isMastered,
      lastPracticedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to record word practice result', err);
  }
}

export function getImmersionProgressSummary(): ImmersionProgressSummary {
  const progress = getStoredWordProgress();
  const totalWords = MARATHI_VOCABULARY.length;
  let encountered = 0;
  let practiced = 0;
  let mastered = 0;

  MARATHI_VOCABULARY.forEach(item => {
    const p = progress[item.id];
    if (p) {
      if (p.timesSeen > 0) encountered++;
      if (p.timesPracticed > 0) practiced++;
      if (p.isMastered) mastered++;
    }
  });

  const masteryPercentage = totalWords > 0 ? Math.round((mastered / totalWords) * 100) : 0;

  return {
    totalWords,
    wordsEncountered: encountered,
    wordsPracticed: practiced,
    wordsMastered: mastered,
    masteryPercentage,
  };
}

/**
 * Filter vocabulary items based on immersion level
 */
function getActiveVocabularyForLevel(level: ImmersionLevel): MarathiVocabularyItem[] {
  if (level === 'none') return [];
  if (level === 'introductory') {
    return MARATHI_VOCABULARY.filter(w => w.difficulty === 'basic');
  }
  if (level === 'intermediate') {
    return MARATHI_VOCABULARY.filter(w => w.difficulty === 'basic' || w.difficulty === 'intermediate');
  }
  return MARATHI_VOCABULARY;
}

/**
 * Parses markdown/plain text and replaces matching technical terms with ImmersedWordSpan
 */
export function applyImmersionToText(
  text: string,
  settings: ImmersionSettings = DEFAULT_IMMERSION_SETTINGS,
  onPracticeWord?: (wordId: string) => void
): React.ReactNode[] {
  if (!settings.enabled || settings.level === 'none') {
    return [text];
  }

  const activeWords = getActiveVocabularyForLevel(settings.level);
  if (activeWords.length === 0) {
    return [text];
  }

  // Build regex matching English terms as whole words
  const terms = activeWords.map(w => w.englishEquivalent);
  const regexPattern = new RegExp(`\\b(${terms.join('|')})(?:s|es)?\\b`, 'gi');

  const parts = text.split(regexPattern);
  const result: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    if (!part) return;

    const matchedItem = activeWords.find(
      w => w.englishEquivalent.toLowerCase() === part.toLowerCase() ||
           `${w.englishEquivalent.toLowerCase()}s` === part.toLowerCase() ||
           `${w.englishEquivalent.toLowerCase()}es` === part.toLowerCase()
    );

    if (matchedItem) {
      result.push(
        <ImmersedWordSpan
          key={`immersed-${matchedItem.id}-${index}`}
          item={matchedItem}
          scriptMode={settings.script}
          showTooltip={settings.showTooltips}
          onPracticeWord={onPracticeWord}
        />
      );
    } else {
      result.push(part);
    }
  });

  return result;
}
