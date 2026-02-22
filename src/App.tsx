import React, { useState, useEffect } from 'react';
import {
  Box, AlertTriangle, Package,
  ArrowUpRight, ArrowDownRight, DollarSign,
  Briefcase, Download, Settings,
  X, Upload, Save, Trash2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  saveToStorage, loadFromStorage, parseExcel,
  mapStatsData, mapGPData, mapInventoryStatusData,
  mapProductData, mapCategoryData, mapTrendData
} from './utils/dataUtils';
import type { DashboardData } from './utils/dataUtils';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Initial/Mock Data
const INITIAL_STATS = [
  { label: 'Unique Vendors', value: '43', trend: '+2', trendUp: true },
  { label: 'Unique Items', value: '475', trend: '+12', trendUp: true },
  { label: 'Total In-Stock', value: '1,284', trend: '+54', trendUp: true },
  { label: 'Inventory Value', value: '842000000', trend: '+24000000', trendUp: true },
];

const INITIAL_GP = [
  { label: 'Total Sold', value: '34' },
  { label: 'Total Sales', value: '1200000000' },
  { label: 'Total Cost', value: '850000000' },
  { label: 'Total Profit', value: '350000000' },
  { label: 'GP %', value: '29.1%' },
];

const INITIAL_INVENTORY_STATUS = [
  { name: 'In Stock', value: 320, color: '#10b981' },
  { name: 'Low Stock', value: 85, color: '#f59e0b' },
  { name: 'Restock', value: 45, color: '#3b82f6' },
  { name: 'Out of Stock', value: 25, color: '#ef4444' },
];

const INITIAL_TOP_PRODUCTS = [
  { name: 'Electronics Kit A', sku: 'ELC-001', sold: 45, revenue: '120000000' },
  { name: 'Steel Frame 2x4', sku: 'STL-992', sold: 38, revenue: '85000000' },
  { name: 'Industrial Fan X', sku: 'FAN-102', sold: 32, revenue: '64000000' },
  { name: 'Power Tool Set', sku: 'PWR-553', sold: 28, revenue: '56000000' },
  { name: 'Safety Harness', sku: 'SFY-221', sold: 24, revenue: '32000000' },
];

const INITIAL_CATEGORY_PERFORMANCE = [
  { category: 'Heavy Machinery', qty: 120, revenue: 450 },
  { category: 'Hand Tools', qty: 450, revenue: 120 },
  { category: 'Safety Gear', qty: 320, revenue: 85 },
  { category: 'Electronics', qty: 180, revenue: 150 },
  { category: 'Raw Materials', qty: 850, revenue: 320 },
];

const INITIAL_SALES_TREND = [
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

const formatCurrency = (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return value;
  if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)}M`;
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

export default function App() {
  const [data, setData] = useState<DashboardData>({
    stats: INITIAL_STATS,
    gpAnalysis: INITIAL_GP,
    inventoryStatus: INITIAL_INVENTORY_STATUS,
    topProducts: INITIAL_TOP_PRODUCTS,
    categoryPerformance: INITIAL_CATEGORY_PERFORMANCE,
    salesTrend: INITIAL_SALES_TREND,
  });

  const [isManagePanelOpen, setIsManagePanelOpen] = useState(false);

  useEffect(() => {
    const savedData = loadFromStorage();
    if (savedData) {
      setData(savedData);
    }
  }, []);

  const handleSaveData = (newData: DashboardData) => {
    setData(newData);
    saveToStorage(newData);
    setIsManagePanelOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const sheets = await parseExcel(file);
        const newData = { ...data };

        if (sheets['Stats']) newData.stats = mapStatsData(sheets['Stats']);
        if (sheets['GP']) newData.gpAnalysis = mapGPData(sheets['GP']);
        if (sheets['Inventory']) newData.inventoryStatus = mapInventoryStatusData(sheets['Inventory']);
        if (sheets['Products']) newData.topProducts = mapProductData(sheets['Products']);
        if (sheets['Category']) newData.categoryPerformance = mapCategoryData(sheets['Category']);
        if (sheets['Sales']) newData.salesTrend = mapTrendData(sheets['Sales']);

        handleSaveData(newData);
      } catch (err) {
        console.error('Error parsing excel:', err);
        alert('Gagal membaca file Excel. Pastikan formatnya benar.');
      }
    }
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mereset data ke default?')) {
      handleSaveData({
        stats: INITIAL_STATS,
        gpAnalysis: INITIAL_GP,
        inventoryStatus: INITIAL_INVENTORY_STATUS,
        topProducts: INITIAL_TOP_PRODUCTS,
        categoryPerformance: INITIAL_CATEGORY_PERFORMANCE,
        salesTrend: INITIAL_SALES_TREND,
      });
    }
  };

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
          <button
            onClick={() => setIsManagePanelOpen(true)}
            className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Manage Data
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
          {data.stats.map((stat, idx) => (
            <StatCard
              key={idx}
              label={stat.label}
              value={stat.label.toLowerCase().includes('value') ? formatCurrency(stat.value) : stat.value}
              icon={idx === 0 ? <Briefcase className="w-5 h-5 text-blue-600" /> : idx === 1 ? <Box className="w-5 h-5 text-indigo-600" /> : idx === 2 ? <Package className="w-5 h-5 text-emerald-600" /> : <DollarSign className="w-5 h-5 text-amber-600" />}
              trend={stat.label.toLowerCase().includes('value') ? formatCurrency(stat.trend) : stat.trend}
              trendUp={stat.trendUp}
              delay={idx * 0.1}
            />
          ))}
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Trend Chart */}
          <Card className="lg:col-span-2" title="Rolling 12-Month Sales Trend" subtitle="Volume of units processed per month">
            <div className="h-[350px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.salesTrend}>
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
                    data={data.inventoryStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {data.inventoryStatus.map((entry, index) => (
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
              {data.gpAnalysis.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-slate-400 text-sm">{item.label}</span>
                  <span className="text-white font-bold">
                    {item.label.toLowerCase().includes('total') && !item.label.toLowerCase().includes('sold')
                      ? formatCurrency(item.value)
                      : item.value}
                  </span>
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
                  {data.topProducts.map((product, idx) => (
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
                        <span className="text-sm font-bold text-emerald-400">{formatCurrency(product.revenue)}</span>
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
                <BarChart data={data.categoryPerformance} layout="vertical">
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

      {/* Manage Data Panel */}
      <AnimatePresence>
        {isManagePanelOpen && (
          <ManageDataPanel
            data={data}
            onClose={() => setIsManagePanelOpen(false)}
            onSave={handleSaveData}
            onReset={handleReset}
            onFileUpload={handleFileUpload}
          />
        )}
      </AnimatePresence>

      <footer className="max-w-7xl mx-auto mt-12 py-8 border-t border-slate-800/50 text-center">
        <p className="text-slate-500 text-xs">© 2026 PT Oseanland Indonesia Group - Warehouse Management System v2.0</p>
      </footer>
    </div>
  );
}

function ManageDataPanel({ data, onClose, onSave, onReset, onFileUpload }: { data: DashboardData, onClose: () => void, onSave: (d: DashboardData) => void, onReset: () => void, onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [tempData, setTempData] = useState<DashboardData>(JSON.parse(JSON.stringify(data)));

  const handleStatChange = (idx: number, field: string, value: string) => {
    const next = { ...tempData };
    next.stats[idx][field] = value;
    setTempData(next);
  };

  const handleGPChange = (idx: number, value: string) => {
    const next = { ...tempData };
    next.gpAnalysis[idx].value = value;
    setTempData(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/40 backdrop-blur-sm">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl p-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Settings className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Manage Dashboard Data</h2>
              <p className="text-slate-500 text-xs">Update your warehouse metrics manually or via Excel</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-8">
          {/* File Upload Section */}
          <section className="bg-slate-800/40 p-5 rounded-2xl border border-dashed border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Data File
            </h3>
            <div className="flex flex-col items-center justify-center gap-3 py-6 bg-slate-900/50 rounded-xl">
              <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20">
                Browse Files (.xlsx)
                <input type="file" className="hidden" accept=".xlsx, .xls" onChange={onFileUpload} />
              </label>
              <p className="text-[10px] text-slate-500 italic">Supports multi-sheet Excel files (Stats, GP, Inventory, etc.)</p>
            </div>
          </section>

          {/* Manual Entry Section */}
          <section className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Manual Overrides
            </h3>

            {/* Quick Stats */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Executive Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                {tempData.stats.map((stat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-medium ml-1">{stat.label}</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* GP Analysis */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gross Profit Metrics</h4>
              <div className="space-y-3">
                {tempData.gpAnalysis.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <label className="text-xs text-slate-400 font-medium w-32">{item.label}</label>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleGPChange(idx, e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Reset All
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(tempData)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
            >
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
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
      className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-lg shadow-slate-950/20"
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
        <p className="text-2xl font-black text-white mt-1 leading-none">{value}</p>
      </div>
    </motion.div>
  );
}

function Card({ children, title, subtitle, className }: { children: React.ReactNode, title: string, subtitle?: string, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm shadow-xl shadow-slate-950/20", className)}
    >
      <div className="mb-2">
        <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-slate-500 text-sm mb-1">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}
