"use client";

import {
	Calendar,
	FolderOpen,
	Grid3X3,
	List,
	Plus,
	Search,
	Target,
	Users,
} from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useProjects } from "@/app/hooks/useProjects";

export default function ProjectsComponent() {
	const {
		projects,
		loading,
		viewMode,
		setViewMode,
		filters,
		updateFilters,
		openCreateModal,
		openProjectDetail,
		getPriorityColor,
	} = useProjects();

	const { theme } = useTheme();

	if (loading) {
		return (
			<div className="flex items-center justify-center py-16">
				<div className="text-center">
					<div
						className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4 ${
							theme === "dark"
								? "border-gray-700 border-t-blue-400"
								: "border-blue-200 border-t-blue-600"
						}`}
					></div>
					<p
						className={`text-lg font-medium ${
							theme === "dark" ? "text-gray-300" : "text-gray-600"
						}`}
					>
						Projeler yükleniyor...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`transition-colors duration-300 ${
				theme === "dark" ? "text-white" : "text-gray-900"
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
									theme === "dark"
										? "bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25"
										: "bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25"
								}`}
							>
								<FolderOpen className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1
									className={`text-3xl font-bold bg-gradient-to-r ${
										theme === "dark"
											? "from-white to-gray-300 bg-clip-text text-transparent"
											: "from-gray-900 to-gray-600 bg-clip-text text-transparent"
									}`}
								>
									Projeler
								</h1>
								<p
									className={`text-sm ${
										theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
								>
									Projelerinizi yönetin ve takip edin
								</p>
							</div>
						</div>

						<div
							className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-full ${
								theme === "dark"
									? "bg-gray-800/50 text-gray-300 border border-gray-700/50"
									: "bg-gray-100/80 text-gray-600 border border-gray-200/50"
							}`}
						>
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
							<span className="text-sm font-medium">
								{projects.length} Proje
							</span>
						</div>
					</div>

					{/* Actions Section */}
					<div className="flex items-center space-x-4">
						<button
							type="button"
							onClick={openCreateModal}
							className={`group relative flex items-center px-6 py-3 space-x-2 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
								theme === "dark"
									? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
									: "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
							}`}
						>
							<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<Plus className="w-5 h-5 relative z-10" />
							<span className="relative z-10">Yeni Proje</span>
						</button>
					</div>
				</div>
			</div>

			{/* Filters and View Controls */}
			<div
				className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border mb-8 ${
					theme === "dark"
						? "bg-gray-800/80 border-gray-700/50"
						: "bg-white/80 border-white/20"
				}`}
			>
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
					{/* Search and Filters */}
					<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
						<div className="relative">
							<Search
								className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
									theme === "dark" ? "text-gray-400" : "text-gray-500"
								}`}
							/>
							<input
								type="text"
								placeholder="Proje ara..."
								value={filters.search}
								onChange={(e) => updateFilters({ search: e.target.value })}
								className={`pl-10 pr-4 py-2 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
									theme === "dark"
										? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500"
										: "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500"
								}`}
							/>
						</div>

						<select
							value={filters.status[0] || ""}
							onChange={(e) =>
								updateFilters({
									status: e.target.value ? [e.target.value] : [],
								})
							}
							className={`px-4 py-2 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
								theme === "dark"
									? "bg-gray-700 border-gray-600 text-white focus:border-indigo-500"
									: "bg-white border-gray-200 text-gray-900 focus:border-indigo-500"
							}`}
						>
							<option value="">Tüm Durumlar</option>
							<option value="planning">Planlama</option>
							<option value="active">Aktif</option>
							<option value="paused">Duraklatıldı</option>
							<option value="completed">Tamamlandı</option>
						</select>
					</div>

					{/* View Mode Controls */}
					<div className="flex items-center space-x-2">
						<div
							className={`flex rounded-xl p-1 ${
								theme === "dark" ? "bg-gray-700" : "bg-gray-100"
							}`}
						>
							<button
								type="button"
								onClick={() => setViewMode("grid")}
								className={`p-2 rounded-lg transition-all duration-200 ${
									viewMode === "grid"
										? "bg-indigo-500 text-white shadow-lg"
										: theme === "dark"
											? "text-gray-400 hover:text-white hover:bg-gray-600"
											: "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
								}`}
							>
								<Grid3X3 className="w-5 h-5" />
							</button>
							<button
								type="button"
								onClick={() => setViewMode("list")}
								className={`p-2 rounded-lg transition-all duration-200 ${
									viewMode === "list"
										? "bg-indigo-500 text-white shadow-lg"
										: theme === "dark"
											? "text-gray-400 hover:text-white hover:bg-gray-600"
											: "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
								}`}
							>
								<List className="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Projects Grid */}
			{viewMode === "grid" && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{projects.map((project, index) => {
						const priorityColor = getPriorityColor(project.priority);

						return (
							<button
								type="button"
								key={project.id}
								onClick={() => openProjectDetail(project)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										openProjectDetail(project);
									}
								}}
								className={`group relative backdrop-blur-sm rounded-3xl p-6 shadow-lg border cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fadeInUp w-full text-left ${
									theme === "dark"
										? "bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50 hover:border-indigo-500/50"
										: "bg-gradient-to-br from-white/95 to-gray-50/95 border-gray-200/50 hover:border-indigo-500/50"
								}`}
								style={{ animationDelay: `${index * 100}ms` }}
							>
								{/* Priority indicator with glow effect */}
								<div
									className={`absolute top-0 left-0 w-full h-1 ${
										priorityColor === "red"
											? "bg-gradient-to-r from-red-500 to-pink-500"
											: priorityColor === "yellow"
												? "bg-gradient-to-r from-yellow-500 to-orange-500"
												: priorityColor === "green"
													? "bg-gradient-to-r from-green-500 to-emerald-500"
													: "bg-gradient-to-r from-blue-500 to-indigo-500"
									} rounded-t-3xl shadow-lg`}
								>
									<div
										className={`absolute inset-0 ${
											priorityColor === "red"
												? "bg-gradient-to-r from-red-500 to-pink-500"
												: priorityColor === "yellow"
													? "bg-gradient-to-r from-yellow-500 to-orange-500"
													: priorityColor === "green"
														? "bg-gradient-to-r from-green-500 to-emerald-500"
														: "bg-gradient-to-r from-blue-500 to-indigo-500"
										} blur-sm opacity-50`}
									></div>
								</div>

								{/* Floating priority badge */}
								<div
									className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
										priorityColor === "red"
											? "bg-red-500"
											: priorityColor === "yellow"
												? "bg-yellow-500"
												: priorityColor === "green"
													? "bg-green-500"
													: "bg-blue-500"
									} shadow-lg ring-2 ${
										theme === "dark" ? "ring-gray-800" : "ring-white"
									}`}
								>
									<div
										className={`absolute inset-0 rounded-full ${
											priorityColor === "red"
												? "bg-red-500"
												: priorityColor === "yellow"
													? "bg-yellow-500"
													: priorityColor === "green"
														? "bg-green-500"
														: "bg-blue-500"
										} animate-ping opacity-30`}
									></div>
								</div>

								<div className="pt-4">
									{/* Project Header */}
									<div className="space-y-4">
										<div className="space-y-2">
											<h3
												className={`text-xl font-bold leading-tight group-hover:text-indigo-600 transition-colors duration-300 ${
													theme === "dark" ? "text-white" : "text-gray-900"
												}`}
											>
												{project.name}
											</h3>
											<p
												className={`text-sm leading-relaxed line-clamp-2 ${
													theme === "dark" ? "text-gray-300" : "text-gray-600"
												}`}
											>
												{project.description}
											</p>
										</div>

										{/* Status Badge */}
										<div className="flex justify-start">
											<span
												className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all duration-300 ${
													project.status === "planning"
														? theme === "dark"
															? "bg-yellow-800 text-yellow-100 border-yellow-600"
															: "bg-yellow-100 text-yellow-800 border-yellow-200"
														: project.status === "active"
															? theme === "dark"
																? "bg-green-800 text-green-100 border-green-600"
																: "bg-green-100 text-green-800 border-green-200"
															: project.status === "paused"
																? theme === "dark"
																	? "bg-orange-800 text-orange-100 border-orange-600"
																	: "bg-orange-100 text-orange-800 border-orange-200"
																: project.status === "completed"
																	? theme === "dark"
																		? "bg-blue-800 text-blue-100 border-blue-600"
																		: "bg-blue-100 text-blue-800 border-blue-200"
																	: theme === "dark"
																		? "bg-gray-800 text-gray-100 border-gray-600"
																		: "bg-gray-100 text-gray-800 border-gray-200"
												}`}
											>
												<div
													className={`w-2 h-2 rounded-full mr-2 ${
														project.status === "planning"
															? "bg-yellow-500"
															: project.status === "active"
																? "bg-green-500"
																: project.status === "paused"
																	? "bg-orange-500"
																	: project.status === "completed"
																		? "bg-blue-500"
																		: "bg-gray-500"
													}`}
												></div>
												{project.status === "planning"
													? "Planlama"
													: project.status === "active"
														? "Aktif"
														: project.status === "paused"
															? "Duraklatıldı"
															: project.status === "completed"
																? "Tamamlandı"
																: "İptal"}
											</span>
										</div>
									</div>
								</div>

								{/* Progress */}
								<div className="mb-6">
									<div className="flex items-center justify-between mb-3">
										<span
											className={`text-sm font-medium ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}
										>
											İlerleme
										</span>
										<span
											className={`text-sm font-bold px-2 py-1 rounded-full ${
												theme === "dark"
													? "bg-indigo-900/50 text-indigo-300"
													: "bg-indigo-100 text-indigo-700"
											}`}
										>
											%{project.progress}
										</span>
									</div>
									<div
										className={`w-full h-3 rounded-full ${
											theme === "dark" ? "bg-gray-700" : "bg-gray-200"
										}`}
									>
										<div
											className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-700 shadow-lg"
											style={{ width: `${project.progress}%` }}
										/>
									</div>
								</div>

								{/* Project Info Footer */}
								<div className="flex items-center justify-between pt-4 border-t border-opacity-20 border-gray-300">
									<div
										className={`flex items-center space-x-4 text-sm ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}
									>
										<div className="flex items-center space-x-2">
											<div
												className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
													theme === "dark"
														? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
														: "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
												}`}
											>
												<Users className="w-4 h-4" />
											</div>
											<span className="font-medium">
												{project.assignedMembers.length} Üye
											</span>
										</div>
										<div className="flex items-center space-x-2">
											<div
												className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
													theme === "dark"
														? "bg-gradient-to-br from-emerald-600 to-green-600 text-white"
														: "bg-gradient-to-br from-emerald-500 to-green-500 text-white"
												}`}
											>
												<Target className="w-4 h-4" />
											</div>
											<span className="font-medium">
												{project.tasks.length} Görev
											</span>
										</div>
									</div>

									<div className="flex items-center space-x-2">
										{project.deadline && (
											<div
												className={`flex items-center space-x-1 text-xs px-3 py-1 rounded-full ${
													theme === "dark"
														? "bg-gray-700/50 text-gray-300"
														: "bg-gray-100/80 text-gray-600"
												}`}
											>
												<Calendar className="w-3 h-3" />
												<span>
													{new Date(project.deadline).toLocaleDateString(
														"tr-TR",
													)}
												</span>
											</div>
										)}
									</div>
								</div>

								{/* Hover effect overlay */}
								<div
									className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
										theme === "dark"
											? "bg-gradient-to-br from-indigo-600/5 to-purple-600/5"
											: "bg-gradient-to-br from-indigo-500/5 to-purple-500/5"
									}`}
								></div>
							</button>
						);
					})}
				</div>
			)}

			{/* Empty State */}
			{projects.length === 0 && (
				<div className="text-center py-16">
					<div
						className={`relative mx-auto mb-8 w-24 h-24 rounded-full flex items-center justify-center ${
							theme === "dark"
								? "bg-gradient-to-br from-gray-700 to-gray-800 shadow-2xl"
								: "bg-gradient-to-br from-white to-gray-100 shadow-2xl"
						}`}
					>
						<div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 opacity-20 animate-pulse"></div>
						<FolderOpen
							className={`w-10 h-10 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
						/>
					</div>
					<h3
						className={`text-2xl font-bold mb-3 ${
							theme === "dark" ? "text-gray-200" : "text-gray-800"
						}`}
					>
						Henüz proje yok
					</h3>
					<p
						className={`text-lg mb-6 max-w-md mx-auto ${
							theme === "dark" ? "text-gray-400" : "text-gray-600"
						}`}
					>
						İlk projenizi oluşturarak başlayın ve ekibinizle birlikte çalışmaya
						başlayın.
					</p>
					<button
						type="button"
						onClick={openCreateModal}
						className={`group relative flex items-center px-6 py-3 space-x-2 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 mx-auto ${
							theme === "dark"
								? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
								: "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
						}`}
					>
						<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						<Plus className="w-5 h-5 relative z-10" />
						<span className="relative z-10">İlk Projenizi Oluşturun</span>
					</button>
					<div
						className={`inline-block px-6 py-3 rounded-full text-sm font-medium mt-4 ${
							theme === "dark"
								? "bg-gray-800/50 text-gray-300 border border-gray-700"
								: "bg-white/80 text-gray-600 border border-gray-200"
						}`}
					>
						💡 İpucu: Projelerinizi kategorilere ayırarak daha iyi organize edin
					</div>
				</div>
			)}

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
		</div>
	);
}
