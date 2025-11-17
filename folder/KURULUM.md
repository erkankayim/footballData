# MenuMaster AI - Kurulum Rehberi

## ✅ Tamamlanan Adımlar

1. ✅ Next.js 15 projesi oluşturuldu
2. ✅ Tüm bağımlılıklar yüklendi (589 paket)
3. ✅ Prisma schema oluşturuldu (14 model)
4. ✅ NextAuth.js authentication kuruldu
5. ✅ Tüm sayfallar ve API route'ları oluşturuldu
6. ✅ .env.local dosyası hazırlandı

## 🔧 Yerel Bilgisayarınızda Yapmanız Gerekenler

### 1. Veritabanını Oluştur

Bu ortamda network kısıtlamaları nedeniyle Prisma migration çalıştırılamıyor.
Yerel bilgisayarınızda şu adımları izleyin:

```bash
cd /path/to/folder

# Prisma Client oluştur
npm run db:generate

# Veritabanı tablolarını oluştur
npm run db:push
```

### Alternatif: SQL Script ile Manuel Kurulum

Eğer Prisma ile sorun yaşarsanız, `init.sql` dosyasını kullanarak manuel olarak kurabilirsiniz:

```bash
# psql ile bağlan
PGPASSWORD='Erkan!123**' psql -h db.aqjvamyyuctficykcyga.supabase.co -U postgres -d postgres -p 5432

# SQL dosyasını çalıştır
\i init.sql
```

### 2. OpenAI API Key Ekle

`.env.local` dosyasında `OPENAI_API_KEY` değişkenine gerçek API key'inizi ekleyin:

```env
OPENAI_API_KEY="sk-proj-YOUR-REAL-KEY-HERE"
```

### 3. Uygulamayı Başlat

```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacak.

## 📁 Proje Yapısı

```
folder/
├── app/
│   ├── api/              # API Route'lar
│   │   ├── auth/         # NextAuth endpoint'leri
│   │   ├── categories/   # Kategori CRUD
│   │   ├── menu-items/   # Menü ürünleri CRUD + Reçete
│   │   ├── ingredients/  # Malzeme CRUD
│   │   ├── qr-codes/     # QR kod yönetimi
│   │   ├── ai/           # AI fiyat önerileri
│   │   ├── analytics/    # Analitik raporlar
│   │   └── competitors/  # Rakip analizi
│   ├── dashboard/        # Dashboard sayfaları
│   ├── menu/[slug]/      # Mobil QR menü
│   ├── login/            # Giriş sayfası
│   └── register/         # Kayıt sayfası
├── components/
│   ├── ui/              # Shadcn/ui bileşenleri
│   └── providers/       # SessionProvider
├── lib/
│   ├── prisma.ts        # Prisma client
│   ├── auth.ts          # NextAuth konfigürasyonu
│   ├── openai.ts        # OpenAI entegrasyonu
│   └── utils.ts         # Utility fonksiyonlar
├── prisma/
│   └── schema.prisma    # Veritabanı şeması
├── .env.local           # Çevre değişkenleri
└── package.json         # Bağımlılıklar

```

## 🗃️ Veritabanı Modelleri

1. **User** - Kullanıcılar (Owner, Manager, Staff)
2. **Restaurant** - Restoranlar
3. **Location** - Restoran lokasyonları
4. **Category** - Menü kategorileri (çok dilli)
5. **MenuItem** - Menü ürünleri (çok dilli)
6. **MenuVariant** - Ürün varyantları (Küçük, Orta, Büyük vb.)
7. **Ingredient** - Malzemeler + stok takibi
8. **Recipe** - Ürün reçeteleri (malzeme-ürün ilişkisi)
9. **PriceHistory** - Fiyat değişiklik geçmişi
10. **QRCode** - QR kodlar + masa numaraları
11. **MenuView** - Menü görüntüleme istatistikleri
12. **CompetitorPrice** - Rakip fiyat analizi
13. **AISuggestion** - AI fiyat önerileri

## 🎯 Özellikler

### ✅ Tamamlanan Özellikler

1. **Authentication**
   - Email/Password ile giriş
   - JWT tabanlı session yönetimi
   - Role-based access control (Owner, Manager, Staff)

2. **QR Menü Sistemi**
   - Dinamik QR kod oluşturma
   - Mobil-first responsive tasarım
   - 4 dil desteği (TR, EN, AR, RU)
   - Kategori bazlı ürün gösterimi
   - Ürün varyantları desteği

3. **Menü Yönetimi**
   - Kategori CRUD
   - Menü ürünleri CRUD
   - Otomatik kar marjı hesaplama
   - Fiyat değişiklik takibi
   - Görsel yükleme desteği (URL ile)

4. **Maliyet Hesaplama**
   - Malzeme yönetimi + stok takibi
   - Reçete builder (ürün-malzeme ilişkisi)
   - Otomatik maliyet hesaplama
   - Birim dönüşümleri (KG→G, L→ML)
   - Cascade güncellemeler (malzeme fiyatı değişince tüm ürünler güncellenir)
   - Düşük stok uyarıları

5. **Analytics & AI**
   - Menü görüntüleme takibi
   - Popüler ürün raporları
   - OpenAI GPT-4o entegrasyonu
   - Akıllı fiyat önerileri
   - AI önerilerini kabul/red etme sistemi

6. **Rakip Analizi**
   - Manuel rakip fiyat girişi
   - Fiyat karşılaştırma göstergeleri
   - Yüzdesel fiyat farkı hesaplama

7. **QR Kod Yönetimi**
   - QR kod oluşturma
   - Masa numarası atama
   - Görüntüleme istatistikleri
   - Aktif/Pasif durum yönetimi

8. **Ayarlar**
   - Restoran bilgileri düzenleme
   - Logo URL yönetimi
   - Renk teması özelleştirme
   - Abonelik bilgileri görüntüleme

## 🎨 Kullanılan Teknolojiler

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS, Shadcn/ui, Radix UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 6.2
- **Authentication**: NextAuth.js 4
- **AI**: OpenAI GPT-4o
- **State Management**: Zustand 5
- **Form Handling**: React Hook Form + Zod
- **QR Codes**: qrcode library
- **Charts**: Recharts
- **Date**: date-fns

## 💰 Abonelik Paketleri

### Starter - 500₺/ay
- 1 restoran
- 3 lokasyon
- 50 ürün
- Temel analytics
- QR menü
- Maliyet hesaplama

### Professional - 1500₺/ay
- 3 restoran
- 10 lokasyon
- 200 ürün
- Gelişmiş analytics
- AI fiyat önerileri
- Rakip analizi
- Reçete yönetimi

### Enterprise - 2500₺/ay
- Sınırsız restoran
- Sınırsız lokasyon
- Sınırsız ürün
- Özel raporlar
- API erişimi
- Öncelikli destek
- White-label seçeneği

## 🔐 Güvenlik

- Şifreler bcrypt ile hash'leniyor
- JWT token tabanlı authentication
- Server-side session validation
- SQL injection koruması (Prisma ORM)
- XSS koruması

## 📝 İlk Kullanım

1. Uygulamayı başlattıktan sonra `/register` sayfasından kayıt olun
2. Otomatik olarak bir restoran oluşturulur
3. Dashboard'da kategoriler ve ürünler ekleyin
4. Malzeme ve reçete tanımlayın
5. QR kod oluşturun ve yazdırın
6. AI fiyat önerilerini deneyin

## 🚀 Production Deployment

### Vercel'e Deploy

```bash
# Vercel CLI kur
npm i -g vercel

# Deploy et
vercel --prod
```

### Çevre Değişkenlerini Ekle

Vercel dashboard'da şunları ekleyin:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (production URL'niz)
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_BASE_URL`

## 📞 Destek

Sorun yaşarsanız:
1. `.env.local` dosyasını kontrol edin
2. Veritabanı bağlantısını test edin
3. Console logları inceleyin
4. Prisma migration'ları tekrar çalıştırın

## ✨ Sonraki Adımlar (Opsiyonel)

- [ ] Stripe payment entegrasyonu
- [ ] Email sistemi (Resend)
- [ ] Image upload (Cloudinary)
- [ ] Çok lokasyonlu stok senkronizasyonu
- [ ] Mobil uygulama (React Native)
- [ ] Advanced reporting & exports
- [ ] Webhook entegrasyonları
- [ ] Multi-tenant architecture
