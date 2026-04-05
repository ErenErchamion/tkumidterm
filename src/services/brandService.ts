import { brands } from '../mockData/brands';
import { withDelay } from '../utils/delay';
import type { Brand } from '../types/models';

export const getAllBrands = async (): Promise<Brand[]> => withDelay([...brands], 450);

export const getBrandById = async (brandId: number | string): Promise<Brand | null> => {
  const brand = brands.find((item) => item.id === Number(brandId)) ?? null;
  return withDelay(brand, 450);
};

