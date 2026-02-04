'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@features/auth/store/auth-store';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para proteger rutas de administración
 * Verifica que el usuario esté autenticado y tenga rol de admin
 */
export default function ProtectedAdminRoute({
  children,
}: ProtectedAdminRouteProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [isChecking, setIsChecking] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Esperar a que Zustand termine de rehidratar desde localStorage
    // Esto es crítico después de un redirect con window.location.href
    const checkAuth = async () => {
      // Intentar múltiples veces hasta que el estado esté disponible
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Obtener el estado actual directamente del store
        const storeState = useAuthStore.getState();
        const currentUser = storeState.user;
        const currentIsAuthenticated = storeState.isAuthenticated;

        // Si tenemos usuario y está autenticado, verificar rol
        if (currentUser && currentIsAuthenticated) {
          const currentIsAdmin = currentUser.role === 'admin';

          // Verificar rol de admin - si no es admin, mostrar toast y redirigir
          if (!currentIsAdmin) {
            console.log('❌ Usuario no es admin, redirigiendo a inicio');
            toast.error('No tienes permisos para acceder a esta sección', {
              description: 'Esta área está restringida para administradores',
            });
            // Redirigir a la página de inicio
            router.replace('/');
            return;
          }

          // Si todo está bien, permitir acceso
          console.log('✅ Acceso autorizado al panel admin');
          setIsChecking(false);
          setHasChecked(true);
          return;
        }

        // Si no hay usuario pero ya pasaron algunos intentos, verificar si realmente no está autenticado
        if (attempts >= 3 && !currentIsAuthenticated && !currentUser) {
          // Verificar también en localStorage directamente
          try {
            const authStorage = localStorage.getItem('auth-storage');
            if (!authStorage) {
              // No hay datos de autenticación, mostrar toast y redirigir
              console.log('❌ No hay datos de autenticación, redirigiendo a inicio');
              toast.error('No tienes permisos para acceder a esta sección', {
                description: 'Esta área está restringida para administradores',
              });
              router.replace('/');
              return;
            }
          } catch (e) {
            // Error al leer localStorage, continuar intentando
          }
        }

        attempts++;
      }

      // Si después de todos los intentos no hay usuario, mostrar toast y redirigir
      console.log(
        '❌ No se pudo verificar autenticación después de',
        maxAttempts,
        'intentos'
      );
      toast.error('No tienes permisos para acceder a esta sección', {
        description: 'Esta área está restringida para administradores',
      });
      router.replace('/');
    };

    // Solo verificar una vez al montar
    if (!hasChecked) {
      checkAuth();
    }
  }, [router, hasChecked]);

  // Usar el estado actualizado del store
  const currentUser = useAuthStore((state) => state.user);
  const currentIsAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentIsAdmin = currentUser?.role === 'admin';

  // Mostrar loading mientras verifica autenticación
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-600">
            Verificando permisos de administrador...
          </p>
        </div>
      </div>
    );
  }

  // Si no está autenticado o no es admin, no mostrar nada (ya se redirigió)
  // Este check es solo por seguridad en caso de que el estado cambie después de la verificación
  if (!currentIsAuthenticated || !currentIsAdmin) {
    // No mostrar nada, la redirección ya se hizo en el useEffect
    return null;
  }

  return <>{children}</>;
}
