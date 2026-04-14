import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    // Added h-screen w-screen for full viewport height and width
    <div className="flex h-screen w-screen bg-[var(--bg-primary)]"> 
      <Sidebar />
      {/* Added p-[var(--space-8)] to the inner div for padding */}
      <main className="flex-1 overflow-y-auto"> 
        <div className="max-w-7xl mx-auto p-[var(--space-8)]">
          {children}
        </div>
      </main>
    </div>
  );
};
