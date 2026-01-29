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
  
  // State für das zeilenweise Verschieben des Textes
  const [lineOffset, setLineOffset] = useState(0);

  // UI States
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showHands, setShowHands] = useState(true);
  const [showKeyLabels, setShowKeyLabels] = useState(true);
  const [showFingerColors, setShowFingerColors] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset bei neuem Spiel
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

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && (duration === 'infinity' || timeLeft > 0)) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        if (duration !== 'infinity') setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (duration !== 'infinity' && timeLeft === 0 && isActive) {
      handleFinish();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, duration]);

  // Globaler Key-Listener für Auto-Fokus
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.activeElement?.tagName === 'INPUT' && document.activeElement !== inputRef.current) return;
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
    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
      onStart();
    }

    if (value.length > input.length) {
      const char = value.slice(-1);
      if (char === words[value.length - 1]) {
        setCorrectChars(prev => prev + 1);
        audioService.playKeyPress();
      } else {
        setIncorrectChars(prev => prev + 1);
        audioService.playError();
      }
      setLastPressed(char);
    }
    setInput(value);

    // --- DIE NEUE SCROLL-LOGIK ---
    setTimeout(() => {
      if (containerRef.current) {
        const currentEl = containerRef.current.querySelector('.current-char') as HTMLElement;
        if (currentEl) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const charRect = currentEl.getBoundingClientRect();
          const relativeTop = charRect.top - containerRect.top;

          // Sobald der Cursor tiefer als die Mitte des 160px hohen Kastens rutscht
          if (relativeTop > 100) {
            setLineOffset(prev => prev + 45); // Schiebe Text um eine Zeile hoch
          }
          // Backspace-Support: Wieder runterrollen
          if (relativeTop < 40 && lineOffset > 0) {
            setLineOffset(prev => Math.max(0, prev - 45));
          }
        }
      }
    }, 0);

    if (value.length === words.length) handleFinish();
  };

  const handleFinish = () => {
    const timeSpent = duration === 'infinity' ? elapsedTime : (duration as number) - timeLeft;
    onComplete({
      wpm: liveWpm,
      accuracy: Math.round((correctChars / (correctChars + incorrectChars)) * 100) || 0,
      errors: incorrectChars,
      time: timeSpent,
      chars: input.length
    });
    onStop();
  };

  const liveWpm = useMemo(() => {
    const time = duration === 'infinity' ? elapsedTime : (duration as number) - timeLeft;
    return time > 0 ? Math.round((correctChars / 5) / (time / 60)) : 0;
  }, [correctChars, timeLeft, elapsedTime, duration]);

  const renderText = () => (
    <div className="flex flex-wrap gap-x-[0.2ch] gap-y-4 text-2xl leading-relaxed select-none">
      {words.map((char, index) => {
        let color = "text-gray-400";
        const isTyped = index < input.length;
        const isCurrent = index === input.length;
        if (isTyped) color = input[index] === words[index] ? "text-retro-primary" : "text-retro-error underline";

        return (
          <span key={index} className={`relative ${color} ${isCurrent ? 'current-char' : ''}`}>
            {char}
            {isCurrent && <span className="absolute left-0 -bottom-1 w-full h-1 bg-retro-accent animate-pulse" />}
          </span>
        );
      })}
    </div>
  );

  const nextChar = words[input.length] || null;

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* HUD */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-retro-panel dark:bg-retro-darkPanel p-4 border-2 border-black dark:border-white pixel-shadow">
        <div className="flex gap-4 md:gap-8 text-xl">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase">{t.time}</span>
            <span className={timeLeft < 5 && duration !== 'infinity' ? 'text-retro-error' : ''}>
              {duration === 'infinity' ? `${elapsedTime}s` : `${timeLeft}s`}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase">{t.wpm}</span>
            <span>{liveWpm}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase">{t.accuracy}</span>
            <span>{correctChars + incorrectChars > 0 ? Math.round((correctChars / (correctChars + incorrectChars)) * 100) : 100}%</span>
          </div>
        </div>
        <div className="flex gap-2">
          {isActive && <Button variant="danger" size="sm" onClick={handleFinish}>{t.stop}</Button>}
          <div className="flex gap-1">
            <button onClick={() => setShowKeyboard(!showKeyboard)} className="p-1 border bg-gray-200">⌨️</button>
            <button onClick={() => setShowHands(!showHands)} className="p-1 border bg-gray-200">✋</button>
          </div>
        </div>
      </div>

      {/* TYPING FIELD - Der entscheidende Teil */}
      <div 
        ref={containerRef}
        className="relative bg-white dark:bg-gray-800 border-2 border-black p-8 h-[160px] w-full overflow-hidden pixel-shadow"
        onClick={() => inputRef.current?.focus()}
      >
        {!isActive && (duration === 'infinity' || timeLeft === duration) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-20 text-xl animate-pulse text-gray-500">
            {t.start_placeholder}
          </div>
        )}

        {/* Dieser Div "slidet" den Text nach oben */}
        <div 
          className="transition-all duration-300 ease-in-out" 
          style={{ marginTop: `-${lineOffset}px` }}
        >
          {renderText()}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          className="absolute inset-0 opacity-0 cursor-default"
          autoComplete="off"
          spellCheck="false"
        />
      </div>

      {/* Helpers */}
      <div className="flex flex-col items-center gap-4">
        {showHands && <Hands language={language} activeChar={nextChar} showColors={showFingerColors} lastPressedKey={lastPressed} />}
        {showKeyboard && <VirtualKeyboard language={language} activeChar={nextChar} showLabels={showKeyLabels} showColors={showFingerColors} lastPressedKey={lastPressed} />}
      </div>
    </div>
  );
};
