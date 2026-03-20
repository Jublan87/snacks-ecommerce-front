import { ShippingAddress } from '@features/checkout/types';

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  shippingAddress?: ShippingAddress;
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
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  shippingAddress?: ShippingAddress | null;
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
