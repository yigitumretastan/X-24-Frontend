"use client";

import { useTheme } from "@/app/hooks/useTheme";
import { useSettings } from "@/app/hooks/useSettings";
import ProfileForm from "./ProfileForm";
import AppearanceSettings from "./AppearanceSettings";
import SecuritySettings from "./SecuritySettings";
import NotificationSettings from "./NotificationSettings";
import DataSettings from "./DataSettings";
import ApiSettings from "./ApiSettings";
import { User } from "lucide-react";

export default function SettingsComponent() {
  const { theme } = useTheme();
  const { activeTab, tabs, handleTabChange } = useSettings();

  return (
    <div className={`h-screen flex flex-col transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    }`}>
      {/* Header */}
      <div className={`backdrop-blur-sm border-b flex-shrink-0 ${
        theme === 'dark'
          ? 'bg-gray-900/95 border-gray-700/50'
          : 'bg-white/95 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                : 'bg-gradient-to-br from-blue-500 to-purple-500'
            }`}>
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Ayarlar
              </h1>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Hesap ayarlarınızı ve tercihlerinizi yönetin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-6 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className={`rounded-2xl p-4 h-fit sticky top-6 ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border border-gray-700/50'
                  : 'bg-white/80 border border-gray-200/50 backdrop-blur-sm'
              }`}>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                            : theme === 'dark'
                              ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 transition-transform duration-200 ${
                            isActive ? 'scale-110' : 'group-hover:scale-105'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{tab.label}</div>
                            <div className={`text-xs mt-1 truncate ${
                              isActive 
                                ? 'text-blue-100' 
                                : theme === 'dark' 
                                  ? 'text-gray-500' 
                                  : 'text-gray-500'
                            }`}>
                              {tab.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3 overflow-hidden">
              <div className={`rounded-2xl h-full flex flex-col ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border border-gray-700/50 shadow-xl'
                  : 'bg-white/80 border border-gray-200/50 shadow-lg backdrop-blur-sm'
              }`}>
                <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === "profile" && <ProfileForm />}
                  {activeTab === "appearance" && <AppearanceSettings />}
                  {activeTab === "security" && <SecuritySettings />}
                  {activeTab === "notifications" && <NotificationSettings />}
                  {activeTab === "data" && <DataSettings />}
                  {activeTab === "api" && <ApiSettings />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
