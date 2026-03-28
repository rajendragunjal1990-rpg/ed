import type { Bill, Vendor, Meter, MeterReading, CostCenter, Facility } from '../types';

export const facilities: Facility[] = [
  { id: 'f1', name: 'Main Plant', code: 'MP-001', address: '1000 Industrial Blvd, Detroit, MI 48201', area: 250000, areaUnit: 'sqft' },
  { id: 'f2', name: 'Warehouse A', code: 'WH-001', address: '1050 Industrial Blvd, Detroit, MI 48201', area: 80000, areaUnit: 'sqft' },
  { id: 'f3', name: 'Admin Building', code: 'AB-001', address: '1100 Industrial Blvd, Detroit, MI 48201', area: 30000, areaUnit: 'sqft' },
  { id: 'f4', name: 'R&D Center', code: 'RD-001', address: '1200 Innovation Dr, Detroit, MI 48202', area: 45000, areaUnit: 'sqft' },
];

export const costCenters: CostCenter[] = [
  { id: 'cc1', code: 'CC-1001', name: 'Production', department: 'Manufacturing', manager: 'Robert Chen' },
  { id: 'cc2', code: 'CC-1002', name: 'Logistics', department: 'Operations', manager: 'Sarah Williams' },
  { id: 'cc3', code: 'CC-1003', name: 'Administration', department: 'Corporate', manager: 'James Miller' },
  { id: 'cc4', code: 'CC-1004', name: 'Research & Development', department: 'Engineering', manager: 'Emily Zhang' },
];

export const vendors: Vendor[] = [
  {
    id: 'v1', name: 'DTE Energy', utilityType: 'electricity',
    accountNumber: 'DTE-4521-88', contactName: 'Mark Johnson',
    contactEmail: 'mjohnson@dteenergy.com', contactPhone: '(313) 555-0101',
    address: '1 Energy Plaza, Detroit, MI 48226',
    contractExpiry: '2026-12-31', rateSchedule: 'Large Power Industrial LP-5',
  },
  {
    id: 'v2', name: 'Detroit Water & Sewerage', utilityType: 'water',
    accountNumber: 'DWS-7734-22', contactName: 'Patricia Lewis',
    contactEmail: 'plewis@dwsd.org', contactPhone: '(313) 555-0202',
    address: '735 Randolph St, Detroit, MI 48226',
    contractExpiry: '2025-06-30', rateSchedule: 'Industrial Rate IW-2',
  },
  {
    id: 'v3', name: 'Consumers Energy', utilityType: 'gas',
    accountNumber: 'CE-9901-55', contactName: 'Thomas Brown',
    contactEmail: 'tbrown@consumersenergy.com', contactPhone: '(616) 555-0303',
    address: '1 Energy Plaza, Jackson, MI 49201',
    contractExpiry: '2026-03-31', rateSchedule: 'Large Volume Gas CGS-1',
  },
  {
    id: 'v4', name: 'Industrial Steam Corp', utilityType: 'steam',
    accountNumber: 'ISC-3345-77', contactName: 'Linda Davis',
    contactEmail: 'ldavis@industrialsteam.com', contactPhone: '(313) 555-0404',
    address: '500 Steam Way, Detroit, MI 48210',
    contractExpiry: '2025-12-31', rateSchedule: 'Industrial Steam IS-3',
  },
];

export const meters: Meter[] = [
  { id: 'm1', name: 'Main Plant - Elec Main', utilityType: 'electricity', location: 'Main Plant - Substation A', unit: 'kWh', vendorId: 'v1', accountNumber: 'DTE-MP-001', serialNumber: 'SN-E-001', installedDate: '2015-03-15', lastReading: 4587234, lastReadingDate: '2026-03-01' },
  { id: 'm2', name: 'Warehouse A - Elec', utilityType: 'electricity', location: 'Warehouse A - Meter Room', unit: 'kWh', vendorId: 'v1', accountNumber: 'DTE-WH-001', serialNumber: 'SN-E-002', installedDate: '2018-07-20', lastReading: 987654, lastReadingDate: '2026-03-01' },
  { id: 'm3', name: 'Admin Building - Elec', utilityType: 'electricity', location: 'Admin - Utility Room', unit: 'kWh', vendorId: 'v1', accountNumber: 'DTE-AB-001', serialNumber: 'SN-E-003', installedDate: '2019-01-10', lastReading: 234567, lastReadingDate: '2026-03-01' },
  { id: 'm4', name: 'Main Plant - Water', utilityType: 'water', location: 'Main Plant - Pump Room', unit: 'gallons', vendorId: 'v2', accountNumber: 'DWS-MP-001', serialNumber: 'SN-W-001', installedDate: '2015-03-15', lastReading: 8923456, lastReadingDate: '2026-03-01' },
  { id: 'm5', name: 'Main Plant - Natural Gas', utilityType: 'gas', location: 'Main Plant - Gas Room', unit: 'MCF', vendorId: 'v3', accountNumber: 'CE-MP-001', serialNumber: 'SN-G-001', installedDate: '2015-03-15', lastReading: 123456, lastReadingDate: '2026-03-01' },
  { id: 'm6', name: 'Main Plant - Steam', utilityType: 'steam', location: 'Main Plant - Boiler Room', unit: 'MMBTU', vendorId: 'v4', accountNumber: 'ISC-MP-001', serialNumber: 'SN-S-001', installedDate: '2016-05-22', lastReading: 45678, lastReadingDate: '2026-03-01' },
];

export const meterReadings: MeterReading[] = [
  { id: 'mr1', meterId: 'm1', date: '2026-03-01', reading: 4587234, consumption: 312450, recordedBy: 'John Smith', notes: '' },
  { id: 'mr2', meterId: 'm1', date: '2026-02-01', reading: 4274784, consumption: 298760, recordedBy: 'John Smith', notes: '' },
  { id: 'mr3', meterId: 'm1', date: '2026-01-01', reading: 3976024, consumption: 321100, recordedBy: 'John Smith', notes: 'Winter peak demand' },
  { id: 'mr4', meterId: 'm1', date: '2025-12-01', reading: 3654924, consumption: 307850, recordedBy: 'Jane Doe', notes: '' },
  { id: 'mr5', meterId: 'm4', date: '2026-03-01', reading: 8923456, consumption: 1245000, recordedBy: 'Mike Johnson', notes: '' },
  { id: 'mr6', meterId: 'm4', date: '2026-02-01', reading: 7678456, consumption: 1100000, recordedBy: 'Mike Johnson', notes: '' },
];

export const bills: Bill[] = [
  {
    id: 'b1', billNumber: 'DTE-2026-03-001', vendorId: 'v1', vendorName: 'DTE Energy',
    utilityType: 'electricity', meterId: 'm1', meterName: 'Main Plant - Elec Main',
    billingPeriodStart: '2026-02-01', billingPeriodEnd: '2026-02-28',
    issueDate: '2026-03-05', dueDate: '2026-03-25',
    amount: 47820.50, taxAmount: 2391.03, totalAmount: 50211.53,
    consumption: 298760, unit: 'kWh', status: 'pending',
    notes: '', facility: 'Main Plant', costCenter: 'CC-1001', glCode: '6100-01',
  },
  {
    id: 'b2', billNumber: 'DTE-2026-03-002', vendorId: 'v1', vendorName: 'DTE Energy',
    utilityType: 'electricity', meterId: 'm2', meterName: 'Warehouse A - Elec',
    billingPeriodStart: '2026-02-01', billingPeriodEnd: '2026-02-28',
    issueDate: '2026-03-05', dueDate: '2026-03-25',
    amount: 11250.75, taxAmount: 562.54, totalAmount: 11813.29,
    consumption: 68940, unit: 'kWh', status: 'approved',
    notes: '', facility: 'Warehouse A', costCenter: 'CC-1002', glCode: '6100-02',
  },
  {
    id: 'b3', billNumber: 'DWS-2026-03-001', vendorId: 'v2', vendorName: 'Detroit Water & Sewerage',
    utilityType: 'water', meterId: 'm4', meterName: 'Main Plant - Water',
    billingPeriodStart: '2026-02-01', billingPeriodEnd: '2026-02-28',
    issueDate: '2026-03-08', dueDate: '2026-03-28',
    amount: 8940.20, taxAmount: 0, totalAmount: 8940.20,
    consumption: 1100000, unit: 'gallons', status: 'paid',
    paymentDate: '2026-03-15', paymentMethod: 'ach', paymentReference: 'ACH-20260315-001',
    notes: '', facility: 'Main Plant', costCenter: 'CC-1001', glCode: '6200-01',
  },
  {
    id: 'b4', billNumber: 'CE-2026-03-001', vendorId: 'v3', vendorName: 'Consumers Energy',
    utilityType: 'gas', meterId: 'm5', meterName: 'Main Plant - Natural Gas',
    billingPeriodStart: '2026-02-01', billingPeriodEnd: '2026-02-28',
    issueDate: '2026-03-10', dueDate: '2026-03-30',
    amount: 22340.80, taxAmount: 1117.04, totalAmount: 23457.84,
    consumption: 4120, unit: 'MCF', status: 'pending',
    notes: 'Higher consumption due to cold snap', facility: 'Main Plant', costCenter: 'CC-1001', glCode: '6300-01',
  },
  {
    id: 'b5', billNumber: 'ISC-2026-03-001', vendorId: 'v4', vendorName: 'Industrial Steam Corp',
    utilityType: 'steam', meterId: 'm6', meterName: 'Main Plant - Steam',
    billingPeriodStart: '2026-02-01', billingPeriodEnd: '2026-02-28',
    issueDate: '2026-03-12', dueDate: '2026-04-01',
    amount: 15670.00, taxAmount: 783.50, totalAmount: 16453.50,
    consumption: 2340, unit: 'MMBTU', status: 'overdue',
    notes: 'Invoice dispute pending resolution', facility: 'Main Plant', costCenter: 'CC-1001', glCode: '6400-01',
  },
  {
    id: 'b6', billNumber: 'DTE-2026-02-001', vendorId: 'v1', vendorName: 'DTE Energy',
    utilityType: 'electricity', meterId: 'm1', meterName: 'Main Plant - Elec Main',
    billingPeriodStart: '2026-01-01', billingPeriodEnd: '2026-01-31',
    issueDate: '2026-02-05', dueDate: '2026-02-25',
    amount: 51360.00, taxAmount: 2568.00, totalAmount: 53928.00,
    consumption: 321100, unit: 'kWh', status: 'paid',
    paymentDate: '2026-02-20', paymentMethod: 'bank_transfer', paymentReference: 'BT-20260220-001',
    notes: '', facility: 'Main Plant', costCenter: 'CC-1001', glCode: '6100-01',
  },
  {
    id: 'b7', billNumber: 'CE-2026-02-001', vendorId: 'v3', vendorName: 'Consumers Energy',
    utilityType: 'gas', meterId: 'm5', meterName: 'Main Plant - Natural Gas',
    billingPeriodStart: '2026-01-01', billingPeriodEnd: '2026-01-31',
    issueDate: '2026-02-10', dueDate: '2026-03-02',
    amount: 19870.50, taxAmount: 993.53, totalAmount: 20864.03,
    consumption: 3670, unit: 'MCF', status: 'paid',
    paymentDate: '2026-02-28', paymentMethod: 'ach', paymentReference: 'ACH-20260228-002',
    notes: '', facility: 'Main Plant', costCenter: 'CC-1001', glCode: '6300-01',
  },
  {
    id: 'b8', billNumber: 'DTE-2026-03-003', vendorId: 'v1', vendorName: 'DTE Energy',
    utilityType: 'electricity', meterId: 'm3', meterName: 'Admin Building - Elec',
    billingPeriodStart: '2026-02-01', billingPeriodEnd: '2026-02-28',
    issueDate: '2026-03-05', dueDate: '2026-03-25',
    amount: 3450.25, taxAmount: 172.51, totalAmount: 3622.76,
    consumption: 21200, unit: 'kWh', status: 'approved',
    notes: '', facility: 'Admin Building', costCenter: 'CC-1003', glCode: '6100-03',
  },
];

export const monthlyConsumptionData = [
  { month: 'Oct', electricity: 285000, gas: 2800, water: 980000, steam: 1900 },
  { month: 'Nov', electricity: 297000, gas: 3200, water: 1020000, steam: 2100 },
  { month: 'Dec', electricity: 307850, gas: 3900, water: 1050000, steam: 2280 },
  { month: 'Jan', electricity: 321100, gas: 3670, water: 1080000, steam: 2340 },
  { month: 'Feb', electricity: 298760, gas: 4120, water: 1100000, steam: 2340 },
  { month: 'Mar', electricity: 312450, gas: 3850, water: 1245000, steam: 2180 },
];

export const monthlyCostData = [
  { month: 'Oct', electricity: 44820, gas: 15120, water: 7840, steam: 14250 },
  { month: 'Nov', electricity: 46520, gas: 17280, water: 8160, steam: 15750 },
  { month: 'Dec', electricity: 49256, gas: 21060, water: 8400, steam: 17100 },
  { month: 'Jan', electricity: 53928, gas: 19819, water: 8640, steam: 17550 },
  { month: 'Feb', electricity: 50211, gas: 23458, water: 8940, steam: 16454 },
  { month: 'Mar', electricity: 52180, gas: 20790, water: 9960, steam: 15300 },
];
