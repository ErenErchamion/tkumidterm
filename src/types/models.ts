export type Category = {
  id: number;
  name: string;
  description: string;
};

export type Brand = {
  id: number;
  name: string;
  logoUrl: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  categoryId: number;
  brandId: number;
  stockCount: number;
  imageUrl: string;
  summary: string;
  is_promoted: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderItem = {
  productId: number;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  createdAt: string;
  totalAmount: number;
  items: OrderItem[];
};

export type CreateOrderPayload = {
  items: OrderItem[];
  totalAmount: number;
};

