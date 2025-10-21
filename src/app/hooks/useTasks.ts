import { useState, useEffect } from "react";
import { Task, TaskForm, TaskCounts, FilterOption } from "@/app/types/tasks";
import { 
  fetchTasksFromAPI, 
  createTaskFromAPI, 
  updateTaskFromAPI, 
  deleteTaskFromAPI 
} from "@/app/lib/endpoints";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const fetchTasks = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const data = await fetchTasksFromAPI();
      setTasks(data);
    } catch (err) {
      console.error("Görevler yüklenirken hata:", err);
      setError("Görevler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: TaskForm) => {
    try {
      await createTaskFromAPI(taskData);
      await fetchTasks();
    } catch (err) {
      console.error("Görev oluşturulurken hata:", err);
      setError("Görev oluşturulurken bir hata oluştu.");
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: Task["status"]) => {
    try {
      await updateTaskFromAPI(taskId, { status: newStatus });
      await fetchTasks();
    } catch (err) {
      console.error("Görev durumu güncellenirken hata:", err);
      setError("Görev durumu güncellenirken bir hata oluştu.");
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await deleteTaskFromAPI(taskId);
      await fetchTasks();
    } catch (err) {
      console.error("Görev silinirken hata:", err);
      setError("Görev silinirken bir hata oluştu.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
