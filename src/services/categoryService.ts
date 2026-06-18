import { api } from '../utils/api';
import type { Category } from '../types/models';

export const getAllCategories = async (): Promise<Category[]> => {
  return api.get<Category[]>('/categories');
};
