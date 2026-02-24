import { X, Check } from 'lucide-react'
import { Button } from '@/components/ui'

export function TemplatePreviewModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in">
            <div className="w-[90vw] h-[90vh] bg-white dark:bg-slate-900 shadow-2xl flex border border-slate-200 dark:border-slate-800 animate-scale-in">

                {/* Left Sidebar: Info */}
                <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 mb-2 inline-block">Recommended</span>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Home Loan Eligibility Checker</h2>
                        <p className="text-sm text-slate-500 mt-2">Perfect for pre-qualifying leads before site visits. increased conversion by 15%.</p>
                    </div>

                    <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                        <div>
                            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Structure</h4>
                            <ul className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-400" /> 12 Questions</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-400" /> 3 Logic Rules</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-400" /> Document Upload</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Integrations</h4>
                            <div className="flex gap-2 flex-wrap">
                                <span className="text-xs border border-slate-200 px-2 py-1 bg-white">CRM Sync</span>
                                <span className="text-xs border border-slate-200 px-2 py-1 bg-white">Email</span>
                                <span className="text-xs border border-slate-200 px-2 py-1 bg-white">HDFC Push</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-200 dark:border-slate-800">
                        <Button className="w-full bg-slate-900 text-white rounded-none py-6 text-sm gap-2">
                            <Check className="w-4 h-4" /> Use Template
                        </Button>
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-500">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex-1 overflow-y-auto p-12 flex justify-center">
                        <div className="w-full max-w-2xl bg-white shadow-xl min-h-[800px] border border-slate-200 p-12">
                            {/* Mock Form */}
                            <div className="space-y-8 opacity-70 pointer-events-none grayscale">
                                <div className="h-4 w-3/4 bg-slate-200 mb-8" />
                                <div className="space-y-4">
                                    <div className="h-4 w-1/2 bg-slate-200" />
                                    <div className="h-10 w-full border border-slate-200" />
                                </div>
                                <div className="space-y-4">
                                    <div className="h-4 w-1/3 bg-slate-200" />
                                    <div className="h-24 w-full border border-slate-200" />
                                </div>
                                <div className="h-10 w-32 bg-slate-900 mt-8" />
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="px-6 py-3 bg-slate-900/80 text-white font-bold backdrop-blur-sm uppercase tracking-widest text-sm border border-white/20">
                                    Preview Mode
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
