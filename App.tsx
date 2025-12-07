import React, { useState, useEffect, useMemo } from 'react';
import { allPets, fetchPets } from './services/petData';
import { Pet, FilterStatus } from './types';
import Header from './components/Header';
import Filters from './components/Filters';
import PetCard from './components/PetCard';
import Login from './components/Login';
import StatsModal from './components/StatsModal';
import { auth, db } from './services/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [darkMode, setDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGen, setActiveGen] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthChecking(false);
      
      if (currentUser) {
        // Load user specific checklist
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.checklistState) setChecklist(data.checklistState);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      } else {
        setChecklist({});
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Load Pet Data
  useEffect(() => {
    fetchPets().then(data => {
      setPets(data);
      setLoadingPets(false);
    });
  }, []);

  // 3. Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Derived Data
  const generations = useMemo(() => {
    return [...new Set(pets.map(p => p.generation))].sort();
  }, [pets]);

  const filteredPets = useMemo(() => {
    return pets.filter(pet => {
      const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            pet.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGen = activeGen ? pet.generation === activeGen : true;
      
      const isChecked = !!checklist[pet.id];
      let matchesStatus = true;
      if (filterStatus === 'checked') matchesStatus = isChecked;
      if (filterStatus === 'unchecked') matchesStatus = !isChecked;

      return matchesSearch && matchesGen && matchesStatus;
    });
  }, [pets, searchTerm, activeGen, filterStatus, checklist]);

  // Progress calculations
  const progressBase = activeGen 
    ? pets.filter(p => p.generation === activeGen) 
    : pets;
  
  const totalCount = progressBase.length;
  const checkedCount = progressBase.reduce((acc, pet) => acc + (checklist[pet.id] ? 1 : 0), 0);

  const toggleCheck = async (id: string) => {
    if (!user) return;

    const newState = {
      ...checklist,
      [id]: !checklist[id]
    };
    
    setChecklist(newState);

    // Debounced or direct save to Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), { checklistState: newState }, { merge: true });
    } catch (e) {
      console.error("Error saving check:", e);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  // Render Logic
  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lilac-50">
        <div className="w-12 h-12 border-4 border-lilac-300 border-t-lilac-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <Header 
        total={totalCount} 
        checked={checkedCount} 
        darkMode={darkMode} 
        toggleTheme={() => setDarkMode(prev => !prev)} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenStats={() => setShowStats(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8">
        
        <Filters 
          activeGen={activeGen}
          setActiveGen={setActiveGen}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          generations={generations}
        />

        {loadingPets ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-lilac-200 border-t-lilac-500 rounded-full animate-spin mb-4"></div>
            <p className="text-lilac-400 font-medium animate-pulse">Loading collection...</p>
          </div>
        ) : (
          <>
            {filteredPets.length === 0 ? (
              <div className="text-center py-20 opacity-60">
                <div className="text-6xl mb-4">🐰</div>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No pets found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters to find them!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {filteredPets.map(pet => (
                  <PetCard 
                    key={pet.id} 
                    pet={pet} 
                    isChecked={!!checklist[pet.id]} 
                    onToggle={toggleCheck} 
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {showStats && (
        <StatsModal 
          pets={pets} 
          checklist={checklist} 
          onClose={() => setShowStats(false)} 
        />
      )}

      <footer className="text-center py-8 text-slate-400 text-sm">
        <p>LPS Collector Checklist &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;