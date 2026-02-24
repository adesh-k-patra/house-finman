
import { motion } from 'framer-motion'
import { formatNumber } from '@/utils'
import { cn } from '@/utils'

interface FunnelChartProps {
    data: any[]
    darkMode: boolean
    chartConfig: any
}

export function FunnelChart({ data, darkMode, chartConfig }: FunnelChartProps) {
    // Colors from screenshot
    // Step 1: Violet/Blue
    // Step 2: Lighter Blue
    // Step 3: White/Grey
    // Step 4: Green/Teal

    // We'll use hardcoded data mapping for the visual if the passed data is generic
    // But ideally we map the incoming data.
    // Let's assume data[0]..data[3] correspond to the 4 steps.

    const steps = [
        { label: 'Visits', color: '#6366f1', value: 312000, subtext: '' }, // Indigo
        { label: 'Signups', color: '#818cf8', value: 12480, subtext: '' }, // Light Indigo
        { label: 'Activated', color: '#cbd5e1', value: 5741, subtext: '(46.0%)', isLight: true }, // Slate-300
        { label: 'Paid customers', color: '#2dd4bf', value: 1123, subtext: '(46.0%)' }, // Teal-400
    ]

    // Override with actual data if available and valid
    const displaySteps = steps.map((step, index) => {
        if (data && data[index]) {
            return {
                ...step,
                // If the data has a 'name' use it, otherwise keep default label
                label: data[index].name || step.label,
                value: data[index].value || step.value,
                // Calculate percentage from previous step if possible
                subtext: index > 0 && data[index - 1]?.value
                    ? `(${Math.round((data[index].value / data[index - 1].value) * 100)}%)`
                    : step.subtext
            }
        }
        return step
    })

    const width = 600
    const height = 400
    const blockHeight = 70
    const gap = 15
    const topWidth = 500
    const bottomWidth = 180

    // Calculate widths for each block to create the funnel shape
    // Linear interpolation from topWidth to bottomWidth
    const getWidths = (index: number, total: number) => {
        const progressTop = index / total
        const progressBottom = (index + 1) / total

        const wTop = topWidth - (topWidth - bottomWidth) * progressTop
        const wBottom = topWidth - (topWidth - bottomWidth) * progressBottom

        return { wTop, wBottom }
    }

    return (
        <div className="w-full h-full flex items-center justify-center relative select-none">
            {/* Background Grid Pattern (Subtle) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(${darkMode ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? '#fff' : '#000'} 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <svg width="100%" height="100%" viewBox={`0 0 ${width + 300} ${height}`} preserveAspectRatio="xMidYMid meet" className="overflow-visible">
                <defs>
                    {/* Glossy Gradients */}
                    <linearGradient id="gradStep0" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                    <linearGradient id="gradStep1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a5b4fc" />
                        <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                    <linearGradient id="gradStep2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f8fafc" />
                        <stop offset="100%" stopColor="#cbd5e1" />
                    </linearGradient>
                    <linearGradient id="gradStep3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5eead4" />
                        <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>

                    {/* Top Highlight Gradient (Glassy) */}
                    <linearGradient id="topHighlight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="white" stopOpacity="0.1" />
                    </linearGradient>

                    {/* Drop Shadow */}
                    <filter id="funnelShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor={darkMode ? "#000" : "#64748b"} floodOpacity="0.25" />
                    </filter>

                    <filter id="funnelInnerShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                        <feOffset dx="0" dy="2" result="offsetBlur" />
                        <feComposite in="offsetBlur" in2="SourceAlpha" operator="out" result="inverse" />
                        <feFlood floodColor="black" floodOpacity="0.2" result="color" />
                        <feComposite in="color" in2="inverse" operator="in" result="shadow" />
                        <feComposite in="shadow" in2="SourceGraphic" operator="over" />
                    </filter>
                </defs>

                <g transform={`translate(150, 20)`}>
                    {displaySteps.map((step, index) => {
                        const { wTop, wBottom } = getWidths(index, 4)
                        const xTop = (width - wTop) / 2
                        const xBottom = (width - wBottom) / 2
                        const yTop = index * (blockHeight + gap)
                        const yBottom = yTop + blockHeight

                        // Main Trapezoid Path
                        const path = `
                            M ${xTop} ${yTop} 
                            L ${xTop + wTop} ${yTop} 
                            L ${xBottom + wBottom} ${yBottom} 
                            L ${xBottom} ${yBottom} 
                            Z
                        `

                        // Top Face Path (Simulated 3D top)
                        const depth = 10
                        const topPath = `
                             M ${xTop} ${yTop}
                             L ${xTop + wTop} ${yTop}
                             L ${xTop + wTop} ${yTop + depth}
                             L ${xTop} ${yTop + depth}
                             Z
                        `

                        const centerX = width / 2
                        const centerY = yTop + (blockHeight / 2)

                        // Connector Line Logic (Left side)
                        const lineStartX = xTop - 20
                        const lineStartY = yTop + blockHeight / 2
                        const labelX = lineStartX - 60

                        return (
                            <motion.g
                                key={index}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
                            >
                                {/* Connecting Line Label */}
                                <g opacity={0.6}>
                                    <line x1={lineStartX} y1={lineStartY} x2={xTop} y2={lineStartY} stroke={darkMode ? '#475569' : '#cbd5e1'} strokeWidth={1} />
                                    <text
                                        x={labelX}
                                        y={lineStartY}
                                        textAnchor="end"
                                        dominantBaseline="middle"
                                        className="text-[11px] font-bold uppercase tracking-widest"
                                        fill={darkMode ? '#94a3b8' : '#64748b'}
                                    >
                                        Step {index + 1}
                                    </text>
                                </g>

                                {/* Main Block */}
                                <path
                                    d={path}
                                    fill={`url(#gradStep${index})`}
                                    filter="url(#funnelShadow)"
                                    stroke="white"
                                    strokeWidth={1}
                                    strokeOpacity={0.4}
                                    className="transition-all duration-300 hover:filter-none hover:opacity-90 cursor-pointer"
                                />

                                {/* Top Highlight (Glassy Shine) */}
                                <path
                                    d={path}
                                    fill="url(#topHighlight)"
                                    style={{ mixBlendMode: 'overlay' }}
                                    opacity={0.3}
                                    pointerEvents="none"
                                />

                                {/* Content */}
                                <text
                                    x={centerX}
                                    y={centerY - 8}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="text-sm font-medium tracking-wide"
                                    fill={step.isLight ? '#475569' : '#fff'}
                                    style={{ textShadow: step.isLight ? 'none' : '0 1px 2px rgba(0,0,0,0.2)' }}
                                >
                                    {step.label}
                                </text>
                                <text
                                    x={centerX}
                                    y={centerY + 12}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="text-2xl font-black tracking-tight"
                                    fill={step.isLight ? '#1e293b' : '#fff'}
                                    style={{ textShadow: step.isLight ? 'none' : '0 2px 4px rgba(0,0,0,0.3)' }}
                                >
                                    {formatNumber(step.value)}
                                </text>
                                {step.subtext && (
                                    <text
                                        x={centerX}
                                        y={centerY + 28}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        className="text-[10px] font-bold opacity-80"
                                        fill={step.isLight ? '#64748b' : '#fff'}
                                    >
                                        {step.subtext}
                                    </text>
                                )}

                                {/* Right Side Context Bubbles (Similar to screenshot for Step 2/3) */}
                                {(index === 1 || index === 2) && (
                                    <motion.g
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + (index * 0.1) }}
                                        transform={`translate(${xBottom + wBottom + 40}, ${yTop + blockHeight / 2 - 20})`}
                                    >
                                        <rect width="140" height="40" rx="6" fill={darkMode ? '#1e293b' : '#f8fafc'} filter="url(#funnelShadow)" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                                        {/* Connector nub */}
                                        <path d="M -6 20 L 0 16 L 0 24 Z" fill={darkMode ? '#334155' : '#e2e8f0'} />

                                        <text x="12" y="16" className="text-[10px] font-bold text-slate-500 uppercase">
                                            {index === 1 ? 'Big Drop-off' : 'Winner'}
                                        </text>
                                        <text x="12" y="28" className="text-[10px] font-medium text-slate-700 dark:text-slate-300">
                                            {index === 1 ? 'Needs Activation Fix' : 'Strong Onboarding'}
                                        </text>
                                    </motion.g>
                                )}

                            </motion.g>
                        )
                    })}
                </g>
            </svg>
        </div>
    )
} 
