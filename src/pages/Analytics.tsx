import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { monthlyCostData, monthlyConsumptionData } from '../data/mockData';
import { formatCurrency, formatNumber, utilityColors } from '../utils/helpers';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';

const PIE_COLORS = ['#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

const facilityData = [
  { facility: 'Main Plant', electricity: 312450, gas: 3850, water: 1245000, cost: 103000 },
  { facility: 'Warehouse A', electricity: 68940, gas: 0, water: 0, cost: 11813 },
  { facility: 'Admin Bldg', electricity: 21200, gas: 0, water: 0, cost: 3623 },
  { facility: 'R&D Center', electricity: 9860, gas: 0, water: 0, cost: 1945 },
];

const costPerUnitData = [
  { month: 'Oct', electricityCPU: 0.157, gasCPU: 5.40 },
  { month: 'Nov', electricityCPU: 0.157, gasCPU: 5.40 },
  { month: 'Dec', electricityCPU: 0.160, gasCPU: 5.40 },
  { month: 'Jan', electricityCPU: 0.168, gasCPU: 5.40 },
  { month: 'Feb', electricityCPU: 0.168, gasCPU: 5.70 },
  { month: 'Mar', electricityCPU: 0.167, gasCPU: 5.40 },
];

const VIEWS = ['Cost Trends', 'Consumption', 'By Facility', 'Rate Analysis'] as const;
type View = typeof VIEWS[number];

export default function Analytics() {
  const { bills } = useApp();
  const [view, setView] = useState<View>('Cost Trends');

  // Calculate YTD totals
  const ytdCost = monthlyCostData.slice(3).reduce((s, m) => s + m.electricity + m.gas + m.water + m.steam, 0);
  const ytdElec = monthlyCostData.slice(3).reduce((s, m) => s + m.electricity, 0);
  const ytdGas = monthlyCostData.slice(3).reduce((s, m) => s + m.gas, 0);
  const ytdConsumption = monthlyConsumptionData.slice(3).reduce((s, m) => s + m.electricity, 0);

  const prevYtdCost = monthlyCostData.slice(0, 3).reduce((s, m) => s + m.electricity + m.gas + m.water + m.steam, 0);
  const ytdChange = ((ytdCost - prevYtdCost) / prevYtdCost * 100).toFixed(1);

  const costPieData = [
    { name: 'Electricity', value: ytdElec },
    { name: 'Gas', value: ytdGas },
    { name: 'Water', value: monthlyCostData.slice(3).reduce((s, m) => s + m.water, 0) },
    { name: 'Steam', value: monthlyCostData.slice(3).reduce((s, m) => s + m.steam, 0) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analytics & Reports</h2>
          <p className="text-sm text-gray-500 mt-0.5">Energy consumption and cost analysis — YTD 2026</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* YTD KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Cost YTD', value: formatCurrency(ytdCost), sub: 'Jan–Mar 2026', trend: Number(ytdChange) > 0 ? 'up' : 'down', trendVal: `${Math.abs(Number(ytdChange))}% vs prior period` },
          { label: 'Electricity Cost YTD', value: formatCurrency(ytdElec), sub: `${formatNumber(ytdConsumption)} kWh total` },
          { label: 'Gas Cost YTD', value: formatCurrency(ytdGas), sub: `${formatNumber(monthlyConsumptionData.slice(3).reduce((s, m) => s + m.gas, 0))} MCF total` },
          { label: 'Bills Processed', value: bills.length.toString(), sub: `${bills.filter(b => b.status === 'paid').length} paid` },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">{k.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{k.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
            {k.trend && (
              <div className={`flex items-center gap-1 text-xs mt-1 font-medium ${k.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                {k.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {k.trendVal}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {VIEWS.map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === 'Cost Trends' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Utility Cost Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: unknown) => formatCurrency(Number(v ?? 0))} />
                <Legend />
                <Bar dataKey="electricity" name="Electricity" fill={utilityColors.electricity} stackId="a" />
                <Bar dataKey="gas" name="Gas" fill={utilityColors.gas} stackId="a" />
                <Bar dataKey="water" name="Water" fill={utilityColors.water} stackId="a" />
                <Bar dataKey="steam" name="Steam" fill={utilityColors.steam} stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">YTD Cost Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={costPieData} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {costPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: unknown) => formatCurrency(Number(v ?? 0))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">YTD Cost Summary by Utility</h3>
              <div className="space-y-3 mt-4">
                {costPieData.map((item, i) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(item.value / costPieData.reduce((s, d) => s + d.value, 0) * 100).toFixed(0)}%`,
                          background: PIE_COLORS[i]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'Consumption' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Electricity Consumption (kWh)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyConsumptionData}>
                <defs>
                  <linearGradient id="elecGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={utilityColors.electricity} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={utilityColors.electricity} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: unknown) => `${formatNumber(Number(v))} kWh`} />
                <Area type="monotone" dataKey="electricity" name="Electricity (kWh)" stroke={utilityColors.electricity} fill="url(#elecGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Gas Consumption (MCF)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyConsumptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: unknown) => `${formatNumber(Number(v))} MCF`} />
                  <Bar dataKey="gas" name="Gas (MCF)" fill={utilityColors.gas} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Water Consumption (Gallons × 1000)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyConsumptionData.map(m => ({ ...m, water: m.water / 1000 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: unknown) => `${formatNumber(Number(v) * 1000)} gal`} />
                  <Bar dataKey="water" name="Water (k gal)" fill={utilityColors.water} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {view === 'By Facility' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Cost by Facility (Mar 2026)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={facilityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis dataKey="facility" type="category" tick={{ fontSize: 12 }} width={90} />
                <Tooltip formatter={(v: unknown) => formatCurrency(Number(v ?? 0))} />
                <Bar dataKey="cost" name="Total Cost" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Facility Consumption Summary (Mar 2026)</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Facility</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Electricity (kWh)</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Gas (MCF)</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Water (gal)</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {facilityData.map(f => (
                  <tr key={f.facility} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{f.facility}</td>
                    <td className="px-5 py-3 text-right text-gray-700">{formatNumber(f.electricity)}</td>
                    <td className="px-5 py-3 text-right text-gray-700">{f.gas ? formatNumber(f.gas) : '-'}</td>
                    <td className="px-5 py-3 text-right text-gray-700">{f.water ? formatNumber(f.water) : '-'}</td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-900">{formatCurrency(f.cost)}</td>
                  </tr>
                ))}
                <tr className="border-t border-gray-200 bg-gray-50 font-semibold">
                  <td className="px-5 py-3 text-gray-900">Total</td>
                  <td className="px-5 py-3 text-right text-gray-900">{formatNumber(facilityData.reduce((s, f) => s + f.electricity, 0))}</td>
                  <td className="px-5 py-3 text-right text-gray-900">{formatNumber(facilityData.reduce((s, f) => s + f.gas, 0))}</td>
                  <td className="px-5 py-3 text-right text-gray-900">{formatNumber(facilityData.reduce((s, f) => s + f.water, 0))}</td>
                  <td className="px-5 py-3 text-right text-gray-900">{formatCurrency(facilityData.reduce((s, f) => s + f.cost, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'Rate Analysis' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Electricity & Gas Unit Rate Trends ($/unit)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={costPerUnitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${v.toFixed(3)}`} />
                <Tooltip formatter={(v: unknown) => `$${Number(v).toFixed(4)}`} />
                <Legend />
                <Line type="monotone" dataKey="electricityCPU" name="Electricity ($/kWh)" stroke={utilityColors.electricity} strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="gasCPU" name="Gas ($/MCF)" stroke={utilityColors.gas} strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[
              { title: 'Electricity Rate Summary', util: 'electricity', cpu: 0.167, budget: 0.155, unit: '/kWh', variance: '+7.7%' },
              { title: 'Gas Rate Summary', util: 'gas', cpu: 5.40, budget: 5.20, unit: '/MCF', variance: '+3.8%' },
            ].map(r => (
              <div key={r.title} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">{r.title}</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Current Rate', val: `$${r.cpu.toFixed(3)}${r.unit}` },
                    { label: 'Budgeted Rate', val: `$${r.budget.toFixed(3)}${r.unit}` },
                    { label: 'Variance', val: r.variance, red: true },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-500">{row.label}</span>
                      <span className={`text-sm font-semibold ${row.red ? 'text-red-600' : 'text-gray-900'}`}>{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
