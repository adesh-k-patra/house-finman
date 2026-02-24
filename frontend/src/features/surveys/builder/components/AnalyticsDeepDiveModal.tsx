import { useState, useRef, useEffect } from 'react'
import { AnalyticsCard, AnalyticsViewType } from '../contexts/SurveyBuilderContext'
import { cn } from '@/utils'
import {
    BarChart3, TrendingUp, Table2, Map, Filter,
    PieChart, Sparkles, Trash2, X, Plus, Check,
    LineChart, Activity, RefreshCw,
    MessageSquare, Send, Bot,
    Pin, Save, MoreHorizontal, Maximize2, AreaChart, Lightbulb, LayoutGrid,
    ArrowRight, Info, Edit2
} from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart as RechartsAreaChart, Area, PieChart as RechartsPieChart, Pie, Cell,
    LineChart as RechartsLineChart, Line
} from 'recharts'

// ============ TYPES ============

interface AnalyticsDeepDiveModalProps {
    card: AnalyticsCard
    onClose: () => void
    onSave: (updates: Partial<AnalyticsCard>) => void
    onDelete: () => void
}

interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    recommendations?: string[]
}

// 8 Visualization Options Configuration
const VIEW_TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; desc: string }> = {
    chart: { icon: BarChart3, label: 'Bar Chart', color: 'text-blue-600', desc: 'Compare categorical data' },
    graph: { icon: LineChart, label: 'Line Graph', color: 'text-purple-600', desc: 'Track changes over time' },
    comparison: { icon: AreaChart, label: 'Area Chart', color: 'text-indigo-600', desc: 'Volume trends over time' },
    table: { icon: Table2, label: 'Table', color: 'text-slate-600', desc: 'Detailed data view' },
    heatmap: { icon: Map, label: 'Heatmap', color: 'text-orange-600', desc: 'Intensity and density' },
    funnel: { icon: Filter, label: 'Funnel', color: 'text-green-600', desc: 'Conversion stages' },
    trend: { icon: TrendingUp, label: 'Trend', color: 'text-cyan-600', desc: 'Directional patterns' },
    distribution: { icon: PieChart, label: 'Distribution', color: 'text-pink-600', desc: 'Part-to-whole analysis' },
}

// Mock Data
const MOCK_DATA = [
    { name: 'Mon', value: 400, uv: 240, amt: 2400 },
    { name: 'Tue', value: 300, uv: 139, amt: 2210 },
    { name: 'Wed', value: 200, uv: 980, amt: 2290 },
    { name: 'Thu', value: 278, uv: 390, amt: 2000 },
    { name: 'Fri', value: 189, uv: 480, amt: 2181 },
    { name: 'Sat', value: 239, uv: 380, amt: 2500 },
    { name: 'Sun', value: 349, uv: 430, amt: 2100 },
]

const PIE_DATA = [
    { name: 'Group A', value: 400, color: '#3b82f6' },
    { name: 'Group B', value: 300, color: '#8b5cf6' },
    { name: 'Group C', value: 300, color: '#10b981' },
    { name: 'Group D', value: 200, color: '#f59e0b' },
]

// ============ MAIN COMPONENT ============

export function AnalyticsDeepDiveModal({ card, onClose, onSave, onDelete }: AnalyticsDeepDiveModalProps) {
    // State
    const [title, setTitle] = useState("Intent by Timeline")
    const [viewType, setViewType] = useState<string>(card.viewType || 'chart')
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isPinned, setIsPinned] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    // Initialize Chat
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: '1',
                    role: 'assistant',
                    content: `I've analyzed the data for "**${card.title}**". Here are 5 recommendations to improve this visualization:`,
                    timestamp: new Date(),
                    recommendations: [
                        "Switch to a **Funnel Chart** to see drop-off rates clearly.",
                        "Add a **Trend Line** to forecast next month's performance.",
                        "Filter out incomplete responses to improve accuracy.",
                        "Compare this data with **User Demographics** for deeper insights.",
                        "Highlight the top 3 performing segments automatically."
                    ]
                }
            ])
        }
    }, [])

    const handleSend = () => {
        if (!input.trim()) return

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        // Simulate AI Response
        setTimeout(() => {
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `I've updated the comparison view based on your request. The data now includes a year-over-year growth metric. Here are 5 more recommendations based on the new data:`,
                timestamp: new Date(),
                recommendations: [
                    "Isolate the **Mobile** segment to see specific behaviors.",
                    "Apply a **Moving Average** to smooth out daily fluctuations.",
                    "Correlate this trend with **Marketing Spend**.",
                    "Annotate the **Peak Drop-off** point.",
                    "Export this specific view as a **CSV** for reporting."
                ]
            }
            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
        }, 1500)
    }

    const handleGenerate = () => {
        setIsGenerating(true)
        setTimeout(() => {
            setIsGenerating(false)
            // Mock simulation of new data/layout
        }, 1500)
    }

    const renderVisualizationPreview = () => {
        const config = VIEW_TYPE_CONFIG[viewType] || VIEW_TYPE_CONFIG['chart']

        if (isGenerating) {
            return (
                <div className="flex flex-col items-center justify-center h-full gap-4 animate-in fade-in">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-sm font-bold text-slate-500 animate-pulse">Generating Optimization...</p>
                </div>
            )
        }

        return (
            <div className="w-full h-full flex flex-col">
                <div className="flex-1 p-6 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        {viewType === 'chart' || viewType === 'bar' ? (
                            <BarChart data={MOCK_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '0px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        ) : viewType === 'graph' || viewType === 'line' || viewType === 'trend' ? (
                            <RechartsLineChart data={MOCK_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '0px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="uv" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} />
                            </RechartsLineChart>
                        ) : viewType === 'comparison' || viewType === 'area' ? (
                            <RechartsAreaChart data={MOCK_DATA}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '0px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#4f46e5" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                            </RechartsAreaChart>
                        ) : viewType === 'distribution' || viewType === 'pie' ? (
                            <RechartsPieChart>
                                <Pie
                                    data={PIE_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {PIE_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '0px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </RechartsPieChart>
                        ) : (
                            // Fallback for Table, Heatmap, Funnel (Simplified visualizers)
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <config.icon className={cn("w-16 h-16 mb-4 opacity-50", config.color.replace('text-', 'text-'))} />
                                <p className="font-bold text-sm">Preview for {config.label}</p>
                                <p className="text-xs max-w-xs text-center mt-2 opacity-70">Detailed {config.label.toLowerCase()} visualization will be rendered with live data.</p>
                            </div>
                        )}
                    </ResponsiveContainer>
                </div>

                {/* AI Derived Insights (Below Preview) */}
                <div className="mt-6 border-t border-slate-100 pt-6 px-6 pb-6">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        AI Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* 1. Key Trend */}
                        <div className="bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                    New Key Trend
                                </h4>
                                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 border border-emerald-100 uppercase tracking-wider">+15%</span>
                            </div>
                            <p className="text-sm font-bold text-slate-800 leading-snug mb-2">Steady increase in user intent over the last 7 days.</p>
                            <div className="text-xs text-slate-400 font-medium flex items-center gap-1 group-hover:text-blue-600 transition-colors cursor-pointer">
                                Click to expand details... <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                            </div>
                        </div>

                        {/* 2. Prediction */}
                        <div className="bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                    <Activity className="w-3 h-3 text-blue-500" />
                                    Prediction: Next Week
                                </h4>
                                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 border border-blue-100 uppercase tracking-wider">500 est.</span>
                            </div>
                            <p className="text-sm font-bold text-slate-800 leading-snug mb-2">Projected intent volume based on current velocity.</p>
                            <div className="text-xs text-slate-400 font-medium flex items-center gap-1 group-hover:text-blue-600 transition-colors cursor-pointer">
                                Click to expand details... <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                            </div>
                        </div>

                        {/* 3. Anomaly Detected */}
                        <div className="bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-50 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                    <Info className="w-3 h-3 text-red-500" />
                                    Anomaly Detected
                                </h4>
                                <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-0.5 border border-red-100 uppercase tracking-wider">-22%</span>
                            </div>
                            <p className="text-sm font-bold text-slate-800 leading-snug mb-2">Significant drop in 'Purchase' intent on Tuesday.</p>
                            <div className="text-xs text-slate-400 font-medium flex items-center gap-1 group-hover:text-blue-600 transition-colors cursor-pointer">
                                Click to expand details... <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                            </div>
                        </div>

                        {/* 4. Segment Opportunity */}
                        <div className="bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-50 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                    <PieChart className="w-3 h-3 text-purple-500" />
                                    Segment Opportunity
                                </h4>
                                <span className="bg-purple-50 text-purple-600 text-[10px] font-black px-2 py-0.5 border border-purple-100 uppercase tracking-wider">68% Mobile</span>
                            </div>
                            <p className="text-sm font-bold text-slate-800 leading-snug mb-2">Mobile users are showing higher intent conversion.</p>
                            <div className="text-xs text-slate-400 font-medium flex items-center gap-1 group-hover:text-blue-600 transition-colors cursor-pointer">
                                Click to expand details... <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                            </div>
                        </div>

                        {/* 5. Actionable Item */}
                        <div className="bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group col-span-1 md:col-span-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-50 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-50/50 to-transparent rounded-tr-full -ml-12 -mb-12 pointer-events-none" />
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                    <Lightbulb className="w-3 h-3 text-amber-500" />
                                    Actionable Item
                                </h4>
                                <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-2 py-0.5 border border-amber-100 uppercase tracking-wider">High Impact</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-sm font-bold text-slate-800 leading-snug flex-1">Launch targeted mobile campaign to capitalize on segment growth.</p>
                                <button className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-wide transition-colors shadow-sm shadow-amber-200">
                                    Take Action
                                </button>
                            </div>
                            <div className="text-xs text-slate-400 font-medium flex items-center gap-1 group-hover:text-blue-600 transition-colors cursor-pointer mt-2">
                                Click to expand details... <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                            </div>
                        </div>
                    </div>
                    {/* Ask AI Input Field in the footer area of insights */}
                    <div className="mt-6">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Ask AI about these insights..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all rounded-none placeholder:text-slate-400"
                            />
                            <Sparkles className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white animate-in fade-in duration-200 font-sans">
            {/* Dark Header (Hypothesis Deep Dive Style) */}
            <div className="h-16 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between px-6 flex-shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.2)] relative z-50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-none bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-500">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-white font-black text-lg leading-tight tracking-wide uppercase">Analytics Deep Dive</h2>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mt-0.5">
                            <span className="font-mono text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded-none">{card.id.substring(0, 8)}</span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                Live Connection
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsPinned(!isPinned)}
                        className={cn(
                            "p-2.5 rounded-none transition-all duration-200 border border-transparent",
                            isPinned
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : "hover:bg-slate-800 text-slate-400 hover:text-white"
                        )}
                        title={isPinned ? "Unpin" : "Pin to Dashboard"}
                    >
                        <Pin className={cn("w-4 h-4", isPinned && "fill-current")} />
                    </button>
                    <div className="w-px h-6 bg-slate-800 mx-2" />
                    <button onClick={onClose} className="p-2.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-none transition-all border border-transparent hover:border-red-500/30">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Split View Content */}
            <div className="flex-1 flex overflow-hidden bg-slate-100">
                {/* LEFT SIDE: Chat Interface (30%) */}
                <div className="w-[420px] flex-shrink-0 border-r border-slate-200 flex flex-col bg-slate-50 relative z-20 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.05)]">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm relative z-10">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-purple-50 rounded-none border border-purple-100">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">AI Insight Assistant</h3>
                                <p className="text-[10px] text-slate-500 font-medium">Powered by OrionIQ™</p>
                            </div>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-none tracking-wider uppercase">Online</span>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {messages.map((msg) => (
                            <div key={msg.id} className={cn("flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300", msg.role === 'user' ? 'items-end' : 'items-start')}>
                                <div className={cn(
                                    "max-w-[90%] p-4 rounded-none text-sm shadow-sm relative group border",
                                    msg.role === 'user'
                                        ? 'bg-blue-600 text-white border-blue-700 shadow-blue-900/10'
                                        : 'bg-white text-slate-700 border-slate-200'
                                )}>
                                    {/* Role Icon (Assistant only) */}
                                    {msg.role === 'assistant' && (
                                        <div className="absolute -left-3 -top-3 w-6 h-6 bg-white border border-slate-200 rounded-none flex items-center justify-center shadow-sm z-10">
                                            <Bot className="w-3.5 h-3.5 text-purple-600" />
                                        </div>
                                    )}

                                    <div className="whitespace-pre-wrap leading-relaxed relative z-0">{msg.content}</div>

                                    {/* Recommendations List */}
                                    {msg.recommendations && (
                                        <div className="mt-4 space-y-2 relative z-0">
                                            {msg.recommendations.map((rec, i) => (
                                                <div key={i} className="flex items-start gap-2.5 p-3 bg-slate-50 text-slate-700 text-xs border border-slate-100 cursor-pointer hover:bg-blue-50/50 hover:border-blue-200 hover:shadow-sm transition-all group/rec">
                                                    <div className="mt-0.5 p-1 bg-amber-50 rounded-none shrink-0 group-hover/rec:bg-amber-100 transition-colors">
                                                        <Lightbulb className="w-3 h-3 text-amber-500 group-hover/rec:text-amber-600" />
                                                    </div>
                                                    <span className="leading-snug group-hover/rec:text-slate-900 transition-colors flex-1" dangerouslySetInnerHTML={{ __html: rec.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover/rec:text-blue-400 opacity-0 group-hover/rec:opacity-100 transition-all transform -translate-x-2 group-hover/rec:translate-x-0" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-2 px-1 font-medium bg-slate-100/50 py-0.5 rounded-none">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start w-full px-2">
                                <div className="bg-white px-4 py-3 rounded-none border border-slate-200 shadow-sm flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Processing</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-30">
                        <div className="relative shadow-sm group focus-within:shadow-md transition-shadow">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask AI to modify chart, analyze data..."
                                className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all rounded-none placeholder:text-slate-400"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-blue-600 text-white rounded-none hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-slate-400 mt-3 font-medium flex items-center justify-center gap-1.5 opacity-0 group-focus-within:opacity-100 transition-opacity">
                            <Bot className="w-3 h-3" /> AI can make mistakes. Please verify important information.
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE: Preview & Config (70%) */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Background Grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                        backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}></div>

                    {/* Top Bar: Title & Actions */}
                    <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-30 shadow-sm">
                        <div className="flex-1 mr-12">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-0.5">Visualization Title</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-2 py-1 -ml-2 text-2xl font-black text-slate-900 bg-transparent border-b-2 border-transparent group-hover:border-slate-200 focus:border-blue-500 focus:ring-0 placeholder-slate-300 tracking-tight transition-all"
                                />
                                <Edit2 className="w-4 h-4 text-slate-300 absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-none">
                                <RefreshCw className="w-3 h-3 text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Data updated 2m ago</span>
                            </div>
                            <div className="h-4 w-px bg-slate-200" />
                            <div className="flex bg-slate-100 p-1 rounded-none border border-slate-200">
                                <button title="Full Screen" className="p-2 bg-white shadow-sm rounded-none text-blue-600 border border-slate-200"><Maximize2 className="w-4 h-4" /></button>
                                <button title="Mobile View" className="p-2 hover:bg-white/50 text-slate-400 rounded-none transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                            </div>
                            <div className="h-8 w-px bg-slate-200 mx-2" />
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-none transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 uppercase tracking-wide group"
                            >
                                <RefreshCw className={cn("w-4 h-4 transition-transform", isGenerating && "animate-spin")} />
                                {isGenerating ? 'Optimizing...' : 'Generate Re-Design'}
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 pb-32">
                        <div className="flex gap-8 h-full max-w-7xl mx-auto">
                            {/* Visualizations List (Left Column of Right Panel) */}
                            <div className="w-72 flex-shrink-0 flex flex-col gap-6">
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <LayoutGrid className="w-4 h-4 text-slate-400" />
                                        Visualization Type
                                    </h3>
                                    <div className="space-y-2">
                                        {Object.entries(VIEW_TYPE_CONFIG).map(([key, config]) => {
                                            const isActive = viewType === key
                                            const Icon = config.icon
                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => setViewType(key)}
                                                    className={cn(
                                                        "w-full flex items-start gap-4 p-3 rounded-none text-left transition-all group relative border border-transparent",
                                                        isActive
                                                            ? "bg-white shadow-md border-slate-200 ring-1 ring-black/5"
                                                            : "hover:bg-white hover:border-slate-200 hover:shadow-sm"
                                                    )}
                                                >
                                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 transition-all" />}
                                                    <div className={cn("p-2 rounded-none transition-colors shrink-0", isActive ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400 group-hover:text-slate-600")}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <span className={cn("block text-sm font-bold mb-0.5", isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-800")}>{config.label}</span>
                                                        <span className="text-[10px] text-slate-400 leading-tight block">{config.desc}</span>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Preview Area & Insights */}
                            <div className="flex-1 flex flex-col min-h-0">
                                <div className="bg-white border border-slate-200 shadow-sm p-1 rounded-none flex-1 flex flex-col min-h-[500px]">
                                    {renderVisualizationPreview()}
                                </div>

                                <div className="mt-6 flex justify-between items-center bg-white p-4 border border-slate-200 rounded-none shadow-sm sticky bottom-0 z-20">
                                    <button onClick={onDelete} className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-wide hover:bg-red-50 px-4 py-2 rounded-none">
                                        <Trash2 className="w-3.5 h-3.5" /> Delete Visualization
                                    </button>
                                    <div className="flex gap-4">
                                        <button onClick={onClose} className="px-6 py-2.5 text-slate-500 hover:text-slate-800 font-bold uppercase text-xs tracking-wide transition-colors border border-transparent hover:border-slate-200">
                                            Cancel
                                        </button>
                                        <button onClick={() => {
                                            onSave({ title, viewType: viewType as any })
                                            onClose()
                                        }} className="flex items-center gap-2 px-8 py-2.5 bg-[#0F172A] text-white hover:bg-slate-800 font-bold uppercase text-xs tracking-wide transition-all shadow-md hover:shadow-lg rounded-none hover:-translate-y-0.5">
                                            <Save className="w-3.5 h-3.5" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
