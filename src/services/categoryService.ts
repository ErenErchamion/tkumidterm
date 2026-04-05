import { categories } from '../mockData/categories';
import { withDelay } from '../utils/delay';
import type { Category } from '../types/models';

export const getAllCategories = async (): Promise<Category[]> => withDelay([...categories], 450);

