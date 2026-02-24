import { useState, useEffect } from 'react'
import { Phone, MapPin } from 'lucide-react'
import { Button, WizardModal } from '@/components/ui'
import { cn } from '@/utils'

interface EditPartnerModalProps {
    partner: any
    isOpen: boolean
    onClose: () => void
    onSave: (updatedPartner: any) => void
}

export function EditPartnerModal({ partner, isOpen, onClose, onSave }: EditPartnerModalProps) {
    const [formData, setFormData] = useState<any>(null)
    const [step, setStep] = useState(1)

    useEffect(() => {
        if (partner) {
            setFormData({ ...partner })
        }
    }, [partner])

    const handleSave = () => {
        onSave(formData)
        onClose()
        setStep(1)
    }

    if (!formData) return null

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Partner"
            subtitle={formData.id}
            sidebarWidth="w-[300px]"
            currentStep={step}
            onStepClick={(id) => setStep(Number(id))}
            steps={[
                { id: 1, label: 'Company Details', description: 'Name & Location' },
                { id: 2, label: 'Contact Info', description: 'Person & Details' },
                { id: 3, label: 'Status', description: 'Account State' }
            ]}
            contentTitle={
                step === 1 ? 'Company Details' :
                    step === 2 ? 'Contact Information' : 'Account Status'
            }
            footer={
                <div className="flex justify-between w-full">
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        {step > 1 && (
                            <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {step < 3 ? (
                            <Button variant="primary" onClick={() => setStep(step + 1)}>Next</Button>
                        ) : (
                            <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                        )}
                    </div>
                </div>
            }
        >
            <div className="space-y-6 animate-fade-in pb-2">
                {/* Header Stats - Always Visible */}
                <div className="flex flex-wrap gap-3 pb-6 border-b border-slate-100 dark:border-white/5">
                    <div className={cn('px-3 py-1 rounded-sm text-sm font-bold flex items-center gap-2 uppercase tracking-wide',
                        formData.status === 'active' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                            "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                    )}>
                        <div className={cn("w-2 h-2 rounded-full", formData.status === 'active' ? "bg-emerald-500" : "bg-slate-500")} />
                        {formData.status}
                    </div>
                </div>

                <div className="min-h-[300px]">
                    {step === 1 && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border border-slate-200 dark:border-white/10 rounded-sm space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border border-slate-200 dark:border-white/10 rounded-sm space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Person</label>
                                <input
                                    type="text"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm"
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="tel"
                                            className="w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border border-slate-200 dark:border-white/10 rounded-sm space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Account Status</label>
                                <select
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <p className="text-xs text-slate-500 mt-2">
                                    Changing status to Inactive will disable partner access immediately.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </WizardModal>
    )
}
