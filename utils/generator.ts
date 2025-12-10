import { LANGUAGE_DATA } from '../constants';
import { Mode, Language } from '../types';

function getRandomItem(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSentence(lang: Language): string[] {
  const data = LANGUAGE_DATA[lang].sentenceParts;
  const structure = Math.random();
  
  let parts: string[] = [];
  
  // Simple Grammar Templates
  // 1. Subject + Verb + Object (SVO)
  // 2. Subject + Verb + Adjective (SVA)
  // 3. Adverb + Subject + Verb + Object (ASVO)
  
  const subj = getRandomItem(data.subjects);
  const verb = getRandomItem(data.verbs);
  
  if (structure < 0.5) {
    // SVO
    const obj = getRandomItem(data.objects);
    parts = [subj, verb, obj];
  } else if (structure < 0.8) {
    // SVA
    const adj = getRandomItem(data.adjectives);
    parts = [subj, "ist", adj]; // "ist" acts as 'is', simplifying for other langs might need specific 'to be' verb, but let's approximate
    // Correction: "ist" is German. We need language specific "is". 
    // To keep it robust without complex conjugation, let's stick to Subject + Verb + Object for all langs 
    // or Subject + Verb + Adverb/Adjective if the verb list supports it.
    // Our verb lists are action verbs mostly. Let's stick to SVO for robustness across languages.
    const obj = getRandomItem(data.objects);
    parts = [subj, verb, obj];
  } else {
    // ASVO
    const adv = getRandomItem(data.adverbs);
    // Capitalize first letter of adverb, lowercase subject if needed (simple case: just concat)
    const obj = getRandomItem(data.objects);
    
    // In German/Dutch, verb usually comes 2nd (V2 rule). "Heute sieht der Hund..."
    if (lang === 'de' || lang === 'nl') {
        parts = [adv, verb, subj, obj];
    } else {
        parts = [adv, subj, verb, obj];
    }
  }

  // Join parts and add punctuation
  let sentenceStr = parts.join(' ') + '.';
  
  // Return as split words to be compatible with the TypingArea logic
  return sentenceStr.split(' ');
}

export const generateContent = (mode: Mode, lang: Language, count: number = 200): string[] => {
  const data = LANGUAGE_DATA[lang];
  let result: string[] = [];

  if (mode === 'words') {
    for (let i = 0; i < count; i++) {
      result.push(getRandomItem(data.words));
    }
  } else if (mode === 'sentences') {
    // Generate sentences until we have enough words
    while (result.length < count) {
      const sentenceWords = generateSentence(lang);
      result.push(...sentenceWords);
    }
  } else if (mode === 'mixed') {
    while (result.length < count) {
      if (Math.random() > 0.5) {
        // Add a sentence
        const sentenceWords = generateSentence(lang);
        result.push(...sentenceWords);
      } else {
        // Add random words (3-6)
        const wordCount = 3 + Math.floor(Math.random() * 4);
        for (let i = 0; i < wordCount; i++) {
          result.push(getRandomItem(data.words));
        }
      }
    }
  }

  // Cap exact length to avoid massive overflows if loops run long
  return result.slice(0, count);
};
