// بيانات منتجات الأعشاب الطبية
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
  type: 'herbal';
  isNew?: boolean;
  description?: string;
  origin?: string;
  benefit?: string;
  inStock?: boolean;
  brand?: string; // للتوافق
  reviews?: number[]; // للتوافق
}

export interface HerbalImage {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  alt: string;
  category: string;
  origin: string;
  benefit: string;
}

export const herbalProducts: Product[] = [
  {
    id: 1001,
    title: "إكليل الجبل",
    price: 25,
    originalPrice: 35,
    rating: 4.6,
    image: "/images/herbal/rosemary.jpg",
    category: "الأعشاب العطرية",
    badge: "الأكثر مبيعاً",
    type: "herbal",
    isNew: false,
    description: "إكليل الجبل الطازج من جبال المغرب، غني بالمواد المضادة للأكسدة",
    origin: "المغرب",
    benefit: "تحسين الذاكرة وتقوية الشعر",
    inStock: true
  },
  {
    id: 1002,
    title: "الزعتر",
    price: 20,
    rating: 4.5,
    image: "/images/herbal/thyme.jpg",
    category: "الأعشاب الطبية",
    type: "herbal",
    isNew: false,
    description: "الزعتر المغربي الجبلي العضوي",
    origin: "الأطلس الكبير",
    benefit: "علاج مشاكل الجهاز التنفسي",
    inStock: true
  },
  {
    id: 1003,
    title: "البابونج",
    price: 30,
    originalPrice: 40,
    rating: 4.7,
    image: "/images/herbal/chamomile.jpg",
    category: "الأعشاب المهدئة",
    badge: "جديد",
    type: "herbal",
    isNew: true,
    description: "أزهار البابونج الطبيعية 100%",
    origin: "المغرب",
    benefit: "الاسترخاء والنوم الجيد",
    inStock: true
  },
  {
    id: 1004,
    title: "الخزامى",
    price: 35,
    rating: 4.8,
    image: "/images/herbal/lavender.jpg",
    category: "الأعشاب العطرية",
    badge: "الأكثر مبيعاً",
    type: "herbal",
    isNew: false,
    description: "أزهار الخزامى البنفسجية من حقول المغرب",
    origin: "المغرب",
    benefit: "الهدوء وتخفيف التوتر",
    inStock: true
  },
  {
    id: 1005,
    title: "النعناع",
    price: 15,
    rating: 4.4,
    image: "/images/herbal/mint.jpg",
    category: "الأعشاب الهضمية",
    type: "herbal",
    isNew: false,
    description: "أوراق النعناع الطازجة العضوية",
    origin: "المغرب",
    benefit: "تحسين الهضم وتنقية النفس",
    inStock: true
  },
  {
    id: 1006,
    title: "الميرمية",
    price: 28,
    rating: 4.3,
    image: "/images/herbal/sage.jpg",
    category: "الأعشاب الطبية",
    type: "herbal",
    isNew: false,
    description: "أوراق الميرمية الخضراء من المناطق الجبلية",
    origin: "المغرب",
    benefit: "تنظيم الهرمونات وتقوية الذاكرة",
    inStock: true
  },
  {
    id: 1007,
    title: "الزنجبيل",
    price: 40,
    originalPrice: 50,
    rating: 4.6,
    image: "/images/herbal/ginger.jpg",
    category: "الأعشاب الطبية",
    badge: "جديد",
    type: "herbal",
    isNew: true,
    description: "جذور الزنجبيل الطازجة المستوردة",
    origin: "استوائي",
    benefit: "تقوية المناعة وحرق الدهون",
    inStock: true
  },
  {
    id: 1008,
    title: "الكركم",
    price: 45,
    originalPrice: 55,
    rating: 4.7,
    image: "/images/herbal/turmeric.jpg",
    category: "الأعشاب الطبية",
    badge: "الأكثر مبيعاً",
    type: "herbal",
    isNew: false,
    description: "مسحوق الكركم الذهبي النقي من الهند",
    origin: "الهند",
    benefit: "مضاد للالتهابات ومقوي للمناعة",
    inStock: true
  },
  {
    id: 1009,
    title: "القرفة",
    price: 35,
    rating: 4.5,
    image: "/images/herbal/cinnamon.jpg",
    category: "الأعشاب العطرية",
    type: "herbal",
    isNew: false,
    description: "أعواد القرفة الطبيعية من سيلان",
    origin: "سيلان",
    benefit: "تنظيم سكر الدم والدفء",
    inStock: true
  },
  {
    id: 1010,
    title: "الهيل",
    price: 50,
    originalPrice: 65,
    rating: 4.8,
    image: "/images/herbal/cardamom.jpg",
    category: "الأعشاب العطرية",
    badge: "جديد",
    type: "herbal",
    isNew: true,
    description: "حبوب الهيل الخضراء من الهند",
    origin: "الهند",
    benefit: "تحسين النكهة والهضم",
    inStock: true
  },
  {
    id: 1011,
    title: "الإذخر",
    price: 25,
    rating: 4.2,
    image: "/images/herbal/lemongrass.jpg",
    category: "الأعشاب العطرية",
    type: "herbal",
    isNew: false,
    description: "سيقان الإذخر العطرية الطازجة",
    origin: "المغرب",
    benefit: "طارد للحشرات ومطهر",
    inStock: true
  },
  {
    id: 1012,
    title: "الحرمل",
    price: 30,
    rating: 4.1,
    image: "/images/herbal/germander.jpg",
    category: "الأعشاب الطبية",
    type: "herbal",
    isNew: false,
    description: "نبات الحرمل الجبلي النادر",
    origin: "الأطلس الصغير",
    benefit: "علاج مشاكل المعدة",
    inStock: true
  }
];

export const herbalImages: HerbalImage[] = [
  {
    id: 1,
    productId: 12,
    productName: "إكليل الجبل",
    imageUrl: "/images/herbal/rosemary.jpg",
    alt: "إكليل الجبل الطازج",
    category: "الأعشاب العطرية",
    origin: "المغرب",
    benefit: "تحسين الذاكرة وتقوية الشعر"
  },
  {
    id: 2,
    productId: 13,
    productName: "الزعتر",
    imageUrl: "/images/herbal/thyme.jpg",
    alt: "الزعتر المغربي الجبلي",
    category: "الأعشاب الطبية",
    origin: "الأطلس الكبير",
    benefit: "علاج مشاكل الجهاز التنفسي"
  },
  {
    id: 3,
    productId: 14,
    productName: "البابونج",
    imageUrl: "/images/herbal/chamomile.jpg",
    alt: "أزهار البابونج الطبيعية",
    category: "الأعشاب المهدئة",
    origin: "المغرب",
    benefit: "الاسترخاء والنوم الجيد"
  },
  {
    id: 4,
    productId: 15,
    productName: "الخزامى",
    imageUrl: "/images/herbal/lavender.jpg",
    alt: "أزهار الخزامى البنفسجية",
    category: "الأعشاب العطرية",
    origin: "المغرب",
    benefit: "الهدوء وتخفيف التوتر"
  },
  {
    id: 5,
    productId: 16,
    productName: "النعناع",
    imageUrl: "/images/herbal/mint.jpg",
    alt: "أوراق النعناع الطازجة",
    category: "الأعشاب الهضمية",
    origin: "المغرب",
    benefit: "تحسين الهضم وتنقية النفس"
  },
  {
    id: 6,
    productId: 17,
    productName: "الميرمية",
    imageUrl: "/images/herbal/sage.jpg",
    alt: "أوراق الميرمية الخضراء",
    category: "الأعشاب الطبية",
    origin: "المغرب",
    benefit: "تنظيم الهرمونات وتقوية الذاكرة"
  },
  {
    id: 7,
    productId: 18,
    productName: "الزنجبيل",
    imageUrl: "/images/herbal/ginger.jpg",
    alt: "جذور الزنجبيل الطازجة",
    category: "الأعشاب الطبية",
    origin: "استوائي",
    benefit: "تقوية المناعة وحرق الدهون"
  },
  {
    id: 8,
    productId: 19,
    productName: "الكركم",
    imageUrl: "/images/herbal/turmeric.jpg",
    alt: "مسحوق الكركم الذهبي",
    category: "الأعشاب الطبية",
    origin: "الهند",
    benefit: "مضاد للالتهابات ومقوي للمناعة"
  },
  {
    id: 9,
    productId: 20,
    productName: "القرفة",
    imageUrl: "/images/herbal/cinnamon.jpg",
    alt: "أعواد القرفة الطبيعية",
    category: "الأعشاب العطرية",
    origin: "سيلان",
    benefit: "تنظيم سكر الدم والدفء"
  },
  {
    id: 10,
    productId: 21,
    productName: "الهيل",
    imageUrl: "/images/herbal/cardamom.jpg",
    alt: "حبوب الهيل الخضراء",
    category: "الأعشاب العطرية",
    origin: "الهند",
    benefit: "تحسين النكهة والهضم"
  },
  {
    id: 11,
    productId: 22,
    productName: "الإذخر",
    imageUrl: "/images/herbal/lemongrass.jpg",
    alt: "سيقان الإذخر العطرية",
    category: "الأعشاب العطرية",
    origin: "المغرب",
    benefit: "طارد للحشرات ومطهر"
  },
  {
    id: 12,
    productId: 23,
    productName: "الحرمل",
    imageUrl: "/images/herbal/germander.jpg",
    alt: "نبات الحرمل الجبلي",
    category: "الأعشاب الطبية",
    origin: "الأطلس الصغير",
    benefit: "علاج مشاكل المعدة"
  }
];

// دالة للحصول على صورة العشب
export const getHerbalImage = (productId: number): HerbalImage | undefined => {
  return herbalImages.find(img => img.productId === productId);
};

// دالة للحصول على جميع صور فئة معينة
export const getHerbalImagesByCategory = (category: string): HerbalImage[] => {
  return herbalImages.filter(img => img.category === category);
};

// دالة للحصول على صور من منطقة معينة
export const getHerbalImagesByOrigin = (origin: string): HerbalImage[] => {
  return herbalImages.filter(img => img.origin === origin);
};

// دالة للحصول على أعشاب حسب الفائدة
export const getHerbalImagesByBenefit = (benefit: string): HerbalImage[] => {
  return herbalImages.filter(img => img.benefit.includes(benefit));
};
