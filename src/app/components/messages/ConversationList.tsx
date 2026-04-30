"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/app/contexts/ThemeContext";
import { conversations } from "@/data/messages/conversations";
import { users } from "@/data/messages/users";

interface ConversationListProps {
	selectedUserId: string | null;
	setSelectedUserId: (id: string | null) => void;
	formatTime: (date: Date) => string;
	isMobile: boolean;
}

export default function ConversationList({
	selectedUserId,
	setSelectedUserId,
	formatTime,
	isMobile,
}: ConversationListProps) {
	const { theme } = useTheme();

	return (
		<div
			className={`${isMobile && selectedUserId ? "hidden" : "flex"} w-80 flex-col border-r backdrop-blur-sm ${
				theme === "dark"
					? "bg-gray-800/80 border-gray-700/50"
					: "bg-white/80 border-gray-200/50"
			}`}
		>
			{/* Header */}
			<div className="p-6 border-b border-gray-700/30">
				<h1
					className={`text-2xl font-bold mb-4 ${
						theme === "dark" ? "text-white" : "text-gray-900"
					}`}
				>
					💬 Mesajlar
				</h1>

				{/* Arama */}
				<div className="relative">
					<Search
						className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
							theme === "dark" ? "text-gray-400" : "text-gray-500"
						}`}
					/>
					<input
						type="text"
						placeholder="Kişi ara..."
						className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors ${
							theme === "dark"
								? "bg-gray-700/50 border-gray-600 text-white focus:border-blue-500"
								: "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
						} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
					/>
				</div>
			</div>

			{/* Konuşma Listesi */}
			<div className="flex-1 overflow-y-auto p-4 space-y-2">
				{conversations.map((conversation) => {
					const otherUserId = conversation.participants.find(
						(id) => id !== "current_user",
					);
					const user = users.find((u) => u.id === otherUserId);
					if (!user) return null;

					return (
						<button
							type="button"
							key={conversation.id}
							onClick={() => setSelectedUserId(user.id)}
							className={`w-full text-left p-4 rounded-xl cursor-pointer transition-all duration-200 ${
								selectedUserId === user.id
									? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"
									: theme === "dark"
										? "hover:bg-gray-700/50 border border-gray-700/20"
										: "hover:bg-gray-50 border border-gray-200/30"
							}`}
						>
							<div className="flex items-center space-x-3">
								<div className="relative w-12 h-12">
									<Image
										src={user.avatar}
										alt={user.name}
										fill
										className="rounded-full object-cover"
									/>
									{user.isOnline && (
										<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800 z-10"></div>
									)}
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between">
										<h3
											className={`font-semibold truncate ${
												theme === "dark" ? "text-white" : "text-gray-900"
											}`}
										>
											{user.name}
										</h3>
										<span
											className={`text-xs ${
												theme === "dark" ? "text-gray-400" : "text-gray-500"
											}`}
										>
											{formatTime(conversation.lastMessage.timestamp)}
										</span>
									</div>

									<div className="flex items-center justify-between mt-1">
										<p
											className={`text-sm truncate ${
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}`}
										>
											{conversation.lastMessage.content}
										</p>
										{conversation.unreadCount > 0 && (
											<span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
												{conversation.unreadCount}
											</span>
										)}
									</div>
								</div>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
