
import { useState } from 'react'
import { FileText, User, DollarSign, Calendar, Sparkles, CheckCircle, ArrowRight, Bot } from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'

interface CreateInvoiceModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (invoice: any) => void
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Invoice Details', description: 'Customer & Loan Info.' },
    { id: 2, label: 'Line Items', description: 'Services & Fees.' },
    { id: 3, label: 'AI Review', description: 'Enhance & Generate.' }
]

export function CreateInvoiceModal({ isOpen, onClose, onSave }: CreateInvoiceModalProps) {
    const [step, setStep] = useState(1)
    const [isGenerating, setIsGenerating] = useState(false)
    const [showAnimation, setShowAnimation] = useState(false)

    const [formData, setFormData] = useState({
        customer: '',
        loanId: '',
        type: 'processing_fee',
        amount: '',
        dueDate: '',
        description: '',
        aiPrompt: ''
    })

    const handleClose = () => {
        setStep(1)
        setShowAnimation(false)
        onClose()
    }

    const handleGenerate = async () => {
        setIsGenerating(true)

        // Simulate AI "Thinking" and generation
        await new Promise(resolve => setTimeout(resolve, 2000))

        setIsGenerating(false)
        setShowAnimation(true)

        // Success Animation Duration
        await new Promise(resolve => setTimeout(resolve, 1500))

        const newInvoice = {
            ...formData,
            id: `INV-FM-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            amount: Number(formData.amount),
            status: 'pending',
            createdAt: new Date().toISOString()
        }

        onSave(newInvoice)

        // Navigate to the new invoice (mock route)
        // onClose will be called by parent often, but we want to simulate navigation
        handleClose()
        // navigate(`/finance/invoices/${newInvoice.id}`) // Uncomment if route exists
        // For now, simpler handling via onSave which might refresh list
    }

    const renderStep1 = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Customer Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            required
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium transition-all"
                            placeholder="e.g. Rahul Sharma"
                            value={formData.customer}
                            onChange={e => setFormData({ ...formData, customer: e.target.value })}
                            autoFocus={step === 1}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Loan Reference ID <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            required
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium transition-all"
                            placeholder="e.g. HL-2026-00123"
                            value={formData.loanId}
                            onChange={e => setFormData({ ...formData, loanId: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Due Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            required
                            type="date"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium transition-all"
                            value={formData.dueDate}
                            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Invoice Type</label>
                    <div className="relative">
                        <select
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium appearance-none"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="processing_fee">Processing Fee</option>
                            <option value="insurance_premium">Insurance Premium</option>
                            <option value="documentation_fee">Documentation Fee</option>
                            <option value="valuation_fee">Valuation Fee</option>
                            <option value="other">Other</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amount (₹) <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            required
                            type="number"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium transition-all"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            autoFocus={step === 2}
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Item Description</label>
                <textarea
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium min-h-[100px] resize-none"
                    placeholder="Details about this charge..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="space-y-6 animate-fade-in">
            {showAnimation ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                        <CheckCircle className="w-20 h-20 text-green-500 relative z-10 animate-scale-in" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Invoice Generated!</h3>
                        <p className="text-slate-500">Redirecting to invoice view...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/30 p-6 rounded-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[50px] rounded-full pointer-events-none" />

                        <h4 className="flex items-center gap-2 text-primary-700 dark:text-primary-300 font-bold uppercase tracking-wide text-sm mb-4">
                            <Sparkles className="w-4 h-4" /> AI Enhancement
                        </h4>

                        <div className="space-y-3 relative z-10">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Custom Instructions (Optional)</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Bot className="absolute left-3 top-3 w-4 h-4 text-primary-400" />
                                    <textarea
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-primary-200 dark:border-primary-800/30 rounded-none focus:outline-none focus:border-primary-500 text-sm min-h-[80px]"
                                        placeholder="e.g., 'Add a polite note about late fees', 'Format for corporate client', 'Apply discount code'"
                                        value={formData.aiPrompt}
                                        onChange={e => setFormData({ ...formData, aiPrompt: e.target.value })}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-slate-400">
                                AI will optimize the description and formatting based on your prompt.
                            </p>
                        </div>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 p-6 rounded-none bg-slate-50 dark:bg-slate-900/50">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Summary Preview</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Customer:</span>
                                <span className="font-medium text-slate-900 dark:text-white">{formData.customer || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Amount:</span>
                                <span className="font-bold text-slate-900 dark:text-white text-lg">₹{Number(formData.amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Type:</span>
                                <span className="font-medium text-slate-900 dark:text-white capitalize">{formData.type.replace('_', ' ')}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={handleClose}
            title="New Invoice"
            subtitle="Financial Document"
            steps={STEPS}
            currentStep={step}
            onStepClick={(id) => !showAnimation && setStep(Number(id))}
            contentTitle={step === 1 ? 'Client Details' : step === 2 ? 'Line Items' : 'Review & Generate'}
            showBackButton={step > 1 && !showAnimation}
            onBack={() => setStep(step - 1)}
            footer={
                !showAnimation && (
                    <>
                        {step < 3 ? (
                            <Button variant="primary" className="rounded-none px-8" onClick={() => setStep(step + 1)} rightIcon={<ArrowRight className="w-4 h-4" />} disabled={step === 1 && (!formData.customer || !formData.loanId)}>
                                Next Step
                            </Button>
                        ) : (
                            <div className="flex gap-3">
                                <Button variant="secondary" className="rounded-none px-6" onClick={() => setStep(step - 1)}>
                                    Back
                                </Button>
                                <Button
                                    variant="primary"
                                    className="rounded-none px-8 bg-gradient-to-r from-primary-600 to-indigo-600 border-none hover:from-primary-700 hover:to-indigo-700 shadow-lg shadow-primary-500/20"
                                    isLoading={isGenerating}
                                    onClick={handleGenerate}
                                    leftIcon={<Sparkles className="w-4 h-4" />}
                                >
                                    Generate Invoice
                                </Button>
                            </div>
                        )}
                    </>
                )
            }
        >
            {step === 1 ? renderStep1() : step === 2 ? renderStep2() : renderStep3()}
        </WizardModal>
    )
}
