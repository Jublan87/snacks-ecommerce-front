'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

import { useAuthStore } from '@/features/auth/store/auth-store';
import {
  loginSchema,
  type LoginFormInput,
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

export default function LoginPage() {
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormInput) => {
    try {
      await login(data);

      // Obtener la URL de redirect antes de redirigir
      const redirectUrl = searchParams.get('redirect');
      const targetUrl = redirectUrl || '/';

      toast.success('¡Bienvenido de vuelta!');

      // Verificar que la cookie esté establecida antes de redirigir
      // Esto es importante porque el middleware del servidor necesita ver la cookie
      const checkCookie = () => {
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find((cookie) =>
          cookie.trim().startsWith('auth-token=')
        );
        return !!authCookie && authCookie.trim().length > 0;
      };

      // Esperar un momento para que la cookie se establezca completamente
      // Luego verificar que esté disponible antes de redirigir
      setTimeout(() => {
        // Verificar que la cookie esté disponible
        if (checkCookie()) {
          // Usar window.location.href para forzar una navegación completa del navegador
          // Esto asegura que el middleware vea la cookie actualizada
          window.location.href = targetUrl;
        } else {
          // Si la cookie no está disponible después del delay, intentar de nuevo
          // o redirigir de todas formas (el ProtectedRoute del cliente manejará la autenticación)
          console.warn('Cookie no detectada, redirigiendo de todas formas');
          window.location.href = targetUrl;
        }
      }, 500); // Aumentar delay a 500ms para dar más tiempo a la cookie
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al iniciar sesión'
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
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

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
                  {...register('password')}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Separator />

            {/* Botón de envío */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <Separator className="my-6" />

          {/* Link a registro */}
          <div className="text-center text-sm">
            <span className="text-gray-600">¿No tienes una cuenta? </span>
            <Link
              href="/registro"
              className="text-[#FF5454] hover:text-[#CC0000] font-medium transition-colors"
            >
              Regístrate aquí
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
