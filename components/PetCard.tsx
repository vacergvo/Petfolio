import React, { useState } from 'react';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
  isChecked: boolean;
  onToggle: (id: string, checked: boolean) => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, isChecked, onToggle }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      className={`
        group relative flex flex-col items-center p-3 rounded-[2rem] transition-all duration-300 cursor-pointer ease-out
        ${isChecked 
          ? 'bg-white shadow-[0_10px_30px_rgba(192,132,252,0.3)] border-2 border-lilac-400 transform scale-[1.02] hover:scale-[1.04]' 
          : 'bg-white shadow-sm border-2 border-transparent hover:shadow-xl hover:shadow-lilac-200/50 hover:border-lilac-100 hover:scale-[1.03] hover:-translate-y-1'
        }
      `}
      onClick={() => onToggle(pet.id, !isChecked)}
    >
      <div className="relative w-full aspect-square mb-3 bg-lilac-50 rounded-[1.5rem] overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-lilac-300 opacity-50">
            <span className="text-3xl animate-pulse">✨</span>
          </div>
        )}
        <img
          src={`images/${pet.image}`}
          alt={pet.name}
          className={`
            w-full h-full object-contain transition-all duration-500 p-2
            ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
          `}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/150/150?blur=2';
            setImageLoaded(true);
          }}
        />
        
        {/* Toggle Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(pet.id, !isChecked);
          }}
          className={`
            absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
            ${isChecked 
              ? 'bg-lilac-500 text-white scale-110 shadow-lilac-500/40 hover:scale-125' 
              : 'bg-white/90 backdrop-blur text-lilac-200 hover:bg-white hover:text-lilac-400 hover:scale-110'
            }
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="text-center w-full px-1">
        <div className="text-[10px] font-extrabold text-lilac-400 uppercase tracking-widest mb-1">
          {pet.id.replace('LPS-', '#')}
        </div>
        <h3 className="font-display font-bold text-lilac-900 text-sm md:text-base leading-tight truncate w-full" title={pet.name}>
          {pet.name}
        </h3>
        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-lilac-100 text-lilac-600 group-hover:bg-lilac-200 transition-colors">
          {pet.generation}
        </div>
      </div>
    </div>
  );
};