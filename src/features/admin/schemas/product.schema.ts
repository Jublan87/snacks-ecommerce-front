/**
 * Esquemas de validación Zod para productos
 */

import { z } from 'zod';

// Esquema para imagen de producto
export const productImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url('Debe ser una URL válida').min(1, 'La URL es requerida'),
  storageKey: z.string().nullable().optional(),
  alt: z.string().min(1, 'El texto alternativo es requerido'),
  // Se usan valores fijos en lugar de .default() para que el tipo inferido
  // sea `boolean` y `number` (no `boolean | undefined` ni `number | undefined`),
  // lo cual es compatible con ProductImage de @features/product/types.
  isPrimary: z.boolean(),
  order: z.number().int().min(0),
});

// Helper: acepta number | undefined, convierte NaN a undefined
const optionalPositiveNumber = (msg: string) =>
  z.preprocess(
    (v) => (v === undefined || (typeof v === 'number' && isNaN(v)) ? undefined : v),
    z.number().positive(msg).optional(),
  );

// Esquema para dimensiones
export const dimensionsSchema = z
  .object({
    width: optionalPositiveNumber('El ancho debe ser positivo'),
    height: optionalPositiveNumber('La altura debe ser positiva'),
    depth: optionalPositiveNumber('La profundidad debe ser positiva'),
  })
  .optional();

// Esquema para producto
export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(
      /^[a-z0-9-]+$/,
      'El slug solo puede contener letras minúsculas, números y guiones',
    ),
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(5000, 'La descripción no puede exceder 5000 caracteres'),
  shortDescription: z
    .string()
    .max(500, 'La descripción corta no puede exceder 500 caracteres')
    .optional(),
  sku: z
    .string()
    .min(1, 'El SKU es requerido')
    .min(3, 'El SKU debe tener al menos 3 caracteres')
    .max(50, 'El SKU no puede exceder 50 caracteres')
    .regex(
      /^[A-Z0-9-]+$/,
      'El SKU solo puede contener letras mayúsculas, números y guiones',
    ),
  price: z
    .number()
    .positive('El precio debe ser positivo')
    .min(0.01, 'El precio debe ser mayor a 0'),
  discountPercentage: z
    .number()
    .int('El porcentaje de descuento debe ser un número entero')
    .min(0, 'El porcentaje de descuento no puede ser negativo')
    .max(100, 'El porcentaje de descuento no puede ser mayor a 100')
    .optional(),
  stock: z
    .number()
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo'),
  categoryId: z.string().min(1, 'Debes seleccionar una categoría'),
  images: z
    .array(productImageSchema)
    .min(1, 'Debes agregar al menos una imagen'),
  // .default() se evita intencionalmente: provoca que el tipo input de Zod difiera
  // del output, lo que genera incompatibilidad de tipos con useForm<ProductFormInput>.
  // Los valores por defecto se manejan en defaultValues de useForm.
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  tags: z.array(z.string()),
  weight: z.number().positive('El peso debe ser positivo').optional(),
  dimensions: dimensionsSchema,
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

// Esquema para categoría
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(
      /^[a-z0-9-]+$/,
      'El slug solo puede contener letras minúsculas, números y guiones',
    ),
  description: z
    .string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),
  parentId: z.string().optional().nullable(),
  order: z.number().int().min(0),
  isActive: z.boolean(),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
