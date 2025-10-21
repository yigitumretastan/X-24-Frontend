export interface DiskFile {
  id: string;
  name: string;
  type: 'message' | 'project' | 'document' | 'image' | 'video' | 'audio' | 'zip' | 'pdf' | 'other';
  size: number; // bytes
  uploadDate: string;
  source: string; // hangi kaynaktan geldiği (mesaj, proje, vs.)
  sourceId?: string; // kaynak ID'si
  url?: string;
  thumbnail?: string;
  isDeleted?: boolean;
}

export interface DiskUsage {
  totalUsed: number; // GB
  totalLimit: number; // GB
  usageByType: {
    messages: number;
    projects: number;
    documents: number;
    images: number;
    videos: number;
    audio: number;
    other: number;
  };
}

export interface DiskStats {
  totalFiles: number;
  totalSize: number;
  filesByType: {
    [key in DiskFile['type']]: number;
  };
  recentUploads: DiskFile[];
  largestFiles: DiskFile[];
}

export interface DiskFilter {
  type?: DiskFile['type'] | 'all';
  source?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
  searchQuery?: string;
}

export interface DiskSort {
  field: 'name' | 'size' | 'uploadDate' | 'type';
  direction: 'asc' | 'desc';
}

export interface DiskView {
  mode: 'grid' | 'list';
  itemsPerPage: number;
  currentPage: number;
}

export interface DiskData {
  files: DiskFile[];
  usage: DiskUsage;
  stats: DiskStats;
}