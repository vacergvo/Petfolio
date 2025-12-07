import React from 'react';
import { Moon, Sun, Heart, Search, PieChart, LogOut } from 'lucide-react';

interface HeaderProps {
  total: number;
  checked: number;
  darkMode: boolean;
  toggleTheme: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenStats: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  total, 
  checked, 
  darkMode, 
  toggleTheme,
  searchTerm,
  setSearchTerm,
  onOpenStats,
  onLogout
}) => {
  const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

  return (
    <header className="sticky top-0 z-50 glass shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        {/* Top Row: Logo & Search on Mobile */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-fit">
            <div className="bg-gradient-to-br from-lilac-400 to-pink-400 p-1.5 md:p-2 rounded-xl shadow-lg animate-float">
              <Heart className="text-white w-5 h-5 fill-current" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-lilac-600 to-pink-500 dark:from-lilac-300 dark:to-pink-300 leading-none">
                LPS Collector
              </h1>
            </div>
          </div>

          {/* Search Bar (Centered on desktop, flex on mobile) */}
          <div className="relative flex-1 md:w-64 lg:w-96 md:mx-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-lilac-400" />
            </div>
            <input
              type="text"
              placeholder="Search pets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 md:py-2 bg-white/50 dark:bg-slate-800/50 border border-lilac-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-lilac-400 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm"
            />
          </div>

          {/* Mobile Actions Only */}
          <div className="flex md:hidden items-center gap-2">
             <button 
              onClick={onOpenStats}
              className="p-2 rounded-full bg-white/50 dark:bg-slate-800/50 text-lilac-600 dark:text-lilac-300 border border-lilac-100 dark:border-slate-700"
            >
              <PieChart size={18} />
            </button>
            <button 
              onClick={onLogout}
              className="p-2 rounded-full bg-white/50 dark:bg-slate-800/50 text-red-400 border border-lilac-100 dark:border-slate-700"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Right side controls (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Progress Bar */}
          <div className="flex flex-col items-end min-w-[120px]">
            <div className="flex items-center gap-2 mb-1 w-full justify-between">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Collected</span>
              <span className="text-xs font-bold text-lilac-600 dark:text-lilac-300">{percentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-lilac-400 via-purple-400 to-pink-400 transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenStats}
              className="p-2 rounded-full hover:bg-lilac-50 dark:hover:bg-slate-800 text-slate-600 dark:text-lilac-200 transition-colors"
              title="Statistics"
            >
              <PieChart size={20} />
            </button>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-lilac-50 dark:hover:bg-slate-800 text-slate-600 dark:text-lilac-200 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;