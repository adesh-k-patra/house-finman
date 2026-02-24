
import { useState } from 'react'
import { Button, WizardModal, WizardStep } from '@/components/ui'
import { Save, TrendingUp, User, Building2, DollarSign, Calendar } from 'lucide-react'

interface CreateOpportunityModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (opportunity: any) => void
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Opportunity Details', description: 'Enter deal information.' }
]

export function CreateOpportunityModal({ isOpen, onClose, onSave }: CreateOpportunityModalProps) {
    if (!isOpen) return null

    const [formData, setFormData] = useState({
        name: '',
        customerName: '',
        propertyName: '',
        loanAmount: '',
        stage: 'qualification',
        probability: '20',
        expectedClose: ''
    })

    const handleSubmit = () => {
        onSave({
            ...formData,
            id: `opp_${Date.now()}`,
            loanAmount: Number(formData.loanAmount),
            probability: Number(formData.probability),
            assignedTo: 'You',
            lastActivity: new Date().toISOString()
        })
        onClose()
    }

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Opportunity"
            subtitle="New Deal"
            steps={STEPS}
            currentStep={1}
            contentTitle="Deal Information"
            children={
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Opportunity Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 transition-colors placeholder:text-slate-400 font-medium"
                                placeholder="e.g. Green Valley - Rahul"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Customer Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 transition-colors placeholder:text-slate-400 font-medium"
                                placeholder="e.g. Rahul Sharma"
                                value={formData.customerName}
                                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Property Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 transition-colors placeholder:text-slate-400 font-medium"
                                    placeholder="e.g. Green Valley Apt"
                                    value={formData.propertyName}
                                    onChange={e => setFormData({ ...formData, propertyName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Loan Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 transition-colors placeholder:text-slate-400 font-medium"
                                    placeholder="5000000"
                                    value={formData.loanAmount}
                                    onChange={e => setFormData({ ...formData, loanAmount: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Probability (%)
                            </label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 transition-colors placeholder:text-slate-400 font-medium"
                                min="0" max="100"
                                value={formData.probability}
                                onChange={e => setFormData({ ...formData, probability: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Expected Close <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 transition-colors placeholder:text-slate-400 font-medium"
                                    value={formData.expectedClose}
                                    onChange={e => setFormData({ ...formData, expectedClose: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }
            footer={
                <>
                    <Button variant="secondary" className="rounded-none mr-2" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" className="rounded-none" onClick={handleSubmit} leftIcon={<Save className="w-4 h-4" />}>
                        Create Opportunity
                    </Button>
                </>
            }
        />
    )
}
