import type { HouseholdState, Household } from "../types/household.types";

export type HouseholdAction =
  | { type: "SET_HOUSEHOLDS"; payload: Household[] }
  | { type: "SET_ACTIVE"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

export function householdReducer(state: HouseholdState, action: HouseholdAction): HouseholdState {
  switch (action.type) {
    case "SET_HOUSEHOLDS":
      return { 
        ...state, 
        households: action.payload, 
        // * Auto-select the first household if none is active
        activeHouseholdId: state.activeHouseholdId || (action.payload[0]?._id ?? null),
        isLoading: false 
      };
    case "SET_ACTIVE":
      return { ...state, activeHouseholdId: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}