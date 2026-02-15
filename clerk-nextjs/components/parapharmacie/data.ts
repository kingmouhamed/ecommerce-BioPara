import type { Product } from '../../data';

export type ParapharmacieNavCategory = {
  id: string;
  label: string;
};

export type ParapharmacieQuickCategory = {
  id: string;
  label: string;
  image: string;
};

export type ParapharmacieBrand = {
  id: string;
  name: string;
  logo: string;
};

export const parapharmacieNavCategories: ParapharmacieNavCategory[] = [
  { id: 'face', label: 'الوجه' },
  { id: 'makeup', label: 'المكياج' },
  { id: 'body', label: 'الجسم' },
  { id: 'hair', label: 'الشعر' },
  { id: 'kids', label: 'الأطفال' },
  { id: 'men', label: 'الرجال' }
];

export const parapharmacieQuickCategories: ParapharmacieQuickCategory[] = [
  {
    id: 'face',
    label: 'الوجه',
    image: '/images/categories/skincare.jpg'
  },
  {
    id: 'body',
    label: 'الجسم',
    image: '/images/categories/parapharmacie.jpg'
  },
  {
    id: 'hair',
    label: 'الشعر',
    image: '/images/categories/parapharmacie.jpg'
  },
  {
    id: 'kids',
    label: 'الأطفال',
    image: '/images/categories/parapharmacie.jpg'
  },
  {
    id: 'men',
    label: 'الرجال',
    image: '/images/categories/parapharmacie.jpg'
  },
  {
    id: 'makeup',
    label: 'المكياج',
    image: '/images/categories/parapharmacie.jpg'
  }
];

export const parapharmacieBrands: ParapharmacieBrand[] = [
  { id: 'vichy', name: 'Vichy', logo: '/images/brands/vichy-logo.png' },
  { id: 'la-roche-posay', name: 'La Roche-Posay', logo: '/images/brands/la-roche-posay-logo.png' },
  { id: 'cerave', name: 'CeraVe', logo: '/images/brands/cerave-logo.png' },
  { id: 'bioderma', name: 'Bioderma', logo: '/images/brands/bioderma-logo.png' },
  { id: 'avene', name: 'Avène', logo: '/images/brands/avene-logo.png' },
  { id: 'uriage', name: 'Uriage', logo: '/images/brands/uriage-logo.png' }
];

export const getPromoProducts = (products: Product[]): Product[] => {
  return products
    .filter((p) => p.category === 'parapharmacie')
    .filter((p) => Boolean(p.originalPrice) || Boolean(p.badge) || Boolean(p.isNew))
    .slice(0, 8);
};
