import { useState } from 'react'
import { MapPin, Bed, Bath, Ruler, Home, Upload, ArrowRight, Check } from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'
import { PropertyType } from '../data/dummyProperties'
import { cn } from '@/utils'

interface AddPropertyModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (property: any) => void
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Basic Info', description: 'Title, type and location.' },
    { id: 2, label: 'Details & Media', description: 'Specs, pricing and images.' }
]

export function AddPropertyModal({ isOpen, onClose, onSave }: AddPropertyModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        title: '',
        type: 'apartment' as PropertyType,
        location: '',
        price: '',
        size: '',
        bedrooms: '',
        bathrooms: '',
        status: 'available'
    })

    const handleClose = () => {
        setStep(1)
        onClose()
    }

    const handleSubmit = () => {
        onSave({
            ...formData,
            id: `new_${Date.now()}`,
            price: Number(formData.price),
            size: Number(formData.size),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', // Placeholder
            agent: 'Current User',
            listedDate: new Date().toISOString().split('T')[0]
        })
        handleClose()
        setFormData({
            title: '',
            type: 'apartment' as PropertyType,
            location: '',
            price: '',
            size: '',
            bedrooms: '',
            bathrooms: '',
            status: 'available'
        })
    }

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Property Title <span className="text-red-500">*</span></label>
                <input
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                    placeholder="e.g. Green Valley Apartments"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    autoFocus
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Property Type</label>
                <div className="grid grid-cols-3 gap-3">
                    {['apartment', 'villa', 'plot', 'commercial', 'studio'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, type: type as PropertyType })}
                            className={cn(
                                "p-4 rounded-none border flex flex-col items-center justify-center gap-2 transition-all capitalize",
                                formData.type === type
                                    ? 'border-primary-500 bg-primary-600 text-white shadow-md'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-500/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                            )}
                        >
                            <Home className={cn("w-5 h-5", formData.type === type ? "text-white" : "text-slate-400")} />
                            <span className="text-xs font-bold uppercase tracking-wide">{type}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location <span className="text-red-500">*</span></label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        required
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                        placeholder="e.g. Whitefield, Bangalore"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                </div>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price (₹) <span className="text-red-500">*</span></label>
                    <input
                        required
                        type="number"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                        placeholder="4500000"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Area (sq.ft)</label>
                    <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            required
                            type="number"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            placeholder="1200"
                            value={formData.size}
                            onChange={e => setFormData({ ...formData, size: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {formData.type !== 'plot' && formData.type !== 'commercial' && (
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bedrooms</label>
                        <div className="relative">
                            <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                                placeholder="2"
                                value={formData.bedrooms}
                                onChange={e => setFormData({ ...formData, bedrooms: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bathrooms</label>
                        <div className="relative">
                            <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                                placeholder="2"
                                value={formData.bathrooms}
                                onChange={e => setFormData({ ...formData, bathrooms: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Property Image</label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-none p-8 text-center hover:border-primary-500 hover:bg-primary-50/10 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-none bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-600 transition-colors">
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-white" />
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Click to upload property image</p>
                    <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>
            </div>
        </div>
    )

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Property"
            subtitle="Inventory Management"
            steps={STEPS}
            currentStep={step}
            onStepClick={(id) => setStep(Number(id))}
            contentTitle={step === 1 ? 'Basic Property Information' : 'Specifications & Media'}
            showBackButton={step > 1}
            onBack={() => setStep(step - 1)}
            footer={
                <>
                    {step === 1 ? (
                        <Button variant="primary" className="rounded-none" onClick={() => setStep(2)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                            Next Step
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="secondary" className="rounded-none" onClick={() => setStep(1)}>
                                Back
                            </Button>
                            <Button variant="primary" className="rounded-none" onClick={handleSubmit} leftIcon={<Check className="w-4 h-4" />}>
                                Save Property
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
