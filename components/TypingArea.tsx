import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Mode, Language, TimeOption, TestStats } from '../types';
import { Button } from './Button';
import { VirtualKeyboard } from './VirtualKeyboard';
import { Hands } from './Hands';
import { audioService } from '../services/audioService';
import { generateText } from '../utils/textGenerator';

interface TypingAreaProps {
  duration: TimeOption;
  mode: Mode;
  language: Language;
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
  onComplete: (stats: TestStats) => void;
  t: any;
  binaryMode?: boolean;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  duration,
  mode,
  language,
  isActive,
  onStart,
  onStop,
  onComplete,
  t,
  binaryMode = false,
}) => {
  const [input, setInput] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(typeof duration === 'number' ? duration : 0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastPressed, setLastPressed] = useState<string | null>(null);
  
  // State für das manuelle Hochscrollen
  const [lineOffset, setLineOffset] = useState(0);

  // UI States
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showHands, setShowHands] = useState(true);
  const [showKeyLabels, setShowKeyLabels] = useState(true);
  const [showFingerColors, setShowFingerColors] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialisiere Text & Reset Scroll-Position
  useEffect(() => {
    setWords(generateText(mode, language, binaryMode).split(''));
    setLineOffset(0);
    setInput('');
    setStartTime(null);
    setElapsedTime(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    if (typeof duration === 'number') setTimeLeft(duration);
  }, [mode, language, binaryMode, duration]);

  // Timer Logik
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && (duration === 'infinity' || timeLeft > 0)) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        if (duration !== 'infinity') {
          setTimeLeft((prev) => prev - 1);
        }
      }, 1000);
    } else if (duration !== 'infinity' && timeLeft === 0 && isActive) {
      handleFinish();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, duration]);

  // Globaler Key-Listener (Fokus-Retter)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const isTypingElsewhere = 
        document.activeElement?.tagName === 'INPUT' && 
        document.activeElement !== inputRef.current;
      if (isTypingElsewhere) return;

      if (e.key.length === 1 || e.key === 'Backspace') {
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    inputRef.current?.focus();
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // ... dein bestehender Code für Start, Hits, Sounds ...

    setInput(value);

    // --- GLOBAL-SAFE SCROLL LOGIK ---
    setTimeout(() => {
      const container = containerRef.current;
      const currentEl = container?.querySelector('.current-char') as HTMLElement;
      
      if (container && currentEl) {
        // Holen uns die exakte Position auf dem Monitor
        const containerRect = container.getBoundingClientRect();
        const charRect = currentEl.getBoundingClientRect();

        // Abstand des Cursors vom oberen Rand des sichtbaren Kastens
        const relativeTop = charRect.top - containerRect.top;

        // DEBUGGING: Aktiviere dies, um in der F12-Konsole die Werte zu sehen
        // console.log('Abstand oben:', relativeTop, 'Aktueller Offset:', lineOffset);

        // Wenn der Cursor tiefer als die Mitte des Kastens (ca. 100px) fällt
        if (relativeTop > 110) {
          // Wir schieben den Text um eine Zeile hoch
          setLineOffset(prev => prev + 45); 
        }

        // Falls du mit Backspace Zeilen löschst:
        if (relativeTop < 40 && lineOffset > 0) {
          setLineOffset(prev => Math.max(0, prev - 45));
        }
      }
    }, 0);
    
    if (value.length === words.length) {
      handleFinish();
    }
  };

    // --- FINALE SCROLL-LOGIK ---
    setTimeout(() => {
      const container = containerRef.current;
      const currentEl = container?.querySelector('.current-char') as HTMLElement;
      
      if (container && currentEl) {
        const containerRect = container.getBoundingClientRect();
        const charRect = currentEl.getBoundingClientRect();

        // Wir berechnen, wie weit der Cursor vom oberen Rand des Kastens entfernt ist
        const relativeTop = charRect.top - containerRect.top;

        // Wenn der Cursor tiefer als 100px (ca. Mitte des Feldes) wandert
        if (relativeTop > 110) {
          // Wir schieben den Text um eine Zeilenhöhe hoch
          setLineOffset(prev => prev + 45);
        }
        
        // Backspace-Check: Wenn man hochlöscht und über den oberen Rand (32px padding) kommt
        if (relativeTop < 40 && lineOffset > 0) {
          setLineOffset(prev => Math.max(0, prev - 45));
        }
      }
    }, 0);

    if (value.length === words.length) {
      handleFinish();
    }
  };
  
    // Treffer-Logik & Sound
    if (value.length > input.length) {
      const lastChar = value.slice(-1);
      const expectedChar = words[value.length - 1];
      if (lastChar === expectedChar) {
        setCorrectChars((prev) => prev + 1);
        audioService.playKeyPress();
      } else {
        setIncorrectChars((prev) => prev + 1);
        audioService.playError();
      }
      setLastPressed(lastChar);
    }

    setInput(value);

    // --- ROBUSTE ZEILEN-SCROLL LOGIK ---
    setTimeout(() => {
      if (containerRef.current) {
        const container = containerRef.current;
        const currentEl = container.querySelector('.current-char') as HTMLElement;
        
        if (currentEl) {
          const charOffsetTop = currentEl.offsetTop;
          // Wenn der Cursor weiter unten als 100px ist (relativ zum Textanfang),
          // aber unser Sichtfeld nur 160px hoch ist, schieben wir hoch.
          const threshold = 100; 
          
          if (charOffsetTop - lineOffset > threshold) {
            setLineOffset(prev => prev + 42); // Schiebt exakt eine Zeile hoch
          }
          
          // Backspace-Logik: Wieder hochscrollen, wenn man zurücklöscht
          if (charOffsetTop - lineOffset < 40 && lineOffset > 0) {
            setLineOffset(prev => Math.max(0, prev - 42));
          }
        }
      }
    }, 0);

    if (value.length === words.length) {
      handleFinish();
    }
  };

  const handleFinish = () => {
    const timeSpent = duration === 'infinity' ? elapsedTime : (duration as number) - timeLeft;
    const stats: TestStats = {
      wpm: liveWpm,
      accuracy: Math.round((correctChars / (correctChars + incorrectChars)) * 100) || 0,
      errors: incorrectChars,
      time: timeSpent,
      chars: input.length
    };
    onComplete(stats);
    onStop();
  };

  const liveWpm = useMemo(() => {
    const timeElapsed = duration === 'infinity' ? elapsedTime : (duration as number) - timeLeft;
    if (timeElapsed === 0) return 0;
    return Math.round((correctChars / 5) / (timeElapsed / 60));
  }, [correctChars, timeLeft, elapsedTime, duration]);

  const renderText = () => {
    return (
      <div 
        className="flex flex-wrap gap-x-[0.2ch] gap-y-3 text-2xl leading-relaxed select-none transition-all duration-300 ease-in-out"
        style={{ marginTop: `-${lineOffset}px` }}
      >
        {words.map((char, index) => {
          let colorClass = "text-gray-400";
          const isTyped = index < input.length;
          const isCurrent = index === input.length;

          if (isTyped) {
            colorClass = input[index] === words[index] ? "text-retro-primary" : "text-retro-error underline";
          }

          return (
            <span
              key={index}
              className={`relative ${colorClass} ${isCurrent ? 'current-char' : ''}`}
            >
              {char}
              {isCurrent && (
                <span className="absolute left-0 -bottom-1 w-full h-1 bg-retro-accent animate-pulse"></span>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  const nextChar = words[input.length] || null;

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* HUD (Stats oben) */}
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
        
        <div className="flex items-center gap-4">
          {isActive && (
            <Button variant="danger" size="sm" onClick={handleFinish} className="animate-pulse">
              {t.stop.toUpperCase()}
            </Button>
          )}

          <div className="flex gap-2 text-xs">
            <button onClick={() => setShowKeyboard(!showKeyboard)} className={`p-1 border ${showKeyboard ? 'bg-retro-primary text-white' : 'bg-gray-200 text-gray-500'}`}>⌨️</button>
            <button onClick={() => setShowHands(!showHands)} className={`p-1 border ${showHands ? 'bg-retro-primary text-white' : 'bg-gray-200 text-gray-500'}`}>✋</button>
            <button onClick={() => setShowKeyLabels(!showKeyLabels)} className={`p-1 border ${showKeyLabels ? 'bg-retro-primary text-white' : 'bg-gray-200 text-gray-500'}`}>ABC</button>
            <button onClick={() => setShowFingerColors(!showFingerColors)} className={`p-1 border ${showFingerColors ? 'bg-retro-primary text-white' : 'bg-gray-200 text-gray-500'}`}>🎨</button>
          </div>
        </div>
      </div>

      {/* Typing Field (Das Herzstück) */}
      <div 
        ref={containerRef}
        className="relative bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-400 p-8 h-[160px] pixel-shadow cursor-text overflow-hidden"
        onClick={() => inputRef.current?.focus()}
      >
        {!isActive && (duration === 'infinity' || timeLeft === duration) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 z-20 p-4 text-center">
            <span className="text-xl animate-pulse text-gray-500 dark:text-gray-300">
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

      {/* Visual Helpers (Keyboard/Hands) */}
      <div className="flex flex-col items-center gap-2">
        {showHands && <Hands language={language} activeChar={nextChar} showColors={showFingerColors} lastPressedKey={lastPressed} />}
        {showKeyboard && <VirtualKeyboard language={language} activeChar={nextChar} showLabels={showKeyLabels} showColors={showFingerColors} lastPressedKey={lastPressed} />}
      </div>
    </div>
  );
};
