export interface User {
	id: string;
	name: string;
	avatar: string;
	phone: string;
	role: string;
	isOnline: boolean;
	lastSeen: Date;
	bio?: string;
	location?: string;
}

export interface Message {
	id: string;
	senderId: string;
	receiverId: string;
	content: string;
	timestamp: Date;
	type: "text" | "image" | "file";
	isRead: boolean;
	attachments?: {
		name: string;
		url: string;
		type: string;
		size: number;
	}[];
}

export interface Conversation {
	id: string;
	participants: string[];
	lastMessage: Message;
	unreadCount: number;
	messages: Message[];
}

export interface MessageForm {
	content: string;
	type: "text" | "image" | "file";
	receiverId: string;
	attachments?: File[];
}
