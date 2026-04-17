import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  return n.toLocaleString('es-CO');
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    deprecated: 'bg-yellow-100 text-yellow-800',
    retired: 'bg-red-100 text-red-800',
    pending_approval: 'bg-orange-100 text-orange-800',
    suspended: 'bg-red-100 text-red-800',
    rejected: 'bg-gray-100 text-gray-800',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600';
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    active: 'Activa',
    deprecated: 'Deprecada',
    retired: 'Retirada',
    pending_approval: 'Pendiente',
    suspended: 'Suspendida',
    rejected: 'Rechazada',
  };
  return map[status] ?? status;
}

export function methodColor(method: string): string {
  const map: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PUT: 'bg-orange-100 text-orange-800',
    PATCH: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
  };
  return map[method] ?? 'bg-gray-100 text-gray-600';
}
