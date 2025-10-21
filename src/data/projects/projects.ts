import { 
  Project, 
  ProjectMember, 
  ProjectTask, 
  Milestone, 
  ProjectStats, 
  ProjectActivity, 
  ProjectTemplate,
  ProjectDashboard
} from "@/app/types/projects";

export const mockProjectMembers: ProjectMember[] = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    email: "ahmet@zeniva.com",
    role: "owner",
    avatar: "/avatars/ahmet.jpg",
    joinDate: "2024-01-15",
    isActive: true
  },
  {
    id: "2",
    name: "Elif Kaya",
    email: "elif@zeniva.com",
    role: "admin",
    avatar: "/avatars/elif.jpg",
    joinDate: "2024-02-01",
    isActive: true
  },
  {
    id: "3",
    name: "Mehmet Demir",
    email: "mehmet@zeniva.com",
    role: "member",
    avatar: "/avatars/mehmet.jpg",
    joinDate: "2024-02-15",
    isActive: true
  },
  {
    id: "4",
    name: "Ayşe Öztürk",
    email: "ayse@zeniva.com",
    role: "member",
    avatar: "/avatars/ayse.jpg",
    joinDate: "2024-03-01",
    isActive: false
  }
];

export const mockProjectTasks: ProjectTask[] = [
  {
    id: "task-1",
    title: "UI/UX Tasarım",
    description: "Ana sayfa tasarımının oluşturulması",
    status: "completed",
    priority: "high",
    assignedTo: "2",
    dueDate: "2024-10-15",
    completedAt: "2024-10-14",
    estimatedHours: 16,
    actualHours: 14,
    tags: ["design", "ui", "frontend"]
  },
  {
    id: "task-2",
    title: "Backend API Geliştirme",
    description: "Kullanıcı yönetimi API'lerinin geliştirilmesi",
    status: "in_progress",
    priority: "high",
    assignedTo: "3",
    dueDate: "2024-10-25",
    estimatedHours: 32,
    actualHours: 18,
    tags: ["backend", "api", "development"]
  },
  {
    id: "task-3",
    title: "Database Tasarımı",
    description: "Veritabanı şemasının oluşturulması",
    status: "completed",
    priority: "medium",
    assignedTo: "1",
    dueDate: "2024-10-10",
    completedAt: "2024-10-09",
    estimatedHours: 8,
    actualHours: 10,
    tags: ["database", "schema"]
  },
  {
    id: "task-4",
    title: "Frontend Entegrasyon",
    description: "API'lerin frontend ile entegrasyonu",
    status: "todo",
    priority: "medium",
    assignedTo: "2",
    dueDate: "2024-11-01",
    estimatedHours: 24,
    tags: ["frontend", "integration"]
  }
];

export const mockMilestones: Milestone[] = [
  {
    id: "milestone-1",
    title: "MVP Tamamlanması",
    description: "Minimum viable product'ın tamamlanması",
    dueDate: "2024-11-15",
    status: "pending",
    tasks: ["task-1", "task-2", "task-3"]
  },
  {
    id: "milestone-2",
    title: "Beta Sürüm",
    description: "Beta test için hazır sürüm",
    dueDate: "2024-12-01",
    status: "pending",
    tasks: ["task-4"]
  },
  {
    id: "milestone-3",
    title: "Proje Lansmanı",
    description: "Projenin canlıya alınması",
    dueDate: "2024-12-15",
    status: "pending",
    tasks: []
  }
];

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Zeniva Dashboard",
    description: "Modern ve kullanıcı dostu proje yönetim dashboard'u geliştirme projesi",
    status: "active",
    priority: "high",
    progress: 75,
    startDate: "2024-09-01",
    deadline: "2024-12-15",
    budget: 50000,
    spentBudget: 32000,
    currency: "TRY",
    category: "Web Development",
    tags: ["react", "typescript", "dashboard", "ui/ux"],
    color: "#6366f1",
    createdAt: "2024-09-01T10:00:00Z",
    updatedAt: "2024-10-19T14:30:00Z",
    createdBy: "1",
    assignedMembers: mockProjectMembers.slice(0, 3),
    tasks: mockProjectTasks,
    milestones: mockMilestones,
    attachments: []
  },
  {
    id: "2",
    name: "Mobile App",
    description: "iOS ve Android için mobil uygulama geliştirme",
    status: "active",
    priority: "medium",
    progress: 45,
    startDate: "2024-08-15",
    deadline: "2024-11-30",
    budget: 75000,
    spentBudget: 28000,
    currency: "TRY",
    category: "Mobile Development",
    tags: ["react-native", "mobile", "ios", "android"],
    color: "#10b981",
    createdAt: "2024-08-15T09:00:00Z",
    updatedAt: "2024-10-18T16:45:00Z",
    createdBy: "1",
    assignedMembers: [mockProjectMembers[0], mockProjectMembers[2]],
    tasks: [],
    milestones: [],
    attachments: []
  },
  {
    id: "3",
    name: "E-ticaret Platformu",
    description: "Kapsamlı e-ticaret çözümü geliştirme",
    status: "planning",
    priority: "high",
    progress: 15,
    startDate: "2024-10-01",
    deadline: "2025-03-01",
    budget: 120000,
    spentBudget: 8000,
    currency: "TRY",
    category: "E-commerce",
    tags: ["nextjs", "ecommerce", "payment", "inventory"],
    color: "#f59e0b",
    createdAt: "2024-09-25T11:30:00Z",
    updatedAt: "2024-10-19T10:15:00Z",
    createdBy: "2",
    assignedMembers: mockProjectMembers,
    tasks: [],
    milestones: [],
    attachments: []
  },
  {
    id: "4",
    name: "CRM Sistemi",
    description: "Müşteri ilişkileri yönetim sistemi",
    status: "completed",
    priority: "medium",
    progress: 100,
    startDate: "2024-06-01",
    endDate: "2024-09-15",
    deadline: "2024-09-30",
    budget: 40000,
    spentBudget: 38500,
    currency: "TRY",
    category: "Business Software",
    tags: ["crm", "customer", "management", "sales"],
    color: "#8b5cf6",
    createdAt: "2024-06-01T08:00:00Z",
    updatedAt: "2024-09-15T17:00:00Z",
    createdBy: "1",
    assignedMembers: [mockProjectMembers[0], mockProjectMembers[1]],
    tasks: [],
    milestones: [],
    attachments: []
  },
  {
    id: "5",
    name: "API Gateway",
    description: "Mikroservis mimarisi için API gateway geliştirme",
    status: "paused",
    priority: "low",
    progress: 30,
    startDate: "2024-07-01",
    deadline: "2024-12-31",
    budget: 25000,
    spentBudget: 12000,
    currency: "TRY",
    category: "Backend Infrastructure",
    tags: ["api", "microservices", "gateway", "infrastructure"],
    color: "#ef4444",
    createdAt: "2024-07-01T12:00:00Z",
    updatedAt: "2024-09-01T14:20:00Z",
    createdBy: "3",
    assignedMembers: [mockProjectMembers[2]],
    tasks: [],
    milestones: [],
    attachments: []
  }
];

export const mockProjectStats: ProjectStats = {
  totalProjects: 5,
  activeProjects: 2,
  completedProjects: 1,
  pausedProjects: 1,
  totalTasks: 24,
  completedTasks: 18,
  overdueTasks: 2,
  totalMembers: 4,
  totalBudget: 310000,
  spentBudget: 118500
};

export const mockProjectActivities: ProjectActivity[] = [
  {
    id: "1",
    type: "task_completed",
    title: "UI/UX Tasarım Tamamlandı",
    description: "Zeniva Dashboard projesi için ana sayfa tasarımı tamamlandı",
    timestamp: "2024-10-19T10:30:00Z",
    userId: "2",
    userName: "Elif Kaya",
    projectId: "1"
  },
  {
    id: "2",
    type: "member_added",
    title: "Yeni Üye Eklendi",
    description: "Mehmet Demir projeye dahil edildi",
    timestamp: "2024-10-18T14:15:00Z",
    userId: "1",
    userName: "Ahmet Yılmaz",
    projectId: "2"
  },
  {
    id: "3",
    type: "milestone_reached",
    title: "Milestone Tamamlandı",
    description: "Database tasarımı milestone'u başarıyla tamamlandı",
    timestamp: "2024-10-17T16:45:00Z",
    userId: "1",
    userName: "Ahmet Yılmaz",
    projectId: "1"
  },
  {
    id: "4",
    type: "created",
    title: "Yeni Proje Oluşturuldu",
    description: "E-ticaret Platformu projesi oluşturuldu",
    timestamp: "2024-10-15T09:20:00Z",
    userId: "2",
    userName: "Elif Kaya",
    projectId: "3"
  }
];

export const mockProjectTemplates: ProjectTemplate[] = [
  {
    id: "template-1",
    name: "Web Uygulaması",
    description: "Standart web uygulaması geliştirme şablonu",
    category: "Web Development",
    tasks: [
      {
        title: "Proje Kurulumu",
        description: "Geliştirme ortamının hazırlanması",
        status: "todo",
        priority: "high",
        estimatedHours: 4,
        actualHours: 0,
        tags: ["setup", "environment"]
      },
      {
        title: "UI/UX Tasarım",
        description: "Kullanıcı arayüzü tasarımı",
        status: "todo",
        priority: "high",
        estimatedHours: 16,
        actualHours: 0,
        tags: ["design", "ui", "ux"]
      },
      {
        title: "Frontend Geliştirme",
        description: "Kullanıcı arayüzü kodlaması",
        status: "todo",
        priority: "medium",
        estimatedHours: 32,
        actualHours: 0,
        tags: ["frontend", "development"]
      }
    ],
    milestones: [
      {
        title: "Tasarım Onayı",
        description: "UI/UX tasarımlarının onaylanması",
        dueDate: "2024-11-15",
        status: "pending"
      },
      {
        title: "Beta Sürüm",
        description: "Test için beta sürümün hazırlanması",
        dueDate: "2024-12-01",
        status: "pending"
      }
    ],
    estimatedDuration: 60,
    complexity: "medium",
    tags: ["web", "frontend", "backend"]
  },
  {
    id: "template-2",
    name: "Mobil Uygulama",
    description: "Cross-platform mobil uygulama şablonu",
    category: "Mobile Development",
    tasks: [
      {
        title: "Platform Seçimi",
        description: "Geliştirme platformunun belirlenmesi",
        status: "todo",
        priority: "high",
        estimatedHours: 2,
        actualHours: 0,
        tags: ["planning", "platform"]
      },
      {
        title: "Wireframe Oluşturma",
        description: "Mobil arayüz wireframe'lerinin hazırlanması",
        status: "todo",
        priority: "high",
        estimatedHours: 12,
        actualHours: 0,
        tags: ["design", "wireframe"]
      }
    ],
    milestones: [
      {
        title: "Prototip",
        description: "İlk çalışan prototip",
        dueDate: "2024-11-30",
        status: "pending"
      }
    ],
    estimatedDuration: 90,
    complexity: "complex",
    tags: ["mobile", "cross-platform", "react-native"]
  }
];

export const mockProjectDashboard: ProjectDashboard = {
  stats: mockProjectStats,
  recentProjects: mockProjects.slice(0, 3),
  recentActivities: mockProjectActivities,
  upcomingDeadlines: [
    {
      projectId: "2",
      projectName: "Mobile App",
      deadline: "2024-11-30",
      daysLeft: 42,
      status: "safe"
    },
    {
      projectId: "1",
      projectName: "Zeniva Dashboard",
      deadline: "2024-12-15",
      daysLeft: 57,
      status: "safe"
    },
    {
      projectId: "3",
      projectName: "E-ticaret Platformu",
      deadline: "2025-03-01",
      daysLeft: 133,
      status: "safe"
    }
  ]
};
