export interface Brand {
  id: number;
  name: string;
  logo: string;
  description: string;
  productCount: number;
  rating: number;
  category: string;
  featured?: boolean;
}

export const brands: Brand[] = [
  {
    id: 1,
    name: "La Roche-Posay",
    logo: "/images/brands/la-roche-posay-logo.png",
    description: "رعاية البشرة الحساسة",
    productCount: 45,
    rating: 4.8,
    category: "العناية بالبشرة",
    featured: true
  },
  {
    id: 2,
    name: "Vichy",
    logo: "/images/brands/vichy-logo.png",
    description: "منتجات العناية بالبشرة المعدنية",
    productCount: 38,
    rating: 4.7,
    category: "العناية بالبشرة",
    featured: true
  },
  {
    id: 3,
    name: "CeraVe",
    logo: "/images/brands/cerave-logo.png",
    description: "عناية بالبشرة بالسيراميد",
    productCount: 32,
    rating: 4.6,
    category: "العناية بالبشرة"
  },
  {
    id: 4,
    name: "Bioderma",
    logo: "/images/brands/bioderma-logo.png",
    description: "العناية بالبشرة الحساسة",
    productCount: 28,
    rating: 4.5,
    category: "العناية بالبشرة"
  },
  {
    id: 5,
    name: "Avène",
    logo: "/images/brands/avene-logo.png",
    description: "العناية بالبشرة بالحرير الحريري",
    productCount: 35,
    rating: 4.7,
    category: "العناية بالبشرة"
  },
  {
    id: 6,
    name: "Uriage",
    logo: "/images/brands/uriage-logo.png",
    description: "العناية بالبشرة بالمياه الحرارية",
    productCount: 30,
    rating: 4.6,
    category: "العناية بالبشرة"
  },
  {
    id: 7,
    name: "Nuxe",
    logo: "/images/brands/nuxe-logo.png",
    description: "منتجات تجميل طبيعية",
    productCount: 25,
    rating: 4.5,
    category: "التجميل الطبيعي"
  },
  {
    id: 8,
    name: "Mustela",
    logo: "/images/brands/mustela-logo.png",
    description: "العناية بالأطفال",
    productCount: 20,
    rating: 4.8,
    category: "العناية بالأطفال"
  },
  {
    id: 9,
    name: "Filorga",
    logo: "/images/brands/filorga-logo.png",
    description: "مستحضرات مضادة للشيخوخة",
    productCount: 18,
    rating: 4.7,
    category: "مضادات الشيخوخة"
  },
  {
    id: 10,
    name: "SVR",
    logo: "/images/brands/svr-logo.png",
    description: "العناية بالبشرة المتخصصة",
    productCount: 22,
    rating: 4.4,
    category: "العناية بالبشرة"
  },
  {
    id: 11,
    name: "Eucerin",
    logo: "/images/brands/eucerin-logo.png",
    description: "العناية بالبشرة المتقدمة",
    productCount: 40,
    rating: 4.6,
    category: "العناية بالبشرة"
  },
  {
    id: 12,
    name: "BioOriental",
    logo: "/images/brands/bio-oriental-logo.png",
    description: "منتجات طبيعية مغربية",
    productCount: 15,
    rating: 4.3,
    category: "منتجات طبيعية"
  }
];
