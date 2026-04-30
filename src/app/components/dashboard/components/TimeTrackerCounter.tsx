"use client";

import { useEffect, useRef, useState } from "react";
import {
	useGetTimeTrackers,
	usePostApiTimeTrackersSaveorupdate,
} from "@/api/generated/time-trackers/time-trackers";
import type { TimeTrackerDto } from "@/api/model/timeTrackerDto";
import { useTheme } from "@/app/contexts/ThemeContext";
import { getCookie } from "@/app/utils/cookies";

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
			<div
				className={`modal-content backdrop-blur-xl rounded-2xl p-8 w-96 max-w-[90vw] ${
					theme === "dark"
						? "bg-gradient-to-br from-slate-800 to-slate-900 border border-gray-700/30 shadow-2xl"
						: "bg-gradient-to-br from-white to-gray-50 border border-gray-300/40 shadow-xl"
				}`}
			>
				<h2
					className={`text-xl font-bold mb-6 text-center ${
						theme === "dark" ? "text-white" : "text-black"
					}`}
				>
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
						type="button"
						onClick={onClose}
						className="btn-secondary px-6 py-3"
					>
						İptal
					</button>
					<button
						type="button"
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

function parseJwt(token: string | null): string | null {
	if (!token) return null;
	try {
		const payloadBase64 = token.split(".")[1];
		const decodedPayload = atob(payloadBase64);
		const payload = JSON.parse(decodedPayload);
		return (
			payload[
				"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
			] ||
			payload.sub ||
			null
		);
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
	const [tracker, setTracker] = useState<TimeTrackerDto | null>(null);
	const [seconds, setSeconds] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const [showFinishModal, setShowFinishModal] = useState(false);
	const [userIdFromToken, setUserIdFromToken] = useState<string | null>(null);

	const storedWorkspace =
		typeof window !== "undefined"
			? localStorage.getItem("selectedWorkspace")
			: null;
	const workspaceId = storedWorkspace ? JSON.parse(storedWorkspace).id : null;

	const { data: trackersResponse, refetch: refetchTrackers } =
		useGetTimeTrackers(
			userIdFromToken ? { UserId: userIdFromToken } : undefined,
			{ query: { enabled: !!userIdFromToken } },
		);

	const { mutateAsync: saveTracker } = usePostApiTimeTrackersSaveorupdate();

	useEffect(() => {
		const token = getCookie("userToken");
		setUserIdFromToken(parseJwt(token));
	}, []);

	useEffect(() => {
		if (trackersResponse?.data) {
			const active = (trackersResponse.data as TimeTrackerDto[]).find(
				(t) => !t.endedAt,
			);
			if (active) {
				setTracker(active);
				const started = active.startedAt
					? new Date(active.startedAt)
					: new Date();
				const now = new Date();
				setSeconds(Math.floor((now.getTime() - started.getTime()) / 1000));
			} else {
				setTracker(null);
				setSeconds(0);
			}
		}
	}, [trackersResponse]);

	useEffect(() => {
		if (tracker && !tracker.isPaused) {
			intervalRef.current = setInterval(() => {
				setSeconds((prev) => prev + 1);
			}, 1000);
		} else {
			if (intervalRef.current) clearInterval(intervalRef.current);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [tracker]);

	const formatTime = (totalSeconds: number): string => {
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const secs = totalSeconds % 60;
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const startTracker = async () => {
		if (!userIdFromToken || !workspaceId) return;
		try {
			await saveTracker({
				data: {
					userId: userIdFromToken,
					workspaceId: workspaceId.toString(),
					startedAt: new Date().toISOString(),
					isPaused: false,
				},
			});
			refetchTrackers();
		} catch (error) {
			console.error("Zamanlayıcı başlatılamadı:", error);
		}
	};

	const pauseTracker = async () => {
		if (!tracker) return;
		try {
			await saveTracker({
				data: { ...tracker, isPaused: true },
			});
			refetchTrackers();
		} catch (error) {
			console.error("Zamanlayıcı duraklatılamadı:", error);
		}
	};

	const resumeTracker = async () => {
		if (!tracker) return;
		try {
			await saveTracker({
				data: { ...tracker, isPaused: false },
			});
			refetchTrackers();
		} catch (error) {
			console.error("Zamanlayıcı devam ettirilemedi:", error);
		}
	};

	const finishTracker = async (subject: string, description: string) => {
		if (!tracker) return;
		try {
			await saveTracker({
				data: {
					...tracker,
					endedAt: new Date().toISOString(),
					subject,
					description,
				},
			});
			setTracker(null);
			setSeconds(0);
			refetchTrackers();
			if (onComplete) onComplete();
		} catch (error) {
			console.error("Zamanlayıcı bitirilemedi:", error);
		}
	};

	return (
		<div className="w-full flex flex-col items-center gap-2 p-1 relative">
			{tracker ? (
				<div className="flex flex-col items-center gap-2 w-full">
					<div
						className={`rounded-lg p-3 shadow-sm border w-full min-h-[120px] flex items-center justify-center ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
					>
						<div className="text-xs font-bold text-blue-600 font-mono leading-tight transform -rotate-90 whitespace-nowrap">
							{formatTime(seconds)}
						</div>
					</div>
					<div className="flex flex-col gap-1 w-full">
						{!tracker.isPaused ? (
							<button
								type="button"
								onClick={pauseTracker}
								className="w-full h-10 rounded-md font-medium bg-yellow-500 text-white hover:bg-yellow-600 text-xs transition-colors flex items-center justify-center"
							>
								⏸️
							</button>
						) : (
							<button
								type="button"
								onClick={resumeTracker}
								className="w-full h-10 rounded-md font-medium bg-green-500 text-white hover:bg-green-600 text-xs transition-colors flex items-center justify-center"
							>
								▶️
							</button>
						)}
						<button
							type="button"
							onClick={() => setShowFinishModal(true)}
							className="w-full h-10 rounded-md font-medium bg-red-500 text-white hover:bg-red-600 text-xs transition-colors flex items-center justify-center"
						>
							⏹️
						</button>
					</div>
				</div>
			) : (
				<button
					type="button"
					onClick={startTracker}
					className="w-full h-16 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center"
				>
					▶️
				</button>
			)}
			{showFinishModal && (
				<FinishModal
					onClose={() => setShowFinishModal(false)}
					onSubmit={finishTracker}
				/>
			)}
		</div>
	);
}
