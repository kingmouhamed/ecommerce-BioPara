import { Product } from '@/lib/data/products'; // Adjust if type is imported from elsewhere

export function generateProductSchema(product: Product, storeUrl: string = "https://biopara.com") {
    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images ? product.images.map(img => `${storeUrl}${img}`) : [], // Ensure full URIs for images
        "description": product.description || `Buy ${product.name} online at BioPara.`,
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
}
