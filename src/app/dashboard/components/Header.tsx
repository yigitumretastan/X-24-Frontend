"use client";

import React, { useState, useEffect, useRef } from "react";
import ProfilModal from "./components/ProfilModal";
import InviteModal from "./components/InviteModal";
import { getCookie } from "@/app/utils/cookies";

function getThemeFromCookies(): "light" | "dark" {
	if (typeof document === "undefined") return "light";
	const themeCookie = document.cookie
		.split("; ")
		.find((row) => row.startsWith("theme="))
		?.split("=")[1];
	return themeCookie === "dark" ? "dark" : "light";
}

export default function Header() {
	const [modalOpen, setModalOpen] = useState(false);
	const [isInviteOpen, setIsInviteOpen] = useState(false);
	const [workspaceId, setWorkspaceId] = useState<string | null>(null);
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const token = getCookie("userToken");

	// Refler modal toggle butonları için
	const profileButtonRef = useRef<HTMLButtonElement | null>(null);
	const inviteButtonRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		setTheme(getThemeFromCookies());

		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("selectedWorkspace");
			if (stored) {
				try {
					const parsed = JSON.parse(stored);
					setWorkspaceId(parsed.id);
				} catch (e) {
					console.error("localStorage parse hatası:", e);
				}
			}
		}
	}, []);

	const toggleProfileModal = () => setModalOpen((prev) => !prev);
	const closeProfileModal = () => setModalOpen(false);

	const toggleInviteModal = () => setIsInviteOpen((prev) => !prev);
	const closeInviteModal = () => setIsInviteOpen(false);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b shadow-sm ${theme === "dark"
					? "bg-gray-900 text-white border-gray-700"
					: "bg-white text-gray-900 border-gray-200"
				}`}
		>
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">X‑24</h1>

				<div className="flex items-center space-x-4" style={{ paddingRight: '45px' }}>
					<button
						ref={inviteButtonRef}
						onClick={toggleInviteModal}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
					>
						<span>👥</span>
						<span>Davet Et</span>
					</button>

					<InviteModal
						isOpen={isInviteOpen}
						onClose={closeInviteModal}
						triggerRef={inviteButtonRef}
						onInvite={async ({ email, role, invitationMessage }) => {
							if (!workspaceId) return alert("Workspace seçili değil.");

							try {
								const res = await fetch(
									`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/WorkspaceUser/invite`,
									{
										method: "POST",
										headers: {
											"Content-Type": "application/json",
											Authorization: `Bearer ${token}`,
										},
										body: JSON.stringify({
											workspaceId,
											email,
											role,
											invitationMessage,
										}),
									}
								);

								const data = await res.json();
								if (res.ok && data.success) {
									alert(data.message || "Davet başarıyla gönderildi.");
									closeInviteModal();
								} else {
									alert("Hata: " + (data.message || "Bilinmeyen hata."));
								}
							} catch (err) {
								console.error("Davet gönderilirken hata:", err);
								alert("Sunucu hatası.");
							}
						}}
					/>

					<button
						ref={profileButtonRef}
						onClick={toggleProfileModal}
						className="flex items-center space-x-3 relative focus:outline-none"
					>
						<div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
							<span className="text-sm font-medium text-gray-700">KA</span>
						</div>
						<div className="text-left">
							<p className="text-sm font-medium">Kullanıcı Adı</p>
							<p className="text-xs text-gray-500">Admin</p>
						</div>
					</button>

					{modalOpen && (
						<ProfilModal onClose={closeProfileModal} triggerRef={profileButtonRef} />
					)}
				</div>
			</div>
		</header>
	);
}
