import { api } from '../utils/api';
import type { CreateOrderPayload, Order } from '../types/models';

export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  return api.post<Order>('/orders', payload);
};

export const getOrders = async (): Promise<Order[]> => {
  return api.get<Order[]>('/orders');
};
