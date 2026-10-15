export type ImmersionLevel = 'none' | 'introductory' | 'intermediate' | 'advanced' | 'beginner';

export type ImmersionScript = 'devanagari' | 'latin' | 'both';

export interface SavedVocabularyItem {
  wordId: string;
  savedAt: string;
  mastered: boolean;
  timesReviewed: number;
  lastReviewedAt?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface ImmersionQuizAttempt {
  id: string;
  timestamp: string;
  score: number;
  totalQuestions: number;
  level: string;
}

export interface MarathiVocabularyItem {
  id: string;
  marathiWord: string; // Devanagari (e.g. पदार्थ)
  transliteration: string; // Latin phonetics (e.g. Padārtha)
  englishEquivalent: string; // English keyword (e.g. Material / Substance)
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'concept';
  scientificDomain: 'Materials Science' | 'Oxides & Ceramics' | 'Polymers' | 'Nanotechnology' | 'Optoelectronics' | 'General Science' | 'Crystallography';
  definition: string;
  scientificContext: string;
  etymology?: string; // Root etymology (e.g. Sanskrit Pada + Artha)
  exampleSentenceDevanagari: string;
  exampleSentenceEnglish: string;
  audioPronunciationText?: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

export interface ImmersionSettings {
  enabled?: boolean;
  isEnabled?: boolean;
  level: ImmersionLevel;
  script?: ImmersionScript;
  showTransliteration?: boolean;
  showTooltips?: boolean;
  pronunciationAudio?: boolean;
  highlightStyle?: string;
  showDevanagari?: boolean;
}

export interface WordPracticeState {
  wordId: string;
  timesSeen: number;
  timesPracticed: number;
  correctAnswers: number;
  isMastered: boolean;
  lastPracticedAt?: string;
}

export interface ImmersionProgressSummary {
  totalWords: number;
  wordsEncountered: number;
  wordsPracticed: number;
  wordsMastered: number;
  masteryPercentage: number;
}
