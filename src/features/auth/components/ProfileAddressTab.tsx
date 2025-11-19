'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth-store';
import {
  updateAddressSchema,
  type UpdateAddressFormInput,
} from '@/features/auth/schemas/profile.schema';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Separator } from '@/shared/ui/separator';
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

export default function ProfileAddressTab() {
  const { user, updateUser } = useAuthStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateAddressFormInput>({
    resolver: zodResolver(updateAddressSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.shippingAddress?.address || '',
      city: user?.shippingAddress?.city || '',
      province: user?.shippingAddress?.province || '',
      postalCode: user?.shippingAddress?.postalCode || '',
      notes: user?.shippingAddress?.notes || '',
    },
  });

  const onSubmit = async (data: UpdateAddressFormInput) => {
    try {
      await updateUser({
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode,
          notes: data.notes,
        },
      });
      toast.success('Dirección guardada correctamente');
      setIsAdding(false);
      setIsEditing(false);
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al guardar dirección'
      );
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.shippingAddress?.address || '',
      city: user?.shippingAddress?.city || '',
      province: user?.shippingAddress?.province || '',
      postalCode: user?.shippingAddress?.postalCode || '',
      notes: user?.shippingAddress?.notes || '',
    });
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
      updateUser({
        shippingAddress: undefined,
      })
        .then(() => {
          toast.success('Dirección eliminada correctamente');
        })
        .catch((error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : 'Error al eliminar dirección'
          );
        });
    }
  };

  const handleEdit = () => {
    if (user?.shippingAddress) {
      setValue('firstName', user.shippingAddress.firstName);
      setValue('lastName', user.shippingAddress.lastName);
      setValue('email', user.shippingAddress.email);
      setValue('phone', user.shippingAddress.phone);
      setValue('address', user.shippingAddress.address);
      setValue('city', user.shippingAddress.city);
      setValue('province', user.shippingAddress.province);
      setValue('postalCode', user.shippingAddress.postalCode);
      setValue('notes', user.shippingAddress.notes || '');
      setIsEditing(true);
    }
  };

  const hasAddress = !!user?.shippingAddress;
  const showForm = isAdding || isEditing;

  // Provincias de Argentina
  const provinces = [
    'Buenos Aires',
    'Catamarca',
    'Chaco',
    'Chubut',
    'Córdoba',
    'Corrientes',
    'Entre Ríos',
    'Formosa',
    'Jujuy',
    'La Pampa',
    'La Rioja',
    'Mendoza',
    'Misiones',
    'Neuquén',
    'Río Negro',
    'Salta',
    'San Juan',
    'San Luis',
    'Santa Cruz',
    'Santa Fe',
    'Santiago del Estero',
    'Tierra del Fuego',
    'Tucumán',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Direcciones de Envío
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Gestiona tus direcciones de envío
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => {
              reset({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                phone: user?.phone || '',
                address: '',
                city: '',
                province: '',
                postalCode: '',
                notes: '',
              });
              setIsAdding(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar Dirección
          </Button>
        )}
      </div>

      <Separator />

      {!showForm && (
        <>
          {hasAddress && user?.shippingAddress ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <CardTitle className="text-lg">
                        {user.shippingAddress.firstName}{' '}
                        {user.shippingAddress.lastName}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {user.shippingAddress.email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>{user.shippingAddress.address}</p>
                  <p>
                    {user.shippingAddress.city}, {user.shippingAddress.province}{' '}
                    {user.shippingAddress.postalCode}
                  </p>
                  {user.shippingAddress.phone && (
                    <p>Tel: {user.shippingAddress.phone}</p>
                  )}
                  {user.shippingAddress.notes && (
                    <p className="text-gray-500 italic">
                      Notas: {user.shippingAddress.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                No tienes direcciones guardadas
              </p>
              <Button
                onClick={() => {
                  reset({
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    address: '',
                    city: '',
                    province: '',
                    postalCode: '',
                    notes: '',
                  });
                  setIsAdding(true);
                }}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Agregar Primera Dirección
              </Button>
            </div>
          )}
        </>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? 'Editar Dirección' : 'Nueva Dirección'}
            </CardTitle>
            <CardDescription>
              Completa los datos de tu dirección de envío
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="space-y-2">
                  <label
                    htmlFor="address-firstName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Nombre
                  </label>
                  <Input
                    id="address-firstName"
                    {...register('firstName')}
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
                    htmlFor="address-lastName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Apellido
                  </label>
                  <Input
                    id="address-lastName"
                    {...register('lastName')}
                    aria-invalid={errors.lastName ? 'true' : 'false'}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600" role="alert">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="address-email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="address-email"
                  type="email"
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <label
                  htmlFor="address-phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Teléfono
                </label>
                <Input
                  id="address-phone"
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  {...register('phone')}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <label
                  htmlFor="address-address"
                  className="text-sm font-medium text-gray-700"
                >
                  Dirección
                </label>
                <Input
                  id="address-address"
                  placeholder="Calle y número"
                  {...register('address')}
                  aria-invalid={errors.address ? 'true' : 'false'}
                />
                {errors.address && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Ciudad */}
                <div className="space-y-2">
                  <label
                    htmlFor="address-city"
                    className="text-sm font-medium text-gray-700"
                  >
                    Ciudad
                  </label>
                  <Input
                    id="address-city"
                    {...register('city')}
                    aria-invalid={errors.city ? 'true' : 'false'}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600" role="alert">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                {/* Provincia */}
                <div className="space-y-2">
                  <label
                    htmlFor="address-province"
                    className="text-sm font-medium text-gray-700"
                  >
                    Provincia
                  </label>
                  <Controller
                    name="province"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="address-province">
                          <SelectValue placeholder="Selecciona una provincia" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((prov) => (
                            <SelectItem key={prov} value={prov}>
                              {prov}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.province && (
                    <p className="text-sm text-red-600" role="alert">
                      {errors.province.message}
                    </p>
                  )}
                </div>

                {/* Código Postal */}
                <div className="space-y-2">
                  <label
                    htmlFor="address-postalCode"
                    className="text-sm font-medium text-gray-700"
                  >
                    Código Postal
                  </label>
                  <Input
                    id="address-postalCode"
                    {...register('postalCode')}
                    aria-invalid={errors.postalCode ? 'true' : 'false'}
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-red-600" role="alert">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <label
                  htmlFor="address-notes"
                  className="text-sm font-medium text-gray-700"
                >
                  Notas (opcional)
                </label>
                <Input
                  id="address-notes"
                  placeholder="Referencias, instrucciones especiales, etc."
                  {...register('notes')}
                  aria-invalid={errors.notes ? 'true' : 'false'}
                />
                {errors.notes && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.notes.message}
                  </p>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar Dirección'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
