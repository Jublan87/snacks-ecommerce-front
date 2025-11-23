/**
 * Utilidades para formatear fechas
 */

/**
 * Formatea una fecha a formato legible en español
 * @param dateString - Fecha en formato ISO string
 * @param includeTime - Si incluir hora (default: false)
 * @returns Fecha formateada
 */
export function formatDate(
  dateString: string,
  includeTime: boolean = false
): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return date.toLocaleDateString('es-AR', options);
}

/**
 * Formatea una fecha a formato corto (dd/mm/yyyy)
 * @param dateString - Fecha en formato ISO string
 * @returns Fecha formateada
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
