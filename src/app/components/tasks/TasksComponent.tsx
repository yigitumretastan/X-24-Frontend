"use client";

import { Filter, Plus } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useTasks } from "@/app/hooks/useTasks";
import CreateTaskModal from "./CreateTaskModal";
import FilterTabs from "./FilterTabs";
import SearchBar from "./SearchBar";
import TaskCard from "./TaskCard";

export default function TasksComponent() {
	const [isModalOpen, setModalOpen] = useState(false);
	const {
		filteredTasks,
		error,
		activeFilter,
		setActiveFilter,
		searchTerm,
		setSearchTerm,
		filters,
	} = useTasks();

	const theme = useTheme();

	// TODO: Bu değerleri gerçek kaynaklardan al (URL params, context, auth vb.)
	const workspaceId = process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE_ID || "1";
	const userId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || "1";

	return (
		<div
			className={`transition-colors duration-300 ${
				theme.theme === "dark" ? "text-white" : "text-gray-900"
			}`}
		>
			{/* Page Header - Inline */}
			<div className="mb-8">
				<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
					{/* Title Section */}
					<div className="flex items-center space-x-6">
						<div className="flex items-center space-x-3">
							<div
								className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
									theme.theme === "dark"
										? "bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25"
										: "bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25"
								}`}
							>
								<Filter className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1
									className={`text-3xl font-bold bg-gradient-to-r ${
										theme.theme === "dark"
											? "from-white to-gray-300 bg-clip-text text-transparent"
											: "from-gray-900 to-gray-600 bg-clip-text text-transparent"
									}`}
								>
									Görevler
								</h1>
								<p
									className={`text-sm ${
										theme.theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								>
									Görevlerinizi yönetin ve takip edin
								</p>
							</div>
						</div>

						<div
							className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-full ${
								theme.theme === "dark"
									? "bg-gray-800/50 text-gray-300 border border-gray-700/50"
									: "bg-gray-100/80 text-gray-600 border border-gray-200/50"
							}`}
						>
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
							<span className="text-sm font-medium">
								{new Date().toLocaleDateString("tr-TR", {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</span>
						</div>
					</div>

					{/* Actions Section */}
					<div className="flex items-center space-x-4">
						<div className="flex-1 lg:flex-none">
							<SearchBar
								searchTerm={searchTerm}
								onSearchChange={setSearchTerm}
							/>
						</div>

						<button
							type="button"
							onClick={() => setModalOpen(true)}
							className={`group relative flex items-center px-6 py-3 space-x-2 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
								theme.theme === "dark"
									? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
									: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
							}`}
						>
							<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<Plus className="w-5 h-5 relative z-10" />
							<span className="relative z-10">Yeni Görev</span>
						</button>
					</div>
				</div>
			</div>

			<div>
				{error && (
					<div
						className={`backdrop-blur-sm border rounded-2xl p-4 mb-6 animate-pulse ${
							theme.theme === "dark"
								? "bg-red-900/20 border-red-500/30 text-red-300"
								: "bg-red-50/80 border-red-200/50 text-red-800"
						}`}
					>
						<div className="flex items-center space-x-2">
							<div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
							<span className="font-medium">{error}</span>
						</div>
					</div>
				)}

				<FilterTabs
					activeFilter={activeFilter}
					onFilterChange={setActiveFilter}
					filters={filters}
					theme={theme.theme}
				/>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
					{filteredTasks.length > 0 ? (
						filteredTasks.map((task, index) => (
							<div
								key={task.id}
								className="group animate-fadeInUp"
								style={{ animationDelay: `${index * 100}ms` }}
							>
								<TaskCard task={task} theme={theme.theme} />
							</div>
						))
					) : (
						<div className="col-span-full text-center py-16">
							<div
								className={`relative mx-auto mb-8 w-24 h-24 rounded-full flex items-center justify-center ${
									theme.theme === "dark"
										? "bg-gradient-to-br from-gray-700 to-gray-800 shadow-2xl"
										: "bg-gradient-to-br from-white to-gray-100 shadow-2xl"
								}`}
							>
								<div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-pulse"></div>
								<Filter
									className={`w-10 h-10 ${theme.theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
								/>
							</div>
							<h3
								className={`text-2xl font-bold mb-3 ${
									theme.theme === "dark" ? "text-gray-200" : "text-gray-800"
								}`}
							>
								{searchTerm ? "Arama sonucu yok" : "Henüz görev yok"}
							</h3>
							<p
								className={`text-lg mb-6 max-w-md mx-auto ${
									theme.theme === "dark" ? "text-gray-400" : "text-gray-600"
								}`}
							>
								{searchTerm
									? "Farklı bir anahtar kelime deneyin veya filtreleri kontrol edin."
									: 'İlk görevinizi oluşturmak için "Yeni Görev" butonuna tıklayın.'}
							</p>
							<div
								className={`inline-block px-6 py-3 rounded-full text-sm font-medium ${
									theme.theme === "dark"
										? "bg-gray-800/50 text-gray-300 border border-gray-700"
										: "bg-white/80 text-gray-600 border border-gray-200"
								}`}
							>
								💡 İpucu: Görevlerinizi organize etmek için kategoriler kullanın
							</div>
						</div>
					)}
				</div>
			</div>

			<style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>

			<CreateTaskModal
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
				workspaceId={workspaceId}
				userId={userId}
			/>
		</div>
	);
}
