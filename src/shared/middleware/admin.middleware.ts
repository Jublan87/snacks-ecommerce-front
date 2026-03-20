import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { matchesRoute, getAuthToken } from './utils';

export function adminMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = getAuthToken(request);

  const adminRoutes = ['/admin'];
  const isAdminRoute = matchesRoute(pathname, adminRoutes);

  if (isAdminRoute && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return null;
}
