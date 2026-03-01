import React from 'react';
import { Product } from '@/lib/data/products';

interface ProductSchemaProps {
    product: Product;
}

export function ProductSchema({ product }: ProductSchemaProps) {
    const schemaData = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name_ar || product.name,
        description: product.description_ar || product.description,
        image: product.images || [],
        brand: {
            '@type': 'Brand',
            name: 'BioPara'
        },
        offers: {
            '@type': 'Offer',
            url: `https://bioparaa.com/products/${product.slug || product.id}`,
            priceCurrency: 'SAR',
            price: product.price,
            itemCondition: 'https://schema.org/NewCondition',
            availability: product.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: 5,
            reviewCount: 10,
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
    );
}
