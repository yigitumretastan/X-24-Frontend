"use client";

import { useRef, useState } from "react";
import { useToast } from "./useToast";

export interface Report {
	id: string;
	subject: string;
	content: string;
	attachments: File[];
	recipientId: string;
	recipientName: string;
	createdAt: Date;
	status: "draft" | "sent";
	isRead?: boolean;
}

export interface Person {
	id: string;
	name: string;
	role: string;
	avatar?: string;
	lastReportDate: Date;
	reportCount: number;
	isOnline: boolean;
}

export const useReports = () => {
	const toast = useToast();

	// State management
	const [topSidebarActive, setTopSidebarActive] = useState<"write" | "history">(
		"write",
	);
	const [bottomSidebarActive, setBottomSidebarActive] = useState<
		"people" | "filters"
	>("people");
	const [selectedPerson, setSelectedPerson] = useState<string>("");
	const [searchQuery, setSearchQuery] = useState("");
	const [subject, setSubject] = useState("");
	const [content, setContent] = useState("");
	const [attachments, setAttachments] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	// Mock data
	const people: Person[] = [
		{
			id: "1",
			name: "Ahmet Yılmaz",
			role: "Genel Müdür",
			lastReportDate: new Date("2024-01-15"),
			reportCount: 12,
			isOnline: true,
		},
		{
			id: "2",
			name: "Ayşe Kaya",
			role: "İK Müdürü",
			lastReportDate: new Date("2024-01-14"),
			reportCount: 8,
			isOnline: false,
		},
		{
			id: "3",
			name: "Mehmet Demir",
			role: "Proje Müdürü",
			lastReportDate: new Date("2024-01-13"),
			reportCount: 15,
			isOnline: true,
		},
	];

	const reports: Report[] = [
		{
			id: "1",
			subject: "Haftalık Proje Durumu Raporu",
			content: "Bu hafta tamamlanan görevler ve gelecek hafta planları...",
			attachments: [],
			recipientId: "1",
			recipientName: "Ahmet Yılmaz",
			createdAt: new Date("2024-01-15"),
			status: "sent",
			isRead: true,
		},
		{
			id: "2",
			subject: "Ekip Performans Değerlendirmesi",
			content: "Ekip performansı ve iyileştirme önerileri...",
			attachments: [],
			recipientId: "2",
			recipientName: "Ayşe Kaya",
			createdAt: new Date("2024-01-14"),
			status: "sent",
			isRead: false,
		},
		{
			id: "3",
			subject: "Aylık Satış Raporu",
			content: "Ocak ayı satış verileri ve analizi...",
			attachments: [],
			recipientId: "3",
			recipientName: "Mehmet Demir",
			createdAt: new Date("2024-01-13"),
			status: "sent",
			isRead: true,
		},
	];

	// Handlers
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		setAttachments((prev) => [...prev, ...files]);
	};

	const removeAttachment = (index: number) => {
		setAttachments((prev) => prev.filter((_, i) => i !== index));
	};

	const formatText = (command: string, value?: string) => {
		document.execCommand(command, false, value);
		contentRef.current?.focus();
	};

	const handleSendReport = () => {
		if (!subject.trim() || !content.trim() || !selectedPerson) {
			toast.error("Eksik Bilgi", "Lütfen tüm alanları doldurun");
			return;
		}

		toast.success("Rapor Gönderildi", "Raporunuz başarıyla gönderildi");

		// Formu temizle
		setSubject("");
		setContent("");
		setAttachments([]);
		if (contentRef.current) {
			contentRef.current.innerHTML = "";
		}
	};

	const handleSaveDraft = () => {
		toast.info("Taslak Kaydedildi", "Raporunuz taslak olarak kaydedildi");
	};

	const handleShareReport = () => {
		toast.info("Paylaşım", "Rapor paylaşım özelliği yakında eklenecek");
	};

	const filteredPeople = people.filter(
		(person) =>
			person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			person.role.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return {
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
		setAttachments,

		// Refs
		fileInputRef,
		contentRef,

		// Data
		people,
		reports,
		filteredPeople,

		// Handlers
		handleFileUpload,
		removeAttachment,
		formatText,
		handleSendReport,
		handleSaveDraft,
		handleShareReport,
	};
};
