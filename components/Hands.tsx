import React from 'react';
import { FingerIndex, Language } from '../types';
import { KEYBOARD_LAYOUTS, FINGER_COLORS } from '../utils/keyboardData';

interface HandsProps {
  language: Language;
  activeChar: string;
  showColors: boolean;
  lastPressedKey?: { key: string; isCorrect: boolean } | null;
}

export const Hands: React.FC<HandsProps> = ({ 
  language, 
  activeChar, 
  showColors,
  lastPressedKey 
}) => {
  const layout = KEYBOARD_LAYOUTS[language] || KEYBOARD_LAYOUTS['en'];
  
  // Find which finger is needed
  const targetChar = activeChar.toLowerCase();
  
  let targetFinger: FingerIndex | null = null;
  
  // Search layout for the finger
  // This is a bit inefficient (O(N)) but N is small (~50 keys)
  for (const row of layout.rows) {
    for (const key of row) {
      if (key.value === targetChar || key.shiftValue?.toLowerCase() === targetChar || (targetChar === ' ' && key.value === ' ')) {
        targetFinger = key.finger;
        break;
      }
    }
    if (targetFinger !== null) break;
  }

  // Determine color for each finger
  const getFingerFill = (fingerId: FingerIndex) => {
    // If this finger is the target
    if (targetFinger === fingerId) {
       // If user just pressed wrong with ANY finger, show Red on target? 
       // Or if user pressed THIS finger correctly?
       if (lastPressedKey && lastPressedKey.isCorrect) {
          return '#4ade80'; // Success Flash
       }
       return showColors ? FINGER_COLORS[fingerId] : '#aaa'; // Highlight
    }
    return 'transparent'; // Idle
  };

  const getFingerStroke = (fingerId: FingerIndex) => {
    if (targetFinger === fingerId) return '#000';
    return '#555';
  };
  
  const getFingerOpacity = (fingerId: FingerIndex) => {
    if (targetFinger === fingerId) return 1;
    return 0.3;
  };

  // SVG Paths (Simplified Blocky Hands)
  const renderHand = (side: 'left' | 'right') => {
    const isLeft = side === 'left';
    // Mappings: L: 01234, R: 56789
    const fPinky = isLeft ? 0 : 9;
    const fRing = isLeft ? 1 : 8;
    const fMiddle = isLeft ? 2 : 7;
    const fIndex = isLeft ? 3 : 6;
    const fThumb = isLeft ? 4 : 5;

    // Flip transform for right hand
    const transform = isLeft ? '' : 'scale(-1, 1) translate(-200, 0)';

    return (
      <svg width="200" height="200" viewBox="0 0 200 200" className="w-32 h-32 md:w-48 md:h-48 pixel-art-svg">
        <g transform={transform}>
           {/* Wrist / Palm Base */}
           <rect x="60" y="140" width="80" height="60" fill="#ddd" stroke="#000" strokeWidth="4" />
           
           {/* Thumb (4/5) */}
           <path 
             d="M140 160 L180 140 L190 110 L160 110 L130 140 Z" 
             fill={getFingerFill(fThumb)} stroke={getFingerStroke(fThumb)} strokeWidth="4"
             className={targetFinger === fThumb ? 'animate-pulse' : ''}
           />
           
           {/* Index (3/6) */}
           <rect 
              x="115" y="60" width="25" height="80" rx="4"
              fill={getFingerFill(fIndex)} stroke={getFingerStroke(fIndex)} strokeWidth="4"
              className={targetFinger === fIndex ? 'animate-pulse' : ''}
           />
           
           {/* Middle (2/7) */}
           <rect 
              x="85" y="40" width="25" height="100" rx="4"
              fill={getFingerFill(fMiddle)} stroke={getFingerStroke(fMiddle)} strokeWidth="4"
              className={targetFinger === fMiddle ? 'animate-pulse' : ''}
           />

           {/* Ring (1/8) */}
           <rect 
              x="55" y="50" width="25" height="90" rx="4"
              fill={getFingerFill(fRing)} stroke={getFingerStroke(fRing)} strokeWidth="4"
              className={targetFinger === fRing ? 'animate-pulse' : ''}
           />

           {/* Pinky (0/9) */}
           <rect 
              x="25" y="80" width="25" height="60" rx="4"
              fill={getFingerFill(fPinky)} stroke={getFingerStroke(fPinky)} strokeWidth="4"
              className={targetFinger === fPinky ? 'animate-pulse' : ''}
           />
        </g>
      </svg>
    );
  };

  return (
    <div className="flex justify-between items-center w-full max-w-5xl px-4 md:px-10 mt-4 pointer-events-none opacity-80">
      <div className="transition-all duration-200">
        {renderHand('left')}
      </div>
      <div className="transition-all duration-200">
        {renderHand('right')}
      </div>
    </div>
  );
};
