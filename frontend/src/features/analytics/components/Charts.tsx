import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend } from 'recharts'
import { Card } from '@/components/ui'
import { cn } from '@/utils'

const theme = {
    colors: {
        primary: '#7c3aed', // violet-600
        secondary: '#0ea5e9', // sky-500
        success: '#10b981', // emerald-500
        warning: '#f59e0b', // amber-500
        danger: '#ef4444', // red-500
        slate: '#64748b', // slate-500
    }
}

interface ChartProps {
    data: any[]
    height?: number
    className?: string
    showGrid?: boolean
}

export function TrendChart({ data, height = 300, className, showGrid = true }: ChartProps) {
    return (
        <div className={cn("w-full", className)} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.colors.primary} stopOpacity={0.1} />
                            <stop offset="95%" stopColor={theme.colors.primary} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />}
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: theme.colors.slate, textTransform: 'uppercase', fontWeight: 700 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: theme.colors.slate }}
                        dx={-10}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: 0, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}
                        labelStyle={{ fontSize: 10, textTransform: 'uppercase', color: '#64748b', marginBottom: 4 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={theme.colors.primary}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export function ComparisonChart({ data, height = 300, className }: ChartProps) {
    return (
        <div className={cn("w-full", className)} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: theme.colors.slate }} dy={10} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} />
                    <Legend iconType="square" wrapperStyle={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 700, paddingTop: 20 }} />
                    <Bar dataKey="thisMonth" name="This Month" fill={theme.colors.primary} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="lastMonth" name="Last Month" fill={theme.colors.slate} radius={[2, 2, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
