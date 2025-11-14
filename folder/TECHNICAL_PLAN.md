# MenuMaster AI - Teknik Proje Planı

## 🗄️ Database Şeması

### 1. Restaurants (Restoranlar)
```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  owner_id UUID REFERENCES users(id),
  logo_url TEXT,
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  subscription_tier ENUM('starter', 'professional', 'enterprise'),
  subscription_status ENUM('active', 'cancelled', 'expired'),
  subscription_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Locations (Şubeler)
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Categories (Kategoriler)
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  name_ar VARCHAR(255),
  name_ru VARCHAR(255),
  description TEXT,
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Menu Items (Ürünler)
```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  category_id UUID REFERENCES categories(id),
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  name_ar VARCHAR(255),
  name_ru VARCHAR(255),
  description TEXT,
  description_en TEXT,
  description_ar TEXT,
  description_ru TEXT,
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2), -- Maliyet
  profit_margin DECIMAL(5, 2), -- Kar marjı %
  images JSONB DEFAULT '[]', -- Array of image URLs
  allergens JSONB DEFAULT '[]', -- ["gluten", "dairy", "nuts"]
  calories INTEGER,
  preparation_time INTEGER, -- Dakika
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Item Variants (Ürün Varyantları - Küçük/Orta/Büyük)
```sql
CREATE TABLE item_variants (
  id UUID PRIMARY KEY,
  menu_item_id UUID REFERENCES menu_items(id),
  name VARCHAR(100) NOT NULL, -- "Küçük", "Orta", "Büyük"
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2),
  sort_order INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true
);
```

### 6. Ingredients (Malzemeler)
```sql
CREATE TABLE ingredients (
  id UUID PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  name VARCHAR(255) NOT NULL,
  unit ENUM('kg', 'g', 'l', 'ml', 'adet') NOT NULL,
  current_price DECIMAL(10, 2) NOT NULL, -- Güncel fiyat
  stock_quantity DECIMAL(10, 2) DEFAULT 0,
  min_stock_level DECIMAL(10, 2), -- Minimum stok uyarısı
  supplier VARCHAR(255),
  last_purchase_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7. Recipes (Reçeteler - Ürün içinde ne var?)
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY,
  menu_item_id UUID REFERENCES menu_items(id),
  ingredient_id UUID REFERENCES ingredients(id),
  quantity DECIMAL(10, 2) NOT NULL,
  unit ENUM('kg', 'g', 'l', 'ml', 'adet') NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 8. Competitor Prices (Rakip Fiyatları)
```sql
CREATE TABLE competitor_prices (
  id UUID PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  competitor_name VARCHAR(255) NOT NULL,
  competitor_url TEXT,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  matched_menu_item_id UUID REFERENCES menu_items(id), -- Hangi ürününüze denk geliyor?
  platform ENUM('yemeksepeti', 'getir', 'website', 'manual'),
  scraped_at TIMESTAMP DEFAULT NOW()
);
```

### 9. Price History (Fiyat Geçmişi)
```sql
CREATE TABLE price_history (
  id UUID PRIMARY KEY,
  menu_item_id UUID REFERENCES menu_items(id),
  old_price DECIMAL(10, 2) NOT NULL,
  new_price DECIMAL(10, 2) NOT NULL,
  changed_by UUID REFERENCES users(id),
  reason TEXT, -- "Rakipler fiyat düşürdü", "Malzeme fiyatı arttı"
  changed_at TIMESTAMP DEFAULT NOW()
);
```

### 10. QR Codes (QR Kodları)
```sql
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  location_id UUID REFERENCES locations(id),
  table_number VARCHAR(10), -- "Masa 5", "Kasiyer", null (genel menü)
  qr_code_url TEXT NOT NULL,
  short_url VARCHAR(100) UNIQUE, -- menumaster.ai/abc123
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 11. Menu Views (Menü Görüntülemeleri - Analytics)
```sql
CREATE TABLE menu_views (
  id UUID PRIMARY KEY,
  qr_code_id UUID REFERENCES qr_codes(id),
  menu_item_id UUID REFERENCES menu_items(id),
  user_agent TEXT,
  ip_address INET,
  country VARCHAR(2),
  city VARCHAR(100),
  viewed_at TIMESTAMP DEFAULT NOW()
);
```

### 12. AI Suggestions (AI Önerileri)
```sql
CREATE TABLE ai_suggestions (
  id UUID PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  suggestion_type ENUM('price_change', 'menu_placement', 'cross_sell', 'remove_item', 'add_item'),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  confidence_score DECIMAL(3, 2), -- 0.85 = %85 emin
  estimated_revenue_impact DECIMAL(10, 2), -- Tahmini gelir etkisi
  status ENUM('pending', 'accepted', 'rejected', 'applied'),
  metadata JSONB, -- Suggestion-specific data
  created_at TIMESTAMP DEFAULT NOW(),
  applied_at TIMESTAMP
);
```

### 13. Orders (Siparişler) - Future feature
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  location_id UUID REFERENCES locations(id),
  table_number VARCHAR(10),
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'preparing', 'ready', 'delivered', 'cancelled'),
  items JSONB NOT NULL, -- Array of {menu_item_id, quantity, price}
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

### 14. Users (Kullanıcılar - Restoran sahipleri ve çalışanlar)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('owner', 'manager', 'waiter', 'chef'),
  restaurant_id UUID REFERENCES restaurants(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          - Yeni restoran kaydı
POST   /api/auth/login             - Giriş
POST   /api/auth/logout            - Çıkış
GET    /api/auth/me                - Kullanıcı bilgisi
```

### Restaurants
```
GET    /api/restaurants            - Restoranları listele
GET    /api/restaurants/:id        - Restoran detayı
POST   /api/restaurants            - Yeni restoran oluştur
PATCH  /api/restaurants/:id        - Restoran güncelle
DELETE /api/restaurants/:id        - Restoran sil
```

### Menu Items
```
GET    /api/restaurants/:id/menu             - Tüm menüyü getir
GET    /api/restaurants/:id/menu/:itemId     - Ürün detayı
POST   /api/restaurants/:id/menu             - Yeni ürün ekle
PATCH  /api/restaurants/:id/menu/:itemId     - Ürün güncelle
DELETE /api/restaurants/:id/menu/:itemId     - Ürün sil
POST   /api/restaurants/:id/menu/bulk-update - Toplu güncelleme
```

### Categories
```
GET    /api/restaurants/:id/categories       - Kategorileri listele
POST   /api/restaurants/:id/categories       - Kategori ekle
PATCH  /api/categories/:id                   - Kategori güncelle
DELETE /api/categories/:id                   - Kategori sil
POST   /api/categories/reorder               - Sıralama değiştir
```

### Ingredients & Recipes
```
GET    /api/restaurants/:id/ingredients      - Malzemeleri listele
POST   /api/restaurants/:id/ingredients      - Malzeme ekle
PATCH  /api/ingredients/:id                  - Malzeme güncelle
DELETE /api/ingredients/:id                  - Malzeme sil

GET    /api/menu-items/:id/recipe            - Ürün reçetesi
POST   /api/menu-items/:id/recipe            - Reçeteye malzeme ekle
DELETE /api/recipe/:id                       - Reçeteden malzeme çıkar
```

### Cost & Pricing
```
GET    /api/menu-items/:id/cost-breakdown    - Detaylı maliyet analizi
POST   /api/menu-items/:id/calculate-cost    - Maliyeti yeniden hesapla
GET    /api/restaurants/:id/profit-report    - Kar marjı raporu
```

### Competitor Analysis
```
GET    /api/restaurants/:id/competitors      - Rakip listesi
POST   /api/restaurants/:id/competitors      - Rakip ekle (manuel)
POST   /api/competitors/scrape               - Rakip fiyatlarını çek (scraping job)
GET    /api/menu-items/:id/competitor-prices - Bu ürün için rakip fiyatları
```

### QR Codes
```
GET    /api/restaurants/:id/qr-codes         - QR kodlarını listele
POST   /api/restaurants/:id/qr-codes         - Yeni QR kodu oluştur
DELETE /api/qr-codes/:id                     - QR kodu sil
GET    /api/qr/:shortCode                    - QR kod ile menüyü aç (public)
```

### AI Suggestions
```
GET    /api/restaurants/:id/suggestions      - AI önerilerini listele
POST   /api/suggestions/:id/accept           - Öneriyi kabul et
POST   /api/suggestions/:id/reject           - Öneriyi reddet
POST   /api/suggestions/generate             - Yeni öneriler oluştur (AI job)
```

### Analytics
```
GET    /api/restaurants/:id/analytics/overview       - Genel istatistikler
GET    /api/restaurants/:id/analytics/popular-items  - En çok satan ürünler
GET    /api/restaurants/:id/analytics/revenue        - Gelir analizi
GET    /api/restaurants/:id/analytics/time-series    - Zaman serisi (günlük/haftalık)
GET    /api/menu-items/:id/analytics                 - Ürün bazlı analitik
```

### Public Menu API (QR Menü için)
```
GET    /api/public/menu/:restaurantSlug              - Restoran menüsü (public)
GET    /api/public/menu/:restaurantSlug/:categoryId  - Kategori bazlı
POST   /api/public/menu/view                         - Görüntüleme kaydı
POST   /api/public/menu/call-waiter                  - Garson çağır (webhook)
```

---

## 🎨 Frontend Sayfaları

### Public Pages (Menü)
```
/menu/:restaurantSlug              - Ana menü sayfası (QR ile açılır)
/menu/:restaurantSlug/:categoryId  - Kategori filtrelenmiş menü
/menu/:restaurantSlug/search       - Ürün arama
```

### Dashboard (Restoran Yönetimi)
```
/dashboard                         - Ana dashboard (istatistikler)
/dashboard/menu                    - Menü yönetimi
/dashboard/menu/new                - Yeni ürün ekle
/dashboard/menu/:id/edit           - Ürün düzenle
/dashboard/categories              - Kategori yönetimi
/dashboard/ingredients             - Malzeme yönetimi
/dashboard/qr-codes                - QR kod yönetimi
/dashboard/qr-codes/new            - Yeni QR oluştur
/dashboard/competitors             - Rakip analizi
/dashboard/suggestions             - AI önerileri
/dashboard/analytics               - Detaylı analitik
/dashboard/settings                - Restoran ayarları
/dashboard/settings/branding       - Tema ve logo
/dashboard/settings/billing        - Fatura ve ödeme
```

### Auth Pages
```
/login                             - Giriş
/register                          - Kayıt
/forgot-password                   - Şifre sıfırlama
```

---

## 🧠 AI Özellikleri ve Prompt'lar

### 1. Menü Parse (OCR + GPT-4 Vision)
```typescript
// Eski menü PDF'i yükle → AI otomatik parse etsin
const prompt = `
Resimde bir restoran menüsü var.
Lütfen şu formatta JSON çıktısı ver:

{
  "categories": [
    {
      "name": "Kahvaltılar",
      "items": [
        {
          "name": "Serpme Kahvaltı",
          "description": "Peynir, zeytin, yumurta, reçel",
          "price": 120,
          "allergens": ["süt", "yumurta"]
        }
      ]
    }
  ]
}
`;
```

### 2. Maliyet Analizi
```typescript
// Reçeteden otomatik maliyet hesapla
const prompt = `
Ürün: Menemen
Malzemeler:
- 2 adet domates (15₺/kg, 200g kullanılıyor)
- 3 adet yumurta (2₺/adet)
- 1 adet biber (10₺/kg, 100g kullanılıyor)
- 50g tereyağı (150₺/kg)
- Tuz, karabiber (ihmal edilebilir)

Porsiyon başına maliyeti hesapla ve kar marjı öner.
Satış fiyatı: 45₺
`;

// AI Response:
{
  "totalCost": 14.5,
  "suggestedPrice": 48,
  "profitMargin": 69.8,
  "recommendation": "Fiyat rekabetçi, %70 kar marjı sağlıyor."
}
```

### 3. Dinamik Fiyatlandırma Önerisi
```typescript
const prompt = `
Analiz et:
1. Ürün: Hamburger
2. Bizim fiyat: 95₺
3. Rakip fiyatları: [85₺, 90₺, 88₺, 92₺, 80₺]
4. Bizim maliyet: 28₺
5. Satış trendi: Son 30 gün %15 düşüş
6. Sezon: Kış (soğuk hava, hamburger talebi yüksek)

Fiyat önerisi yap ve gerekçesini açıkla.
`;

// AI Response:
{
  "currentPrice": 95,
  "suggestedPrice": 89,
  "reasoning": "Rakiplerin ortalaması 87₺. Sen 8₺ daha pahalısın. Satışlar düşüyor. 89₺ yaparak rekabetçi kalabilir, hala %68 kar marjı sağlarsın.",
  "confidenceScore": 0.88
}
```

### 4. Cross-Sell Analizi
```typescript
const prompt = `
Sipariş verileri:
- Lahmacun sipariş edenler: 1000 kişi
  - %78'i Ayran da aldı
  - %45'i Acılı Ezme aldı
  - %12'si Baklava aldı

AI olarak menüde lahmacunun yanına ne koymalıyım?
`;

// AI Response:
{
  "suggestion": "Lahmacun'u 'Ayran' ve 'Acılı Ezme' ile yan yana koy",
  "expectedImpact": "+%15 cross-sell satışı"
}
```

### 5. Menü Mühendisliği (Psikolojik Yerleştirme)
```typescript
const prompt = `
Menüdeki ürünleri analiz et:
- Fillet Biftek: 450₺, kar %75 (en karlı)
- Köfte: 120₺, kar %60
- Tavuk Şinitzel: 95₺, kar %45

Menü tasarımında nereye koymamı önerirsin?
`;

// AI Response:
{
  "layout": {
    "topRight": "Fillet Biftek (premium ürünler sağ üst köşede)",
    "center": "Köfte (en popüler, merkez)",
    "bottomLeft": "Tavuk Şinitzel (bütçe dostu)"
  },
  "decoyPricing": "Fillet biftek yanına 'Dana Pirzola (380₺)' ekle, biftek daha makul görünsün"
}
```

---

## 🔄 Background Jobs (Arka Plan İşleri)

### 1. Rakip Fiyat Scraping
```typescript
// Her gün 03:00'da çalışır
cron.schedule('0 3 * * *', async () => {
  const restaurants = await getActiveRestaurants();

  for (const restaurant of restaurants) {
    await scrapeCompetitorPrices(restaurant.id);
  }
});
```

### 2. AI Öneri Üretimi
```typescript
// Her Pazartesi 09:00'da çalışır
cron.schedule('0 9 * * 1', async () => {
  const restaurants = await getActiveRestaurants();

  for (const restaurant of restaurants) {
    const suggestions = await generateAISuggestions(restaurant.id);
    await saveSuggestions(suggestions);
    await sendEmailNotification(restaurant.owner_email, suggestions);
  }
});
```

### 3. Stok Uyarıları
```typescript
// Her gün 08:00'da çalışır
cron.schedule('0 8 * * *', async () => {
  const lowStockIngredients = await getLowStockIngredients();

  for (const ingredient of lowStockIngredients) {
    await sendStockAlert(ingredient);
  }
});
```

### 4. Haftalık Rapor
```typescript
// Her Pazartesi 10:00'da çalışır
cron.schedule('0 10 * * 1', async () => {
  const restaurants = await getActiveRestaurants();

  for (const restaurant of restaurants) {
    const report = await generateWeeklyReport(restaurant.id);
    await sendEmailReport(restaurant.owner_email, report);
  }
});
```

---

## 🎯 MVP Development Roadmap (12 Hafta)

### Hafta 1-2: Temel Altyapı
- ✅ Next.js projesi kurulumu
- ✅ PostgreSQL + Prisma setup
- ✅ Authentication (NextAuth.js)
- ✅ Temel UI komponenler (Shadcn/ui)

### Hafta 3-4: QR Menü
- ✅ QR kod oluşturucu
- ✅ Public menü sayfası (mobile-first)
- ✅ Kategori ve ürün görüntüleme
- ✅ Çok dil desteği (TR, EN)

### Hafta 5-6: Menü Yönetimi Dashboard
- ✅ CRUD: Kategoriler
- ✅ CRUD: Ürünler
- ✅ Görsel yükleme (Cloudinary)
- ✅ Drag & drop sıralama

### Hafta 7-8: Maliyet Hesaplama
- ✅ Malzeme yönetimi
- ✅ Reçete builder
- ✅ Otomatik maliyet hesaplama
- ✅ Kar marjı göstergesi

### Hafta 9-10: Analytics & AI
- ✅ Menü görüntüleme tracking
- ✅ Temel raporlar (en çok görüntülenen)
- ✅ GPT-4 entegrasyonu
- ✅ İlk AI öneri: Fiyat optimizasyonu

### Hafta 11: Rakip Analizi (Beta)
- ⚠️ Manuel rakip ekleme
- ⚠️ Fiyat karşılaştırma tablosu
- 🔮 Otomatik scraping (v2'ye ertelendi)

### Hafta 12: Testing & Launch
- ✅ 10 pilot restoran onboarding
- ✅ Bug fixes
- ✅ Landing page
- ✅ Payment entegrasyonu (Stripe)

---

## 💻 Örnek Kod Snippet'leri

### QR Kod Oluşturma
```typescript
// app/api/qr-codes/route.ts
import QRCode from 'qrcode';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  const { restaurantId, locationId, tableNumber } = await req.json();

  const shortCode = nanoid(8); // abc12345
  const menuUrl = `https://menumaster.ai/menu/${shortCode}`;

  const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
    width: 500,
    margin: 2,
  });

  const qrCode = await db.qrCode.create({
    data: {
      restaurantId,
      locationId,
      tableNumber,
      shortCode,
      qrCodeUrl: qrCodeDataUrl,
    }
  });

  return Response.json({ qrCode });
}
```

### Maliyet Hesaplama
```typescript
// lib/cost-calculator.ts
export async function calculateItemCost(menuItemId: string) {
  const recipe = await db.recipe.findMany({
    where: { menuItemId },
    include: { ingredient: true }
  });

  let totalCost = 0;

  for (const recipeItem of recipe) {
    const unitCost = recipeItem.ingredient.currentPrice; // kg başına fiyat
    const quantity = recipeItem.quantity; // kullanılan miktar (gram)

    totalCost += (unitCost / 1000) * quantity; // gram'a çevir
  }

  // Ürünü güncelle
  await db.menuItem.update({
    where: { id: menuItemId },
    data: {
      cost: totalCost,
      profitMargin: ((price - totalCost) / price) * 100
    }
  });

  return totalCost;
}
```

### AI Fiyat Önerisi
```typescript
// lib/ai/pricing-suggestion.ts
import OpenAI from 'openai';

export async function generatePricingSuggestion(menuItemId: string) {
  const item = await db.menuItem.findUnique({
    where: { id: menuItemId },
    include: { competitorPrices: true }
  });

  const competitorAvg = item.competitorPrices.reduce((sum, c) => sum + c.price, 0)
    / item.competitorPrices.length;

  const prompt = `
  Ürün: ${item.name}
  Bizim fiyat: ${item.price}₺
  Rakip ortalaması: ${competitorAvg}₺
  Bizim maliyet: ${item.cost}₺

  Fiyat önerisi yap (JSON formatında):
  { "suggestedPrice": number, "reasoning": string, "confidence": number }
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}
```

---

## 🔒 Güvenlik

### Authentication
- NextAuth.js ile secure session management
- JWT tokens (HTTP-only cookies)
- Role-based access control (owner, manager, waiter)

### API Security
- Rate limiting (10 requests/second)
- CORS policy (sadece kendi domain'den)
- API key authentication (Enterprise tier)
- SQL injection prevention (Prisma ORM)

### Data Privacy
- GDPR compliant
- Müşteri verileri anonim (IP hash)
- Restoran verileri encrypted at rest
- HTTPS zorunlu

---

## 📈 Ölçekleme Stratejisi

### Database
- PostgreSQL sharding (restoran başına partition)
- Redis cache (menü cache 5 dakika)
- Read replicas (analitik sorguları için)

### CDN
- Cloudflare CDN (QR menü global erişim)
- Image CDN (Cloudinary/imgix)
- Static asset caching

### Monitoring
- Sentry (error tracking)
- Mixpanel (kullanıcı davranışı)
- Better Stack (uptime monitoring)
- Custom alerting (Slack/email)

---

## 🚀 Sonraki Adımlar

1. **Hafta 1**: Next.js + PostgreSQL kurulumu
2. **Hafta 2**: Authentication ve temel dashboard
3. **Hafta 3**: QR menü MVP
4. **Hafta 4**: Maliyet hesaplayıcı
5. **Hafta 5**: AI entegrasyonu
6. **Hafta 6**: 5 pilot restoran test
7. **Hafta 7-8**: Feedback ve iterasyon
8. **Hafta 9**: Beta launch (ProductHunt)
9. **Hafta 10-12**: İlk 50 müşteri, revenue 25K₺/ay

---

Bu dokümana göre geliştirmeye başlayalım mı? 🚀
