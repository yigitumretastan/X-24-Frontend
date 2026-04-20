"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings as SettingsIcon, ChevronLeft, ChevronRight, Home, MessageSquareText, CheckSquare, FolderKanban, Calendar, BarChart2, HardDrive, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "../../dashboard/layout";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`w-full h-full bg-background border-r ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`} />;
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <TooltipProvider delay={0}>
      <div className={`w-full h-full flex flex-col bg-background border-r transition-all duration-300 relative ${
        isCollapsed ? 'w-[80px]' : 'w-[280px]'
      }`}>
        
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute -right-4 top-6 h-8 w-8 rounded-full border bg-background shadow-md z-50 hover:bg-accent"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>

        <div className={`flex flex-col flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-6 space-y-6 overflow-y-auto`}>
          {/* Menu Label */}
          {!isCollapsed && (
            <div className="px-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Menü
              </h2>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            <SidebarLink 
              href="/dashboard" 
              icon={<Home className="h-5 w-5" />} 
              label="Anasayfa"
              isActive={pathname === "/dashboard"}
              isCollapsed={isCollapsed}
            />
            <SidebarLink 
              href="/dashboard/messages" 
              icon={<MessageSquareText className="h-5 w-5" />} 
              label="Mesajlar"
              isActive={pathname === "/dashboard/messages"}
              isCollapsed={isCollapsed}
            />
            <SidebarLink 
              href="/dashboard/tasks" 
              icon={<CheckSquare className="h-5 w-5" />} 
              label="Görevler"
              isActive={pathname === "/dashboard/tasks"}
              isCollapsed={isCollapsed}
            />
            <SidebarLink 
              href="/dashboard/projects" 
              icon={<FolderKanban className="h-5 w-5" />} 
              label="Projeler"
              isActive={pathname === "/dashboard/projects"}
              isCollapsed={isCollapsed}
            />
            <SidebarLink 
              href="/dashboard/calender" 
              icon={<Calendar className="h-5 w-5" />} 
              label="Takvim"
              isActive={pathname === "/dashboard/calender"}
              isCollapsed={isCollapsed}
            />
            <SidebarLink 
              href="/dashboard/analysis" 
              icon={<BarChart2 className="h-5 w-5" />} 
              label="Analiz"
              isActive={pathname === "/dashboard/analysis"}
              isCollapsed={isCollapsed}
            />
            <SidebarLink 
              href="/dashboard/disk" 
              icon={<HardDrive className="h-5 w-5" />} 
              label="Disk"
              isActive={pathname === "/dashboard/disk"}
              isCollapsed={isCollapsed}
            />
            <SidebarLink 
              href="/dashboard/reports" 
              icon={<FileText className="h-5 w-5" />} 
              label="Raporlar"
              isActive={pathname === "/dashboard/reports"}
              isCollapsed={isCollapsed}
            />
            <SidebarLink 
              href="/dashboard/mail" 
              icon={<Mail className="h-5 w-5" />} 
              label="E-Posta"
              isActive={pathname === "/dashboard/mail"}
              isCollapsed={isCollapsed}
            />
          </nav>

          <div className="mt-auto pt-4 flex flex-col gap-1">
            <Separator className="my-4" />
            <SidebarLink 
              href="/dashboard/settings" 
              icon={<SettingsIcon className="h-5 w-5" />} 
              label="Ayarlar"
              isActive={pathname === "/dashboard/settings"}
              isCollapsed={isCollapsed}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  isActive = false,
  isCollapsed = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}) {
  const content = (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      } ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`}
    >
      <div className="flex-shrink-0">{icon}</div>
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
