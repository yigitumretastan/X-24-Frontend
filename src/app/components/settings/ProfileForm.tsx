import { useState, useEffect } from "react";
import { useTheme } from "@/app/contexts/ThemeContext";
import { User, Mail, Briefcase, Calendar, Globe, Clock, Save, Camera, MapPin } from "lucide-react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function getCookieValue(name: string) {
	if (typeof document === "undefined") return null;
	const cookies = document.cookie.split(";").map((c) => c.trim());
	const cookie = cookies.find((c) => c.startsWith(name + "="));
	return cookie ? cookie.split("=")[1] : null;
}

export default function ProfileForm() {
	const { theme } = useTheme();
	
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [userJobTitle, setUserJobTitle] = useState("");
	const [profileImage] = useState("");

	const [role, setRole] = useState<number | null>(null);
	const [joinedAt, setJoinedAt] = useState<string | null>(null);
	const [isActive, setIsActive] = useState<boolean>(true);
	const [timezone, setTimezone] = useState<number | null>(null);
	const [timeFormat, setTimeFormat] = useState<number | null>(null);
	const [dateFormat, setDateFormat] = useState<number | null>(null);
	const [language, setLanguage] = useState<number | null>(null);
	const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
	const [emailNotifications, setEmailNotifications] = useState<boolean>(true);

	const [loading, setLoading] = useState(false);
	const [initializing, setInitializing] = useState(true);

	const [workspaceId, setWorkspaceId] = useState<string | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [token, setToken] = useState<string | null>(null);

	// workspaceId, userId ve token alma
	useEffect(() => {
		if (typeof window === "undefined") return;

		const workspaceRaw = localStorage.getItem("selectedWorkspace");
		const rawToken = getCookieValue("userToken");

		let workspaceIdTemp: string | null = null;
		let userIdTemp: string | null = null;

		if (workspaceRaw) {
			try {
				const workspace = JSON.parse(workspaceRaw);
				workspaceIdTemp = workspace.id;
			} catch {
				console.error("Workspace parse hatası");
			}
		}

		if (rawToken) {
			try {
				const tokenData = JSON.parse(rawToken);
				userIdTemp = tokenData.userId;
			} catch {
				console.error("Token parse hatası");
			}
		}

		setWorkspaceId(workspaceIdTemp);
		setUserId(userIdTemp);
		setToken(rawToken);

		if (workspaceIdTemp && userIdTemp && rawToken) {
			fetchUserData(workspaceIdTemp, userIdTemp, rawToken);
		} else {
			setInitializing(false);
		}
	}, []);

	const fetchUserData = async (workspaceId: string, userId: string, token: string) => {
		try {
			const res = await fetch(`${apiBaseUrl}/api/workspaces/${workspaceId}/users/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (res.ok) {
				const data = await res.json();
				if (data.success && data.data) {
					const user = data.data;
					setUserName(user.name || "");
					setUserEmail(user.email || "");
					setUserJobTitle(user.jobTitle || "");
					setRole(user.role);
					setJoinedAt(user.joinedAt);
					setIsActive(user.isActive);
					setTimezone(user.timezone);
					setTimeFormat(user.timeFormat);
					setDateFormat(user.dateFormat);
					setLanguage(user.language);
					setNotificationsEnabled(user.notificationsEnabled);
					setEmailNotifications(user.emailNotifications);
				}
			}
		} catch (error) {
			console.error("Kullanıcı verisi alınamadı:", error);
		} finally {
			setInitializing(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!workspaceId || !userId || !token) return;

		setLoading(true);
		try {
			const res = await fetch(`${apiBaseUrl}/api/workspaces/${workspaceId}/users/${userId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					name: userName,
					email: userEmail,
					jobTitle: userJobTitle,
					timezone,
					timeFormat,
					dateFormat,
					language,
					notificationsEnabled,
					emailNotifications,
				}),
			});

			const data = await res.json();

			if (res.ok && data.success) {
				alert("Profil başarıyla güncellendi!");
			} else {
				alert("Hata: " + (data.message || "Bilinmeyen hata"));
			}
		} catch {
			alert("Sunucu hatası.");
		} finally {
			setLoading(false);
		}
	};

	if (initializing) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
				<span className={`ml-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
					Profil bilgileri yükleniyor...
				</span>
			</div>
		);
	}

	const languages = [
		{ id: 0, code: "TR", name: "Türkçe" },
		{ id: 1, code: "EN", name: "English" },
		{ id: 2, code: "DE", name: "Deutsch" },
		{ id: 3, code: "FR", name: "Français" },
		{ id: 4, code: "ES", name: "Español" },
		{ id: 5, code: "IT", name: "Italiano" },
		{ id: 6, code: "RU", name: "Русский" },
		{ id: 7, code: "JA", name: "日本語" },
		{ id: 8, code: "KO", name: "한국어" },
		{ id: 9, code: "ZH", name: "中文" }
	];

	const timezones = [
		{ id: 0, name: "UTC+3 (İstanbul)" },
		{ id: 1, name: "UTC+0 (London)" },
		{ id: 2, name: "UTC-5 (New York)" },
		{ id: 3, name: "UTC+1 (Berlin)" },
		{ id: 4, name: "UTC+9 (Tokyo)" }
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h2 className={`text-2xl font-bold mb-2 ${
					theme === 'dark' ? 'text-white' : 'text-gray-900'
				}`}>
					Profil Bilgileri
				</h2>
				<p className={`text-sm ${
					theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
				}`}>
					Kişisel bilgilerinizi ve hesap ayarlarınızı yönetin
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Profile Picture Section */}
				<div className={`p-6 rounded-xl border ${
					theme === 'dark' 
						? 'bg-gray-800/50 border-gray-700/50' 
						: 'bg-gray-50/50 border-gray-200/50'
				}`}>
					<div className="flex items-center gap-6">
						<div className="relative">
							<div className={`w-20 h-20 rounded-full flex items-center justify-center ${
								theme === 'dark' 
									? 'bg-gradient-to-br from-blue-600 to-purple-600' 
									: 'bg-gradient-to-br from-blue-500 to-purple-500'
							}`}>
								{profileImage ? (
									<img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
								) : (
									<User className="w-8 h-8 text-white" />
								)}
							</div>
							<button
								type="button"
								className={`absolute -bottom-1 -right-1 p-2 rounded-full border-2 ${
									theme === 'dark'
										? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
										: 'bg-white border-gray-200 hover:bg-gray-50'
								} transition-colors duration-200`}
							>
								<Camera className="w-4 h-4" />
							</button>
						</div>
						<div>
							<h3 className={`font-semibold ${
								theme === 'dark' ? 'text-white' : 'text-gray-900'
							}`}>
								Profil Fotoğrafı
							</h3>
							<p className={`text-sm mt-1 ${
								theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
							}`}>
								JPG, PNG veya GIF formatında, maksimum 5MB
							</p>
							<button
								type="button"
								className="mt-2 text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200"
							>
								Fotoğraf Yükle
							</button>
						</div>
					</div>
				</div>

				{/* Basic Information */}
				<div className={`p-6 rounded-xl border ${
					theme === 'dark' 
						? 'bg-gray-800/50 border-gray-700/50' 
						: 'bg-gray-50/50 border-gray-200/50'
				}`}>
					<h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
						theme === 'dark' ? 'text-white' : 'text-gray-900'
					}`}>
						<User className="w-5 h-5 text-blue-500" />
						Temel Bilgiler
					</h3>
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className={`block text-sm font-semibold mb-2 ${
								theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
							}`}>
								Ad Soyad
							</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									type="text"
									value={userName}
									onChange={(e) => setUserName(e.target.value)}
									className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 outline-none ${
										theme === 'dark'
											? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
											: 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm'
									}`}
									placeholder="Adınızı ve soyadınızı girin"
								/>
							</div>
						</div>

						<div>
							<label className={`block text-sm font-semibold mb-2 ${
								theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
							}`}>
								E-posta Adresi
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									type="email"
									value={userEmail}
									onChange={(e) => setUserEmail(e.target.value)}
									className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 outline-none ${
										theme === 'dark'
											? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
											: 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm'
									}`}
									placeholder="email@example.com"
								/>
							</div>
						</div>

						<div className="md:col-span-2">
							<label className={`block text-sm font-semibold mb-2 ${
								theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
							}`}>
								Meslek / Pozisyon
							</label>
							<div className="relative">
								<Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									type="text"
									value={userJobTitle}
									onChange={(e) => setUserJobTitle(e.target.value)}
									className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 outline-none ${
										theme === 'dark'
											? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
											: 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm'
									}`}
									placeholder="Ör: Frontend Developer, Proje Yöneticisi"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Preferences */}
				<div className={`p-6 rounded-xl border ${
					theme === 'dark' 
						? 'bg-gray-800/50 border-gray-700/50' 
						: 'bg-gray-50/50 border-gray-200/50'
				}`}>
					<h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
						theme === 'dark' ? 'text-white' : 'text-gray-900'
					}`}>
						<Globe className="w-5 h-5 text-blue-500" />
						Tercihler
					</h3>
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className={`block text-sm font-medium mb-2 ${
								theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
							}`}>
								Dil
							</label>
							<select
								value={language || 0}
								onChange={(e) => setLanguage(Number(e.target.value))}
								className="form-input"
							>
								{languages.map((lang) => (
									<option key={lang.id} value={lang.id}>
										{lang.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 ${
								theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
							}`}>
								Saat Dilimi
							</label>
							<div className="relative">
								<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
								<select
									value={timezone || 0}
									onChange={(e) => setTimezone(Number(e.target.value))}
									className="form-input pl-10"
								>
									{timezones.map((tz) => (
										<option key={tz.id} value={tz.id}>
											{tz.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 ${
								theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
							}`}>
								Saat Formatı
							</label>
							<select
								value={timeFormat || 0}
								onChange={(e) => setTimeFormat(Number(e.target.value))}
								className="form-input"
							>
								<option value={0}>24 Saat (14:30)</option>
								<option value={1}>12 Saat (2:30 PM)</option>
							</select>
						</div>

						<div>
							<label className={`block text-sm font-medium mb-2 ${
								theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
							}`}>
								Tarih Formatı
							</label>
							<select
								value={dateFormat || 0}
								onChange={(e) => setDateFormat(Number(e.target.value))}
								className="form-input"
							>
								<option value={0}>DD/MM/YYYY</option>
								<option value={1}>MM/DD/YYYY</option>
								<option value={2}>YYYY-MM-DD</option>
							</select>
						</div>
					</div>
				</div>

				{/* Notifications */}
				<div className={`p-6 rounded-xl border ${
					theme === 'dark' 
						? 'bg-gray-800/50 border-gray-700/50' 
						: 'bg-gray-50/50 border-gray-200/50'
				}`}>
					<h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
						theme === 'dark' ? 'text-white' : 'text-gray-900'
					}`}>
						<Clock className="w-5 h-5 text-blue-500" />
						Bildirim Ayarları
					</h3>
					
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<h4 className={`font-medium ${
									theme === 'dark' ? 'text-white' : 'text-gray-900'
								}`}>
									Push Bildirimleri
								</h4>
								<p className={`text-sm ${
									theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
								}`}>
									Tarayıcı bildirimleri alın
								</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={notificationsEnabled}
									onChange={(e) => setNotificationsEnabled(e.target.checked)}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
							</label>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<h4 className={`font-medium ${
									theme === 'dark' ? 'text-white' : 'text-gray-900'
								}`}>
									E-posta Bildirimleri
								</h4>
								<p className={`text-sm ${
									theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
								}`}>
									Önemli güncellemeler için e-posta alın
								</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={emailNotifications}
									onChange={(e) => setEmailNotifications(e.target.checked)}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
							</label>
						</div>
					</div>
				</div>

				{/* Account Info */}
				{(role !== null || joinedAt) && (
					<div className={`p-6 rounded-xl border ${
						theme === 'dark' 
							? 'bg-gray-800/50 border-gray-700/50' 
							: 'bg-gray-50/50 border-gray-200/50'
					}`}>
						<h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
							theme === 'dark' ? 'text-white' : 'text-gray-900'
						}`}>
							<Calendar className="w-5 h-5 text-blue-500" />
							Hesap Bilgileri
						</h3>
						
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{role !== null && (
								<div className={`p-4 rounded-lg ${
									theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/50'
								}`}>
									<p className={`text-sm ${
										theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
									}`}>
										Rol
									</p>
									<p className={`font-semibold ${
										theme === 'dark' ? 'text-white' : 'text-gray-900'
									}`}>
										{role === 1 ? 'Üye' : role === 2 ? 'Moderatör' : 'Admin'}
									</p>
								</div>
							)}
							
							{joinedAt && (
								<div className={`p-4 rounded-lg ${
									theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/50'
								}`}>
									<p className={`text-sm ${
										theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
									}`}>
										Katılma Tarihi
									</p>
									<p className={`font-semibold ${
										theme === 'dark' ? 'text-white' : 'text-gray-900'
									}`}>
										{new Date(joinedAt).toLocaleDateString('tr-TR')}
									</p>
								</div>
							)}
							
							<div className={`p-4 rounded-lg ${
								theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/50'
							}`}>
								<p className={`text-sm ${
									theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
								}`}>
									Durum
								</p>
								<div className="flex items-center gap-2">
									<div className={`w-2 h-2 rounded-full ${
										isActive ? 'bg-green-500' : 'bg-red-500'
									}`}></div>
									<p className={`font-semibold ${
										theme === 'dark' ? 'text-white' : 'text-gray-900'
									}`}>
										{isActive ? 'Aktif' : 'Pasif'}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Submit Button */}
				<div className="flex justify-end">
					<button
						type="submit"
						disabled={loading}
						className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
								Güncelleniyor...
							</>
						) : (
							<>
								<Save className="w-4 h-4" />
								Değişiklikleri Kaydet
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
