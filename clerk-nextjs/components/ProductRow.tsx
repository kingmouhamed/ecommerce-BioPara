
import React from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard'; // The new ProductCard
import type { Product } from '../data/products';
import { Droplets, Leaf } from 'lucide-react';

interface ProductRowProps {
  title: string;
  subtitle: string;
  href: string;
  products: Product[];
  type: 'para' | 'herbal';
  totalProducts: number;
}

const ProductRow = ({ title, subtitle, href, products, type, totalProducts }: ProductRowProps) => {
  const icon = type === 'para' 
    ? <Droplets className="text-emerald-600"/> 
    : <Leaf className="text-green-600"/>;

  const linkColor = type === 'para' ? 'text-emerald-700' : 'text-green-700';

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-end mb-6">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             {icon} {title}
           </h2>
           <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <Link href={href} className={`${linkColor} font-bold text-sm hover:underline`}>
          عرض الكل ({totalProducts})
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {products.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
};

export default ProductRow;
