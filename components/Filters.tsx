import React from 'react';
import { FilterStatus } from '../types';
import { Filter } from 'lucide-react';

interface FiltersProps {
  // Search is now handled in header
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  
  activeGen: string;
  setActiveGen: (gen: string) => void;
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
  generations: string[];
}

const Filters: React.FC<FiltersProps> = ({ 
  activeGen, 
  setActiveGen, 
  filterStatus, 
  setFilterStatus,
  generations
}) => {
  return (
    <div className="sticky top-20 md:top-24 z-40 mb-6 transition-all duration-300">
      <div className="glass p-3 md:p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        <div className="flex items-center gap-2 text-slate-600 dark:text-lilac-200 font-medium">
          <Filter size={18} />
          <span className="hidden sm:inline">Filters</span>
        </div>

        <div className="flex flex-1 w-full sm:w-auto gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          
          <div className="flex-shrink-0">
            <select
              value={activeGen}
              onChange={(e) => setActiveGen(e.target.value)}
              className="w-full sm:w-40 px-4 py-2 bg-white dark:bg-slate-800 border border-lilac-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-lilac-400 text-sm appearance-none cursor-pointer"
            >
              <option value="">All Generations</option>
              {generations.map(gen => (
                <option key={gen} value={gen}>{gen}</option>
              ))}
            </select>
          </div>

          <div className="flex bg-lilac-100 dark:bg-slate-800 p-1 rounded-xl flex-shrink-0">
            {(['all', 'checked', 'unchecked'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`
                  px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize
                  ${filterStatus === status 
                    ? 'bg-white dark:bg-slate-700 text-lilac-600 dark:text-lilac-300 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-lilac-500'
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;