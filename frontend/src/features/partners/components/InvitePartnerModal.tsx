import { useState } from 'react'
import { Building2, Phone, MapPin, ArrowRight, Check, Mail, Globe, User, Award, Calendar, FileText, Briefcase } from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'

interface InvitePartnerModalProps {
    isOpen: boolean
    onClose: () => void
    onInvite?: (data: any) => void
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Organization', description: 'Corporate details.' },
    { id: 2, label: 'Key Contact', description: 'Primary stakeholder.' },
    { id: 3, label: 'Profile', description: 'Recognition & about.' }
]

export function InvitePartnerModal({ isOpen, onClose, onInvite }: InvitePartnerModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        // Org Details
        companyName: '',
        hqLocation: '',
        foundedYear: '',
        registrationNumber: '',
        website: '',

        // Contact Details
        contactName: '',
        contactDesignation: '',
        contactEmail: '',
        contactPhone: '',

        // Profile
        recognition: '',
        about: ''
    })

    const handleClose = () => {
        setStep(1)
        onClose()
    }

    const handleSubmit = () => {
        if (onInvite) {
            onInvite(formData)
        }
        handleClose()
        // Reset form
        setFormData({
            companyName: '',
            hqLocation: '',
            foundedYear: '',
            registrationNumber: '',
            website: '',
            contactName: '',
            contactDesignation: '',
            contactEmail: '',
            contactPhone: '',
            recognition: '',
            about: ''
        })
    }

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Organization Name <span className="text-red-500">*</span></label>
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

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Registration No.</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            placeholder="CIN / LLPIN"
                            value={formData.registrationNumber}
                            onChange={e => setFormData({ ...formData, registrationNumber: e.target.value })}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Founded Year</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="number"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            placeholder="YYYY"
                            value={formData.foundedYear}
                            onChange={e => setFormData({ ...formData, foundedYear: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">HQ Location <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            placeholder="City, Country"
                            value={formData.hqLocation}
                            onChange={e => setFormData({ ...formData, hqLocation: e.target.value })}
                        />
                    </div>
                </div>
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
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                        placeholder="Key Stakeholder Name"
                        value={formData.contactName}
                        onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                        autoFocus
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Designation</label>
                <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                        placeholder="e.g. Director / CEO"
                        value={formData.contactDesignation}
                        onChange={e => setFormData({ ...formData, contactDesignation: e.target.value })}
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
                            value={formData.contactEmail}
                            onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Direct Line <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="tel"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            placeholder="+91..."
                            value={formData.contactPhone}
                            onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Awards & Recognition</label>
                <div className="relative">
                    <Award className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <textarea
                        className="w-full pl-10 pr-4 py-3 h-24 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium resize-none"
                        placeholder="List any notable awards or accreditations..."
                        value={formData.recognition}
                        onChange={e => setFormData({ ...formData, recognition: e.target.value })}
                        autoFocus
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Marketer's Note (About)</label>
                <textarea
                    className="w-full px-4 py-3 h-32 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium resize-none"
                    placeholder="Brief description of the partner's business and strengths..."
                    value={formData.about}
                    onChange={e => setFormData({ ...formData, about: e.target.value })}
                />
            </div>
        </div>
    )

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Invite Partner"
            subtitle="Send onboarding invitation"
            steps={STEPS}
            currentStep={step}
            onStepClick={(id) => setStep(Number(id))}
            contentTitle={STEPS[step - 1].label}
            showBackButton={step > 1}
            onBack={() => setStep(step - 1)}
            footer={
                <>
                    {step < 3 ? (
                        <div className="flex gap-2 w-full justify-end">
                            {step > 1 && (
                                <Button variant="secondary" className="rounded-none gap-2" onClick={() => setStep(step - 1)}>
                                    Back
                                </Button>
                            )}
                            <Button
                                variant="primary"
                                className="rounded-none gap-2"
                                onClick={() => setStep(step + 1)}
                                disabled={
                                    (step === 1 && (!formData.companyName || !formData.hqLocation)) ||
                                    (step === 2 && (!formData.contactName || !formData.contactEmail || !formData.contactPhone))
                                }
                            >
                                Next Step <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="secondary" className="rounded-none" onClick={() => setStep(step - 1)}>
                                Back
                            </Button>
                            <Button variant="primary" className="rounded-none" onClick={handleSubmit} leftIcon={<Check className="w-4 h-4" />}>
                                Send Invite
                            </Button>
                        </div>
                    )}
                </>
            }
        >
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </WizardModal>
    )
}
