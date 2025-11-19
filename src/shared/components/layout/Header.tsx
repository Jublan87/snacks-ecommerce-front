'use client'; // Componente del cliente (necesita interactividad)

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, LogIn, Package } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import ProductSearch from '@/features/filters/components/ProductSearch';
import { useSearch } from '@/shared/contexts/SearchContext';
// useCartStore: Hook para obtener la cantidad de items en el carrito
import { useCartStore } from '@/features/cart/store/cart-store';
// CartDrawer: Componente del drawer lateral del carrito
import CartDrawer from '@/features/cart/components/CartDrawer';
// Auth store
import { useAuthStore } from '@/features/auth/store/auth-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

export default function Header() {
  const router = useRouter();
  // Estados para controlar la apertura/cierre de menús
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Menú móvil
  const [isCartOpen, setIsCartOpen] = useState(false); // Drawer del carrito
  const [mounted, setMounted] = useState(false); // Para evitar error de hidratación
  const { searchQuery, setSearchQuery } = useSearch();
  // Obtener la cantidad total de items en el carrito (se actualiza automáticamente)
  const itemCount = useCartStore((state) => state.getItemCount());
  // Auth state
  const { user, isAuthenticated, logout } = useAuthStore();

  // Esperar a que el componente se monte en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada exitosamente');
    router.push('/');
    router.refresh();
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
                className="text-white hover:bg-[#CC0000] hover:text-white transition-all duration-200 hover:scale-105 text-base font-semibold"
              >
                Todos los productos
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

          {/* Icono del Carrito y Autenticación (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Menú de Usuario o Botón de Login */}
            {mounted && isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-[#CC0000] hover:text-white transition-all duration-200 hover:scale-105"
                  >
                    <User className="w-5 h-5 mr-2" />
                    <span className="text-base font-semibold">
                      {user.firstName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/perfil/pedidos" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Mis Pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-[#CC0000] hover:text-white transition-all duration-200 hover:scale-105"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  <span className="text-base font-semibold">
                    Iniciar Sesión
                  </span>
                </Button>
              </Link>
            )}

            {/* Botón del Carrito */}
            <button
              onClick={toggleCart} // Al hacer clic, abre el drawer del carrito
              className="relative flex items-center gap-2 px-3 py-2 text-white hover:bg-[#CC0000] rounded-full transition-all duration-200 hover:scale-105"
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
              <span className="text-base font-semibold">Mi carrito</span>
              {/* Badge: Muestra la cantidad de items en el carrito
                  Solo se muestra si hay items (itemCount > 0)
                  Si hay más de 99, muestra "99+" */}
              {mounted && itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-in fade-in zoom-in-50 bg-red-600 text-white border-transparent">
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
                  className="px-4 py-3 text-white hover:bg-[#E63939] hover:text-white transition-colors text-base font-semibold"
                >
                  Todos los productos
                </Link>
                {/* Autenticación en menú móvil */}
                {mounted && isAuthenticated && user ? (
                  <>
                    <Link
                      href="/perfil"
                      onClick={closeMobileMenu}
                      className="px-4 py-3 text-white hover:bg-[#E63939] hover:text-white transition-colors text-base font-semibold flex items-center gap-2"
                    >
                      <User className="w-5 h-5" />
                      Mi Perfil
                    </Link>
                    <Link
                      href="/perfil/pedidos"
                      onClick={closeMobileMenu}
                      className="px-4 py-3 text-white hover:bg-[#E63939] hover:text-white transition-colors text-base font-semibold flex items-center gap-2"
                    >
                      <Package className="w-5 h-5" />
                      Mis Pedidos
                    </Link>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        handleLogout();
                      }}
                      className="px-4 py-3 text-white hover:bg-[#E63939] hover:text-white transition-colors text-base font-semibold flex items-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="px-4 py-3 text-white hover:bg-[#E63939] hover:text-white transition-colors text-base font-semibold flex items-center gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    Iniciar Sesión
                  </Link>
                )}
                {/* Botón del carrito en menú móvil */}
                <button
                  onClick={() => {
                    closeMobileMenu(); // Cierra el menú móvil
                    toggleCart(); // Abre el drawer del carrito
                  }}
                  className="relative px-4 py-3 text-white hover:bg-[#E63939] hover:text-white transition-colors text-base font-semibold flex items-center gap-2"
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
                  Mi carrito
                  {/* Badge con cantidad también en móvil */}
                  {mounted && itemCount > 0 && (
                    <Badge className="h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 text-white border-transparent">
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
