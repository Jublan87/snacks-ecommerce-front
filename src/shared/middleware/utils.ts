/**
 * Utilidades para middlewares
 */

import type { NextRequest } from 'next/server';

/**
 * Verifica si una ruta coincide con alguna de las rutas proporcionadas
 */
export function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

/**
 * Obtiene el token de autenticación de las cookies (HttpOnly JWT del backend)
 */
export function getAuthToken(request: NextRequest): string | undefined {
  return request.cookies.get('access_token')?.value;
}

/**
 * Crea una URL de redirección con parámetros de query
 */
export function createRedirectUrl(
  baseUrl: string,
  request: NextRequest,
  params?: Record<string, string>,
): URL {
  const url = new URL(baseUrl, request.url);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return url;
}
