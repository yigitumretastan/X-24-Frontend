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

// Örnek mesajlar
export const conversations: Conversation[] = [
	{
		id: "conv_1",
		participants: ["current_user", "1"], // current_user ve Ahmet Yılmaz
		unreadCount: 2,
		lastMessage: {
			id: "msg_15",
			senderId: "1",
			receiverId: "current_user",
			content: "Proje toplantısı için hazır mısın?",
			timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 dakika önce
			type: "text",
			isRead: false,
		},
		messages: [
			{
				id: "msg_1",
				senderId: "current_user",
				receiverId: "1",
				content: "Merhaba Ahmet, proje durumu nasıl?",
				timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
				type: "text",
				isRead: true,
			},
			{
				id: "msg_2",
				senderId: "1",
				receiverId: "current_user",
				content:
					"Merhaba! Proje planlandığı gibi ilerliyor. Bu hafta frontend kısmını bitirmeyi hedefliyoruz.",
				timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
				type: "text",
				isRead: true,
			},
			{
				id: "msg_3",
				senderId: "current_user",
				receiverId: "1",
				content: "Harika! Backend API'ları da hazır mı?",
				timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
				type: "text",
				isRead: true,
			},
			{
				id: "msg_14",
				senderId: "1",
				receiverId: "current_user",
				content:
					"Evet, Mehmet'in hazırladığı API'lar test edildi. Yarın deployment yapabiliriz.",
				timestamp: new Date(Date.now() - 30 * 60 * 1000),
				type: "text",
				isRead: true,
			},
			{
				id: "msg_15",
				senderId: "1",
				receiverId: "current_user",
				content: "Proje toplantısı için hazır mısın?",
				timestamp: new Date(Date.now() - 5 * 60 * 1000),
				type: "text",
				isRead: false,
			},
		],
	},
	{
		id: "conv_2",
		participants: ["current_user", "2"], // current_user ve Ayşe Kaya
		unreadCount: 0,
		lastMessage: {
			id: "msg_8",
			senderId: "current_user",
			receiverId: "2",
			content: "Teşekkürler, tasarımlar çok güzel olmuş!",
			timestamp: new Date(Date.now() - 45 * 60 * 1000),
			type: "text",
			isRead: true,
		},
		messages: [
			{
				id: "msg_4",
				senderId: "2",
				receiverId: "current_user",
				content: "Yeni tasarım mockup'larını hazırladım. İnceleyebilir misin?",
				timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
				type: "text",
				isRead: true,
			},
			{
				id: "msg_5",
				senderId: "2",
				receiverId: "current_user",
				content: "Dosyaları paylaşıyorum.",
				timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
				type: "file",
				isRead: true,
				attachments: [
					{
						name: "dashboard_mockup.figma",
						url: "#",
						type: "application/figma",
						size: 2048000,
					},
				],
			},
			{
				id: "msg_6",
				senderId: "current_user",
				receiverId: "2",
				content: "Harika görünüyor! Özellikle renk paleti çok başarılı.",
				timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
				type: "text",
				isRead: true,
			},
			{
				id: "msg_7",
				senderId: "2",
				receiverId: "current_user",
				content:
					"Teşekkürler! Kullanıcı deneyimini ön planda tutmaya çalıştım.",
				timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
				type: "text",
				isRead: true,
			},
			{
				id: "msg_8",
				senderId: "current_user",
				receiverId: "2",
				content: "Teşekkürler, tasarımlar çok güzel olmuş!",
				timestamp: new Date(Date.now() - 45 * 60 * 1000),
				type: "text",
				isRead: true,
			},
		],
	},
	{
		id: "conv_3",
		participants: ["current_user", "3"], // current_user ve Mehmet Demir
		unreadCount: 1,
		lastMessage: {
			id: "msg_12",
			senderId: "3",
			receiverId: "current_user",
			content: "API dokümantasyonunu güncelledim.",
			timestamp: new Date(Date.now() - 20 * 60 * 1000),
			type: "text",
			isRead: false,
		},
		messages: [
			{
				id: "msg_9",
				senderId: "current_user",
				receiverId: "3",
				content: "Mehmet, authentication API'sında bir sorun var mı?",
				timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
				type: "text",
				isRead: true,
			},
			{
				id: "msg_10",
				senderId: "3",
				receiverId: "current_user",
				content: "Hangi endpoint'te sorun yaşıyorsun? Log'ları kontrol edeyim.",
				timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
				type: "text",
				isRead: true,
			},
			{
				id: "msg_11",
				senderId: "current_user",
				receiverId: "3",
				content: "Login endpoint'inde token refresh işlemi çalışmıyor.",
				timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
				type: "text",
				isRead: true,
			},
			{
				id: "msg_12",
				senderId: "3",
				receiverId: "current_user",
				content: "API dokümantasyonunu güncelledim.",
				timestamp: new Date(Date.now() - 20 * 60 * 1000),
				type: "text",
				isRead: false,
			},
		],
	},
	{
		id: "conv_4",
		participants: ["current_user", "4"], // current_user ve Fatma Özkan
		unreadCount: 0,
		lastMessage: {
			id: "msg_13",
			senderId: "current_user",
			receiverId: "4",
			content: "Yarın görüşürüz, iyi akşamlar!",
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
			type: "text",
			isRead: true,
		},
		messages: [
			{
				id: "msg_13",
				senderId: "current_user",
				receiverId: "4",
				content: "Yarın görüşürüz, iyi akşamlar!",
				timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
				type: "text",
				isRead: true,
			},
		],
	},
];
