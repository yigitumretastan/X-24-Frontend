"use client";

import { useState, createContext, useContext } from "react";
import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/Sidebar";
import RightPanel from "../components/dashboard/RightPanel";
import AuthGuard from "@/app/components/AuthGuard";
import { useTheme } from "@/app/hooks/useTheme";

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
        <div className="dashboard-layout">
          <style jsx>{`
            .dashboard-layout {
              display: grid;
              grid-template-areas: 
                "header header header"
                "sidebar main rightpanel";
              grid-template-columns: ${isCollapsed ? "80px" : "280px"} 1fr 100px;
              grid-template-rows: auto 1fr;
              min-height: 100vh;
              background: ${theme === "dark" ? "#0f172a" : "#f8fafc"};
              transition: grid-template-columns 0.3s ease, background 0.3s ease;
            }

          .dashboard-header {
            grid-area: header;
            position: sticky;
            top: 0;
            z-index: 40;
          }

          .dashboard-sidebar {
            grid-area: sidebar;
            position: sticky;
            top: 80px;
            height: calc(100vh - 80px);
            overflow: visible;
          }

          .dashboard-main {
            grid-area: main;
            padding: 2rem;
            overflow-y: auto;
            background: ${theme === "dark" ? "#1e293b" : "white"};
            margin: 1rem;
            border-radius: 16px;
            box-shadow: ${theme === "dark" 
              ? "0 4px 12px rgba(0, 0, 0, 0.3)" 
              : "0 4px 12px rgba(0, 0, 0, 0.05)"};
            border: 1px solid ${theme === "dark" 
              ? "rgba(148, 163, 184, 0.2)" 
              : "rgba(148, 163, 184, 0.1)"};
            color: ${theme === "dark" ? "#ffffff" : "#000000"};
            transition: background 0.3s ease, border 0.3s ease, color 0.3s ease;
          }

          .dashboard-rightpanel {
            grid-area: rightpanel;
            position: sticky;
            top: 80px;
            height: calc(100vh - 80px);
            overflow-y: auto;
          }

          @media (max-width: 1024px) {
            .dashboard-layout {
              grid-template-areas: 
                "header header"
                "sidebar main";
              grid-template-columns: 280px 1fr;
            }
            
            .dashboard-rightpanel {
              display: none;
            }
          }

          @media (max-width: 768px) {
            .dashboard-layout {
              grid-template-areas: 
                "header"
                "main";
              grid-template-columns: 1fr;
            }
            
            .dashboard-sidebar {
              display: none;
            }
            
            .dashboard-main {
              margin: 0.5rem;
              padding: 1rem;
            }
          }
        `}</style>

        <div className="dashboard-header">
          <Header/>
        </div>
        
        <div className="dashboard-sidebar">
          <Sidebar />
        </div>
        
        <main className="dashboard-main">
          {children}
        </main>
        
        <div className="dashboard-rightpanel">
          <RightPanel />
        </div>
        </div>
      </SidebarContext.Provider>
    </AuthGuard>
  );
}