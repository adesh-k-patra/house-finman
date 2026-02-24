
import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui'

interface StringInputModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (value: string) => void
    title: string
    label: string
    placeholder?: string
}

export function StringInputModal({ isOpen, onClose, onSave, title, label, placeholder }: StringInputModalProps) {
    if (!isOpen) return null

    const [value, setValue] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (value.trim()) {
            onSave(value.trim())
            setValue('')
            onClose()
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-[200] animate-fade-in" onClick={onClose} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white dark:bg-slate-900 rounded-sm shadow-xl z-[201] animate-fade-in border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-500" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
                        <input
                            autoFocus
                            type="text"
                            className="input w-full"
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary" disabled={!value.trim()}>Add</Button>
                    </div>
                </form>
            </div>
        </>
    )
}
