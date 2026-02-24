import { useState } from 'react'
import { Upload, FileText, Download, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui'

interface ImportExportModalProps {
    isOpen: boolean
    onClose: () => void
    type: 'import' | 'export'
}

export function ImportExportModal({ isOpen, onClose, type }: ImportExportModalProps) {
    const [step, setStep] = useState<'upload' | 'mapping' | 'processing' | 'done'>('upload')

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="w-[600px] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        {type === 'import' ? <Upload className="w-5 h-5 text-purple-600" /> : <Download className="w-5 h-5 text-purple-600" />}
                        {type === 'import' ? 'Import Survey Data' : 'Export Reports'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold">&times;</button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {type === 'import' && step === 'upload' && (
                        <div className="space-y-6 text-center">
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-12 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <FileText className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Drop CSV file here</h3>
                                <p className="text-slate-500 text-sm mt-1">or click to browse</p>
                            </div>
                            <div className="text-xs text-slate-400">
                                Max file size: 10MB. <a href="#" className="underline decoration-purple-500 underline-offset-2 text-slate-600">Download Template</a>
                            </div>
                            <Button className="w-full bg-slate-900 text-white rounded-none" onClick={() => setStep('mapping')}>
                                Process File
                            </Button>
                        </div>
                    )}

                    {type === 'import' && step === 'mapping' && (
                        <div className="space-y-4">
                            <p className="text-sm font-bold text-slate-500 uppercase mb-4">Map Columns</p>
                            {[
                                { csv: 'Full Name', sys: 'name' },
                                { csv: 'Email Address', sys: 'email' },
                                { csv: 'Mobile No', sys: 'phone' },
                            ].map((field, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <div className="flex-1 p-2 bg-slate-50 border border-slate-200 text-sm font-mono text-slate-600 truncate">{field.csv}</div>
                                    <div className="text-slate-400 text-xs font-bold">&rarr;</div>
                                    <div className="flex-1 p-2 bg-purple-50 border border-purple-100 text-sm font-bold text-purple-700">{field.sys}</div>
                                </div>
                            ))}
                            <Button className="w-full mt-4 bg-slate-900 text-white rounded-none" onClick={() => setStep('done')}>
                                confirm Import
                            </Button>
                        </div>
                    )}

                    {type === 'export' && (
                        <div className="grid grid-cols-2 gap-4">
                            {['CSV', 'Excel (XLSX)', 'PDF Summary', 'Raw JSON'].map(fmt => (
                                <button key={fmt} className="p-4 border border-slate-200 hover:border-purple-500 hover:bg-purple-50 group text-left transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-purple-600" />
                                        <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-purple-600 group-hover:bg-purple-600" />
                                    </div>
                                    <span className="font-bold text-slate-700 group-hover:text-purple-900">{fmt}</span>
                                </button>
                            ))}
                            <div className="col-span-2 mt-4">
                                <Button className="w-full bg-slate-900 text-white rounded-none gap-2">
                                    <Download className="w-4 h-4" /> Download
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
