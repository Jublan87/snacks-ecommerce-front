/**
 * Esquemas de validación Zod para autenticación
 */

import { z } from 'zod';

// Esquema para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Debe ser un email válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormInput = z.infer<typeof loginSchema>;

// Esquema para registro
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'El email es requerido')
      .email('Debe ser un email válido'),
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      ),
    confirmPassword: z.string().min(1, 'Debes confirmar tu contraseña'),
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
    // Campos de dirección (opcionales en el registro)
    address: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 5,
        'La dirección debe tener al menos 5 caracteres'
      )
      .refine(
        (val) => !val || val.length <= 200,
        'La dirección no puede exceder 200 caracteres'
      ),
    city: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 2,
        'La ciudad debe tener al menos 2 caracteres'
      )
      .refine(
        (val) => !val || val.length <= 50,
        'La ciudad no puede exceder 50 caracteres'
      ),
    province: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 2,
        'La provincia debe tener al menos 2 caracteres'
      )
      .refine(
        (val) => !val || val.length <= 50,
        'La provincia no puede exceder 50 caracteres'
      ),
    postalCode: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 4,
        'El código postal debe tener al menos 4 caracteres'
      )
      .refine(
        (val) => !val || val.length <= 10,
        'El código postal no puede exceder 10 caracteres'
      )
      .refine(
        (val) => !val || /^[0-9A-Za-z\s-]+$/.test(val),
        'El código postal contiene caracteres inválidos'
      ),
    notes: z
      .string()
      .max(500, 'Las notas no pueden exceder 500 caracteres')
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterFormInput = z.infer<typeof registerSchema>;
