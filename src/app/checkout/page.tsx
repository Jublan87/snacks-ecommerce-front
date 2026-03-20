'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ProtectedRoute from '@features/auth/components/ProtectedRoute';

import { useCartStore } from '@features/cart/store/cart-store';
import { useCartCalculations } from '@features/cart/hooks/useCartCalculations';
import { calculateShipping } from '@features/shipping/services/shipping.service';
import type { ShippingCalculationResult } from '@features/shipping/services/shipping.service';
import { useAuthStore } from '@features/auth/store/auth-store';
import { useOrderStore } from '@features/order/store/order-store';
import { createOrderSafe } from '@features/order/actions/order.actions';
import type { CreateOrderPayload } from '@features/order/types';
import {
  checkoutFormSchema,
  type CheckoutFormInput,
} from '@features/checkout/schemas/checkout.schema';
import { PaymentMethod } from '@features/checkout/types';
import {
  getSavedShippingAddress,
  saveShippingAddress,
} from '@features/checkout/utils/storage.utils';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select';
import { Separator } from '@shared/ui/separator';
import CartItem from '@features/cart/components/CartItem';
import { useCartActions } from '@features/cart/hooks/useCartActions';

// Default shipping state while the async calculation is in flight
const DEFAULT_SHIPPING: ShippingCalculationResult = {
  shipping: 0,
  freeShippingThreshold: 10000,
  isFreeShipping: false,
  amountNeededForFreeShipping: 10000,
};

function CheckoutPageContent() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const { subtotal } = useCartCalculations();
  const { handleQuantityChange, handleRemoveItem } = useCartActions({
    showToasts: false,
  });
  const user = useAuthStore((state) => state.user);
  const upsertOrder = useOrderStore((state) => state.upsertOrder);

  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [shippingCalculation, setShippingCalculation] =
    useState<ShippingCalculationResult>(DEFAULT_SHIPPING);

  // Formulario con React Hook Form y validación Zod
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      shippingAddress: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        notes: '',
      },
      paymentMethod: 'credit_card',
    },
  });

  const postalCode = watch('shippingAddress.postalCode');
  const paymentMethod = watch('paymentMethod');
  const shippingAddress = watch('shippingAddress');

  // Cargar dirección guardada al montar
  useEffect(() => {
    if (user?.shippingAddress) {
      const a = user.shippingAddress;
      setValue('shippingAddress.firstName', a.firstName);
      setValue('shippingAddress.lastName', a.lastName);
      setValue('shippingAddress.email', a.email);
      setValue('shippingAddress.phone', a.phone);
      setValue('shippingAddress.address', a.address);
      setValue('shippingAddress.city', a.city);
      setValue('shippingAddress.province', a.province);
      setValue('shippingAddress.postalCode', a.postalCode);
      if (a.notes) setValue('shippingAddress.notes', a.notes);
    } else {
      const saved = getSavedShippingAddress();
      if (saved) {
        setValue('shippingAddress.firstName', saved.firstName);
        setValue('shippingAddress.lastName', saved.lastName);
        setValue('shippingAddress.email', saved.email);
        setValue('shippingAddress.phone', saved.phone);
        setValue('shippingAddress.address', saved.address);
        setValue('shippingAddress.city', saved.city);
        setValue('shippingAddress.province', saved.province);
        setValue('shippingAddress.postalCode', saved.postalCode);
        if (saved.notes) setValue('shippingAddress.notes', saved.notes);
      } else if (user) {
        setValue('shippingAddress.firstName', user.firstName);
        setValue('shippingAddress.lastName', user.lastName);
        setValue('shippingAddress.email', user.email);
        if (user.phone) setValue('shippingAddress.phone', user.phone);
      }
    }
  }, [setValue, user]);

  // Guardar dirección con debounce cuando cambia el código postal
  useEffect(() => {
    if (!postalCode || !shippingAddress.postalCode) return;
    const id = setTimeout(() => saveShippingAddress(shippingAddress), 500);
    return () => clearTimeout(id);
  }, [postalCode, shippingAddress]);

  // Recalcular envío de forma async cada vez que cambia el subtotal o código postal
  useEffect(() => {
    let cancelled = false;

    calculateShipping({ subtotal, postalCode: postalCode || undefined })
      .then((result) => {
        if (!cancelled) setShippingCalculation(result);
      })
      .catch(() => {
        // keep previous value on transient errors
      });

    return () => {
      cancelled = true;
    };
  }, [subtotal, postalCode]);

  const total = subtotal + shippingCalculation.shipping;

  // Redirigir si el carrito queda vacío
  useEffect(() => {
    if (items.length === 0 && !isSubmitting && !isProcessingOrder) {
      toast.error('Tu carrito está vacío');
      router.push('/carrito');
    }
  }, [items.length, router, isSubmitting, isProcessingOrder]);

  const onSubmit = async (data: CheckoutFormInput) => {
    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      router.push('/carrito');
      return;
    }

    if (!user) {
      toast.error('Debes iniciar sesión para completar la compra');
      router.push('/login');
      return;
    }

    setIsProcessingOrder(true);

    try {
      saveShippingAddress(data.shippingAddress);

      // Build the payload matching CreateOrderDto on the backend:
      // items only need productId + quantity (backend calculates price from DB)
      const payload: CreateOrderPayload = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod as CreateOrderPayload['paymentMethod'],
        notes: data.shippingAddress.notes || undefined,
      };

      const result = await createOrderSafe(payload);

      if (!result.success) {
        setIsProcessingOrder(false);
        toast.error(result.message);
        return;
      }

      // Cache the created order so the confirmation page can display it
      upsertOrder(result.order);

      const orderNumber = result.order.orderNumber;

      // Clear cart after successful order
      clearCart();

      toast.success('¡Pedido creado exitosamente!');

      // Use window.location to avoid the empty-cart redirect firing on the way out
      window.location.href = `/checkout/confirmacion?orderNumber=${orderNumber}`;
    } catch {
      setIsProcessingOrder(false);
      toast.error('Error al procesar el checkout. Intenta nuevamente.');
    }
  };

  if (items.length === 0) {
    return null; // El useEffect redirigirá
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <Link href="/carrito">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                aria-label="Volver al carrito"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                Checkout
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
                Completa tu información para finalizar la compra
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Formulario - Columna izquierda */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Dirección de envío */}
              <Card>
                <CardHeader>
                  <CardTitle id="shipping-address-title">
                    Dirección de envío
                  </CardTitle>
                  <CardDescription>
                    Ingresa la dirección donde deseas recibir tu pedido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nombre *
                      </label>
                      <Input
                        id="firstName"
                        {...register('shippingAddress.firstName')}
                        className={
                          errors.shippingAddress?.firstName
                            ? 'border-red-500'
                            : ''
                        }
                        aria-invalid={
                          errors.shippingAddress?.firstName ? 'true' : 'false'
                        }
                        aria-describedby={
                          errors.shippingAddress?.firstName
                            ? 'firstName-error'
                            : undefined
                        }
                      />
                      {errors.shippingAddress?.firstName && (
                        <p
                          id="firstName-error"
                          className="text-red-500 text-sm mt-1"
                          role="alert"
                        >
                          {errors.shippingAddress.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Apellido *
                      </label>
                      <Input
                        id="lastName"
                        {...register('shippingAddress.lastName')}
                        className={
                          errors.shippingAddress?.lastName
                            ? 'border-red-500'
                            : ''
                        }
                        aria-invalid={
                          errors.shippingAddress?.lastName ? 'true' : 'false'
                        }
                        aria-describedby={
                          errors.shippingAddress?.lastName
                            ? 'lastName-error'
                            : undefined
                        }
                      />
                      {errors.shippingAddress?.lastName && (
                        <p
                          id="lastName-error"
                          className="text-red-500 text-sm mt-1"
                          role="alert"
                        >
                          {errors.shippingAddress.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      {...register('shippingAddress.email')}
                      className={
                        errors.shippingAddress?.email ? 'border-red-500' : ''
                      }
                      aria-invalid={
                        errors.shippingAddress?.email ? 'true' : 'false'
                      }
                      aria-describedby={
                        errors.shippingAddress?.email
                          ? 'email-error'
                          : undefined
                      }
                    />
                    {errors.shippingAddress?.email && (
                      <p
                        id="email-error"
                        className="text-red-500 text-sm mt-1"
                        role="alert"
                      >
                        {errors.shippingAddress.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Teléfono *
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register('shippingAddress.phone')}
                      className={
                        errors.shippingAddress?.phone ? 'border-red-500' : ''
                      }
                      aria-invalid={
                        errors.shippingAddress?.phone ? 'true' : 'false'
                      }
                      aria-describedby={
                        errors.shippingAddress?.phone
                          ? 'phone-error'
                          : undefined
                      }
                    />
                    {errors.shippingAddress?.phone && (
                      <p
                        id="phone-error"
                        className="text-red-500 text-sm mt-1"
                        role="alert"
                      >
                        {errors.shippingAddress.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Dirección *
                    </label>
                    <Input
                      id="address"
                      {...register('shippingAddress.address')}
                      className={
                        errors.shippingAddress?.address ? 'border-red-500' : ''
                      }
                      aria-invalid={
                        errors.shippingAddress?.address ? 'true' : 'false'
                      }
                      aria-describedby={
                        errors.shippingAddress?.address
                          ? 'address-error'
                          : undefined
                      }
                    />
                    {errors.shippingAddress?.address && (
                      <p
                        id="address-error"
                        className="text-red-500 text-sm mt-1"
                        role="alert"
                      >
                        {errors.shippingAddress.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Ciudad *
                      </label>
                      <Input
                        id="city"
                        {...register('shippingAddress.city')}
                        className={
                          errors.shippingAddress?.city ? 'border-red-500' : ''
                        }
                        aria-invalid={
                          errors.shippingAddress?.city ? 'true' : 'false'
                        }
                        aria-describedby={
                          errors.shippingAddress?.city
                            ? 'city-error'
                            : undefined
                        }
                      />
                      {errors.shippingAddress?.city && (
                        <p
                          id="city-error"
                          className="text-red-500 text-sm mt-1"
                          role="alert"
                        >
                          {errors.shippingAddress.city.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="province"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Provincia *
                      </label>
                      <Input
                        id="province"
                        {...register('shippingAddress.province')}
                        className={
                          errors.shippingAddress?.province
                            ? 'border-red-500'
                            : ''
                        }
                        aria-invalid={
                          errors.shippingAddress?.province ? 'true' : 'false'
                        }
                        aria-describedby={
                          errors.shippingAddress?.province
                            ? 'province-error'
                            : undefined
                        }
                      />
                      {errors.shippingAddress?.province && (
                        <p
                          id="province-error"
                          className="text-red-500 text-sm mt-1"
                          role="alert"
                        >
                          {errors.shippingAddress.province.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="postalCode"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Código Postal *
                      </label>
                      <Input
                        id="postalCode"
                        {...register('shippingAddress.postalCode')}
                        className={
                          errors.shippingAddress?.postalCode
                            ? 'border-red-500'
                            : ''
                        }
                        aria-invalid={
                          errors.shippingAddress?.postalCode ? 'true' : 'false'
                        }
                        aria-describedby={
                          errors.shippingAddress?.postalCode
                            ? 'postalCode-error'
                            : undefined
                        }
                      />
                      {errors.shippingAddress?.postalCode && (
                        <p
                          id="postalCode-error"
                          className="text-red-500 text-sm mt-1"
                          role="alert"
                        >
                          {errors.shippingAddress.postalCode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Notas adicionales (opcional)
                    </label>
                    <Input
                      id="notes"
                      {...register('shippingAddress.notes')}
                      placeholder="Instrucciones especiales para la entrega"
                    />
                    {errors.shippingAddress?.notes && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.shippingAddress.notes.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Método de pago */}
              <Card>
                <CardHeader>
                  <CardTitle>Método de pago</CardTitle>
                  <CardDescription>
                    Selecciona cómo deseas pagar tu pedido
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <label
                      htmlFor="payment-method"
                      className="block text-sm font-medium text-gray-700 mb-1 sr-only"
                    >
                      Método de pago
                    </label>
                    <Select
                      value={paymentMethod}
                      onValueChange={(value) =>
                        setValue('paymentMethod', value as PaymentMethod)
                      }
                    >
                      <SelectTrigger
                        id="payment-method"
                        className={
                          errors.paymentMethod ? 'border-red-500' : ''
                        }
                        aria-invalid={
                          errors.paymentMethod ? 'true' : 'false'
                        }
                        aria-describedby={
                          errors.paymentMethod
                            ? 'payment-method-error'
                            : undefined
                        }
                      >
                        <SelectValue placeholder="Selecciona un método de pago" />
                      </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">
                        Tarjeta de Crédito
                      </SelectItem>
                      <SelectItem value="debit_card">
                        Tarjeta de Débito
                      </SelectItem>
                      <SelectItem value="cash_on_delivery">
                        Contra Entrega
                      </SelectItem>
                      <SelectItem value="bank_transfer">
                        Transferencia Bancaria
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && (
                    <p
                      id="payment-method-error"
                      className="text-red-500 text-sm mt-1"
                      role="alert"
                    >
                      {errors.paymentMethod.message}
                    </p>
                  )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumen - Columna derecha */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items del carrito */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        variant="compact"
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </div>

                  <Separator />

                  {/* Totales */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        ${subtotal.toLocaleString('es-AR')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Envío</span>
                      <span className="font-medium">
                        {shippingCalculation.isFreeShipping ? (
                          <span className="text-green-600">Gratis</span>
                        ) : (
                          `$${shippingCalculation.shipping.toLocaleString(
                            'es-AR'
                          )}`
                        )}
                      </span>
                    </div>
                    {!shippingCalculation.isFreeShipping && (
                      <p className="text-xs text-gray-500">
                        Faltan $
                        {shippingCalculation.amountNeededForFreeShipping.toLocaleString(
                          'es-AR'
                        )}{' '}
                        para envío gratis
                      </p>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toLocaleString('es-AR')}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting || isProcessingOrder}
                    aria-label={
                      isSubmitting || isProcessingOrder
                        ? 'Procesando pedido'
                        : 'Confirmar pedido'
                    }
                  >
                    {isSubmitting || isProcessingOrder
                      ? 'Procesando...'
                      : 'Confirmar pedido'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutPageContent />
    </ProtectedRoute>
  );
}
