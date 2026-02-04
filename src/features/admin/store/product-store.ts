import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, Category, ProductImage } from '@/features/product/types';
import { ProductFormInput } from '@/features/admin/schemas/product.schema';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/features/product/mocks/products.mock';

/** Asegura que cada imagen tenga id requerido para Product. */
function normalizeImages(
  images: ProductFormInput['images'],
  prefix = 'img'
): ProductImage[] {
  return (images || []).map((img, i) => ({
    ...img,
    id: img.id ?? `${prefix}-${Date.now()}-${i}`,
  }));
}

interface ProductStore {
  products: Product[];
  categories: Category[];
  
  // Productos
  createProduct: (product: ProductFormInput) => Product;
  updateProduct: (id: string, updates: Partial<ProductFormInput>) => Product;
  updateStock: (id: string, newStock: number) => { previousStock: number };
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  
  // Categorías
  createCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => Category;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  getAllCategoriesFlat: () => Category[];
  
  // Utilidades
  initializeWithMocks: () => void;
}

// Función para generar ID único
const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Función para generar slug desde nombre
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      categories: [],

      // Inicializar con datos mock si está vacío
      initializeWithMocks: () => {
        const state = get();
        if (state.products.length === 0 && state.categories.length === 0) {
          set({
            products: MOCK_PRODUCTS,
            categories: MOCK_CATEGORIES,
          });
        }
      },

      // Crear producto
      createProduct: (productData) => {
        // Calcular discountPrice desde discountPercentage (el formulario solo envía porcentaje)
        let discountPrice: number | undefined;
        let discountPercentage: number | undefined;

        if (productData.discountPercentage !== undefined && productData.discountPercentage > 0) {
          discountPercentage = productData.discountPercentage;
          discountPrice = productData.price * (1 - discountPercentage / 100);
        }

        const newProduct: Product = {
          ...productData,
          id: generateId('prod'),
          slug: productData.slug || generateSlug(productData.name),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          images: normalizeImages(productData.images || []),
          tags: productData.tags || [],
          isActive: productData.isActive ?? true,
          isFeatured: productData.isFeatured ?? false,
          discountPrice,
          discountPercentage,
        };

        set((state) => ({
          products: [...state.products, newProduct],
        }));

        return newProduct;
      },

      // Actualizar producto
      updateProduct: (id, updates) => {
        const currentProducts = get().products;
        const product = currentProducts.find((p) => p.id === id);

        if (!product) {
          throw new Error('Producto no encontrado');
        }

        // Calcular discountPrice y discountPercentage si hay descuento
        const finalPrice = updates.price ?? product.price;
        let discountPrice: number | undefined;
        let discountPercentage: number | undefined;

        if (updates.discountPercentage !== undefined) {
          if (updates.discountPercentage > 0) {
            discountPercentage = updates.discountPercentage;
            discountPrice = finalPrice * (1 - discountPercentage / 100);
          } else {
            discountPrice = undefined;
            discountPercentage = undefined;
          }
        } else {
          discountPrice = product.discountPrice;
          discountPercentage = product.discountPercentage;
        }

        const merged = { ...product, ...updates };
        const updatedProduct: Product = {
          ...merged,
          id,
          slug: updates.slug || updates.name ? generateSlug(updates.name || product.name) : product.slug,
          updatedAt: new Date().toISOString(),
          discountPrice,
          discountPercentage,
          images: updates.images ? normalizeImages(updates.images) : product.images,
        };

        set({
          products: currentProducts.map((p) => (p.id === id ? updatedProduct : p)),
        });

        return updatedProduct;
      },

      // Actualizar solo stock (para gestión de inventario)
      updateStock: (id, newStock) => {
        const currentProducts = get().products;
        const product = currentProducts.find((p) => p.id === id);
        if (!product) {
          throw new Error('Producto no encontrado');
        }
        const previousStock = product.stock;
        const safeStock = Math.max(0, Math.floor(Number(newStock)));
        set({
          products: currentProducts.map((p) =>
            p.id === id
              ? { ...p, stock: safeStock, updatedAt: new Date().toISOString() }
              : p
          ),
        });
        return { previousStock };
      },

      // Eliminar producto
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      // Obtener producto por ID
      getProductById: (id) => {
        return get().products.find((p) => p.id === id);
      },

      // Crear categoría
      createCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: generateId('cat'),
          slug: categoryData.slug || generateSlug(categoryData.name),
          isActive: categoryData.isActive ?? true,
          order: categoryData.order ?? 0,
        };

        set((state) => ({
          categories: [...state.categories, newCategory],
        }));

        return newCategory;
      },

      // Actualizar categoría
      updateCategory: (id, updates) => {
        const currentCategories = get().categories;
        const category = currentCategories.find((c) => c.id === id);

        if (!category) {
          throw new Error('Categoría no encontrada');
        }

        const updatedCategory: Category = {
          ...category,
          ...updates,
          id, // Asegurar que el ID no cambie
          slug: updates.slug || updates.name ? generateSlug(updates.name || category.name) : category.slug,
        };

        set({
          categories: currentCategories.map((c) => (c.id === id ? updatedCategory : c)),
        });

        return updatedCategory;
      },

      // Eliminar categoría
      deleteCategory: (id) => {
        // Verificar que no haya productos usando esta categoría
        const productsUsingCategory = get().products.some((p) => p.categoryId === id);
        if (productsUsingCategory) {
          throw new Error('No se puede eliminar la categoría porque hay productos asociados');
        }

        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      // Obtener categoría por ID
      getCategoryById: (id) => {
        return get().categories.find((c) => c.id === id);
      },

      // Obtener todas las categorías en formato plano (incluyendo hijos)
      getAllCategoriesFlat: () => {
        const categories = get().categories;
        const flat: Category[] = [];

        const flatten = (cats: Category[]) => {
          cats.forEach((cat) => {
            flat.push(cat);
            if (cat.children) {
              flatten(cat.children);
            }
          });
        };

        flatten(categories);
        return flat;
      },
    }),
    {
      name: 'admin-product-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
      }),
    }
  )
);

