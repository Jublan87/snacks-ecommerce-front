import { apiClient } from '@shared/api/client';
import type { Address } from '@features/auth/types/auth.types';

export interface CreateAddressDto {
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
  label?: string;
}

export interface UpdateAddressDto {
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  notes?: string;
  label?: string;
}

/**
 * GET /users/me/addresses — returns all addresses for the authenticated user.
 */
export function listAddresses(): Promise<Address[]> {
  return apiClient.get<Address[]>('/users/me/addresses');
}

/**
 * POST /users/me/addresses — creates a new address.
 * Backend auto-sets isDefault=true when it is the first address.
 */
export function createAddress(data: CreateAddressDto): Promise<Address> {
  return apiClient.post<Address>('/users/me/addresses', data);
}

/**
 * PATCH /users/me/addresses/:id — updates fields on an existing address.
 */
export function updateAddress(id: string, data: UpdateAddressDto): Promise<Address> {
  return apiClient.patch<Address>(`/users/me/addresses/${id}`, data);
}

/**
 * DELETE /users/me/addresses/:id — deletes an address.
 * Backend auto-promotes the most-recently-created remaining address to default
 * when the deleted address was the default.
 */
export function deleteAddress(id: string): Promise<void> {
  return apiClient.delete<void>(`/users/me/addresses/${id}`);
}

/**
 * POST /users/me/addresses/:id/default — promotes an address to default.
 * Backend clears isDefault on all other addresses atomically.
 */
export function setDefaultAddress(id: string): Promise<Address> {
  return apiClient.post<Address>(`/users/me/addresses/${id}/default`);
}
