"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/app/utils/cookies";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Workspace {
	id: string;
	name: string;
}

export default function WorkspacePage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<"mine" | "joined">("mine");
	const [myWorkspaces, setMyWorkspaces] = useState<Workspace[]>([]);
	const [joinedWorkspaces, setJoinedWorkspaces] = useState<Workspace[]>([]);

	const token = getCookie("userToken");

	useEffect(() => {
		if (!token) {
			console.warn("Token yok, giriş sayfasına yönlendiriliyor.");
			router.push("/api/auth/login");
			return;
		}

		const safeJsonParse = async (res: Response) => {
			try {
				const contentType = res.headers.get("content-type");
				if (contentType && contentType.includes("application/json")) {
					return await res.json();
				} else {
					console.warn("JSON olmayan yanıt geldi:", await res.text());
					return null;
				}
			} catch (err) {
				console.error("JSON parse hatası:", err);
				return null;
			}
		};

		const fetchMyWorkspaces = async () => {
			const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Workspace/my-workspaces`;
			console.log("My Workspaces API URL:", url);

			try {
				const res = await fetch(url, {
					headers: { Authorization: `Bearer ${token}` },
				});
				console.log("My Workspaces status:", res.status);

				if (!res.ok) {
					console.error("Sunucudan geçerli cevap alınamadı:", res.status);
					return;
				}

				const data = await safeJsonParse(res);
				console.log("My Workspaces data:", data);
				setMyWorkspaces(data?.data || []);

			} catch (err) {
				console.error("Workspaces fetch error:", err);
			}
		};

		fetchMyWorkspaces();

	}, [token]);

	const handleDelete = async (id: string) => {
		const password = prompt("Workspace'i silmek için şifrenizi girin:");

		if (!password) {
			alert("Şifre girilmedi. İşlem iptal edildi.");
			return;
		}

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

			console.log("Delete response status:", res.status);

			if (!res.ok) {
				const errorMessage = await res.text();
				console.error("Silme başarısız:", errorMessage);
				alert("Silme işlemi başarısız: " + errorMessage);
				return;
			}

			// Başarılıysa local state'den kaldır
			setMyWorkspaces((prev) => prev.filter((w) => w.id !== id));
			setJoinedWorkspaces((prev) => prev.filter((w) => w.id !== id));
			alert("Workspace başarıyla silindi.");
		} catch (err) {
			console.error("Silme hatası:", err);
			alert("Beklenmeyen bir hata oluştu.");
		}
	};



	const handleSelect = (ws: Workspace) => {
		localStorage.setItem("selectedWorkspace", JSON.stringify(ws));
		router.push("/dashboard");
	};

	const currentWorkspaces = activeTab === "mine" ? myWorkspaces : joinedWorkspaces;

	return (
		<main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
			<div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 text-center">
				{/* Başlık */}
				<h1 className="text-2xl font-extrabold text-gray-900 mb-6">Workspacelerim</h1>

				{/* Tabs */}
				<div className="flex justify-center space-x-4 mb-6">
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

				{/* Workspace Listesi */}
				<ul className="space-y-3 text-left">
					{currentWorkspaces.length > 0 ? (
						currentWorkspaces.map((ws) => (
							<li
								key={ws.id}
								className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer"
							>
								<span onClick={() => handleSelect(ws)} className="font-medium text-gray-900">
									{ws.name}
								</span>
								<button
									onClick={() => handleDelete(ws.id)}
									className="text-gray-500 hover:text-red-500 transition"
								>
									<TrashIcon className="h-5 w-5" />
								</button>
							</li>
						))
					) : (
						<li className="text-gray-500 text-sm">Hiç workspace bulunamadı.</li>
					)}
				</ul>
			</div>
		</main>
	);
}
