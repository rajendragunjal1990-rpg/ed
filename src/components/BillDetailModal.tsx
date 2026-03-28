import type { Bill } from '../types';
import { formatCurrency, formatDate, statusColors, statusLabels, utilityBgColors, utilityLabels } from '../utils/helpers';
import { X, Edit2, FileText, Calendar, DollarSign, Building, Hash } from 'lucide-react';

interface Props {
  bill: Bill;
  onClose: () => void;
  onEdit: (bill: Bill) => void;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 w-40 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-900 font-medium text-right">{value}</span>
    </div>
  );
}

export default function BillDetailModal({ bill, onClose, onEdit }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{bill.billNumber}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{bill.vendorName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(bill)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {/* Status Banner */}
          <div className={`flex items-center justify-between px-4 py-3 rounded-lg ${statusColors[bill.status]}`}>
            <span className="text-sm font-semibold">Status: {statusLabels[bill.status]}</span>
            <span className="text-lg font-bold">{formatCurrency(bill.totalAmount)}</span>
          </div>

          {/* Utility & Vendor */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bill Details</h3>
            </div>
            <div>
              <Row label="Utility Type" value={<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${utilityBgColors[bill.utilityType]}`}>{utilityLabels[bill.utilityType]}</span>} />
              <Row label="Issue Date" value={formatDate(bill.issueDate)} />
              <Row label="Due Date" value={<span className={bill.status === 'overdue' ? 'text-red-600' : ''}>{formatDate(bill.dueDate)}</span>} />
            </div>
          </div>

          {/* Billing Period */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Billing Period</h3>
            </div>
            <Row label="Period" value={`${formatDate(bill.billingPeriodStart)} – ${formatDate(bill.billingPeriodEnd)}`} />
            <Row label="Consumption" value={`${new Intl.NumberFormat().format(bill.consumption)} ${bill.unit}`} />
            {bill.meterName && <Row label="Meter" value={bill.meterName} />}
          </div>

          {/* Amounts */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Amounts</h3>
            </div>
            <Row label="Subtotal" value={formatCurrency(bill.amount)} />
            <Row label="Tax" value={formatCurrency(bill.taxAmount)} />
            <div className="flex items-start justify-between py-2">
              <span className="text-sm font-semibold text-gray-900 w-40">Total</span>
              <span className="text-base font-bold text-gray-900">{formatCurrency(bill.totalAmount)}</span>
            </div>
          </div>

          {/* Allocation */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building className="w-4 h-4 text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Allocation</h3>
            </div>
            <Row label="Facility" value={bill.facility} />
            <Row label="Cost Center" value={bill.costCenter} />
            <Row label="GL Code" value={<span className="font-mono text-xs">{bill.glCode}</span>} />
          </div>

          {/* Payment Info */}
          {bill.status === 'paid' && bill.paymentDate && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Hash className="w-4 h-4 text-gray-400" />
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment Info</h3>
              </div>
              <Row label="Payment Date" value={formatDate(bill.paymentDate)} />
              {bill.paymentMethod && <Row label="Method" value={bill.paymentMethod.replace('_', ' ').toUpperCase()} />}
              {bill.paymentReference && <Row label="Reference" value={<span className="font-mono text-xs">{bill.paymentReference}</span>} />}
            </div>
          )}

          {/* Notes */}
          {bill.notes && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 mb-1">Notes</p>
              <p className="text-sm text-gray-700">{bill.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
