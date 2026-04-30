"use client";
import axios from "axios";
import {
	Eye,
	EyeOff,
	Lock,
	Mail,
	Moon,
	Phone,
	Sun,
	User as UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePostApiUsersRegister } from "@/api/generated/users/users";
import type { RegisterRequest as GeneratedRegisterRequest } from "@/api/model/registerRequest";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTheme } from "@/app/contexts/ThemeContext";
import {
	authValidationRules,
	useFormValidation,
} from "@/app/hooks/useFormValidation";

interface RegisterFormData extends Record<string, unknown> {
	name: string;
	lastName: string;
	email: string;
	phone: string;
	password: string;
	confirmPassword: string;
}

export default function RegisterPage() {
	const router = useRouter();
	const { isAuthenticated } = useAuth();
	const { theme, toggleTheme } = useTheme();
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [countdown, setCountdown] = useState(5);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const { mutateAsync: registerMutation } = usePostApiUsersRegister();

	// Form validation hook
	const {
		values,
		errors,
		isSubmitting,
		handleChange,
		handleSubmit,
		setFieldError,
	} = useFormValidation<RegisterFormData>(
		{
			name: "",
			lastName: "",
			email: "",
			phone: "",
			password: "",
			confirmPassword: "",
		},
		authValidationRules.registerRules,
	);

	// Redirect if already authenticated
	/* useEffect(() => {
		if (isAuthenticated) {
			router.push("/workspaces");
		}
	}, [isAuthenticated, router]); */

	// Handle input change with validation
	const handleInputChange = (name: keyof RegisterFormData, value: string) => {
		handleChange(name, value);
		if (error) setError("");
	};

	// Handle form submission
	const onRegisterSubmit = async (formValues: RegisterFormData) => {
		setError("");
		setSuccessMessage("");

		// Check password confirmation
		if (formValues.password !== formValues.confirmPassword) {
			setFieldError("confirmPassword", "Şifreler eşleşmiyor.");
			return;
		}

		const registerBody: GeneratedRegisterRequest = {
			email: formValues.email,
			password: formValues.password,
		};

		try {
			const result = await registerMutation({ data: registerBody });

			// result objesinin status değerini kontrol et
			const status = (result as any).status || 200; 
			const isSuccess = status === 200 || status === 201;

			if (isSuccess) {
				setSuccessMessage(
					"Kayıt başarılı! Lütfen e-posta adresinize gönderilen doğrulama bağlantısını onaylayın.",
				);

				// Geri sayım başlat
				let count = 5;
				const timer = setInterval(() => {
					count -= 1;
					setCountdown(count);
					if (count <= 0) {
						clearInterval(timer);
						router.push("/auth/login");
					}
				}, 1000);
			} else {
				setError("Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.");
			}
		} catch (error: unknown) {
			let errorMessage = "Sunucu hatası.";
			if (axios.isAxiosError(error)) {
				const responseData = error.response?.data;
				if (responseData?.errors) {
					// Backend'den gelen spesifik hataları (DuplicateUserName vb.) birleştir
					const errorMessages = Object.values(responseData.errors).flat();
					errorMessage = errorMessages.join(" ");

					// Özel çeviriler (opsiyonel)
					if (errorMessage.includes("already taken")) {
						errorMessage = "Bu e-posta adresi zaten kullanımda.";
					}
				} else {
					errorMessage = responseData?.message || error.message || errorMessage;
				}
			}
			setError(errorMessage);
		}
	};

	const handleGoogleRegister = async (): Promise<void> => {
		try {
			setError("");
			const apiBaseUrl =
				process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7171";
			window.location.href = `${apiBaseUrl}/api/Auth/google`;
		} catch (error: unknown) {
			console.error("Google OAuth hatası:", error);
			setError(
				"Google ile kayıt şu anda kullanılamıyor. Lütfen normal kayıt yapın.",
			);
		}
	};

	if (!mounted) {
		return null;
	}

	return (
		<main
			className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
				theme === "dark"
					? "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"
					: "bg-gradient-to-br from-blue-50 via-white to-purple-50"
			}`}
		>
			{/* Tema Değiştirme Butonu */}
			<button
				type="button"
				onClick={toggleTheme}
				className={`fixed top-4 right-4 p-3 rounded-xl transition-all duration-200 ${
					theme === "dark"
						? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
						: "bg-white text-gray-600 hover:bg-gray-50"
				} shadow-lg hover:shadow-xl z-50`}
				title={theme === "light" ? "Koyu temaya geç" : "Açık temaya geç"}
			>
				{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
			</button>

			{/* Ana Container */}
			<div className="w-full max-w-md">
				{/* Logo ve Başlık */}
				<div className="text-center mb-8">
					<div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
						<span className="text-2xl font-bold text-white">Z</span>
					</div>
					<h1
						className={`text-3xl font-bold mb-2 ${
							theme === "dark" ? "text-white" : "text-gray-900"
						}`}
					>
						Zeniva&apos;ya Katılın
					</h1>
					<p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
						Yeni hesap oluşturun
					</p>
				</div>

				{/* Ana Form Container */}
				<div
					className={`backdrop-blur-sm shadow-xl rounded-3xl p-8 border transition-colors duration-300 ${
						theme === "dark"
							? "bg-gray-800/90 border-gray-700/50"
							: "bg-white/80 border-white/20"
					}`}
				>
					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
							<div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
								<span className="text-white text-xs">!</span>
							</div>
							<span className="text-sm">{error}</span>
						</div>
					)}

					{successMessage && (
						<div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl space-y-2">
							<div className="flex items-center gap-3">
								<div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
									<svg
										className="w-3 h-3 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										role="img"
										aria-label="Başarılı"
									>
										<title>Başarılı</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={3}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>
								<span className="text-sm font-medium">{successMessage}</span>
							</div>
							<p className="text-xs text-emerald-600 pl-8">
								{countdown} saniye içinde giriş sayfasına yönlendiriliyorsunuz...
							</p>
						</div>
					)}

					<form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-6">
						{/* Name & Last Name Row */}
						<div className="grid grid-cols-2 gap-4">
							{/* First Name */}
							<div className="space-y-2">
								<label
									htmlFor="name"
									className={`text-sm font-medium flex items-center gap-2 ${
										theme === "dark" ? "text-gray-200" : "text-gray-700"
									}`}
								>
									<UserIcon className="w-4 h-4" />
									Ad
								</label>
								<div className="relative">
									<input
										id="name"
										type="text"
										name="name"
										placeholder="Adınız"
										value={values.name}
										onChange={(e) => handleInputChange("name", e.target.value)}
										disabled={isSubmitting}
										className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
											theme === "dark"
												? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
												: "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
										}`}
									/>
									{errors.name && (
										<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
											<span className="w-4 h-4 text-red-500">⚠</span>
											{errors.name}
										</p>
									)}
								</div>
							</div>

							{/* Last Name */}
							<div className="space-y-2">
								<label
									htmlFor="lastName"
									className={`text-sm font-medium flex items-center gap-2 ${
										theme === "dark" ? "text-gray-200" : "text-gray-700"
									}`}
								>
									<UserIcon className="w-4 h-4" />
									Soyad
								</label>
								<div className="relative">
									<input
										id="lastName"
										type="text"
										name="lastName"
										placeholder="Soyadınız"
										value={values.lastName}
										onChange={(e) =>
											handleInputChange("lastName", e.target.value)
										}
										disabled={isSubmitting}
										className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
											theme === "dark"
												? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
												: "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
										}`}
									/>
									{errors.lastName && (
										<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
											<span className="w-4 h-4 text-red-500">⚠</span>
											{errors.lastName}
										</p>
									)}
								</div>
							</div>
						</div>

						{/* Email Input */}
						<div className="space-y-2">
							<label
								htmlFor="email"
								className={`text-sm font-medium flex items-center gap-2 ${
									theme === "dark" ? "text-gray-200" : "text-gray-700"
								}`}
							>
								<Mail className="w-4 h-4" />
								E-posta
							</label>
							<div className="relative">
								<input
									id="email"
									type="email"
									name="email"
									placeholder="ornek@email.com"
									value={values.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
									disabled={isSubmitting}
									className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
										theme === "dark"
											? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
											: "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
									}`}
								/>
								{errors.email && (
									<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
										<span className="w-4 h-4 text-red-500">⚠</span>
										{errors.email}
									</p>
								)}
							</div>
						</div>

						{/* Phone Input */}
						<div className="space-y-2">
							<label
								htmlFor="phone"
								className={`text-sm font-medium flex items-center gap-2 ${
									theme === "dark" ? "text-gray-200" : "text-gray-700"
								}`}
							>
								<Phone className="w-4 h-4" />
								Telefon
							</label>
							<div className="relative">
								<input
									id="phone"
									type="tel"
									name="phone"
									placeholder="+90 555 123 4567"
									value={values.phone}
									onChange={(e) => handleInputChange("phone", e.target.value)}
									disabled={isSubmitting}
									className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
										theme === "dark"
											? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
											: "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
									}`}
								/>
								{errors.phone && (
									<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
										<span className="w-4 h-4 text-red-500">⚠</span>
										{errors.phone}
									</p>
								)}
							</div>
						</div>

						{/* Password Input */}
						<div className="space-y-2">
							<label
								htmlFor="password"
								className={`text-sm font-medium flex items-center gap-2 ${
									theme === "dark" ? "text-gray-200" : "text-gray-700"
								}`}
							>
								<Lock className="w-4 h-4" />
								Şifre
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									name="password"
									placeholder="••••••••"
									value={values.password}
									onChange={(e) =>
										handleInputChange("password", e.target.value)
									}
									disabled={isSubmitting}
									className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12 ${
										theme === "dark"
											? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
											: "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
									}`}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
									aria-label="Şifreyi Göster/Gizle"
								>
									{showPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
								{errors.password && (
									<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
										<span className="w-4 h-4 text-red-500">⚠</span>
										{errors.password}
									</p>
								)}
							</div>
						</div>

						{/* Confirm Password Input */}
						<div className="space-y-2">
							<label
								htmlFor="confirmPassword"
								className={`text-sm font-medium flex items-center gap-2 ${
									theme === "dark" ? "text-gray-200" : "text-gray-700"
								}`}
							>
								<Lock className="w-4 h-4" />
								Şifre Tekrar
							</label>
							<div className="relative">
								<input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									name="confirmPassword"
									placeholder="••••••••"
									value={values.confirmPassword}
									onChange={(e) =>
										handleInputChange("confirmPassword", e.target.value)
									}
									disabled={isSubmitting}
									className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12 ${
										theme === "dark"
											? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
											: "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
									}`}
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
									aria-label="Şifreyi Göster/Gizle"
								>
									{showConfirmPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
								{errors.confirmPassword && (
									<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
										<span className="w-4 h-4 text-red-500">⚠</span>
										{errors.confirmPassword}
									</p>
								)}
							</div>
						</div>

						{/* Register Button */}
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
						>
							{isSubmitting ? (
								<div className="flex items-center justify-center gap-2">
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									Kayıt olunuyor...
								</div>
							) : (
								"Kayıt Ol"
							)}
						</button>

						{/* Divider */}
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div
									className={`w-full border-t ${
										theme === "dark" ? "border-gray-600" : "border-gray-200"
									}`}
								></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span
									className={`px-4 ${
										theme === "dark"
											? "bg-gray-800 text-gray-400"
											: "bg-white text-gray-500"
									}`}
								>
									veya
								</span>
							</div>
						</div>

						{/* Google Register Button */}
						<button
							type="button"
							onClick={handleGoogleRegister}
							disabled={isSubmitting}
							className={`w-full border py-3 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center gap-3 ${
								theme === "dark"
									? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
									: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
							}`}
						>
							<svg
								className="w-5 h-5"
								viewBox="0 0 24 24"
								role="img"
								aria-label="Google logo"
							>
								<title>Google</title>
								<path
									fill="#4285F4"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="#34A853"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="#FBBC05"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="#EA4335"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Google ile Kayıt Ol
						</button>
					</form>

					{/* Login Link */}
					<div className="mt-8 text-center">
						<p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
							Zaten hesabınız var mı?{" "}
							<a
								href="/auth/login"
								className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
							>
								Giriş Yap
							</a>
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
