"use client";

import React, { useState } from 'react';
import { useDisk } from '@/app/hooks/useDisk';
import { useTheme } from '@/app/contexts/ThemeContext';
import { DiskFile } from '@/app/types/disk';
import FileViewer from '@/app/components/common/FileViewer';
import { 
  FileText, 
  File as FileIcon, 
  Eye, 
  Download, 
  Trash2, 
  LayoutGrid, 
  List,
  ChevronRight,
  FolderOpen,
  FileAudio,
  FileVideo,
  FileImage,
  FileArchive
} from 'lucide-react';

const getFileIcon = (type: DiskFile['type']) => {
  const iconProps = { strokeWidth: 1.5 };
  switch (type) {
    case 'pdf': 
      return (
        <div className="relative w-full h-full flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10 p-2 text-red-500">
          <FileText className="w-full h-full" {...iconProps} />
          <span className="absolute -bottom-1 -right-1 px-1 bg-red-500 text-[8px] font-bold text-white rounded-sm">PDF</span>
        </div>
      );
    case 'image': 
      return (
        <div className="relative w-full h-full flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 p-2 text-blue-500">
          <FileImage className="w-full h-full" {...iconProps} />
        </div>
      );
    case 'video': 
      return (
        <div className="relative w-full h-full flex items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/10 p-2 text-purple-500">
          <FileVideo className="w-full h-full" {...iconProps} />
        </div>
      );
    case 'audio': 
      return (
        <div className="relative w-full h-full flex items-center justify-center rounded-xl bg-pink-50 dark:bg-pink-500/10 p-2 text-pink-500">
          <FileAudio className="w-full h-full" {...iconProps} />
        </div>
      );
    case 'zip': 
      return (
        <div className="relative w-full h-full flex items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-500/10 p-2 text-orange-500">
          <FileArchive className="w-full h-full" {...iconProps} />
        </div>
      );
    case 'document': 
      return (
        <div className="relative w-full h-full flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 p-2 text-indigo-500">
          <FileText className="w-full h-full" {...iconProps} />
        </div>
      );
    case 'project': 
      return (
        <div className="relative w-full h-full flex items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10 p-2 text-amber-500">
          <FolderOpen className="w-full h-full" {...iconProps} />
        </div>
      );
    default: 
      return (
        <div className="relative w-full h-full flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-500/10 p-2 text-gray-400">
          <FileIcon className="w-full h-full" {...iconProps} />
        </div>
      );
  }
};

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
                <option value="project">📁 Proje</option>
                <option value="other">📎 Diğer</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
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
                <option value="uploadDate-desc">En Yeni</option>
                <option value="uploadDate-asc">En Eski</option>
                <option value="name-asc">A-Z</option>
                <option value="name-desc">Z-A</option>
                <option value="size-desc">Büyük→Küçük</option>
                <option value="size-asc">Küçük→Büyük</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
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
                  <LayoutGrid className="w-5 h-5" />
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
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Temizle Butonu */}
              {(filter.type !== 'all' || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className={`px-4 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2 ${theme === 'dark'
                      ? 'bg-red-900/50 hover:bg-red-800/50 text-red-300 border border-red-700/50'
                      : 'bg-red-100/80 hover:bg-red-200/80 text-red-700 border border-red-200/50'
                    }`}
                  title="Filtreleri Temizle"
                >
                  <Trash2 className="w-4 h-4" />
                  Temizle
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dosya Listesi */}
      <div className={`p-8 rounded-[2rem] shadow-xl border backdrop-blur-md transition-all duration-500 ${theme === 'dark'
          ? 'bg-gray-900/40 border-gray-800/50 shadow-black/20'
          : 'bg-white/60 border-white/40 shadow-gray-200/50'
        }`}>
        {/* Toplu Seçim ve Başlık */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all duration-300 ${
              selectedFiles.size > 0 
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' 
                : 'bg-gray-500/5 border-gray-500/10 text-gray-500'
            }`}>
              <input
                type="checkbox"
                checked={selectedFiles.size === paginatedFiles.length && paginatedFiles.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors cursor-pointer"
              />
              <span className="text-sm font-semibold whitespace-nowrap">
                {selectedFiles.size > 0 ? `${selectedFiles.size} Dosya Seçildi` : 'Hepsini Seç'}
              </span>
            </div>
            
            {selectedFiles.size > 0 && (
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 text-sm font-bold"
                onClick={() => {/* Toplu silme mantığı eklenebilir */}}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Seçilenleri Sil
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Görünüm:</span>
            <div className={`flex p-1 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/80'}`}>
              <button
                onClick={() => setView({ ...view, mode: 'grid' })}
                className={`p-2 rounded-lg transition-all duration-300 ${view.mode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setView({ ...view, mode: 'list' })}
                className={`p-2 rounded-lg transition-all duration-300 ${view.mode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Dosyalar */}
        {paginatedFiles.length === 0 ? (
          <div className={`text-center py-24 rounded-[2rem] border-2 border-dashed ${
            theme === 'dark' ? 'border-gray-800 bg-gray-800/20' : 'border-gray-100 bg-gray-50/50'
          }`}>
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
              <div className={`relative flex items-center justify-center w-full h-full rounded-full border-2 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <span className="text-5xl">📁</span>
              </div>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Henüz Dosya Yok</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Bu dizinde görüntülenecek herhangi bir dosya bulunamadı.</p>
          </div>
        ) : (
          <div className={view.mode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6' : 'flex flex-col gap-3'}>
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
          <div className="flex justify-center items-center gap-6 mt-12 pt-8 border-t border-gray-100/10">
            <button
              onClick={() => setView({ ...view, currentPage: Math.max(1, view.currentPage - 1) })}
              disabled={view.currentPage === 1}
              className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                view.currentPage === 1
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 text-blue-500 hover:bg-blue-500 hover:text-white shadow-lg border border-gray-100 dark:border-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{view.currentPage}</span>
              <span className="text-gray-400 font-medium">/</span>
              <span className="text-gray-400 font-medium">{totalPages}</span>
            </div>

            <button
              onClick={() => setView({ ...view, currentPage: Math.min(totalPages, view.currentPage + 1) })}
              disabled={view.currentPage === totalPages}
              className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                view.currentPage === totalPages
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 text-blue-500 hover:bg-blue-500 hover:text-white shadow-lg border border-gray-100 dark:border-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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
  getFileIcon: (type: DiskFile['type']) => React.ReactNode;
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
      day: 'numeric'
    });
  };

  const isDark = theme === "dark";

  if (viewMode === 'list') {
    return (
      <div className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${isSelected
          ? 'border-blue-500 bg-blue-500/5 shadow-sm'
          : isDark
            ? "border-gray-800 bg-gray-900/20 hover:border-gray-700 hover:bg-gray-800/40"
            : "border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/30"
        }`}>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-transform duration-300 group-hover:scale-110 ${
            isDark ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <div className="w-8 h-8">
              {getFileIcon(file.type)}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-bold truncate text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>{file.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-md ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              {file.source}
            </span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <span className="text-xs text-gray-500">{formatDate(file.uploadDate)}</span>
          </div>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onView}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isDark ? 'bg-gray-800 text-gray-400 hover:text-green-400' : 'bg-gray-50 text-gray-500 hover:text-green-600 hover:bg-green-50'
            }`}
            title="Görüntüle"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={onDownload}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isDark ? 'bg-gray-800 text-gray-400 hover:text-blue-400' : 'bg-gray-50 text-gray-500 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title="İndir"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isDark ? 'bg-gray-800 text-gray-400 hover:text-red-400' : 'bg-gray-50 text-gray-500 hover:text-red-600 hover:bg-red-50'
            }`}
            title="Sil"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative p-5 rounded-[2rem] border transition-all duration-500 ${isSelected
        ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10'
        : isDark
          ? "border-gray-800 bg-gray-900/40 hover:border-blue-500/30 hover:bg-gray-800/60"
          : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-gray-200/40"
      }`}>
      <div className="flex items-start justify-between mb-6">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-transform duration-300 group-hover:scale-110"
        />
        <div className={`flex items-center justify-center w-16 h-16 rounded-2xl shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
          isDark ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className="w-10 h-10">
            {getFileIcon(file.type)}
          </div>
        </div>
        <div className="w-4"></div> {/* Spacer for symmetry */}
      </div>

      <div className="space-y-1">
        <h4 className={`font-bold text-sm truncate transition-colors duration-300 ${isDark ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'}`} title={file.name}>
          {file.name}
        </h4>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium tracking-tight ${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
            {file.source}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">{formatFileSize(file.size)}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={onView}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300 ${
            isDark 
              ? 'bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-white' 
              : 'bg-gray-50 text-gray-600 hover:bg-green-500 hover:text-white hover:shadow-lg hover:shadow-green-500/30'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Aç
        </button>
        <button
          onClick={onDownload}
          className={`flex items-center justify-center w-10 py-2.5 rounded-xl transition-all duration-300 ${
            isDark 
              ? 'bg-gray-800 text-gray-300 hover:bg-blue-500 hover:text-white' 
              : 'bg-gray-50 text-gray-600 hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/30'
          }`}
          title="İndir"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className={`flex items-center justify-center w-10 py-2.5 rounded-xl transition-all duration-300 ${
            isDark 
              ? 'bg-gray-800 text-gray-300 hover:bg-red-500 hover:text-white' 
              : 'bg-gray-50 text-gray-600 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/30'
          }`}
          title="Sil"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default DiskComponent;
