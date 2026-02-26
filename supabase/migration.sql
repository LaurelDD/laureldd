-- Supabase Products Table Schema
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier (e.g., 'amanita-side-table')
  badge TEXT DEFAULT 'MAKEMAKE', -- Product badge text
  price DECIMAL NOT NULL,
  original_price DECIMAL, -- For sale items
  description TEXT,
  lead_time TEXT DEFAULT '6-8 weeks',
  
  -- Images
  thumbnail_url TEXT, -- For listings/search
  gallery_images JSONB, -- Array of image URLs
  
  -- Product options
  sizes JSONB, -- Array of {name, price, dimensions}
  materials JSONB, -- Object with material sections and options
  
  -- Specifications
  dimensions JSONB, -- Array of {label, value}
  materials_spec TEXT, -- HTML content for materials spec
  care_instructions TEXT, -- HTML content
  shipping_info TEXT, -- HTML content
  
  -- Craftsmanship section
  craftsmanship_title TEXT DEFAULT 'Hand-Crafted in San José',
  craftsmanship_text TEXT,
  
  -- Configuration
  material_selection_mode TEXT DEFAULT '1', -- 'none', '1', '2', 'all'
  has_local_teak BOOLEAN DEFAULT false,
  has_semi_satin_lacquer BOOLEAN DEFAULT false,
  has_white_cement BOOLEAN DEFAULT false,
  has_metal BOOLEAN DEFAULT false,
  has_hardwood BOOLEAN DEFAULT false,
  has_fabric BOOLEAN DEFAULT false,
  has_strippedfabric BOOLEAN DEFAULT false,
  has_leather BOOLEAN DEFAULT false,
  has_grs BOOLEAN DEFAULT false,
  
  -- Metadata
  category TEXT[], -- Array of categories
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;

CREATE POLICY "Public can view archived products"
  ON public.products
  FOR SELECT
  TO anon
  USING (is_archived = false);

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

-- Grid (Season Markdowns): products shown in "The Grid" section and 15% off
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS is_grid BOOLEAN NOT NULL DEFAULT false;
