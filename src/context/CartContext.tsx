import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orderService';
import { useAuth } from './AuthContext';
import type { CartItem, Order, Product } from '../types/models';

type OrderNotice = {
  message: string;
  orderNumber: string;
};

type CartContextValue = {
  cartItems: CartItem[];
  items: CartItem[];
  orders: Order[];
  isCheckoutLoading: boolean;
  totalItems: number;
  totalAmount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  setItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<Order | null>;
  orderNotice: OrderNotice | null;
  closeOrderNotice: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [orderNotice, setOrderNotice] = useState<OrderNotice | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setCartItems((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
      );
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const totalAmount = useMemo(
    () => cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [cartItems],
  );

  const checkout = useCallback(async (): Promise<Order | null> => {
    if (!cartItems.length) {
      return null;
    }

    if (!user) {
      alert("Sipariş oluşturmak için lütfen öncelikle giriş yapın.");
      navigate('/login');
      return null;
    }

    setIsCheckoutLoading(true);

    try {
      const payload = {
        totalAmount,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          unitPrice: item.product.price,
          quantity: item.quantity,
          lineTotal: item.product.price * item.quantity,
        })),
      };

      const createdOrder = await createOrder(payload);
      setOrders((prev) => [createdOrder, ...prev]);
      setCartItems([]);
      setOrderNotice({
        message: `Siparis olusturuldu - Siparis No: ${createdOrder.id}`,
        orderNumber: createdOrder.id,
      });
      return createdOrder;
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Sipariş oluşturulurken bir hata oluştu.');
      return null;
    } finally {
      setIsCheckoutLoading(false);
    }
  }, [cartItems, totalAmount, user, navigate]);

  const closeOrderNotice = useCallback(() => {
    setOrderNotice(null);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cartItems,
      items: cartItems,
      orders,
      isCheckoutLoading,
      totalItems,
      totalAmount,
      addToCart,
      removeFromCart,
      updateQuantity,
      setItemQuantity: updateQuantity,
      clearCart,
      checkout,
      orderNotice,
      closeOrderNotice,
    }),
    [
      cartItems,
      orders,
      isCheckoutLoading,
      totalItems,
      totalAmount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      checkout,
      orderNotice,
      closeOrderNotice,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider.');
  }

  return context;
};

