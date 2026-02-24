
import { useState } from 'react'
import {
    Users,
    Target,
    CheckSquare,
    Ticket,
    ArrowRight,
    Building,
    FileText,
    ClipboardCheck
} from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils'

interface QuickCreateModalProps {
    isOpen: boolean
    onClose: () => void
}

type CreateType = 'lead' | 'opportunity' | 'task' | 'ticket' | 'property' | 'partner' | 'survey'

const STEPS: WizardStep[] = [
    { id: 1, label: 'Select Type', description: 'Choose record type.' },
    { id: 2, label: 'Details', description: 'Enter information.' }
]

export default function QuickCreateModal({ isOpen, onClose }: QuickCreateModalProps) {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [selectedType, setSelectedType] = useState<CreateType | null>(null)

    // Type Selection Options
    const types = [
        { id: 'lead', label: 'Lead', icon: Users, description: 'Add a new potential customer', color: 'bg-blue-600' },
        { id: 'opportunity', label: 'Opportunity', icon: Target, description: 'Create a new sales deal', color: 'bg-emerald-600' },
        { id: 'task', label: 'Task', icon: CheckSquare, description: 'Schedule a to-do item', color: 'bg-amber-600' },
        { id: 'ticket', label: 'Support Ticket', icon: Ticket, description: 'Log a customer issue', color: 'bg-purple-600' },
        { id: 'survey', label: 'Survey', icon: ClipboardCheck, description: 'Create and send a new survey', color: 'bg-teal-600' },
        { id: 'property', label: 'Property', icon: Building, description: 'List a new property', color: 'bg-indigo-600' },
        { id: 'partner', label: 'Partner', icon: FileText, description: 'Onboard a new partner', color: 'bg-pink-600' },
    ]

    const handleTypeSelect = (type: string) => {
        setSelectedType(type as CreateType)
        setStep(2)
    }

    const handleClose = () => {
        setStep(1)
        setSelectedType(null)
        onClose()
    }

    const handleCreate = () => {
        if (!selectedType) return

        switch (selectedType) {
            case 'lead':
                navigate('/leads?action=new') // Query param to trigger modal on page load if we wanted
                break
            case 'survey':
                navigate('/surveys/create')
                break
            case 'property':
                navigate('/properties?action=new')
                break
            // ... handle others
        }

        handleClose()
        console.log(`Creating ${selectedType}...`)
    }

    // --- Step 1 Content: Selection Grid ---
    const renderTypeSelection = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700">
            {types.map((type) => (
                <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className={cn(
                        "flex items-start gap-4 p-5 text-left transition-all duration-200 group bg-white dark:bg-slate-900",
                        "hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-0 focus:bg-slate-50 dark:focus:bg-slate-800"
                    )}
                >
                    <div className={cn(
                        "p-3 rounded-none text-white shadow-sm transition-transform group-hover:scale-110",
                        type.color
                    )}>
                        <type.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold uppercase tracking-wide text-sm text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
                            {type.label}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {type.description}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    )

    // --- Step 2 Content: Details Form (Placeholder for now) ---
    const renderDetailsForm = () => {
        if (!selectedType) return null

        const typeLabel = types.find(t => t.id === selectedType)?.label

        return (
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Title / Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder={`Enter ${typeLabel?.toLowerCase()} name`}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 transition-colors placeholder:text-slate-400 font-medium"
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Status
                        </label>
                        <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 transition-colors font-medium">
                            <option>New</option>
                            <option>In Progress</option>
                            <option>Qualified</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Priority
                        </label>
                        <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 transition-colors font-medium">
                            <option>Medium</option>
                            <option>High</option>
                            <option>Low</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Description
                    </label>
                    <textarea
                        rows={4}
                        placeholder="Add some details..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 resize-none transition-colors placeholder:text-slate-400 font-medium"
                    />
                </div>
            </div>
        )
    }

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Quick Create"
            subtitle="Global Actions"
            steps={STEPS}
            currentStep={step}
            contentTitle={step === 1 ? 'What would you like to create?' : `New ${types.find(t => t.id === selectedType)?.label} Details`}
            showBackButton={step > 1}
            onBack={() => setStep(1)}
            footer={
                step === 2 && (
                    <>
                        <Button variant="secondary" className="rounded-none mr-2" onClick={() => setStep(1)}>
                            Back
                        </Button>
                        <Button variant="primary" className="rounded-none" onClick={handleCreate} rightIcon={<ArrowRight className="w-4 h-4" />}>
                            Create {types.find(t => t.id === selectedType)?.label}
                        </Button>
                    </>
                )
            }
        >
            {step === 1 ? renderTypeSelection() : renderDetailsForm()}
        </WizardModal>
    )
}
