'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@features/auth/store/auth-store';
import { Button } from '@shared/ui/button';
import { LogOut, Menu } from 'lucide-react';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

/**
 * Header del panel de administración
 */
export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Logo y título */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Panel de Administración
            </h1>
            <p className="text-sm text-gray-500">
              Snacks Ecommerce
            </p>
          </div>
        </div>

        {/* Información del usuario y logout */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

