import React, { useMemo } from 'react';
import { KEYBOARD_LAYOUTS, FINGER_COLORS } from '../utils/keyboardData';
import { Language, KeyDef } from '../types';

interface VirtualKeyboardProps {
  language: Language;
  activeChar: string;
  showLabels: boolean;
  showColors: boolean;
  lastPressedKey?: { key: string; isCorrect: boolean } | null;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ 
  language, 
  activeChar, 
  showLabels, 
  showColors,
  lastPressedKey 
}) => {
  const layout = KEYBOARD_LAYOUTS[language] || KEYBOARD_LAYOUTS['en'];

  // Normalize char for comparison
  const target = activeChar === ' ' ? ' ' : activeChar.toLowerCase();

  const getKeyStyle = (key: KeyDef) => {
    // Is this key the target?
    const isTarget = key.value.toLowerCase() === target || key.shiftValue?.toLowerCase() === target;
    
    // Was this key just pressed?
    const isPressed = lastPressedKey?.key.toLowerCase() === key.value.toLowerCase();
    
    let bg = showColors ? FINGER_COLORS[key.finger] : '#eee';
    let borderColor = '#999';
    let transform = '';
    let boxShadow = '2px 2px 0px 0px rgba(0,0,0,0.3)';

    // Dark mode adjustments handled via Tailwind classes in render, but inline colors need logic
    if (isTarget) {
      borderColor = '#000';
      boxShadow = '0px 0px 8px 2px rgba(255, 153, 0, 0.6)'; // Glow
      transform = 'scale(0.95)';
    }

    if (isPressed) {
       if (lastPressedKey?.isCorrect) {
         bg = '#4ade80'; // Green
       } else {
         bg = '#f87171'; // Red
       }
       transform = 'translate(2px, 2px)';
       boxShadow = '0px 0px 0px 0px rgba(0,0,0,0)';
    }

    return {
      backgroundColor: bg,
      flexGrow: key.width || 1,
      width: `${(key.width || 1) * 40}px`,
      borderColor,
      transform,
      boxShadow
    };
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg pixel-shadow w-full max-w-5xl mx-auto overflow-x-auto">
      {layout.rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center min-w-max">
          {row.map((key, keyIndex) => {
            const style = getKeyStyle(key);
            const isTarget = key.value.toLowerCase() === target || key.shiftValue?.toLowerCase() === target;
            
            return (
              <div
                key={`${rowIndex}-${keyIndex}`}
                className={`
                  h-10 md:h-12 flex items-center justify-center border-b-4 border-r-4 border-t-2 border-l-2 text-black font-pixel text-sm md:text-xl select-none transition-all duration-75
                  ${isTarget ? 'z-10 animate-pulse' : ''}
                `}
                style={style}
              >
                {showLabels ? (
                   <span>{key.shiftValue && showLabels ? <span className="text-[10px] absolute top-1 left-1 opacity-60">{key.shiftValue}</span> : null} {key.label}</span>
                ) : (
                   /* Blank keys mode */
                   <span></span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
