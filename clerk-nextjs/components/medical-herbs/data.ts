import type { Product } from '../../data';

export type MedicalHerbsNavCategory = {
  id: string;
  label: string;
};

export type MedicalHerbsQuickCategory = {
  id: string;
  label: string;
  image: string;
};

export type MedicalHerbsBrand = {
  id: string;
  name: string;
  logo: string;
};

export const medicalHerbsNavCategories: MedicalHerbsNavCategory[] = [
  { id: 'digestive', label: 'الهضم' },
  { id: 'immunity', label: 'المناعة' },
  { id: 'sleep', label: 'النوم' },
  { id: 'respiratory', label: 'التنفس' },
  { id: 'beauty', label: 'الجمال' },
  { id: 'detox', label: 'تنقية' }
];

export const medicalHerbsQuickCategories: MedicalHerbsQuickCategory[] = [
  { id: 'digestive', label: 'الهضم', image: '/images/categories/herbs.jpg' },
  { id: 'immunity', label: 'المناعة', image: '/images/categories/herbs.jpg' },
  { id: 'sleep', label: 'النوم', image: '/images/categories/herbs.jpg' },
  { id: 'respiratory', label: 'التنفس', image: '/images/categories/herbs.jpg' },
  { id: 'beauty', label: 'الجمال', image: '/images/categories/herbs.jpg' },
  { id: 'detox', label: 'تنقية', image: '/images/categories/herbs.jpg' }
];

export const medicalHerbsBrands: MedicalHerbsBrand[] = [
  { id: 'atlas', name: 'Atlas Herbs', logo: '/images/brands/additional/dabur-logo.png' },
  { id: 'sahara', name: 'Sahara Botanics', logo: '/images/brands/additional/himalaya-logo.png' },
  { id: 'rif', name: 'Rif Naturals', logo: '/images/brands/additional/himani-logo.png' },
  { id: 'bio', name: 'BioHerb', logo: '/images/brands/additional/patanjali-logo.png' },
  { id: 'organic', name: 'Organic Garden', logo: '/images/brands/additional/zandu-logo.png' },
  { id: 'tea', name: 'Herbal Tea', logo: '/images/brands/additional/shahnaz-hussain-logo.png' }
];

export const getHerbsPromoProducts = (products: Product[]): Product[] => {
  return products
    .filter((p) => p.category === 'medical-herbs')
    .filter((p) => Boolean(p.originalPrice) || Boolean(p.badge) || Boolean(p.isNew))
    .slice(0, 8);
};
