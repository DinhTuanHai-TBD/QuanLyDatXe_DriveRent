import { PricingType } from '../types';

/**
 * Format currency to Vietnamese standard (e.g. "250.000 đ")
 */
export function formatVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 đ';
  }
  const formatted = Math.round(amount).toLocaleString('vi-VN');
  return `${formatted} đ`;
}

/**
 * Format date string (YYYY-MM-DD or ISO) to dd/MM/yyyy
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Format date-time to dd/MM/yyyy HH:mm (24-hour format)
 */
export function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
}

/**
 * Format time only (HH:mm)
 */
export function formatTimeOnly(dateString: string | undefined): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return dateString;
  }
}

/**
 * Calculate billable units (hours or days) with strict rules:
 * - Hourly: Ceil to whole hours, min 1 hour.
 * - Daily: 24h block from start, ceil to whole days, min 1 day.
 */
export function calculateBillableUnits(
  startStr: string,
  endStr: string,
  pricingType: PricingType
): { units: number; durationText: string; exactHours: number } {
  try {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffMs = Math.max(0, end.getTime() - start.getTime());
    const exactHours = diffMs / (1000 * 60 * 60);

    if (pricingType === 'hourly') {
      const units = Math.max(1, Math.ceil(exactHours));
      return {
        units,
        durationText: `${units} giờ (${exactHours.toFixed(1)} giờ thực tế)`,
        exactHours
      };
    } else {
      // 24h per day rule
      const exactDays = exactHours / 24;
      const units = Math.max(1, Math.ceil(exactDays));
      return {
        units,
        durationText: `${units} ngày (${exactDays.toFixed(1)} ngày thực tế)`,
        exactHours
      };
    }
  } catch {
    return { units: 1, durationText: '1 đơn vị', exactHours: 1 };
  }
}

/**
 * Helper to get status label and theme classes
 */
export function getVehicleStatusBadge(status: string) {
  switch (status) {
    case 'available':
      return {
        text: 'Sẵn sàng',
        bg: 'bg-emerald-50',
        textCol: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500'
      };
    case 'rented':
      return {
        text: 'Đang cho thuê',
        bg: 'bg-sky-50',
        textCol: 'text-sky-700',
        border: 'border-sky-200',
        dot: 'bg-sky-600'
      };
    case 'maintenance':
      return {
        text: 'Đang bảo dưỡng',
        bg: 'bg-amber-50',
        textCol: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500'
      };
    case 'overdue':
      return {
        text: 'Cảnh báo trễ hạn',
        bg: 'bg-rose-50 animate-pulse',
        textCol: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500'
      };
    default:
      return {
        text: status,
        bg: 'bg-slate-100',
        textCol: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-500'
      };
  }
}

export function getContractStatusBadge(status: string) {
  switch (status) {
    case 'draft':
      return {
        text: 'Nháp',
        bg: 'bg-slate-100',
        textCol: 'text-slate-700',
        border: 'border-slate-200'
      };
    case 'confirmed':
      return {
        text: 'Đã xác nhận',
        bg: 'bg-sky-50',
        textCol: 'text-sky-700',
        border: 'border-sky-200'
      };
    case 'rented':
      return {
        text: 'Đang thuê',
        bg: 'bg-sky-50',
        textCol: 'text-sky-700',
        border: 'border-sky-200'
      };
    case 'pending_settlement':
      return {
        text: 'Chờ quyết toán',
        bg: 'bg-amber-50',
        textCol: 'text-amber-700',
        border: 'border-amber-200'
      };
    case 'completed':
      return {
        text: 'Hoàn tất',
        bg: 'bg-emerald-50',
        textCol: 'text-emerald-700',
        border: 'border-emerald-200'
      };
    case 'cancelled':
      return {
        text: 'Đã hủy',
        bg: 'bg-rose-50',
        textCol: 'text-rose-700',
        border: 'border-rose-200'
      };
    default:
      return {
        text: status,
        bg: 'bg-slate-100',
        textCol: 'text-slate-700',
        border: 'border-slate-200'
      };
  }
}

export function getMaintenanceStatusBadge(status: string) {
  switch (status) {
    case 'upcoming':
      return {
        text: 'Sắp đến hạn',
        bg: 'bg-sky-50',
        textCol: 'text-sky-700',
        border: 'border-sky-200'
      };
    case 'overdue':
      return {
        text: 'Quá hạn bảo dưỡng',
        bg: 'bg-rose-50',
        textCol: 'text-rose-700',
        border: 'border-rose-200'
      };
    case 'in_progress':
      return {
        text: 'Đang bảo dưỡng',
        bg: 'bg-amber-50',
        textCol: 'text-amber-800',
        border: 'border-amber-200'
      };
    case 'completed':
      return {
        text: 'Đã hoàn thành',
        bg: 'bg-emerald-50',
        textCol: 'text-emerald-700',
        border: 'border-emerald-200'
      };
    default:
      return {
        text: status,
        bg: 'bg-slate-100',
        textCol: 'text-slate-700',
        border: 'border-slate-200'
      };
  }
}
