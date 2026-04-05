'use server';

/**
 * Order mutations — Server Actions.
 *
 * Server Actions run on the server, so they can use serverPost (which reads
 * the JWT cookie). They are invoked from Client Components via regular
 * async function calls — Next.js handles the boundary automatically.
 */

import { revalidatePath } from 'next/cache';
import { serverPost } from '@shared/api/server';
import { ApiError } from '@shared/api';
import type { Order, CreateOrderPayload } from '@features/order/types';

/**
 * Creates a new order on the backend.
 *
 * @returns The created Order on success.
 * @throws ApiError on validation / auth / stock errors (caller handles toast).
 */
export async function createOrderAction(data: CreateOrderPayload): Promise<Order> {
  const order = await serverPost<Order>('/orders', data);

  // Invalidate the order list so the history page shows the new order immediately
  revalidatePath('/perfil/pedidos');

  return order;
}

/**
 * Result wrapper for client-side use where you don't want to catch errors
 * at the call site but need a discriminated union instead.
 */
export type CreateOrderResult =
  | { success: true; order: Order }
  | { success: false; message: string };

export async function createOrderSafe(data: CreateOrderPayload): Promise<CreateOrderResult> {
  try {
    const order = await createOrderAction(data);
    return { success: true, order };
  } catch (err: unknown) {
    const message =
      err instanceof ApiError
        ? err.message
        : 'Error al procesar el pedido. Intenta nuevamente.';
    return { success: false, message };
  }
}
