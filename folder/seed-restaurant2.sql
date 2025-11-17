-- MenuMaster AI - İkinci Restoran: Burger & Pizza House
-- Giriş: burger@test.com / Admin123!

-- 1. Restaurant
INSERT INTO "restaurants" ("id", "name", "slug", "logoUrl", "primaryColor", "secondaryColor", "subscriptionTier", "subscriptionStatus")
VALUES (
  '550e8400-e29b-41d4-a716-446655440100',
  'Burger & Pizza House',
  'burger-pizza-house',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591',
  '#EF4444',
  '#F97316',
  'ENTERPRISE',
  'ACTIVE'
);

-- 2. Admin User (bcrypt hash for: Admin123!)
INSERT INTO "users" ("id", "email", "passwordHash", "fullName", "phone", "role", "restaurantId")
VALUES (
  '660e8400-e29b-41d4-a716-446655440101',
  'burger@test.com',
  '$2a$10$qmi28PKEdbOz28uFN7cXKOjcqX4jwRsA6fvBU1QMmN/kDoWC223IS',
  'Pizza Manager',
  '+90 532 999 8888',
  'OWNER',
  '550e8400-e29b-41d4-a716-446655440100'
);

-- 3. Locations
INSERT INTO "locations" ("id", "restaurantId", "name", "address", "city", "phone")
VALUES
  ('770e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440100', 'Bağdat Caddesi Şubesi', 'Bağdat Cad. No:234 Kadıköy', 'İstanbul', '+90 216 444 1111'),
  ('770e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440100', 'Nişantaşı Şubesi', 'Teşvikiye Cad. No:67 Şişli', 'İstanbul', '+90 212 444 2222'),
  ('770e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440100', 'Etiler Şubesi', 'Nispetiye Cad. No:112 Beşiktaş', 'İstanbul', '+90 212 444 3333');

-- 4. Categories
INSERT INTO "categories" ("id", "restaurantId", "name", "nameEn", "nameAr", "nameRu", "description", "sortOrder")
VALUES
  ('880e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440100', 'Burgerler', 'Burgers', 'برجر', 'Бургеры', 'Özel soslarımızla burgerler', 1),
  ('880e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440100', 'Pizzalar', 'Pizzas', 'بيتزا', 'Пицца', 'İtalyan hamurumuzla pizzalar', 2),
  ('880e8400-e29b-41d4-a716-446655440107', '550e8400-e29b-41d4-a716-446655440100', 'Atıştırmalıklar', 'Appetizers', 'مقبلات', 'Закуски', 'Başlangıç yemekleri', 3),
  ('880e8400-e29b-41d4-a716-446655440108', '550e8400-e29b-41d4-a716-446655440100', 'İçecekler', 'Beverages', 'مشروبات', 'Напитки', 'Soğuk ve sıcak içecekler', 4),
  ('880e8400-e29b-41d4-a716-446655440109', '550e8400-e29b-41d4-a716-446655440100', 'Tatlılar', 'Desserts', 'حلويات', 'Десерты', 'Lezzetli tatlılar', 5);

-- 5. Ingredients
INSERT INTO "ingredients" ("id", "restaurantId", "name", "unit", "pricePerUnit", "currentStock", "minStockLevel", "supplier")
VALUES
  -- Burger Malzemeleri
  ('990e8400-e29b-41d4-a716-446655440110', '550e8400-e29b-41d4-a716-446655440100', 'Burger Ekmeği', 'ADET', 4.50, 300.00, 50.00, 'Fırın A.Ş.'),
  ('990e8400-e29b-41d4-a716-446655440111', '550e8400-e29b-41d4-a716-446655440100', 'Dana Kıyma', 'KG', 180.00, 40.00, 10.00, 'Et Dünyası'),
  ('990e8400-e29b-41d4-a716-446655440112', '550e8400-e29b-41d4-a716-446655440100', 'Cheddar Peyniri', 'KG', 220.00, 15.00, 5.00, 'Peynir Market'),
  ('990e8400-e29b-41d4-a716-446655440113', '550e8400-e29b-41d4-a716-446655440100', 'Marul', 'KG', 25.00, 20.00, 5.00, 'Sebze Hali'),
  ('990e8400-e29b-41d4-a716-446655440114', '550e8400-e29b-41d4-a716-446655440100', 'Domates', 'KG', 35.00, 30.00, 10.00, 'Sebze Hali'),
  ('990e8400-e29b-41d4-a716-446655440115', '550e8400-e29b-41d4-a716-446655440100', 'Soğan', 'KG', 18.00, 25.00, 5.00, 'Sebze Hali'),
  ('990e8400-e29b-41d4-a716-446655440116', '550e8400-e29b-41d4-a716-446655440100', 'Turşu', 'KG', 45.00, 10.00, 3.00, 'Turşu Evi'),

  -- Pizza Malzemeleri
  ('990e8400-e29b-41d4-a716-446655440117', '550e8400-e29b-41d4-a716-446655440100', 'Pizza Hamuru', 'ADET', 8.00, 200.00, 40.00, 'Fırın A.Ş.'),
  ('990e8400-e29b-41d4-a716-446655440118', '550e8400-e29b-41d4-a716-446655440100', 'Mozzarella Peyniri', 'KG', 190.00, 25.00, 8.00, 'Peynir Market'),
  ('990e8400-e29b-41d4-a716-446655440119', '550e8400-e29b-41d4-a716-446655440100', 'Pizza Sosu', 'KG', 65.00, 20.00, 5.00, 'Sos Dünyası'),
  ('990e8400-e29b-41d4-a716-446655440120', '550e8400-e29b-41d4-a716-446655440100', 'Salam', 'KG', 150.00, 12.00, 3.00, 'Et Dünyası'),
  ('990e8400-e29b-41d4-a716-446655440121', '550e8400-e29b-41d4-a716-446655440100', 'Sucuk', 'KG', 165.00, 10.00, 3.00, 'Et Dünyası'),
  ('990e8400-e29b-41d4-a716-446655440122', '550e8400-e29b-41d4-a716-446655440100', 'Mantar', 'KG', 75.00, 8.00, 2.00, 'Sebze Hali'),
  ('990e8400-e29b-41d4-a716-446655440123', '550e8400-e29b-41d4-a716-446655440100', 'Mısır', 'KG', 35.00, 15.00, 5.00, 'Toptan Market'),

  -- Diğer
  ('990e8400-e29b-41d4-a716-446655440124', '550e8400-e29b-41d4-a716-446655440100', 'Patates', 'KG', 22.00, 50.00, 15.00, 'Sebze Hali'),
  ('990e8400-e29b-41d4-a716-446655440125', '550e8400-e29b-41d4-a716-446655440100', 'Soğan Halkası', 'KG', 95.00, 12.00, 4.00, 'Dondurulmuş Gıda'),
  ('990e8400-e29b-41d4-a716-446655440126', '550e8400-e29b-41d4-a716-446655440100', 'Çikolata Sosu', 'L', 85.00, 8.00, 2.00, 'Sos Dünyası'),
  ('990e8400-e29b-41d4-a716-446655440127', '550e8400-e29b-41d4-a716-446655440100', 'Dondurma', 'KG', 125.00, 20.00, 5.00, 'Tatlı Market');

-- 6. Menu Items

-- BURGERLER
INSERT INTO "menu_items" ("id", "restaurantId", "categoryId", "name", "nameEn", "nameAr", "nameRu", "description", "descriptionEn", "price", "cost", "profitMargin", "imageUrl", "preparationTime", "calories")
VALUES
  ('aa0e8400-e29b-41d4-a716-446655440128', '550e8400-e29b-41d4-a716-446655440100', '880e8400-e29b-41d4-a716-446655440105',
   'Klasik Burger', 'Classic Burger', 'برجر كلاسيكي', 'Классический бургер',
   '180g dana köfte, cheddar, marul, domates, turşu, özel sos', '180g beef patty, cheddar, lettuce, tomato, pickle, special sauce',
   145.00, 42.00, 71.03, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 12, 680),

  ('aa0e8400-e29b-41d4-a716-446655440129', '550e8400-e29b-41d4-a716-446655440100', '880e8400-e29b-41d4-a716-446655440105',
   'Double Burger', 'Double Burger', 'برجر مضاعف', 'Двойной бургер',
   '2x180g dana köfte, 2x cheddar, marul, domates, soğan', '2x180g beef patty, 2x cheddar, lettuce, tomato, onion',
   210.00, 78.00, 62.86, 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9', 15, 920),

  ('aa0e8400-e29b-41d4-a716-446655440130', '550e8400-e29b-41d4-a716-446655440100', '880e8400-e29b-41d4-a716-446655440105',
   'BBQ Burger', 'BBQ Burger', 'برجر باربكيو', 'Барбекю бургер',
   '200g dana köfte, BBQ sos, cheddar, soğan halkası, marul', '200g beef patty, BBQ sauce, cheddar, onion rings, lettuce',
   165.00, 52.00, 68.48, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b', 14, 780),

-- PIZZALAR
  ('aa0e8400-e29b-41d4-a716-446655440131', '550e8400-e29b-41d4-a716-446655440100', '880e8400-e29b-41d4-a716-446655440106',
   'Margherita Pizza', 'Margherita Pizza', 'بيتزا مارغريتا', 'Пицца Маргарита',
   'Pizza sosu, mozzarella, fesleğen (30cm)', 'Tomato sauce, mozzarella, basil (30cm)',
   125.00, 35.00, 72.00, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002', 18, 580),

  ('aa0e8400-e29b-41d4-a716-446655440132', '550e8400-e29b-41d4-a716-446655440100', '880e8400-e29b-41d4-a716-446655440106',
   'Karışık Pizza', 'Mixed Pizza', 'بيتزا مشكلة', 'Смешанная пицца',
   'Salam, sucuk, mantar, mısır, zeytin, mozzarella (30cm)', 'Salami, sausage, mushroom, corn, olive, mozzarella (30cm)',
   185.00, 62.00, 66.49, 'https://images.unsplash.com/photo-1628840042765-356cda07504e', 20, 820),

  ('aa0e8400-e29b-41d4-a716-446655440133', '550e8400-e29b-41d4-a716-446655440100', '880e8400-e29b-41d4-a716-446655440106',
   'Sucuklu Pizza', 'Pepperoni Pizza', 'بيتزا السجق', 'Пицца пепперони',
   'Pizza sosu, mozzarella, sucuk (30cm)', 'Tomato sauce, mozzarella, pepperoni (30cm)',
   155.00, 48.00, 69.03, 'https://images.unsplash.com/photo-1594007654729-407eedc4be65', 18, 720),

  ('aa0e8400-e29b-41d4-a716-446655440134', '550e8400-e29b-41d4-a716-446655440100', '880e8400-e29b-41d4-a716-446655440106',
   'Vejeteryan Pizza', 'Vegetarian Pizza', 'بيتزا نباتية', 'Вегетарианская пицца',
   'Pizza sosu, mozzarella, mantar, mısır, domates, biber (30cm)', 'Tomato sauce, mozzarella, mushroom, corn, tomato, pepper (30cm)',
   145.00, 42.00, 71.03, 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49', 18, 620),

-- ATIŞTIRMALIKLAR
  ('aa0e8400-e29b-41d4-a716-446655440135', '550e8400-e29b-41d4-a716-446655440100', '880e8400-e29b-41d4-a716-446655440107',
   'Patates Kızartması', 'French Fries', 'بطاطس مقلية', 'Картофель фри',
   'Taze kesilmiş patates, kızarmış (Büyük)', 'Fresh cut potatoes, fried (Large)',
   65.00, 18.00, 72.31, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877', 8, 420),

  ('aa0e8400-e29b-41d4-a716-446655440136', '550e8400-e29b-41d4-a716-446655440100', '880e8400-e29b-41d4-a716-446655440107',
   'Soğan Halkaları', 'Onion Rings', 'حلقات البصل', 'Луковые кольца',
   'Çıtır çıtır soğan halkaları (8 adet)', 'Crispy onion rings (8 pcs)',
   75.00, 22.00, 70.67, 'https://images.unsplash.com/photo-1639024471283-03518883512d', 10, 380),

  ('aa0e8400-e29b-41d4-a716-446655440137', '550e8400-e29b-41d4-a716-446655440100', '880e8400-e29b-41d4-a716-446655440107',
   'Mozzarella Stick', 'Mozzarella Sticks', 'أصابع الموزاريلا', 'Сырные палочки',
   'Kızarmış mozzarella çubukları (6 adet)', 'Fried mozzarella sticks (6 pcs)',
   85.00, 28.00, 67.06, 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7', 12, 450),

-- İÇECEKLER
  ('aa0e8400-e29b-41d4-a716-446655440138', '550e8400-e29b-41d4-a716-446655440100', '880e8400-e29b-41d4-a716-446655440108',
   'Kola', 'Cola', 'كولا', 'Кола',
   'Soğuk kola (330ml)', 'Cold cola (330ml)',
   35.00, 8.00, 77.14, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 2, 140),

  ('aa0e8400-e29b-41d4-a716-446655440139', '550e8400-e29b-41d4-a716-446655440100', '880e8400-e29b-41d4-a716-446655440108',
   'Milkshake', 'Milkshake', 'ميلك شيك', 'Молочный коктейль',
   'Çikolatalı milkshake (400ml)', 'Chocolate milkshake (400ml)',
   75.00, 22.00, 70.67, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699', 5, 380),

  ('aa0e8400-e29b-41d4-a716-446655440140', '550e8400-e29b-41d4-a716-446655440100', '880e8400-e29b-41d4-a716-446655440108',
   'Limonata', 'Lemonade', 'ليمونادا', 'Лимонад',
   'Taze sıkılmış limonata (400ml)', 'Fresh squeezed lemonade (400ml)',
   55.00, 12.00, 78.18, 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d', 3, 120),

-- TATLILAR
  ('aa0e8400-e29b-41d4-a716-446655440141', '550e8400-e29b-41d4-a716-446655440100', '880e8400-e29b-41d4-a716-446655440109',
   'Brownie', 'Brownie', 'براوني', 'Брауни',
   'Çikolatalı brownie, vanilya dondurma', 'Chocolate brownie with vanilla ice cream',
   85.00, 25.00, 70.59, 'https://images.unsplash.com/photo-1607920591413-4ec007e70023', 15, 520),

  ('aa0e8400-e29b-41d4-a716-446655440142', '550e8400-e29b-41d4-a716-446655440100', '880e8400-e29b-41d4-a716-446655440109',
   'Cheesecake', 'Cheesecake', 'تشيز كيك', 'Чизкейк',
   'Klasik cheesecake, meyveli sos', 'Classic cheesecake with fruit sauce',
   95.00, 32.00, 66.32, 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866', 5, 450);

-- 7. Recipes (Reçeteler)
INSERT INTO "recipes" ("id", "menuItemId", "ingredientId", "quantity", "unit", "notes")
VALUES
  -- Klasik Burger
  ('bb0e8400-e29b-41d4-a716-446655440143', 'aa0e8400-e29b-41d4-a716-446655440128', '990e8400-e29b-41d4-a716-446655440110', 1, 'ADET', 'Burger ekmeği'),
  ('bb0e8400-e29b-41d4-a716-446655440144', 'aa0e8400-e29b-41d4-a716-446655440128', '990e8400-e29b-41d4-a716-446655440111', 180, 'G', 'Dana köfte'),
  ('bb0e8400-e29b-41d4-a716-446655440145', 'aa0e8400-e29b-41d4-a716-446655440128', '990e8400-e29b-41d4-a716-446655440112', 30, 'G', 'Cheddar dilim'),
  ('bb0e8400-e29b-41d4-a716-446655440146', 'aa0e8400-e29b-41d4-a716-446655440128', '990e8400-e29b-41d4-a716-446655440113', 20, 'G', 'Marul'),
  ('bb0e8400-e29b-41d4-a716-446655440147', 'aa0e8400-e29b-41d4-a716-446655440128', '990e8400-e29b-41d4-a716-446655440114', 25, 'G', 'Domates'),

  -- Double Burger
  ('bb0e8400-e29b-41d4-a716-446655440148', 'aa0e8400-e29b-41d4-a716-446655440129', '990e8400-e29b-41d4-a716-446655440110', 1, 'ADET', 'Burger ekmeği'),
  ('bb0e8400-e29b-41d4-a716-446655440149', 'aa0e8400-e29b-41d4-a716-446655440129', '990e8400-e29b-41d4-a716-446655440111', 360, 'G', '2x Dana köfte'),
  ('bb0e8400-e29b-41d4-a716-446655440150', 'aa0e8400-e29b-41d4-a716-446655440129', '990e8400-e29b-41d4-a716-446655440112', 60, 'G', '2x Cheddar'),

  -- Margherita Pizza
  ('bb0e8400-e29b-41d4-a716-446655440151', 'aa0e8400-e29b-41d4-a716-446655440131', '990e8400-e29b-41d4-a716-446655440117', 1, 'ADET', 'Pizza hamuru 30cm'),
  ('bb0e8400-e29b-41d4-a716-446655440152', 'aa0e8400-e29b-41d4-a716-446655440131', '990e8400-e29b-41d4-a716-446655440119', 80, 'G', 'Pizza sosu'),
  ('bb0e8400-e29b-41d4-a716-446655440153', 'aa0e8400-e29b-41d4-a716-446655440131', '990e8400-e29b-41d4-a716-446655440118', 120, 'G', 'Mozzarella'),

  -- Karışık Pizza
  ('bb0e8400-e29b-41d4-a716-446655440154', 'aa0e8400-e29b-41d4-a716-446655440132', '990e8400-e29b-41d4-a716-446655440117', 1, 'ADET', 'Pizza hamuru 30cm'),
  ('bb0e8400-e29b-41d4-a716-446655440155', 'aa0e8400-e29b-41d4-a716-446655440132', '990e8400-e29b-41d4-a716-446655440119', 80, 'G', 'Pizza sosu'),
  ('bb0e8400-e29b-41d4-a716-446655440156', 'aa0e8400-e29b-41d4-a716-446655440132', '990e8400-e29b-41d4-a716-446655440118', 150, 'G', 'Mozzarella'),
  ('bb0e8400-e29b-41d4-a716-446655440157', 'aa0e8400-e29b-41d4-a716-446655440132', '990e8400-e29b-41d4-a716-446655440120', 50, 'G', 'Salam'),
  ('bb0e8400-e29b-41d4-a716-446655440158', 'aa0e8400-e29b-41d4-a716-446655440132', '990e8400-e29b-41d4-a716-446655440121', 50, 'G', 'Sucuk'),
  ('bb0e8400-e29b-41d4-a716-446655440159', 'aa0e8400-e29b-41d4-a716-446655440132', '990e8400-e29b-41d4-a716-446655440122', 40, 'G', 'Mantar'),

  -- Patates Kızartması
  ('bb0e8400-e29b-41d4-a716-446655440160', 'aa0e8400-e29b-41d4-a716-446655440135', '990e8400-e29b-41d4-a716-446655440124', 250, 'G', 'Patates'),

  -- Soğan Halkaları
  ('bb0e8400-e29b-41d4-a716-446655440161', 'aa0e8400-e29b-41d4-a716-446655440136', '990e8400-e29b-41d4-a716-446655440125', 150, 'G', 'Soğan halkası'),

  -- Milkshake
  ('bb0e8400-e29b-41d4-a716-446655440162', 'aa0e8400-e29b-41d4-a716-446655440139', '990e8400-e29b-41d4-a716-446655440127', 150, 'G', 'Dondurma'),
  ('bb0e8400-e29b-41d4-a716-446655440163', 'aa0e8400-e29b-41d4-a716-446655440139', '990e8400-e29b-41d4-a716-446655440126', 30, 'ML', 'Çikolata sosu'),

  -- Brownie
  ('bb0e8400-e29b-41d4-a716-446655440164', 'aa0e8400-e29b-41d4-a716-446655440141', '990e8400-e29b-41d4-a716-446655440126', 20, 'ML', 'Çikolata sosu'),
  ('bb0e8400-e29b-41d4-a716-446655440165', 'aa0e8400-e29b-41d4-a716-446655440141', '990e8400-e29b-41d4-a716-446655440127', 80, 'G', 'Vanilya dondurma');

-- 8. QR Codes
INSERT INTO "qr_codes" ("id", "restaurantId", "locationId", "code", "tableNumber", "totalViews")
VALUES
  ('cc0e8400-e29b-41d4-a716-446655440166', '550e8400-e29b-41d4-a716-446655440100', '770e8400-e29b-41d4-a716-446655440102', 'QR-BAGDAT-MASA-01', 'Masa 1', 67),
  ('cc0e8400-e29b-41d4-a716-446655440167', '550e8400-e29b-41d4-a716-446655440100', '770e8400-e29b-41d4-a716-446655440102', 'QR-BAGDAT-MASA-02', 'Masa 2', 58),
  ('cc0e8400-e29b-41d4-a716-446655440168', '550e8400-e29b-41d4-a716-446655440100', '770e8400-e29b-41d4-a716-446655440103', 'QR-NISANTASI-MASA-01', 'Masa 1', 89),
  ('cc0e8400-e29b-41d4-a716-446655440169', '550e8400-e29b-41d4-a716-446655440100', '770e8400-e29b-41d4-a716-446655440103', 'QR-NISANTASI-MASA-02', 'Masa 2', 76),
  ('cc0e8400-e29b-41d4-a716-446655440170', '550e8400-e29b-41d4-a716-446655440100', '770e8400-e29b-41d4-a716-446655440104', 'QR-ETILER-MASA-01', 'Masa 1', 94),
  ('cc0e8400-e29b-41d4-a716-446655440171', '550e8400-e29b-41d4-a716-446655440100', '770e8400-e29b-41d4-a716-446655440104', 'QR-ETILER-MASA-02', 'Masa 2', 82);

-- 9. Menu Views (Analytics)
INSERT INTO "menu_views" ("id", "qrCodeId", "menuItemId", "language", "ipAddress")
VALUES
  ('dd0e8400-e29b-41d4-a716-446655440172', 'cc0e8400-e29b-41d4-a716-446655440166', 'aa0e8400-e29b-41d4-a716-446655440128', 'tr', '192.168.2.10'),
  ('dd0e8400-e29b-41d4-a716-446655440173', 'cc0e8400-e29b-41d4-a716-446655440166', 'aa0e8400-e29b-41d4-a716-446655440132', 'tr', '192.168.2.10'),
  ('dd0e8400-e29b-41d4-a716-446655440174', 'cc0e8400-e29b-41d4-a716-446655440167', 'aa0e8400-e29b-41d4-a716-446655440129', 'en', '192.168.2.11'),
  ('dd0e8400-e29b-41d4-a716-446655440175', 'cc0e8400-e29b-41d4-a716-446655440168', 'aa0e8400-e29b-41d4-a716-446655440131', 'tr', '192.168.2.12'),
  ('dd0e8400-e29b-41d4-a716-446655440176', 'cc0e8400-e29b-41d4-a716-446655440169', 'aa0e8400-e29b-41d4-a716-446655440135', 'ar', '192.168.2.13'),
  ('dd0e8400-e29b-41d4-a716-446655440177', 'cc0e8400-e29b-41d4-a716-446655440170', 'aa0e8400-e29b-41d4-a716-446655440139', 'ru', '192.168.2.14');

-- 10. Competitor Prices
INSERT INTO "competitor_prices" ("id", "restaurantId", "competitorName", "competitorLocation", "productName", "price", "notes")
VALUES
  ('ee0e8400-e29b-41d4-a716-446655440178', '550e8400-e29b-41d4-a716-446655440100', 'Big Burger Chain', 'Kadıköy', 'Klasik Burger', 155.00, 'Menü fiyatı 185₺'),
  ('ee0e8400-e29b-41d4-a716-446655440179', '550e8400-e29b-41d4-a716-446655440100', 'Big Burger Chain', 'Kadıköy', 'Double Burger', 225.00, 'Menü fiyatı 265₺'),
  ('ee0e8400-e29b-41d4-a716-446655440180', '550e8400-e29b-41d4-a716-446655440100', 'Pizza King', 'Nişantaşı', 'Karışık Pizza', 195.00, 'Büyük boy'),
  ('ee0e8400-e29b-41d4-a716-446655440181', '550e8400-e29b-41d4-a716-446655440100', 'Pizza King', 'Nişantaşı', 'Margherita', 135.00, 'Büyük boy'),
  ('ee0e8400-e29b-41d4-a716-446655440182', '550e8400-e29b-41d4-a716-446655440100', 'Fast Food Express', 'Etiler', 'Patates Kızartması', 70.00, 'Büyük boy'),
  ('ee0e8400-e29b-41d4-a716-446655440183', '550e8400-e29b-41d4-a716-446655440100', 'Fast Food Express', 'Etiler', 'Soğan Halkaları', 80.00, '8 adet'),
  ('ee0e8400-e29b-41d4-a716-446655440184', '550e8400-e29b-41d4-a716-446655440100', 'Dessert House', 'Beşiktaş', 'Brownie', 95.00, 'Dondurmali');

-- 11. AI Suggestions
INSERT INTO "ai_suggestions" ("id", "restaurantId", "menuItemId", "currentPrice", "suggestedPrice", "reasoning", "confidence", "status")
VALUES
  ('ff0e8400-e29b-41d4-a716-446655440185', '550e8400-e29b-41d4-a716-446655440100', 'aa0e8400-e29b-41d4-a716-446655440128', 145.00, 152.00,
   'Rakip analizi sonucunda fiyatınız %6.5 daha düşük. Kar marjınız %71 ile çok iyi. Kalite-fiyat dengesi için %4.8 artış öneriyoruz.', 85.30, 'PENDING'),

  ('ff0e8400-e29b-41d4-a716-446655440186', '550e8400-e29b-41d4-a716-446655440100', 'aa0e8400-e29b-41d4-a716-446655440129', 210.00, 218.00,
   'Double burger rakiplere göre %6.7 daha ucuz. Popüler ürün olduğu için %3.8 artış yapılabilir.', 82.10, 'PENDING'),

  ('ff0e8400-e29b-41d4-a716-446655440187', '550e8400-e29b-41d4-a716-446655440100', 'aa0e8400-e29b-41d4-a716-446655440132', 185.00, 192.00,
   'Karışık pizza rakiplere göre %5.1 daha ucuz. Malzeme kalitesi yüksek, %3.8 fiyat artışı mantıklı.', 87.50, 'PENDING'),

  ('ff0e8400-e29b-41d4-a716-446655440188', '550e8400-e29b-41d4-a716-446655440100', 'aa0e8400-e29b-41d4-a716-446655440135', 65.00, 68.00,
   'Patates kızartması piyasa ortalamasının %7 altında. Talep yüksek ürün, %4.6 artış öneriyoruz.', 78.20, 'PENDING');

-- 12. Price History
INSERT INTO "price_history" ("id", "menuItemId", "oldPrice", "newPrice", "reason", "changedById")
VALUES
  ('1a0e8400-e29b-41d4-a716-446655440189', 'aa0e8400-e29b-41d4-a716-446655440128', 135.00, 145.00, 'Dana et fiyat artışı', '660e8400-e29b-41d4-a716-446655440101'),
  ('1a0e8400-e29b-41d4-a716-446655440190', 'aa0e8400-e29b-41d4-a716-446655440132', 175.00, 185.00, 'Peynir ve salam fiyat artışı', '660e8400-e29b-41d4-a716-446655440101'),
  ('1a0e8400-e29b-41d4-a716-446655440191', 'aa0e8400-e29b-41d4-a716-446655440139', 70.00, 75.00, 'Dondurma maliyeti artışı', '660e8400-e29b-41d4-a716-446655440101'),
  ('1a0e8400-e29b-41d4-a716-446655440192', 'aa0e8400-e29b-41d4-a716-446655440131', 115.00, 125.00, 'Genel maliyet ayarlaması', '660e8400-e29b-41d4-a716-446655440101');
