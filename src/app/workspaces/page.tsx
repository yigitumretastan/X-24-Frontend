"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	useDeleteApiWorkspacesId,
	useGetWorkspaces,
	usePostApiWorkspacesSaveorupdate,
} from "@/api/generated/workspaces/workspaces";
import type { WorkspaceDto } from "@/api/model/workspaceDto";
import AuthGuard from "@/app/components/AuthGuard";
import { useAuth } from "@/app/contexts/AuthContext";

export default function WorkspacePage() {
	const router = useRouter();
	const { logout } = useAuth();
	const [activeTab, setActiveTab] = useState<"mine" | "joined">("mine");
	const [modalOpen, setModalOpen] = useState(false);
	const [newWorkspaceName, setNewWorkspaceName] = useState("");
	const [createError, setCreateError] = useState("");
	const [showProfileMenu, setShowProfileMenu] = useState(false);

	const { data: workspacesResponse, refetch: refetchWorkspaces } =
		useGetWorkspaces();
	const { mutateAsync: saveWorkspace, isPending: creating } =
		usePostApiWorkspacesSaveorupdate();
	const { mutateAsync: deleteWorkspace } = useDeleteApiWorkspacesId();

	const myWorkspaces = workspacesResponse?.data || [];
	// API'de joined ayrımı yoksa şimdilik hepsi myWorkspaces olarak kabul edilebilir veya filtreleme yapılabilir.
	const joinedWorkspaces: WorkspaceDto[] = [];

	const handleCreateWorkspace = async () => {
		if (!newWorkspaceName.trim()) {
			setCreateError("Workspace adı boş olamaz.");
			return;
		}
		setCreateError("");

		try {
			const result = await saveWorkspace({ data: { name: newWorkspaceName } });

			if (result.status === 200) {
				refetchWorkspaces();
				setNewWorkspaceName("");
				setModalOpen(false);
				setActiveTab("mine");
			} else {
				setCreateError("Oluşturma başarısız.");
			}
		} catch {
			setCreateError("Sunucu hatası.");
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Workspace silinsin mi?")) return;

		try {
			const result = await deleteWorkspace({ id });
			if (result.status === 204) {
				refetchWorkspaces();
				alert("Workspace silindi.");
			} else {
				alert("Silme işlemi başarısız.");
			}
		} catch {
			alert("Beklenmeyen bir hata oluştu.");
		}
	};

	const handleSelect = (ws: WorkspaceDto) => {
		localStorage.setItem("selectedWorkspace", JSON.stringify(ws));
		router.push("/dashboard");
	};

	const handleLogout = () => {
		logout();
	};

	const currentWorkspaces =
		activeTab === "mine" ? myWorkspaces : joinedWorkspaces;

	return (
		<AuthGuard>
			<main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-8 relative">
				{/* Sağ üst köşe butonlar */}
				<div className="fixed top-4 right-4 flex items-center gap-3 z-30">
					<button
						type="button"
						onClick={() => setModalOpen(true)}
						className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
					>
						+ Workspace
					</button>

					<div className="relative">
						<button
							type="button"
							onClick={() => setShowProfileMenu(!showProfileMenu)}
							className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
						>
							Profil
						</button>
						{showProfileMenu && (
							<div className="absolute right-0 mt-2 w-44 bg-white shadow-xl border border-gray-200 rounded-lg z-40 overflow-hidden">
								<a
									href="/profile"
									className="block px-4 py-3 text-gray-800 hover:bg-gray-50 transition-colors duration-200"
								>
									Profil Ayarları
								</a>
								<hr className="border-gray-200" />
								<button
									type="button"
									onClick={handleLogout}
									className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
								>
									Çıkış Yap
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Ortadaki içerik */}
				<div className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 text-center relative z-10 border border-white/20">
					<h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8 mt-2">
						Workspacelerim
					</h1>

					{/* Tabs */}
					<div className="flex justify-center mb-8">
						<div className="flex space-x-1 bg-gradient-to-r from-gray-100 to-gray-50 p-1 rounded-xl shadow-inner">
							<button
								type="button"
								className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
									activeTab === "mine"
										? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105"
										: "text-gray-600 hover:bg-white/70 hover:shadow-md hover:text-gray-800"
								}`}
								onClick={() => setActiveTab("mine")}
							>
								Benimkiler
							</button>
							<button
								type="button"
								className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
									activeTab === "joined"
										? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105"
										: "text-gray-600 hover:bg-white/70 hover:shadow-md hover:text-gray-800"
								}`}
								onClick={() => setActiveTab("joined")}
							>
								Katıldıklarım
							</button>
						</div>
					</div>

					{/* Workspace Listesi */}
					<ul className="space-y-4">
						{currentWorkspaces.length > 0 ? (
							currentWorkspaces.map((ws) => (
								<button
									type="button"
									key={ws.id}
									onClick={() => handleSelect(ws)}
									className="w-full bg-gradient-to-r from-white to-gray-50/50 flex justify-between items-center rounded-xl px-6 py-4 hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-200 border border-gray-200/50 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
								>
									<span className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300 text-left">
										{ws.name}
									</span>
									{activeTab === "mine" && (
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation(); // Delete butonuna tıklanınca yönlendirme olmasın
												if (ws.id) handleDelete(ws.id.toString());
											}}
											className="text-gray-400 hover:text-red-500 transition-all duration-300 p-2 rounded-lg hover:bg-red-50 hover:shadow-md transform hover:scale-110"
											title="Workspace'i sil"
										>
											<TrashIcon className="h-5 w-5" />
										</button>
									)}
								</button>
							))
						) : (
							<li className="text-gray-400 text-base py-8 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50">
								<div className="flex flex-col items-center space-y-2">
									<span className="text-2xl">📁</span>
									<span>Hiç workspace bulunamadı</span>
								</div>
							</li>
						)}
					</ul>
				</div>

				{/* Modal */}
				{modalOpen && (
					<button
						type="button"
						className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 w-full h-full border-none cursor-default"
						onClick={() => setModalOpen(false)} // Arka plan tıklanırsa kapansın
						onKeyDown={(e) => {
							if (e.key === "Escape") setModalOpen(false);
						}}
					>
						<div
							className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20 cursor-auto"
							onClick={(e) => e.stopPropagation()} // Modal içindeki tıklamayı durdur, arka plan kapanmasın
							onKeyDown={(e) => e.stopPropagation()}
							role="dialog"
							aria-modal="true"
						>
							<h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
								Yeni Workspace Oluştur
							</h2>
							<input
								type="text"
								placeholder="Workspace adı girin..."
								value={newWorkspaceName}
								onChange={(e) => setNewWorkspaceName(e.target.value)}
								onKeyDown={(e) => {
									if (
										e.key === "Enter" &&
										newWorkspaceName.trim() &&
										!creating
									) {
										handleCreateWorkspace();
									}
									if (e.key === "Escape") {
										setModalOpen(false);
									}
								}}
								className="w-full border-2 border-gray-200 bg-white/80 text-gray-800 rounded-xl px-5 py-4 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 placeholder-gray-400 shadow-sm"
							/>
							{createError && (
								<p className="text-red-600 text-sm mb-2">{createError}</p>
							)}
							<div className="flex justify-end gap-4 mt-8">
								<button
									type="button"
									onClick={() => setModalOpen(false)}
									className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
								>
									İptal
								</button>
								<button
									type="button"
									onClick={handleCreateWorkspace}
									disabled={creating || !newWorkspaceName.trim()}
									className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
								>
									{creating ? "Oluşturuluyor..." : "Oluştur"}
								</button>
							</div>
						</div>
					</button>
				)}
			</main>
		</AuthGuard>
	);
}
