import { useContext } from "react";
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

export const useHouseholds = () => {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error("useHouseholds must be used within a HouseholdProvider");
  }
  return context;
};
