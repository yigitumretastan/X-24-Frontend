"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { getCookie } from "@/app/utils/cookies";
import { useTheme } from "@/app/hooks/useTheme";

interface ModalProps {
	onClose: () => void;
	onSubmit: (subject: string, description: string) => void;
}

function FinishModal({ onClose, onSubmit }: ModalProps) {
	const [subject, setSubject] = useState("");
	const [description, setDescription] = useState("");
	const { theme } = useTheme();

	const handleSubmit = () => {
		if (!subject.trim()) {
			alert("Konu zorunludur.");
			return;
		}
		onSubmit(subject, description);
		onClose();
	};

	return (
		<div className="modal-overlay">
			<div className={`modal-content backdrop-blur-xl rounded-2xl p-8 w-96 max-w-[90vw] ${
				theme === 'dark'
					? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-gray-700/30 shadow-2xl'
					: 'bg-gradient-to-br from-white to-gray-50 border border-gray-300/40 shadow-xl'
			}`}>
				<h2 className={`text-xl font-bold mb-6 text-center ${
					theme === 'dark' ? 'text-white' : 'text-black'
				}`}>
					Zamanlayıcıyı Bitir
				</h2>
				<input
					type="text"
					placeholder="Konu"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					className="form-input mb-4"
				/>
				<textarea
					placeholder="Açıklama (opsiyonel)"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="form-input resize-none min-h-[80px] mb-4"
					rows={3}
				/>
				<div className="flex justify-end gap-3 mt-6">
					<button 
						onClick={onClose} 
						className="btn-secondary px-6 py-3"
					>
						İptal
					</button>
					<button 
						onClick={handleSubmit} 
						className="btn-primary px-6 py-3"
					>
						Bitir
					</button>
				</div>
			</div>
		</div>
	);
}

interface TimeTrackerData {
	id: string;
	startedAt: string;
	isPaused: boolean;
	endedAt: string | null;
}

function parseJwt(token: string | null): string | null {
	if (!token) return null;

	try {
		const payloadBase64 = token.split(".")[1];
		const decodedPayload = atob(payloadBase64);
		const payload = JSON.parse(decodedPayload);

		// Token içindeki userId alanı
		const userId =
			payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
			payload["sub"] ||
			null;

		return userId;
	} catch (e) {
		console.error("JWT çözümleme hatası:", e);
		return null;
	}
}

interface TimeTrackerProps {
	onComplete?: () => void;
}

export default function TimeTrackerCounter({ onComplete }: TimeTrackerProps) {
	const { theme } = useTheme();
	const [tracker, setTracker] = useState<TimeTrackerData | null>(null);
	const [seconds, setSeconds] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const [showFinishModal, setShowFinishModal] = useState(false);
	const [userIdFromToken, setUserIdFromToken] = useState<string | null>(null);

	useEffect(() => {
		const token = getCookie("userToken");
		const userId = parseJwt(token);
		setUserIdFromToken(userId);
	}, []);

	const storedWorkspace =
		typeof window !== "undefined" ? localStorage.getItem("selectedWorkspace") : null;
	const workspaceId = storedWorkspace ? JSON.parse(storedWorkspace).id : null;

	const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

	const headers = useMemo(() => ({
		"Content-Type": "application/json",
		Authorization: `Bearer ${getCookie("userToken")}`,
	}), []);

	const fetchActiveTracker = useCallback(async () => {
		if (!userIdFromToken) return;
		console.log("🔄 Aktif zamanlayıcı getiriliyor...");

		const res = await fetch(`${API_BASE}/api/TimeTracker/user/${userIdFromToken}`, {
			method: "GET",
			headers,
		});

		if (!res.ok) {
			console.error("Aktif zamanlayıcı getirme başarısız");
			return;
		}

		const data = await res.json();
		console.log("📦 Tüm zamanlayıcılar:", data);

		const active = data.find((t: { endedAt?: string }) => !t.endedAt);
		if (active) {
			console.log("✅ Aktif zamanlayıcı bulundu:", active);

			setTracker(active);
			const started = new Date(active.startedAt);
			const now = new Date();
			const elapsed = Math.floor((now.getTime() - started.getTime()) / 1000);
			console.log(`⏱️ Geçen süre: ${elapsed} saniye`);
			setSeconds(elapsed);
		} else {
			console.log("ℹ️ Aktif zamanlayıcı yok.");
			setTracker(null);
			setSeconds(0);
		}
	}, [userIdFromToken, API_BASE, headers]);

	useEffect(() => {
		fetchActiveTracker();
	}, [userIdFromToken, fetchActiveTracker]);

	useEffect(() => {
		if (tracker && !tracker.isPaused) {
			console.log("▶️ Sayaç başlatılıyor...");
			intervalRef.current = setInterval(() => {
				setSeconds((prev) => prev + 1);
			}, 1000);
		} else {
			if (intervalRef.current) {
				console.log("⏸️ Sayaç durduruluyor.");
				clearInterval(intervalRef.current);
			}
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [tracker]);

	const formatTime = (totalSeconds: number): string => {
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const secs = totalSeconds % 60;
		return `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const startTracker = async () => {
		if (!userIdFromToken || !workspaceId) {
			console.warn("❌ Zaman takibi başlatılamadı: userId veya workspaceId eksik.", {
				userIdFromToken,
				workspaceId,
			});
			return;
		}

		// Aktif takip var mı kontrol et
		const activeResponse = await fetch(`${API_BASE}/api/TimeTracker/user/${userIdFromToken}`, {
			method: "GET",
			headers,
		});

		if (!activeResponse.ok) {
			console.error("❌ Aktif zamanlayıcı kontrolü başarısız");
			return;
		}

		const activeData = await activeResponse.json();
		const activeTracker = activeData.find((t: any) => !t.endedAt);

		if (activeTracker) {
			console.log("ℹ️ Zaten aktif bir zaman takip mevcut:", activeTracker);
			setTracker(activeTracker);
			const started = new Date(activeTracker.startedAt);
			const now = new Date();
			setSeconds(Math.floor((now.getTime() - started.getTime()) / 1000));
			return; // Yeni zaman takip başlatma, mevcut var
		}

		// Aktif takip yoksa yeni başlat
		console.log("🚀 Zaman takibi başlatılıyor...");
		const res = await fetch(
			`${API_BASE}/api/TimeTracker/start?userId=${userIdFromToken}&workspaceId=${workspaceId}`,
			{
				method: "POST",
				headers,
			}
		);

		if (!res.ok) {
			const errorText = await res.text();
			console.error("❌ API Hatası (start):", errorText);
			return;
		}

		const data = await res.json();
		console.log("✅ Başlatılan zamanlayıcı:", data);
		setTracker(data);
		const started = new Date(data.startedAt);
		const now = new Date();
		const elapsed = Math.floor((now.getTime() - started.getTime()) / 1000);
		console.log(`⏱️ Geçen süre: ${elapsed} saniye`);
		setSeconds(elapsed);
	};

	const pauseTracker = async () => {
		if (!tracker || !userIdFromToken) {
			console.warn("pauseTracker: Eksik bilgi", { tracker, userIdFromToken });
			return;
		}
		console.log("⏸️ Zamanlayıcı duraklatılıyor...");
		await fetch(`${API_BASE}/api/TimeTracker/${tracker.id}/pause?userId=${userIdFromToken}`, {
			method: "POST",
			headers,
		});
		fetchActiveTracker();
	};

	const resumeTracker = async () => {
		if (!tracker || !userIdFromToken) return;

		console.log("▶️ Zamanlayıcı devam ettiriliyor...");

		const res = await fetch(`${API_BASE}/api/TimeTracker/${tracker.id}/resume?userId=${userIdFromToken}`, {
			method: "POST",
			headers,
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error("❌ Resume hatası:", errorText);
			return;
		}

		await fetchActiveTracker();
	};


	const finishTracker = async (subject: string, description: string) => {
		if (!tracker || !userIdFromToken) {
			console.warn("finishTracker: Eksik bilgi", { tracker, userIdFromToken });
			return;
		}

		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		console.log("⏹️ Zamanlayıcı bitiriliyor...", { subject, description });
		await fetch(`${API_BASE}/api/TimeTracker/${tracker.id}/finish?userId=${userIdFromToken}`, {
			method: "POST",
			headers,
			body: JSON.stringify({ subject, description }),
		});

		setTracker(null);
		setSeconds(0);
		
		// Modal açma callback'ini çağır
		if (onComplete) {
			onComplete();
		}
	};

	const handleFinishButtonClick = () => {
		setShowFinishModal(true);
	};

	return (
		<div className="w-full flex flex-col items-center gap-2 p-1 relative">
			{tracker ? (
				<div className="flex flex-col items-center gap-2 w-full">
					<div
						className={`rounded-lg p-3 shadow-sm border w-full min-h-[120px] flex items-center justify-center ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
							}`}
					>
						<div className="text-xs font-bold text-blue-600 font-mono leading-tight transform -rotate-90 whitespace-nowrap">
							{formatTime(seconds)}
						</div>
					</div>
					<div className="flex flex-col gap-1 w-full">
						{!tracker.isPaused ? (
							<button
								onClick={pauseTracker}
								className="w-full h-10 rounded-md font-medium bg-yellow-500 text-white hover:bg-yellow-600 text-xs transition-colors flex items-center justify-center"
							>
								⏸️
							</button>
						) : (
							<button
								onClick={resumeTracker}
								className="w-full h-10 rounded-md font-medium bg-green-500 text-white hover:bg-green-600 text-xs transition-colors flex items-center justify-center"
							>
								▶️
							</button>
						)}
						<button
							onClick={handleFinishButtonClick}
							className="w-full h-10 rounded-md font-medium bg-red-500 text-white hover:bg-red-600 text-xs transition-colors flex items-center justify-center"
						>
							⏹️
						</button>
					</div>
				</div>
			) : (
				<button
					onClick={startTracker}
					className="w-full h-16 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center"
				>
					▶️
				</button>
			)}

			{showFinishModal && (
				<FinishModal
					onClose={() => setShowFinishModal(false)}
					onSubmit={(subject, description) => finishTracker(subject, description)}
				/>
			)}
		</div>
	);
}
