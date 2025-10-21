# 🚀 Zeniva Frontend - Modern İş Yönetimi Platformu

Zeniva, modern ekip ve iş yönetimi ihtiyaçlarını karşılamak üzere geliştirilmiş kapsamlı bir web uygulamasıdır. Next.js 15 ve React 18 teknolojileri kullanılarak oluşturulan bu platform, kullanıcıların proje yönetimi, görev takibi, takvim organizasyonu, mesajlaşma ve raporlama gibi temel iş akışlarını kolayca gerçekleştirebileceği modüler yapıya sahiptir.

## ✨ Ana Özellikler

- **🔐 Kimlik Doğrulama ve Yetkilendirme**: Güvenli kullanıcı girişi ve rol tabanlı erişim kontrolü
- **📋 Görev Yönetimi**: Görev oluşturma, düzenleme, atama ve takip sistemi
- **📅 Takvim Entegrasyonu**: FullCalendar ile etkinlik planlama ve zaman yönetimi
- **💬 Gerçek Zamanlı Mesajlaşma**: SignalR ve Socket.io ile anlık iletişim
- **📊 Dashboard ve Analitik**: Detaylı raporlama ve veri görselleştirme
- **🗂️ Proje Yönetimi**: Çoklu proje desteği ve workspace organizasyonu
- **📁 Dosya Yönetimi**: Bulut tabanlı dosya depolama ve paylaşım
- **⚙️ Ayarlar ve Konfigürasyon**: Kullanıcı ve sistem ayarları yönetimi

## 🎯 Hedef Kitle

Bu platform özellikle şu kullanıcı grupları için tasarlanmıştır:
- Küçük ve orta ölçekli işletmeler
- Yazılım geliştirme ekipleri
- Proje yöneticileri ve ekip liderleri
- Freelancer'lar ve danışmanlar

---

## 🗂 Proje Klasör Yapısı

```
zeniva-frontend/
├── public/                     # Statik dosyalar (favicon, resimler vb.)
├── src/
│   └── app/                   # Next.js App Router yapısı
│       ├── auth/              # Kimlik doğrulama sayfaları
│       ├── components/        # Yeniden kullanılabilir bileşenler
│       │   ├── analysis/      # Analiz bileşenleri
│       │   ├── calender/      # Takvim bileşenleri
│       │   ├── dashboard/     # Dashboard bileşenleri
│       │   ├── messages/      # Mesajlaşma bileşenleri
│       │   ├── projects/      # Proje yönetimi bileşenleri
│       │   ├── settings/      # Ayarlar bileşenleri
│       │   └── tasks/         # Görev yönetimi bileşenleri
│       ├── contexts/          # React Context API
│       ├── dashboard/         # Dashboard sayfaları
│       │   ├── analysis/      # Analiz ve raporlama
│       │   ├── calender/      # Takvim yönetimi
│       │   ├── disk/          # Dosya yönetimi
│       │   ├── messages/      # Mesajlaşma sistemi
│       │   ├── projects/      # Proje yönetimi
│       │   ├── reports/       # Raporlama modülü
│       │   ├── settings/      # Sistem ayarları
│       │   └── tasks/         # Görev yönetimi
│       ├── hooks/             # Özel React Hook'ları
│       ├── lib/               # Yardımcı kütüphaneler
│       ├── types/             # TypeScript tip tanımları
│       ├── utils/             # Yardımcı fonksiyonlar
│       ├── workspaces/        # Workspace yönetimi
│       ├── globals.css        # Global CSS stilleri
│       ├── layout.tsx         # Ana layout bileşeni
│       └── page.tsx           # Ana sayfa
├── .env                       # Ortam değişkenleri
├── .gitignore                # Git ignore kuralları
├── bun.lockb                 # Bun paket yöneticisi lock dosyası
├── next.config.ts            # Next.js konfigürasyonu
├── package.json              # Proje bağımlılıkları ve scriptler
├── postcss.config.mjs        # PostCSS konfigürasyonu
├── tailwind.config.js        # TailwindCSS konfigürasyonu
├── tsconfig.json             # TypeScript konfigürasyonu
└── README.md                 # Proje dokümantasyonu
```

---

## 🧪 Kullanılan Teknolojiler

### Frontend Framework
- **Next.js 15.3.4** – React tabanlı modern framework, App Router ile gelişmiş routing
- **React 18** – Kullanıcı arayüzü bileşenleri ve state yönetimi
- **TypeScript 5.9** – Statik tip denetimi ve geliştirici deneyimi

### Styling ve UI
- **TailwindCSS 3.4** – Utility-first CSS framework
- **PostCSS 8.4** – CSS işleme ve optimizasyon
- **Lucide React** – Modern ikon kütüphanesi
- **Heroicons** – Ek ikon desteği

### Gerçek Zamanlı İletişim
- **Microsoft SignalR 9.0** – .NET backend ile gerçek zamanlı iletişim
- **Socket.io Client 4.8** – WebSocket tabanlı anlık mesajlaşma

### UI Bileşenleri ve Kütüphaneler
- **FullCalendar 6.1** – Takvim ve etkinlik yönetimi
- **Headless UI 2.2** – Erişilebilir UI bileşenleri
- **React Select 5.10** – Gelişmiş seçim bileşenleri
- **React Icons 5.5** – Kapsamlı ikon koleksiyonu

### HTTP ve API
- **Axios 1.10** – HTTP istemci kütüphanesi
- **API Proxy** – Backend API'sine proxy yönlendirme

### Geliştirme Araçları
- **Bun** – Hızlı paket yöneticisi ve runtime
- **ESLint 9** – Kod kalitesi ve standartları
- **Bundle Analyzer** – Paket boyutu analizi

---

## ⚙️ Kurulum ve Çalıştırma

### Ön Gereksinimler
- **Node.js** 18.0 veya üzeri
- **Bun** paket yöneticisi (önerilen) veya **npm**
- **Git** versiyon kontrol sistemi

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd Zeniva-Frontend
```

### 2. Bağımlılıkları Yükleyin
```bash
# Bun kullanarak (önerilen)
bun install

# veya npm kullanarak
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın
`.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# API Konfigürasyonu
NEXT_PUBLIC_API_BASE_URL=https://localhost:7171
NEXT_PUBLIC_API_URL=https://localhost:7171/api

# Uygulama Konfigürasyonu
NEXT_PUBLIC_APP_NAME=Zeniva
NEXT_PUBLIC_APP_VERSION=1.0.0

# SignalR Hub URL'leri
NEXT_PUBLIC_SIGNALR_HUB_URL=https://localhost:7171/hubs

# Geliştirme Ayarları
NODE_ENV=development
ANALYZE=false
```

### 4. Geliştirme Sunucusunu Başlatın
```bash
# Bun ile (Turbopack ile hızlı geliştirme)
bun run dev

# veya npm ile
npm run dev
```

### 5. Uygulamayı Açın
Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

### Diğer Komutlar
```bash
# Üretim için build
bun run build

# Üretim sunucusunu başlat
bun run start

# Kod kalitesi kontrolü
bun run lint

# Paket analizi
ANALYZE=true bun run build

# Temizlik işlemleri
bun run clean
```

---

## 📂 Modüller ve Özellikler

### 🔐 Kimlik Doğrulama (`/auth`)
- Kullanıcı girişi ve kayıt sistemi
- JWT token tabanlı oturum yönetimi
- Rol tabanlı erişim kontrolü
- Şifre sıfırlama ve e-posta doğrulama

### 📊 Dashboard (`/dashboard`)
- **Ana Panel**: Genel bakış ve hızlı erişim
- **Analiz**: Performans metrikleri ve grafikler
- **Takvim**: Etkinlik planlama ve zaman yönetimi
- **Mesajlar**: Gerçek zamanlı iletişim sistemi
- **Projeler**: Proje oluşturma ve yönetimi
- **Görevler**: Görev atama ve takip sistemi
- **Raporlar**: Detaylı analiz ve raporlama
- **Dosyalar**: Bulut tabanlı dosya yönetimi
- **Ayarlar**: Kullanıcı ve sistem konfigürasyonu

### 🏢 Workspace Yönetimi (`/workspaces`)
- Çoklu workspace desteği
- Ekip üyesi davet sistemi
- Workspace bazlı yetkilendirme
- Proje ve görev organizasyonu

---

## 🔧 API Entegrasyonu

### Backend Bağlantısı
Proje, ASP.NET Core backend ile entegre çalışacak şekilde tasarlanmıştır:

```typescript
// next.config.ts - API Proxy Konfigürasyonu
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
    },
  ];
}
```

### SignalR Hub Bağlantıları
```typescript
// Gerçek zamanlı iletişim için SignalR
const connection = new HubConnectionBuilder()
  .withUrl(`${process.env.NEXT_PUBLIC_SIGNALR_HUB_URL}/chatHub`)
  .build();
```

### HTTP İstekleri
```typescript
// Axios ile API çağrıları
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
```

---

## 🎨 UI/UX Tasarım Sistemi

### Renk Paleti
- **Primary**: Mavi tonları (brand identity)
- **Secondary**: Gri tonları (neutral)
- **Success**: Yeşil tonları (başarı durumları)
- **Warning**: Sarı tonları (uyarılar)
- **Error**: Kırmızı tonları (hata durumları)

### Bileşen Kütüphanesi
- **Form Bileşenleri**: Input, Select, Checkbox, Radio
- **Navigasyon**: Navbar, Sidebar, Breadcrumb
- **Veri Gösterimi**: Table, Card, Modal, Toast
- **Etkileşim**: Button, Dropdown, Tooltip

---

## 🚀 Performans Optimizasyonları

### Next.js Özellikleri
- **App Router**: Gelişmiş routing ve layout sistemi
- **Server Components**: Sunucu tarafı rendering
- **Image Optimization**: Otomatik resim optimizasyonu
- **Code Splitting**: Otomatik kod bölümleme

### Bundle Analizi
```bash
# Paket boyutunu analiz etmek için
ANALYZE=true bun run build
```

### Caching Stratejileri
- Static asset caching (31536000 saniye)
- API response caching
- Browser cache optimization

---

## 🧪 Test ve Kalite Kontrolü

### Kod Kalitesi
```bash
# ESLint ile kod kontrolü
bun run lint

# TypeScript tip kontrolü
bun run type-check
```

### Geliştirme Standartları
- **TypeScript**: Strict mode aktif
- **ESLint**: Next.js önerilen kurallar
- **Prettier**: Kod formatlama (opsiyonel)
- **Husky**: Pre-commit hooks (opsiyonel)

---

## 📚 Geliştirici Rehberi

### Yeni Bileşen Ekleme
1. `src/app/components/` altında uygun klasöre ekleyin
2. TypeScript interface'lerini tanımlayın
3. Props validation ekleyin
4. Responsive tasarım uygulayın

### Yeni Sayfa Oluşturma
1. `src/app/` altında klasör oluşturun
2. `page.tsx` dosyası ekleyin
3. Gerekirse `layout.tsx` ekleyin
4. Routing'i test edin

### State Yönetimi
- **Local State**: useState, useReducer
- **Global State**: React Context API
- **Server State**: SWR veya React Query (gelecek)

---

## 🔒 Güvenlik

### Güvenlik Önlemleri
- CORS konfigürasyonu
- XSS koruması
- CSRF token kullanımı
- Secure cookie ayarları
- Environment variable güvenliği

### Best Practices
- API anahtarlarını environment variable'larda saklayın
- Hassas verileri client-side'da saklamayın
- HTTPS kullanımını zorunlu kılın
- Input validation uygulayın

---

## 📄 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakınız.

---

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

---

## 📞 İletişim ve Destek

- **Proje Sahibi**: Zeniva Team
- **E-posta**: support@zeniva.com
- **Dokümantasyon**: [docs.zeniva.com](https://docs.zeniva.com)
- **Issue Tracker**: GitHub Issues

---

**Zeniva Frontend** - Modern iş yönetimi için geliştirilmiş, ölçeklenebilir ve kullanıcı dostu web uygulaması.
