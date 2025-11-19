'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para proteger rutas en el lado del cliente
 * Redirige a login si el usuario no está autenticado
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Dar un momento para que el estado se sincronice después del login
    const checkAuth = async () => {
      // Esperar un momento para que el estado de Zustand se sincronice
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      // Verificar también la cookie como respaldo
      const cookies = document.cookie.split(';');
      const hasAuthCookie = cookies.some((cookie) =>
        cookie.trim().startsWith('auth-token=')
      );
      
      // Si no está autenticado ni tiene cookie, redirigir a login
      if (!isAuthenticated && !hasAuthCookie) {
        const currentPath = window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, router]);

  // Mostrar loading mientras verifica autenticación
  if (isChecking || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5454] mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
