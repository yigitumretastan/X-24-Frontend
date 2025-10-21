import { useState, useEffect, useMemo } from "react";
import { 
  Project, 
  ProjectFilters, 
  CreateProjectData,
  ProjectStats
} from "@/app/types/projects";
import { 
  mockProjects
} from "@/data/projects/projects";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  
  // Filters
  const [filters, setFilters] = useState<ProjectFilters>({
    status: [],
    priority: [],
    category: [],
    members: [],
    dateRange: {},
    search: ""
  });

  // Computed values
  const stats: ProjectStats = useMemo(() => {
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      pausedProjects: projects.filter(p => p.status === 'paused').length,
      totalTasks: projects.reduce((sum, p) => sum + p.tasks.length, 0),
      completedTasks: projects.reduce((sum, p) => 
        sum + p.tasks.filter(t => t.status === 'completed').length, 0
      ),
      overdueTasks: projects.reduce((sum, p) => 
        sum + p.tasks.filter(t => 
          t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
        ).length, 0
      ),
      totalMembers: new Set(projects.flatMap(p => p.assignedMembers.map(m => m.id))).size,
      totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
      spentBudget: projects.reduce((sum, p) => sum + (p.spentBudget || 0), 0)
    };
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          project.name.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.tags.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(project.status)) {
        return false;
      }

      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(project.priority)) {
        return false;
      }

      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(project.category)) {
        return false;
      }

      // Members filter
      if (filters.members.length > 0) {
        const hasMatchingMember = project.assignedMembers.some(member => 
          filters.members.includes(member.id)
        );
        if (!hasMatchingMember) return false;
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const projectStart = new Date(project.startDate);
        if (filters.dateRange.start && projectStart < new Date(filters.dateRange.start)) {
          return false;
        }
        if (filters.dateRange.end && projectStart > new Date(filters.dateRange.end)) {
          return false;
        }
      }

      return true;
    });
  }, [projects, filters]);

  // Project operations
  const createProject = async (projectData: CreateProjectData) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Gerçek API çağrısı yapılacak
      // const { createProjectFromAPI } = await import("@/app/lib/endpoints");
      // const newProject = await createProjectFromAPI(projectData);

      // Şimdilik mock data ile simüle ediyoruz
      const newProject: Project = {
        id: Date.now().toString(),
        ...projectData.project,
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "1", // Current user ID
        assignedMembers: [], // Will be populated based on assignedMembers IDs
        tasks: projectData.initialTasks?.map(task => ({
          ...task,
          id: `task-${Date.now()}-${Math.random()}`
        })) || [],
        milestones: projectData.initialMilestones?.map(milestone => ({
          ...milestone,
          id: `milestone-${Date.now()}-${Math.random()}`,
          tasks: []
        })) || [],
        attachments: []
      };

      setProjects(prev => [newProject, ...prev]);
      setShowCreateModal(false);
      
      return newProject;
    } catch (err) {
      console.error("Proje oluşturulurken hata:", err);
      setError("Proje oluşturulurken bir hata oluştu.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Gerçek API çağrısı yapılacak
      // const { updateProjectFromAPI } = await import("@/app/lib/endpoints");
      // const updatedProject = await updateProjectFromAPI(projectId, updates);

      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      ));

      if (selectedProject?.id === projectId) {
        setSelectedProject(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (err) {
      console.error("Proje güncellenirken hata:", err);
      setError("Proje güncellenirken bir hata oluştu.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Gerçek API çağrısı yapılacak
      // const { deleteProjectFromAPI } = await import("@/app/lib/endpoints");
      // await deleteProjectFromAPI(projectId);

      setProjects(prev => prev.filter(project => project.id !== projectId));
      
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
        setShowDetailModal(false);
      }
    } catch (err) {
      console.error("Proje silinirken hata:", err);
      setError("Proje silinirken bir hata oluştu.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const duplicateProject = async (projectId: string) => {
    const originalProject = projects.find(p => p.id === projectId);
    if (!originalProject) return;

    const duplicatedProject: Project = {
      ...originalProject,
      id: Date.now().toString(),
      name: `${originalProject.name} (Kopya)`,
      status: 'planning',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: originalProject.tasks.map(task => ({
        ...task,
        id: `task-${Date.now()}-${Math.random()}`,
        status: 'todo',
        completedAt: undefined,
        actualHours: 0
      })),
      milestones: originalProject.milestones.map(milestone => ({
        ...milestone,
        id: `milestone-${Date.now()}-${Math.random()}`,
        status: 'pending',
        completedAt: undefined
      }))
    };

    setProjects(prev => [duplicatedProject, ...prev]);
    return duplicatedProject;
  };

  // Filter operations
  const updateFilters = (newFilters: Partial<ProjectFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      category: [],
      members: [],
      dateRange: {},
      search: ""
    });
  };

  // Modal operations
  const openProjectDetail = (project: Project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  const closeProjectDetail = () => {
    setSelectedProject(null);
    setShowDetailModal(false);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  // Utility functions
  const getProjectsByStatus = (status: Project['status']) => {
    return projects.filter(project => project.status === status);
  };

  const getOverdueProjects = () => {
    return projects.filter(project => 
      project.deadline && 
      new Date(project.deadline) < new Date() && 
      project.status !== 'completed'
    );
  };

  const getProjectProgress = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || project.tasks.length === 0) return 0;
    
    const completedTasks = project.tasks.filter(t => t.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const getStatusColor = (status: Project['status']) => {
    const colors = {
      'planning': 'blue',
      'active': 'emerald',
      'paused': 'amber',
      'completed': 'green',
      'cancelled': 'red'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Project['priority']) => {
    const colors = {
      'low': 'gray',
      'medium': 'blue',
      'high': 'amber',
      'urgent': 'red'
    };
    return colors[priority];
  };

  // Data fetching
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Gerçek API çağrısı yapılacak
      // const { fetchProjectsFromAPI } = await import("@/app/lib/endpoints");
      // const projectsData = await fetchProjectsFromAPI();
      
      // Şimdilik mock data kullanıyoruz
      setProjects(mockProjects);
    } catch (err) {
      console.error("Projeler yüklenirken hata:", err);
      setError("Projeler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    // Data
    projects: filteredProjects,
    allProjects: projects,
    stats,
    selectedProject,
    loading,
    error,
    
    // UI State
    viewMode,
    setViewMode,
    showCreateModal,
    showDetailModal,
    filters,
    
    // Operations
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
    
    // Filters
    updateFilters,
    clearFilters,
    
    // Modals
    openProjectDetail,
    closeProjectDetail,
    openCreateModal,
    closeCreateModal,
    
    // Utilities
    getProjectsByStatus,
    getOverdueProjects,
    getProjectProgress,
    getStatusColor,
    getPriorityColor,
    
    // Refresh
    refreshProjects: fetchProjects,
    
    // Templates
    templates: mockProjectTemplates,
    
    // Activities
    recentActivities: mockProjectActivities
  };
};
