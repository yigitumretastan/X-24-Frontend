"use client";

import React, { useState, useEffect, useRef } from "react";
import { Users, Bell, Search, Sun, Moon } from "lucide-react";
import ProfilModal from "./components/ProfilModal";
import InviteModal from "./components/InviteModal";
import { getCookie } from "@/app/utils/cookies";
import { useTheme } from "@/app/contexts/ThemeContext";

export default function Header() {
	const [modalOpen, setModalOpen] = useState(false);
	const [isInviteOpen, setIsInviteOpen] = useState(false);
	const [workspaceId, setWorkspaceId] = useState<string | null>(null);
	const { theme, toggleTheme } = useTheme();
	const token = getCookie("userToken");

	// Refler modal toggle butonları için
	const profileButtonRef = useRef<HTMLButtonElement | null>(null);
	const inviteButtonRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
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
		<>
			<style jsx>{`
				.header {
					width: 100%;
					height: 73px;
					background: ${theme === "dark" 
						? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" 
						: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)"};
					backdrop-filter: blur(10px);
					border-bottom: 1px solid ${theme === "dark" ? "rgba(148, 163, 184, 0.1)" : "rgba(148, 163, 184, 0.2)"};
					box-shadow: ${theme === "dark" 
						? "0 4px 20px rgba(0, 0, 0, 0.3)" 
						: "0 4px 20px rgba(0, 0, 0, 0.1)"};
					padding: 0 2rem;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				.logo {
					font-size: 1.75rem;
					font-weight: 800;
					background: linear-gradient(135deg, #667eea, #764ba2);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
					margin: 0;
				}

				.header-center {
					flex: 1;
					max-width: 500px;
					margin: 0 2rem;
				}

				.search-container {
					display: flex;
					align-items: center;
					gap: 0.75rem;
					width: 100%;
				}

				.search-input {
					flex: 1;
					padding: 0.75rem 1rem;
					border: 1px solid ${theme === "dark" ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.3)"};
					border-radius: 12px;
					background: ${theme === "dark" ? "rgba(30, 41, 59, 0.5)" : "rgba(248, 250, 252, 0.8)"};
					color: ${theme === "dark" ? "#ffffff" : "#000000"};
					font-size: 0.875rem;
					transition: all 0.2s ease;
					backdrop-filter: blur(10px);
					height: 44px;
					line-height: 1;
				}

				.search-input:focus {
					outline: none;
					border-color: #667eea;
					box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
				}

				.search-input::placeholder {
					color: ${theme === "dark" ? "#94a3b8" : "#64748b"};
				}

				.search-icon {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 44px;
					height: 44px;
					border-radius: 12px;
					background: ${theme === "dark" ? "rgba(30, 41, 59, 0.5)" : "rgba(248, 250, 252, 0.8)"};
					border: 1px solid ${theme === "dark" ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.3)"};
					color: ${theme === "dark" ? "#94a3b8" : "#64748b"};
					cursor: pointer;
					transition: all 0.2s ease;
					backdrop-filter: blur(10px);
				}

				.search-icon:hover {
					background: ${theme === "dark" ? "rgba(30, 41, 59, 0.8)" : "rgba(248, 250, 252, 1)"};
					border-color: #667eea;
				}

				.header-actions {
					display: flex;
					align-items: center;
					gap: 1rem;
				}

				.action-button {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 44px;
					height: 44px;
					border: none;
					border-radius: 12px;
					background: ${theme === "dark" 
						? "rgba(30, 41, 59, 0.5)" 
						: "rgba(248, 250, 252, 0.8)"};
					color: ${theme === "dark" ? "#ffffff" : "#000000"};
					cursor: pointer;
					transition: all 0.2s ease;
					backdrop-filter: blur(10px);
					border: 1px solid ${theme === "dark" ? "rgba(148, 163, 184, 0.1)" : "rgba(148, 163, 184, 0.2)"};
				}

				.action-button:hover {
					background: linear-gradient(135deg, #667eea, #764ba2);
					color: white;
					transform: scale(1.05);
					box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
				}

				.theme-button:hover {
					background: ${theme === "dark" 
						? "linear-gradient(135deg, #fbbf24, #f59e0b)" 
						: "linear-gradient(135deg, #4f46e5, #7c3aed)"} !important;
					color: white !important;
					transform: scale(1.05);
					box-shadow: ${theme === "dark" 
						? "0 4px 12px rgba(251, 191, 36, 0.3)" 
						: "0 4px 12px rgba(79, 70, 229, 0.3)"};
				}

				.invite-button {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					padding: 0.75rem 1.25rem;
					border: none;
					border-radius: 12px;
					background: linear-gradient(135deg, #667eea, #764ba2);
					color: white;
					font-size: 0.875rem;
					font-weight: 600;
					cursor: pointer;
					transition: all 0.2s ease;
					box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
				}

				.invite-button:hover {
					transform: translateY(-2px);
					box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
				}

				.profile-button {
					display: flex;
					align-items: center;
					gap: 0.75rem;
					padding: 0.5rem;
					border: none;
					border-radius: 12px;
					background: ${theme === "dark" 
						? "rgba(30, 41, 59, 0.5)" 
						: "rgba(248, 250, 252, 0.8)"};
					cursor: pointer;
					transition: all 0.2s ease;
					backdrop-filter: blur(10px);
					border: 1px solid ${theme === "dark" ? "rgba(148, 163, 184, 0.1)" : "rgba(148, 163, 184, 0.2)"};
				}

				.profile-button:hover {
					background: ${theme === "dark" 
						? "rgba(30, 41, 59, 0.8)" 
						: "rgba(248, 250, 252, 1)"};
					transform: scale(1.02);
				}

				.profile-avatar {
					width: 36px;
					height: 36px;
					border-radius: 10px;
					background: linear-gradient(135deg, #667eea, #764ba2);
					display: flex;
					align-items: center;
					justify-content: center;
					color: white;
					font-weight: 600;
					font-size: 0.875rem;
				}

				.profile-info {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
				}

				.profile-name {
					font-size: 0.875rem;
					font-weight: 600;
					color: ${theme === "dark" ? "#ffffff" : "#000000"};
					margin: 0;
				}

				.profile-role {
					font-size: 0.75rem;
					color: ${theme === "dark" ? "#94a3b8" : "#64748b"};
					margin: 0;
				}

				@media (max-width: 768px) {
					.header-center {
						display: none;
					}
					.header {
						padding: 0 1rem;
					}
				}
			`}</style>

			<header className="header">
				<h1 className="logo">X‑24</h1>

				{/* Arama Çubuğu */}
				<div className="header-center">
					<div className="search-container">
						<Search className="search-icon" size={18} />
						<input 
							type="text" 
							placeholder="Projeler, görevler, kişiler ara..."
							className="search-input"
						/>
					</div>
				</div>

				<div className="header-actions">
					{/* Tema Değiştirme Butonu */}
					<button 
						onClick={toggleTheme}
						className="action-button theme-button"
						title={theme === 'light' ? 'Koyu temaya geç' : 'Açık temaya geç'}
					>
						{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
					</button>

					{/* Bildirimler */}
					<button className="action-button">
						<Bell size={18} />
					</button>

					{/* Davet Et Butonu */}
					<button
						ref={inviteButtonRef}
						onClick={toggleInviteModal}
						className="invite-button"
					>
						<Users size={18} />
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

					{/* Profil Butonu */}
					<button
						ref={profileButtonRef}
						onClick={toggleProfileModal}
						className="profile-button"
					>
						<div className="profile-avatar">
							<span>KA</span>
						</div>
						<div className="profile-info">
							<p className="profile-name">Kullanıcı Adı</p>
							<p className="profile-role">Admin</p>
						</div>
					</button>

					{modalOpen && (
						<ProfilModal onClose={closeProfileModal} triggerRef={profileButtonRef} />
					)}
				</div>
			</header>
		</>
	);
}
