export interface Task {
	id: number;
	title: string;
	description: string;
	author: string;
	status: "todo" | "in-progress" | "completed" | "pending";
	priority: "low" | "medium" | "high";
	createdAt: string;
	dueDate: string;
	assignedTo?: string;
	projectId?: string;
	tags?: string[];
	attachments?: TaskAttachment[];
}

export interface TaskAttachment {
	id: string;
	name: string;
	url: string;
	type: string;
	size: number;
}

export interface TaskForm {
	title: string;
	description: string;
	status: Task["status"];
	priority: Task["priority"];
	dueDate: string;
	assignedTo?: string;
	projectId?: string;
	tags?: string[];
}

export interface TaskFilter {
	status?: Task["status"];
	priority?: Task["priority"];
	assignedTo?: string;
	projectId?: string;
	searchTerm?: string;
}

export interface TaskCounts {
	all: number;
	"in-progress": number;
	completed: number;
	todo: number;
	pending: number;
}

export interface FilterOption {
	key: string;
	name: string;
}

export interface Option {
	value: string;
	label: string;
}

export interface User {
	id: string;
	name: string;
	email?: string;
	avatar?: string;
}

export interface Project {
	id: string;
	name: string;
	description?: string;
	color?: string;
}
