import { useEffect, useMemo, useState } from 'react';
import { useCartStore } from '@features/cart/store/cart-store';
import { calculateShipping } from '@features/shipping/services/shipping.service';
import type { ShippingCalculationResult } from '@features/shipping/services/shipping.service';
import type { CartItem } from '@features/cart/types';

// Stable selector defined outside the component to avoid re-renders
const selectItems = (state: { items: CartItem[] }) => state.items;

// Default while the async shipping calculation is in-flight
const DEFAULT_SHIPPING: ShippingCalculationResult = {
  shipping: 0,
  freeShippingThreshold: Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || 10000),
  isFreeShipping: false,
  amountNeededForFreeShipping: Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || 10000),
};

/**
 * Hook to compute cart totals including real-time shipping cost.
 *
 * `calculateShipping` is now async (calls the backend), so the hook uses
 * a `useState` + `useEffect` pattern instead of `useMemo` for the shipping
 * calculation. The initial render uses default values and updates once the
 * API responds.
 *
 * Returns: { subtotal, shippingCalculation, shipping, total }
 */
export function useCartCalculations() {
  const items = useCartStore(selectItems);

  const subtotal = useMemo(() => {
    if (!items || items.length === 0) return 0;
    return items.reduce(
      (acc, item) =>
        acc + (item.product.discountPrice || item.product.salePrice) * item.quantity,
      0
    );
  }, [items]);

  const [shippingCalculation, setShippingCalculation] =
    useState<ShippingCalculationResult>(DEFAULT_SHIPPING);

  useEffect(() => {
    let cancelled = false;

    calculateShipping({ subtotal })
      .then((result) => {
        if (!cancelled) setShippingCalculation(result);
      })
      .catch(() => {
        // Keep previous value on transient errors
      });

    return () => {
      cancelled = true;
    };
  }, [subtotal]);

  const total = subtotal + shippingCalculation.shipping;

  return {
    subtotal,
    shippingCalculation,
    shipping: shippingCalculation.shipping,
    total,
  };
}
