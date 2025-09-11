"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import TaskModal from "./components/TaskModal";

interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  typeId: number;
  color?: string;
  typeName?: string;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface TaskType {
  id: number;
  name: string;
  color?: string;
}

interface TaskForm {
  title: string;
  description: string;
  date: string;
  time: string;
  typeId: number;
}

async function fetchTasks(): Promise<Task[]> {
  return [
    {
      id: 1,
      title: "Toplantı",
      description: "Önemli toplantı",
      date: "2025-09-15",
      time: "10:00",
      typeId: 1,
      color: "#ff0000",
      typeName: "Toplantı",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

async function fetchTaskTypes(): Promise<TaskType[]> {
  return [
    { id: 1, name: "Toplantı", color: "#ff0000" },
    { id: 2, name: "Hatırlatma", color: "#00ff00" },
    { id: 3, name: "Ödev", color: "#0000ff" },
  ];
}

function getThemeFromCookies(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const themeCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="))
    ?.split("=")[1];
  return themeCookie === "dark" ? "dark" : "light";
}

export default function CalendarPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

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
  });

  useEffect(() => {
    setTheme(getThemeFromCookies());
  }, []);

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

  // Sidebar'da gösterilecek özetler
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div
      className={`max-w-7xl mx-auto pt-6 p-4 flex gap-6 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
    >
      {/* Takvim alanı */}
      <div className="flex-1">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={tasks.map((task) => ({
            id: task.id.toString(),
            title: task.title,
            date: task.date,
          }))}
          height="auto"
          dateClick={handleDateClick}
          eventClick={handleEventClick}
        />

      </div>

      {/* Sağ sidebar */}
      <aside className="w-80 bg-white dark:bg-gray-200 rounded shadow p-4 sticky top-6 h-[calc(100vh-48px)] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Görev Özetleri</h2>

        <div className="mb-6">
          <p>Toplam Görev: <strong>{totalTasks}</strong></p>
          <p>Tamamlanan Görev: <strong>{completedTasks}</strong></p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Görev Türleri</h3>
          <ul>
            {taskTypes.map((type) => (
              <li key={type.id} className="flex items-center gap-2 mb-2">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: type.color || "#ccc" }}
                ></span>
                <span>{type.name}</span>
                <span className="ml-auto text-sm text-gray-500">
                  {tasks.filter((t) => t.typeId === type.id).length}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <TaskModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        taskTypes={taskTypes}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        editingTask={editingTask}
        deleteTask={deleteTask}
      />
    </div>
  );
}
