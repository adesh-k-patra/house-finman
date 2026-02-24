import { useState } from 'react'
import { Users, ArrowRight, AlertTriangle, Check, X } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'

interface Lead {
    id: string
    name: string
    email: string
    phone: string
    source: string
    score: number
}

export function LeadMergeModal({
    isOpen,
    onClose,
    duplicates = []
}: {
    isOpen: boolean;
    onClose: () => void;
    duplicates: Lead[]
}) {
    const [primaryId, setPrimaryId] = useState<string | null>(duplicates[0]?.id || null)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="w-[900px] h-[600px] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col rounded-none animate-scale-in">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Users className="w-6 h-6 text-purple-600" />
                            Merge Duplicate Leads
                        </h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Select the primary record to retain. Other records will be archived.</p>
                    </div>
                    <Button variant="ghost" onClick={onClose} className="rounded-none"><X className="w-5 h-5" /></Button>
                </div>

                {/* Compare Grid */}
                <div className="flex-1 overflow-x-auto p-6">
                    <div className="grid grid-cols-3 gap-0 border border-slate-200 dark:border-slate-800">
                        {/* Headers */}
                        <div className="col-span-1 border-r border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950">
                            <span className="text-xs font-bold uppercase text-slate-400">Field</span>
                        </div>
                        {duplicates.map(lead => (
                            <div
                                key={lead.id}
                                className={`
                                    col-span-1 p-4 border-r border-slate-100 dark:border-slate-800 relative
                                    ${primaryId === lead.id ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-white dark:bg-slate-900'}
                                `}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-mono text-slate-400">ID: {lead.id}</span>
                                    {primaryId === lead.id && <Badge variant="high-intent" className="rounded-none">Primary</Badge>}
                                </div>
                                <Button
                                    size="sm"
                                    variant={primaryId === lead.id ? "primary" : "outline"}
                                    onClick={() => setPrimaryId(lead.id)}
                                    className="w-full rounded-none gap-2"
                                >
                                    {primaryId === lead.id ? <Check className="w-4 h-4" /> : 'Select as Primary'}
                                </Button>
                            </div>
                        ))}

                        {/* Row: Name */}
                        <div className="col-span-1 border-t border-r border-slate-100 dark:border-slate-800 p-4 font-bold text-slate-500 text-sm">Name</div>
                        {duplicates.map(lead => (
                            <div key={`name-${lead.id}`} className="col-span-1 border-t border-r border-slate-100 dark:border-slate-800 p-4 text-sm font-medium text-slate-900 dark:text-white">
                                {lead.name}
                            </div>
                        ))}

                        {/* Row: Email */}
                        <div className="col-span-1 border-t border-r border-slate-100 dark:border-slate-800 p-4 font-bold text-slate-500 text-sm">Email</div>
                        {duplicates.map(lead => (
                            <div key={`email-${lead.id}`} className="col-span-1 border-t border-r border-slate-100 dark:border-slate-800 p-4 text-sm font-medium text-slate-900 dark:text-white">
                                {lead.email}
                            </div>
                        ))}

                        {/* Row: Score */}
                        <div className="col-span-1 border-t border-r border-slate-100 dark:border-slate-800 p-4 font-bold text-slate-500 text-sm">Intent Score</div>
                        {duplicates.map(lead => (
                            <div key={`score-${lead.id}`} className="col-span-1 border-t border-r border-slate-100 dark:border-slate-800 p-4 text-sm font-bold">
                                {lead.score}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-bold uppercase text-xs mb-1">Warning</p>
                            <p>Activity history, survey responses, and tasks from non-primary leads will be moved to the Primary Lead. The original duplicate records will be archived.</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end gap-3">
                    <Button variant="ghost" className="rounded-none hover:bg-slate-200 dark:hover:bg-slate-800" onClick={onClose}>Cancel</Button>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-none gap-2 px-6">
                        Merge Records <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
