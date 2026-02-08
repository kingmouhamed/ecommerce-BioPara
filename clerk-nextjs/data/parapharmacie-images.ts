// بيانات منتجات parapharmacie
export interface Product {
  id: number;
  title: string;
  name?: string; // للتوافق
  price: number;
  originalPrice?: number;
  oldPrice?: number; // للتوافق
  rating: number;
  image: string;
  category: string;
  badge?: string;
  type: 'para';
  isNew?: boolean;
  description?: string;
  brand?: string;
  inStock?: boolean;
  reviews?: number[]; // للتوافق
}

export interface ParapharmacieImage {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  alt: string;
  category: string;
  brand: string;
}

export const parapharmacieProducts: Product[] = [
  {
    id: 1,
    title: "زيت الأرغان النقي",
    price: 120,
    originalPrice: 150,
    rating: 4.5,
    image: "/images/parapharmacie/argan-oil-new.jpg",
    category: "العناية بالبشرة",
    badge: "الأكثر مبيعاً",
    type: "para",
    isNew: false,
    description: "زيت الأرغان النقي 100% من المغرب، غني بفيتامين E والأحماض الدهنية الأساسية",
    brand: "BioOriental",
    inStock: true
  },
  {
    id: 2,
    title: "كريم فيتامين C",
    price: 85,
    originalPrice: 110,
    rating: 4.7,
    image: "/images/parapharmacie/vitamin-c-cream-new.jpg",
    category: "العناية بالوجه",
    badge: "جديد",
    type: "para",
    isNew: true,
    description: "كريم فيتامين C المركز لتفتيح البشرة ومكافحة التجاعيد",
    brand: "La Roche-Posay",
    inStock: true
  },
  {
    id: 3,
    title: "واقي الشمس SPF50",
    price: 65,
    originalPrice: 80,
    rating: 4.6,
    image: "/images/parapharmacie/sunscreen-spf50-new.jpg",
    category: "الحماية من الشمس",
    type: "para",
    isNew: false,
    description: "واقي شمس عالي الحماية SPF50، مقاوم للماء",
    brand: "Vichy",
    inStock: true
  },
  {
    id: 4,
    title: "غسول لاروش بوزيه",
    price: 75,
    rating: 4.4,
    image: "/images/parapharmacie/la-roche-posay-cleanser-new.jpg",
    category: "النظافة",
    type: "para",
    isNew: false,
    description: "غسول لطيف للبشرة الحساسة، يزيل الشوائب دون تهيج",
    brand: "La Roche-Posay",
    inStock: true
  },
  {
    id: 5,
    title: "سيروم الهيالورونيك أسيد",
    price: 95,
    originalPrice: 120,
    rating: 4.8,
    image: "/images/parapharmacie/hyaluronic-serum-new.jpg",
    category: "العناية بالوجه",
    badge: "الأكثر مبيعاً",
    type: "para",
    isNew: false,
    description: "سيروم هيالورونيك أسيد لترطيب عميق ومكافحة التجاعيد",
    brand: "CeraVe",
    inStock: true
  },
  {
    id: 6,
    title: "كريم مرطب للبشرة الجافة",
    price: 55,
    rating: 4.3,
    image: "/images/parapharmacie/moisturizing-cream-new.jpg",
    category: "العناية بالبشرة",
    type: "para",
    isNew: false,
    description: "كريم مرطب غني للبشرة الجافة والحساسة",
    brand: "Avène",
    inStock: true
  },
  {
    id: 7,
    title: "مقشر للوجه",
    price: 45,
    rating: 4.2,
    image: "/images/parapharmacie/facial-exfoliator-new.jpg",
    category: "العناية بالوجه",
    type: "para",
    isNew: true,
    description: "مقشر لطيف للوجه ينظف البشرة بعمق",
    brand: "Bioderma",
    inStock: true
  },
  {
    id: 8,
    title: "قناع الوجه الطيني",
    price: 35,
    rating: 4.1,
    image: "/images/parapharmacie/clay-mask-new.jpg",
    category: "العناية بالوجه",
    type: "para",
    isNew: false,
    description: "قناع طيني لتنقية المسام وتنظيف البشرة",
    brand: "Nuxe",
    inStock: true
  },
  {
    id: 9,
    title: "زيت الجوجوبا",
    price: 40,
    rating: 4.4,
    image: "/images/parapharmacie/jojoba-oil.jpg",
    category: "الزيوت",
    type: "para",
    isNew: false,
    description: "زيت الجوجوبا الطبيعي للبشرة والشعر",
    brand: "Uriage",
    inStock: true
  },
  {
    id: 10,
    title: "غسول الأطفال",
    price: 50,
    rating: 4.6,
    image: "/images/parapharmacie/baby-wash.jpg",
    category: "العناية بالطفل",
    type: "para",
    isNew: false,
    description: "غسول لطيف ومناسب لبشرة الأطفال الحساسة",
    brand: "Mustela",
    inStock: true
  },
  {
    id: 11,
    title: "كريم العين",
    price: 110,
    originalPrice: 140,
    rating: 4.7,
    image: "/images/parapharmacie/eye-cream.jpg",
    category: "العناية بالوجه",
    badge: "جديد",
    type: "para",
    isNew: true,
    description: "كريم العين لمكافحة التجاعيد والهالات السوداء",
    brand: "Filorga",
    inStock: true
  }
];

export const parapharmacieImages: ParapharmacieImage[] = [
  {
    id: 1,
    productId: 1,
    productName: "زيت الأرغان النقي",
    imageUrl: "/images/parapharmacie/argan-oil-new.jpg",
    alt: "زيت الأرغان النقي للمغرب",
    category: "العناية بالبشرة",
    brand: "BioOriental"
  },
  {
    id: 2,
    productId: 2,
    productName: "كريم فيتامين C",
    imageUrl: "/images/parapharmacie/vitamin-c-cream-new.jpg",
    alt: "كريم فيتامين C للوجه",
    category: "العناية بالوجه",
    brand: "La Roche-Posay"
  },
  {
    id: 3,
    productId: 3,
    productName: "واقي الشمس SPF50",
    imageUrl: "/images/parapharmacie/sunscreen-spf50-new.jpg",
    alt: "واقي الشمس عالي الحماية",
    category: "الحماية من الشمس",
    brand: "Vichy"
  },
  {
    id: 4,
    productId: 4,
    productName: "غسول لاروش بوزيه",
    imageUrl: "/images/parapharmacie/la-roche-posay-cleanser-new.jpg",
    alt: "غسول لاروش بوزيه للبشرة الحساسة",
    category: "النظافة",
    brand: "La Roche-Posay"
  },
  {
    id: 5,
    productId: 5,
    productName: "سيروم الهيالورونيك أسيد",
    imageUrl: "/images/parapharmacie/hyaluronic-serum-new.jpg",
    alt: "سيروم الهيالورونيك أسيد",
    category: "العناية بالوجه",
    brand: "CeraVe"
  },
  {
    id: 6,
    productId: 6,
    productName: "كريم مرطب للبشرة الجافة",
    imageUrl: "/images/parapharmacie/moisturizing-cream-new.jpg",
    alt: "كريم مرطب للبشرة الجافة",
    category: "العناية بالبشرة",
    brand: "Avène"
  },
  {
    id: 7,
    productId: 7,
    productName: "مقشر للوجه",
    imageUrl: "/images/parapharmacie/facial-exfoliator-new.jpg",
    alt: "مقشر للوجه بلطف",
    category: "العناية بالوجه",
    brand: "Bioderma"
  },
  {
    id: 8,
    productId: 8,
    productName: "قناع الوجه الطيني",
    imageUrl: "/images/parapharmacie/clay-mask-new.jpg",
    alt: "قناع الوجه الطيني للتنقية",
    category: "العناية بالوجه",
    brand: "Nuxe"
  },
  {
    id: 9,
    productId: 9,
    productName: "زيت الجوجوبا",
    imageUrl: "/images/parapharmacie/jojoba-oil.jpg",
    alt: "زيت الجوجوبا للبشرة والشعر",
    category: "الزيوت",
    brand: "Uriage"
  },
  {
    id: 10,
    productId: 10,
    productName: "غسول الأطفال",
    imageUrl: "/images/parapharmacie/baby-wash.jpg",
    alt: "غسول لطيف للأطفال",
    category: "العناية بالطفل",
    brand: "Mustela"
  },
  {
    id: 11,
    productId: 11,
    productName: "كريم العين",
    imageUrl: "/images/parapharmacie/eye-cream.jpg",
    alt: "كريم العين لمكافحة التجاعيد",
    category: "العناية بالوجه",
    brand: "Filorga"
  }
];

// دالة للحصول على صورة المنتج
export const getParapharmacieImage = (productId: number): ParapharmacieImage | undefined => {
  return parapharmacieImages.find(img => img.productId === productId);
};

// دالة للحصول على جميع صور فئة معينة
export const getParapharmacieImagesByCategory = (category: string): ParapharmacieImage[] => {
  return parapharmacieImages.filter(img => img.category === category);
};

// دالة للحصول على صور ماركة معينة
export const getParapharmacieImagesByBrand = (brand: string): ParapharmacieImage[] => {
  return parapharmacieImages.filter(img => img.brand === brand);
};
