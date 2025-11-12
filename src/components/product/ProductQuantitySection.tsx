'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import QuantitySelector from './QuantitySelector';

interface ProductQuantitySectionProps {
  productName: string;
  stock: number;
  isOutOfStock: boolean;
}

export default function ProductQuantitySection({
  productName,
  stock,
  isOutOfStock,
}: ProductQuantitySectionProps) {
  const [isQuantityValid, setIsQuantityValid] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const handleValidationChange = (isValid: boolean) => {
    setIsQuantityValid(isValid);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const isButtonDisabled = isOutOfStock || !isQuantityValid;

  return (
    <div className="space-y-4">
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
          defaultValue={1}
          disabled={isOutOfStock}
          onQuantityChange={handleQuantityChange}
          onValidationChange={handleValidationChange}
          aria-label="Cantidad de productos"
        />
      </div>

      <Button
        className="w-full bg-[#FF5454] hover:bg-[#E63939] text-white text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
        disabled={isButtonDisabled}
        aria-label={
          isOutOfStock
            ? 'Producto sin stock'
            : !isQuantityValid
            ? 'Cantidad inválida'
            : `Agregar ${productName} al carrito`
        }
      >
        {isOutOfStock ? (
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

