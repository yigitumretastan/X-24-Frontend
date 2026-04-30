"use client";

import {
	Bell,
	LogOut,
	Moon,
	Plus,
	Search,
	Settings,
	Sun,
	User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePostApiWorkspaceUsersSaveorupdate } from "@/api/generated/workspace-users/workspace-users";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTheme } from "@/app/contexts/ThemeContext";

export default function Header() {
	const { user, logout } = useAuth();
	const { theme, toggleTheme } = useTheme();
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showInviteModal, setShowInviteModal] = useState(false);
	const [inviteEmail, setInviteEmail] = useState("");
	const [isInviting, setIsInviteLoading] = useState(false);

	const { mutateAsync: saveWorkspaceUser } =
		usePostApiWorkspaceUsersSaveorupdate();

	const handleInvite = async (e: React.FormEvent) => {
		e.preventDefault();
		const storedWorkspace = localStorage.getItem("selectedWorkspace");
		if (!storedWorkspace) return alert("Workspace seçili değil.");
		const workspaceId = JSON.parse(storedWorkspace).id;

		setIsInviteLoading(true);
		try {
			await saveWorkspaceUser({
				data: {
					workspaceId: workspaceId,
					email: inviteEmail,
				},
			});
			alert("Davetiye gönderildi (Simüle edildi, saveorupdate kullanıldı)");
			setShowInviteModal(false);
			setInviteEmail("");
		} catch (error) {
			console.error(error);
			alert("Davet hatası");
		} finally {
			setIsInviteLoading(false);
		}
	};

	return (
		<header className="h-16 border-b flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md bg-background/80 border-border">
			{/* Search */}
			<div className="flex-1 max-w-xl">
				<div className="relative group">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors text-muted-foreground group-focus-within:text-primary" />
					<input
						type="text"
						placeholder="Ara..."
						className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm transition-all outline-none bg-muted/50 border-border focus:border-primary focus:ring-4 focus:ring-primary/10"
					/>
				</div>
			</div>

			{/* Actions */}
			<div className="flex items-center gap-3 ml-4">
				<button
					type="button"
					onClick={() => setShowInviteModal(true)}
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
				>
					<Plus size={16} />
					Davet Et
				</button>

				<button
					type="button"
					onClick={toggleTheme}
					className="p-2.5 rounded-xl border transition-all bg-background border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground shadow-sm"
				>
					{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
				</button>

				<div className="relative">
					<button
						type="button"
						className="p-2.5 rounded-xl border transition-all relative bg-background border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground shadow-sm"
					>
						<Bell size={18} />
						<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
					</button>
				</div>

				<div className="w-px h-6 bg-border mx-1"></div>

				<div className="relative">
					<button
						type="button"
						onClick={() => setShowUserMenu(!showUserMenu)}
						className="flex items-center gap-3 p-1.5 rounded-xl border transition-all bg-background border-border text-foreground hover:bg-accent shadow-sm"
					>
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
							{user?.name?.charAt(0).toUpperCase() || <User size={16} />}
						</div>
						<div className="text-left hidden sm:block pr-2">
							<p className="text-xs font-semibold leading-tight">
								{user?.name || "Kullanıcı"}
							</p>
							<p className="text-[10px] text-muted-foreground leading-tight">
								Çevrimiçi
							</p>
						</div>
					</button>

					{showUserMenu && (
						<div className="absolute right-0 mt-2 w-56 rounded-2xl border shadow-2xl overflow-hidden py-2 z-50 bg-popover border-border text-popover-foreground">
							<Link
								href="/profile"
								className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-foreground hover:bg-accent"
							>
								<Settings size={16} />
								Profil Ayarları
							</Link>
							<button
								type="button"
								onClick={logout}
								className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full text-left"
							>
								<LogOut size={16} />
								Çıkış Yap
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Invite Modal */}
			{showInviteModal && (
				<div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
					<button
						type="button"
						className="fixed inset-0 bg-background/40 backdrop-blur-sm w-full h-full border-none"
						onClick={() => setShowInviteModal(false)}
						aria-label="Kapat"
					/>
					<div className="relative w-full max-w-md rounded-2xl shadow-2xl p-6 bg-card border border-border text-card-foreground">
						<h3 className="text-xl font-bold mb-4">Workspace'e Davet Et</h3>
						<form onSubmit={handleInvite}>
							<div className="space-y-4">
								<div>
									<label
										htmlFor="inviteEmail"
										className="block text-sm font-medium mb-1.5 text-muted-foreground"
									>
										E-posta Adresi
									</label>
									<input
										id="inviteEmail"
										type="email"
										required
										value={inviteEmail}
										onChange={(e) => setInviteEmail(e.target.value)}
										className="w-full px-4 py-2 rounded-xl border text-sm transition-all outline-none bg-muted/50 border-border focus:border-primary"
										placeholder="ornek@email.com"
									/>
								</div>
								<div className="flex gap-3 mt-6">
									<button
										type="button"
										onClick={() => setShowInviteModal(false)}
										className="flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80"
									>
										İptal
									</button>
									<button
										type="submit"
										disabled={isInviting}
										className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
									>
										{isInviting ? "Gönderiliyor..." : "Davet Gönder"}
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			)}
		</header>
	);
}
