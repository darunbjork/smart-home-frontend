export interface Household {
  _id:       string;
  name:      string;
  owner:     string;  
  members:   string[]; 
  createdAt: string;
}

export interface HouseholdState {
  households:        Household[];
  activeHouseholdId: string | null;
  isLoading:         boolean;
}