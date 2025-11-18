/**
 * Esquemas de validación Zod para el formulario de checkout
 */

import { z } from 'zod';

// Esquema para dirección de envío
export const shippingAddressSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  email: z
    .string()
    .email('Debe ser un email válido')
    .min(1, 'El email es requerido'),
  phone: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .regex(
      /^[0-9+\-\s()]+$/,
      'El teléfono solo puede contener números y caracteres especiales'
    ),
  address: z
    .string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  city: z
    .string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(50, 'La ciudad no puede exceder 50 caracteres'),
  province: z
    .string()
    .min(2, 'La provincia debe tener al menos 2 caracteres')
    .max(50, 'La provincia no puede exceder 50 caracteres'),
  postalCode: z
    .string()
    .min(4, 'El código postal debe tener al menos 4 caracteres')
    .max(10, 'El código postal no puede exceder 10 caracteres')
    .regex(
      /^[0-9A-Za-z\s-]+$/,
      'El código postal contiene caracteres inválidos'
    ),
  notes: z
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional(),
});

// Esquema para método de pago
export const paymentMethodSchema = z.enum(
  ['credit_card', 'debit_card', 'cash_on_delivery', 'bank_transfer'],
  {
    message: 'Debes seleccionar un método de pago válido',
  }
);

// Esquema completo del formulario de checkout
export const checkoutFormSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: paymentMethodSchema,
});

export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
