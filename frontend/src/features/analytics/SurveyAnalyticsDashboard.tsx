import { useState } from 'react'
import { Filter, Calendar, ChevronDown, Download } from 'lucide-react'
import { Button } from '@/components/ui'
import { KPIStrip, AutoRefreshToggle } from './components/KPIStrip'
import { TrendChart, ComparisonChart } from './components/Charts'
import { HeatmapControls } from './components/HeatmapControls'

export function SurveyAnalyticsDashboard() {
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 2000)
    }

    const kpis = [
        { id: '1', label: 'Total Responses', value: '12,450', trend: 12, color: 'primary' },
        { id: '2', label: 'Avg. Completion Time', value: '4m 12s', trend: -5, color: 'success' },
        { id: '3', label: 'Completion Rate', value: '68%', trend: 2.4, color: 'warning' },
        { id: '4', label: 'High Intent Leads', value: '854', trend: 18, color: 'primary' },
    ] as any

    const trendData = [
        { name: 'Mon', value: 400 }, { name: 'Tue', value: 300 }, { name: 'Wed', value: 550 },
        { name: 'Thu', value: 450 }, { name: 'Fri', value: 600 }, { name: 'Sat', value: 350 }, { name: 'Sun', value: 400 }
    ]

    const comparisonData = [
        { name: 'NPS', thisMonth: 85, lastMonth: 70 },
        { name: 'CSAT', thisMonth: 92, lastMonth: 88 },
        { name: 'CES', thisMonth: 60, lastMonth: 65 },
    ]

    return (
        <div className="max-w-7xl mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Analytics Dashboard</h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time insights across all survey campaigns.</p>
                </div>
                <div className="flex items-center gap-4">
                    <AutoRefreshToggle isRefreshing={isRefreshing} onRefresh={handleRefresh} />
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                    <Button variant="outline" className="rounded-none gap-2">
                        <Calendar className="w-4 h-4" /> Last 30 Days <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button className="bg-slate-900 text-white rounded-none gap-2">
                        <Download className="w-4 h-4" /> Export Report
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <KPIStrip kpis={kpis} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold uppercase text-xs tracking-wider">Response Trends</h3>
                        <Button size="sm" variant="ghost" className="h-6 text-slate-400">View Details</Button>
                    </div>
                    <TrendChart data={trendData} />
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold uppercase text-xs tracking-wider">Metric Comparison</h3>
                        <Button size="sm" variant="ghost" className="h-6 text-slate-400">View Details</Button>
                    </div>
                    <ComparisonChart data={comparisonData} />
                </div>
            </div>

            {/* Heatmap Placeholder */}
            <div className="bg-slate-100 dark:bg-slate-800 h-[400px] border border-slate-200 dark:border-slate-700 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/72.8777,19.0760,11,0/800x400@2x?access_token=pk.eyJ1IjoiZ29vZ2xlIiwiYSI6ImNqem5sY2pmcjAwMDIzM3FzY3VwcnJ6aXQifQ.1')] bg-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute top-6 left-6 z-10">
                    <h3 className="font-bold uppercase text-lg tracking-tight text-slate-900 bg-white/80 backdrop-blur-sm px-3 py-1 inline-block">Geographic Distribution</h3>
                </div>
                <HeatmapControls />
            </div>
        </div>
    )
}
