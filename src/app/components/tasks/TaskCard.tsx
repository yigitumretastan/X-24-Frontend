// components/TaskCard.tsx
import { Task } from "../../dashboard/tasks/hooks/useTasks";
import { Clock, MoreVertical } from "lucide-react";

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
    <div className={`group relative rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border backdrop-blur-sm overflow-hidden transform hover:-translate-y-2 ${
      theme === "dark" 
        ? "bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50 hover:border-gray-600/50" 
        : "bg-gradient-to-br from-white/95 to-gray-50/95 border-gray-200/50 hover:border-gray-300/50"
    }`}>
      {/* Priority indicator with glow effect */}
      <div className={`absolute top-0 left-0 w-full h-1 ${getPriorityColor(task.priority, theme)} shadow-lg`}>
        <div className={`absolute inset-0 ${getPriorityColor(task.priority, theme)} blur-sm opacity-50`}></div>
      </div>
      
      {/* Floating priority badge */}
      <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${getPriorityColor(task.priority, theme)} shadow-lg ring-2 ${
        theme === "dark" ? "ring-gray-800" : "ring-white"
      }`}>
        <div className={`absolute inset-0 rounded-full ${getPriorityColor(task.priority, theme)} animate-ping opacity-30`}></div>
      </div>

      <div className="p-6 pt-8">
        <div className="space-y-4">
          {/* Title and Description */}
          <div className="space-y-2">
            <h3 className={`text-xl font-bold leading-tight group-hover:text-blue-600 transition-colors duration-300 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              {task.title}
            </h3>
            <p className={`text-sm leading-relaxed line-clamp-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}>
              {task.description}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex justify-start">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all duration-300 ${getStatusColor(task.status, theme)}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(task.priority, theme)}`}></div>
              {getStatusText(task.status)}
            </span>
          </div>

          {/* Footer with author and date */}
          <div className="flex items-center justify-between pt-4 border-t border-opacity-20 border-gray-300">
            <div className={`flex items-center space-x-3 text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  theme === "dark" 
                    ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white" 
                    : "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                }`}>
                  {task.author.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{task.author}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {task.dueDate && (
                <div className={`flex items-center space-x-1 text-xs px-3 py-1 rounded-full ${
                  theme === "dark" 
                    ? "bg-gray-700/50 text-gray-300" 
                    : "bg-gray-100/80 text-gray-600"
                }`}>
                  <Clock className="w-3 h-3" />
                  <span>{new Date(task.dueDate).toLocaleDateString("tr-TR")}</span>
                </div>
              )}
              <button className={`p-2 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                theme === "dark" 
                  ? "hover:bg-gray-700/50 text-gray-400 hover:text-white" 
                  : "hover:bg-gray-100/80 text-gray-500 hover:text-gray-700"
              }`}>
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
        theme === "dark"
          ? "bg-gradient-to-br from-blue-600/5 to-purple-600/5"
          : "bg-gradient-to-br from-blue-500/5 to-purple-500/5"
      }`}></div>
    </div>
  );
}
