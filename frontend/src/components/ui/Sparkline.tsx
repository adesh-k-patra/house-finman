import { ResponsiveContainer, AreaChart, Area } from 'recharts'

interface SparklineProps {
    data: number[]
    color?: string
    height?: number
}

export function Sparkline({ data, color = '#3b82f6', height = 32 }: SparklineProps) {
    const formattedData = data.map((v, i) => ({ v, i }))

    return (
        <div style={{ height }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData}>
                    <defs>
                        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="v"
                        stroke={color}
                        strokeWidth={1.5}
                        fill={`url(#grad-${color.replace('#', '')})`}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
