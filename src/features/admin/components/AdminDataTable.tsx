'use client';

import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/shared/utils/utils';

export interface AdminDataTableColumn {
  id: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'right';
}

export interface AdminDataTableProps {
  columns: AdminDataTableColumn[];
  sortKey?: string | null;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  leadingHeader?: React.ReactNode;
  emptyMessage?: string;
  emptyColSpan?: number;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const headerBase =
  'px-6 py-3 text-xs font-semibold text-brand uppercase tracking-wider';
const headerRight = 'text-right';
const theadClass = 'bg-brand/10 border-b-2 border-brand';
const headerSortable = 'cursor-pointer hover:opacity-80 transition-opacity';

export default function AdminDataTable({
  columns,
  sortKey = null,
  sortDirection = 'asc',
  onSort,
  leadingHeader,
  emptyMessage = 'No hay datos',
  emptyColSpan,
  footer,
  children,
}: AdminDataTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={theadClass}>
            <tr>
              {leadingHeader && (
                <th className="w-10 px-6 py-3 text-left text-xs font-semibold text-brand uppercase tracking-wider">
                  {leadingHeader}
                </th>
              )}
              {columns.map((col) => {
                const isActive = sortKey === col.id;
                const alignRight = col.align === 'right';
                const content = col.sortable && onSort ? (
                  <button
                    type="button"
                    onClick={() => onSort(col.id)}
                    className={cn(
                      'flex items-center gap-1.5 w-full transition-opacity',
                      alignRight ? 'justify-end' : 'text-left',
                      isActive && headerSortable
                    )}
                  >
                    <span>{col.label}</span>
                    {isActive ? (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 flex-shrink-0" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-4 h-4 flex-shrink-0 opacity-50" />
                    )}
                  </button>
                ) : (
                  col.label
                );
                return (
                  <th
                    key={col.id}
                    className={cn(
                      headerBase,
                      alignRight && headerRight
                    )}
                  >
                    {content}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {children}
          </tbody>
        </table>
      </div>
      {footer}
    </div>
  );
}

export function AdminDataTableEmptyRow({
  message,
  colSpan,
}: {
  message: string;
  colSpan: number;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center text-gray-500">
        {message}
      </td>
    </tr>
  );
}
