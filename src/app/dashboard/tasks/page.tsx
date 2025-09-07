"use client";
import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useTasks } from "./hooks/useTasks";
import TaskCard from "./components/TaskCard";
import Header from "./components/Header";
import FilterTabs from "./components/FilterTabs";

function getThemeFromCookies(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const themeCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="))
    ?.split("=")[1];
  return themeCookie === "dark" ? "dark" : "light";
}

export default function TasksPage() {
  const { tasks, error, createTask } = useTasks();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getThemeFromCookies());
  }, []);

  const taskCounts = {
    all: tasks.length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  };

  const filters = [
    { key: "all", name: `Tümü ${taskCounts.all}` },
    { key: "in-progress", name: `Devam Eden ${taskCounts["in-progress"]}` },
    { key: "completed", name: `Tamamlanan ${taskCounts.completed}` },
    { key: "todo", name: `Yapılacak ${taskCounts.todo}` },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchFilter = activeFilter === "all" || task.status === activeFilter;
    const matchSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const workspaceId = "example-workspace-id";
  const userId = "example-user-id";

  return (
    <div className={`min-h-screen py-8 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateTask={() =>
          createTask({
            title: "Yeni Görev",
            description: "Açıklama",
            status: "todo",
            priority: "medium",
          })
        }
        workspaceId={workspaceId}
        userId={userId}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 mb-6 rounded-lg">
            {error}
          </div>
        )}

        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filters={filters}
          theme={theme}  // Pass theme to FilterTabs for styling
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <TaskCard task={task} theme={theme} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className={`bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">{searchTerm ? "Arama sonucu yok" : "Henüz görev yok"}</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Farklı bir anahtar kelime deneyin."
                  : 'İlk görevinizi oluşturmak için "Yeni Görev" butonuna tıklayın.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
