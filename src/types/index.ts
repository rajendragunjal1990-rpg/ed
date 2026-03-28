export type UtilityType = 'electricity' | 'water' | 'gas' | 'steam' | 'compressed_air' | 'wastewater';

export type BillStatus = 'pending' | 'approved' | 'paid' | 'overdue' | 'disputed';

export type PaymentMethod = 'bank_transfer' | 'check' | 'ach' | 'credit_card';

export interface Vendor {
  id: string;
  name: string;
  utilityType: UtilityType;
  accountNumber: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  contractExpiry: string;
  rateSchedule: string;
}

export interface Meter {
  id: string;
  name: string;
  utilityType: UtilityType;
  location: string;
  unit: string;
  vendorId: string;
  accountNumber: string;
  serialNumber: string;
  installedDate: string;
  lastReading: number;
  lastReadingDate: string;
}

export interface MeterReading {
  id: string;
  meterId: string;
  date: string;
  reading: number;
  consumption: number;
  recordedBy: string;
  notes: string;
}

export interface Bill {
  id: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  utilityType: UtilityType;
  meterId?: string;
  meterName?: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  consumption: number;
  unit: string;
  status: BillStatus;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  notes: string;
  attachmentUrl?: string;
  facility: string;
  costCenter: string;
  glCode: string;
}

export interface CostCenter {
  id: string;
  code: string;
  name: string;
  department: string;
  manager: string;
}

export interface Facility {
  id: string;
  name: string;
  code: string;
  address: string;
  area: number;
  areaUnit: string;
}
