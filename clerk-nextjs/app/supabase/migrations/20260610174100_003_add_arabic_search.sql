-- Enable pg_trgm extension for trigram similarity (useful for typos)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add a generated column for full text search vector in Arabic
ALTER TABLE products ADD COLUMN fts_arabic tsvector GENERATED ALWAYS AS (
  to_tsvector('arabic', name || ' ' || COALESCE(description, ''))
) STORED;

-- Create a GIN index on the search vector for performance
CREATE INDEX IF NOT EXISTS products_fts_arabic_idx ON products USING GIN (fts_arabic);

-- Create a GiST or GIN index for trigram similarity on name (optional, for typos)
CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON products USING GIN (name gin_trgm_ops);

-- Reload postgREST schema cache
NOTIFY pgrst, 'reload schema';
