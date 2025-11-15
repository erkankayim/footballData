-- MenuMaster AI - Demo Verileri
-- Giriş: admin@test.com / Admin123!

-- 1. Restaurant
INSERT INTO "restaurants" ("id", "name", "slug", "logoUrl", "primaryColor", "secondaryColor", "subscriptionTier", "subscriptionStatus")
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Lezzet Durağı Restaurant',
  'lezzet-duragi',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
  '#DC2626',
  '#F59E0B',
  'PROFESSIONAL',
  'ACTIVE'
);

-- 2. Admin User (bcrypt hash for: Admin123!)
INSERT INTO "users" ("id", "email", "passwordHash", "fullName", "phone", "role", "restaurantId")
VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  'admin@test.com',
  '$2a$10$3bqyuKlN09zYsGeorwSycexKu0rb/.kId7odry49uRmzR1YITrl6K',
  'Admin User',
  '+90 532 123 4567',
  'OWNER',
  '550e8400-e29b-41d4-a716-446655440000'
);

-- 3. Locations
INSERT INTO "locations" ("id", "restaurantId", "name", "address", "city", "phone")
VALUES
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Merkez Şube', 'Atatürk Cad. No:123', 'İstanbul', '+90 212 555 0101'),
  ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Kadıköy Şube', 'Bahariye Cad. No:45', 'İstanbul', '+90 216 555 0202');

-- 4. Categories
INSERT INTO "categories" ("id", "restaurantId", "name", "nameEn", "nameAr", "nameRu", "description", "sortOrder")
VALUES
  ('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Kahvaltı', 'Breakfast', 'فطور', 'Завтрак', 'Geleneksel Türk kahvaltısı', 1),
  ('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Ana Yemekler', 'Main Dishes', 'أطباق رئيسية', 'Основные блюда', 'Özel ana yemeklerimiz', 2),
  ('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Tatlılar', 'Desserts', 'حلويات', 'Десерты', 'Özel tatlılarımız', 3),
  ('880e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'İçecekler', 'Beverages', 'مشروبات', 'Напитки', 'Sıcak ve soğuk içecekler', 4);

-- 5. Ingredients
INSERT INTO "ingredients" ("id", "restaurantId", "name", "unit", "pricePerUnit", "currentStock", "minStockLevel", "supplier")
VALUES
  ('990e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', 'Un', 'KG', 25.00, 50.00, 10.00, 'Toptan Market'),
  ('990e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440000', 'Yumurta', 'ADET', 3.50, 200.00, 50.00, 'Çiftlik Yumurta'),
  ('990e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'Süt', 'L', 40.00, 30.00, 10.00, 'Süt A.Ş.'),
  ('990e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'Peynir', 'KG', 180.00, 15.00, 5.00, 'Peynir Dünyası'),
  ('990e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', 'Domates', 'KG', 35.00, 25.00, 5.00, 'Sebze Hali'),
  ('990e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440000', 'Tavuk', 'KG', 95.00, 20.00, 5.00, 'Et Dünyası'),
  ('990e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440000', 'Pirinç', 'KG', 55.00, 40.00, 10.00, 'Toptan Market'),
  ('990e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440000', 'Şeker', 'KG', 35.00, 30.00, 10.00, 'Toptan Market'),
  ('990e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440000', 'Kahve', 'KG', 280.00, 8.00, 2.00, 'Kahve Dünyası');

-- 6. Menu Items
INSERT INTO "menu_items" ("id", "restaurantId", "categoryId", "name", "nameEn", "nameAr", "nameRu", "description", "descriptionEn", "price", "cost", "profitMargin", "imageUrl", "preparationTime", "calories")
VALUES
  -- Kahvaltı
  ('aa0e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440004',
   'Serpme Kahvaltı', 'Turkish Breakfast', 'فطور تركي', 'Турецкий завтрак',
   'Peynir, zeytin, tereyağı, bal, reçel, yumurta, simit', 'Cheese, olives, butter, honey, jam, eggs, simit',
   185.00, 48.50, 73.78, 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666', 15, 650),

  ('aa0e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440004',
   'Menemen', 'Menemen', 'منيمن', 'Менемен',
   'Domates, biber, yumurta ile özel sosumuz', 'Tomato, pepper, eggs with special sauce',
   95.00, 22.00, 76.84, 'https://images.unsplash.com/photo-1604908815845-9b60e8b89d0d', 10, 380),

  -- Ana Yemekler
  ('aa0e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440005',
   'Tavuk Şiş', 'Chicken Shish', 'شيش دجاج', 'Куриный шашлык',
   'Özel baharatlarla marine edilmiş tavuk şiş', 'Chicken shish marinated with special spices',
   165.00, 55.00, 66.67, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143', 20, 520),

  ('aa0e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440005',
   'Pilav Üstü Tavuk', 'Chicken Over Rice', 'دجاج مع الأرز', 'Курица с рисом',
   'Tereyağlı pirinç pilavı üzerine izgara tavuk', 'Grilled chicken over buttered rice',
   135.00, 42.00, 68.89, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 25, 680),

  -- Tatlılar
  ('aa0e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440006',
   'Sütlaç', 'Rice Pudding', 'أرز بالحليب', 'Рисовый пудинг',
   'Fırında karamelize edilmiş geleneksel sütlaç', 'Traditional rice pudding caramelized in oven',
   75.00, 18.00, 76.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 30, 320),

  ('aa0e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440006',
   'Baklava', 'Baklava', 'بقلاوة', 'Пахлава',
   'El açması yufka ile hazırlanan fıstıklı baklava', 'Handmade pistachio baklava',
   95.00, 28.00, 70.53, 'https://images.unsplash.com/photo-1598110750624-207050c4f28c', 35, 450),

  -- İçecekler
  ('aa0e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440007',
   'Türk Kahvesi', 'Turkish Coffee', 'قهوة تركية', 'Турецкий кофе',
   'Geleneksel yöntemle hazırlanan Türk kahvesi', 'Turkish coffee prepared in traditional way',
   45.00, 8.50, 81.11, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd', 5, 10),

  ('aa0e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440007',
   'Ayran', 'Ayran', 'عيران', 'Айран',
   'Ev yapımı taze ayran', 'Homemade fresh ayran',
   25.00, 5.00, 80.00, 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8', 2, 60);

-- 7. Recipes (Reçeteler)
INSERT INTO "recipes" ("id", "menuItemId", "ingredientId", "quantity", "unit", "notes")
VALUES
  -- Serpme Kahvaltı
  ('bb0e8400-e29b-41d4-a716-446655440025', 'aa0e8400-e29b-41d4-a716-446655440017', '990e8400-e29b-41d4-a716-446655440011', 150, 'G', 'Beyaz peynir'),
  ('bb0e8400-e29b-41d4-a716-446655440026', 'aa0e8400-e29b-41d4-a716-446655440017', '990e8400-e29b-41d4-a716-446655440009', 2, 'ADET', 'Haşlanmış'),

  -- Menemen
  ('bb0e8400-e29b-41d4-a716-446655440027', 'aa0e8400-e29b-41d4-a716-446655440018', '990e8400-e29b-41d4-a716-446655440012', 100, 'G', 'Doğranmış'),
  ('bb0e8400-e29b-41d4-a716-446655440028', 'aa0e8400-e29b-41d4-a716-446655440018', '990e8400-e29b-41d4-a716-446655440009', 3, 'ADET', 'Çırpılmış'),

  -- Tavuk Şiş
  ('bb0e8400-e29b-41d4-a716-446655440029', 'aa0e8400-e29b-41d4-a716-446655440019', '990e8400-e29b-41d4-a716-446655440013', 250, 'G', 'Göğüs eti'),

  -- Pilav Üstü Tavuk
  ('bb0e8400-e29b-41d4-a716-446655440030', 'aa0e8400-e29b-41d4-a716-446655440020', '990e8400-e29b-41d4-a716-446655440014', 150, 'G', 'Baldo pirinç'),
  ('bb0e8400-e29b-41d4-a716-446655440031', 'aa0e8400-e29b-41d4-a716-446655440020', '990e8400-e29b-41d4-a716-446655440013', 200, 'G', 'But eti'),

  -- Sütlaç
  ('bb0e8400-e29b-41d4-a716-446655440032', 'aa0e8400-e29b-41d4-a716-446655440021', '990e8400-e29b-41d4-a716-446655440010', 300, 'ML', 'Tam yağlı'),
  ('bb0e8400-e29b-41d4-a716-446655440033', 'aa0e8400-e29b-41d4-a716-446655440021', '990e8400-e29b-41d4-a716-446655440014', 50, 'G', 'Baldo pirinç'),
  ('bb0e8400-e29b-41d4-a716-446655440034', 'aa0e8400-e29b-41d4-a716-446655440021', '990e8400-e29b-41d4-a716-446655440015', 40, 'G', 'Toz şeker'),

  -- Türk Kahvesi
  ('bb0e8400-e29b-41d4-a716-446655440035', 'aa0e8400-e29b-41d4-a716-446655440023', '990e8400-e29b-41d4-a716-446655440016', 8, 'G', 'Öğütülmüş'),

  -- Ayran
  ('bb0e8400-e29b-41d4-a716-446655440036', 'aa0e8400-e29b-41d4-a716-446655440024', '990e8400-e29b-41d4-a716-446655440010', 200, 'ML', 'Yoğurt karışımı');

-- 8. QR Codes
INSERT INTO "qr_codes" ("id", "restaurantId", "locationId", "code", "tableNumber", "totalViews")
VALUES
  ('cc0e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440002', 'QR-MERKEZ-MASA-01', 'Masa 1', 45),
  ('cc0e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440002', 'QR-MERKEZ-MASA-02', 'Masa 2', 38),
  ('cc0e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440003', 'QR-KADIKOY-MASA-01', 'Masa 1', 52),
  ('cc0e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440003', 'QR-KADIKOY-MASA-02', 'Masa 2', 41);

-- 9. Menu Views (Analytics)
INSERT INTO "menu_views" ("id", "qrCodeId", "menuItemId", "language", "ipAddress")
VALUES
  ('dd0e8400-e29b-41d4-a716-446655440041', 'cc0e8400-e29b-41d4-a716-446655440037', 'aa0e8400-e29b-41d4-a716-446655440019', 'tr', '192.168.1.1'),
  ('dd0e8400-e29b-41d4-a716-446655440042', 'cc0e8400-e29b-41d4-a716-446655440037', 'aa0e8400-e29b-41d4-a716-446655440020', 'tr', '192.168.1.1'),
  ('dd0e8400-e29b-41d4-a716-446655440043', 'cc0e8400-e29b-41d4-a716-446655440038', 'aa0e8400-e29b-41d4-a716-446655440017', 'en', '192.168.1.2'),
  ('dd0e8400-e29b-41d4-a716-446655440044', 'cc0e8400-e29b-41d4-a716-446655440039', 'aa0e8400-e29b-41d4-a716-446655440023', 'ar', '192.168.1.3'),
  ('dd0e8400-e29b-41d4-a716-446655440045', 'cc0e8400-e29b-41d4-a716-446655440040', 'aa0e8400-e29b-41d4-a716-446655440021', 'ru', '192.168.1.4');

-- 10. Competitor Prices
INSERT INTO "competitor_prices" ("id", "restaurantId", "competitorName", "competitorLocation", "productName", "price", "notes")
VALUES
  ('ee0e8400-e29b-41d4-a716-446655440046', '550e8400-e29b-41d4-a716-446655440000', 'Rakip Restaurant A', 'Beşiktaş', 'Serpme Kahvaltı', 195.00, 'Pazar günü ziyaret'),
  ('ee0e8400-e29b-41d4-a716-446655440047', '550e8400-e29b-41d4-a716-446655440000', 'Rakip Restaurant A', 'Beşiktaş', 'Tavuk Şiş', 175.00, 'Pazar günü ziyaret'),
  ('ee0e8400-e29b-41d4-a716-446655440048', '550e8400-e29b-41d4-a716-446655440000', 'Rakip Restaurant B', 'Kadıköy', 'Serpme Kahvaltı', 180.00, 'Online menü'),
  ('ee0e8400-e29b-41d4-a716-446655440049', '550e8400-e29b-41d4-a716-446655440000', 'Rakip Restaurant B', 'Kadıköy', 'Baklava', 105.00, 'Online menü'),
  ('ee0e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440000', 'Rakip Restaurant C', 'Şişli', 'Türk Kahvesi', 50.00, 'Telefon ile fiyat öğrenildi');

-- 11. AI Suggestions
INSERT INTO "ai_suggestions" ("id", "restaurantId", "menuItemId", "currentPrice", "suggestedPrice", "reasoning", "confidence", "status")
VALUES
  ('ff0e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440000', 'aa0e8400-e29b-41d4-a716-446655440017', 185.00, 195.00,
   'Rakip analizi sonucunda fiyatınız piyasa ortalamasının %8 altında. Kalite-fiyat oranınız yüksek olduğundan %5.4 artış öneriyoruz.', 88.50, 'PENDING'),

  ('ff0e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440000', 'aa0e8400-e29b-41d4-a716-446655440019', 165.00, 172.00,
   'Kar marjınız %66.67 ile iyi seviyede. Ancak rakipler %6 daha yüksek fiyatlandırıyor. %4.2 artış öneriyoruz.', 82.30, 'PENDING'),

  ('ff0e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440000', 'aa0e8400-e29b-41d4-a716-446655440023', 45.00, 48.00,
   'Türk kahvesi fiyatınız rakiplerin %10 altında. Kalite göz önüne alındığında %6.7 artış yapılabilir.', 75.20, 'PENDING');

-- 12. Price History
INSERT INTO "price_history" ("id", "menuItemId", "oldPrice", "newPrice", "reason", "changedById")
VALUES
  ('1a0e8400-e29b-41d4-a716-446655440054', 'aa0e8400-e29b-41d4-a716-446655440017', 175.00, 185.00, 'Malzeme fiyat artışı nedeniyle', '660e8400-e29b-41d4-a716-446655440001'),
  ('1a0e8400-e29b-41d4-a716-446655440055', 'aa0e8400-e29b-41d4-a716-446655440019', 155.00, 165.00, 'Tavuk fiyatlarındaki artış', '660e8400-e29b-41d4-a716-446655440001'),
  ('1a0e8400-e29b-41d4-a716-446655440056', 'aa0e8400-e29b-41d4-a716-446655440023', 40.00, 45.00, 'Kahve ithalat maliyeti artışı', '660e8400-e29b-41d4-a716-446655440001');
