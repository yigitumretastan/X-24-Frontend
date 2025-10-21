import { useState, useEffect, useCallback } from 'react';
import { 
  DiskData, 
  DiskFile, 
  DiskUsage, 
  DiskStats, 
  DiskFilter, 
  DiskSort, 
  DiskView 
} from '@/app/types/disk';
import {
  fetchDiskData,
  deleteDiskFile,
  downloadDiskFile,
  uploadDiskFile,
  searchDiskFiles
} from '@/app/lib/endpoints';

export const useDisk = () => {
  const [diskData, setDiskData] = useState<DiskData | null>(null);
  const [files, setFiles] = useState<DiskFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<DiskFile[]>([]);
  const [usage, setUsage] = useState<DiskUsage | null>(null);
  const [stats, setStats] = useState<DiskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtreleme ve sıralama state'leri
  const [filter, setFilter] = useState<DiskFilter>({ type: 'all' });
  const [sort, setSort] = useState<DiskSort>({ field: 'uploadDate', direction: 'desc' });
  const [view, setView] = useState<DiskView>({ mode: 'grid', itemsPerPage: 20, currentPage: 1 });
  const [searchQuery, setSearchQuery] = useState('');

  // İlk veri yükleme
  const loadDiskData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDiskData();
      setDiskData(data);
      setFiles(data.files);
      setUsage(data.usage);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Disk verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  // Dosyaları filtrele ve sırala
  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...files];

    // Filtreleme
    if (filter.type && filter.type !== 'all') {
      filtered = filtered.filter(file => file.type === filter.type);
    }

    if (filter.source) {
      filtered = filtered.filter(file => 
        file.source.toLowerCase().includes(filter.source!.toLowerCase())
      );
    }

    if (filter.searchQuery) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(filter.searchQuery!.toLowerCase()) ||
        file.source.toLowerCase().includes(filter.searchQuery!.toLowerCase())
      );
    }

    if (filter.dateRange) {
      const startDate = new Date(filter.dateRange.start);
      const endDate = new Date(filter.dateRange.end);
      filtered = filtered.filter(file => {
        const fileDate = new Date(file.uploadDate);
        return fileDate >= startDate && fileDate <= endDate;
      });
    }

    if (filter.sizeRange) {
      filtered = filtered.filter(file =>
        file.size >= filter.sizeRange!.min && file.size <= filter.sizeRange!.max
      );
    }

    // Sıralama
    filtered.sort((a, b) => {
      let aValue: string | number = String(a[sort.field as keyof DiskFile]);
      let bValue: string | number = String(b[sort.field as keyof DiskFile]);

      if (sort.field === 'uploadDate') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      } else if (sort.field === 'size') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredFiles(filtered);
  }, [files, filter, sort]);

  // Dosya silme
  const deleteFile = useCallback(async (fileId: string) => {
    try {
      await deleteDiskFile(fileId);
      setFiles(prev => prev.filter(file => file.id !== fileId));
      
      // Usage ve stats'ı güncelle
      await loadDiskData();
      
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Dosya silinirken hata oluştu';
      setError(message);
      return { success: false, error: message };
    }
  }, [loadDiskData]);

  // Dosya indirme
  const downloadFile = useCallback(async (fileId: string, fileName: string) => {
    try {
      const blob = await downloadDiskFile(fileId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Dosya indirilirken hata oluştu';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  // Dosya yükleme
  const uploadFile = useCallback(async (file: File, source: string, sourceId?: string) => {
    try {
      const uploadedFile = await uploadDiskFile(file, source, sourceId);
      setFiles(prev => [uploadedFile, ...prev]);
      
      // Usage ve stats'ı güncelle
      await loadDiskData();
      
      return { success: true, file: uploadedFile };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Dosya yüklenirken hata oluştu';
      setError(message);
      return { success: false, error: message };
    }
  }, [loadDiskData]);

  // Arama
  const searchFiles = useCallback(async (query: string) => {
    try {
      setSearchQuery(query);
      if (query.trim()) {
        const searchResults = await searchDiskFiles(query);
        setFilteredFiles(searchResults);
      } else {
        applyFiltersAndSort();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Arama yapılırken hata oluştu');
    }
  }, [applyFiltersAndSort]);

  // Filtreleri temizle
  const clearFilters = useCallback(() => {
    setFilter({ type: 'all' });
    setSearchQuery('');
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
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Dosya tipine göre ikon
  const getFileIcon = useCallback((type: DiskFile['type']): string => {
    const icons = {
      message: '💬',
      project: '📁',
      document: '📄',
      image: '🖼️',
      video: '🎥',
      audio: '🎵',
      zip: '📦',
      pdf: '📕',
      other: '📎'
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
