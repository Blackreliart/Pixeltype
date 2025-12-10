import { KeyboardLayout, FingerIndex, KeyDef, Language } from '../types';

// Finger mapping helpers
// Left Hand: 0: Pinky, 1: Ring, 2: Middle, 3: Index, 4: Thumb
// Right Hand: 5: Thumb, 6: Index, 7: Middle, 8: Ring, 9: Pinky

const k = (label: string, value: string, finger: FingerIndex, width = 1, shiftValue?: string): KeyDef => ({
  label, value, finger, width, shiftValue
});

// Helper to generate space row based on language convention
const getSpaceRow = (ctrlLabel: string, altLabel: string = "Alt"): KeyDef[] => [
  k(ctrlLabel, "", 0, 1.5),
  k(altLabel, "", 4, 1.2),
  k("Space", " ", 5, 6), // Mapped to R-Thumb (5) but functionally both
  k("AltGr", "", 5, 1.2),
  k(ctrlLabel, "", 9, 1.5),
];

// --- GERMAN (QWERTZ) ---
const deLayout: KeyboardLayout = {
  id: 'de',
  name: 'German QWERTZ',
  rows: [
    [
      k("^", "^", 0), k("1", "1", 0, 1, "!"), k("2", "2", 1, 1, '"'), k("3", "3", 2, 1, "§"), k("4", "4", 3, 1, "$"), k("5", "5", 3, 1, "%"),
      k("6", "6", 6, 1, "&"), k("7", "7", 6, 1, "/"), k("8", "8", 7, 1, "("), k("9", "9", 8, 1, ")"), k("0", "0", 9, 1, "="), k("ß", "ß", 9, 1, "?"), k("´", "´", 9)
    ],
    [
      k("Tab", "Tab", 0, 1.5), k("Q", "q", 0), k("W", "w", 1), k("E", "e", 2), k("R", "r", 3), k("T", "t", 3),
      k("Z", "z", 6), k("U", "u", 6), k("I", "i", 7), k("O", "o", 8), k("P", "p", 9), k("Ü", "ü", 9), k("+", "+", 9, 1, "*"), k("Ent", "Enter", 9, 1.2)
    ],
    [
      k("Caps", "", 0, 1.8), k("A", "a", 0), k("S", "s", 1), k("D", "d", 2), k("F", "f", 3), k("G", "g", 3),
      k("H", "h", 6), k("J", "j", 6), k("K", "k", 7), k("L", "l", 8), k("Ö", "ö", 9), k("Ä", "ä", 9), k("#", "#", 9, 1, "'")
    ],
    [
      k("Shft", "Shift", 0, 1.2), k("<", "<", 0, 1, ">"), k("Y", "y", 0), k("X", "x", 1), k("C", "c", 2), k("V", "v", 3), k("B", "b", 3),
      k("N", "n", 6), k("M", "m", 6), k(",", ",", 7, 1, ";"), k(".", ".", 8, 1, ":"), k("-", "-", 9, 1, "_"), k("Shft", "Shift", 9, 2.5)
    ],
    getSpaceRow("Strg")
  ]
};

// --- ENGLISH (QWERTY) ---
const enLayout: KeyboardLayout = {
  id: 'en',
  name: 'English QWERTY',
  rows: [
    [
      k("`", "`", 0, 1, "~"), k("1", "1", 0, 1, "!"), k("2", "2", 1, 1, "@"), k("3", "3", 2, 1, "#"), k("4", "4", 3, 1, "$"), k("5", "5", 3, 1, "%"),
      k("6", "6", 6, 1, "^"), k("7", "7", 6, 1, "&"), k("8", "8", 7, 1, "*"), k("9", "9", 8, 1, "("), k("0", "0", 9, 1, ")"), k("-", "-", 9, 1, "_"), k("=", "=", 9, 1, "+"), k("Bksp", "Backspace", 9, 1.5)
    ],
    [
      k("Tab", "Tab", 0, 1.5), k("Q", "q", 0), k("W", "w", 1), k("E", "e", 2), k("R", "r", 3), k("T", "t", 3),
      k("Y", "y", 6), k("U", "u", 6), k("I", "i", 7), k("O", "o", 8), k("P", "p", 9), k("[", "[", 9, 1, "{"), k("]", "]", 9, 1, "}"), k("\\", "\\", 9, 1, "|")
    ],
    [
      k("Caps", "", 0, 1.8), k("A", "a", 0), k("S", "s", 1), k("D", "d", 2), k("F", "f", 3), k("G", "g", 3),
      k("H", "h", 6), k("J", "j", 6), k("K", "k", 7), k("L", "l", 8), k(";", ";", 9, 1, ":"), k("'", "'", 9, 1, '"'), k("Ent", "Enter", 9, 2)
    ],
    [
      k("Shft", "Shift", 0, 2.3), k("Z", "z", 0), k("X", "x", 1), k("C", "c", 2), k("V", "v", 3), k("B", "b", 3),
      k("N", "n", 6), k("M", "m", 6), k(",", ",", 7, 1, "<"), k(".", ".", 8, 1, ">"), k("/", "/", 9, 1, "?"), k("Shft", "Shift", 9, 2.5)
    ],
    getSpaceRow("Ctrl")
  ]
};

// --- FRENCH (AZERTY) ---
const frLayout: KeyboardLayout = {
  id: 'fr',
  name: 'French AZERTY',
  rows: [
    [
      k("²", "²", 0), k("&", "&", 0, 1, "1"), k("é", "é", 1, 1, "2"), k('"', '"', 2, 1, "3"), k("'", "'", 3, 1, "4"), k("(", "(", 3, 1, "5"),
      k("-", "-", 6, 1, "6"), k("è", "è", 6, 1, "7"), k("_", "_", 7, 1, "8"), k("ç", "ç", 8, 1, "9"), k("à", "à", 9, 1, "0"), k(")", ")", 9, 1, "°"), k("=", "=", 9, 1, "+")
    ],
    [
      k("Tab", "Tab", 0, 1.5), k("A", "a", 0), k("Z", "z", 1), k("E", "e", 2), k("R", "r", 3), k("T", "t", 3),
      k("Y", "y", 6), k("U", "u", 6), k("I", "i", 7), k("O", "o", 8), k("P", "p", 9), k("^", "^", 9), k("$", "$", 9)
    ],
    [
      k("Caps", "", 0, 1.8), k("Q", "q", 0), k("S", "s", 1), k("D", "d", 2), k("F", "f", 3), k("G", "g", 3),
      k("H", "h", 6), k("J", "j", 6), k("K", "k", 7), k("L", "l", 8), k("M", "m", 9), k("ù", "ù", 9), k("*", "*", 9)
    ],
    [
      k("Shft", "Shift", 0, 1.2), k("<", "<", 0, 1, ">"), k("W", "w", 0), k("X", "x", 1), k("C", "c", 2), k("V", "v", 3), k("B", "b", 3),
      k("N", "n", 6), k(",", ",", 6, 1, "?"), k(";", ";", 7, 1, "."), k(":", ":", 8, 1, "/"), k("!", "!", 9, 1, "§"), k("Shft", "Shift", 9, 2.5)
    ],
    getSpaceRow("Ctrl")
  ]
};

// --- SPANISH (QWERTY + Ñ) ---
const esLayout: KeyboardLayout = {
  id: 'es',
  name: 'Spanish QWERTY',
  rows: [
    [
      k("º", "º", 0), k("1", "1", 0, 1, "!"), k("2", "2", 1, 1, '"'), k("3", "3", 2, 1, "·"), k("4", "4", 3, 1, "$"), k("5", "5", 3, 1, "%"),
      k("6", "6", 6, 1, "&"), k("7", "7", 6, 1, "/"), k("8", "8", 7, 1, "("), k("9", "9", 8, 1, ")"), k("0", "0", 9, 1, "="), k("'", "'", 9, 1, "?"), k("¡", "¡", 9, 1, "¿")
    ],
    [
      k("Tab", "Tab", 0, 1.5), k("Q", "q", 0), k("W", "w", 1), k("E", "e", 2), k("R", "r", 3), k("T", "t", 3),
      k("Y", "y", 6), k("U", "u", 6), k("I", "i", 7), k("O", "o", 8), k("P", "p", 9), k("`", "`", 9, 1, "^"), k("+", "+", 9, 1, "*")
    ],
    [
      k("Caps", "", 0, 1.8), k("A", "a", 0), k("S", "s", 1), k("D", "d", 2), k("F", "f", 3), k("G", "g", 3),
      k("H", "h", 6), k("J", "j", 6), k("K", "k", 7), k("L", "l", 8), k("Ñ", "ñ", 9), k("´", "´", 9, 1, "¨"), k("Ç", "ç", 9)
    ],
    [
      k("Shft", "Shift", 0, 1.2), k("<", "<", 0, 1, ">"), k("Z", "z", 0), k("X", "x", 1), k("C", "c", 2), k("V", "v", 3), k("B", "b", 3),
      k("N", "n", 6), k("M", "m", 6), k(",", ",", 7, 1, ";"), k(".", ".", 8, 1, ":"), k("-", "-", 9, 1, "_"), k("Shft", "Shift", 9, 2.5)
    ],
    getSpaceRow("Ctrl")
  ]
};

// Reusing layouts where similarities are high (simplification for the assignment)
const itLayout = { ...esLayout, id: 'it', name: 'Italian QWERTY' }; // Italian is very similar to ES physically
const nlLayout = { ...enLayout, id: 'nl', name: 'Dutch QWERTY' }; // Dutch uses US Intl often

export const KEYBOARD_LAYOUTS: Record<Language, KeyboardLayout> = {
  de: deLayout,
  en: enLayout,
  es: esLayout,
  fr: frLayout,
  it: itLayout,
  nl: nlLayout,
};

// Finger colors for CSS
export const FINGER_COLORS: Record<FingerIndex, string> = {
  0: '#ffadad', // L Pinky - Red
  1: '#ffd6a5', // L Ring - Orange
  2: '#fdffb6', // L Middle - Yellow
  3: '#caffbf', // L Index - Green
  4: '#e0e0e0', // L Thumb - Grey
  5: '#e0e0e0', // R Thumb - Grey
  6: '#9bf6ff', // R Index - Cyan
  7: '#a0c4ff', // R Middle - Blue
  8: '#bdb2ff', // R Ring - Indigo
  9: '#ffc6ff', // R Pinky - Purple
};
