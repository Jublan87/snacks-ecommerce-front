'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/utils/utils';

interface QuantitySelectorProps {
  maxStock: number;
  defaultValue?: number;
  disabled?: boolean;
  onQuantityChange?: (quantity: number) => void;
  onValidationChange?: (isValid: boolean) => void;
  id?: string;
  'aria-label'?: string;
}

export default function QuantitySelector({
  maxStock,
  defaultValue = 1,
  disabled = false,
  onQuantityChange,
  onValidationChange,
  id = 'quantity',
  'aria-label': ariaLabel = 'Cantidad de productos',
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState<string>(defaultValue.toString());
  const [error, setError] = useState<string>('');
  const validationCallbackRef = useRef(onValidationChange);
  const quantityRef = useRef<string>(defaultValue.toString());

  // Actualizar la referencia del callback cuando cambia
  useEffect(() => {
    validationCallbackRef.current = onValidationChange;
  }, [onValidationChange]);

  // Inicializar validación al montar
  useEffect(() => {
    const currentValue = parseInt(defaultValue.toString(), 10);
    if (!isNaN(currentValue) && currentValue >= 1 && currentValue <= maxStock) {
      validationCallbackRef.current?.(true);
    }
  }, [defaultValue, maxStock]); // Revalidar cuando cambien defaultValue o maxStock

  // Actualizar ref cuando cambia quantity
  useEffect(() => {
    quantityRef.current = quantity;
  }, [quantity]);

  // Validar cuando cambia el stock máximo (revalidar el valor actual)
  useEffect(() => {
    const currentValue = parseInt(quantityRef.current, 10);
    // Solo validar si hay un valor numérico válido
    if (!isNaN(currentValue) && currentValue >= 1) {
      if (currentValue <= maxStock) {
        setError('');
        validationCallbackRef.current?.(true);
      } else {
        setError(`La cantidad no puede ser mayor a ${maxStock} unidades`);
        validationCallbackRef.current?.(false);
      }
    }
  }, [maxStock]); // Solo cuando cambia el stock máximo

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value);
    quantityRef.current = value; // Actualizar ref inmediatamente

    // Si el campo está vacío, deshabilitar botón pero no mostrar error todavía
    if (value === '' || value === '-') {
      setError('');
      validationCallbackRef.current?.(false);
      onQuantityChange?.(0);
      return;
    }

    const numValue = parseInt(value, 10);

    // Validar que sea un número válido
    if (isNaN(numValue) || numValue < 1) {
      setError('La cantidad debe ser mayor a 0');
      onQuantityChange?.(0);
      validationCallbackRef.current?.(false);
      return;
    }

    // Validar que no exceda el stock máximo
    if (numValue > maxStock) {
      setError(`La cantidad no puede ser mayor a ${maxStock} unidades`);
      onQuantityChange?.(0);
      validationCallbackRef.current?.(false);
      return;
    }

    // Si todo está bien, limpiar error y notificar cambio
    setError('');
    onQuantityChange?.(numValue);
    validationCallbackRef.current?.(true);
  };

  const handleBlur = () => {
    const numValue = parseInt(quantity, 10);

    // Si el campo está vacío o inválido al perder el foco, restaurar valor por defecto
    if (quantity === '' || isNaN(numValue) || numValue < 1) {
      setQuantity('1');
      setError('');
      onQuantityChange?.(1);
      validationCallbackRef.current?.(true);
      return;
    }

    // Si excede el máximo, mantener el error y no corregir automáticamente
    // El usuario debe corregir manualmente
    if (numValue > maxStock) {
      // Mantener el error y el valor, no corregir automáticamente
      setError(`La cantidad no puede ser mayor a ${maxStock} unidades`);
      validationCallbackRef.current?.(false);
      return;
    }

    // Si es válido, asegurar que el estado esté correcto
    if (numValue >= 1 && numValue <= maxStock) {
      setError('');
      validationCallbackRef.current?.(true);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Input
          id={id}
          type="number"
          min="1"
          max={maxStock}
          value={quantity}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            'w-24 text-center',
            error && 'border-red-500 focus-visible:ring-red-500'
          )}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <span className="text-sm text-gray-500">(máx. {maxStock})</span>
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <svg
            className="h-4 w-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
