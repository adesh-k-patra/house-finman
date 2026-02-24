import { useState } from 'react'
import { UploadCloud, File, X, Check } from 'lucide-react'
import { Button } from '@/components/ui'

export function MultiFileUpload() {
    const [files, setFiles] = useState([
        { name: 'salary_slip_nov.pdf', size: '1.2 MB', progress: 100, status: 'complete' },
        { name: 'bank_statement_q3.pdf', size: '4.5 MB', progress: 45, status: 'uploading' },
    ])

    return (
        <div className="space-y-4 max-w-lg">
            {/* Drop Zone */}
            <div className="border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-8 text-center transition-colors hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900 group cursor-pointer relative overflow-hidden">
                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center gap-2 relative z-10">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
                    </div>
                </div>
            </div>

            {/* File List */}
            <div className="space-y-2">
                {files.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative overflow-hidden group">
                        {/* Progress Bar Background */}
                        {file.status === 'uploading' && (
                            <div
                                className="absolute bottom-0 left-0 h-0.5 bg-purple-500 transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                            />
                        )}

                        <div className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500">
                            <File className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
                                <span className="text-[10px] text-slate-400 font-mono">{file.size}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-2">
                                {file.status === 'complete' ? (
                                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                                        <Check className="w-3 h-3" /> Uploaded
                                    </span>
                                ) : (
                                    <span className="text-purple-600 font-bold">Uploading... {file.progress}%</span>
                                )}
                            </div>
                        </div>

                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-none transition-colors">
                            <X className="w-4 h-4 text-slate-400 hover:text-red-500" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
