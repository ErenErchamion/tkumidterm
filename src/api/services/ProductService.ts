import { brandsDb, categoriesDb, productsDb } from '../mockDb';
import type { Brand, Category, Product } from '../../types/models';
import { delay } from '../../utils/delay';

const clone = <T>(data: T): T => structuredClone(data);

export const ProductService = {
  async getAllProducts(): Promise<Product[]> {
    await delay();
    return clone(productsDb);
  },

  async getFeaturedProducts(limit = 4): Promise<Product[]> {
    await delay();
    return clone(productsDb.slice(0, limit));
  },

  async getProductById(productId: number): Promise<Product | null> {
    await delay();
    const product = productsDb.find((item) => item.id === productId) ?? null;
    return clone(product);
  },

  async getAllCategories(): Promise<Category[]> {
    await delay(250);
    return clone(categoriesDb);
  },

  async getAllBrands(): Promise<Brand[]> {
    await delay(250);
    return clone(brandsDb);
  },
};

