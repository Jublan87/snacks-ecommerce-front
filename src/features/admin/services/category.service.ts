import { apiClient } from '@shared/api';
import { Category } from '@features/product/types';
import { CategoryFormInput } from '@features/admin/schemas/product.schema';

// ─── Tipos de respuesta del backend ────────────────────────────────────────

/** Body que acepta el endpoint POST/PUT /api/admin/categories */
interface AdminCategoryBody {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  image?: string;
  order?: number;
  isActive?: boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Convierte el formulario Zod al body que espera el admin endpoint */
function toAdminBody(data: CategoryFormInput | Partial<CategoryFormInput>): Partial<AdminCategoryBody> {
  const body: Partial<AdminCategoryBody> = {};

  if (data.name !== undefined) body.name = data.name;
  if (data.slug !== undefined) body.slug = data.slug;
  if (data.description !== undefined) body.description = data.description;
  if (data.parentId !== undefined) body.parentId = data.parentId;
  if (data.order !== undefined) body.order = data.order;
  if (data.isActive !== undefined) body.isActive = data.isActive;

  return body;
}

// ─── Operaciones de lectura (endpoints públicos) ─────────────────────────────

/**
 * Trae todas las categorías.
 * Usa el endpoint público GET /api/categories.
 */
export async function getCategories(): Promise<Category[]> {
  return apiClient.get<Category[]>('/categories');
}

/**
 * Trae una categoría por slug.
 * Usa el endpoint público GET /api/categories/:slug.
 */
export async function getCategoryBySlug(slug: string): Promise<Category> {
  return apiClient.get<Category>(`/categories/${slug}`);
}

// ─── Operaciones de escritura (endpoints admin) ──────────────────────────────

/**
 * Crea una nueva categoría.
 * POST /api/admin/categories
 */
export async function createCategory(data: CategoryFormInput): Promise<Category> {
  return apiClient.post<Category>('/admin/categories', toAdminBody(data));
}

/**
 * Actualiza una categoría existente.
 * PUT /api/admin/categories/:id
 */
export async function updateCategory(
  id: string,
  data: Partial<CategoryFormInput>,
): Promise<Category> {
  return apiClient.put<Category>(`/admin/categories/${id}`, toAdminBody(data));
}

/**
 * Elimina una categoría (hard delete).
 * DELETE /api/admin/categories/:id
 * El backend devuelve 409 si hay productos o subcategorías asociadas.
 */
export async function deleteCategory(id: string): Promise<void> {
  return apiClient.delete<void>(`/admin/categories/${id}`);
}
