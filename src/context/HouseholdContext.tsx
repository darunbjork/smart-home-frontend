import { useReducer, type ReactNode, useContext } from "react";
// Import from the new setup file
import { HouseholdContext, type HouseholdContextValue } from "./HouseholdContextSetup"; 
import { householdReducer } from "../reducers/household.reducer";
import { householdApi } from "../api/household.api";


export const HouseholdProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(householdReducer, {
    households: [],
    activeHouseholdId: null,
    isLoading: false,
  });

  const fetchHouseholds = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await householdApi.getAll();
      dispatch({ type: "SET_HOUSEHOLDS", payload: data });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createHousehold = async (name: string) => {
    const newH = await householdApi.create(name);
    // Refresh the list to include the new household
    await fetchHouseholds();
    dispatch({ type: "SET_ACTIVE", payload: newH._id });
  };

  const setActive = (id: string) => dispatch({ type: "SET_ACTIVE", payload: id });

  // Ensure the value passed matches the interface
  const contextValue: HouseholdContextValue = { state, fetchHouseholds, createHousehold, setActive };

  return (
    <HouseholdContext.Provider value={contextValue}>
      {children}
    </HouseholdContext.Provider>
  );
};

// Custom hook for cleaner consumption
// eslint-disable-next-line react-refresh/only-export-components
export const useHouseholds = () => {
  const context = useContext(HouseholdContext);
  if (!context) throw new Error("useHouseholds must be used within HouseholdProvider");
  return context;
};
