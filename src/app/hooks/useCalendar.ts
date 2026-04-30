import type { EventClickArg } from "@fullcalendar/core";
import { useState } from "react";
import {
	useDeleteApiCalendarTasksId,
	useGetCalendarTasks,
	usePostApiCalendarTasksSaveorupdate,
} from "@/api/generated/calendar-tasks/calendar-tasks";
import type { CalendarTaskDto } from "@/api/model/calendarTaskDto";
import type { Task, TaskForm, TaskType } from "@/app/types/calender";

export function useCalendar() {
	const [modalOpen, setModalOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [form, setForm] = useState<TaskForm>({
		title: "",
		description: "",
		date: "",
		time: "09:00",
		typeId: 1,
		completed: false,
	});

	const { data: tasksResponse, refetch } = useGetCalendarTasks({});
	const { mutateAsync: saveTask } = usePostApiCalendarTasksSaveorupdate();
	const { mutateAsync: deleteTaskApi } = useDeleteApiCalendarTasksId();

	const tasks: Task[] = (tasksResponse?.data || []).map(
		(t: CalendarTaskDto) => ({
			id: parseInt(t.id || "0", 10),
			title: t.title || "",
			description: t.description || "",
			date: t.start ? new Date(t.start).toISOString().split("T")[0] : "",
			time: t.start
				? new Date(t.start).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})
				: "09:00",
			typeId: 1, // Default type
			completed: false,
		}),
	);

	const taskTypes: TaskType[] = [
		{ id: 1, name: "Genel", color: "#3b82f6" },
		{ id: 2, name: "Toplantı", color: "#ef4444" },
	];

	function handleDateClick(info: { dateStr: string }) {
		setEditingTask(null);
		setForm({
			title: "",
			description: "",
			date: info.dateStr,
			time: "09:00",
			typeId: taskTypes.length > 0 ? taskTypes[0].id : 0,
			completed: false,
		});
		setModalOpen(true);
	}

	function handleEventClick(clickInfo: EventClickArg) {
		const taskId = Number(clickInfo.event.id);
		const task = tasks.find((t) => t.id === taskId);
		if (!task) return;

		setEditingTask(task);
		setForm({
			title: task.title,
			description: task.description,
			date: task.date,
			time: task.time,
			typeId: task.typeId,
			completed: task.completed || false,
		});
		setModalOpen(true);
	}

	async function handleSubmit() {
		try {
			const payload: CalendarTaskDto = {
				id: editingTask?.id.toString(),
				title: form.title,
				description: form.description,
				start: `${form.date}T${form.time}:00Z`,
				end: `${form.date}T${form.time}:00Z`,
			};

			await saveTask({ data: payload });
			refetch();
			setModalOpen(false);
		} catch (err) {
			console.error("Takvim görevi kaydedilirken hata:", err);
		}
	}

	async function deleteTask(id: number) {
		try {
			await deleteTaskApi({ id: id.toString() });
			refetch();
			setModalOpen(false);
		} catch (err) {
			console.error("Takvim görevi silinirken hata:", err);
		}
	}

	const totalTasks = tasks.length;
	const completedTasks = tasks.filter((t) => t.completed).length;

	return {
		modalOpen,
		setModalOpen,
		editingTask,
		tasks,
		taskTypes,
		form,
		setForm,
		handleDateClick,
		handleEventClick,
		handleSubmit,
		deleteTask,
		totalTasks,
		completedTasks,
	};
}
