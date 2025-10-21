import { useState, useEffect } from "react";
import { Task, TaskType, TaskForm } from "@/app/types/calender";
import { fetchTasks, fetchTaskTypes } from "@/app/lib/endpoints";

export function useCalendar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [form, setForm] = useState<TaskForm>({
    title: "",
    description: "",
    date: "",
    time: "",
    typeId: 0,
    completed: false,
  });

  useEffect(() => {
    async function loadData() {
      const [fetchedTasks, fetchedTaskTypes] = await Promise.all([
        fetchTasks(),
        fetchTaskTypes(),
      ]);

      setTasks(fetchedTasks);
      setTaskTypes(fetchedTaskTypes);

      if (fetchedTaskTypes.length > 0) {
        setForm((f) => ({ ...f, typeId: fetchedTaskTypes[0].id }));
      }
    }

    loadData();
  }, []);

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

  function handleEventClick(clickInfo: any) {
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

  function handleSubmit() {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id ? { ...t, ...form, id: editingTask.id } : t
        )
      );
    } else {
      const newTask: Task = {
        ...form,
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
      };
      setTasks((prev) => [...prev, newTask]);
    }
    setModalOpen(false);
  }

  function deleteTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setModalOpen(false);
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
