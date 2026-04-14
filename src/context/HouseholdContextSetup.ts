import { createContext } from "react";
// Import necessary types, but not the reducer or API calls themselves.
import type { HouseholdState } from "../types/household.types";

export interface HouseholdContextValue {
  state:             HouseholdState;
  fetchHouseholds:   () => Promise<void>;
  createHousehold:   (name: string) => Promise<void>;
  setActive:         (id: string) => void;
}

export const HouseholdContext = createContext<HouseholdContextValue | null>(null);
