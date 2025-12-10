import React, { useState } from 'react';
import { TestStats, Language } from '../types';
import { Button } from './Button';

interface ResultsModalProps {
  stats: TestStats;
  onSave: (name: string) => void;
  onDiscard: () => void;
  language: Language;
  t: Record<string, string>;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({ stats, onSave, onDiscard, language, t }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-retro-panel dark:bg-retro-darkPanel border-4 border-black dark:border-white p-8 max-w-md w-full pixel-shadow animate-in zoom-in duration-300">
        <h2 className="text-3xl text-center mb-6 uppercase border-b-4 border-double border-gray-300 pb-2 break-all">{t.result_title}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 text-center border border-gray-300">
            <div className="text-xs uppercase text-gray-500">{t.wpm}</div>
            <div className="text-4xl text-retro-primary dark:text-blue-400">{stats.wpm}</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 text-center border border-gray-300">
            <div className="text-xs uppercase text-gray-500">{t.accuracy}</div>
            <div className="text-4xl text-retro-success dark:text-green-400">{stats.accuracy}%</div>
          </div>
          <div className="col-span-2 text-center text-sm text-gray-500 break-all">
             {stats.incorrectChars} {t.errors?.toLowerCase() || 'errors'} {t.result_conjunction} {stats.totalChars} {t.result_chars}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm uppercase font-bold break-all">{t.enter_name}:</label>
          <input
            type="text"
            maxLength={12}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.name_placeholder}
            className="p-3 text-xl bg-white dark:bg-black border-2 border-black dark:border-gray-500 focus:border-retro-accent outline-none font-pixel uppercase"
            autoFocus
          />
          
          <div className="flex gap-4 mt-4">
            <Button type="button" variant="secondary" onClick={onDiscard} className="flex-1 break-all">
              {t.discard}
            </Button>
            <Button type="submit" disabled={!name.trim()} className="flex-1 break-all">
              {t.save}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
