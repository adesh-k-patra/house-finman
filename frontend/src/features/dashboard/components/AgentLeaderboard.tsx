import { Trophy, TrendingUp, Star, PhoneCall } from 'lucide-react'
import { Card } from '@/components/ui'

const agents = [
    { id: 1, name: 'Priya Sharma', score: 98, calls: 45, conversions: 12, trend: '+5%' },
    { id: 2, name: 'Rahul Verma', score: 92, calls: 38, conversions: 8, trend: '+2%' },
    { id: 3, name: 'Amit Patel', score: 88, calls: 42, conversions: 7, trend: '-1%' },
]

export function AgentLeaderboard() {
    return (
        <Card className="rounded-none shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <h3 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Top Performers
                </h3>
                <span className="text-[10px] uppercase font-bold text-slate-400">This Week</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {agents.map((agent, index) => (
                    <div key={agent.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                        <div className={`
                            w-8 h-8 flex items-center justify-center font-black text-white text-sm
                            ${index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-slate-300' : 'bg-orange-300'}
                        `}>
                            {index + 1}
                        </div>

                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{agent.name}</h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><PhoneCall className="w-3 h-3" /> {agent.calls}</span>
                                <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {agent.conversions} Deals</span>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-xl font-black text-slate-900 dark:text-white">{agent.score}</div>
                            <div className="text-[10px] font-bold text-emerald-500 flex items-center justify-end gap-0.5">
                                <TrendingUp className="w-3 h-3" /> {agent.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-2 text-center text-[10px] font-bold uppercase text-slate-400 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                Updated 1 hour ago
            </div>
        </Card>
    )
}
