/**
 * Tipos para el proceso de checkout
 */

export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'cash_on_delivery'
  | 'bank_transfer';

/**
 * Full address used for checkout/orders (matches OrderShippingAddressDto).
 * These 9 fields are stored on each Order's shippingAddress JSON.
 */
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
}

/**
 * Address stored on the User profile (matches backend ShippingAddressDto).
 * Does NOT include firstName/lastName/email/phone — those live at the User level.
 */
export interface StoredShippingAddress {
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
}

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

export interface CheckoutData extends CheckoutFormData {
  subtotal: number;
  shipping: number;
  total: number;
}
