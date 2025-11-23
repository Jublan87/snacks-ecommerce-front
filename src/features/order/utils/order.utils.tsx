/**
 * Utilidades para pedidos
 */

import { OrderStatus } from '@/features/order/types';
import { Badge } from '@/shared/ui/badge';

/**
 * Configuración de estados de pedido
 */
export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
> = {
  pending: { label: 'Pendiente', variant: 'outline' },
  confirmed: { label: 'Confirmado', variant: 'default' },
  processing: { label: 'En Proceso', variant: 'default' },
  shipped: { label: 'Enviado', variant: 'secondary' },
  delivered: { label: 'Entregado', variant: 'default' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
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
  };

  return (
    <Badge variant={config.variant} className="text-sm">
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
    cash: 'Efectivo',
    transfer: 'Transferencia Bancaria',
  };

  return methods[method] || method;
}

