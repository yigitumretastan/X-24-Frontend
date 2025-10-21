import React, { useState, useEffect } from "react";
import { Task, TaskType, TaskForm } from "@/app/types/calender";
import { X, Calendar, Clock, FileText, Tag, Trash2, Save, Plus, CheckCircle } from "lucide-react";

interface TaskModalProps {
  show: boolean;
  onClose: () => void;
  taskTypes: TaskType[];
  form: TaskForm;
  setForm: React.Dispatch<React.SetStateAction<TaskForm>>;
  onSubmit: () => void;
  editingTask: Task | null;
  deleteTask: (id: number) => void;
}

export default function TaskModal({
  show,
  onClose,
  taskTypes,
  form,
  setForm,
  onSubmit,
  editingTask,
  deleteTask,
}: TaskModalProps) {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (show) {
      setFormErrors({});
    }
  }, [show]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!form.title.trim()) {
      errors.title = "Başlık gereklidir";
    }

    if (!form.description.trim()) {
      errors.description = "Açıklama gereklidir";
    }

    if (!form.date) {
      errors.date = "Tarih gereklidir";
    }

    if (!form.time) {
      errors.time = "Saat gereklidir";
    }

    if (!form.typeId) {
      errors.typeId = "Görev türü seçilmelidir";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                {editingTask ? (
                  <FileText className="w-6 h-6 text-white" />
                ) : (
                  <Plus className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {editingTask ? "Görevi Düzenle" : "Yeni Görev"}
                </h2>
                <p className="text-sm text-gray-500">
                  {editingTask ? "Görev bilgilerini güncelleyin" : "Yeni bir görev oluşturun"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900">
              <FileText className="w-4 h-4 text-gray-700" />
              <span>Görev Başlığı</span>
            </label>
            <input
              type="text"
              placeholder="Görev başlığını girin..."
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-500 ${
                formErrors.title
                  ? "border-red-300 bg-red-50 focus:border-red-500"
                  : "border-gray-200 bg-gray-50 focus:border-indigo-500 focus:bg-white"
              }`}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            {formErrors.title && (
              <p className="text-red-500 text-xs flex items-center space-x-1">
                <span>⚠️</span>
                <span>{formErrors.title}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900">
              <FileText className="w-4 h-4 text-gray-700" />
              <span>Açıklama</span>
            </label>
            <textarea
              placeholder="Görev açıklamasını girin..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none text-gray-900 placeholder-gray-500 ${
                formErrors.description
                  ? "border-red-300 bg-red-50 focus:border-red-500"
                  : "border-gray-200 bg-gray-50 focus:border-indigo-500 focus:bg-white"
              }`}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            {formErrors.description && (
              <p className="text-red-500 text-xs flex items-center space-x-1">
                <span>⚠️</span>
                <span>{formErrors.description}</span>
              </p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900">
                <Calendar className="w-4 h-4 text-gray-700" />
                <span>Tarih</span>
              </label>
              <input
                type="date"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 ${
                  formErrors.date
                    ? "border-red-300 bg-red-50 focus:border-red-500"
                    : "border-gray-200 bg-gray-50 focus:border-indigo-500 focus:bg-white"
                }`}
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
              {formErrors.date && (
                <p className="text-red-500 text-xs flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{formErrors.date}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900">
                <Clock className="w-4 h-4 text-gray-700" />
                <span>Saat</span>
              </label>
              <input
                type="time"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 ${
                  formErrors.time
                    ? "border-red-300 bg-red-50 focus:border-red-500"
                    : "border-gray-200 bg-gray-50 focus:border-indigo-500 focus:bg-white"
                }`}
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
              {formErrors.time && (
                <p className="text-red-500 text-xs flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{formErrors.time}</span>
                </p>
              )}
            </div>
          </div>

          {/* Task Type */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900">
              <Tag className="w-4 h-4 text-gray-700" />
              <span>Görev Türü</span>
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 appearance-none cursor-pointer text-gray-900 font-medium shadow-sm hover:shadow-md"
                value={form.typeId}
                onChange={(e) => setForm((f) => ({ ...f, typeId: Number(e.target.value) }))}
              >
                {taskTypes.map((type) => (
                  <option 
                    key={type.id} 
                    value={type.id}
                    className="py-2 px-4 text-gray-900 bg-white hover:bg-indigo-50"
                  >
                    🏷️ {type.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-1">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {/* Selected type indicator */}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div 
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  style={{ 
                    backgroundColor: taskTypes.find(t => t.id === form.typeId)?.color || "#6366f1" 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Completed Checkbox */}
          {editingTask && (
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                id="completed"
                className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 transition-all duration-200"
                checked={form.completed}
                onChange={(e) => setForm((f) => ({ ...f, completed: e.target.checked }))}
              />
              <label htmlFor="completed" className="flex items-center space-x-2 text-sm font-medium text-gray-900 cursor-pointer">
                <CheckCircle className="w-4 h-4 text-gray-700" />
                <span>Görev tamamlandı</span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50/50 rounded-b-3xl border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              {editingTask && (
                <button
                  onClick={() => deleteTask(editingTask.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Sil</span>
                </button>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                İptal
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/25"
              >
                <Save className="w-4 h-4" />
                <span>{editingTask ? "Güncelle" : "Oluştur"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
