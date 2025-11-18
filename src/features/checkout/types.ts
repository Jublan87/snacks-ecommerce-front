/**
 * Tipos para el proceso de checkout
 */

export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'cash_on_delivery'
  | 'bank_transfer';

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

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

export interface CheckoutData extends CheckoutFormData {
  subtotal: number;
  shipping: number;
  total: number;
}
