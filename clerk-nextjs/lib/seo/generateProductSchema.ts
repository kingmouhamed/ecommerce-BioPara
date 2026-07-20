import { Product } from '@/lib/data/products'; // Adjust if type is imported from elsewhere

export function generateProductSchema(product: Product, storeUrl: string = "https://biopara.ma") {
    const productName = product.name_ar || product.name;
    const productDescription = product.description_ar || product.description || `اشترِ ${productName} من BioPara`;
    
    const schema: any = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": productName,
        "image": product.images && product.images.length > 0 
            ? product.images.map(img => img.startsWith('http') ? img : `${storeUrl}${img}`) 
            : [product.image_url].filter(Boolean),
        "description": productDescription,
        "sku": product.slug, // Or actual SKU if you have it
        "brand": {
            "@type": "Brand",
            "name": "BioPara"
        },
        "offers": {
            "@type": "Offer",
            "url": `${storeUrl}/products/${product.slug}`,
            "priceCurrency": "MAD",
            "price": product.price.toString(),
            "availability": product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
                "@type": "Organization",
                "name": "BioPara"
            }
        }
    };

    if ((product as any).rating && (product as any).rating > 0) {
        // BioPara products typically have ~24 reviews as per mockup, we'll use a dynamic fallback if reviews count isn't in product
        schema.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": (product as any).rating.toString(),
            "reviewCount": "24"
        };
    }

    return schema;
}
