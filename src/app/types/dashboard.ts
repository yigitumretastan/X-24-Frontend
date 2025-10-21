export interface Workspace {
  id: string;
  name: string;
  platform?: string;
  description?: string;
  createdAt?: string;
  memberCount?: number;
}

export interface DashboardStats {
  totalProjects: number;
  activeMembers: number;
  weeklyHours: number;
  completedTasks: number;
  projectsGrowth?: string;
  membersGrowth?: string;
  hoursGrowth?: string;
  tasksGrowth?: string;
}

export interface ActivityItem {
  id: string;
  type: 'task' | 'member' | 'message' | 'project';
  title: string;
  description?: string;
  timestamp: string;
  icon?: string;
  color?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  gradient: string;
}

export interface DashboardData {
  workspace: Workspace | null;
  stats: DashboardStats;
  recentActivities: ActivityItem[];
  quickActions: QuickAction[];
}

export interface DashboardSettings {
  showStats: boolean;
  showActivities: boolean;
  showQuickActions: boolean;
  theme: 'light' | 'dark';
}