// SEO optimization utilities
import React from 'react';
import { Metadata } from 'next';

// Generate structured data for SEO
export const generateStructuredData = (type: string, data: any) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  };

  return JSON.stringify(structuredData);
};

// Generate product structured data
export const generateProductStructuredData = (product: {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  brand?: string;
  category: string;
  inStock: boolean;
}) => {
  return generateStructuredData('Product', {
    name: product.title,
    description: product.description,
    image: product.image,
    brand: product.brand || 'BioPara',
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'MAD',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'BioPara',
        url: 'https://biopara.com'
      }
    }
  });
};

// Generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{
  name: string;
  url: string;
}>) => {
  return generateStructuredData('BreadcrumbList', {
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url
    }))
  });
};

// Generate organization structured data
export const generateOrganizationStructuredData = () => {
  return generateStructuredData('Organization', {
    name: 'BioPara',
    url: 'https://biopara.com',
    logo: 'https://biopara.com/images/logo.png',
    description: 'متجر إلكتروني متخصص في المنتجات الطبيعية والعلاجية',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+212-XXX-XXXXXX',
      contactType: 'customer service',
      availableLanguage: ['Arabic', 'English']
    },
    sameAs: [
      'https://facebook.com/biopara',
      'https://instagram.com/biopara',
      'https://twitter.com/biopara'
    ]
  });
};

// Generate website structured data
export const generateWebsiteStructuredData = () => {
  return generateStructuredData('WebSite', {
    name: 'BioPara',
    url: 'https://biopara.com',
    description: 'متجر إلكتروني متخصص في المنتجات الطبيعية والعلاجية',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://biopara.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  });
};

// Generate meta tags for pages
export const generateMetaTags = (metadata: {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  structuredData?: string;
}): Metadata => {
  const {
    title,
    description,
    keywords,
    image = '/images/og-default.jpg',
    url = 'https://biopara.com',
    type = 'website',
    structuredData
  } = metadata;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: 'BioPara',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      locale: 'ar_AR',
      type: type as 'website' | 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      site: '@biopara'
    },
    alternates: {
      canonical: url,
      languages: {
        'ar-SA': url,
        'en-US': url
      }
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
    },
    other: {
      'article:author': 'BioPara',
      'article:section': 'Health',
      'article:tag': keywords || '',
      'og:locale': 'ar_AR',
      'og:site_name': 'BioPara',
      'twitter:creator': '@biopara',
      'twitter:site': '@biopara'
    },
    ...(structuredData && {
      script: [
        {
          type: 'application/ld+json',
          children: structuredData
        }
      ]
    })
  };
};

// Generate sitemap data
export const generateSitemapData = (pages: Array<{
  url: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}>) => {
  return pages.map(page => ({
    url: page.url,
    lastModified: page.lastModified || new Date().toISOString(),
    changeFrequency: page.changeFrequency || 'weekly',
    priority: page.priority || 0.5
  }));
};

// Generate robots.txt content
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /
Allow: /products
Allow: /category
Allow: /about
Allow: /contact
Allow: /cart
Allow: /checkout
Allow: /auth
Allow: /faq
Allow: /help
Allow: /privacy
Allow: /terms

Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/
Disallow: /node_modules/

Sitemap: https://biopara.com/sitemap.xml
Sitemap: https://biopara.com/sitemap-image.xml
Sitemap: https://biopara.com/sitemap-video.xml`;
};

// Generate image sitemap data
export const generateImageSitemapData = (images: Array<{
  url: string;
  title: string;
  caption?: string;
  lastModified?: string;
}>) => {
  return images.map(image => ({
    url: image.url,
    title: image.title,
    caption: image.caption || image.title,
    lastModified: image.lastModified || new Date().toISOString()
  }));
};

// Performance monitoring for SEO
export const trackPageView = (url: string, title: string) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID);
    (window as any).gtag('event', 'page_view', {
      page_title: title,
      page_location: url
    });
  }
};

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', eventName, parameters);
  }
};

// Schema.org types
export interface ProductSchema {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description: string;
  image: string;
  brand: string;
  category: string;
  offers: {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
    availability: string;
    seller: {
      '@type': 'Organization';
      name: string;
      url: string;
    };
  };
}

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint: {
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
    availableLanguage: string[];
  };
  sameAs: string[];
}

export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

// SEO validation utilities
export const validateSEO = (metadata: {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
}) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation
  if (!metadata.title) {
    errors.push('Title is required');
  } else if (metadata.title.length < 10) {
    warnings.push('Title is too short (minimum 10 characters recommended)');
  } else if (metadata.title.length > 60) {
    warnings.push('Title is too long (maximum 60 characters recommended)');
  }

  // Description validation
  if (!metadata.description) {
    errors.push('Description is required');
  } else if (metadata.description.length < 50) {
    warnings.push('Description is too short (minimum 50 characters recommended)');
  } else if (metadata.description.length > 160) {
    warnings.push('Description is too long (maximum 160 characters recommended)');
  }

  // Keywords validation
  if (metadata.keywords && metadata.keywords.length > 10) {
    warnings.push('Too many keywords (maximum 10 recommended)');
  }

  // Image validation
  if (metadata.image && !metadata.image.match(/\.(jpg|jpeg|png|webp)$/i)) {
    warnings.push('Image should be in JPG, PNG, or WebP format');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
