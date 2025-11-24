/**
 * Utilidad para verificar y crear el usuario administrador
 * Útil para debugging
 */

import { getMockUsers, addMockUser, emailExists } from '@/features/auth/utils/storage.utils';
import { User } from '@/features/auth/types';

const ADMIN_EMAIL = 'admin@snacks.com';
const ADMIN_PASSWORD = 'Admin-123';

/**
 * Verifica si el usuario admin existe y lo crea si no existe
 * Retorna información sobre el estado del admin
 */
export function verifyAdminUser(): {
  exists: boolean;
  created: boolean;
  message: string;
} {
  if (typeof window === 'undefined') {
    return {
      exists: false,
      created: false,
      message: 'Solo se puede ejecutar en el cliente',
    };
  }

  const exists = emailExists(ADMIN_EMAIL);
  
  if (exists) {
    const users = getMockUsers();
    const adminUser = users.find((u) => u.email === ADMIN_EMAIL);
    
    return {
      exists: true,
      created: false,
      message: `Usuario admin existe. Rol: ${adminUser?.user.role || 'no definido'}`,
    };
  }

  // Crear usuario admin
  const adminUser: User = {
    id: 'admin-default',
    email: ADMIN_EMAIL,
    firstName: 'Administrador',
    lastName: 'Sistema',
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  const mockUserData = {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    user: adminUser,
  };

  addMockUser(mockUserData);
  
  return {
    exists: false,
    created: true,
    message: 'Usuario administrador creado exitosamente',
  };
}

/**
 * Función de ayuda para debugging - expone en window para uso en consola
 */
if (typeof window !== 'undefined') {
  (window as any).verifyAdmin = verifyAdminUser;
  (window as any).adminCredentials = {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  };
}

