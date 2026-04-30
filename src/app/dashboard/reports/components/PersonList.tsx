"use client";

import { MessageCircle, Search } from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";
import type { Person } from "@/app/hooks/useReports";

interface PersonListProps {
	people: Person[];
	selectedPerson: string;
	setSelectedPerson: (personId: string) => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
}

export default function PersonList({
	people,
	selectedPerson,
	setSelectedPerson,
	searchQuery,
	setSearchQuery,
}: PersonListProps) {
	const { theme } = useTheme();

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<h3
					className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
				>
					👥 Kişiler
				</h3>
			</div>

			{/* Arama */}
			<div className="relative">
				<Search
					className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
						theme === "dark" ? "text-gray-400" : "text-gray-500"
					}`}
				/>
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Kişi ara..."
					className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-colors ${
						theme === "dark"
							? "bg-gray-700/50 border-gray-600 text-white focus:border-blue-500"
							: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
					} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
				/>
			</div>

			{/* Kişiler Listesi */}
			<div className="space-y-2">
				{people.map((person) => (
					<button
						type="button"
						key={person.id}
						onClick={() => setSelectedPerson(person.id)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								setSelectedPerson(person.id);
							}
						}}
						className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
							selectedPerson === person.id
								? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500"
								: theme === "dark"
									? "bg-gray-700/50 border-gray-600 hover:bg-gray-700/70"
									: "bg-white border-gray-200 hover:bg-gray-50"
						}`}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
										person.isOnline ? "bg-green-500" : "bg-gray-500"
									}`}
								>
									{person.name.charAt(0)}
								</div>
								<div>
									<h4
										className={`font-semibold text-sm ${
											theme === "dark" ? "text-white" : "text-gray-900"
										}`}
									>
										{person.name}
									</h4>
									<p
										className={`text-xs ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}
									>
										{person.role}
									</p>
								</div>
							</div>
							<div className="text-right">
								<div className="flex items-center space-x-1">
									<MessageCircle className="w-3 h-3 text-blue-500" />
									<span
										className={`text-xs font-semibold ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}
									>
										{person.reportCount}
									</span>
								</div>
								<p
									className={`text-xs ${
										theme === "dark" ? "text-gray-500" : "text-gray-400"
									}`}
								>
									{person.lastReportDate.toLocaleDateString("tr-TR")}
								</p>
							</div>
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
