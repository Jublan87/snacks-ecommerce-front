'use client';

import { useEffect } from 'react';
import { useUserStore } from '@features/admin/store/user-store';
import { useAuthStore } from '@features/auth/store/auth-store';
import UserTable from '@features/admin/components/UserTable';

export default function AdminUsuariosPage() {
  const { fetchUsers, meta } = useUserStore();
  const currentUser = useAuthStore((state) => state.user);

  // Carga inicial de usuarios
  useEffect(() => {
    fetchUsers({ page: 1, limit: 10 });
  }, [fetchUsers]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Usuarios
        </h1>
        <p className="text-gray-600 mt-1">
          Administra los usuarios registrados
          {meta && (
            <span className="ml-2 text-sm text-gray-400">
              ({meta.total} en total)
            </span>
          )}
        </p>
      </div>

      <UserTable currentUserId={currentUser?.id} />
    </div>
  );
}
