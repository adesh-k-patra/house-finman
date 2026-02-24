import { useState, useEffect, useCallback } from 'react'
import { Save, Check, RotateCw } from 'lucide-react'

export function useAutoSave(data: any, saveFunction: (data: any) => Promise<void>, interval = 5000) {
    const [status, setStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved')
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    const save = useCallback(async () => {
        if (status === 'saving') return
        setStatus('saving')
        try {
            await saveFunction(data)
            setStatus('saved')
            setLastSaved(new Date())
        } catch (error) {
            setStatus('error')
        }
    }, [data, saveFunction, status])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (status === 'unsaved') {
                save()
            }
        }, interval)
        return () => clearTimeout(timer)
    }, [data, interval, save, status])

    // Detect changes (simple shallow compare could be improved)
    useEffect(() => {
        setStatus('unsaved')
    }, [JSON.stringify(data)])

    return { status, lastSaved, save }
}

export function AutoSaveIndicator({ status, lastSaved }: { status: string, lastSaved: Date | null }) {
    return (
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            {status === 'saving' && (
                <>
                    <RotateCw className="w-3 h-3 animate-spin" />
                    <span>Saving...</span>
                </>
            )}
            {status === 'saved' && (
                <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>Saved {lastSaved?.toLocaleTimeString()}</span>
                </>
            )}
            {status === 'unsaved' && (
                <>
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Unsaved Changes</span>
                </>
            )}
            {status === 'error' && <span className="text-red-500">Save Failed</span>}
        </div>
    )
}
