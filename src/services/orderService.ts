import { withDelay } from '../utils/delay';
import type { CreateOrderPayload } from '../types/models';

type CheckoutOrder = {
  id: string;
  orderNumber: number;
  date: string;
  totalAmount: number;
  items: CreateOrderPayload['items'];
};

let orders: CheckoutOrder[] = [];

const generateOrderNumber = () => Math.floor(100000 + Math.random() * 900000);

export const createOrder = async (payload: CreateOrderPayload): Promise<CheckoutOrder> => {
  const order: CheckoutOrder = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    orderNumber: generateOrderNumber(),
    date: new Date().toISOString(),
    totalAmount: payload.totalAmount,
    items: payload.items,
  };

  orders = [order, ...orders];
  return withDelay(order, 800);
};

export const getOrders = async (): Promise<CheckoutOrder[]> => withDelay([...orders], 500);

