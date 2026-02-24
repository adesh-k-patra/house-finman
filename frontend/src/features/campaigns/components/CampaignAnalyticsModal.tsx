
import { X, Download, Share2, TrendingUp, Users, MousePointer, Eye, DollarSign, Target, Mail, MessageSquare } from 'lucide-react'
import { Button, CustomChartTooltip } from '@/components/ui'
import { cn } from '@/utils'
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { ChartDefs } from '@/components/ui/ChartDefs'

interface CampaignAnalyticsModalProps {
    isOpen: boolean
    onClose: () => void
    campaignName?: string
}

// Dummy Data Generators
const generateTimeSeries = (points: number, base: number, variance: number) => {
    return Array.from({ length: points }, (_, i) => ({
        date: `Jan ${String(i + 1).padStart(2, '0')}`,
        value: Math.max(0, Math.floor(base + Math.random() * variance - variance / 2)),
        value2: Math.max(0, Math.floor(base * 0.6 + Math.random() * variance * 0.6 - variance / 4))
    }))
}

const timeSeriesData = generateTimeSeries(30, 5000, 2000)
const engagementData = generateTimeSeries(14, 800, 300)
const conversionData = generateTimeSeries(14, 200, 80)

const deviceData = [
    { name: 'Mobile', value: 65, color: '#3b82f6' },
    { name: 'Desktop', value: 30, color: '#8b5cf6' },
    { name: 'Tablet', value: 5, color: '#10b981' },
]

const geoData = [
    { name: 'New York', value: 4000 },
    { name: 'London', value: 3000 },
    { name: 'Tokyo', value: 2000 },
    { name: 'Paris', value: 1500 },
    { name: 'Mumbai', value: 1000 },
]

const channelRadarData = [
    { channel: 'Email', efficiency: 85 },
    { channel: 'SMS', efficiency: 65 },
    { channel: 'Social', efficiency: 78 },
    { channel: 'Push', efficiency: 55 },
    { channel: 'Display', efficiency: 72 },
    { channel: 'Direct', efficiency: 90 },
]

const retentionData = [
    { day: 'D1', rate: 100 },
    { day: 'D3', rate: 72 },
    { day: 'D7', rate: 58 },
    { day: 'D14', rate: 45 },
    { day: 'D30', rate: 32 },
]

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    opens: Math.floor(Math.random() * 500 + 100),
    clicks: Math.floor(Math.random() * 200 + 50),
}))

const ageData = [
    { name: '18-24', value: 15, color: '#94A3B8' },
    { name: '25-34', value: 42, color: '#3B82F6' },
    { name: '35-44', value: 28, color: '#10B981' },
    { name: '45+', value: 15, color: '#F59E0B' },
]

const sourceData = [
    { name: 'Organic', value: 35, color: '#10B981' },
    { name: 'Paid', value: 40, color: '#3B82F6' },
    { name: 'Referral', value: 15, color: '#8B5CF6' },
    { name: 'Social', value: 10, color: '#EC4899' },
]

export function CampaignAnalyticsModal({ isOpen, onClose, campaignName = 'Campaign Stats' }: CampaignAnalyticsModalProps) {
    if (!isOpen) return null

    const kpis = [
        { label: 'Total Reach', value: '1.2M', change: '+12.5%', icon: Users, className: 'bg-blue-600 border-blue-400/30 text-white', iconColor: 'text-blue-100', trendColor: 'bg-blue-500/30 text-blue-100', trend: 'up' },
        { label: 'Open Rate', value: '24.8%', change: '+3.2%', icon: Eye, className: 'bg-purple-600 border-purple-400/30 text-white', iconColor: 'text-purple-100', trendColor: 'bg-purple-500/30 text-purple-100', trend: 'up' },
        { label: 'Click Rate', value: '4.2%', change: '+0.8%', icon: MousePointer, className: 'bg-emerald-600 border-emerald-400/30 text-white', iconColor: 'text-emerald-100', trendColor: 'bg-emerald-500/30 text-emerald-100', trend: 'up' },
        { label: 'Conversion', value: '2.1%', change: '-0.3%', icon: Target, className: 'bg-orange-600 border-orange-400/30 text-white', iconColor: 'text-orange-100', trendColor: 'bg-orange-500/30 text-orange-100', trend: 'down' },
        { label: 'Revenue', value: '$45.2k', change: '+18.5%', icon: DollarSign, className: 'bg-green-600 border-green-400/30 text-white', iconColor: 'text-green-100', trendColor: 'bg-green-500/30 text-green-100', trend: 'up' },
    ]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />

            {/* Modal Container */}
            <div className="relative w-[95vw] h-[90vh] bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col animate-slide-up rounded-none overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/20 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{campaignName}</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mt-0.5">Campaign Performance Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1">
                            <button className="px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-white/10 shadow-sm dark:shadow-none hover:bg-slate-50 dark:hover:bg-white/20 transition-colors">7D</button>
                            <button className="px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 transition-colors">30D</button>
                            <button className="px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 transition-colors">90D</button>
                        </div>
                        <Button variant="ghost" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-none" onClick={onClose}>
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Content - Scrollable Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950/50">
                    <ChartDefs />

                    <div className="grid grid-cols-5 gap-4 mb-6">
                        {kpis.map((kpi, i) => (
                            <div key={i} className={cn(
                                "relative overflow-hidden p-4 shadow-lg group backdrop-blur-md border transition-all hover:-translate-y-1 duration-300",
                                kpi.className
                            )}>
                                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity">
                                    <kpi.icon className="w-16 h-16" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={cn("p-1.5 rounded-sm bg-white/10 backdrop-blur-md", kpi.iconColor)}>
                                            <kpi.icon className="w-4 h-4" />
                                        </div>
                                        <p className={cn("text-[10px] uppercase tracking-widest font-bold opacity-90", kpi.iconColor)}>{kpi.label}</p>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <span className="text-2xl font-black tracking-tight text-white shadow-sm">{kpi.value}</span>
                                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-sm backdrop-blur-md border border-white/10 shadow-sm", kpi.trendColor)}>
                                            {kpi.change}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chart Grid - Premium Layout */}
                    <div className="grid grid-cols-4 gap-4">

                        {/* 1. Main Engagement Trend - Wide */}
                        <div className="col-span-3 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 p-5 h-[350px] shadow-sm dark:shadow-none">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Engagement Over Time</h3>
                            <ResponsiveContainer width="100%" height="90%">
                                <AreaChart data={timeSeriesData}>
                                    <defs>
                                        <linearGradient id="colorVal1" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorVal2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="date" stroke="#666" fontSize={10} tickLine={false} axisLine={false} interval={4} />
                                    <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                                    <Tooltip content={<CustomChartTooltip />} />
                                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVal1)" name="Impressions" />
                                    <Area type="monotone" dataKey="value2" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorVal2)" name="Clicks" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 2. Device Split Pie */}
                        <div className="col-span-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 p-5 h-[350px] shadow-sm dark:shadow-none">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Device Breakdown</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <PieChart>
                                    <Pie data={deviceData} innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                                        {deviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomChartTooltip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 3. Conversion Funnel */}
                        <div className="col-span-2 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 p-5 h-[280px] shadow-sm dark:shadow-none">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Conversion Funnel</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={[
                                    { step: 'Sent', value: 120000, fill: '#3b82f6' },
                                    { step: 'Delivered', value: 115000, fill: '#6366f1' },
                                    { step: 'Opened', value: 45000, fill: '#8b5cf6' },
                                    { step: 'Clicked', value: 12000, fill: '#a855f7' },
                                    { step: 'Converted', value: 3500, fill: '#10b981' },
                                ]} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                    <XAxis type="number" stroke="#666" fontSize={10} tickFormatter={(v) => `${v / 1000}k`} />
                                    <YAxis dataKey="step" type="category" stroke="#999" fontSize={11} width={70} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomChartTooltip />} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                                        {[0, 1, 2, 3, 4].map((i) => (
                                            <Cell key={`cell-${i}`} fill={['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#10b981'][i]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 4. Channel Efficiency Radar */}
                        <div className="col-span-2 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 p-5 h-[280px] shadow-sm dark:shadow-none">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Channel Efficiency</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={channelRadarData}>
                                    <PolarGrid stroke="#333" />
                                    <PolarAngleAxis dataKey="channel" tick={{ fill: '#6B7280', fontSize: 10 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Efficiency" dataKey="efficiency" stroke="#8B5CF6" strokeWidth={2} fill="#8B5CF6" fillOpacity={0.3} />
                                    <Tooltip content={<CustomChartTooltip />} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 5. Geographic Performance */}
                        <div className="col-span-2 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 p-5 h-[280px] shadow-sm dark:shadow-none">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Top Regions</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={geoData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                                    <Tooltip content={<CustomChartTooltip />} />
                                    <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} name="Engagements" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 6. Retention Curve */}
                        <div className="col-span-2 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 p-5 h-[280px] shadow-sm dark:shadow-none">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Retention Curve</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <AreaChart data={retentionData}>
                                    <defs>
                                        <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="day" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={10} unit="%" tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <Tooltip content={<CustomChartTooltip />} />
                                    <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} fill="url(#retentionGrad)" name="Retention %" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 7. Hourly Activity */}
                        <div className="col-span-2 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 p-5 h-[280px] shadow-sm dark:shadow-none">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Hourly Activity</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={hourlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="hour" stroke="#666" fontSize={9} tickLine={false} axisLine={false} interval={3} />
                                    <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomChartTooltip />} />
                                    <Legend wrapperStyle={{ paddingTop: '5px' }} />
                                    <Bar dataKey="opens" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={8} name="Opens" />
                                    <Bar dataKey="clicks" fill="#8b5cf6" radius={[2, 2, 0, 0]} barSize={8} name="Clicks" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 8. Age Demographics */}
                        <div className="col-span-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 p-5 h-[280px] shadow-sm dark:shadow-none">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Age Groups</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <PieChart>
                                    <Pie data={ageData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" label={({ value }) => `${value}%`}>
                                        {ageData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomChartTooltip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 9. Traffic Sources */}
                        <div className="col-span-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 p-5 h-[280px] shadow-sm dark:shadow-none">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Traffic Sources</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <PieChart>
                                    <Pie data={sourceData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name }) => name}>
                                        {sourceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomChartTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 10. Daily Conversions */}
                        <div className="col-span-2 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 p-5 h-[280px] shadow-sm dark:shadow-none">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Daily Conversions</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <AreaChart data={conversionData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="date" stroke="#666" fontSize={10} tickLine={false} interval={2} />
                                    <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomChartTooltip />} />
                                    <Area type="step" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} name="Conversions" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 11-14. Mini Sparkline Charts */}
                        {[
                            { label: 'Bounce Rate', value: '12.4%', color: '#ef4444' },
                            { label: 'Unsubscribes', value: '0.8%', color: '#f59e0b' },
                            { label: 'Spam Reports', value: '0.02%', color: '#94a3b8' },
                            { label: 'Forwards', value: '2.3%', color: '#3b82f6' },
                        ].map((metric, i) => (
                            <div key={i} className="col-span-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 p-4 h-[140px] shadow-sm dark:shadow-none">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{metric.label}</p>
                                    <span className="text-sm font-bold" style={{ color: metric.color }}>{metric.value}</span>
                                </div>
                                <div className="h-[70px] -ml-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={generateTimeSeries(10, 50, 20)}>
                                            <Line type="monotone" dataKey="value" stroke={metric.color} strokeWidth={1.5} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ))}

                        {/* 15. Engagement Depth Bar */}
                        <div className="col-span-4 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 p-5 h-[200px] shadow-sm dark:shadow-none">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Engagement Depth by Day</h3>
                            <ResponsiveContainer width="100%" height="80%">
                                <BarChart data={engagementData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="date" stroke="#666" fontSize={10} tickLine={false} />
                                    <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomChartTooltip />} />
                                    <Legend />
                                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={14} name="Engaged Users" />
                                    <Bar dataKey="value2" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={14} name="Active Users" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 backdrop-blur-md flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="font-mono">Last updated: Just now</span>
                        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email Campaign</span>
                        <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> A/B Test: Variant A</span>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 rounded-none gap-2 font-bold uppercase text-xs tracking-wide h-10 px-6">
                            <Share2 className="w-4 h-4" /> Share Report
                        </Button>
                        <Button variant="primary" className="bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 border-none rounded-none gap-2 font-bold uppercase text-xs tracking-wide h-10 px-6">
                            <Download className="w-4 h-4" /> Download PDF
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
