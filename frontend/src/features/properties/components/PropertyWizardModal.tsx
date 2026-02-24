
import { useState, useEffect } from 'react'
import {
    Home,
    MapPin,
    DollarSign,
    Ruler,
    Bed,
    Bath,
    FileText,
    ArrowRight,
    Save
} from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'

interface PropertyWizardModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: any // If present, we are editing
    onSave?: (data: any) => void
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Basics', description: 'Essential details.' },
    { id: 2, label: 'Additional', description: 'Optional info.' }
]

export default function PropertyWizardModal({ isOpen, onClose, initialData, onSave }: PropertyWizardModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<any>({
        name: '',
        price: '',
        location: '',
        type: 'apartment',
        bedrooms: '',
        bathrooms: '',
        area: '',
        description: '',
        ...initialData
    })

    useEffect(() => {
        if (isOpen) {
            setStep(1)
            setFormData({
                name: '',
                price: '',
                location: '',
                type: 'apartment',
                bedrooms: '',
                bathrooms: '',
                area: '',
                description: '',
                ...initialData
            })
        }
    }, [isOpen, initialData])

    const handleSave = () => {
        console.log('Saving Property:', formData)
        if (onSave) onSave(formData)
        onClose()
    }

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 mb-6">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-none">
                    <Home className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wide text-sm">
                        {initialData ? 'Edit Property' : 'New Property'}
                    </h4>
                    <p className="text-xs text-slate-500">Enter the primary details.</p>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Property Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Green Valley Apartments"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 font-medium"
                    autoFocus
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0.00"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-blue-500 transition-colors font-medium"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="City / Area"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-blue-500 transition-colors font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Property Type
                    </label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-blue-500 transition-colors font-medium"
                    >
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="plot">Plot</option>
                        <option value="commercial">Commercial</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Area (Sq.Ft)
                    </label>
                    <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="number"
                            value={formData.area}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            placeholder="Total Area"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-blue-500 transition-colors font-medium"
                        />
                    </div>
                </div>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 mb-6">
                <div className="p-3 bg-purple-500/10 text-purple-500 rounded-none">
                    <FileText className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wide text-sm">
                        Additional Details
                    </h4>
                    <p className="text-xs text-slate-500">Optional configuration info.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Bedrooms
                    </label>
                    <div className="relative">
                        <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={formData.bedrooms}
                            onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-purple-500 transition-colors font-medium"
                        >
                            <option value="">Select</option>
                            <option value="1">1 BHK</option>
                            <option value="2">2 BHK</option>
                            <option value="3">3 BHK</option>
                            <option value="4">4+ BHK</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Bathrooms
                    </label>
                    <div className="relative">
                        <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={formData.bathrooms}
                            onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-purple-500 transition-colors font-medium"
                        >
                            <option value="">Select</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4+</option>
                        </select>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Description / Notes
                </label>
                <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the property..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-purple-500 resize-none transition-colors placeholder:text-slate-400 font-medium"
                />
            </div>
        </div>
    )

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Property' : 'Add Property'}
            subtitle="Manage Listing"
            steps={STEPS}
            currentStep={step}
            contentTitle={step === 1 ? 'Primary Information' : 'Detailed Configuration'}
            showBackButton={step > 1}
            onBack={() => setStep(step - 1)}
            footer={
                <>
                    {step === 1 && (
                        <Button variant="primary" className="rounded-none w-full sm:w-auto" onClick={() => setStep(2)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                            Next Step
                        </Button>
                    )}
                    {step === 2 && (
                        <div className="flex w-full gap-2">
                            <Button variant="secondary" className="rounded-none flex-1" onClick={() => setStep(1)}>
                                Back
                            </Button>
                            <Button variant="primary" className="rounded-none flex-1" onClick={handleSave} rightIcon={<Save className="w-4 h-4" />}>
                                {initialData ? 'Save Changes' : 'Create Listing'}
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
