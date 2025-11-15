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
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean; // Si el drawer está abierto
  onClose: () => void; // Función para cerrar el drawer
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // Obtener datos y funciones del store de Zustand
  const items = useCartStore((state) => state.items); // Lista de productos en el carrito
  const updateQuantity = useCartStore((state) => state.updateQuantity); // Actualizar cantidad de un item
  const removeItem = useCartStore((state) => state.removeItem); // Eliminar un item del carrito
  const clearCart = useCartStore((state) => state.clearCart); // Limpiar todo el carrito (no se usa aquí, pero está disponible)

  // Calcular totales del carrito
  // reduce: Suma todos los items multiplicando precio por cantidad
  // Usa discountPrice si existe, sino usa price
  const subtotal = items.reduce(
    (total, item) =>
      total +
      (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  // Envío gratis si el subtotal es mayor o igual a $10,000
  // Si no, el envío cuesta $1,500
  const shipping = subtotal >= 10000 ? 0 : 1500;
  const total = subtotal + shipping; // Total final

  // Función para cambiar la cantidad de un item
  // Se ejecuta al hacer clic en los botones + o -
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    try {
      updateQuantity(itemId, newQuantity); // Actualiza en el store
    } catch (error) {
      if (error instanceof Error) {
        // El error ya se maneja en el store (validación de stock)
        console.error(error.message);
      }
    }
  };

  // Función para eliminar un item del carrito
  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

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
          {/* Si el carrito está vacío, mostrar mensaje */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500 mb-6">
                Agrega productos para comenzar tu compra
              </p>
              <Button
                onClick={onClose} // Cierra el drawer al hacer clic
                className="bg-[#FF5454] hover:bg-[#E63939]"
              >
                Explorar Productos
              </Button>
            </div>
          ) : (
            // Si hay items, mostrar la lista
            <div className="space-y-4">
              {/* map: Recorre cada item del carrito y lo muestra */}
              {items.map((item) => {
                // Precio actual: usa discountPrice si existe, sino price
                const currentPrice =
                  item.product.discountPrice || item.product.price;
                // Total del item: precio * cantidad
                const itemTotal = currentPrice * item.quantity;

                return (
                  <div
                    key={item.id} // key: Necesario para React cuando se usa map
                    className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* Imagen del producto (clickeable para ir al detalle) */}
                    <Link
                      href={`/productos/${item.product.slug}`}
                      onClick={onClose} // Cierra el drawer al hacer clic
                      className="flex-shrink-0"
                    >
                      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={
                            item.product.images[0]?.url || '/placeholder.png'
                          }
                          alt={item.product.images[0]?.alt || item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </Link>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/productos/${item.product.slug}`}
                        onClick={onClose}
                        className="block"
                      >
                        <h4 className="font-semibold text-gray-900 truncate hover:text-[#FF5454] transition-colors">
                          {item.product.name}
                        </h4>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        ${currentPrice.toLocaleString('es-AR')} c/u
                      </p>

                      {/* Controles de cantidad: botones + y - */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          {/* Botón para reducir cantidad */}
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1} // Deshabilitado si la cantidad es 1
                            aria-label="Reducir cantidad"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          {/* Muestra la cantidad actual */}
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          {/* Botón para aumentar cantidad */}
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={
                              item.quantity >= item.product.stock // Deshabilitado si alcanzó el stock máximo
                            }
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Total del item y botón eliminar */}
                        <div className="flex items-center gap-2">
                          {/* Total: precio unitario * cantidad */}
                          <span className="font-bold text-gray-900">
                            ${itemTotal.toLocaleString('es-AR')}
                          </span>
                          {/* Botón para eliminar el item del carrito */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveItem(item.id)}
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Resumen y totales (solo se muestra si hay items) */}
        {items.length > 0 && (
          <>
            <Separator />
            <div className="px-6 py-4 space-y-3 border-t bg-gray-50">
              {/* Subtotal: suma de todos los items */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ${subtotal.toLocaleString('es-AR')}
                </span>
              </div>
              {/* Costo de envío */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    `$${shipping.toLocaleString('es-AR')}`
                  )}
                </span>
              </div>
              {/* Mensaje motivacional si falta para envío gratis */}
              {subtotal < 10000 && (
                <p className="text-xs text-gray-500">
                  Agrega ${(10000 - subtotal).toLocaleString('es-AR')} más para
                  envío gratis
                </p>
              )}
              <Separator />
              {/* Total final: subtotal + envío */}
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toLocaleString('es-AR')}</span>
              </div>
              {/* Botones de acción */}
              <div className="flex gap-2 pt-2">
                {/* Cierra el drawer y sigue navegando */}
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Seguir Comprando
                </Button>
                {/* Navega a la página completa del carrito */}
                <Link href="/carrito" className="flex-1" onClick={onClose}>
                  <Button className="w-full bg-[#FF5454] hover:bg-[#E63939]">
                    Ir a Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
