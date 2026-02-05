'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@features/cart/store/cart-store';
import { useAuthStore } from '@features/auth/store/auth-store';
import { Badge } from '@shared/ui/badge';
import { useEffect, useState } from 'react';

export default function BottomNavigation() {
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  // Evitar error de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ocultar en rutas específicas (login, registro, checkout, etc.)
  const hiddenRoutes = ['/login', '/registro', '/checkout'];
  const shouldHide = hiddenRoutes.some((route) => pathname?.startsWith(route));

  if (shouldHide) {
    return null;
  }

  const navItems = [
    {
      href: '/',
      label: 'Inicio',
      icon: Home,
      ariaLabel: 'Ir a la página de inicio',
    },
    {
      href: '/productos',
      label: 'Productos',
      icon: Package,
      ariaLabel: 'Ver todos los productos',
    },
    {
      href: '/carrito',
      label: 'Carrito',
      icon: ShoppingCart,
      ariaLabel: 'Ver carrito de compras',
      badge: mounted && itemCount > 0 ? itemCount : null,
    },
    {
      href: isAuthenticated ? '/perfil' : '/login',
      label: isAuthenticated ? 'Perfil' : 'Login',
      icon: User,
      ariaLabel: isAuthenticated
        ? 'Ver mi perfil'
        : 'Iniciar sesión o registrarse',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden"
      aria-label="Navegación inferior"
    >
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isCart = item.href === '/carrito';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1
                min-h-[44px] min-w-[44px]
                transition-colors
                ${
                  isActive
                    ? 'text-brand bg-brand/5'
                    : 'text-gray-600 hover:text-brand'
                }
              `}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 ${isActive ? 'text-brand' : ''}`}
                  aria-hidden="true"
                />
                {item.badge && (
                  <Badge
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-brand text-white border-transparent"
                    aria-label={`${item.badge} ${
                      item.badge === 1 ? 'producto' : 'productos'
                    } en el carrito`}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-brand' : 'text-gray-600'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
