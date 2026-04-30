import { useEffect, useState } from "react";
import { conversations } from "@/data/messages/conversations";
import { users } from "@/data/messages/users";

export function useMessages() {
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const [showUserDetails, setShowUserDetails] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [isMobile, setIsMobile] = useState(false);
	const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
	const [showMessageMenu, setShowMessageMenu] = useState<string | null>(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
	const [showMessageInfo, setShowMessageInfo] = useState<string | null>(null);
	const [pinnedMessages, setPinnedMessages] = useState<string[]>([]);
	const [showHeaderMenu, setShowHeaderMenu] = useState(false);
	const [showUserProfile, setShowUserProfile] = useState(false);
	const [isSelectMode, setIsSelectMode] = useState(false);
	const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
	const [showMuteOptions, setShowMuteOptions] = useState(false);
	const [showBackgroundOptions, setShowBackgroundOptions] = useState(false);

	const selectedUser = users.find((user) => user.id === selectedUserId);
	const selectedConversation = conversations.find((conv) =>
		conv.participants.includes(selectedUserId || ""),
	);

	const formatTime = (date: Date) => {
		return new Intl.DateTimeFormat("tr-TR", {
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	const formatLastSeen = (date: Date) => {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / (1000 * 60));
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (minutes < 1) return "Şimdi aktif";
		if (minutes < 60) return `${minutes} dakika önce aktifti`;
		if (hours < 24) return `${hours} saat önce aktifti`;
		return `${days} gün önce aktifti`;
	};

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			// Mesaj gönderme işlemi burada yapılacak
			setNewMessage("");
		}
	};

	const handleReplyMessage = (messageId: string) => {
		console.log("Mesaja cevap ver:", messageId);
		setShowMessageMenu(null);
	};

	const handleEditMessage = (messageId: string) => {
		console.log("Mesajı düzenle:", messageId);
		setShowMessageMenu(null);
	};

	const handleDeleteMessage = (messageId: string) => {
		console.log("Mesajı sil:", messageId);
		setShowMessageMenu(null);
	};

	const handleCopyMessage = (_messageId: string, content: string) => {
		navigator.clipboard.writeText(content);
		console.log("Mesaj kopyalandı:", content);
		setShowMessageMenu(null);
	};

	const handleForwardMessage = (messageId: string) => {
		console.log("Mesajı ilet:", messageId);
		setShowMessageMenu(null);
	};

	const handlePinMessage = (messageId: string) => {
		if (pinnedMessages.includes(messageId)) {
			setPinnedMessages(pinnedMessages.filter((id) => id !== messageId));
			console.log("Mesaj sabitlemesi kaldırıldı:", messageId);
		} else {
			setPinnedMessages([...pinnedMessages, messageId]);
			console.log("Mesaj sabitlendi:", messageId);
		}
		setShowMessageMenu(null);
	};

	const handleMessageInfo = (messageId: string) => {
		setShowMessageInfo(messageId);
		setShowMessageMenu(null);
	};

	const handleAddEmoji = (messageId: string, emoji: string) => {
		console.log("Emoji eklendi:", messageId, emoji);
		setShowEmojiPicker(null);
	};

	const handleSelectMessage = (messageId: string) => {
		if (selectedMessages.includes(messageId)) {
			setSelectedMessages(selectedMessages.filter((id) => id !== messageId));
		} else {
			setSelectedMessages([...selectedMessages, messageId]);
		}
	};

	const handleDeleteSelected = () => {
		console.log("Seçili mesajları sil:", selectedMessages);
		setSelectedMessages([]);
		setIsSelectMode(false);
	};

	const handleForwardSelected = () => {
		console.log("Seçili mesajları ilet:", selectedMessages);
		setSelectedMessages([]);
		setIsSelectMode(false);
	};

	const handleDownloadSelected = () => {
		console.log("Seçili mesajları indir:", selectedMessages);
		setSelectedMessages([]);
		setIsSelectMode(false);
	};

	const handleMuteChat = (duration: string) => {
		console.log("Sohbeti sessize al:", duration);
		setShowMuteOptions(false);
		setShowHeaderMenu(false);
	};

	const handleBlockUser = () => {
		console.log("Kullanıcıyı engelle");
		setShowHeaderMenu(false);
	};

	const handleClearChat = () => {
		console.log("Sohbeti temizle");
		setShowHeaderMenu(false);
	};

	const handleChangeBackground = (background: string) => {
		console.log("Arka planı değiştir:", background);
		setShowBackgroundOptions(false);
		setShowHeaderMenu(false);
	};

	// Menü dışına tıklandığında kapat
	useEffect(() => {
		const handleClickOutside = () => {
			setShowMessageMenu(null);
		};

		if (showMessageMenu) {
			document.addEventListener("click", handleClickOutside);
		}

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [showMessageMenu]);

	return {
		// State
		selectedUserId,
		setSelectedUserId,
		showUserDetails,
		setShowUserDetails,
		newMessage,
		setNewMessage,
		isMobile,
		setIsMobile,
		hoveredMessageId,
		setHoveredMessageId,
		showMessageMenu,
		setShowMessageMenu,
		showEmojiPicker,
		setShowEmojiPicker,
		showMessageInfo,
		setShowMessageInfo,
		pinnedMessages,
		setPinnedMessages,
		showHeaderMenu,
		setShowHeaderMenu,
		showUserProfile,
		setShowUserProfile,
		isSelectMode,
		setIsSelectMode,
		selectedMessages,
		setSelectedMessages,
		showMuteOptions,
		setShowMuteOptions,
		showBackgroundOptions,
		setShowBackgroundOptions,

		// Computed
		selectedUser,
		selectedConversation,

		// Functions
		formatTime,
		formatLastSeen,
		handleSendMessage,
		handleReplyMessage,
		handleEditMessage,
		handleDeleteMessage,
		handleCopyMessage,
		handleForwardMessage,
		handlePinMessage,
		handleMessageInfo,
		handleAddEmoji,
		handleSelectMessage,
		handleDeleteSelected,
		handleForwardSelected,
		handleDownloadSelected,
		handleMuteChat,
		handleBlockUser,
		handleClearChat,
		handleChangeBackground,
	};
}
