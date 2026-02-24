
import { useState, useMemo, useRef, useEffect } from 'react'
import { X, Download, Share2, MoreHorizontal, Settings2, Sparkles, Filter, Palette, Sun, Moon, ArrowRightLeft, Pin, PinOff, Activity, TrendingUp, BarChart3, PieChart as PieChartIcon, Layers, LayoutTemplate, RotateCcw, Radar as RadarIcon, Check, Edit, Trash2, Type, Send, Bot, User } from 'lucide-react'
import { AnalyticsCardData as AnalyticsCard, AnalyticsViewType } from '../contexts/SurveyPageContext'
import { cn, formatNumber } from '@/utils'
import {
    BarChart, Bar, Line, AreaChart, Area, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ComposedChart, Scatter, ScatterChart, Cell, PieChart as RechartsPieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    LabelList, RadialBarChart, RadialBar, ReferenceLine
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { generateDeepDivePDF } from '../utils/generateDeepDivePDF'
import { Button } from '@/components/ui/Button'
import { KPICard } from '@/components/ui/KPICard'
import { FunnelChart } from './FunnelChart'

// ============ TYPES & CONFIG ============

interface ExpandedChartModalProps {
    card: AnalyticsCard
    onClose: () => void
    onPin: () => void
    onSave: (updates: Partial<AnalyticsCard>) => void
    onEdit?: () => void
    onDelete?: () => void
}

const VIEW_TYPES: { type: AnalyticsViewType | 'donut' | 'scatter' | 'composed' | 'radar' | 'radialbar' | 'treemap' | 'waterfall' | 'pareto'; icon: any; label: string; color: string }[] = [
    { type: 'chart', icon: BarChart3, label: 'Bar Chart', color: 'blue' },
    { type: 'graph', icon: Activity, label: 'Area Graph', color: 'indigo' },
    { type: 'trend', icon: TrendingUp, label: 'Trend Line', color: 'emerald' },
    { type: 'distribution', icon: PieChartIcon, label: 'Pie Distribution', color: 'orange' },
    { type: 'donut', icon: PieChartIcon, label: 'Donut Chart', color: 'amber' },
    { type: 'funnel', icon: Filter, label: 'Funnel Analysis', color: 'violet' },
    { type: 'heatmap', icon: Layers, label: 'Heatmap', color: 'rose' },
    { type: 'scatter', icon: MoreHorizontal, label: 'Scatter Plot', color: 'cyan' },
    { type: 'composed', icon: LayoutTemplate, label: 'Composed', color: 'fuchsia' },
    { type: 'radar', icon: RadarIcon, label: 'Radar Chart', color: 'lime' },
    { type: 'radialbar', icon: RotateCcw, label: 'Radial Bar', color: 'sky' },
    { type: 'treemap', icon: '🌊', label: 'Density Map', color: 'teal' },
    { type: 'waterfall', icon: BarChart3, label: 'Waterfall', color: 'indigo' },
    { type: 'pareto', icon: TrendingUp, label: 'Pareto Chart', color: 'pink' },
]

const TIME_RANGES = ['10m', '30m', '1h', '3h', '8h', '12h', '1d', '1w', '1m', '1y', 'All']

const COLOR_PALETTES = [
    { name: 'Ocean', colors: ['#0f172a', '#3b82f6', '#06b6d4', '#0ea5e9', '#38bdf8', '#7dd3fc', '#2563eb', '#1d4ed8'] },
    { name: 'Forest', colors: ['#14532d', '#10b981', '#059669', '#047857', '#34d399', '#6ee7b7', '#22c55e', '#16a34a'] },
    { name: 'Sunset', colors: ['#7c2d12', '#f59e0b', '#ef4444', '#f97316', '#fb923c', '#fbbf24', '#ea580c', '#dc2626'] },
    { name: 'Royal', colors: ['#3b0764', '#8b5cf6', '#a855f7', '#7c3aed', '#c084fc', '#d946ef', '#6366f1', '#4f46e5'] },
    { name: 'Neon', colors: ['#0f172a', '#22d3ee', '#a3e635', '#f472b6', '#fb923c', '#818cf8', '#34d399', '#fbbf24'] },
]

const FONT_SIZES = [
    { label: 'S', value: 9 },
    { label: 'M', value: 11 },
    { label: 'L', value: 14 },
]

// ============ CHART TYPE CUSTOMIZATION MATRIX ============





function getTypeSpecificKPIs(viewType: string, data: any[]) {
    const values = data.map(d => d.value)
    const total = values.reduce((s, v) => s + v, 0)
    const avg = Math.round(total / values.length)
    const max = Math.max(...values)
    const min = Math.min(...values)

    const kpiSets: Record<string, { title: string; value: string; variant: string; trend: { value: string; direction: 'up' | 'down' } }[]> = {
        chart: [
            { title: 'Total Volume', value: formatNumber(total), variant: 'blue', trend: { value: '+12.5%', direction: 'up' } },
            { title: 'Peak Value', value: formatNumber(max), variant: 'emerald', trend: { value: '+8.1%', direction: 'up' } },
            { title: 'Average', value: formatNumber(avg), variant: 'orange', trend: { value: '+3.4%', direction: 'up' } },
            { title: 'Min Value', value: formatNumber(min), variant: 'purple', trend: { value: '-1.2%', direction: 'down' } },
        ],
        graph: [
            { title: 'Area Volume', value: formatNumber(total), variant: 'cyan', trend: { value: '+9.8%', direction: 'up' } },
            { title: 'Peak Signal', value: formatNumber(max), variant: 'blue', trend: { value: '+6.3%', direction: 'up' } },
            { title: 'Avg Amplitude', value: formatNumber(avg), variant: 'emerald', trend: { value: '+2.1%', direction: 'up' } },
            { title: 'Variance', value: formatNumber(max - min), variant: 'orange', trend: { value: '-4.5%', direction: 'down' } },
        ],
        trend: [
            { title: 'Trend Slope', value: '+2.4', variant: 'emerald', trend: { value: '+12%', direction: 'up' } },
            { title: 'Momentum', value: 'Strong', variant: 'blue', trend: { value: '+15.2%', direction: 'up' } },
            { title: 'Moving Avg', value: formatNumber(avg), variant: 'purple', trend: { value: '+5.7%', direction: 'up' } },
            { title: 'Volatility', value: '12.3%', variant: 'orange', trend: { value: '-2.8%', direction: 'down' } },
        ],
        distribution: [
            { title: 'Largest Slice', value: formatNumber(max), variant: 'amber', trend: { value: '+4.1%', direction: 'up' } },
            { title: 'Total Sum', value: formatNumber(total), variant: 'blue', trend: { value: '+7.6%', direction: 'up' } },
            { title: 'Segments', value: `${Math.min(data.length, 6)} `, variant: 'emerald', trend: { value: '0%', direction: 'up' } },
            { title: 'Evenness', value: '68%', variant: 'purple', trend: { value: '+1.3%', direction: 'up' } },
        ],
        donut: [
            { title: 'Center Score', value: '84%', variant: 'purple', trend: { value: '+3.2%', direction: 'up' } },
            { title: 'Top Segment', value: formatNumber(max), variant: 'blue', trend: { value: '+5.8%', direction: 'up' } },
            { title: 'Ring Total', value: formatNumber(total), variant: 'emerald', trend: { value: '+9.1%', direction: 'up' } },
            { title: 'Balance', value: '72%', variant: 'orange', trend: { value: '+2.4%', direction: 'up' } },
        ],
        funnel: [
            { title: 'Top Funnel', value: '12.5K', variant: 'blue', trend: { value: '+6.2%', direction: 'up' } },
            { title: 'Conversion', value: '8.8%', variant: 'emerald', trend: { value: '+1.5%', direction: 'up' } },
            { title: 'Drop-off', value: '42%', variant: 'red', trend: { value: '-3.1%', direction: 'down' } },
            { title: 'Bottom', value: '1.1K', variant: 'purple', trend: { value: '+4.7%', direction: 'up' } },
        ],
        heatmap: [
            { title: 'Hot Zones', value: '12', variant: 'red', trend: { value: '+3', direction: 'up' } },
            { title: 'Peak Density', value: formatNumber(max), variant: 'orange', trend: { value: '+8.9%', direction: 'up' } },
            { title: 'Avg Intensity', value: formatNumber(avg), variant: 'blue', trend: { value: '+2.3%', direction: 'up' } },
            { title: 'Coverage', value: '89%', variant: 'emerald', trend: { value: '+5.1%', direction: 'up' } },
        ],
        scatter: [
            { title: 'Correlation', value: '0.72', variant: 'cyan', trend: { value: '+0.05', direction: 'up' } },
            { title: 'Data Points', value: `${data.length} `, variant: 'blue', trend: { value: '+14', direction: 'up' } },
            { title: 'Outliers', value: '3', variant: 'orange', trend: { value: '-1', direction: 'down' } },
            { title: 'R² Score', value: '0.85', variant: 'emerald', trend: { value: '+0.02', direction: 'up' } },
        ],
        composed: [
            { title: 'Bar Total', value: formatNumber(total), variant: 'blue', trend: { value: '+10.2%', direction: 'up' } },
            { title: 'Line Avg', value: formatNumber(avg), variant: 'emerald', trend: { value: '+6.8%', direction: 'up' } },
            { title: 'Layers', value: '3', variant: 'purple', trend: { value: 'Multi', direction: 'up' } },
            { title: 'Sync Score', value: '91%', variant: 'orange', trend: { value: '+2.1%', direction: 'up' } },
        ],
        radar: [
            { title: 'Overall', value: '78%', variant: 'blue', trend: { value: '+4.2%', direction: 'up' } },
            { title: 'Strongest', value: 'Engagement', variant: 'emerald', trend: { value: '+8.5%', direction: 'up' } },
            { title: 'Weakest', value: 'Revenue', variant: 'orange', trend: { value: '-2.3%', direction: 'down' } },
            { title: 'Dimensions', value: '6', variant: 'purple', trend: { value: '0%', direction: 'up' } },
        ],
    }
    return kpiSets[viewType] || kpiSets.chart
}

// REMOVED KPIS HERE TO FIX TYPE ERRORS, MOVED KPIs TO COMPONENT OR USAGE IF NEEDED
// OR JUST LEAVING THE FUNCTION DEFINITION IF IT'S USED



function generateDetailedData(range: string) {
    const points = range === '1y' ? 12 : range === '1m' ? 30 : range === '1w' ? 7 : 24
    return Array.from({ length: points }, (_, i) => ({
        name: range === '1y' ? `Month ${i + 1} ` : range === '1m' ? `Day ${i + 1} ` : range === '1w' ? `Day ${i + 1} ` : `${i}:00`,
        value: Math.floor(Math.random() * 5000 + 1000),
        previous: Math.floor(Math.random() * 5000 + 1000), // Comparison data
        secondary: Math.floor(Math.random() * 3000 + 500),
        tertiary: Math.floor(Math.random() * 2000 + 200),
    }))
}

// Polar Matrix Data Helper
function generateRadialMatrixData() {
    const rings = ['Marriage', 'Hospital visits', 'Adoption', 'Employment', 'Housing', 'Hate crimes', 'Schools']
    const items = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

    return items.map((item) => {
        const entry: any = { name: item, value: 1 } // Value 1 for equal slices
        rings.forEach((ring, i) => {
            // Skewed random distribution for heatmap effect
            entry[`ring_${i} `] = Math.random() > (0.4 + i * 0.05)
        })
        return entry
    })
}

// Scatter Data Helper (Multi-colored groups)
function generateScatterData(points = 150) {
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

const RADAR_DATA = [
    { subject: 'Engagement', A: 120, B: 110, fullMark: 150 },
    { subject: 'Retention', A: 98, B: 130, fullMark: 150 },
    { subject: 'Reach', A: 86, B: 130, fullMark: 150 },
    { subject: 'Conversion', A: 99, B: 100, fullMark: 150 },
    { subject: 'Satisfaction', A: 85, B: 90, fullMark: 150 },
    { subject: 'Revenue', A: 65, B: 85, fullMark: 150 },
]

// ============ AI RECOMMENDATIONS ============





// ============ CUSTOM TOOLTIP ============

// ============ CUSTOM TOOLTIP (Redesigned) ============

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null

    const total = payload.reduce((sum: number, entry: any) => sum + (typeof entry.value === 'number' ? entry.value : 0), 0)

    return (
        <div className="bg-[#0f172a] border border-slate-800 shadow-2xl rounded-sm overflow-hidden min-w-[220px]">
            {/* Header */}
            <div className="bg-[#020617] px-4 py-3 border-b border-slate-800/50">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {label}
                </p>
            </div>

            {/* Body */}
            <div className="p-2">
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between px-3 py-2 hover:bg-slate-800/50 transition-colors rounded-sm group">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-3 h-3 rounded-[1px] shadow-sm"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-[13px] font-medium text-slate-300 group-hover:text-white transition-colors">
                                {entry.name}
                            </span>
                        </div>
                        <span className="text-[13px] font-bold font-mono text-white">
                            {formatNumber(entry.value)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Footer / Total */}
            {payload.length > 1 && (
                <div className="bg-[#1e293b]/50 px-5 py-3 border-t border-slate-800 flex items-center justify-between mt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total</span>
                    <span className="text-sm font-black text-white font-mono tracking-tight">
                        {formatNumber(total)}
                    </span>
                </div>
            )}
        </div>
    )
}

// ============ COMPONENT ============

export function ExpandedChartModal({ card, onClose, onPin, onSave, onEdit, onDelete }: ExpandedChartModalProps) {
    // Core State
    const [viewType, setViewType] = useState<any>(card.viewType)
    const [timeRange, setTimeRange] = useState('1w')
    const [fontSize, setFontSize] = useState(11)
    const [isCompareMode, setIsCompareMode] = useState(false)

    const [activeRecommendationId, setActiveRecommendationId] = useState<string | null>(null)

    const [chatMessages, setChatMessages] = useState<{ role: 'ai' | 'user'; content: string; timestamp: Date; recommendations?: string[] }[]>([
        {
            role: 'ai',
            content: "I've analyzed this chart. Here are 5 AI-generated recommendations to improve your visualization:",
            timestamp: new Date(),
            recommendations: [
                "**Funnel Analysis**: Switch to a Funnel Chart to visualize conversion drop-offs.",
                "**Moving Average**: Apply a Moving Average trend line to smooth out volatility.",
                "**Mobile Segment**: Filter by Mobile Users to see platform-specific performance.",
                "**Peak Labels**: Add Data Labels for better readability of peak values.",
                "**Growth Compare**: Compare with Previous Period to see growth trends."
            ]
        }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [chatMessages, isTyping])

    const handleSend = () => {
        if (!input.trim()) return
        const newMsg = { role: 'user' as const, content: input, timestamp: new Date() }
        setChatMessages(prev => [...prev, newMsg])
        setInput('')
        setIsTyping(true)

        // Simulate AI response
        setTimeout(() => {
            const aiResponses = [
                {
                    text: "Based on the current trend, we're seeing a 15% increase in engagement. Here are some actions you can take:",
                    recs: ["Run a targeted campaign for high-engagement users.", "Optimize the landing page for mobile."]
                },
                {
                    text: "I recommend switching to a stacked bar chart to better visualize the breakdown. Would you like to apply this change?",
                    recs: ["Switch to Stacked Bar Chart", "Adjust color palette for better contrast"]
                },
                {
                    text: "The drop-off rate largely occurs on weekends. Consider running a weekend campaign.",
                    recs: ["Schedule weekend email blast", "Offer weekend-only discount"]
                }
            ]
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
            setChatMessages(prev => [...prev, {
                role: 'ai',
                content: randomResponse.text,
                timestamp: new Date(),
                recommendations: randomResponse.recs
            }])
            setIsTyping(false)
        }, 1500)
    }

    const handleUseRecommendation = (rec: string) => {
        // Mock action
        const newMsg = { role: 'user' as const, content: `Apply recommendation: ${rec}`, timestamp: new Date() }
        setChatMessages(prev => [...prev, newMsg])
        setIsTyping(true)
        setTimeout(() => {
            setChatMessages(prev => [...prev, {
                role: 'ai',
                content: `I've applied the recommendation: "**${rec}**". The chart has been updated.`,
                timestamp: new Date()
            }])
            setIsTyping(false)
        }, 1000)
    }

    // Customization State (Consolidated)
    const [darkMode, setDarkMode] = useState(false)
    const [chartConfig, setChartConfig] = useState<Record<string, boolean>>({
        showLegend: true,
        showGrid: true,
        showLabels: false,
        showTrend: false,
        isAnimated: true,
        isSmoothed: true,
        isStacked: false,
        isHorizontal: false,
        isRounded: true,
        isFilled: true,
        showDots: true,
        showShadow: true,
        showPercent: true,
        isExploded: false,
        showAverage: false,
        glassEffect: true
    })

    const toggleConfig = (key: string) => {
        setChartConfig(prev => ({ ...prev, [key]: !prev[key] }))
    }

    // Display Options
    const [showTable, setShowTable] = useState(false)

    // Chart Definitions with 8 Customizations Each
    const CUSTOMIZATION_OPTIONS: Record<string, { key: string; label: string; icon: string }[]> = {
        chart: [ // Bar
            { key: 'showLegend', label: 'Show Legend', icon: '📋' },
            { key: 'showGrid', label: 'Grid Lines', icon: '📏' },
            { key: 'showLabels', label: 'Data Labels', icon: '🏷️' },
            { key: 'isStacked', label: 'Stacked Bars', icon: '📚' },
            { key: 'isHorizontal', label: 'Horizontal Mode', icon: '↔️' },
            { key: 'isRounded', label: 'Rounded Corners', icon: '⭕' },
            { key: 'showShadow', label: 'Drop Shadow', icon: '🌑' },
            { key: 'isAnimated', label: 'Animation', icon: '⚡' }
        ],
        graph: [ // Area
            { key: 'showLegend', label: 'Show Legend', icon: '📋' },
            { key: 'showGrid', label: 'Grid Lines', icon: '📏' },
            { key: 'showLabels', label: 'Data Labels', icon: '🏷️' },
            { key: 'isSmoothed', label: 'Smooth Curve', icon: '🌊' },
            { key: 'showDots', label: 'Data Points', icon: '📍' },
            { key: 'isFilled', label: 'Gradient Fill', icon: '🌈' },
            { key: 'showTrend', label: 'Trend Line', icon: '📈' },
            { key: 'isAnimated', label: 'Animation', icon: '⚡' }
        ],
        trend: [ // Line
            { key: 'showLegend', label: 'Show Legend', icon: '📋' },
            { key: 'showGrid', label: 'Grid Lines', icon: '📏' },
            { key: 'showLabels', label: 'Data Labels', icon: '🏷️' },
            { key: 'isSmoothed', label: 'Smooth Curve', icon: '🌊' },
            { key: 'showDots', label: 'Data Points', icon: '📍' },
            { key: 'showShadow', label: 'Glow Effect', icon: '✨' },
            { key: 'showAverage', label: 'Avg Line', icon: '➖' },
            { key: 'isAnimated', label: 'Animation', icon: '⚡' }
        ],
        donut: [ // Donut
            { key: 'showLegend', label: 'Show Legend', icon: '📋' },
            { key: 'showLabels', label: 'Data Labels', icon: '🏷️' },
            { key: 'showPercent', label: 'Show %', icon: '💯' },
            { key: 'isExploded', label: 'Explode Segments', icon: '💥' },
            { key: 'showShadow', label: '3D Shadow', icon: '🌑' },
            { key: 'isRounded', label: 'Rounded Cap', icon: '⭕' },
            { key: 'glassEffect', label: 'Glass Effect', icon: '🧊' },
            { key: 'isAnimated', label: 'Animation', icon: '⚡' }
        ],
        distribution: [ // Pie (Distribution) - Similar to Donut
            { key: 'showLegend', label: 'Show Legend', icon: '📋' },
            { key: 'showLabels', label: 'Data Labels', icon: '🏷️' },
            { key: 'showPercent', label: 'Show %', icon: '💯' },
            { key: 'isExploded', label: 'Explode', icon: '💥' },
            { key: 'showShadow', label: '3D Shadow', icon: '🌑' },
            { key: 'glassEffect', label: 'Glass Effect', icon: '🧊' },
            { key: 'isAnimated', label: 'Animation', icon: '⚡' },
            { key: 'showGrid', label: 'Background', icon: '⬛' }
        ],
        radar: [ // Radar
            { key: 'showLegend', label: 'Show Legend', icon: '📋' },
            { key: 'showGrid', label: 'Grid Lines', icon: '🕸️' },
            { key: 'showLabels', label: 'Axis Labels', icon: '🏷️' },
            { key: 'isFilled', label: 'Fill Area', icon: '🎨' },
            { key: 'showShadow', label: 'Drop Shadow', icon: '🌑' },
            { key: 'glassEffect', label: 'Glass Effect', icon: '🧊' },
            { key: 'isAnimated', label: 'Animation', icon: '⚡' },
            { key: 'showDots', label: 'Data Points', icon: '📍' }
        ],
        composed: [ // Composed
            { key: 'showLegend', label: 'Show Legend', icon: '📋' },
            { key: 'showGrid', label: 'Grid Lines', icon: '📏' },
            { key: 'showLabels', label: 'Data Labels', icon: '🏷️' },
            { key: 'isStacked', label: 'Stacked', icon: '📚' },
            { key: 'isRounded', label: 'Rounded Bars', icon: '⭕' },
            { key: 'showShadow', label: 'Drop Shadow', icon: '🌑' },
            { key: 'glassEffect', label: 'Glass Effect', icon: '🧊' },
            { key: 'isAnimated', label: 'Animation', icon: '⚡' }
        ],
        pareto: [ // Pareto
            { key: 'showLegend', label: 'Show Legend', icon: '📋' },
            { key: 'showGrid', label: 'Grid Lines', icon: '📏' },
            { key: 'showLabels', label: 'Bar Labels', icon: '🏷️' },
            { key: 'isRounded', label: 'Rounded Bars', icon: '⭕' },
            { key: 'showDots', label: 'Line Points', icon: '📍' },
            { key: 'isSmoothed', label: 'Smooth Line', icon: '🌊' },
            { key: 'showShadow', label: 'Drop Shadow', icon: '🌑' },
            { key: 'isAnimated', label: 'Animation', icon: '⚡' }
        ],
        radialbar: [ // Radial Bar (Polar)
            { key: 'showLegend', label: 'Show Legend', icon: '📋' },
            { key: 'showLabels', label: 'Category Labels', icon: '🏷️' },
            { key: 'isStacked', label: 'Stack Rings', icon: '📚' },
            { key: 'isRounded', label: 'Rounded Ends', icon: '⭕' },
            { key: 'showShadow', label: 'Drop Shadow', icon: '🌑' },
            { key: 'glassEffect', label: 'Glass Effect', icon: '🧊' },
            { key: 'isAnimated', label: 'Animation', icon: '⚡' },
            { key: 'showGrid', label: 'Background Track', icon: '🛤️' }
        ],
        treemap: [ // Density Map (Streamgraph / Stacked Area)
            { key: 'showLabels', label: 'Layer Labels', icon: '🏷️' },
            { key: 'showShadow', label: 'Depth Shadow', icon: '🌑' },
            { key: 'glassEffect', label: 'Glass Layers', icon: '🧊' },
            { key: 'isAnimated', label: 'Animation', icon: '⚡' },
            { key: 'showGrid', label: 'Grid Lines', icon: '📏' },
            { key: 'isRounded', label: 'Smooth Curves', icon: '🌊' },
            { key: 'showLegend', label: 'Legend', icon: '🎨' }
        ],
        waterfall: [ // Waterfall
            { key: 'showLegend', label: 'Show Legend', icon: '📋' },
            { key: 'showGrid', label: 'Grid Lines', icon: '📏' },
            { key: 'showLabels', label: 'Step Labels', icon: '🏷️' },
            { key: 'isRounded', label: 'Rounded Bars', icon: '⭕' },
            { key: 'showShadow', label: 'Drop Shadow', icon: '🌑' },
            { key: 'glassEffect', label: 'Glass Effect', icon: '🧊' },
            { key: 'isAnimated', label: 'Animation', icon: '⚡' },
            { key: 'isStacked', label: 'Show Connectors', icon: '🔗' }
        ],
        scatter: [ // Scatter
            { key: 'showLegend', label: 'Show Legend', icon: '📋' },
            { key: 'showGrid', label: 'Grid Lines', icon: '📏' },
            { key: 'showLabels', label: 'Point Labels', icon: '🏷️' },
            { key: 'showDots', label: 'Large Points', icon: '🔵' },
            { key: 'showShadow', label: 'Point Shadow', icon: '🌑' },
            { key: 'glassEffect', label: 'Glass Effect', icon: '🧊' },
            { key: 'isAnimated', label: 'Animation', icon: '⚡' },
            { key: 'showTrend', label: 'Trend Line', icon: '📈' }
        ],
        funnel: [ // Funnel
            { key: 'showLabels', label: 'Stage Names', icon: '🏷️' },
            { key: 'showPercent', label: 'Conversion %', icon: '💯' },
            { key: 'showShadow', label: 'Drop Shadow', icon: '🌑' },
            { key: 'glassEffect', label: 'Glass Effect', icon: '🧊' },
            { key: 'isAnimated', label: 'Animation', icon: '⚡' },
            { key: 'isRounded', label: 'Rounded Edges', icon: '⭕' },
            { key: 'showLegend', label: 'Legend', icon: '📋' },
            { key: 'showGrid', label: 'Show Drop-off', icon: '📉' } // Show -X%
        ],
        heatmap: [ // Heatmap (Scatter Style)
            { key: 'showLegend', label: 'Show Legend', icon: '📋' },
            { key: 'showGrid', label: 'Grid Lines', icon: '📏' },
            { key: 'showLabels', label: 'Value Labels', icon: '🏷️' },
            { key: 'isSmoothed', label: 'Smooth Density', icon: '🌊' },
            { key: 'showDots', label: 'Cluster Points', icon: '📍' },
            { key: 'showShadow', label: 'Point Shadow', icon: '🌑' },
            { key: 'glassEffect', label: 'Glass Effect', icon: '🧊' },
            { key: 'isAnimated', label: 'Animation', icon: '⚡' }
        ]
    }

    // Default Fallback
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getDefaultOptions = (_type: string) => [
        { key: 'showLegend', label: 'Show Legend', icon: '📋' },
        { key: 'showGrid', label: 'Grid Lines', icon: '📏' },
        { key: 'showLabels', label: 'Data Labels', icon: '🏷️' },
        { key: 'isAnimated', label: 'Enable Animation', icon: '⚡' },
        { key: 'showShadow', label: 'Drop Shadow', icon: '🌑' },
        { key: 'glassEffect', label: 'Glassmorphism', icon: '🧊' },
        { key: 'showDots', label: 'Show Markers', icon: '📍' },
        { key: 'isSmoothed', label: 'Smooth Lines', icon: '🌊' }
    ]


    // Active Insight State



    // Color
    const [activePalette, setActivePalette] = useState(0)
    const [paletteRotation, setPaletteRotation] = useState(0)
    // --- 4. Chart Configuration & Colors ---

    // Divergent Color Scale Helper (Vivid Blue -> White -> Vivid Red)
    const getHeatmapColor = (value: number) => {
        // value 0-100
        if (value < 50) {
            // Blue to White (using solid Tailwind-like colors for clarity)
            // 0 = Dark Blue (#2563eb), 25 = Medium Blue (#60a5fa), 50 = White (#ffffff)
            const i = value / 50
            // Interactive interpolation
            if (i < 0.5) return '#3b82f6' // Blue-500
            if (i < 0.8) return '#93c5fd' // Blue-300
            return '#dbeafe' // Blue-100
        } else {
            // White to Red
            const i = (value - 50) / 50
            if (i < 0.2) return '#fee2e2' // Red-100
            if (i < 0.5) return '#fca5a5' // Red-300
            return '#ef4444' // Red-500
        }
    }

    const chartColors = useMemo(() => {
        const colors = [...COLOR_PALETTES[activePalette].colors]
        // Simple rotation shuffle based on paletteRotation state
        const rotate = (arr: string[], n: number) => [...arr.slice(n), ...arr.slice(0, n)]
        return rotate(colors, paletteRotation)
    }, [activePalette, paletteRotation])

    const handleRefreshColors = () => {
        setPaletteRotation(prev => (prev + 1) % 8)
    }

    // Data
    // Data
    const rawData = useMemo(() => generateDetailedData(timeRange), [timeRange])

    const data = useMemo(() => {
        return [...rawData]
    }, [rawData])

    // Polar Matrix Data (Moved to top level to avoid hook violation)
    const matrixData = useMemo(() => generateRadialMatrixData(), [])

    // Scatter Data (Moved to top level)
    const scatterData = useMemo(() => viewType === 'scatter' ? generateScatterData() : data, [viewType, data])

    const activeViewConfig = VIEW_TYPES.find(v => v.type === viewType) || VIEW_TYPES[0]



    const handleSave = () => {
        onSave({ viewType })
        onClose()
    }

    // Chart Renderers
    const handleExport = () => {
        // Construct report data
        const reportData = {
            reportOverview: {
                title: card.title || "User Retention Deep Dive",
                surveyName: "Customer Satisfaction Survey 2024",
                hypothesisId: "HYP-2024-H1-ADVANCED",
                category: activeViewConfig.label,
                generatedOn: new Date().toLocaleDateString(),
                dataCoverage: "Last 30 Days (Jan 15 - Feb 14)",
                respondentBase: 2450,
                confidenceLevel: 92
            },
            executiveSummary: {
                statement: "Analysis indicates a strong positive correlation (0.78) between 'Interactive Dashboard' usage and 'Pro-Tier' retention rates.",
                keyFinding: "Users who interact with the new dashboard features >3 times a week show a 25% higher retention rate than the control group.",
                impactSummary: { revenue: "+$42.5k / qtr", conversion: "+8.2%", nps: "+12 pts", risk: "-18%" },
                confidence: 92,
                urgency: "High",
                recommendedAction: "Immediately roll out 'Dashboard Onboarding Walkthrough' to all 'At-Risk' mid-tier accounts.",
                expectedOutcome: "Projected 15% increase in overall platform engagement and $150k ARR uplift."
            },
            hypothesisDefinition: {
                name: card.title,
                question: "Does the new feature set improve retention?",
                nullHypothesis: "Interactive features have no significant impact on retention.",
                alternateHypothesis: "Interactive features significantly improve retention.",
                businessProblem: "Churn rate in mid-tier segment increased by 4% in Q4.",
                stakeholderObjective: "Reduce churn by 5% and increase daily active usage.",
                assumptions: ["Feature is discoverable.", "Users find value in data visualization.", "Mobile experience is parity."]
            },
            targetSegment: {
                audienceType: "Mid-Market Enterprise",
                demographics: { ageRange: "25-45", gender: "All", education: "Bachelor's +" },
                financialFilters: { budgetRange: "$1k-$5k / mo", loanAmount: "N/A", incomeRange: "$50k+" },
                intentSignals: { timeframe: "Immediate", urgency: "High" },
                geography: "North America (Primary: NY, CA, TX)",
                channelSource: "Direct & Organic Search",
                sampleSize: 850
            },
            dataSources: {
                surveyQuestions: ["Q1: Ease of Use", "Q3: Feature Value", "Q5: Renewal Intent"],
                questionTypes: ["Likert Scale", "Open-ended (Sentiment)"],
                behavioralData: ["Clickstream Events", "Session Duration", "Feature Toggles"],
                integrations: ["Salesforce CRM", "Mixpanel Analytics"],
                avgCompletionTime: "4m 30s",
                dropOffPoints: ["Step 2 (Pricing Page)"]
            },
            keyMetrics: {
                primaryMetric: "Net Revenue Retention (NRR)",
                secondaryMetrics: ["Time on Site", "Feature Adoption Rate", "Session Frequency"],
                supportingKPIs: ["NPS", "CSAT", "Churn Rate"],
                baseline: { conversion: 12, dropOff: 40, avgTime: "3m 12s" },
                variant: { conversion: 18, dropOff: 22, avgTime: "5m 45s" },
                trendDirection: "Positive"
            },
            statisticalAnalysis: {
                method: "Two-Tailed T-Test",
                significance: 0.004,
                effectSize: 0.72,
                confidenceInterval: [0.15, 0.55],
                sampleAdequacy: "High (Power > 0.8)",
                biasDetection: "None Detected"
            },
            visualization: {
                chartType: viewType,
                data: data.slice(0, 12) // Sample data for report viz
            },
            // --- NEW ENRICHED SECTIONS ---
            segmentAnalysis: {
                topPerforming: { name: "Power Users (Mobile)", score: 9.8, growth: "+12%" },
                underPerforming: { name: "Legacy Desktop", score: 4.2, growth: "-5%" },
                opportunity: { name: "New Signups (<30 days)", score: 7.5, growth: "+25%" }
            },
            temporalTrends: {
                monthlyGrowth: "+8.5%",
                seasonalImpact: "Low",
                forecastNextQ: "+12% Growth projected"
            },
            verbatimAnalysis: {
                sentimentScore: 0.85,
                topKeywords: ["Easy", "Fast", "Insightful", "Beautiful"],
                quotes: [
                    "The new dashboard is a game changer for my daily workflow.",
                    "I love how easy it is to export reports now.",
                    "The colors make it very easy to read on mobile."
                ]
            },
            kpiDrilldown: [
                { label: "Daily Active Users", value: "1,240", trend: "+12%" },
                { label: "Avg Session Time", value: "8m 12s", trend: "+45s" },
                { label: "Export Actions", value: "342", trend: "+15%" }
            ],
            // -----------------------------
            coreFindings: {
                primaryInsight: "Feature adoption directly drives retention velocity.",
                evidence: ["Cohort A (Adopters) has 98% retention", "Cohort B (Non-adopters) has 82% retention"],
                contradictory: "None significant.",
                pattern: "Linear correlation",
                behavioralExplanation: "Users feel more empowered by self-serve data.",
                financialInterpretation: "Higher LTV ($1200 vs $800)."
            },
            aiReasoning: {
                whyGenerated: "Automated anomaly detection triggered this insight.",
                signalWeighting: { dropOffSignal: 0.4, surveyFeedback: 0.3, behavioral: 0.3 },
                featureImportance: ["Dashboard", "Alerts", "Export"],
                correlationDrivers: ["Frequency", "Depth of Usage"],
                confidenceDrivers: ["Sample Size > 500", "Consistency across regions"],
                limitations: ["Short timeframe (30 days)"]
            },
            confidenceScore: {
                overall: 92,
                dataQuality: 95,
                sampleStrength: 88,
                signalConsistency: 90,
                historicalMatch: 82,
                falsePositiveRisk: "Very Low"
            },
            businessImpact: {
                conversionUplift: "8.2%",
                revenueImpact: "$42.5k",
                costReduction: "$5k (Support tickets reduced)",
                npsLift: "12 pts",
                riskReduction: "18%",
                timeToValue: "3 days"
            },
            recommendedActions: {
                primary: "Global Rollout of Dashboard 2.0",
                secondary: ["Email Campaign to Legacy Users", "In-app Guide for New Features"],
                departmentOwner: "Product Growth",
                channel: "In-app & Email",
                automationPotential: "High",
                priority: "P0 (Critical)"
            },
            experimentPlan: {
                testType: "A/B/n Multivariate",
                control: "Old Dashboard",
                test: "New Dashboard (Variant B)",
                successMetrics: ["Retention", "Engagement", "NPS"],
                duration: "2 weeks",
                minSample: 1000,
                rollbackCriteria: "Negative NPS or >5% Bug Rate"
            },
            implementationReadiness: {
                dataReadiness: "Verified",
                techDependency: "None",
                crmMapping: "Complete",
                trainingRequired: "None (Self-serve)",
                estimatedEffort: "Low",
                goLiveTimeline: "Immediate"
            },
            risks: {
                dataLimitations: "None",
                segmentBias: "Slight skew towards mobile",
                externalFactors: "None",
                seasonality: "None",
                regulatory: "None",
                overfitting: "Checked"
            },
            crossHypothesis: {
                similar: ["HYP-002 (Mobile Usage)"],
                conflicting: [],
                reinforcing: ["HYP-003 (Alerts)"],
                priorityRank: 1,
                netImpactScore: 9.5
            },
            historicalPerformance: {
                pastResults: ["Q3 Test: +5% Lift"],
                accuracyHistory: "94%",
                learningFeedback: "Model reinforced"
            },
            actionTracking: {
                status: "Ready for Review",
                owner: "Product Mgr",
                startDate: "Yesterday",
                completionDate: "TBD",
                kpiMonitoring: "Active",
                outcomeLogged: "No"
            },
            aiRecommendations: {
                relatedHypotheses: ["Validate pricing tier impact"],
                missingData: [],
                additionalQuestions: ["Why did you ignore the guide?"],
                deeperSegments: ["By Industry"]
            }
        }

        generateDeepDivePDF(reportData as any)
    }

    const renderChart = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { showLegend, showGrid, showLabels, isStacked, isRounded, showShadow, isAnimated, showTrend, showDots, isSmoothed, isExploded, showPercent, showAverage, isFilled: _isFilled, glassEffect, isHorizontal } = chartConfig

        // Generate Heatmap Data (24x20 Grid for Dense "Real" Look)
        const heatMapData = []
        const X_STEPS = 24
        const Y_STEPS = 20
        for (let x = 0; x < X_STEPS; x++) {
            for (let y = 0; y < Y_STEPS; y++) {
                // Complex noise pattern for "Correlation Matrix" look
                const xFactor = Math.sin(x / 3) * 20
                const yFactor = Math.cos(y / 4) * 20
                const intensity = 50 + xFactor + yFactor + (Math.random() * 40 - 20)

                // Add some "clusters"
                let finalVal = Math.max(0, Math.min(100, intensity))
                if ((x > 15 && y > 12) || (x < 8 && y < 8)) finalVal += 30 // Hot zones
                if ((x > 15 && y < 8)) finalVal -= 30 // Cold zones

                heatMapData.push({
                    x,
                    y,
                    z: Math.max(0, Math.min(100, finalVal))
                })
            }
        }

        const renderSquareShape = (props: any) => {
            const { cx, cy, payload } = props
            // Dynamic size estimation or fixed large size
            const sizeVal = 48 // Increased to fill gaps (assuming ~1200px width / 24 cols = 50px)

            return (
                <rect
                    x={cx - sizeVal / 2}
                    y={cy - sizeVal / 2}
                    width={sizeVal} // Full bleed
                    height={sizeVal}
                    fill={props.fill}
                    // Add stroke of same color to fill sub-pixel gaps
                    stroke={props.fill}
                    strokeWidth={1}
                />
            )
        }

        const axisTick = { fontSize, fill: darkMode ? '#94a3b8' : '#64748b' }
        const gridStroke = darkMode ? '#334155' : '#e2e8f0'
        const curveType = isSmoothed ? 'monotone' : 'linear'
        const animDuration = isAnimated ? 800 : 0
        const shadowFilter = showShadow ? "url(#chartShadow)" : undefined

        const CommonDefs = () => (
            <defs>
                <filter id="chartShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2" />
                </filter>
                <linearGradient id="glassBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="white" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="white" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors[1]} stopOpacity={0.6} />
                    <stop offset="95%" stopColor={chartColors[1]} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="gradSecondary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors[3]} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={chartColors[3]} stopOpacity={0.1} />
                </linearGradient>
            </defs>
        )

        const renderLegend = () => showLegend ? <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" /> : null
        const renderGrid = () => showGrid ? <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} /> : null

        switch (viewType) {
            case 'chart': // Bar
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout={isHorizontal ? 'vertical' : 'horizontal'} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                            <CommonDefs />
                            {renderGrid()}
                            {isHorizontal
                                ? <><XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" tick={axisTick} axisLine={false} tickLine={false} width={80} /></>
                                : <><XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} dy={10} /><YAxis tick={axisTick} axisLine={false} tickLine={false} /></>
                            }
                            <Tooltip cursor={{ fill: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }} content={<CustomTooltip />} />
                            {renderLegend()}
                            <Bar dataKey="value" name="Current" stackId={isStacked ? 'a' : undefined} fill={chartColors[1]} radius={isRounded ? (isStacked ? [0, 0, 0, 0] : [4, 4, 0, 0]) : [0, 0, 0, 0]} animationDuration={animDuration} filter={shadowFilter}>
                                {showLabels && <LabelList dataKey="value" position="top" style={{ fill: axisTick.fill, fontSize: fontSize }} />}
                            </Bar>
                            {isCompareMode && (
                                <Bar dataKey="previous" name="Previous" stackId={isStacked ? 'a' : undefined} fill={darkMode ? '#475569' : '#cbd5e1'} radius={[2, 2, 0, 0]} animationDuration={animDuration} />
                            )}
                            <Bar dataKey="secondary" name="Target" stackId={isStacked ? 'a' : undefined} fill={chartColors[2] || '#10b981'} radius={isRounded ? [4, 4, 0, 0] : [0, 0, 0, 0]} animationDuration={animDuration} filter={shadowFilter} />
                        </BarChart>
                    </ResponsiveContainer>
                )
            case 'trend': // Trend Line (Scatter + Smooth Line Combo) - NOT the main Scatter view
            case 'scatter': // SCATTER PLOT (Updated to match screenshot)

                if (viewType === 'trend') {
                    // Previous Trend implementation
                    return (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                                <CommonDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} opacity={showGrid ? 1 : 0} />
                                <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }} content={<CustomTooltip />} />
                                {renderLegend()}
                                <Scatter dataKey="value" name="Data Points" fill={chartColors[0]} shape="circle" />
                                <Line type="monotone" dataKey="value" name="Trend" stroke={chartColors[1]} strokeWidth={4} dot={false} activeDot={{ r: 8 }} animationDuration={animDuration} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )
                }

                // NEW SCATTER PLOT IMPLEMENTATION
                // Screenshot: White BG, Light Grid, Multi-colors (Pink, Green, Blue, Olive), Blue Trend Line
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={scatterData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                            <CommonDefs />
                            {/* Light Grid matching screenshot */}
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} vertical={true} horizontal={true} />
                            <XAxis type="number" dataKey="x" tick={axisTick} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <YAxis type="number" dataKey="y" tick={axisTick} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                            {/* Scatter Points by Category */}
                            <Scatter name="Category A" data={scatterData.filter((d: any) => d.category === 'A')} fill="#ec4899" /> {/* Pink */}
                            <Scatter name="Category B" data={scatterData.filter((d: any) => d.category === 'B')} fill="#10b981" /> {/* Green */}
                            <Scatter name="Category C" data={scatterData.filter((d: any) => d.category === 'C')} fill="#0ea5e9" /> {/* Blue */}
                            <Scatter name="Category D" data={scatterData.filter((d: any) => d.category === 'D')} fill="#eab308" /> {/* Olive/Yellow */}

                            {/* Smooth Blue Trend Line */}
                            {showTrend && (
                                <Line
                                    type="monotone"
                                    dataKey="trendVal"
                                    stroke="#3b82f6" /* Blue like screenshot */
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={false}
                                    data={scatterData.sort((a: any, b: any) => a.x - b.x)} // Sort for line
                                />
                            )}
                            {showLegend && <Legend />}
                        </ComposedChart>
                    </ResponsiveContainer>
                )
            case 'graph': // Area
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                            <CommonDefs />
                            {renderGrid()}
                            <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            {renderLegend()}
                            <Area type={isSmoothed ? "monotone" : "linear"} dataKey="value" stroke={chartColors[1]} fill="url(#gradPrimary)" strokeWidth={3} animationDuration={animDuration} name="Primary" dot={showDots} activeDot={{ r: 6, strokeWidth: 0 }} filter={shadowFilter} />
                            {isCompareMode && (
                                <Area type={isSmoothed ? "monotone" : "linear"} dataKey="previous" stroke={darkMode ? '#64748b' : '#94a3b8'} strokeDasharray="5 5" fill="transparent" strokeWidth={2} name="Previous" dot={false} />
                            )}
                            {showTrend && <Area type="monotone" dataKey="secondary" stroke={chartColors[3] || '#f59e0b'} strokeDasharray="3 3" fill="url(#gradSecondary)" strokeWidth={2} name="Trend" dot={false} />}
                            {showAverage && <ReferenceLine y={data.reduce((a, b) => a + b.value, 0) / data.length} stroke="#ef4444" strokeDasharray="3 3" label="Avg" />}
                        </AreaChart>
                    </ResponsiveContainer>
                )
            case 'composed':
            case 'pareto': // Pareto: Bar + Line
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                            <CommonDefs />
                            {renderGrid()}
                            <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="right" orientation="right" tick={axisTick} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            {renderLegend()}
                            <Bar dataKey="value" name="Volume" barSize={30} fill={chartColors[1]} radius={isRounded ? [4, 4, 0, 0] : [0, 0, 0, 0]} animationDuration={animDuration} filter={shadowFilter}>
                                {showLabels && <LabelList dataKey="value" position="top" style={{ fill: axisTick.fill, fontSize: 10 }} />}
                            </Bar>
                            <Line yAxisId="right" type={isSmoothed ? "monotone" : "linear"} dataKey={viewType === 'pareto' ? 'secondary' : 'secondary'} stroke={chartColors[4] || '#ef4444'} strokeWidth={3} dot={showDots} name={viewType === 'pareto' ? 'Cum. %' : 'Growth'} animationDuration={animDuration} filter={shadowFilter} />
                        </ComposedChart>
                    </ResponsiveContainer>
                )
            case 'donut':
            case 'distribution':
                if (viewType === 'distribution') {
                    // Standard Donut/Pie
                    return (
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                                <CommonDefs />
                                <Pie
                                    data={data.slice(0, 6)}
                                    cx="50%" cy="50%"
                                    innerRadius={chartConfig.isRounded ? "60%" : "0%"}
                                    outerRadius="80%"
                                    paddingAngle={5}
                                    dataKey="value"
                                    cornerRadius={isRounded ? 5 : 0}
                                    stroke="none"
                                >
                                    {data.slice(0, 6).map((entry, index) => (
                                        <Cell
                                            key={`cell - ${index} `}
                                            fill={chartColors[index % chartColors.length]}
                                            stroke={darkMode ? '#0f172a' : '#fff'}
                                            strokeWidth={2}
                                            style={{ filter: showShadow ? 'url(#glassShadow)' : undefined }}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                {renderLegend()}
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    )
                }

                // POLAR MATRIX / RADIAL STACK (Requested "Donut" replacement)
                const rings = ['Marriage', 'Hospital visits', 'Adoption', 'Employment', 'Housing', 'Hate crimes', 'Schools']
                // Colors: Red, Orange, Blue, Green, Magenta, Purple, Sky
                const ringColors = ['#ef4444', '#f59e0b', '#3b82f6', '#84cc16', '#db2777', '#7c3aed', '#0ea5e9']

                const innerRadiusStart = 50
                const ringThickness = 22

                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                            <CommonDefs />
                            {rings.map((ringName, i) => (
                                <Pie
                                    key={ringName}
                                    data={matrixData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={innerRadiusStart + i * ringThickness}
                                    outerRadius={innerRadiusStart + (i + 1) * ringThickness}
                                    dataKey="value" // Equal slices
                                    startAngle={90}
                                    endAngle={-270}
                                    stroke="none"
                                    isAnimationActive={isAnimated}
                                >
                                    {matrixData.map((entry: any, index: number) => {
                                        const isActive = entry[`ring_${i} `]
                                        // "Empty" cells are light grey/white, Active have color
                                        const emptyColor = darkMode ? '#334155' : '#f1f5f9'
                                        return (
                                            <Cell
                                                key={`cell - ${i} -${index} `}
                                                fill={isActive ? ringColors[i % ringColors.length] : emptyColor}
                                                stroke={darkMode ? '#0f172a' : '#fff'}
                                                strokeWidth={1}
                                            />
                                        )
                                    })}
                                    {/* Labels only on outermost ring */}
                                    {i === rings.length - 1 && showLabels && (
                                        <LabelList dataKey="name" position="outside" offset={10} style={{ fill: axisTick.fill, fontSize: 9, fontWeight: 'bold' }} />
                                    )}
                                </Pie>
                            ))}
                            <Tooltip content={(props: any) => {
                                if (!props.active || !props.payload?.length) return null
                                const d = props.payload[0].payload
                                return (
                                    <div className="bg-slate-900 text-white p-3 rounded shadow-xl border border-slate-700">
                                        <div className="font-bold border-b border-slate-700 pb-1 mb-2">{d.name}</div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                            {rings.map((r, idx) => (
                                                <div key={r} className="flex items-center gap-2 text-[10px]">
                                                    <div className={`w - 2 h - 2 rounded - full ${d[`ring_${idx}`] ? '' : 'opacity-20'} `} style={{ backgroundColor: ringColors[idx] }} />
                                                    <span className={d[`ring_${idx} `] ? 'text-slate-200' : 'text-slate-500'}>{r}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }} />
                            {showLegend && (
                                <Legend
                                    // @ts-ignore
                                    payload={rings.map((r, i) => ({ value: r, type: 'square', id: r, color: ringColors[i] })) as any}
                                    iconType="square"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '10px', bottom: 0 }}
                                />
                            )}
                        </RechartsPieChart>
                    </ResponsiveContainer>
                )
            case 'radar':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_DATA}>
                            <CommonDefs />
                            <PolarGrid stroke={gridStroke} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: axisTick.fill, fontSize: 10, fontWeight: 700 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <Radar name="Current" dataKey="A" stroke={chartColors[1]} strokeWidth={3} fill={chartColors[1]} fillOpacity={0.4} animationDuration={animDuration} filter={shadowFilter} />
                            <Radar name="Previous" dataKey="B" stroke={chartColors[5] || '#ec4899'} strokeWidth={2} fill="transparent" animationDuration={animDuration} strokeDasharray="4 4" />
                            <Tooltip content={<CustomTooltip />} />
                            {renderLegend()}
                        </RadarChart>
                    </ResponsiveContainer>
                )
            case 'radialbar':
            case 'radial': // Unify Radial Bar Cases
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="25%" outerRadius="90%" barSize={24} data={data.slice(0, 8)}>
                            <RadialBar
                                label={undefined}
                                background={{ fill: darkMode ? '#334155' : '#e2e8f0' }}
                                dataKey="value"
                                cornerRadius={isRounded ? 100 : 4} // Fully rounded caps for modern look
                                barSize={16} // Thinner, more elegant bars like the reference
                            >
                                {data.slice(0, 8).map((entry, index) => {
                                    const color = chartColors[index % chartColors.length]
                                    return (
                                        <Cell
                                            key={`cell - ${index} `}
                                            fill={color}
                                            fillOpacity={0.7} // Glassmorphic translucent fill
                                            stroke={color} // Same-color stroke
                                            strokeWidth={2} // Distinct stroke
                                            style={{ filter: showShadow ? 'url(#glassShadow)' : undefined }}
                                        />
                                    )
                                })}
                            </RadialBar>
                            {/* Inner Ring for "Target" or "Previous" simulation */}
                            {isStacked && (
                                <RadialBar dataKey="secondary" cornerRadius={isRounded ? 12 : 2} fill="#64748b" opacity={0.3} />
                            )}
                            <Legend iconSize={8} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px' }} />
                            <Tooltip content={<CustomTooltip />} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                )
            case 'treemap': // DENSITY MAP (Streamgraph Style)
                // Generate Streamgraph-like Data
                const streamData = Array.from({ length: 24 }, (_, i) => {
                    const t = i / 3
                    return {
                        name: `${i} `,
                        // Generate smooth flowing layers using sin/cos combinations
                        layer1: Math.max(10, 30 + Math.sin(t) * 15 + Math.random() * 5),
                        layer2: Math.max(10, 25 + Math.cos(t * 0.8) * 12 + Math.random() * 5),
                        layer3: Math.max(10, 40 + Math.sin(t * 1.2 + 2) * 18 + Math.random() * 5),
                        layer4: Math.max(10, 20 + Math.cos(t * 0.5 + 4) * 10 + Math.random() * 5),
                        layer5: Math.max(5, 15 + Math.sin(t * 1.5 + 1) * 8 + Math.random() * 3),
                    }
                })

                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={streamData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CommonDefs />
                            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} opacity={0.3} />}
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: axisTick.fill }} axisLine={false} tickLine={false} dy={5} interval={2} />
                            <YAxis hide />
                            <Tooltip content={<CustomTooltip />} />
                            {/* Stacked Areas for Streamgraph effect */}
                            {['layer1', 'layer2', 'layer3', 'layer4', 'layer5'].map((key, index) => (
                                <Area
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stackId="1"
                                    stroke={chartColors[index % chartColors.length]}
                                    fill={chartColors[index % chartColors.length]}
                                    fillOpacity={glassEffect ? 0.8 : 1}
                                    strokeWidth={isRounded ? 0 : 1} // Smooth curves usually don't need stroke unless specified
                                    animationDuration={animDuration}
                                    filter={showShadow ? "url(#glassShadow)" : undefined}
                                >
                                    {showLabels && index % 2 === 0 && ( // Show labels on some layers
                                        <LabelList dataKey={key} position="inside" content={(props: any) => {
                                            // Show label only at the middle/widest point approx
                                            if (props.index === 12) {
                                                return (
                                                    <text x={props.x} y={props.y} fill="#fff" fontSize={10} fontWeight="bold" textAnchor="middle" dy={10}>
                                                        Layer {index + 1}
                                                    </text>
                                                )
                                            }
                                            return null
                                        }} />
                                    )}
                                </Area>
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                )
            case 'waterfall':
                // Waterfall Data Prep
                const waterfallData = data.slice(0, 8).map((d, i) => {
                    const prevSum = data.slice(0, i).reduce((a, b) => a + b.value, 0)
                    return { ...d, uv: [prevSum, prevSum + d.value], start: prevSum, end: prevSum + d.value }
                })
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CommonDefs />
                            {renderGrid()}
                            <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: darkMode ? '#334155' : '#f1f5f9', opacity: 0.4 }} content={<CustomTooltip />} />

                            {/* WaterFall Bars */}
                            <Bar dataKey="uv" radius={isRounded ? [4, 4, 4, 4] : 0} animationDuration={animDuration}>
                                {showLabels && <LabelList dataKey="value" position="top" style={{ fill: axisTick.fill, fontSize: 10, fontWeight: 700 }} />}
                                {waterfallData.map((entry, index) => {
                                    const isPos = entry.value >= 0
                                    // Green/Red/Blue logic
                                    let fill = isPos ? '#10b981' : '#ef4444'
                                    if (index === 0 || index === waterfallData.length - 1) fill = '#3b82f6' // Start/End Blue

                                    return (
                                        <Cell
                                            key={`cell - ${index} `}
                                            fill={fill}
                                            stroke={darkMode ? '#1e293b' : '#fff'}
                                            strokeWidth={2}
                                            style={{ filter: showShadow ? 'url(#glassShadow)' : undefined }}
                                        />
                                    )
                                })}
                            </Bar>

                            {/* Connector Lines (Simulated with Line) */}
                            {/* Note: True connector lines are complex in Recharts. Using a stepped line overlay is a common trick, or just relying on the bars. 
                                For "World Class", we'll skip the messy line overlay if the bars look clean enough with glass effect. */}
                        </BarChart>
                    </ResponsiveContainer>
                )
            case 'heatmap': // HEATMAP (Divergent Color Scale)
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                            <XAxis type="number" dataKey="x" domain={[0, 23]} hide />
                            <YAxis type="number" dataKey="y" domain={[0, 19]} hide />
                            <ZAxis type="number" range={[400, 400]} /> {/* Fixed size squares */}
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const d = payload[0].payload
                                        return (
                                            <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-xl text-xs text-white">
                                                <div className="font-bold mb-1">Coordinates: {d.x}, {d.y}</div>
                                                <div>Intensity: <span className="font-mono text-blue-300">{Math.round(d.z)}</span></div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Scatter name="Density" data={heatMapData} shape={renderSquareShape} animationDuration={animDuration}>
                                {heatMapData.map((entry, index) => (
                                    <Cell
                                        key={`cell - ${index} `}
                                        fill={getHeatmapColor(entry.z)} // Use Divergent Helper
                                        stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
                                    />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer >
                )
            case 'funnel': // Funnel using Custom 3D Component
                return (
                    <div className="w-full h-full flex items-center justify-center p-4">
                        <FunnelChart
                            data={data.slice(0, 5).map((d, i) => ({
                                ...d,
                                name: ['Impressions', 'Visits', 'Signups', 'Activated', 'Paid'][i] || d.name
                            })).sort((a, b) => b.value - a.value)}
                            darkMode={darkMode}
                            chartConfig={chartConfig}
                        />
                    </div>
                )


            default:
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <Bar dataKey="value" fill={chartColors[1]} />
                        </BarChart>
                    </ResponsiveContainer>
                )
        }
    }


    // ============ RENDER ============

    const bg = darkMode ? 'bg-slate-950' : 'bg-white'
    const bgSub = darkMode ? 'bg-slate-900' : 'bg-slate-50'
    const borderColor = darkMode ? 'border-slate-800' : 'border-slate-200'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 md:p-6">
            {/* SVG Filters for "World Class" Effects */}
            <svg style={{ height: 0, width: 0, position: 'absolute' }}>
                <defs>
                    {/* refined glass shadow */}
                    <filter id="glassShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.25" />
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    {/* glowing line effect */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    {/* inner glow for 3d volume */}
                    <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
                        <feOffset dx="0" dy="2" />
                        <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
                        <feFlood floodColor="white" floodOpacity="0.2" />
                        <feComposite in2="shadowDiff" operator="in" />
                        <feComposite in2="SourceGraphic" operator="over" />
                    </filter>
                </defs>
            </svg>
            <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 10 }}
                className={cn(
                    "fixed inset-0 w-full h-full flex flex-col overflow-hidden bg-slate-950",
                    bg
                )}
                style={{ borderRadius: 0 }}
            >
                {/* ============ HEADER ============ */}
                <div className={cn("h-16 shrink-0 flex items-center justify-between px-6 border-b z-20 relative shadow-sm", "bg-slate-950 border-slate-800")}>
                    <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 flex items-center justify-center border border-white/10 shadow-inner bg-slate-900 text-blue-400")} style={{ borderRadius: 0 }}>
                            <activeViewConfig.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                                {card.title} <span className="text-slate-600 font-normal text-sm">| Deep Dive</span>
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    {activeViewConfig.label} Analysis Active
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" isIconOnly onClick={() => setDarkMode(!darkMode)} title="Toggle Theme" className="text-slate-400 hover:text-white hover:bg-white/5">
                            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </Button>
                        <div className="h-6 w-px bg-white/10 mx-1" />
                        <Button variant={card.isPinned ? "secondary" : "ghost"} size="sm" onClick={onPin} className="gap-2 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10">
                            {card.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline text-xs font-bold">Pin View</span>
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleSave} className="gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 border border-blue-500" style={{ borderRadius: 0 }}>
                            <Check className="w-4 h-4" /> Save Changes
                        </Button>
                        <div className="h-6 w-px bg-white/10 mx-1" />
                        {onEdit && (
                            <Button variant="ghost" size="sm" isIconOnly onClick={onEdit} title="Edit Chart" className="text-slate-400 hover:text-white hover:bg-white/5">
                                <Edit className="w-4 h-4" />
                            </Button>
                        )}
                        {onDelete && (
                            <Button variant="ghost" size="sm" isIconOnly onClick={onDelete} title="Delete Chart" className="text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                        <div className="h-6 w-px bg-white/10 mx-1" />
                        <Button variant="ghost" size="sm" isIconOnly onClick={onClose} className="text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/50 border border-transparent">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* ============ MAIN BODY ============ */}
                <div className="flex-1 flex overflow-hidden min-h-0">

                    {/* LEFT SIDEBAR: Visualization & Config */}
                    <div className={cn("w-72 shrink-0 border-r flex flex-col overflow-hidden bg-black", borderColor)}>
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">

                            {/* 1. Visualization Selectors - SHARP 3D GLASSMORPHIC */}
                            <div className="space-y-3">
                                <div className="p-3 bg-slate-900 border border-slate-800 flex items-center gap-2 shadow-sm" style={{ borderLeft: '4px solid #8b5cf6' }}>
                                    <LayoutTemplate className="w-4 h-4 text-purple-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Visualization Type</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                                    {VIEW_TYPES.map((vt) => {
                                        const isActive = viewType === vt.type
                                        const Icon = vt.icon

                                        // Uniform Green Style for Selected State
                                        const activeBg = "border-emerald-500/80 shadow-[4px_4px_0_0_#059669]"
                                        const activeIcon = "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20"
                                        const activeText = "text-emerald-400"



                                        return (
                                            <button
                                                key={vt.type}
                                                onClick={() => setViewType(vt.type as any)}
                                                className={cn(
                                                    "relative flex flex-col items-center justify-center p-3 h-24 transition-all duration-200 group overflow-hidden border",
                                                    isActive
                                                        ? cn("bg-slate-900/90 translate-x-[-2px] translate-y-[-2px] z-10", activeBg)
                                                        : "bg-slate-900/40 border-slate-800 hover:bg-slate-800/60 hover:border-slate-600 hover:shadow-[2px_2px_0_0_rgba(148,163,184,0.1)] backdrop-blur-sm"
                                                )}
                                                style={{ borderRadius: 0 }}
                                            >
                                                {/* Glass Reflection */}
                                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                                                {/* Icon Container */}
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 border relative",
                                                    isActive
                                                        ? activeIcon
                                                        : "bg-slate-950 border-slate-800 text-slate-500 group-hover:text-slate-300 group-hover:border-slate-600"
                                                )} style={{ borderRadius: 0 }}>
                                                    <Icon className="w-5 h-5" />
                                                </div>

                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase tracking-wider text-center leading-tight transition-colors",
                                                    isActive ? activeText : "text-slate-500 group-hover:text-slate-300"
                                                )}>
                                                    {vt.label}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* 2. Color Palette */}
                            <div className="space-y-3">
                                <div className="p-3 bg-slate-900 border border-slate-800 flex items-center justify-between shadow-sm" style={{ borderLeft: '4px solid #f59e0b' }}>
                                    <div className="flex items-center gap-2">
                                        <Palette className="w-4 h-4 text-amber-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Color Palette</span>
                                    </div>
                                    <button onClick={handleRefreshColors} className="text-slate-400 hover:text-white transition-colors" title="Rotate Colors"><RotateCcw className="w-3.5 h-3.5" /></button>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {COLOR_PALETTES.slice(paletteRotation, paletteRotation + 4).concat(COLOR_PALETTES.slice(0, Math.max(0, (paletteRotation + 4) - COLOR_PALETTES.length))).map((palette) => {
                                        const originalIndex = COLOR_PALETTES.findIndex(p => p.name === palette.name)
                                        return (
                                            <button
                                                key={palette.name}
                                                onClick={() => setActivePalette(originalIndex)}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-3 border transition-all text-left relative overflow-hidden group",
                                                    activePalette === originalIndex
                                                        ? "border-blue-500 bg-slate-900 shadow-[2px_2px_0_0_#3b82f6] translate-x-[-1px] translate-y-[-1px]"
                                                        : "border-slate-800 bg-slate-950/50 hover:border-slate-600 hover:bg-slate-900"
                                                )}
                                                style={{ borderRadius: 0 }}
                                            >
                                                <div className="flex gap-0.5">
                                                    {palette.colors.slice(0, 5).map((c, ci) => (
                                                        <div key={ci} className="w-3 h-3 border border-slate-700/50" style={{ backgroundColor: c, borderRadius: 0 }} />
                                                    ))}
                                                </div>
                                                <span className={cn("text-[9px] font-bold uppercase tracking-wider", activePalette === originalIndex ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400')}>{palette.name}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* 3. Customization Toggles (8 Options) */}
                            {/* 3. Customization Toggles (Grid) */}
                            <div className="space-y-3">
                                <div className="p-3 bg-slate-900 border border-slate-800 flex items-center gap-2 shadow-sm" style={{ borderLeft: '4px solid #3b82f6' }}>
                                    <Settings2 className="w-4 h-4 text-blue-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Customization</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {(CUSTOMIZATION_OPTIONS[viewType] || getDefaultOptions(viewType)).map((opt, i) => {
                                        const isActive = chartConfig[opt.key]
                                        return (
                                            <button
                                                key={i}
                                                className={cn(
                                                    "flex flex-col items-center justify-center p-3 border transition-all duration-200 group relative overflow-hidden",
                                                    isActive
                                                        ? "bg-slate-900 border-emerald-500/50 shadow-[0_4px_0_0_#059669] translate-y-[-2px]"
                                                        : "bg-slate-950 border-slate-800 hover:bg-slate-900 hover:border-slate-700 hover:shadow-sm"
                                                )}
                                                onClick={() => toggleConfig(opt.key)}
                                                style={{ borderRadius: 0 }}
                                            >
                                                <div className={cn(
                                                    "mb-2 p-1.5 rounded-full ring-1 ring-inset transition-colors",
                                                    isActive ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30" : "bg-slate-900 text-slate-500 ring-slate-800"
                                                )}>
                                                    <span className="text-xs">{opt.icon}</span>
                                                </div>
                                                <span className={cn(
                                                    "text-[9px] font-bold uppercase tracking-wider text-center leading-tight",
                                                    isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
                                                )}>
                                                    {opt.label}
                                                </span>

                                                {/* Active Indicator */}
                                                {isActive && (
                                                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Font Size & Table Toggle */}
                            <div className="space-y-3 pt-2 border-t border-slate-800">
                                <div className="space-y-2">
                                    <div className="p-2 bg-slate-900 border border-slate-800 flex items-center gap-2 mb-2" style={{ borderLeft: '4px solid #64748b' }}>
                                        <Type className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Axis Font Size</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {FONT_SIZES.map(fs => (
                                            <button key={fs.label} onClick={() => setFontSize(fs.value)} className={cn("flex-1 py-1.5 text-[10px] font-bold border transition-all", fontSize === fs.value ? "bg-blue-600 text-white border-blue-600" : "border-slate-700 text-slate-400 hover:bg-slate-800")} style={{ borderRadius: 0 }}>
                                                {fs.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowTable(!showTable)}
                                    className={cn("w-full p-2.5 text-[10px] font-bold border transition-all flex items-center justify-center gap-1.5", showTable ? "bg-blue-600 text-white border-blue-600 shadow-[2px_2px_0_0_#1e3a8a] translate-x-[-1px] translate-y-[-1px]" : "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white")}
                                    style={{ borderRadius: 0 }}
                                >
                                    {showTable ? 'Hide Data Table' : 'Show Data Table'}
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* CENTER: Chart Canvas */}
                    <div className={cn("flex-1 flex flex-col min-w-0", bg)}>
                        {/* Time Range Bar & Toolbar */}
                        <div className={cn("h-12 border-b flex items-center justify-between px-4 shrink-0 gap-4", bgSub, borderColor)}>

                            {/* LEFT: Time Range Selector */}
                            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mask-linear-fade">
                                <div className={cn("flex items-center p-1 rounded-lg border", darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200")}>
                                    {TIME_RANGES.map(range => {
                                        const isActive = timeRange === range.toLowerCase()
                                        return (
                                            <button
                                                key={range}
                                                onClick={() => setTimeRange(range.toLowerCase())}
                                                className={cn(
                                                    "px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all rounded-none whitespace-nowrap border",
                                                    isActive
                                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                                        : "bg-transparent border-transparent text-slate-500 hover:bg-slate-100 hover:text-emerald-700"
                                                )}
                                            >
                                                {range}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* RIGHT: Actions */}
                            <div className="flex items-center gap-2 pl-4 border-l border-slate-800/50">
                                <button
                                    onClick={() => setIsCompareMode(!isCompareMode)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all",
                                        isCompareMode
                                            ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                                            : "border-transparent text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                                    )}
                                >
                                    <ArrowRightLeft className="w-3.5 h-3.5" />
                                    <span>Compare</span>
                                </button>

                                <div className="h-4 w-px bg-slate-800/50 mx-1" />

                                <button
                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                                    title="Export Deep Dive Report (PDF)"
                                    onClick={handleExport}
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                                <button
                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                                    title="Share View"
                                    onClick={() => alert("Link copied to clipboard!")}
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className={cn(
                            "flex-1 min-h-0 p-6 relative",
                            darkMode
                                ? "bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]"
                                : "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]"
                        )} style={{
                            backgroundColor: darkMode ? '#020617' : '#f8fafc'
                        }}>
                            {/* Inner Canvas with Card Effect */}
                            <div className={cn(
                                "w-full h-full border relative overflow-hidden shadow-sm",
                                darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white/60 border-slate-200"
                            )} style={{ borderRadius: 0 }}>
                                <div className="absolute inset-0 pointer-events-none" style={{ background: darkMode ? 'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, transparent 100%)' : 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)' }} />
                                {showTable ? (
                                    <div className={cn("w-full h-full overflow-auto border", borderColor)} style={{ borderRadius: 0 }}>
                                        <table className="w-full text-sm text-left">
                                            <thead className={cn("text-[10px] uppercase font-black sticky top-0 z-10", darkMode ? "bg-slate-900 text-slate-400" : "bg-slate-100 text-slate-500")}>
                                                <tr>
                                                    <th className="px-4 py-2.5 border-b" style={{ borderColor: darkMode ? '#334155' : '#e2e8f0' }}>Period</th>
                                                    <th className="px-4 py-2.5 text-right border-b" style={{ borderColor: darkMode ? '#334155' : '#e2e8f0' }}>Primary</th>
                                                    <th className="px-4 py-2.5 text-right border-b" style={{ borderColor: darkMode ? '#334155' : '#e2e8f0' }}>Secondary</th>
                                                    <th className="px-4 py-2.5 text-right border-b" style={{ borderColor: darkMode ? '#334155' : '#e2e8f0' }}>Tertiary</th>
                                                </tr>
                                            </thead>
                                            <tbody className={cn("divide-y", darkMode ? "divide-slate-800" : "divide-slate-100")}>
                                                {data.map((row, i) => (
                                                    <tr key={i} className={cn("transition-colors", darkMode ? "text-slate-300 hover:bg-slate-900" : "text-slate-600 hover:bg-slate-50")}>
                                                        <td className="px-4 py-2 font-mono text-xs">{row.name}</td>
                                                        <td className="px-4 py-2 text-right font-mono font-bold text-xs">{formatNumber(row.value)}</td>
                                                        <td className="px-4 py-2 text-right font-mono text-xs">{formatNumber(row.secondary)}</td>
                                                        <td className="px-4 py-2 text-right font-mono text-xs text-slate-400">{formatNumber(row.tertiary)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="w-full h-full p-2">
                                        {renderChart()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dynamic Type-Specific KPI Cards */}
                        <div className="px-4 pb-4 grid grid-cols-4 gap-3 shrink-0">
                            {getTypeSpecificKPIs(viewType, data).map((kpi, i) => (
                                <KPICard
                                    key={`${viewType} -${i} `}
                                    title={kpi.title}
                                    value={kpi.value}
                                    variant={kpi.variant as any}
                                    trend={kpi.trend}
                                />
                            ))}
                        </div>
                    </div>


                    {/* RIGHT SIDEBAR: AI Chat Panel */}
                    <div className={cn("w-80 border-l flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.05)] relative z-30", bg, borderColor)}>
                        {/* Header */}
                        <div className={cn("h-16 border-b flex items-center justify-between px-5 shrink-0 backdrop-blur-md", darkMode ? "bg-slate-950/50 border-slate-800" : "bg-white/50 border-slate-200")}>
                            <div className="flex items-center gap-2">
                                <div className={cn("p-1.5 rounded-md", darkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600")}>
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className={cn("text-xs font-black uppercase tracking-widest", darkMode ? "text-slate-200" : "text-slate-800")}>AI Assistant</h3>
                                    <p className={cn("text-[9px] font-medium", darkMode ? "text-slate-500" : "text-slate-400")}>Powered by OrionIQ™</p>
                                </div>
                            </div>
                            <div className={cn("w-2 h-2 rounded-full animate-pulse", darkMode ? "bg-emerald-500" : "bg-emerald-400")} />
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                                    <div className={cn("w-7 h-7 rounded-sm flex items-center justify-center shrink-0", msg.role === 'ai' ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600")}>
                                        {msg.role === 'ai' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className={cn("flex flex-col max-w-[85%]", msg.role === 'user' ? "items-end" : "items-start")}>
                                        <div className={cn(
                                            "px-3 py-2 text-xs leading-relaxed rounded-md",
                                            msg.role === 'ai'
                                                ? (darkMode ? "bg-slate-800 text-slate-300 border border-slate-700" : "bg-white text-slate-700 border border-slate-200 shadow-sm")
                                                : "bg-blue-600 text-white"
                                        )}>
                                            {msg.content}
                                        </div>
                                        {msg.recommendations && (
                                            <div className="mt-2 space-y-2 w-full">
                                                {msg.recommendations.map((rec, i) => (
                                                    <div key={i} className={cn(
                                                        "flex items-center justify-between gap-2 p-2 rounded-md border text-[10px]",
                                                        darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
                                                    )}>
                                                        <span className="flex-1 leading-snug" dangerouslySetInnerHTML={{ __html: rec.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                                        <button
                                                            onClick={() => handleUseRecommendation(rec.replace(/\*\*/g, ''))}
                                                            className={cn(
                                                                "px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-colors shrink-0",
                                                                darkMode ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                            )}
                                                        >
                                                            Use
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <span className={cn("text-[9px] mt-1", darkMode ? "text-slate-600" : "text-slate-400")}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-7 h-7 rounded-sm bg-blue-600 flex items-center justify-center shrink-0">
                                        <Bot className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className={cn("px-3 py-2 rounded-md border flex gap-1 items-center", darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className={cn("p-4 border-t", darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200")}>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask AI to analyze or modify..."
                                    className={cn(
                                        "w-full pl-3 pr-10 py-2.5 text-xs bg-transparent border rounded-md focus:outline-none focus:ring-1 transition-all",
                                        darkMode
                                            ? "border-slate-700 text-slate-200 focus:border-blue-500 placeholder:text-slate-600"
                                            : "border-slate-300 text-slate-800 focus:border-blue-500 bg-white placeholder:text-slate-400"
                                    )}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className={cn(
                                        "absolute right-1 top-1 bottom-1 aspect-square flex items-center justify-center rounded-sm transition-colors",
                                        input.trim()
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : (darkMode ? "bg-slate-800 text-slate-600" : "bg-slate-200 text-slate-400")
                                    )}
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
