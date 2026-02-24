
import { useState, useRef } from 'react'
import { User, Award, MapPin, DollarSign, ArrowRight, Check, Upload, X, Plus } from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'
import { cn } from '@/utils'

interface AddMentorModalProps {
    isOpen: boolean
    onClose: () => void
    onSave?: (mentor: any) => void
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Profile & Bio', description: 'Basic info and photo.' },
    { id: 2, label: 'Expertise & Rate', description: 'Skills and compensation.' }
]

export function AddMentorModal({ isOpen, onClose, onSave }: AddMentorModalProps) {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        city: '',
        bio: '',
        expertise: ['Home Loans', 'Investment'] as string[],
        domains: [] as string[],
        hourlyRate: '',
        experience: '',
        image: null as string | null
    })

    const [newDomain, setNewDomain] = useState('')

    const handleClose = () => {
        setStep(1)
        onClose()
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
        if (onSave) onSave(formData)
        handleClose()
        // Reset form
        setFormData({
            name: '',
            email: '',
            city: '',
            bio: '',
            expertise: [],
            domains: [],
            hourlyRate: '',
            experience: '',
            image: null
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string })
            }
            reader.readAsDataURL(file)
        }
    }

    const addDomain = () => {
        if (newDomain && !formData.expertise.includes(newDomain)) {
            setFormData({ ...formData, expertise: [...formData.expertise, newDomain] })
            setNewDomain('')
        }
    }

    const removeDomain = (domain: string) => {
        setFormData({ ...formData, expertise: formData.expertise.filter(d => d !== domain) })
    }

    const renderStep1 = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="space-y-6">

                {/* Image Upload */}
                <div className="flex justify-center mb-6">
                    <div
                        className="relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className={cn(
                            "w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all",
                            formData.image ? "border-primary-500" : "border-slate-300 dark:border-slate-700 hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}>
                            {formData.image ? (
                                <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-2">
                                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1 group-hover:text-primary-500" />
                                    <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-primary-500">Upload Photo</span>
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-primary-600 rounded-full p-1.5 text-white shadow-sm group-hover:scale-110 transition-transform">
                            <Plus className="w-3 h-3" />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                required
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium transition-all"
                                placeholder="e.g. Dr. Rajesh Sharma"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                autoFocus={step === 1}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                required
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium transition-all"
                                placeholder="e.g. Mumbai"
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Details / Bio</label>
                    <textarea
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium min-h-[120px] resize-none transition-all"
                        placeholder="Detailed professional summary, experience highlights, and key achievements..."
                        value={formData.bio}
                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    />
                    <p className="text-xs text-slate-400 mt-2 text-right">{formData.bio.length}/500 chars</p>
                </div>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6 animate-fade-in">

            {/* Multi-Domain Selection */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Expertise & Domains</label>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 text-sm font-medium"
                        placeholder="Add multiple domains (e.g. Tax Planning)"
                        value={newDomain}
                        onChange={e => setNewDomain(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addDomain())}
                    />
                    <Button onClick={addDomain} variant="secondary" className="rounded-none px-4" disabled={!newDomain}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-dashed border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 rounded-none">
                    {formData.expertise.length === 0 && (
                        <span className="text-sm text-slate-400 italic px-2 self-center">No domains added yet.</span>
                    )}
                    {formData.expertise.map(exp => (
                        <div
                            key={exp}
                            className="group flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-none text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200"
                        >
                            {exp}
                            <button
                                onClick={() => removeDomain(exp)}
                                className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-6" />

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hourly Rate (₹) <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            required
                            type="number"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium transition-all"
                            placeholder="2000"
                            value={formData.hourlyRate}
                            onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })}
                            autoFocus={step === 2}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experience (Years) <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            required
                            type="number"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium transition-all"
                            placeholder="10"
                            value={formData.experience}
                            onChange={e => setFormData({ ...formData, experience: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Mentor"
            subtitle="Directory Management"
            steps={STEPS}
            currentStep={step}
            onStepClick={(id) => setStep(Number(id))}
            contentTitle={step === 1 ? 'Profile Details' : 'Professional Expertise'}
            showBackButton={step > 1}
            onBack={() => setStep(step - 1)}
            footer={
                <>
                    {step === 1 ? (
                        <Button variant="primary" className="rounded-none px-8" onClick={() => setStep(2)} rightIcon={<ArrowRight className="w-4 h-4" />} disabled={!formData.name || !formData.city}>
                            Next Step
                        </Button>
                    ) : (
                        <div className="flex gap-3">
                            <Button variant="secondary" className="rounded-none px-6" onClick={() => setStep(1)}>
                                Back
                            </Button>
                            <Button variant="primary" className="rounded-none px-8" isLoading={isLoading} onClick={handleSubmit} leftIcon={<Check className="w-4 h-4" />}>
                                Save Mentor
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
