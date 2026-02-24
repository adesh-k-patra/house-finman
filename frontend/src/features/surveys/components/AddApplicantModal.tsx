
import { useState } from 'react'
import { ChevronRight, ChevronLeft, Trash2, Wand2, CheckCircle2, Plus } from 'lucide-react'
import { cn } from '@/utils'
import { Applicant } from '../builder/contexts/SurveyPageContext'
import { WizardModal, Button } from '@/components/ui'

interface AddApplicantModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (applicant: Partial<Applicant>) => void
}

const TOKENS = {
    input: "w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 text-base shadow-sm",
    label: "block text-xs font-black uppercase tracking-widest text-slate-500 mb-2",
}

export function AddApplicantModal({ isOpen, onClose, onAdd }: AddApplicantModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<Partial<Applicant> & { customFieldsList: { key: string, value: string }[] }>({
        name: '', email: '', phone: '', location: '',
        jobTitle: '', company: '',
        budget: '', interests: [], tags: [],
        customFieldsList: [{ key: '', value: '' }]
    })

    const steps = [
        { id: 1, label: 'Basic Info', description: 'Name, Email & Location' },
        { id: 2, label: 'Professional', description: 'Job Title & Company' },
        { id: 3, label: 'Targeting', description: 'Budget & Interests' },
        { id: 4, label: 'Custom Data', description: 'Metadata & Tags' },
    ]

    const updateField = (field: keyof Applicant, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleCustomFieldChange = (index: number, field: 'key' | 'value', value: string) => {
        const newList = [...formData.customFieldsList]
        newList[index][field] = value
        setFormData(prev => ({ ...prev, customFieldsList: newList }))
    }

    const addCustomField = () => {
        setFormData(prev => ({ ...prev, customFieldsList: [...prev.customFieldsList, { key: '', value: '' }] }))
    }

    const removeCustomField = (index: number) => {
        setFormData(prev => ({ ...prev, customFieldsList: prev.customFieldsList.filter((_, i) => i !== index) }))
    }

    const handleSubmit = () => {
        const customFields = formData.customFieldsList.reduce((acc, curr) => {
            if (curr.key) acc[curr.key] = curr.value
            return acc
        }, {} as Record<string, string>)

        onAdd({ ...formData, customFields, status: 'new', dateAdded: new Date().toISOString() })
        onClose()
    }

    const mockEnrich = () => {
        if (step === 1) {
            setFormData(prev => ({ ...prev, name: 'Alex Morgan', email: 'alex.m@example.com', phone: '+1 (555) 123-4567', location: 'San Francisco, CA' }))
        } else if (step === 2) {
            setFormData(prev => ({ ...prev, jobTitle: 'Product Manager', company: 'TechFlow Inc.' }))
        } else if (step === 3) {
            setFormData(prev => ({ ...prev, budget: '$50k - $100k', interests: ['SaaS', 'Fintech', 'AI'] }))
        }
    }

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className={TOKENS.label}>Full Name <span className="text-red-500">*</span></label>
                                <input value={formData.name} onChange={e => updateField('name', e.target.value)} className={TOKENS.input} placeholder="e.g. John Doe" autoFocus />
                            </div>
                            <div>
                                <label className={TOKENS.label}>Email Address <span className="text-red-500">*</span></label>
                                <input value={formData.email} onChange={e => updateField('email', e.target.value)} className={TOKENS.input} placeholder="john@example.com" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className={TOKENS.label}>Phone Number</label>
                                <input value={formData.phone} onChange={e => updateField('phone', e.target.value)} className={TOKENS.input} placeholder="+1 (555) 000-0000" />
                            </div>
                            <div>
                                <label className={TOKENS.label}>Location / City</label>
                                <input value={formData.location} onChange={e => updateField('location', e.target.value)} className={TOKENS.input} placeholder="New York, NY" />
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className={TOKENS.label}>Job Title</label>
                            <input value={formData.jobTitle} onChange={e => updateField('jobTitle', e.target.value)} className={TOKENS.input} placeholder="Senior Developer" autoFocus />
                        </div>
                        <div>
                            <label className={TOKENS.label}>Company Name</label>
                            <input value={formData.company} onChange={e => updateField('company', e.target.value)} className={TOKENS.input} placeholder="Acme Inc." />
                        </div>
                        <div>
                            <label className={TOKENS.label}>LinkedIn Profile URL</label>
                            <input className={TOKENS.input} placeholder="https://linkedin.com/in/..." />
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className={TOKENS.label}>Approx. Budget</label>
                            <div className="relative">
                                <select
                                    value={formData.budget}
                                    onChange={e => updateField('budget', e.target.value)}
                                    className={cn(TOKENS.input, "appearance-none")}
                                >
                                    <option value="">Select Range</option>
                                    <option value="< $10k">Less than $10k</option>
                                    <option value="$10k - $50k">$10k - $50k</option>
                                    <option value="$50k - $100k">$50k - $100k</option>
                                    <option value="$100k+">$100k+</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-slate-400" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className={TOKENS.label}>Interests (Comma separated)</label>
                            <textarea
                                className={cn(TOKENS.input, "h-32 resize-none pt-4")}
                                placeholder="Investment, Real Estate, Technology..."
                                value={Array.isArray(formData.interests) ? formData.interests.join(', ') : ''}
                                onChange={e => updateField('interests', e.target.value.split(',').map(s => s.trim()))}
                            />
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-slate-50 p-8 border border-slate-200">
                            <label className={TOKENS.label}>Custom Key-Value Pairs</label>
                            <div className="space-y-4 mt-6">
                                {formData.customFieldsList.map((field, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <input
                                            value={field.key}
                                            onChange={e => handleCustomFieldChange(idx, 'key', e.target.value)}
                                            className={cn(TOKENS.input, "flex-1")}
                                            placeholder="Key (e.g. Source)"
                                        />
                                        <input
                                            value={field.value}
                                            onChange={e => handleCustomFieldChange(idx, 'value', e.target.value)}
                                            className={cn(TOKENS.input, "flex-1")}
                                            placeholder="Value (e.g. Referral)"
                                        />
                                        <button onClick={() => removeCustomField(idx)} className="w-14 h-14 flex items-center justify-center bg-white border border-red-200 text-red-500 hover:bg-red-50 transition-colors border-l-2">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={addCustomField} className="mt-6 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add Another Field
                            </button>
                        </div>
                    </div>
                )
        }
    }

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Applicant"
            subtitle="Manual Entry"
            steps={steps}
            currentStep={step}
            onStepClick={(id) => setStep(Number(id))}
            contentTitle={steps.find(s => s.id === step)?.label || ''}
            sidebarWidth="w-[350px]"
            maxWidth="max-w-[1400px]"
            fullWidthContent={true}
            contentClassName="p-0"
            footer={
                <div className="flex items-center w-full">
                    {/* Left side actions */}
                    <div>
                        <button
                            onClick={mockEnrich}
                            className="flex items-center gap-2 px-5 py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors text-xs font-black uppercase tracking-widest border border-indigo-100"
                        >
                            <Wand2 className="w-3.5 h-3.5" /> Smart Enrich
                        </button>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        {step > 1 && (
                            <Button
                                variant="secondary"
                                className="rounded-none px-8 py-6 font-bold uppercase tracking-widest text-xs"
                                onClick={() => setStep(s => s - 1)}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                        )}

                        {step < 4 ? (
                            <Button
                                variant="primary"
                                className="rounded-none px-8 py-6 font-bold uppercase tracking-widest text-xs"
                                onClick={() => setStep(s => s + 1)}
                            >
                                Next Step <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                className="rounded-none px-8 py-6 font-bold uppercase tracking-widest text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={handleSubmit}
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Create Applicant
                            </Button>
                        )}
                    </div>
                </div>
            }
        >
            <div className="p-10 h-full overflow-y-auto">
                {renderStepContent()}
            </div>
        </WizardModal>
    )
}
