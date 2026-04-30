"use client";

import axios from "axios";
import { Eye, EyeOff, Lock, Mail, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { usePostApiUsersLogin } from "@/api/generated/users/users";
import type { AccessTokenResponse } from "@/api/model/accessTokenResponse";
import type { LoginRequest as GeneratedLoginRequest } from "@/api/model/loginRequest";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTheme } from "@/app/contexts/ThemeContext";
import {
	authValidationRules,
	useFormValidation,
} from "@/app/hooks/useFormValidation";
import type { User } from "@/app/types/auth";

interface LoginFormData extends Record<string, unknown> {
	identifier: string;
	password: string;
}

export default function LoginPage() {
	const router = useRouter();
	const { login, isAuthenticated } = useAuth();
	const { theme, toggleTheme } = useTheme();

	const [error, setError] = useState("");
	const [twoFactorRequired, _setTwoFactorRequired] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [twoFactorCode, setTwoFactorCode] = useState<string[]>([
		"",
		"",
		"",
		"",
		"",
		"",
	]);
	const [mounted, setMounted] = useState(false);
	const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Form validation hook
	const { values, errors, isSubmitting, handleChange, handleSubmit } =
		useFormValidation<LoginFormData>(
			{ identifier: "", password: "" },
			authValidationRules.loginRules,
		);

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			router.push("/dashboard");
		}
	}, [isAuthenticated, router]);

	// Handle URL error parameters - devre dışı bırakıldı
	// useEffect(() => {
	//	const urlParams = new URLSearchParams(window.location.search);
	//	const errorParam = urlParams.get('error');
	//	if (errorParam) {
	//		setError(decodeURIComponent(errorParam));
	//		// URL'den error parametresini temizle
	//		window.history.replaceState({}, '', '/auth/login');
	//	}
	// }, []);

	function handleTwoFactorChange(
		e: React.ChangeEvent<HTMLInputElement>,
		idx: number,
	) {
		const val = e.target.value;
		if (!/^\d?$/.test(val)) return;
		const newCode = [...twoFactorCode];
		newCode[idx] = val;
		setTwoFactorCode(newCode);
		if (val && idx < 5) {
			inputRefs.current[idx + 1]?.focus();
		}
	}

	const { mutateAsync: loginMutation } = usePostApiUsersLogin();

	function buildLoginRequest(
		twoFactorCodeOverride?: string,
	): GeneratedLoginRequest {
		return {
			email: values.identifier,
			password: values.password,
			...(twoFactorCodeOverride
				? { twoFactorCode: twoFactorCodeOverride }
				: {}),
		};
	}

	const onLoginSubmit = async () => {
		setError("");
		const loginBody = buildLoginRequest();

		try {
			const result = await loginMutation({ data: loginBody });

			if (result.status === 200 && result.data) {
				const data = result.data as AccessTokenResponse;
				// Login logic with token
				login(
					{ email: values.identifier } as unknown as User,
					data.accessToken,
					rememberMe,
				);
				router.push("/workspaces");
			} else {
				setError("Giriş başarısız.");
			}
		} catch (error: unknown) {
			let errorMessage = "Sunucu hatası.";
			if (axios.isAxiosError(error)) {
				errorMessage = error.response?.data?.message || errorMessage;
			}
			setError(errorMessage);
		}
	};

	async function verifyTwoFactor() {
		setError("");

		const code = twoFactorCode.join("");
		if (code.length !== 6) {
			setError("Lütfen 6 haneli doğrulama kodunu giriniz.");
			return;
		}

		const loginBody = buildLoginRequest(code);

		try {
			const result = await loginMutation({ data: loginBody });

			if (result.status === 200 && result.data) {
				const data = result.data as AccessTokenResponse;
				login(
					{ email: values.identifier } as unknown as User,
					data.accessToken,
					rememberMe,
				);
				router.push("/workspaces");
			} else {
				setError("Doğrulama başarısız.");
			}
		} catch (error: unknown) {
			let errorMessage = "Sunucu hatası.";
			if (axios.isAxiosError(error)) {
				errorMessage = error.response?.data?.message || errorMessage;
			}
			setError(errorMessage);
		}
	}

	const handleGoogleSignIn = async (): Promise<void> => {
		try {
			setError("");
			// .env'den gelen değeri kontrol et, yoksa varsayılanı kullan
			const apiBaseUrl =
				process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7171";
			console.log("Google Auth URL:", `${apiBaseUrl}/api/Auth/google`);
			window.location.href = `${apiBaseUrl}/api/Auth/google`;
		} catch (error: unknown) {
			console.error("Google OAuth hatası:", error);
			setError(
				"Google ile giriş şu anda kullanılamıyor. Lütfen normal giriş yapın.",
			);
		}
	};

	if (!mounted) {
		return null;
	}

	return (
		<main
			className={`min-h-screen flex items-center justify-center p-4 ${
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
				} shadow-lg hover:shadow-xl`}
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
						Zeniva&apos;ya Hoş Geldiniz
					</h1>
					<p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
						Hesabınıza giriş yapın
					</p>
				</div>

				{/* Ana Form Container */}
				<div
					className={`backdrop-blur-sm shadow-xl rounded-3xl p-8 border ${
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

					{!twoFactorRequired && (
						<form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-6">
							{/* Email/Phone Input */}
							<div className="space-y-2">
								<label
									htmlFor="login-identifier"
									className={`text-sm font-medium flex items-center gap-2 ${
										theme === "dark" ? "text-gray-200" : "text-gray-700"
									}`}
								>
									<Mail className="w-4 h-4" />
									E-posta veya Telefon
								</label>
								<div className="relative">
									<input
										id="login-identifier"
										type="text"
										placeholder="ornek@email.com veya +90 555 123 4567"
										value={values.identifier}
										onChange={(e) => {
											handleChange("identifier", e.target.value);
											if (error) setError("");
										}}
										required
										disabled={isSubmitting}
										className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
											theme === "dark"
												? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
												: "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
										}`}
									/>
									{errors.identifier && (
										<p className="text-sm text-red-500 mt-1 flex items-center gap-1">
											<span className="w-4 h-4 text-red-500">⚠</span>
											{errors.identifier}
										</p>
									)}
								</div>
							</div>

							{/* Password Input */}
							<div className="space-y-2">
								<label
									htmlFor="login-password"
									className={`text-sm font-medium flex items-center gap-2 ${
										theme === "dark" ? "text-gray-200" : "text-gray-700"
									}`}
								>
									<Lock className="w-4 h-4" />
									Şifre
								</label>
								<div className="relative">
									<input
										id="login-password"
										type={showPassword ? "text" : "password"}
										placeholder="••••••••"
										value={values.password}
										onChange={(e) => {
											handleChange("password", e.target.value);
											if (error) setError("");
										}}
										required
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

							{/* Remember Me & Forgot Password */}
							<div className="flex items-center justify-between">
								<label
									className={`flex items-center gap-3 text-sm cursor-pointer ${
										theme === "dark" ? "text-gray-300" : "text-gray-600"
									}`}
								>
									<div className="relative">
										<input
											type="checkbox"
											checked={rememberMe}
											onChange={() => setRememberMe(!rememberMe)}
											className="sr-only"
										/>
										<div
											className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
												rememberMe
													? "bg-blue-500 border-blue-500"
													: theme === "dark"
														? "bg-gray-700 border-gray-600 hover:border-blue-400"
														: "bg-white border-gray-300 hover:border-blue-400"
											}`}
										>
											{rememberMe && (
												<svg
													className="w-3 h-3 text-white absolute top-0.5 left-0.5"
													fill="currentColor"
													viewBox="0 0 20 20"
													role="img"
													aria-label="Hatırla seçili"
												>
													<title>Onay İşareti</title>
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clipRule="evenodd"
													/>
												</svg>
											)}
										</div>
									</div>
									Beni hatırla
								</label>
								<a
									href="/auth/forgot-password"
									className="text-sm text-blue-600 hover:text-blue-700 font-medium"
								>
									Şifremi unuttum
								</a>
							</div>

							{/* Login Button */}
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
							>
								{isSubmitting ? (
									<div className="flex items-center justify-center gap-2">
										<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										Giriş yapılıyor...
									</div>
								) : (
									"Giriş Yap"
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

							{/* Google Sign In Button */}
							<button
								type="button"
								onClick={handleGoogleSignIn}
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
									aria-label="Google Logo"
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
								Google ile Giriş Yap
							</button>
						</form>
					)}

					{/* 2FA Section */}
					{twoFactorRequired && (
						<div className="space-y-6">
							<div className="text-center">
								<div
									className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
										theme === "dark" ? "bg-blue-900/50" : "bg-blue-100"
									}`}
								>
									<Lock className="w-6 h-6 text-blue-600" />
								</div>
								<h3
									className={`text-lg font-semibold mb-2 ${
										theme === "dark" ? "text-white" : "text-gray-900"
									}`}
								>
									İki Faktörlü Doğrulama
								</h3>
								<p
									className={`text-sm ${
										theme === "dark" ? "text-gray-300" : "text-gray-600"
									}`}
								>
									Lütfen telefonunuza gönderilen 6 haneli kodu giriniz
								</p>
							</div>

							<div className="flex justify-center gap-3">
								{[0, 1, 2, 3, 4, 5].map((idx) => (
									<input
										key={idx}
										type="text"
										maxLength={1}
										value={twoFactorCode[idx]}
										onChange={(e) => handleTwoFactorChange(e, idx)}
										ref={(el) => {
											inputRefs.current[idx] = el;
										}}
										disabled={isSubmitting}
										className={`w-12 h-12 text-center border-2 rounded-xl text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
											theme === "dark"
												? "bg-gray-700 border-gray-600 text-white"
												: "bg-gray-50 border-gray-200 text-gray-900"
										}`}
										inputMode="numeric"
										pattern="\d*"
									/>
								))}
							</div>

							<button
								type="button"
								onClick={verifyTwoFactor}
								disabled={isSubmitting}
								className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
							>
								{isSubmitting ? (
									<div className="flex items-center justify-center gap-2">
										<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										Doğrulanıyor...
									</div>
								) : (
									"Doğrula"
								)}
							</button>
						</div>
					)}

					{/* Sign Up Link */}
					{!twoFactorRequired && (
						<div className="mt-8 text-center">
							<p
								className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
							>
								Hesabınız yok mu?{" "}
								<a
									href="./register"
									className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
								>
									Kayıt Ol
								</a>
							</p>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
