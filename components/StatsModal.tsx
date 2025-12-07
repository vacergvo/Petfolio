import React, { useMemo } from 'react';
import { Pet } from '../types';
import { X, Trophy, PieChart } from 'lucide-react';

interface StatsModalProps {
  pets: Pet[];
  checklist: Record<string, boolean>;
  onClose: () => void;
}

interface StatData {
  total: number;
  collected: number;
}

const StatsModal: React.FC<StatsModalProps> = ({ pets, checklist, onClose }) => {
  
  const stats = useMemo(() => {
    const genStats: Record<string, StatData> = {};
    const nameStats: Record<string, StatData> = {};

    pets.forEach(pet => {
      const isCollected = !!checklist[pet.id];
      
      // Generation Stats
      if (!genStats[pet.generation]) genStats[pet.generation] = { total: 0, collected: 0 };
      genStats[pet.generation].total++;
      if (isCollected) genStats[pet.generation].collected++;

      // Name Stats
      if (!nameStats[pet.name]) nameStats[pet.name] = { total: 0, collected: 0 };
      nameStats[pet.name].total++;
      if (isCollected) nameStats[pet.name].collected++;
    });

    return { genStats, nameStats };
  }, [pets, checklist]);

  const renderProgressBar = (collected: number, total: number, colorClass: string) => {
    const percent = Math.round((collected / total) * 100) || 0;
    return (
      <div className="w-full">
        <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-400">
          <span className="font-medium">{percent}%</span>
          <span>{collected}/{total}</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-lilac-50 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-lilac-100 text-lilac-600 rounded-xl">
              <PieChart size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-lilac-100">Collection Statistics</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Generations Section */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <Trophy size={18} className="text-yellow-500" />
              By Generation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.entries(stats.genStats) as [string, StatData][]).sort().map(([gen, data]) => (
                <div key={gen} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="font-bold text-lilac-600 mb-2">{gen}</div>
                  {renderProgressBar(data.collected, data.total, 'bg-gradient-to-r from-lilac-400 to-lilac-600')}
                </div>
              ))}
            </div>
          </section>

          {/* Animals Section */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
              By Animal Type
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.entries(stats.nameStats) as [string, StatData][])
                .sort((a, b) => b[1].total - a[1].total) // Sort by most items first
                .map(([name, data]) => (
                  <div key={name} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow">
                    <div className="font-medium text-sm text-slate-700 dark:text-slate-300 truncate mb-2" title={name}>{name}</div>
                    {renderProgressBar(data.collected, data.total, 'bg-gradient-to-r from-pink-400 to-pink-600')}
                  </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default StatsModal;