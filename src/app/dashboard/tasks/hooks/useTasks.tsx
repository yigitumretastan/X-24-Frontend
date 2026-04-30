import type { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import {
	usePostApiWorkspaceTasksList,
	usePostApiWorkspaceTasksSaveorupdate,
} from "@/api/generated/workspace-tasks/workspace-tasks";
import type { LoadResult, WorkspaceTaskDto } from "@/api/model";

export const useTasks = (workspaceId: string) => {
	const [tasks, setTasks] = useState<WorkspaceTaskDto[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const listMutation = usePostApiWorkspaceTasksList();
	const { mutateAsync: saveTaskMutation } =
		usePostApiWorkspaceTasksSaveorupdate();

	const fetchTasks = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await listMutation.mutateAsync({
				data: {
					take: 100,
					skip: 0,
				},
			});

			if (response.status === 200 && response.data.data) {
				const loadResult = response.data.data as LoadResult;
				setTasks((loadResult.data as WorkspaceTaskDto[]) || []);
			}
		} catch (err) {
			const error = err as AxiosError<{ message?: string }>;
			console.error("Failed to fetch tasks:", error);
			setError(
				(error.response?.data as { message?: string })?.message ||
					"Görevler yüklenirken bir hata oluştu",
			);
		} finally {
			setLoading(false);
		}
	}, [listMutation]);

	useEffect(() => {
		if (workspaceId) {
			fetchTasks();
		}
	}, [workspaceId, fetchTasks]);

	const createTask = useCallback(
		async (taskData: Partial<WorkspaceTaskDto>) => {
			try {
				await saveTaskMutation({
					data: { ...taskData, workspaceId } as WorkspaceTaskDto,
				});
				await fetchTasks();
			} catch (err) {
				const error = err as AxiosError;
				console.error("Görev oluşturulurken hata:", error);
				throw error;
			}
		},
		[workspaceId, saveTaskMutation, fetchTasks],
	);

	const updateTaskStatus = useCallback(
		async (taskId: string, status: number) => {
			try {
				const task = tasks.find((t) => t.id === taskId);
				if (task) {
					await saveTaskMutation({
						data: { ...task, status } as WorkspaceTaskDto,
					});
					await fetchTasks();
				}
			} catch (err) {
				const error = err as AxiosError;
				console.error("Görev durumu güncellenirken hata:", error);
				throw error;
			}
		},
		[tasks, saveTaskMutation, fetchTasks],
	);

	return {
		tasks,
		loading,
		error,
		fetchTasks,
		createTask,
		updateTaskStatus,
	};
};
