/**
 * Finance Analytics Page for House FinMan
 * 
 * Features:
 * - Financial Health Metrics
 * - Profitability Analysis
 * - Cost Analysis
 */

import { Download, Calendar, TrendingUp, DollarSign, Activity, AlertCircle, Calculator } from 'lucide-react'
import { Button, Card, KPICard, CustomChartTooltip } from '@/components/ui'
import { cn, formatCurrency, formatPercentage } from '@/utils'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const profitabilityData = [
    { month: 'Jul', revenue: 4500000, cost: 3200000, profit: 1300000 },
    { month: 'Aug', revenue: 4800000, cost: 3400000, profit: 1400000 },
    { month: 'Sep', revenue: 5200000, cost: 3600000, profit: 1600000 },
    { month: 'Oct', revenue: 5800000, cost: 3900000, profit: 1900000 },
    { month: 'Nov', revenue: 6500000, cost: 4200000, profit: 2300000 },
    { month: 'Dec', revenue: 7200000, cost: 4500000, profit: 2700000 },
    { month: 'Jan', revenue: 7800000, cost: 4800000, profit: 3000000 },
]

const costBreakdown = [
    { category: 'Partner Commission', amount: 2500000 },
    { category: 'Operations', amount: 1200000 },
    { category: 'Marketing', amount: 800000 },
    { category: 'Technology', amount: 300000 },
]

// --- NEW DATA (Financial Health) ---

const cashFlowData = [
    { month: 'Jul', operating: 120, investing: -40, financing: -20 },
    { month: 'Aug', operating: 135, investing: -50, financing: -10 },
    { month: 'Sep', operating: 150, investing: -30, financing: 10 },
    { month: 'Oct', operating: 180, investing: -60, financing: 20 },
    { month: 'Nov', operating: 210, investing: -100, financing: -30 },
    { month: 'Dec', operating: 250, investing: -80, financing: 50 },
]

const costTrendsData = [
    { month: 'Jul', fixed: 30, variable: 20 },
    { month: 'Aug', fixed: 30, variable: 25 },
    { month: 'Sep', fixed: 32, variable: 28 },
    { month: 'Oct', fixed: 32, variable: 35 },
    { month: 'Nov', fixed: 35, variable: 42 },
    { month: 'Dec', fixed: 35, variable: 48 },
]

const growthRateData = [
    { month: 'Jul', rate: 5.2 },
    { month: 'Aug', rate: 6.8 },
    { month: 'Sep', rate: 8.4 },
    { month: 'Oct', rate: 12.1 },
    { month: 'Nov', rate: 15.5 },
    { month: 'Dec', rate: 18.2 },
]

const productRevenueData = [
    { product: 'Home Loan', revenue: 450 },
    { product: 'LAP', revenue: 280 },
    { product: 'Top Up', revenue: 150 },
    { product: 'Balance Transfer', revenue: 120 },
]

const budgetVarianceData = [
    { category: 'Marketing', planned: 100, actual: 110 },
    { category: 'Sales', planned: 200, actual: 190 },
    { category: 'Tech', planned: 150, actual: 145 },
    { category: 'Ops', planned: 120, actual: 125 },
]

const expenseCompositionData = [
    { name: 'Salaries', value: 45, color: '#3B82F6' },
    { name: 'Rent', value: 15, color: '#10B981' },
    { name: 'Utilities', value: 10, color: '#F59E0B' },
    { name: 'SaaS', value: 10, color: '#8B5CF6' },
    { name: 'Travel', value: 20, color: '#EF4444' },
]

const liabilityMixData = [
    { name: 'Short Term', value: 30, color: '#F43F5E' },
    { name: 'Long Term', value: 70, color: '#6366F1' },
]

const financialRatiosData = [
    { metric: 'Liquidity', score: 85 },
    { metric: 'Solvency', score: 90 },
    { metric: 'Efficiency', score: 75 },
    { metric: 'Profitability', score: 80 },
    { metric: 'Valuation', score: 70 },
]

import { ChartDefs } from '@/components/ui/ChartDefs'

export default function FinanceAnalyticsPage() {
    const commonChartProps = {
        margin: { top: 10, right: 10, left: 0, bottom: 0 }
    }

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Analytics</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cost, Profitability, and Health Metrics</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" leftIcon={<Calendar className="w-4 h-4" />}>Last Quarter</Button>
                    <Button variant="primary" leftIcon={<Download className="w-4 h-4" />}>Export Report</Button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <KPICard title="Net Profit Margin" value={formatPercentage(38.5)} variant="emerald" icon={<Activity className="w-5 h-5" />} trend={{ value: 2.5, direction: 'up', label: 'vs last quarter' }} />
                <KPICard title="OpEx Ratio" value={formatPercentage(24.2)} variant="orange" icon={<TrendingUp className="w-5 h-5" />} trend={{ value: 1.2, direction: 'down', label: 'improved' }} />
                <KPICard title="Partner Commission Cost" value={formatCurrency(2500000, true)} variant="purple" icon={<DollarSign className="w-5 h-5" />} trend={{ value: 15.4, direction: 'up', label: 'volume driven' }} />
                <KPICard title="Cost of Acquisition" value={formatCurrency(1250)} variant="blue" icon={<AlertCircle className="w-5 h-5" />} trend={{ value: 5.4, direction: 'down', label: 'efficient' }} />
            </div>

            <Card
                title="Profitability Trends"
                subtitle="Revenue vs Cost vs Profit"
                headerClassName="bg-slate-900/95 backdrop-blur-md dark:bg-slate-800 border-b border-slate-700/50"
                titleClassName="text-white"
                subtitleClassName="text-slate-400"
            >
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={profitabilityData} {...commonChartProps}>
                            <ChartDefs />
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v: any) => `${(Number(v) / 100000).toFixed(1)}L`} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomChartTooltip currency />} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Area type="linear" dataKey="revenue" stackId="1" stroke="#3B82F6" strokeWidth={1.5} fill="none" name="Revenue" />
                            <Area type="linear" dataKey="cost" stackId="1" stroke="#EF4444" strokeWidth={1.5} fill="none" name="Cost" />
                            <Area type="linear" dataKey="profit" stroke="#10B981" strokeWidth={1.5} fill="url(#glass-green)" filter="url(#shadow)" name="Net Profit" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <Card
                    title="Cost Breakdown"
                    subtitle="Major expense categories"
                    headerClassName="bg-slate-900/95 backdrop-blur-md dark:bg-slate-800 border-b border-slate-700/50"
                    titleClassName="text-white"
                    subtitleClassName="text-slate-400"
                >
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={costBreakdown} layout="vertical" {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} horizontal={false} />
                                <XAxis type="number" stroke="#6B7280" fontSize={12} tickFormatter={(v: any) => `${(Number(v) / 100000).toFixed(0)}L`} tickLine={false} axisLine={false} />
                                <YAxis dataKey="category" type="category" stroke="#6B7280" fontSize={12} width={100} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip currency />} />
                                <Bar dataKey="amount" fill="url(#glass-red)" stroke="#EF4444" strokeWidth={1} radius={[0, 0, 0, 0]} barSize={32} name="Cost" filter="url(#shadow)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card
                    title="Health Indicators"
                    className="p-0 overflow-hidden"
                    headerClassName="bg-slate-900/95 backdrop-blur-md dark:bg-slate-800 border-b border-slate-700/50"
                    titleClassName="text-white"
                >
                    <div className="divide-y divide-slate-200 dark:divide-white/10">
                        {[
                            { label: 'Current Ratio', value: '2.4', status: 'Healthy', color: 'text-emerald-500' },
                            { label: 'Quick Ratio', value: '1.8', status: 'Healthy', color: 'text-emerald-500' },
                            { label: 'Debt-to-Equity', value: '0.4', status: 'Good', color: 'text-blue-500' },
                            { label: 'Receivables Turnover', value: '45 Days', status: 'Attention', color: 'text-amber-500' },
                            { label: 'Return on Assets', value: '12.5%', status: 'Excellent', color: 'text-purple-500' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{item.value}</span>
                                    <span className={cn('text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 font-medium', item.color)}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* --- NEW SECTION: Deep Financials --- */}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-500" />
                Deep Financial Analysis
            </h2>
            <div className="grid grid-cols-3 gap-4">

                {/* 1. Cash Flow Line Chart */}
                <Card title="Cash Flow Analysis" subtitle="Operating vs Investing" variant="emerald">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={cashFlowData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Line type="linear" dataKey="operating" stroke="#10B981" strokeWidth={1.5} name="Operating CF" filter="url(#shadow)" />
                                <Line type="linear" dataKey="investing" stroke="#F43F5E" strokeWidth={1.5} name="Investing CF" filter="url(#shadow)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 2. Cost Trends Area Chart */}
                <Card title="Fixed vs Variable Costs" subtitle="Cost structure evolution" variant="blue">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={costTrendsData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Area type="linear" dataKey="fixed" stackId="1" stroke="#3B82F6" strokeWidth={1.5} fill="url(#glass-blue)" name="Fixed" filter="url(#shadow)" />
                                <Area type="linear" dataKey="variable" stackId="1" stroke="#F59E0B" strokeWidth={1.5} fill="url(#glass-orange)" fillOpacity={0.6} name="Variable" filter="url(#shadow)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 3. Growth Rate Line Chart */}
                <Card title="MoM Growth %" subtitle="Revenue Growth Rate" variant="violet">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthRateData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Line type="stepAfter" dataKey="rate" stroke="#8B5CF6" strokeWidth={1.5} dot={true} name="Growth %" filter="url(#shadow)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 4. Product Revenue Bar Chart */}
                <Card title="Product Revenue Mix" subtitle="Revenue by Product Line" variant="indigo">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productRevenueData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="product" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Bar dataKey="revenue" fill="url(#glass-indigo)" stroke="#6366F1" strokeWidth={1} radius={[0, 0, 0, 0]} name="Revenue (L)" filter="url(#shadow)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 5. Budget Variance Bar Chart */}
                <Card title="Budget Variance" subtitle="Planned vs Actual (L)" variant="amber">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={budgetVarianceData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="category" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'transparent' }} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Bar dataKey="planned" fill="url(#glass-slate)" stroke="#94A3B8" strokeWidth={1} name="Planned" radius={[0, 0, 0, 0]} filter="url(#shadow)" />
                                <Bar dataKey="actual" fill="url(#glass-rose)" stroke="#F43F5E" strokeWidth={1} name="Actual" radius={[0, 0, 0, 0]} filter="url(#shadow)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 6. Expense Pie Chart */}
                <Card title="Expense Composition" subtitle="Breakdown by Category" variant="rose">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={expenseCompositionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                                    {expenseCompositionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomChartTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 7. Liability Mix Pie Chart */}
                <Card title="Liability Mix" subtitle="Short Term vs Long Term" variant="slate">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={liabilityMixData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ value }) => `${value}%`} stroke="none">
                                    {liabilityMixData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomChartTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 8. Financial Ratios Radar */}
                <Card title="Financial Health Score" subtitle="Key Ratio Analysis" variant="cyan">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={financialRatiosData}>
                                <ChartDefs />
                                <PolarGrid stroke="#374151" opacity={0.1} />
                                <PolarAngleAxis dataKey="metric" tick={{ fill: '#6B7280', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Score" dataKey="score" stroke="#10B981" strokeWidth={1.5} fill="url(#glass-green)" fillOpacity={0.6} filter="url(#shadow)" />
                                <Tooltip content={<CustomChartTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    )
}
