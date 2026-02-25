export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  image: string;
  icon?: string;
  productCount?: number;
  subcategories?: Subcategory[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  productCount?: number;
}

export interface Product {
  id: string | number;
  title: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  brand?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  badge?: string;
  tags?: string[];
  specifications?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'supplements',
    name: 'Dietary Supplements',
    nameAr: 'مكملات غذائية',
    slug: 'supplements',
    description: 'Premium vitamins, minerals, and nutritional supplements to support your health and wellness journey. From essential daily vitamins to specialized formulations.',
    descriptionAr: 'فيتامينات ومعادن ومكملات غذائية فاخرة لدعم رحلتك نحو الصحة والعافية. من الفيتامينات اليومية الأساسية إلى التركيبات المتخصصة.',
    image: '/images/categories/supplements.jpg',
    icon: '💊',
    productCount: 24,
    seoTitle: 'Dietary Supplements | Premium Vitamins & Minerals | BioPara',
    seoDescription: 'Shop premium dietary supplements, vitamins, minerals, and nutritional products. High-quality formulations for optimal health and wellness.',
    subcategories: [
      {
        id: 'vitamins',
        name: 'Vitamins',
        nameAr: 'فيتامينات',
        slug: 'vitamins',
        description: 'Essential vitamins for daily health',
        descriptionAr: 'فيتامينات أساسية للصحة اليومية',
        productCount: 8
      },
      {
        id: 'minerals',
        name: 'Minerals',
        nameAr: 'معادن',
        slug: 'minerals',
        description: 'Essential minerals for body functions',
        descriptionAr: 'معادن أساسية لوظائف الجسم',
        productCount: 6
      },
      {
        id: 'omega',
        name: 'Omega & Fatty Acids',
        nameAr: 'أوميجا وأحماض دهنية',
        slug: 'omega',
        description: 'Omega-3, fish oil, and essential fatty acids',
        descriptionAr: 'أوميجا-3، زيت السمك، والأحماض الدهنية الأساسية',
        productCount: 5
      },
      {
        id: 'probiotics',
        name: 'Probiotics',
        nameAr: 'بروبيوتيك',
        slug: 'probiotics',
        description: 'Gut health and digestive support',
        descriptionAr: 'دعم صحة الأمعاء والهضم',
        productCount: 5
      }
    ]
  },
  {
    id: 'herbs',
    name: 'Medicinal Herbs',
    nameAr: 'أعشاب طبية',
    slug: 'herbs',
    description: 'Traditional and modern medicinal herbs for natural healing. From dried herbs to herbal infusions and plant-based remedies.',
    descriptionAr: 'أعشاب طبية تقليدية وحديثة للشفاء الطبيعي. من الأعشاب المجففة إلى المستحضرات العشبية والعلاجات النباتية.',
    image: '/images/categories/herbs.jpg',
    icon: '🌿',
    productCount: 18,
    seoTitle: 'Medicinal Herbs | Natural Herbal Remedies | BioPara',
    seoDescription: 'Discover premium medicinal herbs and natural remedies. Traditional healing with modern quality standards.',
    subcategories: [
      {
        id: 'dried-herbs',
        name: 'Dried Herbs',
        nameAr: 'أعشاب مجففة',
        slug: 'dried-herbs',
        description: 'Premium dried medicinal herbs',
        descriptionAr: 'أعشاب طبية مجففة فاخرة',
        productCount: 8
      },
      {
        id: 'herbal-teas',
        name: 'Herbal Teas',
        nameAr: 'شاي أعشاب',
        slug: 'herbal-teas',
        description: 'Therapeutic herbal infusions',
        descriptionAr: 'مستحضرات شاي علاجية',
        productCount: 6
      },
      {
        id: 'herbal-extracts',
        name: 'Herbal Extracts',
        nameAr: 'مستخلصات عشبية',
        slug: 'herbal-extracts',
        description: 'Concentrated herbal extracts',
        descriptionAr: 'مستخلصات عشبية مركزة',
        productCount: 4
      }
    ]
  },
  {
    id: 'oils',
    name: 'Medicinal Oils',
    nameAr: 'زيوت طبية',
    slug: 'oils',
    description: 'Pure medicinal oils for topical use and natural healing. From black seed oil to argan oil and essential oils.',
    descriptionAr: 'زيوت طبية نقية للاستخدام الموضعي والشفاء الطبيعي. من زيت الحبة السوداء إلى زيت الأرغان والزيوت العطرية.',
    image: '/images/categories/oils.jpg',
    icon: '🫙',
    productCount: 15,
    seoTitle: 'Medicinal Oils | Natural Healing Oils | BioPara',
    seoDescription: 'Shop pure medicinal oils including black seed oil, argan oil, and essential oils. Natural healing for skin and body.',
    subcategories: [
      {
        id: 'carrier-oils',
        name: 'Carrier Oils',
        nameAr: 'زيوت أساس',
        slug: 'carrier-oils',
        description: 'Base oils for therapeutic use',
        descriptionAr: 'زيوت أساس للاستخدام العلاجي',
        productCount: 6
      },
      {
        id: 'essential-oils',
        name: 'Essential Oils',
        nameAr: 'زيوت عطرية',
        slug: 'essential-oils',
        description: 'Pure essential oils for aromatherapy',
        descriptionAr: 'زيوت عطرية نقية للعلاج بالروائح',
        productCount: 5
      },
      {
        id: 'therapeutic-blends',
        name: 'Therapeutic Blends',
        nameAr: 'خلائط علاجية',
        slug: 'therapeutic-blends',
        description: 'Specialized therapeutic oil blends',
        descriptionAr: 'خلائط زيت علاجية متخصصة',
        productCount: 4
      }
    ]
  }
];

export const SAMPLE_PRODUCTS: Product[] = [
  // Dietary Supplements
  {
    id: 'sup-001',
    title: 'Omega-3 Fish Oil',
    slug: 'omega-3-fish-oil',
    description: 'Premium omega-3 fish oil with EPA and DHA for heart and brain health.',
    price: 199.00,
    originalPrice: 249.00,
    image: '/images/products/omega-3.jpg',
    category: 'supplements',
    subcategory: 'omega',
    brand: 'BioPara',
    rating: 4.8,
    reviewCount: 127,
    inStock: true,
    stockCount: 45,
    badge: 'Best Seller',
    tags: ['omega-3', 'epa', 'dha', 'heart health']
  },
  {
    id: 'sup-002',
    title: 'Vitamin D3 5000 IU',
    slug: 'vitamin-d3-5000',
    description: 'High-potency vitamin D3 for immune support and bone health.',
    price: 149.00,
    image: '/images/products/vitamin-d3.jpg',
    category: 'supplements',
    subcategory: 'vitamins',
    brand: 'BioPara',
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
    stockCount: 67,
    tags: ['vitamin-d', 'immune', 'bone health']
  },
  {
    id: 'sup-003',
    title: 'Probiotic Complex',
    slug: 'probiotic-complex',
    description: 'Multi-strain probiotic for digestive health and immune support.',
    price: 229.00,
    image: '/images/products/probiotic.jpg',
    category: 'supplements',
    subcategory: 'probiotics',
    brand: 'BioPara',
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    stockCount: 23,
    badge: 'New',
    tags: ['probiotic', 'digestive health', 'gut flora']
  },
  {
    id: 'sup-004',
    title: 'Magnesium Citrate',
    slug: 'magnesium-citrate',
    description: 'Highly absorbable magnesium for muscle relaxation and sleep.',
    price: 179.00,
    image: '/images/products/magnesium.jpg',
    category: 'supplements',
    subcategory: 'minerals',
    brand: 'BioPara',
    rating: 4.6,
    reviewCount: 94,
    inStock: true,
    stockCount: 38,
    tags: ['magnesium', 'muscle', 'sleep']
  },
  
  // Medicinal Herbs
  {
    id: 'herb-001',
    title: 'Organic Lavender',
    slug: 'organic-lavender',
    description: 'Premium dried lavender flowers for relaxation and aromatherapy.',
    price: 89.00,
    image: '/images/products/lavender.jpg',
    category: 'herbs',
    subcategory: 'dried-herbs',
    brand: 'BioPara',
    rating: 4.8,
    reviewCount: 203,
    inStock: true,
    stockCount: 56,
    badge: 'Organic',
    tags: ['lavender', 'relaxation', 'aromatherapy']
  },
  {
    id: 'herb-002',
    title: 'Chamomile Tea',
    slug: 'chamomile-tea',
    description: 'Soothing chamomile flowers for calm and restful sleep.',
    price: 79.00,
    image: '/images/products/chamomile.jpg',
    category: 'herbs',
    subcategory: 'herbal-teas',
    brand: 'BioPara',
    rating: 4.9,
    reviewCount: 178,
    inStock: true,
    stockCount: 82,
    tags: ['chamomile', 'sleep', 'calming']
  },
  {
    id: 'herb-003',
    title: 'Peppermint Leaves',
    slug: 'peppermint-leaves',
    description: 'Fresh peppermint leaves for digestion and mental clarity.',
    price: 69.00,
    image: '/images/products/peppermint.jpg',
    category: 'herbs',
    subcategory: 'dried-herbs',
    brand: 'BioPara',
    rating: 4.7,
    reviewCount: 145,
    inStock: true,
    stockCount: 41,
    tags: ['peppermint', 'digestion', 'focus']
  },
  {
    id: 'herb-004',
    title: 'Ginger Root',
    slug: 'ginger-root',
    description: 'Organic ginger root for inflammation and immune support.',
    price: 99.00,
    image: '/images/products/ginger.jpg',
    category: 'herbs',
    subcategory: 'dried-herbs',
    brand: 'BioPara',
    rating: 4.8,
    reviewCount: 167,
    inStock: true,
    stockCount: 29,
    badge: 'Anti-inflammatory',
    tags: ['ginger', 'immune', 'anti-inflammatory']
  },
  
  // Medicinal Oils
  {
    id: 'oil-001',
    title: 'Black Seed Oil',
    slug: 'black-seed-oil',
    description: 'Pure cold-pressed black seed oil for immune support and healing.',
    price: 189.00,
    originalPrice: 229.00,
    image: '/images/products/black-seed-oil.jpg',
    category: 'oils',
    subcategory: 'carrier-oils',
    brand: 'BioPara',
    rating: 4.9,
    reviewCount: 289,
    inStock: true,
    stockCount: 34,
    badge: 'Best Seller',
    tags: ['black seed', 'immune', 'healing']
  },
  {
    id: 'oil-002',
    title: 'Argan Oil',
    slug: 'argan-oil',
    description: 'Premium Moroccan argan oil for skin and hair care.',
    price: 249.00,
    image: '/images/products/argan-oil.jpg',
    category: 'oils',
    subcategory: 'carrier-oils',
    brand: 'BioPara',
    rating: 4.8,
    reviewCount: 198,
    inStock: true,
    stockCount: 18,
    badge: 'Limited Stock',
    tags: ['argan', 'skin', 'hair']
  },
  {
    id: 'oil-003',
    title: 'Lavender Essential Oil',
    slug: 'lavender-essential-oil',
    description: 'Pure lavender essential oil for relaxation and aromatherapy.',
    price: 139.00,
    image: '/images/products/lavender-oil.jpg',
    category: 'oils',
    subcategory: 'essential-oils',
    brand: 'BioPara',
    rating: 4.9,
    reviewCount: 234,
    inStock: true,
    stockCount: 47,
    tags: ['lavender', 'essential oil', 'relaxation']
  },
  {
    id: 'oil-004',
    title: 'Eucalyptus Oil',
    slug: 'eucalyptus-oil',
    description: 'Therapeutic eucalyptus oil for respiratory support.',
    price: 119.00,
    image: '/images/products/eucalyptus-oil.jpg',
    category: 'oils',
    subcategory: 'essential-oils',
    brand: 'BioPara',
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    stockCount: 52,
    tags: ['eucalyptus', 'respiratory', 'clearing']
  }
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(cat => cat.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return SAMPLE_PRODUCTS.filter(product => product.category === categorySlug);
}

export function getProductsBySubcategory(categorySlug: string, subcategorySlug: string): Product[] {
  return SAMPLE_PRODUCTS.filter(product => 
    product.category === categorySlug && product.subcategory === subcategorySlug
  );
}

export function getFeaturedProducts(categorySlug: string, limit: number = 4): Product[] {
  return SAMPLE_PRODUCTS
    .filter(product => product.category === categorySlug)
    .slice(0, limit);
}
