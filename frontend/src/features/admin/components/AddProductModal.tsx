import { useState } from 'react'
import { Building2, DollarSign, Percent, FileText, ArrowRight, Check } from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'
import { cn } from '@/utils'

interface AddProductModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: '',
        type: 'loan',
        minAmount: '',
        maxAmount: '',
        minTenure: '',
        maxTenure: '',
        baseRate: '',
        processingFee: ''
    })

    const handleNext = () => setStep(prev => prev + 1)
    const handleBack = () => setStep(prev => prev - 1)

    const handleSubmit = () => {
        // Submit logic would go here
        console.log('Product Created:', formData)
        onClose()
    }

    const steps: WizardStep[] = [
        {
            id: 1,
            label: 'Product Basics',
            description: 'Define the core identity of the financial product.'
        },
        {
            id: 2,
            label: 'Financial Parameters',
            description: 'Set limits, rates, and fees.'
        }
    ]

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Product"
            contentTitle={step === 1 ? "Basic Details" : "Financial Configuration"}
            steps={steps}
            currentStep={step}
            onStepClick={(id) => setStep(Number(id))}
        >
            {step === 1 && (
                <div className="space-y-6 animate-fade-in-right">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Product Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                    placeholder="e.g. Super Home Saver"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Product Type</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['Loan', 'Insurance', 'Investment'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFormData(prev => ({ ...prev, type: type.toLowerCase() }))}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 border rounded-none transition-all",
                                            formData.type === type.toLowerCase()
                                                ? "bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500"
                                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                        )}
                                    >
                                        <span className="font-bold">{type}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <Button
                            variant="primary"
                            onClick={handleNext}
                            className="rounded-none px-8"
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-fade-in-right">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Min Amount</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                    placeholder="500000"
                                    value={formData.minAmount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, minAmount: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Max Amount</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                    placeholder="10000000"
                                    value={formData.maxAmount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, maxAmount: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Base Interest Rate (%)</label>
                            <div className="relative">
                                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    step="0.1"
                                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                    placeholder="8.5"
                                    value={formData.baseRate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, baseRate: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Processing Fee (%)</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    step="0.1"
                                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                    placeholder="0.5"
                                    value={formData.processingFee}
                                    onChange={(e) => setFormData(prev => ({ ...prev, processingFee: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between pt-6">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            className="text-slate-500 hover:text-slate-900"
                        >
                            Back
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            className="rounded-none px-8"
                            leftIcon={<Check className="w-4 h-4" />}
                        >
                            Create Product
                        </Button>
                    </div>
                </div>
            )}
        </WizardModal>
    )
}
