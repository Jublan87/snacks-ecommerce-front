/**
 * Admin-specific types for user management.
 * Matches the shape returned by GET /api/admin/users.
 */

export type UserRole = 'customer' | 'admin';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AdminPaginatedUsers {
  items: AdminUser[];
  meta: AdminUserPaginationMeta;
}

/** Filters for GET /admin/users */
export interface AdminUserFilters {
  page?: number;
  limit?: number;
  role?: UserRole | 'all';
  search?: string;
}
