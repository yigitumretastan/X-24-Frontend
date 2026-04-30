import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { DashboardData, Workspace } from "@/app/types/dashboard";
import {
	mockDashboardStats,
	mockQuickActions,
	mockRecentActivities,
} from "@/data/dashboard/dashboard";

export const useDashboard = () => {
	const router = useRouter();
	const [workspace, setWorkspace] = useState<Workspace | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Mock data artık data klasöründen geliyor

	// Workspace yükleme
	const loadWorkspace = useCallback(() => {
		try {
			const stored = localStorage.getItem("selectedWorkspace");
			if (!stored) {
				// Otomatik giriş için varsayılan bir workspace oluştur
				const defaultWorkspace = { id: "default", name: "X24 Proje" };
				setWorkspace(defaultWorkspace);
				setLoading(false);
				return;
			}

			const parsed = JSON.parse(stored);
			setWorkspace(parsed);
		} catch (err) {
			console.error("Workspace yüklenirken hata:", err);
			localStorage.removeItem("selectedWorkspace");
			router.push("/workspaces");
		} finally {
			setLoading(false);
		}
	}, [router]);

	// Dashboard verilerini yükleme (gelecekte API'den gelecek)
	const loadDashboardData = async (): Promise<DashboardData> => {
		try {
			// TODO: Gerçek API çağrısı yapılacak
			// const { fetchDashboardDataFromAPI } = await import("@/app/lib/endpoints");
			// const data = await fetchDashboardDataFromAPI();

			// Şimdilik mock data döndürüyoruz
			return {
				workspace,
				stats: mockDashboardStats,
				recentActivities: mockRecentActivities,
				quickActions: mockQuickActions,
			};
		} catch (err) {
			console.error("Dashboard verileri yüklenirken hata:", err);
			setError("Dashboard verileri yüklenirken bir hata oluştu.");
			throw err;
		}
	};

	// Quick action'a tıklama
	const handleQuickAction = (route: string) => {
		router.push(route);
	};

	// Workspace değiştirme
	const changeWorkspace = () => {
		router.push("/workspaces");
	};

	useEffect(() => {
		loadWorkspace();
	}, [loadWorkspace]);

	return {
		workspace,
		loading,
		error,
		stats: mockDashboardStats,
		recentActivities: mockRecentActivities,
		quickActions: mockQuickActions,
		loadDashboardData,
		handleQuickAction,
		changeWorkspace,
		setError,
	};
};
