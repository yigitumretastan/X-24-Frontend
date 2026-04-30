"use client";

import {
	Activity,
	BarChart3,
	Calendar,
	CheckCircle,
	ChevronRight,
	Clock,
	FileText,
	MessageSquare,
	Settings,
	TrendingUp,
	Users,
} from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useDashboard } from "@/app/hooks/useDashboard";
import TimeTracker from "./TimeTracker";

export default function DashboardComponent() {
	const {
		workspace,
		loading,
		error,
		stats,
		recentActivities,
		quickActions,
		handleQuickAction,
	} = useDashboard();

	const { theme } = useTheme();

	if (loading) {
		return (
			<main
				className={`min-h-screen flex items-center justify-center p-8 ${
					theme === "dark"
						? "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"
						: "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
				}`}
			>
				<div className="text-center">
					<div
						className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4 ${
							theme === "dark"
								? "border-gray-700 border-t-indigo-400"
								: "border-indigo-200 border-t-indigo-600"
						}`}
					></div>
					<p
						className={`text-lg font-medium ${
							theme === "dark" ? "text-gray-300" : "text-gray-600"
						}`}
					>
						Yönlendiriliyor...
					</p>
				</div>
			</main>
		);
	}

	if (!workspace) {
		return null;
	}

	const getIconComponent = (iconName: string) => {
		const icons: {
			[key: string]: React.ComponentType<{ className?: string }>;
		} = {
			CheckCircle,
			Calendar,
			MessageSquare,
			BarChart3,
			FileText,
		};
		return icons[iconName] || CheckCircle;
	};

	return (
		<main
			className={`min-h-screen p-6 ${
				theme === "dark"
					? "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"
					: "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
			}`}
		>
			<div className="max-w-7xl mx-auto">
				{/* Header Section */}
				<div className="mb-8">
					<div
						className={`backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${
							theme === "dark"
								? "bg-gray-800/80 border-gray-700/50"
								: "bg-white/80 border-white/20"
						}`}
					>
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
									Hoş Geldiniz! 👋
								</h1>
								<p
									className={`text-xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
								>
									<span className="font-semibold text-indigo-600">
										{workspace.name}
									</span>{" "}
									workspace&apos;inde çalışıyorsunuz
									{workspace.platform && (
										<span
											className={
												theme === "dark" ? "text-gray-500" : "text-gray-400"
											}
										>
											{" "}
											• {workspace.platform}
										</span>
									)}
								</p>
							</div>
							<div className="hidden md:flex items-center space-x-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-indigo-600">
										{stats.completedTasks}
									</div>
									<div
										className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
									>
										Aktif Görev
									</div>
								</div>
								<div
									className={`w-px h-12 ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"}`}
								></div>
								<div className="text-center">
									<div className="text-2xl font-bold text-emerald-600">85%</div>
									<div
										className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
									>
										Tamamlanan
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Error Display */}
				{error && (
					<div className="bg-red-50 border border-red-200 text-red-800 p-4 mb-6 rounded-lg">
						{error}
					</div>
				)}

				{/* Quick Actions */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
					{quickActions.map((action) => {
						const IconComponent = getIconComponent(action.icon);
						return (
							<button
								type="button"
								key={action.id}
								onClick={() => handleQuickAction(action.route)}
								className={`bg-gradient-to-r ${action.gradient} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group`}
							>
								<IconComponent className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
								<div className="text-left">
									<div className="font-semibold">{action.title}</div>
									<div className="text-sm opacity-90">{action.description}</div>
								</div>
							</button>
						);
					})}
				</div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
					{/* Left Column - Stats Cards */}
					<div className="lg:col-span-2 space-y-6">
						{/* Stats Row */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div
								className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
									theme === "dark"
										? "bg-gray-800/80 border-gray-700/50"
										: "bg-white/80 border-white/20"
								}`}
							>
								<div className="flex items-center justify-between">
									<div>
										<p
											className={`text-sm font-medium ${
												theme === "dark" ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Toplam Proje
										</p>
										<p
											className={`text-3xl font-bold ${
												theme === "dark" ? "text-white" : "text-gray-900"
											}`}
										>
											{stats.totalProjects}
										</p>
										<p className="text-sm text-emerald-600 flex items-center mt-1">
											<TrendingUp className="w-4 h-4 mr-1" />
											{stats.projectsGrowth} bu ay
										</p>
									</div>
									<div
										className={`w-12 h-12 rounded-xl flex items-center justify-center ${
											theme === "dark" ? "bg-blue-900/50" : "bg-blue-100"
										}`}
									>
										<FileText className="w-6 h-6 text-blue-600" />
									</div>
								</div>
							</div>

							<div
								className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
									theme === "dark"
										? "bg-gray-800/80 border-gray-700/50"
										: "bg-white/80 border-white/20"
								}`}
							>
								<div className="flex items-center justify-between">
									<div>
										<p
											className={`text-sm font-medium ${
												theme === "dark" ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Aktif Üye
										</p>
										<p
											className={`text-3xl font-bold ${
												theme === "dark" ? "text-white" : "text-gray-900"
											}`}
										>
											{stats.activeMembers}
										</p>
										<p className="text-sm text-emerald-600 flex items-center mt-1">
											<Users className="w-4 h-4 mr-1" />
											{stats.membersGrowth} yeni üye
										</p>
									</div>
									<div
										className={`w-12 h-12 rounded-xl flex items-center justify-center ${
											theme === "dark" ? "bg-emerald-900/50" : "bg-emerald-100"
										}`}
									>
										<Users className="w-6 h-6 text-emerald-600" />
									</div>
								</div>
							</div>

							<div
								className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
									theme === "dark"
										? "bg-gray-800/80 border-gray-700/50"
										: "bg-white/80 border-white/20"
								}`}
							>
								<div className="flex items-center justify-between">
									<div>
										<p
											className={`text-sm font-medium ${
												theme === "dark" ? "text-gray-400" : "text-gray-500"
											}`}
										>
											Bu Hafta
										</p>
										<p
											className={`text-3xl font-bold ${
												theme === "dark" ? "text-white" : "text-gray-900"
											}`}
										>
											{stats.weeklyHours}h
										</p>
										<p className="text-sm text-purple-600 flex items-center mt-1">
											<Clock className="w-4 h-4 mr-1" />
											Çalışma saati
										</p>
									</div>
									<div
										className={`w-12 h-12 rounded-xl flex items-center justify-center ${
											theme === "dark" ? "bg-purple-900/50" : "bg-purple-100"
										}`}
									>
										<Activity className="w-6 h-6 text-purple-600" />
									</div>
								</div>
							</div>
						</div>

						{/* Recent Activity */}
						<div
							className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
								theme === "dark"
									? "bg-gray-800/80 border-gray-700/50"
									: "bg-white/80 border-white/20"
							}`}
						>
							<h3
								className={`text-lg font-semibold mb-4 ${
									theme === "dark" ? "text-white" : "text-gray-900"
								}`}
							>
								Son Aktiviteler
							</h3>
							<div className="space-y-4">
								{recentActivities.map((activity) => (
									<div
										key={activity.id}
										className="flex items-center space-x-4"
									>
										<div
											className={`w-10 h-10 rounded-full flex items-center justify-center ${
												theme === "dark"
													? `bg-${activity.color}-900/50`
													: `bg-${activity.color}-100`
											}`}
										>
											{activity.type === "task" && (
												<CheckCircle
													className={`w-5 h-5 text-${activity.color}-600`}
												/>
											)}
											{activity.type === "member" && (
												<Users
													className={`w-5 h-5 text-${activity.color}-600`}
												/>
											)}
											{activity.type === "message" && (
												<MessageSquare
													className={`w-5 h-5 text-${activity.color}-600`}
												/>
											)}
										</div>
										<div className="flex-1">
											<p
												className={`text-sm font-medium ${
													theme === "dark" ? "text-white" : "text-gray-900"
												}`}
											>
												{activity.title}
											</p>
											<p
												className={`text-xs ${
													theme === "dark" ? "text-gray-400" : "text-gray-500"
												}`}
											>
												{activity.timestamp}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Right Column - Sidebar */}
					<div className="space-y-6">
						{/* Quick Settings */}
						<div
							className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
								theme === "dark"
									? "bg-gray-800/80 border-gray-700/50"
									: "bg-white/80 border-white/20"
							}`}
						>
							<h3
								className={`text-lg font-semibold mb-4 ${
									theme === "dark" ? "text-white" : "text-gray-900"
								}`}
							>
								Hızlı Ayarlar
							</h3>
							<div className="space-y-3">
								<button
									type="button"
									className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
										theme === "dark"
											? "hover:bg-gray-700/50"
											: "hover:bg-gray-50"
									}`}
								>
									<div className="flex items-center space-x-3">
										<Settings
											className={`w-5 h-5 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}
										/>
										<span
											className={`text-sm font-medium ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Workspace Ayarları
										</span>
									</div>
									<ChevronRight
										className={`w-4 h-4 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}
									/>
								</button>
								<button
									type="button"
									className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
										theme === "dark"
											? "hover:bg-gray-700/50"
											: "hover:bg-gray-50"
									}`}
								>
									<div className="flex items-center space-x-3">
										<Users
											className={`w-5 h-5 ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}
										/>
										<span
											className={`text-sm font-medium ${
												theme === "dark" ? "text-gray-300" : "text-gray-700"
											}`}
										>
											Üye Yönetimi
										</span>
									</div>
									<ChevronRight
										className={`w-4 h-4 ${
											theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}
									/>
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Time Tracker Section - Bottom */}
				<div
					className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${
						theme === "dark"
							? "bg-gray-800/80 border-gray-700/50"
							: "bg-white/80 border-white/20"
					}`}
				>
					<h3
						className={`text-lg font-semibold mb-4 ${
							theme === "dark" ? "text-white" : "text-gray-900"
						}`}
					>
						Zaman Takibi
					</h3>
					<TimeTracker />
				</div>
			</div>
		</main>
	);
}
