import { useState } from 'react'
import { Button, WizardModal, WizardStep } from '@/components/ui'
import { Lead, LeadSource, sourceConfig } from '@/types'
import { ArrowRight, Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/utils'

interface AddLeadModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (newLead: Partial<Lead>) => void
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Identity', description: 'Who is the lead?' },
    { id: 2, label: 'Requirements', description: 'What form of financing?' }
]

const MOCK_PROPERTIES = [
    'Urban Heights - 3BHK',
    'Green Valley Plots',
    'Skyline Towers',
    'Riverside Villas',
    'Commercial Hub Phase 1',
    'Downtown Lofts'
]

const LOAN_RANGES = [
    '10L - 25L',
    '25L - 50L',
    '50L - 75L',
    '75L - 1Cr',
    '1Cr - 2Cr',
    '2Cr+'
]

export function AddLeadModal({ isOpen, onClose, onAdd }: AddLeadModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<Partial<Lead> & { customProperties: string[] }>({
        name: '',
        phone: '',
        email: '',
        city: '',
        estimatedLoan: 0,
        source: 'web',
        budgetRange: '',
        customProperties: [] // Temp storage for UI
    })

    const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false)

    const handleClose = () => {
        setStep(1)
        onClose()
    }

    const handleSubmit = () => {
        onAdd({
            ...formData,
            interestedProperties: formData.customProperties
        })
        handleClose()
        setFormData({
            name: '',
            phone: '',
            email: '',
            city: '',
            estimatedLoan: 0,
            source: 'web',
            budgetRange: '',
            customProperties: []
        })
    }

    const toggleProperty = (prop: string) => {
        const current = formData.customProperties || []
        if (current.includes(prop)) {
            setFormData({ ...formData, customProperties: current.filter(p => p !== prop) })
        } else {
            setFormData({ ...formData, customProperties: [...current, prop] })
        }
    }

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create New Lead"
            steps={STEPS}
            currentStep={step}
            contentTitle={step === 1 ? 'Contact Information' : 'Requirement Details'}
            footer={
                <>
                    {step === 1 ? (
                        <Button
                            variant="primary"
                            className="rounded-none bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200"
                            onClick={() => setStep(2)}
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            Continue
                        </Button>
                    ) : (
                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                className="rounded-none border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5"
                                onClick={() => setStep(1)}
                            >
                                Back
                            </Button>
                            <Button
                                variant="primary"
                                className="rounded-none bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg shadow-emerald-500/20"
                                onClick={handleSubmit}
                                leftIcon={<Check className="w-4 h-4" />}
                            >
                                Create Lead
                            </Button>
                        </div>
                    )}
                </>
            }
        >
            {step === 1 ? (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="group">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary-500 transition-colors">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Rajesh Kumar"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                                autoFocus
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary-500 transition-colors">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary-500 transition-colors">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="rajesh@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary-500 transition-colors">
                                City / Location
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Mumbai, Bandra West"
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    {/* Source & Range Row */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="group">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary-500 transition-colors">
                                Lead Source
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.source}
                                    onChange={e => setFormData({ ...formData, source: e.target.value as LeadSource })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all font-medium text-slate-900 dark:text-white appearance-none cursor-pointer"
                                >
                                    {Object.entries(sourceConfig).map(([key, config]) => (
                                        <option key={key} value={key}>{config.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary-500 transition-colors">
                                Loan Value Range
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.budgetRange}
                                    onChange={e => setFormData({ ...formData, budgetRange: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all font-medium text-slate-900 dark:text-white appearance-none cursor-pointer"
                                >
                                    <option value="">Select Range</option>
                                    {LOAN_RANGES.map(range => (
                                        <option key={range} value={range}>{range}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Multi-Select Properties */}
                    <div className="group relative">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Marked Properties
                        </label>
                        <div
                            onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
                            className={cn(
                                "w-full min-h-[48px] px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none cursor-pointer flex items-center justify-between transition-all",
                                isPropertyDropdownOpen && "border-primary-500 ring-1 ring-primary-500/50"
                            )}
                        >
                            <div className="flex flex-wrap gap-2">
                                {formData.customProperties && formData.customProperties.length > 0 ? (
                                    formData.customProperties.map(prop => (
                                        <span key={prop} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-sm flex items-center gap-1">
                                            {prop}
                                            <span
                                                className="hover:text-red-500 cursor-pointer"
                                                onClick={(e) => { e.stopPropagation(); toggleProperty(prop) }}
                                            >
                                                <X className="w-3 h-3" />
                                            </span>
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-slate-400 font-medium select-none">Select interested properties...</span>
                                )}
                            </div>
                            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isPropertyDropdownOpen && "rotate-180")} />
                        </div>

                        {/* Dropdown Menu */}
                        {isPropertyDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsPropertyDropdownOpen(false)} />
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl max-h-48 overflow-y-auto z-20 animate-fade-in-down rounded-none">
                                    {MOCK_PROPERTIES.map(prop => {
                                        const isSelected = formData.customProperties?.includes(prop)
                                        return (
                                            <div
                                                key={prop}
                                                onClick={() => toggleProperty(prop)}
                                                className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-colors border-b border-slate-50 dark:border-white/5 last:border-0"
                                            >
                                                <div className={cn(
                                                    "w-4 h-4 border flex items-center justify-center transition-colors",
                                                    isSelected ? "bg-primary-500 border-primary-500 text-white" : "border-slate-300 dark:border-slate-600 text-transparent"
                                                )}>
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                <span className={cn("text-sm font-medium", isSelected ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400")}>
                                                    {prop}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </WizardModal>
    )
}
