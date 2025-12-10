import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, TimeOption, TestStats, Mode, Language } from './types';
import { STORAGE_KEY } from './constants';
import { TypingArea } from './components/TypingArea';
import { Leaderboard } from './components/Leaderboard';
import { ResultsModal } from './components/ResultsModal';
import { Button } from './components/Button';
import { audioService } from './services/audioService';
import { TRANSLATIONS } from './utils/translations';
import { convertTranslationsToBinary } from './utils/binary';

const LANGUAGE_STORAGE_KEY = "pixeltype_language";
const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

enum View {
  GAME = 'GAME',
  LEADERBOARD = 'LEADERBOARD',
}

function App() {
  // Global State
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentView, setCurrentView] = useState<View>(View.GAME);
  const [binaryMode, setBinaryMode] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);
  
  // Game State
  const [duration, setDuration] = useState<TimeOption>(30);
  const [mode, setMode] = useState<Mode>('words');
  const [language, setLanguage] = useState<Language>('de');
  const [isGameActive, setIsGameActive] = useState(false);
  const [lastStats, setLastStats] = useState<TestStats | null>(null);
  
  // Data State
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Init
  useEffect(() => {
    // Load theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    
    // Load leaderboard
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setLeaderboard(JSON.parse(stored));
    }

    // Load Language
    const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    if (storedLang && ['de', 'en', 'es', 'fr', 'it', 'nl'].includes(storedLang)) {
        setLanguage(storedLang);
    }
  }, []);

  // Konami Code Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If binary mode is already active, we don't need to listen
      if (binaryMode) return;

      const key = e.key;
      const expectedKey = KONAMI_CODE[konamiIndex];

      if (key.toLowerCase() === expectedKey.toLowerCase()) {
        const nextIndex = konamiIndex + 1;
        if (nextIndex === KONAMI_CODE.length) {
          setBinaryMode(true);
          setKonamiIndex(0);
          audioService.playSuccess(); // Little audio cue
        } else {
          setKonamiIndex(nextIndex);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex, binaryMode]);

  // Theme toggle effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sound toggle effect
  useEffect(() => {
    audioService.toggle(soundEnabled);
  }, [soundEnabled]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }

  const handleGameStart = () => {
    setIsGameActive(true);
  };

  const handleGameStop = () => {
    setIsGameActive(false);
  };

  const handleGameComplete = (stats: TestStats) => {
    setIsGameActive(false);
    setLastStats(stats);
  };

  const saveScore = (name: string) => {
    if (!lastStats) return;

    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      username: name,
      wpm: lastStats.wpm,
      accuracy: lastStats.accuracy,
      date: new Date().toISOString(),
      duration: duration,
      mode: mode,
      language: language
    };

    const newBoard = [...leaderboard, newEntry]
      .sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy)
      .slice(0, 50); // Keep top 50

    setLeaderboard(newBoard);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBoard));
    setLastStats(null);
    setCurrentView(View.LEADERBOARD);
  };

  const resetLeaderboard = () => {
    if (confirm(t.confirm_reset)) {
      setLeaderboard([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Prepare translations
  const rawTranslations = TRANSLATIONS[language];
  const t = binaryMode ? convertTranslationsToBinary(rawTranslations) : rawTranslations;

  return (
    <div className={`min-h-screen flex flex-col font-pixel ${binaryMode ? 'font-mono' : ''}`}>
      {/* Header */}
      <header className="p-4 border-b-4 border-black dark:border-white bg-retro-panel dark:bg-retro-darkPanel flex flex-wrap justify-between items-center gap-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView(View.GAME)}>
            <div className="w-8 h-8 bg-retro-primary"></div>
            <h1 className="text-3xl font-bold tracking-tighter">PixelType <span className="text-retro-accent">{language.toUpperCase()}</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
             onClick={() => setSoundEnabled(!soundEnabled)}
             className="text-xl hover:text-retro-primary transition-colors"
             title={t.sound}
          >
             {soundEnabled ? '🔊' : '🔇'}
          </button>
          
          <button 
             onClick={() => setDarkMode(!darkMode)}
             className="text-xl hover:text-retro-primary transition-colors"
             title={t.theme}
          >
             {darkMode ? '☀️' : '🌙'}
          </button>

          <Button 
            variant={currentView === View.LEADERBOARD ? 'primary' : 'secondary'} 
            size="sm"
            onClick={() => setCurrentView(currentView === View.GAME ? View.LEADERBOARD : View.GAME)}
          >
            {currentView === View.GAME ? `🏆 ${t.nav_leaderboard.toUpperCase()}` : `⌨️ ${t.nav_type.toUpperCase()}`}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 flex flex-col items-center">
        
        {currentView === View.GAME && (
          <div className="w-full max-w-4xl animate-in fade-in duration-500">
            {/* Config Controls */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 bg-gray-100 dark:bg-gray-800 p-4 border-2 border-dashed border-gray-400">
                
                {/* Duration */}
                <div className="flex items-center gap-2">
                   <span className="text-sm uppercase text-gray-500 w-16">{t.time}</span>
                   <div className="flex gap-2">
                    {([15, 30, 60, 'infinity'] as TimeOption[]).map((timeOption) => (
                        <button 
                        key={timeOption} 
                        onClick={() => !isGameActive && setDuration(timeOption)}
                        disabled={isGameActive}
                        className={`px-2 py-1 border-2 text-sm font-bold transition-all ${duration === timeOption ? 'bg-retro-accent border-black text-white' : 'bg-white dark:bg-gray-700 border-gray-400 text-gray-500'}`}
                        >
                        {timeOption === 'infinity' ? '∞' : `${timeOption}s`}
                        </button>
                    ))}
                   </div>
                </div>

                {/* Mode */}
                <div className="flex items-center gap-2">
                   <span className="text-sm uppercase text-gray-500 w-16">{t.mode}</span>
                   <div className="flex gap-2">
                    {(['words', 'sentences', 'mixed'] as Mode[]).map((modeOption) => (
                        <button 
                        key={modeOption} 
                        onClick={() => !isGameActive && setMode(modeOption)}
                        disabled={isGameActive}
                        className={`px-2 py-1 border-2 text-sm font-bold uppercase transition-all ${mode === modeOption ? 'bg-retro-primary border-black text-white' : 'bg-white dark:bg-gray-700 border-gray-400 text-gray-500'}`}
                        >
                        {modeOption === 'words' && t.mode_words}
                        {modeOption === 'sentences' && t.mode_sentences}
                        {modeOption === 'mixed' && t.mode_mixed}
                        </button>
                    ))}
                   </div>
                </div>

                {/* Language */}
                <div className="flex items-center gap-2">
                   <span className="text-sm uppercase text-gray-500 w-16">{t.language}</span>
                   <div className="flex gap-1">
                    {(['de', 'en', 'es', 'fr', 'it', 'nl'] as Language[]).map((l) => (
                        <button 
                        key={l} 
                        onClick={() => !isGameActive && changeLanguage(l)}
                        disabled={isGameActive}
                        className={`w-8 h-8 border-2 text-xs font-bold uppercase transition-all ${language === l ? 'bg-black dark:bg-white text-white dark:text-black border-retro-accent transform -translate-y-1' : 'bg-gray-200 dark:bg-gray-700 border-gray-400 text-gray-500'}`}
                        >
                        {l}
                        </button>
                    ))}
                   </div>
                </div>
            </div>

            <TypingArea 
              duration={duration} 
              mode={mode}
              language={language}
              isActive={isGameActive}
              onStart={handleGameStart}
              onStop={handleGameStop}
              onComplete={handleGameComplete}
              t={t}
              binaryMode={binaryMode}
            />

            {!isGameActive && !lastStats && (
              <div className="text-center mt-12 opacity-50 max-w-2xl mx-auto break-words">
                <p>{t.start_placeholder}</p>
                <div className="mt-4 text-xs">{t.supported_training}</div>
              </div>
            )}
          </div>
        )}

        {currentView === View.LEADERBOARD && (
          <div className="w-full animate-in slide-in-from-right duration-300">
            <Leaderboard entries={leaderboard} onReset={resetLeaderboard} language={language} t={t} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-500 text-sm border-t-2 border-gray-300 dark:border-gray-800 break-all">
        <p>{t.footer}</p>
      </footer>

      {/* Result Modal */}
      {lastStats && (
        <ResultsModal 
          stats={lastStats} 
          onSave={saveScore}
          onDiscard={() => {
            setLastStats(null);
            setIsGameActive(false);
          }}
          language={language}
          t={t}
        />
      )}
    </div>
  );
}

export default App;
