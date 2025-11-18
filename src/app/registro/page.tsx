'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Lock, User, Phone, MapPin } from 'lucide-react';

import { useAuthStore } from '@/features/auth/store/auth-store';
import {
  registerSchema,
  type RegisterFormInput,
} from '@/features/auth/schemas/auth.schema';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      notes: '',
    },
  });

  const onSubmit = async (data: RegisterFormInput) => {
    try {
      await register(data);
      toast.success('¡Cuenta creada exitosamente!');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al crear la cuenta'
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al inicio
      </Link>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-center">
            Completa el formulario para registrarte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nombre y Apellido en la misma fila */}
            <div className="grid grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Juan"
                    className="pl-10"
                    {...registerField('firstName')}
                    aria-invalid={errors.firstName ? 'true' : 'false'}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700"
                >
                  Apellido
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Pérez"
                  {...registerField('lastName')}
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10"
                  {...registerField('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Teléfono (opcional) */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Teléfono <span className="text-gray-400">(opcional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  className="pl-10"
                  {...registerField('phone')}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <Separator />

            {/* Dirección de envío (opcional) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">
                  Dirección de envío (opcional)
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Si completas estos datos, quedarán guardados para futuras
                compras
              </p>

              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700"
                >
                  Dirección
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="Calle y número"
                    className="pl-10"
                    {...registerField('address')}
                    aria-invalid={errors.address ? 'true' : 'false'}
                  />
                </div>
                {errors.address && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="city"
                    className="text-sm font-medium text-gray-700"
                  >
                    Ciudad
                  </label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Buenos Aires"
                    {...registerField('city')}
                    aria-invalid={errors.city ? 'true' : 'false'}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600" role="alert">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="province"
                    className="text-sm font-medium text-gray-700"
                  >
                    Provincia
                  </label>
                  <Input
                    id="province"
                    type="text"
                    placeholder="CABA"
                    {...registerField('province')}
                    aria-invalid={errors.province ? 'true' : 'false'}
                  />
                  {errors.province && (
                    <p className="text-sm text-red-600" role="alert">
                      {errors.province.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="postalCode"
                  className="text-sm font-medium text-gray-700"
                >
                  Código Postal
                </label>
                <Input
                  id="postalCode"
                  type="text"
                  placeholder="C1234ABC"
                  {...registerField('postalCode')}
                  aria-invalid={errors.postalCode ? 'true' : 'false'}
                />
                {errors.postalCode && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="notes"
                  className="text-sm font-medium text-gray-700"
                >
                  Notas adicionales (opcional)
                </label>
                <Input
                  id="notes"
                  type="text"
                  placeholder="Instrucciones especiales para la entrega"
                  {...registerField('notes')}
                  aria-invalid={errors.notes ? 'true' : 'false'}
                />
                {errors.notes && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.notes.message}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Contraseña */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...registerField('password')}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.password.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Debe contener al menos una mayúscula, una minúscula y un número
              </p>
            </div>

            {/* Confirmar Contraseña */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...registerField('confirmPassword')}
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Separator />

            {/* Botón de envío */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          <Separator className="my-6" />

          {/* Link a login */}
          <div className="text-center text-sm">
            <span className="text-gray-600">¿Ya tienes una cuenta? </span>
            <Link
              href="/login"
              className="text-[#FF5454] hover:text-[#CC0000] font-medium transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
