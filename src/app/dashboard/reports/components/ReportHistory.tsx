"use client";

import { Share2 } from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";
import type { Report } from "@/app/hooks/useReports";

interface ReportHistoryProps {
	reports: Report[];
	handleShareReport: (reportId: string) => void;
}

export default function ReportHistory({
	reports,
	handleShareReport,
}: ReportHistoryProps) {
	const { theme } = useTheme();

	return (
		<div className="space-y-4">
			<h3
				className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
			>
				📚 Geçmiş Raporlar
			</h3>
			<div className="space-y-3">
				{reports.slice(0, 5).map((report) => (
					<div
						key={report.id}
						className={`p-4 rounded-xl border transition-colors cursor-pointer ${
							theme === "dark"
								? "bg-gray-700/50 border-gray-600 hover:bg-gray-700/70"
								: "bg-white border-gray-200 hover:bg-gray-50"
						}`}
					>
						<h4
							className={`font-semibold text-sm mb-1 ${
								theme === "dark" ? "text-white" : "text-gray-900"
							}`}
						>
							{report.subject}
						</h4>
						<div className="flex items-center justify-between text-xs">
							<span
								className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
							>
								{report.recipientName}
							</span>
							<span
								className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
							>
								{report.createdAt.toLocaleDateString("tr-TR")}
							</span>
						</div>
						<div className="flex items-center justify-between mt-2">
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
				))}
			</div>
		</div>
	);
}
