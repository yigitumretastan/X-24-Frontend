// Projects Management Types

export interface Project {
	id: string;
	name: string;
	description: string;
	status: "planning" | "active" | "paused" | "completed" | "cancelled";
	priority: "low" | "medium" | "high" | "urgent";
	progress: number; // 0-100
	startDate: string;
	endDate?: string;
	deadline?: string;
	budget?: number;
	spentBudget?: number;
	currency?: string;
	category: string;
	tags: string[];
	color: string;
	createdAt: string;
	updatedAt: string;
	createdBy: string;
	assignedMembers: ProjectMember[];
	tasks: ProjectTask[];
	milestones: Milestone[];
	attachments: Attachment[];
}

export interface ProjectMember {
	id: string;
	name: string;
	email: string;
	role: "owner" | "admin" | "member" | "viewer";
	avatar?: string;
	joinDate: string;
	isActive: boolean;
}

export interface ProjectTask {
	id: string;
	title: string;
	description?: string;
	status: "todo" | "in_progress" | "review" | "completed";
	priority: "low" | "medium" | "high";
	assignedTo?: string;
	dueDate?: string;
	completedAt?: string;
	estimatedHours?: number;
	actualHours?: number;
	tags: string[];
}

export interface Milestone {
	id: string;
	title: string;
	description?: string;
	dueDate: string;
	completedAt?: string;
	status: "pending" | "completed" | "overdue";
	tasks: string[]; // task IDs
}

export interface Attachment {
	id: string;
	name: string;
	type: "image" | "document" | "video" | "other";
	size: number;
	url: string;
	uploadedBy: string;
	uploadedAt: string;
}

export interface ProjectStats {
	totalProjects: number;
	activeProjects: number;
	completedProjects: number;
	pausedProjects: number;
	totalTasks: number;
	completedTasks: number;
	overdueTasks: number;
	totalMembers: number;
	totalBudget: number;
	spentBudget: number;
}

export interface ProjectFilters {
	status: string[];
	priority: string[];
	category: string[];
	members: string[];
	dateRange: {
		start?: string;
		end?: string;
	};
	search: string;
}

export interface ProjectForm {
	name: string;
	description: string;
	status: Project["status"];
	priority: Project["priority"];
	startDate: string;
	deadline?: string;
	budget?: number;
	currency: string;
	category: string;
	tags: string[];
	color: string;
	assignedMembers: string[];
}

export interface CreateProjectData {
	project: ProjectForm;
	initialTasks?: Omit<ProjectTask, "id">[];
	initialMilestones?: Omit<Milestone, "id">[];
}

export interface ProjectActivity {
	id: string;
	type:
		| "created"
		| "updated"
		| "task_added"
		| "task_completed"
		| "member_added"
		| "milestone_reached";
	title: string;
	description: string;
	timestamp: string;
	userId: string;
	userName: string;
	projectId: string;
}

export interface ProjectTemplate {
	id: string;
	name: string;
	description: string;
	category: string;
	tasks: Omit<ProjectTask, "id">[];
	milestones: Omit<Milestone, "id" | "tasks">[];
	estimatedDuration: number; // days
	complexity: "simple" | "medium" | "complex";
	tags: string[];
}

export interface ProjectDashboard {
	stats: ProjectStats;
	recentProjects: Project[];
	recentActivities: ProjectActivity[];
	upcomingDeadlines: {
		projectId: string;
		projectName: string;
		deadline: string;
		daysLeft: number;
		status: "safe" | "warning" | "danger";
	}[];
}
