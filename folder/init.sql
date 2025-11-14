-- MenuMaster AI Database Schema
-- Created from Prisma schema.prisma

-- Create ENUM types
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'MANAGER', 'STAFF');
CREATE TYPE "SubscriptionTier" AS ENUM ('STARTER', 'PROFESSIONAL', 'ENTERPRISE');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED');
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "phone" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'OWNER',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "restaurantId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Restaurants table
CREATE TABLE IF NOT EXISTS "restaurants" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "ownerId" TEXT,
  "logoUrl" TEXT,
  "primaryColor" TEXT,
  "secondaryColor" TEXT,
  "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'STARTER',
  "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
  "subscriptionEndDate" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Locations table
CREATE TABLE IF NOT EXISTS "locations" (
  "id" TEXT PRIMARY KEY,
  "restaurantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "phone" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS "categories" (
  "id" TEXT PRIMARY KEY,
  "restaurantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "nameEn" TEXT,
  "nameAr" TEXT,
  "nameRu" TEXT,
  "description" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- MenuItems table
CREATE TABLE IF NOT EXISTS "menu_items" (
  "id" TEXT PRIMARY KEY,
  "restaurantId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "nameEn" TEXT,
  "nameAr" TEXT,
  "nameRu" TEXT,
  "description" TEXT,
  "descriptionEn" TEXT,
  "descriptionAr" TEXT,
  "descriptionRu" TEXT,
  "price" DOUBLE PRECISION NOT NULL,
  "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "profitMargin" DOUBLE PRECISION,
  "imageUrl" TEXT,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "hasVariants" BOOLEAN NOT NULL DEFAULT false,
  "preparationTime" INTEGER,
  "allergens" TEXT,
  "calories" INTEGER,
  "isVegan" BOOLEAN NOT NULL DEFAULT false,
  "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
  "isGlutenFree" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- MenuVariants table
CREATE TABLE IF NOT EXISTS "menu_variants" (
  "id" TEXT PRIMARY KEY,
  "menuItemId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "nameEn" TEXT,
  "nameAr" TEXT,
  "nameRu" TEXT,
  "priceModifier" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Ingredients table
CREATE TABLE IF NOT EXISTS "ingredients" (
  "id" TEXT PRIMARY KEY,
  "restaurantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "unit" TEXT NOT NULL,
  "pricePerUnit" DOUBLE PRECISION NOT NULL,
  "currentStock" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "minStockLevel" DOUBLE PRECISION,
  "supplier" TEXT,
  "lastOrderDate" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Recipes table
CREATE TABLE IF NOT EXISTS "recipes" (
  "id" TEXT PRIMARY KEY,
  "menuItemId" TEXT NOT NULL,
  "ingredientId" TEXT NOT NULL,
  "quantity" DOUBLE PRECISION NOT NULL,
  "unit" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- PriceHistory table
CREATE TABLE IF NOT EXISTS "price_history" (
  "id" TEXT PRIMARY KEY,
  "menuItemId" TEXT NOT NULL,
  "oldPrice" DOUBLE PRECISION NOT NULL,
  "newPrice" DOUBLE PRECISION NOT NULL,
  "reason" TEXT,
  "changedById" TEXT NOT NULL,
  "changedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- QRCodes table
CREATE TABLE IF NOT EXISTS "qr_codes" (
  "id" TEXT PRIMARY KEY,
  "restaurantId" TEXT NOT NULL,
  "locationId" TEXT,
  "code" TEXT UNIQUE NOT NULL,
  "tableNumber" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "totalViews" INTEGER NOT NULL DEFAULT 0,
  "lastViewedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- MenuViews table
CREATE TABLE IF NOT EXISTS "menu_views" (
  "id" TEXT PRIMARY KEY,
  "qrCodeId" TEXT,
  "menuItemId" TEXT,
  "viewedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "language" TEXT DEFAULT 'tr'
);

-- CompetitorPrices table
CREATE TABLE IF NOT EXISTS "competitor_prices" (
  "id" TEXT PRIMARY KEY,
  "restaurantId" TEXT NOT NULL,
  "competitorName" TEXT NOT NULL,
  "competitorLocation" TEXT,
  "productName" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "notes" TEXT,
  "recordedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- AISuggestions table
CREATE TABLE IF NOT EXISTS "ai_suggestions" (
  "id" TEXT PRIMARY KEY,
  "restaurantId" TEXT NOT NULL,
  "menuItemId" TEXT NOT NULL,
  "currentPrice" DOUBLE PRECISION NOT NULL,
  "suggestedPrice" DOUBLE PRECISION NOT NULL,
  "reasoning" TEXT NOT NULL,
  "confidence" DOUBLE PRECISION NOT NULL,
  "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
  "appliedById" TEXT,
  "appliedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Add Foreign Keys
ALTER TABLE "users" ADD CONSTRAINT "fk_users_restaurant" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE SET NULL;
ALTER TABLE "locations" ADD CONSTRAINT "fk_locations_restaurant" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE;
ALTER TABLE "categories" ADD CONSTRAINT "fk_categories_restaurant" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE;
ALTER TABLE "menu_items" ADD CONSTRAINT "fk_menu_items_restaurant" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE;
ALTER TABLE "menu_items" ADD CONSTRAINT "fk_menu_items_category" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE;
ALTER TABLE "menu_variants" ADD CONSTRAINT "fk_menu_variants_menu_item" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE;
ALTER TABLE "ingredients" ADD CONSTRAINT "fk_ingredients_restaurant" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE;
ALTER TABLE "recipes" ADD CONSTRAINT "fk_recipes_menu_item" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE;
ALTER TABLE "recipes" ADD CONSTRAINT "fk_recipes_ingredient" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE CASCADE;
ALTER TABLE "price_history" ADD CONSTRAINT "fk_price_history_menu_item" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE;
ALTER TABLE "price_history" ADD CONSTRAINT "fk_price_history_user" FOREIGN KEY ("changedById") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "qr_codes" ADD CONSTRAINT "fk_qr_codes_restaurant" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE;
ALTER TABLE "qr_codes" ADD CONSTRAINT "fk_qr_codes_location" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL;
ALTER TABLE "menu_views" ADD CONSTRAINT "fk_menu_views_qr_code" FOREIGN KEY ("qrCodeId") REFERENCES "qr_codes"("id") ON DELETE SET NULL;
ALTER TABLE "menu_views" ADD CONSTRAINT "fk_menu_views_menu_item" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE SET NULL;
ALTER TABLE "competitor_prices" ADD CONSTRAINT "fk_competitor_prices_restaurant" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE;
ALTER TABLE "ai_suggestions" ADD CONSTRAINT "fk_ai_suggestions_restaurant" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE;
ALTER TABLE "ai_suggestions" ADD CONSTRAINT "fk_ai_suggestions_menu_item" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE;
ALTER TABLE "ai_suggestions" ADD CONSTRAINT "fk_ai_suggestions_user" FOREIGN KEY ("appliedById") REFERENCES "users"("id") ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX "idx_users_email" ON "users"("email");
CREATE INDEX "idx_users_restaurant" ON "users"("restaurantId");
CREATE INDEX "idx_locations_restaurant" ON "locations"("restaurantId");
CREATE INDEX "idx_categories_restaurant" ON "categories"("restaurantId");
CREATE INDEX "idx_menu_items_restaurant" ON "menu_items"("restaurantId");
CREATE INDEX "idx_menu_items_category" ON "menu_items"("categoryId");
CREATE INDEX "idx_menu_variants_menu_item" ON "menu_variants"("menuItemId");
CREATE INDEX "idx_ingredients_restaurant" ON "ingredients"("restaurantId");
CREATE INDEX "idx_recipes_menu_item" ON "recipes"("menuItemId");
CREATE INDEX "idx_recipes_ingredient" ON "recipes"("ingredientId");
CREATE INDEX "idx_price_history_menu_item" ON "price_history"("menuItemId");
CREATE INDEX "idx_qr_codes_restaurant" ON "qr_codes"("restaurantId");
CREATE INDEX "idx_qr_codes_location" ON "qr_codes"("locationId");
CREATE INDEX "idx_menu_views_qr_code" ON "menu_views"("qrCodeId");
CREATE INDEX "idx_menu_views_menu_item" ON "menu_views"("menuItemId");
CREATE INDEX "idx_competitor_prices_restaurant" ON "competitor_prices"("restaurantId");
CREATE INDEX "idx_ai_suggestions_restaurant" ON "ai_suggestions"("restaurantId");
CREATE INDEX "idx_ai_suggestions_menu_item" ON "ai_suggestions"("menuItemId");
