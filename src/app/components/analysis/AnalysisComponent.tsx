"use client";

import { useAnalysis } from "@/app/hooks/useAnalysis";
import { useTheme } from "@/app/contexts/ThemeContext";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Users,
  CheckCircle,
  Activity,
  Download,
  RefreshCw,
  PieChart,
  LineChart,
  Award,
  Zap,
  Rocket
} from "lucide-react";

export default function AnalysisComponent() {
  const { 
    data, 
    loading, 
    error, 
    completionRate, 
    averageProductivity,
    getStatusColor,
    formatHours,
    refreshData,
    exportData
  } = useAnalysis();
  
  const { theme } = useTheme();

  if (loading) {
    return (
      <main className={`min-h-screen flex items-center justify-center p-8 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
          : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
      }`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4 ${
            theme === 'dark'
              ? 'border-gray-700 border-t-indigo-400'
              : 'border-indigo-200 border-t-indigo-600'
          }`}></div>
          <p className={`text-lg font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>Analiz verileri yükleniyor...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={`min-h-screen flex items-center justify-center p-8 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
          : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
      }`}>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Hata Oluştu</h2>
          <p className={`text-lg mb-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>{error}</p>
          <button
            onClick={refreshData}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Tekrar Dene</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen p-6 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className={`backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
            theme === 'dark'
              ? 'bg-gray-800/80 border-gray-700/50'
              : 'bg-white/80 border-white/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${
                  theme === 'dark' ? 'bg-indigo-900/50' : 'bg-indigo-100'
                }`}>
                  <BarChart3 className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Analiz & Raporlar
                  </h1>
                  <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Performansınızı ve ilerlemenizi takip edin
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={refreshData}
                  className={`p-3 rounded-xl transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700/50 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => exportData('pdf')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tasks */}
          <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
            theme === 'dark'
              ? 'bg-gray-800/80 border-gray-700/50'
              : 'bg-white/80 border-white/20'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Toplam Görev</p>
                <p className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{data.stats.totalTasks}</p>
                <p className="text-sm text-emerald-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  %{completionRate} tamamlandı
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'
              }`}>
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Active Projects */}
          <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
            theme === 'dark'
              ? 'bg-gray-800/80 border-gray-700/50'
              : 'bg-white/80 border-white/20'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Aktif Proje</p>
                <p className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{data.stats.activeProjects}</p>
                <p className="text-sm text-purple-600 flex items-center mt-1">
                  <Rocket className="w-4 h-4 mr-1" />
                  {data.stats.totalProjects} toplam
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'
              }`}>
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
            theme === 'dark'
              ? 'bg-gray-800/80 border-gray-700/50'
              : 'bg-white/80 border-white/20'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Bu Hafta</p>
                <p className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{formatHours(data.stats.thisWeekHours)}</p>
                <p className="text-sm text-orange-600 flex items-center mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  Çalışma saati
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-orange-900/50' : 'bg-orange-100'
              }`}>
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Productivity */}
          <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
            theme === 'dark'
              ? 'bg-gray-800/80 border-gray-700/50'
              : 'bg-white/80 border-white/20'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Verimlilik</p>
                <p className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>%{averageProductivity}</p>
                <p className="text-sm text-emerald-600 flex items-center mt-1">
                  <Zap className="w-4 h-4 mr-1" />
                  Ortalama skor
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-emerald-900/50' : 'bg-emerald-100'
              }`}>
                <Award className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Task Analytics */}
          <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
            theme === 'dark'
              ? 'bg-gray-800/80 border-gray-700/50'
              : 'bg-white/80 border-white/20'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Görev Dağılımı</h3>
              <PieChart className={`w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            <div className="space-y-4">
              {Object.entries(data.taskAnalytics.tasksByStatus).map(([status, count]) => {
                const statusLabels = {
                  todo: 'Yapılacak',
                  inProgress: 'Devam Eden',
                  completed: 'Tamamlanan',
                  pending: 'Beklemede'
                };
                const colors = {
                  todo: 'amber',
                  inProgress: 'blue',
                  completed: 'emerald',
                  pending: 'gray'
                };
                const percentage = Math.round((count / data.stats.totalTasks) * 100);
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${colors[status as keyof typeof colors]}-500`} />
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {statusLabels[status as keyof typeof statusLabels]}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{count}</span>
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>(%{percentage})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Analytics */}
          <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
            theme === 'dark'
              ? 'bg-gray-800/80 border-gray-700/50'
              : 'bg-white/80 border-white/20'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Haftalık Çalışma Saatleri</h3>
              <LineChart className={`w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            <div className="space-y-3">
              {data.timeAnalytics.dailyHours.slice(-7).map((day, index) => {
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString('tr-TR', { weekday: 'short' });
                const maxHours = Math.max(...data.timeAnalytics.dailyHours.map(d => d.hours));
                const percentage = (day.hours / maxHours) * 100;
                
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-12 text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {dayName}
                    </div>
                    <div className="flex-1">
                      <div className={`h-2 rounded-full ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <div 
                          className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className={`w-12 text-xs font-semibold text-right ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {day.hours}h
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Projects and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Project Progress */}
          <div className={`lg:col-span-2 backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
            theme === 'dark'
              ? 'bg-gray-800/80 border-gray-700/50'
              : 'bg-white/80 border-white/20'
          }`}>
            <h3 className={`text-lg font-semibold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Proje İlerlemeleri</h3>
            <div className="space-y-4">
              {data.projectAnalytics.projectProgress.map((project, index) => (
                <div key={index} className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{project.name}</h4>
                    <span className={`text-sm font-bold text-${getStatusColor(project.status)}-600`}>
                      %{project.progress}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {project.completedTasks}/{project.tasksCount} görev
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : project.status === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status === 'completed' ? 'Tamamlandı' : 
                       project.status === 'active' ? 'Aktif' : 'Duraklatıldı'}
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        project.status === 'completed' 
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
            theme === 'dark'
              ? 'bg-gray-800/80 border-gray-700/50'
              : 'bg-white/80 border-white/20'
          }`}>
            <h3 className={`text-lg font-semibold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Hedefler</h3>
            <div className="space-y-4">
              {data.goals.slice(0, 4).map((goal) => (
                <div key={goal.id} className={`p-3 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-sm font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{goal.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      goal.status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-800'
                        : goal.status === 'on_track'
                        ? 'bg-blue-100 text-blue-800'
                        : goal.status === 'at_risk'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {goal.status === 'completed' ? 'Tamamlandı' :
                       goal.status === 'on_track' ? 'Yolunda' :
                       goal.status === 'at_risk' ? 'Risk' : 'Gecikti'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                    <span className={`text-xs font-bold ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      %{goal.progress}
                    </span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        goal.status === 'completed' 
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                          : goal.status === 'on_track'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : goal.status === 'at_risk'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                          : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
          theme === 'dark'
            ? 'bg-gray-800/80 border-gray-700/50'
            : 'bg-white/80 border-white/20'
        }`}>
          <h3 className={`text-lg font-semibold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Son Aktiviteler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recentActivities.map((activity) => {
              const iconMap = {
                CheckCircle,
                Target,
                Users,
                Rocket,
                Activity
              };
              const IconComponent = iconMap[activity.icon as keyof typeof iconMap] || Activity;
              
              return (
                <div key={activity.id} className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-${activity.color}-100`}>
                      <IconComponent className={`w-4 h-4 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{activity.title}</h4>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>{activity.description}</p>
                      <p className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
