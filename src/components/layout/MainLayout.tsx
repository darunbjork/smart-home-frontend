import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-(--bg-primary)">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar with Responsive Classes */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className="flex flex-col flex-1 min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-(--border) bg-(--bg-surface)">
          <h2 className="text-lg font-bold text-(--brand)">SmartHome</h2>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-(--text-primary)"
          >
            ☰
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-(--space-4) md:p-(--space-8)">
          {children}
        </div>
      </main>
    </div>
  );
};
