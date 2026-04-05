import { create } from 'zustand';
import * as userService from '@features/admin/services/user.service';
import type {
  AdminUser,
  AdminUserFilters,
  AdminUserPaginationMeta,
  UserRole,
} from '@features/admin/types/admin-user.types';

// ─── Interfaz del store ────────────────────────────────────────────────────────

interface UserStore {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  meta: AdminUserPaginationMeta | null;

  /** Carga usuarios desde la API con filtros opcionales. */
  fetchUsers: (filters?: AdminUserFilters) => Promise<void>;

  /** Actualiza el rol de un usuario y sincroniza la lista local. */
  updateRole: (id: string, role: UserRole) => Promise<AdminUser>;
}

// ─── Store ─────────────────────────────────────────────────────────────────────

export const useUserStore = create<UserStore>()((set) => ({
  users: [],
  isLoading: false,
  error: null,
  meta: null,

  fetchUsers: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getUsers(filters);
      set({
        users: response.items ?? [],
        meta: response.meta ?? null,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al cargar los usuarios';
      set({ isLoading: false, error: message });
    }
  },

  updateRole: async (id, role) => {
    try {
      const updatedUser = await userService.updateUserRole(id, role);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
      }));
      return updatedUser;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al actualizar el rol';
      set({ error: message });
      throw error;
    }
  },
}));
