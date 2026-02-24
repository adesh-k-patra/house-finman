import { useState } from 'react'
import { Copy, X, Check } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

interface DuplicateSurveyModalProps {
    isOpen: boolean
    onClose: () => void
    originalTitle: string
}

export function DuplicateSurveyModal({ isOpen, onClose, originalTitle }: DuplicateSurveyModalProps) {
    if (!isOpen) return null

    const [newName, setNewName] = useState(`Copy of ${originalTitle}`)
    const [selectedCampaign, setSelectedCampaign] = useState('New Campaign')
    const [options, setOptions] = useState({
        logic: true,
        theme: true,
        resetStats: true
    })

    const handleDuplicate = () => {
        // Logic to API would go here
        alert(`Duplicating to: ${newName}`)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md shadow-2xl animate-scale-in border border-slate-200 dark:border-slate-700">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
                    <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Copy className="w-4 h-4 text-purple-600" /> Duplicate Survey
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">New Survey Name</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Target Campaign</label>
                        <select
                            value={selectedCampaign}
                            onChange={(e) => setSelectedCampaign(e.target.value)}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                            <option>New Campaign</option>
                            <option>Q1 Loan Drive</option>
                            <option>Site Visits Feb</option>
                        </select>
                    </div>

                    <div className="space-y-3 pt-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Copy Options</label>
                        {[
                            { id: 'logic', label: 'Include Branching Logic' },
                            { id: 'theme', label: 'Keep Design Theme' },
                            { id: 'resetStats', label: 'Reset Response Stats (Recommended)' },
                        ].map(opt => (
                            <div
                                key={opt.id}
                                className="flex items-center gap-3 cursor-pointer group"
                                onClick={() => setOptions(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof options] }))}
                            >
                                <div className={cn(
                                    "w-5 h-5 border flex items-center justify-center transition-colors rounded-none",
                                    options[opt.id as keyof typeof options]
                                        ? "bg-purple-600 border-purple-600 text-white"
                                        : "bg-white border-slate-300 dark:bg-slate-800 dark:border-slate-600"
                                )}>
                                    {options[opt.id as keyof typeof options] && <Check className="w-3.5 h-3.5" />}
                                </div>
                                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-purple-600 transition-colors">
                                    {opt.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="rounded-none uppercase font-bold text-xs h-9">Cancel</Button>
                    <Button
                        variant="primary"
                        onClick={handleDuplicate}
                        className="rounded-none uppercase font-bold text-xs h-9 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20"
                        leftIcon={<Copy className="w-3 h-3" />}
                    >
                        Duplicate Survey
                    </Button>
                </div>
            </div>
        </div>
    )
}
