'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth-store';
import {
  changePasswordSchema,
  type ChangePasswordFormInput,
} from '@/features/auth/schemas/profile.schema';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Separator } from '@/shared/ui/separator';

export default function ProfilePasswordTab() {
  const { updatePassword } = useAuthStore();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormInput) => {
    try {
      await updatePassword(data.currentPassword, data.newPassword);
      toast.success('Contraseña actualizada correctamente');
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al actualizar contraseña'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Lock className="w-6 h-6 text-gray-400" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Cambiar Contraseña
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Actualiza tu contraseña para mantener tu cuenta segura
          </p>
        </div>
      </div>

      <Separator />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        {/* Contraseña actual */}
        <div className="space-y-2">
          <label
            htmlFor="currentPassword"
            className="text-sm font-medium text-gray-700"
          >
            Contraseña Actual
          </label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pr-10"
              {...register('currentPassword')}
              aria-invalid={errors.currentPassword ? 'true' : 'false'}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showCurrentPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showCurrentPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-sm text-red-600" role="alert">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* Nueva contraseña */}
        <div className="space-y-2">
          <label
            htmlFor="newPassword"
            className="text-sm font-medium text-gray-700"
          >
            Nueva Contraseña
          </label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pr-10"
              {...register('newPassword')}
              aria-invalid={errors.newPassword ? 'true' : 'false'}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showNewPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-600" role="alert">
              {errors.newPassword.message}
            </p>
          )}
          <p className="text-xs text-gray-500">
            La contraseña debe tener al menos 6 caracteres
          </p>
        </div>

        {/* Confirmar nueva contraseña */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            Confirmar Nueva Contraseña
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pr-10"
              {...register('confirmPassword')}
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Botón de envío */}
        <div className="pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
          </Button>
        </div>
      </form>
    </div>
  );
}

