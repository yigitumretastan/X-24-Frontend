"use client";

import { MoreVertical, Phone, SearchIcon, Video } from "lucide-react";
import { type DragEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSignalR } from "@/app/contexts/SignalRContext";

interface Message {
	id: string;
	content: string;
	senderId: string;
	senderName: string;
	sentAt: string;
	mediaUrl?: string;
	mediaType?: string;
	fileName?: string;
	workspaceId: string;
	// Frontend için uyumluluk
	text?: string;
	sender?: "user" | "other";
	timestamp?: string;
}

interface MessageListProps {
	selectedUser: string | null;
	workspaceId?: string;
}

export default function MessageList({
	selectedUser,
	workspaceId,
}: MessageListProps) {
	const [newMessage, setNewMessage] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [dragActive, setDragActive] = useState(false);
	const [localMessages, setLocalMessages] = useState<Message[]>([]);
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const { user } = useAuth();
	const {
		isConnected,
		messages,
		typingUsers,
		connectToWorkspace,
		sendMessage: sendSignalRMessage,
		startTyping,
		stopTyping,
	} = useSignalR();

	useEffect(() => {
		if (selectedUser === "notlarim") {
			const saved = localStorage.getItem("personal_notes");
			setLocalMessages(saved ? JSON.parse(saved) : []);
			return;
		}

		if (!selectedUser || !workspaceId || !user) return;

		// SignalR workspace'e bağlan
		connectToWorkspace(workspaceId);
	}, [selectedUser, workspaceId, user, connectToWorkspace]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedUser || (!newMessage.trim() && !selectedFile)) return;

		if (selectedUser === "notlarim") {
			// Notlar için eski sistemi kullan
			const message: Message = {
				id: Date.now().toString(),
				content: newMessage,
				text: newMessage,
				sender: "user",
				senderId: user?.id || "",
				senderName: "Sen",
				sentAt: new Date().toISOString(),
				timestamp: new Date().toLocaleTimeString("tr-TR", {
					hour: "2-digit",
					minute: "2-digit",
				}),
				mediaUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
				fileName: selectedFile?.name,
				workspaceId: "",
			};

			setLocalMessages((prev) => {
				const updated = [...prev, message];
				localStorage.setItem("personal_notes", JSON.stringify(updated));
				return updated;
			});
		} else {
			// SignalR ile mesaj gönder
			if (!workspaceId || !user?.id) {
				alert("Bağlantı hatası. Lütfen sayfayı yenileyin.");
				return;
			}

			try {
				let mediaUrl: string | undefined;
				let mediaType: string | undefined;

				if (selectedFile) {
					mediaUrl = URL.createObjectURL(selectedFile);
					mediaType = selectedFile.type;
				}

				await sendSignalRMessage(workspaceId, newMessage, mediaUrl, mediaType);

				// Yazma durumunu durdur
				if (typingTimeoutRef.current) {
					clearTimeout(typingTimeoutRef.current);
				}
				await stopTyping(workspaceId);
			} catch (error) {
				console.error("Mesaj gönderme hatası:", error);
				alert("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
			}
		}

		setNewMessage("");
		setSelectedFile(null);
	};

	// Yazma durumu yönetimi
	const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewMessage(e.target.value);

		if (selectedUser !== "notlarim" && workspaceId) {
			try {
				await startTyping(workspaceId);

				if (typingTimeoutRef.current) {
					clearTimeout(typingTimeoutRef.current);
				}

				typingTimeoutRef.current = setTimeout(async () => {
					await stopTyping(workspaceId);
				}, 3000);
			} catch (error) {
				console.error("Yazma durumu hatası:", error);
			}
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			setSelectedFile(e.target.files[0]);
		}
	};

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragActive(true);
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragActive(false);
		if (e.dataTransfer.files?.[0]) {
			setSelectedFile(e.dataTransfer.files[0]);
		}
	};

	if (!selectedUser) {
		return (
			<div className="h-full flex items-center justify-center bg-gray-900 text-white">
				{/* Background image kaldırıldı */}
			</div>
		);
	}

	return (
		<section
			className={`h-full flex flex-col relative ${dragActive ? "bg-blue-50" : "bg-gray-800"}`}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			aria-label="Mesaj listesi ve dosya yükleme alanı"
		>
			{/* 🧠 Sabit Başlık */}
			<div className="border-b border-gray-600 p-4 bg-gray-900">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
							<span className="text-sm font-medium text-white">
								{selectedUser === "notlarim"
									? "N"
									: selectedUser
											?.split(" ")
											.map((n) => n[0])
											.join("")}
							</span>
						</div>
						<div>
							<h2 className="text-lg font-semibold text-white">
								{selectedUser === "notlarim" ? "Notlarım" : selectedUser}
							</h2>
							{selectedUser !== "notlarim" && (
								<p
									className={`text-sm flex items-center gap-2 ${
										isConnected ? "text-green-400" : "text-red-400"
									}`}
								>
									<span
										className={`w-2 h-2 rounded-full ${
											isConnected ? "bg-green-400" : "bg-red-400"
										}`}
									></span>
									{isConnected ? "Çevrimiçi" : "Bağlantı Yok"}
								</p>
							)}
						</div>
					</div>

					{/* 🔔 Arama ve Diğer Butonlar */}
					{selectedUser && selectedUser !== "notlarim" && (
						<div className="flex items-center space-x-2">
							<button
								type="button"
								className="p-2 rounded-full hover:bg-gray-700 transition-colors"
								title="Ara"
							>
								<SearchIcon size={20} className="text-white" />
							</button>
							<button
								type="button"
								className="p-2 rounded-full hover:bg-gray-700 transition-colors"
								title="Sesli Arama"
							>
								<Phone size={20} className="text-white" />
							</button>
							<button
								type="button"
								className="p-2 rounded-full hover:bg-gray-700 transition-colors"
								title="Görüntülü Arama"
							>
								<Video size={20} className="text-white" />
							</button>
							<button
								type="button"
								className="p-2 rounded-full hover:bg-gray-700 transition-colors"
								title="Menü"
							>
								<MoreVertical size={20} className="text-white" />
							</button>
						</div>
					)}

					{/* Notlarım için butonlar */}
					{selectedUser === "notlarim" && (
						<div className="flex items-center space-x-2">
							<button
								type="button"
								className="p-2 rounded-full hover:bg-gray-700 transition-colors"
								title="Notları Ara"
							>
								<SearchIcon size={20} className="text-white" />
							</button>
							<button
								type="button"
								className="p-2 rounded-full hover:bg-gray-700 transition-colors"
								title="Menü"
							>
								<MoreVertical size={20} className="text-white" />
							</button>
						</div>
					)}
				</div>
			</div>

			{/* 🗨️ Mesaj Alanı */}
			<div
				className="flex-1 overflow-y-auto p-4 space-y-4 text-white"
				style={{
					marginTop: "73px", // Header yüksekliği kadar
					marginBottom: "80px", // Footer yüksekliği kadar
				}}
			>
				{(selectedUser === "notlarim" ? localMessages : messages).map(
					(message) => {
						const isUserMessage = message.senderId === user?.id;
						const displayTime =
							message.timestamp ||
							new Date(message.sentAt).toLocaleTimeString("tr-TR", {
								hour: "2-digit",
								minute: "2-digit",
							});

						return (
							<div
								key={message.id}
								className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}
							>
								<div
									className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
										isUserMessage
											? "bg-blue-500 text-white"
											: "bg-gray-700 text-white"
									}`}
								>
									<p className="text-sm whitespace-pre-wrap">
										{message.text || message.content}
									</p>
									{(message.mediaUrl || message.fileName) && (
										<a
											href={message.mediaUrl}
											download={message.fileName}
											className="text-sm underline block mt-2"
											target="_blank"
											rel="noreferrer"
										>
											📎 {message.fileName}
										</a>
									)}
									<p className="text-xs mt-1 text-right opacity-75">
										{displayTime}
									</p>
								</div>
							</div>
						);
					},
				)}

				{/* Yazma durumu göstergesi */}
				{selectedUser !== "notlarim" && typingUsers.length > 0 && (
					<div className="flex justify-start">
						<div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
							<p className="text-sm opacity-75">
								{typingUsers.length === 1
									? "Birisi yazıyor..."
									: `${typingUsers.length} kişi yazıyor...`}
							</p>
						</div>
					</div>
				)}
			</div>

			{/* 📝 Sabit Mesaj Barı */}
			<div className="border-t border-gray-600 p-4 bg-gray-900">
				<form
					onSubmit={handleSendMessage}
					className="flex items-center space-x-3"
				>
					<label
						className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
						title="Dosya Ekle"
					>
						📎
						<input type="file" onChange={handleFileChange} className="hidden" />
					</label>
					<input
						type="text"
						value={newMessage}
						onChange={handleInputChange}
						placeholder={
							selectedUser === "notlarim"
								? "Not ekleyin..."
								: "Mesajınızı yazın..."
						}
						className="flex-1 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800"
					/>
					<button
						type="submit"
						disabled={!isConnected && selectedUser !== "notlarim"}
						className={`px-6 py-2 text-white rounded-lg transition-colors ${
							!isConnected && selectedUser !== "notlarim"
								? "bg-gray-500 cursor-not-allowed"
								: "bg-blue-500 hover:bg-blue-600"
						}`}
					>
						Gönder
					</button>
				</form>
				{selectedFile && (
					<div className="text-sm text-gray-400 mt-2">
						Eklenen dosya: <strong>{selectedFile.name}</strong>
					</div>
				)}
			</div>
		</section>
	);
}
