import {
  getProducts,
  getCategories,
} from '@features/product/services/product.service';
import ProductosClient from './ProductosClient';

interface ProductosPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ProductosPage({ searchParams }: ProductosPageProps) {
  const [{ items: products }, categories, resolvedParams] = await Promise.all([
    getProducts({ limit: 100 }),
    getCategories(),
    searchParams,
  ]);

  return (
    <ProductosClient
      initialProducts={products}
      categories={categories}
      initialSearch={resolvedParams.q ?? ''}
    />
  );
}
