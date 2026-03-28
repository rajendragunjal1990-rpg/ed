import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Vendor, UtilityType } from '../types';
import { utilityBgColors, utilityLabels, formatDate } from '../utils/helpers';
import { Plus, Edit2, Trash2, X, Building2, Phone, Mail, FileText, Calendar } from 'lucide-react';

const UTILITY_TYPES: UtilityType[] = ['electricity', 'water', 'gas', 'steam', 'compressed_air', 'wastewater'];

const defaultVendor: Omit<Vendor, 'id'> = {
  name: '', utilityType: 'electricity', accountNumber: '',
  contactName: '', contactEmail: '', contactPhone: '',
  address: '', contractExpiry: '', rateSchedule: '',
};

function VendorModal({ vendor, onClose }: { vendor: Vendor | null; onClose: () => void }) {
  const { addVendor, updateVendor } = useApp();
  const [form, setForm] = useState<Omit<Vendor, 'id'>>(vendor || { ...defaultVendor });
  const set = (f: keyof typeof form, v: string) => setForm(prev => ({ ...prev, [f]: v }));
  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const lCls = 'block text-xs font-medium text-gray-700 mb-1';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">{vendor ? 'Edit Vendor' : 'Add Vendor'}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={e => {
          e.preventDefault();
          if (vendor) updateVendor({ ...form, id: vendor.id });
          else addVendor({ ...form, id: `v${Date.now()}` });
          onClose();
        }} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={lCls}>Company Name *</label>
              <input required className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className={lCls}>Utility Type</label>
              <select className={inputCls} value={form.utilityType} onChange={e => set('utilityType', e.target.value as UtilityType)}>
                {UTILITY_TYPES.map(u => <option key={u} value={u}>{utilityLabels[u]}</option>)}
              </select>
            </div>
            <div>
              <label className={lCls}>Account Number</label>
              <input className={inputCls} value={form.accountNumber} onChange={e => set('accountNumber', e.target.value)} />
            </div>
            <div>
              <label className={lCls}>Contact Name</label>
              <input className={inputCls} value={form.contactName} onChange={e => set('contactName', e.target.value)} />
            </div>
            <div>
              <label className={lCls}>Contact Phone</label>
              <input className={inputCls} value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className={lCls}>Contact Email</label>
              <input type="email" className={inputCls} value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className={lCls}>Address</label>
              <input className={inputCls} value={form.address} onChange={e => set('address', e.target.value)} />
            </div>
            <div>
              <label className={lCls}>Contract Expiry</label>
              <input type="date" className={inputCls} value={form.contractExpiry} onChange={e => set('contractExpiry', e.target.value)} />
            </div>
            <div>
              <label className={lCls}>Rate Schedule</label>
              <input className={inputCls} value={form.rateSchedule} onChange={e => set('rateSchedule', e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{vendor ? 'Save' : 'Add Vendor'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Vendors() {
  const { vendors, bills, meters, deleteVendor } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editVendor, setEditVendor] = useState<Vendor | null>(null);

  const getBillCount = (vendorId: string) => bills.filter(b => b.vendorId === vendorId).length;
  const getMeterCount = (vendorId: string) => meters.filter(m => m.vendorId === vendorId).length;
  const getTotalSpend = (vendorId: string) => bills.filter(b => b.vendorId === vendorId).reduce((s, b) => s + b.totalAmount, 0);

  const isContractExpiring = (date: string) => {
    if (!date) return false;
    const d = new Date(date);
    const now = new Date();
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 90 && diff > 0;
  };

  const isContractExpired = (date: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Vendors & Suppliers</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage utility service providers and contracts</p>
        </div>
        <button onClick={() => { setEditVendor(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Vendor
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {vendors.map(vendor => {
          const expiryWarning = isContractExpiring(vendor.contractExpiry);
          const expired = isContractExpired(vendor.contractExpiry);
          const totalSpend = getTotalSpend(vendor.id);

          return (
            <div key={vendor.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${utilityBgColors[vendor.utilityType]}`}>
                      {utilityLabels[vendor.utilityType]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditVendor(vendor); setShowModal(true); }} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if (confirm('Delete vendor?')) deleteVendor(vendor.id); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-lg font-bold text-gray-900">{getBillCount(vendor.id)}</p>
                  <p className="text-xs text-gray-500">Bills</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-lg font-bold text-gray-900">{getMeterCount(vendor.id)}</p>
                  <p className="text-xs text-gray-500">Meters</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-sm font-bold text-gray-900">${(totalSpend / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-gray-500">Total Spend</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="text-xs">Acct: <strong className="font-mono">{vendor.accountNumber}</strong></span>
                </div>
                {vendor.contactName && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-xs">{vendor.contactName} — {vendor.contactPhone}</span>
                  </div>
                )}
                {vendor.contactEmail && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${vendor.contactEmail}`} className="text-xs text-blue-600 hover:underline">{vendor.contactEmail}</a>
                  </div>
                )}
                {vendor.rateSchedule && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-xs">Rate: {vendor.rateSchedule}</span>
                  </div>
                )}
                {vendor.contractExpiry && (
                  <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${expired ? 'bg-red-50 text-red-700' : expiryWarning ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-600'}`}>
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs font-medium">
                      Contract {expired ? 'Expired' : expiryWarning ? 'Expiring Soon' : 'Expires'}: {formatDate(vendor.contractExpiry)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && <VendorModal vendor={editVendor} onClose={() => { setShowModal(false); setEditVendor(null); }} />}
    </div>
  );
}
