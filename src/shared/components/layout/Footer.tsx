import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="bg-[#FF5454] text-white mt-auto border-t border-[#E63939]"
      role="contentinfo"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información de la empresa */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-white">
              Snacks Ecommerce
            </h2>
            <p className="text-gray-100 text-sm">
              Tu distribuidor de snacks favorito. Encuentra los mejores
              productos al mejor precio.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <nav aria-label="Enlaces rápidos">
            <h2 className="text-lg font-bold mb-4 text-white">
              Enlaces Rápidos
            </h2>
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
          </nav>

          {/* Contacto */}
          <address className="not-italic">
            <h2 className="text-lg font-bold mb-4 text-white">Contacto</h2>
            <ul className="space-y-2 text-gray-100 text-sm">
              <li>
                <a
                  href="mailto:contacto@snacksecommerce.com"
                  className="hover:underline"
                  aria-label="Enviar correo electrónico"
                >
                  <span aria-hidden="true">📧</span> contacto@snacksecommerce.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+541112345678"
                  className="hover:underline"
                  aria-label="Llamar por teléfono"
                >
                  <span aria-hidden="true">📱</span> +54 11 1234-5678
                </a>
              </li>
              <li>
                <span aria-hidden="true">📍</span> Buenos Aires, Argentina
              </li>
            </ul>
          </address>
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
