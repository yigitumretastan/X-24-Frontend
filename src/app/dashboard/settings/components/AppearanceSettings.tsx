import React, { useState, useEffect, useCallback } from "react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function parseJwt(token: string | null) {
	if (!token) return null;
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		);
		return JSON.parse(jsonPayload);
	} catch (e) {
		console.error("JWT parse hatası:", e);
		return null;
	}
}

export default function AppearanceSettings() {
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [background, setBackground] = useState("#ffffff");
	const [loading, setLoading] = useState(false);

	const [workspaceId, setWorkspaceId] = useState<string | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [token, setToken] = useState<string | null>(null);

	// Token ve kullanıcı bilgilerini al
	useEffect(() => {
		if (typeof window === "undefined") return;

		const workspaceRaw = localStorage.getItem("selectedWorkspace");
		const userToken = document.cookie
			.split('; ')
			.find(row => row.startsWith('userToken='))
			?.split('=')[1];

		if (userToken) setToken(userToken);

		if (workspaceRaw) {
			try {
				const parsed = JSON.parse(workspaceRaw);
				setWorkspaceId(parsed.id);
			} catch (e) {
				console.error("Workspace parse hatası:", e);
			}
		}

		if (userToken) {
			const payload = parseJwt(userToken);
			const userFromToken = payload?.sub || null;
			if (userFromToken) setUserId(userFromToken);
		} else {
			const userLocal = localStorage.getItem("userId");
			if (userLocal) setUserId(userLocal);
		}
	}, []);

	// Kullanıcının görünüm ayarlarını çek
	const fetchAppearanceSettings = useCallback(async () => {
		if (!workspaceId || !userId || !token) return;

		try {
			const res = await fetch(`${apiBaseUrl}/api/WorkspaceUser/${workspaceId}/user/${userId}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				credentials: "include",
			});

			const data = await res.json();

			if (res.ok && data.success) {
				const user = data.data;
				setTheme(user.theme === 1 ? "dark" : "light");
				if (user.backgroundImageUrl) {
					setBackground(user.backgroundImageUrl);
				}
				console.log("Mevcut ayarlar:", user);
			} else {
				console.log("Görünüm ayarları alınamadı.");
			}
		} catch (error) {
			console.log("Veri çekme hatası:", error);
		}
	}, [workspaceId, userId, token]);

	// İlk yüklemede ayarları getir
	useEffect(() => {
		if (!workspaceId || !userId || !token) return;
		fetchAppearanceSettings();
	}, [workspaceId, userId, token, fetchAppearanceSettings]);

	const handleUpdate = async () => {
		if (!workspaceId || !userId || !token) {
			console.log("Workspace, kullanıcı bilgisi veya token eksik.");
			return;
		}

		setLoading(true);

		const newThemeValue = theme === "dark" ? 1 : 0;

		const requestBody = {
			role: 1,
			language: 0,
			theme: newThemeValue,
			dateFormat: 0,
			timeFormat: 0,
			timezone: 0,
			notificationsEnabled: true,
			emailNotifications: true,
		};

		console.log("Gönderilen request body:", requestBody);

		try {
			const res = await fetch(`${apiBaseUrl}/api/WorkspaceUser/${workspaceId}/user/${userId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(requestBody),
			});

			const data = await res.json();

			console.log("Response:", data);

			if (res.ok && data.success) {
				console.log("Görünüm ayarları başarıyla güncellendi!");

				// Cookie güncelle
				document.cookie = `theme=${theme}; path=/; max-age=31536000`;

				// Güncellenen veriyi tekrar çek
				await fetchAppearanceSettings();
			} else {
				console.log("Hata: " + (data.message || "Bilinmeyen hata"));
			}
		} catch (error) {
			console.log("Ayar güncelleme hatası:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<label className="block text-sm font-medium">Tema</label>
				<select
					value={theme}
					onChange={(e) => setTheme(e.target.value as "light" | "dark")}
					className="w-full px-2 py-1 border border-gray-300 rounded"
				>
					<option value="light">Açık</option>
					<option value="dark">Koyu</option>
				</select>
			</div>

			<div>
				<label className="block text-sm font-medium">Arka Plan Rengi</label>
				<input
					type="color"
					value={background}
					onChange={(e) => setBackground(e.target.value)}
					className="w-full h-10 p-0 border-none"
				/>
			</div>

			<div
				className="mt-4 p-4 rounded border"
				style={{ backgroundColor: background }}
			>
				<p className="text-sm">
					Önizleme alanı ({theme === "dark" ? "Koyu" : "Açık"} tema)
				</p>
			</div>

			<button
				onClick={handleUpdate}
				disabled={loading}
				className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
			>
				{loading ? "Güncelleniyor..." : "Güncelle"}
			</button>
		</div>
	);
}
