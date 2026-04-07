import { create } from 'zustand';
import type { User, LoginCredentials, RegisterData, UpdateProfileData, ChangePasswordData } from '@features/auth/types/auth.types';
import {
  loginAction,
  registerAction,
  logoutAction,
  getMeAction,
  updateProfileAction,
  changePasswordAction,
} from '@features/auth/actions/auth.actions';
// Cart store — imported lazily to avoid circular dependencies
import { useCartStore } from '@features/cart/store/cart-store';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => boolean;
  isAdmin: () => boolean;
  updateUser: (data: UpdateProfileData) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isLoggingOut: false,

  initialize: async () => {
    set({ isLoading: true });
    const result = await getMeAction();
    if (result.success && result.data) {
      set({ user: result.data, isAuthenticated: true, isLoading: false });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials: LoginCredentials) => {
    const result = await loginAction(credentials);
    if (!result.success || !result.data) {
      throw new Error(result.error ?? 'Error al iniciar sesión');
    }
    set({ user: result.data, isAuthenticated: true });
  },

  register: async (data: RegisterData) => {
    const result = await registerAction(data);
    if (!result.success || !result.data) {
      throw new Error(result.error ?? 'Error al registrarse');
    }
    set({ user: result.data, isAuthenticated: true });
  },

  logout: async () => {
    set({ isLoggingOut: true });
    await logoutAction();
    // Clear auth state and cart — cart items are user-specific
    set({ user: null, isAuthenticated: false });
    useCartStore.getState().resetCart();
  },

  checkAuth: () => {
    return get().isAuthenticated;
  },

  isAdmin: () => {
    return get().user?.role === 'admin';
  },

  updateUser: async (data: UpdateProfileData) => {
    const result = await updateProfileAction(data);
    if (!result.success || !result.data) {
      throw new Error(result.error ?? 'Error al actualizar perfil');
    }
    set({ user: result.data });
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    const result = await changePasswordAction({ currentPassword, newPassword });
    if (!result.success) {
      throw new Error(result.error ?? 'Error al cambiar contraseña');
    }
  },
}));
