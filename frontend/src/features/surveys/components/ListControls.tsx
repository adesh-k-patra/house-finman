import { useState, useEffect } from 'react'
import { Wifi, WifiOff, Refreshcw, CloudOff, Layout, CheckSquare, GripVertical } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'

// B.43 Offline Manager
export function OfflineManager() {
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [pendingSyncs, setPendingSyncs] = useState<any[]>([])

    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    return (
        <div className="fixed bottom-4 left-4 z-[100]">
            {!isOnline && (
                <div className="bg-amber-500 text-white px-4 py-2 shadow-lg flex items-center gap-3 animate-pulse">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">You are offline. Responses will sync when online.</span>
                </div>
            )}
            {isOnline && pendingSyncs.length > 0 && (
                <div className="bg-blue-600 text-white px-4 py-2 shadow-lg flex items-center gap-3">
                    <Refreshcw className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-wider">Syncing {pendingSyncs.length} items...</span>
                </div>
            )}
        </div>
    )
}

// B.45 Column Chooser
export function ColumnChooser({ columns, visibleColumns, onChange }: any) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <Button variant="outline" className="rounded-none gap-2" onClick={() => setIsOpen(!isOpen)}>
                <Layout className="w-4 h-4 text-slate-400" /> Columns
            </Button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 z-20 animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase text-slate-500">Visible Columns</span>
                        <button onClick={() => onChange(columns.map((c: any) => c.id))} className="text-[10px] text-purple-600 font-bold hover:underline">Reset</button>
                    </div>
                    <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                        {columns.map((col: any) => (
                            <label key={col.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group">
                                <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-500 cursor-move" />
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns.includes(col.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) onChange([...visibleColumns, col.id])
                                            else onChange(visibleColumns.filter((id: string) => id !== col.id))
                                        }}
                                        className="peer sr-only"
                                    />
                                    <div className="w-4 h-4 border-2 border-slate-300 peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-colors" />
                                    <CheckSquare className="w-3 h-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{col.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
