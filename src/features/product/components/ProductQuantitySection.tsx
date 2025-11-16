'use client'; // Indica que este componente se ejecuta en el cliente (necesario para hooks y eventos)

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import QuantitySelector from './QuantitySelector';
import { Product } from '@/features/product/types';
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';

interface ProductQuantitySectionProps {
  product: Product;
}

export default function ProductQuantitySection({
  product,
}: ProductQuantitySectionProps) {
  // Estados locales del componente
  const [isQuantityValid, setIsQuantityValid] = useState(true); // Si la cantidad ingresada es válida
  const [quantity, setQuantity] = useState(1); // Cantidad seleccionada por el usuario

  // Usar el hook personalizado para manejar la lógica de agregar al carrito
  // La cantidad se pasa dinámicamente cuando se hace clic
  const { handleAddToCart, isAdding, isOutOfStock } = useAddToCart({
    product,
    quantity, // Usa la cantidad del estado local
  });

  const stock = product.stock;

  const handleValidationChange = (isValid: boolean) => {
    setIsQuantityValid(isValid);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  // Función que se ejecuta al hacer clic en "Agregar al Carrito"
  // Pasa la cantidad actual al hook
  const onAddToCart = () => {
    // Validaciones: no hacer nada si no hay stock, cantidad inválida o ya está agregando
    if (isOutOfStock || !isQuantityValid || isAdding) return;
    // Llamar a la función del hook con la cantidad actual
    handleAddToCart(quantity);
  };

  // El botón está deshabilitado si: no hay stock, cantidad inválida o está agregando
  const isButtonDisabled = isOutOfStock || !isQuantityValid || isAdding;

  return (
    <div className="space-y-4">
      {/* Selector de cantidad */}
      <div>
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Cantidad
        </label>
        <QuantitySelector
          id="quantity"
          maxStock={stock}
          defaultValue={quantity}
          disabled={isOutOfStock}
          onQuantityChange={handleQuantityChange} // Se ejecuta cuando cambia la cantidad
          onValidationChange={handleValidationChange} // Se ejecuta cuando la validación cambia
          aria-label="Cantidad de productos"
        />
      </div>

      {/* Botón para agregar al carrito */}
      <Button
        size="lg"
        disabled={isButtonDisabled}
        onClick={onAddToCart} // Ejecuta la función al hacer clic
        aria-label={
          isOutOfStock
            ? 'Producto sin stock'
            : !isQuantityValid
            ? 'Cantidad inválida'
            : `Agregar ${product.name} al carrito`
        }
        // Clases CSS: colores, animaciones de hover y escala
        // hover:scale: crece ligeramente al pasar el mouse
        // active:scale: se reduce al hacer clic (efecto de "presionar")
        className={`w-full bg-[#FF5454] hover:bg-[#E63939] text-white text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
          !isButtonDisabled
            ? 'hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
            : ''
        }`}
      >
        {/* Mostrar diferentes estados del botón según la situación */}
        {isAdding ? (
          // Estado: Agregando (muestra spinner de carga)
          <>
            <svg
              className="animate-spin h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Agregando...
          </>
        ) : isOutOfStock ? (
          // Estado: Sin stock (muestra icono de X)
          <>
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
            Sin Stock
          </>
        ) : (
          // Estado: Normal (muestra icono de carrito)
          <>
            <svg
              className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
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
            Agregar al Carrito
          </>
        )}
      </Button>
    </div>
  );
}
