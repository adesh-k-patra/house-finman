
import { useState } from 'react'
import { Building2, User, Phone, Mail, MapPin, ArrowRight, Check } from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'

interface AddVendorModalProps {
    isOpen: boolean
    onClose: () => void
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Company Profile', description: 'Business details.' },
    { id: 2, label: 'Contact Info', description: 'Address and point of contact.' }
]

export function AddVendorModal({ isOpen, onClose }: AddVendorModalProps) {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        companyName: '',
        category: 'legal',
        contactPerson: '',
        designation: '',
        email: '',
        phone: '',
        address: ''
    })

    const handleClose = () => {
        setStep(1)
        onClose()
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsLoading(false)
        handleClose()
    }

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            required
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            placeholder="e.g. Legal Associates LLP"
                            value={formData.companyName}
                            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                            autoFocus={step === 1}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                    <div className="relative">
                        <select
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium appearance-none"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="legal">Legal</option>
                            <option value="technical">Technical</option>
                            <option value="valuation">Valuation</option>
                            <option value="insurance">Insurance</option>
                            <option value="other">Other</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            required
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            placeholder="e.g. John Doe"
                            value={formData.contactPerson}
                            onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                            autoFocus={step === 2}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Designation</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                        placeholder="e.g. Partner"
                        value={formData.designation}
                        onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            required
                            type="email"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            required
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
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Address</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <textarea
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium min-h-[80px] resize-none"
                        placeholder="Full office address..."
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Vendor"
            subtitle="Procurement"
            steps={STEPS}
            currentStep={step}
            onStepClick={(id) => setStep(Number(id))}
            contentTitle={step === 1 ? 'Vendor Information' : 'Contact Details'}
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
                            <Button variant="primary" className="rounded-none" isLoading={isLoading} onClick={handleSubmit} leftIcon={<Check className="w-4 h-4" />}>
                                Add Vendor
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
