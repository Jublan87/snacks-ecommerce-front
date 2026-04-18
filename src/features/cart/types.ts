// Types that match the backend cart response shapes exactly.
// See: snacks-ecommerce-back/src/modules/cart/interfaces/cart.interfaces.ts

export interface CartProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

/** Product data embedded inside a cart item (subset of the full product). */
export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  salePrice: number;
  discountPrice: number | null;
  stock: number;
  isActive: boolean;
  images: CartProductImage[];
}

/** A single item returned by the backend cart endpoints. */
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  addedAt: string;
  product: CartProduct;
  /** false when the product is inactive or stock is insufficient for the current quantity */
  isAvailable: boolean;
}

/** Full cart response returned by GET /cart. */
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
}
