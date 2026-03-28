import { useApp } from '../context/AppContext';
import { formatCurrency, formatNumber, utilityColors, statusColors, statusLabels, formatDate } from '../utils/helpers';
import { monthlyCostData, monthlyConsumptionData } from '../data/mockData';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, DollarSign, Zap, Droplets, Flame } from 'lucide-react';

function StatCard({ title, value, subtitle, icon: Icon, trend, trendLabel, color }: {
  title: string; value: string; subtitle?: string;
  icon: React.ElementType; trend?: 'up' | 'down';
  trendLabel?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trendLabel && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trendLabel}
        </div>
      )}
    </div>
  );
}

const UTILITY_PIE_COLORS = ['#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const { bills } = useApp();

  const totalPending = bills.filter(b => b.status === 'pending' || b.status === 'approved').reduce((s, b) => s + b.totalAmount, 0);
  const totalOverdue = bills.filter(b => b.status === 'overdue').reduce((s, b) => s + b.totalAmount, 0);
  const totalPaidThisMonth = bills.filter(b => b.status === 'paid' && b.paymentDate?.startsWith('2026-03')).reduce((s, b) => s + b.totalAmount, 0);
  const overdueCount = bills.filter(b => b.status === 'overdue').length;

  const currentMonthCost = monthlyCostData[monthlyCostData.length - 1];
  const prevMonthCost = monthlyCostData[monthlyCostData.length - 2];
  const totalCurrMonth = currentMonthCost.electricity + currentMonthCost.gas + currentMonthCost.water + currentMonthCost.steam;
  const totalPrevMonth = prevMonthCost.electricity + prevMonthCost.gas + prevMonthCost.water + prevMonthCost.steam;
  const costChange = ((totalCurrMonth - totalPrevMonth) / totalPrevMonth * 100).toFixed(1);

  const costByUtility = [
    { name: 'Electricity', value: currentMonthCost.electricity },
    { name: 'Gas', value: currentMonthCost.gas },
    { name: 'Water', value: currentMonthCost.water },
    { name: 'Steam', value: currentMonthCost.steam },
  ];

  const recentBills = [...bills].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-0.5">Overview of utility consumption and billing — March 2026</p>
      </div>

      {/* Alerts */}
      {(overdueCount > 0 || totalPending > 0) && (
        <div className="space-y-2">
          {overdueCount > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span><strong>{overdueCount} overdue bill{overdueCount > 1 ? 's' : ''}</strong> totaling {formatCurrency(totalOverdue)} require immediate attention.</span>
            </div>
          )}
          {totalPending > 0 && (
            <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-700">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span><strong>{bills.filter(b => b.status === 'pending' || b.status === 'approved').length} bills pending payment</strong> totaling {formatCurrency(totalPending)}.</span>
            </div>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Cost (Mar)"
          value={formatCurrency(totalCurrMonth)}
          subtitle="All utilities combined"
          icon={DollarSign}
          trend={Number(costChange) > 0 ? 'up' : 'down'}
          trendLabel={`${Math.abs(Number(costChange))}% vs last month`}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Electricity (Mar)"
          value={formatCurrency(currentMonthCost.electricity)}
          subtitle={`${formatNumber(monthlyConsumptionData[5].electricity)} kWh`}
          icon={Zap}
          color="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Pending Payment"
          value={formatCurrency(totalPending)}
          subtitle={`${bills.filter(b => b.status === 'pending' || b.status === 'approved').length} bills`}
          icon={Clock}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Paid This Month"
          value={formatCurrency(totalPaidThisMonth)}
          subtitle="March 2026"
          icon={CheckCircle}
          color="bg-green-100 text-green-600"
        />
      </div>

      {/* Second Row KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Natural Gas (Mar)"
          value={formatCurrency(currentMonthCost.gas)}
          subtitle={`${formatNumber(monthlyConsumptionData[5].gas)} MCF`}
          icon={Flame}
          color="bg-red-100 text-red-600"
        />
        <StatCard
          title="Water (Mar)"
          value={formatCurrency(currentMonthCost.water)}
          subtitle={`${formatNumber(monthlyConsumptionData[5].water)} gal`}
          icon={Droplets}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Overdue Amount"
          value={formatCurrency(totalOverdue)}
          subtitle={`${overdueCount} overdue bill${overdueCount !== 1 ? 's' : ''}`}
          icon={AlertCircle}
          trend={overdueCount > 0 ? 'up' : undefined}
          trendLabel={overdueCount > 0 ? 'Requires attention' : undefined}
          color="bg-red-100 text-red-600"
        />
        <StatCard
          title="Active Meters"
          value="6"
          subtitle="Across 4 facilities"
          icon={Zap}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Cost Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Utility Cost Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyCostData}>
              <defs>
                <linearGradient id="colorElec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={utilityColors.electricity} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={utilityColors.electricity} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={utilityColors.gas} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={utilityColors.gas} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => formatCurrency(Number(v ?? 0))} />
              <Legend />
              <Area type="monotone" dataKey="electricity" name="Electricity" stroke={utilityColors.electricity} fill="url(#colorElec)" strokeWidth={2} />
              <Area type="monotone" dataKey="gas" name="Gas" stroke={utilityColors.gas} fill="url(#colorGas)" strokeWidth={2} />
              <Area type="monotone" dataKey="water" name="Water" stroke={utilityColors.water} strokeWidth={2} fill="none" />
              <Area type="monotone" dataKey="steam" name="Steam" stroke={utilityColors.steam} strokeWidth={2} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cost by Utility Pie */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Cost Distribution (Mar)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={costByUtility} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {costByUtility.map((_, i) => (
                  <Cell key={i} fill={UTILITY_PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: unknown) => formatCurrency(Number(v ?? 0))} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {costByUtility.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: UTILITY_PIE_COLORS[i] }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consumption Bar Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Electricity Consumption (kWh)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyConsumptionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: unknown) => `${formatNumber(Number(v))} kWh`} />
            <Bar dataKey="electricity" name="Electricity" fill={utilityColors.electricity} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Bills */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Recent Bills</h3>
          <a href="/bills" className="text-xs text-blue-600 hover:underline font-medium">View all</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Bill #</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Vendor</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Due Date</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBills.map(bill => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-700">{bill.billNumber}</td>
                  <td className="px-5 py-3 text-gray-900">{bill.vendorName}</td>
                  <td className="px-5 py-3 text-gray-600">{formatDate(bill.dueDate)}</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-900">{formatCurrency(bill.totalAmount)}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[bill.status]}`}>
                      {statusLabels[bill.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
