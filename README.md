# 🚀 x24-web-next - Next.js Projesi

Bu proje, modern ekip ve iş yönetimi ihtiyaçlarını karşılamak üzere geliştirilmiş kapsamlı bir web uygulamasıdır. Kullanıcıların proje yönetimi, görev takibi, takvim organizasyonu, mesajlaşma ve raporlama gibi temel iş akışlarını kolayca gerçekleştirebileceği modüler yapıya sahiptir.

Proje, kullanıcı dostu arayüzü ve gerçek zamanlı iletişim özellikleri sayesinde ekiplerin verimliliğini artırmayı hedefler. Gelişmiş yetkilendirme ve erişim kontrolleriyle her kullanıcının rolüne uygun işlevsellik sunar.

Ana özellikler:

    Kullanıcı kimlik doğrulama ve rol yönetimi

    Görev oluşturma, düzenleme ve takip

    Takvim entegrasyonu ile etkinlik planlama

    Gerçek zamanlı mesajlaşma ve bildirimler

    Dashboard üzerinden detaylı analiz ve raporlama

Projede modern web teknolojileri ve esnek mimari kullanılarak, ölçeklenebilir ve sürdürülebilir bir platform oluşturulmuştur.

---

## 🗂 Proje Klasör Yapısı
```
x24-web-next/
├── public/ # Statik dosyalar (resimler, ikonlar vb.)
├── src/
│ └── app/ # Next.js sayfaları ve modüller
│ ├── auth/ # Giriş ve kayıt sayfaları
│ ├── dashboard/ # Dashboard ve alt bileşenler
│ ├── lib/ # Yardımcı kütüphaneler (socket.ts vb.)
│ ├── utils/ # Yardımcı fonksiyonlar (cookie yönetimi vb.)
│ ├── globals.css # Global stil dosyası
│ └── layout.tsx # Genel layout bileşeni
├── .env # Ortam değişkenleri
├── .gitignore # Git takip edilmeyecek dosyalar
├── alist.txt # (Projeye özel, dikkat edilmesi gereken dosya)
├── package.json # Bağımlılıklar ve scriptler
├── README.md # Proje açıklamaları (bu dosya)
└── tsconfig.json # TypeScript konfigürasyonu
```

---

## 🧪 Kullanılan Teknolojiler

- **Next.js 13** – React tabanlı framework, App Router ile sayfa ve API yönetimi  
- **TypeScript** – Statik tip denetimi  
- **React** – UI bileşenleri  
- **PostCSS** – CSS işleme  
- **Socket.io (lib/socket.ts)** – Gerçek zamanlı iletişim için kütüphane  
- **ESLint** – Kod kalitesini sağlamak için linting  
- **Vercel** – Kolay deploy ve hosting (opsiyonel)

---

## ⚙️ Kurulum ve Çalıştırma

1. Depoyu klonlayın:

```bash
git clone https://github.com/kullaniciAdi/x24-web-next.git
cd x24-web-next

    Bağımlılıkları yükleyin:

npm install

    Ortam değişkenlerini .env dosyasına ekleyin (örnek):

NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXTAUTH_SECRET=guclu_bir_secret

    Geliştirme modunda çalıştırın:

npm run dev

Tarayıcıda http://localhost:3000 adresini açın.
📂 Öne Çıkan Özellikler ve Modüller

    Auth: Giriş ve kayıt sayfaları (src/app/auth/)

    Dashboard: Kullanıcı panosu, analiz, mesajlar, takvim, projeler vb. (src/app/dashboard/)

    Gerçek zamanlı iletişim: src/lib/socket.ts üzerinden WebSocket bağlantısı

    Yenilikçi dosya yapısı: Next.js 13 App Router ve modüler dizinler

📬 API ve Veri Yönetimi

    API endpointleri Next.js API Routes ile entegre edilebilir (opsiyonel)

    Çerez yönetimi src/utils/cookies.ts ile yapılmakta

🎯 Projeyi Geliştirmek İçin İpuçları

    Komponentleri src/app/dashboard/components/ içinde modüler şekilde geliştir

    hooks klasörleri özel işlevsellik için React hook’ları içerir

    layout.tsx genel sayfa yapısını yönetir

    .env dosyasındaki gizli anahtarları gizli tut

📄 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.
