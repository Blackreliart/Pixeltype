import React from 'react';
import { LeaderboardEntry, Language } from '../types';
import { Button } from './Button';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onReset: () => void;
  language: Language;
  t: Record<string, string>;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, onReset, language, t }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-retro-panel dark:bg-retro-darkPanel border-2 border-black dark:border-white p-6 pixel-shadow">
      <div className="flex justify-between items-center mb-6 border-b-2 border-dashed border-gray-400 pb-4">
        <h2 className="text-3xl uppercase tracking-widest text-retro-primary dark:text-blue-400 break-all">{t.leaderboard_title}</h2>
        <Button variant="danger" size="sm" onClick={onReset}>{t.reset}</Button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-10 text-gray-500 break-all">
          {t.leaderboard_empty}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm uppercase text-gray-500 border-b-2 border-gray-200 dark:border-gray-700">
                <th className="py-2">#</th>
                <th className="py-2">{t.leaderboard_name}</th>
                <th className="py-2 text-right">{t.wpm}</th>
                <th className="py-2 text-right">{t.accuracy}</th>
                <th className="py-2 text-right">{t.mode}</th>
                <th className="py-2 text-right">{t.leaderboard_date}</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 font-bold text-retro-accent">{index + 1}</td>
                  <td className="py-3 font-bold truncate max-w-[150px]">{entry.username}</td>
                  <td className="py-3 text-right">{entry.wpm}</td>
                  <td className="py-3 text-right">{entry.accuracy}%</td>
                  <td className="py-3 text-right text-xs text-gray-500">
                    {entry.duration === 'infinity' ? '∞' : `${entry.duration}s`}
                  </td>
                  <td className="py-3 text-right text-xs text-gray-500">
                    {new Date(entry.date).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
