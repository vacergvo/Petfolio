import React from 'react';
import { Pet } from '../types';
import { Heart, Check } from 'lucide-react';

interface PetCardProps {
  pet: Pet;
  isChecked: boolean;
  onToggle: (id: string) => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, isChecked, onToggle }) => {
  // Placeholder image if actual image fails or isn't available
  const displayImage = pet.image ? `images/${pet.image}` : `https://picsum.photos/200`;

  return (
    <div 
      onClick={() => onToggle(pet.id)}
      className={`
        relative group cursor-pointer 
        rounded-2xl overflow-hidden 
        transition-all duration-300 ease-in-out
        border-2 
        ${isChecked 
          ? 'bg-lilac-100 border-lilac-400 shadow-[0_0_20px_rgba(178,90,255,0.3)] dark:bg-purple-900/30 dark:border-lilac-500' 
          : 'bg-white border-transparent hover:border-lilac-200 shadow-md hover:shadow-xl hover:-translate-y-1 dark:bg-slate-800'
        }
      `}
    >
      {/* Selection Indicator Overlay */}
      <div className={`absolute top-2 right-2 z-10 transition-transform duration-300 ${isChecked ? 'scale-100' : 'scale-0'}`}>
        <div className="bg-gradient-to-r from-lilac-500 to-pink-500 rounded-full p-1.5 shadow-lg">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      </div>

      <div className="aspect-square p-4 flex items-center justify-center bg-gradient-to-b from-transparent to-lilac-50/50 dark:to-purple-900/20">
        <img 
          src={displayImage} 
          alt={pet.name}
          className={`
            w-full h-full object-contain drop-shadow-sm transition-transform duration-300
            ${isChecked ? 'scale-90 opacity-100' : 'group-hover:scale-110 opacity-90 group-hover:opacity-100'}
          `}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
          }}
        />
      </div>

      <div className="p-3 text-center relative overflow-hidden">
        {/* Background gradient on check */}
        <div className={`absolute inset-0 bg-gradient-to-r from-lilac-100 to-pink-100 dark:from-purple-900 dark:to-fuchsia-900 transition-opacity duration-300 ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
        
        <div className="relative z-10">
          <div className="text-xs font-bold tracking-wider text-lilac-600 dark:text-lilac-300 uppercase mb-1">
            {pet.id.replace('LPS-', '#')}
          </div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 truncate px-1 text-sm md:text-base leading-tight">
            {pet.name}
          </h3>
          <div className="mt-1">
             <span className="inline-block px-2 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 font-medium">
               {pet.generation}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetCard;