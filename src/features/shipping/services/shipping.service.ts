/**
 * Servicio de cálculo de envío.
 *
 * Llama al endpoint POST /shipping/calculate del backend, con fallback
 * a cálculo local si la petición falla (p. ej. offline o error 5xx).
 *
 * El backend es public (no requiere auth), por eso se usa fetch directo
 * con NEXT_PUBLIC_API_URL en lugar del apiClient con cookies.
 */

export interface ShippingCalculationParams {
  subtotal: number;
  postalCode?: string;
  address?: string;
  city?: string;
  province?: string;
}

export interface ShippingCalculationResult {
  shipping: number;
  freeShippingThreshold: number;
  isFreeShipping: boolean;
  amountNeededForFreeShipping: number;
}

// ─────────────────────────────────────────────────────────────
// Fallback: cálculo local usando variables de entorno
// ─────────────────────────────────────────────────────────────

function getShippingConfig() {
  const freeShippingThreshold = Number(
    process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || 10000
  );
  const shippingCost = Number(
    process.env.NEXT_PUBLIC_SHIPPING_COST || 1500
  );
  return { freeShippingThreshold, shippingCost };
}

function calculateShippingLocally(params: ShippingCalculationParams): ShippingCalculationResult {
  const { freeShippingThreshold, shippingCost } = getShippingConfig();
  const { subtotal } = params;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  return {
    shipping: isFreeShipping ? 0 : shippingCost,
    freeShippingThreshold,
    isFreeShipping,
    amountNeededForFreeShipping: Math.max(0, freeShippingThreshold - subtotal),
  };
}

// ─────────────────────────────────────────────────────────────
// Main: async API call with local fallback
// ─────────────────────────────────────────────────────────────

/**
 * Calcula el costo de envío consultando el backend.
 * Si la llamada falla, recurre al cálculo local para no romper el flujo.
 */
export async function calculateShipping(
  params: ShippingCalculationParams
): Promise<ShippingCalculationResult> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    // En SSR sin URL configurada, usar cálculo local
    return calculateShippingLocally(params);
  }

  try {
    const response = await fetch(`${baseUrl}/shipping/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        (error as { message?: string }).message ||
          'Error al calcular el envío desde el servidor.'
      );
    }

    return (await response.json()) as ShippingCalculationResult;
  } catch (error) {
    // Fallback silencioso: el usuario no se ve bloqueado
    console.warn(
      '[shipping] Error al calcular envío desde API, usando cálculo local:',
      error
    );
    return calculateShippingLocally(params);
  }
}

// ─────────────────────────────────────────────────────────────
// Helpers de compatibilidad
// ─────────────────────────────────────────────────────────────

/** Devuelve solo el costo de envío. Útil como helper puntual. */
export async function getShippingCost(subtotal: number): Promise<number> {
  const result = await calculateShipping({ subtotal });
  return result.shipping;
}

/** Verifica si aplica envío gratis para el subtotal dado. */
export async function isFreeShippingEligible(subtotal: number): Promise<boolean> {
  const result = await calculateShipping({ subtotal });
  return result.isFreeShipping;
}
