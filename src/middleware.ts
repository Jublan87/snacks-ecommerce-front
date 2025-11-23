import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware } from '@/shared/middleware/auth.middleware';

/**
 * Middleware principal de Next.js
 * Combina todos los middlewares de la aplicación
 */
export function middleware(request: NextRequest) {
  // Ejecutar middleware de autenticación
  const authResponse = authMiddleware(request);
  if (authResponse) {
    return authResponse;
  }

  // Aquí se pueden agregar más middlewares en el futuro
  // Ejemplo:
  // const adminResponse = adminMiddleware(request);
  // if (adminResponse) {
  //   return adminResponse;
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Excluir: API routes, archivos estáticos de Next.js, imágenes, favicon, robots.txt y sitemap.xml
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
