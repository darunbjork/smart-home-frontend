export type UserRole = "owner" | "member";

export interface User {
  _id:        string;
  username:   string;
  email:      string;
  role:       UserRole;
  households: string[];
  createdAt:  string;
  updatedAt:  string;
}

export interface AuthState {
  user:        User | null;
  accessToken: string | null;
  isLoading:   boolean;
}

export interface LoginResponse { 
  accessToken: string; 
  user: User; 
}