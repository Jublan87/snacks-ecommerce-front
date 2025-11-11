'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-white hover:bg-[#CC0000] hover:text-white px-3 py-2 rounded-md transition-all duration-200 font-medium hover:scale-105"
            >
              Inicio
            </Link>
            <Link
              href="/productos"
              className="text-white hover:bg-[#CC0000] hover:text-white px-3 py-2 rounded-md transition-all duration-200 font-medium hover:scale-105"
            >
              Productos
            </Link>
            <Link
              href="/carrito"
              className="text-white hover:bg-[#CC0000] hover:text-white px-3 py-2 rounded-md transition-all duration-200 font-medium hover:scale-105"
            >
              Carrito
            </Link>
          </nav>

          {/* Cart Icon (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/carrito"
              className="relative p-2 text-white hover:bg-[#CC0000] rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Ver carrito"
            >
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
              {/* Badge de cantidad (por ahora vacío) */}
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0">
                0
              </span>
            </Link>
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
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 text-white hover:bg-[#E63939] hover:text-white transition-colors font-medium"
                >
                  Inicio
                </Link>
                <Link
                  href="/productos"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 text-white hover:bg-[#E63939] hover:text-white transition-colors font-medium"
                >
                  Productos
                </Link>
                <Link
                  href="/carrito"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 text-white hover:bg-[#E63939] hover:text-white transition-colors font-medium"
                >
                  Carrito
                </Link>
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
