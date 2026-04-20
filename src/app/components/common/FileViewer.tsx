'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  File
} from 'lucide-react';

interface FileViewerProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    mimeType?: string;
  } | null;
  onDownload?: () => void;
}

export default function FileViewer({ isOpen, onClose, file, onDownload }: FileViewerProps) {
  const { theme } = useTheme();
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (file) {
      setZoom(100);
      setRotation(0);
      setLoading(true);
    }
  }, [file]);

  if (!isOpen || !file) return null;

  const getFileIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('pdf')) return <FileText className="w-6 h-6" />;
    if (lowerType.includes('image')) return <ImageIcon className="w-6 h-6" />;
    if (lowerType.includes('video')) return <Video className="w-6 h-6" />;
    if (lowerType.includes('audio')) return <Music className="w-6 h-6" />;
    if (lowerType.includes('zip') || lowerType.includes('rar')) return <Archive className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const getViewerType = () => {
    const lowerType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    
    // PDF
    if (lowerType.includes('pdf') || fileName.endsWith('.pdf')) {
      return 'pdf';
    }
    
    // Resimler
    if (lowerType.includes('image') || 
        fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/)) {
      return 'image';
    }
    
    // Video
    if (lowerType.includes('video') || 
        fileName.match(/\.(mp4|webm|ogg|avi|mov|wmv|flv)$/)) {
      return 'video';
    }
    
    // Audio
    if (lowerType.includes('audio') || 
        fileName.match(/\.(mp3|wav|ogg|aac|flac|m4a)$/)) {
      return 'audio';
    }
    
    // Office dosyaları (Google Docs Viewer kullanacağız)
    if (fileName.match(/\.(doc|docx|xls|xlsx|ppt|pptx)$/)) {
      return 'office';
    }
    
    // Metin dosyaları
    if (lowerType.includes('text') || 
        fileName.match(/\.(txt|md|json|xml|csv)$/)) {
      return 'text';
    }
    
    return 'unsupported';
  };

  const renderViewer = () => {
    const viewerType = getViewerType();
    
    switch (viewerType) {
      case 'pdf':
        return (
          <div className="w-full h-full">
            {/* PDF.js viewer kullanarak PDF'i görüntüle */}
            <iframe
              src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(window.location.origin + file.url)}`}
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                console.error('PDF yüklenemedi:', file.url);
              }}
              title={file.name}
            />
          </div>
        );
        
      case 'image':
        return (
          <div className="flex items-center justify-center h-full p-4">
            <img
              src={file.url}
              alt={file.name}
              className="max-w-full max-h-full object-contain transition-transform duration-300"
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                filter: theme === 'dark' ? 'brightness(0.9)' : 'none'
              }}
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
          </div>
        );
        
      case 'video':
        return (
          <div className="flex items-center justify-center h-full p-4">
            <video
              src={file.url}
              controls
              className="max-w-full max-h-full"
              onLoadedData={() => setLoading(false)}
              onError={() => setLoading(false)}
            >
              Tarayıcınız video oynatmayı desteklemiyor.
            </video>
          </div>
        );
        
      case 'audio':
        return (
          <div className="flex items-center justify-center h-full p-8">
            <div className={`text-center p-8 rounded-3xl ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-white/50 border border-gray-200/50'
            } backdrop-blur-sm`}>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                  : 'bg-gradient-to-br from-blue-500 to-purple-500'
              }`}>
                <Music className="w-12 h-12 text-white" />
              </div>
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {file.name}
              </h3>
              <audio
                src={file.url}
                controls
                className="w-full max-w-md"
                onLoadedData={() => setLoading(false)}
                onError={() => setLoading(false)}
              >
                Tarayıcınız ses oynatmayı desteklemiyor.
              </audio>
            </div>
          </div>
        );
        
      case 'office':
        return (
          <div className="w-full h-full">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url)}`}
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
              title={file.name}
            />
          </div>
        );
        
      case 'text':
        return (
          <div className="p-6 h-full overflow-auto">
            <div className={`p-6 rounded-2xl h-full ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-white/50 border border-gray-200/50'
            } backdrop-blur-sm`}>
              <iframe
                src={file.url}
                className="w-full h-full border-0"
                onLoad={() => setLoading(false)}
                title={file.name}
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                theme === 'dark'
                  ? 'bg-gray-700/50 text-gray-400'
                  : 'bg-gray-200/50 text-gray-500'
              }`}>
                {getFileIcon(file.type)}
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Önizleme Desteklenmiyor
              </h3>
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Bu dosya türü için önizleme mevcut değil
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {file.name}
              </p>
            </div>
          </div>
        );
    }
  };

  const canZoom = getViewerType() === 'image';
  const canRotate = getViewerType() === 'image';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full h-full max-w-7xl max-h-[90vh] m-4 rounded-3xl overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-gray-700/50'
          : 'bg-gradient-to-br from-white/95 to-gray-50/95 border border-gray-200/50'
      } backdrop-blur-xl shadow-2xl`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                : 'bg-gradient-to-br from-blue-500 to-purple-500'
            }`}>
              {getFileIcon(file.type)}
            </div>
            <div>
              <h2 className={`font-semibold truncate max-w-md ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {file.name}
              </h2>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Zoom Controls */}
            {canZoom && (
              <>
                <button
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                  className={`p-2 rounded-xl transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700/50 text-gray-300'
                      : 'hover:bg-gray-100/50 text-gray-600'
                  }`}
                  title="Küçült"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className={`text-sm px-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  %{zoom}
                </span>
                <button
                  onClick={() => setZoom(Math.min(300, zoom + 25))}
                  className={`p-2 rounded-xl transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700/50 text-gray-300'
                      : 'hover:bg-gray-100/50 text-gray-600'
                  }`}
                  title="Büyült"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </>
            )}
            
            {/* Rotate Control */}
            {canRotate && (
              <button
                onClick={() => setRotation(rotation + 90)}
                className={`p-2 rounded-xl transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700/50 text-gray-300'
                    : 'hover:bg-gray-100/50 text-gray-600'
                }`}
                title="Döndür"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            )}
            
            {/* Download Button */}
            {onDownload && (
              <button
                onClick={onDownload}
                className={`p-2 rounded-xl transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-blue-600/20 text-blue-400'
                    : 'hover:bg-blue-100/50 text-blue-600'
                }`}
                title="İndir"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-red-600/20 text-red-400'
                  : 'hover:bg-red-100/50 text-red-600'
              }`}
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative h-[calc(100%-80px)]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`text-center ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${
                  theme === 'dark'
                    ? 'border-gray-700 border-t-blue-400'
                    : 'border-gray-200 border-t-blue-600'
                }`}></div>
                <p>Dosya yükleniyor...</p>
              </div>
            </div>
          )}
          
          {renderViewer()}
        </div>
      </div>
    </div>
  );
}
