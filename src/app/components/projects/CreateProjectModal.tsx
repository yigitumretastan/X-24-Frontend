/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ProjectForm, CreateProjectData } from "@/app/types/projects";
import { useTheme } from "@/app/contexts/ThemeContext";
import {
  X,
  Plus,
  Save
} from "lucide-react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectData) => Promise<void>;
  loading?: boolean;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}: CreateProjectModalProps) {
  const { theme } = useTheme();
  
  const [form, setForm] = useState<ProjectForm>({
    name: "",
    description: "",
    status: "planning",
    priority: "medium",
    startDate: new Date().toISOString().split('T')[0],
    deadline: "",
    budget: undefined,
    currency: "TRY",
    category: "",
    tags: [],
    color: "#6366f1",
    assignedMembers: []
  });

  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    "Web Development",
    "Mobile Development", 
    "E-commerce",
    "Business Software",
    "Backend Infrastructure",
    "Design",
    "Marketing",
    "Research"
  ];

  const colors = [
    "#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b",
    "#ef4444", "#ec4899", "#84cc16", "#f97316", "#6b7280"
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Proje adı gereklidir";
    }

    if (!form.description.trim()) {
      newErrors.description = "Açıklama gereklidir";
    }

    if (!form.category) {
      newErrors.category = "Kategori seçilmelidir";
    }

    if (!form.startDate) {
      newErrors.startDate = "Başlangıç tarihi gereklidir";
    }

    if (form.deadline && form.startDate && new Date(form.deadline) <= new Date(form.startDate)) {
      newErrors.deadline = "Bitiş tarihi başlangıç tarihinden sonra olmalıdır";
    }

    if (form.budget && form.budget <= 0) {
      newErrors.budget = "Bütçe pozitif bir değer olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const projectData: CreateProjectData = {
        project: form,
        initialTasks: [],
        initialMilestones: []
      };

      await onSubmit(projectData);
      handleClose();
    } catch (error) {
      console.error("Proje oluşturulurken hata:", error);
    }
  };

  const handleClose = () => {
    setForm({
      name: "",
      description: "",
      status: "planning",
      priority: "medium",
      startDate: new Date().toISOString().split('T')[0],
      deadline: "",
      budget: undefined,
      currency: "TRY",
      category: "",
      tags: [],
      color: "#6366f1",
      assignedMembers: []
    });
    setNewTag("");
    setErrors({});
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl border ${
        theme === 'dark'
          ? 'bg-gray-800/95 border-gray-700/50'
          : 'bg-white/95 border-white/20'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Yeni Proje Oluştur</h2>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>Yeni bir proje oluşturun ve takımınızla çalışmaya başlayın</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-xl transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Proje Adı *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Proje adını girin..."
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.name
                    ? 'border-red-300 bg-red-50 focus:border-red-500'
                    : theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Açıklama *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Proje açıklamasını girin..."
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none ${
                  errors.description
                    ? 'border-red-300 bg-red-50 focus:border-red-500'
                    : theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Kategori *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.category
                      ? 'border-red-300 bg-red-50 focus:border-red-500'
                      : theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500'
                  }`}
                >
                  <option value="">Kategori seçin</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Öncelik
                </label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm(prev => ({ ...prev, priority: e.target.value as any }))}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500'
                  }`}
                >
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                  <option value="urgent">Acil</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Başlangıç Tarihi *
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.startDate
                      ? 'border-red-300 bg-red-50 focus:border-red-500'
                      : theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500'
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm(prev => ({ ...prev, deadline: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.deadline
                      ? 'border-red-300 bg-red-50 focus:border-red-500'
                      : theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500'
                  }`}
                />
                {errors.deadline && (
                  <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>
                )}
              </div>
            </div>

            {/* Budget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Bütçe
                </label>
                <input
                  type="number"
                  value={form.budget || ""}
                  onChange={(e) => setForm(prev => ({ 
                    ...prev, 
                    budget: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  placeholder="Bütçe miktarı..."
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.budget
                      ? 'border-red-300 bg-red-50 focus:border-red-500'
                      : theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500'
                  }`}
                />
                {errors.budget && (
                  <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Para Birimi
                </label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm(prev => ({ ...prev, currency: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500'
                  }`}
                >
                  <option value="TRY">TRY</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            {/* Color */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Proje Rengi
              </label>
              <div className="flex flex-wrap gap-3">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      form.color === color 
                        ? 'border-gray-400 scale-110' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Etiketler
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {form.tags.map(tag => (
                  <span
                    key={tag}
                    className={`px-3 py-1 text-sm font-medium rounded-full flex items-center space-x-2 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Etiket ekle..."
                  className={`flex-1 px-4 py-2 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50/50 rounded-b-3xl border-t border-gray-100">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={handleClose}
              className={`px-6 py-2 rounded-xl transition-all duration-200 ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              İptal
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Oluşturuluyor...' : 'Proje Oluştur'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
