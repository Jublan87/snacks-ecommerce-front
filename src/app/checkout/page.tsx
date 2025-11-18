'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';

import { useCartStore } from '@/features/cart/store/cart-store';
import { useCartCalculations } from '@/features/cart/hooks/useCartCalculations';
import { calculateShipping } from '@/features/shipping/services/shipping.service';
import { useAuthStore } from '@/features/auth/store/auth-store';
import {
  checkoutFormSchema,
  type CheckoutFormInput,
} from '@/features/checkout/schemas/checkout.schema';
import {
  getSavedShippingAddress,
  saveShippingAddress,
} from '@/features/checkout/utils/storage.utils';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import CartItem from '@/features/cart/components/CartItem';
import { useCartActions } from '@/features/cart/hooks/useCartActions';

function CheckoutPageContent() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const { subtotal } = useCartCalculations();
  const { handleQuantityChange, handleRemoveItem } = useCartActions({
    showToasts: false,
  });
  const user = useAuthStore((state) => state.user);

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

  // Observar código postal para recalcular envío
  const postalCode = watch('shippingAddress.postalCode');
  const paymentMethod = watch('paymentMethod');
  const shippingAddress = watch('shippingAddress');

  // Cargar dirección guardada al montar el componente
  // Prioridad: 1. Usuario autenticado con dirección guardada, 2. Dirección en localStorage
  useEffect(() => {
    // Si el usuario está autenticado y tiene dirección guardada, usarla
    if (user?.shippingAddress) {
      const userAddress = user.shippingAddress;
      setValue('shippingAddress.firstName', userAddress.firstName);
      setValue('shippingAddress.lastName', userAddress.lastName);
      setValue('shippingAddress.email', userAddress.email);
      setValue('shippingAddress.phone', userAddress.phone);
      setValue('shippingAddress.address', userAddress.address);
      setValue('shippingAddress.city', userAddress.city);
      setValue('shippingAddress.province', userAddress.province);
      setValue('shippingAddress.postalCode', userAddress.postalCode);
      if (userAddress.notes) {
        setValue('shippingAddress.notes', userAddress.notes);
      }
    } else {
      // Si no hay usuario con dirección, intentar cargar desde localStorage
      const savedAddress = getSavedShippingAddress();
      if (savedAddress) {
        Object.entries(savedAddress).forEach(([key, value]) => {
          setValue(
            `shippingAddress.${key as keyof typeof savedAddress}` as any,
            value
          );
        });
      } else if (user) {
        // Si hay usuario pero sin dirección guardada, precargar datos básicos
        setValue('shippingAddress.firstName', user.firstName);
        setValue('shippingAddress.lastName', user.lastName);
        setValue('shippingAddress.email', user.email);
        if (user.phone) {
          setValue('shippingAddress.phone', user.phone);
        }
      }
    }
  }, [setValue, user]);

  // Guardar dirección cuando cambie el código postal (con debounce implícito)
  useEffect(() => {
    if (postalCode && shippingAddress.postalCode) {
      // Solo guardar si hay código postal válido
      const timeoutId = setTimeout(() => {
        saveShippingAddress(shippingAddress);
      }, 500); // Debounce de 500ms para evitar guardados excesivos

      return () => clearTimeout(timeoutId);
    }
  }, [postalCode, shippingAddress]);

  // Calcular envío basado en código postal
  const shippingCalculation = useMemo(() => {
    return calculateShipping({
      subtotal,
      postalCode: postalCode || undefined,
    });
  }, [subtotal, postalCode]);

  const total = subtotal + shippingCalculation.shipping;

  // Validar que haya items en el carrito
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      router.push('/carrito');
    }
  }, [items.length, router]);

  // Manejar envío del formulario
  const onSubmit = async (data: CheckoutFormInput) => {
    try {
      // Guardar dirección
      saveShippingAddress(data.shippingAddress);

      // TODO: En el futuro, aquí se creará el pedido y se redirigirá a confirmación
      // Por ahora, solo mostramos un mensaje
      toast.success('¡Formulario de checkout completado!');
      console.log('Checkout data:', {
        ...data,
        subtotal,
        shipping: shippingCalculation.shipping,
        total,
      });

      // TODO: Redirigir a página de confirmación cuando esté lista
      // router.push('/checkout/confirmacion');
    } catch (error) {
      toast.error('Error al procesar el checkout. Intenta nuevamente.');
      console.error('Checkout error:', error);
    }
  };

  if (items.length === 0) {
    return null; // El useEffect redirigirá
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/carrito">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Checkout
              </h1>
              <p className="text-gray-600 mt-2">
                Completa tu información para finalizar la compra
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario - Columna izquierda */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dirección de envío */}
              <Card>
                <CardHeader>
                  <CardTitle>Dirección de envío</CardTitle>
                  <CardDescription>
                    Ingresa la dirección donde deseas recibir tu pedido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      />
                      {errors.shippingAddress?.firstName && (
                        <p className="text-red-500 text-sm mt-1">
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
                      />
                      {errors.shippingAddress?.lastName && (
                        <p className="text-red-500 text-sm mt-1">
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
                    />
                    {errors.shippingAddress?.email && (
                      <p className="text-red-500 text-sm mt-1">
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
                    />
                    {errors.shippingAddress?.phone && (
                      <p className="text-red-500 text-sm mt-1">
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
                    />
                    {errors.shippingAddress?.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.shippingAddress.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      />
                      {errors.shippingAddress?.city && (
                        <p className="text-red-500 text-sm mt-1">
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
                      />
                      {errors.shippingAddress?.province && (
                        <p className="text-red-500 text-sm mt-1">
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
                      />
                      {errors.shippingAddress?.postalCode && (
                        <p className="text-red-500 text-sm mt-1">
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
                  <Select
                    value={paymentMethod}
                    onValueChange={(value) =>
                      setValue('paymentMethod', value as any)
                    }
                  >
                    <SelectTrigger
                      className={errors.paymentMethod ? 'border-red-500' : ''}
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
                    <p className="text-red-500 text-sm mt-1">
                      {errors.paymentMethod.message}
                    </p>
                  )}
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Procesando...' : 'Confirmar pedido'}
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
