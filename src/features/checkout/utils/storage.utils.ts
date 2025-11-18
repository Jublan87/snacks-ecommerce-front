/**
 * Utilidades para guardar y recuperar datos del checkout desde localStorage
 */

import type { ShippingAddress } from '../types';

const STORAGE_KEY = 'checkout-shipping-address';

/**
 * Guarda la dirección de envío en localStorage
 */
export function saveShippingAddress(address: ShippingAddress): void {
  // Verificar que estamos en el cliente (localStorage solo disponible en el navegador)
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(address));
  } catch (error) {
    console.error('Error al guardar dirección en localStorage:', error);
  }
}

/**
 * Recupera la dirección de envío guardada desde localStorage
 */
export function getSavedShippingAddress(): ShippingAddress | null {
  // Verificar que estamos en el cliente (localStorage solo disponible en el navegador)
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved) as ShippingAddress;
  } catch (error) {
    console.error('Error al recuperar dirección de localStorage:', error);
    return null;
  }
}

/**
 * Elimina la dirección de envío guardada
 */
export function clearSavedShippingAddress(): void {
  // Verificar que estamos en el cliente (localStorage solo disponible en el navegador)
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error al eliminar dirección de localStorage:', error);
  }
}
