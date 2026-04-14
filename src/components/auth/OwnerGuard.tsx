import { type ReactNode, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHouseholds } from "../../context/HouseholdContext";

interface OwnerGuardProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional: what to show if they AREN'T the owner
}

export const OwnerGuard = ({ children, fallback = null }: OwnerGuardProps) => {
  const auth = useContext(AuthContext);
  const { state } = useHouseholds();

  if (!auth?.state.user || !state.activeHouseholdId) return fallback;

  // Find the full object for the currently active household
  const activeHousehold = state.households.find(
    (h) => h._id === state.activeHouseholdId
  );

  // Check if current user's ID matches the household owner's ID
  // Corrected from auth.state.user._id to auth.state.user.id
  const isOwner = activeHousehold?.owner === auth.state.user.id; 

  if (!isOwner) return fallback;

  return <>{children}</>;
};
