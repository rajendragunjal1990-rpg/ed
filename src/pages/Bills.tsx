import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Bill, BillStatus, UtilityType } from '../types';
import { formatCurrency, formatDate, statusColors, statusLabels, utilityBgColors, utilityLabels } from '../utils/helpers';
import { Plus, Search, Filter, Download, Eye, Edit2, Trash2, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import BillModal from '../components/BillModal';
import BillDetailModal from '../components/BillDetailModal';

const STATUS_OPTIONS: BillStatus[] = ['pending', 'approved', 'paid', 'overdue', 'disputed'];
const UTILITY_OPTIONS: UtilityType[] = ['electricity', 'water', 'gas', 'steam', 'compressed_air', 'wastewater'];

export default function Bills() {
  const { bills, deleteBill, updateBill } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<BillStatus | ''>('');
  const [filterUtility, setFilterUtility] = useState<UtilityType | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [editBill, setEditBill] = useState<Bill | null>(null);
  const [viewBill, setViewBill] = useState<Bill | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = bills.filter(b => {
    const matchSearch = !search || b.billNumber.toLowerCase().includes(search.toLowerCase()) || b.vendorName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || b.status === filterStatus;
    const matchUtility = !filterUtility || b.utilityType === filterUtility;
    return matchSearch && matchStatus && matchUtility;
  });

  const totalAmount = filtered.reduce((s, b) => s + b.totalAmount, 0);

  const handleEdit = (bill: Bill) => { setEditBill(bill); setShowModal(true); };
  const handleDelete = (id: string) => { if (confirm('Delete this bill?')) deleteBill(id); };

  const handleMarkPaid = (bill: Bill) => {
    updateBill({ ...bill, status: 'paid', paymentDate: new Date().toISOString().split('T')[0], paymentMethod: 'bank_transfer' });
  };

  const handleMarkApproved = (bill: Bill) => {
    updateBill({ ...bill, status: 'approved' });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(b => b.id)));
  };

  const summaryCounts = {
    pending: bills.filter(b => b.status === 'pending').length,
    approved: bills.filter(b => b.status === 'approved').length,
    overdue: bills.filter(b => b.status === 'overdue').length,
    paid: bills.filter(b => b.status === 'paid').length,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Utility Bills</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage and track all utility invoices</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => { setEditBill(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Add Bill
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending', count: summaryCounts.pending, icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
          { label: 'Approved', count: summaryCounts.approved, icon: CheckCircle, color: 'text-blue-600 bg-blue-50 border-blue-200' },
          { label: 'Overdue', count: summaryCounts.overdue, icon: AlertCircle, color: 'text-red-600 bg-red-50 border-red-200' },
          { label: 'Paid', count: summaryCounts.paid, icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' },
        ].map(({ label, count, icon: Icon, color }) => (
          <div key={label} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${color}`}>
            <Icon className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="text-xl font-bold">{count}</p>
              <p className="text-xs font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as BillStatus | '')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
          </select>
          <select
            value={filterUtility}
            onChange={e => setFilterUtility(e.target.value as UtilityType | '')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Utilities</option>
            {UTILITY_OPTIONS.map(u => <option key={u} value={u}>{utilityLabels[u]}</option>)}
          </select>
          {(filterStatus || filterUtility || search) && (
            <button
              onClick={() => { setSearch(''); setFilterStatus(''); setFilterUtility(''); }}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">{filtered.length} bill{filtered.length !== 1 ? 's' : ''} — Total: <strong className="text-gray-900">{formatCurrency(totalAmount)}</strong></p>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">{selectedIds.size} selected</span>
              <button className="text-blue-600 hover:underline">Bulk Approve</button>
              <button className="text-green-600 hover:underline">Mark Paid</button>
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3">
                  <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={selectAll} className="rounded" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Bill #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Vendor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Utility</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Period</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Facility</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-12 text-gray-400">No bills found.</td></tr>
              ) : filtered.map(bill => (
                <tr key={bill.id} className="hover:bg-gray-50 group">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.has(bill.id)} onChange={() => toggleSelect(bill.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700 whitespace-nowrap">{bill.billNumber}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{bill.vendorName}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${utilityBgColors[bill.utilityType]}`}>
                      {utilityLabels[bill.utilityType]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                    {formatDate(bill.billingPeriodStart)} – {formatDate(bill.billingPeriodEnd)}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-xs font-medium ${bill.status === 'overdue' ? 'text-red-600' : 'text-gray-600'}`}>
                    {formatDate(bill.dueDate)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(bill.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[bill.status]}`}>
                      {statusLabels[bill.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{bill.facility}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setViewBill(bill)} className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(bill)} className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {bill.status === 'pending' && (
                        <button onClick={() => handleMarkApproved(bill)} className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {(bill.status === 'approved' || bill.status === 'overdue') && (
                        <button onClick={() => handleMarkPaid(bill)} className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded" title="Mark Paid">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(bill.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <BillModal
          bill={editBill}
          onClose={() => { setShowModal(false); setEditBill(null); }}
        />
      )}
      {viewBill && <BillDetailModal bill={viewBill} onClose={() => setViewBill(null)} onEdit={b => { setViewBill(null); handleEdit(b); }} />}
    </div>
  );
}
