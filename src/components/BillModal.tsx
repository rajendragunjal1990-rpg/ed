import { useState } from 'react';
import type { Bill, UtilityType, BillStatus, PaymentMethod } from '../types';
import { useApp } from '../context/AppContext';
import { X } from 'lucide-react';
import { utilityLabels } from '../utils/helpers';

interface Props {
  bill: Bill | null;
  onClose: () => void;
}

const UTILITY_TYPES: UtilityType[] = ['electricity', 'water', 'gas', 'steam', 'compressed_air', 'wastewater'];
const STATUSES: BillStatus[] = ['pending', 'approved', 'paid', 'overdue', 'disputed'];
const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'ach', label: 'ACH' },
  { value: 'check', label: 'Check' },
  { value: 'credit_card', label: 'Credit Card' },
];

const defaultBill: Omit<Bill, 'id'> = {
  billNumber: '', vendorId: '', vendorName: '', utilityType: 'electricity',
  billingPeriodStart: '', billingPeriodEnd: '', issueDate: new Date().toISOString().split('T')[0],
  dueDate: '', amount: 0, taxAmount: 0, totalAmount: 0, consumption: 0, unit: 'kWh',
  status: 'pending', notes: '', facility: 'Main Plant', costCenter: 'CC-1001', glCode: '6100-01',
};

export default function BillModal({ bill, onClose }: Props) {
  const { vendors, addBill, updateBill } = useApp();
  const [form, setForm] = useState<Omit<Bill, 'id'>>(bill ? { ...bill } : { ...defaultBill });

  const isEdit = !!bill;

  const set = (field: keyof typeof form, value: string | number) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'amount' || field === 'taxAmount') {
        next.totalAmount = Number(next.amount) + Number(next.taxAmount);
      }
      if (field === 'vendorId') {
        const vendor = vendors.find(v => v.id === value);
        if (vendor) { next.vendorName = vendor.name; next.utilityType = vendor.utilityType; }
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      updateBill({ ...form, id: bill.id });
    } else {
      addBill({ ...form, id: `b${Date.now()}` });
    }
    onClose();
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelCls = 'block text-xs font-medium text-gray-700 mb-1';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">{isEdit ? 'Edit Bill' : 'Add New Bill'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Bill Number *</label>
              <input required className={inputCls} value={form.billNumber} onChange={e => set('billNumber', e.target.value)} placeholder="e.g. DTE-2026-04-001" />
            </div>
            <div>
              <label className={labelCls}>Vendor *</label>
              <select required className={inputCls} value={form.vendorId} onChange={e => set('vendorId', e.target.value)}>
                <option value="">Select vendor...</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Utility Type</label>
              <select className={inputCls} value={form.utilityType} onChange={e => set('utilityType', e.target.value as UtilityType)}>
                {UTILITY_TYPES.map(u => <option key={u} value={u}>{utilityLabels[u]}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value as BillStatus)}>
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Period Start *</label>
              <input required type="date" className={inputCls} value={form.billingPeriodStart} onChange={e => set('billingPeriodStart', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Period End *</label>
              <input required type="date" className={inputCls} value={form.billingPeriodEnd} onChange={e => set('billingPeriodEnd', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Due Date *</label>
              <input required type="date" className={inputCls} value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Amount ($) *</label>
              <input required type="number" step="0.01" min="0" className={inputCls} value={form.amount} onChange={e => set('amount', parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelCls}>Tax ($)</label>
              <input type="number" step="0.01" min="0" className={inputCls} value={form.taxAmount} onChange={e => set('taxAmount', parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelCls}>Total ($)</label>
              <input readOnly className={inputCls + ' bg-gray-50 cursor-not-allowed'} value={form.totalAmount.toFixed(2)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Consumption</label>
              <input type="number" min="0" className={inputCls} value={form.consumption} onChange={e => set('consumption', parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelCls}>Unit</label>
              <input className={inputCls} value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="kWh, MCF, gallons..." />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Facility</label>
              <input className={inputCls} value={form.facility} onChange={e => set('facility', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Cost Center</label>
              <input className={inputCls} value={form.costCenter} onChange={e => set('costCenter', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>GL Code</label>
              <input className={inputCls} value={form.glCode} onChange={e => set('glCode', e.target.value)} />
            </div>
          </div>

          {form.status === 'paid' && (
            <div className="grid grid-cols-3 gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <label className={labelCls}>Payment Date</label>
                <input type="date" className={inputCls} value={form.paymentDate || ''} onChange={e => set('paymentDate', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Payment Method</label>
                <select className={inputCls} value={form.paymentMethod || ''} onChange={e => set('paymentMethod', e.target.value as PaymentMethod)}>
                  <option value="">Select...</option>
                  {PAYMENT_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Reference #</label>
                <input className={inputCls} value={form.paymentReference || ''} onChange={e => set('paymentReference', e.target.value)} />
              </div>
            </div>
          )}

          <div>
            <label className={labelCls}>Notes</label>
            <textarea rows={2} className={inputCls} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Additional notes..." />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{isEdit ? 'Save Changes' : 'Add Bill'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
