"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, Bell, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
		<header className="h-[73px] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 flex items-center justify-between sticky top-0 z-40">
			<div className="flex items-center gap-8">
				<h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
					X-24
				</h1>

				{/* Arama Çubuğu */}
				<div className="hidden md:flex relative max-w-md w-80 lg:w-96">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input 
						type="text" 
						placeholder="Ara..."
						className="pl-10 bg-muted/50 border-none focus-visible:ring-1"
					/>
				</div>
			</div>

			<div className="flex items-center gap-3">
				{/* Tema Değiştirme Butonu */}
				<Button 
					variant="ghost"
					size="icon"
					onClick={toggleTheme}
					title={theme === 'light' ? 'Koyu temaya geç' : 'Açık temaya geç'}
				>
					{theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
				</Button>

				{/* Bildirimler */}
				<div className="relative">
					<Button variant="ghost" size="icon">
						<Bell className="h-5 w-5" />
					</Button>
					<Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
						3
					</Badge>
				</div>

				<div className="h-8 w-px bg-border mx-1" />

				{/* Davet Et Butonu */}
				<Button
					ref={inviteButtonRef}
					onClick={toggleInviteModal}
					size="sm"
					className="hidden sm:flex"
				>
					<Users className="mr-2 h-4 w-4" />
					Davet Et
				</Button>

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
				<Button
					ref={profileButtonRef}
					variant="ghost"
					onClick={toggleProfileModal}
					className="flex items-center gap-3 px-2 hover:bg-muted"
				>
					<Avatar className="h-9 w-9 border">
						<AvatarImage src="" />
						<AvatarFallback className="bg-primary text-primary-foreground font-semibold">KA</AvatarFallback>
					</Avatar>
					<div className="hidden lg:flex flex-col items-start text-sm leading-none">
						<span className="font-semibold">Kullanıcı Adı</span>
						<span className="text-muted-foreground text-xs mt-1">Admin</span>
					</div>
				</Button>

				{modalOpen && (
					<ProfilModal onClose={closeProfileModal} triggerRef={profileButtonRef} />
				)}
			</div>
		</header>
	);
}
