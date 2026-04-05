import { brands } from '../mockData/brands';
import { categories } from '../mockData/categories';
import { products } from '../mockData/products';
import type { Brand, Category, Order, Product } from '../types/models';

export const categoriesDb: Category[] = [...categories];
export const brandsDb: Brand[] = [...brands];
export const productsDb: Product[] = [...products];
export const ordersDb: Order[] = [];

