import { useCallback, useEffect, useState } from "react";
import {
	useDeleteApiWorkspaceTasksId,
	usePostApiWorkspaceTasksList,
	usePostApiWorkspaceTasksSaveorupdate,
} from "@/api/generated/workspace-tasks/workspace-tasks";
import type { LoadOptionsDto } from "@/api/model/loadOptionsDto";
import type {
	FilterOption,
	Task,
	TaskCounts,
	TaskForm,
} from "@/app/types/tasks";

export const useTasks = (workspaceId?: string) => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeFilter, setActiveFilter] = useState("all");

	const {
		mutate: fetchTasksList,
		data: tasksResponse,
		isPending: loading,
		error: apiError,
	} = usePostApiWorkspaceTasksList();
	const { mutateAsync: saveTask } = usePostApiWorkspaceTasksSaveorupdate();
	const { mutateAsync: deleteTaskApi } = useDeleteApiWorkspaceTasksId();

	const fetchTasks = useCallback(() => {
		if (workspaceId) {
			fetchTasksList({
				data: {
					requireTotalCount: false,
					skip: 0,
					take: 100,
				} as LoadOptionsDto,
			});
		}
	}, [workspaceId, fetchTasksList]);

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	useEffect(() => {
		if (tasksResponse?.data) {
			const formattedTasks: Task[] = (
				(
					tasksResponse.data as {
						data?: {
							id?: string;
							title?: string;
							description?: string;
							workspaceTaskStatus?: string;
							endDate?: string;
						}[];
					}
				)?.data || []
			).map((t) => ({
				id: parseInt(t.id || "0", 10),
				title: t.title || "",
				description: t.description || "",
				status: (t.workspaceTaskStatus?.toString().toLowerCase() ||
					"todo") as Task["status"],
				priority: "medium", // Default
				dueDate: t.endDate || "",
				assignedTo: undefined,
				tags: [],
				author: "User", // Task tipinde author string bekleniyor
				createdAt: new Date().toISOString(),
			}));
			setTasks(formattedTasks);
		}
	}, [tasksResponse]);

	const error = apiError ? (apiError as { message?: string }).message : null;

	// Task counts hesaplama
	const taskCounts: TaskCounts = {
		all: tasks.length,
		"in-progress": tasks.filter((t) => t.status === "in-progress").length,
		completed: tasks.filter((t) => t.status === "completed").length,
		todo: tasks.filter((t) => t.status === "todo").length,
		pending: tasks.filter((t) => t.status === "pending").length,
	};

	// Filter options
	const filters: FilterOption[] = [
		{ key: "all", name: `Tümü ${taskCounts.all}` },
		{ key: "in-progress", name: `Devam Eden ${taskCounts["in-progress"]}` },
		{ key: "completed", name: `Tamamlanan ${taskCounts.completed}` },
		{ key: "todo", name: `Yapılacak ${taskCounts.todo}` },
		{ key: "pending", name: `Beklemede ${taskCounts.pending}` },
	];

	// Filtered tasks
	const filteredTasks = tasks.filter((task) => {
		const matchFilter = activeFilter === "all" || task.status === activeFilter;
		const matchSearch =
			task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			task.description.toLowerCase().includes(searchTerm.toLowerCase());
		return matchFilter && matchSearch;
	});

	const createTask = async (taskData: TaskForm) => {
		try {
			await saveTask({
				data: {
					title: taskData.title,
					description: taskData.description,
					workspaceId: workspaceId,
					endDate: taskData.dueDate,
				},
			});
			fetchTasks();
		} catch (err) {
			console.error("Görev oluşturulurken hata:", err);
		}
	};

	const updateTaskStatus = async (
		taskId: number,
		newStatus: Task["status"],
	) => {
		try {
			const task = tasks.find((t) => t.id === taskId);
			if (task) {
				const statusMap: Record<string, number> = {
					todo: 0,
					"in-progress": 1,
					completed: 2,
					pending: 3,
				};

				await saveTask({
					data: {
						id: taskId.toString(),
						title: task.title,
						workspaceTaskStatus: statusMap[newStatus],
						workspaceId: workspaceId,
					},
				});
				fetchTasks();
			}
		} catch (err) {
			console.error("Görev durumu güncellenirken hata:", err);
		}
	};

	const deleteTask = async (taskId: number) => {
		try {
			await deleteTaskApi({ id: taskId.toString() });
			fetchTasks();
		} catch (err) {
			console.error("Görev silinirken hata:", err);
		}
	};

	return {
		tasks,
		error,
		loading,
		activeFilter,
		setActiveFilter,
		searchTerm,
		setSearchTerm,
		taskCounts,
		filters,
		filteredTasks,
		fetchTasks,
		createTask,
		updateTaskStatus,
		deleteTask,
	};
};
