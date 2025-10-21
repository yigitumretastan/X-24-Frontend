
import { DashboardStats, ActivityItem, QuickAction, Workspace } from "@/app/types/dashboard";

export const mockDashboardStats: DashboardStats = {
  totalProjects: 24,
  activeMembers: 8,
  weeklyHours: 42,
  completedTasks: 12,
  projectsGrowth: "+12%",
  membersGrowth: "+2",
  hoursGrowth: "42h",
  tasksGrowth: "+85%"
};

export const mockRecentActivities: ActivityItem[] = [
  {
	id: "1",
	type: "task",
	title: "Yeni görev tamamlandı",
	description: "Frontend geliştirme görevi başarıyla tamamlandı",
	timestamp: "2 dakika önce",
	icon: "CheckCircle",
	color: "blue"
  },
  {
	id: "2", 
	type: "member",
	title: "Yeni üye eklendi",
	description: "Ahmet Yılmaz takıma katıldı",
	timestamp: "1 saat önce",
	icon: "Users",
	color: "emerald"
  },
  {
	id: "3",
	type: "message", 
	title: "3 yeni mesaj alındı",
	description: "Proje grubu sohbetinde yeni mesajlar var",
	timestamp: "3 saat önce",
	icon: "MessageSquare",
	color: "purple"
  },
  {
	id: "4",
	type: "project",
	title: "Yeni proje oluşturuldu",
	description: "E-ticaret projesi başlatıldı",
	timestamp: "5 saat önce",
	icon: "FileText",
	color: "orange"
  },
  {
	id: "5",
	type: "task",
	title: "Görev atandı",
	description: "Backend API geliştirme görevi atandı",
	timestamp: "1 gün önce",
	icon: "CheckCircle",
	color: "blue"
  }
];

export const mockQuickActions: QuickAction[] = [
  {
	id: "tasks",
	title: "Görevler",
	description: "Yönet & Takip Et",
	icon: "CheckCircle",
	color: "blue",
	route: "/dashboard/tasks",
	gradient: "from-blue-500 to-blue-600"
  },
  {
	id: "calendar",
	title: "Takvim", 
	description: "Etkinlik Planlama",
	icon: "Calendar",
	color: "emerald",
	route: "/dashboard/calender",
	gradient: "from-emerald-500 to-emerald-600"
  },
  {
	id: "messages",
	title: "Mesajlar",
	description: "Takım İletişimi", 
	icon: "MessageSquare",
	color: "purple",
	route: "/dashboard/messages",
	gradient: "from-purple-500 to-purple-600"
  },
  {
	id: "analytics",
	title: "Analizler",
	description: "Performans Raporu",
	icon: "BarChart3", 
	color: "orange",
	route: "/dashboard/analysis",
	gradient: "from-orange-500 to-orange-600"
  },
  {
	id: "reports",
	title: "Raporlar",
	description: "Rapor Yönetimi",
	icon: "FileText",
	color: "red", 
	route: "/dashboard/reports",
	gradient: "from-red-500 to-red-600"
  },
  {
	id: "projects",
	title: "Projeler",
	description: "Proje Yönetimi",
	icon: "Folder",
	color: "indigo",
	route: "/dashboard/projects", 
	gradient: "from-indigo-500 to-indigo-600"
  },
  {
	id: "settings",
	title: "Ayarlar",
	description: "Sistem Ayarları",
	icon: "Settings",
	color: "gray",
	route: "/dashboard/settings",
	gradient: "from-gray-500 to-gray-600"
  }
];

export const mockWorkspaces: Workspace[] = [
  {
	id: "1",
	name: "Zeniva Workspace",
	platform: "Web Development",
	description: "Ana geliştirme workspace'i",
	createdAt: "2024-01-15T10:00:00Z",
	memberCount: 8
  },
  {
	id: "2", 
	name: "Mobile App Project",
	platform: "React Native",
	description: "Mobil uygulama geliştirme projesi",
	createdAt: "2024-02-01T14:30:00Z",
	memberCount: 5
  },
  {
	id: "3",
	name: "E-Commerce Platform",
	platform: "Next.js",
	description: "E-ticaret platformu geliştirme",
	createdAt: "2024-03-10T09:15:00Z",
	memberCount: 12
  },
  {
	id: "4",
	name: "AI Research Lab",
	platform: "Python",
	description: "Yapay zeka araştırma laboratuvarı",
	createdAt: "2024-01-20T16:45:00Z",
	memberCount: 6
  }
];

// Helper functions
export const getWorkspaceById = (id: string): Workspace | undefined => {
  return mockWorkspaces.find(workspace => workspace.id === id);
};

export const getDefaultWorkspace = (): Workspace => {
  return mockWorkspaces[0];
};