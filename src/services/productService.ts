import { api } from '../utils/api';
import type { Product } from '../types/models';

type ProductQuery = {
  categoryId?: number | string | null;
  brandId?: number | string | null;
};

export const getAllProducts = async (params: ProductQuery = {}): Promise<Product[]> => {
  const queryParams = new URLSearchParams();
  if (params.categoryId) {
    queryParams.append('categoryId', String(params.categoryId));
  }
  if (params.brandId) {
    queryParams.append('brandId', String(params.brandId));
  }
  const queryString = queryParams.toString();
  const path = queryString ? `/products?${queryString}` : '/products';
  return api.get<Product[]>(path);
};

export const getProductById = async (productId: number | string): Promise<Product | null> => {
  return api.get<Product | null>(`/products/${productId}`);
};
