import { ordersDb } from '../mockDb';
import type { CreateOrderPayload, Order } from '../../types/models';
import { delay } from '../../utils/delay';

const clone = <T>(data: T): T => structuredClone(data);

const generateOrderNumber = (): string => {
  let orderNumber = '';

  do {
    orderNumber = String(Math.floor(100000 + Math.random() * 900000));
  } while (ordersDb.some((order) => order.id === orderNumber));

  return orderNumber;
};

export const OrderService = {
  async getOrders(): Promise<Order[]> {
    await delay(300);
    return clone(ordersDb);
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    await delay(700);

    const order: Order = {
      id: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      totalAmount: payload.totalAmount,
      items: payload.items,
    };

    ordersDb.unshift(order);
    return clone(order);
  },
};

