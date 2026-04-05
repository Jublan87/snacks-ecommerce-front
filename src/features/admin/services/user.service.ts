/**
 * Admin user service — CLIENT-side only (Client Components).
 *
 * Calls the admin-specific endpoints:
 *   GET  /admin/users        — paginated user list with optional filters
 *   PATCH /admin/users/:id/role — update a user's role
 *
 * Uses apiClient which sends credentials: 'include' so the HttpOnly JWT cookie
 * is forwarded automatically.
 */

import { apiClient } from '@shared/api';
import type {
  AdminPaginatedUsers,
  AdminUser,
  AdminUserFilters,
  UserRole,
} from '@features/admin/types/admin-user.types';

const BASE = '/admin/users';

/**
 * Fetches paginated users with optional filters.
 * Supports: page, limit, role, search
 */
export async function getUsers(
  filters?: AdminUserFilters
): Promise<AdminPaginatedUsers> {
  const params = new URLSearchParams();

  if (filters?.page)               params.set('page', String(filters.page));
  if (filters?.limit)              params.set('limit', String(filters.limit));
  if (filters?.role && filters.role !== 'all') params.set('role', filters.role);
  if (filters?.search?.trim())     params.set('search', filters.search.trim());

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiClient.get<AdminPaginatedUsers>(`${BASE}${query}`);
}

/**
 * Updates the role of a user via PATCH /admin/users/:id/role.
 * Returns the updated user as confirmed by the backend.
 */
export async function updateUserRole(
  id: string,
  role: UserRole
): Promise<AdminUser> {
  return apiClient.patch<AdminUser>(`${BASE}/${id}/role`, { role });
}
