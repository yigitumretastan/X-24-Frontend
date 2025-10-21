import { Task, TaskType } from "@/app/types/calender";

export const mockTasks: Task[] = [
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

export const mockTaskTypes: TaskType[] = [
  { id: 1, name: "Toplantı", color: "#ff0000" },
  { id: 2, name: "Hatırlatma", color: "#00ff00" },
  { id: 3, name: "Ödev", color: "#0000ff" },
];
