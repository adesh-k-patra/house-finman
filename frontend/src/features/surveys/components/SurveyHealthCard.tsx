import { AlertTriangle, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { Card } from '@/components/ui'

export function SurveyHealthCard() {
    const healthScore = 78
    const status = healthScore > 80 ? 'Excellent' : healthScore > 50 ? 'Fair' : 'Critical'
    const color = healthScore > 80 ? 'text-emerald-500' : healthScore > 50 ? 'text-amber-500' : 'text-red-500'
    const borderColor = healthScore > 80 ? 'border-l-emerald-500' : healthScore > 50 ? 'border-l-amber-500' : 'border-l-red-500'

    return (
        <Card className={`border-l-4 ${borderColor} rounded-none shadow-sm`}>
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase text-xs tracking-wider">
                        <Activity className="w-4 h-4" />
                        Survey Health
                    </h3>
                </div>
                <div className="text-right">
                    <span className={`text-2xl font-black ${color}`}>{healthScore}</span>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Score</span>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Metric 1 */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500">Completion Rate</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">62%</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-red-500 font-bold bg-red-50 px-1.5 py-0.5">
                        <TrendingDown className="w-3 h-3" /> -5%
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500">Avg. Time</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">4m 30s</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-emerald-500 font-bold bg-emerald-50 px-1.5 py-0.5">
                        <TrendingUp className="w-3 h-3" /> OK
                    </div>
                </div>

                {/* Drop-off Alert */}
                <div className="bg-amber-50 border border-amber-200 p-3 flex gap-3 items-start">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-amber-800 uppercase mb-1">High Drop-off Detected</p>
                        <p className="text-xs text-amber-700 leading-tight">
                            40% of users drop off at <span className="font-bold">Q5: Upload Salary Slip</span>. Consider making it optional or moving it to the end.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
                <button className="text-[10px] uppercase font-bold text-blue-600 hover:underline">View Drop-off Analysis</button>
            </div>
        </Card>
    )
}
