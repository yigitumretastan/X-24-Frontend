import { 
  AnalysisStats, 
  TaskAnalytics, 
  ProjectAnalytics, 
  TimeAnalytics, 
  PerformanceMetrics, 
  RecentActivity, 
  Goal, 
  AnalysisDashboard 
} from "@/app/types/analysis";

export const mockAnalysisStats: AnalysisStats = {
  totalTasks: 156,
  completedTasks: 132,
  inProgressTasks: 18,
  pendingTasks: 6,
  totalProjects: 12,
  activeProjects: 8,
  completedProjects: 4,
  totalWorkingHours: 1240,
  thisWeekHours: 42,
  thisMonthHours: 168,
  productivity: 87,
  efficiency: 92
};

export const mockTaskAnalytics: TaskAnalytics = {
  completionRate: 84.6,
  averageCompletionTime: 3.2,
  tasksByPriority: {
    high: 45,
    medium: 78,
    low: 33
  },
  tasksByStatus: {
    todo: 24,
    inProgress: 18,
    completed: 132,
    pending: 6
  },
  tasksByType: {
    "Geliştirme": 68,
    "Tasarım": 32,
    "Test": 28,
    "Dokümantasyon": 18,
    "Toplantı": 10
  }
};

export const mockProjectAnalytics: ProjectAnalytics = {
  totalProjects: 12,
  activeProjects: 8,
  completedProjects: 4,
  projectProgress: [
    {
      name: "Zeniva Dashboard",
      progress: 85,
      status: "active",
      tasksCount: 45,
      completedTasks: 38
    },
    {
      name: "Mobile App",
      progress: 62,
      status: "active",
      tasksCount: 32,
      completedTasks: 20
    },
    {
      name: "API Geliştirme",
      progress: 100,
      status: "completed",
      tasksCount: 28,
      completedTasks: 28
    },
    {
      name: "E-ticaret Platformu",
      progress: 45,
      status: "active",
      tasksCount: 56,
      completedTasks: 25
    },
    {
      name: "CRM Sistemi",
      progress: 78,
      status: "active",
      tasksCount: 34,
      completedTasks: 27
    }
  ]
};

export const mockTimeAnalytics: TimeAnalytics = {
  dailyHours: [
    { date: "2024-10-13", hours: 8.5 },
    { date: "2024-10-14", hours: 7.2 },
    { date: "2024-10-15", hours: 9.1 },
    { date: "2024-10-16", hours: 6.8 },
    { date: "2024-10-17", hours: 8.0 },
    { date: "2024-10-18", hours: 7.5 },
    { date: "2024-10-19", hours: 5.2 }
  ],
  weeklyHours: [
    { week: "Hafta 1", hours: 42 },
    { week: "Hafta 2", hours: 38 },
    { week: "Hafta 3", hours: 45 },
    { week: "Hafta 4", hours: 40 }
  ],
  monthlyHours: [
    { month: "Ocak", hours: 168 },
    { month: "Şubat", hours: 152 },
    { month: "Mart", hours: 176 },
    { month: "Nisan", hours: 160 },
    { month: "Mayıs", hours: 184 },
    { month: "Haziran", hours: 172 }
  ],
  timeByProject: [
    { projectName: "Zeniva Dashboard", hours: 124, percentage: 35 },
    { projectName: "Mobile App", hours: 89, percentage: 25 },
    { projectName: "API Geliştirme", hours: 67, percentage: 19 },
    { projectName: "E-ticaret", hours: 45, percentage: 13 },
    { projectName: "CRM Sistemi", hours: 28, percentage: 8 }
  ]
};

export const mockPerformanceMetrics: PerformanceMetrics = {
  productivity: 87,
  efficiency: 92,
  qualityScore: 89,
  onTimeDelivery: 94,
  teamCollaboration: 86,
  skillDevelopment: 78
};

export const mockRecentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "task_completed",
    title: "Dashboard UI Tamamlandı",
    description: "Ana dashboard arayüzü başarıyla tamamlandı",
    timestamp: "2 saat önce",
    icon: "CheckCircle",
    color: "emerald"
  },
  {
    id: "2",
    type: "milestone_reached",
    title: "Proje %85 Tamamlandı",
    description: "Zeniva Dashboard projesi %85 tamamlanma oranına ulaştı",
    timestamp: "5 saat önce",
    icon: "Target",
    color: "blue"
  },
  {
    id: "3",
    type: "collaboration",
    title: "Takım Toplantısı",
    description: "Haftalık sprint toplantısı gerçekleştirildi",
    timestamp: "1 gün önce",
    icon: "Users",
    color: "purple"
  },
  {
    id: "4",
    type: "project_started",
    title: "Yeni Proje Başlatıldı",
    description: "Mobile App projesi geliştirme sürecine başlandı",
    timestamp: "2 gün önce",
    icon: "Rocket",
    color: "orange"
  },
  {
    id: "5",
    type: "task_completed",
    title: "API Entegrasyonu",
    description: "Kullanıcı yönetimi API'si entegre edildi",
    timestamp: "3 gün önce",
    icon: "Code",
    color: "indigo"
  }
];

export const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Aylık Görev Hedefi",
    description: "Bu ay 50 görev tamamlama hedefi",
    target: 50,
    current: 42,
    unit: "görev",
    deadline: "2024-10-31",
    status: "on_track",
    progress: 84
  },
  {
    id: "2",
    title: "Proje Teslim Hedefi",
    description: "Q4'te 3 proje teslim etme hedefi",
    target: 3,
    current: 2,
    unit: "proje",
    deadline: "2024-12-31",
    status: "on_track",
    progress: 67
  },
  {
    id: "3",
    title: "Çalışma Saati Hedefi",
    description: "Haftalık 40 saat çalışma hedefi",
    target: 40,
    current: 42,
    unit: "saat",
    deadline: "2024-10-25",
    status: "completed",
    progress: 105
  },
  {
    id: "4",
    title: "Skill Geliştirme",
    description: "Yeni teknoloji öğrenme hedefi",
    target: 5,
    current: 2,
    unit: "teknoloji",
    deadline: "2024-11-30",
    status: "at_risk",
    progress: 40
  }
];

export const mockAnalysisDashboard: AnalysisDashboard = {
  stats: mockAnalysisStats,
  taskAnalytics: mockTaskAnalytics,
  projectAnalytics: mockProjectAnalytics,
  timeAnalytics: mockTimeAnalytics,
  performanceMetrics: mockPerformanceMetrics,
  recentActivities: mockRecentActivities,
  goals: mockGoals
};
