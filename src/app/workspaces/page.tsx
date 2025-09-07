"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/app/utils/cookies"; // deleteCookie aşağıda tanımlanıyor
import { TrashIcon } from "@heroicons/react/24/outline";

interface Workspace {
	id: string;
	name: string;
}

// deleteCookie helper (çünkü utils içinde tanımlı değil)
function deleteCookie(name: string) {
	if (typeof document === "undefined") return;
	document.cookie = `${name}=; Max-Age=0; path=/;`;
}

export default function WorkspacePage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<"mine" | "joined">("mine");
	const [myWorkspaces, setMyWorkspaces] = useState<Workspace[]>([]);
	const [joinedWorkspaces, setJoinedWorkspaces] = useState<Workspace[]>([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [newWorkspaceName, setNewWorkspaceName] = useState("");
	const [creating, setCreating] = useState(false);
	const [createError, setCreateError] = useState("");
	const [showProfileMenu, setShowProfileMenu] = useState(false);

	const token = getCookie("userToken");

	useEffect(() => {
		if (!token) {
			router.push("/auth/login");
			return;
		}

		const fetchWorkspaces = async () => {
			try {
				const resMine = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Workspace/my-workspaces`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const dataMine = await resMine.json();
				setMyWorkspaces(dataMine?.data || []);

				const resJoined = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Workspace/joined-workspaces`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const dataJoined = await resJoined.json();
				setJoinedWorkspaces(dataJoined?.data || []);
			} catch (err) {
				console.error("Workspaces fetch error:", err);
			}
		};

		fetchWorkspaces();
	}, [token]);

	const handleCreateWorkspace = async () => {
		if (!newWorkspaceName.trim()) {
			setCreateError("Workspace adı boş olamaz.");
			return;
		}
		setCreating(true);
		setCreateError("");

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Workspace/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ name: newWorkspaceName }),
			});

			if (!res.ok) {
				const text = await res.text();
				setCreateError(text || "Oluşturma başarısız.");
				setCreating(false);
				return;
			}

			const data = await res.json();

			if (data.success) {
				setMyWorkspaces((prev) => [...prev, data.data]);
				setNewWorkspaceName("");
				setModalOpen(false);
				setActiveTab("mine");
			} else {
				setCreateError(data.message || "Oluşturma başarısız.");
			}
		} catch (err) {
			setCreateError("Sunucu hatası.");
		} finally {
			setCreating(false);
		}
	};


	const handleDelete = async (id: string) => {
		const password = prompt("Workspace'i silmek için şifrenizi girin:");
		if (!password) return;

		const confirmed = confirm("Workspace silinsin mi?");
		if (!confirmed) return;

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Workspace/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ password }),
			});

			if (!res.ok) {
				const errorMessage = await res.text();
				alert("Silme işlemi başarısız: " + errorMessage);
				return;
			}

			const resBody = await res.json();
			setMyWorkspaces((prev) => prev.filter((w) => w.id !== id));
			setJoinedWorkspaces((prev) => prev.filter((w) => w.id !== id));
			alert(resBody.message || "Workspace silindi.");
		} catch (err) {
			alert("Beklenmeyen bir hata oluştu.");
		}
	};

	const handleSelect = (ws: Workspace) => {
		localStorage.setItem("selectedWorkspace", JSON.stringify(ws));
		router.push("/dashboard");
	};

	const handleLogout = () => {
		deleteCookie("userToken");
		router.push("/auth/login");
	};

	const currentWorkspaces = activeTab === "mine" ? myWorkspaces : joinedWorkspaces;

	return (
		<main className="min-h-screen bg-gray-100 flex items-center justify-center p-8 relative">

			{/* Sağ üst köşe butonlar */}
			<div className="fixed top-4 right-4 flex items-center gap-3 z-30">
				<button
					onClick={() => setModalOpen(true)}
					className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 text-sm"
				>
					+ Workspace
				</button>

				<div className="relative">
					<button
						onClick={() => setShowProfileMenu(!showProfileMenu)}
						className="w-9 h-9 rounded-full bg-gray-300 text-gray-700 font-semibold hover:ring-2 ring-indigo-400"
					>
						👤
					</button>
					{showProfileMenu && (
						<div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-md z-40">
							<a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
								Profil Ayarları
							</a>
							<button
								onClick={handleLogout}
								className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
							>
								Çıkış Yap
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Ortadaki içerik */}
			<div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6 text-center relative z-10">
				<h1 className="text-2xl font-extrabold text-gray-900 mb-6 mt-2">Workspacelerim</h1>

				{/* Tabs */}
				<div className="flex justify-center mb-6">
					<div className="flex space-x-4">
						<button
							className={`px-4 py-2 rounded-full font-semibold transition ${activeTab === "mine"
								? "bg-indigo-600 text-white"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}
							onClick={() => setActiveTab("mine")}
						>
							Benimkiler
						</button>
						<button
							className={`px-4 py-2 rounded-full font-semibold transition ${activeTab === "joined"
								? "bg-indigo-600 text-white"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}
							onClick={() => setActiveTab("joined")}
						>
							Katıldıklarım
						</button>
					</div>
				</div>

				{/* Workspace Listesi */}
				<ul className="space-y-3">
					{currentWorkspaces.length > 0 ? (
						currentWorkspaces.map((ws) => (
							<li
								key={ws.id}
								onClick={() => handleSelect(ws)}
								className="bg-gray-50 flex justify-between items-center rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer"
							>
								<span className="font-medium text-gray-900">
									{ws.name}
								</span>
								{activeTab === "mine" && (
									<button
										onClick={(e) => {
											e.stopPropagation(); // Delete butonuna tıklanınca yönlendirme olmasın
											handleDelete(ws.id);
										}}
										className="text-gray-500 hover:text-red-500 transition"
									>
										<TrashIcon className="h-5 w-5" />
									</button>
								)}
							</li>

						))
					) : (
						<li className="text-gray-500 text-sm">Hiç workspace bulunamadı.</li>
					)}
				</ul>
			</div>

			{/* Modal burada aynı */}
			{modalOpen && (
				<div
					className="fixed inset-0 bg-white flex items-center justify-center z-20"
					onClick={() => setModalOpen(false)} // Arka plan tıklanırsa kapansın
				>
					<div
						className="rounded-lg p-6 w-full max-w-md shadow-lg"
						onClick={(e) => e.stopPropagation()} // Modal içindeki tıklamayı durdur, arka plan kapanmasın
					>
						<h2 className="text-xl font-bold mb-4">Yeni Workspace Oluştur</h2>
						<input
							type="text"
							placeholder="Workspace adı"
							value={newWorkspaceName}
							onChange={(e) => setNewWorkspaceName(e.target.value)}
							className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
						{createError && <p className="text-red-600 text-sm mb-2">{createError}</p>}
						<div className="flex justify-end gap-3">
							<button
								onClick={() => setModalOpen(false)}
								className="px-4 py-2 rounded-md border"
							>
								İptal
							</button>
							<button
								onClick={handleCreateWorkspace}
								disabled={creating}
								className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
							>
								{creating ? "Oluşturuluyor..." : "Oluştur"}
							</button>
						</div>
					</div>
				</div>
			)}
		</main>

	);
}
