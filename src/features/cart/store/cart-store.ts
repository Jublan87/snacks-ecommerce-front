import { create } from 'zustand';
import { CartItem } from '@features/cart/types';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartService,
} from '@features/cart/services/cart.service';

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;

  /** Fetch the cart from the backend (call once on mount when authenticated). */
  fetchCart: () => Promise<void>;

  /**
   * Add a product to the cart by productId.
   * Uses optimistic update: appends a temporary item immediately,
   * then replaces it with the real item from the API response.
   */
  addItem: (productId: string, quantity?: number) => Promise<void>;

  /**
   * Update the quantity of an existing cart item.
   * Uses optimistic update: applies the new quantity immediately,
   * then reverts on API error.
   */
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;

  /**
   * Remove a single item from the cart.
   * Uses optimistic update: removes immediately, reverts on API error.
   */
  removeItem: (itemId: string) => Promise<void>;

  /** Clear all items from the cart. Optimistic: clears immediately. */
  clearCart: () => Promise<void>;

  /** Total number of units across all cart items (for the badge). */
  getItemCount: () => number;

  /** Find a cart item by its id. */
  getItemById: (itemId: string) => CartItem | undefined;

  /** Find a cart item by the product id. */
  getItemByProductId: (productId: string) => CartItem | undefined;

  /** Reset the cart to empty (used on logout). */
  resetCart: () => void;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await getCart();
      set({ items: cart.items, isLoading: false });
    } catch {
      // If unauthenticated (401), silently keep cart empty — the user isn't logged in.
      set({ items: [], isLoading: false });
    }
  },

  addItem: async (productId: string, quantity: number = 1) => {
    // No optimistic update here because we don't have the full product data locally;
    // the backend response includes the embedded product details.
    set({ isLoading: true, error: null });
    try {
      const newItem = await addToCart(productId, quantity);

      set((state) => {
        // The backend upserts: if the item already existed it returns the updated item.
        const exists = state.items.some((i) => i.id === newItem.id);
        if (exists) {
          return {
            items: state.items.map((i) => (i.id === newItem.id ? newItem : i)),
            isLoading: false,
          };
        }
        return { items: [...state.items, newItem], isLoading: false };
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al agregar al carrito';
      set({ isLoading: false, error: message });
      throw error; // Re-throw so callers (useAddToCart) can show toast
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      // Quantity 0 or less means remove the item
      return get().removeItem(itemId);
    }

    // Optimistic update
    const previousItems = get().items;
    set({
      items: previousItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    });

    try {
      const updatedItem = await updateCartItem(itemId, quantity);
      // Replace with the server-confirmed item
      set((state) => ({
        items: state.items.map((item) => (item.id === itemId ? updatedItem : item)),
      }));
    } catch (error) {
      // Revert on failure
      set({ items: previousItems });
      const message = error instanceof Error ? error.message : 'Error al actualizar cantidad';
      set({ error: message });
      throw error;
    }
  },

  removeItem: async (itemId: string) => {
    // Optimistic update: remove immediately from local state
    const previousItems = get().items;
    set({ items: previousItems.filter((item) => item.id !== itemId) });

    try {
      await removeCartItem(itemId);
    } catch (error) {
      // Revert on failure
      set({ items: previousItems });
      const message = error instanceof Error ? error.message : 'Error al eliminar el producto';
      set({ error: message });
      throw error;
    }
  },

  clearCart: async () => {
    // Optimistic update
    const previousItems = get().items;
    set({ items: [] });

    try {
      await clearCartService();
    } catch (error) {
      // Revert on failure
      set({ items: previousItems });
      const message = error instanceof Error ? error.message : 'Error al vaciar el carrito';
      set({ error: message });
      throw error;
    }
  },

  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getItemById: (itemId: string) => {
    return get().items.find((item) => item.id === itemId);
  },

  getItemByProductId: (productId: string) => {
    return get().items.find((item) => item.productId === productId);
  },

  resetCart: () => {
    set({ items: [], error: null, isLoading: false });
  },
}));
