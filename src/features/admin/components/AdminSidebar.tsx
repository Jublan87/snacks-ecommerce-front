'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  PackageSearch,
  Users,
  Home,
  X,
} from 'lucide-react';
import { cn } from '@shared/utils/utils';
import { useEffect } from 'react';

interface AdminSidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

/**
 * Sidebar de navegación del panel de administración
 */
export default function AdminSidebar({ isMobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();

  // Cerrar sidebar mobile cuando cambia la ruta
  useEffect(() => {
    onMobileClose();
  }, [pathname, onMobileClose]);

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/productos',
      label: 'Productos',
      icon: Package,
    },
    {
      href: '/admin/pedidos',
      label: 'Pedidos',
      icon: ShoppingCart,
    },
    {
      href: '/admin/stock',
      label: 'Stock',
      icon: PackageSearch,
    },
    {
      href: '/admin/usuarios',
      label: 'Usuarios',
      icon: Users,
    },
  ];

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-brand text-white'
                        : 'text-gray-700 hover:bg-brand/10'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          
          {/* Link para volver al sitio */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-brand/10 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Volver al sitio</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Sidebar mobile (drawer) */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Menú</h2>
          <button
            onClick={onMobileClose}
            className="p-2 hover:bg-gray-100 rounded-md"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-brand text-white'
                        : 'text-gray-700 hover:bg-brand/10'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          
          {/* Link para volver al sitio */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-brand/10 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Volver al sitio</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}

