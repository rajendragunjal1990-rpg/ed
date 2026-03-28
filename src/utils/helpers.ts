import type { UtilityType, BillStatus } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(value);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const utilityColors: Record<UtilityType, string> = {
  electricity: '#f59e0b',
  water: '#3b82f6',
  gas: '#ef4444',
  steam: '#8b5cf6',
  compressed_air: '#06b6d4',
  wastewater: '#6b7280',
};

export const utilityBgColors: Record<UtilityType, string> = {
  electricity: 'bg-amber-100 text-amber-800',
  water: 'bg-blue-100 text-blue-800',
  gas: 'bg-red-100 text-red-800',
  steam: 'bg-purple-100 text-purple-800',
  compressed_air: 'bg-cyan-100 text-cyan-800',
  wastewater: 'bg-gray-100 text-gray-800',
};

export const utilityLabels: Record<UtilityType, string> = {
  electricity: 'Electricity',
  water: 'Water',
  gas: 'Natural Gas',
  steam: 'Steam',
  compressed_air: 'Compressed Air',
  wastewater: 'Wastewater',
};

export const statusColors: Record<BillStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  disputed: 'bg-orange-100 text-orange-800',
};

export const statusLabels: Record<BillStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  paid: 'Paid',
  overdue: 'Overdue',
  disputed: 'Disputed',
};
