-- Add support for multiple images to posts table
-- Run this in your Supabase SQL Editor

-- Add image_urls column if it doesn't exist (for existing databases)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_urls TEXT;

-- Update existing posts to have image_urls array if they have image_url
UPDATE posts 
SET image_urls = CASE 
  WHEN image_url IS NOT NULL THEN '["' || image_url || '"]'
  ELSE NULL 
END
WHERE image_urls IS NULL AND image_url IS NOT NULL;