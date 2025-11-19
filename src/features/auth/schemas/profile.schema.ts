/**
 * Esquemas de validación Zod para el perfil de usuario
 */

import { z } from 'zod';

// Esquema para actualizar información personal
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El nombre solo puede contener letras'
    ),
  lastName: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El apellido solo puede contener letras'
    ),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 10,
      'El teléfono debe tener al menos 10 dígitos'
    )
    .refine(
      (val) => !val || /^[0-9+\-\s()]+$/.test(val),
      'El teléfono solo puede contener números y caracteres especiales'
    ),
});

export type UpdateProfileFormInput = z.infer<typeof updateProfileSchema>;

// Esquema para actualizar dirección
export const updateAddressSchema = z.object({
  firstName: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  lastName: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Debe ser un email válido'),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .refine(
      (val) => /^[0-9+\-\s()]+$/.test(val),
      'El teléfono solo puede contener números y caracteres especiales'
    ),
  address: z
    .string()
    .min(1, 'La dirección es requerida')
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  city: z
    .string()
    .min(1, 'La ciudad es requerida')
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(50, 'La ciudad no puede exceder 50 caracteres'),
  province: z
    .string()
    .min(1, 'La provincia es requerida')
    .min(2, 'La provincia debe tener al menos 2 caracteres')
    .max(50, 'La provincia no puede exceder 50 caracteres'),
  postalCode: z
    .string()
    .min(1, 'El código postal es requerido')
    .min(4, 'El código postal debe tener al menos 4 caracteres')
    .max(10, 'El código postal no puede exceder 10 caracteres')
    .refine(
      (val) => /^[0-9A-Za-z\s-]+$/.test(val),
      'El código postal contiene caracteres inválidos'
    ),
  notes: z
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional(),
});

export type UpdateAddressFormInput = z.infer<typeof updateAddressSchema>;

// Esquema para cambiar contraseña
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'La contraseña actual es requerida'),
    newPassword: z
      .string()
      .min(1, 'La nueva contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(1, 'Debes confirmar tu nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormInput = z.infer<typeof changePasswordSchema>;

