export interface LeaderboardEntry {
  id: string;
  username: string;
  wpm: number;
  accuracy: number;
  date: string;
  duration: TimeOption;
  mode: Mode;
  language: Language;
}

export type TimeOption = 15 | 30 | 60 | 'infinity';
export type Mode = 'words' | 'sentences' | 'mixed';
export type Language = 'de' | 'en' | 'es' | 'fr' | 'it' | 'nl';

export interface TestStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

// Keyboard Types
export type HandSide = 'left' | 'right';
export type FingerIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; 
// 0-3: L-Pinky to L-Index, 4: L-Thumb
// 5: R-Thumb, 6-9: R-Index to R-Pinky

export interface KeyDef {
  label: string;
  value: string; // The primary char (lowercase)
  shiftValue?: string; // Uppercase or symbol
  finger: FingerIndex;
  width?: number; // Relative width (1 is standard key)
  altValue?: string; // For AltGr
}

export interface KeyboardLayout {
  id: string;
  name: string;
  rows: KeyDef[][];
}
