import { useState } from 'react'
import Papa from 'papaparse'
import {
    Upload,
    ArrowRight,
    CheckCircle2,
    X,
    Database,
    Loader2
} from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

// Schema Fields to map to
const REQUIRED_FIELDS = [
    { key: 'firstName', label: 'First Name', required: true },
    { key: 'lastName', label: 'Last Name', required: true },
    { key: 'phone', label: 'Phone', required: true },
    { key: 'email', label: 'Email', required: false },
    { key: 'source', label: 'Source', required: true },
    { key: 'estimatedLoan', label: 'Requested Amount', required: false },
]

interface LeadImportWizardProps {
    isOpen: boolean
    onClose: () => void
    onImport: (leads: any[]) => void
}

export function LeadImportWizard({ isOpen, onClose, onImport }: LeadImportWizardProps) {
    const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'importing' | 'success'>('upload')
    const [csvHeaders, setCsvHeaders] = useState<string[]>([])
    const [csvData, setCsvData] = useState<any[]>([])
    const [mapping, setMapping] = useState<Record<string, string>>({})

    // Upload Handler
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.meta.fields) {
                    setCsvHeaders(results.meta.fields)
                    setCsvData(results.data)
                    // Auto-map if names match
                    const autoMap: Record<string, string> = {}
                    results.meta.fields.forEach(header => {
                        const normalized = header.toLowerCase().replace(/[^a-z]/g, '')
                        const found = REQUIRED_FIELDS.find(f => f.key.toLowerCase() === normalized)
                        if (found) autoMap[found.key] = header
                    })
                    setMapping(autoMap)
                    setStep('mapping')
                }
            },
            error: (err) => {
                console.error(err)
            }
        })
    }

    // Mapping Check
    const isMappingComplete = REQUIRED_FIELDS.filter(f => f.required).every(f => mapping[f.key])

    // Final Import
    const handleImport = async () => {
        setStep('importing')

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        const importedLeads = csvData.map(row => {
            const lead: any = {}
            Object.entries(mapping).forEach(([schemaKey, csvHeader]) => {
                lead[schemaKey] = row[csvHeader]
            })
            // Defaults
            lead.status = 'new'
            lead.createdAt = new Date().toISOString()
            lead.id = Math.random().toString(36).substr(2, 9)
            return lead
        })

        onImport(importedLeads)
        setStep('success')
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className={cn(
                "relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]",
                "animate-in fade-in zoom-in-95 duration-200"
            )}>
                {/* Header */}
                <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Database className="w-5 h-5 text-primary-500" /> Import Leads
                        </h2>
                        <p className="text-xs text-slate-500">
                            {step === 'upload' && 'Upload your CSV file'}
                            {step === 'mapping' && 'Map CSV columns to Lead fields'}
                            {step === 'preview' && 'Review data before importing'}
                            {step === 'success' && 'Import complete!'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* STEP 1: UPLOAD */}
                    {step === 'upload' && (
                        <div className="h-64 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative group cursor-pointer">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                Click or Drag CSV file here
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Max file size 5MB
                            </p>
                        </div>
                    )}

                    {/* STEP 2: MAPPING */}
                    {step === 'mapping' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 mb-2 font-semibold text-xs text-slate-500 uppercase tracking-wider">
                                <div>System Field</div>
                                <div>CSV Column</div>
                            </div>
                            {REQUIRED_FIELDS.map((field) => (
                                <div key={field.key} className="grid grid-cols-2 gap-4 items-center p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                                    <div className="flex items-center gap-2">
                                        <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", field.required ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" : "bg-slate-200 text-slate-600")}>
                                            {field.required ? 'REQ' : 'OPT'}
                                        </span>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{field.label}</span>
                                    </div>
                                    <select
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm p-1.5 focus:ring-2 focus:ring-primary-500"
                                        value={mapping[field.key] || ''}
                                        onChange={(e) => setMapping({ ...mapping, [field.key]: e.target.value })}
                                    >
                                        <option value="">Select column...</option>
                                        {csvHeaders.map(h => (
                                            <option key={h} value={h}>{h}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* STEP 3: PREVIEW */}
                    {step === 'preview' && (
                        <div className="overflow-x-auto border border-slate-200 dark:border-white/10 rounded-lg">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-white/5 text-xs uppercase text-slate-500 font-semibold">
                                    <tr>
                                        {REQUIRED_FIELDS.map(f => (
                                            <th key={f.key} className="px-4 py-3">{f.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {csvData.slice(0, 5).map((row, i) => (
                                        <tr key={i} className="bg-white dark:bg-slate-900">
                                            {REQUIRED_FIELDS.map(f => (
                                                <td key={f.key} className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                    {row[mapping[f.key]] || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="text-xs text-slate-500 mt-2 p-2 text-center">
                                Showing 5 of {csvData.length} rows
                            </p>
                        </div>
                    )}

                    {/* STEP: IMPORTING */}
                    {step === 'importing' && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Importing Leads...</h3>
                            <p className="text-slate-500">Processing {csvData.length} records</p>
                        </div>
                    )}

                    {/* STEP: SUCCESS */}
                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full mb-4">
                                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Import Successful!</h3>
                            <p className="text-slate-500 mb-6">Successfully imported {csvData.length} leads.</p>
                            <Button variant="primary" onClick={() => { onClose(); setStep('upload'); }}>
                                Done
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step !== 'importing' && step !== 'success' && (
                    <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex justify-end gap-3">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        {step === 'mapping' && (
                            <Button
                                variant="primary"
                                disabled={!isMappingComplete}
                                onClick={() => setStep('preview')}
                                rightIcon={<ArrowRight className="w-4 h-4" />}
                            >
                                Preview
                            </Button>
                        )}
                        {step === 'preview' && (
                            <Button
                                variant="primary"
                                onClick={handleImport}
                                rightIcon={<CheckCircle2 className="w-4 h-4" />}
                            >
                                Import {csvData.length} Leads
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
