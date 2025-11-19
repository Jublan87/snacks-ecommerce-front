import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Order, OrderItem, OrderStatus } from '@/features/order/types';
import { CartItem } from '@/features/cart/types';
import { ShippingAddress, PaymentMethod } from '@/features/checkout/types';

interface OrderStore {
  orders: Order[];
  createOrder: (
    cartItems: CartItem[],
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    subtotal: number,
    shipping: number,
    total: number,
    userId: string
  ) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByOrderNumber: (orderNumber: string) => Order | undefined;
  getOrdersByUserId: (userId: string) => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

// Función para generar ID único de pedido
const generateOrderId = (): string => {
  return `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Función para generar número de orden legible
// Formato: ORD-YYYY-MMDD-HHMMSS-XXX
const generateOrderNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();

  return `ORD-${year}-${month}${day}-${hours}${minutes}${seconds}-${random}`;
};

// Convertir CartItem a OrderItem
const cartItemToOrderItem = (cartItem: CartItem): OrderItem => {
  // Usar el precio con descuento si existe, sino el precio normal
  const price = cartItem.product.discountPrice || cartItem.product.price;
  const subtotal = price * cartItem.quantity;

  return {
    id: `order-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    product: cartItem.product,
    quantity: cartItem.quantity,
    price,
    subtotal,
  };
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (
        cartItems: CartItem[],
        shippingAddress: ShippingAddress,
        paymentMethod: PaymentMethod,
        subtotal: number,
        shipping: number,
        total: number,
        userId: string
      ) => {
        const orderId = generateOrderId();
        const orderNumber = generateOrderNumber();
        const now = new Date().toISOString();

        // Convertir cart items a order items
        const orderItems: OrderItem[] = cartItems.map(cartItemToOrderItem);

        const newOrder: Order = {
          id: orderId,
          orderNumber,
          userId,
          items: orderItems,
          shippingAddress,
          paymentMethod,
          subtotal,
          shipping,
          total,
          status: 'pending',
          createdAt: now,
          updatedAt: now,
        };

        // Agregar el pedido a la lista
        set({
          orders: [...get().orders, newOrder],
        });

        return newOrder;
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((order) => order.id === orderId);
      },

      getOrderByOrderNumber: (orderNumber: string) => {
        return get().orders.find((order) => order.orderNumber === orderNumber);
      },

      getOrdersByUserId: (userId: string) => {
        return get()
          .orders.filter((order) => order.userId === userId)
          .sort((a, b) => {
            // Ordenar por fecha más reciente primero
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
      },

      updateOrderStatus: (orderId: string, status: OrderStatus) => {
        const currentOrders = get().orders;
        const order = currentOrders.find((o) => o.id === orderId);

        if (!order) {
          throw new Error('Pedido no encontrado');
        }

        set({
          orders: currentOrders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        });
      },
    }),
    {
      name: 'order-storage', // Nombre de la clave en localStorage
      storage: createJSONStorage(() => localStorage),
      // Solo persistir los orders, no las funciones
      partialize: (state) => ({ orders: state.orders }),
    }
  )
);

