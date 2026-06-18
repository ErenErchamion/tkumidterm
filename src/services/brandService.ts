import { api } from '../utils/api';
import type { Brand } from '../types/models';

export const getAllBrands = async (): Promise<Brand[]> => {
  return api.get<Brand[]>('/brands');
};

export const getBrandById = async (brandId: number | string): Promise<Brand | null> => {
  return api.get<Brand | null>(`/brands/${brandId}`);
};
