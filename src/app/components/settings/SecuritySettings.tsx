import { useTheme } from "@/app/contexts/ThemeContext";

export default function SecuritySettings() {
	const { theme } = useTheme();

	return (
		<div className="space-y-6">
			<div>
				<h2
					className={`text-xl font-semibold mb-2 ${
						theme === "dark" ? "text-white" : "text-gray-900"
					}`}
				>
					Güvenlik Ayarları
				</h2>
				<p
					className={`text-sm ${
						theme === "dark" ? "text-gray-400" : "text-gray-600"
					}`}
				>
					Hesabınızın güvenliğini artırmak için bu ayarları kullanın
				</p>
			</div>

			<div
				className={`p-6 rounded-xl border ${
					theme === "dark"
						? "bg-gray-900/50 border-gray-700/50"
						: "bg-gray-50/50 border-gray-200/50"
				}`}
			>
				<p
					className={`text-center ${
						theme === "dark" ? "text-gray-400" : "text-gray-600"
					}`}
				>
					Güvenlik ayarları yakında eklenecek...
				</p>
			</div>
		</div>
	);
}
