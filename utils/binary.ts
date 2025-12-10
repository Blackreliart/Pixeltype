export const toBinary = (text: string): string => {
  return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
};

export const wordToBinary = (text: string): string => {
   return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
}

export const convertTranslationsToBinary = (translations: Record<string, string>): Record<string, string> => {
  const converted: Record<string, string> = {};
  for (const key in translations) {
    converted[key] = toBinary(translations[key]);
  }
  return converted;
};
