import { Product } from '../models/product.model';

export function formatPrice(price: number | string): string {
  const n = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(n)) return '0,00';
  return n.toFixed(2).replace('.', ',');
}

export function getProductImage(product: Product): string {
  const defaultImage = '/assets/img/images.jpg';
  
  if (!product) return defaultImage;

  const imagePath = product.images?.[0] || product.image;
  
  if (!imagePath) return defaultImage;

  if (imagePath.startsWith('/assets') || imagePath.startsWith('http')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('assets/')) {
    return '/' + imagePath;
  }
  
  if (imagePath.includes('/assets/img/')) {
    return imagePath.startsWith('/') ? imagePath : '/' + imagePath;
  }
  
  return `/assets/img/${imagePath}`;
}
