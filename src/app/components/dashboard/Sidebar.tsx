"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageSquareText,
  CheckSquare,
  FolderKanban,
  Calendar,
  BarChart2,
  HardDrive,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { useSidebar } from "../../dashboard/layout";
import { useTheme } from "@/app/contexts/ThemeContext";

export default function Sidebar() {
  const { theme } = useTheme();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`w-full h-full sidebar-gradient backdrop-blur-sm border-r flex flex-col justify-between transition-all duration-300 relative overflow-visible ${
      theme === 'dark' 
        ? 'border-gray-700/20 shadow-[4px_0_20px_rgba(0,0,0,0.3)]' 
        : 'border-gray-300/30 shadow-[4px_0_20px_rgba(0,0,0,0.1)]'
    } ${isCollapsed ? 'p-4 px-3' : 'p-8 px-6'}`}>
      
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`absolute top-4 -right-3 w-7 h-7 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200 z-50 hover:scale-110 ${
          theme === 'dark'
            ? 'bg-gray-800/60 border-gray-700/30 shadow-lg hover:bg-gray-700/70 hover:border-gray-600/40'
            : 'bg-white/70 border-gray-200/40 shadow-md hover:bg-white/90 hover:border-gray-300/50'
        }`}
      >
        {isCollapsed ? (
          <ChevronRight className={`w-3.5 h-3.5 ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`} />
        ) : (
          <ChevronLeft className={`w-3.5 h-3.5 ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`} />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">
        <div className={`text-xs font-semibold uppercase tracking-wide mb-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        } ${isCollapsed ? 'hidden' : 'block pl-3'}`}>
          Menü
        </div>

        <SidebarLink 
          href="/dashboard" 
          icon={<Home className="w-5 h-5" />} 
          label="Anasayfa"
          isActive={pathname === "/dashboard"}
          isCollapsed={isCollapsed}
          theme={theme}
        />
        <SidebarLink 
          href="/dashboard/messages" 
          icon={<MessageSquareText className="w-5 h-5" />} 
          label="Mesajlar"
          isActive={pathname === "/dashboard/messages"}
          isCollapsed={isCollapsed}
          theme={theme}
        />
        <SidebarLink 
          href="/dashboard/tasks" 
          icon={<CheckSquare className="w-5 h-5" />} 
          label="Görevler"
          isActive={pathname === "/dashboard/tasks"}
          isCollapsed={isCollapsed}
          theme={theme}
        />
        <SidebarLink 
          href="/dashboard/projects" 
          icon={<FolderKanban className="w-5 h-5" />} 
          label="Projeler"
          isActive={pathname === "/dashboard/projects"}
          isCollapsed={isCollapsed}
          theme={theme}
        />
        <SidebarLink 
          href="/dashboard/calender" 
          icon={<Calendar className="w-5 h-5" />} 
          label="Takvim"
          isActive={pathname === "/dashboard/calender"}
          isCollapsed={isCollapsed}
          theme={theme}
        />
        <SidebarLink 
          href="/dashboard/analysis" 
          icon={<BarChart2 className="w-5 h-5" />} 
          label="Analiz"
          isActive={pathname === "/dashboard/analysis"}
          isCollapsed={isCollapsed}
          theme={theme}
        />
        <SidebarLink 
          href="/dashboard/disk" 
          icon={<HardDrive className="w-5 h-5" />} 
          label="Disk"
          isActive={pathname === "/dashboard/disk"}
          isCollapsed={isCollapsed}
          theme={theme}
        />
        <SidebarLink 
          href="/dashboard/reports" 
          icon={<FileText className="w-5 h-5" />} 
          label="Raporlar"
          isActive={pathname === "/dashboard/reports"}
          isCollapsed={isCollapsed}
          theme={theme}
        />
      </nav>

      {/* Footer - Settings */}
      <div className={`mt-auto pt-8 border-t ${
        theme === 'dark' ? 'border-gray-700/30' : 'border-gray-300/30'
      }`}>
        <Link 
          href="/dashboard/settings" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] ${
            isCollapsed ? 'justify-center' : 'justify-start'
          } ${
            pathname === "/dashboard/settings"
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : theme === 'dark'
                ? 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/20 hover:border-gray-600/30'
                : 'bg-white/40 text-gray-600 hover:bg-white/70 hover:text-gray-800 border border-gray-200/30 hover:border-gray-300/40'
          }`}
          title={isCollapsed ? "Ayarlar" : undefined}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Ayarlar</span>}
        </Link>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  isActive = false,
  isCollapsed = false,
  theme,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  theme: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] ${
        isCollapsed ? 'justify-center' : 'justify-start'
      } ${
        isActive
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
          : theme === 'dark'
            ? 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/20 hover:border-gray-600/30'
            : 'bg-white/40 text-gray-600 hover:bg-white/70 hover:text-gray-800 border border-gray-200/30 hover:border-gray-300/40'
      }`}
      title={isCollapsed ? label : undefined}
    >
      <div className="flex-shrink-0">{icon}</div>
      {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
}
