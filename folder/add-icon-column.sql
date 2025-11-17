-- Add missing icon column to categories table
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "icon" TEXT;
