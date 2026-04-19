import { StoredShippingAddress } from '@features/checkout/types';

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  // Only address/city/province/postalCode/notes — matches backend ShippingAddressDto
  shippingAddress?: StoredShippingAddress;
  role: UserRole;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  shippingAddress?: StoredShippingAddress;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  shippingAddress?: StoredShippingAddress | null;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
