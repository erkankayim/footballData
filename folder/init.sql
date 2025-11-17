-- MenuMaster AI Database Schema
-- PostgreSQL + Supabase optimized

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing types if they exist (for re-run safety)
DROP TYPE IF EXISTS "UserRole" CASCADE;
DROP TYPE IF EXISTS "SubscriptionTier" CASCADE;
DROP TYPE IF EXISTS "SubscriptionStatus" CASCADE;
DROP TYPE IF EXISTS "SuggestionStatus" CASCADE;

-- Create ENUM types
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'MANAGER', 'STAFF');
CREATE TYPE "SubscriptionTier" AS ENUM ('STARTER', 'PROFESSIONAL', 'ENTERPRISE');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED');
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- Drop existing tables if they exist (for re-run safety)
DROP TABLE IF EXISTS "menu_views" CASCADE;
DROP TABLE IF EXISTS "ai_suggestions" CASCADE;
DROP TABLE IF EXISTS "competitor_prices" CASCADE;
DROP TABLE IF EXISTS "price_history" CASCADE;
DROP TABLE IF EXISTS "recipes" CASCADE;
DROP TABLE IF EXISTS "menu_variants" CASCADE;
DROP TABLE IF EXISTS "qr_codes" CASCADE;
DROP TABLE IF EXISTS "menu_items" CASCADE;
DROP TABLE IF EXISTS "ingredients" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "locations" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "restaurants" CASCADE;

-- Restaurants table (first because others depend on it)
CREATE TABLE "restaurants" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "ownerId" TEXT,
  "logoUrl" TEXT,
  "primaryColor" TEXT,
  "secondaryColor" TEXT,
  "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'STARTER',
  "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
  "subscriptionEndDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "email" TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "phone" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'OWNER',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "restaurantId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Locations table
CREATE TABLE "locations" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "restaurantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "phone" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "locations_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Categories table
CREATE TABLE "categories" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "restaurantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "nameEn" TEXT,
  "nameAr" TEXT,
  "nameRu" TEXT,
  "description" TEXT,
  "icon" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "categories_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- MenuItems table
CREATE TABLE "menu_items" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
  "price" DECIMAL(10,2) NOT NULL,
  "cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "profitMargin" DECIMAL(5,2),
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
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "menu_items_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "menu_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- MenuVariants table
CREATE TABLE "menu_variants" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "menuItemId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "nameEn" TEXT,
  "nameAr" TEXT,
  "nameRu" TEXT,
  "priceModifier" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "menu_variants_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Ingredients table
CREATE TABLE "ingredients" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "restaurantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "unit" TEXT NOT NULL,
  "pricePerUnit" DECIMAL(10,2) NOT NULL,
  "currentStock" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "minStockLevel" DECIMAL(10,2),
  "supplier" TEXT,
  "lastOrderDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ingredients_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Recipes table
CREATE TABLE "recipes" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "menuItemId" TEXT NOT NULL,
  "ingredientId" TEXT NOT NULL,
  "quantity" DECIMAL(10,3) NOT NULL,
  "unit" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "recipes_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "recipes_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- PriceHistory table
CREATE TABLE "price_history" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "menuItemId" TEXT NOT NULL,
  "oldPrice" DECIMAL(10,2) NOT NULL,
  "newPrice" DECIMAL(10,2) NOT NULL,
  "reason" TEXT,
  "changedById" TEXT NOT NULL,
  "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "price_history_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "price_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- QRCodes table
CREATE TABLE "qr_codes" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "restaurantId" TEXT NOT NULL,
  "locationId" TEXT,
  "code" TEXT UNIQUE NOT NULL,
  "tableNumber" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "totalViews" INTEGER NOT NULL DEFAULT 0,
  "lastViewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "qr_codes_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "qr_codes_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- MenuViews table
CREATE TABLE "menu_views" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "qrCodeId" TEXT,
  "menuItemId" TEXT,
  "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "language" TEXT DEFAULT 'tr',
  CONSTRAINT "menu_views_qrCodeId_fkey" FOREIGN KEY ("qrCodeId") REFERENCES "qr_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "menu_views_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CompetitorPrices table
CREATE TABLE "competitor_prices" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "restaurantId" TEXT NOT NULL,
  "competitorName" TEXT NOT NULL,
  "competitorLocation" TEXT,
  "productName" TEXT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "notes" TEXT,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "competitor_prices_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- AISuggestions table
CREATE TABLE "ai_suggestions" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "restaurantId" TEXT NOT NULL,
  "menuItemId" TEXT NOT NULL,
  "currentPrice" DECIMAL(10,2) NOT NULL,
  "suggestedPrice" DECIMAL(10,2) NOT NULL,
  "reasoning" TEXT NOT NULL,
  "confidence" DECIMAL(5,2) NOT NULL,
  "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
  "appliedById" TEXT,
  "appliedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ai_suggestions_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ai_suggestions_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ai_suggestions_appliedById_fkey" FOREIGN KEY ("appliedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");
CREATE INDEX IF NOT EXISTS "idx_users_restaurant" ON "users"("restaurantId");
CREATE INDEX IF NOT EXISTS "idx_locations_restaurant" ON "locations"("restaurantId");
CREATE INDEX IF NOT EXISTS "idx_categories_restaurant" ON "categories"("restaurantId");
CREATE INDEX IF NOT EXISTS "idx_menu_items_restaurant" ON "menu_items"("restaurantId");
CREATE INDEX IF NOT EXISTS "idx_menu_items_category" ON "menu_items"("categoryId");
CREATE INDEX IF NOT EXISTS "idx_menu_variants_menu_item" ON "menu_variants"("menuItemId");
CREATE INDEX IF NOT EXISTS "idx_ingredients_restaurant" ON "ingredients"("restaurantId");
CREATE INDEX IF NOT EXISTS "idx_recipes_menu_item" ON "recipes"("menuItemId");
CREATE INDEX IF NOT EXISTS "idx_recipes_ingredient" ON "recipes"("ingredientId");
CREATE INDEX IF NOT EXISTS "idx_price_history_menu_item" ON "price_history"("menuItemId");
CREATE INDEX IF NOT EXISTS "idx_qr_codes_restaurant" ON "qr_codes"("restaurantId");
CREATE INDEX IF NOT EXISTS "idx_qr_codes_location" ON "qr_codes"("locationId");
CREATE INDEX IF NOT EXISTS "idx_menu_views_qr_code" ON "menu_views"("qrCodeId");
CREATE INDEX IF NOT EXISTS "idx_menu_views_menu_item" ON "menu_views"("menuItemId");
CREATE INDEX IF NOT EXISTS "idx_competitor_prices_restaurant" ON "competitor_prices"("restaurantId");
CREATE INDEX IF NOT EXISTS "idx_ai_suggestions_restaurant" ON "ai_suggestions"("restaurantId");
CREATE INDEX IF NOT EXISTS "idx_ai_suggestions_menu_item" ON "ai_suggestions"("menuItemId");
