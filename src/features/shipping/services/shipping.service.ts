/**
 * Servicio de cálculo de envío
 *
 * Por ahora usa valores fijos desde variables de entorno.
 * En el futuro, se conectará a un endpoint del backend que calculará
 * el envío basado en la ubicación del usuario.
 */

export interface ShippingCalculationParams {
  subtotal: number;
  // Parámetros opcionales para cuando se conecte al backend
  // Estos campos se usarán para calcular envío basado en ubicación
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

/**
 * Obtiene la configuración de envío desde variables de entorno
 * con valores por defecto si no están definidas
 */
function getShippingConfig() {
  // Valores por defecto
  const defaultFreeShippingThreshold = 10000;
  const defaultShippingCost = 1500;

  // Leer desde variables de entorno (prefijo NEXT_PUBLIC_ para acceso en cliente)
  const freeShippingThreshold = Number(
    process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD ||
      defaultFreeShippingThreshold
  );

  const shippingCost = Number(
    process.env.NEXT_PUBLIC_SHIPPING_COST || defaultShippingCost
  );

  return {
    freeShippingThreshold,
    shippingCost,
  };
}

/**
 * Calcula el costo de envío basado en el subtotal y código postal
 *
 * Por ahora usa lógica simple:
 * - Envío gratis si el subtotal supera el umbral
 * - Si no, usa el costo base de envío
 * - El código postal se puede usar para ajustar el costo (por ahora no lo hace)
 *
 * MIGRACIÓN AL BACKEND:
 * Cuando el backend esté listo, descomentar la función async de abajo y
 * comentar esta función síncrona. La interfaz se mantiene igual, solo cambia
 * la implementación interna.
 */
export function calculateShipping(
  params: ShippingCalculationParams
): ShippingCalculationResult {
  const { freeShippingThreshold, shippingCost } = getShippingConfig();
  const { subtotal, postalCode } = params;

  // Por ahora, el código postal no afecta el cálculo
  // En el futuro, se puede usar para calcular costos por zona
  // Ejemplo: zonas remotas pueden tener costo adicional

  const isFreeShipping = subtotal >= freeShippingThreshold;
  let shipping = isFreeShipping ? 0 : shippingCost;

  // TODO: Cuando el backend esté listo, usar postalCode para calcular costo por zona
  // Por ahora, mantener lógica simple
  if (postalCode && !isFreeShipping) {
    // Ejemplo de lógica futura: zonas remotas (códigos que empiezan con ciertos números)
    // podrían tener costo adicional
    // const isRemoteZone = postalCode.startsWith('9');
    // if (isRemoteZone) {
    //   shipping = shippingCost * 1.5;
    // }
  }

  const amountNeededForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );

  return {
    shipping,
    freeShippingThreshold,
    isFreeShipping,
    amountNeededForFreeShipping,
  };
}

/**
 * VERSIÓN ASYNC PARA CUANDO EL BACKEND ESTÉ LISTO
 *
 * Descomentar esta función y comentar la función síncrona de arriba
 * cuando el endpoint del backend esté disponible.
 *
 * Ejemplo de uso del endpoint:
 * POST /api/shipping/calculate
 * Body: {
 *   subtotal: number,
 *   postalCode?: string,
 *   address?: string,
 *   city?: string,
 *   province?: string
 * }
 *
 * Response: {
 *   shipping: number,
 *   freeShippingThreshold: number,
 *   isFreeShipping: boolean,
 *   amountNeededForFreeShipping: number
 * }
 */
/*
export async function calculateShipping(
  params: ShippingCalculationParams
): Promise<ShippingCalculationResult> {
  try {
    const response = await fetch('/api/shipping/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || 'Error al calcular el envío. Intenta nuevamente.'
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Fallback a cálculo local si falla la API
    console.error('Error al calcular envío desde API, usando cálculo local:', error);
    const { freeShippingThreshold, shippingCost } = getShippingConfig();
    const { subtotal } = params;

    const isFreeShipping = subtotal >= freeShippingThreshold;
    const shipping = isFreeShipping ? 0 : shippingCost;
    const amountNeededForFreeShipping = Math.max(
      0,
      freeShippingThreshold - subtotal
    );

    return {
      shipping,
      freeShippingThreshold,
      isFreeShipping,
      amountNeededForFreeShipping,
    };
  }
}
*/

/**
 * Hook/compatibilidad: Función helper para obtener solo el costo de envío
 * Útil para migración gradual
 */
export function getShippingCost(subtotal: number): number {
  return calculateShipping({ subtotal }).shipping;
}

/**
 * Hook/compatibilidad: Función helper para verificar si aplica envío gratis
 */
export function isFreeShippingEligible(subtotal: number): boolean {
  return calculateShipping({ subtotal }).isFreeShipping;
}
