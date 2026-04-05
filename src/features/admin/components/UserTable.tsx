'use client';

import { useState, useMemo, useCallback } from 'react';
import AdminDataTable, {
  AdminDataTableEmptyRow,
} from '@features/admin/components/AdminDataTable';
import { useUserStore } from '@features/admin/store/user-store';
import type { AdminUser, UserRole } from '@features/admin/types/admin-user.types';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu';
import { Search, MoreHorizontal, Loader2 } from 'lucide-react';
import { formatDateShort } from '@shared/utils/date.utils';
import { toast } from 'sonner';

// ─── Tipos locales ─────────────────────────────────────────────────────────────

interface RoleChangeRequest {
  user: AdminUser;
  newRole: UserRole;
}

interface UserTableProps {
  currentUserId: string | undefined;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: UserRole }) {
  if (role === 'admin') {
    return (
      <Badge className="bg-brand text-white border-transparent hover:bg-brand">
        Admin
      </Badge>
    );
  }
  return (
    <Badge variant="secondary">
      Cliente
    </Badge>
  );
}

// ─── Columnas de la tabla ──────────────────────────────────────────────────────

const COLUMNS = [
  { id: 'nombre',     label: 'Nombre',      sortable: false },
  { id: 'email',      label: 'Email',        sortable: false },
  { id: 'rol',        label: 'Rol',          sortable: false },
  { id: 'registrado', label: 'Registrado',   sortable: false },
  { id: 'acciones',   label: 'Acciones',     sortable: false, align: 'right' as const },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function UserTable({ currentUserId }: UserTableProps) {
  const { users, isLoading, meta, fetchUsers, updateRole } = useUserStore();

  // Filtros locales de UI (la búsqueda y el rol se envían al store/API via fetchUsers)
  const [search, setSearch]               = useState('');
  const [roleFilter, setRoleFilter]       = useState<'all' | UserRole>('all');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Confirmación de cambio de rol
  const [roleRequest, setRoleRequest] = useState<RoleChangeRequest | null>(null);

  // Paginación desde el meta del store
  const currentPage  = meta?.page ?? 1;
  const totalPages   = meta?.totalPages ?? 1;
  const totalItems   = meta?.total ?? 0;

  // ── Carga con filtros ──────────────────────────────────────────────────────

  const load = useCallback(
    (page = 1) => {
      fetchUsers({
        page,
        limit: 10,
        search: search.trim() || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
      });
    },
    [fetchUsers, search, roleFilter]
  );

  // ── Búsqueda con debounce simple ───────────────────────────────────────────

  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      fetchUsers({
        page: 1,
        limit: 10,
        search: value.trim() || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
      });
    }, 400);
    setDebounceTimer(timer);
  };

  const handleRoleFilterChange = (value: string) => {
    const newRole = value as 'all' | UserRole;
    setRoleFilter(newRole);
    fetchUsers({
      page: 1,
      limit: 10,
      search: search.trim() || undefined,
      role: newRole !== 'all' ? newRole : undefined,
    });
  };

  // ── Cambio de rol ──────────────────────────────────────────────────────────

  const handleRoleChangeConfirm = async () => {
    if (!roleRequest) return;
    setIsUpdatingRole(true);
    try {
      await updateRole(roleRequest.user.id, roleRequest.newRole);
      toast.success(
        `Rol de ${roleRequest.user.firstName} ${roleRequest.user.lastName} actualizado a "${roleRequest.newRole === 'admin' ? 'Admin' : 'Cliente'}"`
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error al actualizar el rol'
      );
    } finally {
      setIsUpdatingRole(false);
      setRoleRequest(null);
    }
  };

  // ── Paginación ────────────────────────────────────────────────────────────

  const paginationFooter = useMemo(() => {
    if (totalPages <= 1) return null;
    return (
      <div className="px-6 py-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Mostrando {users?.length} de {totalItems} usuarios
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => load(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            Anterior
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, index, array) => (
                <div key={page} className="flex items-center gap-1">
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2">...</span>
                  )}
                  <Button
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => load(page)}
                    disabled={isLoading}
                    className={
                      currentPage === page
                        ? 'bg-brand hover:bg-brand-hover text-white'
                        : ''
                    }
                  >
                    {page}
                  </Button>
                </div>
              ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => load(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [totalPages, currentPage, isLoading, users?.length, totalItems, load]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="customer">Cliente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      <AdminDataTable
        columns={COLUMNS}
        emptyMessage="No se encontraron usuarios"
        footer={paginationFooter}
      >
        {isLoading ? (
          <tr>
            <td colSpan={5} className="px-6 py-12 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Cargando usuarios...</span>
              </div>
            </td>
          </tr>
        ) : users?.length === 0 ? (
          <AdminDataTableEmptyRow
            message="No se encontraron usuarios"
            colSpan={5}
          />
        ) : (
          (users ?? []).map((user) => {
            const isCurrentUser = user.id === currentUserId;
            const oppositeRole: UserRole = user.role === 'admin' ? 'customer' : 'admin';
            const oppositeRoleLabel = oppositeRole === 'admin' ? 'Admin' : 'Cliente';

            return (
              <tr
                key={user.id}
                className="hover:bg-[rgb(var(--brand)/0.03)]"
              >
                {/* Nombre */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </span>
                  {isCurrentUser && (
                    <span className="ml-2 text-xs text-gray-400">(vos)</span>
                  )}
                </td>

                {/* Email */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.email}
                </td>

                {/* Rol */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <RoleBadge role={user.role} />
                </td>

                {/* Registrado */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateShort(user.createdAt)}
                </td>

                {/* Acciones */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {!isCurrentUser && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Acciones"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            setRoleRequest({ user, newRole: oppositeRole })
                          }
                        >
                          Cambiar a {oppositeRoleLabel}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </td>
              </tr>
            );
          })
        )}
      </AdminDataTable>

      {/* Dialogo de confirmación de cambio de rol */}
      <Dialog
        open={roleRequest !== null}
        onOpenChange={(open) => {
          if (!open) setRoleRequest(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambio de rol</DialogTitle>
            <DialogDescription>
              {roleRequest && (
                <>
                  ¿Estás seguro de que querés cambiar el rol de{' '}
                  <strong>
                    {roleRequest.user.firstName} {roleRequest.user.lastName}
                  </strong>{' '}
                  a{' '}
                  <strong>
                    {roleRequest.newRole === 'admin' ? 'Admin' : 'Cliente'}
                  </strong>
                  ? Esta acción puede modificar los permisos del usuario.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleRequest(null)}
              disabled={isUpdatingRole}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRoleChangeConfirm}
              disabled={isUpdatingRole}
              className="bg-brand hover:bg-brand-hover text-white"
            >
              {isUpdatingRole ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
