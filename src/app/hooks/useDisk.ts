import { useCallback, useEffect, useState } from "react";
import {
	useDeleteApiMediaId,
	usePostApiMediaUpload,
} from "@/api/generated/media/media";
import type {
	DiskData,
	DiskFile,
	DiskFilter,
	DiskSort,
	DiskStats,
	DiskUsage,
	DiskView,
} from "@/app/types/disk";

export const useDisk = () => {
	const [diskData, _setDiskData] = useState<DiskData | null>(null);
	const [files, setFiles] = useState<DiskFile[]>([]);
	const [filteredFiles, setFilteredFiles] = useState<DiskFile[]>([]);
	const [usage, setUsage] = useState<DiskUsage | null>(null);
	const [stats, _setStats] = useState<DiskStats | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	const { mutateAsync: deleteMedia } = useDeleteApiMediaId();
	const { mutateAsync: uploadMedia } = usePostApiMediaUpload();

	const loading = false;
	const error = null;

	// Filtreleme ve sıralama state'leri
	const [filter, setFilter] = useState<DiskFilter>({ type: "all" });
	const [sort, setSort] = useState<DiskSort>({
		field: "uploadDate",
		direction: "desc",
	});
	const [view, setView] = useState<DiskView>({
		mode: "grid",
		itemsPerPage: 20,
		currentPage: 1,
	});

	// İlk veri yükleme
	const loadDiskData = useCallback(async () => {
		// Media listesi için backend'de henüz bir endpoint yoksa mock veri kullanılabilir
		setFiles([]);
		setUsage({
			totalUsed: 0,
			totalLimit: 10 * 1024 * 1024 * 1024,
			usageByType: {
				messages: 0,
				projects: 0,
				documents: 0,
				images: 0,
				videos: 0,
				audio: 0,
				other: 0,
			},
		});
	}, []);

	useEffect(() => {
		loadDiskData();
	}, [loadDiskData]);

	// Dosyaları filtrele ve sırala
	const applyFiltersAndSort = useCallback(() => {
		let filtered = [...files];

		// Filtreleme
		if (filter.type && filter.type !== "all") {
			filtered = filtered.filter((file) => file.type === filter.type);
		}

		if (filter.source) {
			const sourceFilter = filter.source.toLowerCase();
			filtered = filtered.filter((file) =>
				file.source?.toLowerCase().includes(sourceFilter),
			);
		}

		if (filter.searchQuery) {
			const query = filter.searchQuery.toLowerCase();
			filtered = filtered.filter(
				(file) =>
					file.name.toLowerCase().includes(query) ||
					file.source?.toLowerCase().includes(query),
			);
		}

		if (filter.dateRange) {
			const startDate = new Date(filter.dateRange.start);
			const endDate = new Date(filter.dateRange.end);
			filtered = filtered.filter((file) => {
				const fileDate = new Date(file.uploadDate);
				return fileDate >= startDate && fileDate <= endDate;
			});
		}

		if (filter.sizeRange) {
			const { min, max } = filter.sizeRange;
			filtered = filtered.filter((file) => {
				const isAboveMin = min !== undefined ? file.size >= min : true;
				const isBelowMax = max !== undefined ? file.size <= max : true;
				return isAboveMin && isBelowMax;
			});
		}

		// Sıralama
		filtered.sort((a, b) => {
			let aValue: string | number = String(a[sort.field as keyof DiskFile]);
			let bValue: string | number = String(b[sort.field as keyof DiskFile]);

			if (sort.field === "uploadDate") {
				aValue = new Date(aValue as string).getTime();
				bValue = new Date(bValue as string).getTime();
			} else if (sort.field === "size") {
				aValue = Number(aValue);
				bValue = Number(bValue);
			} else {
				aValue = String(aValue).toLowerCase();
				bValue = String(bValue).toLowerCase();
			}

			if (sort.direction === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		setFilteredFiles(filtered);
	}, [files, filter, sort]);

	// Dosya silme
	const deleteFile = useCallback(
		async (fileId: string) => {
			try {
				await deleteMedia({ id: fileId });
				loadDiskData();
				return { success: true };
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Dosya silinirken hata oluştu";
				return { success: false, error: message };
			}
		},
		[deleteMedia, loadDiskData],
	);

	// Dosya indirme
	const downloadFile = useCallback(
		async (fileId: string, _fileName: string) => {
			try {
				const apiBaseUrl =
					process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7171";
				window.open(`${apiBaseUrl}/api/Media/${fileId}`, "_blank");
				return { success: true };
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Dosya indirilirken hata oluştu";
				return { success: false, error: message };
			}
		},
		[],
	);

	// Dosya yükleme
	const uploadFile = useCallback(
		async (file: File, _source: string, _sourceId?: string) => {
			try {
				await uploadMedia({
					data: {
						file: file,
					},
				});
				loadDiskData();
				return { success: true };
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Dosya yüklenirken hata oluştu";
				return { success: false, error: message };
			}
		},
		[uploadMedia, loadDiskData],
	);

	// Arama
	const searchFiles = useCallback(
		async (query: string) => {
			setSearchQuery(query);
			applyFiltersAndSort();
		},
		[applyFiltersAndSort],
	);

	// Filtreleri temizle
	const clearFilters = useCallback(() => {
		setFilter({ type: "all" });
		setSearchQuery("");
	}, []);

	// Sayfalama
	const getPaginatedFiles = useCallback(() => {
		const startIndex = (view.currentPage - 1) * view.itemsPerPage;
		const endIndex = startIndex + view.itemsPerPage;
		return filteredFiles.slice(startIndex, endIndex);
	}, [filteredFiles, view]);

	const getTotalPages = useCallback(() => {
		return Math.ceil(filteredFiles.length / view.itemsPerPage);
	}, [filteredFiles.length, view.itemsPerPage]);

	// Dosya boyutunu formatla
	const formatFileSize = useCallback((bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	}, []);

	// Dosya tipine göre ikon
	const getFileIcon = useCallback((type: DiskFile["type"]): string => {
		const icons = {
			message: "💬",
			project: "📁",
			document: "📄",
			image: "🖼️",
			video: "🎥",
			audio: "🎵",
			zip: "📦",
			pdf: "📕",
			other: "📎",
		};
		return icons[type] || icons.other;
	}, []);

	// Usage yüzdesi hesapla
	const getUsagePercentage = useCallback((): number => {
		if (!usage) return 0;
		return (usage.totalUsed / usage.totalLimit) * 100;
	}, [usage]);

	// Kalan alan hesapla
	const getRemainingSpace = useCallback((): number => {
		if (!usage) return 0;
		return usage.totalLimit - usage.totalUsed;
	}, [usage]);

	// Effects
	useEffect(() => {
		loadDiskData();
	}, [loadDiskData]);

	useEffect(() => {
		if (!searchQuery) {
			applyFiltersAndSort();
		}
	}, [applyFiltersAndSort, searchQuery]);

	return {
		// Data
		diskData,
		files,
		filteredFiles,
		usage,
		stats,
		loading,
		error,

		// State
		filter,
		sort,
		view,
		searchQuery,

		// Actions
		setFilter,
		setSort,
		setView,
		searchFiles,
		clearFilters,
		deleteFile,
		downloadFile,
		uploadFile,
		loadDiskData,

		// Computed
		paginatedFiles: getPaginatedFiles(),
		totalPages: getTotalPages(),
		usagePercentage: getUsagePercentage(),
		remainingSpace: getRemainingSpace(),

		// Helpers
		formatFileSize,
		getFileIcon,
	};
};
