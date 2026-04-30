"use client";

import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/app/contexts/ThemeContext";
import CreateTaskModal from "./CreateTaskModal";
import SearchBar from "./SearchBar";

interface HeaderProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	workspaceId: string;
	userId: string;
}

export default function Header({
	searchTerm,
	onSearchChange,
	workspaceId,
	userId,
}: HeaderProps) {
	const [isModalOpen, setModalOpen] = useState(false);
	const theme = useTheme();

	return (
		<>
			<div
				className={`backdrop-blur-xl border-b transition-all duration-300 ${
					theme.theme === "dark"
						? "bg-gray-900/95 text-white border-gray-700/50 shadow-lg"
						: "bg-white/95 text-gray-900 border-gray-200/50 shadow-lg"
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
						{/* Title Section */}
						<div className="flex items-center space-x-6">
							<div className="flex items-center space-x-3">
								<div
									className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
										theme.theme === "dark"
											? "bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25"
											: "bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25"
									}`}
								>
									<Calendar className="w-5 h-5 text-white" />
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
									onSearchChange={onSearchChange}
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

				{/* Decorative bottom border */}
				<div
					className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${
						theme.theme === "dark"
							? "from-transparent via-blue-500/50 to-transparent"
							: "from-transparent via-blue-400/50 to-transparent"
					}`}
				></div>
			</div>

			<CreateTaskModal
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
				workspaceId={workspaceId}
				userId={userId}
			/>
		</>
	);
}
