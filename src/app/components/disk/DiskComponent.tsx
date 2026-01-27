"use client";

import React, { useState } from 'react';
import { useDisk } from '@/app/hooks/useDisk';
import { useTheme } from '@/app/hooks/useTheme';
import { DiskFile } from '@/app/types/disk';
import FileViewer from '@/app/components/common/FileViewer';

const DiskComponent = () => {
  const { theme } = useTheme();
  const {
    files,
    paginatedFiles,
    loading,
    error,
    filter,
    sort,
    view,
    searchQuery,
    setFilter,
    setSort,
    setView,
    searchFiles,
    deleteFile,
    downloadFile,
    uploadFile,
    totalPages,
    formatFileSize,
    getFileIcon,
    clearFilters,
  } = useDisk();

  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewerFile, setViewerFile] = useState<DiskFile | null>(null);
  const [showViewer, setShowViewer] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4 ${theme === 'dark'
              ? 'border-gray-700 border-t-blue-400'
              : 'border-blue-200 border-t-blue-600'
            }`}></div>
          <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>Disk verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Hata Oluştu</h2>
          <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>{error}</p>
        </div>
      </div>
    );
  }

  const handleFileSelect = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === paginatedFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(paginatedFiles.map(file => file.id)));
    }
  };


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file, 'Manuel Yükleme');
    if (result.success) {
      setShowUploadModal(false);
    }
  };

  const handleViewFile = (file: DiskFile) => {
    setViewerFile(file);
    setShowViewer(true);
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
    setViewerFile(null);
  };

  const handleDownloadFromViewer = () => {
    if (viewerFile) {
      downloadFile(viewerFile.id, viewerFile.name);
    }
  };


  return (
    <div className={`transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
      {/* Page Header - Inline */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
          {/* Title Section */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark'
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25'
                  : 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25'
                }`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div>
                <h1 className={`text-3xl font-bold bg-gradient-to-r ${theme === 'dark'
                    ? 'from-white to-gray-300 bg-clip-text text-transparent'
                    : 'from-gray-900 to-gray-600 bg-clip-text text-transparent'
                  }`}>
                  Disk Yönetimi
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  Dosyalarınızı yönetin ve disk kullanımınızı takip edin
                </p>
              </div>
            </div>

            <div className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-full ${theme === 'dark'
                ? 'bg-gray-800/50 text-gray-300 border border-gray-700/50'
                : 'bg-gray-100/80 text-gray-600 border border-gray-200/50'
              }`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                {files.length} Dosya
              </span>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className={`group relative flex items-center px-6 py-3 space-x-2 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                }`}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="relative z-10">Dosya Yükle</span>
            </button>
          </div>
        </div>
      </div>


      {/* Kontroller */}
      <div className={`mb-8 p-6 rounded-3xl shadow-lg border backdrop-blur-sm ${theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50'
          : 'bg-gradient-to-br from-white/95 to-gray-50/95 border-gray-200/50'
        }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Arama */}
          <div className="flex-1 lg:max-w-md">
            <div className="relative group">
              <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-focus-within:opacity-100'
                  : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100'
                } blur-xl`}></div>

              <div className={`relative backdrop-blur-sm border rounded-2xl transition-all duration-300 ${theme === 'dark'
                  ? 'bg-gray-800/50 border-gray-700/50 group-focus-within:border-blue-500/50 group-focus-within:bg-gray-800/80'
                  : 'bg-white/80 border-gray-300/50 group-focus-within:border-blue-500/50 group-focus-within:bg-white/95'
                }`}>
                <svg className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${theme === 'dark'
                    ? 'text-gray-400 group-focus-within:text-blue-400'
                    : 'text-gray-500 group-focus-within:text-blue-500'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Dosya ara..."
                  value={searchQuery}
                  onChange={(e) => searchFiles(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-transparent outline-none transition-colors duration-300 placeholder:transition-colors placeholder:duration-300 ${theme === 'dark'
                      ? 'text-white placeholder:text-gray-400 focus:placeholder:text-gray-500'
                      : 'text-gray-900 placeholder:text-gray-500 focus:placeholder:text-gray-400'
                    }`}
                />
              </div>
            </div>
          </div>

          {/* Filtreler ve Kontroller */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Dosya Türü Filtresi */}
            <div className="relative">
              <select
                value={filter.type || 'all'}
                onChange={(e) => setFilter({ ...filter, type: e.target.value as any })}
                className={`appearance-none px-4 py-3 pr-10 rounded-2xl border cursor-pointer transition-all duration-300 ${theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700/50 text-white hover:border-gray-600/50 focus:border-blue-500/50'
                    : 'bg-white/80 border-gray-300/50 text-gray-900 hover:border-gray-400/50 focus:border-blue-500/50'
                  } focus:ring-0 focus:outline-none backdrop-blur-sm`}
              >
                <option value="all">📁 Tüm Türler</option>
                <option value="pdf">📕 PDF</option>
                <option value="image">🖼️ Resim</option>
                <option value="video">🎥 Video</option>
                <option value="audio">🎵 Ses</option>
                <option value="zip">📦 Arşiv</option>
                <option value="document">📄 Doküman</option>
                <option value="other">📎 Diğer</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Sıralama */}
            <div className="relative">
              <select
                value={`${sort.field}-${sort.direction}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSort({ field: field as any, direction: direction as any });
                }}
                className={`appearance-none px-4 py-3 pr-10 rounded-2xl border cursor-pointer transition-all duration-300 ${theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700/50 text-white hover:border-gray-600/50 focus:border-blue-500/50'
                    : 'bg-white/80 border-gray-300/50 text-gray-900 hover:border-gray-400/50 focus:border-blue-500/50'
                  } focus:ring-0 focus:outline-none backdrop-blur-sm`}
              >
                <option value="uploadDate-desc">🕒 En Yeni</option>
                <option value="uploadDate-asc">🕐 En Eski</option>
                <option value="name-asc">🔤 A-Z</option>
                <option value="name-desc">🔤 Z-A</option>
                <option value="size-desc">📏 Büyük→Küçük</option>
                <option value="size-asc">📏 Küçük→Büyük</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Görünüm ve Kontrol Butonları */}
            <div className="flex items-center gap-2">
              {/* Görünüm Seçici */}
              <div className={`flex rounded-2xl p-1 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/80'
                }`}>
                <button
                  onClick={() => setView({ ...view, mode: 'grid' })}
                  className={`p-3 rounded-xl transition-all duration-300 ${view.mode === 'grid'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-gray-600/50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/80'
                    }`}
                  title="Grid Görünümü"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setView({ ...view, mode: 'list' })}
                  className={`p-3 rounded-xl transition-all duration-300 ${view.mode === 'list'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-gray-600/50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/80'
                    }`}
                  title="Liste Görünümü"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Temizle Butonu */}
              {(filter.type !== 'all' || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className={`px-4 py-3 rounded-2xl transition-all duration-300 ${theme === 'dark'
                      ? 'bg-red-900/50 hover:bg-red-800/50 text-red-300 border border-red-700/50'
                      : 'bg-red-100/80 hover:bg-red-200/80 text-red-700 border border-red-200/50'
                    }`}
                  title="Filtreleri Temizle"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Temizle
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dosya Listesi */}
      <div className={`p-6 rounded-3xl shadow-lg border backdrop-blur-sm ${theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50'
          : 'bg-gradient-to-br from-white/95 to-gray-50/95 border-gray-200/50'
        }`}>
        {/* Toplu Seçim */}
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <input
            type="checkbox"
            checked={selectedFiles.size === paginatedFiles.length && paginatedFiles.length > 0}
            onChange={handleSelectAll}
            className="rounded"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {paginatedFiles.length} dosyadan {selectedFiles.size} seçili
          </span>
        </div>

        {/* Dosyalar */}
        {paginatedFiles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">📁</p>
            <p>Dosya bulunamadı</p>
          </div>
        ) : (
          <div className={view.mode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
            {paginatedFiles.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                isSelected={selectedFiles.has(file.id)}
                onSelect={() => handleFileSelect(file.id)}
                onView={() => handleViewFile(file)}
                onDownload={() => downloadFile(file.id, file.name)}
                onDelete={() => deleteFile(file.id)}
                viewMode={view.mode}
                formatFileSize={formatFileSize}
                getFileIcon={getFileIcon}
                theme={theme}
              />
            ))}
          </div>
        )}

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setView({ ...view, currentPage: Math.max(1, view.currentPage - 1) })}
              disabled={view.currentPage === 1}
              className={`px-3 py-1 rounded ${view.currentPage === 1
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              ←
            </button>

            <span className="text-sm">
              Sayfa {view.currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setView({ ...view, currentPage: Math.min(totalPages, view.currentPage + 1) })}
              disabled={view.currentPage === totalPages}
              className={`px-3 py-1 rounded ${view.currentPage === totalPages
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"} max-w-md w-full mx-4`}>
            <h3 className="text-lg font-semibold mb-4">📤 Dosya Yükle</h3>
            <input
              type="file"
              onChange={handleFileUpload}
              className={`w-full p-2 border rounded-lg ${theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
                }`}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowUploadModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg ${theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Viewer */}
      <FileViewer
        isOpen={showViewer}
        onClose={handleCloseViewer}
        file={viewerFile ? {
          id: viewerFile.id,
          name: viewerFile.name,
          type: viewerFile.type,
          size: viewerFile.size,
          url: `${process.env.NEXT_PUBLIC_API_URL}/files/${viewerFile.id}/download`,
          mimeType: viewerFile.type
        } : null}
        onDownload={handleDownloadFromViewer}
      />
    </div>
  );
};

// Dosya Item Component'i
interface FileItemProps {
  file: DiskFile;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
  onDownload: () => void;
  onDelete: () => void;
  viewMode: 'grid' | 'list';
  formatFileSize: (bytes: number) => string;
  getFileIcon: (type: DiskFile['type']) => string;
  theme: string;
}

const FileItem: React.FC<FileItemProps> = ({
  file,
  isSelected,
  onSelect,
  onView,
  onDownload,
  onDelete,
  viewMode,
  formatFileSize,
  getFileIcon,
  theme
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (viewMode === 'list') {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg border ${isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : theme === "dark"
            ? "border-gray-700 hover:bg-gray-700"
            : "border-gray-200 hover:bg-gray-50"
        } transition-colors`}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="rounded"
        />
        <div className="text-2xl">{getFileIcon(file.type)}</div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{file.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {file.source} • {formatFileSize(file.size)} • {formatDate(file.uploadDate)}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onView}
            className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
            title="Görüntüle"
          >
            👁️
          </button>
          <button
            onClick={onDownload}
            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
            title="İndir"
          >
            ⬇️
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
            title="Sil"
          >
            🗑️
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border ${isSelected
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
        : theme === "dark"
          ? "border-gray-700 hover:bg-gray-700"
          : "border-gray-200 hover:bg-gray-50"
      } transition-colors`}>
      <div className="flex items-start gap-2 mb-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="rounded mt-1"
        />
        <div className="text-3xl">{getFileIcon(file.type)}</div>
      </div>

      <h4 className="font-medium text-sm mb-1 truncate" title={file.name}>
        {file.name}
      </h4>

      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
        {file.source}
      </p>

      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
        {formatFileSize(file.size)}
      </p>

      <div className="flex gap-1">
        <button
          onClick={onView}
          className="flex-1 px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
        >
          👁️ Görüntüle
        </button>
        <button
          onClick={onDownload}
          className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          ⬇️
        </button>
        <button
          onClick={onDelete}
          className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default DiskComponent;
