// إضافة معلمات إصدار لجميع الصور لتجنب مشاكل التخزين المؤقت
export const addVersionToImage = (imagePath, version = '2') => {
  if (!imagePath) return `/placeholder.png?v=${version}`;
  
  // إذا كان الرابط يحتوي على ? بالفعل، أضف المعامل
  if (imagePath.includes('?')) {
    return `${imagePath}&v=${version}`;
  }
  
  return `${imagePath}?v=${version}`;
};

// معالجة جميع مسارات المنتجات
export const processProductImages = (products) => {
  return products.map(product => ({
    ...product,
    image: addVersionToImage(product.image)
  }));
};
