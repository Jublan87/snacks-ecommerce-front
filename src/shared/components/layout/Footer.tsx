import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#FF5454] text-white mt-auto border-t border-[#E63939]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información de la empresa */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">
              Snacks Ecommerce
            </h3>
            <p className="text-gray-100 text-sm">
              Tu distribuidor de snacks favorito. Encuentra los mejores
              productos al mejor precio.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-100 hover:text-white transition-colors text-sm"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/productos"
                  className="text-gray-100 hover:text-white transition-colors text-sm"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/carrito"
                  className="text-gray-100 hover:text-white transition-colors text-sm"
                >
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contacto</h3>
            <ul className="space-y-2 text-gray-100 text-sm">
              <li>📧 contacto@snacksecommerce.com</li>
              <li>📱 +54 11 1234-5678</li>
              <li>📍 Buenos Aires, Argentina</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#E63939] mt-8 pt-8 text-center text-gray-200 text-sm">
          <p>
            © {new Date().getFullYear()} Snacks Ecommerce. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
