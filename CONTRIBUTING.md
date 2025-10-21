# 🤝 Zeniva Frontend'e Katkıda Bulunma Rehberi

Zeniva Frontend projesine katkıda bulunmak istediğiniz için teşekkür ederiz! Bu rehber, projeye nasıl katkıda bulunabileceğinizi açıklar.

## 📋 İçindekiler

- [Geliştirme Ortamı Kurulumu](#geliştirme-ortamı-kurulumu)
- [Kod Standartları](#kod-standartları)
- [Commit Mesaj Formatı](#commit-mesaj-formatı)
- [Pull Request Süreci](#pull-request-süreci)
- [Issue Raporlama](#issue-raporlama)
- [Kod İnceleme Süreci](#kod-İnceleme-süreci)

## 🛠️ Geliştirme Ortamı Kurulumu

### Ön Gereksinimler
- Node.js 18.0+
- Bun paket yöneticisi
- Git
- VS Code (önerilen)

### Kurulum Adımları
1. **Projeyi Fork Edin**
   ```bash
   # GitHub'da fork butonuna tıklayın
   ```

2. **Yerel Kopyayı Klonlayın**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Zeniva-Frontend.git
   cd Zeniva-Frontend
   ```

3. **Upstream Remote Ekleyin**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/Zeniva-Frontend.git
   ```

4. **Bağımlılıkları Yükleyin**
   ```bash
   bun install
   ```

5. **Ortam Değişkenlerini Ayarlayın**
   ```bash
   cp .env.example .env.local
   # .env.local dosyasını düzenleyin
   ```

6. **Geliştirme Sunucusunu Başlatın**
   ```bash
   bun run dev
   ```

## 📝 Kod Standartları

### TypeScript
- Strict mode kullanın
- Interface'leri PascalCase ile adlandırın
- Type'ları explicit olarak belirtin
- `any` kullanımından kaçının

```typescript
// ✅ Doğru
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// ❌ Yanlış
interface userprofile {
  id: any;
  name: any;
}
```

### React Bileşenleri
- Functional component kullanın
- Props interface'ini tanımlayın
- Default export kullanın
- Bileşen adlarını PascalCase ile yazın

```typescript
// ✅ Doğru
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
```

### CSS ve Styling
- TailwindCSS utility class'larını kullanın
- Custom CSS'i minimize edin
- Responsive tasarım uygulayın
- Dark mode desteği ekleyin

```tsx
// ✅ Doğru
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Başlık</h2>
</div>
```

### Dosya ve Klasör Adlandırma
- Bileşenler: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase (`useAuth.ts`)
- Utilities: camelCase (`formatDate.ts`)
- Sayfalar: kebab-case (`user-profile/page.tsx`)

## 📨 Commit Mesaj Formatı

Conventional Commits standardını kullanıyoruz:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Türleri
- `feat`: Yeni özellik
- `fix`: Bug düzeltmesi
- `docs`: Dokümantasyon değişikliği
- `style`: Kod formatı değişikliği
- `refactor`: Kod yeniden düzenleme
- `test`: Test ekleme/düzenleme
- `chore`: Build süreçleri, dependency güncellemeleri

### Örnekler
```bash
feat(auth): add login functionality
fix(dashboard): resolve chart rendering issue
docs(readme): update installation instructions
style(components): format button component
refactor(hooks): optimize useAuth hook
test(utils): add tests for date formatting
chore(deps): update dependencies
```

## 🔄 Pull Request Süreci

### 1. Feature Branch Oluşturun
```bash
git checkout -b feature/amazing-feature
```

### 2. Değişikliklerinizi Yapın
- Küçük, odaklanmış commit'ler yapın
- Test ekleyin/güncelleyin
- Dokümantasyonu güncelleyin

### 3. Kod Kalitesi Kontrolü
```bash
# Linting
bun run lint

# Type checking
bun run type-check

# Build test
bun run build
```

### 4. Upstream ile Senkronize Edin
```bash
git fetch upstream
git rebase upstream/main
```

### 5. Push ve PR Oluşturun
```bash
git push origin feature/amazing-feature
```

### PR Şablonu
```markdown
## 📝 Açıklama
Bu PR'da yapılan değişikliklerin kısa açıklaması.

## 🔄 Değişiklik Türü
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## 🧪 Test Edildi
- [ ] Yerel ortamda test edildi
- [ ] Unit testler eklendi/güncellendi
- [ ] Integration testler çalıştırıldı

## 📸 Ekran Görüntüleri
(Varsa UI değişikliklerinin ekran görüntüleri)

## 📋 Checklist
- [ ] Kod self-review yapıldı
- [ ] Dokümantasyon güncellendi
- [ ] Lint kuralları geçiyor
- [ ] Build başarılı
```

## 🐛 Issue Raporlama

### Bug Raporu Şablonu
```markdown
## 🐛 Bug Açıklaması
Bugun kısa ve net açıklaması.

## 🔄 Yeniden Üretme Adımları
1. '...' sayfasına git
2. '...' butonuna tıkla
3. '...' formunu doldur
4. Hatayı gör

## 🎯 Beklenen Davranış
Ne olması gerektiğinin açıklaması.

## 📸 Ekran Görüntüleri
(Varsa hata ekran görüntüleri)

## 🖥️ Ortam Bilgileri
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]
```

### Feature Request Şablonu
```markdown
## 🚀 Özellik Açıklaması
Önerilen özelliğin kısa açıklaması.

## 🎯 Motivasyon
Bu özelliğin neden gerekli olduğu.

## 💡 Çözüm Önerisi
Özelliğin nasıl implement edilebileceği.

## 🔄 Alternatifler
Düşünülen diğer çözümler.
```

## 👀 Kod İnceleme Süreci

### İnceleme Kriterleri
- **Fonksiyonellik**: Kod beklendiği gibi çalışıyor mu?
- **Performans**: Performans sorunları var mı?
- **Güvenlik**: Güvenlik açıkları var mı?
- **Okunabilirlik**: Kod anlaşılır mı?
- **Test**: Yeterli test coverage var mı?

### İnceleme Yorumları
- Yapıcı ve saygılı olun
- Örnekler verin
- Öğretici yaklaşım benimseyin
- Övgüyü de unutmayın

## 🏷️ Etiketler ve Milestone'lar

### Issue Etiketleri
- `bug`: Hata raporları
- `enhancement`: Yeni özellik önerileri
- `documentation`: Dokümantasyon işleri
- `good first issue`: Yeni başlayanlar için
- `help wanted`: Yardım aranan konular
- `priority-high`: Yüksek öncelikli
- `priority-low`: Düşük öncelikli

### PR Etiketleri
- `ready-for-review`: İncelemeye hazır
- `work-in-progress`: Devam eden çalışma
- `needs-changes`: Değişiklik gerekli
- `approved`: Onaylandı

## 🎉 Teşekkürler

Zeniva Frontend projesine katkıda bulunan herkese teşekkür ederiz! Sizin katkılarınız bu projeyi daha iyi hale getiriyor.

## 📞 İletişim

Sorularınız için:
- GitHub Discussions
- Issue tracker
- E-posta: developers@zeniva.com

---

**Mutlu kodlamalar! 🚀**
