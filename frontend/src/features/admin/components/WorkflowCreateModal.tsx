
import { useState } from 'react'
import {
    Zap,
    Mail,
    MessageSquare,
    Clock,
    UserPlus,
    FileText,
    ArrowRight,
    CheckCircle2,
    Save
} from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'
import { cn } from '@/utils'

interface WorkflowCreateModalProps {
    isOpen: boolean
    onClose: () => void
    onCreate?: (workflow: any) => void
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Trigger', description: 'When to start' },
    { id: 2, label: 'Actions', description: 'What to do' },
    { id: 3, label: 'Review', description: 'Confirm setup' }
]

export default function WorkflowCreateModal({ isOpen, onClose, onCreate }: WorkflowCreateModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<any>({
        name: '',
        trigger: 'new_lead',
        actions: []
    })

    const triggers = [
        { id: 'new_lead', label: 'New Lead Created', icon: UserPlus, description: 'When a new lead enters the system', color: 'bg-blue-500' },
        { id: 'status_change', label: 'Status Changed', icon: Zap, description: 'When a record status is updated', color: 'bg-amber-500' },
        { id: 'scheduled_time', label: 'Scheduled Time', icon: Clock, description: 'At a specific date and time', color: 'bg-purple-500' },
        { id: 'form_submission', label: 'Form Submitted', icon: FileText, description: 'When a web form is submitted', color: 'bg-emerald-500' },
    ]

    const availableActions = [
        { id: 'send_email', label: 'Send Email', icon: Mail },
        { id: 'send_whatsapp', label: 'Send WhatsApp', icon: MessageSquare },
        { id: 'create_task', label: 'Create Task', icon: CheckCircle2 },
        { id: 'update_record', label: 'Update Record', icon: FileText },
    ]

    const handleActionToggle = (actionId: string) => {
        const currentActions = formData.actions || []
        if (currentActions.includes(actionId)) {
            setFormData({ ...formData, actions: currentActions.filter((a: string) => a !== actionId) })
        } else {
            setFormData({ ...formData, actions: [...currentActions, actionId] })
        }
    }

    const handleSave = () => {
        if (onCreate) onCreate(formData)
        // Reset and close
        setStep(1)
        setFormData({ name: '', trigger: 'new_lead', actions: [] })
        onClose()
    }

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Workflow Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Lead Nurture Sequence"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 transition-colors placeholder:text-slate-400 font-medium"
                    autoFocus
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Select Trigger
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {triggers.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setFormData({ ...formData, trigger: t.id })}
                            className={cn(
                                "flex items-start gap-3 p-4 text-left border rounded-none transition-all",
                                formData.trigger === t.id
                                    ? "bg-primary-50 dark:bg-primary-900/20 border-primary-500 ring-1 ring-primary-500"
                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                            )}
                        >
                            <div className={cn("p-2 rounded-none text-white", t.color)}>
                                <t.icon className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{t.label}</p>
                                <p className="text-xs text-slate-500 mt-1">{t.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-none mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Selected Trigger:</span>
                <div className="flex items-center gap-2 mt-1">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {triggers.find(t => t.id === formData.trigger)?.label}
                    </span>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Add Actions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableActions.map((a) => (
                        <button
                            key={a.id}
                            onClick={() => handleActionToggle(a.id)}
                            className={cn(
                                "flex items-center gap-3 p-4 text-left border rounded-none transition-all",
                                (formData.actions || []).includes(a.id)
                                    ? "bg-primary-50 dark:bg-primary-900/20 border-primary-500 ring-1 ring-primary-500"
                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                            )}
                        >
                            <div className={cn("p-2 rounded-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400")}>
                                <a.icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{a.label}</span>
                            {(formData.actions || []).includes(a.id) && (
                                <CheckCircle2 className="w-4 h-4 text-primary-600 ml-auto" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center rounded-full mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ready to Create Workflow?</h3>
            <p className="text-slate-500 max-w-xs mx-auto">
                You are about to create the <strong>"{formData.name}"</strong> workflow with {formData.actions?.length} actions.
            </p>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-none text-left max-w-sm mx-auto mt-4 space-y-2">
                <div className="flex justify-between">
                    <span className="text-xs text-slate-500 uppercase">Trigger</span>
                    <span className="text-xs font-bold">{triggers.find(t => t.id === formData.trigger)?.label}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-xs text-slate-500 uppercase">Actions</span>
                    <span className="text-xs font-bold">{formData.actions?.length} Selected</span>
                </div>
            </div>
        </div>
    )

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Workflow"
            subtitle="Automation Builder"
            steps={STEPS}
            currentStep={step}
            contentTitle={step === 1 ? 'Configure Trigger' : step === 2 ? 'Select Actions' : 'Review Workflow'}
            showBackButton={step > 1}
            onBack={() => setStep(step - 1)}
            footer={
                <>
                    {step < 3 ? (
                        <Button variant="primary" className="rounded-none sm:w-auto w-full" onClick={() => setStep(step + 1)} disabled={step === 1 && !formData.name} rightIcon={<ArrowRight className="w-4 h-4" />}>
                            Next Step
                        </Button>
                    ) : (
                        <div className="flex w-full gap-2">
                            <Button variant="secondary" className="rounded-none flex-1" onClick={() => setStep(2)}>
                                Back
                            </Button>
                            <Button variant="primary" className="rounded-none flex-1" onClick={handleSave} rightIcon={<Save className="w-4 h-4" />}>
                                Create Workflow
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
