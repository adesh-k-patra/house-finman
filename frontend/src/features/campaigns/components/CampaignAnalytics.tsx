
import {
    BarChart3,
    TrendingUp,
    Users,
    Target,
    Mail,
    MousePointer2,
    DollarSign,
    Ban,
    AlertTriangle,
    Clock,
    Globe,
} from 'lucide-react'
import { Card, KPICard, CustomChartTooltip } from '@/components/ui'
import { formatNumber, formatCurrency, formatPercentage } from '@/utils'
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts'

import { ChartDefs } from '@/components/ui/ChartDefs'


const GLASS_COLORS = ['blue', 'green', 'orange', 'red', 'purple'];

const hourlyData = [
    { hour: '00:00', opens: 120, clicks: 45 },
    { hour: '04:00', opens: 80, clicks: 20 },
    { hour: '08:00', opens: 450, clicks: 120 },
    { hour: '12:00', opens: 890, clicks: 340 },
    { hour: '16:00', opens: 670, clicks: 210 },
    { hour: '20:00', opens: 920, clicks: 410 },
];

const deviceData = [
    { name: 'Mobile', value: 65 },
    { name: 'Desktop', value: 25 },
    { name: 'Tablet', value: 10 },
];

const locationData = [
    { name: 'Mumbai', value: 35 },
    { name: 'Bangalore', value: 25 },
    { name: 'Delhi', value: 20 },
    { name: 'Chennai', value: 15 },
    { name: 'Others', value: 5 },
];

export function CampaignAnalytics({ campaign }: { campaign: any }) {
    // Enhanced Mock Metrics
    const metrics = {
        delivery: {
            sent: campaign.sent,
            delivered: Math.floor(campaign.sent * 0.98),
            bounced: Math.floor(campaign.sent * 0.02),
            deliveryRate: 98.2,
        },
        engagement: {
            opens: campaign.opened,
            uniqueOpens: Math.floor(campaign.opened * 0.85),
            clicks: campaign.clicked,
            uniqueClicks: Math.floor(campaign.clicked * 0.9),
            openRate: (campaign.opened / campaign.sent) * 100,
            ctr: (campaign.clicked / campaign.sent) * 100,
            ctor: (campaign.clicked / campaign.opened) * 100,
        },
        conversion: {
            conversions: campaign.converted,
            conversionRate: (campaign.converted / campaign.clicked) * 100,
            revenue: campaign.converted * 5000, // Est revenue per conversion
            roi: ((campaign.converted * 5000) - campaign.spent) / campaign.spent * 100,
        },
        negative: {
            unsubscribes: 45,
            spamReports: 12,
            unsubscribeRate: 0.3,
        }
    }

    return (
        <div className="space-y-6">
            {/* High Level Impact */}
            <div className="grid grid-cols-4 gap-4">
                <KPICard
                    title="Total Revenue"
                    value={formatCurrency(metrics.conversion.revenue)}
                    variant="green"
                    icon={<DollarSign className="w-5 h-5" />}
                    trend={{ value: 15, direction: 'up', label: 'vs target' }}
                />
                <KPICard
                    title="ROI"
                    value={formatPercentage(metrics.conversion.roi)}
                    variant="blue"
                    icon={<TrendingUp className="w-5 h-5" />}
                />
                <KPICard
                    title="Cost per Conv."
                    value={formatCurrency(campaign.spent / campaign.converted, true)}
                    variant="purple"
                    icon={<Target className="w-5 h-5" />}
                />
                <KPICard
                    title="Conv. Rate"
                    value={formatPercentage(metrics.conversion.conversionRate)}
                    variant="orange"
                    icon={<BarChart3 className="w-5 h-5" />}
                />
            </div>

            {/* Detailed Funnel Metrics */}
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Funnel Effectiveness</h3>
            <div className="grid grid-cols-5 gap-4">
                <div className="p-4 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-center">
                    <Mail className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Sent</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{formatNumber(metrics.delivery.sent)}</p>
                    <p className="text-xs text-emerald-600 mt-1">{metrics.delivery.deliveryRate}% Delivered</p>
                </div>
                <div className="p-4 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-center">
                    <Users className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Reached</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{formatNumber(metrics.delivery.delivered)}</p>
                    <p className="text-xs text-slate-500 mt-1">{formatNumber(metrics.delivery.bounced)} Bounced</p>
                </div>
                <div className="p-4 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-center">
                    <Mail className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Opened</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{formatNumber(metrics.engagement.opens)}</p>
                    <p className="text-xs text-emerald-600 mt-1">{formatPercentage(metrics.engagement.openRate)} Open Rate</p>
                </div>
                <div className="p-4 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-center">
                    <MousePointer2 className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Clicked</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{formatNumber(metrics.engagement.clicks)}</p>
                    <p className="text-xs text-emerald-600 mt-1">{formatPercentage(metrics.engagement.ctr)} CTR</p>
                </div>
                <div className="p-4 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-center">
                    <DollarSign className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Converted</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{formatNumber(metrics.conversion.conversions)}</p>
                    <p className="text-xs text-emerald-600 mt-1">{formatPercentage(metrics.conversion.conversionRate)} Conv. Rate</p>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-2 gap-6">
                <Card title="Hourly Engagement (Peak Times)">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hourlyData}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.1} />
                                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Area type="linear" dataKey="opens" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#glass-blue)" name="Opens" filter="url(#shadow)" />
                                <Area type="linear" dataKey="clicks" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#glass-green)" name="Clicks" filter="url(#shadow)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Device & Location">
                    <div className="grid grid-cols-2 gap-4 h-64">
                        <div className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceData}
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {deviceData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={`url(#glass-${GLASS_COLORS[index % GLASS_COLORS.length]})`} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomChartTooltip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3 pt-4">
                            {locationData.map((loc) => (
                                <div key={loc.name} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                        <Globe className="w-3 h-3 text-slate-400" /> {loc.name}
                                    </span>
                                    <div className="flex-1 mx-3 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${loc.value}%` }} />
                                    </div>
                                    <span className="text-slate-900 dark:text-white font-medium">{loc.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Negative Metrics */}
            <div className="grid grid-cols-3 gap-6">
                <div className="p-4 rounded-sm bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-red-600 dark:text-red-400 uppercase font-bold">Unsubscribes</p>
                        <p className="text-xl font-bold text-red-700 dark:text-red-300 mt-1">{metrics.negative.unsubscribes}</p>
                    </div>
                    <Ban className="w-8 h-8 text-red-200 dark:text-red-900/40" />
                </div>
                <div className="p-4 rounded-sm bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-orange-600 dark:text-orange-400 uppercase font-bold">Spam Reports</p>
                        <p className="text-xl font-bold text-orange-700 dark:text-orange-300 mt-1">{metrics.negative.spamReports}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-200 dark:text-orange-900/40" />
                </div>
                <div className="p-4 rounded-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Avg. Read Time</p>
                        <p className="text-xl font-bold text-slate-700 dark:text-white mt-1">45s</p>
                    </div>
                    <Clock className="w-8 h-8 text-slate-200 dark:text-slate-700" />
                </div>
            </div>
        </div>
    )
}
