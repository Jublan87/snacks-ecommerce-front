'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Edit2, Save, X } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth-store';
import {
  updateProfileSchema,
  type UpdateProfileFormInput,
} from '@/features/auth/schemas/profile.schema';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Separator } from '@/shared/ui/separator';

export default function ProfileInfoTab() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateProfileFormInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
  });

  // Actualizar valores del formulario cuando cambie el usuario
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileFormInput) => {
    try {
      await updateUser(data);
      toast.success('Información actualizada correctamente');
      setIsEditing(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al actualizar información'
      );
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No se pudo cargar la información del usuario</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Información Personal
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Actualiza tu información personal
          </p>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </Button>
        )}
      </div>

      <Separator />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email (solo lectura) */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="bg-gray-50 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500">
            El email no se puede modificar
          </p>
        </div>

        {/* Nombre */}
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <Input
            id="firstName"
            {...register('firstName')}
            disabled={!isEditing}
            className={!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}
            aria-invalid={errors.firstName ? 'true' : 'false'}
          />
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
            {...register('lastName')}
            disabled={!isEditing}
            className={!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}
            aria-invalid={errors.lastName ? 'true' : 'false'}
          />
          {errors.lastName && (
            <p className="text-sm text-red-600" role="alert">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="text-sm font-medium text-gray-700"
          >
            Teléfono
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="+54 11 1234-5678"
            {...register('phone')}
            disabled={!isEditing}
            className={!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}
            aria-invalid={errors.phone ? 'true' : 'false'}
          />
          {errors.phone && (
            <p className="text-sm text-red-600" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Fecha de registro (solo lectura) */}
        <div className="space-y-2">
          <label
            htmlFor="createdAt"
            className="text-sm font-medium text-gray-700"
          >
            Miembro desde
          </label>
          <Input
            id="createdAt"
            value={new Date(user.createdAt).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            disabled
            className="bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Botones de acción */}
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

