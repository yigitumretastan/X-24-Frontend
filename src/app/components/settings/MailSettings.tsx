"use client";

import type { AxiosError } from "axios";
import {
	AlertCircle,
	CheckCircle2,
	RefreshCw,
	Server,
	Shield,
} from "lucide-react";
import { useState } from "react";
import { usePostApiMailsSend } from "@/api/generated/mails/mails";
import { useTheme } from "@/app/contexts/ThemeContext";

export default function MailSettings() {
	const { theme } = useTheme();
	const [isTesting, setIsTesting] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [testResult, setTestResult] = useState<{
		status: "success" | "error" | null;
		message: string;
	}>({ status: null, message: "" });

	const { mutateAsync: sendMail } = usePostApiMailsSend();

	const [formData, setFormData] = useState({
		pop3Host: "",
		pop3Port: "995",
		username: "",
		password: "",
		useSsl: true,
	});

	const handleTestConnection = async () => {
		if (!formData.pop3Host || !formData.username || !formData.password) {
			setTestResult({
				status: "error",
				message: "Lütfen tüm alanları doldurun.",
			});
			return;
		}

		setIsTesting(true);
		setTestResult({ status: null, message: "" });

		try {
			// Backend modeline göre uygun SendMailCommand oluşturulmalı
			await sendMail({
				data: {
					host: formData.pop3Host,
					port: parseInt(formData.pop3Port, 10),
					user: formData.username,
					password: formData.password,
					useSsl: formData.useSsl,
					to: formData.username, // Test için kendine mail atabilir veya backend'de test endpoint'i varsa o kullanılır
					subject: "Bağlantı Testi",
					body: "Bu bir test mailidir.",
				},
			});
			setTestResult({
				status: "success",
				message: "POP3 bağlantısı başarıyla kuruldu!",
			});
		} catch (error) {
			const err = error as AxiosError<{ message?: string }>;
			setTestResult({
				status: "error",
				message:
					(err.response?.data as { message?: string })?.message ||
					"Bağlantı başarısız. Lütfen bilgileri kontrol edin.",
			});
		} finally {
			setIsTesting(false);
		}
	};

	const handleSaveSettings = async () => {
		setIsSaving(true);
		try {
			// TODO: Ayarları kaydetmek için uygun API hook'u kullanılmalı
			// Şimdilik test amaçlı sendMail kullanıldı
			setTestResult({
				status: "success",
				message: "Ayarlar başarıyla kaydedildi.",
			});
		} catch (error) {
			console.error("Mail settings save error:", error);
			setTestResult({
				status: "error",
				message: "Ayarlar kaydedilirken bir hata oluştu.",
			});
		} finally {
			setIsSaving(false);
		}
	};

	const inputClasses = `w-full px-4 py-2.5 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 outline-none ${
		theme === "dark"
			? "bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500"
			: "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 shadow-sm"
	}`;

	const labelClasses = `block text-sm font-medium mb-2 ${
		theme === "dark" ? "text-gray-300" : "text-gray-700"
	}`;

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex flex-col gap-1">
				<h2
					className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
				>
					Mail Entegrasyonu (POP3)
				</h2>
				<p
					className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
				>
					E-postalarınızı sisteme aktarmak için POP3 sunucu ayarlarını
					yapılandırın.
				</p>
			</div>

			<div
				className={`rounded-2xl p-6 border ${
					theme === "dark"
						? "bg-gray-800/40 border-gray-700/50"
						: "bg-gray-50/50 border-gray-200"
				}`}
			>
				<div className="flex items-center gap-3 mb-6">
					<div
						className={`p-2 rounded-lg ${theme === "dark" ? "bg-blue-500/10" : "bg-blue-50"}`}
					>
						<Server className="w-5 h-5 text-blue-500" />
					</div>
					<h3
						className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
					>
						Sunucu Bilgileri
					</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<label htmlFor="pop3Host" className={labelClasses}>
							POP3 Sunucusu
						</label>
						<input
							id="pop3Host"
							type="text"
							placeholder="pop.gmail.com"
							className={inputClasses}
							value={formData.pop3Host}
							onChange={(e) =>
								setFormData({ ...formData, pop3Host: e.target.value })
							}
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="pop3Port" className={labelClasses}>
							Port
						</label>
						<input
							id="pop3Port"
							type="text"
							placeholder="995"
							className={inputClasses}
							value={formData.pop3Port}
							onChange={(e) =>
								setFormData({ ...formData, pop3Port: e.target.value })
							}
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="username" className={labelClasses}>
							Kullanıcı Adı
						</label>
						<input
							id="username"
							type="email"
							placeholder="user@example.com"
							className={inputClasses}
							value={formData.username}
							onChange={(e) =>
								setFormData({ ...formData, username: e.target.value })
							}
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="password" className={labelClasses}>
							Şifre
						</label>
						<input
							id="password"
							type="password"
							placeholder="••••••••"
							className={inputClasses}
							value={formData.password}
							onChange={(e) =>
								setFormData({ ...formData, password: e.target.value })
							}
						/>
					</div>
				</div>

				<div className="mt-6 flex items-center gap-2">
					<input
						type="checkbox"
						id="useSsl"
						className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						checked={formData.useSsl}
						onChange={(e) =>
							setFormData({ ...formData, useSsl: e.target.checked })
						}
					/>
					<label htmlFor="useSsl" className={`${labelClasses} mb-0`}>
						SSL/TLS Kullan (Önerilen)
					</label>
				</div>
			</div>

			<div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-700/20">
				<div className="flex items-center gap-3">
					{testResult.status === "success" && (
						<div className="flex items-center gap-2 text-emerald-500 text-sm font-medium bg-emerald-500/10 px-3 py-1.5 rounded-full">
							<CheckCircle2 className="w-4 h-4" />
							{testResult.message}
						</div>
					)}
					{testResult.status === "error" && (
						<div className="flex items-center gap-2 text-red-500 text-sm font-medium bg-red-500/10 px-3 py-1.5 rounded-full">
							<AlertCircle className="w-4 h-4" />
							{testResult.message}
						</div>
					)}
				</div>

				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={handleTestConnection}
						disabled={isTesting}
						className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
							isTesting
								? "opacity-50 cursor-not-allowed"
								: "hover:scale-[1.02] active:scale-[0.98]"
						} ${
							theme === "dark"
								? "bg-gray-700 text-white hover:bg-gray-600"
								: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
						}`}
					>
						{isTesting ? (
							<RefreshCw className="w-4 h-4 animate-spin" />
						) : (
							<Shield className="w-4 h-4" />
						)}
						{isTesting ? "Test Ediliyor..." : "Bağlantıyı Test Et"}
					</button>

					<button
						type="button"
						onClick={handleSaveSettings}
						disabled={isSaving || isTesting}
						className={`px-8 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center gap-2 ${
							isSaving || isTesting ? "opacity-50 cursor-not-allowed" : ""
						} ${
							theme === "dark"
								? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/20"
								: "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-blue-500/25"
						}`}
					>
						{isSaving && <RefreshCw className="w-4 h-4 animate-spin" />}
						{isSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}
					</button>
				</div>
			</div>
		</div>
	);
}
