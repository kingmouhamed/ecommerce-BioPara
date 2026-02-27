import React from 'react';
import { Product } from '@/types';

interface ProductSchemaProps {
    product: Product;
}

export function ProductSchema({ product }: ProductSchemaProps) {
    const schemaData = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: [
            product.image,
            ...(product.images || [])
        ],
        brand: {
            '@type': 'Brand',
            name: product.brand || 'BioPara'
        },
        offers: {
            '@type': 'Offer',
            url: `https://bioparaa.com/products/${product.id}`,
            priceCurrency: 'SAR',
            price: product.price,
            itemCondition: 'https://schema.org/NewCondition',
            availability: product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating || 5,
            reviewCount: product.reviewCount || 10,
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
    );
}
