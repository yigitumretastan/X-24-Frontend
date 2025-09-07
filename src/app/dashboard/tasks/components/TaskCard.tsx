// components/TaskCard.tsx
import { Task } from "../hooks/useTasks";
import { User, Clock, MoreVertical } from "lucide-react";

interface Props {
  task: Task;
  theme: "light" | "dark";  // theme prop'u eklendi
}

const getStatusColor = (status: Task["status"], theme: "light" | "dark"): string => {
  switch (status) {
    case "completed":
      return theme === "dark" ? "bg-green-800 text-green-100 border-green-600" : "bg-green-100 text-green-800 border-green-200";
    case "in-progress":
      return theme === "dark" ? "bg-blue-800 text-blue-100 border-blue-600" : "bg-blue-100 text-blue-800 border-blue-200";
    case "todo":
      return theme === "dark" ? "bg-orange-800 text-orange-100 border-orange-600" : "bg-orange-100 text-orange-800 border-orange-200";
    case "pending":
      return theme === "dark" ? "bg-yellow-800 text-yellow-100 border-yellow-600" : "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return theme === "dark" ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority: Task["priority"], theme: "light" | "dark"): string => {
  switch (priority) {
    case "high":
      return theme === "dark" ? "bg-red-600" : "bg-red-500";
    case "medium":
      return theme === "dark" ? "bg-yellow-600" : "bg-yellow-500";
    case "low":
      return theme === "dark" ? "bg-green-600" : "bg-green-500";
    default:
      return theme === "dark" ? "bg-gray-600" : "bg-gray-500";
  }
};

const getStatusText = (status: Task["status"]): string => {
  const statusMap = {
    completed: "Tamamlandı",
    "in-progress": "Devam Eden",
    todo: "Yapılacak",
    pending: "Beklemede",
  };
  return statusMap[status];
};

export default function TaskCard({ task, theme }: Props) {
  return (
    <div className={`rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border overflow-hidden ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-1 h-12 rounded-full ${getPriorityColor(task.priority, theme)}`} />
              <div>
                <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} mb-1`}>Görev Adı: {task.title}</h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Açıklama: {task.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className={`flex items-center space-x-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{task.author}</span>
                </div>
                {task.dueDate && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(task.dueDate).toLocaleDateString("tr-TR")}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status, theme)}`}>
                  {getStatusText(task.status)}
                </span>
                <button className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
                  <MoreVertical className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
