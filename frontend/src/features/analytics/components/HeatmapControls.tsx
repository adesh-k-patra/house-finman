import { Layers, Map as MapIcon, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui'

export function HeatmapControls() {
    return (
        <div className="absolute top-4 right-4 z-[500] flex flex-col gap-2">
            <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 flex flex-col gap-1 w-40">
                <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Layers</span>
                <button className="flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-l-2 border-purple-500">
                    <Layers className="w-3.5 h-3.5" /> Heatmap
                </button>
                <button className="flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-l-2 border-transparent">
                    <MapIcon className="w-3.5 h-3.5" /> Pins
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 w-40">
                <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 block mb-1">Density</span>
                <div className="px-2 pb-2">
                    <input type="range" className="w-full h-1 bg-slate-200 rounded-none appearance-none cursor-pointer accent-slate-900" />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                        <span>Low</span>
                        <span>High</span>
                    </div>
                </div>
            </div>

            <Button size="sm" variant="outline" className="bg-white dark:bg-slate-900 shadow-md border-slate-200 dark:border-slate-800 rounded-none w-40 justify-center gap-2 text-xs">
                <RotateCcw className="w-3 h-3" /> Reset View
            </Button>
        </div>
    )
}
