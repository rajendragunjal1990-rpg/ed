/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Bill, Vendor, Meter, MeterReading } from '../types';
import { bills as initialBills, vendors as initialVendors, meters as initialMeters, meterReadings as initialReadings } from '../data/mockData';

interface AppContextType {
  bills: Bill[];
  vendors: Vendor[];
  meters: Meter[];
  meterReadings: MeterReading[];
  addBill: (bill: Bill) => void;
  updateBill: (bill: Bill) => void;
  deleteBill: (id: string) => void;
  addVendor: (vendor: Vendor) => void;
  updateVendor: (vendor: Vendor) => void;
  deleteVendor: (id: string) => void;
  addMeter: (meter: Meter) => void;
  updateMeter: (meter: Meter) => void;
  deleteMeter: (id: string) => void;
  addReading: (reading: MeterReading) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [meters, setMeters] = useState<Meter[]>(initialMeters);
  const [meterReadings, setMeterReadings] = useState<MeterReading[]>(initialReadings);

  const addBill = (bill: Bill) => setBills(prev => [bill, ...prev]);
  const updateBill = (bill: Bill) => setBills(prev => prev.map(b => b.id === bill.id ? bill : b));
  const deleteBill = (id: string) => setBills(prev => prev.filter(b => b.id !== id));

  const addVendor = (vendor: Vendor) => setVendors(prev => [...prev, vendor]);
  const updateVendor = (vendor: Vendor) => setVendors(prev => prev.map(v => v.id === vendor.id ? vendor : v));
  const deleteVendor = (id: string) => setVendors(prev => prev.filter(v => v.id !== id));

  const addMeter = (meter: Meter) => setMeters(prev => [...prev, meter]);
  const updateMeter = (meter: Meter) => setMeters(prev => prev.map(m => m.id === meter.id ? meter : m));
  const deleteMeter = (id: string) => setMeters(prev => prev.filter(m => m.id !== id));

  const addReading = (reading: MeterReading) => setMeterReadings(prev => [reading, ...prev]);

  return (
    <AppContext.Provider value={{ bills, vendors, meters, meterReadings, addBill, updateBill, deleteBill, addVendor, updateVendor, deleteVendor, addMeter, updateMeter, deleteMeter, addReading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
