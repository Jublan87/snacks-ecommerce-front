import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  getProductBySlug,
  getProducts,
} from '@features/product/services/product.service';
import type { Product } from '@features/product/types';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Separator } from '@shared/ui/separator';
import ProductCard from '@features/product/components/ProductCard';
import ProductImageGallery from '@features/product/components/ProductImageGallery';
import ProductBreadcrumbs from '@features/product/components/ProductBreadcrumbs';
import ProductQuantitySection from '@features/product/components/ProductQuantitySection';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);
    const currentPrice = product.discountPrice ?? product.salePrice;
    const description = product.shortDescription ?? product.description;

    return {
      title: `${product.name} - Snacks Ecommerce`,
      description,
      openGraph: {
        title: product.name,
        description,
        images: product.images.map((img) => ({
          url: img.url,
          alt: img.alt,
        })),
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description,
        images: product.images[0]?.url,
      },
    };
  } catch {
    return {
      title: 'Producto no encontrado',
      description: 'El producto que buscas no está disponible.',
    };
  }
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  // notFound() throws, but TypeScript needs an explicit type so it doesn't
  // widen `product` to `Product | undefined` after the catch block.
  let product: Product;
  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  const { items: relatedProducts } = await getProducts({
    category: product.categoryId,
    limit: 4,
    inStock: true,
  });

  const filteredRelated = relatedProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const currentPrice = product.discountPrice ?? product.salePrice;
  const hasDiscount = product.discountPrice !== null;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Breadcrumbs */}
        <ProductBreadcrumbs product={product} />

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mt-4 md:mt-6">
          {/* Galería de Imágenes */}
          <div className="w-full">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />
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
                      className="text-lg font-bold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {product.category.name}
                    </Link>
                  )}
                  {product.tags.length > 0 && (
                    <>
                      <span className="text-gray-400">•</span>
                      {product.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </>
                  )}
                </div>

                {/* Nombre del Producto */}
                <CardTitle className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                  {product.name}
                </CardTitle>

                {/* SKU */}
                <p className="text-base md:text-lg font-semibold text-gray-700 mb-3 md:mb-4">
                  SKU:{' '}
                  <span className="font-mono font-bold">{product.sku}</span>
                </p>
              </CardHeader>

              <CardContent className="space-y-4 md:space-y-6">
                {/* Precio */}
                <div className="flex flex-wrap items-baseline gap-2 md:gap-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-2xl md:text-4xl font-bold text-red-600">
                        ${currentPrice.toLocaleString('es-AR')}
                      </span>
                      <span className="text-lg md:text-xl text-gray-500 line-through">
                        ${product.salePrice.toLocaleString('es-AR')}
                      </span>
                      <div className="bg-red-600 text-white px-2 py-0.5 rounded font-bold text-xs shadow-md">
                        -{product.discountPercentage}% OFF
                      </div>
                    </>
                  ) : (
                    <span className="text-2xl md:text-4xl font-bold text-gray-900">
                      ${currentPrice.toLocaleString('es-AR')}
                    </span>
                  )}
                </div>

                <Separator />

                {/* Descripción */}
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-3 md:mb-4">
                    Descripción
                  </h3>
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base font-semibold">
                    {product.description}
                  </p>
                </div>

                {/* Especificaciones */}
                {(product.weight || product.dimensions) && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-3 md:mb-4">
                        Especificaciones
                      </h3>
                      <div className="space-y-3 md:space-y-4 text-base md:text-lg">
                        {product.weight && (
                          <div className="flex justify-between">
                            <span className="font-bold text-gray-800">
                              Peso:
                            </span>
                            <span className="font-bold text-gray-900">
                              {product.weight}g
                            </span>
                          </div>
                        )}
                        {product.dimensions && (
                          <div className="flex justify-between">
                            <span className="font-bold text-gray-800">
                              Dimensiones:
                            </span>
                            <span className="font-bold text-gray-900">
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
                      <span className="font-bold text-lg md:text-xl">
                        Sin Stock
                      </span>
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
                      <span className="font-bold text-lg md:text-xl">
                        {product.stock} unidades disponibles
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Selector de Cantidad y Botón Agregar */}
                <ProductQuantitySection product={product} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Productos Relacionados */}
        {filteredRelated.length > 0 && (
          <div className="mt-8 md:mt-16">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRelated.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
