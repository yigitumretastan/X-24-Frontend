import { useState, useEffect } from "react";
import {
  AnalysisDashboard,
  DateRange,
  ChartData
} from "@/app/types/analysis";
import { mockAnalysisDashboard } from "@/data/analysis/analysis";

export const useAnalysis = () => {
  const [data, setData] = useState<AnalysisDashboard>(mockAnalysisDashboard);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "2024-10-01",
    endDate: "2024-10-31",
    period: "month"
  });

  // Chart data generators
  const getTaskStatusChartData = (): ChartData => ({
    labels: ["Yapılacak", "Devam Eden", "Tamamlanan", "Beklemede"],
    datasets: [{
      label: "Görevler",
      data: [
        data.taskAnalytics.tasksByStatus.todo,
        data.taskAnalytics.tasksByStatus.inProgress,
        data.taskAnalytics.tasksByStatus.completed,
        data.taskAnalytics.tasksByStatus.pending
      ],
      backgroundColor: [
        "#f59e0b", // amber
        "#3b82f6", // blue
        "#10b981", // emerald
        "#6b7280"  // gray
      ],
      borderWidth: 0
    }]
  });

  const getTaskPriorityChartData = (): ChartData => ({
    labels: ["Yüksek", "Orta", "Düşük"],
    datasets: [{
      label: "Öncelik",
      data: [
        data.taskAnalytics.tasksByPriority.high,
        data.taskAnalytics.tasksByPriority.medium,
        data.taskAnalytics.tasksByPriority.low
      ],
      backgroundColor: [
        "#ef4444", // red
        "#f59e0b", // amber
        "#10b981"  // emerald
      ],
      borderWidth: 0
    }]
  });

  const getTimeAnalyticsChartData = (): ChartData => ({
    labels: data.timeAnalytics.dailyHours.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('tr-TR', { weekday: 'short' });
    }),
    datasets: [{
      label: "Günlük Çalışma Saatleri",
      data: data.timeAnalytics.dailyHours.map(d => d.hours),
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      borderColor: "#6366f1",
      borderWidth: 3,
      fill: true,
      tension: 0.4
    }]
  });

  const getProjectProgressChartData = (): ChartData => ({
    labels: data.projectAnalytics.projectProgress.map(p => p.name),
    datasets: [{
      label: "Proje İlerlemesi (%)",
      data: data.projectAnalytics.projectProgress.map(p => p.progress),
      backgroundColor: [
        "#6366f1", // indigo
        "#8b5cf6", // purple
        "#06b6d4", // cyan
        "#10b981", // emerald
        "#f59e0b"  // amber
      ],
      borderWidth: 0
    }]
  });

  const getPerformanceRadarData = (): ChartData => ({
    labels: [
      "Verimlilik",
      "Etkinlik",
      "Kalite",
      "Zamanında Teslimat",
      "Takım Çalışması",
      "Skill Geliştirme"
    ],
    datasets: [{
      label: "Performans Metrikleri",
      data: [
        data.performanceMetrics.productivity,
        data.performanceMetrics.efficiency,
        data.performanceMetrics.qualityScore,
        data.performanceMetrics.onTimeDelivery,
        data.performanceMetrics.teamCollaboration,
        data.performanceMetrics.skillDevelopment
      ],
      backgroundColor: "rgba(99, 102, 241, 0.2)",
      borderColor: "#6366f1",
      borderWidth: 2,
      pointBackgroundColor: "#6366f1",
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2
    }]
  });

  // Data fetching (simulated)
  const fetchAnalysisData = async (_range?: DateRange) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching analysis data for range:", _range);
      // TODO: Gerçek API çağrısı yapılacak
      // const { fetchAnalysisDataFromAPI } = await import("@/app/lib/endpoints");
      // const analysisData = await fetchAnalysisDataFromAPI(range || dateRange);

      // Şimdilik mock data kullanıyoruz
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setData(mockAnalysisDashboard);

    } catch (err) {
      console.error("Analysis data yüklenirken hata:", err);
      setError("Analiz verileri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Date range değiştiğinde data'yı yenile
  const updateDateRange = (newRange: DateRange) => {
    setDateRange(newRange);
    fetchAnalysisData(newRange);
  };

  // Export data functionality
  const exportData = (format: 'pdf' | 'excel' | 'csv') => {
    // TODO: Export functionality implementation
    console.log(`Exporting data in ${format} format...`);
  };

  // Refresh data
  const refreshData = () => {
    fetchAnalysisData(dateRange);
  };

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  return {
    data,
    loading,
    error,
    dateRange,
    updateDateRange,
    refreshData,
    exportData,

    // Chart data getters
    getTaskStatusChartData,
    getTaskPriorityChartData,
    getTimeAnalyticsChartData,
    getProjectProgressChartData,
    getPerformanceRadarData,

    // Computed values
    completionRate: Math.round((data.stats.completedTasks / data.stats.totalTasks) * 100),
    activeTasksCount: data.stats.inProgressTasks + data.stats.pendingTasks,
    averageProductivity: Math.round((data.performanceMetrics.productivity + data.performanceMetrics.efficiency) / 2),

    // Helper functions
    getStatusColor: (status: string) => {
      const colors = {
        'completed': 'emerald',
        'on_track': 'blue',
        'at_risk': 'amber',
        'overdue': 'red',
        'active': 'indigo',
        'paused': 'gray'
      };
      return colors[status as keyof typeof colors] || 'gray';
    },

    formatHours: (hours: number) => {
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return `${h}s ${m}dk`;
    }
  };
};
