/**
 * Utilidades para pedidos
 */

import { OrderStatus } from '@/features/order/types';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/utils/utils';

/**
 * Configuración de estados de pedido
 * Colores: Verde = Entregado, Rojo = Cancelado, Amarillo = Estados intermedios
 */
export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
    /** Clases para color: verde entregado, rojo cancelado, amarillo intermedios */
    className?: string;
  }
> = {
  pending: {
    label: 'Pendiente',
    variant: 'outline',
    className: 'border-amber-400 bg-amber-100 text-amber-800',
  },
  confirmed: {
    label: 'Confirmado',
    variant: 'outline',
    className: 'border-amber-400 bg-amber-100 text-amber-800',
  },
  processing: {
    label: 'En Proceso',
    variant: 'outline',
    className: 'border-amber-400 bg-amber-100 text-amber-800',
  },
  shipped: {
    label: 'Enviado',
    variant: 'outline',
    className: 'border-amber-400 bg-amber-100 text-amber-800',
  },
  delivered: {
    label: 'Entregado',
    variant: 'default',
    className: 'border-green-500 bg-green-500 text-white hover:bg-green-600',
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'destructive',
    className: 'border-red-500 bg-red-500 text-white hover:bg-red-600',
  },
};

/**
 * Obtiene el badge de estado de un pedido
 * @param status - Estado del pedido
 * @returns Componente Badge con el estado
 */
export function getStatusBadge(status: OrderStatus) {
  const config = ORDER_STATUS_CONFIG[status] || {
    label: status,
    variant: 'outline' as const,
    className: undefined,
  };

  return (
    <Badge
      variant={config.variant}
      className={cn('text-sm', config.className)}
    >
      {config.label}
    </Badge>
  );
}

/**
 * Obtiene el texto del método de pago
 * @param method - Método de pago
 * @returns Texto legible del método de pago
 */
export function getPaymentMethodText(method: string): string {
  const methods: Record<string, string> = {
    credit_card: 'Tarjeta de Crédito',
    debit_card: 'Tarjeta de Débito',
    cash_on_delivery: 'Contra reembolso',
    bank_transfer: 'Transferencia Bancaria',
    cash: 'Efectivo',
    transfer: 'Transferencia Bancaria',
  };

  return methods[method] || method;
}

