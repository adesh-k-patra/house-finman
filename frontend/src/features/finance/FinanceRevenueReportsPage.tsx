
/**
 * Finance Revenue Reports Page for House FinMan
 * 
 * Features:
 * - Detailed revenue breakdown
 * - Revenue by product, region, partner
 * - Recurring revenue analysis
 */

import { useState } from 'react'
import { Download, Filter, TrendingUp, DollarSign, BarChart3, FileText, Share2, Eye, Award, Users } from 'lucide-react'
import { Button, Card, KPICard, SideDrawer, CustomChartTooltip } from '@/components/ui' // SideDrawer imported
import { cn, formatCurrency } from '@/utils'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts'
import { ChartDefs } from '@/components/ui/ChartDefs'

const monthlyRevenue = [
    { month: 'Jul', revenue: 4500000, target: 4000000 },
    { month: 'Aug', revenue: 4800000, target: 4200000 },
    { month: 'Sep', revenue: 5200000, target: 4500000 },
    { month: 'Oct', revenue: 5800000, target: 4800000 },
    { month: 'Nov', revenue: 6500000, target: 5000000 },
    { month: 'Dec', revenue: 7200000, target: 5500000 },
    { month: 'Jan', revenue: 7800000, target: 6000000 },
]

const revenueByProduct = [
    { name: 'Home Loan', value: 45, color: '#3B82F6' },
    { name: 'LAP', value: 25, color: '#10B981' },
    { name: 'Balance Transfer', value: 20, color: '#8B5CF6' },
    { name: 'Top Up', value: 10, color: '#F59E0B' },
]

const GLASS_COLORS = {
    '#3B82F6': 'blue',
    '#10B981': 'green',
    '#8B5CF6': 'purple',
    '#F59E0B': 'orange'
}

const revenueByRegion = [
    { region: 'West', amount: 2500000 },
    { region: 'North', amount: 1800000 },
    { region: 'South', amount: 2200000 },
    { region: 'East', amount: 900000 },
]

const recentReports = [
    { id: 1, date: '2025-12-28', description: 'Monthly Sales Report - North Zone', amount: 1800000, status: 'generated', type: 'Sales' },
    { id: 2, date: '2025-12-27', description: 'Commission Payouts - Dec', amount: -450000, status: 'pending', type: 'Finance' },
    { id: 3, date: '2025-12-26', description: 'Q4 Revenue Analysis', amount: 0, status: 'generated', type: 'Analytics' },
    { id: 4, date: '2025-12-25', description: 'Partner Performance Review', amount: 0, status: 'generated', type: 'Performance' },
    { id: 5, date: '2025-12-24', description: 'Weekly Revenue Tracker', amount: 650000, status: 'generated', type: 'Revenue' },
]

export default function FinanceRevenueReportsPage() {
    const [selectedReport, setSelectedReport] = useState<any>(null)

    return (
        <div className="space-y-6 mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Revenue Reports</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track financial performance, recurring revenue, and targets.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>Filter</Button>
                    <Button variant="primary" leftIcon={<Download className="w-4 h-4" />}>Export Data</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Total Revenue" value={formatCurrency(7800000)} trend={{ value: 12.5, direction: 'up' }} icon={<DollarSign className="w-4 h-4" />} variant="blue" />
                <KPICard title="Recurring Revenue" value={formatCurrency(3200000)} trend={{ value: 8.2, direction: 'up' }} icon={<TrendingUp className="w-4 h-4" />} variant="emerald" />
                <KPICard title="Target Achievement" value="130%" trend={{ value: 5.4, direction: 'up' }} icon={<Award className="w-4 h-4" />} variant="purple" />
                <KPICard title="Active Partners" value="142" trend={{ value: 2.1, direction: 'up' }} icon={<Users className="w-4 h-4" />} variant="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card title="Revenue vs Target" subtitle="Monthly performance tracking" className="col-span-2">
                    <div className="h-80 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyRevenue}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(v: any) => `${(Number(v) / 100000).toFixed(1)}L`} />
                                <Tooltip content={<CustomChartTooltip currency />} />
                                <Legend />
                                <Area type="linear" dataKey="revenue" stroke="#3B82F6" strokeWidth={1.5} fillOpacity={1} fill="url(#glass-blue)" name="Actual Revenue" filter="url(#shadow)" />
                                <Area type="monotone" dataKey="target" stroke="#94A3B8" strokeDasharray="5 5" fill="none" strokeWidth={2} name="Target" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Product Mix" subtitle="Revenue share by product">
                    <div className="h-80 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <ChartDefs />
                                <Pie data={revenueByProduct} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({ percent }: any) => `${(percent * 100).toFixed(0)}%`} stroke="none">
                                    {revenueByProduct.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`url(#glass-${GLASS_COLORS[entry.color as keyof typeof GLASS_COLORS] || 'blue'})`} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomChartTooltip currency />} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card title="Regional Performance" subtitle="Revenue contribution by zone">
                    <div className="h-80 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueByRegion} layout="vertical">
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.5} />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(v: any) => `${(Number(v) / 100000).toFixed(0)}L`} />
                                <YAxis dataKey="region" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} width={50} />
                                <Tooltip content={<CustomChartTooltip currency />} cursor={{ fill: '#F1F5F9', opacity: 0.5 }} />
                                <Bar dataKey="amount" fill="url(#glass-purple)" radius={[0, 4, 4, 0]} barSize={24} name="Revenue" filter="url(#shadow)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                    <table className="w-full">
                        <thead className="bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Date</th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Description</th>
                                <th className="px-4 py-4 text-right text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Amount</th>
                                <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {recentReports.map((report) => (
                                <tr
                                    key={report.id}
                                    className="group relative hover:z-20 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all duration-300 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:ring-1 hover:ring-slate-900/5 dark:hover:ring-white/10"
                                    onClick={() => setSelectedReport(report)}
                                >
                                    <td className="px-4 py-4 text-sm text-slate-500 border-r border-slate-300 dark:border-slate-700">{report.date}</td>
                                    <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white border-r border-slate-300 dark:border-slate-700">{report.description}</td>
                                    <td className="px-4 py-4 text-sm font-medium text-right text-emerald-600 border-r border-slate-300 dark:border-slate-700">
                                        {report.amount > 0 ? `+${formatCurrency(report.amount)}` : '-'}
                                    </td>
                                    <td className="px-4 py-4 text-center border-slate-300 dark:border-slate-700">
                                        <span className={cn(
                                            "px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm inline-block",
                                            report.status === 'generated' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                                        )}>
                                            {report.status === 'generated' ? 'Realized' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <SideDrawer
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
                title={selectedReport?.description || 'Report Details'}
                subtitle={`Generated on ${selectedReport?.date}`}
                size="lg"
                variant="SD_T1"
                icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setSelectedReport(null)}>Close</Button>
                        <Button variant="primary" leftIcon={<Download className="w-4 h-4" />}>Download PDF</Button>
                    </>
                }
            >
                {selectedReport && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-none flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                            <div className="text-center text-slate-400">
                                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm font-medium">Report Preview</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-none border border-slate-100 dark:border-slate-800">
                                <p className="text-xs text-slate-500 uppercase">Report Type</p>
                                <p className="font-medium capitalize text-slate-900 dark:text-white mt-1">{selectedReport.type}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-none border border-slate-100 dark:border-slate-800">
                                <p className="text-xs text-slate-500 uppercase">Status</p>
                                <p className={cn("font-medium capitalize mt-1", selectedReport.status === 'generated' ? "text-emerald-600" : "text-amber-600")}>
                                    {selectedReport.status}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Included Metrics</h4>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Total Revenue vs Target</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Top Performing Products</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Regional Breakdown</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Partner Contribution Analysis</li>
                            </ul>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button variant="outline" className="flex-1 justify-center" leftIcon={<Eye className="w-4 h-4" />}>View Full Report</Button>
                            <Button variant="outline" className="flex-1 justify-center" leftIcon={<Share2 className="w-4 h-4" />}>Share Report</Button>
                        </div>
                    </div>
                )}
            </SideDrawer>
        </div>
    )
}
