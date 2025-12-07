import React, { useEffect, useState, useMemo } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Auth } from './components/Auth';
import { PetCard } from './components/PetCard';
import { StatsModal } from './components/StatsModal';
import { Pet, ChecklistState, FilterStatus } from './types';
import { pets as petsData } from './pets';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [checklist, setChecklist] = useState<ChecklistState>({});
  
  // Filters
  const [search, setSearch] = useState('');
  const [genFilter, setGenFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>(FilterStatus.ALL);
  
  // UI State
  const [showStats, setShowStats] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Auth & Data Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load user data
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setChecklist(docSnap.data().checklistState || {});
          }
        } catch (e) {
          console.error("Error loading user data", e);
        }
      } else {
        setChecklist({});
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = async (id: string, checked: boolean) => {
    const newState = { ...checklist, [id]: checked };
    setChecklist(newState);
    
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), { checklistState: newState }, { merge: true });
      } catch (e) {
        console.error("Error saving state", e);
      }
    }
  };

  const filteredPets = useMemo(() => {
    return petsData.filter(pet => {
      const matchesSearch = pet.name.toLowerCase().includes(search.toLowerCase()) || 
                            pet.id.toLowerCase().includes(search.toLowerCase());
      const matchesGen = genFilter ? pet.generation === genFilter : true;
      
      const isChecked = !!checklist[pet.id];
      let matchesStatus = true;
      if (statusFilter === FilterStatus.CHECKED) matchesStatus = isChecked;
      if (statusFilter === FilterStatus.UNCHECKED) matchesStatus = !isChecked;

      return matchesSearch && matchesGen && matchesStatus;
    });
  }, [search, genFilter, statusFilter, checklist]);

  const generations = useMemo(() => [...new Set(petsData.map(p => p.generation))].sort(), []);
  
  const totalCount = petsData.length;
  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = totalCount ? Math.round((checkedCount / totalCount) * 100) : 0;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lilac-50">
        <div className="animate-spin text-5xl">🐾</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-lilac-50 font-sans text-lilac-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="images/lps-logo.png" 
              alt="LPS Logo" 
              className="h-11 w-auto object-contain drop-shadow-md transform rotate-3 hover:rotate-0 transition-transform duration-300" 
            />
            <h1 className="font-display font-extrabold text-2xl hidden md:block text-lilac-900 tracking-tight">
              LPS <span className="text-lilac-500">Collector</span>
            </h1>
          </div>

          <div className="flex-1 max-w-2xl mx-4 hidden md:flex items-center gap-3">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-lilac-300 group-focus-within:text-lilac-500 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Find a friend..."
                className="block w-full pl-11 pr-4 py-2.5 border-2 border-transparent rounded-2xl bg-lilac-50 focus:bg-white focus:border-lilac-200 focus:ring-4 focus:ring-lilac-100 transition-all font-medium placeholder-lilac-300 text-lilac-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <select 
              value={genFilter} 
              onChange={(e) => setGenFilter(e.target.value)}
              className="py-2.5 pl-4 pr-10 rounded-2xl bg-lilac-50 border-2 border-transparent focus:bg-white focus:border-lilac-200 focus:ring-4 focus:ring-lilac-100 font-bold text-lilac-700 cursor-pointer hover:bg-white transition-all text-sm"
            >
              <option value="">All Gens</option>
              {generations.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="py-2.5 pl-4 pr-10 rounded-2xl bg-lilac-50 border-2 border-transparent focus:bg-white focus:border-lilac-200 focus:ring-4 focus:ring-lilac-100 font-bold text-lilac-700 cursor-pointer hover:bg-white transition-all text-sm"
            >
              <option value={FilterStatus.ALL}>All Status</option>
              <option value={FilterStatus.CHECKED}>Collected</option>
              <option value={FilterStatus.UNCHECKED}>Missing</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowStats(true)}
              className="p-3 rounded-2xl bg-lilac-100 text-lilac-600 hover:bg-lilac-200 hover:scale-105 transition-all"
              title="Statistics"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </button>
            <button
              onClick={() => signOut(auth)}
              className="p-3 rounded-2xl text-lilac-300 hover:bg-red-50 hover:text-red-400 transition-all"
              title="Sign Out"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            <button 
              className="md:hidden p-3 rounded-2xl bg-lilac-50 text-lilac-600"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-lilac-100 w-full relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-lilac-400 via-pop-pink to-lilac-600 transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
        
        {/* Mobile Filters Drawer */}
        {showMobileFilters && (
          <div className="md:hidden bg-white/95 border-b border-lilac-100 p-4 space-y-3 animate-in slide-in-from-top-2 backdrop-blur-md">
            <input
              type="text"
              placeholder="Search pets..."
              className="block w-full px-4 py-3 border-2 border-lilac-100 rounded-2xl bg-lilac-50 text-lilac-900 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <select 
                value={genFilter} 
                onChange={(e) => setGenFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-lilac-100 rounded-2xl bg-lilac-50 text-lilac-700 font-bold"
              >
                <option value="">All Gens</option>
                {generations.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="w-full px-4 py-3 border-2 border-lilac-100 rounded-2xl bg-lilac-50 text-lilac-700 font-bold"
              >
                <option value={FilterStatus.ALL}>All Status</option>
                <option value={FilterStatus.CHECKED}>Collected</option>
                <option value={FilterStatus.UNCHECKED}>Missing</option>
              </select>
            </div>
          </div>
        )}
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-display font-extrabold text-lilac-900">Your Collection</h2>
            <p className="text-sm font-bold text-lilac-400 mt-1">{filteredPets.length} pets found</p>
          </div>
          <div className="text-right">
            <div className="text-base font-black text-lilac-600 bg-lilac-100 px-3 py-1 rounded-lg inline-block">{checkedCount} Collected</div>
            <div className="text-xs font-semibold text-lilac-300 mt-1">out of {totalCount} total</div>
          </div>
        </div>

        {filteredPets.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 pb-20">
            {filteredPets.map(pet => (
              <PetCard 
                key={pet.id} 
                pet={pet} 
                isChecked={!!checklist[pet.id]} 
                onToggle={handleToggle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-lilac-200 shadow-sm mx-auto max-w-2xl">
            <div className="text-7xl mb-4 opacity-50 animate-bounce">🙈</div>
            <h3 className="text-2xl font-bold text-lilac-800">No pets found here</h3>
            <p className="text-lilac-400 font-medium">Maybe they are hiding in another generation?</p>
            <button 
              onClick={() => {setSearch(''); setGenFilter(''); setStatusFilter(FilterStatus.ALL);}}
              className="mt-6 px-8 py-3 bg-lilac-100 text-lilac-600 font-bold rounded-2xl hover:bg-lilac-200 hover:scale-105 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      <StatsModal 
        isOpen={showStats} 
        onClose={() => setShowStats(false)} 
        pets={petsData} 
        checklist={checklist} 
      />
    </div>
  );
}

export default App;