import { TrendingUp, User, PhoneCall, CheckCircle } from 'lucide-react'
import { Card, Badge, Button } from '@/components/ui'
import { cn } from '@/utils'

// B.37 Agent Performance Card
export function AgentPerformanceCard({ agent }: { agent: any }) {
    return (
        <Card className="p-4 rounded-none shadow-sm flex items-center justify-between border-l-4 border-l-purple-600">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm">
                    <User className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">{agent.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><PhoneCall className="w-3 h-3" /> {agent.calls} Calls</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {agent.conversions} Conversions</span>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-2xl font-black text-slate-900">{agent.score}</div>
                <div className="text-[10px] font-bold uppercase text-emerald-600 flex items-center justify-end gap-1">
                    <TrendingUp className="w-3 h-3" /> Top 5%
                </div>
            </div>
        </Card>
    )
}

// B.39 Scoring Badges
export function ScoreBadge({ score }: { score: number }) {
    if (score >= 90) return <Badge className="bg-emerald-600 hover:bg-emerald-700 rounded-none uppercase px-2">High Intent</Badge>
    if (score >= 70) return <Badge className="bg-blue-600 hover:bg-blue-700 rounded-none uppercase px-2">Medium</Badge>
    if (score >= 50) return <Badge className="bg-amber-500 hover:bg-amber-600 rounded-none uppercase px-2">Low</Badge>
    return <Badge className="bg-slate-400 hover:bg-slate-500 rounded-none uppercase px-2">Cold</Badge>
}

// B.77 SLA Warning
export function SLAWarning({ hoursRemaining }: { hoursRemaining: number }) {
    if (hoursRemaining > 4) return null

    return (
        <div className={cn(
            "flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wide border-l-4 animation-pulse",
            hoursRemaining <= 1 ? "bg-red-50 border-red-500 text-red-700" : "bg-amber-50 border-amber-500 text-amber-700"
        )}>
            ⚠️ SLA Breach in {hoursRemaining}h
        </div>
    )
}

// B.59 Tooltip Helper
export function InfoTooltip({ text }: { text: string }) {
    return (
        <div className="group relative inline-block ml-1">
            <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold cursor-help">?</div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white text-xs p-2 rounded shadow-xl hidden group-hover:block z-50">
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900"></div>
            </div>
        </div>
    )
}
