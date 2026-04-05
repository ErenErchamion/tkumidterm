import { products } from '../mockData/products';
import { withDelay } from '../utils/delay';
import type { Product } from '../types/models';

type ProductQuery = {
  categoryId?: number | string | null;
  brandId?: number | string | null;
};

export const getAllProducts = async (params: ProductQuery = {}): Promise<Product[]> => {
  const { categoryId, brandId } = params;
  let filtered = [...products];

  if (categoryId) {
    filtered = filtered.filter((item) => item.categoryId === Number(categoryId));
  }

  if (brandId) {
    filtered = filtered.filter((item) => item.brandId === Number(brandId));
  }

  return withDelay(filtered, 600);
};

export const getProductById = async (productId: number | string): Promise<Product | null> => {
  const product = products.find((item) => item.id === Number(productId)) ?? null;
  return withDelay(product, 500);
};

