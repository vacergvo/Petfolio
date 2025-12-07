import { Pet } from '../types';

// We fetch the data from the external JSON file to ensure the complete list 
// of 4000+ pets is loaded without hitting code size limits.
export const fetchPets = async (): Promise<Pet[]> => {
  try {
    const response = await fetch('all_petshops.json');
    if (!response.ok) {
      console.error(`Failed to load pet data: ${response.status} ${response.statusText}`);
      // Fallback or empty array if file is missing
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pet collection:", error);
    return [];
  }
};

// Export an empty array as default, data is handled asynchronously via fetchPets
export const allPets: Pet[] = [];