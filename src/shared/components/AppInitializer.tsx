'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@features/auth/store/auth-store';
import { useCartStore } from '@features/cart/store/cart-store';

/**
 * AppInitializer runs once on the client after mount.
 * It checks authentication status and — if authenticated — fetches the cart.
 * This keeps the cart count in the Header in sync with the backend from the first render.
 *
 * Rendered in the root layout (app/layout.tsx) so it runs on every page.
 */
export default function AppInitializer() {
  const initialize = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const resetCart = useCartStore((state) => state.resetCart);

  // Initialize auth state from the JWT cookie on first render
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Fetch (or clear) the cart whenever the auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      resetCart();
    }
  }, [isAuthenticated, fetchCart, resetCart]);

  return null; // This component renders nothing — it's a side-effect only
}
