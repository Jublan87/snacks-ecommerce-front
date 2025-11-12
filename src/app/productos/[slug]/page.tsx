import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getMockProductBySlug, MOCK_PRODUCTS } from '@/mocks/products.mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/product/ProductCard';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductBreadcrumbs from '@/components/product/ProductBreadcrumbs';
import ProductQuantitySection from '@/components/product/ProductQuantitySection';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generar metadata dinámica para SEO
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getMockProductBySlug(slug);

  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }

  const currentPrice = product.discountPrice || product.price;
  const description = product.shortDescription || product.description;

  return {
    title: `${product.name} - Snacks Ecommerce`,
    description: description,
    openGraph: {
      title: product.name,
      description: description,
      images: product.images.map((img) => ({
        url: img.url,
        alt: img.alt,
      })),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: description,
      images: product.images[0]?.url,
    },
  };
}

// Generar rutas estáticas para los productos (opcional, para mejor performance)
export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getMockProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Obtener productos relacionados (misma categoría, excluyendo el actual)
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) =>
      p.categoryId === product.categoryId &&
      p.id !== product.id &&
      p.isActive &&
      p.stock > 0
  ).slice(0, 4);

  const currentPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <ProductBreadcrumbs product={product} />

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
          {/* Galería de Imágenes */}
          <div className="w-full">
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Información del Producto */}
          <div className="flex flex-col">
            <Card>
              <CardHeader>
                {/* Categoría y Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {product.category && (
                    <Link
                      href={`/productos?categoria=${product.category.slug}`}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {product.category.name}
                    </Link>
                  )}
                  {product.tags.length > 0 && (
                    <>
                      <span className="text-gray-400">•</span>
                      {product.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </>
                  )}
                </div>

                {/* Nombre del Producto */}
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </CardTitle>

                {/* SKU */}
                <p className="text-sm text-gray-500 mb-4">
                  SKU: <span className="font-mono">{product.sku}</span>
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Precio */}
                <div className="flex items-baseline gap-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-3xl md:text-4xl font-bold text-red-600">
                        ${currentPrice.toLocaleString('es-AR')}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        ${product.price.toLocaleString('es-AR')}
                      </span>
                      <Badge variant="destructive" className="text-sm">
                        -{product.discountPercentage}% OFF
                      </Badge>
                    </>
                  ) : (
                    <span className="text-3xl md:text-4xl font-bold text-gray-900">
                      ${currentPrice.toLocaleString('es-AR')}
                    </span>
                  )}
                </div>

                <Separator />

                {/* Descripción */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Descripción
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Especificaciones */}
                {(product.weight || product.dimensions) && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Especificaciones
                      </h3>
                      <div className="space-y-2 text-sm">
                        {product.weight && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Peso:</span>
                            <span className="font-medium text-gray-900">
                              {product.weight}g
                            </span>
                          </div>
                        )}
                        {product.dimensions && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dimensiones:</span>
                            <span className="font-medium text-gray-900">
                              {product.dimensions.width} x{' '}
                              {product.dimensions.height} x{' '}
                              {product.dimensions.depth} cm
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Stock */}
                <div>
                  {isOutOfStock ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="font-semibold">Sin Stock</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="font-medium">
                        {product.stock} unidades disponibles
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Selector de Cantidad y Botón Agregar */}
                <ProductQuantitySection
                  productName={product.name}
                  stock={product.stock}
                  isOutOfStock={isOutOfStock}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

