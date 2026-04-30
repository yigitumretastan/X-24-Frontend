import type {
	DiskData,
	DiskFile,
	DiskStats,
	DiskUsage,
} from "@/app/types/disk";

export const mockDiskFiles: DiskFile[] = [
	{
		id: "test-pdf-1",
		name: "pratik-agile-ozcan-acar.pdf",
		type: "pdf",
		size: 12582912, // 12MB (yaklaşık)
		uploadDate: "2024-10-19T14:53:00Z",
		source: "Test Dosyaları",
		sourceId: "test_1",
		url: "/data/common/pdf/pratik-agile-ozcan-acar.pdf",
		thumbnail: "/thumbnails/pdf-icon.png",
	},
	{
		id: "1",
		name: "Proje Sunumu.pdf",
		type: "pdf",
		size: 2048000, // 2MB
		uploadDate: "2024-01-15T10:30:00Z",
		source: "Zeniva Projesi",
		sourceId: "project_1",
		url: "/files/proje-sunumu.pdf",
		thumbnail: "/thumbnails/pdf-icon.png",
	},
	{
		id: "2",
		name: "Ekip Fotoğrafı.jpg",
		type: "image",
		size: 1536000, // 1.5MB
		uploadDate: "2024-01-14T14:20:00Z",
		source: "Mesajlar",
		sourceId: "message_123",
		url: "/files/ekip-fotografi.jpg",
		thumbnail: "/thumbnails/ekip-fotografi-thumb.jpg",
	},
	{
		id: "3",
		name: "Kaynak Kodları.zip",
		type: "zip",
		size: 15728640, // 15MB
		uploadDate: "2024-01-13T09:15:00Z",
		source: "Demo Projesi",
		sourceId: "project_2",
		url: "/files/kaynak-kodlari.zip",
	},
	{
		id: "4",
		name: "Toplantı Kaydı.mp4",
		type: "video",
		size: 52428800, // 50MB
		uploadDate: "2024-01-12T16:45:00Z",
		source: "Mesajlar",
		sourceId: "message_456",
		url: "/files/toplanti-kaydi.mp4",
		thumbnail: "/thumbnails/video-thumb.jpg",
	},
	{
		id: "5",
		name: "API Dokümantasyonu.docx",
		type: "document",
		size: 512000, // 512KB
		uploadDate: "2024-01-11T11:30:00Z",
		source: "Zeniva Projesi",
		sourceId: "project_1",
		url: "/files/api-dokumantasyonu.docx",
	},
	{
		id: "6",
		name: "Logo Tasarımları.zip",
		type: "zip",
		size: 8388608, // 8MB
		uploadDate: "2024-01-10T13:20:00Z",
		source: "Tasarım Projesi",
		sourceId: "project_3",
		url: "/files/logo-tasarimlari.zip",
	},
	{
		id: "7",
		name: "Ses Notu.mp3",
		type: "audio",
		size: 3145728, // 3MB
		uploadDate: "2024-01-09T08:45:00Z",
		source: "Mesajlar",
		sourceId: "message_789",
		url: "/files/ses-notu.mp3",
	},
	{
		id: "8",
		name: "Veritabanı Şeması.png",
		type: "image",
		size: 1048576, // 1MB
		uploadDate: "2024-01-08T15:10:00Z",
		source: "Zeniva Projesi",
		sourceId: "project_1",
		url: "/files/veritabani-semasi.png",
		thumbnail: "/thumbnails/veritabani-semasi-thumb.png",
	},
	{
		id: "9",
		name: "Kullanıcı Kılavuzu.pdf",
		type: "pdf",
		size: 4194304, // 4MB
		uploadDate: "2024-01-07T12:00:00Z",
		source: "Demo Projesi",
		sourceId: "project_2",
		url: "/files/kullanici-kilavuzu.pdf",
	},
	{
		id: "10",
		name: "Backup Dosyaları.zip",
		type: "zip",
		size: 104857600, // 100MB
		uploadDate: "2024-01-06T18:30:00Z",
		source: "Sistem Yedekleri",
		sourceId: "system_backup",
		url: "/files/backup-dosyalari.zip",
	},
	{
		id: "11",
		name: "Mockup Tasarımları.sketch",
		type: "other",
		size: 25165824, // 24MB
		uploadDate: "2024-01-05T10:15:00Z",
		source: "Tasarım Projesi",
		sourceId: "project_3",
		url: "/files/mockup-tasarimlari.sketch",
	},
	{
		id: "12",
		name: "Promo Video.mov",
		type: "video",
		size: 157286400, // 150MB
		uploadDate: "2024-01-04T14:20:00Z",
		source: "Pazarlama Projesi",
		sourceId: "project_4",
		url: "/files/promo-video.mov",
		thumbnail: "/thumbnails/promo-video-thumb.jpg",
	},
];

export const mockDiskUsage: DiskUsage = {
	totalUsed: 0.38, // 380MB in GB
	totalLimit: 1.0, // 1GB limit
	usageByType: {
		messages: 0.06, // 60MB
		projects: 0.25, // 250MB
		documents: 0.05, // 50MB
		images: 0.02, // 20MB
		videos: 0.2, // 200MB
		audio: 0.003, // 3MB
		other: 0.024, // 24MB
	},
};

export const mockDiskStats: DiskStats = {
	totalFiles: mockDiskFiles.length,
	totalSize: mockDiskFiles.reduce((total, file) => total + file.size, 0),
	filesByType: {
		message: 0,
		project: 5,
		document: 2,
		image: 2,
		video: 2,
		audio: 1,
		zip: 3,
		pdf: 2,
		other: 1,
	},
	recentUploads: mockDiskFiles.slice(0, 5),
	largestFiles: [...mockDiskFiles].sort((a, b) => b.size - a.size).slice(0, 5),
};

export const mockDiskData: DiskData = {
	files: mockDiskFiles,
	usage: mockDiskUsage,
	stats: mockDiskStats,
};
