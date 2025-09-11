"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getCookie } from "@/app/utils/cookies";
import timeGridPlugin from "@fullcalendar/timegrid"; 

interface TimeTrackerData {
	id: string;
	subject: string;
	startedAt: string;
	endedAt: string | null;
	trackedDuration: string;
	description?: string;
	isPaused: boolean;
}

export default function TimeTrackerPage() {
	const [trackers, setTrackers] = useState<TimeTrackerData[]>([]);
	const [activeTracker, setActiveTracker] = useState<TimeTrackerData | null>(null);
	const [subject, setSubject] = useState("");
	const [description, setDescription] = useState("");

	const userId = getCookie("userId");
	const token = getCookie("userToken");
	const workspace = JSON.parse(localStorage.getItem("selectedWorkspace") || "{}");

	const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api";

	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};

	const loadTrackers = async () => {
		if (!userId) return;
		const res = await fetch(`${API_URL}/TimeTracker/user/${userId}`, {
			method: "GET",
			headers,
		});

		if (!res.ok) {
			console.error("Trackerlar çekilemedi.");
			return;
		}

		const data = await res.json();
		setTrackers(data);
		const active = data.find((t: any) => !t.endedAt);
		setActiveTracker(active || null);
	};

	useEffect(() => {
		if (!userId || !workspace.id || !token) return;
		loadTrackers();
	}, []);

	const handleStart = async () => {
		const res = await fetch(
			`${API_URL}/TimeTracker/start?userId=${userId}&workspaceId=${workspace.id}`,
			{
				method: "POST",
				headers,
			}
		);

		if (!res.ok) return alert("Başlatılamadı");

		const tracker = await res.json();
		setActiveTracker(tracker);
		loadTrackers();
	};

	const handlePause = async () => {
		if (!activeTracker) return;
		await fetch(`${API_URL}/TimeTracker/${activeTracker.id}/pause?userId=${userId}`, {
			method: "POST",
			headers,
		});
		loadTrackers();
	};

	const handleResume = async () => {
		if (!activeTracker) return;
		await fetch(`${API_URL}/TimeTracker/${activeTracker.id}/resume?userId=${userId}`, {
			method: "POST",
			headers,
		});
		loadTrackers();
	};

	const handleFinish = async () => {
		if (!activeTracker) return;

		await fetch(`${API_URL}/TimeTracker/${activeTracker.id}/finish?userId=${userId}`, {
			method: "POST",
			headers,
			body: JSON.stringify({ subject, description }),
		});

		setSubject("");
		setDescription("");
		loadTrackers();
	};

	// FullCalendar event formatına çeviriyoruz
	const calendarEvents = trackers
		.filter((t) => t.endedAt) // bitmiş olanları al
		.map((t) => ({
			id: t.id,
			title: t.subject || "Konu Yok",
			start: t.startedAt,
			end: t.endedAt ?? undefined,
			extendedProps: {
				description: t.description,
				duration: t.trackedDuration,
				isPaused: t.isPaused,
			},
		}));

	const handleEventClick = (clickInfo: any) => {
		const event = clickInfo.event;
		alert(
			`Konu: ${event.title}\nBaşlangıç: ${event.start?.toLocaleString()}\nBitiş: ${event.end?.toLocaleString()}\nSüre: ${event.extendedProps.duration}\nAçıklama: ${event.extendedProps.description || "Yok"}`
		);
	};

	return (
		<div className="p-6 rounded shadow-md bg-white dark:bg-gray-800">
			<h2 className="text-xl font-bold mb-4">⏱️ Zaman Takibi</h2>

			{activeTracker ? (
				<div className="mb-4 space-y-2">
					<p className="text-green-500 font-semibold">Aktif zamanlayıcı var</p>

					<div className="space-x-2">
						{activeTracker.isPaused ? (
							<button onClick={handleResume} className="btn btn-success">
								Devam Et
							</button>
						) : (
							<button onClick={handlePause} className="btn btn-warning">
								Duraklat
							</button>
						)}
						<button onClick={handleFinish} className="btn btn-danger">
							Bitir
						</button>
					</div>

					<input
						type="text"
						className="block border p-2 w-full mt-2"
						placeholder="Konu (subject)"
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
					/>
					<input
						type="text"
						className="block border p-2 w-full"
						placeholder="Açıklama"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>
			) : (
				<button onClick={handleStart} className="btn btn-primary mb-4">
					Zaman Takibini Başlat
				</button>
			)}

			<h3 className="text-lg font-semibold mt-6 mb-2">📜 Geçmiş Takipler Takvimde</h3>

			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin]}  // timeGrid plugin eklendi
				initialView="timeGridWeek"                  // saat bazlı haftalık görünüm
				events={calendarEvents}
				eventClick={handleEventClick}
				height="auto"
				slotMinTime="12:00:00"    // Başlangıç saatini 12:00 yapar
				slotMaxTime="23:00:00"    // Bitiş saatini 23:00 yapar
				slotDuration="01:00:00"   // Her slot 1 saat aralığında
				allDaySlot={false}        // Gün içi saat görünümü için all-day kısmı kapalı
			/>

		</div>
	);
}
