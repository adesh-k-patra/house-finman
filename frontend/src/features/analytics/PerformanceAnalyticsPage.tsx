/**
 * Performance Analytics Page for House FinMan
 * 
 * Features:
 * - Team Performance Metrics
 * - Partner Performance Stack Ranking
 * - TAT Efficiency Analysis
 */

import { Download, Calendar, Users, Clock, Award, Trophy, Zap } from 'lucide-react'
import { Button, Card, KPICard, CustomChartTooltip } from '@/components/ui'
import { formatNumber } from '@/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'

const teamPerformance = [
    { name: 'Sales Team A', leads: 450, disbursed: 120, target: 100 },
    { name: 'Sales Team B', leads: 380, disbursed: 95, target: 90 },
    { name: 'Sales Team C', leads: 420, disbursed: 110, target: 100 },
    { name: 'Partners Team', leads: 600, disbursed: 180, target: 150 },
]

const partnerRanking = [
    { name: 'HomeLoan Direct', score: 98, volume: 45000000, tat: 3.2 },
    { name: 'PropertyPro', score: 95, volume: 38000000, tat: 3.5 },
    { name: 'Quick Loans', score: 92, volume: 32000000, tat: 3.8 },
    { name: 'Easy Finance', score: 88, volume: 28000000, tat: 4.1 },
    { name: 'Metro Realty', score: 85, volume: 25000000, tat: 4.5 },
]

const efficiencyMetrics = [
    { metric: 'Lead Response', value: 95, fullMark: 100 },
    { metric: 'Doc Collection', value: 82, fullMark: 100 },
    { metric: 'Credit Check', value: 88, fullMark: 100 },
    { metric: 'Sanction', value: 90, fullMark: 100 },
    { metric: 'Disbursement', value: 85, fullMark: 100 },
]

// --- NEW DATA (Team & Operational) ---

const tatEvolutionData = [
    { month: 'Jul', teamA: 5.2, teamB: 6.1 },
    { month: 'Aug', teamA: 4.8, teamB: 5.8 },
    { month: 'Sep', teamA: 4.5, teamB: 5.2 },
    { month: 'Oct', teamA: 4.2, teamB: 4.9 },
    { month: 'Nov', teamA: 3.9, teamB: 4.5 },
    { month: 'Dec', teamA: 3.8, teamB: 4.2 },
]

const conversionEfficiencyData = [
    { month: 'Jul', conversion: 12 },
    { month: 'Aug', conversion: 15 },
    { month: 'Sep', conversion: 18 },
    { month: 'Oct', conversion: 22 },
    { month: 'Nov', conversion: 25 },
    { month: 'Dec', conversion: 28 },
]

const activityVolumeData = [
    { day: 'Mon', calls: 1200, meetings: 45 },
    { day: 'Tue', calls: 1450, meetings: 52 },
    { day: 'Wed', calls: 1300, meetings: 48 },
    { day: 'Thu', calls: 1550, meetings: 60 },
    { day: 'Fri', calls: 1100, meetings: 40 },
    { day: 'Sat', calls: 600, meetings: 12 },
    { day: 'Sun', calls: 100, meetings: 2 },
]

const agentProductivityData = [
    { agent: 'Rajesh', applications: 45 },
    { agent: 'Priya', applications: 42 },
    { agent: 'Amit', applications: 38 },
    { agent: 'Sneha', applications: 35 },
    { agent: 'Vikram', applications: 32 },
]

const dealClosureData = [
    { agent: 'Rajesh', amount: 25 },
    { agent: 'Priya', amount: 22 },
    { agent: 'Amit', amount: 18 },
    { agent: 'Sneha', amount: 15 },
    { agent: 'Vikram', amount: 12 },
]

const performanceBandData = [
    { name: 'Top Performers', value: 15, color: '#10B981' },
    { name: 'Mid Performers', value: 65, color: '#3B82F6' },
    { name: 'Low Performers', value: 20, color: '#F43F5E' },
]

const skillMatrixData = [
    { skill: 'Negotiation', score: 85 },
    { skill: 'Compliance', score: 75 },
    { skill: 'Product Knowledge', score: 90 },
    { skill: 'Customer Service', score: 80 },
    { skill: 'Tech Usage', score: 70 },
]

const incentiveData = [
    { range: '0-10k', value: 30, color: '#94A3B8' },
    { range: '10k-50k', value: 45, color: '#3B82F6' },
    { range: '50k+', value: 25, color: '#8B5CF6' },
]

import { ChartDefs } from '@/components/ui/ChartDefs'

export default function PerformanceAnalyticsPage() {
    const commonChartProps = {
        margin: { top: 10, right: 10, left: 0, bottom: 0 }
    }

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Performance Analytics</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Team, Partner, and Operational Efficiency</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" leftIcon={<Calendar className="w-4 h-4" />}>This Month</Button>
                    <Button variant="primary" leftIcon={<Download className="w-4 h-4" />}>Export Report</Button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <KPICard title="Top Performing Team" value="Sales Team A" variant="orange" icon={<Trophy className="w-5 h-5" />} trend={{ value: 120, direction: 'neutral', label: '% of target' }} />
                <KPICard title="Avg Team TAT" value="3.8 Days" variant="blue" icon={<Clock className="w-5 h-5" />} trend={{ value: 0.4, direction: 'down', label: 'days faster' }} />
                <KPICard title="Active Partners" value={formatNumber(142)} variant="purple" icon={<Users className="w-5 h-5" />} trend={{ value: 12, direction: 'up', label: 'new this month' }} />
                <KPICard title="Customer Satisfaction" value="4.8/5.0" variant="emerald" icon={<Award className="w-5 h-5" />} trend={{ value: 0.1, direction: 'up', label: '' }} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card title="Team Performance vs Target" variant="blue">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={teamPerformance} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'transparent' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="disbursed" fill="url(#glass-blue)" stroke="#3B82F6" strokeWidth={1} name="Achieved" radius={[0, 0, 0, 0]} filter="url(#shadow)" />
                                <Bar dataKey="target" fill="url(#glass-slate)" stroke="#94A3B8" strokeWidth={1} name="Target" radius={[0, 0, 0, 0]} filter="url(#shadow)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Operational Efficiency Radar" variant="emerald">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={efficiencyMetrics}>
                                <ChartDefs />
                                <PolarGrid stroke="#374151" opacity={0.1} />
                                <PolarAngleAxis dataKey="metric" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Efficiency Score" dataKey="value" stroke="#8B5CF6" strokeWidth={1.5} fill="url(#glass-purple)" fillOpacity={0.6} filter="url(#shadow)" />
                                <Tooltip content={<CustomChartTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* --- NEW SECTION: Efficiency Metrics --- */}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Team Efficiency & Productivity
            </h2>
            <div className="grid grid-cols-3 gap-4">

                {/* 1. TAT Evolution Line Chart */}
                <Card title="TAT Improvement" subtitle="Days to Sanction (Lower is better)" variant="cyan">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={tatEvolutionData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Line type="linear" dataKey="teamA" stroke="#3B82F6" strokeWidth={1.5} name="Team A" filter="url(#shadow)" />
                                <Line type="linear" dataKey="teamB" stroke="#10B981" strokeWidth={1.5} name="Team B" filter="url(#shadow)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 2. Conversion Efficiency Area Chart */}
                <Card title="Lead Conversion Growth" subtitle="% Leads Converted" variant="violet">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={conversionEfficiencyData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Area type="linear" dataKey="conversion" stroke="#10B981" strokeWidth={1.5} fill="url(#glass-green)" name="Conversion %" filter="url(#shadow)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 3. Activity Volume Line Chart */}
                <Card title="Activity Volume" subtitle="Calls vs Meetings" variant="indigo">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activityVolumeData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="day" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis yAxisId="left" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Line yAxisId="left" type="linear" dataKey="calls" stroke="#8B5CF6" strokeWidth={1.5} dot={false} name="Calls" filter="url(#shadow)" />
                                <Line yAxisId="right" type="linear" dataKey="meetings" stroke="#F59E0B" strokeWidth={1.5} dot={false} name="Meetings" filter="url(#shadow)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 4. Agent Productivity Bar Chart */}
                <Card title="Top Agents By Volume" subtitle="Applications Processed" variant="amber">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={agentProductivityData} layout="vertical" {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} horizontal={false} />
                                <XAxis type="number" stroke="#6B7280" fontSize={12} hide />
                                <YAxis dataKey="agent" type="category" stroke="#6B7280" fontSize={12} width={60} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Bar dataKey="applications" fill="url(#glass-blue)" stroke="#3B82F6" strokeWidth={1} radius={[0, 0, 0, 0]} name="Apps" filter="url(#shadow)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 5. Deal Closure Bar Chart */}
                <Card title="Deal Closures" subtitle="Deals closed per agent (Cr)" variant="rose">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dealClosureData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="agent" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Bar dataKey="amount" fill="url(#glass-green)" stroke="#10B981" strokeWidth={1} radius={[0, 0, 0, 0]} name="Value (Cr)" filter="url(#shadow)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 6. Performance Band Pie Chart */}
                <Card title="Performance Distribution" subtitle="Staff Performance bands" variant="purple">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={performanceBandData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={0} dataKey="value" stroke="none">
                                    {performanceBandData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomChartTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 7. Skill Matrix Radar Chart */}
                <Card title="Team Skill Matrix" subtitle="Capabilities Assessment" variant="slate">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillMatrixData}>
                                <ChartDefs />
                                <PolarGrid stroke="#374151" opacity={0.1} />
                                <PolarAngleAxis dataKey="skill" tick={{ fill: '#6B7280', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Score" dataKey="score" stroke="#EC4899" strokeWidth={1.5} fill="url(#glass-pink)" fillOpacity={0.6} filter="url(#shadow)" />
                                <Tooltip content={<CustomChartTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 8. Incentive Donut Chart */}
                <Card title="Incentive Payouts" subtitle="Commission Distribution" variant="emerald">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={incentiveData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                                    {incentiveData.map((entry, index) => (
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

            <Card title="Partner Leaderboard" subtitle="Top 5 Partners by Score" variant="royal">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-900 text-white rounded-lg overflow-hidden">
                            <tr>
                                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider first:rounded-l-lg">Rank</th>
                                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Partner Name</th>
                                <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider">Performance Score</th>
                                <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider">Volume (₹)</th>
                                <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider last:rounded-r-lg">Avg TAT (Days)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {partnerRanking.map((partner, i) => (
                                <tr key={partner.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-4 py-3 text-sm font-medium">#{i + 1}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{partner.name}</td>
                                    <td className="px-4 py-3 text-sm font-bold text-right text-emerald-600">{partner.score}</td>
                                    <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-300">{(partner.volume / 10000000).toFixed(2)} Cr</td>
                                    <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-300">{partner.tat}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
