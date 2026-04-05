export type {
  User,
  UserRole,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
  AuthState,
  ActionResult,
} from '@features/auth/types/auth.types';

export type RegisterCredentials = import('@features/auth/types/auth.types').RegisterData;
