import { useRef } from 'react'
import {
    X, Calendar, TrendingUp,
    MapPin, Megaphone, Target, ArrowRight, Users
} from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { Button } from '@/components/ui'

// Mock Data for Charts
const responsesByRegion = [
    { name: 'Maharashtra', value: 450 },
    { name: 'Karnataka', value: 320 },
    { name: 'Tamil Nadu', value: 280 },
    { name: 'Delhi NCR', value: 210 },
    { name: 'Telangana', value: 190 },
    { name: 'Gujarat', value: 150 },
]

const timeData = [
    { date: 'Day 1', responses: 120, reach: 5000 },
    { date: 'Day 2', responses: 180, reach: 8500 },
    { date: 'Day 3', responses: 250, reach: 12000 },
    { date: 'Day 4', responses: 310, reach: 18000 },
    { date: 'Day 5', responses: 450, reach: 25000 },
    { date: 'Day 6', responses: 380, reach: 28000 },
    { date: 'Day 7', responses: 420, reach: 32000 },
]

const funnelData = [
    { stage: 'Awareness', count: 32000, fill: '#6366f1' },
    { stage: 'Interest', count: 12500, fill: '#8b5cf6' },
    { stage: 'Considerations', count: 4800, fill: '#ec4899' },
    { stage: 'Intent (Form)', count: 2100, fill: '#f43f5e' },
    { stage: 'Action (Loan)', count: 450, fill: '#10b981' },
]

const sourceData = [
    { name: 'Social Media', value: 45, color: '#3b82f6' },
    { name: 'Email', value: 25, color: '#10b981' },
    { name: 'Direct', value: 15, color: '#f59e0b' },
    { name: 'Referral', value: 10, color: '#8b5cf6' },
    { name: 'Other', value: 5, color: '#64748b' },
]

const agentData = [
    { name: 'Amit K.', active: 85, closed: 12 },
    { name: 'S. Gupta', active: 72, closed: 18 },
    { name: 'Raj M.', active: 65, closed: 8 },
    { name: 'Priya P.', active: 90, closed: 22 },
    { name: 'Vikram S.', active: 55, closed: 5 },
]

const awarenessRadar = [
    { subject: 'Interest Rate', A: 120, fullMark: 150 },
    { subject: 'Eligibility', A: 98, fullMark: 150 },
    { subject: 'Subsidy', A: 86, fullMark: 150 },
    { subject: 'Process', A: 99, fullMark: 150 },
    { subject: 'Documents', A: 85, fullMark: 150 },
    { subject: 'Tenure', A: 65, fullMark: 150 },
]

// Mock Sankey Nodes & Links (Manual SVG if Recharts fails)
// We will use a custom SVG for Sankey as Recharts Sankey is often finicky/missing in some versions.

export function CampaignPerformanceDashboard({ isOpen, onClose, campaignName }: { isOpen: boolean; onClose: () => void; campaignName: string }) {
    const dashboardRef = useRef<HTMLDivElement>(null)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-hidden">
            <div ref={dashboardRef} className="bg-slate-50 dark:bg-slate-900 w-full max-w-[95vw] h-[90vh] flex flex-col rounded-none shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider rounded">Live Campaign</span>
                            <span className="text-xs text-slate-500">Updated: Just now</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{campaignName} - Performance Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 p-2">
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Main Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950/50">
                    <div className="max-w-[1920px] mx-auto space-y-6">

                        {/* Filters Bar */}
                        <div className="flex flex-wrap items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded text-sm text-slate-600 dark:text-slate-300">
                                <Calendar className="w-4 h-4" />
                                <span>Last 7 Days</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded text-sm text-slate-600 dark:text-slate-300">
                                <MapPin className="w-4 h-4" />
                                <span>All Regions</span>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <Button size="sm" variant="ghost">Reset</Button>
                                <Button size="sm">Apply</Button>
                            </div>
                        </div>

                        {/* Top KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0">
                            {[
                                { label: 'Total Responses', value: '12,450', change: '+12%', color: 'blue' },
                                { label: 'Completion Rate', value: '42.5%', change: '+5%', color: 'emerald' },
                                { label: 'Avg Time', value: '2m 15s', change: '-10s', color: 'purple' },
                                { label: 'Awareness Score', value: '8.5/10', change: '+0.4', color: 'orange' },
                                { label: 'Conversions', value: '450', change: '+15%', color: 'pink' },
                            ].map((kpi, i) => (
                                <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 shadow-none hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-white">{kpi.value}</h4>
                                    <span className={`text-xs font-bold text-${kpi.color}-500 flex items-center gap-1 mt-1`}>
                                        <TrendingUp className="w-3 h-3" /> {kpi.change}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Chart Grid */}
                        <div className="grid grid-cols-12 gap-0">

                            {/* Row 1: Responses by Region (Bar) & Daily Reach (Line+Area) */}
                            <div className="col-span-12 lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-none border border-slate-200 dark:border-slate-800 shadow-none">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Responses by Region
                                </h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={responsesByRegion} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                            <Tooltip contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: 'none' }} />
                                            <Bar dataKey="value" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="col-span-12 lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-none border border-slate-200 dark:border-slate-800 shadow-none">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Daily Reach vs Responses</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={timeData}>
                                            <defs>
                                                <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorResp" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                            <XAxis dataKey="date" />
                                            <YAxis yAxisId="left" />
                                            <YAxis yAxisId="right" orientation="right" />
                                            <Tooltip contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: 'none' }} />
                                            <Legend />
                                            <Area yAxisId="right" type="monotone" dataKey="reach" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorReach)" />
                                            <Area yAxisId="left" type="monotone" dataKey="responses" stroke="#3b82f6" fillOpacity={1} fill="url(#colorResp)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Row 2: Funnel, Pie, and Radar */}
                            <div className="col-span-12 md:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-none border border-slate-200 dark:border-slate-800 shadow-none">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Campaign Funnel</h3>
                                <div className="h-64 flex flex-col justify-center space-y-2">
                                    {funnelData.map((stage, i) => (
                                        <div key={i} className="relative h-8 rounded-none overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            <div
                                                className="absolute top-0 left-0 h-full transition-all duration-1000"
                                                style={{ width: `${(stage.count / funnelData[0].count) * 100}%`, backgroundColor: stage.fill }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-bold text-slate-700 dark:text-slate-200 z-10">
                                                <span>{stage.stage}</span>
                                                <span>{stage.count.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-12 md:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-none border border-slate-200 dark:border-slate-800 shadow-none">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Source Distribution</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={sourceData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {sourceData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: 'none' }} />
                                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="col-span-12 md:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-none border border-slate-200 dark:border-slate-800 shadow-none">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Awareness Parameters</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={awarenessRadar}>
                                            <PolarGrid opacity={0.2} />
                                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                                            <PolarRadiusAxis opacity={0} />
                                            <Radar
                                                name="Campaign"
                                                dataKey="A"
                                                stroke="#ec4899"
                                                fill="#ec4899"
                                                fillOpacity={0.5}
                                            />
                                            <Tooltip contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: 'none' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Row 3: Agent Perf (Stacked), Donut, and Heatmap Table */}
                            <div className="col-span-12 lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-none border border-slate-200 dark:border-slate-800 shadow-none">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Agent Performance</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={agentData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                            <YAxis />
                                            <Tooltip contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: 'none' }} />
                                            <Legend />
                                            <Bar dataKey="active" stackId="a" fill="#3b82f6" name="Active Threads" />
                                            <Bar dataKey="closed" stackId="a" fill="#10b981" name="Closed Deals" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="col-span-12 lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-none border border-slate-200 dark:border-slate-800 shadow-none">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                                    <span>Geographic Engagement Intensity (Top Districts)</span>
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-500">
                                            <tr>
                                                <th className="px-4 py-2">District</th>
                                                <th className="px-4 py-2">Responses</th>
                                                <th className="px-4 py-2">Intensity</th>
                                                <th className="px-4 py-2">Trend</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {[
                                                { d: 'Mumbai Suburban', r: 1250, i: 'High', t: '+12%' },
                                                { d: 'Pune City', r: 980, i: 'High', t: '+8%' },
                                                { d: 'Thane', r: 750, i: 'Medium', t: '-2%' },
                                                { d: 'Nagpur', r: 540, i: 'Medium', t: '+5%' },
                                                { d: 'Nashik', r: 320, i: 'Low', t: '0%' },
                                            ].map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                    <td className="px-4 py-2 font-medium">{row.d}</td>
                                                    <td className="px-4 py-2">{row.r}</td>
                                                    <td className="px-4 py-2">
                                                        <span className={`px-2 py-0.5 rounded-none textxs font-bold ${row.i === 'High' ? 'bg-red-100 text-red-700' :
                                                            row.i === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {row.i}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-green-600">{row.t}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Sankey / Journey Flow (Mocked Visual) */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-none border border-slate-200 dark:border-slate-800 shadow-none">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">User Journey Flow</h3>
                            <div className="h-48 flex items-center justify-between px-10 relative">
                                {/* Simple Visual Flow */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 -z-0" />

                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-500">
                                        <Megaphone className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-xs font-bold">Campaign Sent</span>
                                    <span className="text-[10px] text-slate-500">50,000 sent</span>
                                </div>

                                <ArrowRight className="w-6 h-6 text-slate-300" />

                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center border-2 border-purple-500">
                                        <Users className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <span className="text-xs font-bold">Clicked Link</span>
                                    <span className="text-[10px] text-slate-500">12,500 clicks (25%)</span>
                                </div>

                                <ArrowRight className="w-6 h-6 text-slate-300" />

                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center border-2 border-orange-500">
                                        <Target className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <span className="text-xs font-bold">Viewed Survey</span>
                                    <span className="text-[10px] text-slate-500">8,200 viewed</span>
                                </div>

                                <ArrowRight className="w-6 h-6 text-slate-300" />

                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border-2 border-emerald-500">
                                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <span className="text-xs font-bold">Completed</span>
                                    <span className="text-[10px] text-slate-500">4,100 completed</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
