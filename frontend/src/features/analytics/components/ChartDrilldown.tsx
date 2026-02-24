import { X, PieChart, Users } from 'lucide-react'
import { Card } from '@/components/ui'

// B.46 Graph Drilldown
export function ChartDrilldownModal({ isOpen, onClose, dataPoint }: any) {
    if (!isOpen || !dataPoint) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="w-[800px] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in flex flex-col max-h-[80vh]">

                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                    <div>
                        <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-purple-600" />
                            Drilldown: {dataPoint.name}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">Analyzing {dataPoint.value} responses</p>
                    </div>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-slate-900" /></button>
                </div>

                <div className="p-6 overflow-y-auto grid grid-cols-2 gap-6">
                    <Card className="p-4 rounded-none border-slate-200">
                        <h4 className="font-bold text-xs uppercase text-slate-400 mb-4">By Source</h4>
                        <div className="space-y-2">
                            {['Facebook', 'Direct', 'Referral', 'Google'].map(src => (
                                <div key={src} className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{src}</span>
                                    <div className="w-32 h-2 bg-slate-100 relative">
                                        <div className="absolute inset-y-0 left-0 bg-slate-800" style={{ width: `${Math.random() * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-4 rounded-none border-slate-200">
                        <h4 className="font-bold text-xs uppercase text-slate-400 mb-4">Top Profiles</h4>
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">U{i}</div>
                                    <div className="flex-1">
                                        <div className="h-2 w-20 bg-slate-200 mb-1" />
                                        <div className="h-1.5 w-12 bg-slate-100" />
                                    </div>
                                    <button className="text-[10px] font-bold uppercase text-purple-600 border border-purple-200 px-2 py-0.5 hover:bg-purple-50">View</button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
