
import { useState, useEffect } from 'react'
import {
    Plus,
    FileText,
    Users,
    CheckCircle2,
    Save,
    ArrowRight
} from 'lucide-react'
import { Button, WizardModal } from '@/components/ui'
import { cn } from '@/utils'

interface TabItemWizardProps {
    isOpen: boolean
    onClose: () => void
    tabType: string // 'amenities', 'leads', 'documents', etc.
    onSave?: (data: any) => void
}

export default function TabItemWizard({ isOpen, onClose, tabType, onSave }: TabItemWizardProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<any>({})

    const getWizardConfig = () => {
        switch (tabType) {
            case 'amenities':
                return {
                    title: 'Add New Amenity',
                    icon: CheckCircle2,
                    color: 'text-emerald-500',
                    bgColor: 'bg-emerald-500/10',
                    steps: [{ id: 1, label: 'Details', description: 'Amenity info' }]
                }
            case 'leads':
                return {
                    title: 'Add New Lead',
                    icon: Users,
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-500/10',
                    steps: [
                        { id: 1, label: 'Basic', description: 'Contact info' },
                        { id: 2, label: 'Status', description: 'Relationship' }
                    ]
                }
            case 'documents':
                return {
                    title: 'Upload Document',
                    icon: FileText,
                    color: 'text-red-500',
                    bgColor: 'bg-red-500/10',
                    steps: [{ id: 1, label: 'Upload', description: 'File details' }]
                }
            default:
                return {
                    title: 'Add Item',
                    icon: Plus,
                    color: 'text-slate-500',
                    bgColor: 'bg-slate-500/10',
                    steps: [{ id: 1, label: 'Details', description: 'Item info' }]
                }
        }
    }

    const config = getWizardConfig()

    useEffect(() => {
        if (isOpen) {
            setStep(1)
            setFormData({})
        }
    }, [isOpen, tabType])

    const handleSave = () => {
        console.log(`Saving ${tabType} item:`, formData)
        window.alert(`${config.title} Saved!`)
        if (onSave) onSave(formData)
        onClose()
    }

    const renderContent = () => {
        if (tabType === 'amenities') {
            return (
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amenity Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Swimming Pool, Gym"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-emerald-500 transition-colors font-medium"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>
            )
        }

        if (tabType === 'leads') {
            if (step === 1) {
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Lead Name</label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-blue-500 transition-colors font-medium"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                            <input
                                type="text"
                                placeholder="+91 ..."
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-blue-500 transition-colors font-medium"
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                            <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-blue-500 transition-colors font-medium"
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="interested">Interested</option>
                                <option value="site_visit">Site Visit Scheduled</option>
                                <option value="negotiating">Negotiating</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</label>
                            <textarea
                                rows={3}
                                placeholder="Any additional notes..."
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-blue-500 transition-colors font-medium resize-none"
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>
                )
            }
        }

        if (tabType === 'documents') {
            return (
                <div className="space-y-6">
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Click or Drag to Upload</p>
                        <p className="text-xs text-slate-500 mt-1">PDF, DOC, JPG (Max 10MB)</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Document Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Brochure"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-red-500 transition-colors font-medium"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>
            )
        }

        return <div className="p-4 text-center text-slate-500">Form for {tabType} (Under Construction)</div>
    }

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title={config.title}
            subtitle={`Add to ${tabType}`}
            steps={config.steps}
            currentStep={step}
            contentTitle="Item Details"
            showBackButton={step > 1}
            onBack={() => setStep(step - 1)}
            footer={
                <>
                    {(config.steps.length > 1 && step < config.steps.length) ? (
                        <Button variant="primary" className="rounded-none w-full sm:w-auto" onClick={() => setStep(step + 1)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                            Next Step
                        </Button>
                    ) : (
                        <div className="flex w-full gap-2">
                            <Button variant="primary" className="rounded-none flex-1" onClick={handleSave} rightIcon={<Save className="w-4 h-4" />}>
                                Save Item
                            </Button>
                        </div>
                    )}
                </>
            }
        >
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 mb-6">
                <div className={cn("p-3 rounded-none", config.bgColor, config.color)}>
                    <config.icon className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wide text-sm">
                        {config.title}
                    </h4>
                    <p className="text-xs text-slate-500">enter details below.</p>
                </div>
            </div>
            {renderContent()}
        </WizardModal>
    )
}
