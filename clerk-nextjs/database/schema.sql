-- BioPara E-commerce Database Schema
-- Created for Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    description_ar TEXT,
    image VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'MAD',
    stock INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN (
    to_tsvector('english', name || ' ' || name_ar || ' ' || description || ' ' || description_ar)
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow read access to everyone for categories
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- Allow read access to everyone for active products
CREATE POLICY "Active products are viewable by everyone" ON products
    FOR SELECT USING (is_active = true);

-- Allow insert/update/delete for service role only
CREATE POLICY "Service role can manage categories" ON categories
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage products" ON products
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Insert sample categories
INSERT INTO categories (name, name_ar, slug, description, description_ar, image) VALUES
('Natural Honey', 'عسل طبيعي', 'natural-honey', 'Pure natural honey from pristine environments', 'عسل طبيعي نقي من البيئات النقية', '/images/categories/honey.jpg'),
('Medicinal Herbs', 'أعشاب طبية', 'medicinal-herbs', 'Traditional medicinal herbs and plants', 'أعشاب ونباتات طبية تقليدية', '/images/categories/herbs.jpg'),
('Essential Oils', 'زيوت عطرية', 'essential-oils', 'Pure essential oils for aromatherapy', 'زيوت عطرية نقية للعلاج بالروائح', '/images/categories/oils.jpg')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, name_ar, slug, description, description_ar, price, currency, stock, images, category_id, is_active, featured) VALUES
('Wildflower Honey', 'عسل الأزهار البرية', 'wildflower-honey', 'Pure wildflower honey collected from mountain meadows', 'عسل الأزهار البرية النقي من المراعي الجبلية', 159.00, 'MAD', 50, ARRAY['/images/natural-honey/wildflower-honey.jpg'], 1, true, true),
('Acacia Honey', 'عسل الأكاسيا', 'acacia-honey', 'Light and delicate acacia honey with mild flavor', 'عسل الأكاسيا الفاتح والرقيق بنكهة خفيفة', 175.00, 'MAD', 45, ARRAY['/images/natural-honey/acacia-honey.jpg'], 1, true, true),
('Sidr Honey', 'عسل السدر', 'sidr-honey', 'Premium sidr honey known for its medicinal properties', 'عسل السدر المميز بخصائصه الطبية', 399.00, 'MAD', 30, ARRAY['/images/natural-honey/sidr-honey.jpg'], 1, true, false),
('Thyme Honey', 'عسل الزعتر', 'thyme-honey', 'Aromatic thyme honey with therapeutic benefits', 'عسل الزعتر العطري بفوائد علاجية', 185.00, 'MAD', 40, ARRAY['/images/natural-honey/thyme-honey.jpg'], 1, true, false),
('Eucalyptus Honey', 'عسل الأوكاليبتوس', 'eucalyptus-honey', 'Refreshing eucalyptus honey for respiratory health', 'عسل الأوكاليبتوس المنعش للصحة التنفسية', 195.00, 'MAD', 35, ARRAY['/images/natural-honey/eucalyptus-honey.jpg'], 1, true, false),
('Lavender Essential Oil', 'زيت اللافندر العطري', 'lavender-essential-oil', 'Pure lavender oil for relaxation and sleep', 'زيت اللافندر النقي للاسترخاء والنوم', 89.00, 'MAD', 60, ARRAY['/images/oils/lavender.jpg'], 3, true, true),
('Peppermint Essential Oil', 'زيت النعناع العطري', 'peppermint-essential-oil', 'Refreshing peppermint oil for energy and focus', 'زيت النعناع المنعش للطاقة والتركيز', 79.00, 'MAD', 55, ARRAY['/images/oils/peppermint.jpg'], 3, true, false),
('Chamomile Herbs', 'أعشاب البابونج', 'chamomile-herbs', 'Dried chamomile flowers for tea and relaxation', 'أزهار البابونج المجففة للشاي والاسترخاء', 45.00, 'MAD', 80, ARRAY['/images/herbs/chamomile.jpg'], 2, true, false),
('Ginger Root', 'جذر الزنجبيل', 'ginger-root', 'Fresh ginger root for cooking and health', 'جذر الزنجبيل الطازج للطبخ والصحة', 35.00, 'MAD', 70, ARRAY['/images/herbs/ginger.jpg'], 2, true, false),
('Turmeric Powder', 'مسحوق الكركم', 'turmeric-powder', 'Organic turmeric powder with anti-inflammatory properties', 'مسحوق الكركم العضوي بخصائص مضادة للالتهابات', 55.00, 'MAD', 65, ARRAY['/images/herbs/turmeric.jpg'], 2, true, false)
ON CONFLICT (slug) DO NOTHING;

-- Create a view for active products with categories
CREATE OR REPLACE VIEW active_products_with_categories AS
SELECT 
    p.*,
    c.name as category_name,
    c.name_ar as category_name_ar,
    c.slug as category_slug
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL VIEWS IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
