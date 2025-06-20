-- Create products table with enhanced fields
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  colors JSONB DEFAULT '[]',
  sizes JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  discount_percentage NUMERIC(5,2) DEFAULT 0,
  discounted_price NUMERIC(10,2) NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically calculate discounted price
CREATE OR REPLACE FUNCTION calculate_discounted_price()
RETURNS TRIGGER AS $$
BEGIN
    NEW.discounted_price = NEW.price - (NEW.price * NEW.discount_percentage / 100);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-calculate discounted price
CREATE TRIGGER calculate_discounted_price_trigger
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION calculate_discounted_price();
