export interface Pet {
  id: string;
  name: string;
  generation: string;
  image: string;
}

export type FilterStatus = 'all' | 'checked' | 'unchecked';

export interface UserState {
  checklist: Record<string, boolean>;
}