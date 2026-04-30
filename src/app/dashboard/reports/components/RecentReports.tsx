"use client";

import { Clock, MoreVertical, Share2, User } from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";
import type { Report } from "@/app/hooks/useReports";

interface RecentReportsProps {
	reports: Report[];
	handleShareReport: (reportId: string) => void;
}

export default function RecentReports({
	reports,
	handleShareReport,
}: RecentReportsProps) {
	const { theme } = useTheme();

	return (
		<div className="h-1/2 p-4 overflow-y-auto">
			<div className="flex items-center justify-between mb-3">
				<h3
					className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
				>
					📋 Son Raporlar
				</h3>
				<button
					type="button"
					className={`p-2 rounded-lg transition-colors ${
						theme === "dark"
							? "hover:bg-gray-700 text-gray-400"
							: "hover:bg-gray-200 text-gray-500"
					}`}
				>
					<MoreVertical className="w-4 h-4" />
				</button>
			</div>

			<div className="space-y-3">
				{reports.slice(0, 3).map((report) => (
					<div
						key={report.id}
						className={`p-4 rounded-xl border transition-colors ${
							theme === "dark"
								? "bg-gray-700/50 border-gray-600 hover:bg-gray-700/70"
								: "bg-white border-gray-200 hover:bg-gray-50"
						}`}
					>
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<h4
									className={`font-semibold text-sm mb-1 ${
										theme === "dark" ? "text-white" : "text-gray-900"
									}`}
								>
									{report.subject}
								</h4>
								<div className="flex items-center space-x-3 text-xs">
									<div className="flex items-center space-x-1">
										<User className="w-3 h-3 text-gray-500" />
										<span
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-500"
											}
										>
											{report.recipientName}
										</span>
									</div>
									<div className="flex items-center space-x-1">
										<Clock className="w-3 h-3 text-gray-500" />
										<span
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-500"
											}
										>
											{report.createdAt.toLocaleDateString("tr-TR")}
										</span>
									</div>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								<span
									className={`px-2 py-1 rounded-full text-xs ${
										report.isRead
											? "bg-green-100 text-green-800"
											: "bg-yellow-100 text-yellow-800"
									}`}
								>
									{report.isRead ? "Okundu" : "Okunmadı"}
								</span>
								<button
									type="button"
									onClick={() => handleShareReport(report.id)}
									className={`p-1 rounded-lg transition-colors ${
										theme === "dark"
											? "hover:bg-gray-600 text-gray-400"
											: "hover:bg-gray-200 text-gray-500"
									}`}
								>
									<Share2 className="w-3 h-3" />
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
