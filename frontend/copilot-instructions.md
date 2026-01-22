# Copilot Instructions for React Ecommerce Project

## Architecture Overview

This is a single-page React ecommerce application built with Vite, featuring Moroccan herbal and parapharmacy products. All business logic and state reside in `src/App.jsx`, with a component-based structure under `src/components/`. No backend integration exists; products are hardcoded.

## Key Components & Patterns

- **State Management**: Centralized in `App.jsx` with `useState` hooks. Props are drilled down to child components (e.g., `cart`, `isCartOpen`, `deliveryInfo`).
- **Product Display**: `ProductList` renders `ProductCard` components in a CSS Grid. Sorting logic uses `useMemo` in `App.jsx` for performance.
- **Cart Functionality**: Managed via `addToCart`, `removeFromCart`, and `calculateTotal` functions. Checkout simulates order submission with alerts.
- **Styling**: CSS variables in `src/index.css` define a green theme (`--primary: #1b4332`). RTL direction for Arabic text. Inline styles mixed with classes.
- **Icons**: Uses `lucide-react` for consistent iconography (e.g., `ShoppingCart`, `ChevronDown`).

## Developer Workflows

- **Development**: `npm run dev` starts Vite dev server with HMR.
- **Build**: `npm run build` creates production bundle.
- **Linting**: `npm run lint` runs ESLint with React-specific rules.
- **Preview**: `npm run preview` serves built app locally.

## Conventions & Patterns

- **Product Data Structure**: Objects with `id`, `name`, `category`, `price`, `image`, `reviews`, `rating`. Prices include " DH" suffix; parse with `parseFloat(item.price.replace(' DH', ''))`.
- **Categories**: "الاعشاب الطبية" (herbs) and "Parapharmacie" (cosmetics/health).
- **Sorting Options**: 'default', 'rating_desc', 'price_asc', 'price_desc' via select dropdown.
- **Load More**: Increments `visibleProducts` by 10 to show additional items.
- **Arabic UI**: All user-facing text in Arabic; ensure RTL compatibility.

## Integration Points

- No external APIs or databases; all data static.
- Lucide React icons imported individually for tree-shaking.
- ESLint config in `eslint.config.js` with React hooks and refresh plugins.

Reference `src/App.jsx` for state flow, `src/components/ProductList.jsx` for grid rendering, and `src/index.css` for theming.
