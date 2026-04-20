"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useCalendar } from "@/app/hooks/useCalendar";
import TaskModal from "./TaskModal";
import { Calendar, Plus, Clock, CheckCircle, Users, TrendingUp } from "lucide-react";

export default function CalendarComponent() {
  const { theme } = useTheme();
  const {
    modalOpen,
    setModalOpen,
    editingTask,
    tasks,
    taskTypes,
    form,
    setForm,
    handleDateClick,
    handleEventClick,
    handleSubmit,
    deleteTask,
    totalTasks,
    completedTasks,
  } = useCalendar();

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className={`min-h-screen p-6 ${
      theme === "dark" 
        ? "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900" 
        : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className={`backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
            theme === "dark"
              ? "bg-gray-800/80 border-gray-700/50"
              : "bg-white/80 border-white/20"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${
                  theme === "dark" ? "bg-indigo-900/50" : "bg-indigo-100"
                }`}>
                  <Calendar className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Takvim & Etkinlikler
                  </h1>
                  <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    Görevlerinizi planlayın ve takip edin
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setForm({
                    title: "",
                    description: "",
                    date: new Date().toISOString().split('T')[0],
                    time: "09:00",
                    typeId: taskTypes[0]?.id || 1,
                    completed: false,
                  });
                  setModalOpen(true);
                }}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Yeni Görev</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Area */}
          <div className="lg:col-span-3">
            <div className={`backdrop-blur-sm rounded-3xl p-6 shadow-xl border ${
              theme === "dark"
                ? "bg-gray-800/80 border-gray-700/50"
                : "bg-white/80 border-white/20"
            }`}>
              <div className="calendar-container">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
                    backgroundColor: taskTypes.find(t => t.id === task.typeId)?.color || "#6366f1",
                    borderColor: taskTypes.find(t => t.id === task.typeId)?.color || "#6366f1",
                    textColor: "#ffffff",
                    classNames: task.completed ? ["completed-event"] : [],
                  }))}
                  height="600px"
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  dayMaxEvents={3}
                  moreLinkClick="popover"
                  eventDisplay="block"
                  displayEventTime={false}
                  dayHeaderClassNames={theme === "dark" ? "dark-day-header" : ""}
                  dayCellClassNames={theme === "dark" ? "dark-day-cell" : ""}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
                theme === "dark"
                  ? "bg-gray-800/80 border-gray-700/50"
                  : "bg-white/80 border-white/20"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}>Toplam Görev</p>
                    <p className={`text-3xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>{totalTasks}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    theme === "dark" ? "bg-blue-900/50" : "bg-blue-100"
                  }`}>
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
                theme === "dark"
                  ? "bg-gray-800/80 border-gray-700/50"
                  : "bg-white/80 border-white/20"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}>Tamamlanan</p>
                    <p className={`text-3xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>{completedTasks}</p>
                    <p className="text-sm text-emerald-600 flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      %{completionRate} başarı
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    theme === "dark" ? "bg-emerald-900/50" : "bg-emerald-100"
                  }`}>
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Task Types */}
            <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
              theme === "dark"
                ? "bg-gray-800/80 border-gray-700/50"
                : "bg-white/80 border-white/20"
            }`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                <Users className="w-5 h-5 mr-2" />
                Görev Türleri
              </h3>
              <div className="space-y-3">
                {taskTypes.map((type) => {
                  const typeTaskCount = tasks.filter((t) => t.typeId === type.id).length;
                  return (
                    <div key={type.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                      theme === "dark" ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: type.color || "#6366f1" }}
                        />
                        <span className={`font-medium ${
                          theme === "dark" ? "text-gray-200" : "text-gray-700"
                        }`}>{type.name}</span>
                      </div>
                      <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        theme === "dark" 
                          ? "bg-gray-700 text-gray-300" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {typeTaskCount}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Bar */}
            <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
              theme === "dark"
                ? "bg-gray-800/80 border-gray-700/50"
                : "bg-white/80 border-white/20"
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>İlerleme</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                    Tamamlanma Oranı
                  </span>
                  <span className="font-semibold text-indigo-600">%{completionRate}</span>
                </div>
                <div className={`w-full rounded-full h-3 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                }`}>
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      <style jsx global>{`
        .calendar-container .fc {
          font-family: inherit;
        }
        
        .calendar-container .fc-toolbar {
          margin-bottom: 1.5rem;
        }
        
        .calendar-container .fc-toolbar-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: ${theme === "dark" ? "#ffffff" : "#1f2937"};
        }
        
        .calendar-container .fc-button {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 0.75rem;
          padding: 0.5rem 1rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .calendar-container .fc-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        
        .calendar-container .fc-button:disabled {
          opacity: 0.5;
          transform: none;
        }
        
        .calendar-container .fc-daygrid-day {
          border: 1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"};
        }
        
        .calendar-container .fc-daygrid-day:hover {
          background-color: ${theme === "dark" ? "#374151" : "#f9fafb"};
        }
        
        .calendar-container .fc-day-today {
          background-color: ${theme === "dark" ? "#1e40af20" : "#dbeafe"} !important;
        }
        
        .calendar-container .fc-event {
          border-radius: 0.5rem;
          border: none;
          padding: 2px 6px;
          font-size: 0.875rem;
          font-weight: 500;
          margin: 1px 0;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .calendar-container .fc-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .calendar-container .completed-event {
          opacity: 0.7;
          text-decoration: line-through;
        }
        
        .calendar-container .fc-daygrid-day-number {
          color: ${theme === "dark" ? "#d1d5db" : "#374151"};
          font-weight: 600;
          padding: 0.5rem;
        }
        
        .calendar-container .fc-col-header-cell {
          background-color: ${theme === "dark" ? "#374151" : "#f8fafc"};
          border: 1px solid ${theme === "dark" ? "#4b5563" : "#e2e8f0"};
          font-weight: 600;
          color: ${theme === "dark" ? "#f3f4f6" : "#475569"};
        }
        
        .calendar-container .fc-scrollgrid {
          border: 1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"};
          border-radius: 1rem;
          overflow: hidden;
        }

        /* More Link Styling */
        .calendar-container .fc-daygrid-more-link {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
          color: white !important;
          border: none !important;
          border-radius: 0.5rem !important;
          padding: 2px 8px !important;
          font-size: 0.75rem !important;
          font-weight: 600 !important;
          text-decoration: none !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2) !important;
        }
        
        .calendar-container .fc-daygrid-more-link:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4) !important;
          background: linear-gradient(135deg, #5b5bf6 0%, #7c3aed 100%) !important;
        }

        /* Popover Styling */
        .fc-popover {
          background: ${theme === "dark" ? "rgba(31, 41, 55, 0.95)" : "rgba(255, 255, 255, 0.95)"} !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid ${theme === "dark" ? "rgba(75, 85, 99, 0.5)" : "rgba(229, 231, 235, 0.5)"} !important;
          border-radius: 1rem !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          overflow: hidden !important;
          min-width: 280px !important;
        }

        .fc-popover-header {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
          color: white !important;
          padding: 12px 16px !important;
          font-weight: 600 !important;
          font-size: 0.875rem !important;
          border-bottom: none !important;
        }

        .fc-popover-close {
          color: white !important;
          opacity: 0.8 !important;
          font-size: 1.2rem !important;
          font-weight: bold !important;
          transition: all 0.2s ease !important;
          border-radius: 0.5rem !important;
          padding: 4px 8px !important;
        }

        .fc-popover-close:hover {
          opacity: 1 !important;
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.1) !important;
        }

        .fc-popover-body {
          padding: 8px !important;
          max-height: 300px !important;
          overflow-y: auto !important;
        }

        /* Popover Events Styling */
        .fc-popover .fc-event {
          margin: 4px 0 !important;
          padding: 8px 12px !important;
          border-radius: 0.75rem !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        .fc-popover .fc-event:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
        }

        .fc-popover .fc-event-title {
          color: white !important;
          font-weight: 600 !important;
        }

        .fc-popover .fc-event-time {
          color: rgba(255, 255, 255, 0.9) !important;
          font-size: 0.75rem !important;
          margin-right: 8px !important;
        }

        /* Custom scrollbar for popover */
        .fc-popover-body::-webkit-scrollbar {
          width: 6px;
        }

        .fc-popover-body::-webkit-scrollbar-track {
          background: ${theme === "dark" ? "#374151" : "#f1f5f9"};
          border-radius: 3px;
        }

        .fc-popover-body::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 3px;
        }

        .fc-popover-body::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5b5bf6 0%, #7c3aed 100%);
        }

        /* Animation for popover */
        .fc-popover {
          animation: popoverFadeIn 0.3s ease-out !important;
        }

        @keyframes popoverFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
