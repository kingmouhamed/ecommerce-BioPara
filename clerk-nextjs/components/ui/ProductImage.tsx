import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
    src: string;
    alt: string;
    // Passing sizes is CRITICAL for optimization. This tells the browser 
    // exactly what image size to download based on the screen width.
    sizes?: string;
    priority?: boolean; // Set to true ONLY for the first 1-2 images visible above the fold (LCP)
    className?: string;
}

export default function ProductImage({
    src,
    alt,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    priority = false,
    className = ""
}: ProductImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    // Fallback if the database has a null image
    const imageSrc = src || '/images/products/product-placeholder.jpg';

    return (
        <div className={`relative w-full aspect-square bg-gray-50 overflow-hidden ${className}`}>
            {/* 
        The actual Next.js Image Component.
        Using 'fill' requires a parent div with 'relative' and defined dimensions (aspect-square).
        The 'blur' placeholder provides a smooth, perceived performance boost while loading.
      */}
            <Image
                src={imageSrc}
                alt={alt}
                fill
                sizes={sizes}
                priority={priority}
                quality={80} // Defaults to 75, bumped slightly for premium product feels
                className={`
          object-cover transition-all duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-xl grayscale' : 'scale-100 blur-0 grayscale-0'}
          group-hover:scale-105
        `}
                onLoad={() => setIsLoading(false)}
                // Provide a tiny base64 blur image for instant loading feedback
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO88OjRf4QA+AMw/h0HBAAAAABJRU5ErkJggg=="
            />
        </div>
    );
}
