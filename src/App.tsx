import React from 'react';
import {
  Box, AlertTriangle, Package,
  ArrowUpRight, ArrowDownRight, DollarSign,
  Briefcase, Download, Calendar
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data from Spreadsheet
const STATS = [
  { label: 'Unique Vendors', value: '43', icon: <Briefcase className="w-5 h-5 text-blue-600" />, trend: '+2', trendUp: true },
  { label: 'Unique Items', value: '475', icon: <Box className="w-5 h-5 text-indigo-600" />, trend: '+12', trendUp: true },
  { label: 'Total In-Stock', value: '1,284', icon: <Package className="w-5 h-5 text-emerald-600" />, trend: '+54', trendUp: true },
  { label: 'Inventory Value', value: 'Rp 842M', icon: <DollarSign className="w-5 h-5 text-amber-600" />, trend: '+Rp 24M', trendUp: true },
];

const GP_ANALYSIS = [
  { label: 'Total Sold', value: '34' },
  { label: 'Total Sales', value: 'Rp 1.2B' },
  { label: 'Total Cost', value: 'Rp 850M' },
  { label: 'Total Profit', value: 'Rp 350M' },
  { label: 'GP %', value: '29.1%' },
];

const INVENTORY_STATUS = [
  { name: 'In Stock', value: 320, color: '#10b981' },
  { name: 'Low Stock', value: 85, color: '#f59e0b' },
  { name: 'Restock', value: 45, color: '#3b82f6' },
  { name: 'Out of Stock', value: 25, color: '#ef4444' },
];

const TOP_PRODUCTS = [
  { name: 'Electronics Kit A', sku: 'ELC-001', sold: 45, revenue: 'Rp 120M' },
  { name: 'Steel Frame 2x4', sku: 'STL-992', sold: 38, revenue: 'Rp 85M' },
  { name: 'Industrial Fan X', sku: 'FAN-102', sold: 32, revenue: 'Rp 64M' },
  { name: 'Power Tool Set', sku: 'PWR-553', sold: 28, revenue: 'Rp 56M' },
  { name: 'Safety Harness', sku: 'SFY-221', sold: 24, revenue: 'Rp 32M' },
];

const CATEGORY_PERFORMANCE = [
  { category: 'Heavy Machinery', qty: 120, revenue: 450 },
  { category: 'Hand Tools', qty: 450, revenue: 120 },
  { category: 'Safety Gear', qty: 320, revenue: 85 },
  { category: 'Electronics', qty: 180, revenue: 150 },
  { category: 'Raw Materials', qty: 850, revenue: 320 },
];

const SALES_TREND = [
  { month: 'Mar', sales: 400 },
  { month: 'Apr', sales: 450 },
  { month: 'May', sales: 420 },
  { month: 'Jun', sales: 500 },
  { month: 'Jul', sales: 550 },
  { month: 'Aug', sales: 580 },
  { month: 'Sep', sales: 600 },
  { month: 'Oct', sales: 620 },
  { month: 'Nov', sales: 680 },
  { month: 'Dec', sales: 750 },
  { month: 'Jan', sales: 720 },
  { month: 'Feb', sales: 800 },
];

export default function App() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans p-4 md:p-8 overflow-x-hidden">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-1"
          >
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Box className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Warehouse Dashboard OSI
            </h1>
          </motion.div>
          <p className="text-slate-400 text-sm ml-11">PT Oseanland Indonesia Group | Inventory & Logistics Control</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-all flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Februari 2026
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => (
            <StatCard key={idx} {...stat} delay={idx * 0.1} />
          ))}
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Trend Chart */}
          <Card className="lg:col-span-2" title="Rolling 12-Month Sales Trend" subtitle="Volume of units processed per month">
            <div className="h-[350px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SALES_TREND}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Inventory Status Pie */}
          <Card title="Inventory Distribution" subtitle="Items by stock status level">
            <div className="h-[300px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={INVENTORY_STATUS}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {INVENTORY_STATUS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Gross Profit Analysis */}
          <Card title="Gross Profit Analysis" subtitle="Performance for February 2026">
            <div className="mt-6 space-y-4">
              {GP_ANALYSIS.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-slate-400 text-sm">{item.label}</span>
                  <span className="text-white font-bold">{item.value}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Storage Insights</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  "Look into modifying Ketchup prices and minimum restock values for optimized turnover."
                </p>
              </div>
            </div>
          </Card>

          {/* Top Selling Products */}
          <Card className="lg:col-span-2" title="Top Selling Products" subtitle="Highest performing units this month">
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">Product</th>
                    <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">SKU</th>
                    <th className="pb-3 text-xs font-semibold text-slate-500 uppercase text-right">QTY Sold</th>
                    <th className="pb-3 text-xs font-semibold text-slate-500 uppercase text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {TOP_PRODUCTS.map((product, idx) => (
                    <tr key={idx} className="group hover:bg-slate-800/30 transition-colors">
                      <td className="py-4">
                        <span className="text-sm font-medium text-white">{product.name}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-xs font-mono text-slate-400">{product.sku}</span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-sm font-bold text-indigo-400">{product.sold}</span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-sm font-bold text-emerald-400">{product.revenue}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Category Performance */}
          <Card title="Category Performance" subtitle="Quantity & Revenue breakdown">
            <div className="h-[350px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CATEGORY_PERFORMANCE} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1e293b" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                  />
                  <Legend />
                  <Bar dataKey="qty" name="Units" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar dataKey="revenue" name="Rev (k)" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-12 py-8 border-t border-slate-800/50 text-center">
        <p className="text-slate-500 text-xs">© 2026 PT Oseanland Indonesia Group - Warehouse Management System v2.0</p>
      </footer>
    </div>
  );
}

function StatCard({ label, value, icon, trend, trendUp, delay }: { label: string, value: string, icon: React.ReactNode, trend: string, trendUp: boolean, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">{icon}</div>
        <div className={cn("flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full", trendUp ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div>
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</h3>
        <p className="text-2xl font-black text-white mt-1">{value}</p>
      </div>
    </motion.div>
  );
}

function Card({ children, title, subtitle, className }: { children: React.ReactNode, title: string, subtitle?: string, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm shadow-xl", className)}
    >
      <div className="mb-2">
        <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}
