'use client'; // Componente del cliente (necesita interactividad)

import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProductSearch from '@/components/filters/ProductSearch';
import { useSearch } from '@/contexts/SearchContext';
// useCartStore: Hook para obtener la cantidad de items en el carrito
import { useCartStore } from '@/lib/store/cart-store';
// CartDrawer: Componente del drawer lateral del carrito
import CartDrawer from './CartDrawer';

export default function Header() {
  // Estados para controlar la apertura/cierre de menús
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Menú móvil
  const [isCartOpen, setIsCartOpen] = useState(false); // Drawer del carrito
  const { searchQuery, setSearchQuery } = useSearch();
  // Obtener la cantidad total de items en el carrito (se actualiza automáticamente)
  const itemCount = useCartStore((state) => state.getItemCount());

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Función para abrir/cerrar el drawer del carrito
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <header className="bg-[#FF5454] sticky top-0 z-50 border-b border-[#E63939]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">🛒</span>
            <span className="text-xl font-bold text-white hidden sm:block">
              Snacks Ecommerce
            </span>
          </Link>

          {/* Desktop Navigation: Búsqueda y acciones */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-4">
            {/* Botón Productos */}
            <Link href="/productos">
              <Button
                variant="ghost"
                className="text-white hover:bg-[#CC0000] hover:text-white transition-all duration-200 hover:scale-105"
              >
                Productos
              </Button>
            </Link>

            {/* Barra de búsqueda */}
            <div className="flex-1 max-w-md">
              <ProductSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          </div>

          {/* Icono del Carrito (Desktop) */}
          <div className="hidden md:flex items-center">
            <button
              onClick={toggleCart} // Al hacer clic, abre el drawer del carrito
              className="relative p-2 text-white hover:bg-[#CC0000] rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Ver carrito"
            >
              {/* Icono SVG del carrito */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {/* Badge: Muestra la cantidad de items en el carrito
                  Solo se muestra si hay items (itemCount > 0)
                  Si hay más de 99, muestra "99+" */}
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-in fade-in zoom-in-50"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </Badge>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-white hover:text-gray-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
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
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Drawer */}
            <div className="fixed top-16 left-0 right-0 bg-[#FF5454] shadow-lg z-50 md:hidden animate-slide-down border-b border-[#E63939]">
              <nav className="flex flex-col py-4">
                <div className="px-4 mb-4">
                  <ProductSearch
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </div>
                <Link
                  href="/productos"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 text-white hover:bg-[#E63939] hover:text-white transition-colors font-medium"
                >
                  Productos
                </Link>
                {/* Botón del carrito en menú móvil */}
                <button
                  onClick={() => {
                    closeMobileMenu(); // Cierra el menú móvil
                    toggleCart(); // Abre el drawer del carrito
                  }}
                  className="relative px-4 py-3 text-white hover:bg-[#E63939] hover:text-white transition-colors font-medium flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Carrito
                  {/* Badge con cantidad también en móvil */}
                  {itemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </Badge>
                  )}
                </button>
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Cart Drawer: Drawer lateral que muestra el contenido del carrito
          isOpen: Controla si está abierto o cerrado
          onClose: Función que se ejecuta al cerrar el drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
