
import { Download, FileText, Check } from 'lucide-react'
import { Button, WizardModal } from '@/components/ui'
import { formatCurrency } from '@/utils'
import { useState } from 'react'

interface CommissionDownloadModalProps {
    isOpen: boolean
    onClose: () => void
    commissionId: string
    amount: number
}

export function CommissionDownloadModal({ isOpen, onClose, commissionId, amount }: CommissionDownloadModalProps) {
    const [step, setStep] = useState(1)

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Download Breakdown"
            subtitle={`Commission #${commissionId}`}
            sidebarWidth="w-[280px]"
            currentStep={step}
            steps={[
                { id: 1, label: 'Format Selection', description: 'PDF or Excel' },
                { id: 2, label: 'Include Details', description: 'Tax & deductions' },
                { id: 3, label: 'Download', description: 'Ready to export' },
            ]}
            contentTitle={step === 1 ? "Select Format" : step === 2 ? "Customize Report" : "Ready to Download"}
            footer={
                <div className="flex justify-end gap-2 w-full">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button
                        variant="primary"
                        leftIcon={step === 3 ? <Download className="w-4 h-4" /> : undefined}
                        onClick={() => {
                            if (step < 3) setStep(step + 1)
                            else {
                                alert('Downloaded successfully!')
                                onClose()
                            }
                        }}
                    >
                        {step === 3 ? 'Download Now' : 'Next Step'}
                    </Button>
                </div>
            }
        >
            <div className="space-y-6 animate-fade-in text-sm">
                {step === 1 && (
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex flex-col items-center justify-center p-6 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
                            <FileText className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mb-3" />
                            <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600">PDF Report</span>
                            <span className="text-xs text-slate-500 mt-1">Best for printing</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-6 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group">
                            <Download className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 mb-3" />
                            <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">Excel Export</span>
                            <span className="text-xs text-slate-500 mt-1">Best for analysis</span>
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-3">
                        {['Include TDS Breakdown', 'Include Loan Details', 'Show Lead Information', 'Include Bank Adjustments'].map((item) => (
                            <label key={item} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-sm flex items-center justify-center text-white bg-blue-600 border-blue-600">
                                    <Check className="w-3 h-3" />
                                </div>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{item}</span>
                            </label>
                        ))}
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <Download className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Report Generated</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mb-6">Your commission breakdown for <span className="font-bold font-mono text-slate-900 dark:text-white">{commissionId}</span> amounting to <span className="font-bold text-emerald-600">{formatCurrency(amount)}</span> is ready.</p>
                    </div>
                )}
            </div>
        </WizardModal>
    )
}
