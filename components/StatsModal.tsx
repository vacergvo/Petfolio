import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Pet, ChecklistState } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pets: Pet[];
  checklist: ChecklistState;
}

interface GenStat {
  total: number;
  collected: number;
}

// Updated Lilac Theme Colors
const COLORS = ['#C084FC', '#A855F7', '#F472B6', '#818CF8', '#2DD4BF', '#FBBF24'];

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, pets, checklist }) => {
  if (!isOpen) return null;

  // Calculate stats by generation
  const statsByGen = pets.reduce((acc, pet) => {
    const gen = pet.generation || 'Unknown';
    if (!acc[gen]) acc[gen] = { total: 0, collected: 0 };
    acc[gen].total++;
    if (checklist[pet.id]) acc[gen].collected++;
    return acc;
  }, {} as Record<string, GenStat>);

  const data = Object.entries(statsByGen).map(([name, stat]: [string, GenStat]) => ({
    name,
    value: stat.collected,
    total: stat.total
  })).filter(d => d.value > 0);

  const totalCollected = pets.filter(p => checklist[p.id]).length;
  const percentage = Math.round((totalCollected / pets.length) * 100) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lilac-900/20 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl shadow-lilac-900/10 relative animate-in fade-in zoom-in duration-300 border border-lilac-100">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-lilac-50 text-lilac-400 hover:bg-lilac-100 hover:text-lilac-600 transition-colors"
        >
          ✕
        </button>

        <h2 className="text-3xl font-display font-extrabold text-lilac-900 text-center mb-1">Collection Stats</h2>
        <p className="text-center text-lilac-400 font-medium mb-6">Your collecting journey</p>
        
        <div className="text-center mb-8 relative">
          <div className="inline-block relative">
             <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-lilac-500 to-pop-pink drop-shadow-sm">
              {percentage}%
            </div>
            {percentage === 100 && <div className="absolute -top-4 -right-8 text-4xl animate-bounce">👑</div>}
          </div>
          <p className="text-lilac-500 font-medium mt-1">{totalCollected} of {pets.length} Collected</p>
        </div>

        <div className="h-64 w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={6}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(168, 85, 247, 0.15)', backgroundColor: '#fff', padding: '12px' }}
                  itemStyle={{ color: '#6B21A8', fontWeight: 700 }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-lilac-300">
              <span className="text-4xl mb-2">🐚</span>
              <span>Start checking pets to see stats!</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
          {Object.entries(statsByGen).map(([gen, stat]: [string, GenStat]) => (
            <div key={gen} className="bg-lilac-50 p-3 rounded-2xl text-center border border-lilac-100">
              <div className="text-[10px] font-bold text-lilac-400 uppercase tracking-wider">{gen}</div>
              <div className="font-bold text-lilac-800 text-sm mt-1">{stat.collected} / {stat.total}</div>
              <div className="w-full bg-lilac-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-lilac-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${(stat.collected / stat.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};