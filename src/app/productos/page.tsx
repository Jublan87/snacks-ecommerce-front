import {
  getProducts,
  getCategories,
} from '@features/product/services/product.service';
import ProductosClient from './ProductosClient';

export default async function ProductosPage() {
  const [{ items: products }, categories] = await Promise.all([
    getProducts({ limit: 100 }),
    getCategories(),
  ]);

  return <ProductosClient initialProducts={products} categories={categories} />;
}
