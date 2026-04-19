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
 * GET /addresses — returns all addresses for the authenticated user.
 */
export function listAddresses(): Promise<Address[]> {
  return apiClient.get<Address[]>('/addresses');
}

/**
 * POST /addresses — creates a new address.
 * Backend auto-sets isDefault=true when it is the first address.
 */
export function createAddress(data: CreateAddressDto): Promise<Address> {
  return apiClient.post<Address>('/addresses', data);
}

/**
 * PATCH /addresses/:id — updates fields on an existing address.
 */
export function updateAddress(id: string, data: UpdateAddressDto): Promise<Address> {
  return apiClient.patch<Address>(`/addresses/${id}`, data);
}

/**
 * DELETE /addresses/:id — deletes an address.
 * Backend auto-promotes the most-recently-created remaining address to default
 * when the deleted address was the default.
 */
export function deleteAddress(id: string): Promise<void> {
  return apiClient.delete<void>(`/addresses/${id}`);
}

/**
 * POST /addresses/:id/default — promotes an address to default.
 * Backend clears isDefault on all other addresses atomically.
 */
export function setDefaultAddress(id: string): Promise<Address> {
  return apiClient.post<Address>(`/addresses/${id}/default`);
}
