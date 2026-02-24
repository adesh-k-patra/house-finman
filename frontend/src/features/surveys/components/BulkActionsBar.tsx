import { Trash2, Copy, Archive, PauseCircle, PlayCircle, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui'

interface BulkActionsBarProps {
    selectedCount: number
    onClearSelection: () => void
    onAction: (action: string) => void
}

export function BulkActionsBar({ selectedCount, onClearSelection, onAction }: BulkActionsBarProps) {
    if (selectedCount === 0) return null

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-slate-900 text-white p-2 pl-6 shadow-2xl animate-in slide-in-from-bottom-4 border-t-4 border-purple-500">
            <div className="flex items-center gap-2 mr-4">
                <span className="font-black text-xl text-purple-400">{selectedCount}</span>
                <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Selected</span>
            </div>

            <div className="h-8 w-px bg-slate-700" />

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-purple-300 hover:bg-slate-800 rounded-none gap-2 font-bold uppercase text-[10px] tracking-wide"
                    onClick={() => onAction('duplicate')}
                >
                    <Copy className="w-3.5 h-3.5" /> Duplicate
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-amber-300 hover:bg-slate-800 rounded-none gap-2 font-bold uppercase text-[10px] tracking-wide"
                    onClick={() => onAction('pause')}
                >
                    <PauseCircle className="w-3.5 h-3.5" /> Pause
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-slate-300 hover:bg-slate-800 rounded-none gap-2 font-bold uppercase text-[10px] tracking-wide"
                    onClick={() => onAction('archive')}
                >
                    <Archive className="w-3.5 h-3.5" /> Archive
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-none gap-2 font-bold uppercase text-[10px] tracking-wide"
                    onClick={() => onAction('delete')}
                >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
            </div>

            <div className="h-8 w-px bg-slate-700 ml-2" />

            <button
                onClick={onClearSelection}
                className="px-4 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wide"
            >
                Clear
            </button>
        </div>
    )
}
