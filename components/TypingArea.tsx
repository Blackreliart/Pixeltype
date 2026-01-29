import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TimeOption, TestStats, Mode, Language } from '../types';
import { audioService } from '../services/audioService';
import { generateContent } from '../utils/generator';
import { VirtualKeyboard } from './VirtualKeyboard';
import { Hands } from './Hands';
import { Button } from './Button';
import { wordToBinary } from '../utils/binary';

interface TypingAreaProps {
  duration: TimeOption;
  mode: Mode;
  language: Language;
  isActive: boolean;
  onComplete: (stats: TestStats) => void;
  onStart: () => void;
  onStop: () => void;
  t: Record<string, string>;
  binaryMode: boolean;
}

export const TypingArea: React.FC<TypingAreaProps> = ({ 
  duration, 
  mode, 
  language, 
  isActive, 
  onComplete, 
  onStart, 
  onStop,
  t,
  binaryMode
}) => {
  const [words, setWords] = useState<string[]>([]);
  const [input, setInput] = useState('');
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(typeof duration === 'number' ? duration : 0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // UI Toggles
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showHands, setShowHands] = useState(true);
  const [showKeyLabels, setShowKeyLabels] = useState(true);
  const [showFingerColors, setShowFingerColors] = useState(true);

  // Stats tracking
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Feedback state for visuals
  const [lastPressed, setLastPressed] = useState<{key: string, isCorrect: boolean} | null>(null);

  // Generate words on mount or reset
  const generate = useCallback(() => {
    // Generate more words for infinity mode to prevent running out quickly
    const count = duration === 'infinity' ? 1000 : 300;
    const newWords = generateContent(mode, language, count);
    
    if (binaryMode) {
      setWords(newWords.map(w => wordToBinary(w)));
    } else {
      setWords(newWords);
    }
  }, [mode, language, duration, binaryMode]);

  useEffect(() => {
    generate();
  }, [generate]);

  // Reset when duration, mode, or language changes
  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, mode, language, binaryMode]); // Add binaryMode to reset if it toggles

  const resetGame = () => {
    setInput('');
    setTimeLeft(typeof duration === 'number' ? duration : 0);
    setElapsedTime(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setStartTime(null);
    setLastPressed(null);
    if (!isActive && inputRef.current) inputRef.current.blur();
  };

  // Timer Logic
  useEffect(() => {
    let interval: number;
    if (isActive) {
      interval = window.setInterval(() => {
        if (duration === 'infinity') {
          setElapsedTime(prev => prev + 1);
        } else {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              handleFinish();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, timeLeft, duration]);

  // Sorgt dafür, dass man IMMER tippen kann, auch wenn man daneben geklickt hat
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // 1. Ignoriere System-Tasten wie F5, F12, Cmd+R etc.
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // 2. Prüfe, ob der User gerade in einem ANDEREN Feld schreibt (z.B. Name im Leaderboard)
      const isTypingElsewhere = 
        document.activeElement?.tagName === 'INPUT' && 
        document.activeElement !== inputRef.current;

      if (isTypingElsewhere) return;

      // 3. Wenn es eine normale Taste ist, erzwinge den Fokus auf das Tipp-Feld
      if (e.key.length === 1 || e.key === 'Backspace') {
        inputRef.current?.focus();
      }
    };

    // Event-Listener beim Start registrieren
    window.addEventListener('keydown', handleGlobalKeyDown);
    
    // Wichtig: Beim Schließen der Komponente wieder aufräumen
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []); // Leeres Array = Läuft dauerhaft im Hintergrund

// Auto-focus input immediately and keep it focused
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive, words]); // Fokusiert beim Start und wenn neue Wörter geladen werden

  // Clear feedback animation
  useEffect(() => {
    if (lastPressed) {
      const timer = setTimeout(() => setLastPressed(null), 200);
      return () => clearTimeout(timer);
    }
  }, [lastPressed]);

  const handleFinish = () => {
    onStop();
    audioService.playSuccess();
    
    // Calculate final stats
    let effectiveMinutes: number;
    if (duration === 'infinity') {
       effectiveMinutes = elapsedTime > 0 ? elapsedTime / 60 : 1/60;
    } else {
       effectiveMinutes = duration / 60; 
    }

    const wpm = Math.round((correctChars / 5) / effectiveMinutes);
    const total = correctChars + incorrectChars;
    const accuracy = total > 0 ? Math.round((correctChars / total) * 100) : 0;

    onComplete({
      wpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalChars: total
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    
    if (!isActive) {
      onStart();
      setStartTime(Date.now());
    }

    const flatText = words.join(' ');
    
    // Check key press
    if (newVal.length > input.length) {
      const charIndex = newVal.length - 1;
      const expected = flatText[charIndex];
      const actual = newVal[charIndex];
      const isCorrect = expected === actual;

      if (isCorrect) {
        audioService.playKeypress();
        setCorrectChars(prev => prev + 1);
      } else {
        audioService.playError();
        setIncorrectChars(prev => prev + 1);
      }
      
      setLastPressed({ key: actual, isCorrect });
    }

    setInput(newVal);

    // Scroll logic
    const wordsTyped = newVal.split(' ').length;
    if (wordsTyped > 8) { 
       if (containerRef.current) {
          const lineHeight = 40; 
          const estimatedLines = Math.floor(newVal.length / 45); 
          if (estimatedLines > 1) {
            containerRef.current.scrollTop = (estimatedLines - 1) * lineHeight;
          }
       }
    }
  };

  // Render text logic
  const renderText = () => {
    const flatText = words.join(' ');
    const chars = flatText.split('');
    
    return (
      <div className={`flex flex-wrap text-3xl leading-relaxed font-pixel select-none ${binaryMode ? 'break-all text-xl' : ''}`} style={{ wordBreak: binaryMode ? 'break-all' : 'break-word' }}>
        {chars.map((char, index) => {
          let statusClass = "text-gray-400 dark:text-gray-600";
          let isCursor = false;

          if (index < input.length) {
            if (input[index] === char) {
              statusClass = "text-retro-darkPanel dark:text-white"; 
            } else {
              statusClass = "text-retro-error bg-red-100 dark:bg-red-900/30"; 
            }
          } else if (index === input.length) {
             isCursor = true;
          }

          return (
            <span key={index} className={`${statusClass} relative`}>
              {isCursor && (
                <span className="absolute left-0 -bottom-1 w-full h-1 bg-retro-accent cursor-blink"></span>
              )}
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </div>
    );
  };

  // Determine active char for visuals
  const flatText = words.join(' ');
  const nextChar = flatText[input.length] || '';

  // Calculate live WPM
  const currentMinutes = duration === 'infinity' ? (elapsedTime / 60) : ((typeof duration === 'number' ? duration - timeLeft : 0) / 60);
  const liveWpm = currentMinutes > 0 ? Math.round((correctChars / 5) / currentMinutes) : 0;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      
      {/* HUD */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-retro-panel dark:bg-retro-darkPanel p-4 border-2 border-black dark:border-white pixel-shadow">
        <div className="flex gap-4 md:gap-8 text-xl">
          <div className="flex flex-col">
             <span className="text-xs uppercase text-gray-500">{t.time}</span>
             <span className={`text-3xl ${timeLeft < 5 && duration !== 'infinity' ? 'text-retro-error' : ''}`}>
               {duration === 'infinity' ? `${elapsedTime}s` : `${timeLeft}s`}
             </span>
          </div>
          <div className="flex flex-col">
             <span className="text-xs uppercase text-gray-500">{t.wpm}</span>
             <span className="text-3xl">{liveWpm}</span>
          </div>
          <div className="flex flex-col">
             <span className="text-xs uppercase text-gray-500">{t.accuracy}</span>
             <span className="text-3xl">{correctChars + incorrectChars > 0 ? Math.round((correctChars / (correctChars + incorrectChars)) * 100) : 100}%</span>
          </div>
        </div>
        
        {/* Controls Right Side */}
        <div className="flex items-center gap-4">
          {/* Manual Finish Button (Useful for Infinity Mode) */}
          {isActive && (
            <Button variant="danger" size="sm" onClick={handleFinish} className="animate-pulse">
              {t.stop.toUpperCase()}
            </Button>
          )}

          {/* Visual Options Toggles */}
          <div className="flex gap-2 text-xs">
            <button 
              onClick={() => setShowKeyboard(!showKeyboard)} 
              className={`p-1 border ${showKeyboard ? 'bg-retro-primary text-white' : 'bg-gray-200 text-gray-500'}`}
              title={t.toggle_keyboard || "Keyboard"}
            >
              ⌨️
            </button>
            <button 
              onClick={() => setShowHands(!showHands)} 
              className={`p-1 border ${showHands ? 'bg-retro-primary text-white' : 'bg-gray-200 text-gray-500'}`}
              title={t.toggle_hands || "Hands"}
            >
              ✋
            </button>
            <button 
              onClick={() => setShowKeyLabels(!showKeyLabels)} 
              className={`p-1 border ${showKeyLabels ? 'bg-retro-primary text-white' : 'bg-gray-200 text-gray-500'}`}
              title={t.toggle_labels || "Labels"}
            >
              ABC
            </button>
            <button 
              onClick={() => setShowFingerColors(!showFingerColors)} 
              className={`p-1 border ${showFingerColors ? 'bg-retro-primary text-white' : 'bg-gray-200 text-gray-500'}`}
              title={t.toggle_colors || "Colors"}
            >
              🎨
            </button>
          </div>
        </div>
      </div>

      {/* Typing Field */}
      <div 
        className="relative bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-400 p-8 min-h-[150px] max-h-[250px] pixel-shadow cursor-text overflow-hidden"
        onClick={() => inputRef.current?.focus()}
        ref={containerRef}
      >
        {!isActive && (duration === 'infinity' || timeLeft === duration) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 z-10 p-4 text-center">
            <span className={`text-xl animate-pulse text-gray-500 dark:text-gray-300 ${binaryMode ? 'break-all' : ''}`}>
               {t.start_placeholder}
            </span>
          </div>
        )}

        {renderText()}
        
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          className="absolute opacity-0 top-0 left-0 w-full h-full cursor-default"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          disabled={duration !== 'infinity' && timeLeft === 0}
        />
      </div>

      {/* Visual Helpers */}
      <div className="flex flex-col items-center gap-2">
        {showHands && (
          <Hands 
            language={language}
            activeChar={nextChar}
            showColors={showFingerColors}
            lastPressedKey={lastPressed}
          />
        )}
        
        {showKeyboard && (
          <VirtualKeyboard 
            language={language}
            activeChar={nextChar}
            showLabels={showKeyLabels}
            showColors={showFingerColors}
            lastPressedKey={lastPressed}
          />
        )}
      </div>
    </div>
  );
};
