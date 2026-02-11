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
    image: "/images/medical-herbs/rosemary-herb.jpg",
    category: "الأعشاب الطبية",
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
    image: "/images/medical-herbs/thyme-herb.jpg",
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
    image: "/images/medical-herbs/camomile-herb.jpg",
    category: "الأعشاب الطبية",
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
    image: "/images/medical-herbs/lavender herb.jpg",
    category: "الأعشاب الطبية",
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
    image: "/images/medical-herbs/mint herb.jpg",
    category: "الأعشاب الطبية",
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
    image: "/images/medical-herbs/Sage herb.jpg",
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
    image: "/images/medical-herbs/ginger herb.jpg",
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
    image: "/images/medical-herbs/turmeric herb.jpg",
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
    image: "/images/medical-herbs/cinnamon herb.jpg",
    category: "الأعشاب الطبية",
    type: "herbal",
    isNew: false,
    description: "أعواد القرفة الطبيعية من سيلان",
    origin: "سيلان",
    benefit: "تنظيم سكر الدم والدفء",
    inStock: true
  },
  {
    id: 1010,
    title: "اليانسون",
    price: 50,
    originalPrice: 65,
    rating: 4.8,
    image: "/images/medical-herbs/anise herb.jpg",
    category: "الأعشاب الطبية",
    badge: "جديد",
    type: "herbal",
    isNew: true,
    description: "أوراق اليانسون الطازجة",
    origin: "المغرب",
    benefit: "تحسين الجهاز الهضمي",
    inStock: true
  },
  {
    id: 1011,
    title: "الكركدية",
    price: 25,
    rating: 4.2,
    image: "/images/medical-herbs/hibiscus herb.jpg",
    category: "الأعشاب الطبية",
    type: "herbal",
    isNew: false,
    description: "أوراق الكركدية الطبية الطازجة",
    origin: "المغرب",
    benefit: "ضغط الدم",
    inStock: true
  },
  {
    id: 1012,
    title: "اللويزة",
    price: 30,
    rating: 4.1,
    image: "/images/medical-herbs/Lemon verbena herb.jpg",
    category: "الأعشاب الطبية",
    type: "herbal",
    isNew: false,
    description: "أوراق اللويزة طازجة",
    origin: "الأطلس الصغير",
    benefit: "مهدئة للأعصاب و النوم",
    inStock: true
  }
];

export const herbalImages: HerbalImage[] = [
  {
    id: 1,
    productId: 1001,
    productName: "إكليل الجبل",
    imageUrl: "/images/medical-herbs/rosemary-herb.jpg",
    alt: "إكليل الجبل الطازج",
    category: "الأعشاب الطبية",
    origin: "المغرب",
    benefit: "تحسين الذاكرة وتقوية الشعر"
  },
  {
    id: 2,
    productId: 1002,
    productName: "الزعتر",
    imageUrl: "/images/medical-herbs/thyme-herb.jpg",
    alt: "الزعتر المغربي الجبلي",
    category: "الأعشاب الطبية",
    origin: "الأطلس الكبير",
    benefit: "علاج مشاكل الجهاز التنفسي"
  },
  {
    id: 3,
    productId: 1003,
    productName: "البابونج",
    imageUrl: "/images/medical-herbs/camomile-herb.jpg",
    alt: "أزهار البابونج الطبيعية",
    category: "الأعشاب الطبية",
    origin: "المغرب",
    benefit: "الاسترخاء والنوم الجيد"
  },
  {
    id: 4,
    productId: 1004,
    productName: "الخزامى",
    imageUrl: "/images/medical-herbs/lavender herb.jpg",
    alt: "أزهار الخزامى البنفسجية",
    category: "الأعشاب الطبية",
    origin: "المغرب",
    benefit: "الهدوء وتخفيف التوتر"
  },
  {
    id: 5,
    productId: 1005,
    productName: "النعناع",
    imageUrl: "/images/medical-herbs/mint herb.jpg",
    alt: "أوراق النعناع الطازجة",
    category: "الأعشاب الهضمية",
    origin: "المغرب",
    benefit: "تحسين الهضم وتنقية النفس"
  },
  {
    id: 6,
    productId: 1006,
    productName: "الميرمية",
    imageUrl: "/images/medical-herbs/Sage herb.jpg",
    alt: "أوراق الميرمية الخضراء",
    category: "الأعشاب الطبية",
    origin: "المغرب",
    benefit: "تنظيم الهرمونات وتقوية الذاكرة"
  },
  {
    id: 7,
    productId: 1007,
    productName: "الزنجبيل",
    imageUrl: "/images/medical-herbs/ginger herb.jpg",
    alt: "جذور الزنجبيل الطازجة",
    category: "الأعشاب الطبية",
    origin: "استوائي",
    benefit: "تقوية المناعة وحرق الدهون"
  },
  {
    id: 8,
    productId: 1008,
    productName: "الكركم",
    imageUrl: "/images/medical-herbs/turmeric herb.jpg",
    alt: "مسحوق الكركم الذهبي",
    category: "الأعشاب الطبية",
    origin: "الهند",
    benefit: "مضاد للالتهابات ومقوي للمناعة"
  },
  {
    id: 9,
    productId: 1009,
    productName: "القرفة",
    imageUrl: "/images/medical-herbs/cinnamon herb.jpg",
    alt: "أعواد القرفة الطبيعية",
    category: "الأعشاب الطبية",
    origin: "سيلان",
    benefit: "تنظيم سكر الدم والدفء"
  },
  {
    id: 10,
    productId: 1010,
    productName: "اليانسون",
    imageUrl: "/images/medical-herbs/anise herb.jpg",
    alt: "حبوب اليانسون الخضراء",
    category: "الأعشاب الطبية",
    origin: "الهند",
    benefit:"تحسين الجهاز الهضمي"
  },
  {
    id: 11,
    productId: 1011,
    productName: "الكركدية",
    imageUrl: "/images/medical-herbs/hibiscus herb.jpg",
    alt: "أوراق الكركدية الطبية الطازجة",
    category: "الأعشاب الطبية",
    origin: "المغرب",
    benefit: "ضغط الدم"
  },
  {
    id: 12,
    productId: 1012,
    productName: "اللويزة",
    imageUrl: "/images/medical-herbs/Lemon verbena herb.jpg",
    alt: "أوراق اللويزة الطادزجة",
    category: "الأعشاب الطبية",
    origin: "الأطلس الصغير",
    benefit:"مهدئة للأعصاب و النوم",
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
