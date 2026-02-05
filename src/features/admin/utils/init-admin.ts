/**
 * Utilidad para inicializar un usuario administrador por defecto
 * Solo se ejecuta una vez al inicio de la aplicación
 */

import { addMockUser, emailExists } from '@features/auth/utils/storage.utils';
import { User } from '@features/auth/types';

const ADMIN_EMAIL = 'admin@snacks.com';
const ADMIN_PASSWORD = 'Admin-123';

/**
 * Inicializa un usuario administrador por defecto si no existe
 * Se ejecuta automáticamente en el cliente
 */
export function initAdminUser(): void {
  if (typeof window === 'undefined') return;

  // Verificar si ya existe un admin
  if (emailExists(ADMIN_EMAIL)) {
    return;
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
  console.log('Usuario administrador inicializado:', ADMIN_EMAIL);
}
