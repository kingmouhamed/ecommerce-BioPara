import React, { Suspense } from 'react';
import Products from './Products';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Products />
    </Suspense>
  );
}
