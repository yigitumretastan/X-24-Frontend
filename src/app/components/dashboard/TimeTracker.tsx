"use client";

import type { EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Activity, Calendar, Clock, Pause, Play, Square } from "lucide-react";
import { useState } from "react";
import {
	useGetTimeTrackers,
	usePostApiTimeTrackersSaveorupdate,
} from "@/api/generated/time-trackers/time-trackers";
import type { TimeTrackerDto } from "@/api/model/timeTrackerDto";
import { getCookie } from "@/app/utils/cookies";

export default function TimeTrackerPage() {
	const [subject, setSubject] = useState("");
	const [description, setDescription] = useState("");

	const userId = getCookie("userId");
	const workspace = JSON.parse(
		localStorage.getItem("selectedWorkspace") || "{}",
	);

	const { data: trackersResponse, refetch: loadTrackers } = useGetTimeTrackers(
		userId ? { UserId: userId } : undefined,
		{ query: { enabled: !!userId } },
	);

	const { mutateAsync: saveTracker } = usePostApiTimeTrackersSaveorupdate();

	const trackers = (trackersResponse?.data || []) as TimeTrackerDto[];
	const activeTracker = trackers.find((t) => !t.endedAt) || null;

	const handleStart = async () => {
		if (!userId || !workspace.id) return;
		try {
			await saveTracker({
				data: {
					userId: userId,
					workspaceId: workspace.id.toString(),
					startedAt: new Date().toISOString(),
					isPaused: false,
				},
			});
			loadTrackers();
		} catch (error) {
			console.error("Başlatılamadı", error);
		}
	};

	const handlePause = async () => {
		if (!activeTracker) return;
		try {
			await saveTracker({
				data: { ...activeTracker, isPaused: true },
			});
			loadTrackers();
		} catch (error) {
			console.error("Duraklatılamadı", error);
		}
	};

	const handleResume = async () => {
		if (!activeTracker) return;
		try {
			await saveTracker({
				data: { ...activeTracker, isPaused: false },
			});
			loadTrackers();
		} catch (error) {
			console.error("Devam ettirilemedi", error);
		}
	};

	const handleFinish = async () => {
		if (!activeTracker) return;
		try {
			await saveTracker({
				data: {
					...activeTracker,
					endedAt: new Date().toISOString(),
					subject,
					description,
				},
			});
			setSubject("");
			setDescription("");
			loadTrackers();
		} catch (error) {
			console.error("Bitirilemedi", error);
		}
	};

	const calendarEvents = trackers
		.filter((t) => t.endedAt)
		.map((t) => ({
			id: t.id?.toString(),
			title: t.subject || "Konu Yok",
			start: t.startedAt,
			end: t.endedAt ?? undefined,
			extendedProps: {
				description: t.description,
				duration: t.trackedDuration,
				isPaused: t.isPaused,
			},
		}));

	const handleEventClick = (clickInfo: EventClickArg) => {
		const event = clickInfo.event;
		alert(
			`Konu: ${event.title}\nBaşlangıç: ${event.start?.toLocaleString()}\nBitiş: ${event.end?.toLocaleString()}\nSüre: ${event.extendedProps.duration}\nAçıklama: ${event.extendedProps.description || "Yok"}`,
		);
	};

	return (
		<>
			<style jsx>{`
				.time-tracker-container {
					background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
					border-radius: 20px;
					padding: 2rem;
					box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
					border: 1px solid rgba(148, 163, 184, 0.2);
					backdrop-filter: blur(10px);
				}
				.tracker-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; }
				.tracker-title { font-size: 1.75rem; font-weight: 700; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
				.tracker-icon { width: 32px; height: 32px; color: #667eea; }
				.active-tracker-card { background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 166px; padding: 1.5rem; margin-bottom: 2rem; color: white; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3); }
				.tracker-status { display: flex; align-items: center; gap: 0.5rem; font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; }
				.status-icon { width: 20px; height: 20px; }
				.tracker-controls { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
				.control-button { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; border: none; border-radius: 12px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; backdrop-filter: blur(10px); }
				.btn-resume { background: rgba(255, 255, 255, 0.2); color: white; border: 1px solid rgba(255, 255, 255, 0.3); }
				.btn-resume:hover { background: rgba(255, 255, 255, 0.3); transform: translateY(-2px); }
				.btn-pause { background: rgba(251, 191, 36, 0.9); color: white; }
				.btn-pause:hover { background: rgba(251, 191, 36, 1); transform: translateY(-2px); }
				.btn-stop { background: rgba(239, 68, 68, 0.9); color: white; }
				.btn-stop:hover { background: rgba(239, 68, 68, 1); transform: translateY(-2px); }
				.btn-start { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 1rem 2rem; border: none; border-radius: 16px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3); }
				.btn-start:hover { transform: translateY(-3px); box-shadow: 0 12px 25px rgba(102, 126, 234, 0.4); }
				.input-group { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }
				.form-input { padding: 0.875rem 1rem; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 12px; background: rgba(255, 255, 255, 0.1); color: white; font-size: 0.875rem; backdrop-filter: blur(10px); transition: all 0.2s ease; }
				.form-input::placeholder { color: rgba(255, 255, 255, 0.7); }
				.form-input:focus { outline: none; border-color: rgba(255, 255, 255, 0.5); background: rgba(255, 255, 255, 0.15); }
				.calendar-section { margin-top: 2rem; }
				.calendar-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
				.calendar-title { font-size: 1.25rem; font-weight: 700; color: #1f2937; }
				.calendar-icon { width: 24px; height: 24px; color: #667eea; }
				.calendar-container { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); border: 1px solid rgba(148, 163, 184, 0.1); }
				@media (max-width: 768px) { .input-group { grid-template-columns: 1fr; } .tracker-controls { flex-direction: column; } .control-button { justify-content: center; } }
			`}</style>

			<div className="time-tracker-container">
				<div className="tracker-header">
					<Clock className="tracker-icon" />
					<h2 className="tracker-title">Zaman Takibi</h2>
				</div>

				{activeTracker ? (
					<div className="active-tracker-card">
						<div className="tracker-status">
							<Activity className="status-icon" />
							{activeTracker.isPaused ? "Duraklatıldı" : "Aktif Zamanlayıcı"}
						</div>

						<div className="tracker-controls">
							{activeTracker.isPaused ? (
								<button
									type="button"
									onClick={handleResume}
									className="control-button btn-resume"
								>
									<Play size={16} />
									Devam Et
								</button>
							) : (
								<button
									type="button"
									onClick={handlePause}
									className="control-button btn-pause"
								>
									<Pause size={16} />
									Duraklat
								</button>
							)}
							<button
								type="button"
								onClick={handleFinish}
								className="control-button btn-stop"
							>
								<Square size={16} />
								Bitir
							</button>
						</div>

						<div className="input-group">
							<input
								type="text"
								className="form-input"
								placeholder="Konu (subject)"
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
							/>
							<input
								type="text"
								className="form-input"
								placeholder="Açıklama"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
					</div>
				) : (
					<button type="button" onClick={handleStart} className="btn-start">
						<Play size={20} />
						Zaman Takibini Başlat
					</button>
				)}

				<div className="calendar-section">
					<div className="calendar-header">
						<Calendar className="calendar-icon" />
						<h3 className="calendar-title">Geçmiş Takipler</h3>
					</div>

					<div className="calendar-container">
						<FullCalendar
							plugins={[dayGridPlugin, timeGridPlugin]}
							initialView="timeGridWeek"
							events={calendarEvents}
							eventClick={handleEventClick}
							height="auto"
							slotMinTime="08:00:00"
							slotMaxTime="22:00:00"
							slotDuration="01:00:00"
							allDaySlot={false}
							headerToolbar={{
								left: "prev,next today",
								center: "title",
								right: "dayGridMonth,timeGridWeek,timeGridDay",
							}}
							eventColor="#667eea"
							eventBorderColor="#764ba2"
							eventTextColor="white"
						/>
					</div>
				</div>
			</div>
		</>
	);
}
