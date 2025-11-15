'use client'; // Componente del cliente (necesita interactividad)

import { useCartStore } from '@/lib/store/cart-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useCartCalculations } from '@/hooks/useCartCalculations';
import { useCartActions } from '@/hooks/useCartActions';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import CartEmptyState from '@/components/cart/CartEmptyState';

interface CartDrawerProps {
  isOpen: boolean; // Si el drawer está abierto
  onClose: () => void; // Función para cerrar el drawer
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // Obtener items del carrito
  const items = useCartStore((state) => state.items);

  // Calcular totales usando hook reutilizable
  const { subtotal, shippingCalculation, total } = useCartCalculations();

  // Obtener acciones usando hook reutilizable (sin toasts para drawer)
  const { handleQuantityChange, handleRemoveItem } = useCartActions({
    showToasts: false,
  });

  return (
    // Dialog: Componente de Shadcn/ui que crea un modal/drawer
    // open: Controla si está visible
    // onOpenChange: Se ejecuta cuando cambia el estado (abrir/cerrar)
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* DialogContent: Contenedor del drawer
          Las clases con ! fuerzan estilos para sobrescribir los del Dialog por defecto
          !fixed !right-0: Fija el drawer en el lado derecho
          data-[state=open]:slide-in-from-right: Animación de entrada desde la derecha */}
      <DialogContent className="!fixed !right-0 !top-0 !left-auto !translate-x-0 !translate-y-0 !w-full sm:!max-w-[500px] !max-h-screen !h-full !flex !flex-col !p-0 !rounded-l-lg !rounded-r-none !border-r-0 data-[state=open]:!slide-in-from-right data-[state=closed]:!slide-out-to-right">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">
            Tu Carrito ({items.length} {items.length === 1 ? 'item' : 'items'})
          </DialogTitle>
        </DialogHeader>

        {/* Contenido scrolleable del carrito */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Si el carrito está vacío, mostrar componente reutilizable */}
          {items.length === 0 ? (
            <CartEmptyState variant="drawer" onActionClick={onClose} />
          ) : (
            // Si hay items, mostrar la lista usando componente reutilizable
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  variant="compact"
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  onItemClick={onClose}
                />
              ))}
            </div>
          )}
        </div>

        {/* Resumen y totales (solo se muestra si hay items) */}
        {items.length > 0 && (
          <>
            <Separator />
            <CartSummary
              subtotal={subtotal}
              shippingCalculation={shippingCalculation}
              variant="simple"
              actions={
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onClose}
                  >
                    Seguir Comprando
                  </Button>
                  <Link href="/carrito" className="flex-1" onClick={onClose}>
                    <Button className="w-full bg-[#FF5454] hover:bg-[#E63939]">
                      Ir a Checkout
                    </Button>
                  </Link>
                </div>
              }
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
