import { create } from 'zustand';
import { Product, Category } from '@features/product/types';
import { ProductFormInput, CategoryFormInput } from '@features/admin/schemas/product.schema';
import * as productService from '@features/admin/services/product.service';
import * as categoryService from '@features/admin/services/category.service';

// ─── Interfaz del store ────────────────────────────────────────────────────

interface ProductStore {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  /** Carga productos y categorías desde la API (llamar una vez al montar). */
  fetchAll: () => Promise<void>;

  // Productos
  createProduct: (data: ProductFormInput) => Promise<Product>;
  updateProduct: (id: string, data: Partial<ProductFormInput>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;

  /**
   * Actualiza el stock de un producto localmente (para StockInventory).
   * Devuelve el stock anterior para que el componente registre el historial.
   * La sincronización con el backend la maneja el módulo de stock.
   */
  updateStock: (id: string, newStock: number) => { previousStock: number };

  // Categorías
  createCategory: (data: CategoryFormInput) => Promise<Category>;
  updateCategory: (id: string, data: Partial<CategoryFormInput>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  getAllCategoriesFlat: () => Category[];

  // Utilidades
  /** No-op — mantenido por compatibilidad con la página hasta su refactor */
  initializeWithMocks: () => void;
}

// ─── Store ─────────────────────────────────────────────────────────────────

export const useProductStore = create<ProductStore>()((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: null,

  // Compatibilidad con StockInventory: dispara fetchAll si los datos no están cargados
  initializeWithMocks: () => {
    if (get().products.length === 0 && get().categories.length === 0 && !get().isLoading) {
      get().fetchAll();
    }
  },

  // ── Fetch inicial ──────────────────────────────────────────────────────

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      // Carga productos y categorías en paralelo
      const [productsResponse, categories] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        categoryService.getCategories(),
      ]);
      set({
        // getProducts devuelve ProductsResponse { items, meta } — necesitamos items
        // como Product[]. El tipo ProductListItem es compatible con Product en los
        // campos que muestra ProductTable, pero el store tipea Product[].
        // Cast seguro: ProductListItem tiene todos los campos necesarios para la tabla.
        products: productsResponse.items as unknown as Product[],
        categories,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar los datos';
      set({ isLoading: false, error: message });
    }
  },

  // ── Productos ─────────────────────────────────────────────────────────

  createProduct: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newProduct = await productService.createProduct(data);
      set((state) => ({
        products: [...state.products, newProduct],
        isLoading: false,
      }));
      return newProduct;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear el producto';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  updateProduct: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProduct = await productService.updateProduct(id, data);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        isLoading: false,
      }));
      return updatedProduct;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al actualizar el producto';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    // Optimistic update: eliminar de la lista local inmediatamente
    const previousProducts = get().products;
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
    try {
      await productService.deleteProduct(id);
    } catch (error) {
      // Revertir si falla
      set({ products: previousProducts });
      const message = error instanceof Error ? error.message : 'Error al eliminar el producto';
      set({ error: message });
      throw error;
    }
  },

  getProductById: (id) => {
    return get().products.find((p) => p.id === id);
  },

  // Actualiza el stock localmente (para StockInventory — sincronización real
  // la maneja el stock-store que llama al endpoint /admin/products/:id/stock)
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

  // ── Categorías ────────────────────────────────────────────────────────

  createCategory: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newCategory = await categoryService.createCategory(data);
      set((state) => ({
        categories: [...state.categories, newCategory],
        isLoading: false,
      }));
      return newCategory;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear la categoría';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCategory = await categoryService.updateCategory(id, data);
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? updatedCategory : c)),
        isLoading: false,
      }));
      return updatedCategory;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al actualizar la categoría';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    // Optimistic update: eliminar de la lista local inmediatamente
    const previousCategories = get().categories;
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
    try {
      await categoryService.deleteCategory(id);
    } catch (error) {
      // Revertir si falla (ej: 409 — tiene dependencias)
      set({ categories: previousCategories });
      const message = error instanceof Error ? error.message : 'Error al eliminar la categoría';
      set({ error: message });
      throw error;
    }
  },

  getCategoryById: (id) => {
    return get().categories.find((c) => c.id === id);
  },

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
}));
