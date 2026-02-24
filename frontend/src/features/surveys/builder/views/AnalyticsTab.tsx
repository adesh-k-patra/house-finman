import { useState, useMemo } from 'react'
import { useSurveyBuilder, AnalyticsCard, AnalyticsViewType } from '../contexts/SurveyBuilderContext'
import { cn } from '../../../../utils'
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend,
    AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell,
    LineChart, Line, ComposedChart, Scatter, ScatterChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    RadialBarChart, RadialBar, LabelList, ReferenceLine
} from 'recharts'
import {
    BarChart3, TrendingUp, Activity, PieChart, Filter, Layers,
    Search, Sparkles, Edit2, Trash2, Pin, PinOff, Maximize2,
    ArrowUpRight, TrendingDown, MoreHorizontal, LayoutTemplate, RotateCcw,
    Radar as RadarIcon
} from 'lucide-react'
import {
    DndContext, closestCenter, DragEndEvent,
    PointerSensor, KeyboardSensor, useSensors, useSensor
} from '@dnd-kit/core'
import {
    SortableContext, arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'

import { ExpandedChartModal } from '../components/ExpandedChartModal'

// ============ VISUALIZATION CONFIG ============

const VIEW_TYPE_CONFIG: Record<AnalyticsViewType, { icon: React.ElementType; label: string; color: string; barGradient: string; lineStroke: string; bgAccent: string }> = {
    chart: { icon: BarChart3, label: 'Chart', color: 'bg-blue-100 text-blue-700', barGradient: 'from-blue-600 to-blue-400', lineStroke: '#3b82f6', bgAccent: 'from-blue-50 to-white' },
    graph: { icon: Activity, label: 'Graph', color: 'bg-emerald-100 text-emerald-700', barGradient: 'from-emerald-600 to-emerald-400', lineStroke: '#10b981', bgAccent: 'from-emerald-50 to-white' },
    trend: { icon: TrendingUp, label: 'Trend', color: 'bg-purple-100 text-purple-700', barGradient: 'from-purple-600 to-purple-400', lineStroke: '#8b5cf6', bgAccent: 'from-purple-50 to-white' },
    distribution: { icon: PieChart, label: 'Distribution', color: 'bg-rose-100 text-rose-700', barGradient: 'from-rose-600 to-rose-400', lineStroke: '#f43f5e', bgAccent: 'from-rose-50 to-white' },
    funnel: { icon: Filter, label: 'Funnel', color: 'bg-amber-100 text-amber-700', barGradient: 'from-amber-600 to-amber-400', lineStroke: '#f59e0b', bgAccent: 'from-amber-50 to-white' },
    heatmap: { icon: Layers, label: 'Heatmap', color: 'bg-indigo-100 text-indigo-700', barGradient: 'from-indigo-600 to-indigo-400', lineStroke: '#6366f1', bgAccent: 'from-indigo-50 to-white' },
    comparison: { icon: Layers, label: 'Comparison', color: 'bg-amber-100 text-amber-700', barGradient: 'from-amber-600 to-amber-400', lineStroke: '#d97706', bgAccent: 'from-amber-50 to-white' },
    table: { icon: Layers, label: 'Table', color: 'bg-slate-100 text-slate-700', barGradient: 'from-slate-600 to-slate-400', lineStroke: '#64748b', bgAccent: 'from-slate-50 to-white' },
    radar: { icon: RadarIcon, label: 'Radar', color: 'bg-lime-100 text-lime-700', barGradient: 'from-lime-600 to-lime-400', lineStroke: '#84cc16', bgAccent: 'from-lime-50 to-white' },
    radialbar: { icon: RotateCcw, label: 'Radial Bar', color: 'bg-sky-100 text-sky-700', barGradient: 'from-sky-600 to-sky-400', lineStroke: '#0ea5e9', bgAccent: 'from-sky-50 to-white' },
    scatter: { icon: MoreHorizontal, label: 'Scatter', color: 'bg-cyan-100 text-cyan-700', barGradient: 'from-cyan-600 to-cyan-400', lineStroke: '#06b6d4', bgAccent: 'from-cyan-50 to-white' },
    donut: { icon: PieChart, label: 'Donut', color: 'bg-orange-100 text-orange-700', barGradient: 'from-orange-600 to-orange-400', lineStroke: '#f97316', bgAccent: 'from-orange-50 to-white' },
    treemap: { icon: LayoutTemplate, label: 'Treemap', color: 'bg-teal-100 text-teal-700', barGradient: 'from-teal-600 to-teal-400', lineStroke: '#14b8a6', bgAccent: 'from-teal-50 to-white' },
    waterfall: { icon: BarChart3, label: 'Waterfall', color: 'bg-blue-100 text-blue-700', barGradient: 'from-blue-600 to-blue-400', lineStroke: '#3b82f6', bgAccent: 'from-blue-50 to-white' },
    pareto: { icon: BarChart3, label: 'Pareto', color: 'bg-indigo-100 text-indigo-700', barGradient: 'from-indigo-600 to-indigo-400', lineStroke: '#6366f1', bgAccent: 'from-indigo-50 to-white' },
    composed: { icon: Layers, label: 'Composed', color: 'bg-violet-100 text-violet-700', barGradient: 'from-violet-600 to-violet-400', lineStroke: '#8b5cf6', bgAccent: 'from-violet-50 to-white' },
}

// Chart colors
const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

// ============ HELPER FUNCTIONS ============

// Polar Matrix Data Helper
function generateRadialMatrixData() {
    const rings = ['Marriage', 'Hospital visits', 'Adoption', 'Employment', 'Housing', 'Hate crimes', 'Schools']
    const items = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

    return items.map((item) => {
        const entry: any = { name: item, value: 1 } // Value 1 for equal slices
        rings.forEach((ring, i) => {
            // Skewed random distribution for heatmap effect
            entry[`ring_${i}`] = Math.random() > (0.4 + i * 0.05)
        })
        return entry
    })
}

// Scatter Data Helper (Multi-colored groups)
function generateScatterData(points = 50) {
    const categories = ['A', 'B', 'C', 'D'] // Pink, Green, Blue, Olive
    return Array.from({ length: points }, (_, i) => {
        const cat = categories[Math.floor(Math.random() * categories.length)]
        let x = Math.random() * 100
        let y = Math.random() * 100
        // Create some clusters/correlation
        if (cat === 'A') { x += 10; y += 10; } // Pink
        if (cat === 'B') { x = Math.random() * 60; y = Math.random() * 80; } // Green

        // Add trend line signal (noisy sine wave)
        const trend = 30 + Math.sin(x / 20) * 20 + (x / 2)

        return {
            x: Math.floor(x),
            y: Math.floor(y + (Math.random() * 40 - 20)),
            z: Math.floor(Math.random() * 500 + 50), // Size
            category: cat,
            trendVal: trend
        }
    })
}

// Generate default card data including advanced fields
function generateCardData(viewType: AnalyticsViewType) {
    const seed = viewType.charCodeAt(0)
    // Return different structures based on viewType

    if (viewType === 'scatter') {
        const points = generateScatterData(20) // Smaller dataset for cards
        // Convert to array expected by recharts if needed, or just return points
        // The scatter implementation expects an array of objects with x, y, z, category
        return points
    }

    if (viewType === 'radialbar') {
        // Radial Bar data
        return Array.from({ length: 5 }, (_, i) => ({
            name: ['A', 'B', 'C', 'D', 'E'][i],
            value: Math.floor(Math.random() * 100),
            fill: CHART_COLORS[i % CHART_COLORS.length]
        }))
    }

    // Default time-series like data
    return Array.from({ length: 7 }, (_, i) => ({
        name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        value: Math.floor(40 + Math.sin(i * 0.8 + seed) * 25 + Math.random() * 30),
        secondary: Math.floor(25 + Math.cos(i * 0.5 + seed) * 15 + Math.random() * 20),
        previous: Math.floor(30 + Math.sin(i * 0.8 + seed) * 20 + Math.random() * 20),
    }))
}

// ============ CUSTOM TOOLTIP ============

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null

    const total = payload.reduce((sum: number, entry: any) => sum + (typeof entry.value === 'number' ? entry.value : 0), 0)

    return (
        <div className="bg-[#0f172a] border border-slate-800 shadow-2xl rounded-sm overflow-hidden min-w-[150px] z-50">
            {/* Header */}
            <div className="bg-[#020617] px-3 py-2 border-b border-slate-800/50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {label || 'Data Point'}
                </p>
            </div>

            {/* Body */}
            <div className="p-1.5">
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between px-2 py-1 hover:bg-slate-800/50 transition-colors rounded-sm group">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-2 h-2 rounded-[1px] shadow-sm"
                                style={{ backgroundColor: entry.color || entry.fill }}
                            />
                            <span className="text-[11px] font-medium text-slate-300 group-hover:text-white transition-colors">
                                {entry.name || entry.dataKey}
                            </span>
                        </div>
                        <span className="text-[11px] font-bold font-mono text-white">
                            {typeof (entry as any).value === 'number' ? (entry as any).value.toLocaleString() : (entry as any).value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const PIE_CARD_DATA = [
    { name: 'Group A', value: 35 },
    { name: 'Group B', value: 28 },
    { name: 'Group C', value: 22 },
    { name: 'Group D', value: 15 },
]

// ============ CARD COMPONENT (Redesigned) ============

interface AnalyticsCardProps {
    card: AnalyticsCard
    onEdit?: (e: React.MouseEvent) => void
    onDelete?: (e: React.MouseEvent) => void
    onPin?: (e: React.MouseEvent) => void
    onExpand?: () => void
}

function AnalyticsCardContent({ card, onEdit, onDelete, onPin, onExpand }: AnalyticsCardProps) {
    const config = VIEW_TYPE_CONFIG[card.viewType]
    const Icon = config.icon
    const data = useMemo(() => generateCardData(card.viewType), [card.viewType])

    // Simulate trend & total (Handle different data shapes)
    const { trendValue, totalValue } = useMemo(() => {
        if (!data || data.length === 0) return { trendValue: '0.0', totalValue: 0 }

        let tVal = 0
        let trVal = '0.0'

        if (card.viewType === 'scatter') {
            // Scatter has x, y, z
            tVal = data.length // Count of points
            trVal = '+0.0'
        } else if (card.viewType === 'radar') {
            // Radar has subject, A, fullMark
            tVal = data.reduce((acc: number, curr: any) => acc + (curr.A || 0), 0)
            trVal = '+0.0'
        } else if (card.viewType === 'heatmap') {
            // Heatmap has x, y, z
            tVal = data.reduce((acc: number, curr: any) => acc + (curr.z || 0), 0)
            trVal = '+0.0'
        } else {
            // Default assumes .value exists
            const first = (data[0] as any)?.value || 0
            const last = (data[data.length - 1] as any)?.value || 0
            tVal = data.reduce((s: number, d: any) => s + (d.value || 0), 0)
            trVal = first !== 0 ? ((last - first) / first * 100).toFixed(1) : '0.0'
        }
        return { trendValue: trVal, totalValue: tVal }
    }, [data, card.viewType])

    const isPositive = Number(trendValue) >= 0

    // New Data Logic for Sparkline / Mini Charts
    const renderVisualization = () => {
        const axisTick = { fontSize: 9, fill: '#94a3b8' }
        const gridStroke = '#f1f5f9'
        // Cards are usually on white/light bg in grid, but can check theme if needed

        // Common Gradients & Filters
        const CommonDefs = () => (
            <defs>
                <filter id={`shadow-${card.id}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.1" />
                </filter>
                <linearGradient id={`grad-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.lineStroke} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={config.lineStroke} stopOpacity={0} />
                </linearGradient>
            </defs>
        )

        switch (card.viewType) {
            case 'chart':
            case 'comparison':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <CommonDefs />
                            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                            <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} dy={5} />
                            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.04)' }} />
                            <Bar dataKey="value" fill={config.lineStroke} radius={[2, 2, 0, 0]} barSize={undefined} filter={`url(#shadow-${card.id})`} />
                        </BarChart>
                    </ResponsiveContainer>
                )
            case 'graph':
            case 'trend':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <CommonDefs />
                            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                            <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} dy={5} />
                            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="value" stroke={config.lineStroke} strokeWidth={2} fillOpacity={1} fill={`url(#grad-${card.id})`} dot={false} activeDot={{ r: 4, stroke: config.lineStroke, strokeWidth: 2, fill: '#fff' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                )
            case 'distribution':
                // Use Pie for both distribution and donut to match detailed view
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                            <Pie data={PIE_CARD_DATA} cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" paddingAngle={4} dataKey="value" stroke="none">
                                {PIE_CARD_DATA.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                )
            case 'radar':
                const RADAR_DATA = [
                    { subject: 'Eng', A: 120, fullMark: 150 },
                    { subject: 'Ret', A: 98, fullMark: 150 },
                    { subject: 'Rch', A: 86, fullMark: 150 },
                    { subject: 'Cnv', A: 99, fullMark: 150 },
                    { subject: 'Sat', A: 85, fullMark: 150 },
                    { subject: 'Rev', A: 65, fullMark: 150 },
                ]
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={RADAR_DATA}>
                            <PolarGrid stroke={gridStroke} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: axisTick.fill, fontSize: 8, fontWeight: 700 }} />
                            <Radar name="Current" dataKey="A" stroke={config.lineStroke} strokeWidth={2} fill={config.lineStroke} fillOpacity={0.4} />
                            <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                    </ResponsiveContainer>
                )
            case 'radialbar':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={10} data={data}>
                            <RadialBar
                                label={undefined}
                                background={{ fill: '#f1f5f9' }}
                                dataKey="value"
                                cornerRadius={10}
                            >
                                {data.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill || CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </RadialBar>
                            <Tooltip content={<CustomTooltip />} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                )
            case 'scatter':
                // Scatter plot needs specific data structure
                // Data is already generated in generateCardData for 'scatter'
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={true} horizontal={true} />
                            <XAxis type="number" dataKey="x" tick={axisTick} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <YAxis type="number" dataKey="y" tick={axisTick} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Scatter name="Data Points" data={data} fill={config.lineStroke}>
                                {data.map((entry: any, index: number) => {
                                    // Optional: multi-color
                                    const catColors: Record<string, string> = { 'A': '#ec4899', 'B': '#10b981', 'C': '#0ea5e9', 'D': '#eab308' }
                                    return <Cell key={`cell-${index}`} fill={catColors[entry.category] || config.lineStroke} />
                                })}
                            </Scatter>
                            {/* Simplified Trend Line */}
                            <Line type="monotone" dataKey="trendVal" stroke={config.lineStroke} strokeWidth={2} dot={false} activeDot={false} data={data.slice().sort((a: any, b: any) => a.x - b.x)} />
                        </ComposedChart>
                    </ResponsiveContainer>
                )
            case 'funnel':
                return (
                    <div className="h-full flex flex-col justify-center space-y-2 px-2">
                        {[
                            { label: 'Awareness', pct: 100, color: '#3b82f6' },
                            { label: 'Interest', pct: 72, color: '#8b5cf6' },
                            { label: 'Decision', pct: 48, color: '#f59e0b' },
                            { label: 'Action', pct: 28, color: '#10b981' }
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="text-[9px] font-medium text-slate-400 w-12 text-right">{step.label}</span>
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${step.pct}%`, backgroundColor: step.color }} />
                                </div>
                                <span className="text-[9px] font-bold text-slate-600 w-6">{step.pct}%</span>
                            </div>
                        ))}
                    </div>
                )
            case 'heatmap':
                // Simple Line chart approximation for heatmap in small card is okay, but user requested consistent look.
                // Switching to a small 2D scatter grid or similar might be too heavy.
                // Let's stick to the styling of the expanded modal but simplified.
                // The expanded modal uses a ScatterChart for heatmap.

                // Generating mini heatmap data
                const miniHeatmapData: any[] = []
                for (let x = 0; x < 12; x++) {
                    for (let y = 0; y < 8; y++) {
                        miniHeatmapData.push({ x, y, z: Math.random() * 100 })
                    }
                }

                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                            <XAxis type="number" dataKey="x" hide domain={[0, 12]} />
                            <YAxis type="number" dataKey="y" hide domain={[0, 8]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Scatter data={miniHeatmapData} shape="square">
                                {miniHeatmapData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`rgba(99, 102, 241, ${entry.z / 100})`} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                )
            default:
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} dy={5} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" fill={config.lineStroke} radius={[2, 2, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )
        }
    }

    return (
        <div className={cn(
            "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-all group flex flex-col h-full relative overflow-hidden",
            "hover:border-slate-300 dark:hover:border-slate-700"
        )}
            style={{
                borderRadius: 0,
                boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.06)',
            }}>

            {/* Pin indicator */}
            {card.isPinned && (
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-amber-400 border-l-[24px] border-l-transparent z-10 shadow-sm" />
            )}

            {/* Header — Dark */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between flex-shrink-0 bg-slate-900">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-7 h-7 flex items-center justify-center flex-shrink-0 bg-white/10 border border-white/20 text-white" style={{ borderRadius: 0 }}>
                        <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate leading-tight">{card.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate font-medium">{card.dataLogic}</p>
                    </div>
                </div>

                {/* Action buttons */}
                {/* Action buttons */}
                <div className="flex items-center gap-0.5 transition-all duration-200">
                    {card.isAIGenerated && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 flex items-center gap-1 mr-1" style={{ borderRadius: 0 }}>
                            <Sparkles className="w-2.5 h-2.5" /> AI
                        </span>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); onPin?.(e) }} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors" style={{ borderRadius: 0 }} title="Pin">
                        {card.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onExpand?.() }} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" style={{ borderRadius: 0 }} title="Deep Dive">
                        <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit?.(e); }} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" style={{ borderRadius: 0 }} title="Configure">
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete?.(e) }} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" style={{ borderRadius: 0 }} title="Remove">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Chart Body */}
            <div className="px-0 py-0 flex-1 flex flex-col min-h-0 relative bg-white dark:bg-slate-900">
                <div className="flex-1 min-h-0 w-full">
                    {renderVisualization()}
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between flex-shrink-0">
                <div className={cn("flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 border", isPositive ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800")} style={{ borderRadius: 0 }}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {trendValue}%
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                    <span className="text-sm text-slate-800 dark:text-slate-200 font-black leading-none">{totalValue.toLocaleString()}</span>
                </div>
            </div>
        </div>
    )
}

// ============ SORTABLE WRAPPER ============

function SortableAnalyticsCard({ card, onEdit, onDelete, onPin, onExpand, className }: {
    card: AnalyticsCard;
    onEdit: () => void;
    onDelete: () => void;
    onPin: () => void;
    onExpand: () => void;
    className?: string
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: card.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 100 : 'auto' as any,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={cn("h-full", className)}>
            <motion.div
                onClick={onExpand}
                className="h-full cursor-pointer"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
            >
                <AnalyticsCardContent
                    card={card}
                    onEdit={(e) => { e.stopPropagation(); onEdit() }}
                    onDelete={(e) => { e.stopPropagation(); onDelete() }}
                    onPin={(e) => { e.stopPropagation(); onPin() }}
                    onExpand={onExpand}
                />
            </motion.div>
        </div>
    )
}

export function AnalyticsTab() {
    const { analyticsCards, updateAnalyticsCard, deleteAnalyticsCard, reorderAnalyticsCards } = useSurveyBuilder()
    const [expandedCard, setExpandedCard] = useState<AnalyticsCard | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            const oldIndex = analyticsCards.findIndex((c) => c.id === active.id)
            const newIndex = analyticsCards.findIndex((c) => c.id === over?.id)
            if (reorderAnalyticsCards) reorderAnalyticsCards(arrayMove(analyticsCards, oldIndex, newIndex))
        }
    }

    const getCardSize = (index: number) => {
        if (index % 7 === 0) return "md:col-span-2 md:row-span-2"
        if (index % 5 === 0) return "md:col-span-2"
        return "md:col-span-1"
    }

    const filteredCards = analyticsCards.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.dataLogic.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const pinnedCount = analyticsCards.filter(c => c.isPinned).length

    const handleGenerateNew = () => {
        const newCard: AnalyticsCard = {
            id: `new-${Date.now()}`,
            title: 'New Analysis',
            viewType: 'chart',
            dataLogic: 'Total Responses over Time',
            isPinned: false,
            isAIGenerated: true,
            chartData: {},
            // Required legacy fields
            description: 'New custom analysis',
            metric: '0',
            trend: '+0%',
            type: 'bar'
        }
        setExpandedCard(newCard)
    }

    return (
        <div className="p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950 min-h-screen relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Survey Analytics</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{analyticsCards.length} metrics · {pinnedCount} pinned</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search metrics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 w-64 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
                        />
                    </div>
                    {/* Generate Button */}
                    <button
                        onClick={handleGenerateNew}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all group"
                        style={{ boxShadow: '0 2px 4px rgba(59,130,246,0.3)' }}>
                        <Sparkles className="w-4 h-4 text-blue-200 group-hover:text-white transition-colors" />
                        Generate New
                    </button>
                </div>
            </div>

            {/* Grid */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={filteredCards.map(c => c.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[220px]">
                        {filteredCards.map((card, index) => (
                            <SortableAnalyticsCard
                                key={card.id}
                                card={card}
                                className={getCardSize(index)}
                                onEdit={() => setExpandedCard(card)}
                                onDelete={() => {
                                    if (confirm('Delete this metric?')) deleteAnalyticsCard(card.id)
                                }}
                                onPin={() => updateAnalyticsCard(card.id, { isPinned: !card.isPinned })}
                                onExpand={() => setExpandedCard(card)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Deep Dive Modal */}
            {expandedCard && (
                <ExpandedChartModal
                    card={expandedCard}
                    onClose={() => setExpandedCard(null)}
                    onSave={(updates) => {
                        updateAnalyticsCard(expandedCard.id, updates)
                        setExpandedCard(null)
                    }}
                    onDelete={() => {
                        deleteAnalyticsCard(expandedCard.id)
                        setExpandedCard(null)
                    }}
                    onPin={() => updateAnalyticsCard(expandedCard.id, { isPinned: !expandedCard.isPinned })}
                    onEdit={() => { /* Already editing */ }}
                />
            )}

            {/* Full Screen Edit Modal (Deep Dive) */}

        </div>
    )
}

export default AnalyticsTab;
