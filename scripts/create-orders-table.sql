-- Drop table if exists (for development only)
-- DROP TABLE IF EXISTS orders;

-- Create orders table with correct data types
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  payment_intent_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert a test record to verify the table works
INSERT INTO orders (
  order_number,
  customer_email,
  customer_name,
  customer_address,
  items,
  subtotal,
  currency,
  payment_intent_id,
  status
) VALUES (
  'TEST-ORDER-001',
  'test@example.com',
  'Test Customer',
  '{"firstName": "Test", "lastName": "Customer", "address": "123 Test St", "city": "Test City", "postalCode": "12345", "country": "US"}',
  '[{"id": "1", "name": "Test Product", "price": 50, "quantity": 1}]',
  50.00,
  'USD',
  'pi_test_123456789',
  'completed'
) ON CONFLICT (order_number) DO NOTHING;

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;
