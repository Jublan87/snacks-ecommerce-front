import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  User,
  LoginCredentials,
  RegisterCredentials,
} from '@/features/auth/types';
import {
  addMockUser,
  emailExists,
  findMockUser,
  updateMockUser,
  updateMockUserPassword,
} from '@/features/auth/utils/storage.utils';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// Función para generar ID único
const generateUserId = (): string => {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Función para generar token mock (en producción vendrá del backend)
const generateMockToken = (): string => {
  return `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Función para establecer cookie de autenticación
const setAuthCookie = (token: string | null) => {
  if (typeof document === 'undefined') return;

  if (token) {
    // Establecer cookie con expiración de 7 días
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `auth-token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  } else {
    // Eliminar cookie
    document.cookie =
      'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (credentials: LoginCredentials) => {
        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Buscar usuario en localStorage
        const foundUser = findMockUser(credentials.email, credentials.password);

        if (!foundUser) {
          throw new Error('Email o contraseña incorrectos');
        }

        const token = generateMockToken();

        set({
          user: foundUser.user,
          isAuthenticated: true,
          token,
        });

        // Establecer cookie para el middleware
        setAuthCookie(token);
      },

      register: async (credentials: RegisterCredentials) => {
        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Validar que las contraseñas coincidan
        if (credentials.password !== credentials.confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }

        // Validar que el email no esté en uso
        if (emailExists(credentials.email)) {
          throw new Error('Este email ya está registrado');
        }

        // Validar longitud de contraseña
        if (credentials.password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        // Crear nuevo usuario
        const newUser: User = {
          id: generateUserId(),
          email: credentials.email,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          phone: credentials.phone,
          createdAt: new Date().toISOString(),
          // Si se proporcionaron datos de dirección, guardarlos
          shippingAddress:
            credentials.shippingAddress &&
            credentials.shippingAddress.address &&
            credentials.shippingAddress.city &&
            credentials.shippingAddress.province &&
            credentials.shippingAddress.postalCode
              ? {
                  firstName: credentials.firstName,
                  lastName: credentials.lastName,
                  email: credentials.email,
                  phone: credentials.phone || '',
                  address: credentials.shippingAddress.address,
                  city: credentials.shippingAddress.city,
                  province: credentials.shippingAddress.province,
                  postalCode: credentials.shippingAddress.postalCode,
                  notes: credentials.shippingAddress.notes,
                }
              : undefined,
        };

        // Agregar a mock y guardar en localStorage (en producción esto se haría en el backend)
        const mockUserData = {
          email: credentials.email,
          password: credentials.password, // En producción esto nunca se guardaría en texto plano
          user: newUser,
        };
        addMockUser(mockUserData);

        const token = generateMockToken();

        set({
          user: newUser,
          isAuthenticated: true,
          token,
        });

        // Establecer cookie para el middleware
        setAuthCookie(token);
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        });

        // Eliminar cookie
        setAuthCookie(null);
      },

      checkAuth: () => {
        return get().isAuthenticated;
      },

      updateUser: async (updatedData: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) {
          throw new Error('No hay usuario autenticado');
        }

        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Actualizar en localStorage
        updateMockUser(currentUser.id, updatedData);

        // Actualizar en el store
        const updatedUser: User = {
          ...currentUser,
          ...updatedData,
          id: currentUser.id, // No permitir cambiar el ID
          email: currentUser.email, // No permitir cambiar el email
          createdAt: currentUser.createdAt, // No permitir cambiar la fecha de creación
        };

        set({
          user: updatedUser,
        });
      },

      updatePassword: async (currentPassword: string, newPassword: string) => {
        const currentUser = get().user;
        if (!currentUser) {
          throw new Error('No hay usuario autenticado');
        }

        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Verificar que la contraseña actual sea correcta
        const foundUser = findMockUser(currentUser.email, currentPassword);
        if (!foundUser) {
          throw new Error('La contraseña actual es incorrecta');
        }

        // Validar longitud de nueva contraseña
        if (newPassword.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        // Actualizar contraseña en localStorage
        updateMockUserPassword(currentUser.id, newPassword);
      },
    }),
    {
      name: 'auth-storage', // Nombre de la clave en localStorage
      storage: createJSONStorage(() => localStorage),
      // Solo persistir user, isAuthenticated y token, no las funciones
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
      // Sincronizar cookie cuando se restaura el estado desde localStorage
      onRehydrateStorage: () => (state) => {
        if (state?.token && typeof window !== 'undefined') {
          setAuthCookie(state.token);
        }
      },
    }
  )
);
