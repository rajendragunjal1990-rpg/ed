import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Meter, MeterReading, UtilityType } from '../types';
import { formatDate, formatNumber, utilityBgColors, utilityLabels, utilityColors } from '../utils/helpers';
import { Plus, Gauge, MapPin, Calendar, Edit2, Trash2, X, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

const UTILITY_TYPES: UtilityType[] = ['electricity', 'water', 'gas', 'steam', 'compressed_air', 'wastewater'];

function MeterForm({ meter, onSave, onClose, vendors }: { meter: Meter | null; onSave: (m: Meter) => void; onClose: () => void; vendors: { id: string; name: string }[] }) {
  const [form, setForm] = useState<Omit<Meter, 'id'>>(meter || {
    name: '', utilityType: 'electricity', location: '', unit: 'kWh',
    vendorId: '', accountNumber: '', serialNumber: '',
    installedDate: '', lastReading: 0, lastReadingDate: '',
  });
  const set = (f: keyof typeof form, v: string | number) => setForm(prev => ({ ...prev, [f]: v }));
  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const lCls = 'block text-xs font-medium text-gray-700 mb-1';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">{meter ? 'Edit Meter' : 'Add Meter'}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave({ ...form, id: meter?.id || `m${Date.now()}` }); onClose(); }} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={lCls}>Meter Name *</label>
              <input required className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className={lCls}>Utility Type</label>
              <select className={inputCls} value={form.utilityType} onChange={e => set('utilityType', e.target.value as UtilityType)}>
                {UTILITY_TYPES.map(u => <option key={u} value={u}>{utilityLabels[u]}</option>)}
              </select>
            </div>
            <div>
              <label className={lCls}>Unit</label>
              <input className={inputCls} value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="kWh, MCF, gallons..." />
            </div>
            <div className="col-span-2">
              <label className={lCls}>Location</label>
              <input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} />
            </div>
            <div>
              <label className={lCls}>Vendor</label>
              <select className={inputCls} value={form.vendorId} onChange={e => set('vendorId', e.target.value)}>
                <option value="">Select...</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <div>
              <label className={lCls}>Account Number</label>
              <input className={inputCls} value={form.accountNumber} onChange={e => set('accountNumber', e.target.value)} />
            </div>
            <div>
              <label className={lCls}>Serial Number</label>
              <input className={inputCls} value={form.serialNumber} onChange={e => set('serialNumber', e.target.value)} />
            </div>
            <div>
              <label className={lCls}>Installed Date</label>
              <input type="date" className={inputCls} value={form.installedDate} onChange={e => set('installedDate', e.target.value)} />
            </div>
            <div>
              <label className={lCls}>Last Reading</label>
              <input type="number" className={inputCls} value={form.lastReading} onChange={e => set('lastReading', parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <label className={lCls}>Reading Date</label>
              <input type="date" className={inputCls} value={form.lastReadingDate} onChange={e => set('lastReadingDate', e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{meter ? 'Save' : 'Add Meter'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReadingForm({ meter, onSave, onClose }: { meter: Meter; onSave: (r: MeterReading) => void; onClose: () => void }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reading, setReading] = useState(meter.lastReading);
  const [notes, setNotes] = useState('');
  const consumption = Math.max(0, reading - meter.lastReading);
  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Record Meter Reading</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={e => {
          e.preventDefault();
          onSave({ id: `mr${Date.now()}`, meterId: meter.id, date, reading, consumption, recordedBy: 'Admin User', notes });
          onClose();
        }} className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p className="font-medium text-gray-900">{meter.name}</p>
            <p className="text-gray-500">Last reading: {formatNumber(meter.lastReading)} {meter.unit} on {formatDate(meter.lastReadingDate)}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Reading Date</label>
            <input required type="date" className={inputCls} value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Current Reading ({meter.unit})</label>
            <input required type="number" className={inputCls} value={reading} onChange={e => setReading(parseFloat(e.target.value) || 0)} />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-600 font-medium">Calculated Consumption</p>
            <p className="text-lg font-bold text-blue-800">{formatNumber(consumption)} {meter.unit}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
            <textarea rows={2} className={inputCls} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Record Reading</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Meters() {
  const { meters, meterReadings, vendors, addMeter, updateMeter, deleteMeter, addReading } = useApp();
  const [showMeterForm, setShowMeterForm] = useState(false);
  const [editMeter, setEditMeter] = useState<Meter | null>(null);
  const [readingMeter, setReadingMeter] = useState<Meter | null>(null);
  const [expandedMeter, setExpandedMeter] = useState<string | null>(null);

  const handleSaveMeter = (m: Meter) => {
    if (meters.find(x => x.id === m.id)) updateMeter(m);
    else addMeter(m);
  };

  const getMeterReadings = (meterId: string) =>
    meterReadings.filter(r => r.meterId === meterId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const vendorName = (id: string) => vendors.find(v => v.id === id)?.name || '-';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Meters & Readings</h2>
          <p className="text-sm text-gray-500 mt-0.5">Track utility meters and consumption readings</p>
        </div>
        <button onClick={() => { setEditMeter(null); setShowMeterForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Meter
        </button>
      </div>

      {/* Meter Cards */}
      <div className="space-y-4">
        {meters.map(meter => {
          const readings = getMeterReadings(meter.id);
          const isExpanded = expandedMeter === meter.id;
          const latestReading = readings[0];
          const prevReading = readings[1];
          const changePercent = latestReading && prevReading
            ? ((latestReading.consumption - prevReading.consumption) / prevReading.consumption * 100).toFixed(1)
            : null;

          return (
            <div key={meter.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: utilityColors[meter.utilityType] + '20' }}>
                      <Gauge className="w-5 h-5" style={{ color: utilityColors[meter.utilityType] }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{meter.name}</h3>
                      <div className="flex items-center gap-4 mt-1 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${utilityBgColors[meter.utilityType]}`}>
                          {utilityLabels[meter.utilityType]}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {meter.location}
                        </span>
                        <span className="text-xs text-gray-500">SN: {meter.serialNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => setReadingMeter(meter)} className="px-3 py-1.5 text-xs border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50">
                      + Reading
                    </button>
                    <button onClick={() => { setEditMeter(meter); setShowMeterForm(true); }} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (confirm('Delete meter?')) deleteMeter(meter.id); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Last Reading</p>
                    <p className="text-base font-bold text-gray-900">{formatNumber(meter.lastReading)}</p>
                    <p className="text-xs text-gray-400">{meter.unit}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Last Read Date</p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(meter.lastReadingDate)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Vendor</p>
                    <p className="text-sm font-semibold text-gray-900">{vendorName(meter.vendorId)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Latest Consumption</p>
                    <div className="flex items-center gap-1">
                      <p className="text-base font-bold text-gray-900">{latestReading ? formatNumber(latestReading.consumption) : '-'}</p>
                      {changePercent && (
                        <span className={`text-xs font-medium ${Number(changePercent) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          <TrendingUp className="w-3 h-3 inline" /> {Math.abs(Number(changePercent))}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{meter.unit}</p>
                  </div>
                </div>

                {readings.length > 0 && (
                  <button
                    className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => setExpandedMeter(isExpanded ? null : meter.id)}
                  >
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {isExpanded ? 'Hide' : 'View'} reading history ({readings.length})
                  </button>
                )}
              </div>

              {/* Reading History */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase">Date</th>
                          <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase">Reading</th>
                          <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase">Consumption</th>
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase">Recorded By</th>
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {readings.map(r => (
                          <tr key={r.id} className="hover:bg-gray-50">
                            <td className="px-5 py-2.5 text-gray-700">{formatDate(r.date)}</td>
                            <td className="px-5 py-2.5 text-right font-mono text-gray-900">{formatNumber(r.reading)}</td>
                            <td className="px-5 py-2.5 text-right font-semibold text-gray-900">{formatNumber(r.consumption)} <span className="text-xs text-gray-400 font-normal">{meter.unit}</span></td>
                            <td className="px-5 py-2.5 text-gray-600">{r.recordedBy}</td>
                            <td className="px-5 py-2.5 text-gray-500 text-xs">{r.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showMeterForm && (
        <MeterForm meter={editMeter} onSave={handleSaveMeter} onClose={() => { setShowMeterForm(false); setEditMeter(null); }} vendors={vendors} />
      )}
      {readingMeter && (
        <ReadingForm meter={readingMeter} onSave={r => { addReading(r); }} onClose={() => setReadingMeter(null)} />
      )}
    </div>
  );
}
