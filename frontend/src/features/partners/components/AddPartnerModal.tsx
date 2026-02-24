import { useState } from 'react'
import { Building2, Users, Phone, MapPin, ArrowRight, Check, Mail, Globe, User } from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'
import { cn } from '@/utils'

interface AddPartnerModalProps {
    isOpen: boolean
    onClose: () => void
    onSave?: (partner: any) => void
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Partner Details', description: 'Basic info & type.' },
    { id: 2, label: 'Contact & Agreement', description: 'Address & terms.' }
]

export function AddPartnerModal({ isOpen, onClose, onSave }: AddPartnerModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        companyName: '',
        partnerType: 'agency',
        contactPerson: '',
        email: '',
        phone: '',
        website: '',
        city: '',
        commissionRate: ''
    })

    const handleClose = () => {
        setStep(1)
        onClose()
    }

    const handleSubmit = () => {
        if (onSave) {
            onSave(formData)
        }
        handleClose()
        setFormData({
            companyName: '',
            partnerType: 'agency',
            contactPerson: '',
            email: '',
            phone: '',
            website: '',
            city: '',
            commissionRate: ''
        })
    }

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company / Partner Name <span className="text-red-500">*</span></label>
                <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                        placeholder="e.g. Apex Realty Solutions"
                        value={formData.companyName}
                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                        autoFocus
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Partner Type</label>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'agency', icon: Building2, label: 'Agency' },
                        { id: 'individual', icon: User, label: 'Individual' },
                        { id: 'connector', icon: Users, label: 'Connector' }
                    ].map((type) => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, partnerType: type.id })}
                            className={cn(
                                "p-4 rounded-none border flex flex-col items-center justify-center gap-2 transition-all",
                                formData.partnerType === type.id
                                    ? 'border-primary-500 bg-primary-600 text-white shadow-md'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-500/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                            )}
                        >
                            <type.icon className={cn("w-5 h-5", formData.partnerType === type.id ? "text-white" : "text-slate-400")} />
                            <span className="text-xs font-bold uppercase tracking-wide">{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Website</label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            placeholder="www.example.com"
                            value={formData.website}
                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            placeholder="e.g. Mumbai"
                            value={formData.city}
                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">primary Contact Person <span className="text-red-500">*</span></label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                        placeholder="Full Name"
                        value={formData.contactPerson}
                        onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                        autoFocus
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="email"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            placeholder="email@company.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="tel"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Agreed Commission (%)</label>
                <input
                    type="number"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                    placeholder="e.g. 2.5"
                    value={formData.commissionRate}
                    onChange={e => setFormData({ ...formData, commissionRate: e.target.value })}
                />
                <p className="text-xs text-slate-500 mt-2">Standard commission rate for this partner.</p>
            </div>
        </div>
    )

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Partner"
            subtitle="Channel Management"
            steps={STEPS}
            currentStep={step}
            onStepClick={(id) => setStep(Number(id))}
            contentTitle={step === 1 ? 'Partner Details' : 'Contact & Terms'}
            showBackButton={step > 1}
            onBack={() => setStep(step - 1)}
            footer={
                <>
                    {step === 1 ? (
                        <Button variant="primary" className="rounded-none" onClick={() => setStep(2)} rightIcon={<ArrowRight className="w-4 h-4" />} disabled={!formData.companyName}>
                            Next Step
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="secondary" className="rounded-none" onClick={() => setStep(1)}>
                                Back
                            </Button>
                            <Button variant="primary" className="rounded-none" onClick={handleSubmit} leftIcon={<Check className="w-4 h-4" />}>
                                Send Invitation
                            </Button>
                        </div>
                    )}
                </>
            }
        >
            {step === 1 ? renderStep1() : renderStep2()}
        </WizardModal>
    )
}
