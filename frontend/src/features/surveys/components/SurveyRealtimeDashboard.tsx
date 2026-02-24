/**
 * SurveyRealtimeDashboard - Enhanced for Real Estate CFM
 * 
 * Features:
 * - 15+ charts including real estate specific metrics
 * - 12 KPI cards with sparklines
 * - Real estate hypotheses (loan eligibility, buyer intent, property matching)
 * - Sharp card design (rounded-none)
 */

import { useState, useEffect } from 'react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar, LineChart, Line, FunnelChart, Funnel, LabelList,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ComposedChart
} from 'recharts'
import {
    TrendingUp, TrendingDown, Users, Clock, CheckCircle, XCircle, Target, Globe,
    Shield, MessageSquare, Activity, Zap, Download, RefreshCw,
    Home, CreditCard, MapPin, Building2, Banknote, FileCheck, BarChart3,
    Lightbulb, AlertTriangle, CheckCircle2, XCircle as XIcon
} from 'lucide-react'
import { Button, Card, KPICard, Sparkline } from '@/components/ui'
import { cn } from '@/utils'

// ============ REAL ESTATE SPECIFIC DATA ============

const hourlyData = [
    { time: '9 AM', responses: 18, intent: 12 },
    { time: '10 AM', responses: 35, intent: 24 },
    { time: '11 AM', responses: 52, intent: 38 },
    { time: '12 PM', responses: 28, intent: 18 },
    { time: '1 PM', responses: 45, intent: 32 },
    { time: '2 PM', responses: 68, intent: 48 },
    { time: '3 PM', responses: 82, intent: 62 },
    { time: '4 PM', responses: 95, intent: 72 },
    { time: '5 PM', responses: 75, intent: 55 },
    { time: '6 PM', responses: 48, intent: 35 },
]

const buyerIntentData = [
    { timeline: '0-3 Months', count: 245, conversion: 42 },
    { timeline: '3-6 Months', count: 380, conversion: 28 },
    { timeline: '6-12 Months', count: 520, conversion: 15 },
    { timeline: '12+ Months', count: 180, conversion: 8 },
]

const budgetDistribution = [
    { range: '₹30L-50L', buyers: 320, color: '#3b82f6' },
    { range: '₹50L-75L', buyers: 480, color: '#10b981' },
    { range: '₹75L-1Cr', buyers: 280, color: '#f59e0b' },
    { range: '₹1Cr-2Cr', buyers: 150, color: '#8b5cf6' },
    { range: '₹2Cr+', buyers: 45, color: '#ef4444' },
]

const loanEligibilityBands = [
    { band: 'Pre-Approved', value: 35, color: '#10b981' },
    { band: 'Likely Eligible', value: 40, color: '#3b82f6' },
    { band: 'Needs Review', value: 18, color: '#f59e0b' },
    { band: 'Not Eligible', value: 7, color: '#ef4444' },
]

const cityWiseData = [
    { city: 'Mumbai', responses: 485, highIntent: 185, avgBudget: '₹85L' },
    { city: 'Delhi NCR', responses: 420, highIntent: 168, avgBudget: '₹72L' },
    { city: 'Bangalore', responses: 380, highIntent: 156, avgBudget: '₹68L' },
    { city: 'Pune', responses: 290, highIntent: 112, avgBudget: '₹55L' },
    { city: 'Hyderabad', responses: 245, highIntent: 95, avgBudget: '₹52L' },
    { city: 'Chennai', responses: 180, highIntent: 68, avgBudget: '₹48L' },
]

const propertyTypePreference = [
    { type: '2 BHK', value: 42 },
    { type: '3 BHK', value: 35 },
    { type: '1 BHK', value: 12 },
    { type: 'Villa', value: 8 },
    { type: 'Plot', value: 3 },
]

const builderRatings = [
    { builder: 'Godrej Properties', satisfaction: 88, visits: 245 },
    { builder: 'Prestige Group', satisfaction: 85, visits: 198 },
    { builder: 'Lodha Group', satisfaction: 82, visits: 312 },
    { builder: 'DLF Limited', satisfaction: 79, visits: 178 },
    { builder: 'Sobha Limited', satisfaction: 76, visits: 145 },
]

const bankPerformance = [
    { bank: 'HDFC', approvalRate: 78, avgTime: '8 days', satisfaction: 85 },
    { bank: 'SBI', approvalRate: 72, avgTime: '12 days', satisfaction: 78 },
    { bank: 'ICICI', approvalRate: 75, avgTime: '10 days', satisfaction: 82 },
    { bank: 'Axis', approvalRate: 70, avgTime: '11 days', satisfaction: 75 },
    { bank: 'Kotak', approvalRate: 68, avgTime: '9 days', satisfaction: 80 },
]

const surveyFunnelData = [
    { name: 'Survey Started', value: 2450, fill: '#3b82f6' },
    { name: 'Completed', value: 2100, fill: '#6366f1' },
    { name: 'High Intent', value: 1520, fill: '#8b5cf6' },
    { name: 'Loan Pre-Qual', value: 980, fill: '#a855f7' },
    { name: 'Site Visit', value: 420, fill: '#10b981' },
]

const channelData = [
    { channel: 'WhatsApp', value: 38, color: '#22c55e' },
    { channel: 'Web', value: 28, color: '#3b82f6' },
    { channel: 'Email', value: 20, color: '#f59e0b' },
    { channel: 'SMS', value: 14, color: '#8b5cf6' },
]

const awarenessRadar = [
    { metric: 'Loan Eligibility', value: 72, fullMark: 100 },
    { metric: 'Budget Clarity', value: 85, fullMark: 100 },
    { metric: 'Location Preference', value: 78, fullMark: 100 },
    { metric: 'Timeline Certainty', value: 65, fullMark: 100 },
    { metric: 'Property Type', value: 82, fullMark: 100 },
    { metric: 'Builder Trust', value: 58, fullMark: 100 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

// ============ COMPONENTS ============

// Global KPICard handles this now

function ChartCard({
    title,
    subtitle,
    children,
    className,
    variant = 'default',
    action
}: {
    title: string
    subtitle?: string
    children: React.ReactNode
    className?: string
    variant?: 'default' | 'blue' | 'indigo' | 'purple' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'violet' | 'orange' | 'magenta' | 'royal' | 'slate' | 'teal' | 'red'
    action?: React.ReactNode
}) {
    return (
        <Card
            title={title}
            subtitle={subtitle}
            variant={variant}
            className={cn("shadow-sm", className)}
            padding="md"
            action={action || (
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-none mix-blend-multiply dark:mix-blend-screen opacity-70 hover:opacity-100" onClick={() => alert(`Downloading ${title} data...`)}>
                    <Download className="w-3 h-3" />
                </Button>
            )}
            headerClassName="py-2 px-3"
            titleClassName="text-xs uppercase tracking-wider font-bold"
        >
            {children}
        </Card>
    )
}

// ============ MAIN COMPONENT ============

export function SurveyRealtimeDashboard() {
    const [refreshInterval, setRefreshInterval] = useState<'realtime' | '5s' | '30s' | 'manual'>('30s')
    const [lastUpdated, setLastUpdated] = useState(new Date())
    const [activeTab, setActiveTab] = useState<'overview' | 'intent' | 'loans' | 'properties' | 'hypotheses'>('overview')

    useEffect(() => {
        if (refreshInterval === 'manual') return
        const interval = refreshInterval === 'realtime' ? 2000 : refreshInterval === '5s' ? 5000 : 30000
        const timer = setInterval(() => setLastUpdated(new Date()), interval)
        return () => clearInterval(timer)
    }, [refreshInterval])

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-none border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-none">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Live</span>
                    </div>
                    <span className="text-sm text-slate-500">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 mr-2">Refresh:</span>
                    {(['realtime', '5s', '30s', 'manual'] as const).map(interval => (
                        <Button
                            key={interval}
                            variant={refreshInterval === interval ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setRefreshInterval(interval)}
                            className="text-xs h-7 rounded-none"
                        >
                            {interval === 'realtime' ? '⚡ Live' : interval === 'manual' ? '⏸ Pause' : interval}
                        </Button>
                    ))}
                    <Button variant="outline" size="sm" className="gap-2 ml-4 rounded-none" onClick={() => setLastUpdated(new Date())}>
                        <RefreshCw className="w-3 h-3" /> Refresh
                    </Button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                {[
                    { id: 'overview', label: 'Overview', icon: BarChart3 },
                    { id: 'intent', label: 'Buyer Intent', icon: Target },
                    { id: 'loans', label: 'Loan Analytics', icon: CreditCard },
                    { id: 'properties', label: 'Property Insights', icon: Building2 },
                    { id: 'hypotheses', label: 'AI Hypotheses', icon: Lightbulb },
                ].map(tab => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "px-4 py-3 text-sm font-medium transition-all flex items-center gap-2 border-b-2 whitespace-nowrap",
                                activeTab === tab.id
                                    ? "border-primary-500 text-primary-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'intent' && <BuyerIntentTab />}
            {activeTab === 'loans' && <LoanAnalyticsTab />}
            {activeTab === 'properties' && <PropertyInsightsTab />}
            {activeTab === 'hypotheses' && <HypothesesTab />}
        </div>
    )
}

// ============ OVERVIEW TAB ============

function OverviewTab() {
    return (
        <>
            {/* KPI Cards Grid - 12 Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <KPICard title="Total Responses" value="2,450" icon={<Users />} variant="blue" sparkline={<Sparkline data={[12, 28, 45, 32, 56, 48, 65, 82, 95]} />} trend={{ value: "+18%", direction: "up" }} compact />
                <KPICard title="Today" value="248" icon={<Activity />} variant="purple" trend={{ value: "+32", direction: "up" }} compact />
                <KPICard title="High Intent" value="1,520" icon={<Target />} variant="emerald" trend={{ value: "62%", direction: "neutral" }} compact />
                <KPICard title="Loan Pre-Quals" value="980" icon={<CreditCard />} variant="amber" trend={{ value: "+15%", direction: "up" }} compact />
                <KPICard title="Site Visits" value="420" icon={<MapPin />} variant="indigo" trend={{ value: "+8%", direction: "up" }} compact />
                <KPICard title="Completion Rate" value="85.7%" icon={<CheckCircle />} variant="teal" trend={{ value: "+2.1%", direction: "up" }} compact />
                <KPICard title="Drop-off Rate" value="14.3%" icon={<XCircle />} variant="red" trend={{ value: "-1.8%", direction: "up" }} compact />
                <KPICard title="Avg Time" value="2m 15s" icon={<Clock />} variant="cyan" trend={{ value: "-18s", direction: "up" }} compact />
                <KPICard title="Avg Budget" value="₹68L" icon={<Banknote />} variant="pink" compact />
                <KPICard title="0-3mo Intent" value="245" icon={<Zap />} variant="orange" trend={{ value: "Hot leads", direction: "up" }} compact />
                <KPICard title="Cities" value="12" icon={<Globe />} variant="slate" compact />
                <KPICard title="NPS Score" value="+58" icon={<MessageSquare />} variant="violet" trend={{ value: "+4", direction: "up" }} compact />
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ChartCard title="Hourly Response Trend" subtitle="Responses & High-Intent today" variant="blue">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hourlyData}>
                                <defs>
                                    <linearGradient id="colorResp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorIntent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                <RechartsTooltip />
                                <Area type="monotone" dataKey="responses" stroke="#3b82f6" strokeWidth={2} fill="url(#colorResp)" name="Responses" />
                                <Area type="monotone" dataKey="intent" stroke="#10b981" strokeWidth={2} fill="url(#colorIntent)" name="High Intent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                <ChartCard title="Conversion Funnel" subtitle="Survey → Site Visit" variant="indigo">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <FunnelChart>
                                <RechartsTooltip />
                                <Funnel dataKey="value" data={surveyFunnelData} isAnimationActive>
                                    <LabelList position="right" fill="#000" stroke="none" dataKey="name" fontSize={11} />
                                </Funnel>
                            </FunnelChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ChartCard title="Budget Distribution" subtitle="Buyer budget preferences" variant="emerald">
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={budgetDistribution} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <YAxis dataKey="range" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={70} />
                                <RechartsTooltip />
                                <Bar dataKey="buyers" radius={[0, 4, 4, 0]}>
                                    {budgetDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                <ChartCard title="Channel Performance" subtitle="Response distribution" variant="orange">
                    <div className="h-48 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={channelData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                                    {channelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                <ChartCard title="Buyer Readiness Radar" subtitle="Multi-parameter analysis" variant="violet">
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={awarenessRadar}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                                <Radar name="Readiness" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>
        </>
    )
}

// ============ BUYER INTENT TAB ============

function BuyerIntentTab() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChartCard title="Buying Timeline Distribution" subtitle="When do buyers plan to purchase?" variant="cyan">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={buyerIntentData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="timeline" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                            <RechartsTooltip />
                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Buyers" />
                            <Line type="monotone" dataKey="conversion" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} name="Conversion %" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            <ChartCard title="City-wise Buyer Intent" subtitle="Responses & High-Intent by city" variant="teal">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cityWiseData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                            <YAxis dataKey="city" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={80} />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey="responses" fill="#3b82f6" name="Total" />
                            <Bar dataKey="highIntent" fill="#10b981" name="High Intent" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            <ChartCard title="Property Type Preference" subtitle="What buyers are looking for" variant="rose">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={propertyTypePreference} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ type, percent }: any) => `${type} ${((percent || 0) * 100).toFixed(0)}%`} labelLine={false}>
                                {propertyTypePreference.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            <ChartCard title="Intent Score Distribution" subtitle="Buyer readiness levels" variant="amber">
                <div className="space-y-3 mt-2">
                    {[
                        { label: 'Hot Leads (90-100)', count: 185, pct: 12, color: 'bg-red-500' },
                        { label: 'High Intent (70-89)', count: 445, pct: 28, color: 'bg-orange-500' },
                        { label: 'Medium Intent (50-69)', count: 520, pct: 33, color: 'bg-yellow-500' },
                        { label: 'Low Intent (30-49)', count: 280, pct: 18, color: 'bg-blue-500' },
                        { label: 'Cold (0-29)', count: 145, pct: 9, color: 'bg-slate-400' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-32 text-xs text-slate-600 dark:text-slate-400">{item.label}</div>
                            <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-700 rounded-none overflow-hidden">
                                <div className={cn("h-full rounded-none", item.color)} style={{ width: `${item.pct}%` }} />
                            </div>
                            <div className="w-16 text-xs font-bold text-right">{item.count}</div>
                        </div>
                    ))}
                </div>
            </ChartCard>
        </div>
    )
}

// ============ LOAN ANALYTICS TAB ============

function LoanAnalyticsTab() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChartCard title="Loan Eligibility Bands" subtitle="Pre-qualification results" variant="blue">
                <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={loanEligibilityBands} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                                {loanEligibilityBands.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            <ChartCard title="Bank Performance" subtitle="Approval rates & customer satisfaction" variant="emerald">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={bankPerformance}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="bank" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey="approvalRate" fill="#3b82f6" name="Approval %" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="satisfaction" fill="#10b981" name="Satisfaction" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            <Card className="rounded-none shadow-sm md:col-span-2" variant="slate" title="Bank-wise Loan Metrics">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-900 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Bank</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest">Applications</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest">Approval Rate</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest">Avg Time</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest">CSAT</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {bankPerformance.map((bank, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{bank.bank}</td>
                                    <td className="px-4 py-3 text-center">{Math.round(980 / 5 * (1 + i * 0.1))}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-none text-xs font-bold",
                                            bank.approvalRate >= 75 ? "bg-emerald-100 text-emerald-700" :
                                                bank.approvalRate >= 70 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                                        )}>
                                            {bank.approvalRate}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-slate-600">{bank.avgTime}</td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: `${bank.satisfaction}%` }} />
                                            </div>
                                            <span className="text-xs font-bold">{bank.satisfaction}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}

// ============ PROPERTY INSIGHTS TAB ============

function PropertyInsightsTab() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChartCard title="Builder Satisfaction Ratings" subtitle="From site visit surveys" variant="teal">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={builderRatings} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                            <YAxis dataKey="builder" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} width={100} />
                            <RechartsTooltip />
                            <Bar dataKey="satisfaction" fill="#10b981" radius={[0, 4, 4, 0]} name="Satisfaction %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            <ChartCard title="Site Visit Requests" subtitle="By builder" variant="indigo">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={builderRatings}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="builder" axisLine={false} tickLine={false} tick={{ fontSize: 8 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                            <RechartsTooltip />
                            <Bar dataKey="visits" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Site Visits" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            <Card className="rounded-none shadow-sm md:col-span-2" variant="violet" title="City-wise Property Demand">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {cityWiseData.map((city, i) => (
                        <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{city.city}</h4>
                            <p className="text-2xl font-bold text-primary-600 mt-1">{city.responses}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-none font-bold">
                                    {city.highIntent} High
                                </span>
                                <span className="text-[10px] text-slate-500">{city.avgBudget}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

// ============ HYPOTHESES TAB ============

function HypothesesTab() {
    const hypotheses = [
        { id: 1, title: 'Budget ₹50L-1Cr + 0-3mo intent converts 3× faster', status: 'proven', confidence: 92, impact: 'high', action: 'Prioritize these leads for immediate follow-up' },
        { id: 2, title: 'Upload document step causes 20% drop-off', status: 'proven', confidence: 88, impact: 'high', action: 'Implement one-click document upload or defer to later' },
        { id: 3, title: 'Bank X has 40% rejection for self-employed', status: 'proven', confidence: 85, impact: 'medium', action: 'Recommend Bank Y for self-employed leads' },
        { id: 4, title: 'Locality A has 2× higher satisfaction than B', status: 'proven', confidence: 78, impact: 'medium', action: 'Prioritize Locality A in recommendations' },
        { id: 5, title: 'Follow-ups 1-3h post-survey yield 30% higher callback', status: 'testing', confidence: 72, impact: 'high', action: 'Testing automated 2h follow-up sequence' },
        { id: 6, title: 'Downpayment readiness greater than 20% correlates to faster conversion', status: 'proven', confidence: 82, impact: 'high', action: 'Add downpayment question earlier in survey' },
        { id: 7, title: 'Surveys greater than 8 questions reduce completion 20%', status: 'proven', confidence: 91, impact: 'high', action: 'Keep surveys under 8 questions' },
        { id: 8, title: 'Agent response time greater than 48h reduces conversion 60%', status: 'proven', confidence: 95, impact: 'critical', action: 'Implement 24h SLA alerts' },
        { id: 9, title: 'WhatsApp channel has 25% higher NPS than SMS', status: 'proven', confidence: 80, impact: 'medium', action: 'Prioritize WhatsApp for survey distribution' },
        { id: 10, title: 'Pre-approved loan label increases site visits 25%', status: 'testing', confidence: 68, impact: 'high', action: 'A/B testing pre-approval messaging' },
        { id: 11, title: 'Builder trust score below 60 correlates with site visit cancellations', status: 'proven', confidence: 76, impact: 'medium', action: 'Show trust badges for high-rated builders' },
    ]

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">AI-Powered Hypotheses</h3>
                    <p className="text-sm text-slate-500">Actionable insights from survey data analysis</p>
                </div>
                <Button className="gap-2 rounded-none">
                    <Zap className="w-4 h-4" /> Run All Tests
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hypotheses.map(h => (
                    <Card key={h.id} className={cn(
                        "p-4 rounded-none shadow-sm border-l-4",
                        h.impact === 'critical' ? "border-l-red-500" :
                            h.impact === 'high' ? "border-l-amber-500" : "border-l-blue-500"
                    )}>
                        <div className="flex items-start gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded-none flex items-center justify-center shrink-0 text-xs font-bold",
                                h.status === 'proven' ? "bg-emerald-100 text-emerald-700" :
                                    h.status === 'testing' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                            )}>
                                {h.status === 'proven' ? <CheckCircle2 className="w-4 h-4" /> :
                                    h.status === 'testing' ? <RefreshCw className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{h.title}</h4>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className={cn(
                                        "px-2 py-0.5 text-[10px] uppercase font-bold rounded-none",
                                        h.status === 'proven' ? "bg-emerald-100 text-emerald-700" :
                                            "bg-amber-100 text-amber-700"
                                    )}>
                                        {h.status}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        Confidence: <span className="font-bold">{h.confidence}%</span>
                                    </span>
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase",
                                        h.impact === 'critical' ? "text-red-600" :
                                            h.impact === 'high' ? "text-amber-600" : "text-blue-600"
                                    )}>
                                        {h.impact} impact
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Action:</span> {h.action}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
