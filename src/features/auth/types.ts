/**
 * Tipos TypeScript para autenticación
 */

import { ShippingAddress } from '@/features/checkout/types';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  shippingAddress?: ShippingAddress;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  shippingAddress?: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    notes?: string;
  };
}
