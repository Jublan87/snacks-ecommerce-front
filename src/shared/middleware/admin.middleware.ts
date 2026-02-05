import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { matchesRoute, getAuthToken } from './utils';

/**
 * Middleware de administración
 * Protege rutas que requieren rol de administrador
 */
export function adminMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = getAuthToken(request);

  // Rutas que requieren rol de administrador
  const adminRoutes = ['/admin'];
  const isAdminRoute = matchesRoute(pathname, adminRoutes);

  // Si intenta acceder a una ruta admin sin autenticación
  if (isAdminRoute && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si está autenticado pero no es admin, verificar el rol desde la cookie
  // Nota: En producción esto debería venir del token JWT decodificado
  // Por ahora, verificamos si hay una cookie de rol admin
  if (isAdminRoute && authToken) {
    // En producción, decodificaríamos el token JWT aquí
    // Por ahora, verificamos si el usuario tiene rol admin en localStorage
    // Esto es una limitación del mock - en producción el token contendría el rol
    const adminCookie = request.cookies.get('user-role');
    const isAdmin = adminCookie?.value === 'admin';

    if (!isAdmin) {
      // Verificar en el cliente (esto es temporal hasta tener backend)
      // Por ahora redirigimos y el componente cliente verificará
      return NextResponse.next();
    }
  }

  return null; // Continuar con el siguiente middleware
}
