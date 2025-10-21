# Yapılacaklar Listesi

## Sayfa Refactor Kuralları

Her `page.tsx` dosyasını temizlemek için aşağıdaki adımları takip et:

### 1. **API İstekleri ve Data Yönetimi**
- **Gerçek API endpoint'leri:** `C:\Users\admin\Desktop\Project\Zeniva\Zeniva-Frontend\src\app\lib\endpoints.ts` dosyasına ekle
  - Base URL'yi `.env` dosyasından al (`NEXT_PUBLIC_API_BASE_URL`)
  - Endpoint'leri `baseUrl/[sayfa-adı]` formatında tanımla
  - Try-catch ile error handling ekle
  - Fallback olarak mock data'ya yönlendir
- **Mock Data:** `C:\Users\admin\Desktop\Project\Zeniva\Zeniva-Frontend\src\data\[sayfa-adı]\` klasörü altında `.ts` dosyası oluştur
- **Avantaj:** Endpoint değişikliği için koda girmeden sadece `endpoints.ts`'den değiştirebilirsin

### 2. **Type Tanımları**
- Interface'leri ve type'ları `C:\Users\admin\Desktop\Project\Zeniva\Zeniva-Frontend\src\app\types\` klasörü altında `[sayfa-adı].ts` dosyasına taşı

### 3. **Layout Bileşenleri**
- Layout kullanılıyorsa `C:\Users\admin\Desktop\Project\Zeniva\Zeniva-Frontend\src\app\layout\` klasörü altında ilgili klasör oluştur
- Layout gerekli değilse yazma

### 4. **Component'ler**
- UI bileşenlerini `C:\Users\admin\Desktop\Project\Zeniva\Zeniva-Frontend\src\app\components\` klasörü altında ilgili klasör açıp taşı

### 5. **Hook'lar**
- State yönetimi ve business logic'i `C:\Users\admin\Desktop\Project\Zeniva\Zeniva-Frontend\src\app\hooks\` klasörü altına `use[SayfaAdı].ts` şeklinde taşı

### 6. **Sonuç**
- `page.tsx` dosyasında sadece gerekli import'ları ve component çağrısını bırak
- Dosya mümkün olduğunca temiz ve minimal olsun

## Tamamlanan Sayfalar
- ✅ **Calendar** - Refactor tamamlandı 
  - ✅ Mock data: `/src/data/calender/tasks.ts`
  - ✅ API endpoints: `/src/app/lib/endpoints.ts` 
  - ✅ Types: `/src/app/types/calender.ts`
  - ✅ Hook: `/src/app/hooks/useCalendar.ts`
  - ✅ Component: `/src/app/components/calender/CalendarComponent.tsx`
  - ✅ Page: Minimal import/export yapısı

- ✅ **Messages** - Refactor tamamlandı
  - ✅ Mock data: `/src/data/messages/users.ts`, `/src/data/messages/conversations.ts`
  - ✅ API endpoints: `/src/app/lib/endpoints.ts` (fetchUsers, fetchConversations, sendMessage, etc.)
  - ✅ Types: `/src/app/types/messages.ts`
  - ✅ Hook: `/src/app/hooks/useMessages.ts` (zaten mevcuttu)
  - ✅ Component: `/src/app/components/messages/MessagesComponent.tsx`
  - ✅ Page: Minimal import/export yapısı

- ✅ **Settings** - Refactor tamamlandı
  - ✅ Mock data: Endpoint'lerde fallback olarak tanımlı
  - ✅ API endpoints: `/src/app/lib/endpoints.ts` (fetchUserProfile, updateUserProfile, fetchSecuritySettings, etc.)
  - ✅ Types: `/src/app/types/settings.ts`
  - ✅ Hook: `/src/app/hooks/useSettings.ts`
  - ✅ Components: 
    - `/src/app/components/settings/SettingsComponent.tsx` (Ana component)
    - `/src/app/components/settings/SecuritySettings.tsx`
    - `/src/app/components/settings/NotificationSettings.tsx`
    - `/src/app/components/settings/DataSettings.tsx`
    - `/src/app/components/settings/ApiSettings.tsx`
  - ✅ Page: Minimal import/export yapısı

- ✅ **Tasks** - Refactor tamamlandı
  - ✅ Mock data: Endpoint'lerde fallback olarak tanımlı
  - ✅ API endpoints: `/src/app/lib/endpoints.ts` (fetchTasksFromAPI, createTaskFromAPI, updateTaskFromAPI, deleteTaskFromAPI, fetchUsersFromAPI, fetchProjectsFromAPI)
  - ✅ Types: `/src/app/types/tasks.ts`
  - ✅ Hooks: 
    - `/src/app/hooks/useTasks.ts` (Ana hook - yerel hooks klasöründen taşındı)
    - `/src/app/hooks/useCreateTaskHelpers.ts` (Yardımcı hook - yerel hooks klasöründen taşındı)
  - ✅ Component: `/src/app/components/tasks/TasksComponent.tsx`
  - ✅ Page: Minimal import/export yapısı

- ✅ **Dashboard** - Refactor tamamlandı
  - ✅ Mock data: `/src/data/dashboard/dashboard.ts`
  - ✅ Types: `/src/app/types/dashboard.ts`
  - ✅ Hook: `/src/app/hooks/useDashboard.ts`
  - ✅ Component: `/src/app/components/dashboard/DashboardComponent.tsx`
  - ✅ Page: Minimal import/export yapısı
  - ✅ TimeTracker: Anasayfanın altında görünüyor, right panel'da görünmüyor

- ✅ **Analysis** - Refactor tamamlandı
  - ✅ Mock data: `/src/data/analysis/analysis.ts`
  - ✅ Types: `/src/app/types/analysis.ts` (Comprehensive analytics interfaces)
  - ✅ Hook: `/src/app/hooks/useAnalysis.ts` (Chart data generators, date range management)
  - ✅ Component: `/src/app/components/analysis/AnalysisComponent.tsx` (Full analytics dashboard)
  - ✅ Page: Minimal import/export yapısı
  - ✅ Features: İstatistikler, grafikler, proje ilerlemeleri, hedefler, son aktiviteler
  - ✅ Charts: Task status, priority, time analytics, project progress, performance radar
  - ✅ Export: PDF/Excel/CSV export functionality (placeholder)
  - ✅ Responsive: Mobile-first design with glassmorphism effects

- ✅ **Projects** - Refactor tamamlandı
  - ✅ Mock data: `/src/data/projects/projects.ts` (Comprehensive project data)
  - ✅ Types: `/src/app/types/projects.ts` (Project, ProjectMember, ProjectTask, Milestone, etc.)
  - ✅ Hook: `/src/app/hooks/useProjects.ts` (CRUD operations, filtering, view modes)
  - ✅ Components: 
    - `/src/app/components/projects/ProjectsComponent.tsx` (Main projects page)
    - `/src/app/components/projects/ProjectDetailModal.tsx` (Detailed project view)
    - `/src/app/components/projects/CreateProjectModal.tsx` (Project creation form)
  - ✅ Page: Minimal import/export yapısı
  - ✅ Features: Proje listesi, detay görünümü, oluşturma, düzenleme, silme, kopyalama
  - ✅ Views: Grid ve List görünümleri, filtreleme, arama
  - ✅ Modals: Detaylı proje bilgileri, görevler, üyeler, dosyalar
  - ✅ Status Management: Proje durumu değiştirme (aktif, duraklatıldı, tamamlandı)
  - ✅ Responsive: Mobile-first design with glassmorphism effects

- ✅ **Disk** - Refactor tamamlandı
  - ✅ Mock data: `/src/data/disk/disk.ts` (Comprehensive disk data with files, usage, stats)
  - ✅ API endpoints: `/src/app/lib/endpoints.ts` (fetchDiskData, fetchDiskFiles, fetchDiskUsage, fetchDiskStats, deleteDiskFile, downloadDiskFile, uploadDiskFile, searchDiskFiles)
  - ✅ Types: `/src/app/types/disk.ts` (DiskFile, DiskUsage, DiskStats, DiskFilter, DiskSort, DiskView, DiskData)
  - ✅ Hook: `/src/app/hooks/useDisk.ts` (Comprehensive disk management with filtering, sorting, pagination)
  - ✅ Component: `/src/app/components/disk/DiskComponent.tsx` (Full disk management interface)
  - ✅ Page: Minimal import/export yapısı
  - ✅ Features: Dosya listesi, disk kullanım grafiği, filtreleme, arama, sıralama, toplu işlemler
  - ✅ File Management: Dosya yükleme, indirme, silme, görüntüleme
  - ✅ Usage Tracking: 1GB limit, pasta grafiği ile kullanım gösterimi, türlere göre kullanım
  - ✅ Views: Grid ve List görünümleri, sayfalama
  - ✅ Filters: Dosya türü, kaynak, tarih aralığı, boyut aralığı, arama
  - ✅ Statistics: Toplam dosya sayısı, boyut, en büyük dosyalar, son yüklenenler
  - ✅ Responsive: Mobile-first design with glassmorphism effects