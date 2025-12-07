export interface Pet {
  id: string;
  name: string;
  generation: string;
  image: string;
}

export interface ChecklistState {
  [petId: string]: boolean;
}

export interface UserData {
  checklistState: ChecklistState;
}

export enum FilterStatus {
  ALL = 'all',
  CHECKED = 'checked',
  UNCHECKED = 'unchecked'
}