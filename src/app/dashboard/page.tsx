"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Workspace {
	id: string;
	name: string;
	platform?: string;
}

export default function DashboardPage() {
	const router = useRouter();
	const [workspace, setWorkspace] = useState<Workspace | null>(null);

	useEffect(() => {
		const stored = localStorage.getItem("selectedWorkspace");
		if (!stored) {
			router.push("/workspaces"); // workspace seçilmemişse geri gönder
			return;
		}

		try {
			const parsed = JSON.parse(stored);
			setWorkspace(parsed);
		} catch {
			localStorage.removeItem("selectedWorkspace");
			router.push("/workspaces");
		}
	}, [router]);

	if (!workspace) {
		return (
			<main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
				<p className="text-lg">Yönlendiriliyor...</p>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					X-24'e Hoşgeldiniz, {workspace.name}
				</h1>
				<p className="text-gray-600 mb-8">
					Seçili Workspace: <strong>{workspace.name}</strong>
					{workspace.platform && <> ({workspace.platform})</>}
				</p>

				{/* Dashboard bileşenlerin veya yönlendirmelerin buraya gelecek */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="p-6 bg-white rounded shadow hover:shadow-md transition cursor-pointer">
						<h2 className="text-xl font-semibold mb-2">Görevler</h2>
						<p className="text-gray-500">Task yönetimini görüntüle.</p>
					</div>
					<div className="p-6 bg-white rounded shadow hover:shadow-md transition cursor-pointer">
						<h2 className="text-xl font-semibold mb-2">Analizler</h2>
						<p className="text-gray-500">Workspace analizlerini incele.</p>
					</div>
					{/* Daha fazla kutu ekleyebilirsin */}
				</div>
			</div>
		</main>
	);
}
