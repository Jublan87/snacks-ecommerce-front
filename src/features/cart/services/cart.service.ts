import { apiClient } from '@shared/api';
import type { Cart, CartItem } from '@features/cart/types';

// All cart endpoints require JWT authentication (HttpOnly cookie forwarded automatically).

/** Fetch the authenticated user's cart. */
export async function getCart(): Promise<Cart> {
  return apiClient.get<Cart>('/cart');
}

/** Add a product to the cart. Returns the created/updated CartItem. */
export async function addToCart(productId: string, quantity: number = 1): Promise<CartItem> {
  return apiClient.post<CartItem>('/cart/items', { productId, quantity });
}

/** Update the quantity of a specific cart item. */
export async function updateCartItem(itemId: string, quantity: number): Promise<CartItem> {
  return apiClient.put<CartItem>(`/cart/items/${itemId}`, { quantity });
}

/** Remove a single item from the cart. */
export async function removeCartItem(itemId: string): Promise<void> {
  return apiClient.delete<void>(`/cart/items/${itemId}`);
}

/** Clear the entire cart. */
export async function clearCart(): Promise<void> {
  return apiClient.delete<void>('/cart');
}
