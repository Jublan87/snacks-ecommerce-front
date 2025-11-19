import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { matchesRoute, getAuthToken, createRedirectUrl } from './utils';

/**
 * Middleware de autenticación
 * Protege rutas que requieren autenticación y redirige rutas de auth si ya está autenticado
 */
export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = getAuthToken(request);

  // Rutas que requieren autenticación
  const protectedRoutes = ['/checkout', '/perfil'];
  const isProtectedRoute = matchesRoute(pathname, protectedRoutes);

  // Rutas públicas de autenticación (login, registro)
  const authRoutes = ['/login', '/registro'];
  const isAuthRoute = matchesRoute(pathname, authRoutes);

  // Si intenta acceder a una ruta protegida sin autenticación
  if (isProtectedRoute && !authToken) {
    const loginUrl = createRedirectUrl('/login', request, {
      redirect: pathname,
    });
    return NextResponse.redirect(loginUrl);
  }

  // Permitir siempre el acceso a login/registro, incluso si está autenticado
  // El componente del lado del cliente puede manejar la lógica de redirección si es necesario
  // Esto permite que los usuarios puedan hacer logout/login o cambiar de cuenta

  return null; // Continuar con el siguiente middleware
}
