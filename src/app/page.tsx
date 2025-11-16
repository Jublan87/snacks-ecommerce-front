import ProductCard from '@/features/product/components/ProductCard';
import { MOCK_PRODUCTS } from '@/features/product/mocks/products.mock';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Diseño compacto y centrado */}
      <div className="pt-6 pb-8 md:pt-8 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-b from-[#CC0000] via-[#FF5454] to-[#FF6B6B] rounded-2xl shadow-2xl overflow-hidden relative">
            {/* Patrón decorativo de fondo */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px',
                }}
              ></div>
            </div>

            {/* Contenido */}
            <div className="relative px-8 py-10 md:px-12 md:py-14 text-center text-white">
              <div className="mb-4">
                <span className="text-6xl md:text-7xl">🛒</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                Snacks Ecommerce
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-medium">
                Tu distribuidor de snacks favorito
              </p>

              {/* Elementos decorativos */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Destacados */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Productos Destacados
        </h2>

        {/* Grilla de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
