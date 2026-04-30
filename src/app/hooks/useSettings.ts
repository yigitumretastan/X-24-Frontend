import { Bell, Database, Key, Mail, Palette, Shield, User } from "lucide-react";
import { useState } from "react";
import type { SettingsTab, SettingsTabId } from "@/app/types/settings";

export function useSettings() {
	const [activeTab, setActiveTab] = useState<SettingsTabId>("profile");

	const tabs: SettingsTab[] = [
		{
			id: "profile",
			label: "Profil",
			icon: User,
			description: "Kişisel bilgilerinizi düzenleyin",
		},
		{
			id: "appearance",
			label: "Görünüm",
			icon: Palette,
			description: "Tema ve görünüm ayarları",
		},
		{
			id: "security",
			label: "Güvenlik",
			icon: Shield,
			description: "Şifre ve güvenlik ayarları",
		},
		{
			id: "notifications",
			label: "Bildirimler",
			icon: Bell,
			description: "Bildirim tercihleriniz",
		},
		{
			id: "data",
			label: "Veri",
			icon: Database,
			description: "Veri yönetimi ve dışa aktarma",
		},
		{
			id: "api",
			label: "API",
			icon: Key,
			description: "API anahtarları ve entegrasyonlar",
		},
		{
			id: "mail",
			label: "Mail Entegrasyonu",
			icon: Mail,
			description: "POP3/Mail ayarlarınızı yapılandırın",
		},
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
