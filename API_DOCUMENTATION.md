# 🔌 Zeniva Frontend API Dokümantasyonu

Bu dokümantasyon, Zeniva Frontend uygulamasının backend API ile nasıl etkileşim kurduğunu ve kullanılan API endpoint'lerini açıklar.

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Authentication](#authentication)
- [API Client Konfigürasyonu](#api-client-konfigürasyonu)
- [Endpoint'ler](#endpointler)
- [SignalR Hub'ları](#signalr-hubları)
- [Error Handling](#error-handling)
- [Type Definitions](#type-definitions)
- [Örnekler](#örnekler)

## 🎯 Genel Bakış

Zeniva Frontend, ASP.NET Core backend ile RESTful API ve SignalR üzerinden iletişim kurar.

### Base URL'ler
- **Development**: `https://localhost:7171`
- **Staging**: `https://localhost:7171`
- **Production**: `https://api.zeniva.com`

### API Versiyonu
- **Current Version**: `v1`
- **Base Path**: `/api/v1`

## 🔐 Authentication

### JWT Token Authentication

```typescript
// types/auth.ts
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  isEmailVerified: boolean;
}

export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
  User = 'User'
}
```

### Token Management

```typescript
// lib/auth.ts
import axios from 'axios';

class AuthService {
  private token: string | null = null;
  private refreshToken: string | null = null;

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post('/api/auth/login', credentials);
    const { token, refreshToken, user } = response.data;
    
    this.setTokens(token, refreshToken);
    return response.data;
  }

  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post('/api/auth/refresh', {
      refreshToken: this.refreshToken
    });

    const { token } = response.data;
    this.setToken(token);
    return token;
  }

  private setTokens(token: string, refreshToken: string) {
    this.token = token;
    this.refreshToken = refreshToken;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('auth_token');
  }

  logout() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
}

export const authService = new AuthService();
```

## ⚙️ API Client Konfigürasyonu

### Axios Instance

```typescript
// lib/api-client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { authService } from './auth';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Token ekleme
    this.client.interceptors.request.use(
      (config) => {
        const token = authService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Token yenileme
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await authService.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            authService.logout();
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

## 🛣️ Endpoint'ler

### Authentication Endpoints

```typescript
// services/auth-service.ts
export class AuthApiService {
  // POST /api/auth/login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post('/auth/login', credentials);
  }

  // POST /api/auth/register
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post('/auth/register', userData);
  }

  // POST /api/auth/refresh
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    return apiClient.post('/auth/refresh', { refreshToken });
  }

  // POST /api/auth/logout
  async logout(): Promise<void> {
    return apiClient.post('/auth/logout');
  }

  // POST /api/auth/forgot-password
  async forgotPassword(email: string): Promise<void> {
    return apiClient.post('/auth/forgot-password', { email });
  }

  // POST /api/auth/reset-password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  }
}
```

### User Management

```typescript
// services/user-service.ts
export class UserApiService {
  // GET /api/users/profile
  async getProfile(): Promise<User> {
    return apiClient.get('/users/profile');
  }

  // PUT /api/users/profile
  async updateProfile(userData: UpdateUserRequest): Promise<User> {
    return apiClient.put('/users/profile', userData);
  }

  // GET /api/users
  async getUsers(params?: UserQueryParams): Promise<PaginatedResponse<User>> {
    return apiClient.get('/users', { params });
  }

  // GET /api/users/{id}
  async getUserById(id: string): Promise<User> {
    return apiClient.get(`/users/${id}`);
  }

  // POST /api/users/{id}/avatar
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiClient.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
}
```

### Project Management

```typescript
// services/project-service.ts
export class ProjectApiService {
  // GET /api/projects
  async getProjects(params?: ProjectQueryParams): Promise<PaginatedResponse<Project>> {
    return apiClient.get('/projects', { params });
  }

  // POST /api/projects
  async createProject(projectData: CreateProjectRequest): Promise<Project> {
    return apiClient.post('/projects', projectData);
  }

  // GET /api/projects/{id}
  async getProjectById(id: string): Promise<Project> {
    return apiClient.get(`/projects/${id}`);
  }

  // PUT /api/projects/{id}
  async updateProject(id: string, projectData: UpdateProjectRequest): Promise<Project> {
    return apiClient.put(`/projects/${id}`, projectData);
  }

  // DELETE /api/projects/{id}
  async deleteProject(id: string): Promise<void> {
    return apiClient.delete(`/projects/${id}`);
  }

  // GET /api/projects/{id}/members
  async getProjectMembers(id: string): Promise<ProjectMember[]> {
    return apiClient.get(`/projects/${id}/members`);
  }

  // POST /api/projects/{id}/members
  async addProjectMember(id: string, memberData: AddMemberRequest): Promise<ProjectMember> {
    return apiClient.post(`/projects/${id}/members`, memberData);
  }
}
```

### Task Management

```typescript
// services/task-service.ts
export class TaskApiService {
  // GET /api/tasks
  async getTasks(params?: TaskQueryParams): Promise<PaginatedResponse<Task>> {
    return apiClient.get('/tasks', { params });
  }

  // POST /api/tasks
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    return apiClient.post('/tasks', taskData);
  }

  // GET /api/tasks/{id}
  async getTaskById(id: string): Promise<Task> {
    return apiClient.get(`/tasks/${id}`);
  }

  // PUT /api/tasks/{id}
  async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    return apiClient.put(`/tasks/${id}`, taskData);
  }

  // PUT /api/tasks/{id}/status
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return apiClient.put(`/tasks/${id}/status`, { status });
  }

  // POST /api/tasks/{id}/comments
  async addComment(id: string, comment: string): Promise<TaskComment> {
    return apiClient.post(`/tasks/${id}/comments`, { comment });
  }
}
```

## 🔄 SignalR Hub'ları

### Chat Hub

```typescript
// lib/signalr-client.ts
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export class SignalRClient {
  private connection: HubConnection | null = null;

  async startConnection(hubUrl: string): Promise<void> {
    this.connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => authService.getToken() || ''
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    await this.connection.start();
    console.log('SignalR Connected');
  }

  // Chat Hub Methods
  async joinRoom(roomId: string): Promise<void> {
    if (this.connection) {
      await this.connection.invoke('JoinRoom', roomId);
    }
  }

  async leaveRoom(roomId: string): Promise<void> {
    if (this.connection) {
      await this.connection.invoke('LeaveRoom', roomId);
    }
  }

  async sendMessage(roomId: string, message: string): Promise<void> {
    if (this.connection) {
      await this.connection.invoke('SendMessage', roomId, message);
    }
  }

  // Event Listeners
  onMessageReceived(callback: (user: string, message: string) => void): void {
    if (this.connection) {
      this.connection.on('ReceiveMessage', callback);
    }
  }

  onUserJoined(callback: (user: string) => void): void {
    if (this.connection) {
      this.connection.on('UserJoined', callback);
    }
  }

  onUserLeft(callback: (user: string) => void): void {
    if (this.connection) {
      this.connection.on('UserLeft', callback);
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
    }
  }
}
```

### Notification Hub

```typescript
// services/notification-service.ts
export class NotificationService {
  private signalRClient: SignalRClient;

  constructor() {
    this.signalRClient = new SignalRClient();
  }

  async initialize(): Promise<void> {
    const hubUrl = `${process.env.NEXT_PUBLIC_SIGNALR_HUB_URL}/notificationHub`;
    await this.signalRClient.startConnection(hubUrl);
    
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Task assignment notification
    this.signalRClient.connection?.on('TaskAssigned', (taskId: string, taskTitle: string) => {
      this.showNotification(`New task assigned: ${taskTitle}`, 'info');
    });

    // Project update notification
    this.signalRClient.connection?.on('ProjectUpdated', (projectId: string, updateType: string) => {
      this.showNotification(`Project updated: ${updateType}`, 'info');
    });

    // System notification
    this.signalRClient.connection?.on('SystemNotification', (message: string, type: string) => {
      this.showNotification(message, type as 'success' | 'error' | 'warning' | 'info');
    });
  }

  private showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    // Toast notification gösterme logic'i
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}
```

## ❌ Error Handling

### API Error Types

```typescript
// types/api-error.ts
export interface ApiError {
  message: string;
  code: string;
  details?: any;
  timestamp: string;
}

export interface ValidationError extends ApiError {
  errors: Record<string, string[]>;
}

export class ApiException extends Error {
  constructor(
    public status: number,
    public error: ApiError,
    public response?: any
  ) {
    super(error.message);
    this.name = 'ApiException';
  }
}
```

### Error Handler

```typescript
// lib/error-handler.ts
export class ErrorHandler {
  static handle(error: any): void {
    if (error.response) {
      // API error response
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          this.handleValidationError(data);
          break;
        case 401:
          this.handleUnauthorizedError();
          break;
        case 403:
          this.handleForbiddenError();
          break;
        case 404:
          this.handleNotFoundError();
          break;
        case 500:
          this.handleServerError(data);
          break;
        default:
          this.handleGenericError(data);
      }
    } else if (error.request) {
      // Network error
      this.handleNetworkError();
    } else {
      // Other error
      this.handleGenericError(error);
    }
  }

  private static handleValidationError(data: ValidationError): void {
    const errorMessages = Object.values(data.errors).flat();
    console.error('Validation errors:', errorMessages);
  }

  private static handleUnauthorizedError(): void {
    authService.logout();
    window.location.href = '/auth/login';
  }

  private static handleForbiddenError(): void {
    console.error('Access forbidden');
  }

  private static handleNotFoundError(): void {
    console.error('Resource not found');
  }

  private static handleServerError(data: ApiError): void {
    console.error('Server error:', data.message);
  }

  private static handleNetworkError(): void {
    console.error('Network error - please check your connection');
  }

  private static handleGenericError(error: any): void {
    console.error('An unexpected error occurred:', error);
  }
}
```

## 📝 Type Definitions

### Common Types

```typescript
// types/common.ts
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface QueryParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
}
```

### Project Types

```typescript
// types/project.ts
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  ownerId: string;
  owner: User;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export enum ProjectStatus {
  Planning = 'Planning',
  Active = 'Active',
  OnHold = 'OnHold',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface ProjectMember {
  id: string;
  userId: string;
  user: User;
  role: ProjectRole;
  joinedAt: string;
}

export enum ProjectRole {
  Owner = 'Owner',
  Manager = 'Manager',
  Member = 'Member',
  Viewer = 'Viewer'
}
```

### Task Types

```typescript
// types/task.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assignee?: User;
  projectId: string;
  project: Project;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  comments: TaskComment[];
}

export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'InProgress',
  InReview = 'InReview',
  Done = 'Done'
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export interface TaskComment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: string;
}
```

## 💡 Örnekler

### React Hook ile API Kullanımı

```typescript
// hooks/use-projects.ts
import { useState, useEffect } from 'react';
import { ProjectApiService } from '@/services/project-service';
import { Project, ProjectQueryParams } from '@/types/project';

export const useProjects = (params?: ProjectQueryParams) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectService = new ProjectApiService();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectService.getProjects(params);
        setProjects(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [params]);

  const createProject = async (projectData: CreateProjectRequest) => {
    try {
      const newProject = await projectService.createProject(projectData);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    refetch: () => fetchProjects()
  };
};
```

### Component'te API Kullanımı

```typescript
// components/ProjectList.tsx
import React from 'react';
import { useProjects } from '@/hooks/use-projects';

const ProjectList: React.FC = () => {
  const { projects, loading, error, createProject } = useProjects();

  const handleCreateProject = async () => {
    try {
      await createProject({
        name: 'New Project',
        description: 'Project description'
      });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={handleCreateProject}>
        Create Project
      </button>
      
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <span>Status: {project.status}</span>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
```

---

Bu dokümantasyon, Zeniva Frontend uygulamasının API entegrasyonunu kapsamlı bir şekilde açıklar. Daha detaylı bilgi için backend API dokümantasyonuna başvurabilirsiniz.
