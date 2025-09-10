import { useState, useEffect } from "react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function getCookieValue(name: string) {
	if (typeof document === "undefined") return null;
	const cookies = document.cookie.split(";").map((c) => c.trim());
	const cookie = cookies.find((c) => c.startsWith(name + "="));
	return cookie ? cookie.split("=")[1] : null;
}


export default function ProfileForm() {

	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [userJobTitle, setUserJobTitle] = useState("");

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

	const [theme, setTheme] = useState<"light" | "dark">("light");

	// Tema bilgisi
	useEffect(() => {
		const themeCookie = getCookieValue("theme");
		if (themeCookie === "dark") setTheme("dark");
		else setTheme("light");
	}, []);

	const isDark = theme === "dark";

	// workspaceId, userId ve token alma
	useEffect(() => {
		if (typeof window === "undefined") return;

		const workspaceRaw = localStorage.getItem("selectedWorkspace");
		const rawToken = getCookieValue("userToken");

		let workspaceIdTemp: string | null = null;
		let userIdTemp: string | null = null;

		if (workspaceRaw) {
			try {
				const parsed = JSON.parse(workspaceRaw);
				workspaceIdTemp = parsed.id;
			} catch { }
		}

		if (rawToken) {
			try {
				const payload = JSON.parse(atob(rawToken.split(".")[1]));
				userIdTemp = payload?.sub || null;
			} catch { }
		} else {
			const userLocal = localStorage.getItem("userId");
			if (userLocal) userIdTemp = userLocal;
		}

		setToken(rawToken);
		setWorkspaceId(workspaceIdTemp);
		setUserId(userIdTemp);
	}, []);

	// Kullanıcı verisini çek
	useEffect(() => {
		const fetchUserData = async () => {
			if (!workspaceId || !userId || !token || token.trim() === "") {
				setInitializing(false);
				return;
			}

			try {
				const res = await fetch(
					`${apiBaseUrl}/api/WorkspaceUser/${workspaceId}/user/${userId}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						credentials: "include",
					}
				);

				const data = await res.json();

				if (res.ok && data.success) {
					const user = data.data;

					setUserName(user.userName || "");
					setUserEmail(user.userEmail || "");
					setUserJobTitle(user.userJobTitle || "");

					setRole(user.role ?? null);
					setJoinedAt(user.joinedAt ?? null);
					setIsActive(user.isActive ?? true);
					setTimezone(user.timezone ?? null);
					setTimeFormat(user.timeFormat ?? null);
					setDateFormat(user.dateFormat ?? null);
					setLanguage(user.language ?? null);
					setNotificationsEnabled(user.notificationsEnabled ?? true);
					setEmailNotifications(user.emailNotifications ?? true);
				} else {
					alert("Kullanıcı verisi alınamadı.");
				}
			} catch {
				alert("Sunucu hatası.");
			} finally {
				setInitializing(false);
			}
		};

		fetchUserData();
	}, [workspaceId, userId, token]);

	// Profil güncelleme
	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		if (!workspaceId || !userId || !token || token.trim() === "") {
			alert("workspaceId, userId veya token eksik.");
			setLoading(false);
			return;
		}

		try {
			const res = await fetch(
				`${apiBaseUrl}/api/WorkspaceUser/${workspaceId}/user/${userId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						userName,
						userEmail,
						userJobTitle: userJobTitle || null,
						userProfilePhoto: null,
						timezone,
						timeFormat,
						dateFormat,
						language,
						notificationsEnabled,
						emailNotifications,
					}),
				}
			);

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

	if (initializing) return <p className="text-gray-500">Yükleniyor...</p>;

	// 🔥 Dark mode destekli Tailwind class'ları
	const inputClass = `w-full px-3 py-2 border rounded transition-colors duration-200 ${isDark
		? "bg-[#1e1e1e] text-white border-gray-700 placeholder-gray-400"
		: "bg-white text-black border-gray-300"
		}`;

	const labelClass = `block text-sm mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`;

	const sectionText = `text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`;
	const languages = [
		{ id: 0, code: "TR", name: "Turkish" },
		{ id: 1, code: "EN", name: "English" },
		{ id: 2, code: "AF", name: "Afrikaans" },
		{ id: 3, code: "SQ", name: "Albanian" },
		{ id: 4, code: "AM", name: "Amharic" },
		{ id: 5, code: "AR", name: "Arabic" },
		{ id: 6, code: "HY", name: "Armenian" },
		{ id: 7, code: "AZ", name: "Azerbaijani" },
		{ id: 8, code: "EU", name: "Basque" },
		{ id: 9, code: "BE", name: "Belarusian" },
		{ id: 10, code: "BN", name: "Bengali" },
		{ id: 11, code: "BS", name: "Bosnian" },
		{ id: 12, code: "BG", name: "Bulgarian" },
		{ id: 13, code: "CA", name: "Catalan" },
		{ id: 14, code: "CE", name: "Chechen" },
		{ id: 15, code: "ZH", name: "Chinese" },
		{ id: 16, code: "HR", name: "Croatian" },
		{ id: 17, code: "CS", name: "Czech" },
		{ id: 18, code: "DA", name: "Danish" },
		{ id: 19, code: "NL", name: "Dutch" },
		{ id: 20, code: "EO", name: "Esperanto" },
		{ id: 21, code: "ET", name: "Estonian" },
		{ id: 22, code: "FA", name: "Persian / Farsi" },
		{ id: 23, code: "FI", name: "Finnish" },
		{ id: 24, code: "FR", name: "French" },
		{ id: 25, code: "KA", name: "Georgian" },
		{ id: 26, code: "DE", name: "German" },
		{ id: 27, code: "EL", name: "Greek" },
		{ id: 28, code: "GU", name: "Gujarati" },
		{ id: 29, code: "HE", name: "Hebrew" },
		{ id: 30, code: "HI", name: "Hindi" },
		{ id: 31, code: "HU", name: "Hungarian" },
		{ id: 32, code: "IS", name: "Icelandic" },
		{ id: 33, code: "ID", name: "Indonesian" },
		{ id: 34, code: "GA", name: "Irish" },
		{ id: 35, code: "IT", name: "Italian" },
		{ id: 36, code: "JA", name: "Japanese" },
		{ id: 37, code: "JV", name: "Javanese" },
		{ id: 38, code: "KN", name: "Kannada" },
		{ id: 39, code: "KK", name: "Kazakh" },
		{ id: 40, code: "KM", name: "Khmer" },
		{ id: 41, code: "KO", name: "Korean" },
		{ id: 42, code: "KY", name: "Kyrgyz" },
		{ id: 43, code: "LO", name: "Lao" },
		{ id: 44, code: "LV", name: "Latvian" },
		{ id: 45, code: "LT", name: "Lithuanian" },
		{ id: 46, code: "MK", name: "Macedonian" },
		{ id: 47, code: "MS", name: "Malay" },
		{ id: 48, code: "ML", name: "Malayalam" },
		{ id: 49, code: "MT", name: "Maltese" },
		{ id: 50, code: "MR", name: "Marathi" },
		{ id: 51, code: "MN", name: "Mongolian" },
		{ id: 52, code: "NE", name: "Nepali" },
		{ id: 53, code: "NO", name: "Norwegian" },
		{ id: 54, code: "PA", name: "Punjabi" },
		{ id: 55, code: "PL", name: "Polish" },
		{ id: 56, code: "PT", name: "Portuguese" },
		{ id: 57, code: "RO", name: "Romanian" },
		{ id: 58, code: "RU", name: "Russian" },
		{ id: 59, code: "SR", name: "Serbian" },
		{ id: 60, code: "SK", name: "Slovak" },
		{ id: 61, code: "SL", name: "Slovenian" },
		{ id: 62, code: "ES", name: "Spanish" },
		{ id: 63, code: "SW", name: "Swahili" },
		{ id: 64, code: "SV", name: "Swedish" },
		{ id: 65, code: "TA", name: "Tamil" },
		{ id: 66, code: "TE", name: "Telugu" },
		{ id: 67, code: "TH", name: "Thai" },
		{ id: 68, code: "UK", name: "Ukrainian" },
		{ id: 69, code: "UR", name: "Urdu" },
		{ id: 70, code: "UZ", name: "Uzbek" },
		{ id: 71, code: "VI", name: "Vietnamese" },
		{ id: 72, code: "CY", name: "Welsh" },
		{ id: 73, code: "XH", name: "Xhosa" },
		{ id: 74, code: "ZU", name: "Zulu" },
	];

	return (
		<form onSubmit={handleUpdate} className="space-y-4">
			{/* Form alanları */}
			<div>
				<label className={labelClass}>Ad Soyad</label>
				<input
					type="text"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
					className={inputClass}
				/>
			</div>

			<div>
				<label className={labelClass}>Email</label>
				<input
					type="email"
					value={userEmail}
					onChange={(e) => setUserEmail(e.target.value)}
					className={inputClass}
				/>
			</div>

			<div>
				<label className={labelClass}>Unvan</label>
				<input
					type="text"
					value={userJobTitle}
					onChange={(e) => setUserJobTitle(e.target.value)}
					className={inputClass}
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className={labelClass}>Zaman Dilimi</label>
					<select
						value={timezone ?? ""}
						onChange={(e) => setTimezone(Number(e.target.value))}
						className={inputClass}
					>
						<option value={-12}>UTC -12:00</option>
						<option value={-11}>UTC -11:00</option>
						<option value={-10}>UTC -10:00</option>
						<option value={-9}>UTC -9:00</option>
						<option value={-8}>UTC -8:00</option>
						<option value={-7}>UTC -7:00</option>
						<option value={-6}>UTC -6:00</option>
						<option value={-5}>UTC -5:00</option>
						<option value={-4}>UTC -4:00</option>
						<option value={-3}>UTC -3:00</option>
						<option value={-2}>UTC -2:00</option>
						<option value={-1}>UTC -1:00</option>
						<option value={0}>UTC ±0:00</option>
						<option value={1}>UTC +1:00</option>
						<option value={2}>UTC +2:00</option>
						<option value={3}>UTC +3:00</option>
						<option value={4}>UTC +4:00</option>
						<option value={5}>UTC +5:00</option>
						<option value={6}>UTC +6:00</option>
						<option value={7}>UTC +7:00</option>
						<option value={8}>UTC +8:00</option>
						<option value={9}>UTC +9:00</option>
						<option value={10}>UTC +10:00</option>
						<option value={11}>UTC +11:00</option>
						<option value={12}>UTC +12:00</option>
					</select>
				</div>

				<div>
					<label className={labelClass}>Saat Formatı</label>
					<select
						value={timeFormat ?? ""}
						onChange={(e) => setTimeFormat(Number(e.target.value))}
						className={inputClass}
					>
						<option value={1}>24 Saat</option>
						<option value={0}>12 Saat</option>
					</select>
				</div>

				<div>
					<label className={labelClass}>Tarih Formatı</label>
					<select
						value={dateFormat ?? ""}
						onChange={(e) => setDateFormat(Number(e.target.value))}
						className={inputClass}
					>
						<option value={0}>GG/AA/YYYY</option>
						<option value={1}>AA/GG/YYYY</option>
					</select>
				</div>

				<div>
					<label className={labelClass}>Dil</label>
					<select
						value={language ?? ""}
						onChange={(e) => setLanguage(Number(e.target.value))}
						className={inputClass}
					>
						<option value="">Seçiniz</option>
						{languages.map(({ id, name }) => (
							<option key={id} value={id}>
								{name}
							</option>
						))}
					</select>

				</div>

			</div>


			<div className="flex items-center space-x-2">
				<label className="relative flex items-center cursor-pointer">
					<input
						type="checkbox"
						checked={notificationsEnabled}
						onChange={(e) => setNotificationsEnabled(e.target.checked)}
						className="sr-only"
					/>
					<div className="w-5 h-5 bg-black border border-gray-900 rounded-sm flex items-center justify-center">
						{notificationsEnabled && (
							<svg
								className="w-4 h-4 text-white"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						)}
					</div>
					<span className={labelClass + " ml-2 select-none"}>Bildirimler Açık</span>
				</label>
			</div>


			<div className="flex items-center space-x-2">
				<label className="relative flex items-center cursor-pointer">
					<input
						type="checkbox"
						checked={emailNotifications}
						onChange={(e) => setEmailNotifications(e.target.checked)}
						className="sr-only" // Gizli gerçek checkbox
					/>
					<div className="w-5 h-5 bg-black border border-gray-600 rounded-sm flex items-center justify-center">
						{emailNotifications && (
							<svg
								className="w-4 h-4 text-white"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						)}
					</div>
					<span className={labelClass + " ml-2 select-none"}>Email Bildirimleri Açık</span>
				</label>
			</div>


			<hr className={`my-4 ${isDark ? "border-gray-700" : "border-gray-200"}`} />

			<div className={sectionText}>
				<p>
					<strong>Rol:</strong> {role}
				</p>
				<p>
					<strong>Katılma Tarihi:</strong>{" "}
					{joinedAt ? new Date(joinedAt).toLocaleString() : "Bilinmiyor"}
				</p>
				<p>
					<strong>Aktif:</strong> {isActive ? "Evet" : "Hayır"}
				</p>
			</div>

			<button
				type="submit"
				disabled={loading}
				className={`mt-4 px-4 py-2 rounded transition-colors duration-200 ${loading
					? "opacity-50 cursor-not-allowed"
					: isDark
						? "bg-blue-700 hover:bg-blue-600 text-white"
						: "bg-blue-600 hover:bg-blue-700 text-white"
					}`}
			>
				{loading ? "Güncelleniyor..." : "Güncelle"}
			</button>
		</form>
	);
}
