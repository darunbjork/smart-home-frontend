import { createContext } from "react";
import type { HouseholdState } from "../types/household.types";

export interface HouseholdContextValue {
  state:             HouseholdState;
  fetchHouseholds:   () => Promise<void>;
  createHousehold:   (name: string) => Promise<void>;
  updateHousehold:   (id: string, updates: Partial<{name: string}>) => Promise<void>;
  deleteHousehold:   (id: string) => Promise<void>;
  setActive:         (id: string) => void;
}

export const HouseholdContext = createContext<HouseholdContextValue | null>(null);
