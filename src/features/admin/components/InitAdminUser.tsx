'use client';

import { useEffect } from 'react';
import { initAdminUser } from '../utils/init-admin';
import { verifyAdminUser } from '../utils/verify-admin';

/**
 * Componente que inicializa el usuario administrador por defecto
 * Se ejecuta una vez al cargar la aplicación
 */
export function InitAdminUser() {
  useEffect(() => {
    // Inicializar admin
    initAdminUser();
    
    // Verificar y mostrar en consola para debugging
    const result = verifyAdminUser();
    if (result.created) {
      console.log('✅ Usuario administrador creado:', result.message);
    } else if (result.exists) {
      console.log('ℹ️ Usuario administrador ya existe:', result.message);
    }
    
    // Exponer función de ayuda en consola
    console.log('💡 Para verificar el admin manualmente, ejecuta: window.verifyAdmin()');
    console.log('💡 Credenciales admin:', { email: 'admin@snacks.com', password: 'Admin-123' });
  }, []);

  return null; // No renderiza nada
}

