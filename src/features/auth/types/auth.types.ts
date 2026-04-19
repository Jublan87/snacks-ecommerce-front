export type UserRole = 'customer' | 'admin';

export interface Address {
  id: string;
  userId: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string | null;
  label?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
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
  // Backend still accepts optional shippingAddress in register transaction
  shippingAddress?: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    notes?: string;
  };
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
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
