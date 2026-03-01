-- =================================
-- DROP EXISTING TABLES (FRESH START)
-- =================================

DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- =================================
-- CREATE TABLES
-- =================================

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image_url TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================
-- INSERT CATEGORIES
-- =================================

INSERT INTO categories (id, name, slug, description, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Dietary Supplements', 'dietary-supplements', 'High-quality dietary supplements for optimal health and wellness', '/images/categories/dietary-supplements.jpg'),
('550e8400-e29b-41d4-a716-446655440002', 'Medicinal Herbs', 'medicinal-herbs', 'Natural medicinal herbs with healing properties', '/images/categories/medicinal-herbs.jpg'),
('550e8400-e29b-41d4-a716-446655440003', 'Medicinal Oils', 'medicinal-oils', 'Therapeutic medicinal oils for various health benefits', '/images/categories/medicinal-oils.jpg');

-- =================================
-- INSERT DIETARY SUPPLEMENTS
-- =================================

INSERT INTO products (name, slug, description, price, original_price, image_url, category_id, featured) VALUES
('Ashwagandha', 'ashwagandha', 'Premium Ashwagandha root extract for stress relief and vitality', 29.99, 39.99, '/images/dietary-supplements/ashwagandha.jpg', '550e8400-e29b-41d4-a716-446655440001', true),
('Biotin', 'biotin', 'High-potency Biotin for healthy hair, skin, and nails', 19.99, 24.99, '/images/dietary-supplements/biotin.jpg', '550e8400-e29b-41d4-a716-446655440001', false),
('Collagen', 'collagen', 'Marine collagen peptides for joint health and youthful skin', 34.99, 44.99, '/images/dietary-supplements/collagen.jpg', '550e8400-e29b-41d4-a716-446655440001', true),
('L-Glutathione', 'l-glutathione', 'Powerful antioxidant L-Glutathione for detoxification and skin brightening', 49.99, 59.99, '/images/dietary-supplements/l-glutathione.jpg', '550e8400-e29b-41d4-a716-446655440001', false),
('Magnesium', 'magnesium', 'High-absorption magnesium for muscle relaxation and better sleep', 24.99, 29.99, '/images/dietary-supplements/magnesium.jpg', '550e8400-e29b-41d4-a716-446655440001', false),
('Mastic Gum', 'mastic-gum', 'Pure mastic gum for digestive health and oral hygiene', 39.99, 49.99, '/images/dietary-supplements/mastic-gum.jpg', '550e8400-e29b-41d4-a716-446655440001', false),
('Multivitamins', 'multivitamins', 'Complete daily multivitamin supplement for men and women', 22.99, 27.99, '/images/dietary-supplements/multivitamins.jpg', '550e8400-e29b-41d4-a716-446655440001', true),
('Omega-3 Fish Oil', 'omega-3-fish-oil', 'Ultra-pure omega-3 fish oil for heart and brain health', 27.99, 34.99, '/images/dietary-supplements/omega-3-fish-oil.jpg', '550e8400-e29b-41d4-a716-446655440001', false),
('Probiotic', 'probiotic', 'Advanced probiotic formula for gut health and immunity', 32.99, 39.99, '/images/dietary-supplements/probiotic.jpg', '550e8400-e29b-41d4-a716-446655440001', false),
('Shilajit', 'shilajit', 'Pure Himalayan Shilajit resin for energy and vitality', 44.99, 54.99, '/images/dietary-supplements/shilajit.jpg', '550e8400-e29b-41d4-a716-446655440001', false),
('Vitamin D3 + K2', 'vitamin-d3-k2', 'Vitamin D3 with K2 for bone health and immune support', 18.99, 23.99, '/images/dietary-supplements/vitamin-d3-k2.jpg', '550e8400-e29b-41d4-a716-446655440001', false),
('Zinc', 'zinc', 'High-potency zinc for immune function and cellular health', 16.99, 19.99, '/images/dietary-supplements/zinc.jpg', '550e8400-e29b-41d4-a716-446655440001', false);

-- =================================
-- INSERT MEDICINAL HERBS
-- =================================

INSERT INTO products (name, slug, description, price, original_price, image_url, category_id, featured) VALUES
('Anise Herb', 'anise-herb', 'Organic anise herb for digestive health and respiratory support', 12.99, 15.99, '/images/medicinal-herbs/anise-herb.jpg', '550e8400-e29b-41d4-a716-446655440002', false),
('Camomile Herb', 'camomile-herb', 'Premium camomile flowers for relaxation and better sleep', 14.99, 18.99, '/images/medicinal-herbs/camomile-herb.jpg', '550e8400-e29b-41d4-a716-446655440002', true),
('Cinnamon Herb', 'cinnamon-herb', 'Pure cinnamon bark for blood sugar regulation and warming effects', 11.99, 14.99, '/images/medicinal-herbs/cinnamon-herb.jpg', '550e8400-e29b-41d4-a716-446655440002', false),
('Ginger Herb', 'ginger-herb', 'Fresh ginger root for nausea relief and anti-inflammatory benefits', 13.99, 16.99, '/images/medicinal-herbs/ginger-herb.jpg', '550e8400-e29b-41d4-a716-446655440002', true),
('Hibiscus Herb', 'hibiscus-herb', 'Dried hibiscus flowers for blood pressure and heart health', 15.99, 19.99, '/images/medicinal-herbs/hibiscus-herb.jpg', '550e8400-e29b-41d4-a716-446655440002', false),
('Lavender Herb', 'lavender-herb', 'Aromatic lavender flowers for stress relief and better sleep', 17.99, 21.99, '/images/medicinal-herbs/lavender-herb.jpg', '550e8400-e29b-41d4-a716-446655440002', false),
('Lemon Verbena Herb', 'lemon-verbena-herb', 'Fresh lemon verbena leaves for digestion and mood enhancement', 16.99, 20.99, '/images/medicinal-herbs/lemon-verbena-herb.jpg', '550e8400-e29b-41d4-a716-446655440002', false),
('Mint Herb', 'mint-herb', 'Refreshing mint leaves for digestion and mental clarity', 10.99, 13.99, '/images/medicinal-herbs/mint-herb.jpg', '550e8400-e29b-41d4-a716-446655440002', false),
('Rosemary Herb', 'rosemary-herb', 'Aromatic rosemary for memory enhancement and circulation', 12.99, 15.99, '/images/medicinal-herbs/rosemary-herb.jpg', '550e8400-e29b-41d4-a716-446655440002', false),
('Sage Herb', 'sage-herb', 'Sacred sage herb for purification and cognitive function', 14.99, 18.99, '/images/medicinal-herbs/sage-herb.jpg', '550e8400-e29b-41d4-a716-446655440002', false),
('Thyme Herb', 'thyme-herb', 'Medicinal thyme for respiratory health and antimicrobial properties', 11.99, 14.99, '/images/medicinal-herbs/thyme-herb.jpg', '550e8400-e29b-41d4-a716-446655440002', false),
('Turmeric Herb', 'turmeric-herb', 'Golden turmeric root for anti-inflammatory and antioxidant benefits', 13.99, 16.99, '/images/medicinal-herbs/turmeric-herb.jpg', '550e8400-e29b-41d4-a716-446655440002', true);

-- =================================
-- INSERT MEDICINAL OILS
-- =================================

INSERT INTO products (name, slug, description, price, original_price, image_url, category_id, featured) VALUES
('Almond Oil', 'almond-oil', 'Sweet almond oil for skin nourishment and hair care', 18.99, 22.99, '/images/medicinal-oils/almond-oil.jpg', '550e8400-e29b-41d4-a716-446655440003', false),
('Argan Oil', 'argan-oil', 'Pure Moroccan argan oil for anti-aging and skin repair', 28.99, 34.99, '/images/medicinal-oils/argan-oil.jpg', '550e8400-e29b-41d4-a716-446655440003', true),
('Black Seed Oil', 'black-seed-oil', 'Premium black seed oil for immune support and overall wellness', 24.99, 29.99, '/images/medicinal-oils/black-seed-oil.jpg', '550e8400-e29b-41d4-a716-446655440003', true),
('Castor Oil', 'castor-oil', 'Therapeutic castor oil for hair growth and detoxification', 16.99, 19.99, '/images/medicinal-oils/castor-oil.jpg', '550e8400-e29b-41d4-a716-446655440003', false),
('Ginger Oil', 'ginger-oil', 'Warming ginger oil for pain relief and circulation', 22.99, 26.99, '/images/medicinal-oils/ginger-oil.jpg', '550e8400-e29b-41d4-a716-446655440003', false),
('Gratic Oil', 'gratic-oil', 'Specialized gratic oil for therapeutic massage and joint health', 26.99, 31.99, '/images/medicinal-oils/gratic-oil.jpg', '550e8400-e29b-41d4-a716-446655440003', false),
('Lavender Oil', 'lanvender-oil', 'Calming lavender oil for relaxation and skin healing', 19.99, 24.99, '/images/medicinal-oils/lanvender-oil.jpg', '550e8400-e29b-41d4-a716-446655440003', true),
('Musk Oil', 'musk-oil', 'Traditional musk oil for aromatherapy and masculine fragrance', 32.99, 39.99, '/images/medicinal-oils/musk-oil.jpg', '550e8400-e29b-41d4-a716-446655440003', false),
('Olive Oil', 'olive-oil', 'Extra virgin olive oil for heart health and Mediterranean diet', 14.99, 18.99, '/images/medicinal-oils/olive-oil.jpg', '550e8400-e29b-41d4-a716-446655440003', false),
('Rose Oil', 'rose-oil', 'Luxurious rose oil for skin rejuvenation and emotional balance', 45.99, 54.99, '/images/medicinal-oils/rose-oil.jpg', '550e8400-e29b-41d4-a716-446655440003', false),
('Sidr Oil', 'sidr-oil', 'Sacred sidr oil for spiritual purification and skin benefits', 38.99, 46.99, '/images/medicinal-oils/sidr-oil.jpg', '550e8400-e29b-41d4-a716-446655440003', false);

-- =================================
-- CREATE INDEXES
-- =================================

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_categories_slug ON categories(slug);

-- =================================
-- ENABLE RLS (ROW LEVEL SECURITY)
-- =================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- =================================
-- RLS POLICIES
-- =================================

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert categories" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update categories" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete categories" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Products policies
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update products" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete products" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- =================================
-- FUNCTIONS FOR UPDATED_AT
-- =================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =================================
-- TRIGGERS FOR UPDATED_AT
-- =================================

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
