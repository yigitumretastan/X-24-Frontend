"use client";

import { Edit3, Filter, History, User } from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useReports } from "@/app/hooks/useReports";
import FilterPanel from "./components/FilterPanel";
import PersonList from "./components/PersonList";
import RecentReports from "./components/RecentReports";
import ReportEditor from "./components/ReportEditor";
import ReportHistory from "./components/ReportHistory";
// Components
import ReportsLayout from "./layout/ReportsLayout";

export default function ReportsPage() {
	const { theme } = useTheme();
	const {
		// State
		topSidebarActive,
		setTopSidebarActive,
		bottomSidebarActive,
		setBottomSidebarActive,
		selectedPerson,
		setSelectedPerson,
		searchQuery,
		setSearchQuery,
		subject,
		setSubject,
		content,
		setContent,
		attachments,

		// Refs
		fileInputRef,
		contentRef,

		// Data
		reports,
		filteredPeople,

		// Handlers
		handleFileUpload,
		removeAttachment,
		formatText,
		handleSendReport,
		handleSaveDraft,
		handleShareReport,
	} = useReports();

	return (
		<ReportsLayout>
			{/* Main Layout - 2 Kutucuk */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
				{/* ÜST KUTUCUK - Rapor Yazma */}
				<div
					className={`backdrop-blur-sm rounded-3xl shadow-xl border overflow-hidden ${
						theme === "dark"
							? "bg-gray-800/80 border-gray-700/50"
							: "bg-white/80 border-white/20"
					}`}
				>
					<div className="flex h-full">
						{/* Top Sidebar */}
						<div
							className={`w-16 flex flex-col items-center py-4 border-r ${
								theme === "dark"
									? "bg-gray-700/50 border-gray-600"
									: "bg-gray-50 border-gray-200"
							}`}
						>
							<button
								type="button"
								onClick={() => setTopSidebarActive("write")}
								className={`p-3 rounded-xl mb-3 transition-all duration-200 ${
									topSidebarActive === "write"
										? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
										: theme === "dark"
											? "text-gray-400 hover:bg-gray-600 hover:text-white"
											: "text-gray-600 hover:bg-gray-200"
								}`}
							>
								<Edit3 className="w-5 h-5" />
							</button>
							<button
								type="button"
								onClick={() => setTopSidebarActive("history")}
								className={`p-3 rounded-xl transition-all duration-200 ${
									topSidebarActive === "history"
										? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
										: theme === "dark"
											? "text-gray-400 hover:bg-gray-600 hover:text-white"
											: "text-gray-600 hover:bg-gray-200"
								}`}
							>
								<History className="w-5 h-5" />
							</button>
						</div>

						{/* Top Main Content */}
						<div className="flex-1 p-6 overflow-y-auto">
							{topSidebarActive === "write" && (
								<ReportEditor
									subject={subject}
									setSubject={setSubject}
									content={content}
									setContent={setContent}
									attachments={attachments}
									fileInputRef={fileInputRef}
									contentRef={contentRef}
									handleFileUpload={handleFileUpload}
									removeAttachment={removeAttachment}
									formatText={formatText}
									handleSaveDraft={handleSaveDraft}
									handleSendReport={handleSendReport}
								/>
							)}

							{topSidebarActive === "history" && (
								<ReportHistory
									reports={reports}
									handleShareReport={handleShareReport}
								/>
							)}
						</div>
					</div>
				</div>

				{/* ALT KUTUCUK - Kişiler ve Son Raporlar */}
				<div
					className={`backdrop-blur-sm rounded-3xl shadow-xl border overflow-hidden ${
						theme === "dark"
							? "bg-gray-800/80 border-gray-700/50"
							: "bg-white/80 border-white/20"
					}`}
				>
					<div className="flex h-full">
						{/* Bottom Sidebar */}
						<div
							className={`w-16 flex flex-col items-center py-4 border-r ${
								theme === "dark"
									? "bg-gray-700/50 border-gray-600"
									: "bg-gray-50 border-gray-200"
							}`}
						>
							<button
								type="button"
								onClick={() => setBottomSidebarActive("people")}
								className={`p-3 rounded-xl mb-3 transition-all duration-200 ${
									bottomSidebarActive === "people"
										? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
										: theme === "dark"
											? "text-gray-400 hover:bg-gray-600 hover:text-white"
											: "text-gray-600 hover:bg-gray-200"
								}`}
							>
								<User className="w-5 h-5" />
							</button>
							<button
								type="button"
								onClick={() => setBottomSidebarActive("filters")}
								className={`p-3 rounded-xl transition-all duration-200 ${
									bottomSidebarActive === "filters"
										? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
										: theme === "dark"
											? "text-gray-400 hover:bg-gray-600 hover:text-white"
											: "text-gray-600 hover:bg-gray-200"
								}`}
							>
								<Filter className="w-5 h-5" />
							</button>
						</div>

						{/* Bottom Main Content */}
						<div className="flex-1 flex flex-col">
							{/* Bottom Sidebar Content */}
							<div
								className={`h-1/2 p-4 border-b overflow-y-auto ${
									theme === "dark" ? "border-gray-600" : "border-gray-200"
								}`}
							>
								{bottomSidebarActive === "people" && (
									<PersonList
										people={filteredPeople}
										selectedPerson={selectedPerson}
										setSelectedPerson={setSelectedPerson}
										searchQuery={searchQuery}
										setSearchQuery={setSearchQuery}
									/>
								)}

								{bottomSidebarActive === "filters" && <FilterPanel />}
							</div>

							{/* Son Raporlar */}
							<RecentReports
								reports={reports}
								handleShareReport={handleShareReport}
							/>
						</div>
					</div>
				</div>
			</div>
		</ReportsLayout>
	);
}
