import { Task, TaskType } from "@/app/types/calender";
import { User, Message, Conversation, MessageForm } from "@/app/types/messages";
import { UserProfile, SecuritySettings, NotificationSettings, DataSettings, ApiSettings } from "@/app/types/settings";
import { Task as TaskItem, TaskForm, User as TaskUser, Project } from "@/app/types/tasks";
import { DiskData, DiskFile, DiskUsage, DiskStats, DiskFilter, DiskSort } from "@/app/types/disk";

// Base URL'yi environment'dan al
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7171';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7171/api';

// ============= ALL API ENDPOINTS =============

// Auth endpoints
const AUTH_ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  LOGOUT: `${API_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_URL}/auth/refresh`,
  RESET_PASSWORD: `${API_URL}/auth/reset-password`,
  VERIFY_EMAIL: `${API_URL}/auth/verify-email`,
  FORGOT_PASSWORD: `${API_URL}/auth/forgot-password`,
  CHANGE_PASSWORD: `${API_URL}/auth/change-password`,
  PROFILE: `${API_URL}/auth/profile`,
  ME: `${API_URL}/auth/me`,
};

// Dashboard endpoints
const DASHBOARD_ENDPOINTS = {
  OVERVIEW: `${API_URL}/dashboard/overview`,
  STATS: `${API_URL}/dashboard/stats`,
  RECENT_ACTIVITIES: `${API_URL}/dashboard/activities`,
  QUICK_ACTIONS: `${API_URL}/dashboard/quick-actions`,
  WIDGETS: `${API_URL}/dashboard/widgets`,
  NOTIFICATIONS: `${API_URL}/dashboard/notifications`,
  MARK_NOTIFICATION_READ: (id: string) => `${API_URL}/dashboard/notifications/${id}/read`,
  CLEAR_ALL_NOTIFICATIONS: `${API_URL}/dashboard/notifications/clear`,
};

// Analysis endpoints
const ANALYSIS_ENDPOINTS = {
  OVERVIEW: `${API_URL}/analysis/overview`,
  PERFORMANCE: `${API_URL}/analysis/performance`,
  TASKS_ANALYTICS: `${API_URL}/analysis/tasks`,
  PROJECTS_ANALYTICS: `${API_URL}/analysis/projects`,
  TEAM_ANALYTICS: `${API_URL}/analysis/team`,
  TIME_TRACKING: `${API_URL}/analysis/time-tracking`,
  REPORTS: `${API_URL}/analysis/reports`,
  EXPORT_REPORT: (type: string) => `${API_URL}/analysis/reports/export/${type}`,
  CUSTOM_REPORT: `${API_URL}/analysis/reports/custom`,
};

// Projects endpoints
const PROJECTS_ENDPOINTS = {
  PROJECTS: `${API_URL}/projects`,
  PROJECT_BY_ID: (id: string) => `${API_URL}/projects/${id}`,
  PROJECT_MEMBERS: (id: string) => `${API_URL}/projects/${id}/members`,
  PROJECT_TASKS: (id: string) => `${API_URL}/projects/${id}/tasks`,
  PROJECT_FILES: (id: string) => `${API_URL}/projects/${id}/files`,
  PROJECT_TIMELINE: (id: string) => `${API_URL}/projects/${id}/timeline`,
  PROJECT_SETTINGS: (id: string) => `${API_URL}/projects/${id}/settings`,
  ADD_MEMBER: (id: string) => `${API_URL}/projects/${id}/members`,
  REMOVE_MEMBER: (projectId: string, memberId: string) => `${API_URL}/projects/${projectId}/members/${memberId}`,
  UPDATE_MEMBER_ROLE: (projectId: string, memberId: string) => `${API_URL}/projects/${projectId}/members/${memberId}/role`,
  PROJECT_INVITATIONS: (id: string) => `${API_URL}/projects/${id}/invitations`,
  ACCEPT_INVITATION: (invitationId: string) => `${API_URL}/projects/invitations/${invitationId}/accept`,
  DECLINE_INVITATION: (invitationId: string) => `${API_URL}/projects/invitations/${invitationId}/decline`,
};

// Reports endpoints
const REPORTS_ENDPOINTS = {
  REPORTS: `${API_URL}/reports`,
  REPORT_BY_ID: (id: string) => `${API_URL}/reports/${id}`,
  GENERATE_REPORT: `${API_URL}/reports/generate`,
  SCHEDULED_REPORTS: `${API_URL}/reports/scheduled`,
  REPORT_TEMPLATES: `${API_URL}/reports/templates`,
  EXPORT_REPORT: (id: string, format: string) => `${API_URL}/reports/${id}/export/${format}`,
  SHARE_REPORT: (id: string) => `${API_URL}/reports/${id}/share`,
  REPORT_HISTORY: `${API_URL}/reports/history`,
};

// Workspaces endpoints
const WORKSPACES_ENDPOINTS = {
  WORKSPACES: `${API_URL}/workspaces`,
  WORKSPACE_BY_ID: (id: string) => `${API_URL}/workspaces/${id}`,
  WORKSPACE_MEMBERS: (id: string) => `${API_URL}/workspaces/${id}/members`,
  WORKSPACE_PROJECTS: (id: string) => `${API_URL}/workspaces/${id}/projects`,
  WORKSPACE_SETTINGS: (id: string) => `${API_URL}/workspaces/${id}/settings`,
  INVITE_MEMBER: (id: string) => `${API_URL}/workspaces/${id}/invite`,
  REMOVE_MEMBER: (workspaceId: string, memberId: string) => `${API_URL}/workspaces/${workspaceId}/members/${memberId}`,
  UPDATE_MEMBER_ROLE: (workspaceId: string, memberId: string) => `${API_URL}/workspaces/${workspaceId}/members/${memberId}/role`,
  SWITCH_WORKSPACE: (id: string) => `${API_URL}/workspaces/${id}/switch`,
  WORKSPACE_INVITATIONS: `${API_URL}/workspaces/invitations`,
  ACCEPT_WORKSPACE_INVITATION: (invitationId: string) => `${API_URL}/workspaces/invitations/${invitationId}/accept`,
  DECLINE_WORKSPACE_INVITATION: (invitationId: string) => `${API_URL}/workspaces/invitations/${invitationId}/decline`,
};

// Users endpoints
const USERS_ENDPOINTS = {
  USERS: `${API_URL}/users`,
  USER_BY_ID: (id: string) => `${API_URL}/users/${id}`,
  USER_PROFILE: (id: string) => `${API_URL}/users/${id}/profile`,
  USER_ACTIVITIES: (id: string) => `${API_URL}/users/${id}/activities`,
  USER_TASKS: (id: string) => `${API_URL}/users/${id}/tasks`,
  USER_PROJECTS: (id: string) => `${API_URL}/users/${id}/projects`,
  SEARCH_USERS: `${API_URL}/users/search`,
  ONLINE_USERS: `${API_URL}/users/online`,
};

// Notifications endpoints
const NOTIFICATIONS_ENDPOINTS = {
  NOTIFICATIONS: `${API_URL}/notifications`,
  NOTIFICATION_BY_ID: (id: string) => `${API_URL}/notifications/${id}`,
  MARK_READ: (id: string) => `${API_URL}/notifications/${id}/read`,
  MARK_ALL_READ: `${API_URL}/notifications/read-all`,
  DELETE_NOTIFICATION: (id: string) => `${API_URL}/notifications/${id}`,
  NOTIFICATION_SETTINGS: `${API_URL}/notifications/settings`,
  UNREAD_COUNT: `${API_URL}/notifications/unread-count`,
};

// Time Tracking endpoints
const TIME_TRACKING_ENDPOINTS = {
  TIME_ENTRIES: `${API_URL}/time-tracking/entries`,
  TIME_ENTRY_BY_ID: (id: string) => `${API_URL}/time-tracking/entries/${id}`,
  START_TIMER: `${API_URL}/time-tracking/start`,
  STOP_TIMER: `${API_URL}/time-tracking/stop`,
  CURRENT_TIMER: `${API_URL}/time-tracking/current`,
  TIME_REPORTS: `${API_URL}/time-tracking/reports`,
  TIME_STATS: `${API_URL}/time-tracking/stats`,
};

// SignalR Hub endpoints
const SIGNALR_ENDPOINTS = {
  CHAT_HUB: `${BASE_URL}/hubs/chatHub`,
  NOTIFICATION_HUB: `${BASE_URL}/hubs/notificationHub`,
  PROJECT_HUB: `${BASE_URL}/hubs/projectHub`,
  TASK_HUB: `${BASE_URL}/hubs/taskHub`,
};

// Calendar endpoints
const CALENDAR_ENDPOINTS = {
  TASKS: `${BASE_URL}/calender/tasks`,
  TASK_TYPES: `${BASE_URL}/calender/task-types`,
  CREATE_TASK: `${BASE_URL}/calender/tasks`,
  UPDATE_TASK: (id: number) => `${BASE_URL}/calender/tasks/${id}`,
  DELETE_TASK: (id: number) => `${BASE_URL}/calender/tasks/${id}`,
};

// Messages endpoints
const MESSAGES_ENDPOINTS = {
  USERS: `${BASE_URL}/messages/users`,
  CONVERSATIONS: `${BASE_URL}/messages/conversations`,
  MESSAGES: (conversationId: string) => `${BASE_URL}/messages/conversations/${conversationId}/messages`,
  SEND_MESSAGE: `${BASE_URL}/messages/send`,
  MARK_READ: (messageId: string) => `${BASE_URL}/messages/${messageId}/read`,
  DELETE_MESSAGE: (messageId: string) => `${BASE_URL}/messages/${messageId}`,
  UPLOAD_ATTACHMENT: `${BASE_URL}/messages/upload`,
};

// Settings endpoints
const SETTINGS_ENDPOINTS = {
  PROFILE: `${BASE_URL}/settings/profile`,
  SECURITY: `${BASE_URL}/settings/security`,
  NOTIFICATIONS: `${BASE_URL}/settings/notifications`,
  DATA: `${BASE_URL}/settings/data`,
  API: `${BASE_URL}/settings/api`,
  CHANGE_PASSWORD: `${BASE_URL}/settings/security/password`,
  EXPORT_DATA: `${BASE_URL}/settings/data/export`,
  DELETE_ACCOUNT: `${BASE_URL}/settings/data/delete-account`,
};

// Tasks endpoints (Updated)
const TASKS_ENDPOINTS = {
  TASKS: `${API_URL}/tasks`,
  TASK_BY_ID: (id: number) => `${API_URL}/tasks/${id}`,
  USERS: `${API_URL}/users`,
  PROJECTS: `${API_URL}/projects`,
  TASK_COMMENTS: (id: number) => `${API_URL}/tasks/${id}/comments`,
  TASK_ATTACHMENTS: (id: number) => `${API_URL}/tasks/${id}/attachments`,
  ASSIGN_TASK: (id: number) => `${API_URL}/tasks/${id}/assign`,
  TASK_STATUS: (id: number) => `${API_URL}/tasks/${id}/status`,
  TASK_PRIORITY: (id: number) => `${API_URL}/tasks/${id}/priority`,
};

// Disk endpoints
const DISK_ENDPOINTS = {
  FILES: `${BASE_URL}/disk/files`,
  FILE_BY_ID: (id: string) => `${BASE_URL}/disk/files/${id}`,
  USAGE: `${BASE_URL}/disk/usage`,
  STATS: `${BASE_URL}/disk/stats`,
  UPLOAD: `${BASE_URL}/disk/upload`,
  DELETE: (id: string) => `${BASE_URL}/disk/files/${id}`,
  DOWNLOAD: (id: string) => `${BASE_URL}/disk/files/${id}/download`,
  SEARCH: `${BASE_URL}/disk/search`,
};

export async function fetchTasks(): Promise<Task[]> {
  try {
    const response = await fetch(CALENDAR_ENDPOINTS.TASKS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Fallback olarak mock data'yı import et
    const { mockTasks } = await import('@/data/calender/tasks');
    return mockTasks;
  }
}

export async function fetchTaskTypes(): Promise<TaskType[]> {
  try {
    const response = await fetch(CALENDAR_ENDPOINTS.TASK_TYPES, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching task types:', error);
    // Fallback olarak mock data'yı import et
    const { mockTaskTypes } = await import('@/data/calender/tasks');
    return mockTaskTypes;
  }
}

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  try {
    const response = await fetch(CALENDAR_ENDPOINTS.CREATE_TASK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function updateTask(id: number, task: Partial<Task>): Promise<Task> {
  try {
    const response = await fetch(CALENDAR_ENDPOINTS.UPDATE_TASK(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

export async function deleteTask(id: number): Promise<void> {
  try {
    const response = await fetch(CALENDAR_ENDPOINTS.DELETE_TASK(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

// ============= MESSAGES API FUNCTIONS =============

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(MESSAGES_ENDPOINTS.USERS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    // Fallback olarak mock data'yı import et
    const { users } = await import('@/data/messages/users');
    return users;
  }
}

export async function fetchConversations(): Promise<Conversation[]> {
  try {
    const response = await fetch(MESSAGES_ENDPOINTS.CONVERSATIONS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching conversations:', error);
    // Fallback olarak mock data'yı import et
    const { conversations } = await import('@/data/messages/conversations');
    return conversations;
  }
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  try {
    const response = await fetch(MESSAGES_ENDPOINTS.MESSAGES(conversationId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    // Fallback olarak mock data'dan conversation'ı bul
    const { conversations } = await import('@/data/messages/conversations');
    const conversation = conversations.find(c => c.id === conversationId);
    return conversation?.messages || [];
  }
}

export async function sendMessage(messageForm: MessageForm): Promise<Message> {
  try {
    const response = await fetch(MESSAGES_ENDPOINTS.SEND_MESSAGE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageForm),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function markMessageAsRead(messageId: string): Promise<void> {
  try {
    const response = await fetch(MESSAGES_ENDPOINTS.MARK_READ(messageId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
}

export async function deleteMessage(messageId: string): Promise<void> {
  try {
    const response = await fetch(MESSAGES_ENDPOINTS.DELETE_MESSAGE(messageId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}

export async function uploadAttachment(file: File): Promise<{ url: string; name: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(MESSAGES_ENDPOINTS.UPLOAD_ATTACHMENT, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error;
  }
}

// ============= SETTINGS API FUNCTIONS =============

export async function fetchUserProfile(): Promise<UserProfile> {
  try {
    const response = await fetch(SETTINGS_ENDPOINTS.PROFILE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Fallback mock data
    return {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '',
      phone: '+90 555 123 45 67',
      bio: 'Software Developer',
      location: 'İstanbul, Türkiye',
      company: 'Tech Company',
      website: 'https://johndoe.com'
    };
  }
}

export async function updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const response = await fetch(SETTINGS_ENDPOINTS.PROFILE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function fetchSecuritySettings(): Promise<SecuritySettings> {
  try {
    const response = await fetch(SETTINGS_ENDPOINTS.SECURITY, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching security settings:', error);
    // Fallback mock data
    return {
      twoFactorEnabled: false,
      passwordLastChanged: new Date(),
      loginSessions: [],
      trustedDevices: []
    };
  }
}

export async function updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
  try {
    const response = await fetch(SETTINGS_ENDPOINTS.SECURITY, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating security settings:', error);
    throw error;
  }
}

export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  try {
    const response = await fetch(SETTINGS_ENDPOINTS.NOTIFICATIONS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    // Fallback mock data
    return {
      email: {
        messages: true,
        mentions: true,
        updates: false,
        marketing: false
      },
      push: {
        messages: true,
        mentions: true,
        updates: false
      },
      desktop: {
        messages: true,
        mentions: true
      }
    };
  }
}

export async function updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
  try {
    const response = await fetch(SETTINGS_ENDPOINTS.NOTIFICATIONS, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
}

export async function fetchDataSettings(): Promise<DataSettings> {
  try {
    const response = await fetch(SETTINGS_ENDPOINTS.DATA, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data settings:', error);
    // Fallback mock data
    return {
      storageUsed: 2.5,
      storageLimit: 10,
      autoBackup: true,
      backupFrequency: 'weekly',
      lastBackup: new Date()
    };
  }
}

export async function fetchApiSettings(): Promise<ApiSettings> {
  try {
    const response = await fetch(SETTINGS_ENDPOINTS.API, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching API settings:', error);
    // Fallback mock data
    return {
      apiKeys: [],
      webhooks: [],
      rateLimits: {
        requestsPerMinute: 60,
        requestsPerHour: 1000,
        requestsPerDay: 10000,
        currentUsage: {
          minute: 0,
          hour: 0,
          day: 0
        }
      }
    };
  }
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  try {
    const response = await fetch(SETTINGS_ENDPOINTS.CHANGE_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}

export async function exportUserData(): Promise<Blob> {
  try {
    const response = await fetch(SETTINGS_ENDPOINTS.EXPORT_DATA, {
      method: 'GET',
      headers: {
        'Accept': 'application/zip',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw error;
  }
}

// ============= TASKS API FUNCTIONS =============

export async function fetchTasksFromAPI(): Promise<TaskItem[]> {
  try {
    const response = await fetch(TASKS_ENDPOINTS.TASKS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.tasks || data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Fallback mock data
    return [
      {
        id: 1,
        title: "Örnek Görev",
        description: "Bu bir örnek görevdir",
        author: "Admin",
        status: "todo",
        priority: "medium",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
  }
}

export async function createTaskFromAPI(taskData: TaskForm): Promise<TaskItem> {
  try {
    const response = await fetch(TASKS_ENDPOINTS.TASKS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function updateTaskFromAPI(taskId: number, taskData: Partial<TaskItem>): Promise<TaskItem> {
  try {
    const response = await fetch(TASKS_ENDPOINTS.TASK_BY_ID(taskId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

export async function deleteTaskFromAPI(taskId: number): Promise<void> {
  try {
    const response = await fetch(TASKS_ENDPOINTS.TASK_BY_ID(taskId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

export async function fetchUsersFromAPI(): Promise<TaskUser[]> {
  try {
    const response = await fetch(TASKS_ENDPOINTS.USERS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    // Fallback mock data
    return [
      { id: '1', name: 'Admin User', email: 'admin@example.com' },
      { id: '2', name: 'John Doe', email: 'john@example.com' },
    ];
  }
}

export async function fetchProjectsFromAPI(): Promise<Project[]> {
  try {
    const response = await fetch(TASKS_ENDPOINTS.PROJECTS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Fallback mock data
    return [
      { id: '1', name: 'Zeniva Project', description: 'Main project' },
      { id: '2', name: 'Demo Project', description: 'Demo project' },
    ];
  }
}

// ============= DISK API FUNCTIONS =============

export async function fetchDiskData(): Promise<DiskData> {
  try {
    const [filesResponse, usageResponse, statsResponse] = await Promise.all([
      fetch(DISK_ENDPOINTS.FILES),
      fetch(DISK_ENDPOINTS.USAGE),
      fetch(DISK_ENDPOINTS.STATS)
    ]);

    if (!filesResponse.ok || !usageResponse.ok || !statsResponse.ok) {
      throw new Error('Failed to fetch disk data');
    }

    const [files, usage, stats] = await Promise.all([
      filesResponse.json(),
      usageResponse.json(),
      statsResponse.json()
    ]);

    return { files, usage, stats };
  } catch (error) {
    console.error('Error fetching disk data:', error);
    // Fallback olarak mock data'yı import et
    const { mockDiskData } = await import('@/data/disk/disk');
    return mockDiskData;
  }
}

export async function fetchDiskFiles(filter?: DiskFilter, sort?: DiskSort): Promise<DiskFile[]> {
  try {
    const params = new URLSearchParams();
    
    if (filter) {
      if (filter.type && filter.type !== 'all') params.append('type', filter.type);
      if (filter.source) params.append('source', filter.source);
      if (filter.searchQuery) params.append('search', filter.searchQuery);
      if (filter.dateRange) {
        params.append('startDate', filter.dateRange.start);
        params.append('endDate', filter.dateRange.end);
      }
      if (filter.sizeRange) {
        params.append('minSize', filter.sizeRange.min.toString());
        params.append('maxSize', filter.sizeRange.max.toString());
      }
    }

    if (sort) {
      params.append('sortBy', sort.field);
      params.append('sortOrder', sort.direction);
    }

    const url = `${DISK_ENDPOINTS.FILES}?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching disk files:', error);
    // Fallback olarak mock data'yı import et
    const { mockDiskFiles } = await import('@/data/disk/disk');
    return mockDiskFiles;
  }
}

export async function fetchDiskUsage(): Promise<DiskUsage> {
  try {
    const response = await fetch(DISK_ENDPOINTS.USAGE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching disk usage:', error);
    // Fallback olarak mock data'yı import et
    const { mockDiskUsage } = await import('@/data/disk/disk');
    return mockDiskUsage;
  }
}

export async function fetchDiskStats(): Promise<DiskStats> {
  try {
    const response = await fetch(DISK_ENDPOINTS.STATS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching disk stats:', error);
    // Fallback olarak mock data'yı import et
    const { mockDiskStats } = await import('@/data/disk/disk');
    return mockDiskStats;
  }
}

export async function deleteDiskFile(fileId: string): Promise<void> {
  try {
    const response = await fetch(DISK_ENDPOINTS.DELETE(fileId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting disk file:', error);
    throw error;
  }
}

export async function downloadDiskFile(fileId: string): Promise<Blob> {
  try {
    const response = await fetch(DISK_ENDPOINTS.DOWNLOAD(fileId), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading disk file:', error);
    throw error;
  }
}

export async function uploadDiskFile(file: File, source: string, sourceId?: string): Promise<DiskFile> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', source);
    if (sourceId) formData.append('sourceId', sourceId);

    const response = await fetch(DISK_ENDPOINTS.UPLOAD, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading disk file:', error);
    throw error;
  }
}

export async function searchDiskFiles(query: string): Promise<DiskFile[]> {
  try {
    const response = await fetch(`${DISK_ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching disk files:', error);
    // Fallback olarak mock data'dan filtrele
    const { mockDiskFiles } = await import('@/data/disk/disk');
    return mockDiskFiles.filter(file => 
      file.name.toLowerCase().includes(query.toLowerCase()) ||
      file.source.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// ============= AUTH API FUNCTIONS =============

export async function login(email: string, password: string): Promise<any> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export async function register(userData: any): Promise<any> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.LOGOUT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

export async function refreshToken(): Promise<any> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.REFRESH_TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

export async function forgotPassword(email: string): Promise<void> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending forgot password email:', error);
    throw error;
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.RESET_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}

export async function verifyEmail(token: string): Promise<void> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.VERIFY_EMAIL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<any> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.ME, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
}

// ============= DASHBOARD API FUNCTIONS =============

export async function fetchDashboardOverview(): Promise<any> {
  try {
    const response = await fetch(DASHBOARD_ENDPOINTS.OVERVIEW, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    // Fallback mock data
    return {
      totalTasks: 0,
      completedTasks: 0,
      totalProjects: 0,
      activeProjects: 0,
      teamMembers: 0,
      recentActivities: []
    };
  }
}

export async function fetchDashboardStats(): Promise<any> {
  try {
    const response = await fetch(DASHBOARD_ENDPOINTS.STATS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {};
  }
}

export async function fetchRecentActivities(): Promise<any[]> {
  try {
    const response = await fetch(DASHBOARD_ENDPOINTS.RECENT_ACTIVITIES, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
}

export async function fetchDashboardNotifications(): Promise<any[]> {
  try {
    const response = await fetch(DASHBOARD_ENDPOINTS.NOTIFICATIONS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard notifications:', error);
    return [];
  }
}

// ============= ANALYSIS API FUNCTIONS =============

export async function fetchAnalysisOverview(): Promise<any> {
  try {
    const response = await fetch(ANALYSIS_ENDPOINTS.OVERVIEW, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching analysis overview:', error);
    return {};
  }
}

export async function fetchPerformanceAnalytics(): Promise<any> {
  try {
    const response = await fetch(ANALYSIS_ENDPOINTS.PERFORMANCE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching performance analytics:', error);
    return {};
  }
}

export async function fetchTasksAnalytics(): Promise<any> {
  try {
    const response = await fetch(ANALYSIS_ENDPOINTS.TASKS_ANALYTICS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks analytics:', error);
    return {};
  }
}

export async function fetchProjectsAnalytics(): Promise<any> {
  try {
    const response = await fetch(ANALYSIS_ENDPOINTS.PROJECTS_ANALYTICS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching projects analytics:', error);
    return {};
  }
}

export async function fetchTeamAnalytics(): Promise<any> {
  try {
    const response = await fetch(ANALYSIS_ENDPOINTS.TEAM_ANALYTICS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching team analytics:', error);
    return {};
  }
}

export async function generateCustomReport(reportConfig: any): Promise<any> {
  try {
    const response = await fetch(ANALYSIS_ENDPOINTS.CUSTOM_REPORT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportConfig),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating custom report:', error);
    throw error;
  }
}

// ============= PROJECTS API FUNCTIONS =============

export async function fetchProjects(): Promise<any[]> {
  try {
    const response = await fetch(PROJECTS_ENDPOINTS.PROJECTS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function fetchProjectById(id: string): Promise<any> {
  try {
    const response = await fetch(PROJECTS_ENDPOINTS.PROJECT_BY_ID(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

export async function createProject(projectData: any): Promise<any> {
  try {
    const response = await fetch(PROJECTS_ENDPOINTS.PROJECTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function updateProject(id: string, projectData: any): Promise<any> {
  try {
    const response = await fetch(PROJECTS_ENDPOINTS.PROJECT_BY_ID(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const response = await fetch(PROJECTS_ENDPOINTS.PROJECT_BY_ID(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

export async function fetchProjectMembers(projectId: string): Promise<any[]> {
  try {
    const response = await fetch(PROJECTS_ENDPOINTS.PROJECT_MEMBERS(projectId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching project members:', error);
    return [];
  }
}

export async function addProjectMember(projectId: string, memberData: any): Promise<any> {
  try {
    const response = await fetch(PROJECTS_ENDPOINTS.ADD_MEMBER(projectId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding project member:', error);
    throw error;
  }
}

export async function removeProjectMember(projectId: string, memberId: string): Promise<void> {
  try {
    const response = await fetch(PROJECTS_ENDPOINTS.REMOVE_MEMBER(projectId, memberId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error removing project member:', error);
    throw error;
  }
}

// ============= REPORTS API FUNCTIONS =============

export async function fetchReports(): Promise<any[]> {
  try {
    const response = await fetch(REPORTS_ENDPOINTS.REPORTS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
}

export async function generateReport(reportConfig: any): Promise<any> {
  try {
    const response = await fetch(REPORTS_ENDPOINTS.GENERATE_REPORT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportConfig),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}

export async function exportReport(reportId: string, format: string): Promise<Blob> {
  try {
    const response = await fetch(REPORTS_ENDPOINTS.EXPORT_REPORT(reportId, format), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error exporting report:', error);
    throw error;
  }
}

// ============= WORKSPACES API FUNCTIONS =============

export async function fetchWorkspaces(): Promise<any[]> {
  try {
    const response = await fetch(WORKSPACES_ENDPOINTS.WORKSPACES, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return [];
  }
}

export async function createWorkspace(workspaceData: any): Promise<any> {
  try {
    const response = await fetch(WORKSPACES_ENDPOINTS.WORKSPACES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workspaceData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating workspace:', error);
    throw error;
  }
}

export async function switchWorkspace(workspaceId: string): Promise<void> {
  try {
    const response = await fetch(WORKSPACES_ENDPOINTS.SWITCH_WORKSPACE(workspaceId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error switching workspace:', error);
    throw error;
  }
}

export async function inviteWorkspaceMember(workspaceId: string, inviteData: any): Promise<any> {
  try {
    const response = await fetch(WORKSPACES_ENDPOINTS.INVITE_MEMBER(workspaceId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inviteData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error inviting workspace member:', error);
    throw error;
  }
}

// ============= TIME TRACKING API FUNCTIONS =============

export async function startTimeTracking(taskId?: string): Promise<any> {
  try {
    const response = await fetch(TIME_TRACKING_ENDPOINTS.START_TIMER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error starting time tracking:', error);
    throw error;
  }
}

export async function stopTimeTracking(): Promise<any> {
  try {
    const response = await fetch(TIME_TRACKING_ENDPOINTS.STOP_TIMER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error stopping time tracking:', error);
    throw error;
  }
}

export async function getCurrentTimer(): Promise<any> {
  try {
    const response = await fetch(TIME_TRACKING_ENDPOINTS.CURRENT_TIMER, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting current timer:', error);
    return null;
  }
}

export async function fetchTimeEntries(): Promise<any[]> {
  try {
    const response = await fetch(TIME_TRACKING_ENDPOINTS.TIME_ENTRIES, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching time entries:', error);
    return [];
  }
}

// ============= NOTIFICATIONS API FUNCTIONS =============

export async function fetchNotifications(): Promise<any[]> {
  try {
    const response = await fetch(NOTIFICATIONS_ENDPOINTS.NOTIFICATIONS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const response = await fetch(NOTIFICATIONS_ENDPOINTS.MARK_READ(notificationId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    const response = await fetch(NOTIFICATIONS_ENDPOINTS.MARK_ALL_READ, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const response = await fetch(NOTIFICATIONS_ENDPOINTS.UNREAD_COUNT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    return 0;
  }
}

// ============= EXPORT ALL ENDPOINTS =============

export {
  AUTH_ENDPOINTS,
  DASHBOARD_ENDPOINTS,
  ANALYSIS_ENDPOINTS,
  PROJECTS_ENDPOINTS,
  REPORTS_ENDPOINTS,
  WORKSPACES_ENDPOINTS,
  USERS_ENDPOINTS,
  NOTIFICATIONS_ENDPOINTS,
  TIME_TRACKING_ENDPOINTS,
  SIGNALR_ENDPOINTS,
  CALENDAR_ENDPOINTS,
  MESSAGES_ENDPOINTS,
  SETTINGS_ENDPOINTS,
  TASKS_ENDPOINTS,
  DISK_ENDPOINTS,
};
