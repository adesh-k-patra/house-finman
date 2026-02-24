/**
 * Analytics Page for House FinMan
 */

import { useState } from 'react'
import { TrendingUp, Users, DollarSign, Clock, Target, Download, Filter, Calendar, Globe } from 'lucide-react'
import { Button, Card, KPICard, CustomChartTooltip } from '@/components/ui'
import { cn, formatCurrency, formatNumber, formatPercentage } from '@/utils'
import { BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const monthlyData = [
    { month: 'Jul', leads: 120, disbursed: 45, conversion: 37.5 },
    { month: 'Aug', leads: 145, disbursed: 58, conversion: 40.0 },
    { month: 'Sep', leads: 168, disbursed: 72, conversion: 42.9 },
    { month: 'Oct', leads: 189, disbursed: 85, conversion: 45.0 },
    { month: 'Nov', leads: 210, disbursed: 98, conversion: 46.7 },
    { month: 'Dec', leads: 245, disbursed: 118, conversion: 48.2 },
    { month: 'Jan', leads: 278, disbursed: 142, conversion: 51.1 },
]

const disbursementData = [
    { month: 'Jul', amount: 12500000 },
    { month: 'Aug', amount: 18200000 },
    { month: 'Sep', amount: 22800000 },
    { month: 'Oct', amount: 28500000 },
    { month: 'Nov', amount: 32400000 },
    { month: 'Dec', amount: 38900000 },
    { month: 'Jan', amount: 45200000 },
]

const sourceData = [
    { name: 'Partner', value: 45, color: '#8B5CF6' },
    { name: 'Website', value: 25, color: '#3B82F6' },
    { name: 'Referral', value: 18, color: '#10B981' },
    { name: 'WhatsApp', value: 12, color: '#F59E0B' },
]

const cityData = [
    { city: 'Mumbai', leads: 456, disbursed: 185 },
    { city: 'Delhi', leads: 389, disbursed: 156 },
    { city: 'Bangalore', leads: 312, disbursed: 134 },
    { city: 'Chennai', leads: 245, disbursed: 98 },
    { city: 'Hyderabad', leads: 198, disbursed: 82 },
    { city: 'Pune', leads: 167, disbursed: 72 },
]

// --- NEW DATA (User Traffic & Behavior) ---

const webTrafficData = [
    { date: '1', visits: 2400, unique: 1800 },
    { date: '5', visits: 1398, unique: 1100 },
    { date: '10', visits: 9800, unique: 6200 },
    { date: '15', visits: 3908, unique: 2800 },
    { date: '20', visits: 4800, unique: 3600 },
    { date: '25', visits: 3800, unique: 2700 },
    { date: '30', visits: 4300, unique: 3100 },
]

const retentionData = [
    { week: 'W1', retention: 100 },
    { week: 'W2', retention: 85 },
    { week: 'W3', retention: 65 },
    { week: 'W4', retention: 55 },
    { week: 'W5', retention: 48 },
    { week: 'W6', retention: 42 },
    { week: 'W7', retention: 40 },
]

const sessionQualityData = [
    { time: '00:00', duration: 45 },
    { time: '04:00', duration: 30 },
    { time: '08:00', duration: 120 },
    { time: '12:00', duration: 180 },
    { time: '16:00', duration: 150 },
    { time: '20:00', duration: 90 },
    { time: '23:59', duration: 60 },
]

const deviceData = [
    { device: 'Mobile', users: 12500 },
    { device: 'Desktop', users: 8400 },
    { device: 'Tablet', users: 2100 },
]

const browserData = [
    { browser: 'Chrome', share: 65 },
    { browser: 'Safari', share: 20 },
    { browser: 'Edge', share: 10 },
    { browser: 'Firefox', share: 5 },
]

const demographicsData = [
    { name: '18-24', value: 15, color: '#94A3B8' },
    { name: '25-34', value: 45, color: '#3B82F6' },
    { name: '35-44', value: 25, color: '#10B981' },
    { name: '45+', value: 15, color: '#F59E0B' },
]

const acquisitionRadarData = [
    { channel: 'SEO', score: 85 },
    { channel: 'PPC', score: 65 },
    { channel: 'Social', score: 75 },
    { channel: 'Email', score: 90 },
    { channel: 'Referral', score: 80 },
    { channel: 'Direct', score: 60 },
]

const userTypeData = [
    { name: 'New', value: 65, color: '#6366F1' },
    { name: 'Returning', value: 35, color: '#EC4899' },
]

import { ChartDefs } from '@/components/ui/ChartDefs'

export default function AnalyticsPage() {
    const [dateRange] = useState('Last 6 Months')

    const commonChartProps = {
        margin: { top: 10, right: 10, left: 0, bottom: 0 }
    }

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Explorer</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Deep dive into your business metrics</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" leftIcon={<Calendar className="w-4 h-4" />}>{dateRange}</Button>
                    <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
                    <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>Export</Button>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
                <KPICard title="Total Leads" value={formatNumber(1847)} variant="blue" icon={<Users className="w-5 h-5" />} trend={{ value: 15.2, direction: 'up', label: 'vs last period' }} />
                <KPICard title="Conversion Rate" value={formatPercentage(51.1)} variant="green" icon={<Target className="w-5 h-5" />} trend={{ value: 5.3, direction: 'up', label: '' }} />
                <KPICard title="Total Disbursed" value={formatCurrency(198500000, true)} variant="purple" icon={<DollarSign className="w-5 h-5" />} trend={{ value: 22.4, direction: 'up', label: '' }} />
                <KPICard title="Avg TAT" value="4.2 days" variant="orange" icon={<Clock className="w-5 h-5" />} trend={{ value: 8.5, direction: 'down', label: 'improved' }} />
                <KPICard title="Revenue" value={formatCurrency(24800000, true)} variant="cyan" icon={<TrendingUp className="w-5 h-5" />} trend={{ value: 18.7, direction: 'up', label: '' }} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card title="Lead to Disbursement Trend" subtitle="Monthly performance">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Area type="linear" dataKey="leads" stroke="#3B82F6" strokeWidth={1.5} fill="url(#glass-blue)" filter="url(#shadow)" name="Leads" />
                                <Area type="linear" dataKey="disbursed" stroke="#10B981" strokeWidth={1.5} fill="url(#glass-green)" filter="url(#shadow)" name="Disbursed" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Disbursement Value" subtitle="Monthly disbursement amount">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={disbursementData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `₹${(v / 10000000).toFixed(0)}Cr`} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip currency />} />
                                <Bar dataKey="amount" fill="url(#glass-purple)" stroke="#8B5CF6" strokeWidth={1} radius={[0, 0, 0, 0]} name="Disbursement" filter="url(#shadow)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* --- NEW SECTION: Usage Analytics --- */}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Web Traffic & User Behavior
            </h2>
            <div className="grid grid-cols-3 gap-4">

                {/* 1. Web Traffic Line Chart */}
                <Card title="Traffic Trends" subtitle="Visits vs Unique Users" className="col-span-2">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={webTrafficData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="linear" dataKey="visits" stroke="#3B82F6" strokeWidth={1.5} dot={{ r: 3, strokeWidth: 1 }} filter="url(#shadow)" name="Total Visits" />
                                <Line type="linear" dataKey="unique" stroke="#10B981" strokeWidth={1.5} dot={{ r: 3, strokeWidth: 1 }} filter="url(#shadow)" name="Unique Users" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 2. Device Usage Bar Chart */}
                <Card title="Device Breakdown" subtitle="Platform distribution">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deviceData} layout="vertical" {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} horizontal={false} />
                                <XAxis type="number" stroke="#6B7280" fontSize={12} hide />
                                <YAxis dataKey="device" type="category" stroke="#6B7280" fontSize={12} width={60} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Bar dataKey="users" fill="url(#glass-indigo)" stroke="#6366F1" strokeWidth={1} radius={[0, 0, 0, 0]} barSize={20} name="Users" filter="url(#shadow)">
                                    {deviceData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={`url(#glass-${['blue', 'purple', 'pink'][index % 3]})`} stroke={['#3B82F6', '#8B5CF6', '#EC4899'][index % 3]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 3. User Retention Area Chart */}
                <Card title="User Retention" subtitle="Weekly cohort retention">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={retentionData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="week" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6B7280" fontSize={12} unit="%" tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Area type="linear" dataKey="retention" stroke="#F59E0B" strokeWidth={1.5} fill="url(#glass-orange)" filter="url(#shadow)" name="Retention %" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 4. Browser Analytics Bar Chart (Simple) */}
                <Card title="Browser Share" subtitle="Top browsers">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={browserData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="browser" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6B7280" fontSize={12} unit="%" tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Bar dataKey="share" fill="url(#glass-teal)" stroke="#14B8A6" strokeWidth={1} radius={[0, 0, 0, 0]} name="Market Share" filter="url(#shadow)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 5. Demographics Donut Chart */}
                <Card title="Demographics" subtitle="Age distribution">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={demographicsData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={0} dataKey="value" stroke="none">
                                    {demographicsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomChartTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* --- NEW SECTION: Channel & Quality --- */}
            <div className="grid grid-cols-3 gap-4">

                {/* 6. Acquisition Radar Chart */}
                <Card title="Channel Efficiency" subtitle="Acquisition Score">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={acquisitionRadarData}>
                                <ChartDefs />
                                <PolarGrid stroke="#374151" opacity={0.1} />
                                <PolarAngleAxis dataKey="channel" tick={{ fill: '#6B7280', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Score" dataKey="score" stroke="#8B5CF6" strokeWidth={1.5} fill="url(#glass-purple)" filter="url(#shadow)" />
                                <Tooltip content={<CustomChartTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 7. Session Quality Line Chart */}
                <Card title="Session Quality" subtitle="Avg. Duration (sec) by Time">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sessionQualityData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="time" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Line type="step" dataKey="duration" stroke="#EC4899" strokeWidth={1.5} dot={false} filter="url(#shadow)" name="Duration (s)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 8. User Type Pie Chart */}
                <Card title="User Mix" subtitle="New vs Returning">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={userTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ value }) => `${value}%`} stroke="none">
                                    {userTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomChartTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>


            <div className="grid grid-cols-3 gap-4">
                <Card title="Lead Sources" subtitle="Distribution by channel">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false} stroke="none">
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomChartTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="City-wise Performance" subtitle="Top performing cities" className="col-span-2">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cityData} layout="vertical" {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} horizontal={false} />
                                <XAxis type="number" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis dataKey="city" type="category" stroke="#6B7280" fontSize={12} width={80} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Bar dataKey="leads" fill="url(#glass-blue)" stroke="#3B82F6" strokeWidth={1} radius={[0, 0, 0, 0]} name="Leads" filter="url(#shadow)" />
                                <Bar dataKey="disbursed" fill="url(#glass-green)" stroke="#10B981" strokeWidth={1} radius={[0, 0, 0, 0]} name="Disbursed" filter="url(#shadow)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Card title="Conversion Funnel" subtitle="Lead journey stages">
                <div className="grid grid-cols-7 gap-4">
                    {[
                        { stage: 'Leads', count: 1847, color: 'from-blue-500 to-blue-600' },
                        { stage: 'Contacted', count: 1542, color: 'from-cyan-500 to-cyan-600' },
                        { stage: 'KYC Done', count: 1234, color: 'from-teal-500 to-teal-600' },
                        { stage: 'Credit Assessment', count: 986, color: 'from-emerald-500 to-emerald-600' },
                        { stage: 'Sanctioned', count: 756, color: 'from-green-500 to-green-600' },
                        { stage: 'Disbursed', count: 612, color: 'from-purple-500 to-purple-600' },
                        { stage: 'Closed', count: 542, color: 'from-indigo-500 to-indigo-600' },
                    ].map((item, i) => (
                        <div key={item.stage} className="text-center">
                            <div className={cn('h-32 rounded-sm flex items-end justify-center backdrop-blur-md', `bg-gradient-to-t ${item.color}`)} style={{ height: `${(item.count / 1847) * 120 + 30}px`, opacity: 0.8 }}>
                                <span className="text-lg font-bold text-white mb-2 filter drop-shadow-md">{formatNumber(item.count)}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{item.stage}</p>
                            {i > 0 && <p className="text-xs text-emerald-500">{((item.count / 1847) * 100).toFixed(0)}%</p>}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
