import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { facilities, costCenters } from '../data/mockData';
import { formatDate } from '../utils/helpers';
import { Building, Hash, Users, Bell, Shield, Database, Save } from 'lucide-react';

const TABS = ['Company', 'Cost Centers', 'Notifications', 'GL Codes', 'System'] as const;
type Tab = typeof TABS[number];

export default function Settings() {
  const { vendors, meters, bills } = useApp();
  const [tab, setTab] = useState<Tab>('Company');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const lCls = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-500 mt-0.5">Configure system preferences and company information</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors whitespace-nowrap ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Company' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Building className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Company Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className={lCls}>Company Name</label>
                <input className={inputCls} defaultValue="Industrial Manufacturing Corp" />
              </div>
              <div>
                <label className={lCls}>EIN / Tax ID</label>
                <input className={inputCls} defaultValue="12-3456789" />
              </div>
              <div className="col-span-2">
                <label className={lCls}>Primary Address</label>
                <input className={inputCls} defaultValue="1000 Industrial Blvd, Detroit, MI 48201" />
              </div>
              <div>
                <label className={lCls}>Industry Sector</label>
                <select className={inputCls}>
                  <option>Manufacturing</option>
                  <option>Chemical Processing</option>
                  <option>Food & Beverage</option>
                  <option>Automotive</option>
                  <option>Steel & Metals</option>
                </select>
              </div>
              <div>
                <label className={lCls}>Fiscal Year Start</label>
                <select className={inputCls}>
                  <option>January 1</option>
                  <option>April 1</option>
                  <option>July 1</option>
                  <option>October 1</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Facilities</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Code</th>
                    <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Address</th>
                    <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Area</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {facilities.map(f => (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="py-2.5 font-mono text-xs text-gray-700">{f.code}</td>
                      <td className="py-2.5 font-medium text-gray-900">{f.name}</td>
                      <td className="py-2.5 text-gray-500 text-xs">{f.address}</td>
                      <td className="py-2.5 text-right text-gray-700">{f.area.toLocaleString()} {f.areaUnit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'Cost Centers' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Cost Centers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Manager</th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Bills Assigned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {costCenters.map(cc => (
                  <tr key={cc.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 font-mono text-xs text-gray-700">{cc.code}</td>
                    <td className="px-3 py-3 font-medium text-gray-900">{cc.name}</td>
                    <td className="px-3 py-3 text-gray-600">{cc.department}</td>
                    <td className="px-3 py-3 text-gray-600">{cc.manager}</td>
                    <td className="px-3 py-3 text-right text-gray-700">{bills.filter(b => b.costCenter === cc.code).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Notifications' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Notification Preferences</h3>
          </div>
          {[
            { label: 'Bill Due Date Reminder', desc: 'Notify when a bill is due within X days', defaultDays: 7 },
            { label: 'Overdue Bill Alert', desc: 'Alert when a bill becomes overdue', defaultDays: 0 },
            { label: 'Contract Expiry Warning', desc: 'Warn when a vendor contract expires within X days', defaultDays: 90 },
            { label: 'Unusual Consumption Alert', desc: 'Alert when consumption deviates by more than X%', defaultDays: 20 },
          ].map(n => (
            <div key={n.label} className="flex items-center justify-between py-3 border-b border-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-900">{n.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                {n.defaultDays > 0 && (
                  <div className="flex items-center gap-1">
                    <input type="number" defaultValue={n.defaultDays} className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <span className="text-xs text-gray-500">days</span>
                  </div>
                )}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <label className={lCls}>Notification Email Recipients</label>
            <input className={inputCls} defaultValue="utility.manager@industrialcorp.com, finance@industrialcorp.com" />
            <p className="text-xs text-gray-500 mt-1">Separate multiple emails with commas</p>
          </div>
        </div>
      )}

      {tab === 'GL Codes' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Hash className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">GL Code Mapping</h3>
          </div>
          <div className="space-y-4">
            {[
              { utility: 'Electricity', accounts: [{ code: '6100-01', facility: 'Main Plant' }, { code: '6100-02', facility: 'Warehouse A' }, { code: '6100-03', facility: 'Admin Building' }] },
              { utility: 'Water', accounts: [{ code: '6200-01', facility: 'Main Plant' }] },
              { utility: 'Natural Gas', accounts: [{ code: '6300-01', facility: 'Main Plant' }] },
              { utility: 'Steam', accounts: [{ code: '6400-01', facility: 'Main Plant' }] },
            ].map(cat => (
              <div key={cat.utility} className="border border-gray-100 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-3">{cat.utility}</p>
                <div className="space-y-2">
                  {cat.accounts.map(a => (
                    <div key={a.code} className="flex items-center gap-3">
                      <input className="w-28 border border-gray-300 rounded px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue={a.code} />
                      <span className="text-sm text-gray-500">{a.facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'System' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">System Information</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Application', value: 'UtilityTrack Industrial v2.1.0' },
                { label: 'Total Bills', value: bills.length.toString() },
                { label: 'Active Vendors', value: vendors.length.toString() },
                { label: 'Active Meters', value: meters.length.toString() },
                { label: 'Last Data Sync', value: formatDate(new Date().toISOString()) },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{r.label}</span>
                  <span className="text-sm font-medium text-gray-900">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Database className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Data Management</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                Export All Data (CSV)
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                Import Bills from CSV
              </button>
              <button className="w-full text-left px-4 py-3 border border-red-100 rounded-lg text-sm text-red-600 hover:bg-red-50">
                Clear All Test Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
