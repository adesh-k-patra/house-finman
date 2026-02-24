import { useState } from 'react'
import {
    Download, FileSpreadsheet, FileText, File, Calendar,
    CheckCircle, X, ChevronDown, Mail, Clock
} from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

interface ExportModalProps {
    isOpen: boolean
    onClose: () => void
    surveyTitle?: string
}

export function ExportModal({ isOpen, onClose, surveyTitle = "Survey Data" }: ExportModalProps) {
    if (!isOpen) return null

    const [format, setFormat] = useState<'csv' | 'xlsx' | 'pdf'>('csv')
    const [scope, setScope] = useState<'all' | 'filtered'>('all')
    const [schedule, setSchedule] = useState<'now' | 'daily' | 'weekly'>('now')
    const [isExporting, setIsExporting] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleExport = () => {
        setIsExporting(true)
        // Simulate API call
        setTimeout(() => {
            setIsExporting(false)
            setSuccess(true)
            setTimeout(() => {
                setSuccess(false)
                onClose()
            }, 1000)
        }, 1500)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg shadow-2xl animate-scale-in border border-slate-200 dark:border-slate-700 font-sans">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <Download className="w-4 h-4 text-slate-500" /> Export Data
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Export responses for "{surveyTitle}"</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Format Selection */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Export Format</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'csv', label: 'CSV', icon: FileText, desc: 'Raw data' },
                                { id: 'xlsx', label: 'Excel', icon: FileSpreadsheet, desc: 'Formatted' },
                                { id: 'pdf', label: 'PDF', icon: File, desc: 'Report' },
                            ].map((fmt) => (
                                <button
                                    key={fmt.id}
                                    onClick={() => setFormat(fmt.id as any)}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-3 border hover:shadow-md transition-all text-center gap-2 rounded-none",
                                        format === fmt.id
                                            ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                                    )}
                                >
                                    <fmt.icon className={cn("w-6 h-6", format === fmt.id ? "text-blue-400 dark:text-blue-600" : "text-slate-400")} />
                                    <div>
                                        <div className="font-bold text-sm">{fmt.label}</div>
                                        <div className={cn("text-xs opacity-70", format === fmt.id ? "text-slate-300 dark:text-slate-500" : "text-slate-400")}>{fmt.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Data Scope */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Data Range</label>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 rounded-none">
                            <button
                                onClick={() => setScope('all')}
                                className={cn(
                                    "flex-1 py-1.5 text-sm font-bold transition-all rounded-none",
                                    scope === 'all'
                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                All Responses (1,240)
                            </button>
                            <button
                                onClick={() => setScope('filtered')}
                                className={cn(
                                    "flex-1 py-1.5 text-sm font-bold transition-all rounded-none",
                                    scope === 'filtered'
                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                Current View (Filtered)
                            </button>
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" defaultChecked className="rounded-none border-slate-300" />
                                Include Metadata (IP, Browser)
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded-none border-slate-300" />
                                Mask PII Data
                            </label>
                        </div>
                    </div>

                    {/* Scheduling */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Frequency</label>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="schedule"
                                        checked={schedule === 'now'}
                                        onChange={() => setSchedule('now')}
                                        className="text-slate-900 focus:ring-slate-900"
                                    />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Export Now</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="schedule"
                                        checked={schedule === 'daily'}
                                        onChange={() => setSchedule('daily')}
                                        className="text-slate-900 focus:ring-slate-900"
                                    />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">One-time Schedule</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="schedule"
                                        checked={schedule === 'weekly'}
                                        onChange={() => setSchedule('weekly')}
                                        className="text-slate-900 focus:ring-slate-900"
                                    />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Recurring (Weekly)</span>
                                </label>
                            </div>

                            {schedule !== 'now' && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none animate-fade-in">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Deliver to Email(s)</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Enter email addresses..."
                                                    defaultValue="admin@housefin.in"
                                                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs text-slate-500 mb-1">Date</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input type="date" className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs text-slate-500 mb-1">Time</label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input type="time" defaultValue="09:00" className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="rounded-none uppercase font-bold text-xs h-10 w-24">Cancel</Button>
                    <Button
                        variant="primary"
                        onClick={handleExport}
                        disabled={isExporting}
                        className={cn(
                            "rounded-none uppercase font-bold text-xs h-10 min-w-[140px] shadow-lg transition-all",
                            success ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" : "bg-slate-900 hover:bg-slate-800 shadow-slate-500/20"
                        )}
                        leftIcon={success ? <CheckCircle className="w-4 h-4" /> : isExporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
                    >
                        {success ? 'Started!' : isExporting ? 'Processing...' : schedule === 'now' ? 'Download File' : 'Schedule Job'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
