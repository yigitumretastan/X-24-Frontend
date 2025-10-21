import { useState } from "react";
import { SettingsTabId, SettingsTab } from "@/app/types/settings";
import { User, Palette, Shield, Bell, Database, Key } from "lucide-react";

export function useSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("profile");

  const tabs: SettingsTab[] = [
    { 
      id: "profile", 
      label: "Profil", 
      icon: User, 
      description: "Kişisel bilgilerinizi düzenleyin" 
    },
    { 
      id: "appearance", 
      label: "Görünüm", 
      icon: Palette, 
      description: "Tema ve görünüm ayarları" 
    },
    { 
      id: "security", 
      label: "Güvenlik", 
      icon: Shield, 
      description: "Şifre ve güvenlik ayarları" 
    },
    { 
      id: "notifications", 
      label: "Bildirimler", 
      icon: Bell, 
      description: "Bildirim tercihleriniz" 
    },
    { 
      id: "data", 
      label: "Veri", 
      icon: Database, 
      description: "Veri yönetimi ve dışa aktarma" 
    },
    { 
      id: "api", 
      label: "API", 
      icon: Key, 
      description: "API anahtarları ve entegrasyonlar" 
    }
  ];

  const handleTabChange = (tabId: SettingsTabId) => {
    setActiveTab(tabId);
  };

  return {
    activeTab,
    tabs,
    handleTabChange,
  };
}
