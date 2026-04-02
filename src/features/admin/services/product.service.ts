import { apiClient } from '@shared/api';
import { Product, ProductsResponse } from '@features/product/types';
import { ProductFormInput } from '@features/admin/schemas/product.schema';

// ─── Tipos de respuesta del backend ────────────────────────────────────────

/** Body que acepta el endpoint POST/PUT /api/admin/products */
interface AdminProductBody {
  name: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  discountPercentage?: number;
  stock: number;
  categoryId: string;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  weight?: number;
  dimensions?: { width: number; height: number; depth: number };
  /** URLs de imágenes — se envían sólo las URLs, el backend gestiona las entidades */
  images?: { url: string; alt: string; isPrimary: boolean; order: number }[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Convierte el formulario Zod al body que espera el admin endpoint */
function toAdminBody(data: ProductFormInput): AdminProductBody {
  const body: AdminProductBody = {
    name: data.name,
    description: data.description,
    sku: data.sku,
    price: data.price,
    stock: data.stock,
    categoryId: data.categoryId,
    isActive: data.isActive,
    isFeatured: data.isFeatured,
    tags: data.tags,
  };

  if (data.shortDescription) body.shortDescription = data.shortDescription;
  if (data.discountPercentage !== undefined) body.discountPercentage = data.discountPercentage;
  if (data.weight !== undefined) body.weight = data.weight;
  if (data.dimensions) body.dimensions = data.dimensions;

  // El backend espera las imágenes como array de objetos planos (sin el id local)
  if (data.images && data.images.length > 0) {
    body.images = data.images.map((img) => ({
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
      order: img.order,
    }));
  }

  return body;
}

// ─── Operaciones de lectura (endpoints públicos) ─────────────────────────────

/**
 * Trae el listado paginado de productos.
 * Usa el endpoint público GET /api/products.
 */
export async function getProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ProductsResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);

  const qs = query.toString();
  return apiClient.get<ProductsResponse>(`/products${qs ? `?${qs}` : ''}`);
}

/**
 * Trae un producto por ID (detalle completo con description, weight, dimensions).
 * Usa el endpoint público GET /api/products/:id.
 */
export async function getProductById(id: string): Promise<Product> {
  return apiClient.get<Product>(`/products/${id}`);
}

/**
 * Trae un producto por slug.
 * Usa el endpoint público GET /api/products/:slug.
 */
export async function getProductBySlug(slug: string): Promise<Product> {
  return apiClient.get<Product>(`/products/${slug}`);
}

// ─── Operaciones de escritura (endpoints admin) ──────────────────────────────

/**
 * Crea un nuevo producto.
 * POST /api/admin/products
 */
export async function createProduct(data: ProductFormInput): Promise<Product> {
  return apiClient.post<Product>('/admin/products', toAdminBody(data));
}

/**
 * Actualiza un producto existente.
 * PUT /api/admin/products/:id
 */
export async function updateProduct(
  id: string,
  data: Partial<ProductFormInput>,
): Promise<Product> {
  return apiClient.put<Product>(`/admin/products/${id}`, toAdminBody(data as ProductFormInput));
}

/**
 * Soft-delete de un producto (el backend pone isActive=false).
 * DELETE /api/admin/products/:id
 */
export async function deleteProduct(id: string): Promise<void> {
  return apiClient.delete<void>(`/admin/products/${id}`);
}

/**
 * Actualiza el stock de un producto.
 * PUT /api/admin/products/:id/stock
 */
export async function updateProductStock(
  id: string,
  newStock: number,
  reason?: string,
): Promise<void> {
  return apiClient.put<void>(`/admin/products/${id}/stock`, { newStock, reason });
}
