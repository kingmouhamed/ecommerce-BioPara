-- =================================
-- DELETE PURE MOUNTAIN HONEY PRODUCT
-- =================================

-- Delete the honey product
DELETE FROM products WHERE sku = 'HNY-001';

-- Check if dietary supplements category has other products
DO $$
DECLARE
  product_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO product_count 
  FROM products p 
  JOIN categories c ON p.category_id = c.id 
  WHERE c.slug = 'dietary-supplements';
  
  -- If no other products in this category, delete the category
  IF product_count = 0 THEN
    DELETE FROM categories WHERE slug = 'dietary-supplements';
    RAISE NOTICE '🗑️ Deleted dietary supplements category (no remaining products)';
  ELSE
    RAISE NOTICE '📋 Dietary supplements category kept (has % products)', product_count;
  END IF;
END $$;

-- Display confirmation message
DO $$
BEGIN
  RAISE NOTICE '🗑️ Successfully deleted Pure Mountain Honey product!';
  RAISE NOTICE '📝 Deleted Product Details:';
  RAISE NOTICE '   SKU: HNY-001';
  RAISE NOTICE '   Name: عسل جبلي حر | Pure Mountain Honey';
  RAISE NOTICE '   Category: Dietary Supplements';
END $$;
