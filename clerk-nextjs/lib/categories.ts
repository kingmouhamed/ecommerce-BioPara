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
        id: 'specialized',
        name: 'Specialized Supplements',
        nameAr: 'مكملات متخصصة',
        slug: 'specialized',
        description: 'Ashwagandha and other specialized health supplements',
        descriptionAr: 'الأشواجندا والمكملات الصحية المتخصصة الأخرى',
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
    title: 'Vitamin D3+K2',
    slug: 'vitamin-d3-k2',
    description: 'High-potency vitamin D3 with K2 for bone and immune health.',
    price: 189.00,
    image: '/images/dietary supplements/vitamin-d3-k2.jpg',
    category: 'supplements',
    subcategory: 'vitamins',
    brand: 'BioPara',
    rating: 4.9,
    reviewCount: 145,
    inStock: true,
    stockCount: 34,
    badge: 'Best Seller',
    tags: ['vitamin-d', 'vitamin-k', 'bone health', 'immune']
  },
  {
    id: 'sup-002',
    title: 'Magnesium',
    slug: 'magnesium-citrate',
    description: 'Highly absorbable magnesium for muscle relaxation and sleep.',
    price: 179.00,
    image: '/images/dietary supplements/Magnesium.jpg',
    category: 'supplements',
    subcategory: 'minerals',
    brand: 'BioPara',
    rating: 4.7,
    reviewCount: 98,
    inStock: true,
    stockCount: 45,
    tags: ['magnesium', 'muscle', 'sleep', 'relaxation']
  },
  {
    id: 'sup-003',
    title: 'Omega 3',
    slug: 'omega-3-fish-oil',
    description: 'Premium omega-3 fish oil with EPA and DHA for heart and brain health.',
    price: 249.00,
    originalPrice: 299.00,
    image: '/images/dietary supplements/omega-3-fish-oil.jpg',
    category: 'supplements',
    subcategory: 'omega',
    brand: 'BioPara',
    rating: 4.8,
    reviewCount: 234,
    inStock: true,
    stockCount: 28,
    badge: 'Best Seller',
    tags: ['omega-3', 'epa', 'dha', 'heart health']
  },
  {
    id: 'sup-004',
    title: 'Ashwagandha',
    slug: 'ashwagandha-root',
    description: 'Premium ashwagandha root extract for stress relief and vitality.',
    price: 219.00,
    image: '/images/dietary supplements/Ashwagandha.jpg',
    category: 'supplements',
    subcategory: 'specialized',
    brand: 'BioPara',
    rating: 4.6,
    reviewCount: 167,
    inStock: true,
    stockCount: 22,
    badge: 'New',
    tags: ['ashwagandha', 'stress', 'energy', 'adaptogen']
  },
  {
    id: 'sup-005',
    title: 'Multivitamins',
    slug: 'multivitamins-daily',
    description: 'Complete daily multivitamin formula with essential vitamins and minerals.',
    price: 159.00,
    image: '/images/dietary supplements/Multivitamins.jpg',
    category: 'supplements',
    subcategory: 'vitamins',
    brand: 'BioPara',
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    stockCount: 52,
    badge: 'Popular',
    tags: ['multivitamin', 'daily', 'vitamins', 'minerals']
  },
  {
    id: 'sup-006',
    title: 'Shilajit',
    slug: 'shilajit-resin',
    description: 'Premium shilajit resin extract for energy and vitality.',
    price: 289.00,
    image: '/images/dietary supplements/Shilajit.jpg',
    category: 'supplements',
    subcategory: 'specialized',
    brand: 'BioPara',
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    stockCount: 18,
    badge: 'Premium',
    tags: ['shilajit', 'energy', 'vitality', 'traditional']
  },
  {
    id: 'sup-007',
    title: 'Collagen',
    slug: 'collagen-peptides',
    description: 'Hydrolyzed collagen peptides for skin, joint, and bone health.',
    price: 269.00,
    originalPrice: 319.00,
    image: '/images/dietary supplements/Collagen.jpg',
    category: 'supplements',
    subcategory: 'specialized',
    brand: 'BioPara',
    rating: 4.9,
    reviewCount: 203,
    inStock: true,
    stockCount: 31,
    badge: 'Best Seller',
    tags: ['collagen', 'peptides', 'skin health', 'joints']
  },
  {
    id: 'sup-008',
    title: 'Zinc',
    slug: 'zinc-picolinate',
    description: 'High-absorption zinc picolinate for immune support and cellular health.',
    price: 139.00,
    image: '/images/dietary supplements/Zinc.jpg',
    category: 'supplements',
    subcategory: 'minerals',
    brand: 'BioPara',
    rating: 4.6,
    reviewCount: 87,
    inStock: true,
    stockCount: 41,
    tags: ['zinc', 'immune', 'cellular health', 'picolinate']
  },
  {
    id: 'sup-009',
    title: 'Biotin',
    slug: 'biotin-hair-skin',
    description: 'High-potency biotin for healthy hair, skin, and nail growth.',
    price: 149.00,
    image: '/images/dietary supplements/Biotin.jpg',
    category: 'supplements',
    subcategory: 'vitamins',
    brand: 'BioPara',
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    stockCount: 38,
    badge: 'Popular',
    tags: ['biotin', 'hair', 'skin', 'nails']
  },
  {
    id: 'sup-010',
    title: 'Probiotic',
    slug: 'probiotic-complex',
    description: 'Multi-strain probiotic for digestive health and immune support.',
    price: 229.00,
    image: '/images/dietary supplements/Probiotic.jpg',
    category: 'supplements',
    subcategory: 'probiotics',
    brand: 'BioPara',
    rating: 4.8,
    reviewCount: 198,
    inStock: true,
    stockCount: 24,
    badge: 'New',
    tags: ['probiotic', 'digestive health', 'gut flora', 'immune']
  },
  {
    id: 'sup-011',
    title: 'Mastic Gum',
    slug: 'mastic-gum-resin',
    description: 'Premium mastic gum resin for digestive health and oral hygiene.',
    price: 199.00,
    image: '/images/dietary supplements/Mastic Gum.jpg',
    category: 'supplements',
    subcategory: 'specialized',
    brand: 'BioPara',
    rating: 4.5,
    reviewCount: 92,
    inStock: true,
    stockCount: 16,
    tags: ['mastic gum', 'digestive health', 'oral hygiene', 'resin']
  },
  {
    id: 'sup-012',
    title: 'L-Glutathione',
    slug: 'l-glutathione-antioxidant',
    description: 'Premium L-Glutathione for antioxidant support and skin brightening.',
    price: 279.00,
    originalPrice: 329.00,
    image: '/images/dietary supplements/L-Glutathione.jpg',
    category: 'supplements',
    subcategory: 'specialized',
    brand: 'BioPara',
    rating: 4.9,
    reviewCount: 145,
    inStock: true,
    stockCount: 19,
    badge: 'Premium',
    tags: ['glutathione', 'antioxidant', 'skin brightening', 'detox']
  },
  
  // Medicinal Herbs
  {
    id: 'herb-001',
    title: 'Anise Herb',
    slug: 'anise-herb',
    description: 'Premium anise seeds for digestive health and respiratory support.',
    price: 79.00,
    image: '/images/medicinal herbs/anise-herb.jpg',
    category: 'herbs',
    subcategory: 'dried-herbs',
    brand: 'BioPara',
    rating: 4.7,
    reviewCount: 145,
    inStock: true,
    stockCount: 62,
    badge: 'Organic',
    tags: ['anise', 'digestive health', 'respiratory', 'aromatic']
  },
  {
    id: 'herb-002',
    title: 'Chamomile Herb',
    slug: 'chamomile-herb',
    description: 'Premium chamomile flowers for relaxation and sleep support.',
    price: 89.00,
    image: '/images/medicinal herbs/camomile-herb.jpg',
    category: 'herbs',
    subcategory: 'herbal-tea',
    brand: 'BioPara',
    rating: 4.9,
    reviewCount: 234,
    inStock: true,
    stockCount: 48,
    badge: 'Best Seller',
    tags: ['chamomile', 'relaxation', 'sleep', 'calming']
  },
  {
    id: 'herb-003',
    title: 'Cinnamon Herb',
    slug: 'cinnamon-herb',
    description: 'Premium cinnamon bark for blood sugar support and warming properties.',
    price: 69.00,
    image: '/images/medicinal herbs/cinnamon-herb.jpg',
    category: 'herbs',
    subcategory: 'dried-herbs',
    brand: 'BioPara',
    rating: 4.6,
    reviewCount: 178,
    inStock: true,
    stockCount: 71,
    tags: ['cinnamon', 'blood sugar', 'warming', 'aromatic']
  },
  {
    id: 'herb-004',
    title: 'Ginger Herb',
    slug: 'ginger-herb',
    description: 'Premium ginger root for digestive health and anti-inflammatory support.',
    price: 85.00,
    image: '/images/medicinal herbs/ginger-herb.jpg',
    category: 'herbs',
    subcategory: 'dried-herbs',
    brand: 'BioPara',
    rating: 4.8,
    reviewCount: 267,
    inStock: true,
    stockCount: 54,
    badge: 'Popular',
    tags: ['ginger', 'digestive health', 'anti-inflammatory', 'warming']
  },
  {
    id: 'herb-005',
    title: 'Hibiscus Herb',
    slug: 'hibiscus-herb',
    description: 'Premium hibiscus flowers for blood pressure support and vitamin C.',
    price: 75.00,
    image: '/images/medicinal herbs/hibiscus-herb.jpg',
    category: 'herbs',
    subcategory: 'herbal-tea',
    brand: 'BioPara',
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    stockCount: 43,
    tags: ['hibiscus', 'blood pressure', 'vitamin-c', 'antioxidant']
  },
  {
    id: 'herb-006',
    title: 'Lavender Herb',
    slug: 'lavender-herb',
    description: 'Premium lavender flowers for relaxation and aromatherapy.',
    price: 95.00,
    image: '/images/medicinal herbs/lavender-herb.jpg',
    category: 'herbs',
    subcategory: 'dried-herbs',
    brand: 'BioPara',
    rating: 4.9,
    reviewCount: 312,
    inStock: true,
    stockCount: 38,
    badge: 'Best Seller',
    tags: ['lavender', 'relaxation', 'aromatherapy', 'calming']
  },
  {
    id: 'herb-007',
    title: 'Lemon Verbena Herb',
    slug: 'lemon-verbena-herb',
    description: 'Premium lemon verbena leaves for digestive support and refreshing aroma.',
    price: 88.00,
    image: '/images/medicinal herbs/lemon-verbena-herb.jpg',
    category: 'herbs',
    subcategory: 'herbal-tea',
    brand: 'BioPara',
    rating: 4.5,
    reviewCount: 124,
    inStock: true,
    stockCount: 29,
    tags: ['lemon verbena', 'digestive support', 'refreshing', 'aromatic']
  },
  {
    id: 'herb-008',
    title: 'Mint Herb',
    slug: 'mint-herb',
    description: 'Premium mint leaves for digestive health and respiratory support.',
    price: 72.00,
    image: '/images/medicinal herbs/mint-herb.jpg',
    category: 'herbs',
    subcategory: 'dried-herbs',
    brand: 'BioPara',
    rating: 4.8,
    reviewCount: 198,
    inStock: true,
    stockCount: 67,
    tags: ['mint', 'digestive health', 'respiratory', 'refreshing']
  },
  {
    id: 'herb-009',
    title: 'Rosemary Herb',
    slug: 'rosemary-herb',
    description: 'Premium rosemary leaves for memory support and circulation.',
    price: 82.00,
    image: '/images/medicinal herbs/rosemary-herb.jpg',
    category: 'herbs',
    subcategory: 'dried-herbs',
    brand: 'BioPara',
    rating: 4.6,
    reviewCount: 156,
    inStock: true,
    stockCount: 41,
    tags: ['rosemary', 'memory', 'circulation', 'aromatic']
  },
  {
    id: 'herb-010',
    title: 'Sage Herb',
    slug: 'sage-herb',
    description: 'Premium sage leaves for cognitive support and oral health.',
    price: 78.00,
    image: '/images/medicinal herbs/sage-herb.jpg',
    category: 'herbs',
    subcategory: 'dried-herbs',
    brand: 'BioPara',
    rating: 4.7,
    reviewCount: 143,
    inStock: true,
    stockCount: 35,
    tags: ['sage', 'cognitive', 'oral health', 'aromatic']
  },
  {
    id: 'herb-011',
    title: 'Thyme Herb',
    slug: 'thyme-herb',
    description: 'Premium thyme leaves for respiratory health and immune support.',
    price: 76.00,
    image: '/images/medicinal herbs/thyme-herb.jpg',
    category: 'herbs',
    subcategory: 'dried-herbs',
    brand: 'BioPara',
    rating: 4.8,
    reviewCount: 167,
    inStock: true,
    stockCount: 52,
    tags: ['thyme', 'respiratory', 'immune support', 'aromatic']
  },
  {
    id: 'herb-012',
    title: 'Turmeric Herb',
    slug: 'turmeric-herb',
    description: 'Premium turmeric root for anti-inflammatory support and joint health.',
    price: 92.00,
    image: '/images/medicinal herbs/turmeric-herb.jpg',
    category: 'herbs',
    subcategory: 'dried-herbs',
    brand: 'BioPara',
    rating: 4.9,
    reviewCount: 289,
    inStock: true,
    stockCount: 31,
    badge: 'Best Seller',
    tags: ['turmeric', 'anti-inflammatory', 'joint health', 'antioxidant']
  },

  // Medicinal Oils
  {
    id: 'oil-001',
    title: 'زيت أرغان',
    slug: 'argan-oil',
    description: 'Pure argan oil for skin care and hair nourishment.',
    price: 289.00,
    image: '/images/medicinal oils/Argan oil.jpg',
    category: 'oils',
    subcategory: 'carrier-oils',
    brand: 'BioPara',
    rating: 4.9,
    reviewCount: 245,
    inStock: true,
    stockCount: 28,
    badge: 'Premium',
    tags: ['argan', 'skin care', 'hair', 'carrier oil']
  },
  {
    id: 'oil-002',
    title: 'زيت الحبة السوداء',
    slug: 'black-seed-oil',
    description: 'Pure black seed oil for immune support and healing.',
    price: 189.00,
    originalPrice: 229.00,
    image: '/images/medicinal oils/Black-seed oil.jpg',
    category: 'oils',
    subcategory: 'carrier-oils',
    brand: 'BioPara',
    rating: 4.9,
    reviewCount: 289,
    inStock: true,
    stockCount: 34,
    badge: 'Best Seller',
    tags: ['black seed', 'immune support', 'healing', 'carrier oil']
  },
  {
    id: 'oil-003',
    title: 'زيت السدر',
    slug: 'sidr-oil',
    description: 'Premium sidr oil for skin purification and spiritual cleansing.',
    price: 259.00,
    image: '/images/medicinal oils/Sidr oil.jpg',
    category: 'oils',
    subcategory: 'carrier-oils',
    brand: 'BioPara',
    rating: 4.8,
    reviewCount: 167,
    inStock: true,
    stockCount: 22,
    tags: ['sidr', 'skin purification', 'spiritual', 'traditional']
  },
  {
    id: 'oil-004',
    title: 'زيت الزنجبيل',
    slug: 'ginger-oil',
    description: 'Warming ginger oil for muscle relief and circulation.',
    price: 179.00,
    image: '/images/medicinal oils/Ginger oil.jpg',
    category: 'oils',
    subcategory: 'essential-oils',
    brand: 'BioPara',
    rating: 4.7,
    reviewCount: 134,
    inStock: true,
    stockCount: 31,
    tags: ['ginger', 'muscle relief', 'circulation', 'warming']
  },
  {
    id: 'oil-005',
    title: 'زيت المسك',
    slug: 'musk-oil',
    description: 'Premium musk oil for fragrance and therapeutic use.',
    price: 329.00,
    image: '/images/medicinal oils/Musk oil.jpg',
    category: 'oils',
    subcategory: 'essential-oils',
    brand: 'BioPara',
    rating: 4.9,
    reviewCount: 198,
    inStock: true,
    stockCount: 15,
    badge: 'Luxury',
    tags: ['musk', 'fragrance', 'therapeutic', 'luxury']
  },
  {
    id: 'oil-006',
    title: 'زيت اللافندر',
    slug: 'lavender-oil',
    description: 'Calming lavender oil for relaxation and stress relief.',
    price: 159.00,
    image: '/images/medicinal oils/Lanvender oil.jpg',
    category: 'oils',
    subcategory: 'essential-oils',
    brand: 'BioPara',
    rating: 4.8,
    reviewCount: 276,
    inStock: true,
    stockCount: 42,
    badge: 'Popular',
    tags: ['lavender', 'relaxation', 'stress relief', 'aromatherapy']
  },
  {
    id: 'oil-007',
    title: 'زيت الورد',
    slug: 'rose-oil',
    description: 'Luxurious rose oil for skin care and emotional balance.',
    price: 389.00,
    image: '/images/medicinal oils/Rose oil.jpg',
    category: 'oils',
    subcategory: 'essential-oils',
    brand: 'BioPara',
    rating: 4.9,
    reviewCount: 223,
    inStock: true,
    stockCount: 18,
    badge: 'Luxury',
    tags: ['rose', 'skin care', 'emotional balance', 'luxury']
  },
  {
    id: 'oil-008',
    title: 'زيت الزيتون',
    slug: 'olive-oil',
    description: 'Extra virgin olive oil for health and cooking.',
    price: 149.00,
    image: '/images/medicinal oils/Olive oil.jpg',
    category: 'oils',
    subcategory: 'carrier-oils',
    brand: 'BioPara',
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    stockCount: 56,
    tags: ['olive oil', 'health', 'cooking', 'mediterranean']
  },
  {
    id: 'oil-009',
    title: 'زيت الثوم',
    slug: 'garlic-oil',
    description: 'Potent garlic oil for immune support and cardiovascular health.',
    price: 139.00,
    image: '/images/medicinal oils/Gratic oil.jpg',
    category: 'oils',
    subcategory: 'therapeutic-blends',
    brand: 'BioPara',
    rating: 4.6,
    reviewCount: 145,
    inStock: true,
    stockCount: 29,
    tags: ['garlic', 'immune support', 'cardiovascular', 'therapeutic']
  },
  {
    id: 'oil-010',
    title: 'زيت اللوز',
    slug: 'almond-oil',
    description: 'Sweet almond oil for skin care and massage.',
    price: 169.00,
    image: '/images/medicinal oils/Almond oil.jpg',
    category: 'oils',
    subcategory: 'carrier-oils',
    brand: 'BioPara',
    rating: 4.8,
    reviewCount: 201,
    inStock: true,
    stockCount: 38,
    tags: ['almond', 'skin care', 'massage', 'carrier oil']
  },
  {
    id: 'oil-011',
    title: 'زيت حبة البركة',
    slug: 'nigella-oil',
    description: 'Pure nigella sativa oil for immune and respiratory health.',
    price: 199.00,
    image: '/images/medicinal oils/Black-seed oil.jpg',
    category: 'oils',
    subcategory: 'therapeutic-blends',
    brand: 'BioPara',
    rating: 4.8,
    reviewCount: 178,
    inStock: true,
    stockCount: 24,
    tags: ['nigella', 'immune health', 'respiratory', 'traditional']
  },
  {
    id: 'oil-012',
    title: 'زيت الخروع',
    slug: 'castor-oil',
    description: 'Pure castor oil for hair growth and skin healing.',
    price: 119.00,
    image: '/images/medicinal oils/Castor oil.jpg',
    category: 'oils',
    subcategory: 'therapeutic-blends',
    brand: 'BioPara',
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    stockCount: 33,
    tags: ['castor', 'hair growth', 'skin healing', 'therapeutic']
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
