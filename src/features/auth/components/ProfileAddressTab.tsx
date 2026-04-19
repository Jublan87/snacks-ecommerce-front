'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, MapPin, Star } from 'lucide-react';
import { useAuthStore } from '@features/auth/store/auth-store';
import {
  addressFormSchema,
  type AddressFormInput,
} from '@features/auth/schemas/profile.schema';
import {
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '@features/auth/services/addresses.service';
import type { Address } from '@features/auth/types/auth.types';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Separator } from '@shared/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select';

// Provincias de Argentina
const PROVINCES = [
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

// --- Address Form (create / edit) ---

interface AddressFormProps {
  initial?: Address;
  onSave: (data: AddressFormInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

function AddressForm({ initial, onSave, onCancel, isSubmitting }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddressFormInput>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      address: initial?.address ?? '',
      city: initial?.city ?? '',
      province: initial?.province ?? '',
      postalCode: initial?.postalCode ?? '',
      notes: initial?.notes ?? '',
      label: initial?.label ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      {/* Etiqueta (opcional) */}
      <div className="space-y-2">
        <label htmlFor="addr-label" className="text-sm font-medium text-gray-700">
          Etiqueta <span className="text-gray-400">(opcional)</span>
        </label>
        <Input
          id="addr-label"
          placeholder="Ej: Casa, Trabajo"
          {...register('label')}
          aria-invalid={errors.label ? 'true' : 'false'}
        />
        {errors.label && (
          <p className="text-sm text-red-600" role="alert">
            {errors.label.message}
          </p>
        )}
      </div>

      {/* Dirección */}
      <div className="space-y-2">
        <label htmlFor="addr-address" className="text-sm font-medium text-gray-700">
          Dirección *
        </label>
        <Input
          id="addr-address"
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
          <label htmlFor="addr-city" className="text-sm font-medium text-gray-700">
            Ciudad *
          </label>
          <Input
            id="addr-city"
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
          <label htmlFor="addr-province" className="text-sm font-medium text-gray-700">
            Provincia *
          </label>
          <Controller
            name="province"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="addr-province">
                  <SelectValue placeholder="Seleccioná una provincia" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((prov) => (
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
          <label htmlFor="addr-postalCode" className="text-sm font-medium text-gray-700">
            Código Postal *
          </label>
          <Input
            id="addr-postalCode"
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
        <label htmlFor="addr-notes" className="text-sm font-medium text-gray-700">
          Notas <span className="text-gray-400">(opcional)</span>
        </label>
        <Input
          id="addr-notes"
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

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar dirección'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

// --- Delete Confirm Dialog ---

interface DeleteConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteConfirmDialog({ open, onConfirm, onCancel, isDeleting }: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar dirección</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que querés eliminar esta dirección? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Address Card ---

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
  isLoading: boolean;
}

function AddressCard({ address, onEdit, onDelete, onSetDefault, isLoading }: AddressCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {address.label && (
                  <span className="font-semibold text-gray-800">{address.label}</span>
                )}
                {address.isDefault && (
                  <Badge variant="default" className="text-xs">
                    Predeterminada
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            {!address.isDefault && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSetDefault(address)}
                disabled={isLoading}
                title="Marcar como predeterminada"
                aria-label="Marcar como dirección predeterminada"
                className="flex items-center gap-1 text-xs text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
              >
                <Star className="w-3.5 h-3.5" />
                Predeterminar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(address)}
              disabled={isLoading}
              className="flex items-center gap-1"
              aria-label="Editar dirección"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(address)}
              disabled={isLoading}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              aria-label="Eliminar dirección"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm text-gray-700 ml-8">
          <p>{address.address}</p>
          <p>
            {address.city}, {address.province} {address.postalCode}
          </p>
          {address.notes && (
            <p className="text-gray-500 italic">Notas: {address.notes}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Tab ---

export default function ProfileAddressTab() {
  const { user, initialize } = useAuthStore();
  const addresses = user?.addresses ?? [];

  // Form state: null = hidden, undefined = new, Address = editing
  const [formTarget, setFormTarget] = useState<Address | undefined | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Delete confirm state
  const [pendingDelete, setPendingDelete] = useState<Address | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Loading for set-default
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const isAnyLoading = isFormSubmitting || isDeleting || loadingId !== null;

  const handleOpenAdd = () => setFormTarget(undefined);
  const handleOpenEdit = (address: Address) => setFormTarget(address);
  const handleCloseForm = () => setFormTarget(null);

  const handleSave = async (data: AddressFormInput) => {
    setIsFormSubmitting(true);
    try {
      if (formTarget === undefined) {
        // Create
        await createAddress(data);
        toast.success('Dirección agregada correctamente');
      } else if (formTarget !== null) {
        // Edit
        await updateAddress(formTarget.id, data);
        toast.success('Dirección actualizada correctamente');
      }
      await initialize(); // Re-fetch /auth/me to sync addresses into the store
      setFormTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar dirección');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDeleteRequest = (address: Address) => setPendingDelete(address);

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteAddress(pendingDelete.id);
      toast.success('Dirección eliminada correctamente');
      await initialize();
      setPendingDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar dirección');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetDefault = async (address: Address) => {
    setLoadingId(address.id);
    try {
      await setDefaultAddress(address.id);
      toast.success('Dirección predeterminada actualizada');
      await initialize();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar dirección predeterminada');
    } finally {
      setLoadingId(null);
    }
  };

  const showForm = formTarget !== null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Direcciones de Envío</h2>
          <p className="text-sm text-gray-600 mt-1">Gestioná tus direcciones de envío</p>
        </div>
        {!showForm && (
          <Button
            onClick={handleOpenAdd}
            disabled={isAnyLoading}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar dirección
          </Button>
        )}
      </div>

      <Separator />

      {/* Address Form (create / edit) */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {formTarget === undefined ? 'Nueva dirección' : 'Editar dirección'}
            </CardTitle>
            <CardDescription>Completá los datos de tu dirección de envío</CardDescription>
          </CardHeader>
          <CardContent>
            <AddressForm
              initial={formTarget === undefined ? undefined : formTarget}
              onSave={handleSave}
              onCancel={handleCloseForm}
              isSubmitting={isFormSubmitting}
            />
          </CardContent>
        </Card>
      )}

      {/* Address List */}
      {!showForm && (
        <>
          {addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteRequest}
                  onSetDefault={handleSetDefault}
                  isLoading={isAnyLoading}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No tenés direcciones guardadas</p>
              <Button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Agregar primera dirección
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={pendingDelete !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
