// Analysis Dashboard Types

export interface AnalysisStats {
	totalTasks: number;
	completedTasks: number;
	inProgressTasks: number;
	pendingTasks: number;
	totalProjects: number;
	activeProjects: number;
	completedProjects: number;
	totalWorkingHours: number;
	thisWeekHours: number;
	thisMonthHours: number;
	productivity: number; // percentage
	efficiency: number; // percentage
}

export interface TaskAnalytics {
	completionRate: number;
	averageCompletionTime: number; // in days
	tasksByPriority: {
		high: number;
		medium: number;
		low: number;
	};
	tasksByStatus: {
		todo: number;
		inProgress: number;
		completed: number;
		pending: number;
	};
	tasksByType: {
		[key: string]: number;
	};
}

export interface ProjectAnalytics {
	totalProjects: number;
	activeProjects: number;
	completedProjects: number;
	projectProgress: {
		name: string;
		progress: number;
		status: "active" | "completed" | "paused";
		tasksCount: number;
		completedTasks: number;
	}[];
}

export interface TimeAnalytics {
	dailyHours: {
		date: string;
		hours: number;
	}[];
	weeklyHours: {
		week: string;
		hours: number;
	}[];
	monthlyHours: {
		month: string;
		hours: number;
	}[];
	timeByProject: {
		projectName: string;
		hours: number;
		percentage: number;
	}[];
}

export interface PerformanceMetrics {
	productivity: number;
	efficiency: number;
	qualityScore: number;
	onTimeDelivery: number;
	teamCollaboration: number;
	skillDevelopment: number;
}

export interface ChartData {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
		backgroundColor?: string | string[];
		borderColor?: string | string[];
		borderWidth?: number;
		fill?: boolean;
		tension?: number;
		pointBackgroundColor?: string;
		pointBorderColor?: string;
		pointBorderWidth?: number;
	}[];
}

export interface RecentActivity {
	id: string;
	type:
		| "task_completed"
		| "project_started"
		| "milestone_reached"
		| "collaboration";
	title: string;
	description: string;
	timestamp: string;
	icon: string;
	color: string;
}

export interface Goal {
	id: string;
	title: string;
	description: string;
	target: number;
	current: number;
	unit: string;
	deadline: string;
	status: "on_track" | "at_risk" | "completed" | "overdue";
	progress: number;
}

export interface AnalysisDashboard {
	stats: AnalysisStats;
	taskAnalytics: TaskAnalytics;
	projectAnalytics: ProjectAnalytics;
	timeAnalytics: TimeAnalytics;
	performanceMetrics: PerformanceMetrics;
	recentActivities: RecentActivity[];
	goals: Goal[];
}

export interface DateRange {
	startDate: string;
	endDate: string;
	period: "week" | "month" | "quarter" | "year" | "custom";
}
