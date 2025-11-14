import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '@/types/cart';
import { Product } from '@/types/product';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getItemById: (itemId: string) => CartItem | undefined;
  getItemByProductId: (productId: string) => CartItem | undefined;
}

const generateItemId = (productId: string): string => {
  return `${productId}-${Date.now()}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number = 1) => {
        if (product.stock < quantity) {
          throw new Error(
            `Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`
          );
        }

        if (!product.isActive) {
          throw new Error('Este producto no está disponible.');
        }

        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          // Si el item ya existe, actualizar la cantidad
          const newQuantity = existingItem.quantity + quantity;

          // Validar stock total
          if (product.stock < newQuantity) {
            throw new Error(
              `Stock insuficiente. Solo puedes agregar ${
                product.stock - existingItem.quantity
              } unidades más.`
            );
          }

          // Incrementa la cantidad del item existente manteniendo los demás sin cambios
          set({
            items: currentItems.map((item) =>
              item.id === existingItem.id
                ? {
                    ...item,
                    quantity: newQuantity,
                  }
                : item
            ),
          });
        } else {
          // Si no existe, agregar nuevo item
          const newItem: CartItem = {
            id: generateItemId(product.id),
            product,
            quantity,
            addedAt: new Date().toISOString(),
          };

          set({
            items: [...currentItems, newItem],
          });
        }
      },

      removeItem: (itemId: string) => {
        set({
          items: get().items.filter((item) => item.id !== itemId),
        });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          // Si la cantidad es 0 o menor, eliminar el item
          get().removeItem(itemId);
          return;
        }

        const currentItems = get().items;
        const item = currentItems.find((item) => item.id === itemId);

        if (!item) {
          throw new Error('Item no encontrado en el carrito.');
        }

        // Validar stock disponible
        if (item.product.stock < quantity) {
          throw new Error(
            `Stock insuficiente. Solo hay ${item.product.stock} unidades disponibles.`
          );
        }

        set({
          items: currentItems.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                }
              : item
          ),
        });
      },

      clearCart: () => {
        set({
          items: [],
        });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getItemById: (itemId: string) => {
        return get().items.find((item) => item.id === itemId);
      },

      getItemByProductId: (productId: string) => {
        return get().items.find((item) => item.product.id === productId);
      },
    }),
    {
      name: 'cart-storage', // Nombre de la clave en localStorage
      storage: createJSONStorage(() => localStorage),
      // Solo persistir los items, no las funciones
      partialize: (state) => ({ items: state.items }),
    }
  )
);
