/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Project } from "@/app/types/projects";
import { useTheme } from "@/app/hooks/useTheme";
import {
  X,
  Calendar,
  Users,
  Target,
  DollarSign,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  FileText,
  Copy
} from "lucide-react";

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onDuplicate?: (projectId: string) => void;
  onStatusChange?: (projectId: string, status: Project['status']) => void;
}

export default function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  onStatusChange
}: ProjectDetailModalProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'members' | 'files'>('overview');

  if (!isOpen || !project) return null;

  const getStatusColor = (status: Project['status']) => {
    const colors = {
      'planning': 'blue',
      'active': 'emerald',
      'paused': 'amber',
      'completed': 'green',
      'cancelled': 'red'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Project['priority']) => {
    const colors = {
      'low': 'gray',
      'medium': 'blue',
      'high': 'amber',
      'urgent': 'red'
    };
    return colors[priority];
  };

  const completedTasks = project.tasks.filter(t => t.status === 'completed').length;
  const taskCompletionRate = project.tasks.length > 0 ? Math.round((completedTasks / project.tasks.length) * 100) : 0;
  const budgetUsageRate = project.budget ? Math.round(((project.spentBudget || 0) / project.budget) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl border ${
        theme === 'dark'
          ? 'bg-gray-800/95 border-gray-700/50'
          : 'bg-white/95 border-white/20'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/20">
          <div className="flex items-center space-x-4">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <div>
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{project.name}</h2>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>{project.category}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(project)}
                className={`p-2 rounded-xl transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(project.id)}
                className={`p-2 rounded-xl transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Copy className="w-5 h-5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(project.id)}
                className="p-2 rounded-xl transition-colors hover:bg-red-100 text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="px-6 py-4 border-b border-gray-200/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full bg-${getStatusColor(project.status)}-100 text-${getStatusColor(project.status)}-800`}>
                {project.status === 'planning' ? 'Planlama' :
                 project.status === 'active' ? 'Aktif' :
                 project.status === 'paused' ? 'Duraklatıldı' :
                 project.status === 'completed' ? 'Tamamlandı' : 'İptal'}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full bg-${getPriorityColor(project.priority)}-100 text-${getPriorityColor(project.priority)}-800`}>
                {project.priority === 'low' ? 'Düşük' :
                 project.priority === 'medium' ? 'Orta' :
                 project.priority === 'high' ? 'Yüksek' : 'Acil'}
              </span>
            </div>
            
            {onStatusChange && (
              <div className="flex items-center space-x-2">
                {project.status === 'paused' && (
                  <button
                    onClick={() => onStatusChange(project.id, 'active')}
                    className="flex items-center space-x-2 px-3 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Devam Et</span>
                  </button>
                )}
                {project.status === 'active' && (
                  <button
                    onClick={() => onStatusChange(project.id, 'paused')}
                    className="flex items-center space-x-2 px-3 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Duraklat</span>
                  </button>
                )}
                {project.status !== 'completed' && (
                  <button
                    onClick={() => onStatusChange(project.id, 'completed')}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Tamamla</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200/20">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Genel Bakış', icon: FileText },
              { id: 'tasks', label: 'Görevler', icon: Target },
              { id: 'members', label: 'Üyeler', icon: Users },
              { id: 'files', label: 'Dosyalar', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : theme === 'dark'
                      ? 'border-transparent text-gray-400 hover:text-gray-300'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Açıklama</h3>
                <p className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>{project.description}</p>
              </div>

              {/* Progress */}
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>İlerleme</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Genel İlerleme</span>
                      <span className={`text-sm font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>%{project.progress}</span>
                    </div>
                    <div className={`w-full h-3 rounded-full ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Görev Tamamlanma</span>
                      <span className={`text-sm font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>%{taskCompletionRate}</span>
                    </div>
                    <div className={`w-full h-3 rounded-full ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${taskCompletionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <Calendar className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <h4 className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Tarihler</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>Başlangıç:</span>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>{new Date(project.startDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                    {project.deadline && (
                      <div className="flex justify-between">
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>Bitiş:</span>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>{new Date(project.deadline).toLocaleDateString('tr-TR')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {project.budget && (
                  <div className={`p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <DollarSign className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <h4 className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Bütçe</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>Toplam:</span>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>₺{project.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>Harcanan:</span>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>₺{(project.spentBudget || 0).toLocaleString()}</span>
                      </div>
                      <div className={`w-full h-2 rounded-full ${
                        theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                      }`}>
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            budgetUsageRate > 90 ? 'bg-red-500' :
                            budgetUsageRate > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(budgetUsageRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {project.tags.length > 0 && (
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Etiketler</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          theme === 'dark' 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Görevler ({project.tasks.length})</h3>
              </div>
              
              {project.tasks.length > 0 ? (
                <div className="space-y-3">
                  {project.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border ${
                        theme === 'dark'
                          ? 'bg-gray-700/50 border-gray-600'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{task.title}</h4>
                          {task.description && (
                            <p className={`text-sm mt-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>{task.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              task.status === 'completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              task.status === 'review' ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {task.status === 'completed' ? 'Tamamlandı' :
                               task.status === 'in_progress' ? 'Devam Ediyor' :
                               task.status === 'review' ? 'İncelemede' : 'Yapılacak'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              task.priority === 'high' ? 'bg-red-100 text-red-800' :
                              task.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {task.priority === 'high' ? 'Yüksek' :
                               task.priority === 'medium' ? 'Orta' : 'Düşük'}
                            </span>
                          </div>
                        </div>
                        {task.dueDate && (
                          <div className="text-right">
                            <div className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>Bitiş Tarihi</div>
                            <div className={`text-sm font-medium ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>{new Date(task.dueDate).toLocaleDateString('tr-TR')}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className={`w-12 h-12 mx-auto mb-3 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <p className={`${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Henüz görev eklenmemiş</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Takım Üyeleri ({project.assignedMembers.length})</h3>
              </div>
              
              {project.assignedMembers.length > 0 ? (
                <div className="space-y-3">
                  {project.assignedMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center space-x-4 p-4 rounded-xl ${
                        theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{member.name}</h4>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>{member.email}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          member.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                          member.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                          member.role === 'member' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {member.role === 'owner' ? 'Sahip' :
                           member.role === 'admin' ? 'Yönetici' :
                           member.role === 'member' ? 'Üye' : 'Görüntüleyici'}
                        </span>
                        <div className={`text-xs mt-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {new Date(member.joinDate).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className={`w-12 h-12 mx-auto mb-3 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <p className={`${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Henüz üye eklenmemiş</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Dosyalar ({project.attachments.length})</h3>
              </div>
              
              <div className="text-center py-8">
                <FileText className={`w-12 h-12 mx-auto mb-3 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <p className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Henüz dosya eklenmemiş</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
