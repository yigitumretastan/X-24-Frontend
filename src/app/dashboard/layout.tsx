"use client";

import { useState, createContext, useContext } from "react";
import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/Sidebar";
import RightPanel from "../components/dashboard/RightPanel";
import AuthGuard from "@/app/components/AuthGuard";
import { useTheme } from "@/app/contexts/ThemeContext";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();
  
  return (
    <AuthGuard>
      <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
        <div className="flex h-screen w-full overflow-hidden bg-background">
          {/* Sidebar */}
          <aside 
            className={`flex-shrink-0 transition-all duration-300 ease-in-out z-30 border-r border-border ${
              isCollapsed ? "w-[80px]" : "w-[280px]"
            }`}
          >
            <Sidebar />
          </aside>

          {/* Main Area */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            {/* Header */}
            <header className="h-[73px] flex-shrink-0 z-20 border-b border-border bg-background">
              <Header />
            </header>

            {/* Content Area */}
            <div className="flex flex-1 overflow-hidden">
              {/* Main Content */}
              <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
                <div className="max-w-[1600px] mx-auto">
                  {children}
                </div>
              </main>

              {/* Right Panel */}
              <aside className="hidden xl:block w-[320px] flex-shrink-0 border-l border-border bg-background overflow-y-auto">
                <RightPanel />
              </aside>
            </div>
          </div>
        </div>
      </SidebarContext.Provider>
    </AuthGuard>
  );
}