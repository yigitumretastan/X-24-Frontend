"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getCookie, setCookie } from "@/app/utils/cookies";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7171";

interface LoginRequest {
	email: string;
	phone: string;
	password: string;
	twoFactorCode?: string;
}

interface LoginResponse {
	token?: string;
	message?: string;
	twoFactorRequired?: boolean;
	name?: string;
	lastName?: string;
	email?: string;
	phone?: string | null;
}

export default function LoginPage() {
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [twoFactorRequired, setTwoFactorRequired] = useState(false);

	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	const [twoFactorCode, setTwoFactorCode] = useState<string[]>(["", "", "", "", "", ""]);
	const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

	useEffect(() => {
		const token = getCookie("userToken");
		if (token) {
			router.push("/dashboard");
		}
	}, [router]);

	function handleTwoFactorChange(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
		const val = e.target.value;
		if (!/^\d?$/.test(val)) return;
		const newCode = [...twoFactorCode];
		newCode[idx] = val;
		setTwoFactorCode(newCode);
		if (val && idx < 5) {
			inputRefs.current[idx + 1]?.focus();
		}
	}

	function buildLoginRequest(twoFactorCodeOverride?: string): LoginRequest {
		const isEmail = identifier.includes("@");
		return {
			email: isEmail ? identifier : "",
			phone: isEmail ? "" : identifier,
			password,
			...(twoFactorCodeOverride ? { twoFactorCode: twoFactorCodeOverride } : {}),
		};
	}

	async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError("");

		const loginBody = buildLoginRequest();

		try {
			const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(loginBody),
				credentials: "include",
			});

			const data: LoginResponse = await response.json();

			if (response.ok) {
				if (data.twoFactorRequired) {
					setTwoFactorRequired(true);
				} else if (data.token) {
					setCookie("userToken", data.token, rememberMe ? 7 : undefined);
					router.push("/dashboard");
				} else {
					setError(data.message || "Giriş başarısız.");
				}
			} else {
				setError(data.message || "Giriş başarısız.");
			}
		} catch {
			setError("Sunucu hatası.");
		} finally {
			setLoading(false);
		}
	}

	async function verifyTwoFactor() {
		setLoading(true);
		setError("");

		const code = twoFactorCode.join("");
		if (code.length !== 6) {
			setError("Lütfen 6 haneli doğrulama kodunu giriniz.");
			setLoading(false);
			return;
		}

		const loginBody = buildLoginRequest(code);

		try {
			const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(loginBody),
			});

			const data: LoginResponse = await response.json();

			if (response.ok && data.token) {
				setCookie("userToken", data.token, rememberMe ? 7 : undefined);
				router.push("/dashboard");
			} else {
				setError(data.message || "Doğrulama başarısız.");
			}
		} catch {
			setError("Sunucu hatası.");
		} finally {
			setLoading(false);
		}
	}


	function handleGoogleSignIn(): void {
		alert("Google sign-in clicked (implement OAuth flow)");
	}

	return (
		<main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
			<div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 text-center">
				<h1 className="text-3xl font-extrabold text-gray-900 mb-4">Login</h1>

				{error && (
					<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						{error}
					</div>
				)}

				{!twoFactorRequired && (
					<form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
						<input
							type="text"
							placeholder="E-posta veya Telefon"
							value={identifier}
							onChange={(e) => {
								setIdentifier(e.target.value);
								if (error) setError("");
							}}
							required
							disabled={loading}
							className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
						/>

						{/* Şifre alanı + göz */}
						{/* Şifre alanı + animasyonlu göz */}
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Şifre"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
									if (error) setError("");
								}}
								required
								disabled={loading}
								className="w-full border border-gray-300 rounded-md p-3 pr-10 placeholder-black text-black"
							/>

							{/* 👁️ Animasyonlu göz butonu */}
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform duration-300 ${showPassword ? "rotate-180" : "rotate-0"
									}`}
								aria-label="Şifreyi Göster/Gizle"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-gray-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									{showPassword ? (
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
										/>
									) : (
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.038 10.038 0 013.102-4.478M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1l11.8 11.8"
										/>
									)}
								</svg>
							</button>
						</div>


						{/* ✅ Beni hatırla checkbox */}
						<label className="flex items-center gap-2 text-sm text-gray-700">
							<input
								type="checkbox"
								checked={rememberMe}
								onChange={() => setRememberMe(!rememberMe)}
							/>
							Beni hatırla
						</label>

						<button
							type="submit"
							disabled={loading}
							className="bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
						>
							{loading ? "Giriş yapılıyor..." : "Giriş Yap"}
						</button>
					</form>
				)}

				{twoFactorRequired && (
					<div>
						<p className="mb-4 font-semibold">Lütfen 2 faktörlü doğrulama kodunu giriniz:</p>
						<div className="flex justify-center gap-2">
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
									disabled={loading}
									className="w-10 h-10 text-center border border-gray-300 rounded-md text-xl"
									inputMode="numeric"
									pattern="\d*"
								/>
							))}
						</div>
						<button
							onClick={verifyTwoFactor}
							disabled={loading}
							className="mt-4 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
						>
							{loading ? "Doğrulanıyor..." : "Doğrula"}
						</button>
					</div>
				)}

				<button
					onClick={handleGoogleSignIn}
					disabled={loading}
					className="mt-6 w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition"
				>
					Google ile Giriş Yap
				</button>

				{!twoFactorRequired && (
					<p className="mt-4 text-gray-600">
						Hesabınız yok mu?{" "}
						<a href="./register" className="text-indigo-600 hover:text-indigo-800 font-semibold">
							Kayıt Ol
						</a>
					</p>
				)}
			</div>
		</main>
	);
}
